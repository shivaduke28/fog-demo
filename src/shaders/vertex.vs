#version 300 es
precision mediump float;

in vec3 position;
in vec3 normal;
in vec2 uv;

struct VertexOutput {
    vec2 uv;
    vec3 normal;
};

out VertexOutput vOut;

uniform mat4 mvpMatrix;
uniform mat4 modelMatrix;
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
    vOut.normal = normalize(modelMatrix * vec4(normal, 0.0f)).xyz;
}