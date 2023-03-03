
import React, { useEffect, useState } from "react";
import { Button, MenuList, MenuItem } from '@fluentui/react-components';
import { invoke } from '@tauri-apps/api'
import { open, OpenDialogOptions } from '@tauri-apps/api/dialog';
import { pictureDir } from '@tauri-apps/api/path';
import { readBinaryFile, BaseDirectory } from '@tauri-apps/api/fs';
import view from '@/core/view'
import { selectFile } from '@/tools/file';
import Canvas from '@/components/Canvas';
import start from "@/assets/start.svg";
import initMoji, { photo_render } from 'moji-wasm';

import "@/style.css";
import styles from './index.module.less'

let times = 0;

const Home = () => {
  const [photo, setPhoto] = useState<ImageBitmap>()

  const openImageFromFile = async (path: string) => {
    const start = Date.now()
    const buffer = await readBinaryFile(path)
    console.log('read file cost:', Date.now() - start);
    const blob = new Blob([buffer], { type: `image/${path.split('.').pop()}` })
    console.log('blob:', blob);
    const bitmap = await createImageBitmap(blob)
    console.log('deal file cost:', Date.now() - start);
    setPhoto(bitmap)
  }

  const openImage = async (buffer: Uint8Array) => {
    const blob = new Blob([buffer], { type: 'image/png' })
    console.log('blob:', blob);
    const bitmap = await createImageBitmap(blob)
    console.log('bitmap:', bitmap);
    setPhoto(bitmap)
  }

  const openFolder = async () => {
    const dir = await open({
      title: '打开相册',
      directory: true,
      defaultPath: await pictureDir(),
    });
  }


  const openPhoto = async () => {
    const selected = await open({
      multiple: true,
      title: '选择照片',
      filters: [{
        name: 'Image',
        extensions: ['png', 'PNG', 'JPG', 'jpg', 'JPEG', 'jpeg', 'psd']
      }],
    });

    // selected && openImage([...selected])
    const paths = Array.isArray(selected) ? selected : selected ? [selected] : [];

    for (const path of paths) {
      // const start = Date.now()
      // const buffer = await invoke('photo_render', { path })
      // console.log("data:", Uint8Array.from(buffer as Array<number>))
      // console.log(`time cost:${(Date.now() - start) / 1000}s`)
      // openImage(Uint8Array.from(buffer as Array<number>))
      openImageFromFile(path)
    }
    console.log('selected:', selected)
  }


  return (<div>
    <div className={styles.home}>
      <div className={styles.asider}>
      </div>
      <div className={styles.body}>
        {photo ? <Canvas width={720} height={600} image={photo}></Canvas> :
          <div className={styles.opener}>

            <img src={start}></img>
            <Button className={styles.open_btn} appearance='primary' onClick={openPhoto}>打开照片</Button>
            <Button className={styles.open_btn} appearance='primary' onClick={openFolder}>打开相册</Button>
          </div>}
      </div>
    </div>
  </div >)
}


view.setup(async () => initMoji()).render(<Home></Home>);
