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

const getIndexPenilaian = gql`
query getIndexPenilaian{
    getIndexPenilaian{
    id namaIndex nilaiIndex keteranganIndex status
  }
}
`;
export default function MasterIndex(props) {
    
    const { loading, data, refetch } = useQuery(getIndexPenilaian);

    var counterJml = 0;
    let dataKu= [];
    let counter = false;
    if(data === undefined || loading){
        dataKu.push(<p key={0} className="badgeStatusWaitingText">Loading...</p>)
    }else if(data.getIndexPenilaian.length === 0){
        dataKu.push(<p key={1} className="badgeStatusNonText">Tidak Ada Index Penilaian Yang Tersedia</p>)
    }else if(data.getIndexPenilaian.length > 0 && !counter){
        counterJml = 0;
        dataKu.push(
            <TableContainer component={Paper} key={0}>
                <Table className="tableKu" aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Nama Index</TableCell>
                            <TableCell align="center">Keterangan Index</TableCell>
                            <TableCell align="right">Persentase Index</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            data.getIndexPenilaian.map((laporan,index) =>(
                                <TableRow key={index}>
                                    <TableCell component="th" scope="row" align="center">{laporan.namaIndex}</TableCell>
                                    <TableCell component="th" scope="row" align="center">{laporan.keteranganIndex}</TableCell>
                                    <TableCell component="th" scope="row" align="right" >{laporan.nilaiIndex}</TableCell>
                                    <p hidden>{counterJml += laporan.nilaiIndex}</p>
                                </TableRow>
                            ))
                        }
                        <TableRow>
                            <TableCell component="th" scope="row"></TableCell>
                            <TableCell component="th" scope="row" align="right" style={{fontWeight: 'bold'}}>Total</TableCell>
                            {
                                counterJml < 80?
                                    <TableCell component="th" scope="row" align="right" style={{backgroundColor: 'red'}}>{counterJml}(Jumlah Kurang Dari 80)</TableCell>:
                                    counterJml > 80?
                                        <TableCell component="th" scope="row" align="right" style={{backgroundColor: 'red'}}>{counterJml}(Jumlah Lebih Dari 80)</TableCell>:
                                            <TableCell component="th" scope="row" align="right">{counterJml}</TableCell>
                            }
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        )
        counter = true;
    }
    
    return (
        <Container className="containerKu">
            <Row className="bg-white justify-content-center">
                <Col><h1 className="text-center">Master Index Penilaian</h1></Col>
            </Row>
            <Row className="justify-content-center">
                <Col className="col-md-10">
                    {dataKu}
                </Col>
            </Row>
        </Container>
    )
}
