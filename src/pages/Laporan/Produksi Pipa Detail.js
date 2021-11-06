import React, {useEffect, useState} from 'react'
import { Row, Col, Card, Container, Modal, Button} from 'react-bootstrap';
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

const getDLaporanProduksiPipa = gql`
query getDLaporanProduksiPipa(
  $HLaporanProduksiPipaId: String 
){
    getDLaporanProduksiPipa(
    HLaporanProduksiPipaId: $HLaporanProduksiPipaId
  ){
    totalProduksi targetProduksi foto status pernahBanding keteranganBanding jamLaporan keterangan createdAt uLaporan{
        namaUraian nilaiUraian
    }
  }
}
`;

export default function DetailProduksiPipa(props) {
    let history = useHistory();
    const location = useLocation();
    const [dataLaporan, setDataLaporan] = useState([]);
    const [dataUraian, setDataUraian] = useState([]);
    const [newUri, setNewUri] = useState("");
    const [visible, setVisible] = useState(false);
    const { loading, data, refetch} = useQuery(getDLaporanProduksiPipa,{
        variables: {
            HLaporanProduksiPipaId: dataLaporan.id
        }
    });

    useEffect(() => {
        if(location.state !== undefined){
            setDataLaporan(location.state?.laporan)
        }
    }, [location])

    const goToDetail = (laporan, dokumentasi) => {
        const fileImage = dokumentasi;
        setNewUri(fileImage.replace("localhost:4000", URL))
        setDataUraian(laporan);
        setVisible(true);
    }

    let dataDetail= [];
    if(!data || loading){
        dataDetail.push(<p key={0}>Loading....</p>)
    }else if(data.getDLaporanProduksiPipa === null){
        dataDetail.push(<p key={0}>Tidak ada Detail Laporan</p>)
    }else if(data.getDLaporanProduksiPipa !== null){
        dataDetail.push(
            <Row key={0} className="justify-content-center">
                <Col className="col-md-12">
                    <h3 className="subJudul">Detail Laporan:</h3>
                    <Table className="tableKu" aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Jam Laporan</TableCell>
                                <TableCell align="center">Target Produksi</TableCell>
                                <TableCell align="center">Total Produksi</TableCell>
                                <TableCell align="center">Keterangan</TableCell>
                                <TableCell align="center">Status</TableCell>
                                <TableCell align="center">Banding</TableCell>
                                <TableCell align="center">Keterangan Banding</TableCell>
                                <TableCell align="center">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                data.getDLaporanProduksiPipa.map((laporan,index) =>(
                                    <TableRow key={index}>
                                        <TableCell component="th" scope="row" align="center">{laporan.jamLaporan}</TableCell>
                                        <TableCell component="th" scope="row" align="center">{laporan.targetProduksi}</TableCell>
                                        <TableCell component="th" scope="row" align="center">{laporan.totalProduksi}</TableCell>
                                        <TableCell component="th" scope="row" align="center">{laporan.keterangan}</TableCell>
                                        <TableCell component="th" scope="row" align="center">
                                        {
                                            laporan.status === 1? 
                                            <div className="badgeStatusWaiting">Menunggu Verifikasi</div>:
                                                laporan.status === 2? 
                                                <div className="badgeStatusAktif">Terverifikasi</div>:
                                                    <div className="badgeStatusNon">Proses Banding</div>
                                        }
                                        </TableCell>
                                        <TableCell component="th" scope="row" align="center">
                                        {
                                            laporan.pernahBanding === true? 
                                                <div className="badgeStatusNon">Pernah Banding</div>:
                                                <div className="badgeStatusAktif">Aman</div>
                                        }
                                        </TableCell>
                                        <TableCell component="th" scope="row" align="center">{laporan.keteranganBanding}</TableCell>
                                        <TableCell align="center" style={{width: '20%'}}>
                                            <Button variant="info" onClick={() => goToDetail(laporan.uLaporan, laporan.foto)}>
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
                    <BiIcons.BiArrowBack size="50" onClick={() => history.push({pathname: '/laporan/produksi pipa'})} className="iconBack"/>
                </Col>
            </Row>
            <Row className="bg-white justify-content-center">
                <Col><h1 className="text-center">Master Laporan Produksi Pipa</h1></Col>
            </Row>
            <Row className="bg-white py-5 justify-content-md-center">
                <Col className="col-md-6">
                    <Card>
                        <Card.Header className="subJudul">Detail Laporan</Card.Header>
                        <Card.Body>
                            <Card.Text>
                                <div className="parent">
                                    <p className="childLeft">Nama Pelapor</p>
                                        <p className="childRight">: {dataLaporan.karyawan?.nama}</p>
                                    <p className="childLeft">Nama Ketua</p>
                                        <p className="childRight">: {dataLaporan.ketua?.nama}</p>
                                    <p className="childLeft">Tanggal Laporan</p>
                                        <p className="childRight">: {dayjs(dataLaporan.createdAt).format('DD-MM-YYYY')}</p>
                                    <p className="childLeft">Shift</p>
                                        <p className="childRight">: {dataLaporan.shift}</p>
                                    <p className="childLeft">Tipe Mesin</p>
                                        <p className="childRight">: {dataLaporan.tipeMesin}</p>
                                    <p className="childLeft">Warna</p>
                                        <p className="childRight">: {dataLaporan.warna}</p>
                                    <p className="childLeft">Ukuran</p>
                                        <p className="childRight">: {dataLaporan.ukuran}</p>
                                    <p className="childLeft">Dis</p>
                                        <p className="childRight">: {dataLaporan.dis}</p>
                                    <p className="childLeft">Pin</p>
                                        <p className="childRight">: {dataLaporan.pin}</p>
                                    <p className="childLeft">Hasil Produksi</p>
                                        <p className="childRight">: {dataLaporan.hasilProduksi}</p>
                                    <p className="childLeft">BS</p>
                                        <p className="childRight">: {dataLaporan.BS}</p>
                                    <p className="childLeft">Jumlah Bahan</p>
                                        <p className="childRight">: {dataLaporan.jumlahBahan}</p>
                                    <p className="childLeft">Total Bahan</p>
                                        <p className="childRight">: {dataLaporan.totalBahan}</p>
                                </div>
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
                        <p className="subJudul">Dokumentasi: </p>
                        <CImage src={!newUri ? "/defaultImage.png": newUri} alt="" id="img" className="img imageCenter" width="250" height="200"/>
                        <Table className="tableKu" aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">Nama Uraian</TableCell>
                                    <TableCell align="center">Nilai Uraian</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    dataUraian.map((laporan,index) =>(
                                        <TableRow key={index}>
                                            <TableCell component="th" scope="row" align="center">{laporan.namaUraian}</TableCell>
                                            <TableCell component="th" scope="row" align="center">{laporan.nilaiUraian}</TableCell>
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
