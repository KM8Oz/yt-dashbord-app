import { useEffect, useState } from 'react'
import './App.css'
import styled from "styled-components";
import { get_machine_id, resize_win, startdrag } from './tools/machine_id';
import Login_ from './components/Login';
import { AppStore } from './store/User';
import { useNavigate, useRoutes } from 'react-router';
import { IOPrivate } from './tools/socket';
import routes from '~react-pages'
import ThemeProvider from './store/theme';


function App() {
  const [count, setCount] = useState(0)
  // get_machine_id().then((er)=>{
  //   console.log("get_machine_id:",er);
  // })
  let _navigator = useNavigate();
  const User = new AppStore();
  useEffect(()=>{
    User.ssid().then((ssid)=>{
      let _private = IOPrivate(ssid);
      _private.on("error", () => {
          _navigator("/")
          resize_win(291, 357)
      });
      _private.on("tk_save", async (res: any) => {
          if (res.tk) {
              User.setssid(res.tk).then(()=>{
                  _navigator("/Home")
                  resize_win(900, 700)
              })
              // await orbitInit(res.dcid);
          }
      })
  })
    setTimeout(()=>{
      let el = document.querySelector('.draggable') as SVGAElement
      el?.addEventListener("mousedown", ()=>{
        el.style.cursor = "grab"
        startdrag()
      })
    },3000)
   return ()=>{
    let el = document.querySelector('.draggable') as SVGAElement
    el?.removeEventListener("mousedown", ()=>null)
   }
  },[])
  // resize_win(900, 700).then((er)=>{
  //   console.log(er);
  // })
  // .catch((err)=>{
  //   console.log(err);
  // })
  return (
    <ThemeProvider>
      {useRoutes(routes)}
    </ThemeProvider>
    )
}

export default App

const AppWrapper = styled.div`
  display:flex;
  justify-content:center;
  align-items:center;
  width:auto;
  height:auto;
  margin:0px;
  padding:0px;
`;
