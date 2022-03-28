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

const getDLaporanRusak = gql`
  query getDLaporanRusak(
    $id: String
  ){
    getDLaporanRusak(
      id: $id
    ){
        jumlah barang{
            jenisBarang merkBarang tipeBarang ukuranBarang satuanBarang
        }
    }
  }
`

export default function DetailRusak(props) {
    let history = useHistory();
    const location = useLocation();
    const [dataLaporan, setDataLaporan] = useState([]);
    const [newUri, setNewUri] = useState("");
    const { loading, data, refetch} = useQuery(getDLaporanRusak,{
        variables: {
            id: dataLaporan?.id
        }
    });

    useEffect(() => {
        if(location.state !== undefined){
            setDataLaporan(location.state?.laporan)
        }
    }, [location])

    let dataDetail= [];
    if(!data || loading){
        dataDetail.push(<p key={0}>Memuat....</p>)
    }else if(data.getDLaporanRusak === null){
        dataDetail.push(<p key={0}>Tidak ada Detail Laporan</p>)
    }else if(data.getDLaporanRusak !== null){
        dataDetail.push(
                <Col className="col-md-12">
                    <h3 className="subJudul">Detail Pipa:</h3>
                    <div className='tableContainer'>
                        <table size='string' className="table" aria-label="simple table">
                            <thead>
                                <tr>
                                    <th>Jenis Barang</th>
                                    <th>Barang</th>
                                    <th>Jumlah</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    data.getDLaporanRusak.map((laporan,index) =>(
                                        <tr key={index} >
                                            <td data-label="Jenis Barang">{laporan.barang.jenisBarang}</td>
                                            <td data-label="Barang">{laporan.barang.merkBarang} {laporan.barang.tipeBarang} {laporan.barang.ukuranBarang}</td>
                                            <td data-label="Jumlah">{laporan.jumlah} {laporan.barang.satuanBarang}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </Col>
        )
    }
    
    
    return (
        <Container className="containerKu">
            <Row>
                <Col>
                    <BiIcons.BiArrowBack size="50" onClick={() => history.push({pathname: '/laporan/pipa rusak'})} className="iconBack"/>
                </Col>
            </Row>
            <Row className="bg-white justify-content-center">
                <Col><h1 className="text-center">Master Laporan Pipa Rusak</h1></Col>
            </Row>
            <Row className="bg-white py-5 justify-content-md-center">
                <Col className="col-md-6">
                    <Card>
                        <Card.Header className="subJudul">Detail Laporan</Card.Header>
                        <Card.Body>
                            <Card.Text className="parent">
                                <p className="childLeft">Nama Pelapor</p>
                                    <p className="childRight">: {dataLaporan.karyawan?.nama}</p>
                                <p className="childLeft">Tanggal Laporan</p>
                                    <p className="childRight">: {dayjs(dataLaporan.tanggalLaporan).format('DD-MM-YYYY')}</p>
                                <p className="childLeft">Keterangan</p>
                                    <p className="childRight">: {dataLaporan.keterangan}</p>
                            </Card.Text>
                            {dataLaporan?.foto === undefined ? null :
                                dataLaporan.foto === "-"? null: <img src={dataLaporan?.foto.replace("localhost:4000", URL)} alt="" id="img" className="img" width="250" height="200"/> }
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="justify-content-center">
                {dataDetail}
            </Row>
        </Container>
    )
}
