import React,{createContext, useReducer, useContext}  from 'react'
import jwtDecode from 'jwt-decode';

const AuthStateContext = createContext()
const AuthDispatchContext = createContext()

const token = localStorage.getItem('token');
var user = null;
if(token){
    const decodedToken = jwtDecode(token);
    const expiredAt = new Date(decodedToken.exp * 1000);
    if(new Date() > expiredAt){
        localStorage.removeItem('token');
    }else{
        user = decodedToken
    }
}else console.log('No Token Found')

const authReducer = (state, action) =>{
    switch(action.type){
        case 'LOGIN':
            localStorage.setItem('divisi', action.payload.userDivisi);
            localStorage.setItem('token', action.payload.token);
            return {
                ...state,
                user: action.payload
            }
        case 'LOGOUT':
            localStorage.removeItem('token');
            return{
                ...state,
                user: null
            }
        default:
            throw new Error(`Unknown action type: ${action.type}`)
    }
}
export const AuthProvider = ({children}) => {
    const [state,dispatch] = useReducer(authReducer, {user})
    return (
        <AuthDispatchContext.Provider value={dispatch}>
            <AuthStateContext.Provider value={state}>
                {children}
            </AuthStateContext.Provider>
        </AuthDispatchContext.Provider>
    )
};
export const useAuthState = () => useContext(AuthStateContext)
export const useAuthDispatch = () => useContext(AuthDispatchContext)