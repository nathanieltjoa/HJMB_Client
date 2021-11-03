import React, {useState, Fragment, useEffect} from 'react'
import { Row, Col, Form, Button, Alert, Container} from 'react-bootstrap';
import { gql, useQuery, useMutation, useLazyQuery} from '@apollo/client';
import dayjs from 'dayjs'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import DatePicker from 'react-datepicker'
import CurrencyFormat from 'react-currency-format';

const registerKontrakKaryawan = gql`
    mutation registerKontrakKaryawan(
        $jenisKontrak: String   
        $gaji: [indexKontrakInput]
        $iuran: [indexKontrakInput]
        $tanggalMulai: MyDate
        $tanggalBerakhir: MyDate
        $idKaryawan: Int 
  ) {
    registerKontrakKaryawan(
        jenisKontrak: $jenisKontrak
        gaji: $gaji 
        iuran: $iuran
        tanggalMulai: $tanggalMulai
        tanggalBerakhir: $tanggalBerakhir
        idKaryawan: $idKaryawan
    ) {
        id
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

const getListKaryawan = gql`
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

const getIndexGaji = gql`
query getIndexGaji(
    $status: Boolean
){
    getIndexGaji(
        status: $status
    ){
    id namaGaji
  }
}
`;

const getIndexIuran = gql`
query getIndexIuran(
    $status: Boolean
){
    getIndexIuran(
        status: $status
    ){
    id namaIuran
  }
}
`;

