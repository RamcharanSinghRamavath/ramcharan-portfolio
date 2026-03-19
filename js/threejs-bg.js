/* ==============================================
   threejs-bg.js  —  Three.js particle background
   ============================================== */

(function () {
  const canvas   = document.getElementById('hero-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 5);

  /* Particles */
  const count = 1800;
  const geo   = new THREE.BufferGeometry();
  const pos   = new Float32Array(count * 3);
  const col   = new Float32Array(count * 3);
  const colors = [[0.486,0.435,1],[1,0.420,0.616],[0,0.898,1],[0.3,0.3,0.7]];

  for (let i = 0; i < count; i++) {
    const r     = 3 + Math.random() * 14;
    const theta = Math.random() * Math.PI * 2;
    const phi   = Math.acos(2 * Math.random() - 1);
    pos[i*3]   = r * Math.sin(phi) * Math.cos(theta);
    pos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
    pos[i*3+2] = r * Math.cos(phi) - 4;
    const c = colors[Math.floor(Math.random() * colors.length)];
    col[i*3] = c[0]; col[i*3+1] = c[1]; col[i*3+2] = c[2];
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color',    new THREE.BufferAttribute(col, 3));
  scene.add(new THREE.Points(geo, new THREE.PointsMaterial({
    size: 0.04, vertexColors: true, transparent: true, opacity: 0.7
  })));

  /* Wireframe shapes */
  const shapes = [];
  const sg = [
    new THREE.IcosahedronGeometry(0.3, 0),
    new THREE.OctahedronGeometry(0.28, 0),
    new THREE.TetrahedronGeometry(0.25, 0),
  ];
  const sm = [
    new THREE.MeshBasicMaterial({ color: 0x7C6FFF, wireframe: true, transparent: true, opacity: 0.15 }),
    new THREE.MeshBasicMaterial({ color: 0xFF6B9D, wireframe: true, transparent: true, opacity: 0.12 }),
    new THREE.MeshBasicMaterial({ color: 0x00E5FF, wireframe: true, transparent: true, opacity: 0.10 }),
  ];
  for (let i = 0; i < 12; i++) {
    const m = new THREE.Mesh(sg[i % 3], sm[i % 3]);
    m.position.set(
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 8,
      (Math.random() - 0.5) * 4 - 2
    );
    m.userData = {
      rx: (Math.random() - 0.5) * 0.006,
      ry: (Math.random() - 0.5) * 0.008,
      fs: 0.0005 + Math.random() * 0.0008,
      fo: Math.random() * Math.PI * 2,
    };
    shapes.push(m);
    scene.add(m);
  }

  /* Torus rings */
  const torus = new THREE.Mesh(
    new THREE.TorusGeometry(2.5, 0.03, 8, 60),
    new THREE.MeshBasicMaterial({ color: 0x7C6FFF, wireframe: true, transparent: true, opacity: 0.06 })
  );
  torus.rotation.x = Math.PI / 4;
  scene.add(torus);

  const torus2 = new THREE.Mesh(
    new THREE.TorusGeometry(3.8, 0.02, 6, 80),
    new THREE.MeshBasicMaterial({ color: 0xFF6B9D, wireframe: true, transparent: true, opacity: 0.04 })
  );
  torus2.rotation.x = -Math.PI / 5;
  torus2.rotation.z =  Math.PI / 6;
  scene.add(torus2);

  /* Mouse parallax */
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 0.5;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 0.3;
  });

  /* Hero card tilt */
  const card = document.getElementById('hero-card');
  if (card) {
    card.parentElement.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const dx = (e.clientX - rect.left - rect.width  / 2) / rect.width  * 28;
      const dy = (e.clientY - rect.top  - rect.height / 2) / rect.height * 20;
      card.style.transform = `perspective(1000px) rotateY(${dx}deg) rotateX(${-dy}deg) translateZ(10px)`;
    });
    card.parentElement.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  }

  /* Render loop */
  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.005;
    camera.position.x += (mouseX  - camera.position.x) * 0.03;
    camera.position.y += (-mouseY - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);
    shapes.forEach((s) => {
      s.rotation.x += s.userData.rx;
      s.rotation.y += s.userData.ry;
      s.position.y += Math.sin(t * s.userData.fs * 200 + s.userData.fo) * 0.003;
    });
    torus.rotation.y  += 0.002;
    torus2.rotation.y -= 0.0015;
    renderer.render(scene, camera);
  }
  animate();

  /* Resize */
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();
