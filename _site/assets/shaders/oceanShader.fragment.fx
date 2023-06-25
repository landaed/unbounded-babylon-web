precision highp float;

uniform mat4 worldViewProjection;
varying vec3 vNormal;
varying vec3 vWorldPosition;
uniform vec4 colour1;
uniform vec3 camPos;


void main(void) {
    vec3 lightPos = vec3(0,1,0);
    vec3 l = normalize(lightPos-vWorldPosition);
    float diff = clamp(dot(vNormal, l),0.,1.);
    vec3 amb = vec3(.5);
    vec3 fresnel = vec3(dot(vNormal,- normalize(vWorldPosition-camPos)));
    gl_FragColor = vec4((vec3(0,0,1)+fresnel)*(diff+amb), .5);
}
