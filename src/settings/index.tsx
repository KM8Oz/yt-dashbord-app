import { clipboard } from "@tauri-apps/api";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { ThemeContext, themes } from "../store/theme";
import { get_machine_id } from "../tools/machine_id";
import { notify } from "../tools/notify";
import { ReactComponent as Clipboard } from "../assets/clipboard.svg"

const ClipIcon = styled(Clipboard)`
    cursor: pointer;
    transform:scale(1);
    transition:all ease-in-out 200ms;
    :active {
        transform:scale(.97);
    }
`;



const ThemeIcon = styled.div<{active:boolean}>`
    border-width:1px;
    border-style:solid;
    border-color:${({active})=>active?'#108BB1':'#108BB100'};
    cursor: pointer;
    :hover{
        border-color:#108BB1;
    }
    transform:scale(1);
    transition:all ease-in-out 200ms;
    :active {
        transform:scale(.97);
    }
    width:25px;
    height:25px;
    padding:0px;
    margin:0px;
    border-radius:50%;
    margin-bottom:3px;
`;


const SettingItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 7px 4px;
    gap: 10px;
    width: 89%;
    height: auto;
    background: #414141;
    border-radius: 4px;
    flex: none;
    order: 0;
    align-self: stretch;
    p {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 200;
        font-size: 16px;
        line-height: 19px;
        display: flex;
        align-items: center;
        text-align: center;
        color: #FFFFFF;
        flex: none;
        order: 0;
        flex-grow: 0;
    }
    .insider {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 10px;
        gap: 10px;
        width: 87%;
        height: 20px;    
        flex: none;
        order: 1;
        align-self: stretch;
        flex-grow: 0;
    }
`;

export const settings = {
    themes: {
        title: "Themes:",
        Component: ({...props}:any)=>{
            const { current, Change } = useContext(ThemeContext)
            return (
                <SettingItem>
                    <p>{props.title}</p>
                    <div className="insider">
                        {
                            Object.values(themes).map((d,i)=>{
                                return <ThemeIcon key={i} onClick={()=>Change(i, d.title)} active={current.title == d.title}>
                                    <d.Icon width={25} height={25}/>
                                </ThemeIcon>
                            })
                        }
                    </div>
                </SettingItem>
            );
        }
    },
    userid: {
        title: "User Id:",
        Component: ({...props}:any)=>{
            const IdClone = styled.div`
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                padding: 3px 12px;
                gap: 10px;
                position: relative;
                width: 90%;
                height: 30px;
                background: #7E7E7E;
                border-radius: 39px;
                p {
                    width: 127px;
                    font-family: 'Arapey';
                    font-style: normal;
                    font-weight: 400;
                    font-size: 17px;
                    line-height: 0px;
                    display: flex;
                    align-items: center;
                    letter-spacing: -0.01em;
                    color: #000000;                
                    flex: none;
                    order: 0;
                    flex-grow: 1;
                }
            `;
            const [id, setId] = useState("xxxxxx")
            useEffect(()=>{
                get_machine_id().then((id)=>{
                    setId(id)
                })
            },[])
            return (
                <SettingItem>
                    <p>{props.title}</p>
                    <div className="insider">
                        <IdClone>
                            <p>
                                {id.slice(0,10)+"...."}
                            </p>
                            <ClipIcon 
                            onClick={()=>{
                            clipboard.writeText(id).then(()=>{
                                notify("clipboard","userId copied!")
                            })
                        }} width={24} height={24} />
                        </IdClone>
                    </div>
                </SettingItem>
            );
        }
    }
}