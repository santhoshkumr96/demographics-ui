import { useContext } from 'react';
import { Route , Navigate, Outlet} from 'react-router-dom';
import LoginContext from './LoginAuthProvider/LoginContext';

const PrivateRoute = ({ children, ...rest }) => {
    const loginContext = useContext(LoginContext);
    return loginContext.username !== '' ?  <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
  