import React, {useState, Fragment, useEffect} from 'react'
import { Row, Col, Form, Button, Alert, Container, Badge} from 'react-bootstrap';
import { gql, useQuery, useMutation, useLazyQuery} from '@apollo/client';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const getIndexGaji = gql`
query getIndexGaji(
    $status: Boolean
){
    getIndexGaji(
        status: $status
    ){
    id namaGaji keteranganGaji status
  }
}
`;
export default function MasterGaji(props) {

    const { loading, data, refetch } = useQuery(getIndexGaji,{
        variables:{
            status: false
        }
    });

    let dataKu= [];
    let counter = false;
    if(!data || loading){
        dataKu.push(<p key={0} className="badgeStatusWaitingText">Memuat....</p>)
    }else if(data.getIndexGaji.length === 0){
        dataKu.push(<p key={0} className="badgeStatusNonText">Tidak ada Indeks Gaji</p>)
    }else if(data.getIndexGaji.length > 0 && !counter){
        dataKu.push(
            <TableContainer component={Paper} key={0}>
                <Table className="tableKu" aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Nama Indeks</TableCell>
                            <TableCell align="center">Keterangan Indeks</TableCell>
                            <TableCell align="center">Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            data.getIndexGaji.map((laporan,index) =>(
                                <TableRow key={index}>
                                    <TableCell component="th" scope="row" align="center">{laporan.namaGaji}</TableCell>
                                    <TableCell component="th" scope="row" align="center">{laporan.keteranganGaji}</TableCell>
                                    <TableCell component="th" scope="row" align="center">
                                        <div className="badgeContainer">{
                                        laporan.status === true? 
                                            <div className="badgeStatusAktif">Aktif</div>:
                                            <div className="badgeStatusNon">Tidak Aktif</div>
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
        <Fragment>
            <Container className="containerKu">
                <Row className="bg-white justify-content-center">
                    <Col><h1 className="text-center">Master Indeks Gaji</h1></Col>
                </Row>
                <Row className="justify-content-center">
                    <Col className="col-md-8">
                        {dataKu}
                    </Col>
                </Row>
            </Container>
        </Fragment>
    )
}
