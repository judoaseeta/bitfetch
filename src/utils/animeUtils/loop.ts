interface Option {
    duration: number;
    delay?: number;
    update: (n: number) => void;
}

export type Cancel = () => void;

function loop({ duration,update, delay = 0 }: Option): Cancel {
    let startTime: number;
    let animId: number;
    const step = (lastAnimTime: number) => {
        if (!startTime) {
            startTime = lastAnimTime + delay;
        }
        if (lastAnimTime > startTime) {
            const pastTime = lastAnimTime - startTime;
            const currentAnimTime = (pastTime % duration) / duration;
            update(currentAnimTime);
        }
        animId = window.requestAnimationFrame(step);
    };
    animId = window.requestAnimationFrame(step);
    return () => {
        console.log('canceleld');
        window.cancelAnimationFrame(animId);
    }
}

export default loop;