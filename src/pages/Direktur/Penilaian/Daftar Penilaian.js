import React, {useEffect, useState} from 'react'
import { Row, Col, Card, Button, Container, Form} from 'react-bootstrap';
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
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import dayjs from 'dayjs'

const getNilaiKaryawan = gql`
    query getNilaiKaryawan(
        $page: Int 
        $limit: Int
        $orderBy: String 
        $karyawan: Int 
        $bulan: MyDate
        $divisi: String 
    ){
        getNilaiKaryawan(
            page: $page 
            limit: $limit
            orderBy: $orderBy
            karyawan: $karyawan
            bulan: $bulan
            divisi: $divisi
        ){
            count rows{
                nama jabatan{
                    namaJabatan tingkatJabatan
                } hPenilaianHRD{
                    totalNilai
                } hPenilaianKuisioner{
                    totalNilai
                }
            }
        }
    }
`;


const getListDivisi = gql`
query getListDivisi{
    getListDivisi{
        namaDivisi
  }
}
`;


const getListKaryawanKontrak = gql`
query getListKaryawanKontrak(
    $divisi: String 
){
    getListKaryawanKontrak(
        divisi: $divisi
    ){
        id nama jabatan{jabatanKu}
  }
}
`;

export default function DaftarPenilaian(props) {
    const [pageNumber, setPageNumber] = useState(0);
    const [limit, setLimit] = useState(10);
    const [selectedDateAwal, setSelectedDateAwal] = useState(new Date());
    const [divisiKontrak, setDivisiKontrak] = useState("");
    const [karyawanKontrak, setKaryawanKontrak] = useState("");
    const [orderBy, setOrderBy] = useState("Nilai Tertinggi");
    const { loading, data, refetch } = useQuery(getNilaiKaryawan,{
        variables: {
            page: parseInt(pageNumber),
            limit: parseInt(limit),
            orderBy: orderBy,
            karyawan: parseInt(karyawanKontrak),
            bulan: dayjs(selectedDateAwal).format('YYYY-MM-DD'),
            divisi: divisiKontrak,
        }
    });
    
    useEffect(() => {
        refetch() 
    }, [orderBy])

    const changePage = ({ selected }) => {
        setPageNumber(selected)
    }

    let dataKu= [];
    let counter = false;
    let pageKu = [];
    let counterPage = false;
    if(data){
        console.log(data);
    }
    if(data === undefined || loading){
        pageKu.push(<p key={0}>Memuat...</p>)
    }else if(data.getNilaiKaryawan.count && !counterPage){
      var jml = Math.ceil(data.getNilaiKaryawan.count / limit);
      pageKu.push(
        <ReactPaginate
          key={1}
          previousLabel={'previous'}
          nextLabel={'next'}
          breakLabel={'...'}
          breakClassName={'break-me'}
          pageCount={jml}
          marginPagesDisplayed={2}
          forcePage={pageNumber}
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
    if(data === undefined || loading){
        dataKu.push(<p key={0} className="badgeStatusWaitingText">Memuat...</p>)
    }else if(data.getNilaiKaryawan.rows.length === 0){
        dataKu.push(<p key={1} className="badgeStatusNonText">Tidak Ada Penilaian Yang Tersedia</p>)
    }else if(data.getNilaiKaryawan.rows.length > 0 && !counter){
        console.log("data")
        console.log(data.getNilaiKaryawan.rows)
        var counterNilai = 0;
        dataKu.push(
            <div className='tableContainer'>
                <table size='string' className="table" aria-label="simple table">
                    <thead>
                        <tr>
                            <th>Nama Karyawan</th>
                            <th>Divisi Karyawan</th>
                            <th align='right'>Nilai HRD</th>
                            <th align='right'>Nilai Kuisioner</th>
                            <th align='right'>Total Nilai</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.getNilaiKaryawan.rows.map((laporan,index) =>(
                                <tr key={index} >
                                    {
                                        laporan.hPenilaianKuisioner.map(element =>{
                                            counterNilai+= element.totalNilai
                                        })
                                    }
                                    <td data-label="Nama">{laporan.nama}</td>
                                    <td data-label="Divisi">{laporan.jabatan.tingkatJabatan === 2? "Ketua ":
                                            laporan.jabatan.tingkatJabatan === 4? "Ketua ": "Anggota "}
                                            {laporan.jabatan.namaJabatan}</td>
                                    <td data-label="Nilai HRD" align='right'>
                                        {laporan.hPenilaianHRD.length === 0? "0": laporan.hPenilaianHRD[0]?.totalNilai}
                                    </td>
                                    <td data-label="Nilai Kuisioner" align='right'>{counterNilai}</td>
                                    <td data-label="Total Nilai" align='right'>{laporan.hPenilaianHRD.length === 0? (counterNilai) :(laporan.hPenilaianHRD[0]?.totalNilai + counterNilai)}</td>
                                    <p hidden>{counterNilai = 0}</p>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        )
        counter = true;
    }

    
    const { 
        loading: loadingDivisi,
        data: dataDivisi 
    } = useQuery(getListDivisi);

    let dataDivisiKu = [];
    let counterDivisi = false;
    if(!dataDivisi || loadingDivisi){

    }else if(dataDivisi.getListDivisi.length === 0){
        
    }else if(dataDivisi.getListDivisi.length > 0 && !counterDivisi){
        dataDivisiKu.push(dataDivisi.getListDivisi.map((divisi,index) =>(
            <option key={index} value={divisi.namaDivisi}>
                {divisi.namaDivisi}
            </option>
        )))
        counterDivisi = true;
    }

    const { 
        loading: loadingKaryawanKontrak, 
        data: dataKaryawanKontrak, 
        refetch: refetchKaryawanKontrak
    } = useQuery(getListKaryawanKontrak,{
        variables: {
            divisi: divisiKontrak
        }
    });

    let dataKaryawanKontrakKu = [];
    if(!dataKaryawanKontrak || loadingKaryawanKontrak){

    }else if(dataKaryawanKontrak.getListKaryawanKontrak.length === 0){

    }else if(dataKaryawanKontrak.getListKaryawanKontrak.length > 0){
        dataKaryawanKontrakKu.push(dataKaryawanKontrak.getListKaryawanKontrak.map((element, index) => (
            <option key={index} value={element.id} >{element.nama} ({element.jabatan.jabatanKu})</option>
        )))
    }

    return (
        <Container className="containerKu">
            <Row>
                <Col>
                    <h1 className="text-center">Daftar Penilaian</h1>
                </Col>
            </Row>
            <Row>
                <Col className="col-md-4">
                    <Form.Group as={Col}>
                        <Form.Label>Divisi Karyawan</Form.Label>
                        <Form.Control 
                            as="select" 
                            value={divisiKontrak} 
                            onChange={e => 
                                setDivisiKontrak(e.target.value)
                            }
                        >
                            <option value=""></option>
                            {dataDivisiKu}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group as={Col}>
                        <Form.Label>Karyawan: </Form.Label>
                        <Form.Control 
                            as="select" 
                            value={karyawanKontrak} 
                            onChange={e => 
                                setKaryawanKontrak(e.target.value)
                            }
                        >
                            <option value=""></option>
                            {dataKaryawanKontrakKu}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group as={Col}>
                        <Form.Label>Bulan</Form.Label>
                        <DatePicker
                            selected={selectedDateAwal}
                            onChange={date => setSelectedDateAwal(date)}
                            dateFormat='MM-yyyy'
                            maxDate={new Date()}
                            showMonthYearPicker
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Row className="d-flex flex-row-reverse">
                <Col className="col-md-4">
                    <Form.Group as={Col}>
                        <Form.Label>Urutkan Berdasar: </Form.Label>
                        <Form.Control 
                            as="select" 
                            value={orderBy} 
                            onChange={e => 
                                setOrderBy(e.target.value)
                            }
                        >
                            <option value="Nilai Tertinggi">Nilai Tertinggi</option>
                            <option value="Nilai Terendah">Nilai Terendah</option>
                        </Form.Control>
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col>
                    {dataKu}
                    <div className="pageContainerKu">
                        {pageKu}
                    </div>
                </Col>
            </Row>
        </Container>
    )
}