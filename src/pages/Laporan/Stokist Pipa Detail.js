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

const getDLaporanStokistPipa = gql`
  query getDLaporanStokistPipa(
    $id: String
  ){
    getDLaporanStokistPipa(
      id: $id
    ){
      jumlahPipa panjangPipa beratPipa totalBaik totalBS laporanStokStokistPipa{
        merkBarang tipeBarang ukuranBarang
      }
    }
  }
`

export default function DetailStokistPipa(props) {
    let history = useHistory();
    const location = useLocation();
    const [dataLaporan, setDataLaporan] = useState([]);
    const { loading, data, refetch} = useQuery(getDLaporanStokistPipa,{
        variables: {
            id: dataLaporan.id
        }
    });

    useEffect(() => {
        if(location.state !== undefined){
            setDataLaporan(location.state?.laporan)
        }
    }, [location])

    let dataDetail= [];
    if(!data || loading){
        dataDetail.push(<p key={0}>Loading....</p>)
    }else if(data.getDLaporanStokistPipa === null){
        dataDetail.push(<p key={0}>Tidak ada Detail Laporan</p>)
    }else if(data.getDLaporanStokistPipa !== null){
        dataDetail.push(
            <Row key={0} className="justify-content-center">
                <Col className="col-md-12">
                    <h3 className="subJudul">Detail Laporan:</h3>
                    <Table className="tableKu" aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">No.</TableCell>
                                <TableCell align="center">Tipe Barang</TableCell>
                                <TableCell align="center">Merk</TableCell>
                                <TableCell align="center">Ukuran</TableCell>
                                <TableCell align="center">Panjang</TableCell>
                                <TableCell align="center">Berat</TableCell>
                                <TableCell align="center">Jumlah Pipa</TableCell>
                                <TableCell align="center">Pipa Bagus</TableCell>
                                <TableCell align="center">Pipa BS</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                data.getDLaporanStokistPipa.map((laporan,index) =>(
                                    <TableRow key={index}>
                                        <TableCell component="th" scope="row" align="center">{index+1}</TableCell>
                                        <TableCell component="th" scope="row" align="center">{laporan.laporanStokStokistPipa.tipeBarang}</TableCell>
                                        <TableCell component="th" scope="row" align="center">{laporan.laporanStokStokistPipa.merkBarang}</TableCell>
                                        <TableCell component="th" scope="row" align="center">{laporan.laporanStokStokistPipa.ukuranBarang}</TableCell>
                                        <TableCell component="th" scope="row" align="center">{laporan.panjangPipa}</TableCell>
                                        <TableCell component="th" scope="row" align="center">{laporan.beratPipa}</TableCell>
                                        <TableCell component="th" scope="row" align="center">{laporan.jumlahPipa}</TableCell>
                                        <TableCell component="th" scope="row" align="center">{laporan.totalBaik}</TableCell>
                                        <TableCell component="th" scope="row" align="center">{laporan.totalBS}</TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </Col>
            </Row>
        )
    }
    
    
    return (
        <Container className="containerKu">
            <Row>
                <Col>
                    <BiIcons.BiArrowBack size="50" onClick={() => history.goBack()} className="iconBack"/>
                </Col>
            </Row>
            <Row className="bg-white justify-content-center">
                <Col><h1 className="text-center">Master Laporan Stokist Pipa</h1></Col>
            </Row>
            <Row className="bg-white py-5 justify-content-md-center">
                <Col className="col-md-6">
                    <Card>
                        <Card.Header className="subJudul">Detail Laporan</Card.Header>
                        <Card.Body>
                            <Card.Text>
                                <div className="parent">
                                    <p className="childLeft">Nama Pelapor</p>
                                        <p className="childRight">: {dataLaporan.karyawan?.nama}</p>
                                    <p className="childLeft">Nama Ketua</p>
                                        <p className="childRight">: {dataLaporan.ketua?.nama}</p>
                                    <p className="childLeft">Tanggal Laporan</p>
                                        <p className="childRight">: {dayjs(dataLaporan.createdAt).format('DD-MM-YYYY HH:mm:ss')}</p>
                                    <p className="childLeft">Shift</p>
                                        <p className="childRight">: {dataLaporan.shift}</p>
                                    <p className="childLeft">Total Pipa Baik</p>
                                        <p className="childRight">: {dataLaporan.jumlahBaik}</p>
                                    <p className="childLeft">Total Pipa BS</p>
                                        <p className="childRight">: {dataLaporan.jumlahBS}</p>
                                    <p className="childLeft">Keterangan</p>
                                        <p className="childRight">: {dataLaporan.keterangan}</p>
                                    {
                                        dataLaporan.pernahBanding === false? 
                                            null:
                                            <>
                                                <p className="childLeft">Keterangan Banding</p>
                                                    <p className="childRight">: {dataLaporan.keteranganBanding}</p>
                                            </>
                                    }
                                </div>
                                <div className="tagPInRow">
                                    <p className="tagPTextLeft">Status: 
                                        {
                                            dataLaporan.status === 1? 
                                                <div className="badgeStatusWaiting">Menunggu Verifikasi</div>:
                                                    <div className="badgeStatusAktif">Terverifikasi</div>
                                        }
                                    </p>
                                    <p className="tagPTextLeft">Status Banding:
                                        {dataLaporan.pernahBanding === true? 
                                            <div className="badgeStatusNon">Pernah Banding</div>:
                                                <div className="badgeStatusAktif">Aman</div>}
                                    </p>
                                </div>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col className="col-md-12">
                    {dataDetail}
                </Col>
            </Row>
        </Container>
    )
}