import React, {useEffect, useState} from 'react'
import { Row, Col, Card, Container} from 'react-bootstrap';
import { gql, useQuery} from '@apollo/client';
import dayjs from 'dayjs'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { useLocation } from 'react-router-dom';
import { CImage } from '@coreui/react';
import * as BiIcons from 'react-icons/bi';
import { useHistory } from 'react-router-dom';

const getMasterListPembagianAnggota = gql`
query getMasterListPembagianAnggota(
    $divisi: String 
){
    getMasterListPembagianAnggota(
      divisi: $divisi
  ){
    id groupKaryawan ketua karyawan{
      nama
    }
  }
}
`

export default function DetailPembagianGroup(props) {
    let history = useHistory();
    const location = useLocation();
    const [dataLaporan, setDataLaporan] = useState([]);
    const { loading, data, refetch} = useQuery(getMasterListPembagianAnggota,{
        variables: {
            divisi: dataLaporan.namaDivisi
        }
    });

    if(data){
        console.log(data.getMasterListPembagianAnggota);
    }

    useEffect(() => {
        if(location.state !== undefined){
            setDataLaporan(location.state?.laporan)
        }
    }, [location])
    
    return (
        <Container className="containerKu">
            <Row>
                <Col>
                    <BiIcons.BiArrowBack size="50" onClick={() => history.goBack()} className="iconBack"/>
                </Col>
            </Row>
            <Row className="bg-white justify-content-center">
                <Col><h1 className="text-center">Pembagian Group {dataLaporan?.namaDivisi}</h1></Col>
            </Row>
            <Row className="justify-content-center">
                {    
                    [...Array(dataLaporan?.jumlahGroup)].map((x,i) =>
                        <Col className="col-md-4">
                            <h3>Group {i+1}</h3>
                            <Table className="tableKu" aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">Nama</TableCell>
                                        <TableCell align="center">Group</TableCell>
                                        <TableCell align="center">Jabatan</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                {
                                    data?.getMasterListPembagianAnggota.map((laporan,index) =>(
                                            laporan.groupKaryawan !== (i+1) ? (
                                                null
                                            ):
                                            <TableRow key={index}>
                                                {console.log(laporan)}
                                                <TableCell component="th" scope="row" align="center">{laporan.karyawan?.nama}</TableCell>
                                                <TableCell component="th" scope="row" align="center">{laporan.groupKaryawan}</TableCell>
                                                <TableCell component="th" scope="row" align="center">
                                                    {
                                                        laporan.ketua === true?
                                                            <p className="badgeStatusAktif">Ketua</p>:
                                                            <p className="badgeStatusWaiting">Anggota</p>
                                                    }
                                                </TableCell>
                                            </TableRow>
                                    ))
                                }
                                </TableBody>
                            </Table>
                        </Col>
                    )}
            </Row>
        </Container>
    )
}
