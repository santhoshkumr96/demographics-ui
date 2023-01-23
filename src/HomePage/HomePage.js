import { Container, Button, Snackbar, Alert, Backdrop, CircularProgress, TablePagination, TextField, Badge } from '@mui/material';
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

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
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
    const [villageName, setVillageName] = useState('');
    const [filterDataLoading, setFilterDataLoading] = useState(false);
    const [famId, setFamId] = useState(0);
    const [isViewFam, setIsViewFam] = useState(false);

    const [openModal, setOpenModal] = useState(false);
    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);
    const [deleteFamilyId, setDeleteFamilyId] = useState('');
    const [deleteId, setDeleteId] = useState(0);


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
        // getData();
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
        let temp = paginationData;
        paginationData.pageNumber = 0;
        paginationData.numberOfRows = (+event.target.value);
        setPaginationData({ ...temp });
        // getData();
    };


    const getFamilyDetails = () => {
        const config = {};
        const temp = { ...paginationData }
        temp.familyId = familyId;
        temp.respondentName = respondentName;
        temp.mobileNumber = mobileNumber;
        temp.villageName = villageName;
        ajax
            .post(`${SERVICE_BASE_URL}/getFamilyDetails`, temp, { config })
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
        setIsLoading(true);
        setFilterDataLoading(false);
        getFamilyDetails();
    }

    useEffect(() => {
        // setIsLoading(true);
        setFilterDataLoading(true)
        getFamilyDetails();
        console.log('calling here')
    }, [paginationData, familyId, respondentName, mobileNumber, villageName])


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

    return (
        <Fragment>

            {
                !isViewFam &&

                <Grid style={{ margin: 10, marginTop: 50 }} container rowSpacing={3} spacing={2}>
                    <Stack>
                        <Stack direction="row" spacing={2}>
                            <TextField id="outlined-basic" size="small" label="Family Id" variant="outlined"
                                value={familyId}
                                onChange={(e) => setFamilyId(e.target.value)}
                            />
                            <TextField id="outlined-basic" size="small" label="Respondent Name" variant="outlined"
                                value={respondentName}
                                onChange={(e) => setRespondentName(e.target.value)}
                            />
                            <TextField id="outlined-basic" size="small" label="Mobile Number" variant="outlined"
                                value={mobileNumber}
                                onChange={(e) => setMobileNumber(e.target.value)}
                            />
                            <TextField id="outlined-basic" size="small" label="Village Name" variant="outlined"
                                value={villageName}
                                onChange={(e) => setVillageName(e.target.value)}
                            />
                            <Button
                                variant="contained"
                                onClick={() => clearSearch()}
                            >
                                Clear
                            </Button>
                        </Stack>

                        <Stack direction="row" spacing={2}>

                            <TablePagination
                                className="pagnation-div"
                                rowsPerPageOptions={[10, 25, 100, 1000]}
                                component="div"
                                count={popDataCount}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                            <Button
                                variant="contained"
                                onClick={() => addFamily()}
                            >
                                Add
                            </Button>
                        </Stack>
                        <TableContainer component={Paper}>
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell >S.No</TableCell>
                                        <TableCell >Id</TableCell>
                                        <TableCell >Family Id</TableCell>
                                        <TableCell >Respondent Name</TableCell>
                                        <TableCell >Mobile Number</TableCell>
                                        <TableCell >Number Of Family Members</TableCell>
                                        <TableCell >Village Name</TableCell>
                                        <TableCell >Status</TableCell>
                                        <TableCell >Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {!filterDataLoading && data.map((row, index) => (
                                        <TableRow
                                            key={row.name}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell>{(page * rowsPerPage) + index + 1} </TableCell>
                                            <TableCell>{row.id} </TableCell>
                                            <TableCell>{row.familyId} </TableCell>
                                            <TableCell>{row.respondentName}</TableCell>
                                            <TableCell>{row.mobileNumber}</TableCell>
                                            <TableCell>{Object.keys(row.memberDetail).length}</TableCell>
                                            <TableCell>{row.demographicDetail.villageName}</TableCell>
                                            <TableCell>{'in progress'}</TableCell>
                                            <TableCell>
                                                <Badge onClick={() => editFamily(row.id)} color="primary">
                                                    <EditIcon color="action" />
                                                </Badge>
                                                <Badge onClick={() => deleteFamily(row.familyId, row.id)} style={{ marginLeft: 20 }} color="primary">
                                                    <DeleteIcon color="action" />
                                                </Badge>
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
                    </Stack>

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
                    <Button style={{ margin: 10, marginTop: 50 }} onClick={() => { setIsViewFam(false) }}>
                        click back
                    </Button>
                    <FamilyDetails famId={famId} />
                </Fragment>

            }

        </Fragment>
    );
}

export default HomePage;