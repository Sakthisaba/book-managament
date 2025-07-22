import React from 'react';
import { useState } from "react";

import { AppContext } from '../../context/Appcontext';
import validation from '../../service/validation';
import {FormControl,FormLabel,Text,Heading,FormHelperText,Input,Stack,Button,InputGroup,InputLeftElement} from '@chakra-ui/react'
import {AlertBox} from '../alert/Alert';
 import { Authenticate } from '../../service/api';
import {useNavigate} from 'react-router-dom';
import { Text as TextElement ,Highlight as Highlighter} from "@chakra-ui/react"


const Login = () => {
    const [formData, setFormData] = useState({
      username: "",
      password: "",
    });
    const navigate = useNavigate();
    const { setIsLoggedIn, setUser } = React.useContext(AppContext);
    const [loginerror, setLoginError] = useState(false);

    const [error, setError] = useState({});

    const handleChange = (event) => {
      const { name, value } = event.target;
      setFormData({ ...formData, [name]: value });
      setError({});
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
        //validate form by validation service.
      const validationErrors = validation.formvalidator(formData);
      if (Object.keys(validationErrors).length > 0) {
        setError(validationErrors);
      } else {

         //Authenticate user by Authenticate API SERVICE
        Authenticate(formData).then((response) => {
          if (response.success) {
            setIsLoggedIn(true);
            setUser(response.user);
            navigate("/");
          } else {
            setLoginError(true);
          }
        });
      }
    };

    //login as guest 
    const loginAsGuest = () => {
      let username = "Guest" + Math.floor(Math.random(10) * 10);
      setIsLoggedIn(true);
      let guestuser = { username: "", role: "GUEST" };
      guestuser.username = username;
      setUser(guestuser);
      localStorage.setItem("isloggedIn", true);
      localStorage.setItem("userdata", JSON.stringify(guestuser));
      navigate("/home");
    };

    return (
        <>
       
        <form onSubmit={handleSubmit}>
           <Heading textStyle="xl" color="orange.400" marginBottom={'1vw'}>Welcome back!</Heading>
            <Stack spacing={4} p="1rem" backgroundColor="whiteAlpha.900" borderRadius={'3px'}  w={"20em"} boxShadow='rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;'>
                <FormControl >
                <FormLabel>User name</FormLabel>
                <InputGroup>
                        <Input
                            name="username"
                            type="text"
                            placeholder="Name"
                            value={formData.username}
                            onChange={handleChange}
                        />
                    </InputGroup>
                    {error.username && <Text className='ErrorMessage' fontSize={'sm'} color={'red.300'} textAlign={'right'} >{error.username}</Text>}
                   
                    <FormLabel>Password</FormLabel>
                    <InputGroup>
                        <Input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange}/>
                    </InputGroup>
                    {error.password && <Text  className='ErrorMessage' fontSize={'sm'} color={'red.300'} textAlign={'right'} >{error.password}</Text> }
                    
                </FormControl>
                <Button
                    borderRadius={0}
                    type="submit"
                    variant="solid"
                    colorScheme="orange"
                    width="full"
                >
                    Login
                </Button>
  
                <TextElement className='loginAsGuest' textAlign={"center"}fontSize={"0.8vw"} cursor={"pointer"} onClick={loginAsGuest} ><Highlighter query={["Visit as guest "]} styles={{ px: "0.5", bg: "orange.200" }} >Don't have an account? Visit as guest.</Highlighter></TextElement>
                {loginerror&& <AlertBox message="Invalid Credential"></AlertBox>}
            </Stack>
        </form>
        </>
    );
};

export default Login;