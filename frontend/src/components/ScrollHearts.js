import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import "../styles/ScrollHearts.css";

const ScrollHearts = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Make sure mountRef is available
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, 400);
    mountRef.current.appendChild(renderer.domElement);

    const heartShape = new THREE.Shape();
    const x = 0, y = 0;
    heartShape.moveTo(x + 5, y + 5);
    heartShape.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y);
    heartShape.bezierCurveTo(x - 6, y, x - 6, y + 7, x - 6, y + 7);
    heartShape.bezierCurveTo(x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19);
    heartShape.bezierCurveTo(x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7);
    heartShape.bezierCurveTo(x + 16, y + 7, x + 16, y, x + 10, y);
    heartShape.bezierCurveTo(x + 7, y, x + 5, y + 5, x + 5, y + 5);

    const geometry = new THREE.ExtrudeGeometry(heartShape, { depth: 2, bevelEnabled: true, bevelThickness: 1 });
    const material = new THREE.MeshStandardMaterial({ color: 0xff4d6d });
    const heart = new THREE.Mesh(geometry, material);
    heart.scale.set(0.05, 0.05, 0.05);
    heart.position.set(-1, 0, -5);
    scene.add(heart);

    const light = new THREE.PointLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);

    let animationFrameId;
    
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      heart.rotation.y += 0.01;
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup function
    return () => {
      // Cancel animation frame before cleaning up
      cancelAnimationFrame(animationFrameId);
      
      // Only try to remove child if mountRef.current exists
      if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose of THREE.js resources
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return <div className="hearts-canvas" ref={mountRef}></div>;
};

export default ScrollHearts;