import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const ScrollHearts = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    camera.position.z = 20;
    
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, 400);
    mountRef.current.appendChild(renderer.domElement);
    
    // Create heart shape
    const heartShape = new THREE.Shape();
    const x = 0, y = 0;
    
    heartShape.moveTo(x + 5, y + 5);
    heartShape.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y);
    heartShape.bezierCurveTo(x - 6, y, x - 6, y + 7, x - 6, y + 7);
    heartShape.bezierCurveTo(x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19);
    heartShape.bezierCurveTo(x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7);
    heartShape.bezierCurveTo(x + 16, y + 7, x + 16, y, x + 10, y);
    heartShape.bezierCurveTo(x + 7, y, x + 5, y + 5, x + 5, y + 5);
    
    // Heart instances
    const hearts = [];
    const heartColors = [0xff4d6d, 0xff758f, 0xd81b60, 0xad1457, 0xff80ab];
    
    // Create multiple hearts in background (behind text)
    for (let i = 0; i < 8; i++) {
      const geometry = new THREE.ExtrudeGeometry(heartShape, {
        depth: 2,
        bevelEnabled: true,
        bevelThickness: 1,
        bevelSize: 1,
        bevelSegments: 3
      });
      
      const material = new THREE.MeshPhongMaterial({
        color: heartColors[Math.floor(Math.random() * heartColors.length)],
        shininess: 50,
        specular: 0x444444
      });
      
      const heart = new THREE.Mesh(geometry, material);
      heart.scale.set(0.05, 0.05, 0.05);
      
      // Random position
      heart.position.x = Math.random() * 20 - 10;
      heart.position.y = Math.random() * 10 - 5;
      heart.position.z = Math.random() * 10 - 25; // Further back
      
      // Random rotation
      heart.rotation.x = Math.random() * Math.PI;
      heart.rotation.y = Math.random() * Math.PI;
      
      // Store rotation speed
      heart.userData = {
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.02,
          y: (Math.random() - 0.5) * 0.02
        },
        floatSpeed: 0.01 + Math.random() * 0.01,
        floatOffset: Math.random() * Math.PI * 2,
        layer: "background"
      };
      
      scene.add(heart);
      hearts.push(heart);
    }
    
    // Create hearts in foreground (in front of text)
    for (let i = 0; i < 5; i++) {
      const geometry = new THREE.ExtrudeGeometry(heartShape, {
        depth: 2,
        bevelEnabled: true,
        bevelThickness: 1,
        bevelSize: 1,
        bevelSegments: 3
      });
      
      const material = new THREE.MeshPhongMaterial({
        color: heartColors[Math.floor(Math.random() * heartColors.length)],
        shininess: 50,
        specular: 0x444444,
        transparent: true,
        opacity: 0.9 // Slightly transparent so they don't completely block text
      });
      
      const heart = new THREE.Mesh(geometry, material);
      heart.scale.set(0.045, 0.045, 0.045); // Slightly smaller
      
      // Random position but more centered
      heart.position.x = (Math.random() * 12 - 6) * 0.8; // More centered
      heart.position.y = (Math.random() * 6 - 3) * 0.8; // More centered
      heart.position.z = Math.random() * 6 - 3; // In front of camera's focus
      
      // Random rotation
      heart.rotation.x = Math.random() * Math.PI;
      heart.rotation.y = Math.random() * Math.PI;
      
      // Store rotation speed - slower for foreground hearts
      heart.userData = {
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.01, // Slower rotation
          y: (Math.random() - 0.5) * 0.01
        },
        floatSpeed: 0.005 + Math.random() * 0.005, // Slower float
        floatOffset: Math.random() * Math.PI * 2,
        layer: "foreground"
      };
      
      scene.add(heart);
      hearts.push(heart);
    }
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    // Add a spotlight to highlight foreground hearts
    const spotlight = new THREE.SpotLight(0xffffff, 1);
    spotlight.position.set(0, 0, 10);
    spotlight.angle = Math.PI / 4;
    spotlight.penumbra = 0.1;
    spotlight.decay = 2;
    spotlight.distance = 200;
    scene.add(spotlight);
    
    // Animation
    let animationFrameId;
    let time = 0;
    
    const animate = () => {
      time += 0.01;
      animationFrameId = requestAnimationFrame(animate);
      
      // Animate each heart
      hearts.forEach(heart => {
        // Rotate
        heart.rotation.x += heart.userData.rotationSpeed.x;
        heart.rotation.y += heart.userData.rotationSpeed.y;
        
        // Float up and down
        const floatIntensity = heart.userData.layer === "foreground" ? 0.05 : 0.1;
        heart.position.y = heart.position.y + Math.sin(time + heart.userData.floatOffset) * heart.userData.floatSpeed * floatIntensity;
        
        // Add slight horizontal movement for foreground hearts
        if (heart.userData.layer === "foreground") {
          heart.position.x += Math.sin(time * 0.5 + heart.userData.floatOffset) * 0.01;
        }
      });
      
      renderer.render(scene, camera);
    };
    
    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / 400;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, 400);
    };
    
    window.addEventListener('resize', handleResize);
    animate();
    
    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      
      if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose resources
      hearts.forEach(heart => {
        heart.geometry.dispose();
        heart.material.dispose();
      });
      renderer.dispose();
    };
  }, []);
  
  return (
    <div className="hearts-canvas" ref={mountRef}>
      <div className="hearts-overlay">
        <h2>Visualizing Heart Health</h2>
      </div>
    </div>
  );
};

export default ScrollHearts;