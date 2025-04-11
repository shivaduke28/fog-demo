export interface Mesh {
    vertices: Float32Array;
    vertexCount: number;
    indexBuffer?: Uint16Array;
}

export function createTriangle(): Mesh {
    const vertexData = new Float32Array(
        [
            // position, normal,   uv
            0.0, 1.0, 0.0,
            0.0, 0.0, 1.0,
            0.5, 1.0,
            - 1.0, -1.0, 0.0,
            0.0, 0.0, 1.0,
            0.0, 0.0,
            1.0, -1.0, 0.0,
            0.0, 0.0, 1.0,
            1.0, 0.0
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
            // position, normal, uv
            -1.0, 1.0, 0.0,
            0.0, 0.0, 1.0,
            0.0, 1.0,
            // position, normal, uv
            -1.0, -1.0, 0.0,
            0.0, 0.0, 1.0,
            0.0, 0.0,
            // position, normal, uv
            1.0, -1.0, 0.0,
            0.0, 0.0, 1.0,
            1.0, 0.0,
            // position, normal, uv
            1.0, 1.0, 0.0,
            0.0, 0.0, 1.0,
            1.0, 1.0
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

export function createCube(): Mesh {
    const vertexData = new Float32Array(
        [
            // front
            -1.0, -1.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0,
            1.0, -1.0, 1.0,
            0.0, 0.0, 1.0,
            1.0, 0.0,
            1.0, 1.0, 1.0,
            0.0, 0.0, 1.0,
            1.0, 1.0,
            -1.0, 1.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 1.0,
            // back
            -1.0, -1.0, -1.0,
            0.0, 0.0, -1.0,
            1.0, 0.0,
            -1.0, 1.0, -1.0,
            0.0, 0.0, -1.0,
            0.0, 1.0,
            1.0, 1.0, -1.0,
            0.0, 0.0, -1.0,
            1.0, 1.0,
            1.0, -1.0, -1.0,
            0.0, 0.0, -1.0,
            0.0, 0.0,
            // left
            -1.0, -1.0, -1.0,
            -1.0, 0.0, 0.0,
            0.0, 0.0,
            -1.0, -1.0, 1.0,
            -1.0, 0.0, 0.0,
            0.0, 1.0,
            -1.0, 1.0, 1.0,
            -1.0, 0.0, 0.0,
            1.0, 1.0,
            -1.0, 1.0, -1.0,
            -1.0, 0.0, 0.0,
            1.0, 0.0,
            // right
            1.0, -1.0, -1.0,
            1.0, 0.0, 0.0,
            0.0, 0.0,
            1.0, 1.0, -1.0,
            1.0, 0.0, 0.0,
            0.0, 1.0,
            1.0, 1.0, 1.0,
            1.0, 0.0, 0.0,
            1.0, 1.0,
            1.0, -1.0, 1.0,
            1.0, 0.0, 0.0,
            0.0, 0.0,
            // top
            1.0, 1.0, -1.0,
            0.0, 1.0, 0.0,
            0.0, 0.0,
            -1.0, 1.0, -1.0,
            0.0, 1.0, 0.0,
            1.0, 0.0,
            -1.0, 1.0, 1.0,
            0.0, 1.0, 0.0,
            1.0, 1.0,
            1.0, 1.0, 1.0,
            0.0, 1.0, 0.0,
            1.0, 1.0,
            // bottom
            -1.0, -1.0, 1.0,
            0.0, -1.0, 0.0,
            0.0, 1.0,
            -1.0, -1.0, -1.0,
            0.0, -1.0, 0.0,
            0.0, 0.0,
            1.0, -1.0, -1.0,
            0.0, -1.0, 0.0,
            1.0, 0.0,
            1.0, -1.0, 1.0,
            0.0, -1.0, 0.0,
            1.0, 1.0
        ]);

    const indexBuffer = new Uint16Array(
        [
            // front
            0, 1, 2,
            0, 2, 3,
            // back
            4, 5, 6,
            4, 6, 7,
            // left
            8, 9, 10,
            8, 10, 11,
            // right
            12, 13, 14,
            12, 14, 15,
            // top
            16, 17, 18,
            16, 18, 19,
            // bottom
            20, 21, 22,
            20, 22, 23
        ]
    );

    return {
        vertices: vertexData,
        vertexCount: 24,
        indexBuffer: indexBuffer
    };
}