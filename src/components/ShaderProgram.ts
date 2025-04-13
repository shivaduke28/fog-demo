import vertexShaderSource from '../shaders/vertex.vs?raw'
import fragmentShaderSource from '../shaders/fragment.fs?raw'
import { mat4, vec3, vec4 } from 'gl-matrix'

export type Uniforms = {
    modelMatrix: mat4,
    viewMatrix: mat4,
    projectionMatrix: mat4,
    mvpMatrix: mat4,
    time: number,
    color: vec4,
    uniformDensity: number,
    cameraPosition: vec3,
    uniformColor: vec3,
}

export type ShaderProgram = {
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
        cameraPosition: WebGLUniformLocation | null,
        uniformDensity: WebGLUniformLocation | null,
        uniformColor: WebGLUniformLocation | null,
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

export const createShaderProgram = (gl: WebGL2RenderingContext): ShaderProgram | null => {
    const program = createProgram(gl);
    if (!program) return null;

    const attributeLocations = {
        position: gl.getAttribLocation(program, 'a_position'),
        normal: gl.getAttribLocation(program, 'a_normal'),
        uv: gl.getAttribLocation(program, 'a_uv'),
    };

    const uniformLocations = {
        mvpMatrix: gl.getUniformLocation(program, 'u_mvpMatrix'),
        modelMatrix: gl.getUniformLocation(program, 'u_modelMatrix'),
        time: gl.getUniformLocation(program, 'u_time'),
        color: gl.getUniformLocation(program, 'u_color'),
        uniformDensity: gl.getUniformLocation(program, 'u_uniformDensity'),
        cameraPosition: gl.getUniformLocation(program, 'u_cameraPosition'),
        uniformColor: gl.getUniformLocation(program, 'u_uniformColor'),
    };

    return {
        program,
        attributeLocations,
        uniformLocations,
    };
}

export const bindUniforms = (gl: WebGL2RenderingContext,
    program: ShaderProgram,
    uniforms: Uniforms) => {
    const uniformLocations = program.uniformLocations;
 
    gl.uniformMatrix4fv(uniformLocations.mvpMatrix, false, uniforms.mvpMatrix);
    gl.uniformMatrix4fv(uniformLocations.modelMatrix, false, uniforms.modelMatrix);
    gl.uniform4fv(uniformLocations.color, uniforms.color);
    gl.uniform1f(uniformLocations.time, uniforms.time);
    gl.uniform1f(uniformLocations.uniformDensity, uniforms.uniformDensity);
    gl.uniform3fv(uniformLocations.cameraPosition, uniforms.cameraPosition);
    gl.uniform3fv(uniformLocations.uniformColor, uniforms.uniformColor);
}