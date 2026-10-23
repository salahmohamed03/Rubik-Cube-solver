import { Component, OnInit, OnDestroy, ElementRef, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThreeService } from '../three.service';
import { SoundService } from '../sound.service';

export interface SolutionStep {
  id: number;
  char: string;
  label: string;
  phase: string;
  desc: string;
}

export interface PresetPattern {
  name: string;
  desc: string;
  moves: string;
  icon: string;
}

@Component({
  selector: 'app-rubiks-cube-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rubiks-cube-view.component.html',
  styleUrl: './rubiks-cube-view.component.css'
})
export class RubiksCubeViewComponent implements OnInit, OnDestroy {
  @ViewChild('container', { static: true }) container!: ElementRef;
  @ViewChild('stepScroller') stepScroller?: ElementRef;

  // Active Control Panel Tab
  activeTab: 'controls' | 'solver' | 'patterns' | 'algorithms' = 'controls';

  // Cube status & stats
  cubeState: 'Solved' | 'Scrambled' | 'Solving...' = 'Solved';
  moveHistory: string[] = [];
  moveCount: number = 0;
  hoveredFace: string = '';
  hintHidden: boolean = false;
  panelCollapsed: boolean = false;

  // Manual move input
  manualMoveInput: string = '';

  // Interactive Face Definition
  faceControls = [
    { face: 'front', key: 'F', color: '#10b981', name: 'Front', bg: 'rgba(16, 185, 129, 0.15)', border: '#10b981' },
    { face: 'right', key: 'R', color: '#f97316', name: 'Right', bg: 'rgba(249, 115, 22, 0.15)', border: '#f97316' },
    { face: 'top', key: 'U', color: '#eab308', name: 'Up', bg: 'rgba(234, 179, 8, 0.15)', border: '#eab308' },
    { face: 'left', key: 'L', color: '#ef4444', name: 'Left', bg: 'rgba(239, 68, 68, 0.15)', border: '#ef4444' },
    { face: 'back', key: 'B', color: '#3b82f6', name: 'Back', bg: 'rgba(59, 130, 246, 0.15)', border: '#3b82f6' },
    { face: 'bottom', key: 'D', color: '#f8fafc', name: 'Down', bg: 'rgba(248, 250, 252, 0.15)', border: '#cbd5e1' }
  ];

  // Step-by-Step Solver State
  solutionSteps: SolutionStep[] = [];
  solutionPhases: { phase: string; count: number; startIdx: number }[] = [];
  currentStepIndex: number = 0;
  isPlaying: boolean = false;
  playbackSpeed: number = 1; // 0.5, 1, 2, 4
  private playTimer: any = null;

  // Preset Patterns with Font Awesome icon classes
  presetPatterns: PresetPattern[] = [
    { name: 'Checkerboard', desc: 'Alternating colors on every face', moves: "R2 L2 U2 D2 F2 B2", icon: 'fa-solid fa-border-all' },
    { name: 'Cube in a Cube', desc: 'Mini-cube nestled in corner', moves: "F L F U' R U F2 L2 U' L' B D' B' L2 U", icon: 'fa-solid fa-cubes' },
    { name: 'Six Spots', desc: 'Swap all 6 center dots', moves: "U D' R L' F B' U D'", icon: 'fa-solid fa-circle-dot' },
    { name: 'Crosses', desc: 'Crosses on each side', moves: "R2 L' D F2 R' D' R' L U' D R D B2 R' U D2", icon: 'fa-solid fa-plus' },
    { name: 'Wire Pattern', desc: 'Wire lines wrapping around', moves: "R L U D' F B' R L", icon: 'fa-solid fa-bolt' },
    { name: 'Anaconda', desc: 'Snake pattern winding faces', moves: "L U B' U' R L' B R' F B' D R D' F'", icon: 'fa-solid fa-code-branch' }
  ];

