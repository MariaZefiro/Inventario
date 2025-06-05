import React, { useEffect } from "react";

const ParticlesBackground = () => {
  useEffect(() => {
    const script1 = document.createElement("script");
    script1.src = "https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js";
    script1.async = true;
    document.body.appendChild(script1);

    const script2 = document.createElement("script");
    script2.src = "https://threejs.org/examples/js/libs/stats.min.js";
    script2.async = true;
    document.body.appendChild(script2);

    script1.onload = () => {
      window.particlesJS("particles-js", {
        particles: {
          number: { value: 70, density: { enable: true, value_area: 800 } },
          color: { value: "#0b6bcb" },
          shape: {
            type: "circle",
            stroke: { width: 0, color: "#000000" },
            polygon: { nb_sides: 5 },
            image: { src: "img/github.svg", width: 80, height: 80 },
          },
          opacity: {
            value: 0.5,
            random: false,
            anim: { enable: false, speed: 1, opacity_min: 0.1, sync: false },
          },
          size: {
            value: 2,
            random: true,
            anim: { enable: false, speed: 40, size_min: 0.1, sync: false },
          },
          line_linked: {
            enable: true,
            distance: 150,
            color: "#ffffff",
            opacity: 0.4,
            width: 1,
          },
          move: {
            enable: true,
            speed: 6,
            direction: "none",
            random: false,
            straight: false,
            out_mode: "out",
            bounce: false,
            attract: { enable: false, rotateX: 600, rotateY: 1200 },
          },
        },
        interactivity: {
          detect_on: "canvas",
          events: {
            onhover: { enable: true, mode: "repulse" },
            onclick: { enable: false, mode: "push" },
            resize: true,
          },
          modes: {
            grab: { distance: 400, line_linked: { opacity: 1 } },
            bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 },
            repulse: { distance: 140, duration: 0.4 },
            push: { particles_nb: 4 },
            remove: { particles_nb: 2 },
          },
        },
        retina_detect: true,
      });

      if (typeof window.Stats !== "undefined") {
        const stats = new window.Stats();
        stats.setMode(0);
        stats.domElement.style.position = "absolute";
        stats.domElement.style.left = "0px";
        stats.domElement.style.top = "0px";
        document.body.appendChild(stats.domElement);

        const count_particles = document.querySelector(".js-count-particles");
        const update = () => {
          stats.begin();
          stats.end();
          if (window.pJSDom[0].pJS.particles && window.pJSDom[0].pJS.particles.array) {
            count_particles.innerText = window.pJSDom[0].pJS.particles.array.length;
          }
          requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
      }
    };
  }, []);

  return <div id="particles-js"></div>;
};

export default ParticlesBackground;