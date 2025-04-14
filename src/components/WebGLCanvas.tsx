import { mat4, vec3, vec4 } from 'gl-matrix';
import React, { useRef, useEffect } from 'react'
import { createCube, flipNormal } from './Geometry';
import { createMesh, Mesh } from './Mesh';
import { Pane } from 'tweakpane';
import { bindUniforms, createShaderProgram, ShaderProgram, Uniforms } from './ShaderProgram';

type WebGLCanvasProps = {
    width?: number;
    height?: number;
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

type Camera = {
    position: vec3,
    lookAt: vec3,
    up: vec3,
}

type Scene = {
    renderTargets: RenderTarget[],
    camera:

    Camera,
}

const cubeSeeds: number[] = [];

const createScene = (gl: WebGL2RenderingContext): Scene => {
    const renderTargets: RenderTarget[] = [];

    const cubeGeometry = createCube();
    const count = 10;
    for (let i = 0; i < count; i++) {
        for (let j = 0; j < count; j++) {
            const x = (i - 0.5 * (count - 1.0)) * 4;
            const z = (j - 0.5 * (count - 1.0)) * 4;
            const cubeMesh = createMesh(cubeGeometry);
            cubeMesh.position = vec3.fromValues(x, 4, z);
            cubeMesh.scale = vec3.fromValues(0.5, 8, 0.5);
            vec4.set(cubeMesh.color, 1, 1, 1, 1);
            const mesh = createRenderTarget(gl, cubeMesh);
            renderTargets.push(mesh);
            cubeSeeds.push(Math.random());
        }
    }

    const cubeFlipped = flipNormal(cubeGeometry);
    const quadMesh = createMesh(cubeFlipped);
    vec3.set(quadMesh.position, 0, 5, 0);
    vec3.set(quadMesh.scale, 20, 10, 20);
    vec4.set(quadMesh.color, 0.8, 0.8, 0.8, 1);
    const quadMeshRenderTarget = createRenderTarget(gl, quadMesh);
    renderTargets.push(quadMeshRenderTarget);

    return {
        renderTargets,
        camera: {
            position: vec3.fromValues(42, 40, 30),
            lookAt: vec3.fromValues(0, 8, 0),
            up: vec3.fromValues(0, 1, 0),
        }
    }
}

const updateUniforms = (renderTarget: RenderTarget,
    uniforms: Uniforms) => {
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
    vec4.copy(uniforms.color, renderTarget.mesh.color);
}

const animateCubes = (renderTargets: RenderTarget[], time: number) => {
    for (let i = 0; i < renderTargets.length - 1; i++) {
        const target = renderTargets[i];
        const mesh = target.mesh;
        const position = mesh.position;
        const scale = mesh.scale;

        scale[1] = Math.sin(time * 3 + cubeSeeds[i] * 10) * 1.0 + 9.0;
        position[1] = scale[1] * 0.5;
    }
}

const createPane = (uniforms: Uniforms) => {
    const bindRGB = (pane: Pane, vec: vec3, name: string, min: number, max: number) => {
        const params = {
            R: vec[0],
            G: vec[1],
            B: vec[2],
        }
        const folder = pane.addFolder({
            title: name,
            expanded: true,
        });
        folder.addBinding(params, 'R', { min, max }).on('change', (ev) => {
            vec[0] = ev.value;
        });
        folder.addBinding(params, 'G', { min, max }).on('change', (ev) => {
            vec[1] = ev.value;
        });
        folder.addBinding(params, 'B', { min, max }).on('change', (ev) => {
            vec[2] = ev.value;
        });
    };

    const pane = new Pane({
        title: 'Parameters',
        expanded: true,
    });

    bindRGB(pane, uniforms.baseHeight, 'Base Height', 0, 20);
    bindRGB(pane, uniforms.density, 'Density', 0, 1);
    bindRGB(pane, uniforms.fallOff, 'Fall Off', 0.001, 2);
    bindRGB(pane, uniforms.uniformDensity, 'Uniform Density', 0, 0.1);

    const PARAMS = {
        fogColor: { r: uniforms.uniformColor[0], g: uniforms.uniformColor[1], b: uniforms.uniformColor[2] },
        cameraPosition: { x: uniforms.cameraPosition[0], y: uniforms.cameraPosition[1], z: uniforms.cameraPosition[2] },
    };

    pane.addBinding(PARAMS, 'fogColor', { color: { type: 'float' } }).on('change', (ev) => {
        const color = ev.value;
        vec3.set(uniforms.uniformColor, color.r, color.g, color.b);
    });

    pane.addBinding(PARAMS, 'cameraPosition').on('change', (ev) => {
        const position = ev.value;
        vec3.set(uniforms.cameraPosition, position.x, position.y, position.z);
    });
}

const WebGLCanvas: React.FC<WebGLCanvasProps> = ({ width = 1080, height = 720 }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    let uniforms: Uniforms = {
        modelMatrix: mat4.create(),
        viewMatrix: mat4.create(),
        // projectionMatrix: mat4.perspective(mat4.create(),
        //     Math.PI / 3,
        //     width / height,
        //     .01,
        //     100
        // ),
        projectionMatrix: mat4.ortho(mat4.create(),
            -15, 15,
            -15, 15,
            -100, 1000
        ),
        mvpMatrix: mat4.create(),
        time: 0.0,
        color: vec4.fromValues(1, 1, 1, 1),
        uniformDensity: vec3.fromValues(0.0, 0.0, 0.0),
        cameraPosition: vec3.fromValues(40, 40, 30),
        uniformColor: vec3.fromValues(0.2, 0.1, 0.0),
        baseHeight: vec3.fromValues(8, 8, 8),
        density: vec3.fromValues(0.5, 0.5, 0.5),
        fallOff: vec3.fromValues(0.5, 0.5, 0.5),
    };

    createPane(uniforms);

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

        const scene = createScene(gl);
        const renderTargets = scene.renderTargets;

        gl.enable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);

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

            // update camera
            // vec3.copy(uniforms.cameraPosition, scene.camera.position);
            mat4.lookAt(uniforms.viewMatrix,
                uniforms.cameraPosition,
                scene.camera.lookAt,
                scene.camera.up
            );

            animateCubes(renderTargets, uniforms.time);

            for (const target of renderTargets) {
                bindAttributes(gl, shaderProgram, target);
                updateUniforms(target, uniforms);
                bindUniforms(gl, shaderProgram, uniforms);
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
