import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { TimeService } from '../../time/time.service';

@Component({
  selector: 'app-analog-clock',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="analog-clock">
      <div class="clock-face">
        <div class="marker" *ngFor="let marker of markers" 
             [style.transform]="'rotate(' + marker + 'deg)'"></div>
        <div class="hand hour-hand" [style.transform]="'rotate(' + hourAngle + 'deg)'"></div>
        <div class="hand minute-hand" [style.transform]="'rotate(' + minuteAngle + 'deg)'"></div>
        <div class="hand second-hand" [style.transform]="'rotate(' + secondAngle + 'deg)'"></div>
        <div class="center-circle"></div>
      </div>
    </div>
  `,
  styles: [`
  .analog-clock {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 400px;
  }
  .clock-face {
    width: 300px;
    height: 300px;
    border: 8px solid #60A679;
    border-radius: 50%;
    position: relative;
    background: #ffffff;
    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  }
  .marker {
    position: absolute;
    width: 3px;
    height: 12px;
    background: #1a1a1a;
    left: 50%;
    top: 10px;
    transform-origin: bottom center;
  }
  .hand {
    position: absolute;
    background: #1a1a1a;
    transform-origin: bottom center;
    border-radius: 4px;
  }
  .hour-hand {
    width: 6px;
    height: 80px;
    top: 70px;
    left: 50%;
    margin-left: -3px;
    background: #60A679;
  }
  .minute-hand {
    width: 4px;
    height: 110px;
    top: 40px;
    left: 50%;
    margin-left: -2px;
    background: #1a1a1a;
  }
  .second-hand {
    width: 2px;
    height: 130px;
    top: 20px;
    left: 50%;
    margin-left: -1px;
    background: #60A679;
  }
  .center-circle {
    position: absolute;
    width: 16px;
    height: 16px;
    background: #60A679;
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
  }
`]
})
export class AnalogClockComponent implements OnInit, OnDestroy {
  hourAngle = 0;
  minuteAngle = 0;
  secondAngle = 0;
  markers = Array.from({length: 12}, (_, i) => i * 30);
  private subscription?: Subscription;

  constructor(private timeService: TimeService) {}

  ngOnInit(): void {
    this.subscription = this.timeService.time$.subscribe(timeState => {
      this.updateClock(timeState.currentTime);
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private updateClock(date: Date): void {
    const hours = date.getHours() % 12;
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    this.hourAngle = (hours * 30) + (minutes * 0.5);
    this.minuteAngle = (minutes * 6) + (seconds * 0.1);
    this.secondAngle = seconds * 6;
  }
}