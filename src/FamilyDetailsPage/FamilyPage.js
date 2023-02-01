
import { Grid, Typography, Snackbar, Alert, Backdrop, CircularProgress, TextField, Button, Autocomplete } from '@mui/material';
import { Fragment, useState, useEffect } from 'react';
import ajax from '../ajaxHelper';
import { SERVICE_BASE_URL } from '../config';
import LoginContext from '../LoginAuthProvider/LoginContext';
import { useContext } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import MemberPage from './MemberPage';

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
    "statusOfHouse": 0,
    "typeOfHouse": 0,
    "wetLandInAcres": "",
    "dryLandInAcres": "",
    "motorVechicles": "",
    "oneWheeler": 0,
    "twoWheeler": 0,
    "threeWheeler": 0,
    "fourWheeler": 0,
    "noOfOtherVechicles": 0,
    "otherVechiclesDetails": "",
    "livestockDetails": "",
    "hen": 0,
    "cow": 0,
    "pig": 0,
    "buffalo": 0,
    "goat": 0,
    "noOtherLivestock": 0,
    "otherLivestockDetails": "",
    "toiletFacilityAtHome": "",
    "createdBy": 0,
    "deletedBy": 0,
    "updatedBy": 0
}

const FamilyPage = ({ famId }) => {

    const loginContext = useContext(LoginContext);
    const [famData, setFamData] = useState(defaultFamilyDetails)
    const [areaData, setAreaData] = useState([])
    const [familyArea, setFamilyArea] = useState({});
    const [areaLabel, setAreaLabel] = useState({});
    const [areaFilter, setAreaFilter] = useState(defaultAreaFilter);
    // const [areaFilteredData, setAreaFilteredData] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isMemberView, setIsMemberView] = useState(false);
    const [memberData, setMemberData] = useState({})

    const [typeOfHouseData, setTypeOfHouseData] = useState([]);

    const [statusOfHouseData, setStatusOfHouseData] = useState([]);

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
                // console.log(res.data);
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
        if (famId === 0) {
            famData.createdBy = loginContext.userId
        }
        ajax
            .post(`${SERVICE_BASE_URL}/saveFamily`, famData, { config })
            .then((res) => {
                // console.log(res.data)
                getFamily(res.data);
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
        setIsLoading(true);
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

    const getTypeOfHouseDetails = (id) => {
        const config = {};
        setIsLoading(true);
        ajax
            .get(`${SERVICE_BASE_URL}/getTypeOfHouseDetails`, { config })
            .then((res) => {
                setIsLoading(false);
                setTypeOfHouseData(res.data);
                // console.log(res.data)
                // genAreaLables(res.data);
            })
            .catch((e) => {
                setIsLoading(false);
                setisError(true);
                seterrorMessage(e.response.data.message);
                console.log(e)
            }
            );
    }

    const getStatusOfHouseDetails = (id) => {
        const config = {};
        setIsLoading(true);
        ajax
            .get(`${SERVICE_BASE_URL}/getStatusOfHouseDetails`, { config })
            .then((res) => {
                setIsLoading(false);
                setStatusOfHouseData(res.data)
                // console.log(res.data)
                // genAreaLables(res.data);
            })
            .catch((e) => {
                setIsLoading(false);
                setisError(true);
                seterrorMessage(e.response.data.message);
                console.log(e)
            }
            );
    }

    const deleteMember = (familyId, id, userId) => {
        const config = {};
        ajax
            .post(`${SERVICE_BASE_URL}/deleteMember`, { familyId, id, userId }, { config })
            .then((res) => {
                getFamily(famData.id)
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

        if (streetData.length === 1) {
            setFamilyArea(streetData[0])
            const temp = { ...famData }
            temp.areaDetails = streetData[0].id;
            setFamData(temp);
        }
    }

    const filterAreaFunction = (key, data) => {
        let temp = []
        if (areaFilter[key] !== '') {
            for (let i = 0; i < data.length; i++) {
                if (data[i][key] === areaFilter[key]) {
                    temp.push(data[i]);
                }
            }
        } else {
            temp = [...data]
        }
        // setFamilyArea(areaFilter)
        return temp;
    }

    const onFamMemberClick = (row) => {
        setIsMemberView(true);
        setMemberData(row);
    }

    const addNewMember = () => {
        setIsMemberView(true);
        const newMemberData = {
            "familyIdRef": famData.familyId,
            "memberName": "",
            "gender": 0,
            "createdBy": loginContext.userId,
            "aadharNumber": "",
            "mobileNumber": "",
            "email": "",
            "physicallyChallenged": "",
            "physicallyChallengedDetails": "",
            "occupation": "",
            "smartphone": "",
            "govtInsurance": "",
            "privateInsurance": "",
            "oldAgePension": "",
            "widowedPension": "",
            "retiredPerson": "",
            "vaccination": "",
            "doseOne": null,
            "doseTwo": null,
            "birthDate": null,
            "smoking": "",
            "drinking": "",
            "tobacco": "",
            "diabetes": "",
            "bp": "",
            "osteoporosis": "",
            "breastCancer":"",
            "uterusCancer":"",
            "oralCancer":"",
            "obesity":"",
            "heartDiseases":"",
            "lungRelatedDiseases":"",
            "asthma":"",
            "jointPain":"",
            "otherDiseases":"",
            "community":"",
            "caste":"",
            "relationship": 0,
            "maritalStatus": 0,
            "bloodGroup": 0,
            "educationQualification": 0,
            "annualIncome": 0
        }
        setMemberData(newMemberData);
    }

    const closeMemberPage = () => {
        setIsMemberView(false);
        if (famId !== 0) {
            getFamily(famId);
        }
    }

    const onChangeLabel = (data, key, idKey) => {
        const temp = { ...famData }
        temp[key] = data;
        temp[idKey] = data.id;
        setFamData(temp);
    }

    useEffect(() => {
        setIsLoading(true);
        getAreaDetails();
        getTypeOfHouseDetails();
        getStatusOfHouseDetails();
        if (famId !== 0) {
            getFamily(famId);
        }
    }, [])

    useEffect(() => {
        if (areaLabel.panchayat !== undefined) {
            const temp = { ...familyArea };
            if (areaLabel.panchayat.length === 1) {
                temp.panchayat = areaLabel.panchayat[0];
            } else {
                temp.panchayat = undefined;
            }
            if (areaLabel.areaCode.length === 1) {
                temp.areaCode = areaLabel.areaCode[0];
            } else {
                temp.areaCode = undefined;
            }
            if (areaLabel.villageName.length === 1) {
                temp.villageName = areaLabel.villageName[0];
            } else {
                temp.villageName = undefined;
            }
            if (areaLabel.streetName.length === 1) {
                temp.streetName = areaLabel.streetName[0];
            } else {
                temp.streetName = undefined;
            }
            setFamilyArea(temp);
        }
    }, [JSON.stringify(areaLabel)])

    return (
        <Fragment>
            {!isMemberView &&
                <Fragment >

                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography>Family Details</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container spacing={2}>
                                <Grid item xs={3} style={{ minWidth: 200 }}>
                                    <TextField value={famData.respondentName + ''}
                                        onChange={(e) => changeFamilyDetails(e.target.value, 'respondentName')}
                                        id="standard-basic" label="Respondent Name" variant="standard" />
                                </Grid>
                                <Grid item xs={3} style={{ minWidth: 200 }}>
                                    <TextField value={famData.familyId + ''}
                                        onChange={(e) => changeFamilyDetails(e.target.value, 'familyId')}
                                        id="standard-basic" label="Family Id" variant="standard" />
                                </Grid>
                                <Grid item xs={3} style={{ minWidth: 200 }}>
                                    <TextField value={famData.memberDetail === undefined ? '' : (famData.memberDetail.length + '')}
                                        id="standard-basic" label="Number of members" variant="standard" />
                                </Grid>
                                <Grid item xs={3} style={{ minWidth: 200 }}>
                                    <TextField value={famData.mobileNumber + ''}
                                        onChange={(e) => changeFamilyDetails(e.target.value, 'mobileNumber')}
                                        id="standard-basic" label="Mobile No" variant="standard" />
                                </Grid>
                                <Grid item xs={3} style={{ minWidth: 200 }}>
                                    <TextField value={famData.doorNo + ''}
                                        onChange={(e) => changeFamilyDetails(e.target.value, 'doorNo')}
                                        id="standard-basic" label="Door No" variant="standard" />
                                </Grid>
                            </Grid>

                            <Grid container spacing={2} >
                                <Grid item xs={3} style={{ minWidth: 200 }}>
                                    <Autocomplete
                                        id="combo-box-demo"
                                        options={areaLabel.panchayat}
                                        onChange={(event, newValue) => {
                                            onChangeAutoCompleteArea(newValue, 'panchayat')
                                        }}
                                        value={familyArea.panchayat === undefined ? null : (familyArea.panchayat + '')}
                                        renderInput={(params) => <TextField {...params} variant="standard" label="Panchayat" />}
                                    />
                                </Grid>
                                <Grid item xs={3} style={{ minWidth: 200 }}>
                                    <Autocomplete
                                        id="combo-box-demo"
                                        options={areaLabel.areaCode}
                                        onChange={(event, newValue) => {
                                            onChangeAutoCompleteArea(newValue, 'areaCode')
                                        }}
                                        value={familyArea.areaCode === undefined ? null : (familyArea.areaCode + '')}
                                        renderInput={(params) => <TextField {...params} variant="standard" label="Area Code" />}
                                    />
                                </Grid>
                                <Grid item xs={3} style={{ minWidth: 200 }}>
                                    <Autocomplete
                                        id="combo-box-demo"
                                        options={areaLabel.villageName}
                                        onChange={(event, newValue) => {
                                            onChangeAutoCompleteArea(newValue, 'villageName')

                                        }}
                                        value={familyArea.villageName === undefined ? null : (familyArea.villageName + '')}
                                        renderInput={(params) => <TextField {...params} variant="standard" label="Village Name" />}
                                    />
                                </Grid>
                                <Grid item xs={3} style={{ minWidth: 200 }}>
                                    <Autocomplete
                                        id="combo-box-demo"
                                        options={areaLabel.streetName}
                                        onChange={(event, newValue) => {
                                            onChangeAutoCompleteArea(newValue, 'streetName')
                                        }}
                                        value={familyArea.streetName === undefined ? null : (familyArea.streetName + '')}
                                        renderInput={(params) => <TextField {...params} variant="standard" label="Street Name" />}
                                    />
                                </Grid>
                            </Grid>

                            <Button
                                style={{ marginTop: 20, marginLeft: 20 }}
                                variant="contained"
                                onClick={() => saveFamDetails()}
                            >
                                Save
                            </Button>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel2a-content"
                            id="panel2a-header"
                        >
                            <Typography>Property Details</Typography>
                        </AccordionSummary>
                        <AccordionDetails>

                            <Grid container >
                                <Grid item xs={4} style={{ minWidth: 200 }}>
                                    <Typography>
                                        Toilet Facility At Home
                                    </Typography>
                                    <ToggleButtonGroup
                                        color="primary"
                                        value={(famData.toiletFacilityAtHome === null || famData.toiletFacilityAtHome === "") ? 'N/A' : famData.toiletFacilityAtHome}
                                        exclusive
                                        onChange={(e) => changeFamilyDetails(e.target.value, 'toiletFacilityAtHome')}
                                        aria-label="Platform"
                                    >
                                        <ToggleButton value="N/A">N/A</ToggleButton>
                                        <ToggleButton value="Y">Y</ToggleButton>
                                        <ToggleButton value="N">N</ToggleButton>
                                    </ToggleButtonGroup>
                                </Grid>
                                <Grid item xs={4} style={{ minWidth: 200 }}>
                                    <Autocomplete
                                        id="combo-box-demo"
                                        options={statusOfHouseData.map((e) => {
                                            const temp = { ...e }
                                            temp.label = e.type
                                            return temp
                                        })}
                                        onChange={(event, newValue) => {
                                            onChangeLabel(newValue, 'statusOfHouseDetails', 'statusOfHouse');
                                        }}
                                        value={famData.statusOfHouseDetails === undefined ? null : (famData.statusOfHouseDetails.type + '')}
                                        renderInput={(params) => <TextField {...params} variant="standard" label="Type Of House" />}
                                    />
                                </Grid>
                                <Grid item xs={4} style={{ minWidth: 200 }}>
                                    <Autocomplete
                                        id="combo-box-demo"
                                        options={typeOfHouseData.map((e) => {
                                            const temp = { ...e }
                                            temp.label = e.type
                                            return temp
                                        })}
                                        onChange={(event, newValue) => {
                                            onChangeLabel(newValue, 'typeOfHouseDetails', 'typeOfHouse');
                                        }}
                                        value={famData.typeOfHouseDetails === undefined ? null : (famData.typeOfHouseDetails.type + '')}
                                        renderInput={(params) => <TextField {...params} variant="standard" label="Type Of House" />}
                                    />
                                </Grid>
                            </Grid>

                            <Grid container spacing={2}>
                                <Grid item xs={3} style={{ minWidth: 200 }}>
                                    <TextField value={famData.wetLandInAcres + ''}
                                        onChange={(e) => changeFamilyDetails(e.target.value, 'wetLandInAcres')}
                                        id="standard-basic" label="Wet Land In Acres" variant="standard" />
                                </Grid>
                                <Grid item xs={3} style={{ minWidth: 200 }}>
                                    <TextField value={famData.dryLandInAcres + ''}
                                        onChange={(e) => changeFamilyDetails(e.target.value, 'dryLandInAcres')}
                                        id="standard-basic" label="Dry Land In Acres" variant="standard" />
                                </Grid>
                            </Grid>

                            <Grid container >
                                <Grid item xs={4} style={{ minWidth: 200 }}>
                                    <Typography>
                                        Motor Vechicles
                                    </Typography>
                                    <ToggleButtonGroup
                                        color="primary"
                                        value={(famData.motorVechicles === null || famData.motorVechicles === "") ? 'N/A' : famData.motorVechicles}
                                        exclusive
                                        onChange={(e) => changeFamilyDetails(e.target.value, 'motorVechicles')}
                                        aria-label="Platform"
                                    >
                                        <ToggleButton value="N/A">N/A</ToggleButton>
                                        <ToggleButton value="Y">Y</ToggleButton>
                                        <ToggleButton value="N">N</ToggleButton>
                                    </ToggleButtonGroup>
                                </Grid>
                                <Grid item xs={3} style={{ minWidth: 200 }}>
                                    <TextField value={famData.oneWheeler + ''}
                                        onChange={(e) => changeFamilyDetails(e.target.value, 'oneWheeler')}
                                        id="standard-basic" label="One Wheeler" variant="standard" />
                                </Grid>
                                <Grid item xs={3} style={{ minWidth: 200 }}>
                                    <TextField value={famData.twoWheeler + ''}
                                        onChange={(e) => changeFamilyDetails(e.target.value, 'twoWheeler')}
                                        id="standard-basic" label="Two Wheeler" variant="standard" />
                                </Grid>
                                <Grid item xs={3} style={{ minWidth: 200 }}>
                                    <TextField value={famData.threeWheeler + ''}
                                        onChange={(e) => changeFamilyDetails(e.target.value, 'threeWheeler')}
                                        id="standard-basic" label="Three Wheeler" variant="standard" />
                                </Grid>
                                <Grid item xs={3} style={{ minWidth: 200 }}>
                                    <TextField value={famData.fourWheeler + ''}
                                        onChange={(e) => changeFamilyDetails(e.target.value, 'fourWheeler')}
                                        id="standard-basic" label="Four Wheeler" variant="standard" />
                                </Grid>
                                <Grid item xs={4} style={{ minWidth: 200 }}>
                                    <Typography>
                                        Other Vechicles
                                    </Typography>
                                    <ToggleButtonGroup
                                        color="primary"
                                        value={(famData.otherVechiclesDetails === null || famData.otherVechiclesDetails === "") ? 'N/A' : famData.otherVechiclesDetails}
                                        exclusive
                                        onChange={(e) => changeFamilyDetails(e.target.value, 'otherVechiclesDetails')}
                                        aria-label="Platform"
                                    >
                                        <ToggleButton value="N/A">N/A</ToggleButton>
                                        <ToggleButton value="Y">Y</ToggleButton>
                                        <ToggleButton value="N">N</ToggleButton>
                                    </ToggleButtonGroup>
                                </Grid>
                                <Grid item xs={3} style={{ minWidth: 200 }}>
                                    <TextField value={famData.noOtherVechicles + ''}
                                        onChange={(e) => changeFamilyDetails(e.target.value, 'noOtherVechicles')}
                                        id="standard-basic" label="No Of Other Vechicles" variant="standard" />
                                </Grid>
                            </Grid>

                            <Grid container >
                                <Grid item xs={4} style={{ minWidth: 200 }}>
                                    <Typography>
                                        Livestock Details
                                    </Typography>
                                    <ToggleButtonGroup
                                        color="primary"
                                        value={(famData.livestockDetails === null || famData.livestockDetails === "") ? 'N/A' : famData.livestockDetails}
                                        exclusive
                                        onChange={(e) => changeFamilyDetails(e.target.value, 'livestockDetails')}
                                        aria-label="Platform"
                                    >
                                        <ToggleButton value="N/A">N/A</ToggleButton>
                                        <ToggleButton value="Y">Y</ToggleButton>
                                        <ToggleButton value="N">N</ToggleButton>
                                    </ToggleButtonGroup>
                                </Grid>
                                <Grid item xs={3} style={{ minWidth: 200 }}>
                                    <TextField value={famData.hen + ''}
                                        onChange={(e) => changeFamilyDetails(e.target.value, 'hen')}
                                        id="standard-basic" label="Hen" variant="standard" />
                                </Grid>
                                <Grid item xs={3} style={{ minWidth: 200 }}>
                                    <TextField value={famData.cow + ''}
                                        onChange={(e) => changeFamilyDetails(e.target.value, 'cow')}
                                        id="standard-basic" label="Cow" variant="standard" />
                                </Grid>
                                <Grid item xs={3} style={{ minWidth: 200 }}>
                                    <TextField value={famData.pig + ''}
                                        onChange={(e) => changeFamilyDetails(e.target.value, 'pig')}
                                        id="standard-basic" label="Pig" variant="standard" />
                                </Grid>
                                <Grid item xs={3} style={{ minWidth: 200 }}>
                                    <TextField value={famData.buffalo + ''}
                                        onChange={(e) => changeFamilyDetails(e.target.value, 'buffalo')}
                                        id="standard-basic" label="Buffalo" variant="standard" />
                                </Grid>
                                <Grid item xs={3} style={{ minWidth: 200 }}>
                                    <TextField value={famData.goat + ''}
                                        onChange={(e) => changeFamilyDetails(e.target.value, 'goat')}
                                        id="standard-basic" label="Goat" variant="standard" />
                                </Grid>
                                <Grid item xs={4} style={{ minWidth: 200 }}>
                                    <Typography>
                                        Other Livestock Details
                                    </Typography>
                                    <ToggleButtonGroup
                                        color="primary"
                                        value={(famData.otherLivestockDetails === null || famData.otherLivestockDetails === "") ? 'N/A' : famData.otherLivestockDetails}
                                        exclusive
                                        onChange={(e) => changeFamilyDetails(e.target.value, 'otherLivestockDetails')}
                                        aria-label="Platform"
                                    >
                                        <ToggleButton value="N/A">N/A</ToggleButton>
                                        <ToggleButton value="Y">Y</ToggleButton>
                                        <ToggleButton value="N">N</ToggleButton>
                                    </ToggleButtonGroup>
                                </Grid>
                                <Grid item xs={3} style={{ minWidth: 200 }}>
                                    <TextField value={famData.noOtherLivestock + ''}
                                        onChange={(e) => changeFamilyDetails(e.target.value, 'noOtherLivestock')}
                                        id="standard-basic" label="No Of Other LiveStocks" variant="standard" />
                                </Grid>
                            </Grid>

                            <Button
                                style={{ marginTop: 20, marginLeft: 20 }}
                                variant="contained"
                                onClick={() => saveFamDetails()}
                            >
                                Save
                            </Button>

                        </AccordionDetails>
                    </Accordion>


                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel2a-content"
                            id="panel2a-header"
                        >
                            <Typography>Member Details</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container>
                                {
                                    famData.memberDetail !== undefined && famData.memberDetail.map((row, index) => {
                                        if (row.isDeleted === 'N') {
                                            return <Grid item xs={6} style={{ minWidth: 250, padding: 20 }}>
                                                <Typography onClick={() => onFamMemberClick(row)}>
                                                    {row.memberName}
                                                </Typography>
                                                <Button variant="contained" onClick={() => deleteMember(row.familyIdRef, row.id, loginContext.userId)}>
                                                    delete
                                                </Button>
                                            </Grid>
                                        }
                                    })
                                }
                                <Grid item xs={6} style={{ minWidth: 250, padding: 20 }}>
                                    <Button
                                        style={{ marginTop: 20, marginLeft: 20 }}
                                        variant="contained"
                                        onClick={() => addNewMember()}
                                    >
                                        Add Member
                                    </Button>
                                </Grid>

                            </Grid>
                        </AccordionDetails>
                    </Accordion>



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
            }
            {
                isMemberView &&
                <MemberPage memberDetails={memberData} closePage={closeMemberPage} />
            }
        </Fragment>
    );
}

export default FamilyPage;