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


    pos.x *=smoothstep(0.0,1.,-pos.y)*3.;
    pos.y *=3.;
    pos.y+=1.;
    float d = pos.y-centre.y;
    pos.y-=sin(pos.x*10.+(time))*.2*smoothstep(0.,.4,d);
    d = pos.y-centre.y;
    pos.x-=sin(position.y*20.+(time))*.1*smoothstep(0.,.9,d);
    pos.xy*=.8;
    //pos.y*=-1.;
    gl_Position = worldViewProjection * vec4(pos, 1.0);
    vPositionW = pos.xyz;
    vUV = uv;
}