  // Famous Algorithms
  quickAlgos = [
    { name: 'Sexy Move', formula: "R U R' U'", desc: 'Fundamental trigger' },
    { name: 'Inverse Sexy', formula: "U R U' R'", desc: 'Reverse trigger' },
    { name: 'Sune (OLL)', formula: "R U R' U R U2 R'", desc: 'Orient yellow corners' },
    { name: 'Anti-Sune', formula: "R U2 R' U' R U' R'", desc: 'Inverse sune' },
    { name: 'T-Perm (PLL)', formula: "R U R' U' R' F R2 U' R' U' R U R' F'", desc: 'Swap adjacent corners & edges' },
    { name: 'Y-Perm (PLL)', formula: "F R U' R' U' R U R' F' R U R' U' R' F R F'", desc: 'Swap diagonal corners' }
  ];

  // Camera Presets
  activeCameraPreset: string = 'iso';
  autoRotateActive: boolean = false;
  isFullscreen: boolean = false;

  // Speedcubing Timer
  timerRunning: boolean = false;
  timerMs: number = 0;
  timerDisplay: string = '00:00.00';
  private timerInterval: any = null;
  private timerStartTime: number = 0;

  private hintTimeout: any;

  constructor(
    public threeService: ThreeService,
    public soundService: SoundService
  ) {}

  ngOnInit(): void {
    this.threeService.initializeScene(this.container);

    this.threeService.onFaceClick = (face: string, inverse: boolean) => {
      this.doFaceMove(face, inverse);
      this.hintHidden = true;
    };

    this.threeService.onFaceHover = (face: string) => {
      this.hoveredFace = face;
    };

    // Auto-hide interaction hint after 5 seconds
    this.hintTimeout = setTimeout(() => {
      this.hintHidden = true;
    }, 5000);

    // Track fullscreen change
    document.addEventListener('fullscreenchange', () => {
      this.isFullscreen = !!document.fullscreenElement;
    });
  }

  ngOnDestroy(): void {
    if (this.hintTimeout) clearTimeout(this.hintTimeout);
    if (this.playTimer) clearTimeout(this.playTimer);
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.threeService.onFaceClick = null;
    this.threeService.onFaceHover = null;
  }

  /** Global Keyboard Shortcuts */
  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    // Avoid triggering when user is typing in text inputs
    if ((event.target as HTMLElement).tagName === 'INPUT') return;

    // Spacebar starts/stops timer
    if (event.code === 'Space') {
      event.preventDefault();
      this.toggleTimer();
      return;
    }

