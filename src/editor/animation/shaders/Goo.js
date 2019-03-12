

const fsA = `// MIT License: https://opensource.org/licenses/MIT
const float pi = 3.14159;
mat3 rotate( in vec3 v, in float angle){
	float c = cos(angle);
	float s = sin(angle);
	return mat3(c + (1.0 - c) * v.x * v.x, (1.0 - c) * v.x * v.y - s * v.z, (1.0 - c) * v.x * v.z + s * v.y,
		(1.0 - c) * v.x * v.y + s * v.z, c + (1.0 - c) * v.y * v.y, (1.0 - c) * v.y * v.z - s * v.x,
		(1.0 - c) * v.x * v.z - s * v.y, (1.0 - c) * v.y * v.z + s * v.x, c + (1.0 - c) * v.z * v.z
		);
}

vec3 hash(vec3 p){
	p = vec3( dot(p,vec3(127.1,311.7, 74.7)),
			  dot(p,vec3(269.5,183.3,246.1)),
			  dot(p,vec3(113.5,271.9,124.6)));
	return -1.0 + 2.0*fract(sin(p)*43758.5453123);
}

// Gradient noise from iq
// return value noise (in x) and its derivatives (in yzw)
vec4 noised(vec3 x){
    vec3 p = floor(x);
    vec3 w = fract(x);
    vec3 u = w*w*w*(w*(w*6.0-15.0)+10.0);
    vec3 du = 30.0*w*w*(w*(w-2.0)+1.0);
    
    vec3 ga = hash( p+vec3(0.0,0.0,0.0) );
    vec3 gb = hash( p+vec3(1.0,0.0,0.0) );
    vec3 gc = hash( p+vec3(0.0,1.0,0.0) );
    vec3 gd = hash( p+vec3(1.0,1.0,0.0) );
    vec3 ge = hash( p+vec3(0.0,0.0,1.0) );
	vec3 gf = hash( p+vec3(1.0,0.0,1.0) );
    vec3 gg = hash( p+vec3(0.0,1.0,1.0) );
    vec3 gh = hash( p+vec3(1.0,1.0,1.0) );
    
    float va = dot( ga, w-vec3(0.0,0.0,0.0) );
    float vb = dot( gb, w-vec3(1.0,0.0,0.0) );
    float vc = dot( gc, w-vec3(0.0,1.0,0.0) );
    float vd = dot( gd, w-vec3(1.0,1.0,0.0) );
    float ve = dot( ge, w-vec3(0.0,0.0,1.0) );
    float vf = dot( gf, w-vec3(1.0,0.0,1.0) );
    float vg = dot( gg, w-vec3(0.0,1.0,1.0) );
    float vh = dot( gh, w-vec3(1.0,1.0,1.0) );
	
    return vec4( va + u.x*(vb-va) + u.y*(vc-va) + u.z*(ve-va) + u.x*u.y*(va-vb-vc+vd) + u.y*u.z*(va-vc-ve+vg) + u.z*u.x*(va-vb-ve+vf) + (-va+vb+vc-vd+ve-vf-vg+vh)*u.x*u.y*u.z,    // value
                 ga + u.x*(gb-ga) + u.y*(gc-ga) + u.z*(ge-ga) + u.x*u.y*(ga-gb-gc+gd) + u.y*u.z*(ga-gc-ge+gg) + u.z*u.x*(ga-gb-ge+gf) + (-ga+gb+gc-gd+ge-gf-gg+gh)*u.x*u.y*u.z +   // derivatives
                 du * (vec3(vb,vc,ve) - va + u.yzx*vec3(va-vb-vc+vd,va-vc-ve+vg,va-vb-ve+vf) + u.zxy*vec3(va-vb-ve+vf,va-vb-vc+vd,va-vc-ve+vg) + u.yzx*u.zxy*(-va+vb+vc-vd+ve-vf-vg+vh) ));
}

float map(vec3 p){
    // ugly hacky slow distance field with bad gradients
    float d = p.y;
    float c = max(0.0, pow(distance(p.xz, vec2(0,16)), 1.0));
    float cc = pow(smoothstep(20.0, 5.0, c), 2.0);
    //p.xz *= cc;
    vec4 n = noised(vec3(p.xz*0.07, iTime*0.5));
    float nn = n.x * (length((n.yzw)));
    n = noised(vec3(p.xz*0.173, iTime*0.639));
    nn += 0.25*n.x * (length((n.yzw)));
    nn = smoothstep(-0.5, 0.5, nn);
    d = d-6.0*nn*(cc);
    return d;
}

float err(float dist){
    dist = dist/100.0;
    return min(0.01, dist*dist);
}

vec3 dr(vec3 origin, vec3 direction, vec3 position){
    const int iterations = 3;
    for(int i = 0; i < iterations; i++){
        position = position + direction * (map(position) - err(distance(origin, position)));
    }
    return position;
}

vec3 intersect(vec3 ro, vec3 rd){
	vec3 p = ro+rd;
	float t = 0.;
	for(int i = 0; i < 150; i++){
        float d = 0.5*map(p);
        t += d;
        p += rd*d;
		if(d < 0.01 || t > 60.0) break;
	}
    
    // discontinuity reduction as described (somewhat) in
    // their 2014 sphere tracing paper
    p = dr(ro, rd, p);
    return p;
}

vec3 normal(vec3 p){
	float e=0.01;
	return normalize(vec3(map(p+vec3(e,0,0))-map(p-vec3(e,0,0)),
	                      map(p+vec3(0,e,0))-map(p-vec3(0,e,0)),
	                      map(p+vec3(0,0,e))-map(p-vec3(0,0,e))));
}

float G1V(float dnv, float k){
    return 1.0/(dnv*(1.0-k)+k);
}

float ggx(vec3 n, vec3 v, vec3 l, float rough, float f0){
    float alpha = rough*rough;
    vec3 h = normalize(v+l);
    float dnl = clamp(dot(n,l), 0.0, 1.0);
    float dnv = clamp(dot(n,v), 0.0, 1.0);
    float dnh = clamp(dot(n,h), 0.0, 1.0);
    float dlh = clamp(dot(l,h), 0.0, 1.0);
    float f, d, vis;
    float asqr = alpha*alpha;
    const float pi = 3.14159;
    float den = dnh*dnh*(asqr-1.0)+1.0;
    d = asqr/(pi * den * den);
    dlh = pow(1.0-dlh, 5.0);
    f = f0 + (1.0-f0)*dlh;
    float k = alpha/1.0;
    vis = G1V(dnl, k)*G1V(dnv, k);
    float spec = dnl * d * f * vis;
    return spec;
}

float subsurface(vec3 p, vec3 v, vec3 n){
    //vec3 d = normalize(mix(v, -n, 0.5));
    // suggested by Shane
    vec3 d = refract(v, n, 1.0/1.5);
    vec3 o = p;
    float a = 0.0;
    
    const float max_scatter = 2.5;
    for(float i = 0.1; i < max_scatter; i += 0.2)
    {
        o += i*d;
        float t = map(o);
        a += t;
    }
    float thickness = max(0.0, -a);
    const float scatter_strength = 16.0;
	return scatter_strength*pow(max_scatter*0.5, 3.0)/thickness;
}

vec3 shade(vec3 p, vec3 v){
    vec3 lp = vec3(50,20,10);
    vec3 ld = normalize(p+lp);
    
    vec3 n = normal(p);
    float fresnel = pow( max(0.0, 1.0+dot(n, v)), 5.0 );
    
    vec3 final = vec3(0);
    vec3 ambient = vec3(0.1, 0.06, 0.035);
    vec3 albedo = vec3(0.75, 0.9, 0.35);
    vec3 sky = vec3(0.5,0.65,0.8)*2.0;
    
    float lamb = max(0.0, dot(n, ld));
    float spec = ggx(n, v, ld, 3.0, fresnel);
    float ss = max(0.0, subsurface(p, v, n));
    
    // artistic license
    lamb = mix(lamb, 3.5*smoothstep(0.0, 2.0, pow(ss, 0.6)), 0.7);
    final = ambient + albedo*lamb+ 25.0*spec + fresnel*sky;
    return vec3(final*0.5);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord){
    vec2 uv = fragCoord / iResolution.xy;
    vec3 a = vec3(0);
    
    // leftover stuff from something else, too lazy to remove
    // don't ask
    const float campos = 5.1;
    float lerp = 0.5+0.5*cos(campos*0.4-pi);
    lerp = smoothstep(0.13, 1.0, lerp);
    vec3 c = mix(vec3(-0,217,0), vec3(0,4.4,-190), pow(lerp,1.0));
    mat3 rot = rotate(vec3(1,0,0), pi/2.0);
    mat3 ro2 = rotate(vec3(1,0,0), -0.008*pi/2.0);
    
    vec2 u2 = -1.0+2.0*uv;
    u2.x *= iResolution.x/iResolution.y;

    vec3 d = mix(normalize(vec3(u2, 20)*rot), normalize(vec3(u2, 20))*ro2, pow(lerp,1.11));
    d = normalize(d);

    vec3 ii = intersect(c+145.0*d, d);
    vec3 ss = shade(ii, d);
    a += ss;
    
    fragColor.rgb = a*(0.99+0.02*hash(vec3(uv,0.001*iTime)));
}`;

