
import { Fragment, useContext, useEffect, useState } from "react";
import HomePage from './HomePage/HomePage';
import { AppBar, Box, Button, Container, Stack, Toolbar, Typography } from '@mui/material';
import LoginContext from "./LoginAuthProvider/LoginContext";
import FamilyDetails from "./FamilyDetailsPage/FamilyDetails";
import ajax from "./ajaxHelper";
import { SERVICE_BASE_URL } from "./config";
import "./AppbarStyle.css";
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'


const AppBarPage = () => {

    const loginContext = useContext(LoginContext);

    const logout = () => {
        loginContext.setUsername('');
        const config = {};
        ajax
            .post(`${SERVICE_BASE_URL}/auth/signout`, {}, config)
            .then((res) => {
            })
            .catch((e) => {
            }
            );
    }

    return (
        <Fragment>
            <header className="Navbar">
                <div className="Toolbar">
                    <div className="Logo">
                        {" "}
                        <span role="img" aria-label="logo">
                            <img src={require('./resources/thirumalai.jpg')} width={20}/>
                        </span>{" "}
                    </div>
                    <div className="Title"> TCT Demographics</div>
                    <Button onClick={()=> logout()}>logout</Button>
                </div>
            </header>

            <HomePage /> 
            {/* <FamilyDetails /> */}
        </Fragment>
    );
}

export default AppBarPage;