import React, {useState, Fragment, useEffect} from 'react'
import { Row, Col, Form, Button, Alert, Container} from 'react-bootstrap';
import { gql, useQuery, useMutation} from '@apollo/client';
import { Slider } from '@material-ui/core';
import { CCard, CCardBody, CImage } from '@coreui/react';

const getKuisionerMobile = gql`
query getKuisionerMobile{
  getKuisionerMobile{
    id namaKuisioner deskripsiKuisioner
  }
}
`;

const getPertanyaan = gql`
query getPertanyaan(
  $KuisionerId: Int 
){
  getPertanyaan(
    KuisionerId: $KuisionerId
  ){
    id teskPertanyaan jenisPertanyaan listJawaban{
      id teskJawaban
    }
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

const getListKaryawanKuisioner= gql`
query getListKaryawanKuisioner(
  $divisi: String 
  $status: String 
){
  getListKaryawanKuisioner(
    divisi: $divisi
    status: $status
  ){
    id nama jabatan{
        namaJabatan tingkatJabatan
    }
  }
}
`;

const tambahTanggapanKuisioner = gql`
    mutation tambahTanggapanKuisioner(
      $KuisionerId: Int
      $answerText: [AnswerInput]
      $answerRadio: [AnswerIntInput]
      $answerPilihan: [AnswerIntInput]
      $answerOpsi: [AnswerInput]
    ){
      tambahTanggapanKuisioner(
        KuisionerId: $KuisionerId
        answerText: $answerText
        answerRadio: $answerRadio
        answerPilihan: $answerPilihan
        answerOpsi: $answerOpsi
        ){
            id
        }
    }
