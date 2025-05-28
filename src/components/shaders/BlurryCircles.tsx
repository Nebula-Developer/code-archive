import React, { useRef } from "react";
import { ShaderCanvas } from "./ShaderCanvas"; // The reusable shader canvas from before

const FRAGMENT_SHADER = `#version 300 es
precision highp float;
out vec4 outColor;

#define N 10
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_centers[N];
uniform float u_radii[N];
uniform vec3 u_colors[N];

void main() {
    vec2 uv = gl_FragCoord.xy; // pixel space

    float field = 0.0;
    vec3 color = vec3(0.0);

    for (int i = 0; i < N; i++) {
        vec2 p = u_centers[i] * u_resolution;
        float r = u_radii[i];
        float d = distance(uv, p);
        float strength = (r * r) / (d * d);
        field += strength;
        color += u_colors[i] * strength;
    }

    float threshold = 1.0;
    float alpha = smoothstep(threshold - 0.1, threshold + 0.1, field);
    outColor = vec4(color * alpha, alpha);
}
`;

type BlurryCirclesProps = {
  count?: number;
  maxRadius?: number;
  maxSpeed?: number;
  className?: string;
};

export function BlurryCircles({
  count = 10,
  maxRadius = 150,
  maxSpeed = 0.3,
  className,
}: BlurryCirclesProps) {
  const centersRef = useRef<Float32Array>();
  const velocitiesRef = useRef<Float32Array>();
  const radiiRef = useRef<Float32Array>();
  const colorsRef = useRef<Float32Array>();

  return (
    <ShaderCanvas
      className={className}
      fragmentShader={FRAGMENT_SHADER}
      setup={(gl, program) => {
        // Initialize blobs only once
        if (!centersRef.current) {
          centersRef.current = new Float32Array(count * 2);
          velocitiesRef.current = new Float32Array(count * 2);
          radiiRef.current = new Float32Array(count);
          colorsRef.current = new Float32Array(count * 3);

          for (let i = 0; i < count; i++) {
            centersRef.current[i * 2] = Math.random();
            centersRef.current[i * 2 + 1] = Math.random();

            velocitiesRef.current[i * 2] = (Math.random() - 0.5) * maxSpeed;
            velocitiesRef.current[i * 2 + 1] = (Math.random() - 0.5) * maxSpeed;

            radiiRef.current[i] = maxRadius * (0.5 + Math.random() * 0.5);

            colorsRef.current[i * 3 + 0] = Math.random();
            colorsRef.current[i * 3 + 1] = Math.random();
            colorsRef.current[i * 3 + 2] = Math.random();
          }
        }

        const uResolutionLoc = gl.getUniformLocation(program, "u_resolution");
        const uTimeLoc = gl.getUniformLocation(program, "u_time");
        const uCentersLoc = gl.getUniformLocation(program, "u_centers");
        const uRadiiLoc = gl.getUniformLocation(program, "u_radii");
        const uColorsLoc = gl.getUniformLocation(program, "u_colors");

        return {
          update: (gl, program, time) => {
            // Update centers positions with velocity and bounce
            const centers = centersRef.current!;
            const velocities = velocitiesRef.current!;

            for (let i = 0; i < count; i++) {
              centers[i * 2] += velocities[i * 2] * 0.016; // approx frame time step
              centers[i * 2 + 1] += velocities[i * 2 + 1] * 0.016;

              if (centers[i * 2] < 0) {
                centers[i * 2] = 0;
                velocities[i * 2] *= -1;
              } else if (centers[i * 2] > 1) {
                centers[i * 2] = 1;
                velocities[i * 2] *= -1;
              }

              if (centers[i * 2 + 1] < 0) {
                centers[i * 2 + 1] = 0;
                velocities[i * 2 + 1] *= -1;
              } else if (centers[i * 2 + 1] > 1) {
                centers[i * 2 + 1] = 1;
                velocities[i * 2 + 1] *= -1;
              }
            }

            gl.uniform2f(uResolutionLoc, gl.canvas.width, gl.canvas.height);
            gl.uniform1f(uTimeLoc, time);
            gl.uniform2fv(uCentersLoc, centers);
            gl.uniform1fv(uRadiiLoc, radiiRef.current!);
            gl.uniform3fv(uColorsLoc, colorsRef.current!);
          },
        };
      }}
    />
  );
}
