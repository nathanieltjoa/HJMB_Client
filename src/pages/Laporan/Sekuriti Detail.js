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

const getDLaporanSekuriti = gql`
query getDLaporanSekuriti(
  $id: String 
){
    getDLaporanSekuriti(
    id: $id
  ){
    dLaporanDinasSekuriti{
        namaPelapor jamMasuk jamKeluar noHT keterangan
    } dLaporanInventarisSekuriti{
        namaPelapor namaBarang jumlahBarang baik keterangan
    } dLaporanMutasiSekuriti{
        namaPelapor jamLaporan uraian foto keterangan
    }
  }
}
`;

export default function DetailSekuriti(props) {
    let history = useHistory();
    const location = useLocation();
    const [dataLaporan, setDataLaporan] = useState([]);
    const [newUri, setNewUri] = useState("");
    const [visible, setVisible] = useState(false);
    const { loading, data, refetch} = useQuery(getDLaporanSekuriti,{
        variables: {
            id: dataLaporan.id
        }
    });

    useEffect(() => {
        if(location.state !== undefined){
            setDataLaporan(location.state?.laporan)
        }
    }, [location])

    const goToDetail = (dokumentasi) => {
        const fileImage = dokumentasi;
        setNewUri(fileImage.replace("localhost:4000", URL))
        //setNewUri(fileImage)
        setVisible(true);
    }

    let dataDetail= [];
    if(!data || loading){
        dataDetail.push(<p key={0}>Memuat....</p>)
    }else if(data.getDLaporanSekuriti === null){
        dataDetail.push(<p key={0}>Tidak ada Detail Laporan</p>)
    }else if(data.getDLaporanSekuriti !== null){
        dataDetail.push(
            <Row key={0} className="justify-content-center">
                <Col className="col-md-6">
                    <h3 className="subJudul">Detail Laporan Absensi Dinas:</h3>
                    <div className='tableContainer'>
                        <table size='string' className="table" aria-label="simple table">
                            <thead>
                                <tr>
                                    <th>Nama</th>
                                    <th>Jam Masuk</th>
                                    <th>Jam Keluar</th>
                                    <th>Nomor HT</th>
                                    <th>Keterangan</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    data.getDLaporanSekuriti.dLaporanDinasSekuriti.map((laporan,index) =>(
                                        <tr key={index} >
                                            <td data-label="Nama">
                                            {laporan.namaPelapor}
                                            </td>
                                            <td data-label="Jam Masuk">{laporan.jamMasuk}</td>
                                            <td data-label="Jam Keluar">{laporan.jamKeluar}</td>
                                            <td data-label="No HT">{laporan.noHT}</td>
                                            <td data-label="Keterangan">{laporan.keterangan}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </Col>
                <Col className="col-md-6">
                    <h3 className="subJudul">Detail Laporan Inventaris:</h3>
                    <div className='tableContainer'>
                        <table size='string' className="table" aria-label="simple table">
                            <thead>
                                <tr>
                                    <th>Nama Pelapor</th>
                                    <th>Nama Barang</th>
                                    <th>Jumlah Barang</th>
                                    <th>Kondisi</th>
                                    <th>Keterangan</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    data.getDLaporanSekuriti.dLaporanInventarisSekuriti.map((laporan,index) =>(
                                        <tr key={index} >
                                            <td data-label="Pelapor">
                                                {laporan.namaPelapor}
                                            </td>
                                            <td data-label="Nama Barang">{laporan.namaBarang}</td>
                                            <td data-label="Jumlah Barang">{laporan.jumlahBarang}</td>
                                            <td data-label="Kondisi">{laporan.baik === true? "Baik": "Tidak Baik"}</td>
                                            <td data-label="Keterangan">{laporan.keterangan}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </Col>
                <Col className="col-md-12">
                    <h3 className="subJudul">Detail Laporan Mutasi:</h3>
                    <div className='tableContainer'>
                        <table size='string' className="table" aria-label="simple table">
                            <thead>
                                <tr>
                                    <th>Jam Laporan</th>
                                    <th>Nama Pelapor</th>
                                    <th>Uraian</th>
                                    <th>Keterangan</th>
                                    <th>#</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    data.getDLaporanSekuriti.dLaporanMutasiSekuriti.map((laporan,index) =>(
                                        <tr key={index} >
                                            <td data-label="Jam Laporan">
                                                {laporan.jamLaporan}
                                            </td>
                                            <td data-label="Nama">{laporan.namaPelapor}</td>
                                            <td data-label="Uraian">{laporan.uraian}</td>
                                            <td data-label="Keterangan">{laporan.keterangan}</td>
                                            <td data-label="#">
                                                <Button variant="info" onClick={() => goToDetail(laporan.foto)}>
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
                    <BiIcons.BiArrowBack size="50" onClick={() => history.push({pathname: '/laporan/sekuriti'})} className="iconBack"/>
                </Col>
            </Row>
            <Row className="bg-white justify-content-center">
                <Col><h1 className="text-center">Master Laporan Sekuriti</h1></Col>
            </Row>
            <Row className="bg-white py-5 justify-content-md-center">
                <Col className="col-md-6">
                    <Card>
                        <Card.Header className="subJudul">Detail Laporan</Card.Header>
                        <Card.Body>
                            <Card.Text className="parent">
                                <p className="childLeft">Gudang</p>
                                    <p className="childRight">: {dataLaporan.gudang?.namaGudang}</p>
                                <p className="childLeft">Shift</p>
                                    <p className="childRight">: {dataLaporan.shift}</p>
                                <p className="childLeft">Nama Ketua</p>
                                    <p className="childRight">: {dataLaporan.ketua?.nama}</p>
                                <p className="childLeft">Nama Penyerah</p>
                                    <p className="childRight">: {dataLaporan.penyerah?.nama}</p>
                                <p className="childLeft">Nama Penerima</p>
                                    <p className="childRight">: {dataLaporan.penerima?.nama}</p>
                                <p className="childLeft">Tanggal Laporan</p>
                                    <p className="childRight">: {dayjs(dataLaporan.tanggalLaporan).format('DD-MM-YYYY')}</p>
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
                    <Modal.Title className="judul">Dokumentasi</Modal.Title>
                </Modal.Header>
                    <Modal.Body>
                    {console.log(newUri.toString().substr(newUri.toString().lastIndexOf('.'), newUri.toString().length))}
                    {
                        newUri.toString().substr(newUri.toString().lastIndexOf('.'), newUri.toString().length) === ".mp4"?
                        <video style={{width: '100%', height: 500}} controls>
                            <source src={newUri} type="video/mp4"/>
                        </video>
                        :
                        <CImage src={newUri} alt="" id="img" className="img imageCenter" width="250" height="200"/>
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
