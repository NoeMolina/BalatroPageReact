import React, { useRef, useEffect } from "react";
import * as THREE from "three";

const ShaderBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Scene, camera, and renderer setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 1; // Mueve la cámara hacia atrás
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mount.appendChild(renderer.domElement);

    // Shader material
    const uniforms = {
      u_time: { value: 0.0 },
      u_resolution: {
        value: new THREE.Vector2(window.innerWidth, window.innerHeight),
      },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: `
        void main() {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
          #define SPIN_ROTATION -1.0
          #define OFFSET vec2(0.0)
          #define COLOUR_1 vec4(0.871, 0.267, 0.231, 1.0)
          #define COLOUR_2 vec4(0.0, 0.42, 0.706, 1.0)
          #define COLOUR_3 vec4(0.086, 0.137, 0.145, 1.0)
          #define CONTRAST 3.5
          #define LIGTHING 0.4
          #define SPIN_AMOUNT 0.25
          #define PIXEL_FILTER 745.0
          #define SPIN_EASE 1.0
          #define PI 3.14159265359
          #define IS_ROTATE false
          #define SPIN_SPEED 7.0
          
          uniform float u_time;
          uniform vec2 u_resolution;
          
    vec4 effect(vec2 screenSize, vec2 screen_coords) {
        float pixel_size = length(screenSize.xy) / PIXEL_FILTER;
        vec2 uv = (floor(screen_coords.xy * (1.0 / pixel_size)) * pixel_size - 0.5 * screenSize.xy) / length(screenSize.xy) - OFFSET;
        float uv_len = length(uv);

        float speed = (SPIN_ROTATION * SPIN_EASE * 0.2);
        if (IS_ROTATE) {
            speed = u_time * speed;
        }
        speed += 302.2;
        float new_pixel_angle = atan(uv.y, uv.x) + speed - SPIN_EASE * 20.0 * (1.0 * SPIN_AMOUNT * uv_len + (1.0 - 1.0 * SPIN_AMOUNT));
        vec2 mid = (screenSize.xy / length(screenSize.xy)) / 2.0;
        uv = (vec2((uv_len * cos(new_pixel_angle) + mid.x), (uv_len * sin(new_pixel_angle) + mid.y)) - mid);

        uv *= 30.0;
        speed = u_time * (SPIN_SPEED);
        vec2 uv2 = vec2(uv.x + uv.y);

        for (int i = 0; i < 5; i++) {
            uv2 += sin(max(uv.x, uv.y)) + uv;
            uv += 0.5 * vec2(cos(5.1123314 + 0.353 * uv2.y + speed * 0.131121), sin(uv2.x - 0.113 * speed));
            uv -= 1.0 * cos(uv.x + uv.y) - 1.0 * sin(uv.x * 0.711 - uv.y);
        }

        float contrast_mod = (0.25 * CONTRAST + 0.5 * SPIN_AMOUNT + 1.2);
        float paint_res = min(2.0, max(0.0, length(uv) * (0.035) * contrast_mod));
        float c1p = max(0.0, 1.0 - contrast_mod * abs(1.0 - paint_res));
        float c2p = max(0.0, 1.0 - contrast_mod * abs(paint_res));
        float c3p = 1.0 - min(1.0, c1p + c2p);
        float light = (LIGTHING - 0.2) * max(c1p * 5.0 - 4.0, 0.0) + LIGTHING * max(c2p * 5.0 - 4.0, 0.0);
        return (0.3 / CONTRAST) * COLOUR_1 + (1.0 - 0.3 / CONTRAST) * (COLOUR_1 * c1p + COLOUR_2 * c2p + vec4(c3p * COLOUR_3.rgb, c3p * COLOUR_1.a)) + light;
    }

          void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        gl_FragColor = effect(u_resolution.xy, uv * u_resolution.xy);
            }
      `,
    });

    // Plane geometry
    const geometry = new THREE.PlaneGeometry(10, 10); // Asegúrate de que el plano sea lo suficientemente grande
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    // Animation loop
    const animate = () => {
      uniforms.u_time.value += 0.005;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    // Cleanup on unmount
    return () => {
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
    />
  );
};

export default ShaderBackground;
