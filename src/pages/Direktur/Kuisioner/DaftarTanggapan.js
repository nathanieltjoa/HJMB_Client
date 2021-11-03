import React, {useEffect, useState} from 'react'
import { Row, Col, Card, Button, Form, Container} from 'react-bootstrap';
import { gql, useLazyQuery, useQuery} from '@apollo/client';
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import dayjs from 'dayjs'
import { CCard, CCardBody, CImage } from '@coreui/react';


const getKuisioner = gql`
query getKuisioner{
  getKuisioner{
    id namaKuisioner deskripsiKuisioner
  }
}
`;

const getListDivisi = gql`
query getListDivisi{
  getListDivisi{
    namaDivisi
  }
}
`;

const getListKaryawan= gql`
query getListKaryawan(
  $divisi: String 
){
  getListKaryawan(
    divisi: $divisi
  ){
    id nama
  }
}
`;

const getTanggapanWeb = gql`
query getTanggapanWeb(
    $KuisionerId: Int 
    $idKaryawan: Int 
    $tanggal: MyDate
){
    getTanggapanWeb(
        KuisionerId: $KuisionerId
        idKaryawan: $idKaryawan
        tanggal: $tanggal
    ){
        id teskPertanyaan jenisPertanyaan listTanggapan{
            teskTanggapan
        } listJawaban{
            teskJawaban 
        }
    }
}
`;

