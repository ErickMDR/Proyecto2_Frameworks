import { Injectable } from '@angular/core';
import { BehaviorSubject, interval } from 'rxjs';
import { TimeState } from '../shared/models';

@Injectable({
  providedIn: 'root'
})
export class TimeService {
  private timeState: TimeState = {
    currentTime: new Date(),
    customTime: null,
    isUsingCustomTime: false
  };

  private timeSubject = new BehaviorSubject<TimeState>(this.timeState);
  public time$ = this.timeSubject.asObservable();

  constructor() {
    interval(1000).subscribe(() => {
      if (!this.timeState.isUsingCustomTime) {
        this.timeState.currentTime = new Date();
        this.timeSubject.next({ ...this.timeState });
      }
    });
  }

  setCustomTime(time: Date): void {
    this.timeState.customTime = time;
    this.timeState.isUsingCustomTime = true;
    this.timeState.currentTime = time;
    this.timeSubject.next({ ...this.timeState });
  }

  useRealTime(): void {
    this.timeState.isUsingCustomTime = false;
    this.timeState.customTime = null;
    this.timeState.currentTime = new Date();
    this.timeSubject.next({ ...this.timeState });
  }

  getCurrentTime(): Date {
    return this.timeState.currentTime;
  }
}