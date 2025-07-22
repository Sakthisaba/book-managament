import { Navigate } from "react-router-dom";
import { AppContext } from "./Appcontext";
import { useEffect } from "react";
import React from "react";
export default function RequireAuth  ({ children }){
    const { isloggedIn } = React.useContext(AppContext);


    return isloggedIn? children : <Navigate to="/login" replace />;


}