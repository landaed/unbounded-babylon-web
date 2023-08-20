precision highp float;
varying vec2 vUV;
uniform sampler2D textureSampler;
uniform float iTime;
vec2 rand2(vec2 p)
{
	vec2 q = vec2(dot(p,vec2(127.1,311.7)),
		dot(p,vec2(269.5,183.3)));
	return fract(sin(q)*43758.5453);
}

float rand(vec2 p)
{
	return fract(sin(dot(p,vec2(419.2,371.9))) * 833458.57832);
}

float iqnoise(in vec2 pos, float irregular, float smoothness)
{
	vec2 cell = floor(pos);
	vec2 cellOffset = fract(pos);

	float sharpness = 1.0 + 63.0 * pow(1.0-smoothness, 4.0);

	float value = 0.0;
	float accum = 0.0;
	// Sample the surrounding cells, from -2 to +2
	// This is necessary for the smoothing as well as the irregular grid.
	for(int x=-2; x<=2; x++ )
	for(int y=-2; y<=2; y++ )
	{
		vec2 samplePos = vec2(float(y), float(x));

  		// Center of the cell is not at the center of the block for irregular noise.
  		// Note that all the coordinates are in "block"-space, 0 is the current block, 1 is one block further, etc
		vec2 center = rand2(cell + samplePos) * irregular;
		float centerDistance = length(samplePos - cellOffset + center);

		// High sharpness = Only extreme values = Hard borders = 64
		// Low sharpness = No extreme values = Soft borders = 1
		float sam = pow(1.0 - smoothstep(0.0, 1.414, centerDistance), sharpness);

		// A different "color" (shade of gray) for each cell
		float color = rand(cell + samplePos);
		value += color * sam;
		accum += sam;
	}

	return value/accum;
}
float DrawSquare (vec2 uv, float width, float height, float posX, float posY, float blur){
    float w = length((uv.x + posX));
    float h = length(uv.y + posY);
    float col = smoothstep(width,width-blur, w);
    col *= smoothstep(height,height-blur, h);
    return col;
}
void main(void) {
    vec2 uv = vUV;
    uv-=.5;
    float TAU = 6.28318;
    //uv.y+=iTime*.6;
    //uv.y = fract(uv.y*2.);
    // Time varying pixel color
    vec2 st = vec2(atan(uv.x,uv.y),length(uv));
    uv = vec2(st.x/TAU,st.y);
    float dist = uv.y;
    uv.y-=iTime*.1;
    uv.x=abs(uv.x);
    uv.y-=iTime*.2;
   uv.y = fract(uv.y*5.)-.5;\
   float wave = DrawSquare (uv-vec2(0,iqnoise(uv*20.,1.,.9)*.1), 1., .04, 0., 0., .01);

   vec3 col =vec3(wave)*smoothstep(.9,.0,dist);
   col=max(col,vec3(0,1,1));

    gl_FragColor = vec4(col,1);//texture2D(textureSampler, vUV);
}
