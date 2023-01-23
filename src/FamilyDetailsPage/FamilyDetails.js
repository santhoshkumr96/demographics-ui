import { Alert, Backdrop, Button, CircularProgress, Grid, Snackbar, Typography, Box, Tab, Tabs } from "@mui/material";
import { Fragment, useEffect, useState } from 'react';
import ajax from "../ajaxHelper";
import { SERVICE_BASE_URL } from "../config";
import { TabPanel } from '@mui/lab/TabPanel';
import FamilyPage from "./FamilyPage";
import { ConnectingAirportsOutlined } from "@mui/icons-material";


const FamilyDetails = ({famId}) => {

    const [value, setValue] = useState('1');

    //default page handlers
    const [isError, setisError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, seterrorMessage] = useState('');
    const handleClose = () => {
        setisError(false);
        setIsLoading(false);
    };


    const handleChangeTab = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Fragment>
            {/* <Box sx={{ bgcolor: 'background.paper', marginTop: "50px !important" }}>
            <Tabs value={value} onChange={handleChangeTab} centered>

                <Tab label="Family Details" />
                <Tab label="Member" />
                <Tab label="Property" />
            </Tabs>
            </Box> */}
            <FamilyPage famId={famId}/>
            <Snackbar open={isError} autoHideDuration={4000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    {errorMessage === '' ? 'Please Contact Admin' : errorMessage}
                </Alert>
            </Snackbar>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isLoading}
            // onClick={handleClose}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </Fragment>
    );
}

export default FamilyDetails