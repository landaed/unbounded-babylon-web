precision highp float;
varying vec2 vUV;
uniform sampler2D textureSampler;
uniform vec3 lightPos;
varying vec3 vPositionW;

void main(void) {
    float l = 1.-smoothstep(0.,4.,length(vPositionW));
    float d = 1.-smoothstep(1.3,1.5,length(vPositionW));
  //  vec4 dynamicColor = texture2D(dynamicTexture, vUV);
    vec3 col = mix(vec3(0,1,1),vec3(1,1,0),min(l,.5))*max(l,.5);
  //  col = mix(col,vec3(1),d);
    gl_FragColor = vec4(col,.5);//texture2D(textureSampler, vUV);
}
