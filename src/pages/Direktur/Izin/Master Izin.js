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
        dataCuti.push(<p key={0} className="badgeStatusWaitingText">Memuat....</p>)
    }else if(data.getIzin.length === 0){
        dataCuti.push(<p key={1} className="badgeStatusNonText">Tidak Ada Daftar Izin</p>)
    }else if(data.getIzin.length > 0 && !counterCuti){
        dataCuti.push(
            <div className='tableContainer'>
                <table size='string' className="table" aria-label="simple table">
                    <thead>
                        <tr>
                            <th>Nama Izin</th>
                            <th>Total Izin</th>
                            <th>Keterangan</th>
                            <th>Batasan Hari</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.getIzin.map((laporan,index) =>(
                                <tr key={index} >
                                    <td data-label="Izin">{laporan.namaIzin}</td>
                                    <td data-label="Tanggal Izin">{laporan.totalIzin} Hari</td>
                                    <td data-label="Keterangan">{laporan.keterangan}</td>
                                    <td data-label="Batasan Hari">{
                                            laporan.batasanHari === true? 
                                                <div className="badgeStatusNon">Ada Batasan Hari</div>: 
                                                <div className="badgeStatusAktif">Tidak Ada Batasan</div>
                                    }</td>
                                    <td data-label="Status">{
                                        laporan.status === true? 
                                            <div className="badgeStatusAktif">Aktif</div>:
                                            <div className="badgeStatusNon">Tidak Aktif</div>
                                    }</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        )
        counterCuti = true;
    }

    return (
        <Container className="containerKu">
            <Row className="bg-white py-5 justify-content-md-center">
                <Col className="col-md-4">
                    <h1 className="text-center">Master Cuti</h1>
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
