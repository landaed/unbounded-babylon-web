precision highp float;
varying vec2 vUV;
uniform sampler2D textureSampler;
uniform float iTime;

void main(void) {
    vec2 uv = vUV;
    uv.y+=iTime*.6;
    uv.y = fract(uv.y*2.);

    float time = sin(iTime);
    uv.y+=sin(uv.x*50.+iTime*10.)*.1;
    vec3 col = vec3(1.-(smoothstep(.59,.6,uv.y)+smoothstep(.5,.49,uv.y)));
    col=max(col,vec3(0,1,1));
    gl_FragColor = vec4(col,1);//texture2D(textureSampler, vUV);
}
