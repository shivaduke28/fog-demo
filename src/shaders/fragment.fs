#version 300 es
precision mediump float;

struct VertexOutput {
    vec2 uv;
};

in VertexOutput vOut;
out vec4 fragColor;

uniform float time;

void main() {
  vec2 uv = vOut.uv;
  fragColor = vec4(uv.x, uv.y, sin(time) * 0.5 + 0.5, 1.0);
}