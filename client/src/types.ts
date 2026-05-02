// ─── User & Auth ─────────────────────────────────────────────────────────────
export type UserRole = 'doctor' | 'patient';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  // Doctor fields
  specialization?: string;
  clinicName?: string;
  experience?: number;
  rating?: number;
  reviewsCount?: number;
  bio?: string;
  availableSlots?: string[];
  dentalCollege?: string;
  // Patient fields
  age?: number;
  bloodGroup?: string;
  phone?: string;
  gender?: string;
}

// ─── Appointments ─────────────────────────────────────────────────────────────
export type AppointmentStatus =
  | 'pending'
  | 'approved'
  | 'rescheduled'
  | 'rejected'
  | 'completed'
  | 'cancelled';

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  timeSlot: string;
  status: AppointmentStatus;
  type: string;
  notes?: string;
  cancellationReason?: string;
  imageUrl?: string;
  createdAt: string;
  // Patient details snapshot
  patientName?: string;
  patientAge?: number;
  patientGender?: string;
  patientPhone?: string;
  toothpasteUsed?: string;
  brushType?: string;
}

// ─── Messaging ────────────────────────────────────────────────────────────────
export type MessageStatus = 'sent' | 'delivered' | 'read';

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
  status: MessageStatus;
  attachmentUrl?: string;
}

// ─── AI / Scans ───────────────────────────────────────────────────────────────
export type ScanSeverity = 'low' | 'medium' | 'high';

export interface InfectionScan {
  id: string;
  patientId: string;
  doctorId?: string;
  imageUrl: string;
  detection: string;
  prevention: string[];
  severity: ScanSeverity;
  date: string;
  reviewed?: boolean;
}

// ─── Ortho Monitoring ─────────────────────────────────────────────────────────
export interface OrthoHistoryEntry {
  week: number;
  imageUrl: string;
  match: number;
  feedback: string;
}

export interface OrthoProgress {
  id: string;
  patientId: string;
  stage: number;
  totalStages: number;
  lastAdjustment: string;
  nextAdjustment: string;
  complianceScore: number;
  history: OrthoHistoryEntry[];
}

// ─── Notifications ────────────────────────────────────────────────────────────
export type NotificationType = 'approved' | 'cancelled' | 'general' | 'reminder';
export type NotificationCategory = 'appointment' | 'scan' | 'ortho' | 'system';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  category: NotificationCategory;
  type: NotificationType;
}

// ─── Kids Brushing ────────────────────────────────────────────────────────────
export interface KidsBrushingLog {
  id: string;
  childName: string;
  session: 'morning' | 'night';
  duration: number; // seconds
  score: number;    // 0-100
  date: string;
}
