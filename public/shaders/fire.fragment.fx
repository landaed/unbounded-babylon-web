precision highp float;
varying vec2 vUV;
uniform sampler2D textureSampler;
uniform vec3 lightPos;
varying vec3 vPositionW;
uniform vec3 centre;
void main(void) {
    float l = 1.-smoothstep(2.,4.,length(vPositionW-lightPos));
    float d = vPositionW.y-centre.y;
  //  vec4 dynamicColor = texture2D(dynamicTexture, vUV);
    vec3 col =mix(vec3(1,0,0),vec3(1,1,0),smoothstep(0.4,.0,d));
  //  col = mix(col,vec3(1,1,0),min(l,.5))*max(l,.5);
    gl_FragColor = vec4(col,.5);//texture2D(textureSampler, vUV);
}
