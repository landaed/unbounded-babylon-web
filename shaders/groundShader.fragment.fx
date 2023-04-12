precision highp float;

uniform mat4 worldViewProjection;
varying vec3 vNormal;
varying vec3 vWorldPosition;
uniform vec4 colour1;


void main(void) {
    vec3 lightPos = vec3(0,1,0);
    vec3 l = normalize(lightPos-vWorldPosition);
    vec3 amb = vec3(.5);

    float diff = clamp(dot(vNormal, l),0.,1.);

    gl_FragColor = vec4(vec3(.7,.7,0)*(diff+amb), 1.0);
    //normalize(cross(B-A,C-A))
}
