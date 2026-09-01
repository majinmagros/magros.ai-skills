#!/usr/bin/env node
/**
 * scroll-animations.js — GSAP ScrollTrigger integration for Three.js scenes.
 * 
 * Uso: import { setupScrollAnimations, ScrollTrigger } from './scripts/scroll-animations.js';
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register plugin
gsap.registerPlugin(ScrollTrigger);

/**
 * Configura animações de scroll para cena Three.js
 * @param {Object} composer - Instância do SceneComposer
 * @param {Object} options - Opções de configuração
 * @returns {Object} - Objeto com métodos de controle
 */
export function setupScrollAnimations(composer, options = {}) {
  const { camera, scene, portal, blocks, controls, canvas } = composer;
  const config = {
    container: options.container || '#canvas-container',
    cameraOrbit: options.cameraOrbit !== false,
    cameraOrbitRadius: options.cameraOrbitRadius || 30,
    cameraOrbitCycles: options.cameraOrbitCycles || 2,
    pinCanvas: options.pinCanvas !== false,
    pinSection: options.pinSection || '#canvas-section',
    scrub: options.scrub !== false ? 1 : false,
    ...options
  };
  
  const animations = {};
  const scrollTriggers = [];
  
  // 1. Camera orbit on scroll
  if (config.cameraOrbit && camera) {
    const orbitTrigger = ScrollTrigger.create({
      trigger: config.container,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        const progress = self.progress;
        const radius = config.cameraOrbitRadius;
        const angle = progress * Math.PI * 2 * config.cameraOrbitCycles;
        
        camera.position.x = Math.sin(angle) * radius;
        camera.position.z = Math.cos(angle) * radius;
        camera.position.y = 15 + Math.sin(progress * Math.PI * 2) * 5;
        
        camera.lookAt(0, 0, 0);
      }
    });
    animations.cameraOrbit = orbitTrigger;
    scrollTriggers.push(orbitTrigger);
  }
  
  // 2. Camera position animation (linear)
  if (camera && !config.cameraOrbit) {
    const posTrigger = gsap.to(camera.position, {
      z: 50,
      y: 20,
      ease: 'none',
      scrollTrigger: {
        trigger: config.container,
        start: 'top top',
        end: 'bottom bottom',
        scrub: config.scrub,
        onUpdate: (self) => {
          camera.lookAt(0, 0, 0);
        }
      }
    });
    animations.cameraPosition = posTrigger;
    scrollTriggers.push(posTrigger.scrollTrigger);
  }
  
  // 3. Pin canvas section
  if (config.pinCanvas) {
    const pinTrigger = ScrollTrigger.create({
      trigger: config.pinSection,
      start: 'top top',
      end: '+=3000',
      pin: true,
      pinSpacing: true,
      scrub: config.scrub,
      anticipatePin: 1
    });
    animations.pinCanvas = pinTrigger;
    scrollTriggers.push(pinTrigger);
  }
  
  // 4. Portal rotation (continuous)
  if (composer.portal) {
    gsap.to(composer.portal.rotation, {
      y: Math.PI * 2,
      ease: 'none',
      repeat: -1,
      duration: 20
    });
  }
  
  // 5. Block animations on scroll
  if (composer.blocks && composer.blocks.size > 0) {
    composer.blocks.forEach((block, id) => {
      // Scale in on scroll
      gsap.fromTo(block.scale, 
        { x: 0, y: 0, z: 0 },
        { 
          x: 1, y: 1, z: 1,
          duration: 1,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: config.container,
            start: 'top 80%',
            end: 'top 20%',
            scrub: 0.5
          }
        }
      );
      
      // Float animation
      gsap.to(block.position, {
        y: '+=0.5',
        duration: 2 + Math.random() * 2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: Math.random() * 2
      });
    });
  }
  
  // 6. Portal material uniform animation
  if (composer.portal && composer.portal.material.uniforms) {
    gsap.to(composer.portal.material.uniforms.time, {
      value: 100,
      ease: 'none',
      scrollTrigger: {
        trigger: config.container,
        start: 'top top',
        end: 'bottom bottom',
        scrub: config.scrub
      }
    });
  }
  
  // 7. Camera path animation (advanced)
  if (options.cameraPath && camera) {
    const pathTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: config.container,
        start: 'top top',
        end: 'bottom bottom',
        scrub: config.scrub
      }
    });
    
    options.cameraPath.forEach((point, i) => {
      pathTimeline.to(camera.position, {
        x: point.position[0],
        y: point.position[1],
        z: point.position[2],
        duration: 1,
        ease: 'power2.inOut'
      }, i === 0 ? 0 : '>-0.5');
      
      pathTimeline.to(camera, {
        fov: point.fov || 60,
        duration: 1,
        ease: 'power2.inOut'
      }, i === 0 ? 0 : '>-0.5');
      
      pathTimeline.to({}, {
        duration: 1,
        ease: 'power2.inOut',
        onUpdate: () => {
          camera.lookAt(...point.target);
        }
      }, i === 0 ? 0 : '>-0.5');
    });
  }
  
  // 8. Color transition on scroll
  if (composer.portal && composer.portal.material.uniforms) {
    gsap.to(composer.portal.material.uniforms.colorA.value, {
      r: 1, g: 0, b: 0, // Red
      ease: 'none',
      scrollTrigger: {
        trigger: '#color-section',
        start: 'top center',
        end: 'bottom center',
        scrub: config.scrub
      }
    });
  }
  
  // 9. Morph target animation
  composer.animatedObjects.forEach(obj => {
    if (obj.morphTargetInfluences) {
      gsap.to(obj.morphTargetInfluences, {
        [0]: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: config.container,
          start: 'top center',
          end: 'bottom center',
          scrub: config.scrub
        }
      });
    }
  });
  
  // 10. Color transition on scroll (sections)
  const colorSections = options.colorSections || [];
  colorSections.forEach(section => {
    if (composer.portal && composer.portal.material.uniforms) {
      gsap.to(composer.portal.material.uniforms.colorA.value, {
        r: section.color.r,
        g: section.color.g,
        b: section.color.b,
        ease: 'none',
        scrollTrigger: {
          trigger: section.trigger,
          start: 'top center',
          end: 'bottom center',
          scrub: config.scrub
        }
      });
    });
  });
  
  // Return control object
  return {
    animations,
    scrollTriggers,
    // Control methods
    pause: () => {
      scrollTriggers.forEach(t => t && t.disable && t.disable());
      gsap.globalTimeline.pause();
    },
    resume: () => {
      scrollTriggers.forEach(t => t && t.enable && t.enable());
      gsap.globalTimeline.resume();
    },
    kill: () => {
      scrollTriggers.forEach(t => t && t.kill && t.kill());
      gsap.killTweensOf('*');
    },
    refresh: () => {
      ScrollTrigger.refresh();
    },
    // Get specific animation
    get: (name) => animations[name],
    // Update config
    updateConfig: (newConfig) => {
      Object.assign(config, newConfig);
    }
  };
}

