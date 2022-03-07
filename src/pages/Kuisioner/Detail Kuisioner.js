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


const updateKuisioner = gql`
    mutation updateKuisioner(
        $id: Int 
        $divisi: String 
        $namaKuisioner: String 
        $deskripsiKuisioner: String 
        $jenisKuisioner: String
  ) {
    updateKuisioner(
        id: $id
        divisi: $divisi 
        namaKuisioner: $namaKuisioner
        deskripsiKuisioner: $deskripsiKuisioner
        jenisKuisioner: $jenisKuisioner
    ) {
        id
    }
  }
`;

const updateStatusPertanyaan = gql`
    mutation updateStatusPertanyaan(
        $id: Int 
        $status: Boolean
  ) {
    updateStatusPertanyaan(
        id: $id
        status: $status
    ) {
        id
    }
  }
`;

const registerPertanyaan = gql`
    mutation registerPertanyaan(
        $KuisionerId: Int
        $teskPertanyaan: String
        $jenisPertanyaan: String 
        $teskJawaban: String 
        $jawabanRadio: [String] 
  ) {
    registerPertanyaan(
        KuisionerId: $KuisionerId
        teskPertanyaan: $teskPertanyaan
        jenisPertanyaan: $jenisPertanyaan
        teskJawaban: $teskJawaban
        jawabanRadio: $jawabanRadio
    ) {
        id
    }
  }
`;

