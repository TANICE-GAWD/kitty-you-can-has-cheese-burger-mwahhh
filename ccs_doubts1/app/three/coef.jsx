'use client';

import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { createNoise4D } from 'simplex-noise';
import chroma from 'chroma-js';
import "../globals.module.css"

const InteractiveBackground = ({ noiseCoef = 50, heightCoef = 10, onColorsUpdate }) => {
  const mountRef = useRef(null);
  const sceneObjects = useRef({});

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const conf = {
      fov: 75,
      cameraZ: 75,
      xyCoef: noiseCoef,
      zCoef: heightCoef,
      lightIntensity: 0.9,
      light1Color: 0x0E09DC,
      light2Color: 0x1CD1E1,
      light3Color: 0x18C02C,
      light4Color: 0xee3bcf,
    };

    let renderer, scene, camera;
    let width, height;
    const noise4D = createNoise4D();
    const mouse = new THREE.Vector2();

    const init = () => {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(conf.fov);
      camera.position.z = conf.cameraZ;

      currentMount.appendChild(renderer.domElement);

      sceneObjects.current = { renderer, scene, camera, lights: [], plane: null };

      addLights();
      addPlane();
      handleResize();

      window.addEventListener('resize', handleResize);
      document.addEventListener('mousemove', handleMouseMove);

      animate();
    };

    const addLights = () => {
      // Reduced intensity for more vibrant colors
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
      scene.add(ambientLight);

      const r = 30, y = 10, lightDistance = 500;
      const light1 = new THREE.PointLight(conf.light1Color, conf.lightIntensity, lightDistance);
      light1.position.set(0, y, r);
      scene.add(light1);
      const light2 = new THREE.PointLight(conf.light2Color, conf.lightIntensity, lightDistance);
      light2.position.set(0, -y, -r);
      scene.add(light2);
      const light3 = new THREE.PointLight(conf.light3Color, conf.lightIntensity, lightDistance);
      light3.position.set(r, y, 0);
      scene.add(light3);
      const light4 = new THREE.PointLight(conf.light4Color, conf.lightIntensity, lightDistance);
      light4.position.set(-r, y, 0);
      scene.add(light4);
      sceneObjects.current.lights = [light1, light2, light3, light4];
    };

    const addPlane = () => {
      const { width: wWidth, height: wHeight } = getRendererSize();
      
      // MODIFICATION 1: Use MeshLambertMaterial for a matte, stylized look
      const mat = new THREE.MeshLambertMaterial({ color: 0xffffff, side: THREE.DoubleSide });

      const geo = new THREE.PlaneGeometry(wWidth, wHeight, wWidth / 2, wHeight / 2);
      const plane = new THREE.Mesh(geo, mat);
      plane.rotation.x = -Math.PI / 2 - 0.2;
      plane.position.y = -25;
      scene.add(plane);
      sceneObjects.current.plane = plane;
    };

    const animate = () => {
      requestAnimationFrame(animate);
      animatePlane();
      animateLights();
      renderer.render(scene, camera);
    };

    const animatePlane = () => {
      const plane = sceneObjects.current.plane;
      if (!plane) return;

      const gArray = plane.geometry.attributes.position.array;
      const time = Date.now() * 0.0002;
      for (let i = 0; i < gArray.length; i += 3) {
        gArray[i + 2] = noise4D(gArray[i] / conf.xyCoef, gArray[i + 1] / conf.xyCoef, time, mouse.x + mouse.y) * conf.zCoef;
      }
      plane.geometry.attributes.position.needsUpdate = true;
      
      // MODIFICATION 2: Removed normal calculations to create the stylized lighting effect
      // plane.geometry.computeVertexNormals();
      // plane.geometry.attributes.normal.needsUpdate = true;
    };

    const animateLights = () => {
      const time = Date.now() * 0.001, d = 50;
      const [l1, l2, l3, l4] = sceneObjects.current.lights;
      if (l1) {
        l1.position.x = Math.sin(time * 0.1) * d;
        l1.position.z = Math.cos(time * 0.2) * d;
      }
      if (l2) {
        l2.position.x = Math.cos(time * 0.3) * d;
        l2.position.z = Math.sin(time * 0.4) * d;
      }
      if (l3) {
        l3.position.x = Math.sin(time * 0.5) * d;
        l3.position.z = Math.sin(time * 0.6) * d;
      }
      if (l4) {
        l4.position.x = Math.sin(time * 0.7) * d;
        l4.position.z = Math.cos(time * 0.8) * d;
      }
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      if (renderer) renderer.setSize(width, height);
      if (camera) {
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
    };

    const handleMouseMove = e => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const getRendererSize = () => {
      const cam = new THREE.PerspectiveCamera(conf.fov, camera.aspect || window.innerWidth / window.innerHeight);
      const vFOV = (cam.fov * Math.PI) / 180;
      const h = 2 * Math.tan(vFOV / 2) * Math.abs(conf.cameraZ);
      const w = h * cam.aspect;
      return { width: w, height: h };
    };

    init();

    sceneObjects.current.updateCoefficients = (newNoise, newHeight) => {
      conf.xyCoef = newNoise;
      conf.zCoef = newHeight;
    };

    sceneObjects.current.updateColors = () => {
      const [l1, l2, l3, l4] = sceneObjects.current.lights;
      l1.color = new THREE.Color(chroma.random().hex());
      l2.color = new THREE.Color(chroma.random().hex());
      l3.color = new THREE.Color(chroma.random().hex());
      l4.color = new THREE.Color(chroma.random().hex());
      if (onColorsUpdate && typeof onColorsUpdate === 'function') {
        const colors = [l1.color.getHexString(), l2.color.getHexString(), l3.color.getHexString(), l4.color.getHexString()];
        onColorsUpdate(colors);
      }
    };

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousemove', handleMouseMove);
      if (renderer && currentMount && currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      sceneObjects.current.plane?.geometry.dispose();
      sceneObjects.current.plane?.material.dispose();
      renderer?.dispose();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (sceneObjects.current.updateCoefficients) {
      sceneObjects.current.updateCoefficients(noiseCoef, heightCoef);
    }
  }, [noiseCoef, heightCoef]);

  useEffect(() => {
    // This hook is still designed to expose the update function via a ref.
    // Be mindful of the API design bug mentioned in the code review.
    if (onColorsUpdate && sceneObjects.current.updateColors) {
      onColorsUpdate.current = sceneObjects.current.updateColors;
    }
  }, [onColorsUpdate]);

  return <div ref={mountRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }} />;
};

export default InteractiveBackground;