import { mat4, quat, vec3, vec4 } from "gl-matrix";
import { Geometry } from "./Geometry";

export interface Mesh {
    geomtry: Geometry;
    position: vec3;
    rotation: quat
    scale: vec3;
    color: vec4;
    modelMatrix(): mat4;
}

class MeshImpl implements Mesh {
    geomtry: Geometry;
    position: vec3;
    rotation: quat;
    scale: vec3;
    color: vec4;
    private mat: mat4;

    modelMatrix() { 
        mat4.fromRotationTranslationScale(this.mat, this.rotation, this.position, this.scale);
        return this.mat;
     };

    constructor(geometry: Geometry) {
        this.geomtry = geometry;
        this.position = vec3.fromValues(0, 0, 0);
        this.rotation = quat.create();
        this.scale = vec3.fromValues(1, 1, 1);
        this.color = vec4.fromValues(1, 1, 1, 1);
        this.mat = mat4.create();
    }
}

export function createMesh(geometry: Geometry): Mesh {
    return new MeshImpl(geometry);
};