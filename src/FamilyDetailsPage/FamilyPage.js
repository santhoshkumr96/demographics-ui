
import { Grid, Typography, Snackbar, Alert, Backdrop, CircularProgress, TextField, Button, Autocomplete } from '@mui/material';
import { Fragment, useState, useEffect } from 'react';
import ajax from '../ajaxHelper';
import { SERVICE_BASE_URL } from '../config';
import LoginContext from '../LoginAuthProvider/LoginContext';
import { useContext } from 'react';

const defaultAreaFilter = {
    panchayat: '',
    areaCode: '',
    villageName: '',
    streetName: ''
}

const defaultFamilyDetails = {
    "familyId": "",
    "areaDetails": 0,
    "doorNo": "",
    "respondentName": "",
    "mobileNumber": "",
    "createdBy":""
}

const FamilyPage = ({famId}) => {

    const loginContext = useContext(LoginContext);
    const [famData, setFamData] = useState(defaultFamilyDetails)
    const [areaData, setAreaData] = useState([])
    const [familyArea, setFamilyArea] = useState({});
    const [areaLabel, setAreaLabel] = useState({});
    const [areaFilter, setAreaFilter] = useState(defaultAreaFilter);
    // const [areaFilteredData, setAreaFilteredData] = useState([]);
    const [inputValue, setInputValue] = useState('');

    //default page handlers
    const [isError, setisError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, seterrorMessage] = useState('');
    const handleClose = () => {
        setisError(false);
        setIsLoading(false);
    };

    const getFamily = (id) => {
        const config = {};
        ajax
            .post(`${SERVICE_BASE_URL}/getFamilyDetail?id=` + id, {}, { config })
            .then((res) => {
                setIsLoading(false);
                setFamData(res.data);
                setFamilyArea(res.data.demographicDetail)
            })
            .catch((e) => {
                setIsLoading(false);
                setisError(true);
                seterrorMessage(e.response.data.message);
                console.log(e)
            }
            );
    }

    const saveFamDetails = () => {
        const config = {};
        setIsLoading(true);
        if(famId === 0){
            famData.createdBy = loginContext.userId
        }
        ajax
            .post(`${SERVICE_BASE_URL}/saveFamily`, famData, { config })
            .then((res) => {
                getFamily(famId);
            })
            .catch((e) => {
                setIsLoading(false);
                setisError(true);
                seterrorMessage(e.response.data.message);
                console.log(e)
            }
            );
    }

    const getAreaDetails = (id) => {
        const config = {};
        ajax
            .get(`${SERVICE_BASE_URL}/getAreaDetails`, { config })
            .then((res) => {
                setIsLoading(false);
                setAreaData(res.data);
                // setAreaFilteredData(res.data);
                genAreaLables(res.data);
            })
            .catch((e) => {
                setIsLoading(false);
                setisError(true);
                seterrorMessage(e.response.data.message);
                console.log(e)
            }
            );
    }

    const genAreaLables = (area) => {
        const areaLabels = {
            panchayat: [],
            areaCode: [],
            villageName: [],
            streetName: []
        }
        for (let i = 0; i < area.length; i++) {
            if (areaLabels.panchayat.indexOf(area[i].panchayat) === -1) {
                areaLabels.panchayat.push(area[i].panchayat)
            }
            if (areaLabels.areaCode.indexOf(area[i].areaCode) === -1) {
                areaLabels.areaCode.push(area[i].areaCode)
            }
            if (areaLabels.villageName.indexOf(area[i].villageName) === -1) {
                areaLabels.villageName.push(area[i].villageName)
            }
            if (areaLabels.streetName.indexOf(area[i].streetName) === -1) {
                areaLabels.streetName.push(area[i].streetName)
            }
        }
        setAreaLabel(areaLabels);
    }

    const changeFamilyDetails = (value, key) => {
        const temp = { ...famData };
        temp[key] = value;
        setFamData(temp);
    }

    const onChangeAutoCompleteArea = (value, key) => {
        
        areaFilter[key] = (value === null ? '' : value)

        const panchayatData = filterAreaFunction('panchayat', areaData)
        const areaCodeData = filterAreaFunction('areaCode', panchayatData)
        const villageNameData = filterAreaFunction('villageName', areaCodeData)
        const streetData = filterAreaFunction('streetName', villageNameData)

        // console.log(streetData,areaFilter);

        genAreaLables(streetData);

        if(streetData.length === 1){
            setFamilyArea(streetData[0])
            const temp = {...famData}
            temp.areaDetails = streetData[0].id;
            setFamData(temp);
        } 
    }

    const filterAreaFunction = (key, data) => {
        let temp = []
        if(areaFilter[key] !== ''){
            for (let i = 0; i < data.length; i++) {
                if(data[i][key] === areaFilter[key]){
                    temp.push(data[i]);
                }
            }
        } else { 
            temp = [...data]
        }   
        // setFamilyArea(areaFilter)
        return temp;
    }

    useEffect(() => {
        setIsLoading(true);
        getAreaDetails();
        if(famId !== 0){
            getFamily(famId);
        }
    }, [])

    useEffect(()=>{
        if(areaLabel.panchayat !== undefined){
            const temp = {...familyArea};
            if(areaLabel.panchayat.length === 1){
                temp.panchayat = areaLabel.panchayat[0];
            } else {
                temp.panchayat = undefined;
            }
            if(areaLabel.areaCode.length === 1){
                temp.areaCode = areaLabel.areaCode[0];
            } else {
                temp.areaCode = undefined;
            }
            if(areaLabel.villageName.length === 1){
                temp.villageName = areaLabel.villageName[0];
            } else {
                temp.villageName = undefined;
            }
            if(areaLabel.streetName.length === 1){
                temp.streetName = areaLabel.streetName[0];
            } else {
                temp.streetName = undefined;
            }
            setFamilyArea(temp);
        }
    },[JSON.stringify(areaLabel)])

    return (
        <Fragment >
            
            <Grid style={{padding:20}} container spacing={2}>
                <Grid item xs={3}>
                    <TextField value={famData.respondentName + ''}
                        onChange={(e) => changeFamilyDetails(e.target.value, 'respondentName')}
                        id="standard-basic" label="Respondent Name" variant="standard" />
                </Grid>
                <Grid item xs={3}>
                    <TextField value={famData.familyId + ''}
                        onChange={(e) => changeFamilyDetails(e.target.value, 'familyId')}
                        id="standard-basic" label="Family Id" variant="standard" />
                </Grid>
                <Grid item xs={3}>
                    <TextField value={famData.memberDetail === undefined ? '' : (famData.memberDetail.length + '')}
                        id="standard-basic" label="Number of members" variant="standard" />
                </Grid>
                <Grid item xs={3}>
                    <TextField value={famData.mobileNumber + ''}
                        onChange={(e) => changeFamilyDetails(e.target.value, 'mobileNumber')}
                        id="standard-basic" label="Mobile No" variant="standard" />
                </Grid>
            </Grid>
            {/* <Grid container spacing={2}>
                <Grid item xs={3}>
                    <TextField value={familyArea.panchayat + ''} id="standard-basic" label="Panchayat" variant="standard" />
                </Grid>
                <Grid item xs={3}>
                    <TextField value={familyArea.areaCode + ''} id="standard-basic" label="Area Code" variant="standard" />
                </Grid>
                <Grid item xs={3}>
                    <TextField value={familyArea.villageName + ''} id="standard-basic" label="Village Name" variant="standard" />
                </Grid>
                <Grid item xs={3}>
                    <TextField value={familyArea.streetName + ''} id="standard-basic" label="Street Name" variant="standard" />
                </Grid>
            </Grid> */}


            <Grid container spacing={2} style={{  padding: 30}}>
                <Grid item xs={3}>
                    <Autocomplete
                        id="combo-box-demo"
                        options={areaLabel.panchayat}
                        onChange={(event, newValue) => {
                            onChangeAutoCompleteArea(newValue, 'panchayat')
                        }}
                        value={familyArea.panchayat===undefined?null:(familyArea.panchayat+'')}
                        renderInput={(params) => <TextField {...params} variant="standard" label="Panchayat" />}
                    />
                </Grid>
                <Grid item xs={3}>
                    <Autocomplete 
                        id="combo-box-demo"
                        options={areaLabel.areaCode}
                        onChange={(event, newValue) => {
                            onChangeAutoCompleteArea(newValue, 'areaCode')
                        }}
                        value={familyArea.areaCode===undefined?null:(familyArea.areaCode+'')}
                        renderInput={(params) => <TextField {...params} variant="standard" label="Area Code" />}
                    />
                </Grid>
                <Grid item xs={3}>
                    <Autocomplete
                        id="combo-box-demo"
                        options={areaLabel.villageName}
                        onChange={(event, newValue) => {
                            onChangeAutoCompleteArea(newValue, 'villageName')

                        }}
                        value={familyArea.villageName===undefined?null:(familyArea.villageName+'')}
                        renderInput={(params) => <TextField {...params} variant="standard" label="Village Name" />}
                    />
                </Grid>
                <Grid item xs={3}>
                    <Autocomplete
                        id="combo-box-demo"
                        options={areaLabel.streetName}
                        onChange={(event, newValue) => {
                            onChangeAutoCompleteArea(newValue, 'streetName')
                        }}
                        value={familyArea.streetName===undefined?null:(familyArea.streetName+'')}
                        renderInput={(params) => <TextField {...params} variant="standard" label="Street Name" />}
                    />
                </Grid>
            </Grid>

            {/* <Button
                style={{marginTop : 20}}
                variant="contained"
                onClick={() => resetArea()}
            >
                Reset
            </Button> */}

            <Button
                style={{marginTop : 20, marginLeft: 20}}
                variant="contained"
                onClick={() => saveFamDetails()}
            >
                Save
            </Button>



            {/* <Typography>
                {JSON.stringify(famData)}
            </Typography>
            <Typography>
                {'======= \n ====== \n ==== \n'}
            </Typography>
            <Typography>
                {JSON.stringify(areaData)}
            </Typography> */}
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

export default FamilyPage;