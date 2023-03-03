import initMoji, { Universe } from 'moji-wasm';
import { useEffect } from 'react';

import view from '@/core/view';

import styles from './index.module.less'

let universe: Universe | null = null;
const Egg = () => {
    const renderLoop = () => {
        const pre = document.getElementById("game-of-life-canvas");
        pre!.textContent = universe?.render() || '';
        universe?.tick();

        setTimeout(() => {
            requestAnimationFrame(renderLoop);
        }, 1000);
    };

    useEffect(() => {
        initMoji().then(() => {
            universe = Universe.new(64, 64);
            renderLoop();
        })
    }, [])

    return <pre className={styles.game} id="game-of-life-canvas"> </pre>
}


view.setup(async () => initMoji()).render(<Egg></Egg>);