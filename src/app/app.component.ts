import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { TimeService } from './time/time.service';
import { ClockType } from './shared/models';

import { AnalogClockComponent } from './clocks/analog-clock/analog-clock.component';
import { DigitalClockComponent } from './clocks/digital-clock/digital-clock.component';
import { BinaryClockComponent } from './clocks/binary-clock/binary-clock.component';
import { CircularClockComponent } from './clocks/circular-clock/circular-clock.component';
import { QamClockComponent } from './clocks/qam-clock/qam-clock.component';
import { WaveClockComponent } from './clocks/wave-clock/wave-clock.component';
import { FrequencyClockComponent } from './clocks/frequency-clock/frequency-clock.component';
import { SonarClockComponent } from './clocks/sonar-clock/sonar-clock.component';
import { CubeClockComponent } from './clocks/cube-clock/cube-clock.component';
import { AmplitudeClockComponent } from './clocks/amplitude-clock/amplitude-clock.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    AnalogClockComponent,
    DigitalClockComponent,
    BinaryClockComponent,
    CircularClockComponent,
    QamClockComponent,
    WaveClockComponent,
    FrequencyClockComponent,
    SonarClockComponent,
    CubeClockComponent,
    AmplitudeClockComponent
  ],
  template: `
    <div class="app-container" *ngIf="authService.isAuthenticated(); else authTemplate">
      <div class="header">
        <h1 class="title">Visualizadores de Tiempo</h1>
        <div class="controls">
          <select [(ngModel)]="selectedClock" class="clock-selector">
            <option *ngFor="let clock of clockTypes" [value]="clock.value">
              {{ clock.label }}
            </option>
          </select>
          <button class="logout-btn" (click)="logout()">Cerrar Sesión</button>
        </div>
      </div>

      <div class="time-controls">
        <label class="time-label">Slider de Tiempo:</label>
        <input type="range" 
               min="0" 
               max="86400" 
               [(ngModel)]="customSeconds" 
               (input)="onTimeChange()"
               class="time-slider">
        <span class="time-display">{{ formatTime(customSeconds) }}</span>
        <button class="reset-btn" (click)="resetTime()">Tiempo Real</button>
      </div>

      <div class="clock-container">
        <app-analog-clock *ngIf="selectedClock === 'analog'"></app-analog-clock>
        <app-digital-clock *ngIf="selectedClock === 'digital'"></app-digital-clock>
        <app-binary-clock *ngIf="selectedClock === 'binary'"></app-binary-clock>
        <app-circular-clock *ngIf="selectedClock === 'circular'"></app-circular-clock>
        <app-cube-clock *ngIf="selectedClock === 'cube'"></app-cube-clock>
        <app-wave-clock *ngIf="selectedClock === 'wave'"></app-wave-clock>
        <app-amplitude-clock *ngIf="selectedClock === 'amplitude'"></app-amplitude-clock>
        <app-frequency-clock *ngIf="selectedClock === 'frequency'"></app-frequency-clock>
        <app-sonar-clock *ngIf="selectedClock === 'sonar'"></app-sonar-clock>
        <app-qam-clock *ngIf="selectedClock === 'qam'"></app-qam-clock>
      </div>
    </div>

    <ng-template #authTemplate>
      <router-outlet></router-outlet>
    </ng-template>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  selectedClock: ClockType = 'analog';
  customSeconds = 0;
  currentTime = new Date();
  private subscription?: Subscription;

  clockTypes = [
    { value: 'analog', label: 'Reloj Analógico' },
    { value: 'digital', label: 'Reloj Digital' },
    { value: 'binary', label: 'Reloj Binario' },
    { value: 'circular', label: 'Reloj Circular' },
    { value: 'cube', label: 'Reloj de Cubo' },
    { value: 'wave', label: 'Reloj de Ondas' },
    { value: 'amplitude', label: 'Reloj de Amplitud' },
    { value: 'frequency', label: 'Reloj de Frecuencia' },
    { value: 'qam', label: 'Reloj QAM' },
    { value: 'sonar', label: 'Reloj de Sonar' } 
  ];

  constructor(
    public authService: AuthService,
    private timeService: TimeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscription = this.timeService.time$.subscribe(timeState => {
      this.currentTime = timeState.currentTime;
      if (!timeState.isUsingCustomTime) {
        this.customSeconds = this.getSecondsFromDate(this.currentTime);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  onTimeChange(): void {
    const customDate = new Date();
    customDate.setHours(0, 0, 0, 0);
    customDate.setSeconds(this.customSeconds);
    this.timeService.setCustomTime(customDate);
  }

  resetTime(): void {
    this.timeService.useRealTime();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private getSecondsFromDate(date: Date): number {
    return date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
  }

  formatTime(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
}