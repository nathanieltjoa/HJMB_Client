import React, {useState} from 'react'
import { gql, useLazyQuery} from '@apollo/client';
import {useAuthDispatch} from '../context/auth';
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CImage,
  CAlert,
} from '@coreui/react'
import { freeSet } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

const loginWebsite = gql`
  query loginWebsite(
    $username: String!
    $password: String!
  ) {
    loginWebsite(
      username: $username
      password: $password
    ) {
      username
      token
      userDivisi
    }
  }
`;

export default function Login(props) {
    const[variables, setVariables] = useState({
      username: '',
      password: '',
    });
    const [errors, setErrors] = useState({})

    const dispatch = useAuthDispatch();

    let showError
    if(errors){
        console.log(errors);
        showError = 
          <div className="mt-2">
            {
              Object.keys(errors).map(i => (
                <CAlert color="danger">{errors[i]}</CAlert>
              ))
            }
          </div>
    }

    const [loginUser, {loading}] = useLazyQuery(loginWebsite,{
      onError: (err) => setErrors(err.graphQLErrors[0].extensions.errors),
      onCompleted(data){
        dispatch({type:'LOGIN', payload: data.loginWebsite})
      }
    })
    const submitLoginForm = () =>{
      loginUser({variables});
    }
    return (
      <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md={8}>
              <CCardGroup>
                <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                  <CCardBody className="text-center">
                      <CImage
                        src="/logo.png"
                        block
                        class="mb-2"
                        width="100%"
                        height="100%"
                      />
                  </CCardBody>
                </CCard>
                <CCard className="p-4">
                  <CCardBody>
                    <CForm>
                      <h1>Login</h1>
                      <p className="text-medium-emphasis">Masukkan Username Dan Password</p>
                      {showError}
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon content={freeSet.cilUser} />
                        </CInputGroupText>
                        <CFormInput placeholder="Username" autoComplete="username" onChange={e => setVariables({...variables, username: e.target.value})}/>
                      </CInputGroup>
                      <CInputGroup className="mb-4">
                        <CInputGroupText>
                          <CIcon content={freeSet.cilLockLocked} />
                        </CInputGroupText>
                        <CFormInput
                          type="password"
                          placeholder="Password"
                          autoComplete="current-password"
                          onChange={e => setVariables({...variables, password: e.target.value})}
                        />
                      </CInputGroup>
                      <CRow>
                        <CCol xs={6}>
                          <CButton color="primary" className="px-4" onClick={() => submitLoginForm()}>
                            Login
                          </CButton>
                        </CCol>
                      </CRow>
                    </CForm>
                  </CCardBody>
                </CCard>
              </CCardGroup>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    )
}
