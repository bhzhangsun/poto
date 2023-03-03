import { useEffect, useRef } from "react"
import styles from './index.module.less'

type Props = {
    image?: HTMLVideoElement | HTMLCanvasElement | ImageBitmap;
    width: number;
    height: number;
    onChange?: (canvas: HTMLCanvasElement, ratio: number) => void
}

function computeRatio(rawWidth: number, rawHeight: number, width: number, height: number) {
    if (rawWidth < width && rawHeight < height) return 1;
    // 适应大小后的边长 / 原始边长 越小，缩放成都越大 适应的值作为比率
    const wRatio = width / rawWidth;
    const hRatio = height / rawHeight;
    return wRatio < hRatio ? wRatio : hRatio;
}

/**
 * Canvas 图片查看
 */
export default (props: Props) => {
    const ref = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = ref.current;
        if (canvas && props.image) {
            const dpr = window.devicePixelRatio || 1;
            const ctx = canvas?.getContext('2d')
            const rawWidth: number = props.image.width as number;
            const rawHeight: number = props.image.height as number;
            const { width, height } = props;

            const ratio = computeRatio(rawWidth, rawHeight, width, height);
            const [w, h] = [rawWidth * ratio, rawHeight * ratio]
            canvas.width = Math.floor(w * dpr);
            canvas.height = Math.floor(h * dpr);

            canvas.style.width = `${w}px`
            canvas.style.height = `${h}px`
            console.log('raw size:', rawWidth, rawHeight, 'canvas size:', canvas.width, canvas.height)
            ctx?.drawImage(props.image, 0, 0, canvas.width, canvas.height)
            props.onChange && props.onChange(canvas, ratio)
        }
    }, [ref.current, props.image])
    return (
        <div className={styles.board} style={{ width: `${props.width}px`, height: `${props.height}px` }}>
            <canvas ref={ref}></canvas>
        </div>)
}