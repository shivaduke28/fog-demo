export interface Geometry {
    positions: Float32Array;
    normals: Float32Array;
    uvs: Float32Array;
    triangles: Uint16Array;
}

export function createTriangle(): Geometry {
    const vertices = new Float32Array(
        [
            0.0, 1.0, 0.0,
            - 1.0, -1.0, 0.0,
            1.0, -1.0, 0.0,
        ]
    );

    const normals = new Float32Array(
        [
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
        ]);
    const uvs = new Float32Array(
        [
            0.5, 1.0,
            0.0, 0.0,
            1.0, 0.0
        ]
    );

    return {
        positions: vertices,
        normals: normals,
        uvs: uvs,
        triangles: new Uint16Array(
            [
                0, 1, 2
            ]
        ),
    }
}

export function createQuad(): Geometry {
    const positions = new Float32Array(
        [
            -1.0, 1.0, 0.0,
            -1.0, -1.0, 0.0,
            1.0, -1.0, 0.0,
            1.0, 1.0, 0.0,
        ]
    );

    const normals = new Float32Array(
        [
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
        ]);
    const uvs = new Float32Array(
        [
            0.0, 1.0,
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0
        ]
    );


    const triangles = new Uint16Array(
        [
            0, 1, 2,
            0, 2, 3
        ]
    );

    return {
        positions: positions,
        normals: normals,
        uvs: uvs,
        triangles: triangles
    }
}

export function createCube(): Geometry {
    const vertices = new Float32Array(
        [
            // front
            -1.0, -1.0, 1.0,
            1.0, -1.0, 1.0,
            1.0, 1.0, 1.0,
            -1.0, 1.0, 1.0,
            // back
            -1.0, -1.0, -1.0,
            -1.0, 1.0, -1.0,
            1.0, 1.0, -1.0,
            1.0, -1.0, -1.0,
            // left
            -1.0, -1.0, -1.0,
            -1.0, -1.0, 1.0,
            -1.0, 1.0, 1.0,
            -1.0, 1.0, -1.0,
            // right
            1.0, -1.0, -1.0,
            1.0, 1.0, -1.0,
            1.0, 1.0, 1.0,
            1.0, -1.0, 1.0,
            // top
            1.0, 1.0, -1.0,
            -1.0, 1.0, -1.0,
            -1.0, 1.0, 1.0,
            1.0, 1.0, 1.0,
            // bottom
            -1.0, -1.0, 1.0,
            -1.0, -1.0, -1.0,
            1.0, -1.0, -1.0,
            1.0, -1.0, 1.0,
        ]);

    const normals = new Float32Array(
        [
            // front
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            // back
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
            // left

            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0,
            // right
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,

            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            // top
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            // bottom
            0.0, -1.0, 0.0,
            0.0, -1.0, 0.0,
            0.0, -1.0, 0.0,
            0.0, -1.0, 0.0,
        ]);

    const uvs = new Float32Array(
        [
            // front
            0.0, 1.0,
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            // back
            0.0, 1.0,
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            // left
            0.0, 1.0,
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            // right
            0.0, 1.0,
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            // top
            0.0, 1.0,
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            // bottom
            0.0, 1.0,
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
        ]);

    const triangles = new Uint16Array(
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
        positions: vertices,
        normals: normals,
        uvs: uvs,
        triangles: triangles
    };
}

export function flipNormal(geometry: Geometry): Geometry {
    const flippedNormals = new Float32Array(geometry.normals.length);
    for (let i = 0; i < geometry.normals.length; i++) {
        flippedNormals[i] = -geometry.normals[i];
    }

    // Flip the winding order of the triangles
    const flippedTriangles = new Uint16Array(geometry.triangles.length);
    for (let i = 0; i < geometry.triangles.length; i += 3) {
        flippedTriangles[i] = geometry.triangles[i + 2];
        flippedTriangles[i + 1] = geometry.triangles[i + 1];
        flippedTriangles[i + 2] = geometry.triangles[i];
    }

    return {
        ...geometry,
        normals: flippedNormals,
        triangles: flippedTriangles,
    };
}