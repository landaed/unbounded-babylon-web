precision highp float;
// Attributes
attribute vec3 position;
attribute vec2 uv;
// Uniforms
uniform mat4 worldViewProjection;
uniform float iTime;
uniform float currSel;
uniform float radius;
uniform mat4 uModelViewMatrix;
uniform vec3 centre;
// Varying
varying vec2 vUV;
varying vec3 vPositionW;

void main(void) {
    vec3 pos = position;

    float time = iTime*10.;
  //  pos.x*=2.;
    if(currSel ==2.){
      time*=5.;
    }
    float d = position.y-centre.y;
    pos.y-=sin(position.x*10.+(time))*.1*smoothstep(0.,.4,d);

    //pos.y*=-1.;
    gl_Position = worldViewProjection * vec4(pos, 1.0);
    vPositionW = position.xyz;
    vUV = uv;
}
