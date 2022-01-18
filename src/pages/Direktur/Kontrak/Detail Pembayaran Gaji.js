import React, {useState, Fragment, useEffect} from 'react'
import { Row, Col, Card, Container, Button} from 'react-bootstrap';
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
import * as BiIcons from 'react-icons/bi';
import { useHistory } from 'react-router-dom';


const getDetailPembayaranGaji = gql`
query getDetailPembayaranGaji(
    $id: String  
){
    getDetailPembayaranGaji(
        id: $id
    ){
        nama total pengurangan keterangan
  }
}
`;


export default function DetailKontrak(props) {
    let history = useHistory();
    const location = useLocation();
    const [dataLaporan, setDataLaporan] = useState([]);
    const { loading, data, refetch} = useQuery(getDetailPembayaranGaji,{
        variables: {
            id: dataLaporan.id
        }
    });


    useEffect(() => {
        if(location.state !== undefined){
            console.log(location.state?.laporan)
            setDataLaporan(location.state?.laporan)
        }
    }, [location])

    let dataDetailKontrak= [];
    if(data){
        console.log("data");
        console.log(data);
    }
    if(!data || loading){
        dataDetailKontrak.push(<p key={0}>Memuat....</p>)
    }else if(data.getDetailPembayaranGaji.length === 0){
        dataDetailKontrak.push(<p key={0}>Tidak ada Slip Gaji Karyawan</p>)
    }else if(data.getDetailPembayaranGaji.length > 0 ){
        dataDetailKontrak.push(
            <Row key={0} className="justify-content-center">
                <Col className="col-md-8">
                    <h3 className="text-center">Detail Slip:</h3>
                    <Table className="tableKu" aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Nama</TableCell>
                                <TableCell align="center">Keterangan</TableCell>
                                <TableCell align="center">Total</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                data.getDetailPembayaranGaji.map((laporan,index) =>(
                                    <TableRow key={index}>
                                        <TableCell component="th" scope="row" align="center">{laporan.nama}</TableCell>
                                        <TableCell component="th" scope="row" align="center">{laporan.keterangan}</TableCell>
                                        <TableCell component="th" scope="row" align="center">
                                            <div className={laporan.pengurangan === true? "badgeStatusNon": "badgeStatusAktif"}>
                                                {laporan.pengurangan === true? "-":null} <CurrencyFormat displayType={'text'} value={laporan.total} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} />
                                            </div>
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
                    <BiIcons.BiArrowBack size="50" onClick={() => history.push({pathname: '/direktur/kontrak/master pembayaran gaji'})} className="iconBack"/>
                </Col>
            </Row>
            <Row className="bg-white justify-content-center">
                <Col><h1 className="text-center">Master Pembayaran Gaji</h1></Col>
            </Row>
            <Row className="bg-white py-5 justify-content-md-center">
                <Col className="col-md-6">
                    <Card>
                        <Card.Header className="subJudul">Slip Gaji</Card.Header>
                        <Card.Body>
                            <Card.Text>
                                <div className="parent">
                                    <p className="childLeft">Nama Karyawan</p>
                                        <p className="childRight">: {dataLaporan.kontrak?.karyawan?.nama}</p>
                                    <p className="childLeft">Jenis Kontrak</p>
                                        <p className="childRight">: {dataLaporan.kontrak?.jenisKontrak}</p>
                                    <p className="childLeft">Masa Kontrak
                                    </p>
                                        <p className="childRight">: {
                                            dayjs(dataLaporan.kontrak?.tanggalMulai).format("DD-MM-YYYY")
                                        } - {
                                            dayjs(dataLaporan.kontrak?.tanggalBerakhir).format("DD-MM-YYYY")
                                        }
                                    </p>
                                    <p className="childLeft">Total Gaji</p>
                                        <p className="childRight">: <CurrencyFormat displayType={'text'} value={dataLaporan.totalGaji} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp'} /></p>
                                    <p className="childLeft">Tanggal Pembayaran</p>
                                        <p className="childRight">: {
                                            dataLaporan.status === 4 ? 
                                            dayjs(dataLaporan.tanggalPembayaran).format("DD-MM-YYYY"): 
                                                dataLaporan.status === 2?
                                                dayjs(dataLaporan.tanggalPembayaran).format("DD-MM-YYYY"):
                                                "-"
                                        }
                                        </p>
                                    <p className="childLeft">HRD</p>
                                        <p className="childRight">: {dataLaporan.hrd?.nama}</p>
                                    <p className="childLeft">Keuangan</p>
                                        <p className="childRight">: {dataLaporan.keuangan?.nama}</p>
                                </div>
                                <p className="text-center statusKu">Status:
                                    {
                                        dataLaporan.status === 0?
                                            <p key={0} className="badgeStatusWaiting">Menunggu Verifikasi HRD</p>:
                                            dataLaporan.status === 1?
                                                <p key={0} className="badgeStatusWaiting">Menunggu Pembayaran</p>:
                                                    dataLaporan.status === 2?
                                                    <p key={0} className="badgeStatusAktif">Selesai</p>:
                                                    dataLaporan.status === 3?
                                                        <p key={0} className="badgeStatusNon">Dibatalkan</p>:
                                                        <p key={0} className="badgeStatusWaiting">Menunggu Verifikasi Penerimaan</p>
                                    }
                                </p>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col>
                    {dataDetailKontrak}
                </Col>
            </Row>
        </Container>
    )
}
