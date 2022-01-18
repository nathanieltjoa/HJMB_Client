import React, {useState, Fragment, useEffect} from 'react'
import { Row, Col, Form, Button, Alert, Container} from 'react-bootstrap';
import { gql, useQuery, useMutation, useLazyQuery} from '@apollo/client';
import dayjs from 'dayjs'
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { useHistory } from 'react-router-dom';

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

const getIndexPenilaian = gql`
query getIndexPenilaian{
    getIndexPenilaian{
    id namaIndex nilaiIndex keteranganIndex status
  }
}
`;

const registerNilaiHRD = gql`
    mutation registerNilaiHRD(
        $idKaryawan: Int 
        $ListNilaiInput: [ListNilaiInput]
  ) {
    registerNilaiHRD(
        idKaryawan: $idKaryawan
        ListNilaiInput: $ListNilaiInput
    ) {
        id
    }
  }
`;
export default function TambahPertanyaan(props) {
    const [divisi, setDivisi] = useState("");
    const [karyawan, setKaryawan] = useState(0);
    const [listKaryawan, setListKaryawan] = useState([]);
    const [listDivisi, setListDivisi] = useState([]);
    const [listNilai, setListNilai] = useState([]);
    const [idKaryawan, setIdKaryawan] = useState(0);
    const [nilaiKaryawan, setNilaiKaryawan] = useState(0);
    const [keterangan, setKeterangan] = useState("");
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState({});

    const { loading, data, refetch } = useQuery(getIndexPenilaian);
    
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

    const { 
        loading: loadingDivisi, 
        data: dataDivisi, 
        refetch: refetchDivisi
      } = useQuery(getListDivisi);

    const [getListKaryawanKu, { 
        loading: loadingKaryawan,
        data: dataKaryawan,
    }] = useLazyQuery(getListKaryawan);

    useEffect(() => {
        if(!dataDivisi){
  
        }else if(dataDivisi.getListDivisi.length > 0){
          setListDivisi(dataDivisi.getListDivisi);
        }
      }, [dataDivisi])
  
      useEffect(() => {
        if(divisi !== ""){
          getListKaryawanKu({variables: {
            divisi: divisi
          }})
        }
      }, [divisi])

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

    const [registerNilaiKu] = useMutation(registerNilaiHRD,{
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
                Sukses: `Suksess tambah Penilaian`,
            })
        }
    })

    const register = e =>{
        e.preventDefault();
        console.log("masuk");
        console.log(listNilai);
        registerNilaiKu({
            variables: {
                idKaryawan: parseInt(karyawan),
                ListNilaiInput: listNilai
            }
        })
    }

    const updateNilai = (nilai, id, persentase) =>{
        var hasil = parseInt(nilai) * persentase / 100;
        setListNilai(listNilai.map((item) => 
          item.id === id? 
          {...item, 
            hasil: parseFloat(hasil), }: 
          item))
    }

    
    useEffect(() => {
        if(!data){
  
        }else if(data.getIndexPenilaian.length > 0){
            data.getIndexPenilaian.map((laporan) =>{
                setListNilai(prevItems =>[...prevItems, {
                    id: laporan.id,
                    hasil: parseFloat(0),
                }])
            })
        }
      }, [data])
    return (
        <Container className="containerKu">
            <Row className="bg-white justify-content-center">
                <Col><h1 className="text-center">Tambah Penilaian</h1></Col>
            </Row>
            <Row className="bg-white py-5 justify-content-md-center">
                <Col className="col-md-4">
                    {showError}
                    {showUser}
                    <Form.Group as={Col}>
                    <Form.Label>Divisi</Form.Label>
                        <Form.Control 
                            as="select"
                            value={divisi}
                            onChange={e => 
                                setDivisi(e.target.value)
                        }>
                            <option value="">Pilih Divisi</option>
                            {
                                listDivisi.map((element,index) => (
                                    <option value={element.namaDivisi} key={index}>{element.namaDivisi}</option>
                                ))
                            }
                        </Form.Control>
                    </Form.Group>
                    <Form.Group as={Col}>
                    <Form.Label className={errors.karyawan && 'text-danger'}>{errors.karyawan ?? 'Karyawan'}</Form.Label>
                        <Form.Control 
                            as="select"
                            value={karyawan}
                            onChange={e => 
                                setKaryawan(e.target.value)
                        }>
                            <option value={0}>Pilih Karyawan</option>
                            {
                                listKaryawan.length === undefined ? null:
                                listKaryawan.map((element,index) => (
                                    <option value={element.id} key={index}>{element.nama}</option>
                                ))
                            }
                        </Form.Control>
                    </Form.Group>
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col className="col-md-8">
                    <Form onSubmit={register}>
                        <TableContainer component={Paper} key={0}>
                            <Table className="tableKu" aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">Nama Indeks</TableCell>
                                        <TableCell align="center">Keterangan Indeks</TableCell>
                                        <TableCell align="right">Persentase Indeks</TableCell>
                                        <TableCell align="right">Nilai ( 0-100 )</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        data?.getIndexPenilaian.map((laporan,index) =>(
                                            <TableRow key={index}>
                                                <TableCell component="th" align="center">{laporan.namaIndex}</TableCell>
                                                <TableCell component="th" align="center">{laporan.keteranganIndex}</TableCell>
                                                <TableCell component="th" align="right">{laporan.nilaiIndex}</TableCell>
                                                <TableCell component="th" align="right">
                                                    <Form.Group as={Col} align="right">
                                                        <Form.Control 
                                                            type="text" 
                                                            name="nama"
                                                            style={{width: '40%'}}
                                                            onChange={e => 
                                                                updateNilai(e.target.value, laporan.id, laporan.nilaiIndex)}
                                                        />
                                                    </Form.Group>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <div className='text-center' style={{marginTop: 10}}>
                            <Button variant="primary" type="submit">
                                Tambah Penilaian
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}
