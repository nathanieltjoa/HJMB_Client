import React, {useState, Fragment, useEffect} from 'react'
import { Row, Col, Form, Button, Alert, Container, Modal} from 'react-bootstrap';
import { gql, useQuery, useMutation, useLazyQuery} from '@apollo/client';
import dayjs from 'dayjs'
import ReactPaginate from 'react-paginate';
import { useHistory } from 'react-router-dom';
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const {URL} = require('../../config/config.json')


const getLaporanRusak = gql`
query getLaporanRusak(
  $page: Int
  $limit: Int 
  $orderBy: String 
  $bulan: MyDate
){
    getLaporanRusak(
    page: $page 
    limit: $limit
    orderBy: $orderBy
    bulan: $bulan
  ){
    count rows{
      id karyawan{nama} foto keterangan createdAt
    }
  }
}
`;

export default function Rusak(props) {
    let history = useHistory();
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const [orderBy, setOrderBy] = useState("Laporan Terbaru");
    const [selectedDateAwal, setSelectedDateAwal] = useState("");

    const { 
        loading: loadingLaporan, 
        data: dataLaporan, 
        refetch: refetchLaporan 
    } = useQuery(getLaporanRusak,{
        variables: {
            page: page + 1,
            limit: limit,
            bulan: dayjs(selectedDateAwal).format('YYYY-MM-DD'),
            orderBy: orderBy,
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
            pathname: '/laporan/detail pipa rusak',
            state: { laporan: laporan }
        });
    }

    let dataKu= [];
    let pageKu = [];
    if(!dataLaporan || loadingLaporan){
        pageKu.push(<p key={0} className="badgeStatusWaiting">Memuat...</p>)
        {console.log(loadingLaporan)}
    }else if(dataLaporan.getLaporanRusak.count){
      var jml = Math.ceil(dataLaporan.getLaporanRusak.count / limit);
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
    }else if(dataLaporan.getLaporanRusak.rows.length === 0){
        dataKu.push(<p key={0} className="badgeStatusNonText">Tidak ada Laporan Karyawan</p>)
    }else if(dataLaporan.getLaporanRusak.rows.length > 0){
        dataKu.push(
            <div className='tableContainer'>
                <table size='string' className="table" aria-label="simple table">
                    <thead>
                        <tr>
                            <th>Nama Pelapor</th>
                            <th>Tanggal</th>
                            <th>Keterangan</th>
                            <th>#</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            dataLaporan.getLaporanRusak.rows.map((laporan,index) =>(
                                <tr key={index} >
                                    <td data-label="Nama Pelapor">{laporan.karyawan?.nama}</td>
                                    <td data-label="Tanggal">{dayjs(laporan.createdAt).format("DD-MM-YYYY")}</td>
                                    <td data-label="Keterangan">{laporan.keterangan}</td>
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
    
    
    useEffect(() => {
        if (window.performance) {
            if (performance.navigation.type == 1) {
                refetchLaporan()
                console.log('Refreshed!');
            }
        }
    }, [])

    return (
        <Container className="containerKu">
            <Row className="bg-white justify-content-center">
                <Col>
                    <h1 className="text-center">Master Laporan Pipa Rusak</h1>
                </Col>
            </Row>
            <Row>
                <Col className="col-md-4">
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
