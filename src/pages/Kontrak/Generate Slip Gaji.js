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

const registerPembayaranGaji = gql`
    mutation registerPembayaranGaji(
        $idKaryawan: Int 
        $jumlahLembur: Int
  ) {
    registerPembayaranGaji(
        idKaryawan: $idKaryawan
        jumlahLembur: $jumlahLembur
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
                <TableContainer component={Paper} key={0}>
                    <Table className="tableKu" aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Tanggal</TableCell>
                                <TableCell align="center">Shift</TableCell>
                                <TableCell align="center">Jam Masuk</TableCell>
                                <TableCell align="center">Jam Keluar</TableCell>
                                <TableCell align="center">Scan Masuk</TableCell>
                                <TableCell align="center">Scan Pulang</TableCell>
                                <TableCell align="center">Absen</TableCell>
                                <TableCell align="center">Lembur</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                dataAbsensi.getListAbsensiPribadiMaster.map((laporan,index) =>(
                                    <TableRow key={index}>
                                        <TableCell align="center">{dayjs(laporan.tanggal).format('DD-MM-YYYY')}</TableCell>
                                        <TableCell align="center">{laporan.jamKerja.namaShift}</TableCell>
                                        <TableCell align="center">{laporan.jamKerja.jamMasuk}</TableCell>
                                        <TableCell align="center">{laporan.jamKerja.jamKeluar}</TableCell>
                                        <TableCell align="center">{laporan.scanMasuk}</TableCell>
                                        <TableCell align="center">{laporan.scanPulang}</TableCell>
                                        <TableCell align="center">{laporan.absen === true? <div className="badgeStatusNon">Bolos</div>: ""}</TableCell>
                                        <TableCell align="center">{laporan.lembur}</TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
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
            <div>
                <h3>Lembur Karyawan</h3>
                <TableContainer component={Paper} key={0}>
                    <Table className="tableKu" aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Tanggal</TableCell>
                                <TableCell align="center">Keterangan</TableCell>
                                <TableCell align="center">Alasan</TableCell>
                                <TableCell align="center">Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                dataLembur.getListLemburPribadiMaster.map((laporan,index) =>(
                                    <TableRow key={index}>
                                        <TableCell align="center">{dayjs(laporan.tanggalMulai).format('DD-MM-YYYY')}</TableCell>
                                        <TableCell align="center">{laporan.keterangan}</TableCell>
                                        <TableCell align="center">{laporan.alasan}</TableCell>
                                        <TableCell align="center">{
                                            laporan.status === 3? <div className="badgeStatusAktif">Di Terima</div>:
                                            <div className="badgeStatusNon">Di Tolak</div>
                                        }</TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
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
                    <h1 className="text-center">Generate Slip Gaji</h1>
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
                            <Form.Label>Jumlah Lembur</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="nama"
                                value= {lembur}
                                style={{width: '20%'}}
                                onChange={e => 
                                    setLembur(e.target.value)}
                            />
                        </Form.Group>
                        <div className="buttonsSideBySide">
                            <Button className="buttonSideBySide" variant="info" onClick={() => lihatSummary()}>
                                Absensi Karyawan
                            </Button>
                            <Button className="buttonSideBySide" variant="primary" onClick={() => registerIndex()}>
                                Generate Slip Gaji
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
