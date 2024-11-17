import React from 'react'
import LoginForm from '../../component/User/Login'
import Nav from '../../component/Home/Header'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Admin from '../../Admin/Admin';
import Home from '../Home';

function Login() {
  return (
    <div>
      <LoginForm/>
    </div>
  )
}

export default Login
