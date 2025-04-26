// Three.js Scene Setup
let scene, camera, renderer, particles, raycaster, mouse;
let floatingObjects = [];
let floatingSymbols = [];
let codeRings = [];
const container = document.getElementById('three-container');

// Tech symbols and code snippets
const techSymbols = [
    '{ }', '</>',  '[]', '()', '#!/',
    'npm', 'git', '===', '=>', '&&',
    '||', '++', '--', '!=', '+=',
];

const codeSnippets = [
    'function()', 'const', 'let', 'import',
    'export', 'class', 'return', 'async',
    'await', 'try/catch', 'map()', 'filter()'
];

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true 
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    camera.position.z = 30;

    createParticles();
    createFloatingGeometries();
    createFloatingSymbols();
    createCodeRings();
    addLighting();
    
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onMouseClick);

    // Add interactive tech items
    document.querySelectorAll('.tech-item').forEach(item => {
        item.addEventListener('mouseenter', () => {
            createTechItemEffect(item);
        });
    });

    animate();
}

function createParticles() {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    
    for (let i = 0; i < 3000; i++) {
        vertices.push(
            (Math.random() - 0.5) * 1000,
            (Math.random() - 0.5) * 1000,
            (Math.random() - 0.5) * 1000
        );
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    
    const material = new THREE.PointsMaterial({
        size: 2,
        color: 0x00f2fe,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    particles = new THREE.Points(geometry, material);
    scene.add(particles);
}

function createFloatingGeometries() {
    const geometries = [
        new THREE.IcosahedronGeometry(1.5, 0),
        new THREE.OctahedronGeometry(1.5, 0),
        new THREE.TetrahedronGeometry(1.5, 0),
        new THREE.TorusGeometry(1, 0.4, 16, 100)
    ];
    
    const material = new THREE.MeshPhongMaterial({
        color: 0x00f2fe,
        wireframe: true,
        transparent: true,
        opacity: 0.8
    });
    
    for (let i = 0; i < 15; i++) {
        const geometry = geometries[Math.floor(Math.random() * geometries.length)];
        const mesh = new THREE.Mesh(geometry, material);
        
        mesh.position.set(
            (Math.random() - 0.5) * 40,
            (Math.random() - 0.5) * 40,
            (Math.random() - 0.5) * 40
        );
        
        mesh.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        
        mesh.velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 0.05,
            (Math.random() - 0.5) * 0.05,
            (Math.random() - 0.5) * 0.05
        );
        
        mesh.rotationVelocity = new THREE.Vector3(
            Math.random() * 0.02,
            Math.random() * 0.02,
            Math.random() * 0.02
        );
        
        mesh.originalColor = new THREE.Color(0x00f2fe);
        mesh.targetColor = new THREE.Color(0x00f2fe);
        
        floatingObjects.push(mesh);
        scene.add(mesh);
    }
}

function createCodeRings() {
    const ringGeometry = new THREE.TorusGeometry(15, 0.3, 16, 100);
    const ringMaterial = new THREE.MeshPhongMaterial({
        color: 0x00f2fe,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
    });

    for (let i = 0; i < 3; i++) {
        const ring = new THREE.Mesh(ringGeometry, ringMaterial.clone());
        ring.rotation.x = Math.random() * Math.PI;
        ring.rotation.y = Math.random() * Math.PI;
        
        ring.userData = {
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.002,
                y: (Math.random() - 0.5) * 0.002,
                z: (Math.random() - 0.5) * 0.002
            }
        };
        
        codeRings.push(ring);
        scene.add(ring);
    }
}

function createTechItemEffect(item) {
    const rect = item.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth * 2 - 1;
    const y = -(rect.top + rect.height / 2) / window.innerHeight * 2 + 1;

    const geometry = new THREE.IcosahedronGeometry(0.5, 0);
    const material = new THREE.MeshPhongMaterial({
        color: 0x00f2fe,
        wireframe: true,
        transparent: true,
        opacity: 0.8
    });

    const effect = new THREE.Mesh(geometry, material);
    effect.position.set(x * 30, y * 15, 0);
    effect.scale.set(0.1, 0.1, 0.1);

    scene.add(effect);
    gsap.to(effect.scale, {
        x: 2,
        y: 2,
        z: 2,
        duration: 1,
        ease: "power2.out",
        onComplete: () => {
            scene.remove(effect);
        }
    });
}

function createFloatingSymbols() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 256;

    [...techSymbols, ...codeSnippets].forEach((text, index) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#00f2fe';
        ctx.font = 'bold 48px Fira Code';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, canvas.width/2, canvas.height/2);

        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({ 
            map: texture,
            transparent: true,
            opacity: 0.8
        });

        const sprite = new THREE.Sprite(material);
        sprite.scale.set(4, 2, 1);
        sprite.position.set(
            (Math.random() - 0.5) * 60,
            (Math.random() - 0.5) * 60,
            (Math.random() - 0.5) * 60
        );

        sprite.velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 0.03,
            (Math.random() - 0.5) * 0.03,
            (Math.random() - 0.5) * 0.03
        );

        sprite.userData = {
            originalScale: sprite.scale.clone(),
            rotationSpeed: Math.random() * 0.02 - 0.01
        };

        floatingSymbols.push(sprite);
        scene.add(sprite);
    });
}

