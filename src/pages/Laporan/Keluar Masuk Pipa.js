import React, {useState, Fragment, useEffect} from 'react'
import { Row, Col, Form, Button, Alert, Container, Modal} from 'react-bootstrap';
import { gql, useQuery, useMutation, useLazyQuery} from '@apollo/client';
import dayjs from 'dayjs'
import ReactPaginate from 'react-paginate';
import { useHistory } from 'react-router-dom';
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const {URL} = require('../../config/config.json')


const getLaporanMasukStokistPipa = gql`
query getLaporanMasukStokistPipa(
    $jenisLaporan: String 
    $page: Int 
    $limit: Int 
    $bulan: MyDate
    $orderBy: String 
){
    getLaporanMasukStokistPipa(
        jenisLaporan: $jenisLaporan
        page: $page
        limit: $limit 
        bulan: $bulan
        orderBy: $orderBy
    ){
        count rows{
            terimaLaporan jenisLaporan jumlahLaporan createdAt laporanStokKeluarMasukPipa{
                jenisBarang merkBarang tipeBarang ukuranBarang satuanBarang
            }
        }
  }
}
`;

export default function KeluarMasukPipa(props) {
    let history = useHistory();
    const [jenisLaporan, setJenisLaporan] = useState("0");
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const [orderBy, setOrderBy] = useState("Laporan Terbaru");
    const [selectedDateAwal, setSelectedDateAwal] = useState("");

    const { 
        loading: loadingLaporan, 
        data: dataLaporan, 
        refetch: refetchLaporan 
    } = useQuery(getLaporanMasukStokistPipa,{
        variables: {
            jenisLaporan: jenisLaporan,
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
        console.log(jenisLaporan)
      }, [jenisLaporan])

    useEffect(() => {
        refetchLaporan()
    }, [page])

    const changePage = ({ selected }) => {
        setPage(selected)
    }

    let dataKu= [];
    let pageKu = [];
    if(!dataLaporan || loadingLaporan){
        pageKu.push(<p key={0} className="badgeStatusWaiting">Memuat...</p>)
        {console.log(loadingLaporan)}
    }else if(dataLaporan.getLaporanMasukStokistPipa.count){
      var jml = Math.ceil(dataLaporan.getLaporanMasukStokistPipa.count / limit);
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
    }else if(dataLaporan.getLaporanMasukStokistPipa.rows.length === 0){
        dataKu.push(<p key={0} className="badgeStatusNonText">Tidak ada Laporan Karyawan</p>)
    }else if(dataLaporan.getLaporanMasukStokistPipa.rows.length > 0){
        dataKu.push(
            <div className='tableContainer'>
                <table size='string' className="table" aria-label="simple table">
                    <thead>
                        <tr>
                            <th>Jenis Laporan</th>
                            <th>Tanggal</th>
                            <th>Nama Barang</th>
                            <th>Jumlah Barang</th>
                            <th>Keterangan Laporan</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            dataLaporan.getLaporanMasukStokistPipa.rows.map((laporan,index) =>(
                                <tr key={index} >
                                    <td data-label="Jenis Laporan">{laporan.jenisLaporan}</td>
                                    <td data-label="Jumlah">{dayjs(laporan.createdAt).format("DD-MM-YYYY")}</td>
                                    <td data-label="Nama">{laporan.laporanStokKeluarMasukPipa.merkBarang} {laporan.laporanStokKeluarMasukPipa.tipeBarang} {laporan.laporanStokKeluarMasukPipa.ukuranBarang}</td>
                                    <td data-label="Jumlah">{laporan.jumlahLaporan} {laporan.laporanStokKeluarMasukPipa.satuanBarang}</td>
                                    <td data-label="Keterangan">{laporan.terimaLaporan}</td>
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
                    <h1 className="text-center">Master Laporan Keluar Masuk Pipa</h1>
                </Col>
            </Row>
            <Row>
                <Col className="col-md-4">
                    <Form.Group as={Col}>
                        <Form.Label>Jenis Laporan: </Form.Label>
                        <Form.Control 
                            as="select" 
                            value={jenisLaporan} 
                            onChange={e => 
                                setJenisLaporan(e.target.value)
                            }
                        >
                            <option value="0">Semuanya</option>
                            <option value="keluar">Keluar</option>
                            <option value="masuk">Masuk</option>
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
