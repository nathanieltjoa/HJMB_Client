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
        dataKu.push(<p key={0} className="badgeStatusWaitingText">Memuat....</p>)
    }else if(data.getPengaruhNilai.length === 0){
        dataKu.push(<p key={0} className="badgeStatusNonText">Tidak ada Data Nilai</p>)
    }else if(data.getPengaruhNilai.length > 0 && !counter){
        dataKu.push(
            <div className='tableContainer'>
                <table size='string' className="table" aria-label="simple table">
                    <thead>
                        <tr>
                            <th>Nilai Bawah</th>
                            <th>Nilai Atas</th>
                            <th>Nilai</th>
                            <th>Pengaruh Ke Gaji</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.getPengaruhNilai.map((laporan,index) =>(
                                <tr key={index} >
                                    <td data-label="Nilai Bawah">{laporan.nilaiMin}</td>
                                    <td data-label="Nilai Atas">{laporan.nilaiMax}</td>
                                    <td data-label="Nilai">{laporan.hasilNilai}</td>
                                    <td data-label="Pengaruh Ke Gaji">
                                        <div className={laporan.pengurangan === true? "badgeStatusNonText": "badgeStatusAktifText"}>
                                            {laporan.pengurangan === true?"-":"+"}<CurrencyFormat displayType={'text'} value={laporan.nilaiUang} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp'} />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
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