function addLighting() {
    const ambientLight = new THREE.AmbientLight(0x00f2fe, 0.5);
    scene.add(ambientLight);
    
    const pointLight1 = new THREE.PointLight(0x00f2fe, 1);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0x4facfe, 1);
    pointLight2.position.set(-10, -10, -10);
    scene.add(pointLight2);
}

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    camera.position.x += (mouse.x * 5 - camera.position.x) * 0.1;
    camera.position.y += (-mouse.y * 5 - camera.position.y) * 0.1;
    camera.lookAt(scene.position);

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects([...floatingObjects, ...floatingSymbols, ...codeRings]);
    
    scene.traverse((object) => {
        if (object.isMesh || object.isSprite) {
            object.scale.lerp(object.userData.originalScale || new THREE.Vector3(1, 1, 1), 0.1);
        }
    });

    if (intersects.length > 0) {
        const object = intersects[0].object;
        if (object.isSprite) {
            object.scale.set(
                object.userData.originalScale.x * 1.5,
                object.userData.originalScale.y * 1.5,
                1
            );
        } else if (object.isMesh) {
            object.scale.set(1.2, 1.2, 1.2);
        }
    }
}

function onMouseClick(event) {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects([...floatingObjects, ...floatingSymbols]);
    
    if (intersects.length > 0) {
        const object = intersects[0].object;
        if (object.type === 'Mesh') {
            object.velocity.multiplyScalar(-2);
            object.targetColor = new THREE.Color(Math.random() * 0xffffff);
        } else if (object.type === 'Sprite') {
            object.velocity.multiplyScalar(-2);
            object.material.rotation += Math.PI;
        }
    }
}

function updateFloatingObjects() {
    // Update code rings
    codeRings.forEach(ring => {
        ring.rotation.x += ring.userData.rotationSpeed.x;
        ring.rotation.y += ring.userData.rotationSpeed.y;
        ring.rotation.z += ring.userData.rotationSpeed.z;
    });

    // Update floating symbols
    floatingSymbols.forEach(symbol => {
        symbol.position.add(symbol.velocity);
        symbol.material.rotation += symbol.userData.rotationSpeed;
        
        // Bounce off boundaries
        ['x', 'y', 'z'].forEach(axis => {
            if (Math.abs(symbol.position[axis]) > 30) {
                symbol.velocity[axis] *= -1;
            }
        });

        // Add slight random movement
        symbol.velocity.add(new THREE.Vector3(
            (Math.random() - 0.5) * 0.001,
            (Math.random() - 0.5) * 0.001,
            (Math.random() - 0.5) * 0.001
        ));
    });

    // Update floating objects
    floatingObjects.forEach(obj => {
        obj.rotation.x += obj.rotationVelocity.x;
        obj.rotation.y += obj.rotationVelocity.y;
        obj.rotation.z += obj.rotationVelocity.z;
        
        obj.position.add(obj.velocity);
        
        // Bounce off boundaries
        ['x', 'y', 'z'].forEach(axis => {
            if (Math.abs(obj.position[axis]) > 20) {
                obj.velocity[axis] *= -1;
            }
        });
    });
}

function animate() {
    requestAnimationFrame(animate);
    
    particles.rotation.x += 0.0001;
    particles.rotation.y += 0.0002;
    
    updateFloatingObjects();
    
    // Pulse effect for code rings
    codeRings.forEach((ring, i) => {
        ring.material.opacity = 0.3 + Math.sin(Date.now() * 0.001 + i) * 0.2;
    });
    
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Initialize everything
init(); 