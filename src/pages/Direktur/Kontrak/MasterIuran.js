import React from 'react'
import { Row, Col, Form, Button, Alert, Container} from 'react-bootstrap';
import { gql, useQuery, useMutation, useLazyQuery} from '@apollo/client';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const getIndexIuran = gql`
query getIndexIuran(
    $status: Boolean
){
    getIndexIuran(
        status: $status
    ){
    id namaIuran keteranganIuran status
  }
}
`;
export default function MasterIuran(props) {
    const { loading, data, refetch } = useQuery(getIndexIuran,{
        variables:{
            status: false
        }
    });

    let dataKu= [];
    let counter = false;
    if(!data || loading){
        dataKu.push(<p key={0} className="badgeStatusWaitingText">Loading....</p>)
    }else if(data.getIndexIuran.length === 0){
        dataKu.push(<p key={0} className="badgeStatusNonText">Tidak ada Index Iuran</p>)
    }else if(data.getIndexIuran.length > 0 && !counter){
        dataKu.push(
            <TableContainer component={Paper} key={0}>
                <Table className="tableKu" aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Nama Index</TableCell>
                            <TableCell align="center">Keterangan Index</TableCell>
                            <TableCell align="center">Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            data.getIndexIuran.map((laporan,index) =>(
                                <TableRow key={index}>
                                    <TableCell component="th" scope="row" align="center">{laporan.namaIuran}</TableCell>
                                    <TableCell component="th" scope="row" align="center">{laporan.keteranganIuran}</TableCell>
                                    <TableCell component="th" scope="row" align="center">
                                        <div className="badgeContainer">{
                                        laporan.status === true? 
                                            <div className="badgeStatusAktif">Aktif</div>:
                                            <div className="badgeStatusNon">Non-Aktif</div>
                                    }</div></TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        )
        counter = true;
    }
    
    return (
        <Container className="containerKu">
            <Row className="bg-white justify-content-center">
                <Col><h1 className="text-center">Master Index Iuran</h1></Col>
            </Row>
            <Row className="justify-content-center">
                <Col className="col-md-8">
                    {dataKu}
                </Col>
            </Row>
        </Container>
    )
}
