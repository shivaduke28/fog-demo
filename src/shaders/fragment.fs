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
  vec3 l = normalize(vec3(0.0, 1.0, 1.0));
  vec3 n = normalize(vOut.normal);
  vec3 col = vec3(1.0);
  col *= max(0.0, dot(n,l));
  fragColor = vec4(col, 1.0);
}