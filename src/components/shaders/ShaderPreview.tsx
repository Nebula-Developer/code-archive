import React from "react";
import { ShaderCanvas } from "./ShaderCanvas"; // Assuming ShaderCanvas is defined as you shared earlier

const FRAGMENT_SHADER = `#version 300 es
precision highp float;

out vec4 outColor;
uniform vec2 iResolution;
uniform float iTime;

float colormap_red(float x) {
    if (x < 0.0) return 54.0 / 255.0;
    else if (x < 20049.0 / 82979.0) return (829.79 * x + 54.51) / 255.0;
    else return 1.0;
}

float colormap_green(float x) {
    if (x < 20049.0 / 82979.0) return 0.0;
    else if (x < 327013.0 / 810990.0) return (8546482679670.0 / 10875673217.0 * x - 2064961390770.0 / 10875673217.0) / 255.0;
    else if (x <= 1.0) return (103806720.0 / 483977.0 * x + 19607415.0 / 483977.0) / 255.0;
    else return 1.0;
}

float colormap_blue(float x) {
    if (x < 0.0) return 54.0 / 255.0;
    else if (x < 7249.0 / 82979.0) return (829.79 * x + 54.51) / 255.0;
    else if (x < 20049.0 / 82979.0) return 127.0 / 255.0;
    else if (x < 327013.0 / 810990.0) return (792.0225 * x - 64.3648) / 255.0;
    else return 1.0;
}

vec4 colormap(float x) {
    return vec4(colormap_red(x), colormap_green(x), colormap_blue(x), 1.0);
}

float rand(vec2 n) {
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 p) {
    vec2 ip = floor(p);
    vec2 u = fract(p);
    u = u*u*(3.0 - 2.0*u);
    float res = mix(
        mix(rand(ip), rand(ip + vec2(1.0, 0.0)), u.x),
        mix(rand(ip + vec2(0.0, 1.0)), rand(ip + vec2(1.0, 1.0)), u.x),
        u.y
    );
    return res * res;
}

const mat2 mtx = mat2(0.80, 0.60, -0.60, 0.80);

float fbm(vec2 p) {
    float f = 0.0;
    f += 0.500000 * noise(p + iTime / 10.0); p = mtx * p * 2.02;
    f += 0.031250 * noise(p); p = mtx * p * 2.01;
    f += 0.250000 * noise(p); p = mtx * p * 2.03;
    f += 0.125000 * noise(p); p = mtx * p * 2.01;
    f += 0.062500 * noise(p); p = mtx * p * 2.04;
    f += 0.015625 * noise(p + sin(iTime));
    return f / 0.96875;
}

float pattern(vec2 p) {
    return fbm(p + fbm(p + fbm(p)));
}

vec4 hueRotate(vec4 color, float angle) {
    float s = sin(angle);
    float c = cos(angle);
    mat3 hueMatrix = mat3(
        0.299 + 0.701 * c + 0.168 * s, 0.587 - 0.587 * c + 0.330 * s, 0.114 - 0.114 * c - 0.497 * s,
        0.299 - 0.299 * c - 0.328 * s, 0.587 + 0.413 * c + 0.035 * s, 0.114 - 0.114 * c + 0.292 * s,
        0.299 - 0.300 * c + 1.250 * s, 0.587 - 0.588 * c - 1.050 * s, 0.114 + 0.886 * c - 1.250 * s
    );
    return vec4(
        dot(color.rgb, hueMatrix[0]),
        dot(color.rgb, hueMatrix[1]),
        dot(color.rgb, hueMatrix[2]),
        color.a
    );
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    float shade = pattern(uv);
    float hue = 0.2;
    vec4 color = vec4(colormap(shade).rgb, shade);
    color = hueRotate(color, hue * 6.28318530718); // Rotate hue by 360 degrees
    outColor = color;
}
`;

export function FbmColormapShader({ className }: { className?: string }) {
  return (
    <ShaderCanvas
      className={className}
      fragmentShader={FRAGMENT_SHADER}
      setup={(gl, program) => {
        const uResLoc = gl.getUniformLocation(program, "iResolution");
        const uTimeLoc = gl.getUniformLocation(program, "iTime");

        return {
          update: (gl, _, time) => {
            gl.uniform2f(uResLoc, gl.canvas.width, gl.canvas.height);
            gl.uniform1f(uTimeLoc, time);
          },
        };
      }}
    />
  );
}
