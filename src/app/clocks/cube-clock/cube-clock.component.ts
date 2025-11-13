import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { TimeService } from '../../time/time.service';

@Component({
  selector: 'app-cube-clock',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="cube-clock">
      <div class="cubes-container">
        <!-- Cubo de Horas -->
        <div class="cube-wrapper">
          <div class="cube-scene">
            <div class="cube" [style.transform]="'rotateX(' + hoursRotation + 'deg)'">
              <div class="cube-face front"></div>
              <div class="cube-face back"></div>
              <div class="cube-face right"></div>
              <div class="cube-face left"></div>
              <div class="cube-face top"></div>
              <div class="cube-face bottom"></div>
            </div>
          </div>
        </div>

        <!-- Cubo de Minutos -->
        <div class="cube-wrapper">
          <div class="cube-scene">
            <div class="cube" [style.transform]="'rotateX(' + minutesRotation + 'deg)'">
              <div class="cube-face front"></div>
              <div class="cube-face back"></div>
              <div class="cube-face right"></div>
              <div class="cube-face left"></div>
              <div class="cube-face top"></div>
              <div class="cube-face bottom"></div>
            </div>
          </div>
        </div>

        <!-- Cubo de Segundos -->
        <div class="cube-wrapper">
          <div class="cube-scene">
            <div class="cube" [style.transform]="'rotateX(' + secondsRotation + 'deg)'">
              <div class="cube-face front"></div>
              <div class="cube-face back"></div>
              <div class="cube-face right"></div>
              <div class="cube-face left"></div>
              <div class="cube-face top"></div>
              <div class="cube-face bottom"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cube-clock {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 400px;
      background: #f5f5f5;
      border-radius: 10px;
      padding: 20px;
    }
    .cubes-container {
      display: flex;
      gap: 60px;
      align-items: center;
      margin-bottom: 30px;
    }
    .cube-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
    }
    .cube-scene {
      width: 100px;
      height: 100px;
      perspective: 600px;
    }
    .cube {
      width: 100%;
      height: 100%;
      position: relative;
      transform-style: preserve-3d;
      transform: translateZ(-50px);
      transition: transform 0.6s ease-in-out;
    }
    .cube-face {
      position: absolute;
      width: 100px;
      height: 100px;
      border: 2px solid rgba(0, 0, 0, 0.1);
      border-radius: 4px;
    }
    /* Horas - Color Azul */
    .cube-wrapper:nth-child(1) .cube-face {
      background: #60A679;
    }
    /* Minutos - Color Verde */
    .cube-wrapper:nth-child(2) .cube-face {
      background: #60A679;
    }
    /* Segundos - Color Rojo */
    .cube-wrapper:nth-child(3) .cube-face {
      background: #60A679;
    }
    .front  { 
      transform: rotateY(0deg) translateZ(50px);
    }
    .back   { 
      transform: rotateY(180deg) translateZ(50px);
    }
    .right  { 
      transform: rotateY(90deg) translateZ(50px);
    }
    .left   { 
      transform: rotateY(-90deg) translateZ(50px);
    }
    .top    { 
      transform: rotateX(90deg) translateZ(50px);
    }
    .bottom { 
      transform: rotateX(-90deg) translateZ(50px);
    }
    .label {
      color: #333;
      font-size: 1.2rem;
      font-family: 'Courier New', monospace;
      font-weight: bold;
      text-align: center;
    }
  `]
})
export class CubeClockComponent implements OnInit, OnDestroy {
  currentHours = 0;
  currentMinutes = 0;
  currentSeconds = 0;
  
  hoursRotation = 0;
  minutesRotation = 0;
  secondsRotation = 0;
  
  currentTimeString = '';
  private subscription?: Subscription;

  constructor(private timeService: TimeService) {}

  ngOnInit(): void {
    this.subscription = this.timeService.time$.subscribe(timeState => {
      this.updateCubes(timeState.currentTime);
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private updateCubes(date: Date): void {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    
    this.currentTimeString = date.toLocaleTimeString();

    // Horas
    if (hours !== this.currentHours) {
      this.currentHours = hours;
      this.hoursRotation -= 90; // Rotar 90 grados
    }

    // Minutos
    if (minutes !== this.currentMinutes) {
      this.currentMinutes = minutes;
      this.minutesRotation -= 90;
    }

    // Segundos
    if (seconds !== this.currentSeconds) {
      this.currentSeconds = seconds;
      this.secondsRotation -= 90;
    }
  }

  formatTime(value: number): string {
    return value.toString().padStart(2, '0');
  }
}