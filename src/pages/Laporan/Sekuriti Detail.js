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

    let dataDetail= [];
    if(!data || loading){
        dataDetail.push(<p key={0}>Loading....</p>)
    }else if(data.getDLaporanSekuriti === null){
        dataDetail.push(<p key={0}>Tidak ada Detail Laporan</p>)
    }else if(data.getDLaporanSekuriti !== null){
        dataDetail.push(
            <Row key={0} className="justify-content-center">
                <Col className="col-md-6">
                    <h3 className="subJudul">Detail Laporan Absensi Dinas:</h3>
                    <Table className="tableKu" aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Nama</TableCell>
                                <TableCell align="center">Jam Masuk</TableCell>
                                <TableCell align="center">Jam Keluar</TableCell>
                                <TableCell align="center">Nomor HT</TableCell>
                                <TableCell align="center">Keterangan</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                data.getDLaporanSekuriti.dLaporanDinasSekuriti.map((laporan,index) =>(
                                    <TableRow key={index}>
                                        <TableCell component="th" scope="row" align="center">{laporan.namaPelapor}</TableCell>
                                        <TableCell component="th" scope="row" align="center">{laporan.jamMasuk}</TableCell>
                                        <TableCell component="th" scope="row" align="center">{laporan.jamKeluar}</TableCell>
                                        <TableCell component="th" scope="row" align="center">{laporan.noHT}</TableCell>
                                        <TableCell component="th" scope="row" align="center">{laporan.keterangan}</TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </Col>
                <Col className="col-md-6">
                    <h3 className="subJudul">Detail Laporan Inventaris:</h3>
                    <Table className="tableKu" aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Nama Pelapor</TableCell>
                                <TableCell align="center">Nama Barang</TableCell>
                                <TableCell align="center">Jumlah Barang</TableCell>
                                <TableCell align="center">Kondisi</TableCell>
                                <TableCell align="center">Keterangan</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                data.getDLaporanSekuriti.dLaporanInventarisSekuriti.map((laporan,index) =>(
                                    <TableRow key={index}>
                                        <TableCell component="th" scope="row" align="center">{laporan.namaPelapor}</TableCell>
                                        <TableCell component="th" scope="row" align="center">{laporan.namaBarang}</TableCell>
                                        <TableCell component="th" scope="row" align="center">{laporan.jumlahBarang}</TableCell>
                                        <TableCell component="th" scope="row" align="center">{laporan.kondisi === true? "Baik": "Tidak Baik"}</TableCell>
                                        <TableCell component="th" scope="row" align="center">{laporan.keterangan}</TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </Col>
                <Col className="col-md-12">
                    <h3 className="subJudul">Detail Laporan Mutasi:</h3>
                    <Table className="tableKu" aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Jam Laporan</TableCell>
                                <TableCell align="center">Nama Pelapor</TableCell>
                                <TableCell align="center">Uraian</TableCell>
                                <TableCell align="center">Keterangan</TableCell>
                                <TableCell align="center">Foto</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                data.getDLaporanSekuriti.dLaporanMutasiSekuriti.map((laporan,index) =>(
                                    <TableRow key={index}>
                                        <TableCell component="th" scope="row" align="center">{laporan.jamLaporan}</TableCell>
                                        <TableCell component="th" scope="row" align="center">{laporan.namaPelapor}</TableCell>
                                        <TableCell component="th" scope="row" align="center">{laporan.uraian}</TableCell>
                                        <TableCell component="th" scope="row" align="center">{laporan.keterangan}</TableCell>
                                        <TableCell component="th" scope="row" align="center">
                                            <CImage src={!laporan.foto ? "/default.png": laporan.foto} alt="" id="img" className="img" width="150" height="150"/>
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
                    <BiIcons.BiArrowBack size="50" onClick={() => history.goBack()} className="iconBack"/>
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
        </Container>
    )
}
