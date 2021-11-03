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

const getDLaporanQualityControlPipa = gql`
query getDLaporanQualityControlPipa(
  $HLaporanQualityControlPipaId: String 
){
  getDLaporanQualityControlPipa(
    HLaporanQualityControlPipaId: $HLaporanQualityControlPipaId
  ){
    diameter panjang berat foto status pernahBanding keteranganBanding jamLaporan keterangan
  }
}
`;

export default function DetailQualityControlPipa(props) {
    let history = useHistory();
    const location = useLocation();
    const [dataLaporan, setDataLaporan] = useState([]);
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

    let dataDetail= [];
    if(!data || loading){
        dataDetail.push(<p key={0}>Loading....</p>)
    }else if(data.getDLaporanQualityControlPipa === null){
        dataDetail.push(<p key={0}>Tidak ada Detail Laporan</p>)
    }else if(data.getDLaporanQualityControlPipa !== null){
        console.log(data.getDLaporanQualityControlPipa)
        dataDetail.push(
            <Row key={0} className="justify-content-center">
                <Col className="col-md-12">
                    <h3 className="subJudul">Detail Laporan:</h3>
                    <Table className="tableKu" aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Jam Laporan</TableCell>
                                <TableCell align="center">Diameter</TableCell>
                                <TableCell align="center">Panjang</TableCell>
                                <TableCell align="center">Berat</TableCell>
                                <TableCell align="center">Keterangan</TableCell>
                                <TableCell align="center">Status</TableCell>
                                <TableCell align="center">Banding</TableCell>
                                <TableCell align="center">Keterangan Banding</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                data.getDLaporanQualityControlPipa.map((laporan,index) =>(
                                    <TableRow key={index}>
                                        <TableCell component="th" scope="row" align="center">{laporan.jamLaporan}</TableCell>
                                        <TableCell component="th" scope="row" align="center">{laporan.diameter}</TableCell>
                                        <TableCell component="th" scope="row" align="center">{laporan.panjang}</TableCell>
                                        <TableCell component="th" scope="row" align="center">{laporan.berat}</TableCell>
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
                                    <p className="childLeft">Tipe Mesin</p>
                                        <p className="childRight">: {dataLaporan.tipeMesin}</p>
                                    <p className="childLeft">Merk</p>
                                        <p className="childRight">: {dataLaporan.merk}</p>
                                    <p className="childLeft">Panjang</p>
                                        <p className="childRight">: {dataLaporan.panjang}</p>
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
        </Container>
    )
}