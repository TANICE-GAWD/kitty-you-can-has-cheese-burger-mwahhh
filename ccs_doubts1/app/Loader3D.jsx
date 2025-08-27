import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default function Loader3D({ onFinish }) {
  const mountRef = useRef();
  // Fade out state
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const scene = new THREE.Scene();
    // Transparent background
    scene.background = null;
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 2.5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambient);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
    dirLight.position.set(2, 2, 5);
    scene.add(dirLight);

    let model;
    const loader = new GLTFLoader();
    loader.load("/ccs_logo.glb", (gltf) => {
      model = gltf.scene;
      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      // Center and scale model to fit view
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      model.position.sub(center); // Center at origin
      // Scale to fit
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 1.2 / maxDim;
      model.scale.setScalar(scale);
      scene.add(model);
      animate();
    });

    let frameId;
    function animate() {
      frameId = requestAnimationFrame(animate);
      if (model) {
        model.rotation.y += 0.01;
        model.rotation.x = Math.sin(Date.now() * 0.001) * 0.1;
      }
      renderer.render(scene, camera);
    }

    // Fade out after 2.5s
    const timeout = setTimeout(() => {
      setFade(true);
      setTimeout(() => {
        if (onFinish) onFinish();
      }, 600);
    }, 2500);

    // Responsive resize
    function handleResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', handleResize);
      if (frameId) cancelAnimationFrame(frameId);
      renderer.dispose();
      if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [onFinish]);

  return (
    <div
      ref={mountRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 9999,
        background: "rgba(0,0,0,0.92)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: fade ? 0 : 1,
        pointerEvents: fade ? "none" : "auto",
        transition: "opacity 0.6s cubic-bezier(.4,0,.2,1)",
        overflow: "hidden"
      }}
    />
  );
}
