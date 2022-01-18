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

const updateBatalkanSuratPeringatanMaster = gql`
    mutation updateBatalkanSuratPeringatanMaster(
      $id: String
  ) {
    updateBatalkanSuratPeringatanMaster(
      id: $id
    ){
      id
    }
  }
  `;

export default function DetailSuratPeringatan(props) {
    let history = useHistory();
    const location = useLocation();
    const [dataLaporan, setDataLaporan] = useState([]);

    useEffect(() => {
        if(location.state !== undefined){
            setDataLaporan(location.state?.laporan)
        }
    }, [location])
    
    const [updateStatusPermintaanKu] = useMutation(updateBatalkanSuratPeringatanMaster,{
        update(_,res){
            console.log(res)
        },
        onError: (err) => {
          console.log(err);
        },
        onCompleted(data){
            console.log(data);
            props.history.push('/surat/daftar surat peringatan');
        }
      })

    const actionPermintaan = (status) => {
        updateStatusPermintaanKu({variables:{
          id: dataLaporan.id,
        }
        });
      }

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
                <BiIcons.BiArrowBack size="50" onClick={() => history.push({pathname: '/surat/daftar surat peringatan'})} className="iconBack"/>
            </Col>
        </Row>
        <Row className="justify-content-center">
          <Col className="col-md-6">
            <h1 className="text-center">Detail SP</h1>
            <Card style={{ width: '100%' }}>
                <Card.Body>
                  <Card.Text>
                    <div className="parent">
                      <p className="childLeft">Nama Karyawan</p>
                        <p className="childRight">: {dataLaporan.karyawan?.nama}</p>
                      <p className="childLeft">Nama HRD</p>
                        <p className="childRight">: {dataLaporan.hrd?.nama}</p>
                      <p className="childLeft">Peringatan Ke</p>
                        <p className="childRight">: {dataLaporan.peringatanKe}</p>
                      <p className="childLeft">Tanggal SP</p>
                        <p className="childRight">: {dayjs(dataLaporan.createdAt).format('DD-MM-YYYY HH:mm:ss')}</p>
                      <p className="childLeft">Keterangan</p>
                        <p className="childRight">: {dayjs(dataLaporan.tanggalLaporan).format('DD-MM-YYYY')}</p>
                      <p className="childLeft">Keterangan</p>
                        <p className="childRight">: {dataLaporan.keterangan}</p>
                    </div>
                    <p className="text-center statusKu">Status:
                      {dataLaporan.diBatalkan === false? 
                        <div className="badgeStatusAktif">Tidak Di Batalkan</div>:
                                <div className="badgeStatusNon">Di Batalkan</div>}
                    </p>
                    {
                      dataLaporan.status !== 0? 
                        <Button variant="primary" onClick={() => downloadFile()}>
                          Unduh Berkas
                        </Button>:
                        <div className="buttonsSideBySide">
                            <Button className="buttonSideBySide" variant="primary" onClick={() => downloadFile()}>
                              Unduh Berkas
                            </Button>
                            <Button className="buttonSideBySide" variant="danger" onClick={() => actionPermintaan(3)}>
                              Batalkan
                            </Button>
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
