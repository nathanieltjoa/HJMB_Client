import React, {useState, Fragment} from 'react'
import { Row, Col, Form, Button, Alert, Container} from 'react-bootstrap';
import { gql, useQuery, useMutation} from '@apollo/client';
import {ReactNativeFile} from 'apollo-upload-client';

const getListDivisi = gql`
  query getListDivisi{
    getListDivisi{
        namaDivisi
    }
  }
`;

const registerKuisioner = gql`
    mutation registerKuisioner(
        $divisi: String 
        $namaKuisioner: String 
        $deskripsiKuisioner: String 
        $jenisKuisioner: String
  ) {
    registerKuisioner(
        divisi: $divisi 
        namaKuisioner: $namaKuisioner
        deskripsiKuisioner: $deskripsiKuisioner
        jenisKuisioner: $jenisKuisioner
    ) {
        id
    }
  }
`;
export default function TambahKuisioner(props) {
    const [divisi, setDivisi] = useState("Semuanya");
    const [nama, setNama] = useState("")
    const [deskripsi, setDeskripsi] = useState("");
    const [jenis, setJenis] = useState("Penilaian");
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

    const { loading, data } = useQuery(getListDivisi);

    let usersMarkUp
    let counter = false;
    if(!data || loading){

    }else if(data.getListDivisi.length === 0){
        
    }else if(data.getListDivisi.length > 0 && !counter){
        usersMarkUp = data.getListDivisi.map((divisi,index) =>(
            <option key={index} value={divisi.namaDivisi}>
                {divisi.namaDivisi}
            </option>
        ))
        counter = true;
    }

    const [registerKuisionerKu] = useMutation(registerKuisioner,{
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
                Sukses: `Suksess tambah Kuisioner`,
            })
        }
    })
    const register = e =>{
        e.preventDefault();
        registerKuisionerKu({variables:{
            divisi: divisi,
            namaKuisioner: nama,
            deskripsiKuisioner: deskripsi,
            jenisKuisioner: jenis
        }
        });
    }
    return (
        <Container className="containerKu">
            <Row className="bg-white justify-content-center">
                <Col><h1 className="text-center">Tambah Kuisioner</h1></Col>
            </Row>
            <Row className="bg-white py-5 justify-content-md-center">
                <Col xs lg="4">
                    <Form onSubmit={register}>
                        {showError}
                        {showUser}
                        <Form.Group as={Col}>
                        <Form.Label>Divisi</Form.Label>
                            <Form.Control 
                                as="select" 
                                value={divisi}
                                onChange={e => 
                                    setDivisi(e.target.value)
                            }>
                                <option value="Semuanya">Semuanya</option>
                                {usersMarkUp}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label className={errors.namaKuisioner && 'text-danger'}>{errors.namaKuisioner ?? 'Nama Kuisioner'}</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="nama"
                                value= {nama}
                                onChange={e => 
                                    setNama(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label className={errors.deskripsiKuisioner && 'text-danger'}>{errors.deskripsiKuisioner ?? 'Deskripsi Kuisioner'}</Form.Label>
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
