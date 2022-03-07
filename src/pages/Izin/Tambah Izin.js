import React, {useState, useEffect} from 'react'
import { Row, Col, Form, Button, Alert, Container} from 'react-bootstrap';
import { gql, useQuery, useMutation} from '@apollo/client';
import {ReactNativeFile} from 'apollo-upload-client';
import { CImage } from '@coreui/react';
import DatePicker from 'react-datepicker'

const getIzinMobile = gql`
    query getIzinMobile{
        getIzinMobile{
            id namaIzin totalIzin batasanHari totalPemakaian
        }
    }
`;

const registerPermintaan = gql`
    mutation registerPermintaan(
        $IzinId: Int 
        $tanggalMulai: MyDate
        $tanggalBerakhir: MyDate
        $keterangan: String
        $file: Upload
    ) {
        registerPermintaan(
        IzinId: $IzinId
        tanggalMulai: $tanggalMulai
        tanggalBerakhir: $tanggalBerakhir
        keterangan: $keterangan
        file: $file
    ) {
        id
        jenis
    }
    }
`;
export default function TambahIzin(props) {
    const [listIzin, setListIzin] = useState([]);
    const [selectedValue, setSelectedValue] = useState("0");
    const [selectedDateStart, setSelectedDateStart] = useState(new Date());
    const [selectedDateEnd, setSelectedDateEnd] = useState(new Date());
    const [keterangan, setKeterangan] = useState("");
    const [imageURI, setImageURI] = useState(null);
    const [image, setImage] = useState(null);
    const [file, setFile] = useState(null);
    const [errors, setErrors] = useState({})
    const [success, setSuccess] = useState({})
    
    const { loading, data, refetch } = useQuery(getIzinMobile);

    useEffect(() => {
      if(!data || loading){

      }else if(data.getIzinMobile !== null){
        console.log(data.getIzinMobile)
        setListIzin(data.getIzinMobile);
      }
    }, [data])

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

    const [registerPermintaanku] = useMutation(registerPermintaan,{
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
                Sukses: `Suksess Ajukan Permintaan`,
            })
        }
    })
    const register = e =>{
        e.preventDefault();
        registerPermintaanku({variables:{
            IzinId: parseInt(selectedValue),
            tanggalMulai: selectedDateStart,
            tanggalBerakhir: selectedValue === 'Lembur' ? selectedDateStart: selectedDateEnd,
            keterangan: keterangan,
            file: file,
        }
        });
    }

    const handleFileChange = e =>{
        const file = e.target.files[0]
        if(!file) return
        console.log(file.type);
        if(!file.type.toString().includes("image")) alert("Tipe file hanya boleh gambar saja");
        else{
            setFile(e.target.files[0]);
            const reader = new FileReader();
            reader.onload = () =>{
                if(reader.readyState === 2){
                    setImageURI(reader.result);
                }
            }
            reader.readAsDataURL(e.target.files[0])
        }
    }
    return (
        <Container className="containerKu">
            <Row className="bg-white justify-content-center">
                <Col><h1 className="text-center">Permintaan Izin</h1></Col>
            </Row>
            <Row className="bg-white py-5 justify-content-md-center">
                <Col xs lg="4">
                    <Form onSubmit={register}>
                        {showError}
                        {showUser}
                        <Form.Group as={Col}>
                        <Form.Label>Pilih Izin:</Form.Label>
                            <Form.Control 
                                as="select" 
                                value={selectedValue}
                                onChange={e => 
                                    setSelectedValue(e.target.value)
                            }>
                                <option value="0">Jenis Izin</option>
                                {
                                    listIzin.map(element => (
                                        element.batasanHari === true? 
                                        <option key={element.id} value={element.id}>{element.namaIzin + ": " + element.totalIzin + " Hari"}</option>
                                        :
                                        <option key={element.id} value={element.id}>{element.namaIzin}</option>
                                    ))
                                }
                            </Form.Control>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Tanggal Mulai:</Form.Label>
                            <DatePicker
                                selected={selectedDateStart}
                                onChange={date => setSelectedDateStart(date)}
                                dateFormat='dd-MM-yyyy'
                                showYearDropdown
                                scrollableMonthYearDropdown
                            />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Tanggal Berakhir:</Form.Label>
                            <DatePicker
                                selected={selectedDateEnd}
                                onChange={date => setSelectedDateEnd(date)}
                                dateFormat='dd-MM-yyyy'
                                showYearDropdown
                                scrollableMonthYearDropdown
                            />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Keterangan:</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                value={keterangan} 
                                onChange={e => 
                                    setKeterangan(e.target.value)
                                }
                            />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <CImage src={!imageURI ? "/defaultImage.png": imageURI} alt="" id="img" className="img" width="250" height="200"/>
                            <input type="file" onChange={handleFileChange} />
                        </Form.Group>
                        <div className='text-center'>
                            <Button variant="primary" type="submit">
                                Tambahkan
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}
