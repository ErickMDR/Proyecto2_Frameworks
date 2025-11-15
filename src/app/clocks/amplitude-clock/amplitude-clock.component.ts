import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { TimeService } from '../../time/time.service';

@Component({
  selector: 'app-amplitude-clock',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="amplitude-clock">
      <div class="amplitude-waves">
        <div class="wave-container" *ngFor="let wave of amplitudeWaves; let i = index">
          <svg class="wave" width="500" height="130">
            <path [attr.d]="wave.path" [attr.stroke]="wave.color" stroke-width="3" fill="none" />
          </svg>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .amplitude-clock {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 400px;
    }
    .amplitude-waves {
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
export class AmplitudeClockComponent implements OnInit, OnDestroy {
  amplitudeWaves: any[] = [];
  private subscription?: Subscription;

  constructor(private timeService: TimeService) {}

  ngOnInit(): void {
    this.subscription = this.timeService.time$.subscribe(timeState => {
      this.updateAmplitudeWaves(timeState.currentTime);
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private updateAmplitudeWaves(date: Date): void {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    
    // Solo amplitud varía
    const hourAmplitude = 1 + (hours * 2);
    const minuteAmplitude = 1 + (minutes * 1.1);
    const secondAmplitude = 1 + (seconds * 1);
    
    this.amplitudeWaves = [
      {
        path: this.generateAmplitudeWave(hourAmplitude, 65, '#60A679'),
        color: '#60A679',
        label: `Horas: ${hours} (Amp: ${hourAmplitude.toFixed(1)})`
      },
      {
        path: this.generateAmplitudeWave(minuteAmplitude, 65, '#60A679'),
        color: '#60A679',
        label: `Minutos: ${minutes} (Amp: ${minuteAmplitude.toFixed(1)})`
      },
      {
        path: this.generateAmplitudeWave(secondAmplitude, 65, '#60A679'),
        color: '#60A679',
        label: `Segundos: ${seconds} (Amp: ${secondAmplitude.toFixed(1)})`
      }
    ];
  }

  private generateAmplitudeWave(amplitude: number, yOffset: number, color: string): string {
    const frequency = 0.05; // Frecuencia fija
    const phase = 0; // Fase fija
    
    let path = `M 0 ${yOffset}`;
    
    for (let x = 0; x <= 500; x += 5) {
      const y = yOffset + Math.sin(x * frequency + phase) * amplitude;
      path += ` L ${x} ${y}`;
    }
    
    return path;
  }
}