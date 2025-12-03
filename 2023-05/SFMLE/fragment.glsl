uniform float time;
uniform vec2 resolution;

float noise(vec2 p) {
    return sin(fract(dot(floor(p), vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
    float newTime = sin(time * 0.1);
    vec2 uv = (gl_FragCoord.xy / resolution.xy);
    uv -= 3.0;
    uv *= 2.0;
    uv.x += sin(uv.y * 10.0 + newTime) * 0.1;
    uv.y += sin(uv.x * 10.0 + newTime) * 0.1;
    uv /= 5.0;
    uv += 0.5;
    float n = noise(uv * 10.0 + newTime);
    vec3 color = vec3(0.0, 0.1, 1.0);
    color += vec3(n * 0.2 - 0.1 * (noise(uv * 100.0 + newTime * 0.1) - 0.5));
    gl_FragColor = vec4(color, 1.0);
}
