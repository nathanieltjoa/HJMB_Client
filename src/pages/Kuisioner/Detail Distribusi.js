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


const updateStatusDistribusi = gql`
    mutation updateStatusDistribusi(
        $id: Int 
        $status: Boolean
  ) {
    updateStatusDistribusi(
        id: $id
        status: $status
    ) {
        id
    }
  }
`;

const registerDistribusi = gql`
    mutation registerDistribusi(
        $ListKuisionerId: Int 
        $TingkatJabatan: Int 
        $persentaseNilai: Int 
  ) {
    registerDistribusi(
        ListKuisionerId: $ListKuisionerId
        TingkatJabatan: $TingkatJabatan
        persentaseNilai: $persentaseNilai
    ) {
        id
    }
  }
`;

export default function DetailDistribusi(props) {
    let history = useHistory();
    const location = useLocation();
    const [jabatan, setJabatan] = useState("");
    const [nilai, setNilai] = useState(0);
    const {
        loading: loadingPertanyaan,
        data: dataPertanyaan,
        refetch
    } = useQuery(getDistribusi,{
        variables: {
            KuisionerId: location.state?.laporan.id
        }
    });

    const { loading, data } = useQuery(getListJabatan);

    let dataKu = [];
    let counter = false;
    if(!data || loading){

    }else if(data.getListJabatan.length === 0){
        
    }else if(data.getListJabatan.length > 0 && !counter){
        console.log(data.getListJabatan)
        dataKu.push(data.getListJabatan.map((jabatan,index) =>(
            <option key={index} value={jabatan.tingkatJabatan}>
                {jabatan.jabatanKu}
            </option>
        )))
        counter = true;
    }

    const [updateStatusDistribusiKu] = useMutation(updateStatusDistribusi,{
        update(_,res){
            console.log(res)
        },
        onError: (err) => {
            console.log(err)
        },
        onCompleted(data){
            counterDistribusi = false;
            console.log("suksess")
            refetch()
        }
    })

    const updateStatus = (status,id) =>{
        updateStatusDistribusiKu({
            variables: {
                id: id,
                status: status
            }
        })
    }

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
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            dataPertanyaan.getDistribusi.map((laporan,index) =>(
                                <TableRow key={index}>
                                    {console.log(laporan)}
                                    <TableCell component="th" scope="row">{laporan.namaJabatan}</TableCell>
                                    <TableCell component="th" scope="row">{laporan.persentaseNilai}</TableCell>
                                    <TableCell component="th" scope="row">{laporan.status === true? "Aktif": "Non-Aktif"}</TableCell>
                                    <TableCell component="th" scope="row">
                                        {
                                            laporan.status === true?
                                            <Button variant="primary" onClick={() => updateStatus(false, laporan.id)}>
                                                Non Aktifkan
                                            </Button>:
                                            <Button variant="primary" onClick={() => updateStatus(true, laporan.id)}>
                                                Aktifkan
                                            </Button>
                                        }
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }

    const [registerDistribusiKu] = useMutation(registerDistribusi,{
        update(_,res){
            console.log(res)
        },
        onError: (err) => {
            console.log(err)
        },
        onCompleted(data){
            alert("Suksess Tambah Distribusi")
            refetch()
        }
    })

    const tambahDistribusiFunction = e =>{
        e.preventDefault();
        console.log(jabatan)
        registerDistribusiKu({
            variables: {
                ListKuisionerId: location.state?.laporan.id,
                TingkatJabatan: parseInt(jabatan),
                persentaseNilai: parseInt(nilai),
            }
        })
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
                <Col><h1 className="text-center">Distribusi Kuisioner {location.state?.laporan.namaKuisioner}</h1></Col>
            </Row>
            <Row className="bg-white py-5 justify-content-md-center">
                <Col className="col-md-4">
                    <Form onSubmit={tambahDistribusiFunction} style={{marginTop: 10}}>
                        <Form.Group as={Col}>
                        <Form.Label>Jabatan</Form.Label>
                            <Form.Control 
                                as="select"
                                value={jabatan}
                                onChange={e => 
                                    setJabatan(e.target.value)
                            }>
                                <option value=""></option>
                                {dataKu}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Persentase Nilai</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="nama"
                                value= {nilai}
                                onChange={e => 
                                    setNilai(e.target.value)}
                            />
                        </Form.Group>
                    <div className='text-center'>
                        <Button variant="success" type="submit">
                            Tambahkan
                        </Button>
                    </div>
                    </Form>
                </Col>
            </Row>
            <Row>
                <Col>
                    {dataDistribusiKu}
                </Col>
            </Row>
        </Container>
    )
}
