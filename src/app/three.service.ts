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
  // private cubes: THREE.Mesh[] = [];
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

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xcccccc);

    // Camera
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.z = 10;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    container.nativeElement.appendChild(this.renderer.domElement);

    // Orbit Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.rotateSpeed = 0.5;

    // Lighting
    // Brighter ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    this.scene.add(ambientLight);

    // Add hemisphere light for better overall illumination
    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x404040, 1);
    this.scene.add(hemisphereLight);

    // Directional lights for better shadows and highlights
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    this.scene.add(directionalLight);

    // Reduce number of point lights but increase their intensity
    const frontLight = new THREE.PointLight(0xffffff, 3, 50);
    frontLight.position.set(0, 0, 5);
    this.scene.add(frontLight);

    const backLight = new THREE.PointLight(0xffffff, 3, 50);
    backLight.position.set(0, 0, -5);
    this.scene.add(backLight);

    // Create Rubik's Cube
    this.createRubiksCube();

    // Event Listener for Clicks
    this.renderer.domElement.addEventListener('click', (event) => this.onCubeClick(event));

    // Render loop
    const animate = () => {
      requestAnimationFrame(animate);
      this.controls.update(); // Update OrbitControls
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

  }

  private isAnimating = false;

  private onCubeClick(event: MouseEvent): void {
    // this.rotateRight(90);
    // setTimeout(() => {
    //   this.rotateFront(90);
    // }, 3000);
  }
  private Cube = new CubeService();



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

    const duration = 100; // milliseconds
    const startTime = Date.now();

    const animateRotation = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Set the rotation property based on direction
      if (dir === 'x') {
        // console.log('x')
        pivot.rotation.x = startAngle + (targetAngle - startAngle) * progress;
      } else if (dir === 'y') {
        // console.log('y')
        pivot.rotation.y = startAngle + (targetAngle - startAngle) * progress;
      } else {
        // console.log('z',dir)
        pivot.rotation.z = startAngle + (targetAngle - startAngle) * progress;
      }

      if (progress < 1) {
        requestAnimationFrame(animateRotation);
      } else {
        this.isAnimating = false;
      }
    };

    animateRotation();
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
  public rotateFront(angle:number) {
    if(this.isAnimating) return;
    this.isAnimating = true;
    let times = 1;
    if(angle < 0) {
      times = 3;
    }
    this.Cube.rotateFront(times);
    console.log('front:',this.Cube.cubeState)
    this.bindToPivot(this.Cube.cubeState.front,this.pivots.front)
    this.animate(this.pivots.front,'front',angle);
  }
  public rotateBack(angle:number) {
    if(this.isAnimating) return;
    this.isAnimating = true;
    let times = 1;
    if(angle < 0){
      times = 3;
    }
    this.Cube.rotateBack(times);
    console.log('back:',this.Cube.cubeState)
    this.bindToPivot(this.Cube.cubeState.back,this.pivots.back)
    this.animate(this.pivots.back,'back',angle);
  }
  public rotateTop(angle:number) {
    if(this.isAnimating) return;
    this.isAnimating = true;
    let times = 3;
    if(angle < 0) {
      times = 1;
    }
    this.Cube.rotateTop(times);
    console.log('top:',this.Cube.cubeState)
    this.bindToPivot(this.Cube.cubeState.top,this.pivots.top)
    this.animate(this.pivots.top,'top',angle);
  }
  public rotateBottom(angle:number) {
    if(this.isAnimating) return;
    this.isAnimating = true;
    let times = 3;
    if(angle < 0) {
      times = 1;
    }
    this.Cube.rotateBottom(times);
    console.log('bottom:',this.Cube.cubeState)
    this.bindToPivot(this.Cube.cubeState.bottom,this.pivots.bottom)
    this.animate(this.pivots.bottom,'bottom',angle);
  }
  public rotateRight(angle:number) {
    if(this.isAnimating) return;
    this.isAnimating = true;
    let times = 1;
    if(angle < 0) {
      times = 3;
    }
    this.Cube.rotateRight(times);
    console.log('Right:',this.Cube.cubeState)
    this.bindToPivot(this.Cube.cubeState.right,this.pivots.right)
    this.animate(this.pivots.right,'right',angle);
  }
  public rotateLeft(angle:number) {
    if(this.isAnimating) return;
    this.isAnimating = true;
    let times = 1;
    if(angle < 0) {
      times = 3;
    }
    this.Cube.rotateLeft(times);
    console.log('Left:',this.Cube.cubeState)
    this.bindToPivot(this.Cube.cubeState.left,this.pivots.left)
    this.animate(this.pivots.left,'left',angle);
  }




}
