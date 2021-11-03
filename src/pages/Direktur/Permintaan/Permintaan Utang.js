import React, {useEffect, useState} from 'react'
import { Row, Col, Card, Button, Container, Form} from 'react-bootstrap';
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
import 'react-datepicker/dist/react-datepicker.css'
import dayjs from 'dayjs'
import Carousel from 'react-elastic-carousel'
import { useHistory } from 'react-router-dom';
import { CContainer } from '@coreui/react';
import CurrencyFormat from 'react-currency-format';
import DatePicker from 'react-datepicker'

const getListPinjaman = gql`
    query getListPinjaman(
        $page: Int 
        $limit: Int 
        $orderBy: String 
        $karyawan: Int 
        $bulan: MyDate
        $status: Int 
    ){
        getListPinjaman(
            page: $page
            limit: $limit
            orderBy: $orderBy
            karyawan: $karyawan
            bulan: $bulan
            status: $status
        ){
            count rows{
                id karyawan{nama} hrd{nama} keuangan{nama}  jumlahPinjam keteranganPinjam lunas cicilan status
            }
        }
    }
`;


const getListDivisi = gql`
query getListDivisi{
    getListDivisi{
        namaDivisi
  }
}
`;

const getListKaryawanKontrak = gql`
query getListKaryawanKontrak(
    $divisi: String 
){
    getListKaryawanKontrak(
        divisi: $divisi
    ){
        id nama jabatan{jabatanKu}
  }
}
`;

