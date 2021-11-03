import React, {useState, Fragment} from 'react'
import { Row, Col, Form, Button, Alert, Container} from 'react-bootstrap';
import { gql, useQuery, useMutation} from '@apollo/client';
import {ReactNativeFile} from 'apollo-upload-client';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const registerGudang = gql`
    mutation registerGudang(
        $namaGudang: String 
        $alamatGudang: String 
  ) {
    registerGudang(
      namaGudang: $namaGudang
      alamatGudang: $alamatGudang
    ) {
        id
    }
  }
`;

const updateStatusGudang = gql`
    mutation updateStatusGudang(
        $status: Boolean
        $id: Int 
  ) {
    updateStatusGudang(
        status: $status
        id: $id
    ) {
        id
    }
  }
`;

const updateGudang = gql`
    mutation updateGudang(
        $id: Int 
        $namaGudang: String
        $alamatGudang: String
    ) {
        updateGudang(
            id: $id
            namaGudang: $namaGudang
            alamatGudang: $alamatGudang
        ) {
            id
        }
    }
`;

const getListGudang = gql`
query getListGudang{
    getListGudang{
    id namaGudang alamatGudang status
  }
}
`;
export default function Register(props) {
    const [id, setId] = useState(-1);
    const[variables,setVariables] = useState({
        namaGudang:'',
        alamatGudang: '',
    })
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

    const [registerGudangku] = useMutation(registerGudang,{
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
            refetch()
        }
    })
    const register = () =>{
        registerGudangku({variables:{
            namaGudang: variables.namaGudang,
            alamatGudang: variables.alamatGudang,
        }
        });
        console.log(variables);
    }

    const [updateStatusIndexKu] = useMutation(updateStatusGudang,{
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

    const updateStatus = (status,id) =>{
        updateStatusIndexKu({
            variables: {
                id: id,
                status: status
            }
        })
    }


    const { loading, data, refetch } = useQuery(getListGudang);

    let dataKu= [];
    let counter = false;
    if(!data || loading){
        dataKu.push(<p key={0} className="badgeStatusWaitingText">Loading....</p>)
    }else if(data.getListGudang.length === 0){
        dataKu.push(<p key={0} className="badgeStatusNonText">Tidak ada Daftar Gudang</p>)
    }else if(data.getListGudang.length > 0 && !counter){
        dataKu.push(
            <TableContainer component={Paper} key={0}>
                <Table className="tableKu" aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Nama Gudang</TableCell>
                            <TableCell align="center">Alamat</TableCell>
                            <TableCell align="center">Status</TableCell>
                            <TableCell align="center">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            data.getListGudang.map((laporan,index) =>(
                                <TableRow key={index}>
                                    <TableCell component="th" scope="row" align="center">{laporan.namaGudang}</TableCell>
                                    <TableCell component="th" scope="row" align="center">{laporan.alamatGudang}</TableCell>
                                    <TableCell component="th" scope="row" align="center">
                                        <div className="badgeContainer">{
                                        laporan.status === 1? 
                                            <div className="badgeStatusAktif">Aktif</div>:
                                            <div className="badgeStatusNon">Non-Aktif</div>
                                    }</div></TableCell>
                                    <TableCell component="th" scope="row" align="center">
                                        <div className="buttonsSideBySide">
                                            <Button className="buttonSideBySide" variant="primary" onClick={() => editIndex(laporan)}>
                                                Edit
                                            </Button>
                                            {
                                                laporan.status === 1?
                                                <Button className="buttonSideBySide" variant="danger" onClick={() => updateStatus(false, laporan.id)}>
                                                    Non Aktifkan
                                                </Button>:
                                                <Button className="buttonSideBySide" variant="success" onClick={() => updateStatus(true, laporan.id)}>
                                                    Aktifkan
                                                </Button>
                                            }
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

    const editIndex = (laporan) => {
        setId(laporan.id);
        setVariables({
            namaGudang: laporan.namaGudang,
            alamatGudang: laporan.alamatGudang
        })
    }

    const [updateIndexKu] = useMutation(updateGudang,{
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
                Sukses: `Suksess Perbarui Gudang`,
            })
        }
    })

    const updateIndex = (status) =>{
        if(status === true){
            updateIndexKu({
                variables: {
                    id: id,
                    namaGudang: variables.namaGudang,
                    alamatGudang: variables.alamatGudang,
                }
            })
        }else if(status === false){
            setId(-1);
            setVariables({
                namaGudang: "",
                alamatGudang: "",
            })
        }
    }
    return (
        <Container className="containerKu">
            <Row className="bg-white justify-content-center">
                <Col><h1 className="text-center">Master Gudang</h1></Col>
            </Row>
            <Row className="bg-white py-5 justify-content-md-center">
                <Col xs lg="4">
                    <Form onSubmit={register}>
                        {showError}
                        {showUser}
                        <Form.Group as={Col}>
                            <Form.Label className={errors.namaGudang && 'text-danger'}>{errors.namaGudang ?? 'Nama Gudang'}</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="nama"
                                value= {variables.namaGudang}
                                onChange={e => 
                                    setVariables({...variables, namaGudang : e.target.value})}
                            />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label className={errors.alamatGudang && 'text-danger'}>{errors.alamatGudang ?? 'Alamat Gudang'}</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={variables.alamatGudang} 
                                onChange={e => 
                                    setVariables({...variables, alamatGudang: e.target.value})
                                }
                            />
                        </Form.Group>
                    </Form>
                    <div className='text-center'>
                        {
                            id === -1?
                                <Button variant="primary" onClick={() => register()}>
                                    Tambah Gudang
                                </Button>:
                                <div className="buttonsSideBySide">
                                    <Button className="buttonSideBySide" variant="primary" onClick={() => updateIndex(true)}>
                                        Update Gudang
                                    </Button>
                                    <Button className="buttonSideBySide" variant="danger" onClick={() => updateIndex(false)}>
                                        Batal
                                    </Button>
                                </div>
                        }
                    </div>
                    <div className='text-center'>
                    </div>
                </Col>
            </Row>
            <Row className="justify-content-md-center">
                <Col className="col-md-10">
                    {dataKu}
                </Col>
            </Row>
        </Container>
    )
}
