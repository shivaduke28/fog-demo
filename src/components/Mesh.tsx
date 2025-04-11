export interface Mesh {
    vertices: Float32Array;
    vertexCount: number;
    indexBuffer?: Uint16Array;
}


export function createTriangle(): Mesh {
    const vertexData = new Float32Array(
        [
            // position, uv
            0.0, 1.0, 0.0, 0.5, 1.0,
            - 1.0, -1.0, 0.0, 0.0, 0.0,
            1.0, -1.0, 0.0, 1.0, 0.0
        ]
    );

    return {
        vertices: vertexData,
        vertexCount: 3
    }
}

export function createQuad(): Mesh {
    const vertexData = new Float32Array(
        [
            // position, uv
            -1.0, 1.0, 0.0, 0.0, 1.0,
            -1.0, -1.0, 0.0, 0.0, 0.0,
            1.0, -1.0, 0.0, 1.0, 0.0,
            1.0, 1.0, 0.0, 1.0, 1.0
        ]
    );

    const indexBuffer = new Uint16Array(
        [
            0, 1, 2,
            0, 2, 3
        ]
    );

    return {
        vertices: vertexData,
        vertexCount: 4,
        indexBuffer: indexBuffer
    }
}