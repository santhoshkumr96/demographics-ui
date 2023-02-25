import { Fragment, useState, useContext } from 'react';
import Login from './Login/Login';
import LoginContext from './LoginAuthProvider/LoginContext';
import { useEffect } from 'react';
import AppBarPage from './AppBarPage';
import { Route, Router, Routes } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

const AppNavigator = () => {

    // const userContext = useContext(LoginContext);

    return (
        <Fragment>
            {/* {
                userContext.username == '' &&
                <Login/>
            }
            {
                userContext.username !== '' &&
                <AppBarPage/>
            } */}
            <Routes >
                <Route  path='/login' element={<Login />} />
                <Route  path='/' element={<PrivateRoute />}>
                    <Route  path='/' element={<AppBarPage />} />
                </Route>
            </Routes>
        </Fragment>
    );
}

export default AppNavigator;