/**
 * Camera path animation along predefined points
 */
export function createCameraPathAnimation(camera, path, options = {}) {
  const {
    scrollTrigger: { trigger, start, end, scrub } = options.scrollTrigger || {},
    duration = 1,
    ease = 'power2.inOut'
  } = options;
  
  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger,
      start,
      end,
      scrub
    }
  });
  
  path.forEach((point, i) => {
    timeline.to(camera.position, {
      x: point.position[0],
      y: point.position[1],
      z: point.position[2],
      duration,
      ease
    }, i === 0 ? 0 : '>-0.5');
    
    timeline.to(camera, {
      fov: point.fov || 60,
      duration,
      ease
    }, i === 0 ? 0 : '>-0.5');
    
    timeline.to({}, {
      duration,
      ease,
      onUpdate: () => {
        camera.lookAt(...point.target);
      }
    }, i === 0 ? 0 : '>-0.5');
  });
  
  return timeline;
}

/**
 * Animate shader uniform on scroll
 */
export function animateUniformOnScroll(uniform, targetValue, options = {}) {
  return gsap.to(uniform, {
    value: targetValue,
    ease: 'none',
    scrollTrigger: {
      trigger: options.trigger || '#canvas-container',
      start: options.start || 'top top',
      end: options.end || 'bottom bottom',
      scrub: options.scrub !== false ? 1 : false
    }
  });
}

/**
 * Morph target animation on scroll
 */
export function animateMorphTargetOnScroll(mesh, targetIndex, options = {}) {
  return gsap.to(mesh.morphTargetInfluences, {
    [targetIndex]: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: options.trigger || '#canvas-container',
      start: options.start || 'top center',
      end: options.end || 'bottom center',
      scrub: options.scrub !== false ? 1 : false
    }
  });
}

/**
 * Color transition on scroll
 */
export function colorTransitionOnScroll(material, targetColor, options = {}) {
  return gsap.to(material.color, {
    r: targetColor.r,
    g: targetColor.g,
    b: targetColor.b,
    ease: 'none',
    scrollTrigger: {
      trigger: options.trigger,
      start: options.start || 'top center',
      end: options.end || 'bottom center',
      scrub: options.scrub !== false ? 1 : false
    }
  });
}

/**
 * Setup ScrollTrigger defaults
 */
export function setupScrollTriggerDefaults(defaults = {}) {
  ScrollTrigger.defaults({
    markers: process.env.NODE_ENV === 'development',
    ...defaults
  });
}

/**
 * Cleanup all ScrollTriggers
 */
export function killAllScrollTriggers() {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  gsap.killTweensOf('*');
}

/**
 * Refresh all ScrollTriggers
 */
export function refreshScrollTriggers() {
  ScrollTrigger.refresh();
}

/**
 * Debug helpers
 */
export function enableScrollTriggerDebug() {
  ScrollTrigger.defaults({ markers: true });
}

export function disableScrollTriggerDebug() {
  ScrollTrigger.defaults({ markers: false });
}

export { gsap, ScrollTrigger };