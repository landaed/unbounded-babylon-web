precision highp float;

 attribute vec3 position;
 attribute vec3 normal;

 uniform mat4 world;
 uniform mat4 worldViewProjection;
 uniform float iTime;

 varying vec3 vNormal;
void main(void) {
    vec3 pos = position;

    float time = iTime*20.;
  //  pos.x*=2.5;
  //  pos.y*=.5;
    //pos.z*=.5;
  //  pos.y-=sin(position.x*10.+(time))*.1;
    pos.z-=cos(sin(position.x*10.)+(time))*.1;
    pos.y-=sin(sin(position.x*10.)+(time))*.1;
    pos.z-=sin(sin(position.x*10.)+(time))*.1;

    //pos.y*=-1.;
    gl_Position = worldViewProjection * vec4(pos, 1.0);
    vNormal = vec3(world * vec4(normal, 0.0));

}
