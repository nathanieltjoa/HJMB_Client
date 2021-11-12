import React, {useEffect} from 'react'
import { Row, Col, Card, Button, Form, Container} from 'react-bootstrap';
import { gql, useQuery} from '@apollo/client';
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
import { useHistory } from 'react-router-dom';
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useState } from 'react';


const getListIzinPribadiHRD = gql`
query getListIzinPribadiHRD(
    $page: Int 
    $limit: Int 
    $status: Int 
){
    getListIzinPribadiHRD(
    page: $page
    limit: $limit 
    status: $status
  ){
    count rows{
        id peminta{nama} status tanggalMulai tanggalBerakhir totalHari keterangan alasan upload ketua{nama} izin{
            namaIzin totalIzin
        }
    }
  }
}
`;

export default function DaftarIzinPribadi(props) {
    let history = useHistory();
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(5);
    const [status, setStatus] = useState(-1);
    const { 
        loading: loadingPermintaan, 
        data: dataPermintaan, 
        refetch: refetchPermintaan } = useQuery(getListIzinPribadiHRD,{
        variables: {
            page: parseInt(page),
            limit: parseInt(limit),
            status: parseInt(status),
        }
    });

    const changePage = ({ selected }) => {
        setPage(selected)
    }

    const goToDetail = (laporan) => {
        history.push({
            pathname: '/izin/detail izin pribadi',
            state: { laporan: laporan }
        });
    }
    let pageKu = [];
    if(dataPermintaan === undefined || loadingPermintaan){
        pageKu.push(<p key={0}>Loading...</p>)
    }else if(dataPermintaan.getListIzinPribadiHRD.count){
      var jml = Math.ceil(dataPermintaan.getListIzinPribadiHRD.count / limit);
      pageKu.push(
        <ReactPaginate
          key={1}
          previousLabel={'previous'}
          nextLabel={'next'}
          breakLabel={'...'}
          breakClassName={'break-me'}
          pageCount={jml}
          forcePage={page}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={(selected) => changePage(selected)}
          containerClassName={"paginationBttns"}
          previousLinkClassName={"previousBttn"}
          nextLinkClassName={"nextBttn"}
          disabledClassName={"paginationDisabled"}
          activeClassName={"paginationActive"}
        />
      )
    }
    let dataKu = [];
    let counter = false;
    if(!dataPermintaan || loadingPermintaan){
        dataKu.push(<p className="badgeStatusWaitingText">Loading...</p>)
    }else if(dataPermintaan.getListIzinPribadiHRD.rows.length === 0){
        dataKu.push(<p className="badgeStatusNonText">Tidak Ada Permintaan Dari Karyawan</p>)
    }else if(dataPermintaan.getListIzinPribadiHRD.rows.length > 0 && !counter){
        dataKu.push(
            <TableContainer component={Paper} key={0}>
                <Table className="tableKu" aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Izin</TableCell>
                            <TableCell align="center">Tanggal Mulai</TableCell>
                            <TableCell align="center">Tanggal Berakhir</TableCell>
                            <TableCell align="center">Total</TableCell>
                            <TableCell align="center">Status</TableCell>
                            <TableCell align="center">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            dataPermintaan.getListIzinPribadiHRD.rows.map((laporan,index) =>(
                                <TableRow key={index}>
                                    <TableCell align="center">{laporan.izin?.namaIzin}</TableCell>
                                    <TableCell align="center">{dayjs(laporan.tanggalMulai).format('DD-MM-YYYY')}</TableCell>
                                    <TableCell align="center">{dayjs(laporan.tanggalBerakhir).format('DD-MM-YYYY')}</TableCell>
                                    <TableCell align="center">{laporan.totalHari} Hari</TableCell>
                                    <TableCell align="center">{laporan.status === 4? 
                                        <div className="badgeStatusWaiting">Menunggu Verifikasi Direktur</div>:
                                            laporan.status === 3?
                                            <div className="badgeStatusAktif">Di Terima</div>:
                                            <div className="badgeStatusNon">Di Tolak</div>}
                                    </TableCell>
                                    <TableCell align="center" style={{width: '20%'}}>
                                        <Button variant="info" onClick={() => goToDetail(laporan)}>
                                            Detail
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        )
        counter = true;
    }

    useEffect(() => {
        if (window.performance) {
            if (performance.navigation.type == 1) {
                refetchPermintaan()
                console.log('Refreshed!');
            }
        }
    }, []) 
    return (
        <Container className="containerKu">
            <Row className="bg-white py-5 justify-content-center">
                <Col>
                    <h1 className="text-center">Daftar Izin Pribadi</h1>
                </Col>
            </Row>
            <Row>
                <Col className="col-md-4">
                    <Form.Group as={Col}>
                        <Form.Label>Status Laporan: </Form.Label>
                        <Form.Control 
                            as="select" 
                            value={status} 
                            onChange={e => 
                                setStatus(e.target.value)
                            }
                        >
                        <option value="-1">Semuanya</option>
                        <option value="3">Menunggu Verifikasi Direktur</option>
                        <option value="4">Di Terima</option>
                        <option value="0">Di Tolak</option>
                        </Form.Control>
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col>
                    {dataKu}
                    <div className="pageContainerKu">
                        {pageKu}
                    </div>
                </Col>
            </Row>
        </Container>
    )
}
