import React, {useState, useEffect} from 'react'
import { Row, Col, Card, Button, Form, Container} from 'react-bootstrap';
import { gql, useMutation} from '@apollo/client';
import { useLocation } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import dayjs from 'dayjs';
import * as BiIcons from 'react-icons/bi';

import {URL} from '../../config/config.json';


export default function DetailIzinPribadi(props) {
    let history = useHistory();
    const location = useLocation();
    const [dataLaporan, setDataLaporan] = useState([]);

    useEffect(() => {
        if(location.state !== undefined){
            setDataLaporan(location.state?.laporan)
        }
    }, [location])
    return (
      <Container className="containerKu">
        <Row>
            <Col>
                <BiIcons.BiArrowBack size="50" onClick={() => history.push({pathname: '/izin/daftar izin pribadi'})} className="iconBack"/>
            </Col>
        </Row>
        <Row className="justify-content-center">
          <Col className="col-md-6">
            <h1 className="text-center">Detail Permintaan</h1>
            <Card style={{ width: '100%' }}>
                <Card.Body>
                  <Card.Text>
                    <div className="parent">
                      <p className="childLeft">Izin</p>
                        <p className="childRight">: {dataLaporan.izin?.namaIzin}</p>
                      <p className="childLeft">Maks Izin</p>
                        <p className="childRight">: {dataLaporan.izin?.totalIzin} Hari</p>
                      {
                        dataLaporan.ketua === null? null:
                        <>
                          <p className="childLeft">Nama Ketua</p>
                            <p className="childRight">: {dataLaporan.ketua?.nama}</p>
                        </>
                      }
                      <p className="childLeft">Tanggal Mulai</p>
                        <p className="childRight">: {dayjs(dataLaporan.tanggalMulai).format('DD-MM-YYYY')}</p>
                      <p className="childLeft">Tanggal Berakhir</p>
                        <p className="childRight">: {dayjs(dataLaporan.tanggalBerakhir).format('DD-MM-YYYY')}</p>
                      <p className="childLeft">Total Hari</p>
                        <p className="childRight">: {dataLaporan.totalHari} Hari</p>
                      <p className="childLeft">Keterangan</p>
                        <p className="childRight">: {dataLaporan.keterangan}</p>
                      {
                        dataLaporan.status !== 0? null:
                        <>
                          <p className="childLeft">Alasan Tolak</p>
                            <p className="childRight">: {dataLaporan.alasan}</p>
                        </>
                      }
                    </div>
                    <p className="text-center statusKu">Status:
                      {dataLaporan.status === 4? 
                        <div className="badgeStatusWaiting">Menunggu Verifikasi Direktur</div>:
                            dataLaporan.status === 3?
                            <div className="badgeStatusAktif">Di Terima</div>:
                            <div className="badgeStatusNon">Di Tolak</div>}
                    </p>
                    {dataLaporan?.upload === undefined ? null : <img src={dataLaporan?.upload.replace("localhost:4000", URL)} alt="" id="img" className="img" width="250" height="200"/> }
                  </Card.Text>
                </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    )
}
