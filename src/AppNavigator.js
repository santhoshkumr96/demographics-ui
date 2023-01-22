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
            <Routes>
                <Route exact path='/' element={<PrivateRoute />}>
                    <Route exact path='/' element={<AppBarPage />} />
                </Route>
                <Route exact path='/login' element={<Login />} />
            </Routes>
        </Fragment>
    );
}

export default AppNavigator;
