import { useContext, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Alert, Button, Container, Snackbar, Stack, TextField, CircularProgress, Backdrop } from '@mui/material';
import LangugageContext from '../LanguageProvider/LanguageContext';
import { getLangData } from '../LanguageData/languageHelper';
import { useState } from 'react';
import { SERVICE_BASE_URL } from '../config';
import ajax from '../ajaxHelper';
import LoginContext from '../LoginAuthProvider/LoginContext';
import { Navigate } from 'react-router-dom';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const Login = () => {

    const loginContext = useContext(LoginContext);
    const [username, setusername] = useState('');
    const [password, setpassword] = useState('');
    const [isError, setisError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, seterrorMessage] = useState('');
    const handleClose = () => {
        setisError(false);
        setIsLoading(false);
    };


    const login = () => {
        const config = {};
        setIsLoading(true);
        ajax
            .post(`${SERVICE_BASE_URL}/auth/signin`, { username, password }, config)
            .then((res) => {
                loginContext.setUsername(res.data.username);
                loginContext.setUserId(res.data.id)
                loginContext.setUserRole(res.data.roles);
                setIsLoading(false);
            })
            .catch((e) => {
                setIsLoading(false);
                setisError(true);
                seterrorMessage(e.response.data.message);
            }
            );
    }

    // useEffect(()=>{
    //     if(loginContext.username !== ''){
    //         this.props.history.push('/');
    //     }
    // },[loginContext.username])

    if(loginContext.username !== ''){
        return <Navigate to="/" />
    }

    return (
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            style={{ minHeight: '100vh' }}
        >
            <Grid item xs={12} style={{ boxShadow: '5px 10px 200px #1f8a70' ,background: 'white', padding : 50 , borderRadius : 30}}>
                <Stack spacing={2}>
                    <Container
                       style={{ display:'flex', justifyContent:'center' }}
                    >
                        <img
                            src={require('../resources/thirumalai.jpg')}
                            width={100}
                            height={160}
                            alt={'tct logo'}
                            loading="lazy"
                        />
                    </Container>
                    <TextField
                        id="login-username-text"
                        label="Username"
                        variant="standard"
                        size="small"
                        value={username}
                        onChange={(e) => setusername(e.target.value)}
                    />
                    <TextField
                        id="login-password-text"
                        label="Password"
                        type="password"
                        variant="standard"
                        size="small"    
                        value={password}
                        onChange={(e) => setpassword(e.target.value)}
                    />
                    <Button
                        style={{background: '#FC7300' , borderRadius : 30}}
                        variant="contained"
                        onClick={() => login()}
                    >
                        Login
                    </Button>
                </Stack>
            </Grid>
            <Snackbar open={isError} autoHideDuration={4000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    {errorMessage===''?'Please Contact Admin':errorMessage}
                </Alert>
            </Snackbar>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isLoading}
                // onClick={handleClose}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </Grid>
    );
}

export default Login;
