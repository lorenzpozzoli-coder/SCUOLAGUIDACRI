
export interface Lesson {
  id: string;
  date: string; // Format: YYYY-MM-DD for internal sorting
  displayDate: string; // Format: DD/MM/YYYY for display
  startTime: string; // Format: HH:MM
  endTime: string; // Format: HH:MM
  instructor: string;
  student: string;
  createdAt: number;
}

export enum UserRole {
  NONE = 'NONE',
  INSTRUCTOR = 'INSTRUCTOR',
  STUDENT = 'STUDENT'
}
