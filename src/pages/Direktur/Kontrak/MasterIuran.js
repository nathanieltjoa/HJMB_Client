import React from 'react'
import { Row, Col, Form, Button, Alert, Container} from 'react-bootstrap';
import { gql, useQuery, useMutation, useLazyQuery} from '@apollo/client';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

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
            <Row className="justify-content-center">
                <Col className="col-md-8">
                    {dataKu}
                </Col>
            </Row>
        </Container>
    )
}
