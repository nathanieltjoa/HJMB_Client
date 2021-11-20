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

const getListDetailMixerPipa = gql`
query getListDetailMixerPipa(
  $id: String 
){
    getListDetailMixerPipa(
    id: $id
  ){
    totalHasil targetKerja formulaA formulaB formulaC crusher keterangan status pernahBanding keteranganBanding uLaporan{
        id namaBahan totalBahan 
    }fLaporan{
        foto
    }
  }
}
`;

export default function DetailMixerPipa(props) {
    let history = useHistory();
    const location = useLocation();
    const [dataLaporan, setDataLaporan] = useState([]);
    const [visible, setVisible] = useState(false);
    const [detailLaporan, setDetailLaporan] = useState([]);
    const { loading, data, refetch} = useQuery(getListDetailMixerPipa,{
        variables: {
            id: dataLaporan.id
        }
    });

    useEffect(() => {
        if(location.state !== undefined){
            setDataLaporan(location.state?.laporan)
        }
    }, [location])

    const openModal = (laporan) => {
        console.log(laporan);
        setDetailLaporan(laporan);
        setVisible(true);
    }

    let dataDetail= [];
    if(!data || loading){
        dataDetail.push(<p key={0}>Loading....</p>)
    }else if(data.getListDetailMixerPipa === null){
        dataDetail.push(<p key={0}>Tidak ada Detail Laporan</p>)
    }else if(data.getListDetailMixerPipa !== null){
        dataDetail.push(
            <Row key={0} className="justify-content-center">
                <Col className="col-md-12">
                    <h3 className="subJudul">Detail Laporan:</h3>
                    <Table className="tableKu" aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Total Hasil</TableCell>
                                <TableCell align="center">Target Kerja</TableCell>
                                <TableCell align="center">Status</TableCell>
                                <TableCell align="center">Banding</TableCell>
                                <TableCell align="center">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                data.getListDetailMixerPipa.map((laporan,index) =>(
                                    <TableRow key={index}>
                                        <TableCell component="th" scope="row" align="center">{laporan.totalHasil}</TableCell>
                                        <TableCell component="th" scope="row" align="center">{laporan.targetKerja}</TableCell>
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
                                        <TableCell component="th" scope="row" align="center">
                                            <Button onClick={() => openModal(laporan)}>
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
                    <BiIcons.BiArrowBack size="50" onClick={() => history.push({pathname: '/laporan/mixer pipa'})} className="iconBack"/>
                </Col>
            </Row>
            <Row className="bg-white justify-content-center">
                <Col><h1 className="text-center">Master Laporan Mixer Pipa</h1></Col>
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
                                    <p className="childLeft">Jenis Mixer</p>
                                        <p className="childRight">: {dataLaporan.jenisMixer}</p>
                                    <p className="childLeft">Tipe Mesin</p>
                                        <p className="childRight">: {dataLaporan.tipeMesin}</p>
                                    <p className="childLeft">Total Produksi</p>
                                        <p className="childRight">: {dataLaporan.totalMix}</p>
                                    {
                                        dataLaporan.jenisMixer === "Additive"? null:
                                        <>
                                            <p className="childLeft">Formula A</p>
                                                <p className="childRight">: {dataLaporan.formulaA}</p>
                                            <p className="childLeft">Formula B</p>
                                                <p className="childRight">: {dataLaporan.formulaB}</p>
                                            <p className="childLeft">Formula C</p>
                                                <p className="childRight">: {dataLaporan.formulaC}</p>
                                            <p className="childLeft">Crusher</p>
                                                <p className="childRight">: {dataLaporan.crusher}</p>
                                        </>
                                    }
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
                            <p className="childLeft">Total Hasil</p>
                                <p className="childRight">: {detailLaporan.totalHasil}</p>
                            <p className="childLeft">Target Kerja</p>
                                <p className="childRight">: {detailLaporan.targetKerja}</p>
                            {
                                dataLaporan.jenisMixer === "Additive"? null:
                                <>
                                    <p className="childLeft">Formula A</p>
                                        <p className="childRight">: {detailLaporan.formulaA}</p>
                                    <p className="childLeft">Formula B</p>
                                        <p className="childRight">: {detailLaporan.formulaB}</p>
                                    <p className="childLeft">Formula C</p>
                                        <p className="childRight">: {detailLaporan.formulaC}</p>
                                    <p className="childLeft">Crusher</p>
                                        <p className="childRight">: {detailLaporan.crusher}</p>
                                </>
                            }
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
                                            <TableCell component="th" scope="row" align="center">{laporan.namaBahan}</TableCell>
                                            <TableCell component="th" scope="row" align="center">{laporan.totalBahan}</TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                        <p className="subJudul">Dokumentasi: </p>
                        {
                            detailLaporan?.fLaporan?.map((element,index) => {
                                <CImage key={index} src={element.foto.replace("localhost:4000", URL)} alt="" id="img" className="img imageCenter" width="250" height="200"/>
                            })
                        }
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
