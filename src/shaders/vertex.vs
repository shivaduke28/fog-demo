#version 300 es

layout(location = 0) in vec3 position;
layout(location = 1) in vec2 uv;

struct VertexOutput {
    vec2 uv;
};

out VertexOutput vOut;

uniform mat4 mvpMatrix;

void main() {
    gl_Position = mvpMatrix * vec4(position, 1.0);
    vOut.uv = uv;
}