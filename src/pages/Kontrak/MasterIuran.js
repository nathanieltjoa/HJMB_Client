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
import { CCard, CCardBody, CImage } from '@coreui/react';


const registerIndexIuran = gql`
    mutation registerIndexIuran(
        $namaIuran: String
        $keteranganIuran: String
  ) {
    registerIndexIuran(
        namaIuran: $namaIuran
        keteranganIuran: $keteranganIuran
    ) {
        id
    }
  }
`;

const updateStatusIndexIuran = gql`
    mutation updateStatusIndexIuran(
        $status: Boolean
        $id: Int 
  ) {
    updateStatusIndexIuran(
        status: $status
        id: $id
    ) {
        id
    }
  }
`;

const updateIndexIuran = gql`
    mutation updateIndexIuran(
        $id: Int 
        $namaIuran: String
        $keteranganIuran: String
    ) {
        updateIndexIuran(
            id: $id
            namaIuran: $namaIuran
            keteranganIuran: $keteranganIuran
        ) {
            id
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
    id namaIuran keteranganIuran status
  }
}
`;
export default function MasterIuran(props) {
    const [id, setId] = useState(-1);
    const [nama, setNama] = useState("");
    const [keterangan, setKeterangan] = useState("");
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

    const [registerIndexIuranKu] = useMutation(registerIndexIuran,{
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
                Sukses: `Suksess tambah Index Iuran`,
            })
            refetch()
        }
    })

    const registerIndex = () =>{
        console.log("masuk");
        registerIndexIuranKu({variables:{
            namaIuran: nama,
            keteranganIuran: keterangan,
        }
        });
    }

    const [updateStatusIndexKu] = useMutation(updateStatusIndexIuran,{
        update(_,res){
            console.log(res)
        },
        onError: (err) => {
            console.log(err)
        },
        onCompleted(data){
            refetch()
        }
    })

    const editIndex = (laporan) => {
        setId(laporan.id);
        setNama(laporan.namaIuran);
        setKeterangan(laporan.keteranganIuran);
    }

    const updateStatus = (status,id) =>{
        updateStatusIndexKu({
            variables: {
                id: id,
                status: status
            }
        })
    }

    const [updateIndexKu] = useMutation(updateIndexIuran,{
        update(_,res){
            console.log(res)
        },
        onError: (err) => {
            console.log(err)
        },
        onCompleted(data){
            refetch()
            setId(-1);
            setSuccess({
                Sukses: `Suksess Update Index Iuran`,
            })
        }
    })

    const updateIndex = (status) =>{
        if(status === true){
            updateIndexKu({
                variables: {
                    id: id,
                    namaIuran: nama,
                    keteranganIuran: keterangan,
                }
            })
        }else if(status === false){
            setId(-1);
            setNama("");
            setKeterangan("");
        }
    }

    const { loading, data, refetch } = useQuery(getIndexIuran,{
        variables:{
            status: false
        }
    });

    let dataKu= [];
    let counter = false;
    if(!data || loading){
        dataKu.push(<p key={0} className="badgeStatusWaitingText">Memuat....</p>)
    }else if(data.getIndexIuran.length === 0){
        dataKu.push(<p key={0} className="badgeStatusNonText">Tidak ada Indeks Iuran</p>)
    }else if(data.getIndexIuran.length > 0 && !counter){
        dataKu.push(
            <div className='tableContainer'>
                <table size='string' className="table" aria-label="simple table">
                    <thead>
                        <tr>
                            <th>Nama Indeks</th>
                            <th>Keterangan Indeks</th>
                            <th>Status</th>
                            <th>#</th>
                            <th>#</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.getIndexIuran.map((laporan,index) =>(
                                <tr key={index} >
                                    <td data-label="Nama Indeks">{laporan.namaIuran}</td>
                                    <td data-label="Keterangan">{laporan.keteranganIuran === ""? "-": laporan.keteranganIuran}</td>
                                    <td data-label="Status">
                                        <div className="badgeContainer">{
                                        laporan.status === true? 
                                            <div className="badgeStatusAktif">Aktif</div>:
                                            <div className="badgeStatusNon">Tidak Aktif</div>
                                        }</div>
                                    </td>
                                    <td data-label="#">
                                        <Button variant="primary" onClick={() => editIndex(laporan)}>
                                            Edit
                                        </Button>
                                    </td>
                                    <td data-label="#">
                                        {
                                            laporan.status === true?
                                            <Button variant="danger" onClick={() => updateStatus(false, laporan.id)}>
                                                Menonaktifkan
                                            </Button>:
                                            <Button variant="success" onClick={() => updateStatus(true, laporan.id)}>
                                                Aktifkan
                                            </Button>
                                        }
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        )
        counter = true;
    }
    
    return (
        <Container className="containerKu">
            <Row className="bg-white justify-content-center">
                <Col><h1 className="text-center">Master Indeks Iuran</h1></Col>
            </Row>
            <Row className="bg-white py-5 justify-content-md-center">
                <CCard className="col-md-5">
                    <CCardBody className="text-center">
                    <Form>
                        {showError}
                        {showUser}
                        <Form.Group as={Col}>
                            <Form.Label className={errors.namaIuran && 'text-danger'}>{errors.namaIuran ?? 'Nama Iuran'}</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="nama"
                                value= {nama}
                                onChange={e => 
                                    setNama(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label className={errors.keteranganIuran && 'text-danger'}>{errors.keteranganIuran ?? 'Keterangan Iuran'}</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                name="keterangan"
                                value= {keterangan}
                                onChange={e => 
                                    setKeterangan(e.target.value)}
                            />
                        </Form.Group>
                    <div className='text-center'>
                        {
                            id === -1?
                                <Button variant="primary" onClick={() => registerIndex()}>
                                    Tambah Indeks
                                </Button>:
                                <div>
                                    <Button variant="primary" onClick={() => updateIndex(true)}>
                                        Perbarui Indeks
                                    </Button>
                                    <Button variant="danger" onClick={() => updateIndex(false)}>
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
    )
}
