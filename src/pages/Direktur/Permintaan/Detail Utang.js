import React, {useState, Fragment, useEffect} from 'react'
import { Row, Col, Card, Container, Button, Form} from 'react-bootstrap';
import { gql, useQuery, useMutation, useLazyQuery} from '@apollo/client';
import dayjs from 'dayjs'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import ReactPaginate from 'react-paginate';
import CurrencyFormat from 'react-currency-format';
import { useLocation } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import * as BiIcons from 'react-icons/bi';


const getDetailPinjaman = gql`
query getDetailPinjaman(
    $id: String  
){
    getDetailPinjaman(
        id: $id
    ){
        totalPembayaran pembayaranKe lunas
  }
}
`;


export default function DetailPinjaman(props) {
    let history = useHistory();
    const location = useLocation();
    const [keterangan, setKeterangan] = useState("");
    const [dataLaporan, setDataLaporan] = useState([]);
    const { loading, data, refetch} = useQuery(getDetailPinjaman,{
        variables: {
            id: dataLaporan.id
        }
    });

    useEffect(() => {
        if(location.state !== undefined){
            setDataLaporan(location.state?.laporan)
        }
    }, [location])

    let dataKu= [];
    if(!data || loading){
        dataKu.push(<p key={0}>Memuat....</p>)
    }else if(data.getDetailPinjaman === null){
        dataKu.push(<p key={0}>Tidak ada Kontrak Karyawan</p>)
    }else if(data.getDetailPinjaman !== null){
        dataKu.push(
            <Row key={0} className="justify-content-center">
                <Col className="col-md-8">
                    <h3 className="text-center">Detail Gaji:</h3>
                    <Table className="tableKu" aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">No Pembayaran</TableCell>
                                <TableCell align="center">Jumlah Pembayaran</TableCell>
                                <TableCell align="center">Lunas</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                data.getDetailPinjaman.map((laporan,index) =>(
                                    <TableRow key={index}>
                                        <TableCell align="center">{laporan.pembayaranKe}</TableCell>
                                        <TableCell align="center">
                                            <CurrencyFormat displayType={'text'} value={laporan.totalPembayaran} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} />
                                        </TableCell>
                                        <TableCell component="th" scope="row" align="center">{
                                            laporan.lunas === true?
                                                <div className="badgeStatusAktifText">Lunas</div>:
                                                <div className="badgeStatusNonText">Belum</div>
                                        }</TableCell>
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
                    <BiIcons.BiArrowBack size="50" onClick={() => history.push({pathname: '/direktur/permintaan/permintaan pinjaman'})} className="iconBack"/>
                </Col>
            </Row>
            <Row className="bg-white py-5 justify-content-md-center">
                <Col>
                    <Card className="mx-auto" style={{width: '50%', textAlign: 'center'}}>
                        <Card.Header>Detail Pinjaman Karyawan</Card.Header>
                        <Card.Body>
                            <Card.Text>
                                <p>Nama Karyawan: {dataLaporan.karyawan?.nama}</p>
                                <p>Jumlah Pinjam: <CurrencyFormat displayType={'text'} value={dataLaporan.jumlahPinjam} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp'} /></p>
                                <p>Cicilan: {dataLaporan.cicilan}</p>
                                <p>Status Pembayaran: {dataLaporan.lunas === true?
                                                <div className="badgeStatusAktifText">Lunas</div>:
                                                <div className="badgeStatusNonText">Belum</div>}</p>
                                <p>Status: 
                                    {
                                        dataLaporan.status === 0?
                                            <div className="badgeStatusWaiting">Menunggu HRD</div>:
                                            dataLaporan.status === 1?
                                                <div className="badgeStatusWaiting">Menunggu Uang Diserahkan</div>:
                                                dataLaporan.status === 2?
                                                    <div className="badgeStatusNon">Selesai</div>:
                                                    dataLaporan.status === 4?
                                                    <div className="badgeStatusNon">Menunggu Verifikasi Penerima</div>:
                                                        <div className="badgeStatusNon">Di Tolak</div>
                                    }
                                </p>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col>
                    {dataKu}
                </Col>
            </Row>
        </Container>
    )
}
