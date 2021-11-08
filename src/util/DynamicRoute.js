import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import { useAuthState, useAuthDispatch } from '../context/auth';

export default function DynamicRoute(props){
    const { user } = useAuthState()
    const dispatch = useAuthDispatch();

    if(props.authenticated && !user){
        return <Redirect to="/"/>
    }else if(props.guest && user){
        return <Redirect to="/profil"/>
    }else if(props.logout && user){
        dispatch({type: 'LOGOUT'})
        return <Redirect to="/"/>
    }else{
        return <Route component={props.component} {...props} />
    }
}