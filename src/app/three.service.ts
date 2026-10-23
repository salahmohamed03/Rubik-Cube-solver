import { Injectable, ElementRef } from '@angular/core';
import * as THREE from  'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CubeService } from './cube';
@Injectable({
  providedIn: 'root'
})
export class ThreeService {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private lookupDir: { [key: string]: string } = {
    'front':'z',
    'back':'z',
    'right':'x',
    'left':'x',
    'top':'y',
    'bottom':'y'
  }
  private pivots = {
    front: new THREE.Object3D(),
    back: new THREE.Object3D(),
    right: new THREE.Object3D(),
    left: new THREE.Object3D(),
    top: new THREE.Object3D(),
    bottom: new THREE.Object3D()
  }
  private controls!: OrbitControls;
  private pointLights: THREE.PointLight[] = [];
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  private bindCubes!:{[key:string]:THREE.Mesh}

  // Public callbacks for face interaction
  public onFaceClick: ((face: string, inverse: boolean) => void) | null = null;
  public onFaceHover: ((face: string) => void) | null = null;

  // All cubies for raycasting
  private allCubies: THREE.Mesh[] = [];

  constructor() {}

  initializeScene(container: ElementRef): void {
    const width = container.nativeElement.clientWidth;
    // Add resize event listener to make the scene responsive
    window.addEventListener('resize', () => {
      const newWidth = container.nativeElement.clientWidth;
      const newHeight = container.nativeElement.clientHeight;

      this.camera.aspect = newWidth / newHeight;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(newWidth, newHeight);
    });
    const height = container.nativeElement.clientHeight;

    // Scene — dark background to match glassmorphism theme
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0e1a);

    // Camera — positioned in 3D isometric perspective
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.set(5.5, 4.5, 6.5);
    this.camera.lookAt(0, 0, 0);

    // Renderer with enhanced settings for dark theme
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    container.nativeElement.appendChild(this.renderer.domElement);

    // Orbit Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.rotateSpeed = 0.5;
    this.controls.enableZoom = true;
    this.controls.minDistance = 5;
    this.controls.maxDistance = 20;

    // Lighting — enhanced for dark theme with vivid cube colors
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    this.scene.add(ambientLight);

    const hemisphereLight = new THREE.HemisphereLight(0xeeeeff, 0x222244, 0.8);
    this.scene.add(hemisphereLight);

    // Key light (main directional)
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    keyLight.position.set(5, 8, 5);
    this.scene.add(keyLight);

    // Fill light
    const fillLight = new THREE.DirectionalLight(0x8888ff, 0.4);
    fillLight.position.set(-5, 2, -5);
    this.scene.add(fillLight);

    // Rim lights for edge glow
    const frontLight = new THREE.PointLight(0xffffff, 3, 50);
    frontLight.position.set(0, 0, 6);
    this.scene.add(frontLight);

    const backLight = new THREE.PointLight(0xffffff, 2, 50);
    backLight.position.set(0, 0, -6);
    this.scene.add(backLight);

    const topLight = new THREE.PointLight(0xffffff, 2, 50);
    topLight.position.set(0, 6, 0);
    this.scene.add(topLight);

    // Create Rubik's Cube
    this.createRubiksCube();

    // Event Listener for face clicks (raycaster-based)
    this.renderer.domElement.addEventListener('click', (event) => this.onCubeClick(event));

    // Event Listener for face hover
    this.renderer.domElement.addEventListener('mousemove', (event) => this.onCubeHover(event));