const fsB = `// FXAA implementation by mudlord (I think?)
void mainImage(out vec4 fragColor, vec2 fragCoord){
    vec2 p = fragCoord.xy/iResolution.xy;
    vec2 pp = 1.0 / iResolution.xy;
    vec4 color = texture(iChannel0, vec2(fragCoord.xy * pp));
    vec3 luma = vec3(0.299, 0.587, 0.114);
    float lumaNW = dot(texture(iChannel0, (fragCoord.xy + vec2(-1.0, -1.0)) * pp).xyz, luma);
    float lumaNE = dot(texture(iChannel0, (fragCoord.xy + vec2(1.0, -1.0)) * pp).xyz, luma);
    float lumaSW = dot(texture(iChannel0, (fragCoord.xy + vec2(-1.0, 1.0)) * pp).xyz, luma);
    float lumaSE = dot(texture(iChannel0, (fragCoord.xy + vec2(1.0, 1.0)) * pp).xyz, luma);
    float lumaM  = dot(color.xyz,  luma);
    float lumaMin = min(lumaM, min(min(lumaNW, lumaNE), min(lumaSW, lumaSE)));
    float lumaMax = max(lumaM, max(max(lumaNW, lumaNE), max(lumaSW, lumaSE)));

    vec2 dir = vec2(-((lumaNW + lumaNE) - (lumaSW + lumaSE)), ((lumaNW + lumaSW) - (lumaNE + lumaSE)));

    float dirReduce = max((lumaNW + lumaNE + lumaSW + lumaSE) *
                          (0.25 * (1.0/8.0)), (1.0/128.0));

    float rcpDirMin = 2.5 / (min(abs(dir.x), abs(dir.y)) + dirReduce);
    dir = min(vec2(8.0, 8.0),
              max(vec2(-8.0, -8.0),
              dir * rcpDirMin)) * pp;

    vec3 rgbA = 0.5 * (
        texture(iChannel0, fragCoord.xy * pp + dir * (1.0 / 3.0 - 0.5)).xyz +
        texture(iChannel0, fragCoord.xy * pp + dir * (2.0 / 3.0 - 0.5)).xyz);
    vec3 rgbB = rgbA * 0.5 + 0.25 * (
        texture(iChannel0, fragCoord.xy * pp + dir * -0.5).xyz +
        texture(iChannel0, fragCoord.xy * pp + dir * 0.5).xyz);

    float lumaB = dot(rgbB, luma);
    if ((lumaB < lumaMin) || (lumaB > lumaMax)){
        fragColor = vec4(rgbA, color.w);
    } else {
        fragColor = vec4(rgbB, color.w);
    }

}`;

