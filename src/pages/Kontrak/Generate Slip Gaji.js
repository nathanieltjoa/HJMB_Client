import React, {useState, Fragment, useEffect} from 'react'
import { Row, Col, Form, Button, Alert, Container, Badge, Modal} from 'react-bootstrap';
import { gql, useQuery, useMutation, useLazyQuery} from '@apollo/client';
import dayjs from 'dayjs'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import CurrencyFormat from 'react-currency-format';

const registerPembayaranGaji = gql`
    mutation registerPembayaranGaji(
        $idKaryawan: Int 
        $jumlahLembur: Int
        $ptkp: Int 
        $jumlahTelat: Int 
  ) {
    registerPembayaranGaji(
        idKaryawan: $idKaryawan
        jumlahLembur: $jumlahLembur
        ptkp: $ptkp
        jumlahTelat: $jumlahTelat
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

const getListKaryawanPembayaranGaji = gql`
query getListKaryawanPembayaranGaji(
    $divisi: String 
){
    getListKaryawanPembayaranGaji(
        divisi: $divisi
    ){
        id nama
  }
}
`;

const getListAbsensiPribadiMaster = gql`
    query getListAbsensiPribadiMaster(
        $idKaryawan: Int 
    ){
        getListAbsensiPribadiMaster(
            idKaryawan: $idKaryawan 
        ){
            tanggal scanMasuk scanPulang terlambat jamBolos absen lembur jamKerja{
                namaShift jamMasuk jamKeluar
            } karyawan{nama}
        }
    }
