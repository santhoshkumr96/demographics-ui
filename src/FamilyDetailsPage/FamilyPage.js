
import { Grid, Typography, Stack, Snackbar, Container, Modal, Box, Alert, Backdrop, CircularProgress, TextField, Button, IconButton, Autocomplete } from '@mui/material';
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
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import camera from './../camera.js'
import { LocalConvenienceStoreOutlined } from '@mui/icons-material';
import axios, * as others from 'axios';
const defaultAreaFilter = {
    panchayat: '',
    areaCode: '',
    villageName: '',
    streetName: ''
}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 200,
    bgcolor: 'background.paper',
    border: '1px solid #000',
    boxShadow: 24,
    p: 4,
};


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
    "noOtherVechicles": 0,
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

const defaultAreaLabel = {
    panchayat: [],
    areaCode: [],
    villageName: [],
    streetName: []
}

const defaultfamilyArea = {
    panchayat: '',
    areaCode: '',
    villageName: '',
    streetName: ''
}

const FamilyPage = ({ famId }) => {
    const navigate = useNavigate();


    const loginContext = useContext(LoginContext);
    const [famData, setFamData] = useState(defaultFamilyDetails)
    const [areaData, setAreaData] = useState([])
    const [familyArea, setFamilyArea] = useState(defaultfamilyArea);
    const [areaLabel, setAreaLabel] = useState(defaultAreaLabel);
    const [areaFilter, setAreaFilter] = useState(defaultAreaFilter);
    // const [areaFilteredData, setAreaFilteredData] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isMemberView, setIsMemberView] = useState(false);
    const [isMemberViewAccordian, setIsMemberViewAccordian] = useState(famId===0?false:true);
    const [memberData, setMemberData] = useState({})

    const [typeOfHouseData, setTypeOfHouseData] = useState([]);

    const [statusOfHouseData, setStatusOfHouseData] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);
    const [deleteMemberDetails, setDeleteMemberDetails] = useState({});

    //accordian

    const [expanded, setExpanded] = useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

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
        setIsLoading(true);
        ajax
            .post(`${SERVICE_BASE_URL}/getFamilyDetail?id=` + id, {}, { config })
            .then((res) => {
               
                setFamData(res.data);
                // console.log(res.data);
                setFamilyArea(res.data.demographicDetail)
                // console.log(res.data);
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

    const saveFamDetails = () => {
        const config = {};
        setIsLoading(true);
        if (famId === 0) {
            famData.createdBy = loginContext.userId
        }

        famData.updatedBy = loginContext.userId

        ajax
            .post(`${SERVICE_BASE_URL}/saveFamily`, famData, { config })
            .then((res) => {
                // console.log(res.data)
                getFamily(res.data);
                setIsMemberViewAccordian(true);
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
                setAreaData(res.data);
                // setAreaFilteredData(res.data);
                genAreaLables(res.data);
                // setIsLoading(false);
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
               
                setTypeOfHouseData(res.data);
                // console.log(res.data)
                // genAreaLables(res.data);
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

    const getStatusOfHouseDetails = (id) => {
        const config = {};
        setIsLoading(true);
        ajax
            .get(`${SERVICE_BASE_URL}/getStatusOfHouseDetails`, { config })
            .then((res) => {
                
                setStatusOfHouseData(res.data)
                // console.log(res.data)
                // genAreaLables(res.data);
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

    const deleteMember = (deleteConfig) => {
        const config = {};
        ajax
            .post(`${SERVICE_BASE_URL}/deleteMember`, deleteConfig, { config })
            .then((res) => {
                getFamily(famData.id)
                handleCloseModal();
            })
            .catch((e) => {
                setIsLoading(false);
                setisError(true);
                seterrorMessage(e.response.data.message);
                console.log(e)
            }
            );
    }

    const deleteMemberDetailsOnDelete = (familyId, id, userId) => {
        const temp = { familyId, id, userId };
        setDeleteMemberDetails(temp);
        handleOpenModal();
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
            "occupation": 0,
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
            "breastCancer": "",
            "uterusCancer": "",
            "oralCancer": "",
            "obesity": "",
            "heartDiseases": "",
            "lungRelatedDiseases": "",
            "asthma": "",
            "jointPain": "",
            "otherDiseases": "",
            "community": 0,
            "relationship": 0,
            "maritalStatus": 0,
            "bloodGroup": 0,
            "educationQualification": 0,
            "annualIncome": 0,
            "isOsteoporosisScan": "",
            "osteoporosisScanOne": null,
            "osteoporosisScanTwo": null,
            "deceasedDate": null,
            "isDeceased": "",
            "imageLocation": "",
            "uterusCancerScan": null
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

    const saveImage = (row, e) => {
        const config = {
            headers: {
                "content-type": "multipart/form-data"
            }
        };
        let form = new FormData();
        form.append('image', e.target.files['0'], e.target.files['0'].name)
        setIsLoading(true);
        const ajaxUPload = axios.create({
            withCredentials: true,
            crossDomain: true,
            baseURL: `${SERVICE_BASE_URL}`,
            headers: {
                "content-type": "multipart/form-data"
            },
        });
        ajaxUPload
            .post(`${SERVICE_BASE_URL}/upload?memId=` + row.id, form, { config })
            .then((res) => {
                setIsLoading(false);
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

                    <Accordion TransitionProps={{ unmountOnExit: true }} expanded={expanded === 'panel1'} onChange={handleChange('panel1')} style={{ marginTop: 60 }}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography>Family Details</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField value={famData.respondentName + ''}
                                        style={{ width: '100%' }}
                                        onChange={(e) => changeFamilyDetails(e.target.value, 'respondentName')}
                                        id="standard-basic" label="Respondent Name" variant="outlined" />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField value={famData.familyId + ''}
                                        style={{ width: '100%' }}
                                        onChange={(e) => changeFamilyDetails(e.target.value, 'familyId')}
                                        id="standard-basic" label="Family Id" variant="outlined" />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField value={famData.memberDetail === undefined ? '' : (famData.memberDetail.length + '')}
                                        style={{ width: '100%' }}
                                        id="standard-basic" label="Number of members" variant="outlined" />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField value={famData.mobileNumber + ''}
                                        style={{ width: '100%' }}
                                        onChange={(e) => changeFamilyDetails(e.target.value, 'mobileNumber')}
                                        id="standard-basic" label="Mobile No" variant="outlined" />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField value={famData.doorNo + ''}
                                        style={{ width: '100%' }}
                                        onChange={(e) => changeFamilyDetails(e.target.value, 'doorNo')}
                                        id="standard-basic" label="Door No" variant="outlined" />
                                </Grid>
                            </Grid>

                            <Grid container spacing={2} style={{ paddingTop: '15px' }} >
                                <Grid item xs={12}>
                                    <Autocomplete
                                        id="combo-box-demo"
                                        options={areaLabel.panchayat}
                                        onChange={(event, newValue) => {
                                            onChangeAutoCompleteArea(newValue, 'panchayat')
                                        }}
                                        value={familyArea.panchayat === undefined ? null : (familyArea.panchayat + '')}
                                        renderInput={(params) => <TextField {...params} variant="outlined" label="Panchayat" />}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Autocomplete
                                        id="combo-box-demo"
                                        options={areaLabel.areaCode}
                                        onChange={(event, newValue) => {
                                            onChangeAutoCompleteArea(newValue, 'areaCode')
                                        }}
                                        value={familyArea.areaCode === undefined ? null : (familyArea.areaCode + '')}
                                        renderInput={(params) => <TextField {...params} variant="outlined" label="Area Code" />}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Autocomplete
                                        id="combo-box-demo"
                                        options={areaLabel.villageName}
                                        onChange={(event, newValue) => {
                                            onChangeAutoCompleteArea(newValue, 'villageName')

                                        }}
                                        value={familyArea.villageName === undefined ? null : (familyArea.villageName + '')}
                                        renderInput={(params) => <TextField {...params} variant="outlined" label="Village Name" />}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Autocomplete
                                        id="combo-box-demo"
                                        options={areaLabel.streetName}
                                        onChange={(event, newValue) => {
                                            onChangeAutoCompleteArea(newValue, 'streetName')
                                        }}
                                        value={familyArea.streetName === undefined ? null : (familyArea.streetName + '')}
                                        renderInput={(params) => <TextField {...params} variant="outlined" label="Street Name" />}
                                    />
                                </Grid>
                            </Grid>

                            <Grid item xs={12} style={{ paddingTop: '15px' }}>
                                <Button
                                    style={{ width: '100%' }}
                                    variant="contained"
                                    onClick={() => saveFamDetails()}
                                >
                                    Save
                                </Button>
                            </Grid>


                        </AccordionDetails>
                    </Accordion>
                    <Accordion TransitionProps={{ unmountOnExit: true }} expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel2a-content"
                            id="panel2a-header"
                        >
                            <Typography>Property Details</Typography>
                        </AccordionSummary>
                        <AccordionDetails>

                            <Grid container spacing={2} style={{ marginTop: '5px' }}>
                                <Grid container xs={12}>
                                    <Grid item xs={5} style={{ marginLeft: '15px' }}>
                                        <Typography>
                                            Toilet Facility At Home
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <ToggleButtonGroup
                                            style={{ float: 'right' }}
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
                                </Grid>
                                <Grid item xs={12}>
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
                                        renderInput={(params) => <TextField {...params} variant="outlined" label="Status Of House" />}
                                    />
                                </Grid>
                                <Grid item xs={12}>
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
                                        renderInput={(params) => <TextField {...params} variant="outlined" label="Type Of House" />}
                                    />
                                </Grid>
                            </Grid>

                            <Grid container spacing={2} style={{ paddingTop: '15px' }}>
                                <Grid item xs={12}>
                                    <TextField value={famData.wetLandInAcres + ''}
                                        style={{ width: '100%' }}
                                        onChange={(e) => changeFamilyDetails(e.target.value, 'wetLandInAcres')}
                                        id="standard-basic" label="Wet Land In Acres" variant="outlined" />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField value={famData.dryLandInAcres + ''}
                                        style={{ width: '100%' }}
                                        onChange={(e) => changeFamilyDetails(e.target.value, 'dryLandInAcres')}
                                        id="standard-basic" label="Dry Land In Acres" variant="outlined" />
                                </Grid>
                            </Grid>

                            <Grid container spacing={2} style={{ paddingTop: '30px' }}>
                                <Grid container xs={12}>
                                    <Grid item xs={5} style={{ marginLeft: '15px' }}>
                                        <Typography>
                                            Motor Vechicles
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <ToggleButtonGroup
                                            style={{ float: 'right' }}
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
                                </Grid>
                                {
                                    famData.motorVechicles === "Y" &&
                                    <Fragment>
                                        <Grid item xs={12}>
                                            <TextField value={famData.oneWheeler + ''}
                                                style={{ width: '100%' }}
                                                onChange={(e) => changeFamilyDetails(e.target.value, 'oneWheeler')}
                                                id="standard-basic" label="One Wheeler" variant="outlined" />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField value={famData.twoWheeler + ''}
                                                style={{ width: '100%' }}
                                                onChange={(e) => changeFamilyDetails(e.target.value, 'twoWheeler')}
                                                id="standard-basic" label="Two Wheeler" variant="outlined" />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField value={famData.threeWheeler + ''}
                                                style={{ width: '100%' }}
                                                onChange={(e) => changeFamilyDetails(e.target.value, 'threeWheeler')}
                                                id="standard-basic" label="Three Wheeler" variant="outlined" />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField value={famData.fourWheeler + ''}
                                                style={{ width: '100%' }}
                                                onChange={(e) => changeFamilyDetails(e.target.value, 'fourWheeler')}
                                                id="standard-basic" label="Four Wheeler" variant="outlined" />
                                        </Grid>
                                        <Grid container xs={12} style={{ paddingTop: '20px' }}>
                                            <Grid item xs={5} style={{ marginLeft: '15px' }}>
                                                <Typography>
                                                    Other Vechicles
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <ToggleButtonGroup
                                                    style={{ float: 'right' }}
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
                                        </Grid>
                                        {
                                            famData.otherVechiclesDetails === "Y" &&
                                            <Grid item xs={12}>
                                                <TextField value={famData.noOtherVechicles + ''}
                                                    style={{ width: '100%' }}
                                                    onChange={(e) => changeFamilyDetails(e.target.value, 'noOtherVechicles')}
                                                    id="standard-basic" label="No Of Other Vechicles" variant="outlined" />
                                            </Grid>
                                        }
                                    </Fragment>
                                }
                            </Grid>

                            <Grid container spacing={2} style={{ paddingTop: '15px' }}>
                                <Grid container xs={12} style={{ paddingTop: '20px' }}>
                                    <Grid item xs={5} style={{ marginLeft: '15px' }}>
                                        <Typography>
                                            Livestock Details
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <ToggleButtonGroup
                                            style={{ float: 'right' }}
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
                                </Grid>
                                {
                                    famData.livestockDetails === "Y" &&
                                    <Fragment>
                                        <Grid item xs={12}>
                                            <TextField value={famData.hen + ''}
                                                style={{ width: '100%' }}
                                                onChange={(e) => changeFamilyDetails(e.target.value, 'hen')}
                                                id="standard-basic" label="Hen" variant="outlined" />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField value={famData.cow + ''}
                                                style={{ width: '100%' }}
                                                onChange={(e) => changeFamilyDetails(e.target.value, 'cow')}
                                                id="standard-basic" label="Cow" variant="outlined" />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField value={famData.pig + ''}
                                                style={{ width: '100%' }}
                                                onChange={(e) => changeFamilyDetails(e.target.value, 'pig')}
                                                id="standard-basic" label="Pig" variant="outlined" />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField value={famData.buffalo + ''}
                                                style={{ width: '100%' }}
                                                onChange={(e) => changeFamilyDetails(e.target.value, 'buffalo')}
                                                id="standard-basic" label="Buffalo" variant="outlined" />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField value={famData.goat + ''}
                                                style={{ width: '100%' }}
                                                onChange={(e) => changeFamilyDetails(e.target.value, 'goat')}
                                                id="standard-basic" label="Goat" variant="outlined" />
                                        </Grid>
                                        <Grid container xs={12} style={{ paddingTop: '20px' }}>
                                            <Grid item xs={5} style={{ marginLeft: '15px' }}>
                                                <Typography>
                                                    Other Livestock Details
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <ToggleButtonGroup
                                                    style={{ float: 'right' }}
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
                                        </Grid>
                                        {
                                            famData.otherLivestockDetails === "Y" &&
                                            <Grid item xs={12}>
                                                <TextField value={famData.noOtherLivestock + ''}
                                                    style={{ width: '100%' }}
                                                    onChange={(e) => changeFamilyDetails(e.target.value, 'noOtherLivestock')}
                                                    id="standard-basic" label="No Of Other LiveStocks" variant="outlined" />
                                            </Grid>
                                        }
                                    </Fragment>
                                }
                            </Grid>

                            <Grid item xs={12} style={{ paddingTop: '15px' }}>
                                <Button
                                    style={{ width: '100%' }}
                                    variant="contained"
                                    onClick={() => saveFamDetails()}
                                >
                                    Save
                                </Button>
                            </Grid>

                        </AccordionDetails>
                    </Accordion>


                    {
                        isMemberViewAccordian &&
                        <Accordion TransitionProps={{ unmountOnExit: true }} expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel2a-content"
                                id="panel2a-header"
                            >
                                <Typography>Member Details</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container >
                                    {
                                        famData.memberDetail !== undefined && famData.memberDetail.map((row, index) => {
                                            if (row.isDeleted === 'N') {
                                                return <Grid container xs={12} style={{ paddingTop: 20 }}>
                                                    <Grid container xs={8}>
                                                        <Grid item xs={12}>
                                                            <Typography style={{ overflowWrap: 'break-word' }}>
                                                                {row.memberName}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid item xs={1}>
                                                        <IconButton onClick={() => onFamMemberClick(row)} color="primary">
                                                            <EditIcon color="primary" />
                                                        </IconButton>
                                                    </Grid>
                                                    <Grid item xs={1}>
                                                        <Button
                                                            // variant="outlined"
                                                            component="label"
                                                        >
                                                            <CameraAltIcon />
                                                            <input
                                                                type="file"
                                                                hidden
                                                                accept="image/jpeg"
                                                                onChange={(e) => saveImage(row, e)}
                                                            />
                                                        </Button>
                                                    </Grid>

                                                    <Grid item xs={1}>
                                                        <IconButton onClick={() => deleteMemberDetailsOnDelete(row.familyIdRef, row.id, loginContext.userId)} style={{ marginLeft: 20 }} color="primary">
                                                            <DeleteIcon color="error" />
                                                        </IconButton>
                                                    </Grid>
                                                </Grid>
                                            }
                                        })
                                    }

                                    <Grid item xs={12} style={{ margin: '10px' }} >
                                        <Button
                                            style={{ width: '100%' }}
                                            variant="contained"
                                            onClick={() => addNewMember()}>
                                            Add Member
                                        </Button>
                                    </Grid>

                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                    }


                    <Grid item xs={12} style={{ margin: '10px' }} >
                        <Button
                            style={{ width: '100%' }}
                            variant="outlined"
                            onClick={() => navigate(-2)}>
                            back
                        </Button>
                    </Grid>

                    <Modal
                        open={openModal}
                        onClose={handleCloseModal}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                Are you sure you want to delete {deleteMemberDetails.id}
                            </Typography>
                            <Container >
                                <Stack direction="row" spacing={2} style={{ marginTop: 20 }}>
                                    <Button
                                        variant="contained"
                                        onClick={() => deleteMember(deleteMemberDetails)}
                                    >
                                        confirm
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        onClick={() => handleCloseModal()}
                                    >
                                        cancel
                                    </Button>
                                </Stack>
                            </Container>
                        </Box>
                    </Modal>

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
        </Fragment >
    );
}

export default FamilyPage;