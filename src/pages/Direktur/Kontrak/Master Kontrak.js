import React, {useState, Fragment, useEffect} from 'react'
import { Row, Col, Form, Button, Alert, Container} from 'react-bootstrap';
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


const getKontrakKaryawan = gql`
query getKontrakKaryawan(
    $page: Int 
    $limit: Int 
    $orderBy: String 
    $karyawan: Int 
    $bulan: MyDate
    $status: Int 
){
    getKontrakKaryawan(
        page: $page
        limit: $limit 
        orderBy: $orderBy
        karyawan: $karyawan
        bulan: $bulan
        status: $status
    ){
        count rows{
            id jenisKontrak totalGaji totalIuran tanggalMulai tanggalBerakhir status karyawan{
                id nama jabatan{
                    tingkatJabatan namaJabatan
                }
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

export default function MasterKontrak(props) {
    let history = useHistory();
    const [id, setId] = useState(-1);
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(5);
    const [divisi, setDivisi] = useState("");
    const [bulan, setBulan] = useState("1");
    const [selectedDateAwal, setSelectedDateAwal] = useState("");
    const [status, setStatus] = useState(-1);
    const [divisiKontrak, setDivisiKontrak] = useState("");
    const [karyawanKontrak, setKaryawanKontrak] = useState("");
    const [orderBy, setOrderBy] = useState("");

    const { loading, data, refetch } = useQuery(getKontrakKaryawan,{
        variables: {
            page: parseInt(page),
            limit: parseInt(limit),
            orderBy: orderBy,
            karyawan: parseInt(karyawanKontrak),
            bulan: dayjs(selectedDateAwal).format('YYYY-MM-DD'),
            status: parseInt(status),
        }
    });

    useEffect(() => {
        refetch() 
    }, [orderBy])

    const changePage = ({ selected }) => {
        setPage(selected)
    }

    const goToDetail = (laporan) => {
        console.log("asd");
        history.push({
            pathname: '/direktur/kontrak/detail kontrak',
            state: { laporan: laporan }
        });
    }

    let dataKu= [];
    let pageKu = [];
    if(data){
        console.log(data);
    }
    if(data === undefined || loading){
        pageKu.push(<p key={0}>Memuat...</p>)
    }else if(data.getKontrakKaryawan.count){
      var jml = Math.ceil(data.getKontrakKaryawan.count / limit);
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
        dataKu.push(<p key={0} className="badgeStatusWaitingText">Memuat....</p>)
    }else if(data.getKontrakKaryawan.rows.length === 0){
        dataKu.push(<p key={0} className="badgeStatusNonText">Tidak ada Kontrak Karyawan</p>)
    }else if(data.getKontrakKaryawan.rows.length > 0){
        dataKu.push(
            <div className='tableContainer'>
                <table size='string' className="table" aria-label="simple table">
                    <thead>
                        <tr>
                            <th>Id Karyawan</th>
                            <th>Nama Karyawan</th>
                            <th>Jenis Kontrak</th>
                            <th>Total Gaji</th>
                            <th>Total Iuran</th>
                            <th>Tanggal Mulai</th>
                            <th>Tanggal Berakhir</th>
                            <th>Status</th>
                            <th>#</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.getKontrakKaryawan.rows.map((laporan,index) =>(
                                <tr key={index} >
                                    <td data-label="Id">{laporan.karyawan.id}</td>
                                    <td data-label="Nama">{laporan.karyawan.nama}</td>
                                    <td data-label="Jenis Kontrak">{laporan.jenisKontrak}</td>
                                    <td data-label="Total Gaji">
                                        <CurrencyFormat displayType={'text'} value={laporan.totalGaji} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp'} />
                                    </td>
                                    <td data-label="Total Iuran">
                                        <CurrencyFormat displayType={'text'} value={laporan.totalIuran} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp'} />
                                    </td>
                                    <td data-label="Tanggal Mulai">{dayjs(laporan.tanggalMulai).format('DD-MM-YYYY')}</td>
                                    {
                                        dayjs(laporan.tanggalBerakhir).diff(new Date(), 'day') < 0? 
                                            <td data-label="Tanggal Berakhir" style={{color: 'grey'}}>
                                                {dayjs(laporan.tanggalBerakhir).format('DD-MM-YYYY')}
                                            </td>:
                                            dayjs(laporan.tanggalBerakhir).diff(new Date(), 'day') < 9? 
                                                <td data-label="Tanggal Berakhir" style={{color: 'red'}}>
                                                    {dayjs(laporan.tanggalBerakhir).format('DD-MM-YYYY')}
                                                </td>:
                                                    <td data-label="Tanggal Berakhir">
                                                        {dayjs(laporan.tanggalBerakhir).format('DD-MM-YYYY')}
                                                    </td>
                                    }
                                    <td data-label="Status">
                                    {
                                            laporan.status === 0? <div className="badgeStatusWaiting">Menunggu Feedback</div>: 
                                                laporan.status === 1? <div className="badgeStatusAktif">Di Setujui</div>:
                                                    laporan.status === 2? <div className="badgeStatusNon">Di Tolak</div>:
                                                        <div className="badgeStatusNon">Di Batalkan</div>
                                    }
                                    </td>
                                    <td data-label="#">
                                        <Button variant="info" onClick={() => goToDetail(laporan)}>
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
            <Row className="bg-white justify-content-center">
                <Col><h1 className="text-center">Master Kontrak Karyawan</h1></Col>
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
                        <option value="0">Menunggu Persetujuan</option>
                        <option value="1">Disetujui</option>
                        <option value="2">Ditolak</option>
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
                            <option value="Kontrak Terdekat">Kontrak Habis Terdekat</option>
                            <option value="Nama Asc">Nama A-Z</option>
                            <option value="Nama Desc">Nama Z-A</option>
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
