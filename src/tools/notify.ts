import macos_icon from '../assets/notification-icon.icns?raw';
// import macos_icon from '../assets/notification-icon.jpg?raw';
import win_icon from '../assets/notification-icon.ico?raw';
import linux_icon from '../assets/notification-icon.png?raw';
import { OsType, type, platform, Platform } from '@tauri-apps/api/os';
import { isPermissionGranted, requestPermission, sendNotification } from '@tauri-apps/api/notification';

export class ThisPlatform<T> {
    static type: Platform;
    constructor(type: Platform) {
        (async ()=>{
            ThisPlatform.type = type;
        })()
    }
   public select({ linux, win, macos }: { linux: any, win: any, macos: any }):T {
        switch (ThisPlatform.type) {
            case 'win32':
                return win;
            case 'darwin':
                return macos;
            default:
                return linux;
        }
    }
}
export const notify = async (title: string, body?: string) => {
    let _Platform = new ThisPlatform<string>(await platform());
    let icon = _Platform.select({
        macos: macos_icon,
        win: win_icon,
        linux: linux_icon,
        // linux: new URL('../assets/notification-icon.png?raw', import.meta.url).href,
    })
    let permissionGranted = await isPermissionGranted();
    if (!permissionGranted) {
        const permission = await requestPermission();
        permissionGranted = permission === 'granted';
    }
    if (permissionGranted) {
        title && body ? sendNotification({ title, body , icon}) : sendNotification({title:"Notification", body:title, icon });;
    }
}