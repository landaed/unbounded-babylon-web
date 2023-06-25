precision highp float;
// Attributes
attribute vec3 position;
attribute vec2 uv;
// Uniforms
uniform mat4 worldViewProjection;
uniform float iTime;
uniform float currSel;
uniform mat4 uModelViewMatrix;
// Varying
varying vec2 vUV;
varying vec3 vPositionW;
void main(void) {
    vec3 pos = position;

    float time = iTime*10.;
    pos.y*=.5;
    if(currSel ==3.){
      time*=5.;
    }

    pos.x-=sin(position.y*20.+(time))*.02;
    pos.y-=cos(position.x*20.+(time))*.02;

    //pos.y*=-1.;
    gl_Position = worldViewProjection * vec4(pos, 1.0);
    vPositionW = position.xyz;
    vUV = uv;
}
