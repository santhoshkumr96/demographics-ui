import { Typography, Button, Grid, TextField, Autocomplete, Snackbar, ToggleButtonGroup, ToggleButton, Alert, CircularProgress, Backdrop } from "@mui/material";
import { Fragment, useEffect, useState, useContext, useCallback } from "react";
import ajax from "../ajaxHelper";
import { SERVICE_BASE_URL } from "../config";
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import moment from 'moment'
import LoginContext from '../LoginAuthProvider/LoginContext';
import HideImageIcon from '@mui/icons-material/HideImage';

const defaultSterData = [
    {
        "id": 1,
        "type": "Copper T"
    },
    {
        "id": 2,
        "type": "Tablets"
    },
    {
        "id": 3,
        "type": "Others"
    }
]

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
    const loginContext = useContext(LoginContext)
    const [communityData, setCommunityData] = useState([]);
    const [genderData, setGenderData] = useState([]);
    const [releationshipData, setReleationshipData] = useState([]);
    const [annualIncomeData, setAnnualIncomeData] = useState([]);
    const [educationalQualificationData, setEducationalQualificationData] = useState([]);
    const [maritalStatusData, setMaritalStatusData] = useState([]);
    const [bloodGroupData, setBloodGroupData] = useState([]);
    const [occupationData, setOccupationData] = useState([]);
    const [handiCapData, setHandiCapData] = useState([]);
    const [image, setImage] = useState("");
    const [imageLoaded, setImageLoaded] = useState(false);
    const [tempSterlizationData, setTempSterlizationData] = useState(defaultSterData);



    const changeFamilyDetails = (value, key) => {
        const temp = { ...memData };
        temp[key] = value;
        setMemData(temp);
    }

    const saveMemDetails = () => {
        const config = {};
        setIsLoading(true);
        memData.updatedBy = loginContext.userId
        ajax
            .post(`${SERVICE_BASE_URL}/saveMember`, memData, { config })
            .then((res) => {
                setIsLoading(false);
                // console.log(memData)
                // setMemData(res.data);
                // console.log(res.data);
                closeMemberPage();
            })
            .catch((e) => {
                setIsLoading(false);
                setisError(true);
                seterrorMessage(e.response.data.message);
                console.log(e)
            }
            );
    }


    const getDataForDropDown = (uri, functionTosetData) => {
        const config = {};
        setIsLoading(true);
        ajax
            .get(`${SERVICE_BASE_URL}/` + uri, { config })
            .then((res) => {
                setIsLoading(false);
                functionTosetData(res.data);
            })
            .catch((e) => {
                setIsLoading(false);
                setisError(true);
                seterrorMessage(e.response.data.message);
                console.log(e)
            }
            );
    }

    const onChangeLabel = (data, key, idKey) => {
        const temp = { ...memData }
        temp[key] = data;
        temp[idKey] = data.id;
        setMemData(temp);
    }

    const onChangeLabelSterlization = (data, key) => {
        const temp = { ...memData }
        temp[key] = data.type;
        setMemData(temp);
    }


    const getImage = () => {

        return (
            <Grid item xs={12} style={{ paddingRight: 20, textAlign: 'center' }} >
                {
                    !imageLoaded &&
                    <CircularProgress />
                }
                <img
                    style={imageLoaded ? {} : { display: 'none' }}
                    // class="loading" 
                    src={`${SERVICE_BASE_URL}/getImage?memId=` + memData.id}
                    onLoad={() => { setImageLoaded(true) }}
                    onError={() => { setImageLoaded(true) }}
                    alt={'No Photo'}
                    width={'200px'}
                />
            </Grid>
        );
    }

    const getImageInit = () => {
        const config = {};
        setIsLoading(true);
        ajax
            .get(`${SERVICE_BASE_URL}/getImage?memId=` + memData.id, { config })
            .then((res) => {
                console.log(res)
                setImage(res.data)
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
        getDataForDropDown('getGender', setGenderData)
        getDataForDropDown('getRelationship', setReleationshipData)
        getDataForDropDown('getEducationQualification', setEducationalQualificationData)
        getDataForDropDown('getBloodGroup', setBloodGroupData)
        getDataForDropDown('getMaritalStatus', setMaritalStatusData)
        getDataForDropDown('getAnnualIncome', setAnnualIncomeData)
        getDataForDropDown('getCommunity', setCommunityData)
        getDataForDropDown('getOccupation', setOccupationData)
        getDataForDropDown('getHandiCapDetails', setHandiCapData)
        // getImageInit()
    }, [])



    return (
        <Fragment>
            <Grid style={{ marginTop: 70, paddingLeft: 20 }} container spacing={2}>
                {
                    memData.imageLocation !== "" &&
                    getImage()
                }
                <Grid item xs={12} style={{ paddingRight: 20 }} >
                    <TextField style={{ width: '100%' }} value={memData.memberName + ''}
                        onChange={(e) => changeFamilyDetails(e.target.value, 'memberName')}
                        id="standard-basic" label="Member Name" variant="outlined" />
                </Grid>
                <Grid item xs={12} style={{ paddingRight: 20 }} >
                    <TextField style={{ width: '100%' }} value={memData.aadharNumber + ''}
                        onChange={(e) => changeFamilyDetails(e.target.value, 'aadharNumber')}
                        id="standard-basic" label="Aadhaar Number" variant="outlined" />
                </Grid>
                <Grid item xs={12} style={{ paddingRight: 20 }} >
                    <TextField style={{ width: '100%' }} value={memData.mobileNumber + ''}
                        onChange={(e) => changeFamilyDetails(e.target.value, 'mobileNumber')}
                        id="standard-basic" label="Mobile Number" variant="outlined" />
                </Grid>
                <Grid item xs={12} style={{ paddingRight: 20 }} >
                    <TextField style={{ width: '100%' }} value={memData.patientId + ''}
                        onChange={(e) => changeFamilyDetails(e.target.value, 'patientId')}
                        id="standard-basic" label="Member Id" variant="outlined" />
                </Grid>
                <Grid item xs={12} style={{ paddingRight: 20 }} >
                    <TextField style={{ width: '100%' }} value={memData.tmhId + ''}
                        onChange={(e) => changeFamilyDetails(e.target.value, 'tmhId')}
                        id="standard-basic" label="Tmh Id" variant="outlined" />
                </Grid>
            </Grid>

            {/* <Grid style={{ marginTop: 10, paddingLeft: 20 }} container spacing={2}>
                <Grid item xs={12} style={{ paddingRight: 20 }}>
                    <TextField style={{ width: '100%' }} value={memData.community + ''}
                        onChange={(e) => changeFamilyDetails(e.target.value, 'community')}
                        id="standard-basic" label="Community" variant="outlined" />
                </Grid>
                <Grid item xs={12} style={{ paddingRight: 20 }}>
                    <TextField style={{ width: '100%' }} value={memData.caste + ''}
                        onChange={(e) => changeFamilyDetails(e.target.value, 'caste')}
                        id="standard-basic" label="caste" variant="outlined" />
                </Grid>
            </Grid> */}

            <Grid style={{ padding: 20 }} container spacing={2}>
                <Grid item xs={12}>
                    <Autocomplete
                        disabled
                        id="combo-box-demo"
                        options={communityData.map((e) => {
                            const temp = { ...e }
                            temp.label = e.community
                            return temp
                        })}
                        isOptionEqualToValue={useCallback((option, value) => option.community === value)} // added
                        onChange={(event, newValue) => {
                            onChangeLabel(newValue, 'communityDetail', 'community');
                        }}
                        value={memData.communityDetail === undefined ? null : (memData.communityDetail.community + '')}
                        renderInput={(params) => <TextField disabled style={{ width: '100%' }} {...params} variant="outlined" label="Community" />}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Autocomplete
                        id="combo-box-demo"
                        options={communityData.map((e) => {
                            const temp = { ...e }
                            temp.label = e.community + ":" + e.caste
                            return temp
                        })}
                        isOptionEqualToValue={useCallback((option, value) => option.caste === value)} // added
                        onChange={(event, newValue) => {
                            onChangeLabel(newValue, 'communityDetail', 'community');
                        }}
                        value={memData.communityDetail === undefined ? null : (memData.communityDetail.caste + '')}
                        renderInput={(params) => <TextField style={{ width: '100%' }} {...params} variant="outlined" label="Caste" />}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Autocomplete
                        id="combo-box-demo"
                        options={genderData.map((e) => {
                            const temp = { ...e }
                            temp.label = e.type
                            return temp
                        })}
                        isOptionEqualToValue={useCallback((option, value) => option.type === value)} // added

                        onChange={(event, newValue) => {
                            onChangeLabel(newValue, 'genderDetails', 'gender');
                        }}
                        value={memData.genderDetails === undefined ? null : (memData.genderDetails.type + '')}
                        renderInput={(params) => <TextField style={{ width: '100%' }} {...params} variant="outlined" label="Gender" />}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Autocomplete
                        id="combo-box-demo"
                        options={releationshipData.map((e) => {
                            const temp = { ...e }
                            temp.label = e.type
                            return temp
                        })}
                        isOptionEqualToValue={useCallback((option, value) => option.type === value)} // added
                        onChange={(event, newValue) => {
                            onChangeLabel(newValue, 'relationshipDetails', 'relationship');
                        }}
                        value={memData.relationshipDetails === undefined ? null : (memData.relationshipDetails.type + '')}
                        renderInput={(params) => <TextField style={{ width: '100%' }} {...params} variant="outlined" label="Relationship with head" />}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Autocomplete
                        id="combo-box-demo"
                        options={maritalStatusData.map((e) => {
                            const temp = { ...e }
                            temp.label = e.type
                            return temp
                        })}
                        isOptionEqualToValue={useCallback((option, value) => option.type === value)} // added
                        onChange={(event, newValue) => {
                            onChangeLabel(newValue, 'maritalStatusDetails', 'maritalStatus');
                        }}
                        value={memData.maritalStatusDetails === undefined ? null : (memData.maritalStatusDetails.type + '')}
                        renderInput={(params) => <TextField style={{ width: '100%' }} {...params} variant="outlined" label="Marital Status" />}
                    />
                </Grid>
            </Grid>


            <Grid style={{ padding: 20 }} container spacing={2}>
                <Grid item xs={12}>
                    <Autocomplete
                        id="combo-box-demo"
                        options={bloodGroupData.map((e) => {
                            const temp = { ...e }
                            temp.label = e.type
                            return temp
                        })}
                        isOptionEqualToValue={useCallback((option, value) => option.type === value)} // added
                        onChange={(event, newValue) => {
                            onChangeLabel(newValue, 'bloodGroupDetails', 'bloodGroup');
                        }}
                        value={memData.bloodGroupDetails === undefined ? null : (memData.bloodGroupDetails.type + '')}
                        renderInput={(params) => <TextField style={{ width: '100%' }} {...params} variant="outlined" label="Blood Group" />}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Autocomplete
                        id="combo-box-demo"
                        options={educationalQualificationData.map((e) => {
                            const temp = { ...e }
                            temp.label = e.type
                            return temp
                        })}
                        isOptionEqualToValue={useCallback((option, value) => option.type === value)} // added
                        onChange={(event, newValue) => {
                            onChangeLabel(newValue, 'educationQualificationDetails', 'educationQualification');
                        }}
                        value={memData.educationQualificationDetails === undefined ? null : (memData.educationQualificationDetails.type + '')}
                        renderInput={(params) => <TextField style={{ width: '100%' }} {...params} variant="outlined" label="Education Qualification" />}
                    />
                </Grid>
                <Grid item xs={12}  >
                    <TextField style={{ width: '100%' }} value={memData.annualIncomeString + ''}
                        onChange={(e) => changeFamilyDetails(e.target.value, 'annualIncomeString')}
                        id="standard-basic" label="Annual Income" variant="outlined" />
                </Grid>
                <Grid item xs={12}  >
                    <TextField type='number' style={{ width: '100%' }} value={memData.height + ''}
                        onChange={(e) => changeFamilyDetails(e.target.value, 'height')}
                        id="standard-basic" label="Height in cm" variant="outlined" />
                </Grid>
                <Grid item xs={12}  >
                    <TextField type='number' style={{ width: '100%' }} value={memData.weight + ''}
                        onChange={(e) => changeFamilyDetails(e.target.value, 'weight')}
                        id="standard-basic" label="Weight in kg" variant="outlined" />
                </Grid>
                {/* <Grid item xs={12}>
                    <Autocomplete
                        id="combo-box-demo"
                        options={annualIncomeData.map((e) => {
                            const temp = { ...e }
                            temp.label = e.type
                            return temp
                        })}
                        isOptionEqualToValue={useCallback((option, value) => option.type === value)} // added
                        onChange={(event, newValue) => {
                            onChangeLabel(newValue, 'annualIncomeDetails', 'annualIncome');
                        }}
                        value={memData.annualIncomeDetails === undefined ? null : (memData.annualIncomeDetails.type + '')}
                        renderInput={(params) => <TextField style={{ width: '100%' }} {...params} variant="outlined" label="Annual Income" />}
                    />
                </Grid> */}
            </Grid>

            <Grid style={{ padding: 20 }} container spacing={2}>
                <Grid item xs={12}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <MobileDatePicker
                            label="Date Of Birth"
                            inputFormat="DD/MM/YYYY"
                            value={memData.birthDate}
                            onChange={(e) => changeFamilyDetails(e, 'birthDate')}
                            renderInput={(params) => <TextField style={{ width: '100%' }} variant="outlined" {...params} />}
                        />

                    </LocalizationProvider>
                </Grid>
                <Grid item xs={12}>
                    <TextField style={{ width: '100%' }} value={moment().diff(memData.birthDate, 'years') + ''}
                        id="standard-basic" label="Age" variant="outlined" />
                </Grid>
                <Grid item xs={12}>
                    <TextField style={{ width: '100%' }} value={memData.email + ''}
                        onChange={(e) => changeFamilyDetails(e.target.value, 'email')}
                        id="standard-basic" label="Email" variant="outlined" />
                </Grid>
                <Grid item xs={12}>
                    <Autocomplete
                        id="combo-box-demo"
                        options={occupationData.map((e) => {
                            const temp = { ...e }
                            temp.label = e.type
                            return temp
                        })}
                        isOptionEqualToValue={useCallback((option, value) => option.type === value)} // added
                        onChange={(event, newValue) => {
                            onChangeLabel(newValue, 'occupationDetail', 'occupation');
                        }}
                        value={memData.occupationDetail === undefined ? null : (memData.occupationDetail.type + '')}
                        renderInput={(params) => <TextField style={{ width: '100%' }} {...params} variant="outlined" label="Occupation" />}
                    />
                </Grid>
            </Grid>

            {
                memData.tmpSterlization !== "Y" &&
                <Grid style={{ padding: 20 }} container spacing={2}>
                    <Grid container xs={12} style={{ paddingTop: 15 }}>
                        <Grid item xs={5} style={{ marginLeft: '15px' }}>
                            <Typography>
                                Is sterlized permanently ?
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <ToggleButtonGroup
                                color="primary"
                                value={(memData.permanentSterlization === null || memData.permanentSterlization === "") ? 'N/A' : memData.permanentSterlization}
                                exclusive
                                onChange={(e) => changeFamilyDetails(e.target.value, 'permanentSterlization')}
                                aria-label="Platform"
                            >
                                <ToggleButton value="N/A">N/A</ToggleButton>
                                <ToggleButton value="Y">Y</ToggleButton>
                                <ToggleButton value="N">N</ToggleButton>
                            </ToggleButtonGroup>
                        </Grid>
                    </Grid>
                    {
                        memData.permanentSterlization === "Y" &&
                        <Fragment>
                            <Grid item xs={12} style={{ paddingTop: 15 }}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <MobileDatePicker
                                        label="Sterlized Date"
                                        inputFormat="DD/MM/YYYY"
                                        value={memData.permanentSterlizationDate}
                                        onChange={(e) => changeFamilyDetails(e, 'permanentSterlizationDate')}
                                        renderInput={(params) => <TextField style={{ width: '100%' }} variant="outlined" {...params} />}
                                    />

                                </LocalizationProvider>
                            </Grid>
                        </Fragment>
                    }
                </Grid>
            }



            {
                memData.permanentSterlization !== "Y" &&
                <Grid style={{ padding: 20 }} container spacing={2}>
                    <Grid container xs={12} style={{ paddingTop: 15 }}>
                        <Grid item xs={5} style={{ marginLeft: '15px' }}>
                            <Typography>
                                Is sterlized temporarily ?
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <ToggleButtonGroup
                                color="primary"
                                value={(memData.tmpSterlization === null || memData.tmpSterlization === "") ? 'N/A' : memData.tmpSterlization}
                                exclusive
                                onChange={(e) => changeFamilyDetails(e.target.value, 'tmpSterlization')}
                                aria-label="Platform"
                            >
                                <ToggleButton value="N/A">N/A</ToggleButton>
                                <ToggleButton value="Y">Y</ToggleButton>
                                <ToggleButton value="N">N</ToggleButton>
                            </ToggleButtonGroup>
                        </Grid>
                    </Grid>
                    {
                        memData.tmpSterlization === "Y" &&
                        <Fragment>
                            <Grid item xs={12}>
                                <Autocomplete
                                    id="combo-box-demo"
                                    options={tempSterlizationData.map((e) => {
                                        const temp = { ...e }
                                        temp.label = e.type
                                        return temp
                                    })}
                                    // isOptionEqualToValue={useCallback((option, value) => option.type === value)} // added
                                    onChange={(event, newValue) => {
                                        // onChangeLabel(newValue, 'occupationDetail', 'occupation');
                                        onChangeLabelSterlization(newValue, 'tmpSterlizationType');
                                    }}
                                    value={memData.tmpSterlizationType === undefined || memData.tmpSterlizationType === "" ? null : memData.tmpSterlizationType}
                                    renderInput={(params) => <TextField style={{ width: '100%' }} {...params} variant="outlined" label="Temporary Sterilization Type" />}
                                />
                            </Grid>
                        </Fragment>
                    }
                </Grid>
            }


            <Grid style={{ padding: 20 }} container spacing={2}>
                <Grid container xs={12} style={{ paddingTop: 15 }}>
                    <Grid item xs={5} style={{ marginLeft: '15px' }}>
                        <Typography>
                            Is Deceased ?
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <ToggleButtonGroup
                            color="primary"
                            value={(memData.isDeceased === null || memData.isDeceased === "") ? 'N/A' : memData.isDeceased}
                            exclusive
                            onChange={(e) => changeFamilyDetails(e.target.value, 'isDeceased')}
                            aria-label="Platform"
                        >
                            <ToggleButton value="N/A">N/A</ToggleButton>
                            <ToggleButton value="Y">Y</ToggleButton>
                            <ToggleButton value="N">N</ToggleButton>
                        </ToggleButtonGroup>
                    </Grid>
                </Grid>
                {
                    memData.isDeceased === "Y" &&
                    <Fragment>
                        <Grid item xs={12} style={{ paddingTop: 15 }}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <MobileDatePicker
                                    label="Deceased Date"
                                    inputFormat="DD/MM/YYYY"
                                    value={memData.deceasedDate}
                                    onChange={(e) => changeFamilyDetails(e, 'deceasedDate')}
                                    renderInput={(params) => <TextField style={{ width: '100%' }} variant="outlined" {...params} />}
                                />

                            </LocalizationProvider>
                        </Grid>
                    </Fragment>
                }
            </Grid>

            <Grid style={{ padding: 20 }} container spacing={2}>
                <Grid container xs={12}>
                    <Grid item xs={5} style={{ marginLeft: '15px' }}>
                        <Typography>
                            Physically Challenged
                        </Typography>
                    </Grid>

                    <Grid item xs={6}>
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

                </Grid>
                {
                    memData.physicallyChallenged === "Y" &&
                    <Grid item xs={12}>
                        <Autocomplete
                            id="combo-box-demo"
                            options={handiCapData.map((e) => {
                                const temp = { ...e }
                                temp.label = e.type
                                return temp
                            })}
                            isOptionEqualToValue={(option, value) => option.type === value} // added
                            onChange={(event, newValue) => {
                                onChangeLabel(newValue, 'handicapTypeDetail', 'handicapType');
                            }}
                            value={memData.handicapTypeDetail === undefined ? null : (memData.handicapTypeDetail.type + '')}
                            renderInput={(params) => <TextField style={{ width: '100%' }} {...params} variant="outlined" label="Handicap Type" />}
                        />
                    </Grid>
                }
            </Grid>




            <Grid style={{ padding: 20 }} container spacing={2}>
                <Grid container xs={12}>
                    <Grid item xs={5} style={{ marginLeft: '15px' }}>
                        <Typography>
                            Smartphone
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
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
                </Grid>
                <Grid container xs={12} style={{ paddingTop: 15 }}>
                    <Grid item xs={5} style={{ marginLeft: '15px' }}>
                        <Typography>
                            Govt Insurance
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
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
                </Grid>
                <Grid container xs={12} style={{ paddingTop: 15 }}>
                    <Grid item xs={5} style={{ marginLeft: '15px' }}>
                        <Typography>
                            Private Insurance
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
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
            </Grid>

            <Grid style={{ padding: 20 }} container spacing={2}>
                <Grid container xs={12} >
                    <Grid item xs={5} style={{ marginLeft: '15px' }}>
                        <Typography>
                            Old Age Pension
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
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
                </Grid>
                <Grid container xs={12} style={{ paddingTop: 15 }}>
                    <Grid item xs={5} style={{ marginLeft: '15px' }}>
                        <Typography>
                            Widowed Pension
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
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
                </Grid>
                <Grid container xs={12} style={{ paddingTop: 15 }}>
                    <Grid item xs={5} style={{ marginLeft: '15px' }}>
                        <Typography>
                            Retired Person
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
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
            </Grid>


            <Grid style={{ padding: 20 }} container spacing={2}>
                <Grid container xs={12} >
                    <Grid item xs={5} style={{ marginLeft: '15px' }}>
                        <Typography>
                            Smoking
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
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
                </Grid>
                <Grid container xs={12} style={{ paddingTop: 15 }}>
                    <Grid item xs={5} style={{ marginLeft: '15px' }}>
                        <Typography>
                            Drinking
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
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
                </Grid>
                <Grid container xs={12} style={{ paddingTop: 15 }}>
                    <Grid item xs={5} style={{ marginLeft: '15px' }}>
                        <Typography>
                            Tobacco
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
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
            </Grid>

            <Grid style={{ padding: 20 }} container spacing={2}>
                <Grid container xs={12}>
                    <Grid item xs={5} style={{ marginLeft: '15px' }}>
                        <Typography>
                            Diabetes
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
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
                </Grid>

                <Grid container xs={12}>
                    <Grid item xs={5} style={{ marginLeft: '15px', paddingTop: 15 }}>
                        <Typography>
                            Diabetes Package
                        </Typography>
                    </Grid>
                    <Grid item xs={6} style={{ paddingTop: 15 }}>
                        <ToggleButtonGroup
                            color="primary"
                            value={(memData.diabeticPackage === null || memData.diabeticPackage === "") ? 'N/A' : memData.diabeticPackage}
                            exclusive
                            onChange={(e) => changeFamilyDetails(e.target.value, 'diabeticPackage')}
                            aria-label="Platform"
                        >
                            <ToggleButton value="N/A">N/A</ToggleButton>
                            <ToggleButton value="Y">Y</ToggleButton>
                            <ToggleButton value="N">N</ToggleButton>
                        </ToggleButtonGroup>
                    </Grid>
                </Grid>
                {
                    memData.diabeticPackage === "Y" &&
                    <Grid item xs={12}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <MobileDatePicker
                                label="Diabetes Package Enrollement Date"
                                inputFormat="DD/MM/YYYY"
                                value={memData.diabeticEnrolmentDate}
                                onChange={(e) => changeFamilyDetails(e, 'diabeticEnrolmentDate')}
                                renderInput={(params) => <TextField style={{ width: '100%' }} variant="outlined" {...params} />}
                            />

                        </LocalizationProvider>
                    </Grid>
                }
                <Grid container xs={12}>
                    <Grid item xs={5} style={{ marginLeft: '15px', paddingTop: 15 }}>
                        <Typography>
                            Diabetes Enrollement Status
                        </Typography>
                    </Grid>
                    <Grid item xs={6} style={{ paddingTop: 15 }}>
                        <ToggleButtonGroup
                            color="primary"
                            value={(memData.diabeticEnrollmentStatus === null || memData.diabeticEnrollmentStatus === "") ? 'N/A' : memData.diabeticEnrollmentStatus}
                            exclusive
                            onChange={(e) => changeFamilyDetails(e.target.value, 'diabeticEnrollmentStatus')}
                            aria-label="Platform"
                        >
                            <ToggleButton value="N/A">N/A</ToggleButton>
                            <ToggleButton value="Y">Active</ToggleButton>
                            <ToggleButton value="N">Inactive</ToggleButton>
                        </ToggleButtonGroup>
                    </Grid>
                </Grid>
                {
                    memData.diabeticEnrollmentStatus === "N" &&
                    <Grid item xs={12}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <MobileDatePicker
                                label="Diabetes Package Enrollement End Date"
                                inputFormat="DD/MM/YYYY"
                                value={memData.diabeticEnrollmentEndDate}
                                onChange={(e) => changeFamilyDetails(e, 'diabeticEnrollmentEndDate')}
                                renderInput={(params) => <TextField style={{ width: '100%' }} variant="outlined" {...params} />}
                            />

                        </LocalizationProvider>
                    </Grid>

                }
                <Grid container xs={12} style={{ paddingTop: 15 }}>
                    <Grid item xs={5} style={{ marginLeft: '15px' }}>
                        <Typography>
                            Bp
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
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
                </Grid>
                <Grid container xs={12} style={{ paddingTop: 15 }}>
                    <Grid item xs={5} style={{ marginLeft: '15px' }}>
                        <Typography>
                            Osteoporosis
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
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
            </Grid>

            <Grid style={{ padding: 20 }} container spacing={2}>
                <Grid container xs={12}>
                    <Grid item xs={5} style={{ marginLeft: '15px' }}>
                        <Typography>
                            Osteoporosis Scanned ?
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <ToggleButtonGroup
                            color="primary"
                            value={(memData.isOsteoporosisScan === null || memData.isOsteoporosisScan === "") ? 'N/A' : memData.isOsteoporosisScan}
                            exclusive
                            onChange={(e) => changeFamilyDetails(e.target.value, 'isOsteoporosisScan')}
                            aria-label="Platform"
                        >
                            <ToggleButton value="N/A">N/A</ToggleButton>
                            <ToggleButton value="Y">Y</ToggleButton>
                            <ToggleButton value="N">N</ToggleButton>
                        </ToggleButtonGroup>
                    </Grid>
                </Grid>
                {
                    memData.isOsteoporosisScan === "Y" &&
                    <Fragment>
                        <Grid item xs={12} style={{ paddingTop: 15 }}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <MobileDatePicker
                                    label="Osteoporosis Scan One Date"
                                    inputFormat="DD/MM/YYYY"
                                    value={memData.osteoporosisScanOne}
                                    onChange={(e) => changeFamilyDetails(e, 'osteoporosisScanOne')}
                                    renderInput={(params) => <TextField style={{ width: '100%' }} variant="outlined" {...params} />}
                                />

                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} style={{ paddingTop: 15 }}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <MobileDatePicker
                                    label="Osteoporosis Scan Two Date"
                                    inputFormat="DD/MM/YYYY"
                                    value={memData.osteoporosisScanTwo}
                                    onChange={(e) => changeFamilyDetails(e, 'osteoporosisScanTwo')}
                                    renderInput={(params) => <TextField style={{ width: '100%' }} variant="outlined" {...params} />}
                                />

                            </LocalizationProvider>
                        </Grid>
                    </Fragment>
                }
            </Grid>



            <Grid style={{ padding: 20 }} container spacing={2}>
                <Grid container xs={12}>
                    <Grid item xs={5} style={{ marginLeft: '15px' }}>
                        <Typography>
                            Breast Cancer
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
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
                </Grid>
                {
                    (memData.breastCancer == "Y" || memData.breastCancer == "N") &&
                    <Grid item xs={12}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <MobileDatePicker
                                label="Breast Cancer Scan Date"
                                inputFormat="DD/MM/YYYY"
                                value={memData.breastCancerScan}
                                onChange={(e) => changeFamilyDetails(e, 'breastCancerScan')}
                                renderInput={(params) => <TextField style={{ width: '100%' }} variant="outlined" {...params} />}
                            />

                        </LocalizationProvider>
                    </Grid>
                }
                <Grid container xs={12} style={{ paddingTop: 15 }}>
                    <Grid item xs={5} style={{ marginLeft: '15px' }}>
                        <Typography>
                            Uterus Cancer
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
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
                </Grid>
                {
                    (memData.uterusCancer == "Y" || memData.uterusCancer == "N") &&
                    <Grid item xs={12}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <MobileDatePicker
                                label="Uterus Cancer Scan Date"
                                inputFormat="DD/MM/YYYY"
                                value={memData.uterusCancerScan}
                                onChange={(e) => changeFamilyDetails(e, 'uterusCancerScan')}
                                renderInput={(params) => <TextField style={{ width: '100%' }} variant="outlined" {...params} />}
                            />

                        </LocalizationProvider>
                    </Grid>
                }
                <Grid container xs={12} style={{ paddingTop: 15 }}>
                    <Grid item xs={5} style={{ marginLeft: '15px' }}>
                        <Typography>
                            Oral Cancer
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
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
            </Grid>

            <Grid style={{ padding: 20 }} container spacing={2}>
                <Grid container xs={12}>
                    <Grid item xs={5} style={{ marginLeft: '15px' }}>
                        <Typography>
                            Obesity
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
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
                </Grid>
                <Grid container xs={12} style={{ paddingTop: 15 }}>
                    <Grid item xs={5} style={{ marginLeft: '15px' }}>
                        <Typography>
                            Heart Diseases
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
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
                </Grid>
                <Grid container xs={12} style={{ paddingTop: 15 }}>
                    <Grid item xs={5} style={{ marginLeft: '15px' }}>
                        <Typography>
                            Lung Related Diseases
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
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
            </Grid>

            <Grid style={{ padding: 20 }} container spacing={2}>
                <Grid container xs={12}>
                    <Grid item xs={5} style={{ marginLeft: '15px' }}>
                        <Typography>
                            Asthma
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
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
                </Grid>
                <Grid container xs={12} style={{ paddingTop: 15 }}>
                    <Grid item xs={5} style={{ marginLeft: '15px' }}>
                        <Typography>
                            Joint Pain
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <ToggleButtonGroup
                            color="primary"
                            value={(memData.jointPain === null || memData.jointPain === "") ? 'N/A' : memData.jointPain}
                            exclusive
                            onChange={(e) => changeFamilyDetails(e.target.value, 'jointPain')}
                            aria-label="Platform"
                        >
                            <ToggleButton value="N/A">N/A</ToggleButton>
                            <ToggleButton value="Y">Y</ToggleButton>
                            <ToggleButton value="N">N</ToggleButton>
                        </ToggleButtonGroup>
                    </Grid>
                </Grid>
                <Grid container xs={12} style={{ padding: 15 }}>
                    <TextField style={{ width: '100%' }} value={memData.otherDiseases + ''}
                        onChange={(e) => changeFamilyDetails(e.target.value, 'otherDiseases')}
                        id="standard-basic" label="Other Diseases" variant="outlined" />
                </Grid>
            </Grid>


            <Grid style={{ padding: 20 }} container spacing={2}>
                <Grid container xs={12} >
                    <Grid item xs={5} style={{ marginLeft: '15px' }}>
                        <Typography>
                            Vaccination
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
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
                </Grid>
                {
                    memData.vaccination === "Y" &&
                    <Fragment>
                        <Grid container xs={12} style={{ padding: 15 }}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <MobileDatePicker
                                    label="Dose One"
                                    inputFormat="DD/MM/YYYY"
                                    value={memData.doseOne}
                                    onChange={(e) => changeFamilyDetails(e, 'doseOne')}
                                    renderInput={(params) => <TextField style={{ width: '100%' }} variant="outlined" {...params} />}
                                />

                            </LocalizationProvider>
                        </Grid>
                        <Grid container xs={12} style={{ padding: 15 }}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <MobileDatePicker
                                    label="Dose Two"
                                    inputFormat="DD/MM/YYYY"
                                    value={memData.doseTwo}
                                    onChange={(e) => changeFamilyDetails(e, 'doseTwo')}
                                    renderInput={(params) => <TextField style={{ width: '100%' }} variant="outlined" {...params} />}
                                />

                            </LocalizationProvider>
                        </Grid>
                    </Fragment>
                }
            </Grid>

            <Grid item xs={12} style={{ margin: '10px' }} >
                <Button
                    style={{ width: '100%' }}
                    variant="contained"
                    onClick={() => { saveMemDetails() }}>
                    save
                </Button>
            </Grid>

            <Grid item xs={12} style={{ margin: '10px' }} >
                <Button
                    style={{ width: '100%' }}
                    variant="outlined"
                    onClick={() => { closeMemberPage() }}>
                    back
                </Button>
            </Grid>

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