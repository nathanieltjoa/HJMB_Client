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

const getDLaporanQualityControlPipa = gql`
query getDLaporanQualityControlPipa(
  $HLaporanQualityControlPipaId: String 
){
  getDLaporanQualityControlPipa(
    HLaporanQualityControlPipaId: $HLaporanQualityControlPipaId
  ){
    diameterLuar diameterDalam panjang berat ketebalan foto status pernahBanding keteranganBanding jamLaporan keterangan uLaporan{
        namaBagian nilai
    }
  }
}
`;

export default function DetailQualityControlPipa(props) {
    let history = useHistory();
    const location = useLocation();
    const [dataLaporan, setDataLaporan] = useState([]);
    const [visible, setVisible] = useState(false);
    const [detailLaporan, setDetailLaporan] = useState([]);
    const { loading, data, refetch} = useQuery(getDLaporanQualityControlPipa,{
        variables: {
            HLaporanQualityControlPipaId: dataLaporan.id
        }
    });

    useEffect(() => {
        if(location.state !== undefined){
            setDataLaporan(location.state?.laporan)
        }
    }, [location])

    const openModal = (laporan) => {
        setDetailLaporan(laporan);
        setVisible(true);
    }

    let dataDetail= [];
    if(!data || loading){
        dataDetail.push(<p key={0}>Memuat....</p>)
    }else if(data.getDLaporanQualityControlPipa === null){
        dataDetail.push(<p key={0}>Tidak ada Detail Laporan</p>)
    }else if(data.getDLaporanQualityControlPipa !== null){
        console.log(data.getDLaporanQualityControlPipa)
        dataDetail.push(
            <Row key={0} className="justify-content-center">
                <Col className="col-md-12">
                    <h3 className="subJudul">Detail Laporan:</h3>
                    <div className='tableContainer'>
                        <table size='string' className="table" aria-label="simple table">
                            <thead>
                                <tr>
                                    <th>Jam Laporan</th>
                                    <th>Diameter Luar</th>
                                    <th>Diameter Dalam</th>
                                    <th>Panjang</th>
                                    <th>Berat</th>
                                    <th>Ketebalan</th>
                                    <th>Status</th>
                                    <th>Banding</th>
                                    <th>#</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    data.getDLaporanQualityControlPipa.map((laporan,index) =>(
                                        <tr key={index} >
                                            <td data-label="Jam">{laporan.jamLaporan}</td>
                                            <td data-label="Diameter Luar">{laporan.diameterLuar}</td>
                                            <td data-label="Diameter Dalam">{laporan.diameterDalam}</td>
                                            <td data-label="Panjang">{laporan.panjang}</td>
                                            <td data-label="Berat">{laporan.berat}</td>
                                            <td data-label="Ketebalan">{laporan.ketebalan}</td>
                                            <td data-label="Status">
                                            {
                                                laporan.status === 1? 
                                                <div className="badgeStatusWaiting">Menunggu Verifikasi</div>:
                                                laporan.status === 2? 
                                                    <div className="badgeStatusAktif">Terverifikasi</div>:
                                                        <div className="badgeStatusNon">Proses Banding</div>
                                            }
                                            </td>
                                            <td data-label="Banding">
                                            {
                                                laporan.pernahBanding === true? 
                                                    <div className="badgeStatusNon">Pernah Banding</div>:
                                                    <div className="badgeStatusAktif">Aman</div>
                                            }
                                            </td>
                                            <td data-label="#">
                                                <Button onClick={() => openModal(laporan)}>
                                                    Detail 
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </Col>
            </Row>
        )
    }
    
    
    return (
        <Container className="containerKu">
            <Row>
                <Col>
                    <BiIcons.BiArrowBack size="50" onClick={() => history.push({pathname: '/laporan/quality control'})} className="iconBack"/>
                </Col>
            </Row>
            <Row className="bg-white justify-content-center">
                <Col><h1 className="text-center">Master Laporan Quality Control Pipa</h1></Col>
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
                                    <p className="childLeft">Pipa</p>
                                        <p className="childRight">: {dataLaporan.merkPipa} {dataLaporan.tipePipa} {dataLaporan.ukuranPipa}</p>
                                    <p className="childLeft">Kebulatan</p>
                                        <p className="childRight">: {dataLaporan.kebulatan}</p>
                                    <p className="childLeft">Kerataan Warna</p>
                                        <p className="childRight">: {dataLaporan.kerataanWarna}</p>
                                    <p className="childLeft">Cacat</p>
                                        <p className="childRight">: {dataLaporan.cacat}</p>
                                    <p className="childLeft">Ketebalan</p>
                                        <p className="childRight">: {dataLaporan.ketebalan}</p>
                                    <p className="childLeft">Diameter Luar</p>
                                        <p className="childRight">: {dataLaporan.diameterLuar}</p>
                                    <p className="childLeft">Diameter Dalam</p>
                                        <p className="childRight">: {dataLaporan.diameterDalam}</p>
                                    <p className="childLeft">Total Reject</p>
                                        <p className="childRight">: {dataLaporan.totalReject}</p>
                                    <p className="childLeft">Total Produksi</p>
                                        <p className="childRight">: {dataLaporan.totalProduksi}</p>
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
                    <Modal.Title className="judul">Detail Laporan</Modal.Title>
                </Modal.Header>
                    <Modal.Body>
                        <div className="parent">
                            <p className="childLeft">Jam Laporan</p>
                                <p className="childRight">: {detailLaporan.jamLaporan}</p>
                            <p className="childLeft">Diameter Luar</p>
                                <p className="childRight">: {detailLaporan.diameterLuar}</p>
                            <p className="childLeft">Diameter Dalam</p>
                                <p className="childRight">: {detailLaporan.diameterDalam}</p>
                            <p className="childLeft">Panjang</p>
                                <p className="childRight">: {detailLaporan.panjang}</p>
                            <p className="childLeft">Berat</p>
                                <p className="childRight">: {detailLaporan.berat}</p>
                            <p className="childLeft">Ketebalan</p>
                                <p className="childRight">: {detailLaporan.ketebalan}</p>
                            <p className="childLeft">Keterangan</p>
                                <p className="childRight">: {detailLaporan.keterangan}</p>
                            {
                                detailLaporan.pernahBanding === false? 
                                    null:
                                    <>
                                        <p className="childLeft">Keterangan Banding</p>
                                            <p className="childRight">: {detailLaporan.keteranganBanding}</p>
                                    </>
                            }
                        </div>
                        <div className="tagPInRow">
                            <p className="tagPTextLeft">Status: 
                                {
                                    detailLaporan.status === 1? 
                                    <div className="badgeStatusWaiting">Menunggu Verifikasi</div>:
                                    detailLaporan.status === 2? 
                                        <div className="badgeStatusAktif">Terverifikasi</div>:
                                            <div className="badgeStatusNon">Proses Banding</div>
                                }
                            </p>
                            <p className="tagPTextLeft">Status Banding:
                                {detailLaporan.pernahBanding === true? 
                                    <div className="badgeStatusNon">Pernah Banding</div>:
                                        <div className="badgeStatusAktif">Aman</div>}
                            </p>
                        </div>
                        <p className="subJudul">Bahan Baku:</p>
                        <Table className="tableKu" aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">Nama Bahan</TableCell>
                                    <TableCell align="center">Total Pemakaian</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    detailLaporan?.uLaporan?.map((laporan,index) =>(
                                        <TableRow key={index}>
                                            <TableCell component="th" scope="row" align="center">{laporan.namaBagian}</TableCell>
                                            <TableCell component="th" scope="row" align="center">{laporan.nilai}</TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                        <p className="subJudul">Dokumentasi: </p>
                        <CImage src={!detailLaporan.foto ? "/defaultImage.png": detailLaporan.foto.replace("localhost:4000", URL)} alt="" id="img" className="img imageCenter" width="250" height="200"/>
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