export default function DaftarAbsensi(props) {
    const [selectedDateAwal, setSelectedDateAwal] = useState(new Date())
    const [kuisioner, setKuisioner] = useState("");
    const [divisi, setDivisi] = useState("")
    const [karyawan, setKaryawan] = useState("");
    const [listDivisi, setListDivisi] = React.useState({});
    const [listKaryawan, setListKaryawan] = React.useState({});
    const { 
        loading: loadingKuisioner
        , data : dataKuisioner
    } = useQuery(getKuisioner);
    const { 
        loading: loadingDivisi
        , data : dataDivisi
    } = useQuery(getListDivisi);
    const [getListKaryawanKu, { 
      loading: loadingKaryawan,
      data: dataKaryawan,
    }] = useLazyQuery(getListKaryawan);
    const [getTanggapanWebKu, { 
      loading: loadingTanggapan,
      data: dataTanggapan,
    }] = useLazyQuery(getTanggapanWeb);

    let dataKuisionerKu= [];
    let counter = false;
    if(dataKuisioner === undefined || loadingKuisioner){

    }else if(dataKuisioner.getKuisioner.length === 0){

    }else if(dataKuisioner.getKuisioner.length > 0 && !counter){
        
        dataKuisionerKu.push(dataKuisioner.getKuisioner.map((element, index)=>(
            <option key={index} value={element.id}>{element.namaKuisioner}</option>
        )))
        counter = true;
    }

    let dataDivisiKu= [];
    let counterDivisi = false;
    if(dataDivisi === undefined || loadingDivisi){

    }else if(dataDivisi.getListDivisi.length === 0){

    }else if(dataDivisi.getListDivisi.length > 0 && !counterDivisi){
        dataDivisiKu.push(dataDivisi.getListDivisi.map((element, index)=>(
            <option key={index} value={element.id}>{element.namaDivisi}</option>
        )))
        counterDivisi = true;
    }

    let dataKaryawanKu= [];
    let counterKaryawan = false;
    if(dataKaryawan === undefined || loadingKaryawan){

    }else if(dataKaryawan.getListKaryawan.length === 0){

    }else if(dataKaryawan.getListKaryawan.length > 0 && !counterKaryawan){
        dataKaryawanKu.push(dataKaryawan.getListKaryawan.map((element, index)=>(
            <option key={index} value={element.id}>{element.nama}</option>
        )))
        counterKaryawan = true;
    }

    let dataTanggapanKu = [];
    let counterTanggapan = false;
    if(dataTanggapan === undefined || loadingTanggapan){
        if(kuisioner !== ""){
            dataTanggapanKu.push(<p key={0} className="badgeStatusWaitingText">Loading....</p>)
        }
    }else if(dataTanggapan.getTanggapanWeb.length === 0){
        if(kuisioner !== ""){
            dataTanggapanKu.push(<p key={1} className="badgeStatusNonText">Tidak Ada Tanggapan Karyawan</p>)
        }
    }else if(dataTanggapan.getTanggapanWeb.length > 0 && !counterTanggapan){
        dataTanggapanKu.push(dataTanggapan.getTanggapanWeb.map((element, index)=>(
            <CCard style={{marginBottom: 5}}>
                <CCardBody>
                    <p>Pertanyaan: {element.teskPertanyaan}</p>
                    <p style={{backgroundColor: 'greenyellow'}}>Jawaban: {element.listTanggapan[0].teskTanggapan}</p>
                </CCardBody>
            </CCard>
        )))
        counterKaryawan = true;
    }

    useEffect(() => {
      if(!dataDivisi){

      }else if(dataDivisi.getListDivisi.length > 0){
        setListDivisi(dataDivisi.getListDivisi);
      }
    }, [dataDivisi])

    useEffect(() => {

      if(!dataKaryawan){

      }else if(dataKaryawan.getListKaryawan.length > 0){
        setListKaryawan(dataKaryawan.getListKaryawan);
      }
    }, [dataKaryawan])  


    useEffect(() => {
      if(divisi !== ""){
        getListKaryawanKu({variables: {
          divisi: divisi
        }})
      }
    }, [divisi])

    const cariData = e =>{
        e.preventDefault();
        console.log(kuisioner + " - "+ karyawan)
        getTanggapanWebKu({
            variables: {
                KuisionerId: parseInt(kuisioner),
                idKaryawan: parseInt(karyawan),
                tanggal: selectedDateAwal,
            }
        });
    }

    return (
        <Container className="containerKu">
            <Row className="bg-white p-0 justify-content-center">
                <CCard className="col-md-5">
                    <CCardBody>
                        <h1 className="text-center">Form Data Tanggapan</h1>
                        <Form onSubmit={cariData}>
                            <Form.Group as={Col}>
                            <Form.Label>Kuisioner</Form.Label>
                                <Form.Control 
                                    as="select" 
                                    value={kuisioner}
                                    onChange={e => 
                                        setKuisioner(e.target.value)
                                }>
                                    <option value=""></option>
                                    {dataKuisionerKu}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group as={Col}>
                            <Form.Label>Bulan</Form.Label>
                            <DatePicker
                                selected={selectedDateAwal}
                                onChange={date => setSelectedDateAwal(date)}
                                dateFormat='MM-yyyy'
                                maxDate={new Date()}
                                showMonthYearPicker
                            />
                            </Form.Group>
                            <Form.Group as={Col}>
                            <Form.Label>Divisi</Form.Label>
                                <Form.Control 
                                    as="select" 
                                    value={divisi}
                                    onChange={e => 
                                        setDivisi(e.target.value)
                                }>
                                    <option value=""></option>
                                    {dataDivisiKu}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group as={Col}>
                            <Form.Label>Karyawan</Form.Label>
                                <Form.Control 
                                    as="select" 
                                    value={karyawan}
                                    onChange={e => 
                                        setKaryawan(e.target.value)
                                }>
                                    <option value=""></option>
                                    {dataKaryawanKu}
                                </Form.Control>
                            </Form.Group>
                            <div className="text-center">
                                <Button variant="success" type="submit" >
                                    Cari
                                </Button>
                            </div>
                        </Form>
                    </CCardBody>
                </CCard>
            </Row>
            <Row className="justify-content-center" style={{marginTop: 10}}>
                <Col className="col-md-8">
                    <h2 className="text-center">Data Tanggapan</h2>
                    {dataTanggapanKu}
                </Col>
            </Row>
        </Container>
    )
}