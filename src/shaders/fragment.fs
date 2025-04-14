#version 300 es
precision highp float;

struct VertexOutput {
  vec2 uv;
  vec3 normal;
  vec3 positionWS;
};

in VertexOutput v_out;
out vec4 fragColor;

uniform float u_time;
uniform vec4 u_color;
uniform vec3 u_cameraPosition;
uniform vec3 u_baseHeight;
uniform vec3 u_density;
uniform vec3 u_fallOff;
uniform vec3 u_uniformDensity;
uniform vec3 u_uniformColor;
uniform vec3 u_lightColor;

vec3 heightFogTransmittance(
  vec3 cameraPosition,
  vec3 view,
  float distance,
  vec3 baseHeight,
  vec3 density,
  vec3 fallOff,
  vec3 dir,
  vec3 uniformDensity
) {
  vec3 fv = fallOff * dot(dir, view);
  vec3 opticalDepth = density / fv * exp(-fallOff * (dot(cameraPosition, dir) - baseHeight)) * (exp(fv * distance) - baseHeight) + uniformDensity * distance;
  return exp(-opticalDepth);
}

void main() {
  vec2 uv = v_out.uv;
  vec3 l = normalize(vec3(0.2, 1.0, .5));
  vec3 n = normalize(v_out.normal);
  vec3 col = vec3(1.0) * u_color.rgb;
  col *= max(0.0, dot(n, l)) * u_lightColor.rgb;
  col += vec3(0.1) * u_color.rgb;

  vec3 view = normalize(u_cameraPosition - v_out.positionWS);
  float distance = length(v_out.positionWS - u_cameraPosition);

  vec3 trans = heightFogTransmittance(
    u_cameraPosition,
    view,
    distance,
    u_baseHeight,
    u_density,
    u_fallOff,
    vec3(0.0,1.0,0.0),
    u_uniformDensity
  );

  col = mix(u_uniformColor, col, trans);
  fragColor = vec4(col, 1.0);
}