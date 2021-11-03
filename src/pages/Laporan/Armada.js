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


const getLaporanMasterArmada = gql`
query getLaporanMasterArmada(
    $page: Int 
    $limit: Int 
    $orderBy: String 
    $karyawan: Int 
    $bulan: MyDate
    $status: Int 
    $banding: Int 
){
    getLaporanMasterArmada(
        page: $page
        limit: $limit 
        orderBy: $orderBy
        karyawan: $karyawan
        bulan: $bulan
        status: $status
        banding: $banding
    ){
        count rows{
            id idNota keterangan penerima foto status pengantaran kembali createdAt
            armada{nama} stokist{nama} supir{nama} kernet{nama}
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

const getSummaryArmada = gql`
query getSummaryArmada{
    getSummaryArmada{
        jumlahPengantaran supir{
            nama
        }
  }
}
`;

export default function ProduksiPipa(props) {
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
    const [visibleSummary, setVisibleSummary] = useState(false);

    const { 
        loading: loadingKaryawan, 
        data: dataKaryawan, 
        refetch: refetchKaryawan 
    } = useQuery(getListKaryawanLaporan,{
        variables: {
            divisi: "Armada"
        }
    });

    const { 
        loading: loadingSummary, 
        data: dataSummary, 
        refetch: refetchSummary
    } = useQuery(getSummaryArmada);

    const { 
        loading: loadingLaporan, 
        data: dataLaporan, 
        refetch: refetchLaporan 
    } = useQuery(getLaporanMasterArmada,{
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
        console.log("asd");
        history.push({
            pathname: '/laporan/detail armada',
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
    }else if(dataLaporan.getLaporanMasterArmada.count){
      var jml = Math.ceil(dataLaporan.getLaporanMasterArmada.count / limit);
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
    }else if(dataLaporan.getLaporanMasterArmada.rows.length === 0){
        dataKu.push(<p key={0} className="badgeStatusNonText">Tidak ada Laporan Karyawan</p>)
    }else if(dataLaporan.getLaporanMasterArmada.rows.length > 0){
        console.log(dataLaporan.getLaporanMasterArmada.rows)
        dataKu.push(
            <TableContainer component={Paper} key={0}>
                <Table className="tableKu" aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Nota</TableCell>
                            <TableCell align="center">Tanggal Laporan</TableCell>
                            <TableCell align="center">Nama Armada</TableCell>
                            <TableCell align="center">Nama Stokist</TableCell>
                            <TableCell align="center">Nama Supir</TableCell>
                            <TableCell align="center">Penerima</TableCell>
                            <TableCell align="center">Status</TableCell>
                            <TableCell align="center">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            dataLaporan.getLaporanMasterArmada.rows.map((laporan,index) =>(
                                <TableRow key={index}>
                                    <TableCell align="center">{laporan.idNota}</TableCell>
                                    <TableCell align="center">{laporan.createdAt}</TableCell>
                                    <TableCell align="center">{laporan.armada.nama}</TableCell>
                                    <TableCell align="center">{laporan.stokist?.nama}</TableCell>
                                    <TableCell align="center">{laporan.supir.nama}</TableCell>
                                    <TableCell align="center">{laporan.penerima}</TableCell>
                                    <TableCell align="center">{laporan.status === 1? 
                                        <div className="badgeStatusWaiting">Menunggu Verifikasi</div>:
                                            laporan.status === 2? 
                                            <div className="badgeStatusWaiting">Terverifikasi Stoksit</div>:
                                                laporan.status === 3? 
                                                <div className="badgeStatusWaiting">Pengantaran</div>:
                                                    <div className="badgeStatusAktif">Selesai</div>}
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
                <Col><h1 className="text-center">Master Laporan Armada</h1></Col>
            </Row>
            <Row>
                <Col className="col-md-4">
                    <Form.Group as={Col}>
                        <Form.Label>Supir Yang Mengantar: </Form.Label>
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
                            <option value="2">Terverifikasi Stokist</option>
                            <option value="3">Pengantaran</option>
                            <option value="4">Sudah Selesai</option>
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
            <Modal show={visibleSummary} onHide={() => setVisibleSummary(false)}>
                <Modal.Header closeButton>
                    <Modal.Title className="judul">Summary</Modal.Title>
                </Modal.Header>
                    <Modal.Body>
                        <Table className="tableKu" aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">Nama Pelapor</TableCell>
                                    <TableCell align="center">Jumlah Pengantaran</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    dataSummary?.getSummaryArmada.map((laporan,index) =>(
                                        <TableRow key={index}>
                                            {console.log(laporan)}
                                            <TableCell align="center">{laporan.supir.nama}</TableCell>
                                            <TableCell align="center">{laporan.jumlahPengantaran}</TableCell>
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