const fsC = `// Tone mapping and post processing
float hash(float c){return fract(sin(dot(c,12.9898))*43758.5453);}

// linear white point
const float W = 1.2;
const float T2 = 7.5;

float filmic_reinhard_curve (float x) {
    float q = (T2*T2 + 1.0)*x*x;    
	return q / (q + x + T2*T2);
}

vec3 filmic_reinhard(vec3 x) {
    float w = filmic_reinhard_curve(W);
    return vec3(
        filmic_reinhard_curve(x.r),
        filmic_reinhard_curve(x.g),
        filmic_reinhard_curve(x.b)) / w;
}

const int N = 8;
vec3 ca(sampler2D t, vec2 UV, vec4 sampl){
	vec2 uv = 1.0 - 2.0 * UV;
	vec3 c = vec3(0);
	float rf = 1.0;
	float gf = 1.0;
    float bf = 1.0;
	float f = 1.0/float(N);
	for(int i = 0; i < N; ++i){
		c.r += f*texture(t, 0.5-0.5*(uv*rf) ).r;
		c.g += f*texture(t, 0.5-0.5*(uv*gf) ).g;
		c.b += f*texture(t, 0.5-0.5*(uv*bf) ).b;
		rf *= 0.9972;
		gf *= 0.998;
        bf /= 0.9988;
		c = clamp(c,0.0, 1.0);
	}
	return c;
}

void mainImage(out vec4 fragColor,vec2 fragCoord){
    const float brightness = 1.0;
    vec2 pp = fragCoord.xy/iResolution.xy;
    vec2 r = iResolution.xy;
    vec2 p = 1.-2.*fragCoord.xy/r.xy;
    p.y *= r.y/r.x;
   
    // a little chromatic aberration
    vec4 sampl = texture(iChannel0, pp);
    vec3 color = ca(iChannel0, pp, sampl).rgb;
    
    // final output
    float vignette = 1.25 / (1.1 + 1.1*dot(p, p));
    vignette *= vignette;
    vignette = mix(1.0, smoothstep(0.1, 1.1, vignette), 0.25);
    float noise = .012*vec3(hash(length(p)*iTime)).x;
    color = color*vignette+noise;
    color = filmic_reinhard(brightness*color);
    
    color = smoothstep(-0.025, 1.0,color);
    
    color = pow(color, vec3(1.0/2.2));
    fragColor = vec4(color, 1.0);
}`;

