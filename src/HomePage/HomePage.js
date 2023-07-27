import { Container, Button, Snackbar, Alert, Backdrop, CircularProgress, TablePagination, TextField, Badge, IconButton } from '@mui/material';
import { useEffect, useContext, Fragment } from 'react';
import { useState } from 'react';
import ajax from '../ajaxHelper';
import { SERVICE_BASE_URL } from '../config';
import Grid from '@mui/material/Grid';
import { Stack } from '@mui/system';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import MailIcon from '@mui/icons-material/Mail';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import LoginContext from '../LoginAuthProvider/LoginContext';
import FamilyDetails from '../FamilyDetailsPage/FamilyDetails';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';

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

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
}

const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
];


const HomePage = () => {

    //init
    const paginationDefaultData = {
        numberOfRows: 10,
        pageNumber: 0,
        familyId: '',
        respondentName: '',
        mobileNumber: '',
        villageName: ''
    }

    //states
    const loginContext = useContext(LoginContext);
    const [paginationData, setPaginationData] = useState(paginationDefaultData);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [popDataCount, setPopDataCount] = useState(10);
    const [data, setData] = useState([])
    const [familyId, setFamilyId] = useState('');
    const [respondentName, setRespondentName] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [memberName, setMemberName] = useState('');
    const [villageName, setVillageName] = useState('');
    const [filterDataLoading, setFilterDataLoading] = useState(false);
    const [famId, setFamId] = useState(0);
    const [isViewFam, setIsViewFam] = useState(false);

    const [openModal, setOpenModal] = useState(false);
    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);
    const [deleteFamilyId, setDeleteFamilyId] = useState('');
    const [deleteId, setDeleteId] = useState(0);

    const [isSearchEnabled, setIsSearchEnabled] = useState(false);


    //default page handlers
    const [isError, setisError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, seterrorMessage] = useState('');
    const handleClose = () => {
        setisError(false);
        setIsLoading(false);
    };

    //pagination setup

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        let temp = paginationData;
        paginationData.pageNumber = newPage;
        setPaginationData({ ...temp });
        // setFilterDataLoading(true)
        getFamilyDetails();
        // getData();
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
        let temp = paginationData;
        paginationData.pageNumber = 0;
        paginationData.numberOfRows = (+event.target.value);
        setPaginationData({ ...temp });
        getFamilyDetails();
        // getData();
    };


    const getFamilyDetails = () => {
        setFilterDataLoading(true)
        const config = {};
        const temp = { ...paginationData }
        temp.familyId = familyId;
        temp.respondentName = respondentName;
        temp.mobileNumber = mobileNumber;
        temp.villageName = villageName;
        temp.memberName = memberName;
        let serviceUrl = 'getFamilyDetails';
        if (memberName !== ''){
            serviceUrl = 'getFamilyDetailsNew';
        }
        ajax
            .post(`${SERVICE_BASE_URL}/${serviceUrl}`, temp, { config })
            .then((res) => {
                // console.log(res)
                setData(res.data.content)
                setPopDataCount(res.data.totalElements)
                setIsLoading(false);
                setFilterDataLoading(false)
            })
            .catch((e) => {
                setIsLoading(false);
                setisError(true);
                setFilterDataLoading(false)
                seterrorMessage(e.response.data.message);
                console.log(e)
            }
            );
    }


    const deleteFamilyCall = (familyId, id, userId) => {
        const config = {};
        ajax
            .post(`${SERVICE_BASE_URL}/deleteFamily`, { familyId, id, userId }, { config })
            .then((res) => {
                getFamilyDetails();
            })
            .catch((e) => {
                setIsLoading(false);
                setisError(true);
                setFilterDataLoading(false)
                seterrorMessage(e.response.data.message);
                console.log(e)
            }
            );
    }

    const clearSearch = () => {
        setFamilyId('')
        setRespondentName('')
        setMobileNumber('')
        setVillageName('')
        setMemberName('')
        setIsLoading(true);
        setFilterDataLoading(false);
        getFamilyDetails();
    }

    const search = () => {
        setFilterDataLoading(true)
        getFamilyDetails();
    }

    useEffect(()=>{
        setFilterDataLoading(true)
        getFamilyDetails();
    },[])

    // useEffect(() => {
    //     // setIsLoading(true);
    //     setFilterDataLoading(true)
    //     getFamilyDetails();
    //     // console.log('calling here')
    // }, [paginationData, familyId, respondentName, mobileNumber, villageName, memberName])


    const deleteFamily = (familyid, id) => {
        setDeleteFamilyId(familyid)
        setDeleteId(id)
        handleOpenModal();
    }

    const editFamily = (id) => {
        setFamId(id);
        setIsViewFam(true);
    }

    const addFamily = () => {
        setFamId(0);
        setIsViewFam(true);
    }

    const confirmDeleteFamily = () => {
        setFilterDataLoading(true);
        handleCloseModal();
        deleteFamilyCall(deleteFamilyId, deleteId, loginContext.userId);
    }

    const onFamilyViewClose = () => {
        setIsViewFam(false)
        setFilterDataLoading(true)
        getFamilyDetails();
    }

    const getCountOfMembers = (row) => {
        let count = 0
        row.memberDetail.map((e) => {
            if (e.isDeleted === "N") {
                count = count + 1
            }
        })
        return count;
    }

    const searchEnableButton = () => {
        setIsSearchEnabled(!isSearchEnabled);
    }

    return (
        <Fragment>

            {
                !isViewFam &&

                <Grid container rowSpacing={3} spacing={2}>

                    <Grid container spacing={2} style={{ marginTop: '80px', justifyContent: 'right', marginRight: '30px' }}>
                        <TablePagination
                            className="pagnation-div"
                            rowsPerPageOptions={[10, 25, 50]}
                            component="div"
                            count={popDataCount}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                        <Button style={{ margin: '5px' }} variant="contained" size="small" onClick={() => addFamily()} aria-label="delete">
                            <AddIcon style={{ color: 'white' }} />
                        </Button>
                        <Button style={{ margin: '5px' }} variant="contained" size="small" onClick={() => searchEnableButton()} aria-label="delete">
                            <SearchIcon style={{ color: 'white' }} />
                        </Button>
                    </Grid>

                    {
                        isSearchEnabled &&
                        <Grid container spacing={2} style={{marginLeft:'20px' , justifyContent: 'right', marginRight: '30px', marginTop: '10px', marginBottom: '10px' }}>
                            <Grid xs={12} md={2}>
                                <TextField style={{ width:'100%', padding:'5px' , paddingRight:'2px'}} id="outlined-basic" size="small" label="Family Id" variant="outlined"
                                    value={familyId}
                                    onChange={(e) => setFamilyId(e.target.value)}
                                />
                            </Grid>
                            <Grid  xs={12} md={2}>
                                <TextField style={{ width:'100%', padding:'5px' , paddingRight:'2px'}} id="outlined-basic" size="small" label="Respondent Name" variant="outlined"
                                    value={respondentName}
                                    onChange={(e) => setRespondentName(e.target.value)}
                                />
                            </Grid>
                            <Grid  xs={12} md={2}>
                                <TextField style={{ width:'100%', padding:'5px' , paddingRight:'2px'}} id="outlined-basic" size="small" label="Mobile Number" variant="outlined"
                                    value={mobileNumber}
                                    onChange={(e) => setMobileNumber(e.target.value)}
                                />
                            </Grid>
                            {
                                villageName !== '' &&
                                <Grid  xs={12} md={2}>
                                    <TextField style={{ width:'100%', padding:'5px' , paddingRight:'2px'}} id="outlined-basic" size="small" label="Member Name" variant="outlined"
                                        value={memberName}
                                        onChange={(e) => setMemberName(e.target.value)}
                                    />
                                </Grid>
                            }
                            <Grid  xs={12} md={2}>
                                <TextField style={{ width:'100%', padding:'5px', paddingRight:'2px'}} id="outlined-basic" size="small" label="Village Name" variant="outlined"
                                    value={villageName}
                                    onChange={(e) => setVillageName(e.target.value)}
                                />
                            </Grid>
                            <Grid   style={{marginLeft:'20px'}}>
                                        <Button
                                        // style={{ width:'100%'}}
                                            variant="contained"
                                            onClick={() => clearSearch()}
                                        >
                                            search
                                        </Button>
                                        <Button
                                        style={{ marginLeft:'10px'}}
                                            variant="outlined"
                                            onClick={() => clearSearch()}
                                        >
                                            Clear
                                        </Button>
                            </Grid>

                        </Grid>
                    }



                    <TableContainer style={{ marginLeft: '30px', marginRight: '10px' }} component={Paper}>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow style={{ background: '#FC7300' }}>
                                    <TableCell style={{ color: 'white', minWidth: '100px' }} >S.No</TableCell>
                                    {/* <TableCell style={{ color: 'white', minWidth: '100px' }} >Id</TableCell> */}
                                    <TableCell style={{ color: 'white', minWidth: '100px' }} >Family Id</TableCell>
                                    <TableCell style={{ color: 'white', minWidth: '100px' }} >Respondent Name</TableCell>
                                    <TableCell style={{ color: 'white', minWidth: '100px' }} >Mobile Number</TableCell>
                                    <TableCell style={{ color: 'white', minWidth: '100px' }} >No Family Members</TableCell>
                                    <TableCell style={{ color: 'white', minWidth: '100px' }} >Village Name</TableCell>
                                    {/* <TableCell style={{ color: 'white', minWidth: '100px' }} >Status</TableCell> */}
                                    <TableCell style={{ color: 'white', minWidth: '100px' }} >Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {!filterDataLoading && data.length === 0 &&
                                    <Container>
                                        <div>
                                            no data
                                        </div>
                                    </Container>

                                }
                                {!filterDataLoading && data.map((row, index) => (
                                    <TableRow
                                        key={row.name}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell>{(page * rowsPerPage) + index + 1} </TableCell>
                                        {/* <TableCell>{row.id} </TableCell> */}
                                        <TableCell>{row.familyId} </TableCell>
                                        <TableCell>{row.respondentName}</TableCell>
                                        <TableCell>{row.mobileNumber}</TableCell>
                                        <TableCell>{row.memberCount}</TableCell>
                                        <TableCell>{row.demographicDetail.villageName}</TableCell>
                                        {/* <TableCell>{'in progress'}</TableCell> */}
                                        <TableCell style={{ minWidth: 100 }}>
                                            <IconButton onClick={() => editFamily(row.id)} color="primary">
                                                <EditIcon color="primary" />
                                            </IconButton>
                                            <IconButton onClick={() => deleteFamily(row.familyId, row.id)} style={{ marginLeft: 20 }} color="primary">
                                                <DeleteIcon color="error" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}

                            </TableBody>
                        </Table>
                        {
                            filterDataLoading &&
                            <Container sx={{ width: 300 }}>
                                <Skeleton />
                                <Skeleton animation="wave" />
                                <Skeleton animation={false} />
                            </Container>
                        }
                    </TableContainer>

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
                    <Modal
                        open={openModal}
                        onClose={handleCloseModal}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                Are you sure you want to delete {deleteFamilyId}
                            </Typography>
                            <Container >
                                <Stack direction="row" spacing={2} style={{ marginTop: 20 }}>
                                    <Button
                                        variant="contained"
                                        onClick={() => confirmDeleteFamily()}
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
                </Grid>

            }
            {
                isViewFam &&
                <Fragment>

                    <FamilyDetails famId={famId} />
                    {/* <Button style={{marginTop: '20px'}} onClick={() => { onFamilyViewClose(false) }}>
                        back
                    </Button> */}
                </Fragment>

            }

        </Fragment>
    );
}

export default HomePage;