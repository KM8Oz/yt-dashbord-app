import React, { useEffect }  from "react";
import { useNavigate } from "react-router";
import Login_ from "../components/Login";


export default ({...props})=>{
    let _navigator = useNavigate();
    // useEffect(()=>{
    //     _navigator("/Home");
    // })
    return (
        <Login_ />
    )
}