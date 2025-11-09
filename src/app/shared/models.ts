export interface User {
  username: string;
  password: string;
}

export interface TimeState {
  currentTime: Date;
  customTime: Date | null;
  isUsingCustomTime: boolean;
}

export type ClockType = 
  | 'analog' 
  | 'digital' 
  | 'binary' 
  | 'circular' 
  | 'wave' 
  | 'frequency' 
  | 'sonar' 
  | 'amplitude'
  | 'qam'
  | 'cube';