import React, {useState, useEffect} from 'react'
import { Row, Col, Card, Button, Form, Container} from 'react-bootstrap';
import { gql, useMutation} from '@apollo/client';
import { useLocation } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import dayjs from 'dayjs';
import * as BiIcons from 'react-icons/bi';

import {URL} from '../../../config/config.json';

const updateStatusPermintaan = gql`
    mutation updateStatusPermintaan(
      $id: String
      $status: Int
      $alasan: String
  ) {
    updateStatusPermintaan(
      id: $id
      status: $status
      alasan: $alasan
    ){
      id
    }
  }
  `;

export default function DetailPermintaanDirektur(props) {
    let history = useHistory();
    const location = useLocation();
    const [alasan, setAlasan] = useState("");
    const [dataLaporan, setDataLaporan] = useState([]);

    useEffect(() => {
        if(location.state !== undefined){
            setDataLaporan(location.state?.laporan)
        }
    }, [location])
    
    const [updateStatusPermintaanKu] = useMutation(updateStatusPermintaan,{
        update(_,res){
            console.log(res)
        },
        onError: (err) => {
          console.log(err);
        },
        onCompleted(data){
            console.log(data);
            history.push('/permintaan/permintaan izin');
        }
      })

    const actionPermintaan = (status) => {
        console.log(alasan);
        updateStatusPermintaanKu({variables:{
          id: dataLaporan.id,
          status: status,
          alasan: alasan,
        }
        });
      }
    return (
      <Container className="containerKu">
        <Row>
            <Col>
                <BiIcons.BiArrowBack size="50" onClick={() => history.goBack()} className="iconBack"/>
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
                        <p className="childRight">: {dataLaporan.peminta?.nama}</p>
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
                      {
                        dataLaporan.hrd === null? null:
                        <>
                          <p className="childLeft">Nama HRD</p>
                            <p className="childRight">: {dataLaporan.hrd?.nama}</p>
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
                    </div>
                    <p className="text-center statusKu">Status:
                      {dataLaporan.status === 1? 
                        <div className="badgeStatusWaiting">Menunggu Verifikasi Ketua</div>:
                          dataLaporan.status === 2? 
                            <div className="badgeStatusWaiting">Menunggu Verifikasi HRD</div>:
                              dataLaporan.status === 3?
                                <div className="badgeStatusAktif">Di Terima</div>:
                                  dataLaporan.status === 4?
                                    <div className="badgeStatusWaiting">Menunggu Verifikasi Direktur</div>:
                                    <div className="badgeStatusNon">Di Tolak</div>}
                    </p>
                    {dataLaporan?.upload === undefined ? null :
                     dataLaporan.upload === "-"? null: <img src={dataLaporan?.upload.replace("localhost:4000", URL)} alt="" id="img" className="img" width="250" height="200"/> }
                    {
                      dataLaporan.status !== 4? null:
                      <div>
                        <br></br>
                        <Form.Label className="childLeft">Alasan Tolak: </Form.Label>
                        <Form.Control 
                            as="textarea" 
                            value={alasan} 
                            onChange={e => 
                                setAlasan(e.target.value)
                            }
                        />
                        <br></br>
                        <div className="buttonsSideBySide">
                            <Button className="buttonSideBySide" variant="primary" onClick={() => actionPermintaan(3)}>
                              Terima
                            </Button>
                            <Button className="buttonSideBySide" variant="danger" onClick={() => actionPermintaan(0)}>
                              Tolak
                            </Button>
                        </div>
                      </div>
                    }
                  </Card.Text>
                </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    )
}
