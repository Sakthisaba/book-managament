import React from "react";
import { useState } from "react";
import { createContext } from "react";



export const AppContext = createContext();


export const AppContextProvider =(props)=>{

    const [isloggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState({});
    const [bookdata , setBookData] = useState([]);
    const [totalbooks, settotalbooks] = useState(0);
    const [authors , setAuthors] = useState([]);
    const [genre , setGenre] = useState([]);
    const [tableLength , settableLength] = useState(10);


    const value ={
        isloggedIn,
        setIsLoggedIn,
        user,
        setUser,
        bookdata,
        setBookData,
        authors,
        setAuthors,
        genre,
        totalbooks,
        settotalbooks,
        setGenre,
        tableLength

    }
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
}