import { useContext, useState } from "react";
import styled from "styled-components";
import { Modules } from "../../modules";
import { ThemeContext } from "../../store/theme";
import {ReactComponent as Inactive_menu} from "../../assets/inactive_menu.svg"
import {ReactComponent as Active_menu} from "../../assets/active_menu.svg"
import { animated, useSpring } from "react-spring";
import { settings } from "../../settings";

export default ({ ...props }) => {
    const [ActiveTab, setActiveTab] = useState(0)
    const { Change, current } = useContext(ThemeContext)
    const [menuactive, setMenuActive] = useState(false)
    const Home = styled.div`
        width:100vw;
        height:100vh;
        padding:10px;
        margin:0px;
        display:flex;
        flex-direction:column;
        justify-content:flex-start;
        background-color:${current.values.primary};
        gap: 10px;
        position: relative;
        border-radius: 0px 0px 9px 9px;
        `;
    const Header = styled.div`
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-end;
        /* padding: 10px 7px 0px 10px; */
        gap: 10px;
        width: 97%;
        height: 63px;
        border-bottom: 1px solid ${current.values.secondary_border};
        flex: none;
        order: 0;
        align-self: stretch;
        flex-grow: 0;
        `;
    const TabMenu = styled.div`
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding: 10px;
        gap: 10px;
        width: 129px;
        height: 35px;
        background: ${current.values.secondary_tabs};
        border-radius: 10px 10px 0px 0px;
        flex: none;
        order: 0;
        flex-grow: 0;
        transition:transform ease-in-out 100ms;
        cursor: pointer;
        transform:scale(1);
        :active {
            transform:scale3d(.98,.95,1) perspective(50px) translateZ(0px) translateX(0px) translateY(0px) rotateX(5deg);
        }
        p {
            font-family: '${current.values.font}';
            font-style: normal;
            font-weight: 200;
            font-size: 16px;
            line-height: 19px;
            display: flex;
            align-items: center;
            text-align: center;
            color: ${current.values.text};
            flex: none;
            order: 0;
            flex-grow: 0;
        }
        `;

const TabsMenu = styled.div`
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: flex-end;
        padding: 0px 10px;
        gap: 10px;
        width: 492px;
        height: 49px;
        flex: none;
        order: 0;
        flex-grow: 0;
        `;
    const SideMenu = styled.div`
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 16px 7px;
        gap: 7px;
        width: 47px;
        cursor: pointer;
        height: 53px;
        flex: none;
        order: 2;
        flex-grow: 0;
        z-index: 2;
        `;
    const SideMenuBody = styled(animated.div)`
        position: absolute;
        background: ${current.values.secondary};
        /* transition: all ease-in-out 1200ms; */
        flex: none;
        order: 1;
        gap: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow:hidden;
        flex-grow: 0;
        z-index: 1;
    `;
    const style_menu = useSpring({
        width: `${menuactive?233:42}px`,
        height: `${menuactive?100:5.6}%`,
        borderRadius: `${menuactive?'4px':'50%'}`,
        padding: `${menuactive?'70px 10px 10px':'0px 0px 0px'}`,
        right:`${menuactive?0:46.5}px`,
        top:`${menuactive?0:10}px`,
        opacity: menuactive?1:0,
        config:{
            friction:20,
            bounce:0
        }
    })
    const switchTO = (i: number, s: string) => {
        if (Object.keys(Modules).includes(s)) {
            setActiveTab(i)
        }
    }
    return (
        <Home>
            <Header>
                <TabsMenu>
                    {
                        Object.keys(Modules).map((s, i) =>
                            <TabMenu key={i} onClick={() => switchTO(i, s)}>
                                <p>{s}</p>
                            </TabMenu>
                        )
                    }
                </TabsMenu>
                <SideMenu onClick={()=>setMenuActive(s=>!s)}>
                        {menuactive ? <Active_menu /> : <Inactive_menu />}
                    </SideMenu>
            </Header>
            {
                Object.values(Modules)[ActiveTab].Component({})
            }
            <SideMenuBody style={style_menu}>
                {
                    Object.values(settings).map((d, i)=>{
                        return <d.Component title={d.title} key={i} />
                    })
                }
            </SideMenuBody>
        </Home>
    )
}