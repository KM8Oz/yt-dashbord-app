extern crate machine_uid;
use tauri::*;
#[tauri::command]
pub async fn machine_id() -> Result<String> {
    let hwid = machine_uid::get();
    match hwid {
        Ok(m)=>Ok(m),
        Err(err)=> Ok(err.to_string())
    }
}
#[tauri::command]
pub fn startdrag(window: tauri::Window) -> Result<()> {
    window.start_dragging()
}
#[derive(Default, serde::Deserialize, serde::Serialize)]
pub struct SizeState {
  w: u32,
  h: u32,
}
#[tauri::command]
pub async fn resize(window: tauri::Window, size: SizeState) -> Result<()> { 
    if size.w < 400 {
        let _ = window.set_decorations(false);
        let _ = window.set_always_on_top(true);
    } else {
        let _ = window.set_decorations(true);
        let _ = window.set_always_on_top(false);
    }
    window.set_size(Size::Logical(LogicalSize { width: size.w as f64, height: size.h as f64 }))
}
