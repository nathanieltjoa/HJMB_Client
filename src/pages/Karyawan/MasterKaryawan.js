import React, {useEffect, useState} from 'react'
import { Row, Col, Card, Button, Container} from 'react-bootstrap';
import { gql, useLazyQuery, useQuery} from '@apollo/client';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import ReactPaginate from 'react-paginate';
import 'react-datepicker/dist/react-datepicker.css'
import dayjs from 'dayjs'
import Carousel from 'react-elastic-carousel'
import { useHistory } from 'react-router-dom';
import { CContainer } from '@coreui/react';

const getPermintaanDataDiri = gql`
    query getPermintaanDataDiri{
        getPermintaanDataDiri{
            namaKaryawan id idKaryawan bagianData dataSeharusnya
        }
    }
`;

const getListKaryawanMaster = gql`
    query getListKaryawanMaster(
        $page: Int 
        $limit: Int 
    ){
        getListKaryawanMaster(
            page: $page
            limit: $limit
        ){
            count rows{
                id nama nik noTelp tanggalMasuk tempatLahir tanggalLahir alamat agama pendidikan foto jabatan{
                    namaJabatan tingkatJabatan
                }
            }
        }
    }
`;

export default function MasterKaryawan(props) {
    let history = useHistory();
    const [pageNumber, setPageNumber] = useState(0);
    const [limit, setLimit] = useState(10);
    const [selectedDateAwal, setSelectedDateAwal] = useState(null);
    const [selectedDateAkhir, setSelectedDateAkhir] = useState(null);
    const { 
        loading: loadingPermintaan, 
        data: dataPermintaan ,
        refetch: refetchPermintaan,
    }= useQuery(getPermintaanDataDiri);
    const { 
        loading: loadingKaryawan, 
        data: dataKaryawan ,
        refetch: refetchKaryawan,
    }= useQuery(getListKaryawanMaster,{
        variables: {
            page: pageNumber,
            limit: limit,
        }
    });

    const changePage = ({ selected }) => {
        setPageNumber(selected)
    }

    const goToDetail = (laporan, laporanPermintaan) =>{
        history.push({
            pathname: '/karyawan/detail karyawan',
            state: { 
                laporan: laporan,
                laporanPermintaan: laporanPermintaan
            }
        });
    }

    const breakPoints = [
        {width: 500, itemsToShow: 1},
        {width: 768, itemsToShow: 2},
        {width: 1200, itemsToShow: 3},
        {width: 1500, itemsToShow: 4},
    ]

    let dataKu= [];
    let counter = false;
    if(dataPermintaan === undefined || loadingPermintaan){
        dataKu.push(<p key={0} className="badgeStatusWaitingText">Loading...</p>)
    }else if(dataPermintaan.getPermintaanDataDiri.length === 0){
        dataKu.push(<p key={1} className="badgeStatusNonText">Tidak Ada Data Permintaan Perubahan Data Diri</p>)
    }else if(dataPermintaan.getPermintaanDataDiri.length > 0 && !counter){
        dataKu.push(
            <Carousel
                breakPoints={breakPoints}>
                {
                    dataPermintaan.getPermintaanDataDiri.map((laporan,index) =>(
                        <div className="cardKu" key={index}>
                            <div className="parent">
                                <p className="childLeft">Id</p>
                                    <p className="childRight">: {laporan.idKaryawan}</p>
                                <p className="childLeft">Nama Karyawan</p>
                                    <p className="childRight">: {laporan.namaKaryawan}</p>
                                <p className="childLeft">Field Yang Salah</p>
                                    <p className="childRight">: {laporan.bagianData}</p>
                                <p className="childLeft">Isi Seharusnya</p>
                                    <p className="childRight">: {laporan.dataSeharusnya}</p>
                            </div>
                            <div className="text-center">
                                <Button variant="primary" onClick={() => goToDetail(null, laporan)}>Perbarui Data</Button>
                            </div>
                        </div>
                    ))
                }
            </Carousel>)
        counter = true;
    }
    
    let dataKaryawanKu= [];
    let counterKaryawanKu = false;
    let pageKu = [];
    let counterPage = false;
    if(dataKaryawan){
        console.log(dataKaryawan);
    }
    if(dataKaryawan === undefined || loadingKaryawan){
        pageKu.push(<p key={0}>Loading...</p>)
    }else if(dataKaryawan.getListKaryawanMaster.count && !counterPage){
      var jml = Math.ceil(dataKaryawan.getListKaryawanMaster.count / limit);
      pageKu.push(
        <ReactPaginate
          key={1}
          previousLabel={'previous'}
          nextLabel={'next'}
          breakLabel={'...'}
          breakClassName={'break-me'}
          pageCount={jml}
          forcePage={pageNumber}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={(selected) => changePage(selected)}
          containerClassName={"paginationBttns"}
          previousLinkClassName={"previousBttn"}
          nextLinkClassName={"nextBttn"}
          disabledClassName={"paginationDisabled"}
          activeClassName={"paginationActive"}
        />
      )
      counterPage = true;
    }
    if(dataKaryawan === undefined || loadingKaryawan){
        dataKaryawanKu.push(<p key={0}>Loading...</p>)
    }else if(dataKaryawan.getListKaryawanMaster.rows.length === 0){
        dataKaryawanKu.push(<p key={1}>Tidak Ada Data Absensi</p>)
    }else if(dataKaryawan.getListKaryawanMaster.rows.length > 0 && !counterKaryawanKu){
        dataKaryawanKu.push(
            <TableContainer component={Paper} key={0}>
                <Table className="tableKu" aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="right">Id</TableCell>
                            <TableCell align="center">Nama Karyawan</TableCell>
                            <TableCell align="center">NIK</TableCell>
                            <TableCell align="center">Tanggal Masuk</TableCell>
                            <TableCell align="center">Tempat Lahir</TableCell>
                            <TableCell align="center">Tanggal Lahir</TableCell>
                            <TableCell align="center">Alamat</TableCell>
                            <TableCell align="center">Agama</TableCell>
                            <TableCell align="center">Pendidikan</TableCell>
                            <TableCell align="center">Nama Jabatan</TableCell>
                            <TableCell align="center">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            dataKaryawan.getListKaryawanMaster.rows.map((laporan,index) =>(
                                <TableRow key={index}>
                                    <TableCell align="right">{laporan.id}</TableCell>
                                    <TableCell align="center">{laporan.nama}</TableCell>
                                    <TableCell align="center">{laporan.nik}</TableCell>
                                    <TableCell align="center">{dayjs(laporan.tanggalMasuk).format('DD-MM-YYYY')}</TableCell>
                                    <TableCell align="center">{laporan.tempatLahir}</TableCell>
                                    <TableCell align="center">{dayjs(laporan.tanggalLahir).format('DD-MM-YYYY')}</TableCell>
                                    <TableCell align="center">{laporan.alamat}</TableCell>
                                    <TableCell align="center">{laporan.agama}</TableCell>
                                    <TableCell align="center">{laporan.pendidikan}</TableCell>
                                    <TableCell align="center">
                                        {laporan.jabatan.tingkatJabatan === 2? 
                                            "Ketua"
                                            :laporan.jabatan.tingkatJabatan === 4?
                                                "Ketua":
                                                    "Anggota"} {laporan.jabatan.namaJabatan}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Button variant="info" onClick={() => goToDetail(laporan, null, null)}>
                                            Detail
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        )
        counterKaryawanKu = true;
    }
    useEffect(() => {
        refetchKaryawan()
    }, [pageNumber])

    useEffect(() => {
        if (window.performance) {
            if (performance.navigation.type == 1) {
                refetchPermintaan()
                refetchKaryawan()
            }
        }
    }, [])         

    return (
        <CContainer className="containerKu">
            <Row className="bg-white py-5 justify-content-center">
                <Col>
                    <h1 className="text-center">Master Karyawan</h1>
                    {dataKu}
                    {dataKaryawanKu}
                    <div className="pageContainerKu">
                        {pageKu}
                    </div>
                </Col>
            </Row>
        </CContainer>
    )
}