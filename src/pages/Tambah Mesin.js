import React, {useState, Fragment} from 'react'
import { Row, Col, Form, Button, Alert} from 'react-bootstrap';
import { gql, useQuery, useMutation} from '@apollo/client';
import {ReactNativeFile} from 'apollo-upload-client';

const registerMesin = gql`
    mutation registerMesin(
        $id: Int 
        $namaMesin: String 
  ) {
    registerMesin(
        id: $id 
        namaMesin: $namaMesin
    ) {
        id
    }
  }
`;

const getListDivisi = gql`
query getListDivisi{
    getListDivisi{
    id namaDivisi
  }
}
`;
export default function RegisterMesin(props) {
    const[variables,setVariables] = useState({
        id: 0,
        namaMesin:'',
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
    const { loading, data } = useQuery(getListDivisi);

    let usersMarkUp
    let counter = false;
    if(!data || loading){

    }else if(data.getListDivisi.length === 0){
        
    }else if(data.getListDivisi.length > 0 && !counter){
        usersMarkUp = data.getListDivisi.map((divisi,index) =>(
            <option key={divisi.id} value={divisi.id}>
                {divisi.namaDivisi}
            </option>
        ))
        counter = true;
    }

    const [registerMesinku] = useMutation(registerMesin,{
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
                Sukses: `Suksess tambah mesin`,
            })
        }
    })
    const register = e =>{
        e.preventDefault();
        console.log(variables.id)
        registerMesinku({variables:{
            id: variables.id,
            namaMesin: variables.namaMesin,
        }
        });
        console.log(variables);
    }
    return (
        <Fragment>
            <Row className="bg-white justify-content-center">
                <Col><h1 className="text-center">Daftar Mesin</h1></Col>
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
                                value={variables.id}
                                onChange={e => 
                                    setVariables({...variables, id: parseInt(e.target.value)})
                            }>
                                {usersMarkUp}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label className={errors.namaMesin && 'text-danger'}>{errors.namaMesin ?? 'Nama Mesin'}</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="nama"
                                value= {variables.namaMesin}
                                onChange={e => 
                                    setVariables({...variables, namaMesin : e.target.value})}
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
