import React, {useState, Fragment, useEffect} from 'react'
import { Row, Col, Form, Button, Alert, Container, Modal} from 'react-bootstrap';
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


const updatePembagianDivisi = gql`
    mutation updateIndexGaji(
        $id: Int 
        $jumlahGroup: Int 
    ) {
        updatePembagianDivisi(
            id: $id
            jumlahGroup: $jumlahGroup
        ) {
            id
        }
    }
`;


const getListDivisi = gql`
query getListDivisi{
    getListDivisi{
        id namaDivisi jumlahGroup
  }
}
`;
export default function TambahGroup(props) {
    let history = useHistory();
    const [id, setId] = useState(-1);
    const [namaDivisi, setNamaDivisi] = useState("");
    const [jumlah, setJumlah] = useState(0);
    const [visible, setVisible] = useState(false);

    const [updatePembagianDivisiKu] = useMutation(updatePembagianDivisi,{
        update(_,res){
            console.log(res)
        },
        onError: (err) => {
            console.log(err)
            setVisible(false)   
            alert(err.graphQLErrors[0].extensions.errors);
        },
        onCompleted(data){
            refetch()
            setId(-1);
            setVisible(false)
        }
    })

    const updateIndex = () =>{
        updatePembagianDivisiKu({
            variables: {
                id: parseInt(id),
                jumlahGroup: parseInt(jumlah),
            }
        })
    }

    const editIndex = (laporan) => {
        setVisible(true)
        setId(laporan.id);
        setNamaDivisi(laporan.namaDivisi);
        setJumlah(laporan.jumlahGroup);
    }
    
    const goToDetail = (laporan) => {
        console.log("asd");
        history.push({
            pathname: '/penambahan/detail pembagian group',
            state: { laporan: laporan }
        });
    }

    const { loading, data, refetch } = useQuery(getListDivisi);

    let dataKu= [];
    let counter = false;
    if(!data || loading){

    }else if(data.getListDivisi.length === 0){

    }else if(data.getListDivisi.length > 0 && !counter){
        dataKu.push(
            <div className='tableContainer'>
                <table size='string' className="table" aria-label="simple table">
                    <thead>
                        <tr>
                            <th>Nama Divisi</th>
                            <th>Jumlah Group</th>
                            <th>#</th>
                            <th>#</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.getListDivisi.map((laporan,index) =>(
                                <tr key={index} >
                                    <td data-label="Nama Divisi">{laporan.namaDivisi}</td>
                                    <td data-label="Jumlah Group">{laporan.jumlahGroup}</td>
                                    <td data-label="#">
                                        <Button variant="primary" onClick={() => editIndex(laporan)}>
                                            Edit
                                        </Button>
                                    </td>
                                    <td data-label="#">
                                        <Button variant="info" onClick={() => goToDetail(laporan)}>
                                            Detail
                                        </Button>
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
                    <Col><h1 className="text-center">Master Pembagian Group</h1></Col>
                </Row>
                <Row className="bg-white justify-content-center">
                    <Col className="col-md-8">
                        {dataKu}
                    </Col>
                </Row>
                <Modal show={visible} onHide={() => setVisible(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Pembagian Group {namaDivisi}</Modal.Title>
                    </Modal.Header>
                        <Modal.Body>
                            <Form.Group as={Col}>
                                <Form.Label>Jumlah Group</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    name="nama"
                                    value= {jumlah}
                                    onChange={e => 
                                        setJumlah(e.target.value)}
                                />
                            </Form.Group>
                        </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setVisible(false)}>
                            Tutup
                        </Button>
                        <Button variant="primary" onClick={() => updateIndex()}>
                            Perbarui
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </Fragment>
    )
}