export default function PermintaanPinjaman(props) {
    let history = useHistory();
    const [pageNumber, setPageNumber] = useState(0);
    const [limit, setLimit] = useState(10);
    const [orderBy, setOrderBy] = useState("");
    const [selectedDateAwal, setSelectedDateAwal] = useState("");
    const [status, setStatus] = useState(-1);
    const [divisiKontrak, setDivisiKontrak] = useState("");
    const [karyawanKontrak, setKaryawanKontrak] = useState("");
    const { 
        loading: loadingPinjaman, 
        data: dataPinjaman ,
        refetch: refetchPinjaman,
    }= useQuery(getListPinjaman,{
        variables: {
            page: pageNumber,
            limit: limit,
            orderBy: orderBy,
            karyawan: parseInt(karyawanKontrak),
            bulan: selectedDateAwal,
            status: parseInt(status),
        }
    });

    const changePage = ({ selected }) => {
        setPageNumber(selected)
    }

    const goToDetail = (laporan) =>{
        history.push({
            pathname: '/direktur/permintaan/detail pinjaman',
            state: { 
                laporan: laporan,
            }
        });
    }
    
    let dataUtangKu= [];
    let counterUtangKu = false;
    let pageKu = [];
    let counterPage = false;
    if(dataPinjaman){
        console.log(dataPinjaman);
    }
    if(dataPinjaman === undefined || loadingPinjaman){
        pageKu.push(<p key={0}>Loading...</p>)
    }else if(dataPinjaman.getListPinjaman.count && !counterPage){
      var jml = Math.ceil(dataPinjaman.getListPinjaman.count / limit);
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
    if(dataPinjaman === undefined || loadingPinjaman){
        dataUtangKu.push(<p key={0}>Loading...</p>)
    }else if(dataPinjaman.getListPinjaman.rows.length === 0){
        dataUtangKu.push(<p key={1}>Tidak Ada Data Absensi</p>)
    }else if(dataPinjaman.getListPinjaman.rows.length > 0 && !counterUtangKu){
        dataUtangKu.push(
            <TableContainer component={Paper} key={0}>
                <Table className="tableKu" aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Nama Karyawan</TableCell>
                            <TableCell align="right">Jumlah Pinjaman</TableCell>
                            <TableCell align="center">Keterangan Pinjaman</TableCell>
                            <TableCell align="center">Lunas</TableCell>
                            <TableCell align="center">Cicilan</TableCell>
                            <TableCell align="center">Status</TableCell>
                            <TableCell align="center">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            dataPinjaman.getListPinjaman.rows.map((laporan,index) =>(
                                <TableRow key={index}>
                                    <TableCell align="center">{laporan.karyawan.nama}</TableCell>
                                    <TableCell align="right">
                                        <CurrencyFormat displayType={'text'} value={laporan.jumlahPinjam} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp'} />
                                    </TableCell>
                                    <TableCell align="center">{laporan.keteranganPinjam}</TableCell>
                                    <TableCell align="center">{laporan.lunas === true? 
                                        <div className="badgeStatusAktif">Lunas</div>:
                                        <div className="badgeStatusNon">Belum</div>
                                    }</TableCell>
                                    <TableCell align="center">{laporan.cicilan}</TableCell>
                                    <TableCell align="center">{
                                        laporan.status === 0?
                                            <div className="badgeStatusWaiting">Menunggu HRD</div>:
                                            laporan.status === 1?
                                                <div className="badgeStatusWaiting">Menunggu Uang Diserahkan</div>:
                                                laporan.status === 2?
                                                    <div className="badgeStatusAktif">Selesai</div>:
                                                    laporan.status === 4?
                                                    <div className="badgeStatusNon">Menunggu Verifikasi Penerima</div>:
                                                        <div className="badgeStatusNon">Di Tolak</div>
                                    }</TableCell>
                                    <TableCell align="center">
                                        <Button variant="info" onClick={() => goToDetail(laporan)}>
                                            Detail
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        )
        counterUtangKu = true;
    }
    useEffect(() => {
        refetchPinjaman()
    }, [pageNumber])

    
    const { 
        loading: loadingDivisi,
        data: dataDivisi 
    } = useQuery(getListDivisi);

    let dataDivisiKu = [];
    let counterDivisi = false;
    if(!dataDivisi || loadingDivisi){

    }else if(dataDivisi.getListDivisi.length === 0){
        
    }else if(dataDivisi.getListDivisi.length > 0 && !counterDivisi){
        dataDivisiKu.push(dataDivisi.getListDivisi.map((divisi,index) =>(
            <option key={index} value={divisi.namaDivisi}>
                {divisi.namaDivisi}
            </option>
        )))
        counterDivisi = true;
    }

    const { 
        loading: loadingKaryawanKontrak, 
        data: dataKaryawanKontrak, 
        refetch: refetchKaryawanKontrak
    } = useQuery(getListKaryawanKontrak,{
        variables: {
            divisi: divisiKontrak
        }
    });

    let dataKaryawanKontrakKu = [];
    if(!dataKaryawanKontrak || loadingKaryawanKontrak){

    }else if(dataKaryawanKontrak.getListKaryawanKontrak.length === 0){

    }else if(dataKaryawanKontrak.getListKaryawanKontrak.length > 0){
        dataKaryawanKontrakKu.push(dataKaryawanKontrak.getListKaryawanKontrak.map((element, index) => (
            <option key={index} value={element.id} >{element.nama} ({element.jabatan.jabatanKu})</option>
        )))
    }

    useEffect(() => {
        if (window.performance) {
            if (performance.navigation.type == 1) {
                refetchPinjaman()
            }
        }
    }, [])         

    return (
        <CContainer className="containerKu">
            <Row className="bg-white py-5 justify-content-center">
                <Col>
                    <h1 className="text-center">Master Pinjaman</h1>
                </Col>
            </Row>
            <Row>
                <Col className="col-md-4">
                    <Form.Group as={Col}>
                        <Form.Label>Divisi Karyawan</Form.Label>
                        <Form.Control 
                            as="select" 
                            value={divisiKontrak} 
                            onChange={e => 
                                setDivisiKontrak(e.target.value)
                            }
                        >
                            <option value=""></option>
                            {dataDivisiKu}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group as={Col}>
                        <Form.Label>Karyawan: </Form.Label>
                        <Form.Control 
                            as="select" 
                            value={karyawanKontrak} 
                            onChange={e => 
                                setKaryawanKontrak(e.target.value)
                            }
                        >
                            <option value=""></option>
                            {dataKaryawanKontrakKu}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group as={Col}>
                        <Form.Label>Status Laporan: </Form.Label>
                        <Form.Control 
                            as="select" 
                            value={status} 
                            onChange={e => 
                                setStatus(e.target.value)
                            }
                        >
                        <option value="-1">Semuanya</option>
                        <option value="0">Menunggu Verifikasi HRD</option>
                        <option value="1">Menunggu Pembayaran Gaji</option>
                        <option value="2">Selesai</option>
                        <option value="3">Dibatalkan</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group as={Col}>
                        <Form.Label>Bulan</Form.Label>
                        <DatePicker
                            selected={selectedDateAwal}
                            onChange={date => setSelectedDateAwal(date)}
                            dateFormat='MM-yyyy'
                            maxDate={new Date()}
                            showMonthYearPicker
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Row className="d-flex flex-row-reverse">
                <Col className="col-md-4">
                    <Form.Group as={Col}>
                        <Form.Label>Urutkan Berdasar: </Form.Label>
                        <Form.Control 
                            as="select" 
                            value={orderBy} 
                            onChange={e => 
                                setOrderBy(e.target.value)
                            }
                        >
                            <option value=""></option>
                            <option value="Slip Terbaru">Slip Terbaru</option>
                            <option value="Slip Terlama">Slip Terlama</option>
                        </Form.Control>
                    </Form.Group>
                </Col>
            </Row>
            <Row className="bg-white py-5 justify-content-center">
                <Col>
                    {dataUtangKu}
                    <div className="pageContainerKu">
                        {pageKu}
                    </div>
                </Col>
            </Row>
        </CContainer>
    )
}