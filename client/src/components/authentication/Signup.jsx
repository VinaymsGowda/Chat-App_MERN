import React, { useState } from 'react'
import "./login.css";
import { Button } from "@chakra-ui/button";
import { useToast } from "@chakra-ui/toast";
import {useNavigate} from "react-router-dom"


function Signup() {
  const toast=useToast();
  const navigate=useNavigate();
  const [data,setData]=useState({
    username:'',
    password:'',
    confirmpassword:'',
    email:''
  })
  const [image,setImage]=useState("")

  //sending to db
  async function createUser(){
    try {
      const response=await fetch('http://localhost:4000/register',{
        method:"POST",
        body: JSON.stringify({ data, profile: image || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg" }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      console.log(response);
      const userdata=await response.json();
      const msg=userdata.msg;
      if(response.ok){
        toast({
          title: "Registration Successful",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        localStorage.setItem('userinfo',JSON.stringify(userdata));
        navigate("/chats");
      }
      else{
        toast({
          title: msg,
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  }

  function submitHandler(e){
    e.preventDefault();
    console.log(data);
    // if(data.password!==)
    const {username,email,password,confirmpassword}=data;
    if(!username || !email || !password || !confirmpassword){
      toast({
        title: "Please fill all fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if(password!==confirmpassword){
      toast({
        title: "Passwords donot match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    
    uploadImage(image);
    createUser();
  }

  async function uploadImage(file) {
    const uploadFile = new FormData();
    uploadFile.append('file', file);
    uploadFile.append('upload_preset', 'Chat-application');
    uploadFile.append("cloud_name","vinay1cloud");
  
    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/vinay1cloud/image/upload', {
      method: 'POST',
      body: uploadFile,
    });
  
    const img = await res.json();
    console.log(img.url);
    setImage(img.url)

    } catch (error) {
      console.log(error);
    }
    
  }
  
  function changeHandler(e){
    setData({...data,[e.target.name]:e.target.value})
  }
  return (
    <div className='Login'>
    <h1>Register using Valid Credentials</h1>
    <form className='loginform'>
    <div>
      <input type='text' placeholder='Username' name='username' value={data.username} onChange={changeHandler} />
    </div>
    <div>
      <input type='email' placeholder='email' name='email' value={data.email} onChange={changeHandler}/>
    </div>
    <div>
      <input type='password' placeholder='password' name="password" value={data.password} onChange={changeHandler}/>
    </div>
    <div>
      <input type='password' placeholder='Confirm password' name="confirmpassword" value={data.confirmpassword} onChange={changeHandler}/>
    </div>
    <div className='pic'>
      <label htmlFor='file-upload' className='piclabel'>Upload your Picture</label>
      <input type='file' accept='image/' id='file-upload'  onChange={(e) => setImage(e.target.files[0])}/>
    </div>
    <Button
        bgColor={'#38E53B'}
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
      >
        Sign Up
      </Button>
    </form>

    
    </div>
  )
}

export default Signup