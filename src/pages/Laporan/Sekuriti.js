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
import 'react-datepicker/dist/react-datepicker.css'


const getLaporanMasterSekuriti = gql`
query getLaporanMasterSekuriti(
    $page: Int 
    $limit: Int 
    $orderBy: String 
    $gudang: Int 
    $bulan: MyDate
    $status: Int 
    $banding: Int 
){
    getLaporanMasterSekuriti(
        page: $page
        limit: $limit 
        orderBy: $orderBy
        gudang: $gudang
        bulan: $bulan
        status: $status
        banding: $banding
    ){
        count rows{
            id tanggalLaporan shift gudang{namaGudang} penyerah{nama} ketua{nama} penerima{nama}
        }
  }
}
`;

const getGudang = gql`
query getGudang{
    getGudang{
        id namaGudang
  }
}
`;

export default function Sekuriti(props) {
    let history = useHistory();
    const [id, setId] = useState(-1);
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const [bulan, setBulan] = useState("1");
    const [orderBy, setOrderBy] = useState("");
    const [selectedDateAwal, setSelectedDateAwal] = useState("");
    const [status, setStatus] = useState("0");
    const [banding, setBanding] = useState("0");
    const [gudang, setGudang] = useState("");

    const { 
        loading: loadingGudang, 
        data: dataGudang, 
        refetch: refetchGudang 
    } = useQuery(getGudang);

    const { 
        loading: loadingLaporan, 
        data: dataLaporan, 
        refetch: refetchLaporan 
    } = useQuery(getLaporanMasterSekuriti,{
        variables: {
            page: page,
            limit: limit,
            orderBy: orderBy,
            gudang: parseInt(gudang),
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
            pathname: '/laporan/detail sekuriti',
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
        pageKu.push(<p key={0} className="badgeStatusWaiting">Memuat...</p>)
        {console.log(loadingLaporan)}
    }else if(dataLaporan.getLaporanMasterSekuriti.count){
      var jml = Math.ceil(dataLaporan.getLaporanMasterSekuriti.count / limit);
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
        dataKu.push(<p key={0} className="badgeStatusWaiting">Memuat....</p>)
    }else if(dataLaporan.getLaporanMasterSekuriti.rows.length === 0){
        dataKu.push(<p key={0} className="badgeStatusNonText">Tidak ada Laporan Karyawan</p>)
    }else if(dataLaporan.getLaporanMasterSekuriti.rows.length > 0){
        console.log(dataLaporan.getLaporanMasterSekuriti.rows)
        dataKu.push(
            <div className='tableContainer'>
                <table size='string' className="table" aria-label="simple table">
                    <thead>
                        <tr>
                            <th>Nama Gudang</th>
                            <th>Shift</th>
                            <th>Tanggal Laporan</th>
                            <th>Ketua</th>
                            <th>Penyerah</th>
                            <th>Penerima</th>
                            <th>#</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            dataLaporan.getLaporanMasterSekuriti.rows.map((laporan,index) =>(
                                <tr key={index} >
                                    <td data-label="Gudang">{laporan.gudang.namaGudang}</td>
                                    <td data-label="Shift">{laporan.shift}</td>
                                    <td data-label="Tanggal">{dayjs(laporan.tanggalLaporan).format("DD-MM-YYYY")}</td>
                                    <td data-label="Ketua">{laporan.ketua?.nama}</td>
                                    <td data-label="Penyerah">{laporan.penyerah?.nama}</td>
                                    <td data-label="Penerima">{laporan.penerima?.nama}</td>
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

    let dataGudangKu = [];
    if(!dataGudang || loadingGudang){

    }else if(dataGudang.getGudang.length === 0){

    }else if(dataGudang.getGudang.length > 0){
        dataGudangKu.push(dataGudang.getGudang.map((element, index) => (
            <option key={index} value={element.id} >{element.namaGudang}</option>
        )))
    }
    
    
    useEffect(() => {
        if (window.performance) {
            if (performance.navigation.type == 1) {
                refetchGudang()
                refetchLaporan()
                console.log('Refreshed!');
            }
        }
    }, []) 

    return (
        <Container className="containerKu">
            <Row className="bg-white justify-content-center">
                <Col><h1 className="text-center">Master Laporan Sekuriti</h1></Col>
            </Row>
            <Row>
                <Col className="col-md-4">
                    <Form.Group as={Col}>
                        <Form.Label>Gudang: </Form.Label>
                        <Form.Control 
                            as="select" 
                            value={gudang} 
                            onChange={e => 
                                setGudang(e.target.value)
                            }
                        >
                            <option value="">Semuanya</option>
                            {dataGudangKu}
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
