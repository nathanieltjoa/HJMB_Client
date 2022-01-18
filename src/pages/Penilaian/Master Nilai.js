import React, {useState, Fragment, useEffect} from 'react'
import { Row, Col, Form, Button, Alert, Container, Badge} from 'react-bootstrap';
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
import { CCard, CCardBody, CImage } from '@coreui/react';
import CurrencyFormat from 'react-currency-format';

const registerPengaruhNilai = gql`
    mutation registerPengaruhNilai(
        $nilaiMin: Float 
        $nilaiMax: Float 
        $hasilNilai: String 
        $pengurangan: Boolean
        $nilaiUang: Int 
  ) {
    registerPengaruhNilai(
        nilaiMin: $nilaiMin
        nilaiMax: $nilaiMax
        hasilNilai: $hasilNilai
        pengurangan: $pengurangan
        nilaiUang: $nilaiUang
    ) {
        id
    }
  }
`;

const updatePengaruhNilai = gql`
    mutation updatePengaruhNilai(
        $id: Int  
        $nilaiMin: Float 
        $nilaiMax: Float 
        $hasilNilai: String 
        $pengurangan: Boolean
        $nilaiUang: Int 
    ) {
        updatePengaruhNilai(
            id: $id
            nilaiMin: $nilaiMin
            nilaiMax: $nilaiMax
            hasilNilai: $hasilNilai
            pengurangan: $pengurangan
            nilaiUang: $nilaiUang
        ) {
            id
        }
    }
`;


