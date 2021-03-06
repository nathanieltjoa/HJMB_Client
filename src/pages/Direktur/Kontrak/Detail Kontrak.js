import React, {useState, Fragment, useEffect} from 'react'
import { Row, Col, Card, Container, Button} from 'react-bootstrap';
import { gql, useQuery, useMutation, useLazyQuery} from '@apollo/client';
import dayjs from 'dayjs'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CurrencyFormat from 'react-currency-format';
import { useLocation } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import * as BiIcons from 'react-icons/bi';


const getDetailKontrak = gql`
query getDetailKontrak(
    $id: String  
){
    getDetailKontrak(
        id: $id
    ){
        dKontrakGaji{
            total dKontrakIndexGaji{
                namaGaji
            }
        }
        dKontrakIuran{
            total dKontrakIndexIuran{
                namaIuran
            }
        }
  }
}
`;

export default function DetailKontrak(props) {
    let history = useHistory();
    const location = useLocation();
    const [dataLaporan, setDataLaporan] = useState([]);
    const { loading, data, refetch} = useQuery(getDetailKontrak,{
        variables: {
            id: dataLaporan.id
        }
    });

    useEffect(() => {
        if(location.state !== undefined){
            setDataLaporan(location.state?.laporan)
        }
    }, [location])

    let dataDetailKontrak= [];
    if(!data || loading){
        dataDetailKontrak.push(<p key={0}>Memuat....</p>)
    }else if(data.getDetailKontrak === null){
        dataDetailKontrak.push(<p key={0}>Tidak ada Kontrak Karyawan</p>)
    }else if(data.getDetailKontrak !== null){
        dataDetailKontrak.push(
            <Row key={0} className="justify-content-center">
                <Col className="col-md-4">
                    <h3 className="text-center">Detail Gaji:</h3>
                    <div className='tableContainer'>
                        <table size='string' className="table" aria-label="simple table">
                            <thead>
                                <tr>
                                    <th>Nama Gaji</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    data.getDetailKontrak.dKontrakGaji.map((laporan,index) =>(
                                        <tr key={index} >
                                            <td data-label="Nama Gaji">{laporan.dKontrakIndexGaji.namaGaji}</td>
                                            <td data-label="Total">
                                            <CurrencyFormat displayType={'text'} value={laporan.total} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} />
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </Col>
                <Col className="col-md-4">
                    <h3 className="text-center">Detail Iuran:</h3>
                    <div className='tableContainer'>
                        <table size='string' className="table" aria-label="simple table">
                            <thead>
                                <tr>
                                    <th>Nama Iuran</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    data.getDetailKontrak.dKontrakIuran.map((laporan,index) =>(
                                        <tr key={index} >
                                            <td data-label="Nama Iuran">{laporan.dKontrakIndexIuran.namaIuran}</td>
                                            <td data-label="Total">
                                            <CurrencyFormat displayType={'text'} value={laporan.total} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} />
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
                    <BiIcons.BiArrowBack size="50" onClick={() => history.push({pathname: '/direktur/kontrak/master kontrak'})} className="iconBack"/>
                </Col>
            </Row>
            <Row className="bg-white justify-content-center">
                <Col><h1 className="text-center">Master Kontrak Karyawan</h1></Col>
            </Row>
            <Row className="bg-white py-5 justify-content-md-center">
                <Col className="col-md-6">
                    <Card>
                        <Card.Header className="subJudul">Kontrak Karyawan</Card.Header>
                        <Card.Body>
                            <Card.Text>
                                <div className="parent">
                                    <p className="childLeft">Nama Karyawan</p>
                                        <p className="childRight">: {dataLaporan.karyawan?.nama}</p>
                                    <p className="childLeft">Jenis Kontrak</p>
                                        <p className="childRight">: {dataLaporan.jenisKontrak}</p>
                                    <p className="childLeft">Total Gaji</p>
                                        <p className="childRight">: <CurrencyFormat displayType={'text'} value={dataLaporan.totalGaji} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp'} /></p>
                                    <p className="childLeft">Total Iuran</p>
                                        <p className="childRight">: <CurrencyFormat displayType={'text'} value={dataLaporan.totalIuran} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp'} /></p>
                                    <p className="childLeft">Tanggal Mulai</p>
                                        <p className="childRight">: {dayjs(dataLaporan.tanggalMulai).format('DD-MM-YYYY')}</p>
                                    <p className="childLeft">Tanggal Berakhir</p>
                                        <p className="childRight">: {dayjs(dataLaporan.tanggalBerakhir).format('DD-MM-YYYY')}</p>
                                </div>
                                <p className="text-center statusKu">Status:
                                    {
                                        dataLaporan.status === 0? 
                                            <div className="badgeStatusWaiting">Menunggu Persetujuan</div>: 
                                            dataLaporan.status === 1? 
                                                <div className="badgeStatusAktif">Di Setujui</div>: 
                                                dataLaporan.status === 2? 
                                                <div className="badgeStatusNon">Di Tolak</div>:
                                                    <div className="badgeStatusNon">Di Batalkan</div>
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
