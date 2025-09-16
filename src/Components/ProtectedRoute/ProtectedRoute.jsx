
import { Navigate } from "react-router";
import Cookies from 'js-cookie';
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!Cookies.get('token');

  return isAuthenticated ? children : <Navigate to="/login" />;
};


export default ProtectedRoute;






