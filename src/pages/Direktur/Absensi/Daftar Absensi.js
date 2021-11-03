import React, {useEffect, useState} from 'react'
import { Row, Col, Card, Button, Container} from 'react-bootstrap';
import { gql, useLazyQuery, useQuery} from '@apollo/client';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import ReactPaginate from 'react-paginate';
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import dayjs from 'dayjs'

const getAbsensi = gql`
    query getAbsensi(
        $page: Int 
        $limit: Int 
        $tglAwal: MyDate
        $tglAkhir: MyDate
    ){
        getAbsensi(
            page: $page 
            limit: $limit
            tglAwal: $tglAwal
            tglAkhir: $tglAkhir
        ){
            count rows{
                namaKaryawan tanggal scanMasuk scanPulang terlambat jamBolos absen lembur jamKerja{
                    namaShift jamMasuk jamKeluar
                }
            }
        }
    }
`;

export default function DaftarAbsensi(props) {
    const [pageNumber, setPageNumber] = useState(0);
    const [limit, setLimit] = useState(5);
    const [selectedDateAwal, setSelectedDateAwal] = useState(null);
    const [selectedDateAkhir, setSelectedDateAkhir] = useState(null);
    const [getAbsensiKu, { loading, data }] = useLazyQuery(getAbsensi);

    const changePage = ({ selected }) => {
        setPageNumber(selected)
    }

    let dataKu= [];
    let counter = false;
    let pageKu = [];
    let counterPage = false;
    if(data){
        console.log(data);
    }
    if(data === undefined || loading){
        pageKu.push(<p key={0}>Loading...</p>)
    }else if(data.getAbsensi.count && !counterPage){
      var jml = Math.ceil(data.getAbsensi.count / limit);
      pageKu.push(
        <ReactPaginate
          key={1}
          previousLabel={'previous'}
          nextLabel={'next'}
          breakLabel={'...'}
          breakClassName={'break-me'}
          pageCount={jml}
          forcePage={pageNumber}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={(selected) => changePage(selected)}
          containerClassName={"paginationBttns"}
          previousLinkClassName={"previousBttn"}
          nextLinkClassName={"nextBttn"}
          disabledClassName={"paginationDisabled"}
          activeClassName={"paginationActive"}
        />
      )
      counterPage = true;
    }
    if(data === undefined || loading){
        dataKu.push(<p key={0} className="badgeStatusWaitingText">Loading...</p>)
    }else if(data.getAbsensi.rows.length === 0){
        dataKu.push(<p key={1} className="badgeStatusNonText">Tidak Ada Data Absensi</p>)
    }else if(data.getAbsensi.rows.length > 0 && !counter){
        dataKu.push(
            <TableContainer component={Paper} key={0}>
                <Table className="tableKu" aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Nama Karyawan</TableCell>
                            <TableCell align="right">Tanggal</TableCell>
                            <TableCell align="right">Shift</TableCell>
                            <TableCell align="right">Jam Masuk</TableCell>
                            <TableCell align="right">Jam Keluar</TableCell>
                            <TableCell align="right">Scan Masuk</TableCell>
                            <TableCell align="right">Scan Pulang</TableCell>
                            <TableCell align="right">Terlambat</TableCell>
                            <TableCell align="right">Pulang Cepat</TableCell>
                            <TableCell align="right">Absen</TableCell>
                            <TableCell align="right">Lembur</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            data.getAbsensi.rows.map((laporan,index) =>(
                                <TableRow key={index}>
                                    <TableCell component="th" scope="row">
                                        {laporan.namaKaryawan}
                                    </TableCell>
                                    <TableCell align="right">{dayjs(laporan.tanggal).format('DD-MM-YYYY')}</TableCell>
                                    <TableCell align="right">{laporan.jamKerja.namaShift}</TableCell>
                                    <TableCell align="right">{laporan.jamKerja.jamMasuk}</TableCell>
                                    <TableCell align="right">{laporan.jamKerja.jamKeluar}</TableCell>
                                    <TableCell align="right">{laporan.scanMasuk}</TableCell>
                                    <TableCell align="right">{laporan.scanPulang}</TableCell>
                                    <TableCell align="right">{laporan.terlambat}</TableCell>
                                    <TableCell align="right">{laporan.jamBolos}</TableCell>
                                    <TableCell align="right">{laporan.absen === true? <div className="badgeStatusNon">Bolos</div>: ""}</TableCell>
                                    <TableCell align="right">{laporan.lembur}</TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        )
        counter = true;
    }
    useEffect(() => {
        getAbsensiKu({
            variables: {
                page: pageNumber,
                limit: limit,
                tglAwal: selectedDateAwal,
                tglAkhir: selectedDateAkhir,
            }
        })
    }, [pageNumber])
    return (
        <Container className="containerKu">
            <Row className="bg-white p-0 justify-content-center">
                <Col>
                    <h1 className="text-center">Daftar Absensi</h1>
                </Col>
            </Row>
            <Row className="justify-content-left">
                <Col className="col-md-4">
                    <p>Tanggal Awal:</p>
                    <DatePicker
                        selected={selectedDateAwal}
                        onChange={date => setSelectedDateAwal(date)}
                        dateFormat='dd-MM-yyyy'
                        maxDate={new Date()}
                        showYearDropdown
                        scrollableMonthYearDropdown
                    />
                    <p>Tanggal Akhir:</p>
                    <DatePicker
                        selected={selectedDateAkhir}
                        onChange={date => setSelectedDateAkhir(date)}
                        dateFormat='dd-MM-yyyy'
                        maxDate={new Date()}
                        showYearDropdown
                        scrollableMonthYearDropdown
                    />
                </Col>
            </Row>
            <Row style={{marginTop: 10, marginBottom: 10}}>
                <Col>
                    <Button variant="success" type="submit" onClick={() => getAbsensiKu({
                        variables: {
                            page: 0,
                            limit: limit,
                            tglAwal: selectedDateAwal,
                            tglAkhir: selectedDateAkhir,
                        }
                    })}>
                        Cari
                    </Button>
                </Col>
            </Row>
            <Row>
                <Col>
                    {dataKu}
                    <div className="pageContainerKu">
                        {pageKu}
                    </div>
                </Col>
            </Row>
        </Container>
    )
}