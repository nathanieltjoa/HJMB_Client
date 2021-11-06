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

const getDLaporanSales = gql`
query getDLaporanSales(
    $id: String  
){
    getDLaporanSales(
        id: $id
    ){
        namaToko foto keterangan jamMasuk jamKeluar createdAt
  }
}
`;

export default function DetailSales(props) {
    let history = useHistory();
    const location = useLocation();
    const [dataLaporan, setDataLaporan] = useState([]);
    const { loading, data, refetch} = useQuery(getDLaporanSales,{
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
    }else if(data.getDLaporanSales === null){
        dataDetail.push(<p key={0}>Tidak ada Detail Laporan</p>)
    }else if(data.getDLaporanSales !== null){
        dataDetail.push(
            <Row key={0} className="justify-content-center">
                <Col className="col-md-12">
                    <h3 className="subJudul">Detail Laporan:</h3>
                    <Table className="tableKu" aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Dokumentasi</TableCell>
                                <TableCell align="center">Nama Toko</TableCell>
                                <TableCell align="center">Jam Masuk</TableCell>
                                <TableCell align="center">Jam Keluar</TableCell>
                                <TableCell align="center">Keterangan</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                data.getDLaporanSales.map((laporan,index) =>(
                                    <TableRow key={index}>
                                        <TableCell component="th" scope="row" align="center">
                                            <CImage src={!laporan.foto ? "/defaultImage.png": laporan.foto.replace("localhost:4000", URL)} alt="" id="img" className="img" width="250" height="200"/>
                                        </TableCell>
                                        <TableCell component="th" scope="row" align="center">{laporan.namaToko}</TableCell>
                                        <TableCell component="th" scope="row" align="center">{laporan.jamMasuk}</TableCell>
                                        <TableCell component="th" scope="row" align="center">{laporan.jamKeluar}</TableCell>
                                        <TableCell component="th" scope="row" align="center">{laporan.keterangan}</TableCell>
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
                    <BiIcons.BiArrowBack size="50" onClick={() => history.push({pathname: '/laporan/sales'})} className="iconBack"/>
                </Col>
            </Row>
            <Row className="bg-white justify-content-center">
                <Col><h1 className="text-center">Master Laporan Sales</h1></Col>
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
                                        <p className="childRight">: {dayjs(dataLaporan.createdAt).format('DD-MM-YYYY HH:mm:ss')}</p>
                                    {
                                        dataLaporan.laporanKejadian === false? 
                                            null:
                                            <>
                                                <p className="childLeft">Keterangan Kejadian</p>
                                                    <p className="childRight">: {dataLaporan.keteranganKejadian}</p>
                                                <p className="childLeft">Feedback Karyawan</p>
                                                    <p className="childRight">: {dataLaporan.feedbackKaryawan}</p>
                                            </>
                                    }
                                </div>
                                <div className="tagPInRow">
                                    <p className="tagPTextLeft">Status: 
                                        {
                                            dataLaporan.status === 1? 
                                                <div className="badgeStatusWaiting">Menunggu Verifikasi</div>:
                                                    <div className="badgeStatusAktif">Terverifikasi</div>
                                        }
                                    </p>
                                    <p className="tagPTextLeft">Laporan Kejadian:
                                        {dataLaporan.laporanKejadian === true? 
                                            <div className="badgeStatusNon">Ada</div>:
                                                <div className="badgeStatusAktif">Tidak Ada</div>}
                                    </p>
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
        </Container>
    )
}
