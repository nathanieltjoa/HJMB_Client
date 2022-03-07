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

const registerIndexGaji = gql`
    mutation registerIndexGaji(
        $namaGaji: String
        $keteranganGaji: String
  ) {
    registerIndexGaji(
        namaGaji: $namaGaji
        keteranganGaji: $keteranganGaji
    ) {
        id
    }
  }
`;

const updateStatusIndexGaji = gql`
    mutation updateStatusIndexGaji(
        $status: Boolean
        $id: Int 
  ) {
    updateStatusIndexGaji(
        status: $status
        id: $id
    ) {
        id
    }
  }
`;

const updateIndexGaji = gql`
    mutation updateIndexGaji(
        $id: Int 
        $namaGaji: String
        $keteranganGaji: String
    ) {
        updateIndexGaji(
            id: $id
            namaGaji: $namaGaji
            keteranganGaji: $keteranganGaji
        ) {
            id
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
    id namaGaji keteranganGaji status
  }
}
`;
export default function MasterGaji(props) {
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

    const [registerIndexGajiKu] = useMutation(registerIndexGaji,{
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
                Sukses: `Suksess tambah Index Gaji`,
            })
            refetch()
        }
    })

    const registerIndex = () =>{
        console.log("masuk");
        registerIndexGajiKu({variables:{
            namaGaji: nama,
            keteranganGaji: keterangan,
        }
        });
    }

    const [updateStatusIndexKu] = useMutation(updateStatusIndexGaji,{
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
        setNama(laporan.namaGaji);
        setKeterangan(laporan.keteranganGaji);
    }

    const updateStatus = (status,id) =>{
        updateStatusIndexKu({
            variables: {
                id: id,
                status: status
            }
        })
    }

    const [updateIndexKu] = useMutation(updateIndexGaji,{
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
                Sukses: `Suksess Update Index Penilaian`,
            })
        }
    })

    const updateIndex = (status) =>{
        if(status === true){
            updateIndexKu({
                variables: {
                    id: id,
                    namaGaji: nama,
                    keteranganGaji: keterangan,
                }
            })
        }else if(status === false){
            setId(-1);
            setNama("");
            setKeterangan("");
        }
    }

    const { loading, data, refetch } = useQuery(getIndexGaji,{
        variables:{
            status: false
        }
    });

    let dataKu= [];
    let counter = false;
    if(!data || loading){
        dataKu.push(<p key={0} className="badgeStatusWaitingText">Memuat....</p>)
    }else if(data.getIndexGaji.length === 0){
        dataKu.push(<p key={0} className="badgeStatusNonText">Tidak ada Indeks Gaji</p>)
    }else if(data.getIndexGaji.length > 0 && !counter){
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
                            data.getIndexGaji.map((laporan,index) =>(
                                <tr key={index} >
                                    <td data-label="Nama Indeks">{laporan.namaGaji}</td>
                                    <td data-label="Keterangan">{laporan.keteranganGaji === ""? "-": laporan.keteranganGaji}</td>
                                    <td data-label="Status">
                                        <div className="badgeContainer">{
                                            laporan.status === true? 
                                                <div className="badgeStatusAktif">Aktif</div>:
                                                <div className="badgeStatusNon">Tidak Aktif</div>
                                        }</div>
                                    </td>
                                    <td data-label="#">
                                        <Button className="buttonSideBySide" variant="primary" onClick={() => editIndex(laporan)}>
                                            Edit
                                        </Button>
                                    </td>
                                    <td data-label="#">
                                        {
                                            laporan.status === true?
                                            <Button className="buttonSideBySide" variant="danger" onClick={() => updateStatus(false, laporan.id)}>
                                                Menonaktifkan
                                            </Button>:
                                            <Button className="buttonSideBySide" variant="success" onClick={() => updateStatus(true, laporan.id)}>
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
        <Fragment>
            <Container className="containerKu">
                <Row className="bg-white justify-content-center">
                    <Col><h1 className="text-center">Master Indeks Gaji</h1></Col>
                </Row>
                <Row className="bg-white py-5 justify-content-md-center">
                    <CCard className="col-md-5">
                        <CCardBody className="text-center">
                            <Form >
                                {showError}
                                {showUser}
                                <Form.Group as={Col}>
                                    <Form.Label className={errors.namaGaji && 'text-danger'}>{errors.namaGaji ?? 'Nama Gaji'}</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        name="nama"
                                        value= {nama}
                                        onChange={e => 
                                            setNama(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Label className={errors.keteranganGaji && 'text-danger'}>{errors.keteranganGaji ?? 'Keterangan Gaji'}</Form.Label>
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