export default function DetailKuisioner(props) {
    let history = useHistory();
    const location = useLocation();
    const [id, setId] = useState(0);
    const [divisi, setDivisi] = useState("Semuanya");
    const [nama, setNama] = useState("")
    const [deskripsi, setDeskripsi] = useState("");
    const [jenis, setJenis] = useState("Penilaian");
    const [visible, setVisible] = useState(false);
    const [pertanyaan, setPertanyaan] = useState("");
    const [jenisPertanyaan, setJenisPertanyaan] = useState("");
    const [jawaban, setJawaban] = useState("");
    const [jawabanRadio, setJawabanRadio] = useState([]);
    const {
        loading: loadingPertanyaan,
        data: dataPertanyaan,
        refetch
    } = useQuery(getPertanyaan,{
        variables: {
            KuisionerId: id
        }
    });

    useEffect(() => {
        setId(location.state?.laporan.id)
        setDivisi(location.state?.laporan.divisi)
        setNama(location.state?.laporan.namaKuisioner)
        setDeskripsi(location.state?.laporan.deskripsiKuisioner)
        setJenis(location.state?.laporan.jenisKuisioner)
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

    const goToDetail = (laporan) =>{
        history.push({
            pathname: '/kuisioner/detail pertanyaan',
            state: { laporan: laporan }
        });
    }

    const [updateStatusPertanyaanKu] = useMutation(updateStatusPertanyaan,{
        update(_,res){
            console.log(res)
        },
        onError: (err) => {
            console.log(err)
        },
        onCompleted(data){
            counterPertanyaan = false;
            console.log("suksess")
            refetch()
        }
    })

    const updateStatus = (status,id) =>{
        updateStatusPertanyaanKu({
            variables: {
                id: id,
                status: status
            }
        })
    }

    let dataPertanyaanKu = []
    let counterPertanyaan = false;
    if(!dataPertanyaan || loadingPertanyaan){
        dataPertanyaanKu.push(<p key={0} className="badgeStatusWaitingText">Memuat....</p>)
    }else if(dataPertanyaan.getPertanyaan.length === 0){
        dataPertanyaanKu.push(<p key={1} className="badgeStatusNonText">Tidak Ada Pertanyaan</p>)
    }else if(dataPertanyaan.getPertanyaan.length > 0 && !counterPertanyaan){
        dataPertanyaanKu.push(
            <div className='tableContainer'>
                <table size='string' className="table" aria-label="simple table">
                    <thead>
                        <tr>
                            <th>Teks Pertanyaan</th>
                            <th>Jenis Pertanyaan</th>
                            <th>Jawaban</th>
                            <th>Status</th>
                            <th>#</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            dataPertanyaan.getPertanyaan.map((laporan,index) =>(
                                <tr key={index} >
                                    <td data-label="Pertanyaan">{laporan.teskPertanyaan}</td>
                                    <td data-label="Jenis">{laporan.jenisPertanyaan}</td>
                                    <td data-label="Jawaban">
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
                                    </td>
                                    <td data-label="Status">
                                        <div className="badgeContainer">{
                                            laporan.status === true? 
                                                <div className="badgeStatusAktif">Aktif</div>:
                                                <div className="badgeStatusNon">Tidak Aktif</div>
                                        }</div>
                                    </td>
                                    <td data-label="#">
                                        {
                                            laporan.status === true?
                                            <Button  variant="danger" onClick={() => updateStatus(false, laporan.id)}>
                                                Menonaktifkan
                                            </Button>:
                                            <Button variant="success" onClick={() => updateStatus(true, laporan.id)}>
                                                Aktifkan
                                            </Button>
                                        }
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        )
        counterPertanyaan = true;
    }

    const [updateKuisionerKu] = useMutation(updateKuisioner,{
        update(_,res){
            console.log(res)
        },
        onError: (err) => {
            console.log(err)
        },
        onCompleted(data){
            history.push({
                pathname: '/kuisioner/master kuisioner'
            });
        }
    })

    const updateKuisionerFunction = e =>{
        e.preventDefault();
        updateKuisionerKu({
            variables: {
                id: id,
                divisi: divisi,
                namaKuisioner: nama,
                deskripsiKuisioner: deskripsi,
                jenisKuisioner: jenis
            }
        })
    }

    const [registerPertanyaanKu] = useMutation(registerPertanyaan,{
        update(_,res){
            console.log(res)
        },
        onError: (err) => {
            console.log(err)
            alert(err)
        },
        onCompleted(data){
            setVisible(false)
            refetch()
        }
    })

    const updatePertanyaanFunction = e =>{
        e.preventDefault();
        registerPertanyaanKu({variables:{
            KuisionerId: parseInt(id),
            teskPertanyaan: pertanyaan,
            jenisPertanyaan: jenisPertanyaan,
            teskJawaban: jawaban,
            jawabanRadio: jawabanRadio,
        }
        });
    }

    const tambahPilihan = () =>{
        setJawabanRadio(oldArray => [...oldArray, jawaban]);
    }

    const hapusRadio = (index) =>{
        setJawabanRadio(prevActions => (
            prevActions.filter((value, i) => i !== index)
        ));
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
                    <BiIcons.BiArrowBack size="50" onClick={() => history.push({pathname: '/kuisioner/master kuisioner'})} className="iconBack"/>
                </Col>
            </Row>
            <Row className="bg-white py-5 justify-content-md-center">
                <Col className="col-md-4">
                    <h1 className="text-center">Detail Kuisioner</h1>
                    <Form onSubmit={updateKuisionerFunction} style={{marginTop: 10}}>
                        <Form.Group as={Col}>
                        <Form.Label>Divisi</Form.Label>
                            <Form.Control 
                                as="select" 
                                value={divisi}
                                onChange={e => 
                                    setDivisi(e.target.value)
                            }>
                                <option value="Semuanya">Semuanya</option>
                                {dataKu}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Nama Kuisioner</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="nama"
                                value= {nama}
                                onChange={e => 
                                    setNama(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Deskripsi Kuisioner</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                value={deskripsi} 
                                onChange={e => 
                                    setDeskripsi(e.target.value)
                                }
                            />
                        </Form.Group>
                        <Form.Group as={Col}>
                        <Form.Label>Jenis Kuisioner</Form.Label>
                            <Form.Control 
                                as="select" 
                                value={jenis}
                                onChange={e => 
                                    setJenis(e.target.value)
                            }>
                                <option value="Penilaian">Penilaian</option>
                            </Form.Control>
                        </Form.Group>
                    <div className='text-center'>
                        <Button variant="success" type="submit">
                            Perbarui
                        </Button>
                    </div>
                    </Form>
                </Col>
            </Row>
            <Row>
                <Col>
                    <h2 className="text-center">Detail Pertanyaan</h2>
                    {dataPertanyaanKu}
                    <div className='text-center' style={{marginTop: 10}}>
                        <Button variant="primary" type="submit" onClick={() => setVisible(true)}>
                            Tambah Pertanyaan
                        </Button>
                    </div>
                </Col>
            </Row>
            <CModal fullscreen="md" visible={visible} onClose={() => setVisible(false)}>
                <CModalHeader>
                    <CModalTitle>Tambah Pertanyaan Baru</CModalTitle>
                </CModalHeader>
                <CModalBody className="justify-content-center">
                    <Form onSubmit={updatePertanyaanFunction}>
                        <Form.Group as={Col}>
                            <Form.Label>Tesk Pertanyaan</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="nama"
                                value= {pertanyaan}
                                onChange={e => 
                                    setPertanyaan(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Jenis Pertanyaan</Form.Label>
                            <Form.Control 
                                as="select" 
                                value={jenisPertanyaan} 
                                onChange={e => 
                                    setJenisPertanyaan(e.target.value)
                                }
                            >
                                <option value=""></option>
                                <option value="Tesk">Tesk</option>
                                <option value="Pilih Karyawan">Pilih Karyawan</option>
                                <option value="Rating">Rating</option>
                                <option value="Pilih Opsi">Pilihan Opsi</option>
                            </Form.Control>
                        </Form.Group>
                        {
                            jenisPertanyaan === "Pilih Karyawan"? (
                                <Form.Group as={Col}>
                                    <Form.Label>Pilih Karyawan</Form.Label>
                                    <Form.Control 
                                        as="select" 
                                        value={jawaban} 
                                        onChange={e => 
                                            setJawaban(e.target.value)
                                        }
                                    >
                                        <option value=""></option>
                                        <option value="Semua Divisi">Semua Divisi</option>
                                    </Form.Control>
                                </Form.Group>
                            ):
                            (
                                <Form.Group as={Col}>
                                <Form.Label>{jenisPertanyaan === "Pilih Opsi"? "Tesk Opsi": "Jawaban"}</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        value={jawaban}
                                        onChange={e => 
                                            setJawaban(e.target.value)
                                    }/>
                                </Form.Group>
                            )
                        }
                        {
                            jenisPertanyaan !== "Pilih Opsi"? null:
                            (
                                <div style={{marginBottom: 10}}>
                                    <div style={{marginBottom: 10, marginLeft: 15}}>
                                        <Button variant="info" onClick={() => tambahPilihan()}>Tambah Pilihan</Button>
                                    </div>
                                    <TableContainer component={Paper} key={0}>
                                        <Table className="tableKu" aria-label="simple table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Opsi Pilihan</TableCell>
                                                    <TableCell align="right">Action</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {
                                                    jawabanRadio.map((radio,index) =>(
                                                        <TableRow key={index}>
                                                            <TableCell component="th" scope="row">{radio}</TableCell>
                                                            <TableCell align="right">
                                                                <div style={{marginBottom: 10, marginLeft: 15}}>
                                                                    <Button variant="danger" onClick={() => hapusRadio(radio.id)}>Hapus Opsi</Button>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                }
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </div>
                            )
                        }
                    <div className='text-center'>
                        <Button variant="primary" type="submit">
                            Tambah Pertanyaan
                        </Button>
                    </div>
                    </Form>
                </CModalBody>
            </CModal>
        </Container>
    )
}
