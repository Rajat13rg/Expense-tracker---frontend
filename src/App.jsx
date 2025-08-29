import { root } from 'postcss';
import React from 'react'
import UserProvider from './context/UserContext';

import{
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"; 
import { SignUp } from './pages/Auth/SignUp';
import { Login } from './pages/Auth/Login';
import { Home } from './pages/Dashboard/Home';
import { Income } from './pages/Dashboard/Income';
import { Expense } from './pages/Dashboard/Expense';
import { Toaster } from "react-hot-toast";

export const App = () => {
  return (
    <UserProvider>
      <div>
        <Router>
          <Routes>
            <Route path="/" element={<Root/>}/>
            <Route path="/login" exact element={<Login/>}/>
            <Route path="/signUp" exact element={<SignUp/>}/>
            <Route path="/dashboard" exact element={<Home/>}/>
            <Route path="/income" exact element={<Income/>}/>
            <Route path="/expense" exact element={<Expense/>}/>
          </Routes>
        </Router>
      </div>

       <Toaster
        toastOptions={{
          className: "",
          style: {
            fontSize: '13px'
          },
        }}
/>
    </UserProvider>
  )
}


 const Root = () => {
  //  check if token exists in local storage
  const isAuthenticated = !!localStorage.getItem("token");

  // Redirected to dashboard if authenticated, otherwise to login
  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/login"/>
  );
  
 }
export default App;