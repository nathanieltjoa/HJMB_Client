import React, {useState, useEffect} from 'react'
import { Row, Col, Card, Button, Form, Container} from 'react-bootstrap';
import { gql, useMutation} from '@apollo/client';
import { useLocation } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import dayjs from 'dayjs';
import * as BiIcons from 'react-icons/bi';
import { saveAs } from 'file-saver';
import ClipLoader from "react-spinners/ClipLoader";

const {URL} = require('../../../config/config.json')

export default function DetailSuratPerintahDirektur(props) {
    let history = useHistory();
    const location = useLocation();
    const [keterangan, setKeterangan] = useState("");
    const [dataLaporan, setDataLaporan] = useState([]);

    useEffect(() => {
        if(location.state !== undefined){
            setDataLaporan(location.state?.laporan)
        }
    }, [location])

      const downloadFile = () => {
        console.log()
        var FileSaver = require('file-saver');
        var fileImage = dataLaporan.file;
        fileImage = fileImage.replace("localhost:4000", URL);
        FileSaver.saveAs(fileImage, dataLaporan.id+".pdf");
      }
    return (
      <Container className="containerKu">
        <Row>
            <Col>
                <BiIcons.BiArrowBack size="50" onClick={() => history.push({pathname: '/direktur/surat/daftar surat perintah'})} className="iconBack"/>
            </Col>
        </Row>
        <Row className="justify-content-center">
          <Col className="col-md-6">
            <h1 className="text-center">Detail Permintaan</h1>
            <Card style={{ width: '100%' }}>
                <Card.Body>
                  <Card.Text>
                    <div className="parent">
                      <p className="childLeft">Nama Karyawan</p>
                        <p className="childRight">: {dataLaporan.karyawan?.nama}</p>
                      <p className="childLeft">Nama HRD</p>
                        <p className="childRight">: {dataLaporan.hrd?.nama}</p>
                      <p className="childLeft">Dinas</p>
                        <p className="childRight">: {dataLaporan.dinas}</p>
                      <p className="childLeft">Tanggal Mulai</p>
                        <p className="childRight">: {dayjs(dataLaporan.tanggalMulai).format('DD-MM-YYYY')}</p>
                      <p className="childLeft">Tanggal Akhir</p>
                        <p className="childRight">: {dayjs(dataLaporan.tanggalAkhir).format('DD-MM-YYYY')}</p>
                      <p className="childLeft">Tanggal Laporan</p>
                        <p className="childRight">: {dayjs(dataLaporan.tanggalLaporan).format('DD-MM-YYYY')}</p>
                      <p className="childLeft">Keterangan</p>
                        <p className="childRight">: {dataLaporan.keterangan}</p>
                      {
                        dataLaporan.keteranganKaryawan === ""? null:
                        <>
                          <p className="childLeft">Keterangan Karyawan</p>
                            <p className="childRight">: {dataLaporan.keteranganKaryawan}</p>
                        </>
                      }
                    </div>
                    <p className="text-center statusKu">Status:
                      {dataLaporan.status === 0? 
                        <div className="badgeStatusWaiting">Menunggu Persetujuan</div>:
                          dataLaporan.status === 1? 
                            <div className="badgeStatusAktif">Di Terima</div>:
                                dataLaporan.status === 2? 
                                <div className="badgeStatusNon">Di Tolak</div>:
                                <div className="badgeStatusNon">Di Batalkan</div>}
                    </p>
                    {
                      dataLaporan.status !== 0? 
                        <Button variant="primary" onClick={() => downloadFile()}>
                          Unduh File
                        </Button>: null                    
                    }
                  </Card.Text>
                </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    )
}
