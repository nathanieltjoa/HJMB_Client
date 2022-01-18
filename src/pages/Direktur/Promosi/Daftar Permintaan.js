import React, {useEffect, useState} from 'react'
import { Row, Col, Card, Button, Container, Form} from 'react-bootstrap';
import { gql, useLazyQuery, useQuery, useMutation} from '@apollo/client';
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
import { CModal, CModalBody, CModalHeader, CModalTitle } from '@coreui/react';

const getListPermintaanPromosiMaster = gql`
    query getListPermintaanPromosiMaster(
        $page: Int 
        $limit: Int 
        $orderBy: String  
        $status: Int 
    ){
        getListPermintaanPromosiMaster(
            page: $page
            limit: $limit
            orderBy: $orderBy
            status: $status
        ){
            count rows{
                id penerima{nama} pelapor{nama} karyawan{nama} kenaikan keterangan keteranganDirektur status createdAt
            }
        }
    }
`;


const updateStatusPermintaanPromosi = gql`
    mutation updateStatusPermintaanPromosi(
        $status: Int
        $id: Int  
        $keterangan: String 
  ) {
    updateStatusPermintaanPromosi(
        status: $status
        id: $id
        keterangan: $keterangan
    ) {
        id
    }
  }
`;
export default function DaftarPermintaanPromosi(props) {
    let history = useHistory();
    const [pageNumber, setPageNumber] = useState(0);
    const [limit, setLimit] = useState(10);
    const [orderBy, setOrderBy] = useState("");
    const [divisiKontrak, setDivisiKontrak] = useState("");
    const [status, setStatus] = useState(-1);
    const [visible, setVisible] = useState(false);
    const [dataLaporan, setDataLaporan] = useState([]);
    const [keterangan, setKeterangan] = useState("");
    const { 
        loading: loadingPermintaan, 
        data: dataPermintaan ,
        refetch: refetchPermintaan,
    }= useQuery(getListPermintaanPromosiMaster,{
        variables: {
            page: pageNumber,
            limit: limit,
            orderBy: orderBy,
            status: parseInt(status),
        }
    });

    const changePage = ({ selected }) => {
        setPageNumber(selected)
    }

    const [updateStatusIndexKu] = useMutation(updateStatusPermintaanPromosi,{
        update(_,res){
            console.log(res)
        },
        onError: (err) => {
            console.log(err)
            alert(err.graphQLErrors[0].extensions.errors);
        },
        onCompleted(data){
            refetchPermintaan()
        }
    })

    const doAction = (status, id) =>{
        var statusPermintaan = status === true? 1: 2;
        updateStatusIndexKu({
            variables: {
                id: id,
                status: parseInt(statusPermintaan),
                keterangan: keterangan,
            }
        })
        setVisible(false);
    }
    
    const openModal = (laporan) =>{
        setDataLaporan(laporan);
        setVisible(true);
    }
    
    let dataUtangKu= [];
    let counterUtangKu = false;
    let pageKu = [];
    let counterPage = false;
    if(dataPermintaan){
        console.log(dataPermintaan);
    }
    if(dataPermintaan === undefined || loadingPermintaan){
        pageKu.push(<p key={0}>Memuat...</p>)
    }else if(dataPermintaan.getListPermintaanPromosiMaster.count && !counterPage){
      var jml = Math.ceil(dataPermintaan.getListPermintaanPromosiMaster.count / limit);
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
    if(dataPermintaan === undefined || loadingPermintaan){
        dataUtangKu.push(<p key={0}>Memuat...</p>)
    }else if(dataPermintaan.getListPermintaanPromosiMaster.rows.length === 0){
        dataUtangKu.push(<p key={1}>Tidak Ada Data Promosi</p>)
    }else if(dataPermintaan.getListPermintaanPromosiMaster.rows.length > 0 && !counterUtangKu){
        dataUtangKu.push(
            <TableContainer component={Paper} key={0}>
                <Table className="tableKu" aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Nama Karyawan</TableCell>
                            <TableCell align="right">Nama Peminta</TableCell>
                            <TableCell align="center">Keterangan</TableCell>
                            <TableCell align="center">Promosi</TableCell>
                            <TableCell align="center">Status</TableCell>
                            <TableCell align="center">Tanggal</TableCell>
                            <TableCell align="center">Tindakan</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            dataPermintaan.getListPermintaanPromosiMaster.rows.map((laporan,index) =>(
                                <TableRow key={index}>
                                    <TableCell align="center">{laporan.karyawan?.nama}</TableCell>
                                    <TableCell align="center">{laporan.pelapor?.nama}</TableCell>
                                    <TableCell align="center">{laporan.keterangan}</TableCell>
                                    <TableCell align="center">{laporan.kenaikan === true? 
                                        <div className="badgeStatusAktif">Naik Jabatan</div>:
                                        <div className="badgeStatusNon">Turun Jabatan</div>
                                    }</TableCell>
                                    <TableCell align="center">{
                                        laporan.status === 0?
                                            <div className="badgeStatusWaiting">Menunggu Verifikasi</div>:
                                            laporan.status === 1?
                                                <div className="badgeStatusAktif">Di Setujui</div>:
                                                <div className="badgeStatusNon">Di Tolak</div>
                                    }</TableCell>
                                    <TableCell align="center">{dayjs(laporan.createdAt).format('DD-MM-YYYY HH:mm:ss')}</TableCell>
                                    <TableCell component="th" scope="row" align="right">
                                        <Button variant="info" onClick={() => openModal(laporan)}>
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
        if (window.performance) {
            if (performance.navigation.type == 1) {
                refetchPermintaan()
            }
        }
    }, [])         

    return (
        <CContainer className="containerKu">
            <Row className="bg-white py-5 justify-content-center">
                <Col>
                    <h1 className="text-center">Daftar Permintaan Promosi</h1>
                </Col>
            </Row>
            <Row>
                <Col className="col-md-4">
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
                        <option value="0">Menunggu Verifikasi</option>
                        <option value="1">Di Setujui</option>
                        <option value="2">Di Tolak</option>
                        </Form.Control>
                    </Form.Group>
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
            <Row className="bg-white py-5 justify-content-center">
                <Col>
                    {dataUtangKu}
                    <div className="pageContainerKu">
                        {pageKu}
                    </div>
                </Col>
            </Row>
            
            <CModal fullscreen="md" visible={visible} onClose={() => setVisible(false)}>
                <CModalHeader>
                    <CModalTitle>Detail Permintaan Promosi</CModalTitle>
                </CModalHeader>
                <CModalBody className="justify-content-center">
                    <div className="parent">
                        <p className="childLeft">Nama Karyawan</p>
                            <p className="childRight">: {dataLaporan.karyawan?.nama}</p>
                        <p className="childLeft">Nama Peminta</p>
                            <p className="childRight">: {dataLaporan.pelapor?.nama}</p>
                        <p className="childLeft">Promosi</p>
                            <p className="childRight">: {dataLaporan.kenaikan === true?"Naik Jabatan":
                                "Turun Jabatan"
                            }</p>
                        <p className="childLeft">Keterangan</p>
                            <p className="childRight">: {dataLaporan.keterangan}</p>
                        <p className="childLeft">Keterangan Direktur</p>
                            <p className="childRight">: {dataLaporan.keteranganDirektur}</p>
                        <p className="childLeft">Tanggal</p>
                            <p className="childRight">: {dayjs(dataLaporan.createdAt).format('DD-MM-YYYY HH:mm:ss')}</p>
                    </div>
                    <p className="text-center statusKu">Status:
                        {
                            dataLaporan.status === 0?
                                <div className="badgeStatusWaiting">Menunggu Verifikasi</div>:
                                dataLaporan.status === 1?
                                    <div className="badgeStatusWaiting">Di Setujui</div>:
                                    <div className="badgeStatusAktif">Di Tolak</div>
                        }
                    </p>
                    {
                        dataLaporan.status !== 0? null:
                        <Form>
                            <Form.Group as={Col}>
                                <Form.Label>Keterangan</Form.Label>
                                <Form.Control 
                                    as="textarea" 
                                    value={keterangan} 
                                    onChange={e => 
                                        setKeterangan(e.target.value)
                                    }
                                />
                            </Form.Group>
                            <div className="text-center">
                                <Button className="buttonSideBySide" variant="primary" onClick={() => doAction(true, dataLaporan.id)}>
                                    Setuju
                                </Button>
                                <Button className="buttonSideBySide" variant="danger" onClick={() => doAction(false, dataLaporan.id)}>
                                    Tolak
                                </Button>
                            </div>
                        </Form>
                    }
                </CModalBody>
            </CModal>
        </CContainer>
    )
}