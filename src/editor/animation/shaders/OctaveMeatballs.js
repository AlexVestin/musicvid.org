// Metaball octaves by Justas Dabrila
// Licensed under CC BY 4.0
// from https://www.shadertoy.com/view/WlXSzn
export default `// Metaball octaves by Justas Dabrila
// Licensed under CC BY 4.0
#extension GL_OES_standard_derivatives : enable
#define v2 vec2
#define v3 vec3
#define v4 vec4
#define f32 float
#define s32 int
#define b32 bool
#define m2 mat2
#define TAU 6.283185307179586
#define DEG_TO_RAD (TAU / 360.0)
#define zero_v2 vec2(0,0)

v2 aspect;

v2 to_uv(in v2 p) {
    return (((v2(2.) * p) / iResolution.xy) - v2(1.)) * aspect;
}

f32 IGN_dither(in v2 p) {
    // From http://advances.realtimerendering.com/s2014/index.html#_NEXT_GENERATION_POST
    // NEXT GENERATION POST PROCESSING IN CALL OF DUTY: ADVANCED WARFARE
    return fract(52.9829189*fract(dot(p, vec2(0.06711056, 0.00583715))));
}

void mainImage( out vec4 out_color, in vec2 fragCoord ) {
    aspect = v2(1, iResolution.y / iResolution.x);

    v2 uv = to_uv(fragCoord.xy);

    f32 scale = 10.;
    uv.xy *= scale;

    const f32 div = 10.;
    const s32 octaves = 50;

#if 1
    out_color.b  = .01;
    out_color.r = .005;
#endif

#if 1
    f32 all_balls = 0.;
    for(s32 octave = 0;
            octave < octaves;
            octave++
    ) {
        f32 f_octave = f32(octave + 1);
        f32 octave_t = f_octave/f32(octaves);

        f32 num_balls = div * f_octave;

        f32 l = length(uv);
        f32 angular_divisor = TAU * (1. / num_balls);
        f32 uv_angle = atan(uv.y, uv.x) + TAU * .1 * f_octave + sin((f32(octave) / 2.) * iTime * .1);
        f32 angle = abs(mod(uv_angle, angular_divisor) - angular_divisor * .5);

        v2 p = v2(cos(angle), sin(angle)) * l;

        f32 life_t = fract(iTime * .1 + smoothstep(.4, .8, abs(sin(iTime))) * f_octave * .02);
        //f32 life_t = fract(iTime * .1 + 987 * octave * .01);
        life_t /= fwidth(p.x) * 60.;

        v2 mb_pos = p + v2(-1, 0) * life_t * scale;
        f32 mb = 1. / length(mb_pos) * f_octave * .01;

        out_color += v4(.03, .0,.0,.0) * mb * (1. - life_t);

        all_balls += mb;
    }
    
    all_balls /= f32(octaves);
    out_color += v4(.0, .1, .2, 0) * all_balls;
#endif

    out_color -= IGN_dither(gl_FragCoord.xy) * .01;
}

`