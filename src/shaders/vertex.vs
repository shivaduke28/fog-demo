#version 300 es
precision mediump float;

layout(location = 0) in vec3 position;
layout(location = 1) in vec2 uv;

struct VertexOutput {
    vec2 uv;
};

out VertexOutput vOut;

uniform mat4 mvpMatrix;
uniform float time;

vec2 rot(vec2 p, float t) {
    float c = cos(t), s = sin(t);
    return vec2(c * p.x - s * p.y, s * p.x + c * p.y);
}

void main() {
    vec3 pos = position;
    pos.xz = rot(pos.xz, time);
    gl_Position = mvpMatrix * vec4(pos, 1.0f);
    vOut.uv = uv;
}