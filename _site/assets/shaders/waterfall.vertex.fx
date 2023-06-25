precision highp float;
// Attributes
attribute vec3 position;
attribute vec2 uv;
// Uniforms
uniform mat4 worldViewProjection;
uniform float iTime;
uniform mat4 uModelViewMatrix;
// Varying
varying vec2 vUV;
varying vec3 vPositionW;
void main(void) {
    vec3 pos = position;
  //  pos.x *=2.;
  //  pos.z *=.2;
    gl_Position = worldViewProjection * vec4(pos, 1.0);
    vPositionW = position.xyz;
    vUV = uv;
}
