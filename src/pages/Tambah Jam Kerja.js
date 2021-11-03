import React, {useState, Fragment} from 'react'
import { Row, Col, Form, Button, Alert} from 'react-bootstrap';
import { gql, useQuery, useMutation} from '@apollo/client';
import {ReactNativeFile} from 'apollo-upload-client';

const registerJamKerja = gql`
    mutation registerJamKerja(
        $namaShift: String 
        $jamMasuk: String 
        $jamKeluar: String 
  ) {
    registerJamKerja(
        namaShift: $namaShift
        jamMasuk: $jamMasuk 
        jamKeluar: $jamKeluar
    ) {
        id
    }
  }
`;
export default function Register(props) {
    const[variables,setVariables] = useState({
        namaShift: '',
        jamMasuk: '',
        jamKeluar: '',
    })
    const [errors, setErrors] = useState({})
    const [success, setSuccess] = useState({})
    
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

    const [registerJamKerjaKu] = useMutation(registerJamKerja,{
        update(_,res){
            console.log(res)
        },
        onError: (err) => {
            console.log(err)
            setErrors(err.graphQLErrors[0].extensions.errors)
            setSuccess({});
        },
        onCompleted(data){
            console.log("suksess")
            setErrors({});
            setSuccess({
                Sukses: `Suksess tambah Jam Kerja`,
            })
        }
    })
    const register = e =>{
        e.preventDefault();
        registerJamKerjaKu({variables:{
            namaShift: variables.namaShift,
            jamMasuk: variables.jamMasuk,
            jamKeluar: variables.jamKeluar
        }
        });
        console.log(variables);
    }
    return (
        <Fragment>
            <Row className="bg-white justify-content-center">
                <Col><h1 className="text-center">Daftar Jam Kerja</h1></Col>
            </Row>
            <Row className="bg-white py-5 justify-content-md-center">
                <Col xs lg="4">
                    <Form onSubmit={register}>
                        {showError}
                        {showUser}
                        <Form.Group as={Col}>
                            <Form.Label className={errors.namaShift && 'text-danger'}>{errors.namaShift ?? 'Nama Shift'}</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="namaShift"
                                value= {variables.namaShift}
                                onChange={e => 
                                    setVariables({...variables, namaShift : e.target.value})}
                            />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label className={errors.jamMasuk && 'text-danger'}>{errors.jamMasuk ?? 'Jam Masuk'}</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="jamMasuk"
                                value= {variables.jamMasuk}
                                onChange={e => 
                                    setVariables({...variables, jamMasuk : e.target.value})}
                            />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label className={errors.jamKeluar && 'text-danger'}>{errors.jamKeluar ?? 'Jam Keluar'}</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="jamKeluar"
                                value= {variables.jamKeluar}
                                onChange={e => 
                                    setVariables({...variables, jamKeluar : e.target.value})}
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
        </Fragment>
    )
}