const getPengaruhNilai = gql`
query getPengaruhNilai{
    getPengaruhNilai{
        id nilaiMin nilaiMax hasilNilai pengurangan nilaiUang
  }
}
`;
export default function MasterNilai(props) {
    const [id, setId] = useState(-1);
    const [nilaiMin, setNilaiMin] = useState(0);
    const [nilaiMax, setNilaiMax] = useState(0);
    const [hasil, setHasil] = useState("");
    const [pengurangan, setPengurangan] = useState(false);
    const [nilaiUang, setNilaiUang] = useState(0);
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

    const [registerNilaiKu] = useMutation(registerPengaruhNilai,{
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
                Sukses: `Suksess tambah Nilai`,
            })
            refetch()
        }
    })

    const registerIndex = () =>{
        console.log("masuk");
        registerNilaiKu({variables:{
            nilaiMin: parseFloat(nilaiMin),
            nilaiMax: parseFloat(nilaiMax),
            hasilNilai: hasil,
            pengurangan: pengurangan,
            nilaiUang: parseInt(nilaiUang),
        }
        });
    }

    const editIndex = (laporan) => {
        setId(laporan.id);
        setNilaiMin(laporan.nilaiMin);
        setNilaiMax(laporan.nilaiMax);
        setHasil(laporan.hasilNilai)
        console.log(pengurangan)
        setPengurangan(laporan.pengurangan);
        setNilaiUang(laporan.nilaiUang);
    }

    const [updateNilaiKu] = useMutation(updatePengaruhNilai,{
        update(_,res){
            console.log(res)
        },
        onError: (err) => {
            console.log(err)
        },
        onCompleted(data){
            refetch()
            setId(-1);
            setNilaiMin(0);
            setNilaiMax(0);
            setHasil("")
            setPengurangan(false);
            setNilaiUang(0);
            setSuccess({
                Sukses: `Suksess Update Nilai`,
            })
        }
    })

    const updateIndex = (status) =>{
        if(status === true){
            updateNilaiKu({
                variables: {
                    id: parseInt(id),
                    nilaiMin: parseFloat(nilaiMin),
                    nilaiMax: parseFloat(nilaiMax),
                    hasilNilai: hasil,
                    pengurangan: pengurangan,
                    nilaiUang: parseInt(nilaiUang),
                }
            })
        }else if(status === false){
            setId(-1);
            setNilaiMin(0);
            setNilaiMax(0);
            setHasil("")
            setPengurangan(false);
            setNilaiUang(0);
        }
    }

    const { loading, data, refetch } = useQuery(getPengaruhNilai);

    let dataKu= [];
    let counter = false;
    if(!data || loading){
        dataKu.push(<p key={0} className="badgeStatusWaitingText">Memuat....</p>)
    }else if(data.getPengaruhNilai.length === 0){
        dataKu.push(<p key={0} className="badgeStatusNonText">Tidak ada Data Nilai</p>)
    }else if(data.getPengaruhNilai.length > 0 && !counter){
        dataKu.push(
            <TableContainer component={Paper} key={0}>
                <Table className="tableKu" aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Nilai Bawah</TableCell>
                            <TableCell align="center">Nilai Atas</TableCell>
                            <TableCell align="center">Nilai</TableCell>
                            <TableCell align="center">Pengaruh Ke Gaji</TableCell>
                            <TableCell align="center">Tindakan</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            data.getPengaruhNilai.map((laporan,index) =>(
                                <TableRow key={index}>
                                    <TableCell component="th" scope="row" align="center">{laporan.nilaiMin}</TableCell>
                                    <TableCell component="th" scope="row" align="center">{laporan.nilaiMax}</TableCell>
                                    <TableCell component="th" scope="row" align="center">{laporan.hasilNilai}</TableCell>
                                    <TableCell component="th" scope="row" align="center">
                                        <div className={laporan.pengurangan === true? "badgeStatusNonText": "badgeStatusAktifText"}>
                                            {laporan.pengurangan === true?"-":"+"}<CurrencyFormat displayType={'text'} value={laporan.nilaiUang} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp'} />
                                        </div>
                                    </TableCell>
                                    <TableCell component="th" scope="row" align="center">
                                        <div className="buttonsSideBySide">
                                            <Button className="buttonSideBySide" variant="primary" onClick={() => editIndex(laporan)}>
                                                Edit
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        )
        counter = true;
    }

    const handleCheckBox = (e) =>{
        setPengurangan(e.target.checked)
    }
    
    return (
        <Fragment>
            <Container className="containerKu">
                <Row className="bg-white justify-content-center">
                    <Col><h1 className="text-center">Master Nilai</h1></Col>
                </Row>
                <Row className="bg-white py-5 justify-content-md-center">
                    <CCard className="col-md-5">
                        <CCardBody className="text-center">
                            <Form >
                                {showError}
                                {showUser}
                                <div className="inputsRow">
                                    <Form.Group as={Col} className="col-md-4 inputRow">
                                        <Form.Label>Nilai Bawah</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            name="nama"
                                            className="inputCenter"
                                            value= {nilaiMin}
                                            onChange={e => 
                                                setNilaiMin(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} className="col-md-4 inputRow">
                                        <Form.Label>Nilai Atas</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            name="nama"
                                            className="inputCenter"
                                            value= {nilaiMax}
                                            onChange={e => 
                                                setNilaiMax(e.target.value)}
                                        />
                                    </Form.Group>
                                </div>
                                <Form.Group as={Col} >
                                    <Form.Label>Nilai</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        name="nama"
                                        value= {hasil}
                                        className="inputCenter"
                                        onChange={e => 
                                            setHasil(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Label>Nilai Uang(Pengaruh Nilai Ke Gaji)</Form.Label>
                                    <CurrencyFormat 
                                        defaultValue={0}
                                        thousandSeparator={'.'} 
                                        decimalSeparator={','} 
                                        prefix={'Rp '}
                                        className="inputCenter"
                                        value={nilaiUang}
                                        style={{width: '50%', fontSize: 20}}
                                        onValueChange={(value) => {
                                                setNilaiUang(value.value)
                                            }
                                        } 
                                    />
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Check 
                                        inline
                                        value={pengurangan}
                                        checked={pengurangan}
                                        type="checkbox"
                                        label="Centang ini jika ingin mengurangi gaji karyawan"
                                        onChange={handleCheckBox}
                                    />
                                </Form.Group>
                            <div className='text-center'>
                                {
                                    id === -1?
                                        <Button variant="primary" onClick={() => registerIndex()}>
                                            Tambah Indeks
                                        </Button>:
                                        <div className="buttonsSideBySide">
                                            <Button className="buttonSideBySide" variant="primary" onClick={() => updateIndex(true)}>
                                                Perbarui Indeks
                                            </Button>
                                            <Button className="buttonSideBySide" variant="danger" onClick={() => updateIndex(false)}>
                                                Batal
                                            </Button>
                                        </div>
                                }
                            </div>
                            </Form>
                        </CCardBody>
                    </CCard>
                </Row>
                <Row>
                    <Col>
                        {dataKu}
                    </Col>
                </Row>
            </Container>
        </Fragment>
    )
}
