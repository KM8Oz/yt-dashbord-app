import { invoke } from '@tauri-apps/api/tauri'


export const get_machine_id = (): Promise<any> => {
    return invoke('machine_id') as any;
}
export const resize_win = (w:number,h:number): Promise<any> => {
    return invoke('resize', { size: { w,h } }) as any;
}
export const startdrag = (): Promise<any> => {
    return invoke('startdrag') as any;
}