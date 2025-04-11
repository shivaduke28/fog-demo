#version 300 es
precision mediump float;

struct VertexOutput {
    vec2 uv;
};

in VertexOutput vOut;
out vec4 fragColor;

void main() {
  vec2 uv = vOut.uv;
  fragColor = vec4(uv.x, uv.y, 0, 1.0);
}