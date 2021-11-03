import React, {useState, Fragment} from 'react'
import { Row, Col, Form, Button, Alert} from 'react-bootstrap';
import { gql, useQuery, useMutation} from '@apollo/client';
import {
  CButton,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CFormSelect,
  CFormLabel,
  CImage,
  CAlert,
} from '@coreui/react'
import { freeSet } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import * as FaIcons from 'react-icons/fa';


const getJabatan = gql`
  query getJabatan{
    getJabatan{
      id
      namaJabatan
      tingkatJabatan
    }
  }
`;

const registerKaryawan = gql`
    mutation registerKaryawan(
      $id: Int 
      $nama: String
      $nik: String
      $noTelp: String 
      $tanggalMasuk: MyDate
      $tempatLahir: String
      $tanggalLahir: MyDate
      $alamat: String
      $agama: String
      $pendidikan: String
      $file: Upload
      $idJabatan: Int!
  ) {
    registerKaryawan(
      id: $id
      nama: $nama
      nik: $nik
      noTelp: $noTelp
      tanggalMasuk: $tanggalMasuk
      tempatLahir: $tempatLahir
      tanggalLahir: $tanggalLahir
      alamat: $alamat
      agama: $agama
      pendidikan: $pendidikan
      file: $file
      idJabatan: $idJabatan
    ) {
      id
      nama
      username
      passwordRaw
    }
  }
`;
const uploadFoto = gql`
    mutation uploadFoto($file: Upload!){
        uploadFoto(file: $file){
            url
        }
    }
`;
export default function Register(props) {
    const[variables,setVariables] = useState({
        id: 0,
        username:'',
        idJabatan: 0,
        nik: '',
        noTelp: '',
        tanggalMasuk: '',
        tempatLahir: '',
        tanggalLahir: '',
        alamat: '',
        agama: '',
        pendidikan: '',
        foto: '',
    })
    const [file, setFile] = useState();
    const [imageURI, setImageURI] = useState();
    const [errors, setErrors] = useState({})
    const [success, setSuccess] = useState({})
    const { loading, data } = useQuery(getJabatan);

    let usersMarkUp
    let counter = false;
    if(!data || loading){
        usersMarkUp = <p>Loading...</p>
    }else if(data.getJabatan.length === 0){
        usersMarkUp = <p>Tidak Ada Daftar Jabatan</p>
    }else if(data.getJabatan.length > 0 && !counter){
        usersMarkUp = data.getJabatan.map(jabatan =>(
            <option key={jabatan.id} value={jabatan.id}>
                {jabatan.tingkatJabatan === 2? 'Ketua ' : null}
                {jabatan.tingkatJabatan === 4? 'Ketua ' : null}
                {jabatan.namaJabatan}
            </option>
        ))
        counter = true;
    }
    
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

    const [registerKaryawanku] = useMutation(registerKaryawan,{
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
                username: `Username: ${data.registerKaryawan.username}`,
                password: `Password: ${data.registerKaryawan.passwordRaw}`
            })
        }
    })
    const register = () =>{
        console.log(variables.idJabatan);
        registerKaryawanku({variables:{
            id: parseInt(variables.id),
            nama: variables.username,
            nik: variables.nik,
            noTelp: variables.noTelp,
            tanggalMasuk: variables.tanggalMasuk,
            tempatLahir:  variables.tempatLahir,
            tanggalLahir: variables.tanggalLahir,
            alamat: variables.alamat,
            agama: variables.agama,
            pendidikan: variables.pendidikan,
            file: file,
            idJabatan: parseInt(variables.idJabatan),
        }
        });
        console.log(variables);
    }
    const handleFileChange = e =>{
        const file = e.target.files[0]
        if(!file) return
        setFile(e.target.files[0]);
        const reader = new FileReader();
        reader.onload = () =>{
            if(reader.readyState === 2){
                setImageURI(reader.result);
            }
        }
        reader.readAsDataURL(e.target.files[0])
    }
    return (
        <CContainer className="containerKu">
          <CRow className="justify-content-center">
            <CCol md={4}>
                <CForm>
                    <h1>Tambah Karyawan</h1>
                    <p className="text-medium-emphasis">Masukkan Data-data Karyawan</p>
                    {showUser}
                    {showError}
                    <CInputGroup className="mb-3">
                        <CInputGroupText>
                            <CIcon content={freeSet.cilUser} />
                        </CInputGroupText>
                        <CFormInput 
                            placeholder="ID" 
                            autoComplete="nama" 
                            onChange={e => setVariables({...variables, id: e.target.value})}/>
                    </CInputGroup>
                    <CInputGroup className="mb-3">
                        <CInputGroupText>
                            <CIcon content={freeSet.cilUser} />
                        </CInputGroupText>
                        <CFormInput 
                            placeholder="Nama Lengkap" 
                            autoComplete="nama" 
                            onChange={e => setVariables({...variables, username: e.target.value})}/>
                    </CInputGroup>
                    <CInputGroup className="mb-3">
                        <CInputGroupText>
                            <FaIcons.FaIdCard />
                        </CInputGroupText>
                        <CFormInput 
                            placeholder="NIK" 
                            autoComplete="nama" 
                            onChange={e => setVariables({...variables, nik: e.target.value})}/>
                    </CInputGroup>
                    <CInputGroup className="mb-3">
                        <CInputGroupText>
                            <FaIcons.FaIdCard />
                        </CInputGroupText>
                        <CFormInput 
                            placeholder="NO.Telpon" 
                            autoComplete="nama" 
                            onChange={e => setVariables({...variables, noTelp: e.target.value})}/>
                    </CInputGroup>
                    <CInputGroup className="mb-3">
                        <CInputGroupText>
                            <FaIcons.FaIdBadge />
                        </CInputGroupText>
                        <Form.Control 
                            as="select" 
                            onChange={e => 
                                setVariables({...variables, idJabatan: parseInt(e.target.value)})
                            }>
                            <option value="0">Pilih Jabatan</option>
                            {usersMarkUp}
                        </Form.Control>
                    </CInputGroup>
                    <CFormLabel>Tanggal Masuk: </CFormLabel>
                    <CInputGroup className="mb-3">
                        <CInputGroupText>
                            <CIcon content={freeSet.cilCalendar} />
                        </CInputGroupText>
                        <Form.Control 
                            type="date" 
                            value={variables.tanggalMasuk} 
                            onChange={e => 
                                setVariables({...variables, tanggalMasuk: e.target.value})
                            }
                        />
                    </CInputGroup>
                    <CInputGroup className="mb-3">
                        <CInputGroupText>
                            <CIcon content={freeSet.cilBuilding} />
                        </CInputGroupText>
                        <CFormInput 
                            placeholder="Tempat Lahir" 
                            autoComplete="nama" 
                            onChange={e => setVariables({...variables, tempatLahir: e.target.value})}/>
                    </CInputGroup>
                    <CFormLabel>Tanggal Lahir: </CFormLabel>
                    <CInputGroup className="mb-3">
                        <CInputGroupText>
                            <CIcon content={freeSet.cilCalendar} />
                        </CInputGroupText>
                        <Form.Control 
                            type="date" 
                            value={variables.tanggalLahir} 
                            onChange={e => 
                                setVariables({...variables, tanggalLahir: e.target.value})
                            }
                        />
                    </CInputGroup>
                    <CInputGroup className="mb-3">
                        <CInputGroupText>
                            <FaIcons.FaAddressCard />
                        </CInputGroupText>
                        <CFormInput 
                            placeholder="Alamat" 
                            autoComplete="nama" 
                            onChange={e => setVariables({...variables, alamat: e.target.value})}/>
                    </CInputGroup>
                    <CInputGroup className="mb-3">
                        <CInputGroupText>
                            <FaIcons.FaPlaceOfWorship />
                        </CInputGroupText>
                        <Form.Control 
                            as="select" 
                            onChange={e => 
                                setVariables({...variables, agama: e.target.value})
                            }>
                            <option value="Islam">Islam</option>
                            <option value="Kristen">Kristen</option>
                            <option value="Katolik">Katolik</option>
                            <option value="Buddha">Buddha</option>
                            <option value="Hindu">Hindu</option>
                        </Form.Control>
                    </CInputGroup>
                    <CInputGroup className="mb-3">
                        <CInputGroupText>
                            <CIcon content={freeSet.cilEducation} />
                        </CInputGroupText>
                        <Form.Control 
                            as="select" 
                            onChange={e => 
                                setVariables({...variables, pendidikan: e.target.value})
                            }>
                            <option value="SMP">SMP</option>
                            <option value="SMA">SMA</option>
                            <option value="Sarjana">Sarjana</option>
                        </Form.Control>
                    </CInputGroup>
                    <CRow>
                        <CCol xs={6}>
                            <CButton color="primary" className="px-4" onClick={() => register()}>
                                Tambahkan
                            </CButton>
                        </CCol>
                    </CRow>
                </CForm>
            </CCol>
            <CCol md={4}>
                <CForm>
                    <CImage src={!imageURI ? "/default.png": imageURI} alt="" id="img" className="img" width="150" height="150"/>
                    <input type="file" onChange={handleFileChange} />
                </CForm>
            </CCol>
          </CRow>
        </CContainer>
        /*<Fragment>
            <Row className="bg-white justify-content-center">
                <Col><h1 className="text-center">Daftar Karyawan</h1></Col>
            </Row>
            <Row className="bg-white py-5 justify-content-md-center">
                <Col xs lg="4">
                    <Form onSubmit={register}>
                        {showError}
                        {showUser}
                        <Form.Group as={Col}>
                            <Form.Label className={errors.nama && 'text-danger'}>{errors.nama ?? 'Nama'}</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="nama"
                                value= {variables.username}
                                onChange={e => 
                                    setVariables({...variables, username : e.target.value})}
                            />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label className={errors.nik && 'text-danger'}>{errors.nik ?? 'No. NIK'}</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={variables.nik} 
                                onChange={e => 
                                    setVariables({...variables, nik: e.target.value})
                                }
                            />
                        </Form.Group>
                        <Form.Group as={Col}>
                        <Form.Label>Jabatan</Form.Label>
                            <Form.Control 
                                as="select" 
                                value={variables.idJabatan}
                                onChange={e => 
                                    setVariables({...variables, idJabatan: parseInt(e.target.value)})
                            }>
                                {usersMarkUp}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label className={errors.tanggalMasuk && 'text-danger'}>{errors.tanggalMasuk ?? 'Tanggal Masuk'}</Form.Label>
                            <Form.Control 
                                type="date" 
                                value={variables.tanggalMasuk} 
                                onChange={e => 
                                    setVariables({...variables, tanggalMasuk: e.target.value})
                                }
                            />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label className={errors.tempatLahir && 'text-danger'}>{errors.tempatLahir ?? 'Tempat Lahir'}</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={variables.tempatLahir} 
                                onChange={e => 
                                    setVariables({...variables, tempatLahir: e.target.value})
                                }
                            />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label className={errors.tanggalLahir && 'text-danger'}>{errors.tanggalLahir ?? 'Tanggal Lahir'}</Form.Label>
                            <Form.Control 
                                type="date" 
                                value={variables.tanggalLahir} 
                                onChange={e => 
                                    setVariables({...variables, tanggalLahir: e.target.value})
                                }
                            />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label className={errors.alamat && 'text-danger'}>{errors.alamat ?? 'Alamat'}</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={variables.alamat} 
                                onChange={e => 
                                    setVariables({...variables, alamat: e.target.value})
                                }
                            />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label className={errors.agama && 'text-danger'}>{errors.agama ?? 'Agama'}</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={variables.agama} 
                                onChange={e => 
                                    setVariables({...variables, agama: e.target.value})
                                }
                            />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label className={errors.pendidikan && 'text-danger'}>{errors.pendidikan ?? 'Pendidikan'}</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={variables.pendidikan} 
                                onChange={e => 
                                    setVariables({...variables, pendidikan: e.target.value})
                                }
                            />
                        </Form.Group>
                    <div className='text-center'>
                        <Button variant="success" type="submit" disabled={loading}>
                            {loading? 'loading..':'Daftarkan'}
                        </Button>
                    </div>
                    </Form>
                </Col>
                <Col xs lg="2" className="justify-content-center">
                    <img src={imageURI} alt="" id="img" className="img" width="175" height="200"/>
                    <input type="file" onChange={handleFileChange} />
                </Col>
            </Row>
        </Fragment>*/
    )
}
