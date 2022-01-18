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
import { CCard, CCardBody, CImage } from '@coreui/react';

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

export default function TambahPertanyaanBaru(props) {
    let history = useHistory();
    const location = useLocation();
    const [id, setId] = useState(0);
    const [pertanyaan, setPertanyaan] = useState("");
    const [jenisPertanyaan, setJenisPertanyaan] = useState("");
    const [jawaban, setJawaban] = useState("");
    const [jawabanRadio, setJawabanRadio] = useState([]);

    useEffect(() => {
        setId(location.state?.id)
    }, [location]);

    const [registerPertanyaanKu] = useMutation(registerPertanyaan,{
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

    return (
        <Container className="containerKu">
            <Row className="bg-white justify-content-center">
                <Col><h1 className="text-center">Tambah Pertanyaan Baru</h1></Col>
            </Row>
            <Row className="bg-white py-5 justify-content-md-center">
                <Col className="col-md-4">
                    <Form onSubmit={updatePertanyaanFunction}>
                        <Form.Group as={Col}>
                            <Form.Label>Teks Pertanyaan</Form.Label>
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
                                <Form.Label>{jenisPertanyaan === "Pilih Opsi"? "Teks Opsi": "Jawaban"}</Form.Label>
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
                                                    <TableCell align="right">Tindakan</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {
                                                    jawabanRadio.map((radio,index) =>(
                                                        <TableRow key={index}>
                                                            <TableCell component="th" scope="row">{radio.teskJawaban}</TableCell>
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
                        <Button variant="success" type="submit">
                            Tambah Pertanyaan
                        </Button>
                    </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}
