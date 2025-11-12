import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { TimeService } from '../../time/time.service';

@Component({
  selector: 'app-digital-clock',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="digital-clock">
      <div class="time-display">
        <span class="digit" *ngFor="let char of timeString.split('')">{{ char }}</span>
      </div>
    </div>
  `,
styles: [`
  .digital-clock {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 400px;
    font-family: 'Courier New', monospace;
  }
  .time-display {
    display: flex;
    gap: 8px;
    margin-bottom: 20px;
  }
  .digit {
    background: #f8fff0;
    color: #60A679;
    padding: 20px 15px;
    font-size: 3rem;
    font-weight: bold;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(96, 166, 121, 0.3);
    min-width: 60px;
    text-align: center;
    border: 2px solid #60A679;
  }
`]
})
export class DigitalClockComponent implements OnInit, OnDestroy {
  timeString = '';
  private subscription?: Subscription;

  constructor(private timeService: TimeService) {}

  ngOnInit(): void {
    this.subscription = this.timeService.time$.subscribe(timeState => {
      this.updateDisplay(timeState.currentTime);
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private updateDisplay(date: Date): void {
    this.timeString = date.toLocaleTimeString();
  }
}