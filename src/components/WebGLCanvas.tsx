import { mat4, quat, vec3, vec4 } from 'gl-matrix';
import React, { useRef, useEffect } from 'react'
import vertexShaderSource from '../shaders/vertex.vs?raw'
import fragmentShaderSource from '../shaders/fragment.fs?raw'
import { createCube } from './Geometry';
import { createMesh, Mesh } from './Mesh';
import { Pane } from 'tweakpane';

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

const createVBO = (gl: WebGL2RenderingContext, data: Float32Array): WebGLBuffer => {
    var vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    return vbo;
}

const createIBO = (gl: WebGL2RenderingContext, indices: Uint16Array): WebGLBuffer => {
    var ibo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    return ibo;
}

type RenderTarget = {
    mesh: Mesh,
    positionVBO: WebGLBuffer,
    normalVBO: WebGLBuffer,
    uvVBO: WebGLBuffer,
    ibo: WebGLBuffer,
    modelMatrix: mat4,
}

const createRenderTarget = (gl: WebGL2RenderingContext, mesh: Mesh): RenderTarget => {
    const positionVBO = createVBO(gl, mesh.geomtry.positions);
    const normalVBO = createVBO(gl, mesh.geomtry.normals);
    const uvVBO = createVBO(gl, mesh.geomtry.uvs);
    const ibo = createIBO(gl, mesh.geomtry.triangles!);

    return {
        mesh,
        positionVBO: positionVBO,
        normalVBO: normalVBO,
        uvVBO: uvVBO,
        ibo: ibo,
        modelMatrix: mat4.identity(mat4.create()),
    }
}

const WebGLCanvas: React.FC<WebGLCanvasProps> = ({ width = 800, height = 600 }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const pane = new Pane();
    const PARAMS = {
        factor: 123,
        title: 'hello',
        color: '#ff0055',
    };

    pane.addBinding(PARAMS, 'factor');
    pane.addBinding(PARAMS, 'title');
    pane.addBinding(PARAMS, 'color').on('change', (ev) => {
        const color = ev.value;
        const r = parseInt(color.slice(1, 3), 16) / 255;
        const g = parseInt(color.slice(3, 5), 16) / 255;
        const b = parseInt(color.slice(5, 7), 16) / 255;
        const color1 = vec3.fromValues(r, g, b);
        if (cube1) {
            cube1.mesh.color[0] = color1[0];
            cube1.mesh.color[1] = color1[1];
            cube1.mesh.color[2] = color1[2];
            console.log(cube1.mesh.color);
        }
    });

    let cube1: RenderTarget;

    var hoge = 0;

    useEffect(() => {
        console.log("hoge:", hoge);
        hoge += 1;
        console.log('useEffect');
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
        const modelLocation = gl.getUniformLocation(program, 'modelMatrix');
        const timeLocation = gl.getUniformLocation(program, 'time');
        const colorLocation = gl.getUniformLocation(program, 'color');

        const renderTargets: RenderTarget[] = [];

        // build scene
        const cubeGeometry = createCube();
        const cubeMesh = createMesh(cubeGeometry);
        cubeMesh.position = vec3.fromValues(-1.0, 0, 0);
        cubeMesh.scale = vec3.fromValues(0.5, 0.5, 0.5);
        cubeMesh.color = vec4.fromValues(1, 0, 0, 1);
        const mesh = createRenderTarget(gl, cubeMesh);
        renderTargets.push(mesh);
        cube1 = mesh;

        const cubeMesh2 = createMesh(cubeGeometry);
        cubeMesh2.position = vec3.fromValues(1.0, 0, 0);
        cubeMesh2.scale = vec3.fromValues(0.5, 0.5, 0.5);
        cubeMesh2.color = vec4.fromValues(0, 1, 0, 1);
        const mesh2 = createRenderTarget(gl, cubeMesh2);
        renderTargets.push(mesh2);

        const cubeMesh3 = createMesh(cubeGeometry);
        cubeMesh3.position = vec3.fromValues(0, 0, -10);
        cubeMesh3.scale = vec3.fromValues(3, 3, 3);
        cubeMesh3.color = vec4.fromValues(0, 0, 1, 1);
        const mesh3 = createRenderTarget(gl, cubeMesh3);
        renderTargets.push(mesh3);

        gl.enable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);

        const viewMatrix = mat4.create();
        const projectionMatrix = mat4.create();
        const mvpMatrix = mat4.create();

        mat4.lookAt(viewMatrix,
            [0, 0, 5],
            [0, 0, 0],
            [0, 1, 0]
        );

        mat4.perspective(projectionMatrix,
            Math.PI / 3,
            width / height,
            .01,
            100
        );

        let count = 0;
        let time = 0.0;


        (function renderLoop() {
            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.clearDepth(1.0);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            count += 1;
            time = 1.0 / 60.0 * count;

            gl.useProgram(program);

            for (const target of renderTargets) {
                gl.bindBuffer(gl.ARRAY_BUFFER, target.positionVBO);
                gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT * 3, 0);
                gl.enableVertexAttribArray(positionLocation);
                gl.bindBuffer(gl.ARRAY_BUFFER, target.normalVBO);
                gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT * 3, 0);
                gl.enableVertexAttribArray(normalLocation);
                gl.bindBuffer(gl.ARRAY_BUFFER, target.uvVBO);
                gl.vertexAttribPointer(uvLocation, 2, gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT * 2, 0);
                gl.enableVertexAttribArray(uvLocation);

                vec3.add(target.mesh.position, target.mesh.position, vec3.fromValues(0, Math.sin(time) * 0.01, 0.0));
                // rotate object
                quat.rotateY(target.mesh.rotation, target.mesh.rotation, 0.01);

                const modelMatrix = target.mesh.modelMatrix();
                mat4.multiply(mvpMatrix, viewMatrix, modelMatrix);
                mat4.multiply(mvpMatrix, projectionMatrix, mvpMatrix);

                gl.uniformMatrix4fv(mvpLocation, false, mvpMatrix);
                gl.uniformMatrix4fv(modelLocation, false, modelMatrix);
                gl.uniform4fv(colorLocation, target.mesh.color);

                gl.uniform1f(timeLocation, time);

                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, target.ibo);
                gl.drawElements(gl.TRIANGLES, target.mesh.geomtry.triangles.length, gl.UNSIGNED_SHORT, 0);
            }

            setTimeout(renderLoop, 1000 / 60);
        })();
    }, []);

    return (
        <canvas ref={canvasRef} width={width} height={height} style={{
            width: "100%",
            height: "auto",
        }} />
    );
}

export default WebGLCanvas
