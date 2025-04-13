#version 300 es

in vec3 a_position;
in vec3 a_normal;
in vec2 a_uv;

struct VertexOutput {
    vec2 uv;
    vec3 normal;
    vec3 positionWS;
};

out VertexOutput v_out;

uniform mat4 u_mvpMatrix;
uniform mat4 u_modelMatrix;
uniform float u_time;

vec2 rot(vec2 p, float t) {
    float c = cos(t), s = sin(t);
    return vec2(c * p.x - s * p.y, s * p.x + c * p.y);
}

void main() {
    vec3 pos = a_position;
    gl_Position = u_mvpMatrix * vec4(pos, 1.0f);
    v_out.uv = a_uv;
    v_out.normal = normalize(u_modelMatrix * vec4(a_normal, 0.0f)).xyz;
    v_out.positionWS = (u_modelMatrix * vec4(pos, 1.0f)).xyz;
}