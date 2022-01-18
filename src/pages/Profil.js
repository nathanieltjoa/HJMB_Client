import React, { useState, useEffect } from 'react'
import { Row, Col, Card, Button} from 'react-bootstrap';
import { gql, useMutation, useQuery} from '@apollo/client';
import dayjs from 'dayjs';
import { CImage } from '@coreui/react';

const {URL} = require('../config/config.json');

const getKaryawan = gql`
query getKaryawan{
  getKaryawan{
    nama nik noTelp tanggalMasuk tempatLahir tanggalLahir alamat agama pendidikan namaJabatan foto jabatan{
        namaJabatan
    }
  }
}
`;

export default function Profil(props) {
    const { loading, data, refetch } = useQuery(getKaryawan);
    let usersMarkUp
    let counter = false;
    if(data){
        console.log(data);
    }
    if(!data || loading){
        usersMarkUp = <p className="badgeStatusWaitingText">Memuat...</p>
    }else if(data.getKaryawan === null){
        usersMarkUp = <p className="badgeStatusNonText">Tidak Ada Data User</p>
    }else if(data.getKaryawan !== null && !counter){
        var karyawan = data.getKaryawan;
        console.log(data.getKaryawan)
        var fileImage = karyawan.foto;
        fileImage = fileImage.replace("localhost:4000", URL)
        usersMarkUp = 
            <Card style={{ width: '100%' }}>
                <Card.Body>
                    <Card.Title>
                        <CImage src={!fileImage ? "/default.png": fileImage} alt="" id="img" className="tinyLogo" width="150" height="150"/>
                    </Card.Title>
                    <Card.Text>
                        <div className="parent">
                            <p className="childLeft">Nama</p>
                                <p className="childRight">: {karyawan.nama}</p>
                            <p className="childLeft">Jabatan</p>
                                <p className="childRight">: {karyawan.jabatan?.namaJabatan}</p>
                            <p className="childLeft">NIK</p>
                                <p className="childRight">: {karyawan.nik}</p>
                            <p className="childLeft">NO.Telpon</p>
                                <p className="childRight">: {karyawan.noTelp}</p>
                            <p className="childLeft">Tanggal Masuk</p>
                                <p className="childRight">: {dayjs(karyawan.tanggalMasuk).format('DD-MM-YYYY')}</p>
                            <p className="childLeft">Tempat Lahir</p>
                                <p className="childRight">: {karyawan.tempatLahir}</p>
                            <p className="childLeft">Tanggal Lahir</p>
                                <p className="childRight">: {dayjs(karyawan.tanggalLahir).format('DD-MM-YYYY')}</p>
                            <p className="childLeft">Alamat</p>
                                <p className="childRight">: {karyawan.alamat}</p>
                            <p className="childLeft">Agama</p>
                                <p className="childRight">: {karyawan.agama}</p>
                            <p className="childLeft">Pendidikan</p>
                                <p className="childRight">: {karyawan.pendidikan}</p>
                        </div>
                        <Button variant="success" onClick={() => {
                            props.history.push('/ubah password')}
                        }>Ganti Password</Button>
                    </Card.Text>
                </Card.Body>
            </Card>
        counter = true;
    }
    useEffect(() => {
        if (window.performance) {
            if (performance.navigation.type == 1) {
                refetch()
                console.log('Refreshed!');
            }
        }
    }, []) 
    return (
        <Row className="bg-white py-5 justify-content-center">
            <Col sm={8} md={6} lg={4}>
                {usersMarkUp}
            </Col>
        </Row>
    )
}
