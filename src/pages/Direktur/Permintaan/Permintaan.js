import React, {useEffect} from 'react'
import { Row, Col, Card, Button, Form, Container} from 'react-bootstrap';
import { gql, useQuery} from '@apollo/client';
import dayjs from 'dayjs'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import ReactPaginate from 'react-paginate';
import CurrencyFormat from 'react-currency-format';
import { useHistory } from 'react-router-dom';
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useState } from 'react';


const getPermintaansMaster = gql`
query getPermintaansMaster(
    $page: Int 
    $limit: Int 
    $orderBy: String 
    $karyawan: Int 
    $bulan: MyDate
    $status: Int 
){
    getPermintaansMaster(
    page: $page
    limit: $limit 
    orderBy: $orderBy
    karyawan: $karyawan
    bulan: $bulan
    status: $status
  ){
    count rows{
        id peminta{nama} status tanggalMulai tanggalBerakhir totalHari keterangan upload ketua{nama} 
        hrd{nama} izin{
            namaIzin totalIzin
        }
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

export default function PermintaanDirektur(props) {
    let history = useHistory();
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(5);
    const [selectedDateAwal, setSelectedDateAwal] = useState("");
    const [status, setStatus] = useState(-1);
    const [divisiKontrak, setDivisiKontrak] = useState("");
    const [karyawanKontrak, setKaryawanKontrak] = useState("");
    const [orderBy, setOrderBy] = useState("");
    const { loading, data, refetch } = useQuery(getPermintaansMaster,{
        variables: {
            page: parseInt(page),
            limit: parseInt(limit),
            orderBy: orderBy,
            karyawan: parseInt(karyawanKontrak),
            bulan: selectedDateAwal,
            status: parseInt(status),
        }
    });

    useEffect(() => {
        refetch() 
    }, [orderBy])

    const changePage = ({ selected }) => {
        setPage(selected)
    }

    const goToDetail = (laporan) => {
        history.push({
            pathname: '/direktur/permintaan/detail permintaan izin',
            state: { laporan: laporan }
        });
    }
    let pageKu = [];
    if(data){
        console.log(data);
    }
    if(data === undefined || loading){
        pageKu.push(<p key={0}>Loading...</p>)
    }else if(data.getPermintaansMaster.count){
      var jml = Math.ceil(data.getPermintaansMaster.count / limit);
      pageKu.push(
        <ReactPaginate
          key={1}
          previousLabel={'previous'}
          nextLabel={'next'}
          breakLabel={'...'}
          breakClassName={'break-me'}
          pageCount={jml}
          forcePage={page}
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
    }
    let dataKu = [];
    let counter = false;
    if(!data || loading){
        dataKu.push(<p className="badgeStatusWaitingText">Loading...</p>)
    }else if(data.getPermintaansMaster.rows.length === 0){
        dataKu.push(<p className="badgeStatusNonText">Tidak Ada Permintaan Dari Karyawan</p>)
    }else if(data.getPermintaansMaster.rows.length > 0 && !counter){
        dataKu.push(
            <TableContainer component={Paper} key={0}>
                <Table className="tableKu" aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Nama Karyawan</TableCell>
                            <TableCell align="center">Izin</TableCell>
                            <TableCell align="center">Tanggal Mulai</TableCell>
                            <TableCell align="center">Tanggal Berakhir</TableCell>
                            <TableCell align="center">Total</TableCell>
                            <TableCell align="center">Status</TableCell>
                            <TableCell align="center">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            data.getPermintaansMaster.rows.map((laporan,index) =>(
                                <TableRow key={index}>
                                    <TableCell align="center">{laporan.peminta?.nama}</TableCell>
                                    <TableCell align="center">{laporan.izin?.namaIzin}</TableCell>
                                    <TableCell align="center">{dayjs(laporan.tanggalMulai).format('DD-MM-YYYY')}</TableCell>
                                    <TableCell align="center">{dayjs(laporan.tanggalBerakhir).format('DD-MM-YYYY')}</TableCell>
                                    <TableCell align="center">{laporan.totalHari} Hari</TableCell>
                                    <TableCell align="center">{laporan.status === 1? 
                                        <div className="badgeStatusWaiting">Menunggu Verifikasi Ketua</div>:
                                            laporan.status === 2? 
                                            <div className="badgeStatusWaiting">Menunggu Verifikasi HRD</div>:
                                                laporan.status === 3?
                                                <div className="badgeStatusAktif">Di Terima</div>:
                                                    laporan.status === 4?
                                                    <div className="badgeStatusWaiting">Menunggu Verifikasi Direktur</div>:
                                                    <div className="badgeStatusNon">Di Tolak</div>}
                                    </TableCell>
                                    <TableCell align="center" style={{width: '20%'}}>
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
        counter = true;
    }

    
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
        refetch();
    }, [])
    return (
        <Container className="containerKu">
            <Row className="bg-white py-5 justify-content-center">
                <Col>
                    <h1 className="text-center">Daftar Permintaan Karyawan</h1>
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
                        <option value="1">Menunggu Persetujuan Ketua</option>
                        <option value="2">Menunggu Persetujuan HRD</option>
                        <option value="3">Di Terima</option>
                        <option value="0">Di Tolak</option>
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
                            <option value="Permintaan Terbaru">Permintaan Terbaru</option>
                            <option value="Permintaan Terlama">Permintaan Terlama</option>
                        </Form.Control>
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
