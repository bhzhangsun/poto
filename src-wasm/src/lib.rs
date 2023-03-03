use image::ImageFormat;
use std::io::Cursor;
use wasm_bindgen::prelude::*;

pub mod life_game;

// 图片 转换

#[wasm_bindgen]
pub fn photo_render(path: String) -> Vec<u8> {
    // 读取文件
    let img = match image::open(path) {
        Ok(p) => p,
        Err(e) => {
            life_game::alert(&e.to_string());
            panic!("error")
        }
    };
    let mut buffer = Cursor::new(Vec::new());
    img.write_to(&mut buffer, ImageFormat::Png).unwrap();

    buffer.into_inner()
}
