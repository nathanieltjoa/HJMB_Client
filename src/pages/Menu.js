import React,{useState} from 'react'
import {Row, Col, Button} from 'react-bootstrap';
import { Link } from 'react-router-dom';

import Dashboard from './Dashboard';
import Register from './Daftar Karyawan';
import Permintaan from './Permintaan'

import { useAuthDispatch} from '../context/auth';

export default function Menu({history}) {
    const dispatch = useAuthDispatch();
    const[variables, setVariables] = useState({
        onMenu: null
    });
    const logout = () =>{
        dispatch({type: 'LOGOUT'})
        history.push('/')
    }
    return (
        <Row className="bg-white justify-content-around">
            <Col xs={6} md={4}>
                <Button onClick={
                    e => setVariables({...variables, onMenu: null})
                }>Dashboard</Button>
                <Button onClick={
                    e => setVariables({...variables, onMenu: <Register/>})
                }>Register</Button>
                <Button onClick={
                    e => setVariables({...variables, onMenu: <Permintaan/>})
                }>Permintaan</Button>
                <Link>
                    <Button variant="link" onClick={logout}>Logout</Button>
                </Link>
            </Col>
            <Col xs={12} md={8}>
                <div>
                    {variables.onMenu ?? <Dashboard/>}
                </div>
            </Col>
        </Row>
    )
}
