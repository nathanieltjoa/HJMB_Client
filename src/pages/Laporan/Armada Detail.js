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
        dataDetail.push(<p key={0}>Memuat....</p>)
    }else if(data.getDLaporanMasterArmada === null){
        dataDetail.push(<p key={0}>Tidak ada Detail Laporan</p>)
    }else if(data.getDLaporanMasterArmada !== null){
        dataDetail.push(
            <Row key={0} className="justify-content-center">
                <Col className="col-md-12">
                    <h3 className="subJudul">Detail Pengiriman:</h3>
                    <div className='tableContainer'>
                        <table size='string' className="table" aria-label="simple table">
                            <thead>
                                <tr>
                                    <th>ID Nota</th>
                                    <th>Penerima</th>
                                    <th>Keterangan</th>
                                    <th>Status</th>
                                    <th>#</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    data.getDLaporanMasterArmada.map((laporan,index) =>(
                                        <tr key={index} >
                                            <td data-label="Nota">{laporan.idNota}</td>
                                            <td data-label="Penerima">{laporan.penerima === ""? "-": laporan.penerima}</td>
                                            <td data-label="Keterangan">{laporan.keterangan === ""? "-": laporan.keterangan}</td>
                                            <td data-label="Status">{laporan.diBatalkan === true? 
                                                <div className="badgeStatusNon">Di Batalkan</div>:
                                                <div className="badgeStatusAktif">Aman</div>}</td>
                                            <td data-label="#">
                                                <Button variant="info" onClick={() => goToDetail(laporan)}>
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
                        <div className='tableContainer' style={{marginTop: '10px'}}>
                            <table size='string' className="table" aria-label="simple table">
                                <thead>
                                    <tr>
                                        <th>No.</th>
                                        <th>Merk</th>
                                        <th>Tipe Barang</th>
                                        <th>Ukuran Barang</th>
                                        <th>Jumlah Barang</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        dataUraian.uLaporan?.map((laporan,index) =>(
                                            <tr key={index} >
                                                <td data-label="No">{index+1}</td>
                                                <td data-label="Merk">{laporan.merkBarang}</td>
                                                <td data-label="Tipe">{laporan.tipeBarang}</td>
                                                <td data-label="Ukuran">{laporan.ukuranBarang}</td>
                                                <td data-label="Jumlah">{laporan.jumlahBarang} {laporan.satuanBarang}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
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
