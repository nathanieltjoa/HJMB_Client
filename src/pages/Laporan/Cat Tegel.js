import React, {useState, Fragment, useEffect} from 'react'
import { Row, Col, Form, Button, Alert, Container, Modal} from 'react-bootstrap';
import { gql, useQuery, useMutation, useLazyQuery} from '@apollo/client';
import dayjs from 'dayjs'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import ReactPaginate from 'react-paginate';
import CurrencyFormat from 'react-currency-format';
import { useHistory } from 'react-router-dom';
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { CImage } from '@coreui/react';


const getLaporanMasterCatTegel = gql`
query getLaporanMasterCatTegel(
    $page: Int 
    $limit: Int 
    $orderBy: String 
    $merk: String 
    $bulan: MyDate
    $status: Int 
    $banding: Int 
){
    getLaporanMasterCatTegel(
        page: $page
        limit: $limit 
        orderBy: $orderBy
        merk: $merk
        bulan: $bulan
        status: $status
        banding: $banding
    ){
        count rows{
            id merkProduk warna jumlahProduk satuanProduk foto keterangan khusus createdAt hLaporanCatTegel{
                idPelapor jenisProduk karyawan{
                    nama
                }
            }
        }
  }
}
`;

const getListMerkCatTegel = gql`
query getListMerkCatTegel{
    getListMerkCatTegel{
        merkProduk
  }
}
`;

export default function CatTegel(props) {
    let history = useHistory();
    const [id, setId] = useState(-1);
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const [bulan, setBulan] = useState("1");
    const [orderBy, setOrderBy] = useState("");
    const [selectedDateAwal, setSelectedDateAwal] = useState("");
    const [status, setStatus] = useState("0");
    const [banding, setBanding] = useState("0");
    const [merk, setMerk] = useState("");

    const { 
        loading: loadingMerk, 
        data: dataMerk, 
        refetch: refetchMerk
    } = useQuery(getListMerkCatTegel);

    const { 
        loading: loadingLaporan, 
        data: dataLaporan, 
        refetch: refetchLaporan 
    } = useQuery(getLaporanMasterCatTegel,{
        variables: {
            page: page,
            limit: limit,
            orderBy: orderBy,
            merk: merk,
            bulan: dayjs(selectedDateAwal).format('YYYY-MM-DD'),
            status: parseInt(status),
            banding: parseInt(banding),
        }
    });

    useEffect(() => {
        refetchLaporan()
    }, [orderBy])

    useEffect(() => {
        refetchLaporan()
    }, [page])

    const changePage = ({ selected }) => {
        setPage(selected)
    }

    const goToDetail = (laporan) => {
        console.log("asd");
        history.push({
            pathname: '/laporan/detail cat tegel',
            state: { laporan: laporan }
        });
    }

    let dataKu= [];
    let pageKu = [];
    if(dataLaporan){
        console.log("asd")
        console.log(dataLaporan);
    }
    if(!dataLaporan || loadingLaporan){
        pageKu.push(<p key={0} className="badgeStatusWaiting">Loading...</p>)
        {console.log(loadingLaporan)}
    }else if(dataLaporan.getLaporanMasterCatTegel.count){
      var jml = Math.ceil(dataLaporan.getLaporanMasterCatTegel.count / limit);
      pageKu.push(
        <ReactPaginate
          key={1}
          previousLabel={'previous'}
          nextLabel={'next'}
          breakLabel={'...'}
          breakClassName={'break-me'}
          pageCount={jml}
          forcePage={page}
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
    }
    if(!dataLaporan || loadingLaporan){
        dataKu.push(<p key={0} className="badgeStatusWaiting">Loading....</p>)
    }else if(dataLaporan.getLaporanMasterCatTegel.rows.length === 0){
        dataKu.push(<p key={0} className="badgeStatusNonText">Tidak ada Laporan Karyawan</p>)
    }else if(dataLaporan.getLaporanMasterCatTegel.rows.length > 0){
        console.log(dataLaporan.getLaporanMasterCatTegel.rows)
        dataKu.push(
            <TableContainer component={Paper} key={0}>
                <Table className="tableKu" aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Nama Karyawan</TableCell>
                            <TableCell align="center">Tanggal Laporan</TableCell>
                            <TableCell align="center">Jenis Produk</TableCell>
                            <TableCell align="center">Merk</TableCell>
                            <TableCell align="center">Warna</TableCell>
                            <TableCell align="center">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            dataLaporan.getLaporanMasterCatTegel.rows.map((laporan,index) =>(
                                <TableRow key={index}>
                                    <TableCell align="center">{laporan.hLaporanCatTegel.karyawan.nama}</TableCell>
                                    <TableCell align="center">{laporan.createdAt}</TableCell>
                                    <TableCell align="center">{laporan.hLaporanCatTegel.jenisProduk}</TableCell>
                                    <TableCell align="center">{laporan.merkProduk}</TableCell>
                                    <TableCell align="center">{laporan.warna}</TableCell>
                                    <TableCell align="center" style={{width: '20%'}}>
                                        <Button variant="info" onClick={() => goToDetail(laporan)}>
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
    }

    let dataMerkKu = [];
    if(!dataMerk || loadingMerk){

    }else if(dataMerk.getListMerkCatTegel.length === 0){

    }else if(dataMerk.getListMerkCatTegel.length > 0){
        dataMerkKu.push(dataMerk.getListMerkCatTegel.map((element, index) => (
            <option key={index} value={element.merkProduk} >{element.merkProduk}</option>
        )))
    }
    
    useEffect(() => {
        if (window.performance) {
            if (performance.navigation.type == 1) {
                refetchMerk()
                refetchLaporan()
                console.log('Refreshed!');
            }
        }
    }, []) 
    
    return (
        <Container className="containerKu">
            <Row className="bg-white justify-content-center">
                <Col><h1 className="text-center">Master Laporan Cat Tegel</h1></Col>
            </Row>
            <Row>
                <Col className="col-md-4">
                    <Form.Group as={Col}>
                        <Form.Label>Merk: </Form.Label>
                        <Form.Control 
                            as="select" 
                            value={merk} 
                            onChange={e => 
                                setMerk(e.target.value)
                            }
                        >
                            <option value="">Semuanya</option>
                            {dataMerkKu}
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
                            <option value=""></option>
                            <option value="Laporan Terbaru">Laporan Terbaru</option>
                            <option value="Laporan Terlama">Laporan Terlama</option>
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
