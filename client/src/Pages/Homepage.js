import React, { useState ,useEffect} from 'react'
import "./home.css";
import Login from '../components/authentication/Login';
import Signup from '../components/authentication/Signup';
import { useNavigate } from 'react-router-dom';
const Homepage = () => {
  const navigate=useNavigate();

  useEffect(()=>{
    const userinfo=JSON.parse(localStorage.getItem('userinfo'))
    if(userinfo){
        navigate("/chats")
    }
},[navigate])
  
  const [val,setVal]=useState(true);

  function login(){
    setVal(true);
  }

  function signup(){
    setVal(false);
  }
  return (
    <div className='Home'>
      <div className='title'>
      Welcome to Chat Application
      </div>
      <div className='authentication'>
        <div className='choice login' onClick={login}>Login</div>
        <div className='choice signup' onClick={signup}>Signup</div>
      </div>
      {val===true?<Login/>:<Signup/>}
    </div>
  )
}

export default Homepage