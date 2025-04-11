import React, { useRef, useEffect } from 'react'

type WebGLCanvasProps = {
    width?: number;
    height?: number;
}

const WebGLCanvas: React.FC<WebGLCanvasProps> = ({ width = 800, height = 600 }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext('webgl');

        if (!gl) {
            console.error('WebGLがサポートされていません');
            return;
        }

        gl.clearColor(1, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
    })

    return (
        <canvas ref={canvasRef} width={width} height={height} />
    );
}

export default WebGLCanvas
