import React, {useState, Fragment, useEffect} from 'react'
import { Row, Col, Form, Button, Alert} from 'react-bootstrap';
import { gql, useQuery, useMutation, useLazyQuery} from '@apollo/client';

const registerIndexPenilaian = gql`
    mutation registerIndexPenilaian(
        $namaIndex: String
        $keteranganIndex: String
  ) {
    registerIndexPenilaian(
        namaIndex: $namaIndex
        keteranganIndex: $keteranganIndex
    ) {
        id
    }
  }
`;
export default function TambahIndex(props) {
    const [nama, setNama] = useState("");
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

    const [registerIndexKu] = useMutation(registerIndexPenilaian,{
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
                Sukses: `Suksess tambah Index Penilaian`,
            })
        }
    })

    const register = e =>{
        e.preventDefault();
        console.log("masuk");
        registerIndexKu({variables:{
            namaIndex: nama,
            keteranganIndex: keterangan,
        }
        });
    }
    return (
        <Fragment>
            <Row className="bg-white justify-content-center">
                <Col><h1 className="text-center">Tambah Index Penilaian</h1></Col>
            </Row>
            <Row className="bg-white py-5 justify-content-md-center">
                <Col xs lg="4">
                    <Form onSubmit={register}>
                        {showError}
                        {showUser}
                        <Form.Group as={Col}>
                            <Form.Label className={errors.namaIndex && 'text-danger'}>{errors.namaIndex ?? 'Nama Index'}</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="nama"
                                value= {nama}
                                onChange={e => 
                                    setNama(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label className={errors.keterangan && 'text-danger'}>{errors.keterangan ?? 'Keterangan'}</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                name="keterangan"
                                value= {keterangan}
                                onChange={e => 
                                    setKeterangan(e.target.value)}
                            />
                        </Form.Group>
                    <div className='text-center'>
                        <Button variant="success" type="submit">
                            Tambah Index
                        </Button>
                    </div>
                    </Form>
                </Col>
            </Row>
        </Fragment>
    )
}
