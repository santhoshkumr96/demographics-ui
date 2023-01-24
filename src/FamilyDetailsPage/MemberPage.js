import { Typography, Button, Grid, TextField, Snackbar , Alert, CircularProgress, Backdrop } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import ajax from "../ajaxHelper";
import { SERVICE_BASE_URL } from "../config";


const MemberPage = ({ memberDetails, closePage }) => {

    //default page handlers
    const [isError, setisError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, seterrorMessage] = useState('');
    const handleClose = () => {
        setisError(false);
        setIsLoading(false);
    };

    //states
    const [memData, setMemData] = useState(memberDetails);
    const closeMemberPage = () => {
        closePage();
    }

    const changeFamilyDetails = (value, key) => {
        const temp = { ...memData };
        temp[key] = value;
        setMemData(temp);
    }

    const saveMemDetails = () => {
        const config = {};
        setIsLoading(true);
        ajax
            .post(`${SERVICE_BASE_URL}/saveMember`, memData, { config })
            .then((res) => {
                setIsLoading(false);
            })
            .catch((e) => {
                setIsLoading(false);
                setisError(true);
                seterrorMessage(e.response.data.message);
                console.log(e)
            }
            );
    }



    return (
        <Fragment>
            <Grid style={{ padding: 20 }} container spacing={2}>
                <Grid item xs={3} style={{ minWidth: 150 }}>
                    <TextField value={memData.memberName + ''}
                        onChange={(e) => changeFamilyDetails(e.target.value, 'memberName')}
                        id="standard-basic" label="Member Name" variant="standard" />
                </Grid>
            </Grid>
            <Button variant="contained" onClick={() => { saveMemDetails() }}>
                save
            </Button>

            <Button onClick={() => { closeMemberPage() }}>
                back
            </Button>

            <Snackbar  open={isError} autoHideDuration={4000} onClose={handleClose}>
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

export default MemberPage;