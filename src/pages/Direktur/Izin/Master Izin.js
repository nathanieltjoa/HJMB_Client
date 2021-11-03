import React, {useState, Fragment, useEffect} from 'react'
import { Row, Col, Form, Button, Alert, Container} from 'react-bootstrap';
import { gql, useQuery, useMutation, useLazyQuery} from '@apollo/client';
import {ReactNativeFile} from 'apollo-upload-client';
import { useLocation } from "react-router-dom";
import { useHistory } from 'react-router-dom';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { MenuItem } from '@material-ui/core';

const getIzin = gql`
  query getIzin{
    getIzin{
        id namaIzin totalIzin keterangan status batasanHari
    }
  }
`;

export default function MasterIzin(props) {
    let history = useHistory();
    const location = useLocation();
    const {loading, data, refetch} = useQuery(getIzin);

    let dataCuti = []
    let counterCuti = false;
    if(data){
        console.log(data);
    }
    if(!data || loading){
        dataCuti.push(<p key={0} className="badgeStatusWaitingText">Loading....</p>)
    }else if(data.getIzin.length === 0){
        dataCuti.push(<p key={1} className="badgeStatusNonText">Tidak Ada List Izin</p>)
    }else if(data.getIzin.length > 0 && !counterCuti){
        dataCuti.push(
            <TableContainer component={Paper} key={0}>
                <Table className="tableKu" aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Nama Izin</TableCell>
                            <TableCell align="right">Total Cuti</TableCell>
                            <TableCell align="center">Keterangan</TableCell>
                            <TableCell align="center">Batasan Hari</TableCell>
                            <TableCell align="center">Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            data.getIzin.map((laporan,index) =>(
                                <TableRow key={index}>
                                    {console.log(laporan)}
                                    <TableCell align="center">{laporan.namaIzin}</TableCell>
                                    <TableCell align="right">{laporan.totalIzin} Hari</TableCell>
                                    <TableCell align="center">{laporan.keterangan}</TableCell>
                                    <TableCell align="center">{
                                            laporan.batasanHari === true? 
                                                <div className="badgeStatusNon">Ada Batasan Hari</div>: 
                                                <div className="badgeStatusAktif">Tidak Ada Batasan</div>
                                    }</TableCell>
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
        counterCuti = true;
    }

    return (
        <Container className="containerKu">
            <Row className="bg-white py-5 justify-content-md-center">
                <Col className="col-md-4">
                    <h1 className="text-center">Detail Kuisioner</h1>
                </Col>
            </Row>
            <Row>
                <Col>
                    {dataCuti}
                </Col>
            </Row>
        </Container>
    )
}
