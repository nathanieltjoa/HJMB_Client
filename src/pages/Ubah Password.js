import React, {useState} from 'react'
import { Row, Col, Form, Button, Alert, Container} from 'react-bootstrap';
import { gql, useMutation} from '@apollo/client';
import * as BiIcons from 'react-icons/bi';
import { useHistory } from 'react-router-dom';

const changePassword = gql`
    mutation changePassword(
        $passwordLama: String
        $passwordBaru: String
        $passwordConfirm: String
    ){
        changePassword(
            passwordLama: $passwordLama
            passwordBaru: $passwordBaru
            passwordConfirm: $passwordConfirm
        ){
            id
        }
    }
`;

export default function UbahPassword(props) {
  let history = useHistory();
    const[variables, setVariables] = useState({
      passwordLama: '',
      passwordBaru: '',
      passwordConfirm: '',
    });
    const [errors, setErrors] = useState({})
    const [success, setSuccess] = useState('')


    /*const [loginUser, {loading}] = useLazyQuery(loginWebsite,{
      onError: (err) => setErrors(err.graphQLErrors[0].extensions.errors),
      onCompleted(data){
        dispatch({type:'LOGIN', payload: data.loginWebsite})
        props.history.push('/dashboard');
      }
    })*/
    const [changePasswordKu, {loading}] = useMutation(changePassword,{
        onError: (err) => {
          setErrors(err.graphQLErrors[0].extensions.errors)
          console.log(err.graphQLErrors[0].extensions.errors)
        },
        onCompleted(data){
            setErrors({});
            setSuccess('Suksess Ganti Password')
        }
    })
    const submitChangePasswordForm = async e =>{
      e.preventDefault();
      changePasswordKu({variables});
    }

    let pesan;
    if(success){
        pesan = 
            <Alert variant='success'>
                {success}
            </Alert>
    }
    return (
      <Container className="containerKu">
        <Row>
            <Col>
                <BiIcons.BiArrowBack size="50" onClick={() => history.goBack()} className="iconBack"/>
            </Col>
        </Row>
        <Row className="bg-white py-5 justify-content-center">
            <Col sm={8} md={6} lg={4}>
              <h1 className="text-center">Ubah Password</h1>
              {pesan}
              <Form onSubmit={submitChangePasswordForm}>
                  <Form.Group>
                  <Form.Label className={errors.passwordLama && 'text-danger'}>{errors.passwordLama ?? 'Password Lama'}</Form.Label>
                  <Form.Control 
                      type="password" 
                      value={variables.passwordLama} 
                      onChange={e => 
                        setVariables({...variables, passwordLama: e.target.value})
                      }
                  />
                  </Form.Group>
                  <Form.Group>
                  <Form.Label className={errors.passwordBaru && 'text-danger'}>{errors.passwordBaru ?? 'Password Baru'}</Form.Label>
                  <Form.Control 
                      type="password"
                      value={variables.passwordBaru} 
                      onChange={e => 
                        setVariables({...variables, passwordBaru: e.target.value})
                      }
                  />
                  </Form.Group>
                  <Form.Group>
                  <Form.Label className={errors.passwordConfirm && 'text-danger'}>{errors.passwordConfirm ?? 'Confirm Password'}</Form.Label>
                  <Form.Control 
                      type="password"
                      value={variables.passwordConfirm} 
                      onChange={e => 
                        setVariables({...variables, passwordConfirm: e.target.value})
                      }
                  />
                  </Form.Group>
                  <div className='text-center'>
                    <Button variant="success" type="submit" disabled={loading}>
                        {loading? 'loading..':'Login'}
                    </Button>
                  </div>
              </Form>
            </Col>
        </Row>
      </Container>
    )
}