`;
export default function IsiKuisioner(props) {
    const [kuisioner, setKuisioner] = useState(0);
    const [answerText, setAnswerText] = useState([]);
    const [answerRadio, setAnswerRadio] = useState([]);
    const [answerPilihan, setAnswerPilihan] = useState([]);
    const [answerOpsi, setAnswerOpsi] = useState([]);
    const [listDivisi, setListDivisi] = useState({});
    const [listKaryawan, setListKaryawan] = useState({});
    const [listRadio, setListRadio] = useState({});
    const [divisi, setDivisi] = useState("");
    const [karyawan, setKaryawan] = useState(0);
    const [value, setValue] = useState("1");
    const [jenisKaryawan, setJenisKaryawan] = useState("");
    const { 
        loading: loadingKuisioner, 
        data: dataKuisioner, 
        refetch: refetchKuisioner
    } = useQuery(getKuisionerMobile);
    const { 
        loading: loadingDivisi, 
        data: dataDivisi, 
        refetch: refetchDivisi
    } = useQuery(getListDivisi);
    const { 
        loading: loadingPertanyaan,
        data: dataPertanyaan,
        refetch: refetchPertanyaan
    } = useQuery(getPertanyaan,{
        variables: {
        KuisionerId: parseInt(kuisioner)
        }
    });
    const { 
        loading: loadingKaryawan,
        data: dataKaryawan,
        refetch: refetchKaryawan,
    } = useQuery(getListKaryawanKuisioner,{
        variables:{
        divisi: divisi,
        status: jenisKaryawan
        }
    });

    const pushText = (text, id) => {
        setAnswerText(answerText.map((item) => 
            item.id === id? 
            {...item, 
            text: text,
            edit: true }: 
            item))
        console.log(text + " - " + id)
    }
    
    const pushRating = (text, id) => {
        console.log(answerRadio)
        setAnswerRadio(answerRadio.map((item) => 
            item.id === id? 
            {...item, 
            text: text,
            edit: true }: 
            item))
        console.log(text + " - "+ id)
    }

    const pushPilihan = (text, id) =>{
        setAnswerPilihan(answerPilihan.map((item) => 
            item.id === id? 
            {...item, 
            text: parseInt(text),
            edit: true }: 
            item))
        console.log(text+ " - " + id);
    }

    const pushOpsi = (text, id) =>{
        setAnswerOpsi(answerOpsi.map((item) => 
            item.id === id? 
            {...item, 
            text: text,
            edit: true }: 
            item))
        console.log(text+ " - " + id);
    }

    let dataKuisionerKu = [];
    let dataPertanyaanKu = [];
    if(!dataKuisioner || loadingKuisioner){

    }else if(dataKuisioner.getKuisionerMobile.length === 0){

    }else if(dataKuisioner.getKuisionerMobile.length > 0){
        dataKuisionerKu.push(dataKuisioner.getKuisionerMobile.map((laporan,index) =>(
            <option value={laporan.id} key={index}>{laporan.namaKuisioner}</option>
        )))
    }

    useEffect(() => {
        if(!dataPertanyaan || loadingPertanyaan){

        }else if(dataPertanyaan.getPertanyaan.length > 0){
        dataPertanyaan.getPertanyaan.map((laporan,index) =>{
            if(laporan.jenisPertanyaan === "Pilih Karyawan"){
                setJenisKaryawan(laporan.listJawaban[0].teskJawaban)
            }
        })
        }
    }, [dataPertanyaan])

    if(!dataPertanyaan || loadingPertanyaan){
        dataPertanyaanKu.push(<p key={0} className="badgeStatusWaitingText">Loading...</p>)
    }else if(dataPertanyaan.getPertanyaan.length === 0){
        dataPertanyaanKu.push(<p key={1} className="badgeStatusNonText">Tidak Ada Pertanyaan</p>)
    }else if(dataPertanyaan.getPertanyaan.length > 0){
        dataPertanyaanKu.push(dataPertanyaan.getPertanyaan.map((laporan,index) =>(
            <CCard style={{marginBottom: 5}}>
                <CCardBody>
                    {laporan.jenisPertanyaan === "Tesk"? 
                    <Form.Group as={Col}>
                        <Form.Label>{laporan.teskPertanyaan}</Form.Label>
                        <Form.Control 
                            as="textarea" 
                            name="nama"
                            onChange={e => 
                                pushText(e.target.value, laporan.id)}
                        />
                    </Form.Group>:
                    laporan.jenisPertanyaan === "Rating"?
                        <div>
                            <Form.Label>{laporan.teskPertanyaan}</Form.Label>
                            <Slider
                                defaultValue={1}
                                valueLabelDisplay="auto"
                                step={1}
                                marks
                                min={1}
                                max={laporan.listJawaban[0].teskJawaban}
                                onChange={(event, value) => pushRating(value,laporan.id)}
                            />
                        </div>
                        :
                        laporan.jenisPertanyaan === "Pilih Karyawan"? 
                            <Form.Group as={Col}>
                                <Form.Label>{laporan.teskPertanyaan}</Form.Label>
                                <Form.Control 
                                    as="select" 
                                    onChange={e => 
                                        pushPilihan(e.target.value, laporan.id)
                                    }
                                >
                                    <option value="">Pilih Karyawan</option>
                                    {
                                        listKaryawan.length === undefined ? null:
                                        listKaryawan.map((element,index1) => (
                                            <option value={element.id} key={index1}>{element.nama} (Ketua {element.jabatan.namaJabatan})</option>
                                        ))
                                    }
                                </Form.Control>
                            </Form.Group>:
                            laporan.jenisPertanyaan === "Pilih Opsi"?<Form.Group as={Col}>
                                <Form.Label>{laporan.teskPertanyaan}</Form.Label>
                                    <Form.Control 
                                        as="select" 
                                        onChange={e => 
                                            pushOpsi(e.target.value, laporan.id)
                                        }
                                    >
                                        <option value="">Pilih Opsi</option>
                                        {laporan.listJawaban.map((jawaban, index1) => (
                                            <option value={jawaban.teskJawaban} key={index1}>{jawaban.teskJawaban}</option>
                                        ))}
                            </Form.Control>
                        </Form.Group> 
                        :null}
                    </CCardBody>
                </CCard>
        )))
    }

    useEffect(() => {
        setListKaryawan({});
        console.log("masuk ko")
        refetchPertanyaan()
    }, [kuisioner])

    useEffect(() => {
    if(!dataDivisi){

    }else if(dataDivisi.getListDivisi.length > 0){
        setListDivisi(dataDivisi.getListDivisi);
    }
    }, [dataDivisi])
    
    useEffect(() => {
    if(jenisKaryawan !== ""){
        refetchKaryawan()
    }
    }, [jenisKaryawan])

    useEffect(() => {
    if(divisi !== ""){
        refetchKaryawan()
    }
    }, [divisi])

    useEffect(() => {
    console.log("berubah")
    if(!dataKaryawan){

    }else if(dataKaryawan.getListKaryawanKuisioner.length > 0){
        console.log("masuk1")
        console.log(dataKaryawan.getListKaryawanKuisioner)
        setListKaryawan(dataKaryawan.getListKaryawanKuisioner);
    }
    }, [dataKaryawan])   

    useEffect(() => {
        if(!dataPertanyaan){

        }else if(dataPertanyaan.getPertanyaan.length > 0){
            dataPertanyaan.getPertanyaan.map((laporan) =>(
                laporan.jenisPertanyaan === "Tesk"?
                    setAnswerText(prevItems =>[...prevItems, {
                    id: laporan.id,
                    text: "",
                    edit: false,
                    }]): 
                    laporan.jenisPertanyaan === "Rating"?
                    setAnswerRadio(prevItems =>[...prevItems, {
                        id: laporan.id,
                        text: 1,
                        edit: false,
                    }]):
                    laporan.jenisPertanyaan === "Pilih Karyawan"?
                        setAnswerPilihan(prevItems =>[...prevItems, {
                        id: laporan.id,
                        text: "",
                        edit: false,
                        }]):
                        laporan.jenisPertanyaan === "Pilih Opsi"?
                        setAnswerOpsi(prevItems =>[...prevItems, {
                        id: laporan.id,
                        text: "",
                        edit: false,
                        }]):null
            ))
        }
    }, [dataPertanyaan])

    useEffect(() => {
        if (window.performance) {
            if (performance.navigation.type == 1) {
                refetchKuisioner()
                console.log('Refreshed!');
            }
        }
    }, []) 
    

    const [tambahTanggapanKu] = useMutation(tambahTanggapanKuisioner,{
        onError: (err) => {
            alert(err.graphQLErrors[0].extensions.errors);
        },
        onCompleted(data){
            console.log("sukess")
            console.log(data);
            alert("Suksess Tambah Tanggapan")
        }
    })
    const submitLaporan = e => {
        e.preventDefault();
        var sudahIsi = true;
        answerText.map(element => {
          if(element.edit === false) sudahIsi = false;
        })
        answerOpsi.map(element => {
          if(element.edit === false) sudahIsi = false;
        })
        answerPilihan.map(element => {
          if(element.edit === false) sudahIsi = false;
        })
        answerRadio.map(element => {
          if(element.edit === false) sudahIsi = false;
        })
        if(sudahIsi === true){
            tambahTanggapanKu(
                {variables:{
                    KuisionerId: parseInt(kuisioner),
                    answerText: answerText,
                    answerRadio: answerRadio,
                    answerPilihan: answerPilihan,
                    answerOpsi: answerOpsi,
                }
            });
        }else{
            alert("Error Masih Ada Pertanyaan Yang Belum Diisi")
        }
    }

    return (
        <Container className="containerKu">
            <Row className="bg-white justify-content-center">
                <Col><h1 className="text-center">Isi Kuisioner</h1></Col>
            </Row>
            <Row className="bg-white py-5 justify-content-md-center">
                <Col xs lg="5">
                    <Form onSubmit={submitLaporan}>
                        <Form.Group as={Col}>
                            <Form.Label>Pilih Kuisioner</Form.Label>
                            <Form.Control 
                                as="select" 
                                value={kuisioner} 
                                onChange={e => 
                                    setKuisioner(e.target.value)
                                }
                            >
                                <option value=""></option>
                                {dataKuisionerKu}
                            </Form.Control>
                        </Form.Group>
                        {dataPertanyaanKu}
                    <div className='text-center'>
                        <Button variant="success" type="submit">
                            Masukkan
                        </Button>
                    </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}
