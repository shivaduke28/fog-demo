import { quat, vec3, vec4 } from "gl-matrix";
import { Geometry } from "./Geometry";

export interface Mesh {
    geomtry: Geometry;
    position: vec3;
    rotation: quat
    scale: vec3;
    color: vec4;
}

class MeshImpl implements Mesh {
    geomtry: Geometry;
    position: vec3;
    rotation: quat;
    scale: vec3;
    color: vec4;

    constructor(geometry: Geometry) {
        this.geomtry = geometry;
        this.position = vec3.fromValues(0, 0, 0);
        this.rotation = quat.create();
        this.scale = vec3.fromValues(1, 1, 1);
        this.color = vec4.fromValues(1, 1, 1, 1);
    }
}

export function createMesh(geometry: Geometry): Mesh {
    return new MeshImpl(geometry);
};