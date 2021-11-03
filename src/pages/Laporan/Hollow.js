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


const getLaporanMasterHollow = gql`
query getLaporanMasterHollow(
    $page: Int 
    $limit: Int 
    $orderBy: String 
    $karyawan: Int 
    $bulan: MyDate
    $status: Int 
    $banding: Int 
){
    getLaporanMasterHollow(
        page: $page
        limit: $limit 
        orderBy: $orderBy
        karyawan: $karyawan
        bulan: $bulan
        status: $status
        banding: $banding
    ){
        count rows{
            id ukuran ketebalan berat noCoil jumlah BS keterangan foto status pernahBanding keteranganBanding createdAt
            hLaporanHollow{
                idPelapor idKetua totalBerat totalJumlah totalBS karyawan{nama} ketua{nama}
            }
        }
  }
}
`;

const getListKaryawanLaporan = gql`
query getListKaryawanLaporan(
    $divisi: String 
){
    getListKaryawanLaporan(
        divisi: $divisi
    ){
        id nama
  }
}
`;

const getSummaryHollow = gql`
query getSummaryHollow{
    getSummaryHollow{
        jumlahProduksi jumlahBanding jumlahBS karyawan{
            nama
        }
  }
}
`;

export default function Hollow(props) {
    let history = useHistory();
    const [id, setId] = useState(-1);
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const [bulan, setBulan] = useState("1");
    const [orderBy, setOrderBy] = useState("");
    const [selectedDateAwal, setSelectedDateAwal] = useState("");
    const [status, setStatus] = useState("0");
    const [banding, setBanding] = useState("0");
    const [karyawan, setKaryawan] = useState("");
    const [visible, setVisible] = useState(false);
    const [dataDetail, setDataDetail] = useState([]);
    const [visibleSummary, setVisibleSummary] = useState(false);

    const { 
        loading: loadingKaryawan, 
        data: dataKaryawan, 
        refetch: refetchKaryawan 
    } = useQuery(getListKaryawanLaporan,{
        variables: {
            divisi: "Spandek dan Bajaringan"
        }
    });

    const { 
        loading: loadingSummary, 
        data: dataSummary, 
        refetch: refetchSummary
    } = useQuery(getSummaryHollow);

    const { 
        loading: loadingLaporan, 
        data: dataLaporan, 
        refetch: refetchLaporan 
    } = useQuery(getLaporanMasterHollow,{
        variables: {
            page: page,
            limit: limit,
            orderBy: orderBy,
            karyawan: parseInt(karyawan),
            bulan: selectedDateAwal,
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
        setDataDetail(laporan)
        setVisible(true);
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
    }else if(dataLaporan.getLaporanMasterHollow.count){
      var jml = Math.ceil(dataLaporan.getLaporanMasterHollow.count / limit);
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
    }else if(dataLaporan.getLaporanMasterHollow.rows.length === 0){
        dataKu.push(<p key={0} className="badgeStatusNonText">Tidak ada Laporan Karyawan</p>)
    }else if(dataLaporan.getLaporanMasterHollow.rows.length > 0){
        console.log(dataLaporan.getLaporanMasterHollow.rows)
        dataKu.push(
            <TableContainer component={Paper} key={0}>
                <Table className="tableKu" aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Nama Karyawan</TableCell>
                            <TableCell align="center">Tanggal Laporan</TableCell>
                            <TableCell align="center">Ukuran</TableCell>
                            <TableCell align="center">Ketebalan</TableCell>
                            <TableCell align="center">Jumlah</TableCell>
                            <TableCell align="center">BS</TableCell>
                            <TableCell align="center">Status</TableCell>
                            <TableCell align="center">Banding</TableCell>
                            <TableCell align="center">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            dataLaporan.getLaporanMasterHollow.rows.map((laporan,index) =>(
                                <TableRow key={index}>
                                    <TableCell align="center">{laporan.hLaporanHollow.karyawan.nama}</TableCell>
                                    <TableCell align="center">{laporan.createdAt}</TableCell>
                                    <TableCell align="center">{laporan.ukuran}</TableCell>
                                    <TableCell align="center">{laporan.ketebalan}</TableCell>
                                    <TableCell align="center">{laporan.jumlah}</TableCell>
                                    <TableCell align="center">{laporan.BS}</TableCell>
                                    <TableCell align="center">{laporan.status === 1? 
                                        <div className="badgeStatusWaiting">Menunggu Verifikasi</div>:
                                            laporan.status === 2? 
                                            <div className="badgeStatusAktif">Terverifikasi</div>:
                                            <div className="badgeStatusNon">Proses Banding</div>}
                                    </TableCell>
                                    <TableCell align="center">{laporan.pernahBanding === true? 
                                        <div className="badgeStatusNon">Pernah Banding</div>:
                                            <div className="badgeStatusAktif">Aman</div>}
                                    </TableCell>
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

    let dataKaryawanKu = [];
    if(!dataKaryawan || loadingKaryawan){

    }else if(dataKaryawan.getListKaryawanLaporan.length === 0){

    }else if(dataKaryawan.getListKaryawanLaporan.length > 0){
        dataKaryawanKu.push(dataKaryawan.getListKaryawanLaporan.map((element, index) => (
            <option key={index} value={element.id} >{element.nama}</option>
        )))
    }
    
    
    useEffect(() => {
        if (window.performance) {
            if (performance.navigation.type == 1) {
                refetchKaryawan()
                refetchLaporan()
                refetchSummary()
                console.log('Refreshed!');
            }
        }
    }, []) 

    return (
        <Container className="containerKu">
            <Row className="bg-white justify-content-center">
                <Col><h1 className="text-center">Master Laporan Hollow</h1></Col>
            </Row>
            <Row>
                <Col className="col-md-4">
                    <Form.Group as={Col}>
                        <Form.Label>Karyawan: </Form.Label>
                        <Form.Control 
                            as="select" 
                            value={karyawan} 
                            onChange={e => 
                                setKaryawan(e.target.value)
                            }
                        >
                            <option value="">Semuanya</option>
                            {dataKaryawanKu}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group as={Col}>
                        <Form.Label>Status Laporan: </Form.Label>
                        <Form.Control 
                            as="select" 
                            value={status} 
                            onChange={e => 
                                setStatus(e.target.value)
                            }
                        >
                            <option value="0">Semuanya</option>
                            <option value="1">Menunggu Verifikasi</option>
                            <option value="2">Terverifikasi</option>
                            <option value="3">Proses Banding</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group as={Col}>
                        <Form.Label>Status Banding: </Form.Label>
                        <Form.Control 
                            as="select" 
                            value={banding} 
                            onChange={e => 
                                setBanding(e.target.value)
                            }
                        >
                            <option value="0">Semuanya</option>
                            <option value="1">Pernah Banding</option>
                            <option value="2">Tidak Pernah Banding</option>
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
                    <Button variant="info" onClick={() => setVisibleSummary(true)}>Lihat Summary</Button>
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
            <Modal show={visible} onHide={() => setVisible(false)}>
                <Modal.Header closeButton>
                    <Modal.Title className="judul">Detail Laporan</Modal.Title>
                </Modal.Header>
                    <Modal.Body>
                        <div className="parent">
                            <p className="childLeft">Nama Pelapor</p>
                                <p className="childRight">: {dataDetail.hLaporanHollow?.karyawan.nama}</p>
                            <p className="childLeft">Nama Ketua</p>
                                <p className="childRight">: {dataDetail.hLaporanHollow?.ketua.nama}</p>
                            <p className="childLeft">Tanggal Laporan</p>
                                <p className="childRight">: {dayjs(dataDetail.createdAt).format('DD-MM-YYYY HH:mm:ss')}</p>
                            <p className="childLeft">Ukuran</p>
                                <p className="childRight">: {dataDetail.ukuran}</p>
                            <p className="childLeft">Ketebalan</p>
                                <p className="childRight">: {dataDetail.ketebalan}</p>
                            <p className="childLeft">Berat</p>
                                <p className="childRight">: {dataDetail.berat}</p>
                            <p className="childLeft">Nomor Coil</p>
                                <p className="childRight">: {dataDetail.noCoil}</p>
                            <p className="childLeft">Jumlah</p>
                                <p className="childRight">: {dataDetail.jumlah}</p>
                            <p className="childLeft">BS</p>
                                <p className="childRight">: {dataDetail.BS}</p>
                            <p className="childLeft">Keterangan</p>
                                <p className="childRight">: {dataDetail.keterangan}</p>
                            {
                                dataDetail.pernahBanding === false? 
                                    null:
                                    <>
                                        <p className="childLeft">Keterangan Banding</p>
                                            <p className="childRight">: {dataDetail.keteranganBanding}</p>
                                    </>
                            }
                        </div>
                        <div className="tagPInRow">
                            <p className="tagPTextLeft">Status: 
                                {
                                    dataDetail.status === 1? 
                                    <div className="badgeStatusWaiting">Menunggu Verifikasi</div>:
                                    dataDetail.status === 2? 
                                        <div className="badgeStatusAktif">Terverifikasi</div>:
                                            <div className="badgeStatusNon">Proses Banding</div>
                                }
                            </p>
                            <p className="tagPTextLeft">Status Banding:
                                {dataDetail.pernahBanding === true? 
                                    <div className="badgeStatusNon">Pernah Banding</div>:
                                        <div className="badgeStatusAktif">Aman</div>}
                            </p>
                        </div>
                        <p className="subJudul">Dokumentasi: </p>
                        <CImage src={!dataDetail.foto ? "/default.png": dataDetail.foto} alt="" id="img" className="img imageCenter" width="250" height="200"/>
                    </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={() => setVisible(false)}>
                        Tutup
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={visibleSummary} onHide={() => setVisibleSummary(false)}>
                <Modal.Header closeButton>
                    <Modal.Title className="judul">Summary</Modal.Title>
                </Modal.Header>
                    <Modal.Body>
                        <Table className="tableKu" aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">Nama Pelapor</TableCell>
                                    <TableCell align="center">Jumlah Produksi</TableCell>
                                    <TableCell align="center">Jumlah BS</TableCell>
                                    <TableCell align="center">Jumlah Banding</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    dataSummary?.getSummaryHollow.map((laporan,index) =>(
                                        <TableRow key={index}>
                                            {console.log(laporan)}
                                            <TableCell align="center">{laporan.karyawan.nama}</TableCell>
                                            <TableCell align="center">{laporan.jumlahProduksi}</TableCell>
                                            <TableCell align="center">{laporan.jumlahBS}</TableCell>
                                            <TableCell align="center">{laporan.jumlahBanding}</TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={() => setVisibleSummary(false)}>
                        Tutup
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )
}
