import { quat, vec3, vec4 } from "gl-matrix";
import { Geometry } from "./Geometry";

export type Mesh = {
    geomtry: Geometry;
    position: vec3;
    rotation: quat
    scale: vec3;
    color: vec4;
}

export function createMesh(geometry: Geometry): Mesh {
    return {
        geomtry: geometry,
        position: vec3.fromValues(0, 0, 0),
        rotation: quat.create(),
        scale: vec3.fromValues(1, 1, 1),
        color: vec4.fromValues(1, 1, 1, 1),
    }
};