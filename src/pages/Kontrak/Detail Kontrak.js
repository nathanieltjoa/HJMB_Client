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

const updateStatusKontrakMaster = gql`
    mutation updateStatusKontrakMaster(
        $status: Boolean
        $id: String 
  ) {
    updateStatusKontrakMaster(
        status: $status
        id: $id
    ) {
        id
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
            console.log(location.state?.laporan)
            setDataLaporan(location.state?.laporan)
        }
    }, [location])

    let dataDetailKontrak= [];
    if(!data || loading){
        dataDetailKontrak.push(<p key={0}>Loading....</p>)
    }else if(data.getDetailKontrak === null){
        dataDetailKontrak.push(<p key={0}>Tidak ada Kontrak Karyawan</p>)
    }else if(data.getDetailKontrak !== null){
        dataDetailKontrak.push(
            <Row key={0} className="justify-content-center">
                <Col className="col-md-4">
                    <h3 className="text-center">Detail Gaji:</h3>
                    <Table className="tableKu" aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Nama Gaji</TableCell>
                                <TableCell align="center">Total</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                data.getDetailKontrak.dKontrakGaji.map((laporan,index) =>(
                                    <TableRow key={index}>
                                        <TableCell component="th" scope="row" align="center">{laporan.dKontrakIndexGaji.namaGaji}</TableCell>
                                        <TableCell component="th" scope="row" align="center">
                                            <CurrencyFormat displayType={'text'} value={laporan.total} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} />
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </Col>
                <Col className="col-md-4">
                    <h3 className="text-center">Detail Iuran:</h3>
                    <Table className="tableKu" aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Nama Iuran</TableCell>
                                <TableCell align="center">Total</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                data.getDetailKontrak.dKontrakIuran.map((laporan,index) =>(
                                    <TableRow key={index}>
                                        <TableCell component="th" scope="row" align="center">{laporan.dKontrakIndexIuran.namaIuran}</TableCell>
                                        <TableCell component="th" scope="row" align="center">
                                        <CurrencyFormat displayType={'text'} value={laporan.total} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} />
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
    const [updateStatusIndexKu] = useMutation(updateStatusKontrakMaster,{
        update(_,res){
            console.log(res)
        },
        onError: (err) => {
            console.log(err)
            alert(err.graphQLErrors[0].extensions.errors);
        },
        onCompleted(data){
            history.push({
                pathname: '/kontrak/master kontrak'
            });
        }
    })

    const updateStatus = (status) =>{
        updateStatusIndexKu({
            variables: {
                id: dataLaporan.id,
                status: status
            }
        })
    }
    
    
    return (
        <Container className="containerKu">
            <Row>
                <Col>
                    <BiIcons.BiArrowBack size="50" onClick={() => history.push({pathname: '/kontrak/master kontrak'})} className="iconBack"/>
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
                                {
                                    dataLaporan.status !== 0? null:
                                    <div className="text-center">
                                        <Button className="text-center" variant="danger" onClick={() => updateStatus(false)}>
                                            Batalkan Kontrak
                                        </Button>
                                    </div>
                                }
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
