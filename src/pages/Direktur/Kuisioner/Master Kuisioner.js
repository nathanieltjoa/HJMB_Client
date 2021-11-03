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
        dataKu.push(<p key={0} className="badgeStatusWaitingText">Loading...</p>)
    }else if(data.getKuisioner.length === 0){
        dataKu.push(<p key={1} className="badgeStatusNonText">Tidak Ada Kuisioner Tersedia</p>)
    }else if(data.getKuisioner.length > 0 && !counter){
        dataKu.push(
            <TableContainer component={Paper} key={0}>
                <Table className="tableKu" aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Nama Kuisioner</TableCell>
                            <TableCell align="center">Divisi</TableCell>
                            <TableCell align="center">Deskripsi Kuisioner</TableCell>
                            <TableCell align="center">Jenis Kuisioner</TableCell>
                            <TableCell align="center">Status</TableCell>
                            <TableCell align="center">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            data.getKuisioner.map((laporan,index) =>(
                                <TableRow key={index}>
                                    <TableCell align="center">{laporan.namaKuisioner}</TableCell>
                                    <TableCell align="center">{laporan.divisi}</TableCell>
                                    <TableCell align="center">{laporan.deskripsiKuisioner}</TableCell>
                                    <TableCell align="center">{laporan.jenisKuisioner}</TableCell>
                                    <TableCell align="center">{laporan.status === true? 
                                        <div className="badgeStatusAktif">Aktif</div>:
                                        <div className="badgeStatusNon">Non-Aktif</div>}
                                    </TableCell>
                                    <TableCell align="center" style={{width: '20%'}}>
                                        <div className="buttonsSideBySide">
                                            <Button className="buttonSideBySide" variant="info" onClick={() => goToDetail(laporan)}>
                                                Detail
                                            </Button>
                                            <Button className="buttonSideBySide" variant="info" onClick={() => goToDistribusi(laporan)}>
                                                Distribusi
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