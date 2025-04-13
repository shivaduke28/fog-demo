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

type ShaderProgram = {
    program: WebGLProgram,
    attributeLocations: {
        position: number,
        normal: number,
        uv: number,
    },
    uniformLocations: {
        mvpMatrix: WebGLUniformLocation | null,
        modelMatrix: WebGLUniformLocation | null,
        time: WebGLUniformLocation | null,
        color: WebGLUniformLocation | null,
    }
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

const createShaderProgram = (gl: WebGL2RenderingContext): ShaderProgram | null => {
    const program = createProgram(gl);
    if (!program) return null;

    const attributeLocations = {
        position: gl.getAttribLocation(program, 'position'),
        normal: gl.getAttribLocation(program, 'normal'),
        uv: gl.getAttribLocation(program, 'uv'),
    };

    const uniformLocations = {
        mvpMatrix: gl.getUniformLocation(program, 'mvpMatrix'),
        modelMatrix: gl.getUniformLocation(program, 'modelMatrix'),
        time: gl.getUniformLocation(program, 'time'),
        color: gl.getUniformLocation(program, 'color'),
    };

    return {
        program,
        attributeLocations,
        uniformLocations,
    };
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

const bindAttributes = (gl: WebGL2RenderingContext, program: ShaderProgram, renderTarget: RenderTarget) => {
    const attributeLocations = program.attributeLocations;
    gl.bindBuffer(gl.ARRAY_BUFFER, renderTarget.positionVBO);
    gl.vertexAttribPointer(attributeLocations.position, 3, gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT * 3, 0);
    gl.enableVertexAttribArray(attributeLocations.position);

    gl.bindBuffer(gl.ARRAY_BUFFER, renderTarget.normalVBO);
    gl.vertexAttribPointer(attributeLocations.normal, 3, gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT * 3, 0);
    gl.enableVertexAttribArray(attributeLocations.normal);

    gl.bindBuffer(gl.ARRAY_BUFFER, renderTarget.uvVBO);
    gl.vertexAttribPointer(attributeLocations.uv, 2, gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT * 2, 0);
    gl.enableVertexAttribArray(attributeLocations.uv);
}

type Uniforms = {
    modelMatrix: mat4,
    viewMatrix: mat4,
    projectionMatrix: mat4,
    mvpMatrix: mat4,
    time: number,
    color: vec4,
}

const bindUniforms = (gl: WebGL2RenderingContext, program: ShaderProgram, renderTarget: RenderTarget, uniforms: Uniforms) => {
    const uniformLocations = program.uniformLocations;
    const modelMatrix = uniforms.modelMatrix;
    const mvpMatrix = uniforms.mvpMatrix;
    const viewMatrix = uniforms.viewMatrix;
    const projectionMatrix = uniforms.projectionMatrix;

    mat4.fromRotationTranslationScale(modelMatrix,
        renderTarget.mesh.rotation,
        renderTarget.mesh.position,
        renderTarget.mesh.scale);
    mat4.multiply(mvpMatrix, viewMatrix, modelMatrix);
    mat4.multiply(mvpMatrix, projectionMatrix, mvpMatrix);

    gl.uniformMatrix4fv(uniformLocations.mvpMatrix, false, mvpMatrix);
    gl.uniformMatrix4fv(uniformLocations.modelMatrix, false, modelMatrix);
    gl.uniform4fv(uniformLocations.color, renderTarget.mesh.color);
    gl.uniform1f(uniformLocations.time, uniforms.time);
}


const WebGLCanvas: React.FC<WebGLCanvasProps> = ({ width = 800, height = 600 }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // 仮実装
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
        console.log(r, g, b);
    });

    // to avoid render loop run twice (becase of strict mode)
    var initialized = false;
    useEffect(() => {
        if (initialized) return;
        initialized = true;
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext('webgl2');

        if (!gl) {
            console.error('WebGLがサポートされていません');
            return;
        }

        const shaderProgram = createShaderProgram(gl);
        if (!shaderProgram) return;

        const renderTargets: RenderTarget[] = [];

        // build scene
        const cubeGeometry = createCube();
        const cubeMesh = createMesh(cubeGeometry);
        cubeMesh.position = vec3.fromValues(-1.0, 0, 0);
        cubeMesh.scale = vec3.fromValues(0.5, 0.5, 0.5);
        cubeMesh.color = vec4.fromValues(1, 0, 0, 1);
        const mesh = createRenderTarget(gl, cubeMesh);
        renderTargets.push(mesh);

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


        let uniforms: Uniforms = {
            modelMatrix: mat4.create(),
            viewMatrix: mat4.lookAt(mat4.create(),
                [0, 0, 5],
                [0, 0, 0],
                [0, 1, 0]
            ),
            projectionMatrix: mat4.perspective(mat4.create(),
                Math.PI / 3,
                width / height,
                .01,
                100
            ),
            mvpMatrix: mat4.create(),
            time: 0.0,
            color: vec4.fromValues(1, 1, 1, 1),
        };

        let loopCount = 0;
        const FPS = 60;
        const FPSInv = 1.0 / FPS;

        (function renderLoop() {
            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.clearDepth(1.0);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            loopCount += 1;
            uniforms.time = FPSInv * loopCount;

            gl.useProgram(shaderProgram.program);

            for (const target of renderTargets) {

                // animation
                vec3.add(target.mesh.position, target.mesh.position, vec3.fromValues(0, Math.sin(uniforms.time) * 0.01, 0.0));
                quat.rotateY(target.mesh.rotation, target.mesh.rotation, 0.01);

                bindAttributes(gl, shaderProgram, target);
                bindUniforms(gl, shaderProgram, target, uniforms);
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, target.ibo);
                gl.drawElements(gl.TRIANGLES, target.mesh.geomtry.triangles.length, gl.UNSIGNED_SHORT, 0);
            }

            setTimeout(renderLoop, 1000 * FPSInv);
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
