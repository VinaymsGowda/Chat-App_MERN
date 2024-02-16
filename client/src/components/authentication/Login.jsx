import React, { useState } from 'react'
import { Button } from "@chakra-ui/button";
import { useToast } from "@chakra-ui/toast";
import {useNavigate} from "react-router-dom"

import "./login.css"
export default function Login() {
  const toast=useToast();
  const navigate=useNavigate();
  const [data, setData] = useState({
    email: '',
    password: ''
  });

  const changeHandler = (e) => {
    setData({...data, [e.target.name]: e.target.value})
  }

  async function handelSubmit(e){
    e.preventDefault();
    try {
      const response=await fetch("https://server-side-chat.onrender.com/login",{
        method:"POST",
        body:JSON.stringify({data}),
        headers:{
          'Content-Type':"application/json",
        }
      })
      console.log(response);
      const userdata=await response.json();
      if(response.ok){
        toast({
          title: "Successful Login",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        localStorage.setItem('userinfo',JSON.stringify(userdata));
        navigate("/chats");
      }
      else if(response.status===404){
        toast({
          title: "Wrong Password",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    } catch (error) {
      toast({
        title: "Error Occured",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
    console.log(data);
  }
  

  return (
    <div className='Login'>
      <h1>Enter Login Credentials</h1>
      <form className='loginform' onSubmit={handelSubmit}>
      <div>
        <input type='email' placeholder='Email' name='email' onChange={changeHandler} value={data.email}/>
      </div>
      <div>
        <input type='password' placeholder='password' name='password' onChange={changeHandler} value={data.password}/>
      </div>
      <Button
        bgColor={'#0ECEEF'}
        width="100%"
        style={{ marginTop: 15 }}
        onClick={handelSubmit}
      >
        Login
      </Button>
      </form>
    </div>
  )
}
