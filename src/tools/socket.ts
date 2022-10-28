import io from "socket.io-client";
import { AppStore } from "../store/User";
import { get_machine_id } from "./machine_id";
export const IOPublic= io("wss://keyclock.oldidev.ru/public");
export const IOPrivate = (vale:any) => io("wss://keyclock.oldidev.ru/private", {
    query:{
        tk: vale
    }
});
export const IOAdmin = io("wss://keyclock.oldidev.ru/admin");
export const EditUpdateVideo = ({
    video_id,
    archived
}:{
    video_id?:string,
    archived?:boolean
})=>{
    return new Promise((resolve, reject)=>{
        const User = new AppStore();
    get_machine_id().then((ID)=>{
        User.ssid().then((ssid)=>{
            if(!ssid) resolve({status:false})
            IOPrivate(ssid).emit("call", "videos.addOrUpdate", { machine: ID, video_id, archived }, (res: any, err: any)=>{
                console.log({res, err});
                resolve({status:true})
            })
        })
    })
    })    
}
export const RemoveVideo = ({
    video_id,
}:{
    video_id?:string,
})=>{
    return new Promise((resolve, reject)=>{
        const User = new AppStore();
    get_machine_id().then((ID)=>{
        User.ssid().then((ssid)=>{
            if(!ssid) resolve({status:false})
            IOPrivate(ssid).emit("call", "videos.remove", { machine: ID, video_id }, (err: any, res: any)=>{
                if(res.status){
                    User.removevideo(video_id).then(()=>{
                        resolve({status:true})
                    })
                } else {
                    resolve({status:false})
                }
            })
        })
    })
    })    
}
export const getVideo = ({
    video_id,
}:{
    video_id?:string,
})=>{
    return new Promise((resolve, reject)=>{
        const User = new AppStore();
    get_machine_id().then((ID)=>{
        User.ssid().then((ssid)=>{
            if(!ssid) resolve({status:false})
            IOPrivate(ssid).emit("call", "videos.getVideo", { machine: ID, video_id }, (err: any, res: any)=>{
                if(res.status){
                    resolve({status:true, video: res.video})
                } else {
                    resolve({status:false})
                }
            })
        })
    })
    })    
}
