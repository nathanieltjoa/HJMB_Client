import React, {useEffect, useState} from 'react'
import { Row, Col, Card, Container, Button, Modal} from 'react-bootstrap';
import { gql, useQuery} from '@apollo/client';
import dayjs from 'dayjs'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { useLocation } from 'react-router-dom';
import { CImage } from '@coreui/react';
import * as BiIcons from 'react-icons/bi';
import { useHistory } from 'react-router-dom';

const {URL} = require('../../config/config.json')

const getDLaporanMasterArmada = gql`
  query getDLaporanMasterArmada(
    $id: String 
  ){
    getDLaporanMasterArmada(
      id: $id
    ){
      idNota penerima keterangan foto diBatalkan uLaporan{
          merkBarang tipeBarang ukuranBarang jumlahBarang satuanBarang
      }
    }
  }
`;

export default function DetailArmada(props) {
    let history = useHistory();
    const location = useLocation();
    const [dataLaporan, setDataLaporan] = useState([]);
    const [dataUraian, setDataUraian] = useState([]);
    const [visible, setVisible] = useState(false);
    const [newUri, setNewUri] = useState('');
    const { loading, data, refetch} = useQuery(getDLaporanMasterArmada,{
        variables: {
            id: dataLaporan.id
        }
    });

    useEffect(() => {
        if(location.state !== undefined){
            setDataLaporan(location.state?.laporan)
        }
    }, [location])

    
    const goToDetail = (laporan) => {
        const fileImage = laporan.foto;
        setNewUri(fileImage.replace("localhost:4000", URL))
        setDataUraian(laporan);
        setVisible(true);
    }

    let dataDetail= [];
    if(!data || loading){
        dataDetail.push(<p key={0}>Loading....</p>)
    }else if(data.getDLaporanMasterArmada === null){
        dataDetail.push(<p key={0}>Tidak ada Detail Laporan</p>)
    }else if(data.getDLaporanMasterArmada !== null){
        dataDetail.push(
            <Row key={0} className="justify-content-center">
                <Col className="col-md-12">
                    <h3 className="subJudul">Detail Pengiriman:</h3>
                    <Table className="tableKu" aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">ID Nota</TableCell>
                                <TableCell align="center">Penerima</TableCell>
                                <TableCell align="center">Keterangan</TableCell>
                                <TableCell align="center">Status</TableCell>
                                <TableCell align="center">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                data.getDLaporanMasterArmada.map((laporan,index) =>(
                                    <TableRow key={index}>
                                        <TableCell component="th" scope="row" align="center">{laporan.idNota}</TableCell>
                                        <TableCell component="th" scope="row" align="center">{laporan.penerima}</TableCell>
                                        <TableCell component="th" scope="row" align="center">{laporan.keterangan}</TableCell>
                                        <TableCell component="th" scope="row" align="center">{laporan.diBatalkan === true? 
                                            <div className="badgeStatusNon">Di Batalkan</div>:
                                            <div className="badgeStatusAktif">Aman</div>}</TableCell>
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
                </Col>
            </Row>
        )
    }
    
    
    return (
        <Container className="containerKu">
            <Row>
                <Col>
                    <BiIcons.BiArrowBack size="50" onClick={() => history.push({pathname: '/laporan/armada'})} className="iconBack"/>
                </Col>
            </Row>
            <Row className="bg-white justify-content-center">
                <Col><h1 className="text-center">Master Laporan Detail</h1></Col>
            </Row>
            <Row className="bg-white py-5 justify-content-md-center">
                <Col className="col-md-6">
                    <Card>
                        <Card.Header className="subJudul">Detail Laporan</Card.Header>
                        <Card.Body>
                            <Card.Text>
                                <div className="parent">
                                    <p className="childLeft">Tanggal Laporan</p>
                                        <p className="childRight">: {dayjs(dataLaporan.createdAt).format('DD-MM-YYYY HH:mm:ss')}</p>
                                    <p className="childLeft">Kendaraan</p>
                                        <p className="childRight">: {dataLaporan.kendaraan}</p>
                                    <p className="childLeft">Armada</p>
                                        <p className="childRight">: {dataLaporan.armada?.nama}</p>
                                    <p className="childLeft">Stokist</p>
                                        <p className="childRight">: {dataLaporan.stokist?.nama}</p>
                                    <p className="childLeft">Supir</p>
                                        <p className="childRight">: {dataLaporan.supir?.nama}</p>
                                    <p className="childLeft">Kernet</p>
                                        <p className="childRight">: {dataLaporan.kernet?.nama}</p>
                                    {
                                        dataLaporan.status < 3? null:
                                            <>
                                                <p className="childLeft">Waktu Pengantaran</p>
                                                    <p className="childRight">: {dayjs(dataLaporan.pengantaran).format('DD-MM-YYYY HH:mm:ss')}</p>
                                            </>
                                    }
                                    {
                                        dataLaporan.status < 4? null:
                                            <>
                                                <p className="childLeft">Waktu Kembali</p>
                                                    <p className="childRight">: {dayjs(dataLaporan.kembali).format('DD-MM-YYYY HH:mm:ss')}</p>
                                            </>
                                    }
                                </div>
                                <p className="text-center statusKu">Status: 
                                    {
                                        dataLaporan.status === 1? 
                                            <div className="badgeStatusWaiting">Menunggu Verifikasi Stokist</div>:
                                                dataLaporan.status === 2?
                                                <div className="badgeStatusWaiting">Terverifikasi Stokist</div>:
                                                    dataLaporan.status === 3?
                                                    <div className="badgeStatusWaiting">Pengantaran</div>:
                                                        <div className="badgeStatusAktif">Selesai</div>
                                    }
                                </p>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col className="col-md-12">
                    {dataDetail}
                </Col>
            </Row>
            <Modal show={visible} onHide={() => setVisible(false)}>
                <Modal.Header closeButton>
                    <Modal.Title className="judul">Detail Uraian Laporan</Modal.Title>
                </Modal.Header>
                    <Modal.Body>
                        <div className="parent">
                            <p className="childLeft">ID Nota</p>
                                <p className="childRight">: {dataUraian.idNota}</p>
                            <p className="childLeft">Penerima</p>
                                <p className="childRight">: {dataUraian.penerima}</p>
                            <p className="childLeft">Keterangan</p>
                                <p className="childRight">: {dataUraian.keterangan}</p>
                            {
                                dataUraian.pernahBanding === false? 
                                    null:
                                    <>
                                        <p className="childLeft">Keterangan Banding</p>
                                            <p className="childRight">: {dataUraian.keteranganBanding}</p>
                                    </>
                            }
                        </div>
                        <p className="text-center statusKu">Status Nota:
                            {dataUraian.diBatalkan === true? 
                                <div className="badgeStatusNon">Di Batalkan</div>:
                                    <div className="badgeStatusAktif">Aman</div>}
                        </p>
                        <p className="subJudul">Dokumentasi: </p>
                        <CImage src={!newUri ? "/defaultImage.png": newUri} alt="" id="img" className="img imageCenter" width="250" height="200"/>
                        <Table className="tableKu" aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">No.</TableCell>
                                    <TableCell align="center">Merk</TableCell>
                                    <TableCell align="center">Tipe Barang</TableCell>
                                    <TableCell align="center">Ukuran Barang</TableCell>
                                    <TableCell align="center">Jumlah Barang</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    dataUraian.uLaporan?.map((laporan,index) =>(
                                        <TableRow key={index}>
                                            <TableCell component="th" scope="row" align="center">{index+1}</TableCell>
                                            <TableCell component="th" scope="row" align="center">{laporan.merkBarang}</TableCell>
                                            <TableCell component="th" scope="row" align="center">{laporan.tipeBarang}</TableCell>
                                            <TableCell component="th" scope="row" align="center">{laporan.ukuranBarang}</TableCell>
                                            <TableCell component="th" scope="row" align="center">{laporan.jumlahBarang} {laporan.satuanBarang}</TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={() => setVisible(false)}>
                        Tutup
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )
}