export default function TambahKontrak(props) {
    const [divisi, setDivisi] = useState("");
    const [idKaryawan, setIdKaryawan] = useState(0);
    const [jenisKontrak, setJenisKontrak] = useState("");
    const [tanggalMulai, setTanggalMulai] = useState(new Date());
    const [tanggalBerakhir, setTanggalBerakhir] = useState(new Date());
    const [gaji, setGaji] = useState([]);
    const [iuran, setIuran] = useState([]);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState({});
    
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

    const [registerKontrakKaryawanKu] = useMutation(registerKontrakKaryawan,{
        update(_,res){
            console.log(res)
        },
        onError: (err) => {
            console.log(err)
            alert(err.graphQLErrors[0].extensions.errors)
            setErrors(err.graphQLErrors[0].extensions.errors)
            setSuccess({});
        },
        onCompleted(data){
            setErrors({});
            setSuccess({
                Sukses: `Suksess Tambah Kontrak Karyawan`,
            })
        }
    })

    const registerIndex = () =>{
        registerKontrakKaryawanKu({variables:{
            idKaryawan: parseInt(idKaryawan),
            jenisKontrak: jenisKontrak,
            gaji: gaji,
            iuran: iuran,
            tanggalMulai: dayjs(tanggalMulai).format('YYYY-MM-DD'),
            tanggalBerakhir: dayjs(tanggalBerakhir).format('YYYY-MM-DD')
        }
        });
    }
    
    const { 
        loading: loadingDivisi,
        data: dataDivisi 
    } = useQuery(getListDivisi);

    let dataDivisiKu = [];
    let counterDivisi = false;
    if(!dataDivisi || loadingDivisi){

    }else if(dataDivisi.getListDivisi.length === 0){
        
    }else if(dataDivisi.getListDivisi.length > 0 && !counterDivisi){
        dataDivisiKu.push(dataDivisi.getListDivisi.map((divisi,index) =>(
            <option key={index} value={divisi.namaDivisi}>
                {divisi.namaDivisi}
            </option>
        )))
        counterDivisi = true;
    }

    useEffect(() => {
        getKaryawanKu({
            variables: {
                divisi: divisi
            }
        })
    }, [divisi])
    
    const [getKaryawanKu,{ 
        loading: loadingKaryawan,
        data: dataKaryawan 
    }] = useLazyQuery(getListKaryawan);

    let dataKaryawanKu = [];
    let counterKaryawan = false;
    if(!dataKaryawan || loadingKaryawan){

    }else if(dataKaryawan.getListKaryawan.length === 0){
        
    }else if(dataKaryawan.getListKaryawan.length > 0 && !counterKaryawan){
        console.log(dataKaryawan.getListKaryawan);
        dataKaryawanKu.push(dataKaryawan.getListKaryawan.map((karyawan,index) =>(
            <option key={index} value={karyawan.id}>
                {karyawan.nama}
            </option>
        )))
        counterKaryawan = true;
    }

    const { 
        loading: loadingGaji,
        data: dataGaji 
    } = useQuery(getIndexGaji);

    const { 
        loading: loadingIuran,
        data: dataIuran 
    } = useQuery(getIndexIuran);

    useEffect(() => {
        if(!dataGaji || loadingGaji){

        }else if(dataGaji.getIndexGaji.length > 0){
            dataGaji.getIndexGaji.map((laporan) =>{
                setGaji(prevItems =>[...prevItems, {
                    id: laporan.id,
                    total: 0,
                }])
            })
        }
    }, [dataGaji])

    useEffect(() => {
        if(!dataIuran || loadingIuran){

        }else if(dataIuran.getIndexIuran.length > 0){
            dataIuran.getIndexIuran.map((laporan) =>{
                setIuran(prevItems =>[...prevItems, {
                    id: laporan.id,
                    total: 0,
                }])
            })
        }
    }, [dataIuran])

    const updateNilai = (nilai, id, counter) =>{
        if(counter === "Gaji"){
            setGaji(gaji.map((item) =>
                item.id === id?
                {...item,
                    total: parseInt(nilai.value), }:
                item
            ))
        }
        else{
            console.log(nilai.value);
            setIuran(iuran.map((item) =>
                item.id === id?
                {...item,
                    total: parseInt(nilai.value), }:
                item
            ))
        }
    }
    
    return (
        <Container className="containerKu">
            <Row className="justify-content-center">
                <Col><h1 className="text-center">Tambah Kontrak Karyawan</h1></Col>
            </Row>
            <Row className="justify-content-md-center">
                <Col className="col-md-7">
                    <Form>
                        {showError}
                        {showUser}
                        <Form.Group as={Col}>
                            <Form.Label>Divisi Karyawan</Form.Label>
                            <Form.Control 
                                as="select" 
                                value={divisi} 
                                onChange={e => 
                                    setDivisi(e.target.value)
                                }
                            >
                                <option value=""></option>
                                {dataDivisiKu}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Pilih Karyawan</Form.Label>
                            <Form.Control 
                                as="select" 
                                onChange={e => 
                                    setIdKaryawan(e.target.value)
                                }
                            >
                                <option value=""></option>
                                {dataKaryawanKu}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Jenis Kontrak</Form.Label>
                            <Form.Control 
                                as="select" 
                                value={jenisKontrak} 
                                onChange={e => 
                                    setJenisKontrak(e.target.value)
                                }
                            >
                                <option value="Harian">Harian</option>
                                <option value="Bulanan">Bulanan</option>
                            </Form.Control>
                        </Form.Group>
                        <Row className="justify-content-center text-center">
                            <div className="col-md-4">
                                <Form.Label>Tanggal Mulai:</Form.Label>
                                <DatePicker
                                    selected={tanggalMulai}
                                    onChange={date => setTanggalMulai(date)}
                                    dateFormat='dd-MM-yyyy'
                                    maxDate={tanggalBerakhir}
                                    showYearDropdown
                                    scrollableMonthYearDropdown
                                />
                            </div>
                            <div className="col-md-4">
                                <Form.Label>Tanggal Berakhir:</Form.Label>
                                <DatePicker
                                    selected={tanggalBerakhir}
                                    onChange={date => setTanggalBerakhir(date)}
                                    dateFormat='dd-MM-yyyy'
                                    showYearDropdown
                                    scrollableMonthYearDropdown
                                />
                            </div>
                        </Row>
                    </Form>
                </Col>
            </Row>
            <Row>
                <Col className="col-md-6">
                    <Table className="tableKu" aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Nama Iuran</TableCell>
                                <TableCell align="center">Total</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                dataIuran?.getIndexIuran.map((laporan,index) =>(
                                    <TableRow key={index}>
                                        <TableCell component="th" align="center">{laporan.namaIuran}</TableCell>
                                        <TableCell component="th" align="center">
                                            <Form.Group as={Col} align="center">
                                                <CurrencyFormat 
                                                    thousandSeparator={'.'} 
                                                    decimalSeparator={','} 
                                                    prefix={'Rp '}
                                                    style={{width: '50%'}}
                                                    onValueChange={(value) => {
                                                            updateNilai(value, laporan.id, "Iuran")
                                                        }
                                                    } 
                                                />
                                            </Form.Group>
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </Col>
                <Col className="col-md-6">
                    <Table className="tableKu" aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Nama Gaji</TableCell>
                                <TableCell align="center">Total</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                dataGaji?.getIndexGaji.map((laporan,index) =>(
                                    <TableRow key={index}>
                                        <TableCell component="th" align="center">{laporan.namaGaji}</TableCell>
                                        <TableCell component="th" align="center">
                                            <Form.Group as={Col} align="center">
                                                <CurrencyFormat 
                                                    defaultValue={0}
                                                    thousandSeparator={'.'} 
                                                    decimalSeparator={','} 
                                                    prefix={'Rp '}
                                                    style={{width: '50%'}}
                                                    onValueChange={(value) => {
                                                            updateNilai(value, laporan.id, "Gaji")
                                                        }
                                                    } 
                                                />
                                            </Form.Group>
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </Col>
            </Row>
            <Row style={{marginTop:10}}>
                <Col className="text-center">
                    <Button variant="primary" onClick={() => registerIndex()}>
                        Tambah Kontrak
                    </Button>
                </Col>
            </Row>
        </Container>
    )
}
