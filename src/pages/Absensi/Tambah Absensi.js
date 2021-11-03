import React, {useState, Fragment} from 'react'
import { Row, Col, Form, Button, Alert, Container} from 'react-bootstrap';
import { gql, useQuery, useMutation} from '@apollo/client';
import {ReactNativeFile} from 'apollo-upload-client';
import * as XLSX from 'xlsx'
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import ReactPaginate from 'react-paginate';
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import dayjs from 'dayjs'

const registerAbsensi = gql`
    mutation registerAbsensi(
        $status: String 
        $absensiInput: [absensiInput]
  ) {
    registerAbsensi(
        status: $status
        absensiInput: $absensiInput
    ) {
        id
    }
  }
`;
export default function Register(props) {
    const[variables,setVariables] = useState({
        status: ''
    })
    const [absensi, setAbsensi] = useState([]);
    const [errors, setErrors] = useState({})
    const [success, setSuccess] = useState({})
    
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

    const [registerAbsensiKu] = useMutation(registerAbsensi,{
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
                Sukses: `Suksess tambah gudang`,
            })
        }
    })
    const readExcel = (file) =>{
        const promise = new Promise((resolve, reject) =>{
            const fileReader = new FileReader()
            fileReader.readAsArrayBuffer(file)

            fileReader.onload=(e) =>{
                const bufferArray = e.target.result;
                
                const wb = XLSX.read(bufferArray,{type:'buffer'});
                const wsname = wb.SheetNames[0];

                const ws = wb.Sheets[wsname];

                const data = XLSX.utils.sheet_to_json(ws);
                resolve(data)
            }

            fileReader.onerror=((error)=>{
                reject(error);
            })
        })
        promise.then((d) => {
            setAbsensi(d);
        })
    }
    const register = e =>{
        e.preventDefault();
        var counterAbsensi=[];
        var absensiKu = {};
        var ctrTgl;
        var tglKu;
        absensi.map(element => {
            absensiKu={};
            absensiKu.id = parseInt(element["No. ID"])
            ctrTgl= element["Tanggal"].toString().split("/")
            tglKu = ctrTgl[1] + "/" + ctrTgl[0] + "/" + ctrTgl[2];
            absensiKu.tanggal = tglKu
            absensiKu.jamKerja = element["Jam Kerja"]
            absensiKu.scanMasuk = element["Scan Masuk"]
            absensiKu.scanPulang = element["Scan Pulang"]
            absensiKu.terlambat = element["Terlambat"]
            absensiKu.jamBolos = element["Plg. Cepat"]
            absensiKu.absen = !!element["Absent"]
            absensiKu.lembur = element["Lembur"];
            console.log(absensiKu);
            counterAbsensi.push(absensiKu)
        })
        console.log(counterAbsensi)
        registerAbsensiKu({variables:{
            status: variables.status,
            absensiInput: counterAbsensi
        }
        });
    }
    return (
        <Container className="containerKu">
            <Row className="bg-white justify-content-center">
                <Col><h1 className="text-center">Tambah Absensi</h1></Col>
            </Row>
            <Row className="bg-white p-0 justify-content-center">
                <Col>
                    <Form onSubmit={register}>
                        {showError}
                        {showUser}
                        <Col xs lg="2" className="justify-content-center">
                            <input type="file" onChange={(e)=>{
                                const file = e.target.files[0];
                                readExcel(file);
                            }} />
                        </Col>
                        <TableContainer component={Paper} key={0}>
                            <Table className="tableKu" aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Nama Karyawan</TableCell>
                                        <TableCell align="right">Tanggal</TableCell>
                                        <TableCell align="right">Shift</TableCell>
                                        <TableCell align="right">Jam Masuk</TableCell>
                                        <TableCell align="right">Jam Keluar</TableCell>
                                        <TableCell align="right">Scan Masuk</TableCell>
                                        <TableCell align="right">Scan Pulang</TableCell>
                                        <TableCell align="right">Terlambat</TableCell>
                                        <TableCell align="right">Pulang Cepat</TableCell>
                                        <TableCell align="right">Absen</TableCell>
                                        <TableCell align="right">Lembur</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        absensi.map((laporan,index) =>(
                                            index >= 10 ? null:
                                            <TableRow key={index}>
                                                <TableCell component="th" scope="row">
                                                    {laporan.Nama}
                                                </TableCell>
                                                <TableCell align="right">{dayjs(laporan.tanggal).format('DD-MM-YYYY')}</TableCell>
                                                <TableCell align="right">{laporan["Jam Kerja"]}</TableCell>
                                                <TableCell align="right">{laporan["Jam Masuk"]}</TableCell>
                                                <TableCell align="right">{laporan["Jam Pulang"]}</TableCell>
                                                <TableCell align="right">{laporan["Scan Masuk"]}</TableCell>
                                                <TableCell align="right">{laporan["Scan Pulang"]}</TableCell>
                                                <TableCell align="right">{laporan["Terlambat"]}</TableCell>
                                                <TableCell align="right">{laporan["Plg. Cepat"]}</TableCell>
                                                <TableCell align="right">{laporan.Absent === true? "Bolos": ""}</TableCell>
                                                <TableCell align="right">{laporan.Lembur}</TableCell>
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <div className='text-center' style={{marginTop: 10, marginBottom: 10}}>
                            <Button variant="success" type="submit" style={{borderRadius: 5}}>
                                Tambahkan
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}
