
// Big thanks to takashi for great snow particles!
// His codepen -> https://codepen.io/tksiiii/pen/MRjWzv?editors=1010

export default class Particles {
 
    /**
     * 
     * @param {number} [particleNum]
     * @param {number} [maxRange] 
     * @param {number} [minRange] 
     * @param {number} [textureSize] 
     */
    constructor(particleNum, maxRange, minRange, textureSize) {

        this.particleNum = particleNum || 10000;
        this.maxRange = maxRange || 80;
        this.minRange = minRange || this.maxRange / 2;
        this.textureSize = textureSize || 64.0;
        /**@type {THREE.Points} */
        this.particles = undefined;
    }

    createParticles() {
        const pointGeometry = new THREE.Geometry();
        for (let i = 0; i < this.particleNum; i++) {
            const x = Math.floor(Math.random() * this.maxRange - this.minRange);
            const y = Math.floor(Math.random() * this.maxRange - this.minRange);
            const z = Math.floor(Math.random() * this.maxRange - this.minRange);
            const particle = new THREE.Vector3(x, y, z);
            pointGeometry.vertices.push(particle);
        }

        const pointMaterial = new THREE.PointsMaterial({
            size: 1,
            color: 0xffffff,
            vertexColors: false,
            map: this.getTexture(),
            transparent: true,
            fog: true,
            depthWrite: false
        });

        const velocities = [];
        for (let i = 0; i < this.particleNum; i++) {
            const x = Math.floor(Math.random() * 6 - 3) * 0.1;
            const y = Math.floor(Math.random() * 10 + 3) * - 0.05;
            const z = Math.floor(Math.random() * 6 - 3) * 0.1;
            const particle = new THREE.Vector3(x, y, z);
            velocities.push(particle);
        }

        this.particles = new THREE.Points(pointGeometry, pointMaterial);
        this.particles.geometry.velocities = velocities;
    }


    getTexture() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const diameter = this.textureSize;
        canvas.width = diameter;
        canvas.height = diameter;
        const canvasRadius = diameter / 2;

        /* gradation circle
        ------------------------ */
        this.drawRadialGradation(ctx, canvasRadius, canvas.width, canvas.height);

        const texture = new THREE.Texture(canvas);
        texture.type = THREE.FloatType;
        texture.needsUpdate = true;
        return texture;
    }


    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} canvasRadius 
     * @param {number} canvasWidth 
     * @param {number} canvasHeight 
     */
    drawRadialGradation(ctx, canvasRadius, canvasWidth, canvasHeight) {
        ctx.save();
        const gradient = ctx.createRadialGradient(canvasRadius, canvasRadius, 0, canvasRadius, canvasRadius, canvasRadius);
        gradient.addColorStop(0, 'rgba(255,255,255,1.0)');
        gradient.addColorStop(0.5, 'rgba(255,255,255,0.5)');
        gradient.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.restore();
    }

    /**
     * 
     * @param {number} time 
     */
    animate(time) {
        const posArr = this.particles.geometry.vertices;
        const velArr = this.particles.geometry.velocities;

        posArr.forEach((vertex, i) => {
            const velocity = velArr[i];

            const velX = Math.sin(time * 0.001 * velocity.x) * 0.1;
            const velZ = Math.cos(time * 0.0015 * velocity.z) * 0.1;

            vertex.x += velX;
            vertex.y += velocity.y;
            vertex.z += velZ;

            if (vertex.y < -this.minRange) {
                vertex.y = this.minRange;
            }

        })

        this.particles.geometry.verticesNeedUpdate = true;

    }

}