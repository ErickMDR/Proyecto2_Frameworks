import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { TimeService } from '../../time/time.service';

@Component({
  selector: 'app-triangle-clock',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="triangle-clock">
      <div class="triangles-container">
        <div class="triangle-wrapper" *ngFor="let triangle of triangles">
          <div class="triangle-container">
            <div class="triangle-background"></div>
            <div class="triangle-fill" 
                 [style.height]="triangle.height + '%'"
                 [class]="triangle.fillClass"></div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .triangle-clock {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 200px;
      background: #f8f9fa;
      border-radius: 10px;
      padding: 20px;
    }
    .triangles-container {
      display: flex;
      gap: 40px;
      align-items: flex-end;
      margin-bottom: 30px;
    }
    .triangle-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 15px;
    }
    .triangle-container {
      position: relative;
      width: 150px;
      height: 200px;
      display: flex;
      align-items: flex-end;
      justify-content: center;
    }
    .triangle-background {
      position: absolute;
      width: 100%;
      height: 100%;
      background: #e0e0e0;
      clip-path: polygon(50% 25%, 0% 100%, 100% 100%);
      z-index: 1;
    }
    .triangle-fill {
      position: absolute;
      width: 100%;
      bottom: 0;
      left: 0;
      transition: height 0.3s ease;
      z-index: 2;
      clip-path: polygon(50% 25%, 0% 100%, 100% 100%);
      transform-origin: bottom;
    }
    .hours-fill {
      background: linear-gradient(to top, #60A679, #60A679);
    }
    .minutes-fill {
      background: linear-gradient(to top, #60A679, #60A679);
    }
    .seconds-fill {
      background: linear-gradient(to top, #60A679, #60A679);
    }
  `]
})
export class TriangleClockComponent implements OnInit, OnDestroy {
  triangles = [
    { label: 'Horas', value: '00', height: 0, fillClass: 'hours-fill' },
    { label: 'Minutos', value: '00', height: 0, fillClass: 'minutes-fill' },
    { label: 'Segundos', value: '00', height: 0, fillClass: 'seconds-fill' }
  ];
  
  currentTimeString = '';
  private subscription?: Subscription;

  constructor(private timeService: TimeService) {}

  ngOnInit(): void {
    this.subscription = this.timeService.time$.subscribe(timeState => {
      this.updateTriangles(timeState.currentTime);
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private updateTriangles(date: Date): void {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const milliseconds = date.getMilliseconds();
    
    this.currentTimeString = date.toLocaleTimeString();

    const hoursProgress = (hours + minutes / 60 + seconds / 3600) / 24;
    const minutesProgress = (minutes + seconds / 60) / 60;
    const secondsProgress = (seconds + milliseconds / 1000) / 60;

    this.triangles[0].value = this.formatTime(hours);
    this.triangles[0].height = hoursProgress * 100;

    this.triangles[1].value = this.formatTime(minutes);
    this.triangles[1].height = minutesProgress * 100;

    this.triangles[2].value = this.formatTime(seconds);
    this.triangles[2].height = secondsProgress * 100;
  }

  formatTime(value: number): string {
    return value.toString().padStart(2, '0');
  }
}