const test  = `// Created by Yilin Yan aka greenbird10
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0

float hash(vec2 p) {
	return 0.5*(
    sin(dot(p, vec2(271.319, 413.975)) + 1217.13*p.x*p.y)
    ) + 0.5;
}

float noise(vec2 p) {
  vec2 w = fract(p);
  w = w * w * (3.0 - 2.0*w);
  p = floor(p);
  return mix(
    mix(hash(p+vec2(0,0)), hash(p+vec2(1,0)), w.x),
    mix(hash(p+vec2(0,1)), hash(p+vec2(1,1)), w.x), w.y);
}

// wave octave inspiration
// Alexander Alekseev - Seascape
// https://www.shadertoy.com/view/Ms2SD1
float map_octave(vec2 uv) {
  uv = (uv + noise(uv)) / 2.5;
  uv = vec2(uv.x*0.6-uv.y*0.8, uv.x*0.8+uv.y*0.6);
  vec2 uvsin = 1.0 - abs(sin(uv));
  vec2 uvcos = abs(cos(uv));
  uv = mix(uvsin, uvcos, uvsin);
  float val = 1.0 - pow(uv.x * uv.y, 0.65);
  return val;
}

float map(vec3 p) {
  vec2 uv = p.xz + iTime/2.;
  float amp = 0.6, freq = 2.0, val = 0.0;
  for(int i = 0; i < 3; ++i) {
    val += map_octave(uv) * amp;
    amp *= 0.3;
    uv *= freq;
    // uv = vec2(uv.x*0.6-uv.y*0.8, uv.x*0.8+uv.y*0.6);
  }
  uv = p.xz - 1000. - iTime/2.;
  amp = 0.6, freq = 2.0;
  for(int i = 0; i < 3; ++i) {
    val += map_octave(uv) * amp;
    amp *= 0.3;
    uv *= freq;
    // uv = vec2(uv.x*0.6-uv.y*0.8, uv.x*0.8+uv.y*0.6);
  }
  return val + 3.0 - p.y;
}

vec3 getNormal(vec3 p) {
  float eps = 1./iResolution.x;
  vec3 px = p + vec3(eps, 0, 0);
  vec3 pz = p + vec3(0, 0, eps);
  return normalize(vec3(map(px),eps,map(pz)));
}

// raymarch inspiration
// Alexander Alekseev - Seascape
// https://www.shadertoy.com/view/Ms2SD1
float raymarch(vec3 ro, vec3 rd, out vec3 outP, out float outT) {
    float l = 0., r = 26.;
    int i = 0, steps = 16;
    float dist = 1000000.;
    for(i = 0; i < steps; ++i) {
        float mid = (r+l)/2.;
        float mapmid = map(ro + rd*mid);
        dist = min(dist, abs(mapmid));
        if(mapmid > 0.) {
        	l = mid;
        }
        else {
        	r = mid;
        }
        if(r - l < 1./iResolution.x) break;
    }
    outP = ro + rd*l;
    outT = l;
    return dist;
}

float fbm(vec2 n) {
	float total = 0.0, amplitude = 1.0;
	for (int i = 0; i < 5; i++) {
		total += noise(n) * amplitude; 
		n += n;
		amplitude *= 0.4; 
	}
	return total;
}

float lightShafts(vec2 st) {
    float angle = -0.2;
    vec2 _st = st;
    float t = iTime / 16.;
    st = vec2(st.x * cos(angle) - st.y * sin(angle), 
              st.x * sin(angle) + st.y * cos(angle));
    float val = fbm(vec2(st.x*2. + 200. + t, st.y/4.));
    val += fbm(vec2(st.x*2. + 200. - t, st.y/4.));
    val = val / 3.;
    float mask = pow(clamp(1.0 - abs(_st.y-0.15), 0., 1.)*0.49 + 0.5, 2.0);
    mask *= clamp(1.0 - abs(_st.x+0.2), 0., 1.) * 0.49 + 0.5;
	return pow(val*mask, 2.0);
}

vec2 bubble(vec2 uv, float scale) {
    if(uv.y > 0.2) return vec2(0.);
    float t = iTime/4.;
    vec2 st = uv * scale;
    vec2 _st = floor(st);
    vec2 bias = vec2(0., 4. * sin(_st.x*128. + t));
    float mask = smoothstep(0.1, 0.2, -cos(_st.x*128. + t));
    st += bias;
    vec2 _st_ = floor(st);
    st = fract(st);
    float size = noise(_st_)*0.07+0.01;
    vec2 pos = vec2(noise(vec2(t, _st_.y*64.1)) * 0.8 + 0.1, 0.5);
    if(length(st.xy - pos) < size) {
        return (st + pos) * vec2(.1, .2) * mask;
    }
    return vec2(0.);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec3 ro = vec3(0.,0.,2.);
    vec3 lightPos = vec3(8, 3, -3);
    vec3 lightDir = normalize(lightPos - ro);

    // adjust uv
    vec2 uv = fragCoord;
    uv = (-iResolution.xy + 2.0*uv) / iResolution.y;
    uv.y *= 0.5;
    uv.x *= 0.45;
    uv += bubble(uv, 12.) + bubble(uv, 24.); // add bubbles

    vec3 rd = normalize(vec3(uv, -1.));
    vec3 hitPos;
    float hitT;
    vec3 seaColor = vec3(11,82,142)/255.;
    vec3 color;
    
    // waves
    float dist = raymarch(ro, rd, hitPos, hitT);
    float diffuse = dot(getNormal(hitPos), rd) * 0.5 + 0.5;
    color = mix(seaColor, vec3(15,120,152)/255., diffuse);
    color += pow(diffuse, 12.0);
	// refraction
    vec3 ref = normalize(refract(hitPos-lightPos, getNormal(hitPos), 0.05));
    float refraction = clamp(dot(ref, rd), 0., 1.0);
    color += vec3(245,250,220)/255. * 0.6 * pow(refraction, 1.5);

    vec3 col = vec3(0.);
    col = mix(color, seaColor, pow(clamp(0., 1., dist), 0.2)); // glow edge
    col += vec3(225,230,200)/255. * lightShafts(uv); // light shafts

    // tone map
    col = (col*col + sin(col))/vec3(1.8, 1.8, 1.9);
    
    // vignette
    // inigo quilez - Stop Motion Fox 
    // https://www.shadertoy.com/view/3dXGWB
    vec2 q = fragCoord / iResolution.xy;
    col *= 0.7+0.3*pow(16.0*q.x*q.y*(1.0-q.x)*(1.0-q.y),0.2);

    fragColor = vec4(col,1.0);
}`;

export default { fsA, fsB, fsC, test };