#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]
mod handlers;
use directories::UserDirs;

use tauri::Manager;
use tauri_plugin_store::PluginBuilder;
fn main() {
  tauri::Builder::default()
    .plugin(PluginBuilder::default().build())
    .invoke_handler(tauri::generate_handler![
      handlers::machine_id,
      handlers::resize,
      handlers::startdrag
    ])
    .setup(|app| {
      if let Some(user_dirs) = UserDirs::new() {
          let _ = app.fs_scope().allow_directory(user_dirs.download_dir().unwrap(), true);
          let _ = app.fs_scope().allow_directory(user_dirs.desktop_dir().unwrap(), true);
      };
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
