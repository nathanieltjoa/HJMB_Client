import React, {useEffect, useState} from 'react'
import { Row, Col, Form, Card, Button, Container} from 'react-bootstrap';
import { gql, useLazyQuery, useQuery} from '@apollo/client';
import { makeStyles } from '@material-ui/core/styles';
/*import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';*/
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
        $nama: String 
    ){
        getAbsensi(
            page: $page 
            limit: $limit
            tglAwal: $tglAwal
            tglAkhir: $tglAkhir
            nama: $nama
        ){
            count rows{
                karyawan{nama} tanggal scanMasuk scanPulang terlambat jamBolos absen lembur jamKerja{
                    namaShift jamMasuk jamKeluar
                }
            }
        }
    }
`;

export default function DaftarAbsensi(props) {
    const [pageNumber, setPageNumber] = useState(0);
    const [limit, setLimit] = useState(10);
    const [nama, setNama] = useState("");
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
        pageKu.push(<p key={0}>Memuat...</p>)
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
        dataKu.push(<p key={0} className="badgeStatusWaitingText">Memuat...</p>)
    }else if(data.getAbsensi.rows.length === 0){
        dataKu.push(<p key={1} className="badgeStatusNonText">Tidak Ada Data Absensi</p>)
    }else if(data.getAbsensi.rows.length > 0 && !counter){
        dataKu.push(
            <div className='tableContainer'>
                <table size='string' className="table" aria-label="simple table">
                    <thead>
                        <tr>
                            <th>Nama</th>
                            <th>Tanggal</th>
                            <th>Shift</th>
                            <th>Jam Masuk</th>
                            <th>Jam Keluar</th>
                            <th>Scan Masuk</th>
                            <th>Scan Pulang</th>
                            <th>Terlambat</th>
                            <th>Pulang Cepat</th>
                            <th>Absen</th>
                            <th>Lembur</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.getAbsensi.rows.map((laporan,index) =>(
                                <tr key={index} >
                                    <td data-label="Nama">{laporan.karyawan?.nama}</td>
                                    <td data-label="Tanggal">{dayjs(laporan.tanggal).format('DD-MM-YYYY')}</td>
                                    <td data-label="Shift">{laporan.jamKerja.namaShift}</td>
                                    <td data-label="Jam Masuk">{laporan.jamKerja.jamMasuk}</td>
                                    <td data-label="Jam Keluar">{laporan.jamKerja.jamKeluar}</td>
                                    <td data-label="Scan Masuk">{laporan.scanMasuk === ""? "-": laporan.scanMasuk}</td>
                                    <td data-label="Scan Keluar">{laporan.scanPulang === ""? "-": laporan.scanPulang}</td>
                                    <td data-label="Terlambat">{laporan.terlambat === ""? "-": laporan.terlambat}</td>
                                    <td data-label="Bolos">{laporan.jamBolos === ""? "-": laporan.jamBolos}</td>
                                    <td data-label="Absen">{laporan.absen === true? <div className="badgeStatusNon">Bolos</div>: <div className="badgeStatusAktif">Aman</div>}</td>
                                    <td data-label="Lembur">{laporan.lembur === ""? "-": laporan.lembur}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
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
                nama: nama,
            }
        })
    }, [pageNumber])
    useEffect(() => {
        getAbsensiKu({
            variables: {
                page: pageNumber,
                limit: limit,
                tglAwal: selectedDateAwal,
                tglAkhir: selectedDateAkhir,
                nama: nama,
            }
        })
    }, [nama])
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
            <Row style={{marginTop: 10, marginBottom: 10}}>
                <Col className="col-md-4">
                    <Form.Group>
                        <Form.Label>Cari Berdasarkan Nama: </Form.Label>
                        <Form.Control 
                            type="text" 
                            name="nama"
                            value= {nama}
                            onChange={e => 
                                setNama(e.target.value)}
                        />
                    </Form.Group>
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