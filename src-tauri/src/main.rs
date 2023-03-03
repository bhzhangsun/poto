#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use image::ImageFormat;
use std::{
    io::Cursor,
    time::{SystemTime, UNIX_EPOCH},
};

mod presist_sync;

#[tauri::command]
async fn photo_render(path: String) -> Result<Vec<u8>, String> {
    let begin = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_millis();
    // 读取文件
    let img = match image::open(path) {
        Ok(v) => v,
        Err(e) => return Err(e.to_string()),
    };
    println!(
        "read cost time:{:?}",
        SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_millis()
            - begin
    );

    let mut buffer = Cursor::new(Vec::new());

    let res = match img.write_to(&mut buffer, ImageFormat::Png) {
        Err(e) => Err(e.to_string()),
        Ok(_) => Ok(buffer.into_inner()),
    };

    println!(
        "deal cost time:{:?}",
        SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_millis()
            - begin
    );
    res
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![photo_render])
        .plugin(presist_sync::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
