import React, {useState, Fragment, useEffect} from 'react'
import { Row, Col, Form, Button, Container} from 'react-bootstrap';
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
import { CModal, CModalBody, CModalHeader, CModalTitle } from '@coreui/react';
import * as BiIcons from 'react-icons/bi';
import { CCard, CCardBody } from '@coreui/react';

const getListDivisi = gql`
  query getListDivisi{
    getListDivisi{
        namaDivisi
    }
  }
`;

const getPertanyaan = gql`
query getPertanyaan(
  $KuisionerId: Int 
){
  getPertanyaan(
    KuisionerId: $KuisionerId
  ){
    id ListKuisionerId teskPertanyaan jenisPertanyaan status listJawaban{
      id teskJawaban
    }
  }
}
`;

export default function DetailKuisioner(props) {
    let history = useHistory();
    const location = useLocation();
    const [dataLaporan, setDataLaporan] = useState([]);
    const {
        loading: loadingPertanyaan,
        data: dataPertanyaan,
        refetch
    } = useQuery(getPertanyaan,{
        variables: {
            KuisionerId: dataLaporan.id
        }
    });

    useEffect(() => {
        if(location.state !== undefined){
            setDataLaporan(location.state?.laporan)
        }
    }, [location]);

    const { loading, data } = useQuery(getListDivisi);

    let dataKu = [];
    let counter = false;
    if(!data || loading){

    }else if(data.getListDivisi.length === 0){
        
    }else if(data.getListDivisi.length > 0 && !counter){
        dataKu.push(data.getListDivisi.map((divisi,index) =>(
            <option key={index} value={divisi.namaDivisi}>
                {divisi.namaDivisi}
            </option>
        )))
        counter = true;
    }

    let dataPertanyaanKu = []
    let counterPertanyaan = false;
    if(!dataPertanyaan || loadingPertanyaan){
        dataPertanyaanKu.push(<p key={0} className="badgeStatusWaitingText">Memuat....</p>)
    }else if(dataPertanyaan.getPertanyaan.length === 0){
        dataPertanyaanKu.push(<p key={1} className="badgeStatusNonText">Tidak Ada Pertanyaan</p>)
    }else if(dataPertanyaan.getPertanyaan.length > 0 && !counterPertanyaan){
        dataPertanyaanKu.push(
            <TableContainer component={Paper} key={0}>
                <Table className="tableKu" aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Teks Pertanyaan</TableCell>
                            <TableCell align="center">Jenis Pertanyaan</TableCell>
                            <TableCell align="center">Jawaban</TableCell>
                            <TableCell align="center">Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            dataPertanyaan.getPertanyaan.map((laporan,index) =>(
                                <TableRow key={index}>
                                    {console.log(laporan)}
                                    <TableCell>{laporan.teskPertanyaan}</TableCell>
                                    <TableCell align="center">{laporan.jenisPertanyaan}</TableCell>
                                    <TableCell align="center">
                                    {
                                        laporan.jenisPertanyaan === "Pilih Opsi"?
                                        <>
                                            <ul>
                                            {
                                                laporan.listJawaban.map((jawaban, index1)=>(
                                                    <li>{jawaban.teskJawaban}</li>
                                                ))
                                            }
                                            </ul>
                                        </>
                                        :
                                        laporan.listJawaban[0]?.teskJawaban
                                    }
                                    </TableCell>
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
        counterPertanyaan = true;
    }
    useEffect(() => {
        if (window.performance) {
            if (performance.navigation.type == 1) {
                dataPertanyaanKu = [];
                refetch()
            }
        }
    }, [])    

    return (
        <Container className="containerKu">
            <Row>
                <Col>
                    <BiIcons.BiArrowBack size="50" onClick={() => history.push({pathname: '/direktur/kuisioner/master kuisioner'})} className="iconBack"/>
                </Col>
            </Row>
            <Row className="bg-white py-5 justify-content-md-center">
                <CCard className="col-md-5">
                    <CCardBody>
                        <h1 className="text-center">Detail Kuisioner</h1>
                        <div className="parent">
                            <p className="childLeft">Nama Kuisioner</p>
                                <p className="childRight">: {dataLaporan.namaKuisioner}</p>
                            <p className="childLeft">Deskripsi Kuisioner</p>
                                <p className="childRight">: {dataLaporan.deskripsiKuisioner}</p>
                            <p className="childLeft">Jenis Kuisioner</p>
                                <p className="childRight">: {dataLaporan.jenisKuisioner}</p>
                        </div>
                        <p className="text-center statusKu">Status:
                            {
                                dataLaporan.status === true? 
                                    <div className="badgeStatusAktif">Aktif</div>: 
                                        <div className="badgeStatusNon">Tidak Aktif</div>
                            }
                        </p>
                    </CCardBody>
                </CCard>
            </Row>
            <Row>
                <Col>
                    {dataPertanyaanKu}
                </Col>
            </Row>
        </Container>
    )
}
