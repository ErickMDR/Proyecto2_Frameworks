import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { TimeService } from '../../time/time.service';

@Component({
  selector: 'app-circular-clock',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="circular-clock">
      <div class="circles-container">
        <div class="circle-container">
          <svg class="circle" width="200" height="200">
            <circle cx="100" cy="100" r="80" stroke="#1F1F26" stroke-width="8" fill="none"></circle>
            <circle cx="100" cy="100" r="80" stroke="#60A679" stroke-width="8" fill="none"
                    [attr.stroke-dasharray]="circumference"
                    [attr.stroke-dashoffset]="getDashOffset(hoursProgress)"></circle>
          </svg>
        </div>
        
        <div class="circle-container">
          <svg class="circle" width="200" height="200">
            <circle cx="100" cy="100" r="80" stroke="#1F1F26" stroke-width="8" fill="none"></circle>
            <circle cx="100" cy="100" r="80" stroke="#60A679" stroke-width="8" fill="none"
                    [attr.stroke-dasharray]="circumference"
                    [attr.stroke-dashoffset]="getDashOffset(minutesProgress)"></circle>
          </svg>
        </div>
        
        <div class="circle-container">
          <svg class="circle" width="200" height="200">
            <circle cx="100" cy="100" r="80" stroke="#1F1F26" stroke-width="8" fill="none"></circle>
            <circle cx="100" cy="100" r="80" stroke="#60A679" stroke-width="8" fill="none"
                    [attr.stroke-dasharray]="circumference"
                    [attr.stroke-dashoffset]="getDashOffset(secondsProgress)"></circle>
          </svg>
        </div>
      </div>
    </div>
  `,
styles: [`
  .circular-clock {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 400px;
  }
  .circles-container {
    display: flex;
    gap: 40px;
  }
  .circle-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .circle {
    transform: rotate(-90deg);
  }
`]
})
export class CircularClockComponent implements OnInit, OnDestroy {
  currentTime = new Date();
  hoursProgress = 0;
  minutesProgress = 0;
  secondsProgress = 0;
  circumference = 2 * Math.PI * 80;
  private subscription?: Subscription;

  constructor(private timeService: TimeService) {}

  ngOnInit(): void {
    this.subscription = this.timeService.time$.subscribe(timeState => {
      this.currentTime = timeState.currentTime;
      this.updateProgress();
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private updateProgress(): void {
    this.hoursProgress = (this.currentTime.getHours() % 12) / 12;
    this.minutesProgress = this.currentTime.getMinutes() / 60;
    this.secondsProgress = this.currentTime.getSeconds() / 60;
  }

  getDashOffset(progress: number): number {
    return this.circumference * (1 - progress);
  }
}