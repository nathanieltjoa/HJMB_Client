import React, {useState, Fragment, useEffect} from 'react'
import { Row, Col, Form, Button, Alert, Container, Badge} from 'react-bootstrap';
import { gql, useQuery, useMutation, useLazyQuery} from '@apollo/client';
import dayjs from 'dayjs'
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { useHistory } from 'react-router-dom';
import { CCard, CCardBody, CImage } from '@coreui/react';
import CurrencyFormat from 'react-currency-format';

const getPengaruhNilai = gql`
query getPengaruhNilai{
    getPengaruhNilai{
        id nilaiMin nilaiMax hasilNilai pengurangan nilaiUang
  }
}
`;
export default function MasterNilai(props) {

    const { loading, data, refetch } = useQuery(getPengaruhNilai);

    let dataKu= [];
    let counter = false;
    if(!data || loading){
        dataKu.push(<p key={0} className="badgeStatusWaitingText">Loading....</p>)
    }else if(data.getPengaruhNilai.length === 0){
        dataKu.push(<p key={0} className="badgeStatusNonText">Tidak ada Data Nilai</p>)
    }else if(data.getPengaruhNilai.length > 0 && !counter){
        dataKu.push(
            <TableContainer component={Paper} key={0}>
                <Table className="tableKu" aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Nilai Bawah</TableCell>
                            <TableCell align="center">Nilai Atas</TableCell>
                            <TableCell align="center">Grade Nilai</TableCell>
                            <TableCell align="center">Pengaruh Ke Gaji</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            data.getPengaruhNilai.map((laporan,index) =>(
                                <TableRow key={index}>
                                    <TableCell component="th" scope="row" align="center">{laporan.nilaiMin}</TableCell>
                                    <TableCell component="th" scope="row" align="center">{laporan.nilaiMax}</TableCell>
                                    <TableCell component="th" scope="row" align="center">{laporan.hasilNilai}</TableCell>
                                    <TableCell component="th" scope="row" align="center">
                                        <div className={laporan.pengurangan === true? "badgeStatusNonText": "badgeStatusAktifText"}>
                                            {laporan.pengurangan === true?"-":"+"}<CurrencyFormat displayType={'text'} value={laporan.nilaiUang} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp'} />
                                        </div>
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
    
    return (
        <Fragment>
            <Container className="containerKu">
                <Row className="bg-white justify-content-center">
                    <Col><h1 className="text-center">Master Nilai</h1></Col>
                </Row>
                <Row>
                    <Col>
                        {dataKu}
                    </Col>
                </Row>
            </Container>
        </Fragment>
    )
}
