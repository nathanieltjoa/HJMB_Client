import React, {useState, Fragment, useEffect} from 'react'
import { Row, Col, Form, Button, Alert, Container} from 'react-bootstrap';
import { gql, useQuery, useMutation} from '@apollo/client';
import {ReactNativeFile} from 'apollo-upload-client';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const getKuisioner = gql`
  query getKuisioner{
    getKuisioner{
        id namaKuisioner
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
export default function TambahPertanyaan(props) {
    const [kuisioner, setKuisioner] = useState("");
    const [pertanyaan, setPertanyaan] = useState("");
    const [jenisPertanyaan, setJenisPertanyaan] = useState("");
    const [jawaban, setJawaban] = useState("");
    const [jawabanRadio, setJawabanRadio] = useState([]);
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

    const { loading, data } = useQuery(getKuisioner);

    let usersMarkUp
    let counter = false;
    if(!data || loading){

    }else if(data.getKuisioner.length === 0){

    }else if(data.getKuisioner.length > 0 && !counter){
        usersMarkUp = data.getKuisioner.map((kuisioner,index) =>(
            <option key={index} value={parseInt(kuisioner.id)}>
                {console.log("Id: " + kuisioner.id)}
                {kuisioner.namaKuisioner}
            </option>
        ))
        counter = true;
    }

    useEffect(() => {
        console.log("kuisioner: " + kuisioner)
    }, [kuisioner])

    const [registerPertanyaanKu] = useMutation(registerPertanyaan,{
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
                Sukses: `Suksess tambah Pertanyaan`,
            })
        }
    })

    const tambahPilihan = () =>{
        setJawabanRadio(oldArray => [...oldArray, jawaban]);
    }

    const hapusRadio = (index) =>{
        setJawabanRadio(prevActions => (
            prevActions.filter((value, i) => i !== index)
        ));
    }

    const register = e =>{
        e.preventDefault();
        console.log("masuk");
        console.log(kuisioner);
        registerPertanyaanKu({variables:{
            KuisionerId: parseInt(kuisioner),
            teskPertanyaan: pertanyaan,
            jenisPertanyaan: jenisPertanyaan,
            teskJawaban: jawaban,
            jawabanRadio: jawabanRadio,
        }
        });
    }
    return (
        <Container className="containerKu">
            <Row className="bg-white justify-content-center">
                <Col><h1 className="text-center">Tambah Pertanyaan</h1></Col>
            </Row>
            <Row className="bg-white py-5 justify-content-md-center">
                <Col xs lg="4">
                    <Form onSubmit={register}>
                        {showError}
                        {showUser}
                        <Form.Group as={Col}>
                        <Form.Label className={errors.KuisionerId && 'text-danger'}>{errors.KuisionerId ?? 'Kuisioner'}</Form.Label>
                            <Form.Control 
                                as="select"
                                value={kuisioner}
                                onChange={e => 
                                    setKuisioner(e.target.value)
                            }>
                                <option value=""></option>
                                {usersMarkUp}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label className={errors.teskPertanyaan && 'text-danger'}>{errors.teskPertanyaan ?? 'Teks Pertanyaan'}</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="nama"
                                value= {pertanyaan}
                                onChange={e => 
                                    setPertanyaan(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label className={errors.jenisPertanyaan && 'text-danger'}>{errors.jenisPertanyaan ?? 'Jenis Pertanyaan'}</Form.Label>
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
                                    <Form.Label className={errors.teskJawaban && 'text-danger'}>{errors.teskJawaban ?? 'Pilih Karyawan'}</Form.Label>
                                    <Form.Control 
                                        as="select" 
                                        value={jawaban} 
                                        onChange={e => 
                                            setJawaban(e.target.value)
                                        }
                                    >
                                        <option value=""></option>
                                        <option value="Semua Divisi">Semua Divisi</option>
                                        <option value="Atasan">Atasan</option>
                                        <option value="Bawahan">Bawahan</option>
                                        <option value="Diri Sendiri">Diri Sendiri</option>
                                        <option value="Rekan Sekerja">Rekan Sekerja</option>
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
                                                    jawabanRadio.map((laporan,index) =>(
                                                        <TableRow key={index}>
                                                            <TableCell component="th" scope="row">{laporan}</TableCell>
                                                            <TableCell align="right">
                                                                <div style={{marginBottom: 10, marginLeft: 15}}>
                                                                    <Button variant="danger" onClick={() => hapusRadio(index)}>Hapus Opsi</Button>
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