    // Render loop
    const animate = () => {
      requestAnimationFrame(animate);
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    };
    animate();
  }

  private createRubiksCube(): void {
    const cubeSize = 1;
    const gap = 0.1;
    const colors = {
      front: 0x00ff00,  //green
      back: 0x0000ff,   //blue
      right: 0xffa500,   //orange
      left: 0xff0000,  //red
      top: 0xffff00,    //yellow
      bottom: 0xffffff  //white
    }

    const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    const blackMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });

    // Create a function to generate materials for each position
    const getMaterials = (position: THREE.Vector3) => {
      // Default all sides to black
      const mats = Array(6).fill(blackMaterial);

      // Set appropriate colors based on position
      // Order: [right, left, top, bottom, front, back]

      if (position.x > 0) mats[0] = new THREE.MeshPhongMaterial({ color: colors.right });
      if (position.x < 0) mats[1] = new THREE.MeshPhongMaterial({ color: colors.left });
      if (position.y > 0) mats[2] = new THREE.MeshPhongMaterial({ color: colors.top });
      if (position.y < 0) mats[3] = new THREE.MeshPhongMaterial({ color: colors.bottom });
      if (position.z > 0) mats[4] = new THREE.MeshPhongMaterial({ color: colors.front });
      if (position.z < 0) mats[5] = new THREE.MeshPhongMaterial({ color: colors.back });

      return mats;
    };

    // Create center materials separately
    const centerMaterials = {
      front: getMaterials(new THREE.Vector3(0, 0, cubeSize + gap)),
      back: getMaterials(new THREE.Vector3(0, 0, -cubeSize - gap)),
      right: getMaterials(new THREE.Vector3(cubeSize + gap, 0, 0)),
      left: getMaterials(new THREE.Vector3(-cubeSize - gap, 0, 0)),
      top: getMaterials(new THREE.Vector3(0, cubeSize + gap, 0)),
      bottom: getMaterials(new THREE.Vector3(0, -cubeSize - gap, 0))
    };
    // centers
    const frontC = new THREE.Mesh(geometry, centerMaterials.front);
    const backC = new THREE.Mesh(geometry, centerMaterials.back);
    const rightC = new THREE.Mesh(geometry, centerMaterials.right);
    const leftC = new THREE.Mesh(geometry, centerMaterials.left);
    const topC = new THREE.Mesh(geometry, centerMaterials.top);
    const bottomC = new THREE.Mesh(geometry, centerMaterials.bottom);
    // positions
    frontC.position.set(0, 0, cubeSize  + gap);
    backC.position.set(0, 0, -cubeSize  - gap);
    rightC.position.set(cubeSize  + gap, 0, 0);
    leftC.position.set(-cubeSize  - gap, 0, 0);
    topC.position.set(0, cubeSize  + gap, 0);
    bottomC.position.set(0, -cubeSize  - gap, 0);

    this.pivots.front.add(frontC);
    this.pivots.back.add(backC);
    this.pivots.right.add(rightC);
    this.pivots.left.add(leftC);
    this.pivots.top.add(topC);
    this.pivots.bottom.add(bottomC);

    //edges
    const topNearE = new THREE.Mesh(geometry, getMaterials(new THREE.Vector3(0, cubeSize + gap, cubeSize + gap)));
    const topFarE = new THREE.Mesh(geometry, getMaterials(new THREE.Vector3(0, cubeSize + gap, -cubeSize - gap)));
    const topRightE = new THREE.Mesh(geometry, getMaterials(new THREE.Vector3(cubeSize + gap, cubeSize + gap, 0)));
    const topLeftE = new THREE.Mesh(geometry, getMaterials(new THREE.Vector3(-cubeSize - gap, cubeSize + gap, 0)));
    const bottomNearE = new THREE.Mesh(geometry, getMaterials(new THREE.Vector3(0, -cubeSize - gap, cubeSize + gap)));
    const bottomFarE = new THREE.Mesh(geometry, getMaterials(new THREE.Vector3(0, -cubeSize - gap, -cubeSize - gap)));
    const bottomRightE = new THREE.Mesh(geometry, getMaterials(new THREE.Vector3(cubeSize + gap, -cubeSize - gap, 0)));
    const bottomLeftE = new THREE.Mesh(geometry, getMaterials(new THREE.Vector3(-cubeSize - gap, -cubeSize - gap, 0)));
    const frontRightE = new THREE.Mesh(geometry, getMaterials(new THREE.Vector3(cubeSize + gap, 0, cubeSize + gap)));
    const frontLeftE = new THREE.Mesh(geometry, getMaterials(new THREE.Vector3(-cubeSize - gap, 0, cubeSize + gap)));
    const backLeftE = new THREE.Mesh(geometry, getMaterials(new THREE.Vector3(-cubeSize - gap, 0, -cubeSize - gap)));
    const backRightE = new THREE.Mesh(geometry, getMaterials(new THREE.Vector3(cubeSize + gap, 0, -cubeSize - gap)));


    //positions
    topNearE.position.set(0, cubeSize  + gap, cubeSize  + gap);
    topFarE.position.set(0, cubeSize  + gap, -cubeSize  - gap);
    topRightE.position.set(cubeSize  + gap, cubeSize  + gap, 0);
    topLeftE.position.set(-cubeSize  - gap, cubeSize  + gap, 0);
    bottomNearE.position.set(0, -cubeSize  - gap, cubeSize  + gap);
    bottomFarE.position.set(0, -cubeSize  - gap, -cubeSize  - gap);
    bottomRightE.position.set(cubeSize  + gap, -cubeSize  - gap, 0);
    bottomLeftE.position.set(-cubeSize  - gap, -cubeSize  - gap, 0);
    frontRightE.position.set(cubeSize  + gap, 0, cubeSize  + gap);
    frontLeftE.position.set(-cubeSize  - gap, 0, cubeSize  + gap);
    backRightE.position.set(cubeSize  + gap, 0, -cubeSize  - gap);
    backLeftE.position.set(-cubeSize  - gap, 0, -cubeSize  - gap);


    this.pivots.top.add(topNearE);
    this.pivots.top.add(topFarE);
    this.pivots.top.add(topRightE);
    this.pivots.top.add(topLeftE);
    this.pivots.bottom.add(bottomNearE);
    this.pivots.bottom.add(bottomFarE);
    this.pivots.bottom.add(bottomRightE);
    this.pivots.bottom.add(bottomLeftE);
    this.pivots.front.add(frontRightE);
    this.pivots.front.add(frontLeftE);
    this.pivots.back.add(backRightE);
    this.pivots.back.add(backLeftE);


    //corners
    const frontTopRightC = new THREE.Mesh(geometry, getMaterials(new THREE.Vector3(cubeSize + gap, cubeSize + gap, cubeSize + gap)));
    const frontTopLeftC = new THREE.Mesh(geometry, getMaterials(new THREE.Vector3(-cubeSize - gap, cubeSize + gap, cubeSize + gap)));
    const frontBottomRightC = new THREE.Mesh(geometry, getMaterials(new THREE.Vector3(cubeSize + gap, -cubeSize - gap, cubeSize + gap)));
    const frontBottomLeftC = new THREE.Mesh(geometry, getMaterials(new THREE.Vector3(-cubeSize - gap, -cubeSize - gap, cubeSize + gap)));
    const backTopRightC = new THREE.Mesh(geometry, getMaterials(new THREE.Vector3(cubeSize + gap, cubeSize + gap, -cubeSize - gap)));
    const backTopLeftC = new THREE.Mesh(geometry, getMaterials(new THREE.Vector3(-cubeSize - gap, cubeSize + gap, -cubeSize - gap)));
    const backBottomRightC = new THREE.Mesh(geometry, getMaterials(new THREE.Vector3(cubeSize + gap, -cubeSize - gap, -cubeSize - gap)));
    const backBottomLeftC = new THREE.Mesh(geometry, getMaterials(new THREE.Vector3(-cubeSize - gap, -cubeSize - gap, -cubeSize - gap)));

    //positions
    frontTopRightC.position.set(cubeSize  + gap, cubeSize  + gap, cubeSize  + gap);
    frontTopLeftC.position.set(-cubeSize  - gap, cubeSize  + gap, cubeSize  + gap);
    frontBottomRightC.position.set(cubeSize  + gap, -cubeSize  - gap, cubeSize  + gap);
    frontBottomLeftC.position.set(-cubeSize  - gap, -cubeSize  - gap, cubeSize  + gap);
    backTopRightC.position.set(cubeSize  + gap, cubeSize  + gap, -cubeSize  - gap);
    backTopLeftC.position.set(-cubeSize  - gap, cubeSize  + gap, -cubeSize  - gap);
    backBottomRightC.position.set(cubeSize  + gap, -cubeSize  - gap, -cubeSize  - gap);
    backBottomLeftC.position.set(-cubeSize  - gap, -cubeSize  - gap, -cubeSize  - gap);

    this.pivots.front.add(frontTopRightC);
    this.pivots.front.add(frontTopLeftC);
    this.pivots.front.add(frontBottomRightC);
    this.pivots.front.add(frontBottomLeftC);
    this.pivots.back.add(backTopRightC);
    this.pivots.back.add(backTopLeftC);
    this.pivots.back.add(backBottomRightC);
    this.pivots.back.add(backBottomLeftC);


    this.scene.add(this.pivots.front);
    this.scene.add(this.pivots.back);
    this.scene.add(this.pivots.right);
    this.scene.add(this.pivots.left);
    this.scene.add(this.pivots.top);
    this.scene.add(this.pivots.bottom);

    this.bindCubes = {
      'Gry':frontTopLeftC,
      'Gyo':frontTopRightC,
      'Gwr':frontBottomLeftC,
      'Gow':frontBottomRightC,
      'Gy':topNearE,
      'Go':frontRightE,
      'Gr':frontLeftE,
      'Gw':bottomNearE,
      'G':frontC,

      // Back face
      'Boy':backTopRightC,
      'Byr':backTopLeftC,
      'Bwo':backBottomRightC,
      'Brw':backBottomLeftC,
      'By':topFarE,
      'Br':backLeftE,
      'Bw':bottomFarE,
      'Bo':backRightE,
      'B':backC,

      // Top face
      'Yrb':backTopLeftC,
      'Ybo':backTopRightC,
      'Yog':frontTopRightC,
      'Ygr':frontTopLeftC,
      'Yb':topFarE,
      'Yo':topRightE,
      'Yg':topNearE,
      'Yr':topLeftE,
      'Y':topC,

      // Bottom face
      'Wrg':frontBottomLeftC,
      'Wgo':frontBottomRightC,
      'Wob':backBottomRightC,
      'Wbr':backBottomLeftC,
      'Wg':bottomNearE,
      'Wo':bottomRightE,
      'Wb':bottomFarE,
      'Wr':bottomLeftE,
      'W':bottomC,

      // Left face
      'Rby':backTopLeftC,
      'Ryg':frontTopLeftC,
      'Rgw':frontBottomLeftC,
      'Rwb':backBottomLeftC,
      'Ry':topLeftE,
      'Rg':frontLeftE,
      'Rw':bottomLeftE,
      'Rb':backLeftE,
      'R':leftC,

      // Right face
      'Ogy':frontTopRightC,
      'Oyb':backTopRightC,
      'Obw':backBottomRightC,
      'Owg':frontBottomRightC,
      'Oy':topRightE,
      'Ob':backRightE,
      'Ow':bottomRightE,
      'Og':frontRightE,
      'O':rightC
    }

    // Populate allCubies for raycasting (use Set to avoid duplicates)
    const uniqueCubies = new Set<THREE.Mesh>(Object.values(this.bindCubes));
    this.allCubies = Array.from(uniqueCubies);

  }

  public isAnimating = false;
  public animationDuration = 120;
  public Cube = new CubeService();
  public isOperating = false;
  private currentSequenceId = 0;
  private animFrameId: number | null = null;

  /** Detect which face of the cube was clicked and trigger rotation */
  private onCubeClick(event: MouseEvent): void {
    if (this.isAnimating) return;

    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.allCubies, false);

    if (intersects.length > 0) {
      const hit = intersects[0];
      const face = this.determineFace(hit);
      if (face && this.onFaceClick) {
        const inverse = event.shiftKey;
        this.onFaceClick(face, inverse);
      }
    }
  }

  /** Detect which face the mouse is hovering over */
  private onCubeHover(event: MouseEvent): void {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.allCubies, false);

    if (intersects.length > 0) {
      const face = this.determineFace(intersects[0]);
      if (this.onFaceHover) {
        this.onFaceHover(face || '');
      }
      this.renderer.domElement.style.cursor = face ? 'pointer' : 'grab';
    } else {
      if (this.onFaceHover) {
        this.onFaceHover('');
      }
      this.renderer.domElement.style.cursor = 'grab';
    }
  }

  /** Determine which face (front/back/left/right/top/bottom) a raycast hit belongs to */
  private determineFace(hit: THREE.Intersection): string | null {
    const normal = hit.face?.normal;
    if (!normal) return null;

    // Transform the face normal to world space
    const worldNormal = normal.clone();
    const obj = hit.object as THREE.Mesh;
    worldNormal.transformDirection(obj.matrixWorld);

    // Determine which axis-aligned direction is dominant
    const absX = Math.abs(worldNormal.x);
    const absY = Math.abs(worldNormal.y);
    const absZ = Math.abs(worldNormal.z);

    if (absX > absY && absX > absZ) {
      return worldNormal.x > 0 ? 'right' : 'left';
    } else if (absY > absX && absY > absZ) {
      return worldNormal.y > 0 ? 'top' : 'bottom';
    } else {
      return worldNormal.z > 0 ? 'front' : 'back';
    }
  }



  private animate(pivot: THREE.Object3D, face: keyof typeof this.lookupDir = 'front', angle: number = 90): void {
    // console.log('face is ',face)
    const dir = this.lookupDir[face];
    // if (['back', 'left', 'bottom'].includes(face)) {
    //   angle *= -1;
    // }
    const angleRad = THREE.MathUtils.degToRad(angle);
    let targetAngle;
    let startAngle;

    // Set the appropriate rotation axis based on direction
    if (dir === 'x') {
      startAngle = pivot.rotation.x;
      targetAngle = startAngle + angleRad;
    } else if (dir === 'y') {
      startAngle = pivot.rotation.y;
      targetAngle = startAngle + angleRad;
    } else { // z axis is default
      startAngle = pivot.rotation.z;
      targetAngle = startAngle + angleRad;
    }

    const duration = this.animationDuration; // milliseconds
    const startTime = Date.now();
    const currentSeq = this.currentSequenceId;

    const animateRotation = () => {
      if (currentSeq !== this.currentSequenceId) {
        this.isAnimating = false;
        this.animFrameId = null;
        return;
      }

      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Set the rotation property based on direction
      if (dir === 'x') {
        pivot.rotation.x = startAngle + (targetAngle - startAngle) * progress;
      } else if (dir === 'y') {
        pivot.rotation.y = startAngle + (targetAngle - startAngle) * progress;
      } else {
        pivot.rotation.z = startAngle + (targetAngle - startAngle) * progress;
      }

      if (progress < 1) {
        this.animFrameId = requestAnimationFrame(animateRotation);
      } else {
        this.isAnimating = false;
        this.animFrameId = null;
      }
    };

    this.animFrameId = requestAnimationFrame(animateRotation);
  }
  moveWithoutAnimation(pivot: THREE.Object3D, face: keyof typeof this.lookupDir = 'front', angle: number = 90): void {
    this.isAnimating = false;
    const dir = this.lookupDir[face];
    const angleRad = THREE.MathUtils.degToRad(angle);
    // Set the appropriate rotation axis based on direction
    if (dir === 'x') {
      pivot.rotation.x += angleRad;
    } else if (dir === 'y') {
      pivot.rotation.y += angleRad;
    } else { // z axis is default
      pivot.rotation.z += angleRad;
    }
  }

  private bindToPivot(face: string[][], pivot: THREE.Object3D) {
    // Clear the pivot first - remove all existing children
    while (pivot.children.length > 0) {
      const child = pivot.children[0];
      if (child instanceof THREE.Mesh) {
        // Store world position and quaternion before removal
        const worldPos = new THREE.Vector3();
        child.getWorldPosition(worldPos);

        const worldQuat = new THREE.Quaternion();
        child.getWorldQuaternion(worldQuat);

        // Add to scene temporarily to preserve position
        pivot.remove(child);
        this.scene.add(child);

        // Restore world position and rotation
        child.position.copy(worldPos);
        child.quaternion.copy(worldQuat);
      } else {
        pivot.remove(child);
      }
    }

    // Get all meshes that should be in this pivot according to the face data
    const meshesToMove = new Set<THREE.Mesh>();
    face.forEach(row => row.forEach(cubeId => {
      if (this.bindCubes[cubeId]) {
        meshesToMove.add(this.bindCubes[cubeId]);
      }
    }));

    // Store original world positions and quaternions
    const worldPositions = new Map<THREE.Mesh, THREE.Vector3>();
    const worldQuaternions = new Map<THREE.Mesh, THREE.Quaternion>();

    meshesToMove.forEach(mesh => {
      if (mesh.parent) {
        // Store world position
        const worldPos = new THREE.Vector3();
        mesh.getWorldPosition(worldPos);
        worldPositions.set(mesh, worldPos);

        // Store world rotation
        const worldQuat = new THREE.Quaternion();
        mesh.getWorldQuaternion(worldQuat);
        worldQuaternions.set(mesh, worldQuat);

        mesh.parent.remove(mesh);
      }
    });

    // Add meshes to the pivot
    meshesToMove.forEach(mesh => {
      // Add to the target pivot
      pivot.add(mesh);

      // Position correctly in local space
      const worldPos = worldPositions.get(mesh);
      if (worldPos) {
        const localPos = worldPos.clone();
        pivot.worldToLocal(localPos);
        mesh.position.copy(localPos);
      }

      // Apply correct rotation
      const worldQuat = worldQuaternions.get(mesh);
      if (worldQuat) {
        // Convert world quaternion to local quaternion in pivot space
        const pivotWorldQuat = new THREE.Quaternion();
        pivot.getWorldQuaternion(pivotWorldQuat);
        const localQuat = worldQuat.clone();
        pivotWorldQuat.invert();
        localQuat.premultiply(pivotWorldQuat);

        mesh.quaternion.copy(localQuat);
      }
    });
  }
  public rotateFront(angle:number,animate:boolean = true) {
    if(this.isAnimating) return;
    this.isAnimating = true;
    let times = 1;
    if(angle < 0) {
      times = 3;
    }
    this.Cube.rotateFront(times);
    // console.log('front:',this.Cube.cubeState)
    this.bindToPivot(this.Cube.cubeState.front,this.pivots.front)
    if(!animate){
      this.moveWithoutAnimation(this.pivots.front,'front',angle);
      return;
    }
    this.animate(this.pivots.front,'front',angle);
  }
  public rotateBack(angle:number,animate:boolean = true) {
    if(this.isAnimating) return;
    this.isAnimating = true;
    let times = 1;
    if(angle < 0){
      times = 3;
    }
    this.Cube.rotateBack(times);
    // console.log('back:',this.Cube.cubeState)
    this.bindToPivot(this.Cube.cubeState.back,this.pivots.back)
    if(!animate){
      this.moveWithoutAnimation(this.pivots.back,'back',angle);
      return;
    }
    this.animate(this.pivots.back,'back',angle);
  }
  public rotateTop(angle:number,animate:boolean = true) {
    if(this.isAnimating) return;
    this.isAnimating = true;
    let times = 3;
    if(angle < 0) {
      times = 1;
    }
    this.Cube.rotateTop(times);
    // console.log('top:',this.Cube.cubeState)
    this.bindToPivot(this.Cube.cubeState.top,this.pivots.top)
    if(!animate){
      this.moveWithoutAnimation(this.pivots.top,'top',angle);
      return;
    }
    this.animate(this.pivots.top,'top',angle);
  }
  public rotateBottom(angle:number,animate:boolean = true) {
    if(this.isAnimating) return;
    this.isAnimating = true;
    let times = 3;
    if(angle < 0) {
      times = 1;
    }
    this.Cube.rotateBottom(times);
    // console.log('bottom:',this.Cube.cubeState)
    this.bindToPivot(this.Cube.cubeState.bottom,this.pivots.bottom)
    if(!animate){
      this.moveWithoutAnimation(this.pivots.bottom,'bottom',angle);
      return;
    }
    this.animate(this.pivots.bottom,'bottom',angle);
  }
  public rotateRight(angle:number,animate:boolean = true) {
    if(this.isAnimating) return;
    this.isAnimating = true;
    let times = 1;
    if(angle < 0) {
      times = 3;
    }
    this.Cube.rotateRight(times);
    // console.log('Right:',this.Cube.cubeState)
    this.bindToPivot(this.Cube.cubeState.right,this.pivots.right)
    if(!animate){
      this.moveWithoutAnimation(this.pivots.right,'right',angle);
      return
    }
    this.animate(this.pivots.right,'right',angle);
  }
  public rotateLeft(angle:number,animate:boolean = true) {
    if(this.isAnimating) return;
    this.isAnimating = true;
    let times = 1;
    if(angle < 0) {
      times = 3;
    }
    this.Cube.rotateLeft(times);
    // console.log('Left:',this.Cube.cubeState)
    this.bindToPivot(this.Cube.cubeState.left,this.pivots.left)
    if(!animate){
      this.moveWithoutAnimation(this.pivots.left,'left',angle);
      return;
    }
    this.animate(this.pivots.left,'left',angle);
  }
  /** Immediately abort any running moves, sequences, or animations */
  abortCurrentOperations(): void {
    this.currentSequenceId++;
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    this.isAnimating = false;
    this.isOperating = false;
  }

  async performMove(move: string, animate: boolean = true): Promise<boolean> {
    const seqId = ++this.currentSequenceId;
    this.isOperating = true;

    for (let i = 0; i < move.length; i++) {
      if (seqId !== this.currentSequenceId) {
        this.isOperating = false;
        return false;
      }

      await this.executeSingleMove(move[i], animate);

      if (seqId !== this.currentSequenceId) {
        this.isOperating = false;
        return false;
      }

      if (i < move.length - 1 && animate) {
        const delay = Math.max(10, Math.floor(this.animationDuration * 0.3));
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    if (seqId === this.currentSequenceId) {
      this.isOperating = false;
    }
    return true;
  }

  solveCube(){
   return this.Cube.solve();
  }

  solveWithPhases(){
    return this.Cube.solveWithPhases();
  }

  async scrumbleCube(): Promise<string> {
    const scrumble = this.Cube.scramble();
    await this.performMove(scrumble);
    return scrumble;
  }

  /** Execute a single move (e.g. 'F', 'f', 'R', 'r') and return Promise when done */
  executeSingleMove(moveChar: string, animate: boolean = true): Promise<void> {
    const seqId = this.currentSequenceId;
    return new Promise((resolve) => {
      if (seqId !== this.currentSequenceId) {
        resolve();
        return;
      }

      switch (moveChar) {
        case 'U': this.rotateTop(-90, animate); break;
        case 'u': this.rotateTop(90, animate); break;
        case 'F': this.rotateFront(-90, animate); break;
        case 'f': this.rotateFront(90, animate); break;
        case 'R': this.rotateRight(-90, animate); break;
        case 'r': this.rotateRight(90, animate); break;
        case 'B': this.rotateBack(90, animate); break;
        case 'b': this.rotateBack(-90, animate); break;
        case 'L': this.rotateLeft(90, animate); break;
        case 'l': this.rotateLeft(-90, animate); break;
        case 'D': this.rotateBottom(90, animate); break;
        case 'd': this.rotateBottom(-90, animate); break;
      }

      if (animate && this.animationDuration > 0) {
        const check = () => {
          if (seqId !== this.currentSequenceId || !this.isAnimating) {
            resolve();
          } else {
            setTimeout(check, 16);
          }
        };
        setTimeout(check, 20);
      } else {
        resolve();
      }
    });
  }

  /** Set camera to preset angle smoothly */
  setCameraPreset(preset: 'iso' | 'front' | 'back' | 'right' | 'left' | 'top' | 'bottom'): void {
    const targets: { [key: string]: THREE.Vector3 } = {
      iso: new THREE.Vector3(5.5, 4.5, 6.5),
      front: new THREE.Vector3(0, 0, 9),
      back: new THREE.Vector3(0, 0, -9),
      right: new THREE.Vector3(9, 0, 0),
      left: new THREE.Vector3(-9, 0, 0),
      top: new THREE.Vector3(0, 9, 0),
      bottom: new THREE.Vector3(0, -9, 0)
    };
    const targetPos = targets[preset] || targets['iso'];
    const startPos = this.camera.position.clone();
    const duration = 350;
    const startTime = performance.now();

    const animateCam = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const ease = 0.5 - Math.cos(progress * Math.PI) / 2;
      this.camera.position.lerpVectors(startPos, targetPos, ease);
      this.camera.lookAt(0, 0, 0);
      this.controls.target.set(0, 0, 0);
      this.controls.update();
      if (progress < 1) {
        requestAnimationFrame(animateCam);
      }
    };
    requestAnimationFrame(animateCam);
  }

  /** Toggle continuous auto-rotation */
  toggleAutoRotate(): boolean {
    this.controls.autoRotate = !this.controls.autoRotate;
    this.controls.autoRotateSpeed = 1.2;
    return this.controls.autoRotate;
  }

  /** Clean in-memory reset of the 3D cube */
  resetCubeState(): void {
    // 1. Immediately abort all ongoing operations and cancel any running animation frame
    this.abortCurrentOperations();

    // 2. Detach and clean up all cubie meshes from all pivots and scene
    const pivotKeys = ['front', 'back', 'right', 'left', 'top', 'bottom'] as const;
    for (const key of pivotKeys) {
      const pivot = this.pivots[key];
      while (pivot.children.length > 0) {
        pivot.remove(pivot.children[0]);
      }
      pivot.rotation.set(0, 0, 0);
      pivot.quaternion.identity();
    }

    for (const mesh of this.allCubies) {
      if (mesh.parent) {
        mesh.parent.remove(mesh);
      }
    }
    this.allCubies = [];
    this.Cube = new CubeService();
    this.isAnimating = false;
    this.isOperating = false;
    this.createRubiksCube();
    this.setCameraPreset('iso');
  }
}
