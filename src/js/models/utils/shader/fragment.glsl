uniform float time;
uniform float progress;
uniform sampler2D texture1;
uniform vec4 resolution;
varying vec2 vUv;
varying vec3 vPosition;
float PI = 3.141592653589793238;


// NOISE
float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}

float noise(vec3 p){
    vec3 a = floor(p);
    vec3 d = p - a;
    d = d * d * (3.0 - 2.0 * d);

    vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
    vec4 k1 = perm(b.xyxy);
    vec4 k2 = perm(k1.xyxy + b.zzww);

    vec4 c = k2 + a.zzzz;
    vec4 k3 = perm(c);
    vec4 k4 = perm(c + 1.0);

    vec4 o1 = fract(k3 * (1.0 / 41.0));
    vec4 o2 = fract(k4 * (1.0 / 41.0));

    vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
    vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

    return o4.y * d.y + o4.x * (1.0 - d.y);
}

float lines(vec2 uv, float offset) {
    // return abs(sin(uv.x*PI*2.0));
    return smoothstep(
        0.,
        0.5 + offset*0.5, // плавность перехода из цвета в цвет
        abs(0.5*(sin(uv.x*30.) + offset*2.)) //жирность световой линии ;больше - больше акцента
    );

}

mat2 rotate2d(float _angle){
    return mat2(
        cos(_angle),-sin(_angle),
        sin(_angle),cos(_angle)
    );
}

void main() {
    float n = noise(vPosition +time);

    

    vec3 basefirst =  vec3(88./255., 239./255., 105./255.); //green
    // vec3 basefirst =  vec3(240./255., 67./255., 147./255.); //pink
    // vec3 basefirst =  vec3(255./255., 96./255., 0./255.); //yellow
    vec3 accent =  vec3(20./255., 0., 38./255.);
    vec3 baseSecond =  vec3(36./255., 14./255., 139./255.);
    // vec3 baseThird = vec3(232./255., 201./255., 73./255.);

    vec2 baseUV = rotate2d(n)*vPosition.xy*0.1; //частота линий. их больше но они сжимаются
    float basePattern = lines(baseUV, 0.);
    float secondPattern = lines(baseUV, 0.5);

    vec3 baseColor = mix(baseSecond,basefirst,basePattern);
    vec3 secondBaseColor = mix(baseColor,accent,secondPattern);

    // vec2 newuv = (vUv - vec2[0.5))*resolution.zw + vec2(0.5);
    gl_FragColor = vec4(vec3(secondBaseColor),1.);
}