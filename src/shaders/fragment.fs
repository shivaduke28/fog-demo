#version 300 es
precision mediump float;

in vec2 vertUv;
out vec4 fragColor;

void main() {
  fragColor = vec4(vertUv.x, vertUv.y, 0, 1.0);
}