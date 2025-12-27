
export interface Booking {
  id: string;
  customerName: string;
  phoneNumber: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  createdAt: number;
}

export interface TimeSlot {
  time: string;
  isAvailable: boolean;
}

export enum AppView {
  CLIENT = 'CLIENT',
  ADMIN = 'ADMIN'
}
