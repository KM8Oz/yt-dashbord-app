import { Store } from "tauri-plugin-store-api"
function getvideo_thumb(id: string) {
    return `https://img.youtube.com/vi/${id}/0.jpg`
}
function youtube_parser(url: string) {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return (match && match[7].length == 11) ? match[7] : false;
}
// export interface VideoObject {
//     url: string,
//     thumb: string,
//     id: string
// }
export class AppStore {
    private store: Store
    private videos: Store

    constructor() {
        this.store = new Store("../../_emails.dat");
        this.videos = new Store("../../_videos.dat");
    }
    async setssid(ssid: string) {
        try {
            await this.store.set("ssid", ssid)
            await this.store.save()
        } catch (error) {
            console.log("error:", error);
        }
    }
    async ssid() {
        return await this.store.get("ssid")
    }
    async getvideos(){
        try {
           return await (await this.videos.entries()).map(s=>s[1])
        } catch (error) {
            return []
        }
    }
    async removevideo(id:string|undefined){
        try {
            if(id){
                await this.videos.delete(id)
                await this.videos.save()
                return true
            }
            return false
        } catch (error) {
            console.log(error);
            return false
        }
    }
    async add_video(url: string) {
        let parsed = youtube_parser(url)
        if (parsed) {
            try {
                await this.videos.delete(parsed)
                await this.videos.set(parsed, {
                    url: url,
                    thumb: getvideo_thumb(parsed),
                    id: parsed
                })
                await this.videos.save()
                return true
            } catch (error) {
                console.log(error);
                return false
            }
        } else {
            return false
        }
    }
}
