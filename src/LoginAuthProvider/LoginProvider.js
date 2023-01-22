import { useState , useEffect } from "react";
import PropTypes from 'prop-types';
import LoginContext from "./LoginContext";

const LoginProvider = ({children}) => {
    const [userId, setUserId] = useState('');
    const [username, setUsername] = useState('');
    const [userRole, setUserRole] = useState([]);


    return(
        <LoginContext.Provider value={{userId,setUserId,username, setUsername,userRole,setUserRole}}>
            {children}
        </LoginContext.Provider>
    );
}

export default LoginProvider;