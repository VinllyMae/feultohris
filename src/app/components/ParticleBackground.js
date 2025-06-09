import { useCallback } from 'react';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

export default function ParticlesBackground() {
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fullScreen: { enable: true, zIndex: -1 },
        background: { color: "#ffffff" },
        particles: {
          number: { value: 40, density: { enable: true, area: 1000 } },
          color: { value: "#1e293b" },
          shape: { type: "circle" },
          opacity: { value: 0.2, random: true },
          size: { value: { min: 1, max: 3 } },
          move: { enable: true, speed: 0.6, direction: "none", outModes: { default: "bounce" } },
          links: { enable: true, color: "#64748b", distance: 120, opacity: 0.2, width: 1 }
        },
        interactivity: {
          events: { onHover: { enable: true, mode: "grab" }, onClick: { enable: true, mode: "push" }, resize: true },
          modes: { grab: { distance: 140, links: { opacity: 0.3 } }, push: { quantity: 2 } }
        },
        detectRetina: true
      }}
    />
  );
}
