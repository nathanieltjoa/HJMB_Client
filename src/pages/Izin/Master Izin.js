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


const updateStatusIzin = gql`
    mutation updateStatusIzin(
        $id: Int 
        $status: Boolean
  ) {
    updateStatusIzin(
        id: $id
        status: $status
    ) {
        id
    }
  }
`;

const registerIzin = gql`
    mutation registerIzin(
        $namaIzin: String 
        $totalIzin: Int 
        $keterangan: String 
        $batasanHari: Boolean
  ) {
    registerIzin(
        namaIzin: $namaIzin
        totalIzin: $totalIzin
        keterangan: $keterangan
        batasanHari: $batasanHari
    ) {
        id
    }
  }
`;

const updateIzin = gql`
    mutation updateIzin(
        $id: Int 
        $namaIzin: String 
        $totalIzin: Int 
        $keterangan: String 
        $batasanHari: Boolean
  ) {
    updateIzin(
        id: $id
        namaIzin: $namaIzin
        totalIzin: $totalIzin
        keterangan: $keterangan
        batasanHari: $batasanHari
    ) {
        id
    }
  }
`;

export default function MasterIzin(props) {
    let history = useHistory();
    const location = useLocation();
    const [hari, setHari] = useState(0);
    const [nama, setNama] = useState("")
    const [keterangan, setKeterangan] = useState("");
    const [batasanHari, setBatasanHari] = useState(false);
    const [edit, setEdit] = useState(-1);
    const {loading, data, refetch} = useQuery(getIzin);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState({});

    let showError
    let showUser
    if(success){
        console.log(success);
        showUser = 
            Object.keys(success).map(i => (
                <Alert variant='success'>
                    {success[i]}
                </Alert>
            ))
    }

    const goToDetail = (laporan) =>{
        history.push({
            pathname: '/kuisioner/detail pertanyaan',
            state: { laporan: laporan }
        });
    }

    const [updateStatusIzinKu] = useMutation(updateStatusIzin,{
        update(_,res){
            console.log(res)
        },
        onError: (err) => {
            console.log(err)
        },
        onCompleted(data){
            counterCuti = false;
            console.log("suksess")
            refetch()
        }
    })

    const updateStatus = (status,id) =>{
        updateStatusIzinKu({
            variables: {
                id: id,
                status: status
            }
        })
    }


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
            <TableContainer component={Paper} key={0}>
                <Table className="tableKu" aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Nama Izin</TableCell>
                            <TableCell align="right">Total Cuti</TableCell>
                            <TableCell align="center">Keterangan</TableCell>
                            <TableCell align="center">Batasan Hari</TableCell>
                            <TableCell align="center">Status</TableCell>
                            <TableCell align="center">Tindakan</TableCell>
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
                                            <div className="badgeStatusNon">Tidak Aktif</div>
                                    }</div></TableCell>
                                    <TableCell component="th" scope="row" width="250" align="center">
                                        <div className="buttonsSideBySide">
                                            <Button className="buttonSideBySide" variant="primary" onClick={() => editIzin(laporan)}>
                                                Edit
                                            </Button>
                                            {
                                                laporan.status === true?
                                                <Button className="buttonSideBySide" variant="danger" onClick={() => updateStatus(false, laporan.id)}>
                                                    Menonaktifkan
                                                </Button>:
                                                <Button className="buttonSideBySide" variant="success" onClick={() => updateStatus(true, laporan.id)}>
                                                    Aktifkan
                                                </Button>
                                            }
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        )
        counterCuti = true;
    }

    const [registerIzinKu] = useMutation(registerIzin,{
        update(_,res){
            console.log(res)
        },
        onError: (err) => {
            console.log(err)
            setErrors(err.graphQLErrors[0].extensions.errors)
            setSuccess({});
        },
        onCompleted(data){
            setErrors({});
            setSuccess({
                Sukses: `Suksess tambah Izin`,
            })
            refetch()
        }
    })

    const updateCutiFunction = e =>{
        e.preventDefault();
        if(edit === -1){
        }else{

        }
    }

    const registerIzinFunction = () =>{
        registerIzinKu({
            variables: {
                namaIzin: nama,
                totalIzin: parseInt(hari),
                keterangan: keterangan, 
                batasanHari: batasanHari,
            }
        })
    }

    const [updateIzinKu] = useMutation(updateIzin,{
        update(_,res){
            console.log(res)
        },
        onError: (err) => {
            console.log(err)
            setErrors(err.graphQLErrors[0].extensions.errors)
            setSuccess({});
        },
        onCompleted(data){
            setErrors({});
            setSuccess({
                Sukses: `Suksess Perbarui Izin`,
            })
            refetch()
        }
    })

    const editIzin = (laporan) =>{
        setNama(laporan.namaIzin);
        setHari(laporan.totalIzin);
        setKeterangan(laporan.keterangan);
        setBatasanHari(laporan.batasanHari);
        setEdit(laporan.id);
    }

    const updateIzinFunction = (status) =>{
        if(status === true){
            updateIzinKu({
                variables: {
                    id: parseInt(edit),
                    namaIzin: nama,
                    totalIzin: parseInt(hari),
                    keterangan: keterangan, 
                    batasanHari: batasanHari,
                }
            })
            setEdit(-1);
        }else{
            setEdit(-1);
        }
        setNama("")
        setHari(0)
        setKeterangan("")
        setBatasanHari(false)
    }

    const handleCheckBox = (e) =>{
        setBatasanHari(e.target.checked)
    }

    return (
        <Container className="containerKu">
            <Row className="bg-white py-5 justify-content-md-center">
                <Col className="col-md-4">
                    {showError}
                    {showUser}
                    <h1 className="text-center">Master Izin</h1>
                    <Form onSubmit={updateCutiFunction} style={{marginTop: 10}}>
                        <Form.Group as={Col}>
                            <Form.Label>Nama Cuti</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="nama"
                                value= {nama}
                                onChange={e => 
                                    setNama(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Total Hari</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={hari} 
                                onChange={e => 
                                    setHari(e.target.value)
                                }
                            />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Keterangan</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={keterangan} 
                                onChange={e => 
                                    setKeterangan(e.target.value)
                                }
                            />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Check 
                                inline
                                value={batasanHari}
                                type="checkbox"
                                label="Centang ini jika ingin memberikan batasan hari"
                                onChange={handleCheckBox}
                            />
                        </Form.Group>
                    </Form>
                    <div className='text-center'>
                        {
                            edit === -1? 
                                <Button variant="primary" onClick={() => registerIzinFunction()}>
                                    Tambah
                                </Button>:
                                <div className="buttonsSideBySide">
                                    <Button className="buttonSideBySide" variant="primary" onClick={() => updateIzinFunction(true)}>
                                        Perbarui
                                    </Button>
                                    <Button className="buttonSideBySide" variant="danger" onClick={() => updateIzinFunction(false)}>
                                        Batal
                                    </Button>
                                </div>
                        }
                    </div>
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
