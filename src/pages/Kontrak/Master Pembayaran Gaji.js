import React, {useState, Fragment, useEffect} from 'react'
import { Row, Col, Form, Button, Alert, Container, Badge} from 'react-bootstrap';
import { gql, useQuery, useMutation, useLazyQuery} from '@apollo/client';
import dayjs from 'dayjs'
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { useHistory } from 'react-router-dom';
import { CCard, CCardBody, CImage } from '@coreui/react';
import ReactPaginate from 'react-paginate';
import DatePicker from 'react-datepicker'
import CurrencyFormat from 'react-currency-format';

const registerPembayaranGaji = gql`
    mutation registerPembayaranGaji(
        $idKaryawan: Int 
        $jumlahLembur: Int
  ) {
    registerPembayaranGaji(
        idKaryawan: $idKaryawan
        jumlahLembur: $jumlahLembur
    ) {
        id
    }
  }
`;


const getPembayaranGaji = gql`
query getPembayaranGaji(
    $page: Int 
    $limit: Int 
    $orderBy: String 
    $karyawan: Int 
    $bulan: MyDate
    $status: Int 
){
    getPembayaranGaji(
        page: $page
        limit: $limit 
        orderBy: $orderBy
        karyawan: $karyawan
        bulan: $bulan
        status: $status
    ){
        count rows{
            id totalGaji tanggalPembayaran status createdAt karyawan{nama} keuangan{nama} hrd{nama} kontrak{
                karyawan{nama} jenisKontrak tanggalMulai tanggalBerakhir totalGaji totalIuran
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

const getListKaryawanPembayaranGaji = gql`
query getListKaryawanPembayaranGaji(
    $divisi: String 
){
    getListKaryawanPembayaranGaji(
        divisi: $divisi
    ){
        id nama
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
export default function MasterPembayaranGaji(props) {
    let history = useHistory();
    const [id, setId] = useState(-1);
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const [idKaryawan, setIdKaryawan] = useState(0);
    const [lembur, setLembur] = useState(0);
    const [divisi, setDivisi] = useState("");
    const [bulan, setBulan] = useState("1");
    const [orderBy, setOrderBy] = useState("");
    const [selectedDateAwal, setSelectedDateAwal] = useState("");
    const [status, setStatus] = useState(-1);
    const [divisiKontrak, setDivisiKontrak] = useState("");
    const [karyawanKontrak, setKaryawanKontrak] = useState("");
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState({});
    
    let showError
    let showUser
    if(success){
        console.log(success);
        showUser = 
            Object.keys(success).map(i => (
                <Alert variant='success'>
                    {success[i]}
                </Alert>
            ))
    }
    if(errors.length !== undefined){
        showError = 
            <Alert variant='danger'>
                {errors}
            </Alert>
    }

    const [registerPembayaranGajiKu] = useMutation(registerPembayaranGaji,{
        update(_,res){
            console.log(res)
        },
        onError: (err) => {
            console.log(err)
            setErrors(err.graphQLErrors[0].extensions.errors)
            setSuccess({});
        },
        onCompleted(data){
            setErrors({});
            setSuccess({
                Sukses: `Suksess Tambah Slip Pembayaran Gaji`,
            })
            refetch()
        }
    })

    const registerIndex = () =>{
        registerPembayaranGajiKu({variables:{
            idKaryawan: parseInt(idKaryawan),
            jumlahLembur: parseInt(lembur),
        }
        });
    }

    const goToDetail = (laporan) => {
        console.log("asd");
        console.log(laporan)
        history.push({
            pathname: '/kontrak/detail pembayaran gaji',
            state: { laporan: laporan }
        });
    }

    const { loading, data, refetch } = useQuery(getPembayaranGaji,{
        variables:{
            page: parseInt(page),
            limit: parseInt(limit),
            orderBy: orderBy,
            karyawan: parseInt(karyawanKontrak),
            bulan: selectedDateAwal,
            status: parseInt(status),
        }
    });

    const changePage = ({ selected }) => {
        setPage(selected)
    }

    let dataKu= [];
    let pageKu = [];
    let counter = false;
    if(data){
        console.log(data);
    }
    if(data === undefined || loading){

    }else if(data.getPembayaranGaji.count){
      var jml = Math.ceil(data.getPembayaranGaji.count / limit);
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
    if(!data || loading){
        dataKu.push(<p key={0} className="badgeStatusWaiting">Loading....</p>)
    }else if(data.getPembayaranGaji.rows.length === 0){
        console.log(data.getPembayaranGaji.rows.length)
        dataKu.push(<p key={0} className="badgeStatusNonText">Tidak ada Slip Pembayaran Gaji</p>)
    }else if(data.getPembayaranGaji.rows.length > 0 && !counter){
        console.log(data.getPembayaranGaji.rows.length)
        dataKu.push(
            <TableContainer component={Paper} key={0}>
                <Table className="tableKu" aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Nama Karyawan</TableCell>
                            <TableCell align="center">Jenis Kontrak</TableCell>
                            <TableCell align="center">Masa Kontrak</TableCell>
                            <TableCell align="center">Total Gaji</TableCell>
                            <TableCell align="center">Tanggal Pembayaran</TableCell>
                            <TableCell align="center">Status</TableCell>
                            <TableCell align="center">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            data.getPembayaranGaji.rows.map((laporan,index) =>(
                                <TableRow key={index}>
                                    <TableCell component="th" scope="row" align="center">{laporan.kontrak.karyawan?.nama}</TableCell>
                                    <TableCell component="th" scope="row" align="center">{laporan.kontrak.jenisKontrak}</TableCell>
                                    <TableCell component="th" scope="row" align="center">
                                        {
                                            dayjs(laporan.kontrak.tanggalMulai).format("DD-MM-YYYY")
                                        } - {
                                            dayjs(laporan.kontrak.tanggalBerakhir).format("DD-MM-YYYY")
                                        }
                                    </TableCell>
                                    <TableCell component="th" scope="row" align="center">
                                        <CurrencyFormat displayType={'text'} value={laporan.totalGaji} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp'} />
                                    </TableCell>
                                    <TableCell component="th" scope="row" align="center">
                                        {
                                            laporan.tanggalPembayaran.toString() === "Invalid Date"? 
                                                "-": 
                                                dayjs(laporan.tanggalPembayaran).format("DD-MM-YYYY")
                                        }
                                    </TableCell>
                                    <TableCell component="th" scope="row" align="center">
                                        {
                                            laporan.status === 0?
                                                <p key={0} className="badgeStatusWaiting">Menunggu Verifikasi HRD</p>:
                                                laporan.status === 1?
                                                    <p key={0} className="badgeStatusWaiting">Menunggu Pembayaran</p>:
                                                    laporan.status === 2?
                                                    <p key={0} className="badgeStatusAktif">Selesai</p>:
                                                        laporan.status === 3?
                                                        <p key={0} className="badgeStatusNon">Dibatalkan</p>:
                                                        <p key={0} className="badgeStatusWaiting">Menunggu Verifikasi Penerimaan</p>
                                        }
                                    </TableCell>
                                    <TableCell component="th" scope="row" align="center">
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

    useEffect(() => {
        getKaryawanKu({
            variables: {
                divisi: divisi
            }
        })
    }, [divisi])
    
    const [getKaryawanKu,{ 
        loading: loadingKaryawan,
        data: dataKaryawan 
    }] = useLazyQuery(getListKaryawanPembayaranGaji);

    let dataKaryawanKu = [];
    let counterKaryawan = false;
    if(!dataKaryawan || loadingKaryawan){

    }else if(dataKaryawan.getListKaryawanPembayaranGaji.length === 0){
        
    }else if(dataKaryawan.getListKaryawanPembayaranGaji.length > 0 && !counterKaryawan){
        console.log(dataKaryawan.getListKaryawanPembayaranGaji);
        dataKaryawanKu.push(dataKaryawan.getListKaryawanPembayaranGaji.map((karyawan,index) =>(
            <option key={index} value={karyawan.id}>
                {karyawan.nama}
            </option>
        )))
        counterKaryawan = true;
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
        <Fragment>
            <Container className="containerKu">
                <Row className="bg-white justify-content-center">
                    <Col><h1 className="text-center">Master Pembayaran Gaji</h1></Col>
                </Row>
                <Row className="bg-white py-5 justify-content-md-center">
                    <CCard className="col-md-5">
                        <CCardBody className="text-center">
                            <Form >
                                {showError}
                                {showUser}
                                <Form.Group as={Col}>
                                    <Form.Label>Divisi Karyawan</Form.Label>
                                    <Form.Control 
                                        as="select" 
                                        value={divisi} 
                                        onChange={e => 
                                            setDivisi(e.target.value)
                                        }
                                    >
                                        <option value=""></option>
                                        {dataDivisiKu}
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Label>Pilih Karyawan</Form.Label>
                                    <Form.Control 
                                        as="select" 
                                        onChange={e => 
                                            setIdKaryawan(e.target.value)
                                        }
                                    >
                                        <option value=""></option>
                                        {dataKaryawanKu}
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Label>Jumlah Lembur</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        name="nama"
                                        value= {lembur}
                                        style={{width: '20%'}}
                                        onChange={e => 
                                            setLembur(e.target.value)}
                                    />
                                </Form.Group>
                            <div className='text-center'>
                                <Button variant="primary" onClick={() => registerIndex()}>
                                    Generate Slip Gaji
                                </Button>
                            </div>
                            </Form>
                        </CCardBody>
                    </CCard>
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
                            <Form.Label>Status Laporan: </Form.Label>
                            <Form.Control 
                                as="select" 
                                value={status} 
                                onChange={e => 
                                    setStatus(e.target.value)
                                }
                            >
                            <option value="-1">Semuanya</option>
                            <option value="0">Menunggu Verifikasi HRD</option>
                            <option value="1">Menunggu Pembayaran Gaji</option>
                            <option value="2">Selesai</option>
                            <option value="3">Dibatalkan</option>
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
                                <option value="Slip Terbaru">Slip Terbaru</option>
                                <option value="Slip Terlama">Slip Terlama</option>
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
        </Fragment>
    )
}
