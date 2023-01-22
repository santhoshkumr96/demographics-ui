import { useState , useEffect } from "react";
import PropTypes from 'prop-types';
import LangugageContext from "./LanguageContext";

const LanguageProvider = ({children}) => {
    const [lang, setLang] = useState('eng');
    const [languageJson] = useState()
    return(
        <LangugageContext.Provider value={{lang, setLang}}>
            {children}
        </LangugageContext.Provider>
    );
}

export default LanguageProvider;