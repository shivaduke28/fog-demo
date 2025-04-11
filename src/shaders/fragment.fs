#version 300 es
precision mediump float;

struct VertexOutput {
  vec2 uv;
  vec3 normal;
};

in VertexOutput vOut;
out vec4 fragColor;

uniform float time;

void main() {
  vec2 uv = vOut.uv;
  fragColor = vec4(uv.x, uv.y, sin(time) * 0.5f + 0.5f, 1.0f);
}