    const inverse = event.shiftKey;
    switch (event.key.toLowerCase()) {
      case 'f': this.doFaceMove('front', inverse); break;
      case 'b': this.doFaceMove('back', inverse); break;
      case 'r': this.doFaceMove('right', inverse); break;
      case 'l': this.doFaceMove('left', inverse); break;
      case 'u': this.doFaceMove('top', inverse); break;
      case 'd': this.doFaceMove('bottom', inverse); break;
      case 'arrowright':
        if (this.solutionSteps.length > 0) this.stepForward();
        break;
      case 'arrowleft':
        if (this.solutionSteps.length > 0) this.stepBackward();
        break;
    }
  }

  // ==========================================
  // FACE ROTATIONS & CONTROLS
  // ==========================================

  /** Rotate a face directly */
  rotateFace(face: string, inverse: boolean): void {
    this.doFaceMove(face, inverse);
    this.soundService.playTurnSound();
  }

  /** Rotate a face twice (180 deg) */
  rotateFaceDouble(face: string): void {
    this.doFaceMove(face, false);
    setTimeout(() => {
      this.doFaceMove(face, false);
    }, this.threeService.animationDuration + 30);
    this.soundService.playTurnSound();
  }

  /** Core rotation method */
  private doFaceMove(face: string, inverse: boolean): void {
    const notationMap: { [key: string]: string } = {
      'front': 'F',
      'back': 'B',
      'right': 'R',
      'left': 'L',
      'top': 'U',
      'bottom': 'D'
    };

    const notation = notationMap[face];
    if (!notation) return;

    const moveLabel = inverse ? notation + "'" : notation;

    switch (face) {
      case 'front':
        inverse ? this.threeService.rotateFront(90) : this.threeService.rotateFront(-90);
        break;
      case 'back':
        inverse ? this.threeService.rotateBack(-90) : this.threeService.rotateBack(90);
        break;
      case 'left':
        inverse ? this.threeService.rotateLeft(-90) : this.threeService.rotateLeft(90);
        break;
      case 'right':
        inverse ? this.threeService.rotateRight(90) : this.threeService.rotateRight(-90);
        break;
      case 'top':
        inverse ? this.threeService.rotateTop(90) : this.threeService.rotateTop(-90);
        break;
      case 'bottom':
        inverse ? this.threeService.rotateBottom(-90) : this.threeService.rotateBottom(90);
        break;
    }

    this.soundService.playTurnSound();
    this.addToHistory(moveLabel);

    // If user made a manual move while solution was loaded, invalidate existing solution
    if (this.solutionSteps.length > 0) {
      this.solutionSteps = [];
      this.solutionPhases = [];
      this.currentStepIndex = 0;
      this.isPlaying = false;
    }
  }

  private addToHistory(moveLabel: string): void {
    this.moveHistory.push(moveLabel);
    this.moveCount = this.moveHistory.length;
    this.cubeState = 'Scrambled';
  }

  // ==========================================
  // STEP-BY-STEP SOLVER & PLAYER
  // ==========================================

  /** Generate solution with phased breakdown */
  generateSolution(): void {
    this.cubeState = 'Solving...';
    const phased = this.threeService.solveWithPhases();

    this.solutionSteps = [];
    this.solutionPhases = [];
    this.currentStepIndex = 0;
    this.isPlaying = false;

    let stepCounter = 1;

    for (const phaseItem of phased) {
      const startIdx = this.solutionSteps.length;
      let count = 0;

      for (const ch of phaseItem.moves) {
        const step = this.formatMoveStep(stepCounter++, ch, phaseItem.phase);
        if (step) {
          this.solutionSteps.push(step);
          count++;
        }
      }

      if (count > 0) {
        this.solutionPhases.push({
          phase: phaseItem.phase,
          count,
          startIdx
        });
      }
    }

    if (this.solutionSteps.length === 0) {
      this.cubeState = 'Solved';
      this.soundService.playVictorySound();
    } else {
      this.activeTab = 'solver';
    }
  }

  /** Step Forward one move */
  async stepForward(): Promise<void> {
    if (this.currentStepIndex >= this.solutionSteps.length) return;
    if (this.threeService.isAnimating) return;

    const step = this.solutionSteps[this.currentStepIndex];
    await this.threeService.executeSingleMove(step.char, true);
    this.soundService.playTurnSound();

    this.currentStepIndex++;
    this.addToHistory(step.label);
    this.scrollStepIntoView();

    if (this.currentStepIndex >= this.solutionSteps.length) {
      this.isPlaying = false;
      this.cubeState = 'Solved';
      this.soundService.playVictorySound();
    }
  }

  /** Step Backward one move (undo previous step) */
  async stepBackward(): Promise<void> {
    if (this.currentStepIndex <= 0) return;
    if (this.threeService.isAnimating) return;

    const prevStep = this.solutionSteps[this.currentStepIndex - 1];
    // Invert move: lowercase -> uppercase, uppercase -> lowercase
    const invertedChar = prevStep.char === prevStep.char.toUpperCase()
      ? prevStep.char.toLowerCase()
      : prevStep.char.toUpperCase();

    await this.threeService.executeSingleMove(invertedChar, true);
    this.soundService.playTurnSound();

    this.currentStepIndex--;
    if (this.moveHistory.length > 0) {
      this.moveHistory.pop();
      this.moveCount = this.moveHistory.length;
    }
    this.scrollStepIntoView();
  }

  /** Toggle Play / Pause auto playback */
  togglePlay(): void {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  play(): void {
    if (this.currentStepIndex >= this.solutionSteps.length) {
      this.currentStepIndex = 0;
    }
    this.isPlaying = true;
    this.runPlaybackLoop();
  }

  pause(): void {
    this.isPlaying = false;
    if (this.playTimer) {
      clearTimeout(this.playTimer);
      this.playTimer = null;
    }
  }

  private runPlaybackLoop(): void {
    if (!this.isPlaying) return;

    if (this.currentStepIndex >= this.solutionSteps.length) {
      this.isPlaying = false;
      this.cubeState = 'Solved';
      this.soundService.playVictorySound();
      return;
    }

    this.stepForward().then(() => {
      const delay = Math.max(20, Math.floor(300 / this.playbackSpeed));
      this.playTimer = setTimeout(() => {
        this.runPlaybackLoop();
      }, delay);
    });
  }

  /** Set playback speed multiplier */
  setSpeed(speed: number): void {
    this.playbackSpeed = speed;
    if (speed === 0.5) this.threeService.animationDuration = 220;
    else if (speed === 1) this.threeService.animationDuration = 120;
    else if (speed === 2) this.threeService.animationDuration = 60;
    else if (speed === 4) this.threeService.animationDuration = 20;
  }

  /** Jump directly to a step */
  async jumpToStep(targetIndex: number): Promise<void> {
    if (this.isPlaying) this.pause();
    if (targetIndex < 0 || targetIndex > this.solutionSteps.length) return;

    const diff = targetIndex - this.currentStepIndex;
    if (diff === 0) return;

    // Fast-forward or rewind
    const origDuration = this.threeService.animationDuration;
    this.threeService.animationDuration = Math.min(30, origDuration);

    if (diff > 0) {
      for (let i = 0; i < diff; i++) {
        await this.stepForward();
      }
    } else {
      for (let i = 0; i < Math.abs(diff); i++) {
        await this.stepBackward();
      }
    }

    this.threeService.animationDuration = origDuration;
  }

  /** Jump to phase start */
  jumpToPhase(phase: { startIdx: number }): void {
    this.jumpToStep(phase.startIdx);
  }

  private scrollStepIntoView(): void {
    if (!this.stepScroller) return;
    const el = this.stepScroller.nativeElement as HTMLElement;
    const activeChip = el.querySelector(`.step-chip.active`) as HTMLElement;
    if (activeChip) {
      activeChip.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }

  private formatMoveStep(id: number, ch: string, phase: string): SolutionStep | null {
    const map: { [key: string]: { label: string; desc: string } } = {
      'F': { label: 'F', desc: 'Front face clockwise 90°' },
      'f': { label: "F'", desc: 'Front face counter-clockwise 90°' },
      'R': { label: 'R', desc: 'Right face clockwise 90°' },
      'r': { label: "R'", desc: 'Right face counter-clockwise 90°' },
      'U': { label: 'U', desc: 'Up face clockwise 90°' },
      'u': { label: "U'", desc: 'Up face counter-clockwise 90°' },
      'B': { label: 'B', desc: 'Back face clockwise 90°' },
      'b': { label: "B'", desc: 'Back face counter-clockwise 90°' },
      'L': { label: 'L', desc: 'Left face clockwise 90°' },
      'l': { label: "L'", desc: 'Left face counter-clockwise 90°' },
      'D': { label: 'D', desc: 'Down face clockwise 90°' },
      'd': { label: "D'", desc: 'Down face counter-clockwise 90°' }
    };

    const info = map[ch];
    if (!info) return null;

    return {
      id,
      char: ch,
      label: info.label,
      desc: info.desc,
      phase
    };
  }

  // ==========================================
  // SCRAMBLE, RESET & PATTERNS
  // ==========================================

  /** Scramble the cube */
  async scramble(movesCount: number = 20): Promise<void> {
    this.pause();
    this.threeService.abortCurrentOperations();

    this.soundService.playScrambleSound();
    this.cubeState = 'Scrambled';
    this.solutionSteps = [];
    this.solutionPhases = [];
    this.currentStepIndex = 0;
    this.moveHistory = [];
    this.moveCount = 0;

    const scramble = this.threeService.Cube.scramble();
    const completed = await this.threeService.performMove(scramble);

    // Only populate history if the scramble completed without being aborted (e.g. by reset)
    if (completed) {
      for (const ch of scramble) {
        const labels: { [key: string]: string } = {
          'F': 'F', 'f': "F'",
          'R': 'R', 'r': "R'",
          'U': 'U', 'u': "U'",
          'B': 'B', 'b': "B'",
          'L': 'L', 'l': "L'",
          'D': 'D', 'd': "D'"
        };
        if (labels[ch]) this.addToHistory(labels[ch]);
      }
    }
  }

  /** Apply a preset pattern */
  applyPattern(pattern: PresetPattern): void {
    this.pause();
    this.threeService.abortCurrentOperations();
    this.executeMovesNotation(pattern.moves);
  }

  /** Apply an algorithm formula */
  applyAlgorithm(algo: { formula: string }): void {
    this.pause();
    this.threeService.abortCurrentOperations();
    this.executeMovesNotation(algo.formula);
  }

  /** Clean In-Memory Reset */
  resetCube(): void {
    this.pause();
    this.threeService.abortCurrentOperations();
    this.threeService.resetCubeState();
    this.moveHistory = [];
    this.moveCount = 0;
    this.cubeState = 'Solved';
    this.solutionSteps = [];
    this.solutionPhases = [];
    this.currentStepIndex = 0;
    this.stopTimer();
    this.timerMs = 0;
    this.timerDisplay = '00:00.00';
    this.soundService.playTurnSound();
  }

  // ==========================================
  // MANUAL MOVES NOTATION EXECUTION
  // ==========================================

  executeManualInput(): void {
    if (!this.manualMoveInput.trim()) return;
    this.executeMovesNotation(this.manualMoveInput);
    this.manualMoveInput = '';
  }

  /** Execute arbitrary Rubik's notation string (e.g. "R U R' U'") */
  executeMovesNotation(input: string): void {
    const compactMoves = this.parseNotation(input.trim());
    this.threeService.performMove(compactMoves);

    for (const ch of compactMoves) {
      const labels: { [key: string]: string } = {
        'F': 'F', 'f': "F'",
        'R': 'R', 'r': "R'",
        'U': 'U', 'u': "U'",
        'B': 'B', 'b': "B'",
        'L': 'L', 'l': "L'",
        'D': 'D', 'd': "D'"
      };
      if (labels[ch]) this.addToHistory(labels[ch]);
    }
  }

  private parseNotation(input: string): string {
    let result = '';
    const tokens = input.replace(/'/g, "'").split(/\s+/).filter(t => t.length > 0);

    for (const token of tokens) {
      const face = token[0].toUpperCase();
      const isInverse = token.includes("'");
      const validFaces = ['F', 'R', 'U', 'B', 'L', 'D'];

      if (validFaces.includes(face)) {
        const countMatch = token.match(/(\d)/);
        const count = countMatch ? parseInt(countMatch[1]) : 1;

        for (let i = 0; i < count; i++) {
          result += isInverse ? face.toLowerCase() : face;
        }
      }
    }

    if (tokens.length === 1 && tokens[0].length > 1 && !tokens[0].includes("'")) {
      return input;
    }

    return result || input;
  }

  // ==========================================
  // CAMERA & DISPLAY CONTROLS
  // ==========================================

  setCameraView(preset: 'iso' | 'front' | 'back' | 'right' | 'left' | 'top' | 'bottom'): void {
    this.activeCameraPreset = preset;
    this.threeService.setCameraPreset(preset);
  }

  toggleAutoRotate(): void {
    this.autoRotateActive = this.threeService.toggleAutoRotate();
  }

  toggleFullscreen(): void {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }

  toggleSound(): void {
    this.soundService.toggleSound();
  }

  togglePanel(): void {
    this.panelCollapsed = !this.panelCollapsed;
  }

  clearHistory(): void {
    this.moveHistory = [];
    this.moveCount = 0;
  }

  // ==========================================
  // SPEEDCUBING TIMER
  // ==========================================

  toggleTimer(): void {
    if (this.timerRunning) {
      this.stopTimer();
    } else {
      this.startTimer();
    }
  }

  startTimer(): void {
    this.timerRunning = true;
    this.timerStartTime = performance.now() - this.timerMs;
    this.timerInterval = setInterval(() => {
      this.timerMs = performance.now() - this.timerStartTime;
      this.timerDisplay = this.formatTime(this.timerMs);
    }, 16);
  }

  stopTimer(): void {
    this.timerRunning = false;
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  resetTimer(): void {
    this.stopTimer();
    this.timerMs = 0;
    this.timerDisplay = '00:00.00';
  }

  private formatTime(ms: number): string {
    const totalSecs = Math.floor(ms / 1000);
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    const hundredths = Math.floor((ms % 1000) / 10);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${hundredths.toString().padStart(2, '0')}`;
  }
}
