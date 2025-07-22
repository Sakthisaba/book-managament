import { use, useState } from 'react'
import './App.css'
import React, { useEffect } from 'react';
import { ChakraProvider } from '@chakra-ui/react'
import Login from '../components/login/Login'
import Loader from '../components/loader/loader';
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import RequireAuth from '../context/RequireAuth'
import Home from '../components/home/Home'
import Navbar from '../components/navbar/Navbar'
import LandingPage from '../components/login/LandingPage';
import { AppContext } from '../context/Appcontext'
function App() {
  const { setIsLoggedIn, setUser } = React.useContext(AppContext);
  const [loader,setLoader] =useState(true);
  const checkIfUserLoggeredIn = () => {
    {
      const hasSession = localStorage.getItem("isloggedIn");
      const userdata = localStorage.getItem("userdata");
      if (hasSession&&userdata) {
        setUser(JSON.parse(userdata));
        setIsLoggedIn(hasSession === "true");
      }
      setLoader(false);
  }}

  useEffect(() => {
    checkIfUserLoggeredIn();
  }, []);
  
  if(loader) {
    return <Loader/>;
  }

return (
    <>
        <ChakraProvider>
          <BrowserRouter>
          <Routes>
            <Route exact path="/login" element={<LandingPage />} />
            <Route  path="/*" element={<RequireAuth> <Home /></RequireAuth>} />
            </Routes>
          </BrowserRouter>
        </ChakraProvider>
    </>
  )
}

export default App;
