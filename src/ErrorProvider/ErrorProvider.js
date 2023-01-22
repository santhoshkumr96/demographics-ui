import { useState , useEffect } from "react";
import PropTypes from 'prop-types';
import ErrorContext from "./ErrorContext";

const ErrorProvider = ({children}) => {
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [isErrorDisplayed, setIsErrorDisplayed] = useState(false);

    return(
        <ErrorContext.Provider value={{error, setError,isErrorDisplayed, setIsErrorDisplayed,message, setMessage}}>
            {children}
        </ErrorContext.Provider>
    );
}

export default ErrorProvider;