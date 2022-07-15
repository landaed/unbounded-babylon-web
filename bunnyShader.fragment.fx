precision highp float;

uniform mat4 worldView;

varying vec4 vPosition;
varying vec3 vNormal;
varying vec2 vUV;
uniform sampler2D textureSampler;
uniform sampler2D refSampler;

uniform float iTime;
mat2 rotate(float r) {
    float c = cos(r);
    float s = sin(r);
    return mat2(c, -s, s, c);
}

vec3 circle (vec2 uv, float posX, float posY, float r, float blur, vec3 color){
    uv.x-=posX;
    uv.y-=posY;

    float d = length(uv);
    return color * vec3(smoothstep(r,r-blur,d));
}
vec3 circle (vec2 uv, float r, float blur, vec3 color){
    float d = length(uv);
    return color * vec3(smoothstep(r,r-blur,d));
}
vec3 square(vec2 uv, float w, float h, float posX, float posY, float rot, float blur, vec3 color){
    uv*=rotate(rot);
    float wPos = length(uv.x-posX);
    float hPos = length(uv.y-posY);

    float col = smoothstep(w,w-blur, wPos);
    col *= smoothstep(h,h-blur, hPos);
    return color*vec3(col);
}
vec3 triangle(vec2 uv, float w, float h, float posX, float posY, float rot, float blur, vec3 color){
    uv.x-=posX;
    uv.y-=posY;
    uv*=rotate(rot);
    vec3 sq = square(uv,w,h,0.,0.,0.,blur,color);
    uv*=rotate(3.1415/2./2.);
    uv-= vec2(0.,h);
    float hyp = sqrt(w*w + h*h);
    vec3 sqMask = square(uv,hyp,h,0.,0., 0.,blur,color);
    sq -= sqMask;
    return sq;
}
vec3 ellipse(vec2 uv, float posX, float posY, float rot, float a,float b, float blur, vec3 color){
    uv -= vec2(posX,posY);
    uv*=rotate(rot);
    float x = uv.x;
    float y = sqrt((1.-a)*(1.-((x*x)/(1.-b))));
    float d = length(uv);
    return color * vec3(smoothstep(y,y-blur,d));
}
void main(void) {
      vec2 uv = vUV;
      uv-=.5;
     //background
     float blur = 0.01;
     vec3 col = square(uv, 1., .3, 0., -.4,0., blur, vec3(0,.5,.2));
     col = max(col, square(uv, 1., .3, 0., .2,0., blur, vec3(0.,0.,.5)));

     //ears
     float a = 0.95;
     float b = 0.995;
     float posX = -0.1;
     float posY = 0.14;
     float rot = -0.1;

     //left ear outline
     col = min(col,col-ellipse(uv, posX, posY-sin(iTime)*.025, rot, a, b, blur, vec3(1.)));

     //left ear fill
     a = 0.96;
     b = 0.997;
     col = max(col,ellipse(uv, posX, posY-sin(iTime)*.025, rot, a, b, blur, vec3(1.)));

     //right ear outline
     a = 0.95;
     b = 0.995;
     posX = 0.1;
     posY = 0.14;
     rot = 0.1;
     col = min(col,col-ellipse(uv, posX, posY-sin(iTime)*.025, rot, a, b, blur, vec3(1.)));

     //right ear fill
     a = 0.96;
     b = 0.997;
     col = max(col,ellipse(uv, posX, posY-sin(iTime)*.025, rot, a, b, blur, vec3(1.)));
     //legs
     col = min(col,col-circle (uv - vec2(.1,-.46), .08, blur, vec3(1.)));
     col = max(col,circle (uv - vec2(.1,-.46), .07, blur, vec3(1.)));
     col = min(col,col-circle (uv - vec2(-.06,-.46), .08, blur, vec3(1.)));
     col = max(col,circle (uv - vec2(-.06,-.46), .07, blur, vec3(1.)));
     //shirt
     a = 0.93;
     b = 0.91;
     posX = 0.;
     posY = -0.35;
     rot = 3.14159/2.;

     col = min(col, col-ellipse(uv, posX, posY, rot, a, b, blur, vec3(1.))+square(uv, .3, .1, 0., -0.44,0., blur, vec3(1)));
     a = 0.935;
     b = 0.92;
     col = max(col, ellipse(uv, posX, posY, rot, a, b, blur, vec3(1.,.4,.0))-square(uv, .254, .1, 0., -0.42,0., blur, vec3(1)));


     a = 0.93;
     b = 0.99;
     posY = -0.4;
     col = min(col, col-ellipse(uv, posX, posY, rot, a, b, blur, vec3(1.)));
     a = 0.9299;
     b = 0.988;
     posY = -0.382;
     col = max(col, ellipse(uv, posX, posY, rot, a, b, blur, vec3(1.,.4,0)));

     col = min(col, col - square(uv, .263, .05, 0., -0.37,0., blur, vec3(1)));
     col = max(col, square(uv, .249, .056, 0., -0.3699,0., blur, vec3(1.,.4,0)));

     //arms
     col = min(col,col-circle (uv - vec2(.27,-.35), .06, blur, vec3(1.)));
     col = max(col,circle (uv - vec2(.27,-.35), .053, blur, vec3(1.)));

     col = min(col,col-circle (uv - vec2(-.27,-.35), .06, blur, vec3(1.)));
     col = max(col,circle (uv - vec2(-.27,-.35), .053, blur, vec3(1.)));
     //head
     a = 0.95;
     b = 0.91;
     posX = 0.;
     posY = -0.1;
     rot = 3.14159/2.;

     col = min(col, col-ellipse(uv, posX, posY, rot, a, b, blur, vec3(1.)));
     a = 0.954;
     b = 0.933;
     col = max(col, ellipse(uv, posX, posY, rot, a, b, blur, vec3(1.)));
     //ear mask

     col = max(col,circle (uv - vec2(.094,.07), .055, blur, vec3(1.)));
     col = max(col,circle (uv - vec2(-.094,.07), .055, blur, vec3(1.)));

     //eyes
     col = min(col, col-circle (uv - vec2(.1,-sin(iTime)*.025-.12), 0.015, blur, vec3(1.)));
     col = min(col, col-circle (uv - vec2(-.05,-sin(iTime)*.025-.12), 0.015, blur, vec3(1.)));

     //mouth
     col = min(col, col-square(uv-=vec2(-0.1,-.37-sin(iTime)*.025), .03, .01, 0., .2,0.7, blur, vec3(1.)));
     col = min(col, col-square(uv-=vec2(0.26,-sin(iTime)*.004), .03, .01, 0., .2,-0.7, blur, vec3(1.)));



    gl_FragColor = vec4( col, 1. );
}
