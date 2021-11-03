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
import * as BiIcons from 'react-icons/bi';

const getListJabatan = gql`
  query getListJabatan{
    getListJabatan{
        tingkatJabatan jabatanKu
    }
  }
`;

const getDistribusi = gql`
query getDistribusi(
  $KuisionerId: Int 
){
  getDistribusi(
    KuisionerId: $KuisionerId
  ){
    id namaJabatan TingkatJabatan persentaseNilai status
  }
}
`;

export default function DetailDistribusi(props) {
    let history = useHistory();
    const location = useLocation();
    const [dataLaporan, setDataLaporan] = useState([]);
    const {
        loading: loadingPertanyaan,
        data: dataPertanyaan,
        refetch
    } = useQuery(getDistribusi,{
        variables: {
            KuisionerId: dataLaporan.id
        }
    });

    useEffect(() => {
        if(location.state !== undefined){
            setDataLaporan(location.state?.laporan)
        }
    }, [location]);

    let dataDistribusiKu = []
    let counterDistribusi = false;
    if(!dataPertanyaan || loadingPertanyaan){
        dataDistribusiKu.push(<p key={0} className="badgeStatusWaitingText">Loading....</p>)
    }else if(dataPertanyaan.getDistribusi.length === 0){
        dataDistribusiKu.push(<p key={1} className="badgeStatusNonText">Tidak Ada Distribusi</p>)
    }else if(dataPertanyaan.getDistribusi.length > 0){
        console.log("masuk")
        dataDistribusiKu.push(
            <TableContainer component={Paper} key={0}>
                <Table className="tableKu" aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Nama Jabatan</TableCell>
                            <TableCell>Persentase Nilai</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            dataPertanyaan.getDistribusi.map((laporan,index) =>(
                                <TableRow key={index}>
                                    <TableCell component="th" scope="row">{laporan.namaJabatan}</TableCell>
                                    <TableCell component="th" scope="row">{laporan.persentaseNilai}</TableCell>
                                    <TableCell component="th" scope="row">{laporan.status === true? "Aktif": "Non-Aktif"}</TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }
    
    useEffect(() => {
        if (window.performance) {
            if (performance.navigation.type == 1) {
                refetch()
            }
        }
    }, [])    

    return (
        <Container className="containerKu">
            <Row>
                <Col>
                    <BiIcons.BiArrowBack size="50" onClick={() => history.goBack()} className="iconBack"/>
                </Col>
            </Row>
            <Row className="bg-white justify-content-center">
                <Col><h1 className="text-center">Distribusi Kuisioner {dataLaporan.namaKuisioner}</h1></Col>
            </Row>
            <Row className="bg-white justify-content-center">
                <Col className="col-md-8">
                    {dataDistribusiKu}
                </Col>
            </Row>
        </Container>
    )
}
