import React, {useEffect, useState} from 'react'
import { Row, Col, Card, Container} from 'react-bootstrap';
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

const getULaporanCatTegel = gql`
  query getULaporanCatTegel(
    $id: String 
  ){
    getULaporanCatTegel(
      id: $id
    ){
      id namaBahan jumlahBahan satuanBahan
    }
  }
`;

export default function DetailCatTegel(props) {
    let history = useHistory();
    const location = useLocation();
    const [dataLaporan, setDataLaporan] = useState([]);
    const { loading, data, refetch} = useQuery(getULaporanCatTegel,{
        variables: {
            id: dataLaporan.id
        }
    });

    useEffect(() => {
        if(location.state !== undefined){
            setDataLaporan(location.state?.laporan)
        }
    }, [location])

    let dataDetail= [];
    if(!data || loading){
        dataDetail.push(<p key={0}>Loading....</p>)
    }else if(data.getULaporanCatTegel === null){
        dataDetail.push(<p key={0}>Tidak ada Detail Laporan</p>)
    }else if(data.getULaporanCatTegel !== null){
        dataDetail.push(
            <Row key={0} className="justify-content-center">
                <Col className="col-md-12">
                    <h3 className="subJudul">Detail Laporan:</h3>
                    <Table className="tableKu" aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">No.</TableCell>
                                <TableCell align="center">Nama Bahan</TableCell>
                                <TableCell align="center">Jumlah Bahan</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                data.getULaporanCatTegel.map((laporan,index) =>(
                                    <TableRow key={index}>
                                        <TableCell component="th" scope="row" align="center">{index+1}</TableCell>
                                        <TableCell component="th" scope="row" align="center">{laporan.namaBahan}</TableCell>
                                        <TableCell component="th" scope="row" align="center">{laporan.jumlahBahan} {laporan.satuanBahan}</TableCell>
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
                    <BiIcons.BiArrowBack size="50" onClick={() => history.goBack()} className="iconBack"/>
                </Col>
            </Row>
            <Row className="bg-white justify-content-center">
                <Col><h1 className="text-center">Master Laporan Cat Tegel</h1></Col>
            </Row>
            <Row className="bg-white py-5 justify-content-md-center">
                <Col className="col-md-6">
                    <Card>
                        <Card.Header className="subJudul">Detail Laporan</Card.Header>
                        <Card.Body>
                            <Card.Text>
                                <div className="parent">
                                    <p className="childLeft">Nama Pelapor</p>
                                        <p className="childRight">: {dataLaporan.hLaporanCatTegel?.karyawan.nama}</p>
                                    <p className="childLeft">Jenis Produk</p>
                                        <p className="childRight">: {dataLaporan.hLaporanCatTegel?.jenisProduk}</p>
                                    <p className="childLeft">Tanggal Laporan</p>
                                        <p className="childRight">: {dayjs(dataLaporan.createdAt).format('DD-MM-YYYY HH:mm:ss')}</p>
                                    <p className="childLeft">Merk</p>
                                        <p className="childRight">: {dataLaporan.merkProduk}</p>
                                    <p className="childLeft">Warna</p>
                                        <p className="childRight">: {dataLaporan.warna}</p>
                                    <p className="childLeft">Jumlah Produk</p>
                                        <p className="childRight">: {dataLaporan.jumlahProduk} {dataLaporan.satuanProduk}</p>
                                    <p className="childLeft">Keterangan</p>
                                        <p className="childRight">: {dataLaporan.keterangan}</p>
                                </div>
                                <p className="subJudul">Dokumentasi: </p>
                                <CImage src={!dataLaporan.foto ? "/default.png": dataLaporan.foto} alt="" id="img" className="img imageCenter" width="250" height="200"/>
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
        </Container>
    )
}
