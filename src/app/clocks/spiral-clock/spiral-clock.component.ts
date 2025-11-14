import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { TimeService } from '../../time/time.service';

@Component({
  selector: 'app-spiral-clock',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="spiral-clock">
      <div class="spirals-container">
        <div class="spiral-wrapper">
          <svg class="spiral" width="200" height="180">
            <path [attr.d]="hoursSpiral" stroke="#60A679" stroke-width="3" fill="none"/>
            <circle cx="90" cy="90" r="2" fill="#60A679"/>
          </svg>
        </div>

        <div class="spiral-wrapper">
          <svg class="spiral" width="200" height="180">
            <path [attr.d]="minutesSpiral" stroke="#60A679" stroke-width="3" fill="none"/>
            <circle cx="90" cy="90" r="2" fill="#60A679"/>
          </svg>
        </div>

        <div class="spiral-wrapper">
          <svg class="spiral" width="200" height="180">
            <path [attr.d]="secondsSpiral" stroke="#60A679" stroke-width="3" fill="none"/>
            <circle cx="90" cy="90" r="2" fill="#60A679"/>
          </svg>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .spiral-clock {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 300px;
      background: #f8f9fa;
      border-radius: 10px;
      padding: 20px;
    }
    .spirals-container {
      display: flex;
      gap: 30px;
      align-items: center;
      margin-bottom: 30px;
    }
    .spiral-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }
    .spiral {
      background: white;
      border-radius: 50%;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }
  `]
})
export class SpiralClockComponent implements OnInit, OnDestroy {
  hoursSpiral = '';
  minutesSpiral = '';
  secondsSpiral = '';
  
  currentHours = 0;
  currentMinutes = 0;
  currentSeconds = 0;
  currentTimeString = '';
  
  private subscription?: Subscription;

  constructor(private timeService: TimeService) {}

  ngOnInit(): void {
    this.subscription = this.timeService.time$.subscribe(timeState => {
      this.updateSpirals(timeState.currentTime);
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private updateSpirals(date: Date): void {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const milliseconds = date.getMilliseconds();
  
  this.currentHours = hours;
  this.currentMinutes = minutes;
  this.currentSeconds = seconds;
  this.currentTimeString = date.toLocaleTimeString();

  const baseRadius = 80;
  const baseRevolutions = 3;
  
  const hoursProgress = (hours + minutes / 60 + seconds / 3600) / 24;
  const minutesProgress = (minutes + seconds / 60) / 60;
  const secondsProgress = (seconds + milliseconds / 1000) / 60;
  
  this.hoursSpiral = this.generateSpiralProgress(hoursProgress, baseRadius, baseRevolutions);
  this.minutesSpiral = this.generateSpiralProgress(minutesProgress, baseRadius, baseRevolutions);
  this.secondsSpiral = this.generateSpiralProgress(secondsProgress, baseRadius, baseRevolutions);
}

private generateSpiralProgress(progress: number, maxRadius: number, revolutions: number): string {
  const centerX = 90;
  const centerY = 90;
  
  let path = `M ${centerX} ${centerY}`;
  const points = 100;
  
  for (let i = 0; i <= points; i++) {
    const t = (i / points) * progress;
    const angle = t * 2 * Math.PI * revolutions;
    const radius = t * maxRadius;
    
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    
    path += ` L ${x} ${y}`;
  }
  
  return path;
}

  formatTime(value: number): string {
    return value.toString().padStart(2, '0');
  }
}