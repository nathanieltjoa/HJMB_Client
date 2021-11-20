import React, {useState, Fragment, useEffect} from 'react'
import { Row, Col, Form, Button, Alert} from 'react-bootstrap';
import { gql, useLazyQuery, useMutation} from '@apollo/client';
import {ReactNativeFile} from 'apollo-upload-client';
import { useLocation } from "react-router-dom";
import { useHistory } from 'react-router-dom';
import dayjs from 'dayjs';
import * as BiIcons from 'react-icons/bi';

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
} from '@coreui/react'
import { freeSet } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import * as FaIcons from 'react-icons/fa';

const {URL} = require('../../config/config.json')

const getKaryawanKu = gql`
query getKaryawanKu(
    $id: Int 
){
    getKaryawanKu(
        id: $id
    ){
        id nama nik noTelp tanggalMasuk tempatLahir tanggalLahir alamat agama pendidikan foto jabatan{
            namaJabatan tingkatJabatan
        }
    }
}
`;

const updateKaryawan = gql`
    mutation updateKaryawan(
      $id: Int 
      $idPermintaan: Int 
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
  ) {
    updateKaryawan(
      id: $id
      idPermintaan: $idPermintaan
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
    ) {
        id
    }
  }
`;

const resetPassword = gql`
    mutation resetPassword(
      $id: Int 
  ) {
    updateKaryawan(
      id: $id
    ) {
        passwordRaw
    }
  }
`;
export default function DetailKaryawan(props) {
    let history = useHistory();
    const location = useLocation();
    const [id, setId] = useState(0);
    const[variables,setVariables] = useState({
        id: 0,
        username:'',
        namaJabatan: '',
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
    const [getKaryawan, { loading, data }] = useLazyQuery(getKaryawanKu);
    const [errors, setErrors] = useState({})
    const [success, setSuccess] = useState({})
    const [dataKu, setDataKu] = useState([]);
    const [dataLaporan, setDataLaporan] = useState([]);
    const [idPermintaan, setIdPermintaan] = useState(0);


    
    let dataPermintaan=[];
    useEffect(() => {
        console.log(location);
        if(location.state !== undefined){
            if(location.state?.laporan !== null){
                var tingkatJabatan = location.state?.laporan.jabatan.tingkatJabatan;
                var jabatan = tingkatJabatan === 2? "Ketua ": 
                                tingkatJabatan === 4? "Ketua ":
                                    "Anggota "
                setVariables({
                    id: location.state?.laporan.id,
                    username: location.state?.laporan.nama,
                    nik: location.state?.laporan.nik,
                    noTelp: location.state?.laporan.noTelp,
                    tanggalMasuk: dayjs(location.state?.laporan.tanggalMasuk).format('YYYY-MM-DD'),
                    tempatLahir: location.state?.laporan.tempatLahir,
                    tanggalLahir: dayjs(location.state?.laporan.tanggalLahir).format('YYYY-MM-DD'),
                    alamat: location.state?.laporan.alamat,
                    agama: location.state?.laporan.agama,
                    pendidikan: location.state?.laporan.pendidikan,
                    foto: location.state?.laporan.foto,
                    namaJabatan: jabatan + location.state?.laporan.jabatan.namaJabatan,
                })
                const fileImage = location.state?.laporan.foto;
                setImageURI(fileImage.replace("localhost:4000", URL))
            }else if(location.state?.laporanPermintaan !== null){
                var laporan = location.state.laporanPermintaan;
                setDataKu(
                    <div key={0}>
                        <p>Bagian Data Yang Salah: {laporan.bagianData}</p>
                        <p>Data Seharusnya: {laporan.dataSeharusnya}</p>
                    </div>
                )
                getKaryawan({
                    variables: {
                        id: laporan.idKaryawan
                    }
                })
                setIdPermintaan(location.state.laporanPermintaan.id)
            }
        }
    }, [location]);

    useEffect(() => {
        if(data){
            console.log(data);
        }
        if(!data || loading){

        }else if(data.getKaryawanKu !== null){
            var laporan = data.getKaryawanKu
            var tingkatJabatan = laporan.jabatan.tingkatJabatan;
            var jabatan = tingkatJabatan === 2? "Ketua ": 
                            tingkatJabatan === 4? "Ketua ":
                                "Anggota "
            setVariables({
                id: laporan.id,
                username: laporan.nama,
                nik: laporan.nik,
                noTelp: laporan.noTelp,
                tanggalMasuk: dayjs(laporan.tanggalMasuk).format('YYYY-MM-DD'),
                tempatLahir: laporan.tempatLahir,
                tanggalLahir: dayjs(laporan.tanggalLahir).format('YYYY-MM-DD'),
                alamat: laporan.alamat,
                agama: laporan.agama,
                pendidikan: laporan.pendidikan,
                foto: laporan.foto,
                namaJabatan: jabatan + laporan.jabatan.namaJabatan,
            })
            const fileImage = laporan.foto;
            setImageURI(fileImage.replace("localhost:4000", URL))
        }
    }, [data])

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

    const [updateKaryawanKu] = useMutation(updateKaryawan,{
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
            console.log("suksess")
            history.push({
                pathname: '/karyawan/master karyawan',
            });
        }
    })
    const register = () =>{
        console.log(location.state.laporanPermintaan)
        updateKaryawanKu({variables:{
            id: variables.id,
            idPermintaan: idPermintaan,
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
        }
        });
        console.log(variables);
    }
    const handleFileChange = e =>{
        const file = e.target.files[0]
        if(!file) return
        setFile(file);
        const reader = new FileReader();
        reader.onload = () =>{
            if(reader.readyState === 2){
                console.log(reader.result);
                setImageURI(reader.result);
            }
        }
        reader.readAsDataURL(e.target.files[0])
    }

    const [resetPasswordKu] = useMutation(resetPassword,{
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
                password: `Password Baru: ${data.resetPassword.passwordRaw}`
            })
        }
    })
    const actionReset = () => {
        resetPasswordKu({variables:{
            id: variables.id,
        }
        });
    }
    return (
        <CContainer className="containerKu">
            <Row>
                <Col>
                    <BiIcons.BiArrowBack size="50" onClick={() => history.push({pathname: '/karyawan/master karyawan'})} className="iconBack"/>
                </Col>
            </Row>
          <CRow className="justify-content-center">
            <CCol md={4}>
                <CForm>
                    <h1>Perbarui Karyawan</h1>
                    <p className="text-medium-emphasis">Masukkan Data-data Karyawan Yang Baru</p>
                    {showUser}
                    {showError}
                    <CInputGroup className="mb-3">
                        <CInputGroupText>
                            <CIcon content={freeSet.cilUser} />
                        </CInputGroupText>
                        <CFormInput 
                            placeholder="ID" 
                            autoComplete="id" 
                            value={variables.id}
                            disabled={true}/>
                    </CInputGroup>
                    <CInputGroup className="mb-3">
                        <CInputGroupText>
                            <CIcon content={freeSet.cilUser} />
                        </CInputGroupText>
                        <CFormInput 
                            placeholder="Nama Jabatan" 
                            autoComplete="namaJabatan" 
                            value={variables.namaJabatan}
                            disabled={true}/>
                    </CInputGroup>
                    <CInputGroup className="mb-3">
                        <CInputGroupText>
                            <CIcon content={freeSet.cilUser} />
                        </CInputGroupText>
                        <CFormInput 
                            placeholder="Nama Lengkap" 
                            autoComplete="nama" 
                            value={variables.username}
                            onChange={e => setVariables({...variables, username: e.target.value})}/>
                    </CInputGroup>
                    <CInputGroup className="mb-3">
                        <CInputGroupText>
                            <FaIcons.FaIdCard />
                        </CInputGroupText>
                        <CFormInput 
                            placeholder="NIK" 
                            autoComplete="nama" 
                            value={variables.nik}
                            onChange={e => setVariables({...variables, nik: e.target.value})}/>
                    </CInputGroup>
                    <CInputGroup className="mb-3">
                        <CInputGroupText>
                            <FaIcons.FaIdCard />
                        </CInputGroupText>
                        <CFormInput 
                            placeholder="NO.Telp" 
                            autoComplete="nama" 
                            value={variables.noTelp}
                            onChange={e => setVariables({...variables, noTelp: e.target.value})}/>
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
                            value={variables.tempatLahir}
                            onChange={e => setVariables({...variables, tempatLahir: e.target.value})}/>
                    </CInputGroup>
                    <CFormLabel>Tanggal Lahir: </CFormLabel>
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
                            <FaIcons.FaAddressCard />
                        </CInputGroupText>
                        <CFormInput 
                            placeholder="Alamat" 
                            autoComplete="nama" 
                            value={variables.alamat}
                            onChange={e => setVariables({...variables, alamat: e.target.value})}/>
                    </CInputGroup>
                    <CInputGroup className="mb-3">
                        <CInputGroupText>
                            <FaIcons.FaPlaceOfWorship />
                        </CInputGroupText>
                        <CFormSelect 
                            className="col-xl-10" 
                            aria-label="Large select example"
                            value={variables.agama}
                            onChange={e => 
                                setVariables({...variables, agama: e.target.value})
                            }>
                            <option value="Islam">Islam</option>
                            <option value="Kristen">Kristen</option>
                            <option value="Katolik">Katolik</option>
                            <option value="Buddha">Buddha</option>
                            <option value="Hindu">Hindu</option>
                        </CFormSelect>
                    </CInputGroup>
                    <CInputGroup className="mb-3">
                        <CInputGroupText>
                            <CIcon content={freeSet.cilEducation} />
                        </CInputGroupText>
                        <CFormSelect 
                            className="col-xl-10" 
                            aria-label="Large select example"
                            value={variables.pendidikan}
                            onChange={e => 
                                setVariables({...variables, pendidikan: e.target.value})
                            }>
                            <option value="SMP">SMP</option>
                            <option value="SMA">SMA</option>
                            <option value="Sarjana">Sarjana</option>
                        </CFormSelect>
                    </CInputGroup>
                    <CRow>
                        <CCol xs={6}>
                            <CButton color="primary" className="px-4" onClick={() => register()}>
                                Perbarui
                            </CButton>
                        </CCol>
                        <CCol xs={6}>
                            <CButton color="danger" className="px-6" onClick={() => actionReset()}>
                                Reset Password
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
    )
}
