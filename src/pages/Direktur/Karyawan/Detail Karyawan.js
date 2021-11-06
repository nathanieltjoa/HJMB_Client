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

const getKaryawanKu = gql`
query getKaryawanKu(
    $id: Int 
){
    getKaryawanKu(
        id: $id
    ){
        id nama nik tanggalMasuk tempatLahir tanggalLahir alamat agama pendidikan foto jabatan{
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
export default function DetailKaryawan(props) {
    let history = useHistory();
    const location = useLocation();
    const [file, setFile] = useState();
    const [imageURI, setImageURI] = useState();
    const [dataLaporan, setDataLaporan] = useState([]);
    
    let dataPermintaan=[];
    useEffect(() => {
        if(location.state !== undefined){
            setDataLaporan(location.state.laporan);
        }
    }, [location]);
    return (
        <CContainer className="containerKu">
            <Row>
                <Col>
                    <BiIcons.BiArrowBack size="50" onClick={() => history.push({pathname: '/direktur/karyawan/master karyawan'})} className="iconBack"/>
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col className="col-md-12">
                </Col>
            </Row>
          <CRow className="justify-content-center">
            <CCol md={2}>
                <CImage src={!imageURI ? "/default.png": imageURI} alt="" id="img" className="img" width="150" height="150"/>
            </CCol>
            <CCol md={6}>
                <CForm>
                    <h1>Detail Data Karyawan</h1>
                    <div className="parent">
                        <p className="childLeft">Nama Karyawan</p>
                            <p className="childRight">: {dataLaporan.nama}</p>
                        <p className="childLeft">NIK</p>
                            <p className="childRight">: {dataLaporan.nik}</p>
                        <p className="childLeft">NO.Telpon</p>
                            <p className="childRight">: {dataLaporan.noTelp}</p>
                        <p className="childLeft">Tanggal Masuk</p>
                            <p className="childRight">: {dayjs(dataLaporan.tanggalMasuk).format('DD-MM-YYYY')}</p>
                        <p className="childLeft">Tempat Lahir</p>
                            <p className="childRight">: {dataLaporan.tempatLahir}</p>
                        <p className="childLeft">Tanggal Lahir</p>
                            <p className="childRight">: {dayjs(dataLaporan.tanggalLahir).format('DD-MM-YYYY')}</p>
                        <p className="childLeft">Alamat</p>
                            <p className="childRight">: {dataLaporan.alamat}</p>
                        <p className="childLeft">Agama</p>
                            <p className="childRight">: {dataLaporan.agama}</p>
                        <p className="childLeft">Pendidikan</p>
                            <p className="childRight">: {dataLaporan.pendidikan}</p>
                        <p className="childLeft">Jabatan</p>
                            <p className="childRight">: {
                                dataLaporan.jabatan?.tingkatJabatan === 2? "Ketua ": 
                                dataLaporan.jabatan?.tingkatJabatan === 4? "Ketua ":
                                    "Anggota "
                            }{dataLaporan.jabatan?.namaJabatan}</p>
                    </div>
                </CForm>
            </CCol>
          </CRow>
        </CContainer>
    )
}
