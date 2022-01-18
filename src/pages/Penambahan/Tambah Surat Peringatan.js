import React, {useState, Fragment} from 'react'
import { Row, Col, Form, Button, Alert, Container} from 'react-bootstrap';
import { gql, useQuery, useMutation} from '@apollo/client';
import {ReactNativeFile} from 'apollo-upload-client';
import DatePicker from 'react-datepicker'
import ClipLoader from "react-spinners/ClipLoader";


const getListDivisi = gql`
query getListDivisi{
    getListDivisi{
        namaDivisi
  }
}
`;


const getListKaryawanKontrak = gql`
query getListKaryawanKontrak(
    $divisi: String 
){
    getListKaryawanKontrak(
        divisi: $divisi
    ){
        id nama jabatan{jabatanKu}
  }
}
`;

const registerSuratPeringatan = gql`
    mutation registerSuratPeringatan(
        $idKaryawan: Int 
        $peringatanKe: Int
        $keterangan: String 
  ) {
    registerSuratPeringatan(
        idKaryawan: $idKaryawan 
        peringatanKe: $peringatanKe
        keterangan: $keterangan
    ) {
        id
    }
  }
`;
export default function TambahSuratPeringatan(props) {
    const [divisi, setDivisi] = useState("");
    const [karyawan, setKaryawan] = useState("");
    const [peringatanKe, setPeringatanKe] = useState("1");
    const [keterangan, setKeterangan] = useState("");
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

    const [registerKuisionerKu, {loading}] = useMutation(registerSuratPeringatan,{
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
                Sukses: `Suksess Tambah Surat Peringatan`,
            })
        }
    })
    const register = e =>{
        e.preventDefault();
        registerKuisionerKu({variables:{
            idKaryawan: parseInt(karyawan),
            peringatanKe: parseInt(peringatanKe),
            keterangan: keterangan
        }
        });
    }

    const { 
        loading: loadingDivisi,
        data: dataDivisi 
    } = useQuery(getListDivisi);

    let dataDivisiKu = [];
    let counterDivisi = false;
    if(!dataDivisi || loadingDivisi){

    }else if(dataDivisi.getListDivisi.length === 0){
        
    }else if(dataDivisi.getListDivisi.length > 0 && !counterDivisi){
        dataDivisiKu.push(dataDivisi.getListDivisi.map((divisi,index) =>(
            <option key={index} value={divisi.namaDivisi}>
                {divisi.namaDivisi}
            </option>
        )))
        counterDivisi = true;
    }

    const { 
        loading: loadingKaryawanKontrak, 
        data: dataKaryawanKontrak, 
        refetch: refetchKaryawanKontrak
    } = useQuery(getListKaryawanKontrak,{
        variables: {
            divisi: divisi
        }
    });

    let dataKaryawanKontrakKu = [];
    if(!dataKaryawanKontrak || loadingKaryawanKontrak){

    }else if(dataKaryawanKontrak.getListKaryawanKontrak.length === 0){

    }else if(dataKaryawanKontrak.getListKaryawanKontrak.length > 0){
        dataKaryawanKontrakKu.push(dataKaryawanKontrak.getListKaryawanKontrak.map((element, index) => (
            <option key={index} value={element.id} >{element.nama} ({element.jabatan.jabatanKu})</option>
        )))
    }

    return (
        <Container className="containerKu">
            <Row className="bg-white justify-content-center">
                <Col><h1 className="text-center">Tambah Surat Peringatan (SP)</h1></Col>
            </Row>
            <Row className="justify-content-md-center">
                <Col className="col-md-7">
                    <Form onSubmit={register}>
                    <Row className="bg-white justify-content-center">
                        <Col className="col-md-2">
                            <ClipLoader color="#000000" loading={loading} className="loadingKu" size={150} />
                        </Col>
                    </Row>
                        {showError}
                        {showUser}
                    <Form.Group as={Col}>
                        <Form.Label>Divisi Karyawan</Form.Label>
                        <Form.Control 
                            as="select" 
                            value={divisi} 
                            onChange={e => 
                                setDivisi(e.target.value)
                            }
                        >
                            <option value=""></option>
                            {dataDivisiKu}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group as={Col}>
                        <Form.Label>Karyawan: </Form.Label>
                        <Form.Control 
                            as="select" 
                            value={karyawan} 
                            onChange={e => 
                                setKaryawan(e.target.value)
                            }
                        >
                            <option value=""></option>
                            {dataKaryawanKontrakKu}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group as={Col}>
                        <Form.Label>Peringatan Ke</Form.Label>
                        <Form.Control 
                            as="select" 
                            value={karyawan} 
                            onChange={e => 
                                setKaryawan(e.target.value)
                            }
                        >
                            <option value="1">Peringatan Pertama</option>
                            <option value="2">Peringatan Kedua</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group as={Col}>
                        <Form.Label>Keterangan</Form.Label>
                        <Form.Control 
                            as="textarea" 
                            name="nama"
                            value= {keterangan}
                            onChange={e => 
                                setKeterangan(e.target.value)}
                        />
                    </Form.Group>
                    <div className='text-center' style={{marginTop: 10}}>
                        <Button variant="primary" type="submit">
                            Tambahkan
                        </Button>
                    </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}
