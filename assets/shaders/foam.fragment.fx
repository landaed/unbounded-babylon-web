precision highp float;
varying vec2 vUV;
varying vec3 vNormal;
void main(void) {
  vec3 color = vec3(dot(normalize(vNormal),vec3(1,.5,1))) * 0.5 + 0.5;
  color = max(color,vec3(.5));
  gl_FragColor = vec4(color, .1);
}
