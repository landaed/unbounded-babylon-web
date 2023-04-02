precision highp float;
varying vec2 vUV;
uniform sampler2D textureSampler;
uniform vec3 lightPos;
varying vec3 vPositionW;

void main(void) {
    float l = 1.-smoothstep(2.,4.,length(vPositionW-lightPos));
  //  vec4 dynamicColor = texture2D(dynamicTexture, vUV);
    vec3 col = mix(vec3(0,1,1),vec3(1,1,0),min(l,.5))*max(l,.5);
    gl_FragColor = vec4(col,.5);//texture2D(textureSampler, vUV);
}
