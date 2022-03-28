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
            pathname: '/direktur/karyawan/detail karyawan',
            state: { 
                laporan: laporan
            }
        });
    }
    
    let dataKaryawanKu= [];
    let counterKaryawanKu = false;
    let pageKu = [];
    let counterPage = false;
    if(dataKaryawan){
        console.log(dataKaryawan);
    }
    if(dataKaryawan === undefined || loadingKaryawan){
        pageKu.push(<p key={0}>Memuat...</p>)
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
        dataKaryawanKu.push(<p key={0}>Memuat...</p>)
    }else if(dataKaryawan.getListKaryawanMaster.rows.length === 0){
        dataKaryawanKu.push(<p key={1}>Tidak Ada Data Karyawan</p>)
    }else if(dataKaryawan.getListKaryawanMaster.rows.length > 0 && !counterKaryawanKu){
        dataKaryawanKu.push(
            <div className='tableContainer'>
            <table size='string' className="table" aria-label="simple table">
                <thead>
                    <tr>
                        <th className='columnTable'>Id</th>
                        <th className='columnTable'>Nama Karyawan</th>
                        <th className='columnTable'>NIK</th>
                        <th className='columnTable'>Tanggal Masuk</th>
                        <th className='columnTable'>Tempat Lahir</th>
                        <th className='columnTable'>Tanggal Lahir</th>
                        <th className='columnTable'>Alamat</th>
                        <th className='columnTable'>Agama</th>
                        <th className='columnTable'>Pendidikan</th>
                        <th className='columnTable'>Nama Jabatan</th>
                        <th className='columnTable'>#</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        dataKaryawan.getListKaryawanMaster.rows.map((laporan,index) =>(
                            <tr key={index} >
                                <td data-label="Id"  className='columnTable'>{laporan.id}</td>
                                <td data-label="Nama" className='columnTable'>{laporan.nama}</td>
                                <td data-label="NIK" className='columnTable'>{laporan.nik}</td>
                                <td data-label="Tanggal Masuk" className='columnTable'>{dayjs(laporan.tanggalMasuk).format('DD-MM-YYYY')}</td>
                                <td data-label="Tempat Lahir" className='columnTable'>{laporan.tempatLahir}</td>
                                <td data-label="Tanggal Lahir" className='columnTable'>{dayjs(laporan.tanggalLahir).format('DD-MM-YYYY')}</td>
                                <td data-label="Alamat" className='columnTable'>{laporan.alamat}</td>
                                <td data-label="Agama" className='columnTable'>{laporan.agama}</td>
                                <td data-label="Pendidikan" className='columnTable'>{laporan.pendidikan}</td>
                                <td data-label="Jabatan" className='columnTable'>{laporan.jabatan.tingkatJabatan === 2? 
                                            "Ketua"
                                            :laporan.jabatan.tingkatJabatan === 4?
                                                "Ketua":
                                                    "Anggota"} {laporan.jabatan.namaJabatan}</td>
                                <td data-label="#" className='columnTable'>
                                    <Button variant="info" onClick={() => goToDetail(laporan, null, null)}>
                                        Detail
                                    </Button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
        )
        counterKaryawanKu = true;
    }
    useEffect(() => {
        refetchKaryawan()
    }, [pageNumber])

    useEffect(() => {
        if (window.performance) {
            if (performance.navigation.type == 1) {
                refetchKaryawan()
            }
        }
    }, [])         

    return (
        <CContainer className="containerKu">
            <Row className="bg-white py-5 justify-content-center">
                <Col>
                    <h1 className="text-center">Master Karyawan</h1>
                    {dataKaryawanKu}
                    <div className="pageContainerKu">
                        {pageKu}
                    </div>
                </Col>
            </Row>
        </CContainer>
    )
}