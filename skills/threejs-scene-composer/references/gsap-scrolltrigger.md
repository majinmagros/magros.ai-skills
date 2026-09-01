# GSAP ScrollTrigger + Three.js Reference (Validado via Context7)

## Library: GSAP (`/greensock/gsap-skills`)

### Installation

```bash
npm install gsap
# ou
npm install gsap@latest
```

### Core Integration Pattern

```javascript
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register plugin
gsap.registerPlugin(ScrollTrigger);

// Three.js objects
const camera = new THREE.PerspectiveCamera(...);
const scene = new THREE.Scene();
const portal = scene.getObjectByName('portal');
const blocks = new Map(); // block id -> mesh
```

---

## ScrollTrigger + Three.js Patterns

### 1. Camera Animation on Scroll

```javascript
// Camera position based on scroll progress
gsap.to(camera.position, {
  z: 50,
  y: 20,
  ease: 'none',
  scrollTrigger: {
    trigger: '#canvas-container',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1, // Smooth scrub (1 = 1:1, 0.5 = half speed)
    onUpdate: (self) => {
      const progress = self.progress;
      // Custom camera logic
      camera.lookAt(0, 0, 0);
    }
  }
});
```

### 2. Camera Orbit on Scroll

```javascript
ScrollTrigger.create({
  trigger: '#canvas-container',
  start: 'top top',
  end: 'bottom bottom',
  onUpdate: (self) => {
    const progress = self.progress;
    const radius = 30;
    const angle = progress * Math.PI * 4; // 2 full orbits
    
    camera.position.x = Math.sin(angle) * radius;
    camera.position.z = Math.cos(angle) * radius;
    camera.position.y = 15 + Math.sin(progress * Math.PI * 2) * 5;
    
    camera.lookAt(0, 0, 0);
  }
});
```

### 3. Pin Canvas Section

```javascript
ScrollTrigger.create({
  trigger: '#canvas-section',
  start: 'top top',
  end: '+=3000', // 3000px of scroll
  pin: true,
  pinSpacing: true,
  scrub: 1,
  anticipatePin: 1
});
```

### 3D Object Animations on Scroll

```javascript
// Portal rotation
gsap.to(portal.rotation, {
  y: Math.PI * 2,
  ease: 'none',
  repeat: -1,
  duration: 20
});

// Block float animation (staggered)
blocks.forEach((block, index) => {
  gsap.to(block.position, {
    y: '+=0.5',
    duration: 2 + Math.random() * 2,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
    delay: index * 0.1
  });
});

// Scale on scroll into view
blocks.forEach((block, id) => {
  gsap.fromTo(block.scale, 
    { x: 0, y: 0, z: 0 },
    { 
      x: 1, y: 1, z: 1,
      duration: 1,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: '#canvas-container',
        start: 'top 80%',
        end: 'top 20%',
        scrub: 0.5
      }
    }
  );
});
```

### Camera Path Animation (Advanced)

```javascript
// Define camera path as array of points
const cameraPath = [
  { position: [15, 15, 15], target: [0, 0, 0], fov: 60 },
  { position: [0, 20, 30], target: [0, 2, 0], fov: 45 },
  { position: [-20, 10, 0], target: [0, 0, 0], fov: 70 },
  { position: [0, 5, -25], target: [0, 0, 0], fov: 60 }
];

// Animate along path
const pathTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: '#canvas-container',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1
  }
});

cameraPath.forEach((point, i) => {
  pathTimeline.to(camera.position, {
    x: point.position[0],
    y: point.position[1],
    z: point.position[2],
    duration: 1,
    ease: 'power2.inOut'
  }, i === 0 ? 0 : '>-0.5'); // Overlap slightly
  
  pathTimeline.to(camera, {
    fov: point.fov,
    duration: 1,
    ease: 'power2.inOut'
  }, i === 0 ? 0 : '>-0.5');
  
  // Camera lookAt target
  pathTimeline.to({}, {
    duration: 1,
    onUpdate: () => {
      camera.lookAt(...point.target);
    }
  }, i === 0 ? 0 : '>-0.5');
});
```

---

## ScrollTrigger Config Options

```javascript
const scrollConfig = {
  trigger: '#canvas-container',     // Element to watch
  start: 'top top',                 // When trigger top hits viewport top
  end: 'bottom bottom',             // When trigger bottom hits viewport bottom
  scrub: 1,                         // Smooth scrub (true/number)
  pin: true,                        // Pin element during scroll
  pinSpacing: true,                 // Add padding for pin
  anticipatePin: 1,                 // Anticipate pin for smoothness
  markers: false,                   // Debug markers (dev only)
  onUpdate: (self) => {},           // Callback on scroll
  onEnter: () => {},                // When enters
  onLeave: () => {},                // When leaves
  onEnterBack: () => {},            // When enters backwards
  onLeaveBack: () => {}             // When leaves backwards
};
```

### Scrub Values

| Value | Behavior |
|-------|----------|
| `true` / `1` | 1:1 sync with scroll |
| `0.5` | Half speed |
| `2` | Double speed |
| `0` | No scrub (jump) |

---

## Three.js Specific Helpers

### Animate Uniform on Scroll

```javascript
// Shader material uniform animation
gsap.to(portal.material.uniforms.time, {
  value: 100,
  ease: 'none',
  scrollTrigger: {
    trigger: '#canvas-container',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1
  }
});
```

### Morph Target Animation

```javascript
gsap.to(mesh.morphTargetInfluences, {
  [0]: 1, // First morph target
  ease: 'none',
  scrollTrigger: {
    trigger: '#canvas-section',
    start: 'top center',
    end: 'bottom center',
    scrub: 1
  }
});
```

### Color Transition on Scroll

```javascript
gsap.to(material.color, {
  r: 1, g: 0, b: 0, // Red
  ease: 'none',
  scrollTrigger: {
    trigger: '#color-section',
    start: 'top center',
    end: 'bottom center',
    scrub: 1
  }
});
```

---

## Performance Tips

1. **Use `scrub: 1`** for smooth 60fps sync
2. **Avoid heavy calculations in `onUpdate`** — keep it minimal
3. **Use `gsap.quickTo()`** for frequent updates
4. **Batch DOM reads/writes** with `gsap.batch()`
5. **Kill triggers on unmount** — `ScrollTrigger.getAll().forEach(t => t.kill())`

```javascript
// Cleanup
function cleanup() {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  gsap.killTweensOf('*');
}
```

---

## Debug Mode

```javascript
// Enable markers for debugging
gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.defaults({ markers: true }); // Only in dev!

// Or per trigger
scrollTrigger: {
  markers: process.env.NODE_ENV === 'development'
}
```

---

## Referências Oficiais

- GSAP Skills: https://github.com/greensock/gsap-skills (Context7 `/greensock/gsap-skills`)
- ScrollTrigger Docs: https://greensock.com/docs/v3/Plugins/ScrollTrigger
- GSAP + Three.js Examples: https://greensock.com/threejs/
- Benchmark: 81.1
- Source Reputation: High