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

const getDLaporanKetuaArmada = gql`
  query getDLaporanKetuaArmada(
    $id: String 
  ){
    getDLaporanKetuaArmada(
      id: $id
    ){
      id merkBarang tipeBarang ukuranBarang jumlahBarang satuanBarang
    }
  }
`;

export default function DetailArmada(props) {
    let history = useHistory();
    const location = useLocation();
    const [dataLaporan, setDataLaporan] = useState([]);
    const { loading, data, refetch} = useQuery(getDLaporanKetuaArmada,{
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
    }else if(data.getDLaporanKetuaArmada === null){
        dataDetail.push(<p key={0}>Tidak ada Detail Laporan</p>)
    }else if(data.getDLaporanKetuaArmada !== null){
        dataDetail.push(
            <Row key={0} className="justify-content-center">
                <Col className="col-md-12">
                    <h3 className="subJudul">Detail Barang Yang Diantarkan:</h3>
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
                                data.getDLaporanKetuaArmada.map((laporan,index) =>(
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
                <Col><h1 className="text-center">Master Laporan Detail</h1></Col>
            </Row>
            <Row className="bg-white py-5 justify-content-md-center">
                <Col className="col-md-6">
                    <Card>
                        <Card.Header className="subJudul">Detail Laporan</Card.Header>
                        <Card.Body>
                            <Card.Text>
                                <div className="parent">
                                    <p className="childLeft">Nota</p>
                                        <p className="childRight">: {dataLaporan.idNota}</p>
                                    <p className="childLeft">Tanggal Laporan</p>
                                        <p className="childRight">: {dayjs(dataLaporan.createdAt).format('DD-MM-YYYY HH:mm:ss')}</p>
                                    <p className="childLeft">Penerima</p>
                                        <p className="childRight">: {dataLaporan.penerima}</p>
                                    <p className="childLeft">Armada</p>
                                        <p className="childRight">: {dataLaporan.armada?.idArmada}</p>
                                    <p className="childLeft">Stokist</p>
                                        <p className="childRight">: {dataLaporan.stokist?.idStokist}</p>
                                    <p className="childLeft">Supir</p>
                                        <p className="childRight">: {dataLaporan.supir?.idSupir}</p>
                                    <p className="childLeft">Kernet</p>
                                        <p className="childRight">: {dataLaporan.kernet?.idKernet}</p>
                                    <p className="childLeft">Keterangan</p>
                                        <p className="childRight">: {dataLaporan.keterangan}</p>
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
        </Container>
    )
}
