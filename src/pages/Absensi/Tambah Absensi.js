import React, {useState, Fragment} from 'react'
import { Row, Col, Form, Button, Alert, Container} from 'react-bootstrap';
import { gql, useQuery, useMutation} from '@apollo/client';
import * as XLSX from 'xlsx'
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
            setAbsensi([]);
            setSuccess({
                Sukses: `Suksess Masukkan Absensi`,
            })
        }
    })
    const readExcel = (file) =>{
        if(file.type === "application/vnd.ms-excel" || file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){
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
                    alert(error);
                    reject(error);
                })
            })
            promise.then((d) => {
                setAbsensi(d);
            })
        }else{
            alert("Tipe File Tidak Sesuai Harus File Excel");
        }
    }
    const register = e =>{
        e.preventDefault();
        if(absensi.length === 0){
            alert("Belum Memasukkan File Absensi")
        }else{
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
                        <div className='tableContainer'>
                            <table size='string' className="table" aria-label="simple table">
                                <thead>
                                    <tr>
                                        <th>Nama</th>
                                        <th>Tanggal</th>
                                        <th>Shift</th>
                                        <th>Jam Masuk</th>
                                        <th>Jam Keluar</th>
                                        <th>Scan Masuk</th>
                                        <th>Scan Pulang</th>
                                        <th>Terlambat</th>
                                        <th>Pulang Cepat</th>
                                        <th>Absen</th>
                                        <th>Lembur</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        absensi.map((laporan,index) =>(
                                            index >= 10 ? null:
                                            <tr key={index} >
                                                <td data-label="Nama">{laporan.Nama}</td>
                                                <td data-label="Tanggal">{dayjs(laporan.tanggal).format('DD-MM-YYYY')}</td>
                                                <td data-label="Shift">{laporan["Jam Kerja"]}</td>
                                                <td data-label="Jam Masuk">{laporan["Jam Masuk"]}</td>
                                                <td data-label="Jam Keluar">{laporan["Jam Pulang"]}</td>
                                                <td data-label="Scan Masuk">{laporan["Scan Masuk"]}</td>
                                                <td data-label="Scan Keluar">{laporan["Scan Pulang"]}</td>
                                                <td data-label="Terlambat">{laporan["Terlambat"]}</td>
                                                <td data-label="Bolos">{laporan["Plg. Cepat"]}</td>
                                                <td data-label="Absen">{laporan.Absent === true? <div className="badgeStatusNon">Bolos</div>: <div className="badgeStatusAktif">Aman</div>}</td>
                                                <td data-label="Lembur">{laporan.Lembur}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
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
