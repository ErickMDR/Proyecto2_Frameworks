import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { TimeService } from '../../time/time.service';

@Component({
  selector: 'app-frequency-clock',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="frequency-clock">
      <div class="frequency-waves">
        <div class="wave-container" *ngFor="let wave of waves; let i = index">
          <svg class="wave" width="500" height="130">
            <path [attr.d]="wave.path" [attr.stroke]="wave.color" stroke-width="3" fill="none" />
          </svg>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .frequency-clock {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 500px;
    }
    .frequency-waves {
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
  `]
})
export class FrequencyClockComponent implements OnInit, OnDestroy {
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
    
    // Solo frecuencia varía (usando logaritmo para crecimiento más suave)
    const baseFrequency = 0.01;
    const hourFrequency = baseFrequency * Math.log2(hours + 1);
    const minuteFrequency = baseFrequency * Math.log2(minutes + 1);
    const secondFrequency = baseFrequency * Math.log2(seconds + 1);
    
    this.waves = [
      {
        path: this.generateWave(hourFrequency, 65, '#60A679'),
        color: '#60A679',
        label: `Horas: ${hours} (Freq: ${hourFrequency.toFixed(4)})`
      },
      {
        path: this.generateWave(minuteFrequency, 65, '#60A679'),
        color: '#60A679',
        label: `Minutos: ${minutes} (Freq: ${minuteFrequency.toFixed(4)})`
      },
      {
        path: this.generateWave(secondFrequency, 65, '#60A679'),
        color: '#60A679',
        label: `Segundos: ${seconds} (Freq: ${secondFrequency.toFixed(4)})`
      }
    ];
  }

  private generateWave(frequency: number, yOffset: number, color: string): string {
    const amplitude = 30; // Amplitud fija
    const phase = 0; // Fase fija (sin variación temporal)
    
    let path = `M 0 ${yOffset}`;
    
    for (let x = 0; x <= 500; x += 5) {
      const y = yOffset + Math.sin(x * frequency + phase) * amplitude;
      path += ` L ${x} ${y}`;
    }
    
    return path;
  }
}