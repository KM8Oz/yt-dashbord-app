import React, { createContext, JSXElementConstructor, ReactElement, useContext, useState } from "react";
import { ReactComponent as First_them} from "../assets/first_theme.svg"
enum Names {
    first="first"
}
export const themes = {
    "first":{
        Icon: First_them,
        title: 'first',
        values:{
            primary:"#2D2D2D",
            secondary:"#3F3F3F",
            secondary_light: "#7E7E7E",
            text:"#FFFFFF",
            menu:"#000000",
            font:"Inter",
            secondary_tabs:"#292929",
            secondary_border:"#1E1E1E"
        }
    }
}
export const ThemeContext = createContext({
    current:themes["first"],
    Change:(i:number, name: string)=>null
})

const ThemeProvider: React.FC<any>  =  ({ children }:{
    children:ReactElement<any, string | JSXElementConstructor<any>> | null
}) => {
    const [current, setCurrent] = useState(themes["first"])
    const Change = (i:number, name: string)=>{
        if(Object.keys(themes).includes(name)){
            setCurrent(Object.values(themes)[i])   
        }
        return null
    }
    return (
        <ThemeContext.Provider value={{current, Change}}>
            {children}
        </ThemeContext.Provider>
    )
}
export default ThemeProvider