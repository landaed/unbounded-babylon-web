#include<bonesDeclaration>
#include<instancesDeclaration>

precision highp float;

attribute vec3 position;
attribute vec3 normal;

uniform mat4 albedoMatrix;
uniform mat4 worldViewProjection;
uniform mat4 projection;
uniform mat4 view;
uniform float time;
uniform float waveScale;
uniform float waveSpeed;
varying vec3 vWorldPosition;

varying vec3 vNormal;
varying vec3 vPosition;
float ndot(vec2 a, vec2 b ) { return a.x*b.x - a.y*b.y; }

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
void main(void) {
    vec3 positionUpdated = position;

    #include<instancesVertex>

    vec4 p = vec4(positionUpdated, 1.0);
    vec4 worldPos = finalWorld * p;
    float irregular = .9;
    float smoothness = .9;

    float a = -iqnoise(waveScale*(worldPos.xz+vec2(time*waveSpeed)), irregular, smoothness)*10.;
    float b = -iqnoise(waveScale*(worldPos.xz-vec2(1,0)+vec2(time*waveSpeed)), irregular, smoothness)*10.;
    float c = -iqnoise(waveScale*(worldPos.xz-vec2(0,1)+vec2(time*waveSpeed)), irregular, smoothness)*10.;

    vec3 A = vec3(worldPos.x, a, worldPos.z);
    vec3 B = vec3(worldPos.x-1., b, worldPos.z);
    vec3 C = vec3(worldPos.x,c, worldPos.z-1.);
    worldPos.y = -iqnoise(waveScale*(worldPos.xz+vec2(time*waveSpeed)), irregular, smoothness)*10.;
    vWorldPosition.xyz = worldPos.xyz;
    vPosition = p.xyz;

    #ifdef NORMAL
        vec3 normalUpdated = normal;
    #endif
    #ifdef NORMAL
        mat3 normalWorld = mat3(finalWorld);
        vNormal = normalize(cross(A-B,C-B))+vec3(0,.1,0);
    #endif

    gl_Position = projection * view * worldPos;
}
