import React, {useEffect, useState} from 'react'
import { Row, Col, Card, Button, Form, Container} from 'react-bootstrap';
import { gql, useLazyQuery, useQuery, useMutation} from '@apollo/client';
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
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


const getKuisioner = gql`
query getKuisioner{
  getKuisioner{
    id namaKuisioner deskripsiKuisioner jenisKuisioner divisi status
  }
}
`;

export default function MasterKuisioner(props) {
    let history = useHistory();
    const { loading, data, refetch } = useQuery(getKuisioner);

    const goToDetail = (laporan) =>{
        console.log("asd");
        history.push({
            pathname: '/direktur/kuisioner/detail kuisionerku',
            state: { laporan: laporan }
        });
    }

    const goToDistribusi = (laporan) =>{
        history.push({
            pathname: '/direktur/kuisioner/detail distribusi',
            state: { laporan: laporan }
        });
    }

    let dataKu= [];
    let counter = false;
    if(data === undefined || loading){
        dataKu.push(<p key={0} className="badgeStatusWaitingText">Memuat...</p>)
    }else if(data.getKuisioner.length === 0){
        dataKu.push(<p key={1} className="badgeStatusNonText">Tidak Ada Kuisioner Tersedia</p>)
    }else if(data.getKuisioner.length > 0 && !counter){
        dataKu.push(
            <div className='tableContainer'>
                <table size='string' className="table" aria-label="simple table">
                    <thead>
                        <tr>
                            <th>Nama Kuisioner</th>
                            <th>Divisi</th>
                            <th>Deskripsi Kuisioner</th>
                            <th>Jenis Kuisioner</th>
                            <th>Status</th>
                            <th>#</th>
                            <th>#</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.getKuisioner.map((laporan,index) =>(
                                <tr key={index} >
                                    <td data-label="Nama">{laporan.namaKuisioner}</td>
                                    <td data-label="Divisi">{laporan.divisi}</td>
                                    <td data-label="Deskripsi Kuisioner">{laporan.deskripsiKuisioner}</td>
                                    <td data-label="Jenis Kuisioner">{laporan.jenisKuisioner}</td>
                                    <td data-label="Status">{laporan.status === true? 
                                        <div className="badgeStatusAktif">Aktif</div>:
                                        <div className="badgeStatusNon">Tidak Aktif</div>}</td>
                                    <td data-label="#">
                                        <Button variant="info" onClick={() => goToDetail(laporan)}>
                                            Detail
                                        </Button>
                                    </td>
                                    <td data-label="#">
                                        <Button variant="info" onClick={() => goToDistribusi(laporan)}>
                                            Distribusi
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
        <Container className="containerKu">
            <Row className="bg-white p-0 justify-content-center">
                <Col>
                    <h1 className="text-center">Master Kuisioner</h1>
                    {dataKu}
                </Col>
            </Row>
        </Container>
    )
}