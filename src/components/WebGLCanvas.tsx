import { mat4 } from 'gl-matrix';
import React, { useRef, useEffect } from 'react'
import vertexShaderSource from '../shaders/vertex.vs?raw'
import fragmentShaderSource from '../shaders/fragment.fs?raw'

type WebGLCanvasProps = {
    width?: number;
    height?: number;
}

const WebGLCanvas: React.FC<WebGLCanvasProps> = ({ width = 800, height = 600 }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext('webgl2');

        if (!gl) {
            console.error('WebGLがサポートされていません');
            return;
        }

        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        const createShader = (type: number, source: string): WebGLShader | null => {
            const shader = gl.createShader(type);
            if (!shader) return null;
            gl.shaderSource(shader, source);
            gl.compileShader(shader);

            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error(gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }

            return shader;
        };

        const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

        if (!vertexShader || !fragmentShader) return;
        const program = gl.createProgram();
        if (!program) return;

        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error(gl.getProgramInfoLog(program));
            return;
        }

        gl.useProgram(program);

        // positionのbuffer
        const vertices = new Float32Array([
            0.0, 1.0, 0.0,
            -1.0, -1.0, 0.0,
            1.0, -1.0, 0.0,
        ]);
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/bufferData
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        // positionをattributeとしてセットする
        const positionLocation = gl.getAttribLocation(program, 'position');
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

        const uvData = new Float32Array([
            0.5, 1.0,
            0.0, 0.0,
            1.0, 0.0
        ]);

        const uvBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, uvData, gl.STATIC_DRAW);
        const uvLocation = gl.getAttribLocation(program, 'uv');
        gl.enableVertexAttribArray(uvLocation);
        gl.vertexAttribPointer(uvLocation, 2, gl.FLOAT, false, 0, 0);

        // 行列
        const createMvpMatrix = (): mat4 => {
            const m = mat4.create();
            const v = mat4.create();
            const p = mat4.create();
            const mvp = mat4.create();

            // modelは原点に置く
            mat4.identity(m);

            mat4.lookAt(v,
                [0, 0, 5],
                [0, 0, 0],
                [0, 1, 0]
            );

            mat4.perspective(p,
                Math.PI / 3,
                width / height,
                .01,
                100
            );

            mat4.multiply(mvp, v, m);
            mat4.multiply(mvp, p, mvp);
            return mvp;
        }

        const mvp = createMvpMatrix();
        var mvpLocation = gl.getUniformLocation(program, 'mvpMatrix');
        gl.uniformMatrix4fv(mvpLocation, false, mvp);

        gl.drawArrays(gl.TRIANGLES, 0, 3);
        gl.flush();
    }, []);

    return (
        <canvas ref={canvasRef} width={width} height={height} />
    );
}

export default WebGLCanvas