`;

const getListLemburPribadiMaster = gql`
query getListLemburPribadiMaster(
    $idKaryawan: Int 
){
    getListLemburPribadiMaster(
        idKaryawan: $idKaryawan 
    ){
        tanggalMulai keterangan status alasan
    }
}
`;

export default function GenerateSlipGaji(props) {
    const [idKaryawan, setIdKaryawan] = useState(0);
    const [lembur, setLembur] = useState(0);
    const [telat, setTelat] = useState(0);
    const [PTKP, setPTKP] = useState(0);
    const [divisi, setDivisi] = useState("");
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState({});
    
    let showError
    let showUser
    if(success){
        showUser = 
            Object.keys(success).map(i => (
                <Alert variant='success'>
                    {success[i]}
                </Alert>
            ))
    }
    if(errors.length !== undefined){
        showError = 
            <Alert variant='danger'>
                {errors}
            </Alert>
    }

    const [registerPembayaranGajiKu] = useMutation(registerPembayaranGaji,{
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
                Sukses: `Suksess Tambah Slip Pembayaran Gaji`,
            })
        }
    })

    const registerIndex = () =>{
        registerPembayaranGajiKu({variables:{
            idKaryawan: parseInt(idKaryawan),
            jumlahLembur: parseInt(lembur),
            ptkp: parseInt(PTKP),
            jumlahTelat: parseInt(telat)
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
    }] = useLazyQuery(getListKaryawanPembayaranGaji);

    let dataKaryawanKu = [];
    let counterKaryawan = false;
    if(!dataKaryawan || loadingKaryawan){

    }else if(dataKaryawan.getListKaryawanPembayaranGaji.length === 0){
        
    }else if(dataKaryawan.getListKaryawanPembayaranGaji.length > 0 && !counterKaryawan){
        dataKaryawanKu.push(dataKaryawan.getListKaryawanPembayaranGaji.map((karyawan,index) =>(
            <option key={index} value={karyawan.id}>
                {karyawan.nama}
            </option>
        )))
        counterKaryawan = true;
    }

    const [getAbsensiKu,{ 
        loading: loadingAbsensi,
        data: dataAbsensi 
    }] = useLazyQuery(getListAbsensiPribadiMaster);

    let dataAbsensiKu = [];
    if(!dataAbsensi || loadingAbsensi){

    }else if(dataAbsensi.getListAbsensiPribadiMaster.length === 0){
        dataAbsensiKu.push(<div className="badgeStatusNon">Tidak Ada Data</div>)
    }else if(dataAbsensi.getListAbsensiPribadiMaster.length > 0){
        console.log(dataAbsensi.getListAbsensiPribadiMaster);
        dataAbsensiKu.push(
            <div>
                <h3>Absensi Karyawan</h3>
                <div className='tableContainer'>
                    <table size='string' className="table" aria-label="simple table">
                        <thead>
                            <tr>
                                <th>Tanggal</th>
                                <th>Shift</th>
                                <th>Jam Masuk</th>
                                <th>Jam Keluar</th>
                                <th>Scan Masuk</th>
                                <th>Scan Pulang</th>
                                <th>Absen</th>
                                <th>Lembur</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                dataAbsensi.getListAbsensiPribadiMaster.map((laporan,index) =>(
                                    <tr key={index} >
                                        <td data-label="Tanggal">{dayjs(laporan.tanggal).format('DD-MM-YYYY')}</td>
                                        <td data-label="Shift">{laporan.jamKerja.namaShift}</td>
                                        <td data-label="Jam Masuk">{laporan.jamKerja.jamMasuk}</td>
                                        <td data-label="Jam Keluar">{laporan.jamKerja.jamKeluar}</td>
                                        <td data-label="Scan Masuk">{laporan.scanMasuk === ""? "-": laporan.scanMasuk}</td>
                                        <td data-label="Scan Keluar">{laporan.scanPulang === ""? "-": laporan.scanPulang}</td>
                                        <td data-label="Absen">{laporan.absen === true? <div className="badgeStatusNon">Bolos</div>: <div className="badgeStatusAktif">Aman</div>}</td>
                                        <td data-label="Lembur">{laporan.lembur === ""? "-": laporan.lembur}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

    const [getLemburKu,{ 
        loading: loadingLembur,
        data: dataLembur
    }] = useLazyQuery(getListLemburPribadiMaster,{
        variables: {
            idKaryawan: parseInt(idKaryawan)
        }
    });

    let dataLemburKu = [];
    if(!dataLembur || loadingLembur){

    }else if(dataLembur.getListLemburPribadiMaster.length === 0){
        dataLemburKu.push(<div className="badgeStatusNon">Tidak Ada Data</div>)
    }else if(dataLembur.getListLemburPribadiMaster.length > 0){
        console.log(dataLembur.getListLemburPribadiMaster);
        dataLemburKu.push(
            <div className='tableContainer'>
                <table size='string' className="table" aria-label="simple table">
                    <thead>
                        <tr>
                            <th>Tanggal</th>
                            <th>Keterangan</th>
                            <th>Alasan</th>
                            <th>#</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            dataLembur.getListLemburPribadiMaster.map((laporan,index) =>(
                                <tr key={index} >
                                    <td data-label="Nama Indeks">{dayjs(laporan.tanggalMulai).format('DD-MM-YYYY')}</td>
                                    <td data-label="Keterangan">{laporan.keterangan}</td>
                                    <td data-label="Status">{laporan.alasan}</td>
                                    <td data-label="#">
                                        {
                                            laporan.status === 3? <div className="badgeStatusAktif">Di Terima</div>:
                                            <div className="badgeStatusNon">Di Tolak</div>
                                        }
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        )
    }

    const lihatSummary = () => {
        console.log("Karyawan: "+ idKaryawan)
        getAbsensiKu({
            variables: {
                idKaryawan: parseInt(idKaryawan)
            }
        })
        getLemburKu({
            variables: {
                idKaryawan: parseInt(idKaryawan)
            }
        })
    }
    
    return (
        <Container className="containerKu">
            <Row className="bg-white justify-content-center">
                <Col>
                    <h1 className="text-center">Hasilkan Slip Gaji</h1>
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col className="col-md-4">
                    <Form >
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
                            <Form.Label>Jumlah Lembur (Jam)</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="nama"
                                placeholder='0'
                                value= {lembur}
                                onChange={e => 
                                    setLembur(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Jumlah Telat (Jam)</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="nama"
                                placeholder='0'
                                value= {telat}
                                onChange={e => 
                                    setTelat(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>PTKP</Form.Label>
                            <CurrencyFormat 
                                className='formRupiahNew'
                                thousandSeparator={'.'} 
                                decimalSeparator={','} 
                                prefix={'Rp '}
                                placeholder={'Rp 0'}
                                onValueChange={(value) => {
                                        setPTKP(value.value)
                                    }
                                } 
                            />
                        </Form.Group>
                        <div className="buttonsSideBySide">
                            <Button className="buttonSideBySide" variant="info" onClick={() => lihatSummary()}>
                                Absensi Karyawan
                            </Button>
                            <Button className="buttonSideBySide" variant="primary" onClick={() => registerIndex()}>
                                Hasilkan Slip Gaji
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Row>
            <Row>
                <Col>
                    {dataLemburKu}
                    {dataAbsensiKu}
                </Col>
            </Row>
        </Container>
    )
}
