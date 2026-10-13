/*
 * Forked from Paper Shaders' GrainGradient (Apache-2.0)
 * https://github.com/paper-design/shaders
 *
 * Changes: the discrete `u_shape` switch is replaced by per-shape weights so the
 * pattern can morph continuously between shapes. Each shape keeps its own UV
 * space, and the grain field is computed per UV group and blended by weight.
 */

export const SHAPES = ['wave', 'dots', 'truchet', 'corners', 'ripple', 'blob', 'sphere'] as const
export type Shape = (typeof SHAPES)[number]

export const COLOR_COUNT = 4

export const grainMorphShader = `#version 300 es
precision lowp float;

uniform mediump float u_time;
uniform mediump vec2 u_resolution;
uniform mediump float u_pixelRatio;

uniform sampler2D u_noiseTexture;

uniform vec4 u_colorBack;
uniform vec4 u_colors[${COLOR_COUNT}];
uniform float u_softness;
uniform float u_intensity;
uniform float u_noise;

// weights: (wave, dots, truchet, corners) and (ripple, blob, sphere, unused)
uniform vec4 u_shapeWeightsA;
uniform vec4 u_shapeWeightsB;

uniform mediump float u_worldWidth;
uniform mediump float u_worldHeight;
uniform mediump float u_fit;

uniform mediump float u_scale;
uniform mediump float u_rotation;
uniform mediump float u_offsetX;
uniform mediump float u_offsetY;

in vec2 v_objectUV;
in vec2 v_patternUV;
in vec2 v_objectBoxSize;
in vec2 v_patternBoxSize;

out vec4 fragColor;

#define TWO_PI 6.28318530718
#define PI 3.14159265358979323846

vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
    -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
      dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

vec2 rotate(vec2 uv, float th) {
  return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
}

float randomR(vec2 p) {
  vec2 uv = floor(p) / 100. + .5;
  return texture(u_noiseTexture, fract(uv)).r;
}

float hash11(float p) {
  p = fract(p * 0.3183099) + 0.1;
  p *= p + 19.19;
  return fract(p * p);
}

float valueNoiseR(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  float a = randomR(i);
  float b = randomR(i + vec2(1.0, 0.0));
  float c = randomR(i + vec2(0.0, 1.0));
  float d = randomR(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  float x1 = mix(a, b, u.x);
  float x2 = mix(c, d, u.x);
  return mix(x1, x2, u.y);
}
vec4 fbmR(vec2 n0, vec2 n1, vec2 n2, vec2 n3) {
  float amplitude = 0.2;
  vec4 total = vec4(0.);
  for (int i = 0; i < 3; i++) {
    n0 = rotate(n0, 0.3);
    n1 = rotate(n1, 0.3);
    n2 = rotate(n2, 0.3);
    n3 = rotate(n3, 0.3);
    total.x += valueNoiseR(n0) * amplitude;
    total.y += valueNoiseR(n1) * amplitude;
    total.z += valueNoiseR(n2) * amplitude;
    total.z += valueNoiseR(n3) * amplitude;
    n0 *= 1.99;
    n1 *= 1.99;
    n2 *= 1.99;
    n3 *= 1.99;
    amplitude *= 0.6;
  }
  return total;
}

vec2 truchet(vec2 uv, float idx){
  idx = fract(((idx - .5) * 2.));
  if (idx > 0.75) {
    uv = vec2(1.0) - uv;
  } else if (idx > 0.5) {
    uv = vec2(1.0 - uv.x, uv.y);
  } else if (idx > 0.25) {
    uv = 1.0 - vec2(1.0 - uv.x, uv.y);
  }
  return uv;
}

float shapeWave(vec2 uv, float t) {
  float wave = cos(.5 * uv.x - 4. * t) * sin(1.5 * uv.x + 2. * t) * (.75 + .25 * cos(6. * t));
  return 1. - smoothstep(-1., 1., uv.y + wave);
}

float shapeDots(vec2 uv, float t) {
  float stripeIdx = floor(2. * uv.x / TWO_PI);
  float rand = hash11(stripeIdx * 100.);
  rand = sign(rand - .5) * pow(4. * abs(rand), .3);
  float shape = sin(uv.x) * cos(uv.y - 5. * rand * t);
  return pow(abs(shape), 4.);
}

float shapeTruchet(vec2 uv, float t) {
  float n2 = valueNoiseR(uv * .4 - 3.75 * t);
  uv.x += 10.;
  uv *= .6;

  vec2 tile = truchet(fract(uv), randomR(floor(uv)));

  float distance1 = length(tile);
  float distance2 = length(tile - vec2(1.));

  n2 -= .5;
  n2 *= .1;
  float shape = smoothstep(.2, .55, distance1 + n2) * (1. - smoothstep(.45, .8, distance1 - n2));
  shape += smoothstep(.2, .55, distance2 + n2) * (1. - smoothstep(.45, .8, distance2 - n2));

  return pow(shape, 1.5);
}

float shapeCorners(vec2 uv, float t) {
  uv *= .6;
  vec2 outer = vec2(.5);

  vec2 bl = smoothstep(vec2(0.), outer, uv + vec2(.1 + .1 * sin(3. * t), .2 - .1 * sin(5.25 * t)));
  vec2 tr = smoothstep(vec2(0.), outer, 1. - uv);
  float shape = 1. - bl.x * bl.y * tr.x * tr.y;

  uv = -uv;
  bl = smoothstep(vec2(0.), outer, uv + vec2(.1 + .1 * sin(3. * t), .2 - .1 * cos(5.25 * t)));
  tr = smoothstep(vec2(0.), outer, 1. - uv);
  shape -= bl.x * bl.y * tr.x * tr.y;

  return 1. - smoothstep(0., 1., shape);
}

float shapeRipple(vec2 uv, float t) {
  uv *= 2.;
  float dist = length(.4 * uv);
  return sin(pow(dist, 1.2) * 5. - 3. * t) * .5 + .5;
}

float shapeBlob(vec2 uv, float t) {
  t *= 2.;

  vec2 f1_traj = .25 * vec2(1.3 * sin(t), .2 + 1.3 * cos(.6 * t + 4.));
  vec2 f2_traj = .2 * vec2(1.2 * sin(-t), 1.3 * sin(1.6 * t));
  vec2 f3_traj = .25 * vec2(1.7 * cos(-.6 * t), cos(-1.6 * t));
  vec2 f4_traj = .3 * vec2(1.4 * cos(.8 * t), 1.2 * sin(-.6 * t - 3.));

  float shape = .5 * pow(1. - clamp(0., 1., length(uv + f1_traj)), 5.);
  shape += .5 * pow(1. - clamp(0., 1., length(uv + f2_traj)), 5.);
  shape += .5 * pow(1. - clamp(0., 1., length(uv + f3_traj)), 5.);
  shape += .5 * pow(1. - clamp(0., 1., length(uv + f4_traj)), 5.);

  shape = smoothstep(.0, .9, shape);
  float edge = smoothstep(.25, .3, shape);
  return mix(.0, shape, edge);
}

float shapeSphere(vec2 uv, float t) {
  uv *= 2.;
  float d = 1. - pow(length(uv), 2.);
  vec3 pos = vec3(uv, sqrt(max(d, 0.)));
  vec3 lightPos = normalize(vec3(cos(1.5 * t), .8, sin(1.25 * t)));
  float shape = .5 + .5 * dot(lightPos, pos);
  return shape * step(0., d);
}

// returns (grainDist, noise)
vec2 grainField(vec2 grain_uv) {
  float baseNoise = snoise(grain_uv * .5);
  vec4 fbmVals = fbmR(
  .002 * grain_uv + 10.,
  .003 * grain_uv,
  .001 * grain_uv,
  rotate(.4 * grain_uv, 2.)
  );
  float grainDist = baseNoise * snoise(grain_uv * .2) - fbmVals.x - fbmVals.y;
  float rawNoise = .75 * baseNoise - fbmVals.w - fbmVals.z;
  return vec2(grainDist, clamp(rawNoise, 0., 1.));
}

const float EPS = .001;

void main() {

  const float firstFrameOffset = 7.;
  float t = .1 * (u_time + firstFrameOffset);

  float r = u_rotation * PI / 180.;
  float cr = cos(r);
  float sr = sin(r);
  mat2 graphicRotation = mat2(cr, sr, -sr, cr);
  vec2 graphicOffset = vec2(-u_offsetX, u_offsetY);

  vec4 wA = max(u_shapeWeightsA, 0.);
  vec4 wB = max(u_shapeWeightsB, 0.);
  float patternWeight = wA.x + wA.y + wA.z;
  float objectWeight = wA.w + wB.x + wB.y + wB.z;
  float totalWeight = max(patternWeight + objectWeight, EPS);

  float shape = 0.;
  vec2 grain = vec2(0.);

  if (patternWeight > EPS) {
    vec2 shape_uv = .5 * v_patternUV;
    vec2 grain_uv = 100. * v_patternUV;

    // apply inverse transform to grain_uv so it respects the originXY
    grain_uv = transpose(graphicRotation) * grain_uv;
    grain_uv *= u_scale;
    if (u_fit > 0.) {
      vec2 givenBoxSize = vec2(u_worldWidth, u_worldHeight);
      givenBoxSize = max(givenBoxSize, vec2(1.)) * u_pixelRatio;
      float patternBoxRatio = givenBoxSize.x / givenBoxSize.y;
      vec2 patternBoxGivenSize = vec2(
      (u_worldWidth == 0.) ? u_resolution.x : givenBoxSize.x,
      (u_worldHeight == 0.) ? u_resolution.y : givenBoxSize.y
      );
      patternBoxRatio = patternBoxGivenSize.x / patternBoxGivenSize.y;
      float patternBoxNoFitBoxWidth = patternBoxRatio * min(patternBoxGivenSize.x / patternBoxRatio, patternBoxGivenSize.y);
      grain_uv /= (patternBoxNoFitBoxWidth / v_patternBoxSize.x);
    }
    vec2 patternBoxScale = u_resolution.xy / v_patternBoxSize;
    grain_uv -= graphicOffset / patternBoxScale;
    grain_uv *= 1.6;

    if (wA.x > EPS) shape += wA.x * shapeWave(shape_uv, t);
    if (wA.y > EPS) shape += wA.y * shapeDots(shape_uv, t);
    if (wA.z > EPS) shape += wA.z * shapeTruchet(shape_uv, t);
    grain += patternWeight * grainField(grain_uv);
  }

  if (objectWeight > EPS) {
    vec2 shape_uv = v_objectUV;
    vec2 grain_uv = shape_uv;

    // apply inverse transform to grain_uv so it respects the originXY
    grain_uv = transpose(graphicRotation) * grain_uv;
    grain_uv *= u_scale;
    grain_uv -= graphicOffset;
    grain_uv *= v_objectBoxSize;
    grain_uv *= .7;

    if (wA.w > EPS) shape += wA.w * shapeCorners(shape_uv, t);
    if (wB.x > EPS) shape += wB.x * shapeRipple(shape_uv, t);
    if (wB.y > EPS) shape += wB.y * shapeBlob(shape_uv, t);
    if (wB.z > EPS) shape += wB.z * shapeSphere(shape_uv, t);
    grain += objectWeight * grainField(grain_uv);
  }

  shape /= totalWeight;
  grain /= totalWeight;

  const float colorsCount = ${COLOR_COUNT}.;

  shape += u_intensity * 2. / colorsCount * (grain.x + .5);
  shape += u_noise * 10. / colorsCount * grain.y;

  float aa = fwidth(shape);

  shape = clamp(shape - .5 / colorsCount, 0., 1.);
  float totalShape = smoothstep(0., u_softness + 2. * aa, clamp(shape * colorsCount, 0., 1.));
  float mixer = shape * (colorsCount - 1.);

  vec4 gradient = u_colors[0];
  gradient.rgb *= gradient.a;
  for (int i = 1; i < ${COLOR_COUNT}; i++) {
    float localT = clamp(mixer - float(i - 1), 0., 1.);
    localT = smoothstep(.5 - .5 * u_softness - aa, .5 + .5 * u_softness + aa, localT);

    vec4 c = u_colors[i];
    c.rgb *= c.a;
    gradient = mix(gradient, c, localT);
  }

  vec3 color = gradient.rgb * totalShape;
  float opacity = gradient.a * totalShape;

  vec3 bgColor = u_colorBack.rgb * u_colorBack.a;
  color = color + bgColor * (1.0 - opacity);
  opacity = opacity + u_colorBack.a * (1.0 - opacity);

  fragColor = vec4(color, opacity);
}
`
