import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { TimeService } from '../../time/time.service';

@Component({
  selector: 'app-binary-clock',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="binary-clock">
      <div class="binary-display">
        <div class="binary-column" *ngFor="let column of binaryTime; let i = index">
          <div class="bit-label">{{ labels[i] }}</div>
          <div class="bit" 
               *ngFor="let bit of column; let j = index"
               [class.active]="bit === '1'"
               [style.animation-delay]="(j * 0.1) + 's'">
            {{ bit }}
          </div>
        </div>
      </div>
    </div>
  `,
styles: [`
  .binary-clock {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 400px;
  }
  .binary-display {
    display: flex;
    gap: 30px;
    margin-bottom: 30px;
  }
  .binary-column {
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
  }
  .bit-label {
    color: #60A679;
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 10px;
    font-family: "Georgia", serif;
  }
  .bit {
    width: 50px;
    height: 50px;
    border: 2px solid #60A679;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #1a1a1a;
    font-family: 'Courier New', monospace;
    font-weight: bold;
    transition: all 0.3s ease;
    background: #ffffff;
  }
  .bit.active {
    background: #60A679;
    color: #1a1a1a;
  }
`]
})
export class BinaryClockComponent implements OnInit, OnDestroy {
  binaryTime: string[][] = [];
  timeString = '';
  labels = ['H', 'H', 'M', 'M', 'S', 'S'];
  private subscription?: Subscription;

  constructor(private timeService: TimeService) {}

  ngOnInit(): void {
    this.subscription = this.timeService.time$.subscribe(timeState => {
      this.updateBinaryTime(timeState.currentTime);
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private updateBinaryTime(date: Date): void {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    
    this.binaryTime = [
      this.decimalToBinary(parseInt(hours[0])),
      this.decimalToBinary(parseInt(hours[1])),
      this.decimalToBinary(parseInt(minutes[0])),
      this.decimalToBinary(parseInt(minutes[1])),
      this.decimalToBinary(parseInt(seconds[0])),
      this.decimalToBinary(parseInt(seconds[1]))
    ];
  }

  private decimalToBinary(num: number): string[] {
    return num.toString(2).padStart(4, '0').split('');
  }
}