import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { ReactComponent as Plus } from "../assets/plus.svg"
import { ReactComponent as Close } from "../assets/close.svg"
import { ReactComponent as Play } from "../assets/play.svg"
import { ReactComponent as Pause } from "../assets/pause.svg"
import { ReactComponent as Trash } from "../assets/trash.svg"
import { AppStore } from "../store/User";
import { EditUpdateVideo, getVideo, RemoveVideo } from "../tools/socket";
import { notify } from "../tools/notify";







const Panel = styled.div`
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
position: fixed;
left: 0px;
right: 0px;
top: 0px;
bottom: 0px;
background: rgba(0, 0, 0, 0.48);
border-radius: 6px;
z-index: 100;

.insider{
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
    position:relative;
    gap: 10px;
    width: 324px;
    height: 248px;
    background: #3F3F3F;
    box-shadow: 0px 0px 8px 3px rgba(0, 0, 0, 0.08);
    border-radius: 6px;
    flex: none;
    order: 0;
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
    .video-add{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 10px;
        gap: 10px;    
        width: 75%;
        flex: none;
        order: 1;
        flex-grow: 1;
        input {
            display: flex;
            flex-direction: row;
            align-items: center;
            padding: 10px;
            gap: 10px;
            width: 95%;
            height: 23px;
            background: #BEBEBE;
            box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
            border-radius: 22px;        
            flex: none;
            outline: unset;
            border: unset;
            order: 0;
            z-index: 200;
            flex-grow: 0;
            user-select:text !important;
            -webkit-user-drag:auto !important;
            font-family: 'Inter';
            font-style: normal;
            font-weight: 200;
            font-size: 16px;
            line-height: 19px;
            align-items: center;
            text-align: center;
            color: #444;
        }
        button{
            flex-direction: row;
            justify-content: center;
            align-items: center;
            padding: 0px;
            gap: 10px;
            width: 203px;
            height: 38px;
            background: #82AD7B;
            border-radius: 29px;
            flex: none;
            color:#fff;
            order: 1;
            flex-grow: 0;
            transform:scale(1);
            transition:all ease-in-out 200ms;
            :active{
                transform:scale(.98);
            }
        }
    }
}
`;

const Video = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 0px;
    cursor: pointer;
    gap: 10px;
    width: 199px;
    height: 142px;
    background: #3F3F3F;
    box-shadow: 1px 1px 0px 1px #9A9A9A;
    border-radius: 12px;
    flex: none;
    order: 0;
    flex-grow: 0;
    position:relative;
`;


export default {
    title: "Videos",
    Component: ({ ...props }: any) => {
        const [url, setUrl] = useState("")
        const [panel, setPanel] = useState(false)
        const [videos, setVideos] = useState<unknown[]>([])
        let store = new AppStore()
       const getvideos = ()=>{
            store.getvideos().then((list) => {
                setVideos(list)
            })
        }
        useEffect(() => {
            getvideos()
        }, [])
        const Wrapper = styled.div`
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: flex-start;
        padding: 7px;
        gap: 10px;
        flex: none;
        order: 1;
        align-self: stretch;
        flex-grow: 1;
        width: 96%;
        overflow-y: scroll;
        `;
        const Submit = () => {
            store.add_video(url).then((ee) => {
                if(ee){
                    getvideos()
                    setPanel(false)
                }
            })
        }
        return (
            <Wrapper>
                {
                    videos.map((s, i) => {
                        return <AsyncVideo update={getvideos} data={s} key={i} />
                    })
                }
                <AddVideo setPanel={setPanel} />
                {panel && <Panel>
                    <div className="insider">
                        <Close width={24} height={24} onClick={() => setPanel(false)} style={{
                            position: "absolute",
                            top: 10,
                            right: 10,
                            cursor: "pointer"
                        }} />
                        <p>Submit Video</p>
                        <div className="video-add">
                            <input
                                placeholder="url:  www.youtube.com...."
                                value={url}
                                type="text"
                                onChange={(ev) => {
                                    ev.preventDefault()
                                    setUrl(ev.currentTarget.value);
                                }} />
                            <button onClick={Submit} >Submit</button>
                        </div>
                    </div>
                </Panel>}
            </Wrapper>
        )
    }
}

const AddVideo = ({ ...props }) => {
    return (
        <Video>
            <Plus width={97} height={97} onClick={() => props.setPanel(true)} />
        </Video>
    )
}
const AsyncVideo = ({ ...props }) => {
    const [views, setViews] = useState(0)
    const [status, setStatus] = useState(false)
    const [videodata, setVideo] = useState<any>({})
    const [showstatus, setShowStatus] = useState(true)
    const Views = styled.div`
        width:auto;
        height:20px;
        border-radius:15px;
        background-color:#cccccc99;
        display:flex;
        justify-content:center;
        align-items:center;
        color:#fff;
        font-family:Inter;
        font-size:13px;
        font-weight:700;
        padding:2px 10px;
        position:absolute;
        right:5px;
        bottom:6px;
    `;
    const PlayPause = styled.div`
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 0px;
        isolation: isolate;
        position: absolute;
        width: 24px;
        height: 24px;
        right: 9px;
        top: 9px;
        flex: none;
        order: 0;
        flex-grow: 0;
        z-index: 0;
    `;
    const Status = styled.div<{started:boolean}>`
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding: 7px 10px;
        position: absolute;
        left: 8px;
        bottom: 8px;
        background: ${(props)=>props.started ? "#06DD76":"#DDAE06"};
        border-radius: 8px;
        flex: none;
        order: 1;
        flex-grow: 0;
        z-index: 1;
        p {
            font-family: 'Inter';
            font-style: normal;
            font-weight: 400;
            font-size: 8px;
            line-height: 0px;
            display: flex;
            align-items: center;
            text-align: center;
            letter-spacing: 0.15em;
            color: ${(props)=>props.started ? "#fff":"#000"};        
            flex: none;
            order: 0;
            flex-grow: 0;
        }
    `;
    const TrashIcon = styled(Trash)`
        position:absolute;
        left:7px;
        top:7px;
        transform:scale(1);
        transition:all ease-in-out 200ms;
        :active{
            transform:scale(.98);
        }
    `;
    const remove = () => {
        RemoveVideo({ video_id: props.data.id }).then(async () => {
            await notify("video", "removed!")
            props.update()
        })
    }
    const Change = () => {
        setShowStatus(false)
        if (status) {
            setStatus(false)
        } else {
            setStatus(true)
        }
        EditUpdateVideo({
            video_id: props.data.id,
            archived: !status
        }).then(() => {
            setShowStatus(true)
        })
    }
    useEffect(()=>{
        let int = setInterval(()=>{
            getVideo({ video_id:props.data.id }).then((res:any)=>{
                if(res){
                    if(res.status){
                        setVideo(res.video)
                        if(res.video){
                            setViews(res.video?.views || 0)
                        }
                    }
                }
            })
        },10000)
        return ()=>{
            clearInterval(int)
        }
    },[])
    return (
        <Video style={{
            backgroundImage: `url(${props.data.thumb})`,
            backgroundSize: "cover"
        }} >
            <Status started={videodata?.is_started}>
                <p>
                    {videodata?.is_started ? "Started" : "Pending"}
                </p>
            </Status>
            <TrashIcon width={18} height={20} onClick={remove} />
            {showstatus && <PlayPause onClick={Change}>
                {
                    status ?
                        <Pause width={24} height={24} /> :
                        <Play width={24} height={24} />
                }
            </PlayPause>}
            <Views>
                {views}
            </Views>
        </Video>
    )
}