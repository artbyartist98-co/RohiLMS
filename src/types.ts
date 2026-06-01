export interface Course {
  id: string;
  name: string;
  category: 'Technical' | 'Non-Technical';
  baseFee: number; // Civil base fee
  minFee: number; // Civil min floor fee
  milOfficerBaseFee?: number;
  milOfficerMinFee?: number;
  milJcoBaseFee?: number;
  milJcoMinFee?: number;
  instructorName?: string;
  classRoom?: string;
}

export interface EnrolmentRecord {
  regId: string;
  firstName: string;
  lastName: string;
  fatherName: string;
  mobile: string;
  cnic: string;
  email: string;
  address: string;
  gender: string;
  laptop: 'Yes' | 'No';
  paymentPlan: 'Full' | 'Installment';
  civilStatus: string; // 'Civil' | 'Military'
  discount: number;
  totalFee: number;
  baseFee: number;
  laptopFee: number;
  status: 'Pending' | 'Verified' | 'Processing' | 'Enrolled';
  nextDueDate: string;
  createdAt: string;
  course: string;
  batchId?: string;
  batchName?: string;
  
  // New fields
  city?: string;
  dob?: string;
  milCategory?: 'Officer' | 'JCO' | '';
  milRank?: string;
  milUnit?: string;
  milName?: string;
  milStation?: string;
  milRelation?: string;
  createdByUsername?: string;
  createdByRole?: string;

  // Partial payment / installment ledger tracking
  paidAmount?: number;
  paymentHistory?: {
    id: string;
    date: string;
    amount: number;
    method: string;
    remarks?: string;
  }[];
}

export type AppView = 'form' | 'login' | 'admin' | 'success';

export interface Employee {
  id: string;
  username: string;
  passwordInput: string;
  role: string;
  course?: string; // locked course for Trainer role
}

export interface DropdownData {
  genders: string[];
  statuses: string[];
}

export interface Batch {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  morningCourses: string[];
  noonCourses: string[];
  eveningCourses: string[];
}

export interface HallBooking {
  id: string;
  companyName: string;
  personName: string;
  bookingFor: 'Seminar Hall' | 'Conference Room';
  price: number;
  duration: string;
  eventType: string;
  seatingCapacity: number;
  eventDate: string;
  timeSlot: string;
  venueRoom: string;
  createdAt: string;
}

export interface AttendanceLog {
  id: string;
  courseName: string;
  batchId?: string;
  date: string; // YYYY-MM-DD format
  records: { [studentRegId: string]: 'Present' | 'Absent' | 'Leave' };
  createdAt: string;
}

