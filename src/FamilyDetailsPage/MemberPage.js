import { Typography, Button, Grid, TextField, Snackbar, ToggleButtonGroup, ToggleButton, Alert, CircularProgress, Backdrop } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import ajax from "../ajaxHelper";
import { SERVICE_BASE_URL } from "../config";
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import moment from 'moment'

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
                setMemData(res.data);
                console.log(res.data);
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
                <Grid item xs={3} style={{ minWidth: 150 }}>
                    <TextField value={memData.aadharNumber + ''}
                        onChange={(e) => changeFamilyDetails(e.target.value, 'aadharNumber')}
                        id="standard-basic" label="Aadhaar Number" variant="standard" />
                </Grid>
                <Grid item xs={3} style={{ minWidth: 150 }}>
                    <TextField value={memData.mobileNumber + ''}
                        onChange={(e) => changeFamilyDetails(e.target.value, 'mobileNumber')}
                        id="standard-basic" label="Mobile Number" variant="standard" />
                </Grid>
            </Grid>

            <Grid style={{ padding: 20 }} container spacing={2}>
                <Grid item xs={3} style={{ minWidth: 150 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <MobileDatePicker
                            label="Date Of Birth"
                            inputFormat="DD/MM/YYYY"
                            value={memData.birthDate}
                            onChange={(e) => changeFamilyDetails(e, 'birthDate')}
                            renderInput={(params) => <TextField variant="standard" {...params} />}
                        />

                    </LocalizationProvider>
                </Grid>
                <Grid item xs={3} style={{ minWidth: 150 }}>
                    <TextField value={moment().diff(memData.birthDate, 'years') + ''}
                        id="standard-basic" label="Age" variant="standard" />
                </Grid>
                <Grid item xs={3} style={{ minWidth: 150 }}>
                    <TextField value={memData.email + ''}
                        onChange={(e) => changeFamilyDetails(e.target.value, 'email')}
                        id="standard-basic" label="Email" variant="standard" />
                </Grid>
            </Grid>

            <Grid style={{ padding: 20 }} container spacing={2}>
                <Grid item xs={3} style={{ minWidth: 150 }}>
                    <Typography>
                        Physically Challenged
                    </Typography>
                    <ToggleButtonGroup
                        color="primary"
                        value={(memData.physicallyChallenged === null || memData.physicallyChallenged === "") ? 'N/A' : memData.physicallyChallenged}
                        exclusive
                        onChange={(e) => changeFamilyDetails(e.target.value, 'physicallyChallenged')}
                        aria-label="Platform"
                    >
                        <ToggleButton value="N/A">N/A</ToggleButton>
                        <ToggleButton value="Y">Y</ToggleButton>
                        <ToggleButton value="N">N</ToggleButton>
                    </ToggleButtonGroup>
                </Grid>
                <Grid item xs={3} style={{ minWidth: 150 }}>
                    <TextField value={memData.physicallyChallengedDetails + ''}
                        onChange={(e) => changeFamilyDetails(e.target.value, 'physicallyChallengedDetails')}
                        id="standard-basic" label="Physically Challenged Details" variant="standard" />
                </Grid>
                <Grid item xs={3} style={{ minWidth: 150 }}>
                    <TextField value={memData.occupation + ''}
                        onChange={(e) => changeFamilyDetails(e.target.value, 'occupation')}
                        id="standard-basic" label="Occupation" variant="standard" />
                </Grid>
            </Grid>


            <Grid style={{ padding: 20 }} container spacing={2}>
                <Grid item xs={4} style={{ minWidth: 200 }}>
                    <Typography>
                        Smartphone
                    </Typography>
                    <ToggleButtonGroup
                        color="primary"
                        value={(memData.smartphone === null || memData.smartphone === "") ? 'N/A' : memData.smartphone}
                        exclusive
                        onChange={(e) => changeFamilyDetails(e.target.value, 'smartphone')}
                        aria-label="Platform"
                    >
                        <ToggleButton value="N/A">N/A</ToggleButton>
                        <ToggleButton value="Y">Y</ToggleButton>
                        <ToggleButton value="N">N</ToggleButton>
                    </ToggleButtonGroup>
                </Grid>
                <Grid item xs={4} style={{ minWidth: 200 }}>
                    <Typography>
                        Govt Insurance
                    </Typography>
                    <ToggleButtonGroup
                        color="primary"
                        value={(memData.govtInsurance === null || memData.govtInsurance === "") ? 'N/A' : memData.govtInsurance}
                        exclusive
                        onChange={(e) => changeFamilyDetails(e.target.value, 'govtInsurance')}
                        aria-label="Platform"
                    >
                        <ToggleButton value="N/A">N/A</ToggleButton>
                        <ToggleButton value="Y">Y</ToggleButton>
                        <ToggleButton value="N">N</ToggleButton>
                    </ToggleButtonGroup>
                </Grid>
                <Grid item xs={4} style={{ minWidth: 200 }}>
                    <Typography>
                        Private Insurance
                    </Typography>
                    <ToggleButtonGroup
                        color="primary"
                        value={(memData.privateInsurance === null || memData.privateInsurance === "") ? 'N/A' : memData.privateInsurance}
                        exclusive
                        onChange={(e) => changeFamilyDetails(e.target.value, 'privateInsurance')}
                        aria-label="Platform"
                    >
                        <ToggleButton value="N/A">N/A</ToggleButton>
                        <ToggleButton value="Y">Y</ToggleButton>
                        <ToggleButton value="N">N</ToggleButton>
                    </ToggleButtonGroup>
                </Grid>
            </Grid>

            <Grid style={{ padding: 20 }} container spacing={2}>
                <Grid item xs={4} style={{ minWidth: 200 }}>
                    <Typography>
                        Old Age Pension
                    </Typography>
                    <ToggleButtonGroup
                        color="primary"
                        value={(memData.oldAgePension === null || memData.oldAgePension === "") ? 'N/A' : memData.oldAgePension}
                        exclusive
                        onChange={(e) => changeFamilyDetails(e.target.value, 'oldAgePension')}
                        aria-label="Platform"
                    >
                        <ToggleButton value="N/A">N/A</ToggleButton>
                        <ToggleButton value="Y">Y</ToggleButton>
                        <ToggleButton value="N">N</ToggleButton>
                    </ToggleButtonGroup>
                </Grid>
                <Grid item xs={4} style={{ minWidth: 200 }}>
                    <Typography>
                        Widowed Pension
                    </Typography>
                    <ToggleButtonGroup
                        color="primary"
                        value={(memData.widowedPension === null || memData.widowedPension === "") ? 'N/A' : memData.widowedPension}
                        exclusive
                        onChange={(e) => changeFamilyDetails(e.target.value, 'widowedPension')}
                        aria-label="Platform"
                    >
                        <ToggleButton value="N/A">N/A</ToggleButton>
                        <ToggleButton value="Y">Y</ToggleButton>
                        <ToggleButton value="N">N</ToggleButton>
                    </ToggleButtonGroup>
                </Grid>
                <Grid item xs={4} style={{ minWidth: 200 }}>
                    <Typography>
                        Retired Person
                    </Typography>
                    <ToggleButtonGroup
                        color="primary"
                        value={(memData.retiredPerson === null || memData.retiredPerson === "") ? 'N/A' : memData.retiredPerson}
                        exclusive
                        onChange={(e) => changeFamilyDetails(e.target.value, 'retiredPerson')}
                        aria-label="Platform"
                    >
                        <ToggleButton value="N/A">N/A</ToggleButton>
                        <ToggleButton value="Y">Y</ToggleButton>
                        <ToggleButton value="N">N</ToggleButton>
                    </ToggleButtonGroup>
                </Grid>
            </Grid>


            <Grid style={{ padding: 20 }} container spacing={2}>
                <Grid item xs={4} style={{ minWidth: 200 }}>
                    <Typography>
                        Smoking
                    </Typography>
                    <ToggleButtonGroup
                        color="primary"
                        value={(memData.smoking === null || memData.smoking === "") ? 'N/A' : memData.smoking}
                        exclusive
                        onChange={(e) => changeFamilyDetails(e.target.value, 'smoking')}
                        aria-label="Platform"
                    >
                        <ToggleButton value="N/A">N/A</ToggleButton>
                        <ToggleButton value="Y">Y</ToggleButton>
                        <ToggleButton value="N">N</ToggleButton>
                    </ToggleButtonGroup>
                </Grid>
                <Grid item xs={4} style={{ minWidth: 200 }}>
                    <Typography>
                        Drinking
                    </Typography>
                    <ToggleButtonGroup
                        color="primary"
                        value={(memData.drinking === null || memData.drinking === "") ? 'N/A' : memData.drinking}
                        exclusive
                        onChange={(e) => changeFamilyDetails(e.target.value, 'drinking')}
                        aria-label="Platform"
                    >
                        <ToggleButton value="N/A">N/A</ToggleButton>
                        <ToggleButton value="Y">Y</ToggleButton>
                        <ToggleButton value="N">N</ToggleButton>
                    </ToggleButtonGroup>
                </Grid>
                <Grid item xs={4} style={{ minWidth: 200 }}>
                    <Typography>
                        Tobacco
                    </Typography>
                    <ToggleButtonGroup
                        color="primary"
                        value={(memData.tobacco === null || memData.tobacco === "") ? 'N/A' : memData.tobacco}
                        exclusive
                        onChange={(e) => changeFamilyDetails(e.target.value, 'tobacco')}
                        aria-label="Platform"
                    >
                        <ToggleButton value="N/A">N/A</ToggleButton>
                        <ToggleButton value="Y">Y</ToggleButton>
                        <ToggleButton value="N">N</ToggleButton>
                    </ToggleButtonGroup>
                </Grid>
            </Grid>

            <Grid style={{ padding: 20 }} container spacing={2}>
                <Grid item xs={4} style={{ minWidth: 200 }}>
                    <Typography>
                        Diabetes
                    </Typography>
                    <ToggleButtonGroup
                        color="primary"
                        value={(memData.diabetes === null || memData.diabetes === "") ? 'N/A' : memData.diabetes}
                        exclusive
                        onChange={(e) => changeFamilyDetails(e.target.value, 'diabetes')}
                        aria-label="Platform"
                    >
                        <ToggleButton value="N/A">N/A</ToggleButton>
                        <ToggleButton value="Y">Y</ToggleButton>
                        <ToggleButton value="N">N</ToggleButton>
                    </ToggleButtonGroup>
                </Grid>
                <Grid item xs={4} style={{ minWidth: 200 }}>
                    <Typography>
                        Bp
                    </Typography>
                    <ToggleButtonGroup
                        color="primary"
                        value={(memData.bp === null || memData.bp === "") ? 'N/A' : memData.bp}
                        exclusive
                        onChange={(e) => changeFamilyDetails(e.target.value, 'bp')}
                        aria-label="Platform"
                    >
                        <ToggleButton value="N/A">N/A</ToggleButton>
                        <ToggleButton value="Y">Y</ToggleButton>
                        <ToggleButton value="N">N</ToggleButton>
                    </ToggleButtonGroup>
                </Grid>
                <Grid item xs={4} style={{ minWidth: 200 }}>
                    <Typography>
                        Osteoporosis
                    </Typography>
                    <ToggleButtonGroup
                        color="primary"
                        value={(memData.osteoporosis === null || memData.osteoporosis === "") ? 'N/A' : memData.osteoporosis}
                        exclusive
                        onChange={(e) => changeFamilyDetails(e.target.value, 'osteoporosis')}
                        aria-label="Platform"
                    >
                        <ToggleButton value="N/A">N/A</ToggleButton>
                        <ToggleButton value="Y">Y</ToggleButton>
                        <ToggleButton value="N">N</ToggleButton>
                    </ToggleButtonGroup>
                </Grid>
            </Grid>

            <Grid style={{ padding: 20 }} container spacing={2}>
                <Grid item xs={4} style={{ minWidth: 200 }}>
                    <Typography>
                        Breast Cancer
                    </Typography>
                    <ToggleButtonGroup
                        color="primary"
                        value={(memData.breastCancer === null || memData.breastCancer === "") ? 'N/A' : memData.breastCancer}
                        exclusive
                        onChange={(e) => changeFamilyDetails(e.target.value, 'breastCancer')}
                        aria-label="Platform"
                    >
                        <ToggleButton value="N/A">N/A</ToggleButton>
                        <ToggleButton value="Y">Y</ToggleButton>
                        <ToggleButton value="N">N</ToggleButton>
                    </ToggleButtonGroup>
                </Grid>
                <Grid item xs={4} style={{ minWidth: 200 }}>
                    <Typography>
                        Uterus Cancer
                    </Typography>
                    <ToggleButtonGroup
                        color="primary"
                        value={(memData.uterusCancer === null || memData.uterusCancer === "") ? 'N/A' : memData.uterusCancer}
                        exclusive
                        onChange={(e) => changeFamilyDetails(e.target.value, 'uterusCancer')}
                        aria-label="Platform"
                    >
                        <ToggleButton value="N/A">N/A</ToggleButton>
                        <ToggleButton value="Y">Y</ToggleButton>
                        <ToggleButton value="N">N</ToggleButton>
                    </ToggleButtonGroup>
                </Grid>
                <Grid item xs={4} style={{ minWidth: 200 }}>
                    <Typography>
                        Oral Cancer
                    </Typography>
                    <ToggleButtonGroup
                        color="primary"
                        value={(memData.oralCancer === null || memData.oralCancer === "") ? 'N/A' : memData.oralCancer}
                        exclusive
                        onChange={(e) => changeFamilyDetails(e.target.value, 'oralCancer')}
                        aria-label="Platform"
                    >
                        <ToggleButton value="N/A">N/A</ToggleButton>
                        <ToggleButton value="Y">Y</ToggleButton>
                        <ToggleButton value="N">N</ToggleButton>
                    </ToggleButtonGroup>
                </Grid>
            </Grid>

            <Grid style={{ padding: 20 }} container spacing={2}>
                <Grid item xs={4} style={{ minWidth: 200 }}>
                    <Typography>
                        Obesity
                    </Typography>
                    <ToggleButtonGroup
                        color="primary"
                        value={(memData.obesity === null || memData.obesity === "") ? 'N/A' : memData.obesity}
                        exclusive
                        onChange={(e) => changeFamilyDetails(e.target.value, 'obesity')}
                        aria-label="Platform"
                    >
                        <ToggleButton value="N/A">N/A</ToggleButton>
                        <ToggleButton value="Y">Y</ToggleButton>
                        <ToggleButton value="N">N</ToggleButton>
                    </ToggleButtonGroup>
                </Grid>
                <Grid item xs={4} style={{ minWidth: 200 }}>
                    <Typography>
                        Heart Diseases
                    </Typography>
                    <ToggleButtonGroup
                        color="primary"
                        value={(memData.heartDiseases === null || memData.heartDiseases === "") ? 'N/A' : memData.heartDiseases}
                        exclusive
                        onChange={(e) => changeFamilyDetails(e.target.value, 'heartDiseases')}
                        aria-label="Platform"
                    >
                        <ToggleButton value="N/A">N/A</ToggleButton>
                        <ToggleButton value="Y">Y</ToggleButton>
                        <ToggleButton value="N">N</ToggleButton>
                    </ToggleButtonGroup>
                </Grid>
                <Grid item xs={4} style={{ minWidth: 200 }}>
                    <Typography>
                        Lung Related Diseases
                    </Typography>
                    <ToggleButtonGroup
                        color="primary"
                        value={(memData.lungRelatedDiseases === null || memData.lungRelatedDiseases === "") ? 'N/A' : memData.lungRelatedDiseases}
                        exclusive
                        onChange={(e) => changeFamilyDetails(e.target.value, 'lungRelatedDiseases')}
                        aria-label="Platform"
                    >
                        <ToggleButton value="N/A">N/A</ToggleButton>
                        <ToggleButton value="Y">Y</ToggleButton>
                        <ToggleButton value="N">N</ToggleButton>
                    </ToggleButtonGroup>
                </Grid>
            </Grid>

            <Grid style={{ padding: 20 }} container spacing={2}>
                <Grid item xs={4} style={{ minWidth: 200 }}>
                    <Typography>
                        Asthma
                    </Typography>
                    <ToggleButtonGroup
                        color="primary"
                        value={(memData.asthma === null || memData.asthma === "") ? 'N/A' : memData.asthma}
                        exclusive
                        onChange={(e) => changeFamilyDetails(e.target.value, 'asthma')}
                        aria-label="Platform"
                    >
                        <ToggleButton value="N/A">N/A</ToggleButton>
                        <ToggleButton value="Y">Y</ToggleButton>
                        <ToggleButton value="N">N</ToggleButton>
                    </ToggleButtonGroup>
                </Grid>
                <Grid item xs={4} style={{ minWidth: 200 }}>
                    <Typography>
                        Joint Pain
                    </Typography>
                    <ToggleButtonGroup
                        color="primary"
                        value={(memData.jointPain === null || memData.jointPain === "") ? 'N/A' : memData.jointPain}
                        exclusive
                        onChange={(e) => changeFamilyDetails(e.target.value, 'bp')}
                        aria-label="Platform"
                    >
                        <ToggleButton value="N/A">N/A</ToggleButton>
                        <ToggleButton value="Y">Y</ToggleButton>
                        <ToggleButton value="N">N</ToggleButton>
                    </ToggleButtonGroup>
                </Grid>
                <Grid item xs={4} style={{ minWidth: 200 }}>
                    <TextField value={memData.otherDiseases + ''}
                        onChange={(e) => changeFamilyDetails(e.target.value, 'otherDiseases')}
                        id="standard-basic" label="Other Diseases" variant="standard" />
                </Grid>
            </Grid>


            <Grid style={{ padding: 20 }} container spacing={2}>
                <Grid item xs={4} style={{ minWidth: 200 }}>
                    <Typography>
                        Vaccination
                    </Typography>
                    <ToggleButtonGroup
                        color="primary"
                        value={(memData.vaccination === null || memData.vaccination === "") ? 'N/A' : memData.vaccination}
                        exclusive
                        onChange={(e) => changeFamilyDetails(e.target.value, 'vaccination')}
                        aria-label="Platform"
                    >
                        <ToggleButton value="N/A">N/A</ToggleButton>
                        <ToggleButton value="Y">Y</ToggleButton>
                        <ToggleButton value="N">N</ToggleButton>
                    </ToggleButtonGroup>
                </Grid>
                <Grid item xs={4} style={{ minWidth: 200 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <MobileDatePicker
                            label="Dose One"
                            inputFormat="DD/MM/YYYY"
                            value={memData.doseOne}
                            onChange={(e) => changeFamilyDetails(e, 'doseOne')}
                            renderInput={(params) => <TextField variant="standard" {...params} />}
                        />

                    </LocalizationProvider>
                </Grid>
                <Grid item xs={4} style={{ minWidth: 200 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <MobileDatePicker
                            label="Dose Two"
                            inputFormat="DD/MM/YYYY"
                            value={memData.doseTwo}
                            onChange={(e) => changeFamilyDetails(e, 'doseTwo')}
                            renderInput={(params) => <TextField variant="standard" {...params} />}
                        />

                    </LocalizationProvider>
                </Grid>
            </Grid>

            <Button variant="contained" onClick={() => { saveMemDetails() }}>
                save
            </Button>

            <Button onClick={() => { closeMemberPage() }}>
                back
            </Button>

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

export default MemberPage;