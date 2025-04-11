import { mat4 } from 'gl-matrix';
import React, { useRef, useEffect } from 'react'
import vertexShaderSource from '../shaders/vertex.vs?raw'
import fragmentShaderSource from '../shaders/fragment.fs?raw'
import { createQuad, createTriangle } from './Mesh';

type WebGLCanvasProps = {
    width?: number;
    height?: number;
}

const createProgram = (gl: WebGL2RenderingContext): WebGLProgram | null => {
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

    if (!vertexShader || !fragmentShader) return null;
    const program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program));
        return null;
    }
    return program;
}

const createVBO = (gl: WebGL2RenderingContext, vertices: Float32Array): WebGLBuffer | null => {
    var vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    return vbo;
}

const createIBO = (gl: WebGL2RenderingContext, indices: Uint16Array | undefined): WebGLBuffer | null => {
    if (!indices) return null;

    var ibo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    return ibo;
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

        const program = createProgram(gl);
        if (!program) return;

        const positionLocation = gl.getAttribLocation(program, 'position');
        const normalLocation = gl.getAttribLocation(program, 'normal');
        const uvLocation = gl.getAttribLocation(program, 'uv');

        const mvpLocation = gl.getUniformLocation(program, 'mvpMatrix');
        const timeLocation = gl.getUniformLocation(program, 'time');

        const mesh = createQuad();
        const vbo = createVBO(gl, mesh.vertices);
        const ibo = createIBO(gl, mesh.indexBuffer!);

        const stride = Float32Array.BYTES_PER_ELEMENT * (3 + 3 + 2);

        // bufferをbindしてattributeを設定
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, stride, 0);
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, stride, Float32Array.BYTES_PER_ELEMENT * 3);
        gl.enableVertexAttribArray(normalLocation);
        gl.vertexAttribPointer(uvLocation, 2, gl.FLOAT, false, stride, Float32Array.BYTES_PER_ELEMENT * (3 + 3));
        gl.enableVertexAttribArray(uvLocation);

        gl.enable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);

        // 行列
        const createMvpMatrix = (): mat4 => {
            const m = mat4.create();
            const v = mat4.create();
            const p = mat4.create();
            const mvp = mat4.create();

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

        let count = 0;

        (function renderLoop() {
            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.clearDepth(1.0);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
            gl.useProgram(program);
            gl.uniformMatrix4fv(mvpLocation, false, mvp);

            const time = 1.0 / 60.0 * count;
            gl.uniform1f(timeLocation, time);

            if (ibo) {
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
                gl.drawElements(gl.TRIANGLES, mesh.indexBuffer!.length, gl.UNSIGNED_SHORT, 0);
            } else {
                gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
                gl.drawArrays(gl.TRIANGLES, 0, 3);
            }
            gl.flush();

            count = count + 1;
            setTimeout(renderLoop, 1000 / 60);
        })();
    }, []);

    return (
        <canvas ref={canvasRef} width={width} height={height} />
    );
}

export default WebGLCanvas
