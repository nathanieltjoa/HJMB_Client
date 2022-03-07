import React, {useEffect} from 'react'
import { Row, Col, Card, Button, Form, Container, Modal} from 'react-bootstrap';
import { gql, useQuery, useMutation} from '@apollo/client';
import dayjs from 'dayjs'
import ReactPaginate from 'react-paginate';
import { useHistory } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css'
import { useState } from 'react';
const {URL} = require('../../config/config.json')


const getListSuratPeringatanMaster = gql`
query getListSuratPeringatanMaster(
    $page: Int 
    $limit: Int 
    $orderBy: String 
    $idKaryawan: Int 
    $peringatanKe: Int 
    $status: String 
){
    getListSuratPeringatanMaster(
    page: $page
    limit: $limit 
    orderBy: $orderBy
    idKaryawan: $idKaryawan
    peringatanKe: $peringatanKe
    status: $status
  ){
    count rows{
        id karyawan{nama} hrd{nama} peringatanKe keterangan file keteranganBatal diBatalkan createdAt
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


const updateBatalkanSuratPeringatanMaster = gql`
    mutation updateBatalkanSuratPeringatanMaster(
      $id: String
      $status: Int
      $keteranganBatal: String
  ) {
    updateBatalkanSuratPeringatanMaster(
      id: $id
      status: $status
      keteranganBatal: $keteranganBatal
    ){
      id
    }
  }
  `;

export default function DaftarSuratPeringatan(props) {
    let history = useHistory();
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(5);
    const [selectedDateAwal, setSelectedDateAwal] = useState("");
    const [visibleDetail, setVisibleDetail] = useState(false);
    const [status, setStatus] = useState("-1");
    const [peringatanKe, setPeringatanKe] = useState(-1);
    const [divisiKontrak, setDivisiKontrak] = useState("");
    const [karyawanKontrak, setKaryawanKontrak] = useState(-1);
    const [orderBy, setOrderBy] = useState("DESC");
    const [alasan, setAlasan] = useState("");
    const [dataDetail, setDataDetail] = useState([]);
    const { loading, data, refetch } = useQuery(getListSuratPeringatanMaster,{
        variables: {
            page: parseInt(page),
            limit: parseInt(limit),
            orderBy: orderBy,
            idKaryawan: parseInt(karyawanKontrak),
            peringatanKe: parseInt(peringatanKe),
            status: status
        }
    });

    useEffect(() => {
        refetch() 
    }, [orderBy])

    const changePage = ({ selected }) => {
        setPage(selected)
    }

    const UnduhFile = (file, id) => {
        var FileSaver = require('file-saver');
        var fileImage = file;
        fileImage = fileImage.replace("localhost:4000", URL);
        FileSaver.saveAs(fileImage, id+".pdf");
    }

    const goToDetail = (laporan) => {
        setDataDetail(laporan)
        setVisibleDetail(true);
    }
    let pageKu = [];
    if(data === undefined || loading){
        pageKu.push(<p key={0}>Memuat...</p>)
    }else if(data.getListSuratPeringatanMaster.count){
      var jml = Math.ceil(data.getListSuratPeringatanMaster.count / limit);
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
    let dataKu = [];
    let counter = false;
    if(!data || loading){
        dataKu.push(<p className="badgeStatusWaitingText">Memuat...</p>)
    }else if(data.getListSuratPeringatanMaster.rows.length === 0){
        dataKu.push(<p className="badgeStatusNonText">Tidak Ada Surat Peringatan</p>)
    }else if(data.getListSuratPeringatanMaster.rows.length > 0 && !counter){
        dataKu.push(
            <div className='tableContainer'>
                <table size='string' className="table" aria-label="simple table">
                    <thead>
                        <tr>
                            <th>Nama</th>
                            <th>Peringatan</th>
                            <th>Tanggal Terbit</th>
                            <th>Status</th>
                            <th>#</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.getListSuratPeringatanMaster.rows.map((laporan,index) =>(
                                <tr key={index} >
                                    <td data-label="Nama">{laporan.karyawan?.nama}</td>
                                    <td data-label="Peringatan Ke">{laporan.peringatanKe}</td>
                                    <td data-label="Tanggal">{dayjs(laporan.createdAt).format('DD-MM-YYYY HH:mm:ss')}</td>
                                    <td data-label="Status">{
                                        laporan.diBatalkan === 1? 
                                            <div className="badgeStatusWaiting">Menunggu Verifikasi</div>:
                                            laporan.diBatalkan === 2?
                                                <div className="badgeStatusAktif">Diteruskan</div>:
                                                <div className="badgeStatusNon">Dibatalkan</div>
                                    }</td>
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
    
    const [updateStatusPermintaanKu] = useMutation(updateBatalkanSuratPeringatanMaster,{
        update(_,res){
            console.log(res)
        },
        onError: (err) => {
          console.log(err);
        },
        onCompleted(data){
            refetch();
            setAlasan("");
            setDataDetail([]);
            setVisibleDetail(false);
        }
      })

    const actionPermintaan = (id,status) => {
        updateStatusPermintaanKu({variables:{
          id: id,
          status: status,
          keteranganBatal: alasan,
        }
        });
      }

    useEffect(() => {
        if (window.performance) {
            if (performance.navigation.type == 1) {
                refetch()
                console.log('Refreshed!');
            }
        }
    }, [])
    return (
        <Container className="containerKu">
            <Row className="bg-white justify-content-center">
                <Col>
                    <h1 className="text-center">Daftar Surat Peringatan (SP)</h1>
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
                            <option value="-1"></option>
                            {dataKaryawanKontrakKu}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group as={Col}>
                        <Form.Label>Peringatan Ke: </Form.Label>
                        <Form.Control 
                            as="select" 
                            value={peringatanKe} 
                            onChange={e => 
                                setPeringatanKe(e.target.value)
                            }
                        >
                        <option value="-1">Semuanya</option>
                        <option value="1">Pertama</option>
                        <option value="2">Kedua</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group as={Col}>
                        <Form.Label>Status: </Form.Label>
                        <Form.Control 
                            as="select" 
                            value={status} 
                            onChange={e => 
                                setStatus(e.target.value)
                            }
                        >
                        <option value="-1">Semuanya</option>
                        <option value="1">Menunggu Verifikasi</option>
                        <option value="0">Dibatalkan</option>
                        <option value="2">Diteruskan</option>
                        </Form.Control>
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
                            <option value="DESC">SP Terbaru</option>
                            <option value="ASC">SP Terlama</option>
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
            <Modal show={visibleDetail} onHide={() => setVisibleDetail(false)}>
                <Modal.Header closeButton>
                    <Modal.Title className="judul">Detail SP</Modal.Title>
                </Modal.Header>
                    <Modal.Body>
                        <div className="parent">
                            <p className="childLeft">Nama Pembuat</p>
                                <p className="childRight">: {dataDetail.hrd?.nama}</p>
                            <p className="childLeft">Nama Karyawan</p>
                                <p className="childRight">: {dataDetail.karyawan?.nama}</p>
                            <p className="childLeft">Peringatan Ke</p>
                                <p className="childRight">: {dataDetail.peringatanKe}</p>
                            <p className="childLeft">Tanggal Pembuatan SP</p>
                                <p className="childRight">: {dayjs(dataDetail.createdAt).format('DD-MM-YYYY HH:mm:ss')}</p>
                            <p className="childLeft">Keterangan</p>
                                <p className="childRight">: {dataDetail.keterangan}</p>
                            {
                                dataDetail.diBatalkan !== 0? null:
                                <>
                                    <p className="childLeft">Keterangan Batal</p>
                                        <p className="childRight">: {dataDetail.keteranganBatal}</p>
                                </>
                            }
                        </div>
                        <p className="text-center statusKu">Status:
                            {
                                dataDetail.diBatalkan === 1? 
                                    <div className="badgeStatusWaiting">Menunggu Verifikasi</div>:
                                    dataDetail.diBatalkan === 2?
                                        <div className="badgeStatusAktif">Diteruskan</div>:
                                        <div className="badgeStatusNon">Dibatalkan</div>
                            }
                        </p>
                        {
                      dataDetail.diBatalkan !== 1? null:
                        <div>
                            <Form.Label className="childLeft">Alasan Batal: </Form.Label>
                            <Form.Control 
                                as="textarea" 
                                value={alasan} 
                                onChange={e => 
                                    setAlasan(e.target.value)
                                }
                            />
                            <div className="buttonsSideBySide">
                                <Button className="buttonSideBySide" variant="primary" onClick={() => actionPermintaan(dataDetail.id,2)}>
                                    Teruskan
                                </Button>
                                <Button className="buttonSideBySide" variant="danger" onClick={() => actionPermintaan(dataDetail.id,0)}>
                                    Batalkan
                                </Button>
                            </div>
                        </div>
                        }
                    </Modal.Body>
                <Modal.Footer>
                    <Button variant="info" onClick={() => UnduhFile(dataDetail.file, dataDetail.id)}>
                        Unduh
                    </Button>
                    <Button variant="danger" onClick={() => setVisibleDetail(false)}>
                        Tutup
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )
}
