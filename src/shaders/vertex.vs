#version 300 es

layout(location = 0) in vec3 position;
layout(location = 1) in vec2 uv;

out vec2 vertUv;

uniform mat4 mvpMatrix;

void main() {
    gl_Position = mvpMatrix * vec4(position, 1.0);
    vertUv = uv;
}