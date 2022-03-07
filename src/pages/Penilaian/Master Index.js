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

const registerIndexPenilaian = gql`
    mutation registerIndexPenilaian(
        $namaIndex: String
        $nilaiIndex: Int 
        $keteranganIndex: String
  ) {
    registerIndexPenilaian(
        namaIndex: $namaIndex
        nilaiIndex: $nilaiIndex
        keteranganIndex: $keteranganIndex
    ) {
        id
    }
  }
`;

const updateStatusIndexPenilaian = gql`
    mutation updateStatusIndexPenilaian(
        $status: Boolean
        $id: Int 
  ) {
    updateStatusIndexPenilaian(
        status: $status
        id: $id
    ) {
        id
    }
  }
`;

const updateIndexPenilaian = gql`
    mutation updateIndexPenilaian(
        $id: Int 
        $namaIndex: String
        $nilaiIndex: Int 
        $keteranganIndex: String
    ) {
        updateIndexPenilaian(
            id: $id
            namaIndex: $namaIndex
            nilaiIndex: $nilaiIndex
            keteranganIndex: $keteranganIndex
        ) {
            id
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
export default function MasterIndex(props) {
    const [id, setId] = useState(-1);
    const [nama, setNama] = useState("");
    const [nilai, setNilai] = useState(0);
    const [keterangan, setKeterangan] = useState("");
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState({});
    
    var counterJml = 0;
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

    const { loading, data, refetch } = useQuery(getIndexPenilaian);

    let dataKu= [];
    let counter = false;
    if(data === undefined || loading){
        dataKu.push(<p key={0} className="badgeStatusWaitingText">Memuat...</p>)
    }else if(data.getIndexPenilaian.length === 0){
        dataKu.push(<p key={1} className="badgeStatusNonText">Tidak Ada Indeks Penilaian Yang Tersedia</p>)
    }else if(data.getIndexPenilaian.length > 0 && !counter){
        counterJml = 0;
        dataKu.push(
            <div className='tableContainer'>
                <table size='string' className="table" aria-label="simple table">
                    <thead>
                        <tr>
                            <th>Nama Indeks</th>
                            <th>Keterangan Indeks</th>
                            <th>Persentase Indeks</th>
                            <th>Status</th>
                            <th>#</th>
                            <th>#</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.getIndexPenilaian.map((laporan,index) =>(
                                <tr key={index} >
                                    <td data-label="Nama Indeks">{laporan.namaIndex}</td>
                                    <td data-label="Keterangan">{laporan.keteranganIndex === ""? "-": laporan.keteranganIndex}</td>
                                    <td data-label="Nilai Indeks">{laporan.nilaiIndex}</td>
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

    const [registerIndexKu] = useMutation(registerIndexPenilaian,{
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
                Sukses: `Suksess tambah Index Penilaian`,
            })
            refetch()
        }
    })

    const registerIndex = () =>{
        console.log("masuk");
        registerIndexKu({variables:{
            namaIndex: nama,
            nilaiIndex: parseInt(nilai),
            keteranganIndex: keterangan,
        }
        });
    }

    const [updateStatusIndexKu] = useMutation(updateStatusIndexPenilaian,{
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
        setNama(laporan.namaIndex);
        setNilai(laporan.nilaiIndex);
        setKeterangan(laporan.keteranganIndex);
    }

    const updateStatus = (status,id) =>{
        updateStatusIndexKu({
            variables: {
                id: id,
                status: status
            }
        })
    }

    const [updateIndexKu] = useMutation(updateIndexPenilaian,{
        update(_,res){
            console.log(res)
        },
        onError: (err) => {
            setErrors(err.graphQLErrors[0].extensions.errors)
            setSuccess({});
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
                    namaIndex: nama,
                    nilaiIndex: parseInt(nilai),
                    keteranganIndex: keterangan,
                }
            })
        }else if(status === false){
            setId(-1);
            setNama("");
            setNilai(0);
            setKeterangan("");
        }
    }
    
    return (
        <Container className="containerKu">
            <Row className="bg-white justify-content-center">
                <Col><h1 className="text-center">Master Indeks Penilaian</h1></Col>
            </Row>
            <Row className="bg-white py-5 justify-content-md-center">
                <Col className="col-md-5">
                    <Form>
                        {showError}
                        {showUser}
                        <Form.Group as={Col}>
                            <Form.Label className={errors.namaIndex && 'text-danger'}>{errors.namaIndex ?? 'Nama Indeks'}</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="nama"
                                value= {nama}
                                onChange={e => 
                                    setNama(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label className={errors.nilaiIndex && 'text-danger'}>{errors.nilaiIndex ?? 'Nilai Indeks'}</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="nilai"
                                value= {nilai}
                                onChange={e => 
                                    setNilai(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label className={errors.keterangan && 'text-danger'}>{errors.keterangan ?? 'Keterangan'}</Form.Label>
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
                                    Tambah Index
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
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col className="col-md-10">
                    {dataKu}
                </Col>
            </Row>
        </Container>
    )
}
