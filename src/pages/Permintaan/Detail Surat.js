import React, {useState, useEffect} from 'react'
import { Row, Col, Card, Button, Form, Container} from 'react-bootstrap';
import { gql, useMutation} from '@apollo/client';
import { useLocation } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import dayjs from 'dayjs';
import * as BiIcons from 'react-icons/bi';
import { saveAs } from 'file-saver';
import ClipLoader from "react-spinners/ClipLoader";

const {URL} = require('../../config/config.json')

const updateStatusSurat = gql`
    mutation updateStatusSurat(
      $id: String
      $status: Int
      $keteranganHRD: String
  ) {
    updateStatusSurat(
      id: $id
      status: $status
      keteranganHRD: $keteranganHRD
    ){
      id
    }
  }
  `;

export default function DetailSurat(props) {
    let history = useHistory();
    const location = useLocation();
    const [keterangan, setKeterangan] = useState("");
    const [dataLaporan, setDataLaporan] = useState([]);

    useEffect(() => {
        if(location.state !== undefined){
            setDataLaporan(location.state?.laporan)
        }
    }, [location])
    
    const [updateStatusPermintaanKu, {loading}] = useMutation(updateStatusSurat,{
        update(_,res){
            console.log(res)
        },
        onError: (err) => {
          alert(err.graphQLErrors[0].extensions.errors);
        },
        onCompleted(data){
          console.log(data);
          history.push('/surat/daftar surat keterangan');
        }
      })

    const actionPermintaan = (status) => {
        updateStatusPermintaanKu({variables:{
          id: dataLaporan.id,
          status: status,
          keteranganHRD: keterangan,
        }
        });
      }

      const downloadFile = () => {
        console.log(dataLaporan.file)
        var FileSaver = require('file-saver');
        var fileImage = dataLaporan.file;
        fileImage = fileImage.replace("localhost:4000", URL);
        FileSaver.saveAs(fileImage, dataLaporan.id+".pdf");
      }
    return (
      <Container className="containerKu">
        <Row>
            <Col>
                <BiIcons.BiArrowBack size="50" onClick={() => history.push({pathname: '/surat/daftar surat keterangan'})} className="iconBack"/>
            </Col>
        </Row>
        <Row className="justify-content-center">
          <Col className="col-md-6">
            <h1 className="text-center">Detail Permintaan</h1>
            <Row className="bg-white justify-content-center">
                <Col className="col-md-2">
                    <ClipLoader color="#000000" loading={loading} className="loadingKu" size={150} />
                </Col>
            </Row>
            <Card style={{ width: '100%' }}>
                <Card.Body>
                  <Card.Text>
                    <div className="parent">
                      <p className="childLeft">Nama Karyawan</p>
                        <p className="childRight">: {dataLaporan.karyawan?.nama}</p>
                      <p className="childLeft">Nama HRD</p>
                        <p className="childRight">: {dataLaporan.hrd?.nama}</p>
                      <p className="childLeft">Surat</p>
                        <p className="childRight">: {dataLaporan.jenisSurat}</p>
                      <p className="childLeft">Tanggal Permintaan</p>
                        <p className="childRight">: {dayjs(dataLaporan.tanggalKerja).format('DD-MM-YYYY')}</p>
                      <p className="childLeft">Tanggal Laporan</p>
                        <p className="childRight">: {dayjs(dataLaporan.tanggalLaporan).format('DD-MM-YYYY')}</p>
                      <p className="childLeft">Keterangan</p>
                        <p className="childRight">: {dataLaporan.keterangan}</p>
                      {
                        dataLaporan.keteranganHRD === ""? null:
                        <>
                          <p className="childLeft">Keterangan HRD</p>
                            <p className="childRight">: {dataLaporan.keteranganHRD}</p>
                        </>
                      }
                    </div>
                    <p className="text-center statusKu">Status:
                      {dataLaporan.status === 0? 
                        <div className="badgeStatusWaiting">Menunggu Verifikasi</div>:
                          dataLaporan.status === 1? 
                            <div className="badgeStatusAktif">Di Terima</div>:
                                <div className="badgeStatusNon">Di Tolak</div>}
                    </p>
                    {
                      dataLaporan.status !== 1? null:
                        <Button variant="primary" onClick={() => downloadFile()}>
                          Unduh File
                        </Button>
                    }
                    {
                      dataLaporan.status !== 0? null:
                      <div>
                        <br></br>
                        <Form.Label className="childLeft">Keterangan HRD: </Form.Label>
                        <Form.Control 
                            as="textarea" 
                            value={keterangan} 
                            onChange={e => 
                              setKeterangan(e.target.value)
                            }
                        />
                        <br></br>
                        <div className="buttonsSideBySide">
                            <Button className="buttonSideBySide" variant="primary" onClick={() => actionPermintaan(1)}>
                              Terima
                            </Button>
                            <Button className="buttonSideBySide" variant="danger" onClick={() => actionPermintaan(2)}>
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
