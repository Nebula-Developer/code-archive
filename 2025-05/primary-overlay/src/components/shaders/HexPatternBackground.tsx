import React from "react";
import { ShaderCanvas } from "./ShaderCanvas";

const FRAGMENT_SHADER = `#version 300 es
precision highp float;
out vec4 outColor;

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_hexSize;
uniform float u_speed;
uniform vec3 u_baseColor;

#define PI 3.141592653589793

float pseudoNoise(vec2 p) {
    return sin(p.x + sin(u_time)) * cos(p.y + cos(u_time * 1.5));
}

void main() {
    // Normalize coordinates to [-1, 1] range
    vec2 uv = (gl_FragCoord.xy / u_resolution.xy) * 2.0 - 1.0;
    uv.x *= u_resolution.x / u_resolution.y; // Correct aspect ratio

    // Animate flow field
    float time = u_time * 0.2;

    vec2 p = uv * 3.0;
    float n = 0.0;

    // Layered sine noise for plasma effect
    for (int i = 1; i < 80; i++) {
        float fi = float(i);
        vec2 q = p * fi + time * vec2(0.3, 0.4) * fi;
        n += sin(q.x + sin(q.y + u_time)) / fi * sin(q.y + cos(q.x + u_time * 1.5));
    }

    n = abs(n);
    n = pow(n, 2.5);

    // Color based on baseColor and noise
    vec3 color = mix(vec3(0.0), u_baseColor, n);

    // Output with soft glow edges
    outColor = vec4(color, n);
}
`;

export interface HexPatternBackgroundProps {
  className?: string;
  hexSize?: number; // size of hex in pixels, default 60
  speed?: number;   // rotation speed in radians per second, default 0.2
  baseColor?: [number, number, number]; // RGB 0-1, default bluish
}

export function HexPatternBackground({
  className,
  hexSize = 60,
  speed = 0.2,
  baseColor = [0.1, 0.6, 0.8],
}: HexPatternBackgroundProps) {
  return (
    <ShaderCanvas
      className={className}
      fragmentShader={FRAGMENT_SHADER}
      setup={(gl, program) => {
        const uResolutionLoc = gl.getUniformLocation(program, "u_resolution");
        const uTimeLoc = gl.getUniformLocation(program, "u_time");
        const uHexSizeLoc = gl.getUniformLocation(program, "u_hexSize");
        const uSpeedLoc = gl.getUniformLocation(program, "u_speed");
        const uBaseColorLoc = gl.getUniformLocation(program, "u_baseColor");

        return {
          update: (gl, _, time) => {
            gl.uniform2f(uResolutionLoc, gl.canvas.width, gl.canvas.height);
            gl.uniform1f(uTimeLoc, time);
            gl.uniform1f(uHexSizeLoc, hexSize);
            gl.uniform1f(uSpeedLoc, speed);
            gl.uniform3fv(uBaseColorLoc, baseColor);
          },
        };
      }}
    />
  );
}
