import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { TimeService } from '../../time/time.service';

@Component({
  selector: 'app-wave-clock',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="wave-clock">
      <div class="wave-waves">
        <div class="wave-container" *ngFor="let wave of waves; let i = index">
          <svg class="wave" width="500" height="130">
            <path [attr.d]="wave.path" [attr.stroke]="wave.color" stroke-width="3" fill="none" />
          </svg>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .wave-clock {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 400px;
    }
    .wave-waves {
      display: flex;
      flex-direction: column;
      gap: 30px;
      margin-top: 30px;
      margin-bottom: 30px;
    }
    .wave-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }
    .wave-label {
      color: #1a1a1a;
      font-size: 0.9rem;
      font-family: 'Courier New', monospace;
      font-weight: bold;
    }
  `]
})
export class WaveClockComponent implements OnInit, OnDestroy {
  waves: any[] = [];
  private subscription?: Subscription;

  constructor(private timeService: TimeService) {}

  ngOnInit(): void {
    this.subscription = this.timeService.time$.subscribe(timeState => {
      this.updateWaves(timeState.currentTime);
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private updateWaves(date: Date): void {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    
    this.waves = [
      {
        path: this.generateWave(hours / 24, 65, '#60A679'),
        color: '#60A679',
        label: `Horas: ${hours}`
      },
      {
        path: this.generateWave(minutes / 60, 65, '#60A679'),
        color: '#60A679',
        label: `Minutos: ${minutes}`
      },
      {
        path: this.generateWave(seconds / 60, 65, '#60A679'),
        color: '#60A679',
        label: `Segundos: ${seconds}`
      }
    ];
  }

  private generateWave(phase: number, yOffset: number, color: string): string {
    const amplitude = 30;
    const frequency = 0.05;
    
    let path = `M 0 ${yOffset}`;
    
    for (let x = -5; x <= 500; x += 5) {
      const y = yOffset + Math.sin(x * frequency + phase * Math.PI * 25) * amplitude;
      path += ` L ${x} ${y}`;
    }
    
    return path;
  }
}