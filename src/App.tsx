import React, { useState, useEffect, useMemo, FormEvent } from 'react';
import {
  Search,
  Lock,
  Printer,
  Edit2,
  Plus,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Calendar,
  DollarSign,
  Laptop,
  Check,
  Building,
  Activity,
  User,
  LogOut,
  ChevronRight,
  ShieldAlert,
  Moon,
  Sun,
  Database,
  Download,
  Copy,
  Settings,
  RefreshCw,
  ExternalLink,
  FileText,
  Trash2,
  Users,
  Bell,
  BookOpen,
  Briefcase,
  Shield,
  PieChart,
  Smartphone,
  Key,
  ChevronDown,
  HelpCircle,
  Layers,
  Package,
  Eye,
  EyeOff
} from 'lucide-react';
import { EnrolmentRecord, AppView, DropdownData, Course, Employee, Batch, HallBooking, AttendanceLog } from './types';
import {
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  BarChart,
  XAxis,
  YAxis,
  Bar
} from 'recharts';
import { feeCalculator } from './utils/feeCalculator';
import AdminCharts from './components/AdminCharts';
import InquiryPanel from './components/InquiryPanel';
import EmployeePanel from './components/EmployeePanel';
import StartupPanel from './components/StartupPanel';
import HallBookingPanel from './components/HallBookingPanel';
import InventoryPanel from './components/InventoryPanel';
import NewEnrollmentModal from './components/NewEnrollmentModal';
import AttendanceRegistry from './components/AttendanceRegistry';

// Default static courses list matching the inquiry panel aesthetics and options
const DEFAULT_COURSES: Course[] = [
  { id: '1', name: 'Web Design & Development', category: 'Technical', baseFee: 35000, minFee: 25000, milOfficerBaseFee: 30000, milOfficerMinFee: 22000, milJcoBaseFee: 25000, milJcoMinFee: 18000, instructorName: 'Muhammad Asad' },
  { id: '2', name: 'Mobile App Development', category: 'Technical', baseFee: 45000, minFee: 35000, milOfficerBaseFee: 40000, milOfficerMinFee: 30000, milJcoBaseFee: 35000, milJcoMinFee: 25000, instructorName: 'Muhammad Asad' },
  { id: '3', name: 'Network & Cyber Security', category: 'Technical', baseFee: 40000, minFee: 30000, milOfficerBaseFee: 35000, milOfficerMinFee: 25000, milJcoBaseFee: 30000, milJcoMinFee: 20000, instructorName: 'Muhammad Haider Tallal' },
  { id: '4', name: 'eBay & TikTok Shop Mastery', category: 'Non-Technical', baseFee: 30000, minFee: 20000, milOfficerBaseFee: 25000, milOfficerMinFee: 18000, milJcoBaseFee: 20000, milJcoMinFee: 15000, instructorName: 'Faizan Ali' },
  { id: '5', name: 'Freelancing & Digital Marketing', category: 'Non-Technical', baseFee: 25000, minFee: 15000, milOfficerBaseFee: 20000, milOfficerMinFee: 12000, milJcoBaseFee: 15000, milJcoMinFee: 10000, instructorName: 'Ushna Shahid' },
  { id: '6', name: 'Cloud Computing & DevOps', category: 'Technical', baseFee: 50000, minFee: 40000, milOfficerBaseFee: 45000, milOfficerMinFee: 35000, milJcoBaseFee: 40000, milJcoMinFee: 30000, instructorName: 'Muhammad Haider Tallal' },
  { id: '7', name: 'Graphic Design & UI/UX', category: 'Non-Technical', baseFee: 28000, minFee: 18000, milOfficerBaseFee: 24000, milOfficerMinFee: 15000, milJcoBaseFee: 18000, milJcoMinFee: 12000, instructorName: 'Anila Rajpout' }
];

// Seed Initial Data to sync with localStorage
const INITIAL_RECORDS: EnrolmentRecord[] = [
  {
    regId: '147796229041872',
    firstName: 'Faisal',
    lastName: 'Farrukh',
    fatherName: 'Farrukh Shahzad',
    mobile: '03001234567',
    cnic: '3520244005827',
    email: 'faisal.farrukh@example.com',
    address: 'House 24-B, Sector C, Shah Rukn-e-Alam, Multan',
    gender: 'Male',
    laptop: 'No',
    paymentPlan: 'Full',
    civilStatus: 'Civil',
    discount: 0,
    baseFee: 35000,
    laptopFee: 0,
    totalFee: 35000,
    status: 'Enrolled',
    nextDueDate: '2026-06-20',
    createdAt: '2026-05-19T10:30:00Z',
    course: 'Web Design & Development',
    city: 'Multan',
    dob: '1998-05-12'
  },
  {
    regId: '147796229041873',
    firstName: 'Amna',
    lastName: 'Sajid',
    fatherName: 'Sajid Mahmood',
    mobile: '03217654321',
    cnic: '3120288495021',
    email: 'amna.sajid@example.com',
    address: 'Model Town A, Bahawalpur',
    gender: 'Female',
    laptop: 'Yes',
    paymentPlan: 'Installment',
    civilStatus: 'Civil',
    discount: 5000,
    baseFee: 45000,
    laptopFee: 3000,
    totalFee: 43000,
    status: 'Pending',
    nextDueDate: '2026-06-25',
    createdAt: '2026-05-20T14:22:00Z',
    course: 'Mobile App Development',
    city: 'Bahawalpur',
    dob: '2001-09-24'
  },
  {
    regId: '147796229041874',
    firstName: 'Zubair',
    lastName: 'Ali',
    fatherName: 'Ali Hassan',
    mobile: '03335559992',
    cnic: '3120512345671',
    email: 'zubair.ali@example.com',
    address: 'Street 4, Bilal Colony, Bahawalpur',
    gender: 'Male',
    laptop: 'No',
    paymentPlan: 'Full',
    civilStatus: 'Military',
    milCategory: 'JCO',
    milRank: 'Naib Subedar',
    milUnit: '12 Punjab Regiment',
    milName: 'Zubair Ali',
    milStation: 'Bahawalpur Cantt',
    milRelation: 'Self',
    discount: 10000,
    baseFee: 40000,
    laptopFee: 0,
    totalFee: 30000,
    status: 'Enrolled',
    nextDueDate: '2026-06-20',
    createdAt: '2026-05-20T16:45:00Z',
    course: 'Network & Cyber Security',
    city: 'Bahawalpur',
    dob: '1995-11-05'
  },
  {
    regId: '147796229041875',
    firstName: 'Hamza',
    lastName: 'Tariq',
    fatherName: 'Tariq Jamil',
    mobile: '03154823901',
    cnic: '3120288495027',
    email: 'hamza.tariq@example.com',
    address: 'Gulgasht Colony, Multan',
    gender: 'Male',
    laptop: 'Yes',
    paymentPlan: 'Installment',
    civilStatus: 'Civil',
    discount: 2000,
    baseFee: 25000,
    laptopFee: 3000,
    totalFee: 26050,
    status: 'Verified',
    nextDueDate: '2026-07-02',
    createdAt: '2026-05-21T09:15:00Z',
    course: 'Freelancing & Digital Marketing',
    city: 'Multan',
    dob: '2000-02-14'
  },
  {
    regId: '147796229041876',
    firstName: 'Fatima',
    lastName: 'Batool',
    fatherName: 'Commanding Officer Riaz Ahmed',
    mobile: '03087771234',
    cnic: '3740523456782',
    email: 'fatima.batool@example.com',
    address: 'Officer Mess Road, Bahawalpur Cantt',
    gender: 'Female',
    laptop: 'No',
    paymentPlan: 'Full',
    civilStatus: 'Military',
    milCategory: 'Officer',
    milRank: 'Lieutenant Colonel',
    milUnit: '33 Cavalry',
    milName: 'Riaz Ahmed',
    milStation: 'Bahawalpur Cantt',
    milRelation: 'Father',
    discount: 15000,
    baseFee: 30000,
    laptopFee: 0,
    totalFee: 15000,
    status: 'Processing',
    nextDueDate: '2026-06-30',
    createdAt: '2026-05-22T11:40:00Z',
    course: 'eBay & TikTok Shop Mastery',
    city: 'Bahawalpur',
    dob: '2002-08-08',
    createdByRole: 'Admissions Officer'
  },
  {
    regId: '147796229041877',
    firstName: 'Saad',
    lastName: 'Rehman',
    fatherName: 'Khalil-ur-Rehman',
    mobile: '03459988112',
    cnic: '3130389104829',
    email: 'saad.rehman@example.com',
    address: 'Chowk Bahadur Pur, Rahim Yar Khan',
    gender: 'Male',
    laptop: 'Yes',
    paymentPlan: 'Full',
    civilStatus: 'Civil',
    discount: 4000,
    baseFee: 50000,
    laptopFee: 3000,
    totalFee: 49000,
    status: 'Enrolled',
    nextDueDate: '2026-06-20',
    createdAt: '2026-05-23T14:10:00Z',
    course: 'Cloud Computing & DevOps',
    city: 'Rahim Yar Khan',
    dob: '1999-10-10'
  },
  {
    regId: '147796229041878',
    firstName: 'Maryam',
    lastName: 'Nawaz',
    fatherName: 'Muhammad Nawaz',
    mobile: '03126655443',
    cnic: '3120288495034',
    email: 'maryam.nawaz@example.com',
    address: 'Satellite Town, Bahawalpur',
    gender: 'Female',
    laptop: 'No',
    paymentPlan: 'Full',
    civilStatus: 'Civil',
    discount: 0,
    baseFee: 35000,
    laptopFee: 0,
    totalFee: 35000,
    status: 'Verified',
    nextDueDate: '2026-06-22',
    createdAt: '2026-05-24T08:50:00Z',
    course: 'Web Design & Development',
    city: 'Bahawalpur',
    dob: '2003-04-18'
  },
  {
    regId: '147796229041879',
    firstName: 'Bilal',
    lastName: 'Arshad',
    fatherName: 'Arshad Mehmood',
    mobile: '03310099887',
    cnic: '3110238198273',
    email: 'bilal.arshad@example.com',
    address: 'Karachi Gate, Bahawalpur',
    gender: 'Male',
    laptop: 'No',
    paymentPlan: 'Installment',
    civilStatus: 'Civil',
    discount: 3000,
    baseFee: 28000,
    laptopFee: 0,
    totalFee: 25000,
    status: 'Pending',
    nextDueDate: '2026-06-30',
    createdAt: '2026-05-24T12:00:00Z',
    course: 'Graphic Design & UI/UX',
    city: 'Bahawalpur',
    dob: '2001-01-01',
    createdByRole: 'Trainer'
  },
  {
    regId: '147796229041880',
    firstName: 'Usman',
    lastName: 'Ghani',
    fatherName: 'Muhammad Ghani',
    mobile: '03107293847',
    cnic: '3120539103928',
    email: 'usman.ghani@example.com',
    address: 'Defense Colony, Bahawalpur Cantt',
    gender: 'Male',
    laptop: 'Yes',
    paymentPlan: 'Full',
    civilStatus: 'Military',
    milCategory: 'JCO',
    milRank: 'Subedar Major',
    milUnit: '24 Frontier Force',
    milName: 'Muhammad Ghani',
    milStation: 'Bahawalpur Cantt',
    milRelation: 'Father',
    discount: 5000,
    baseFee: 30000,
    laptopFee: 3000,
    totalFee: 28000,
    status: 'Enrolled',
    nextDueDate: '2026-06-20',
    createdAt: '2026-05-25T15:30:00Z',
    course: 'Network & Cyber Security',
    city: 'Bahawalpur',
    dob: '1997-07-25'
  },
  {
    regId: '147796229041881',
    firstName: 'Zainab',
    lastName: 'Riaz',
    fatherName: 'Riaz-ul-Haq',
    mobile: '03204918234',
    cnic: '3520192837461',
    email: 'zainab.riaz@example.com',
    address: 'Wapda Town, Multan',
    gender: 'Female',
    laptop: 'No',
    paymentPlan: 'Installment',
    civilStatus: 'Civil',
    discount: 0,
    baseFee: 45000,
    laptopFee: 0,
    totalFee: 45000,
    status: 'Processing',
    nextDueDate: '2026-07-01',
    createdAt: '2026-05-25T16:20:00Z',
    course: 'Mobile App Development',
    city: 'Multan',
    dob: '2000-12-15'
  }
];

export default function App() {
  // Splash Loader status
  const [loading, setLoading] = useState<boolean>(true);
  const [activeView, setActiveView] = useState<AppView>(() => {
    try {
      const savedUser = localStorage.getItem('rohi_current_user');
      return savedUser ? 'admin' : 'form';
    } catch (e) {
      return 'form';
    }
  });
  const [records, setRecords] = useState<EnrolmentRecord[]>([]);

  // Employee Accounts Registry State (Role-Based LMS)
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('rohi_employees');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return [
      { id: '1', username: 'admin', passwordInput: 'admin123', role: 'Super Administrator' },
      { id: '2', username: 'accountant', passwordInput: 'accountant123', role: 'Accountant' },
      { id: '3', username: 'trainer_web', passwordInput: 'trainer123', role: 'Trainer', course: 'Web Design & Development' },
      { id: '4', username: 'trainer_mobile', passwordInput: 'trainer123', role: 'Trainer', course: 'Mobile App Development' },
      { id: '5', username: 'trainer_cyber', passwordInput: 'trainer123', role: 'Trainer', course: 'Network & Cyber Security' },
      { id: '6', username: 'trainer_digital', passwordInput: 'trainer123', role: 'Trainer', course: 'Freelancing & Digital Marketing' }
    ];
  });

  // Track currently logged-in Admin/Staff member
  const [currentUser, setCurrentUser] = useState<Employee | null>(() => {
    const saved = localStorage.getItem('rohi_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return null;
  });

  // Keep employees registry in sync with local storage
  useEffect(() => {
    localStorage.setItem('rohi_employees', JSON.stringify(employees));
  }, [employees]);

  // Sync current user and standard role ('admin' when logged-in, 'student' otherwise)
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('rohi_current_user', JSON.stringify(currentUser));
      setRole('admin');
    } else {
      localStorage.removeItem('rohi_current_user');
      setRole('student');
    }
  }, [currentUser]);

  // Dynamic visible records filter based on user roles
  const visibleRecords = useMemo(() => {
    if (!currentUser) return records;
    if (currentUser.role === 'Super Administrator' || currentUser.role === 'Accountant') {
      return records;
    }
    if (currentUser.role === 'Trainer') {
      return records;
    }
    // Custom dynamic Administrator/Staff role: restrict to own role's entries only
    return records.filter(r => r.createdByRole === currentUser.role);
  }, [records, currentUser]);

  const canSeeEnrollmentTabs = useMemo(() => {
    if (!currentUser) return false;
    return currentUser.role !== 'Trainer';
  }, [currentUser]);

  // Sidebar item: 'admin' | 'students' | 'inquiry' | 'startups' | 'courses' | 'employees' | 'inventory'
  const [sidebarActiveItem, setSidebarActiveItem] = useState<string>('inquiry');
  // For viewing applicants of a specific course under separate card clicks
  const [selectedInquiryCourse, setSelectedInquiryCourse] = useState<string | null>(null);

  // Employee Form State
  const [employeeFormUsername, setEmployeeFormUsername] = useState<string>('');
  const [employeeFormPassword, setEmployeeFormPassword] = useState<string>('');
  const [employeeFormRole, setEmployeeFormRole] = useState<string>('Super Administrator');
  const [availableRoles, setAvailableRoles] = useState<string[]>(() => {
    const saved = localStorage.getItem('rohi_available_roles');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return ['Super Administrator', 'Accountant', 'Trainer'];
  });
  
  const [employeeFormCourse, setEmployeeFormCourse] = useState<string>('Web Design & Development');
  const [editingEmployeeId, setEditingEmployeeId] = useState<string | null>(null);

  // Sync available roles to local storage
  useEffect(() => {
    localStorage.setItem('rohi_available_roles', JSON.stringify(availableRoles));
  }, [availableRoles]);

  // Inquiry new enrolment popup modal state
  const [isInquiryEnrollModalOpen, setIsInquiryEnrollModalOpen] = useState<boolean>(false);
  const [preselectedCourseForModal, setPreselectedCourseForModal] = useState<string | null>(null);

  // New states for Batch & Hall booking
  const [batches, setBatches] = useState<Batch[]>(() => {
    const saved = localStorage.getItem('rohi_batches');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'b1',
        name: 'Batch-14 (Summer 2026)',
        startDate: '2026-06-01',
        endDate: '2026-09-01',
        morningCourses: ['Web Design & Development', 'Mobile App Development'],
        noonCourses: ['Network & Cyber Security'],
        eveningCourses: ['eBay & TikTok Shop Mastery', 'Freelancing & Digital Marketing']
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('rohi_batches', JSON.stringify(batches));
  }, [batches]);

  const [hallBookings, setHallBookings] = useState<HallBooking[]>(() => {
    const saved = localStorage.getItem('rohi_hall_bookings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'hb1',
        companyName: 'TechVision Solutions (Pvt.) Ltd.',
        personName: 'Kamran Malik',
        bookingFor: 'Seminar Hall',
        price: 40000,
        duration: '8 Hours (Full Day)',
        eventType: 'Corporate Seminar',
        seatingCapacity: 80,
        eventDate: '2026-05-28',
        timeSlot: '09:00 AM – 05:00 PM',
        venueRoom: 'Main Seminar Hall – A',
        createdAt: '2026-05-25T08:00:00Z'
      },
      {
        id: 'hb2',
        companyName: 'Ignite Pakistan Tech Incubator',
        personName: 'Sarah Ahmed',
        bookingFor: 'Executive Board Room',
        price: 25000,
        duration: '4 Hours (Half Day)',
        eventType: 'Startup Pitch Event',
        seatingCapacity: 25,
        eventDate: '2026-06-02',
        timeSlot: '02:00 PM – 06:00 PM',
        venueRoom: 'Board Room B',
        createdAt: '2026-05-25T09:30:00Z'
      },
      {
        id: 'hb3',
        companyName: 'Nexus Innovators Association',
        personName: 'Bilal Siddiqui',
        bookingFor: 'Lab Training Hall',
        price: 50000,
        duration: '12 Hours (Extended Full Day)',
        eventType: 'Python Bootcamp Lab Session',
        seatingCapacity: 50,
        eventDate: '2026-06-05',
        timeSlot: '08:00 AM – 08:00 PM',
        venueRoom: 'Advanced Computer Lab C',
        createdAt: '2026-05-25T11:00:00Z'
      },
      {
        id: 'hb4',
        companyName: 'Rohi Alumni Reunion',
        personName: 'Amara Bashir',
        bookingFor: 'Main Seminar Hall',
        price: 45000,
        duration: '6 Hours (Evening Session)',
        eventType: 'Interactive Alumni Networking Dinner',
        seatingCapacity: 100,
        eventDate: '2026-06-12',
        timeSlot: '04:00 PM – 10:00 PM',
        venueRoom: 'Main Seminar Hall – A',
        createdAt: '2026-05-25T14:45:00Z'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('rohi_hall_bookings', JSON.stringify(hallBookings));
  }, [hallBookings]);

  // Attendance Logging State for Trainer LMS Operations
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceLog[]>(() => {
    const saved = localStorage.getItem('rohi_attendance_logs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse attendance logs:', e);
      }
    }
    return [
      {
        id: 'init-att-1',
        courseName: 'Web Design & Development',
        date: '2026-05-24',
        records: {
          '147796229041872': 'Present',
          '147796229041878': 'Present'
        },
        createdAt: '2026-05-24T12:00:00Z'
      },
      {
        id: 'init-att-2',
        courseName: 'Mobile App Development',
        date: '2026-05-24',
        records: {
          '147796229041873': 'Present',
          '147796229041881': 'Absent'
        },
        createdAt: '2026-05-24T12:00:00Z'
      },
      {
        id: 'init-att-3',
        courseName: 'Network & Cyber Security',
        date: '2026-05-24',
        records: {
          '147796229041874': 'Present',
          '147796229041880': 'Leave'
        },
        createdAt: '2026-05-24T12:00:00Z'
      },
      {
        id: 'init-att-4',
        courseName: 'Web Design & Development',
        date: '2026-05-25',
        records: {
          '147796229041872': 'Present',
          '147796229041878': 'Leave'
        },
        createdAt: '2026-05-25T12:00:00Z'
      },
      {
        id: 'init-att-5',
        courseName: 'Mobile App Development',
        date: '2026-05-25',
        records: {
          '147796229041873': 'Absent',
          '147796229041881': 'Present'
        },
        createdAt: '2026-05-25T12:00:00Z'
      }
    ];
  });

  const handleSaveAttendanceLogs = (newLogs: AttendanceLog[]) => {
    setAttendanceLogs(newLogs);
    localStorage.setItem('rohi_attendance_logs', JSON.stringify(newLogs));
  };

  const [invoiceBooking, setInvoiceBooking] = useState<HallBooking | null>(null);

  // Batch Form local states
  const [batchFormName, setBatchFormName] = useState<string>('');
  const [batchFormStartDate, setBatchFormStartDate] = useState<string>('');
  const [batchFormEndDate, setBatchFormEndDate] = useState<string>('');
  const [batchFormMorning, setBatchFormMorning] = useState<string[]>([]);
  const [batchFormNoon, setBatchFormNoon] = useState<string[]>([]);
  const [batchFormEvening, setBatchFormEvening] = useState<string[]>([]);
  const [editingBatchId, setEditingBatchId] = useState<string | null>(null);

  const handleAddBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchFormName.trim() || !batchFormStartDate || !batchFormEndDate) {
      showToast('Please fill in Batch Name and dates.', 'err');
      return;
    }
    
    if (editingBatchId) {
      // Update existing batch
      setBatches(prev => prev.map(b => b.id === editingBatchId ? {
        ...b,
        name: batchFormName.trim(),
        startDate: batchFormStartDate,
        endDate: batchFormEndDate,
        morningCourses: [...batchFormMorning],
        noonCourses: [...batchFormNoon],
        eveningCourses: [...batchFormEvening]
      } : b));
      showToast(`Batch "${batchFormName.trim()}" updated successfully!`, 'success');
      setEditingBatchId(null);
    } else {
      // Create new batch
      const newBatch: Batch = {
        id: 'batch-' + Date.now().toString(),
        name: batchFormName.trim(),
        startDate: batchFormStartDate,
        endDate: batchFormEndDate,
        morningCourses: [...batchFormMorning],
        noonCourses: [...batchFormNoon],
        eveningCourses: [...batchFormEvening]
      };
      const updated = [newBatch, ...batches];
      setBatches(updated);
      showToast(`Batch "${newBatch.name}" created successfully!`, 'success');
    }
    
    // Reset Form
    setBatchFormName('');
    setBatchFormStartDate('');
    setBatchFormEndDate('');
    setBatchFormMorning([]);
    setBatchFormNoon([]);
    setBatchFormEvening([]);
  };

  const handleStartEditBatch = (b: Batch) => {
    setEditingBatchId(b.id);
    setBatchFormName(b.name);
    setBatchFormStartDate(b.startDate);
    setBatchFormEndDate(b.endDate);
    setBatchFormMorning(b.morningCourses || []);
    setBatchFormNoon(b.noonCourses || []);
    setBatchFormEvening(b.eveningCourses || []);
    showToast(`Loaded "${b.name}" for editing`, 'info');
  };

  const handleCancelEditBatch = () => {
    setEditingBatchId(null);
    setBatchFormName('');
    setBatchFormStartDate('');
    setBatchFormEndDate('');
    setBatchFormMorning([]);
    setBatchFormNoon([]);
    setBatchFormEvening([]);
    showToast('Batch editing cancelled.', 'info');
  };

  const handleDeleteBatch = (id: string) => {
    if (editingBatchId === id) {
      setEditingBatchId(null);
      setBatchFormName('');
      setBatchFormStartDate('');
      setBatchFormEndDate('');
      setBatchFormMorning([]);
      setBatchFormNoon([]);
      setBatchFormEvening([]);
    }
    setBatches(prev => prev.filter(b => b.id !== id));
    showToast('Batch removed from sessions database.', 'info');
  };

  const handleAddHallBooking = (b: HallBooking) => {
    const updated = [b, ...hallBookings];
    setHallBookings(updated);
    showToast('Corporate booking reserved successfully!', 'success');
  };

  const handleDeleteHallBooking = (id: string) => {
    setHallBookings(prev => prev.filter(b => b.id !== id));
    showToast('Space booking allocation has been cancelled.', 'info');
  };

  const handlePrintBookingInvoice = (booking: HallBooking) => {
    setInvoiceBooking(booking);
    const cachedVoucher = voucherRecord;
    setVoucherRecord(null);
    showToast('Preparing invoice print interface...', 'info');
    setTimeout(() => {
      window.print();
      setVoucherRecord(cachedVoucher);
      setInvoiceBooking(null);
    }, 400);
  };

  // Dynamic Course Storage state
  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('rohi_courses');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return DEFAULT_COURSES;
  });

  const [newSelectedCourse, setNewSelectedCourse] = useState<string>('Web Design & Development');
  const [editSelectedCourse, setEditSelectedCourse] = useState<string>('');

  // Course Management edit/add states
  const [courseFormName, setCourseFormName] = useState<string>('');
  const [courseFormCategory, setCourseFormCategory] = useState<'Technical' | 'Non-Technical'>('Technical');
  const [courseFormBaseFee, setCourseFormBaseFee] = useState<number>(30000);
  const [courseFormMinFee, setCourseFormMinFee] = useState<number>(20000);
  const [courseFormInstructor, setCourseFormInstructor] = useState<string>('');
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);

  // Sub-Navigation controller within Admin Workspace (defaults to inquiry screen as requested)
  const [adminSubView, setAdminSubView] = useState<'inquiry' | 'admin' | 'courses'>('inquiry');
  const [inquiryCategory, setInquiryCategory] = useState<'Technical' | 'Non-Technical'>('Technical');

  // Sync courses list to local storage
  useEffect(() => {
    localStorage.setItem('rohi_courses', JSON.stringify(courses));
  }, [courses]);

  // Form step state (1, 2, or 3)
  const [formStep, setFormStep] = useState<number>(1);
  const [role, setRole] = useState<'student' | 'admin'>('student');

  // Search filter
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterCivilStatus, setFilterCivilStatus] = useState<string>('All');
  const [filterCourse, setFilterCourse] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterGender, setFilterGender] = useState<string>('All');
  const [filterPaymentPlan, setFilterPaymentPlan] = useState<string>('All');
  const [filterLaptop, setFilterLaptop] = useState<string>('All');
  const [filterBatch, setFilterBatch] = useState<string>('All');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // New States for Students submenu & views (Summary vs Profile)
  const [studentsSubView, setStudentsSubView] = useState<'summary' | 'profile'>('summary');
  const [summaryBatchFilter, setSummaryBatchFilter] = useState<string>('All');
  
  // Specific list search boxes (under table headers) for Student Profile
  const [searchSRQuery, setSearchSRQuery] = useState<string>('');
  const [searchNameQuery, setSearchNameQuery] = useState<string>('');
  const [searchEmailQuery, setSearchEmailQuery] = useState<string>('');
  const [searchInstructorQuery, setSearchInstructorQuery] = useState<string>('');

  // Pagination for Student Profile Roster
  const [studentsPage, setStudentsPage] = useState<number>(1);
  const [studentsPerPage, setStudentsPerPage] = useState<number>(20);

  // Authentication
  const [usernameInput, setUsernameInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const [showLoginPassword, setShowLoginPassword] = useState<boolean>(false);

  // Custom admin password configuration
  const [adminPassword, setAdminPassword] = useState<string>(() => {
    return localStorage.getItem('rohi_admin_password') || 'admin123';
  });
  const [currentPassChange, setCurrentPassChange] = useState<string>('');
  const [newPassChange, setNewPassChange] = useState<string>('');
  const [confirmPassChange, setConfirmPassChange] = useState<string>('');

  // New enrolment form fields
  const [newFirstName, setNewFirstName] = useState<string>('');
  const [newLastName, setNewLastName] = useState<string>('');
  const [newFatherName, setNewFatherName] = useState<string>('');
  const [newMobile, setNewMobile] = useState<string>('');
  const [newCnic, setNewCnic] = useState<string>('');
  const [newEmail, setNewEmail] = useState<string>('');
  const [newAddress, setNewAddress] = useState<string>('');
  const [newGender, setNewGender] = useState<string>('Male');
  const [newLaptop, setNewLaptop] = useState<'Yes' | 'No'>('No');
  const [newPaymentPlan, setNewPaymentPlan] = useState<'Full' | 'Installment'>('Full');
  const [newCivilStatus, setNewCivilStatus] = useState<string>('Civil');
  const [newDiscount, setNewDiscount] = useState<number>(0);
  const [newNextDueDate, setNewNextDueDate] = useState<string>('');
  const [newStatus, setNewStatus] = useState<'Pending' | 'Verified' | 'Processing' | 'Enrolled'>('Pending');
  
  // New personal records fields
  const [newCity, setNewCity] = useState<string>('');
  const [newDob, setNewDob] = useState<string>('');
  const [newMilCategory, setNewMilCategory] = useState<'Officer' | 'JCO' | ''>('');
  const [newMilRank, setNewMilRank] = useState<string>('');
  const [newMilUnit, setNewMilUnit] = useState<string>('');
  const [newMilName, setNewMilName] = useState<string>('');
  const [newMilStation, setNewMilStation] = useState<string>('');
  const [newMilRelation, setNewMilRelation] = useState<string>('');

  // Course management extra fields for Military Officers & JCOs
  const [courseFormMilOfficerBaseFee, setCourseFormMilOfficerBaseFee] = useState<number>(27000);
  const [courseFormMilOfficerMinFee, setCourseFormMilOfficerMinFee] = useState<number>(18000);
  const [courseFormMilJcoBaseFee, setCourseFormMilJcoBaseFee] = useState<number>(24000);
  const [courseFormMilJcoMinFee, setCourseFormMilJcoMinFee] = useState<number>(15000);

  // Notification / Toast
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'err' | 'info' } | null>(null);

  // Success screen display record
  const [submittedRecord, setSubmittedRecord] = useState<EnrolmentRecord | null>(null);

  // Print voucher focus state
  const [voucherRecord, setVoucherRecord] = useState<EnrolmentRecord | null>(null);

  // Edit Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);

  // Edit Fields
  const [editFirstName, setEditFirstName] = useState<string>('');
  const [editLastName, setEditLastName] = useState<string>('');
  const [editFatherName, setEditFatherName] = useState<string>('');
  const [editMobile, setEditMobile] = useState<string>('');
  const [editCnic, setEditCnic] = useState<string>('');
  const [editEmail, setEditEmail] = useState<string>('');
  const [editAddress, setEditAddress] = useState<string>('');
  const [editGender, setEditGender] = useState<string>('Male');
  const [editLaptop, setEditLaptop] = useState<'Yes' | 'No'>('No');
  const [editCivilStatus, setEditCivilStatus] = useState<string>('Civil');
  const [editDiscount, setEditDiscount] = useState<number>(0);
  const [editPaymentPlan, setEditPaymentPlan] = useState<'Full' | 'Installment'>('Full');
  const [editStatus, setEditStatus] = useState<'Pending' | 'Verified' | 'Processing' | 'Enrolled'>('Pending');
  const [editNextDueDate, setEditNextDueDate] = useState<string>('');

  // New personal record fields for editing
  const [editCity, setEditCity] = useState<string>('');
  const [editDob, setEditDob] = useState<string>('');
  const [editMilCategory, setEditMilCategory] = useState<'Officer' | 'JCO' | ''>('');
  const [editMilRank, setEditMilRank] = useState<string>('');
  const [editMilUnit, setEditMilUnit] = useState<string>('');
  const [editMilName, setEditMilName] = useState<string>('');
  const [editMilStation, setEditMilStation] = useState<string>('');
  const [editMilRelation, setEditMilRelation] = useState<string>('');

  // ── GOOGLE SHEETS APPS SCRIPT INTEGRATION STATE ──
  const [appsScriptUrl, setAppsScriptUrl] = useState<string>(() => {
    return localStorage.getItem('rohi_apps_script_url') || '';
  });
  const [autoSheetsSync, setAutoSheetsSync] = useState<boolean>(() => {
    return localStorage.getItem('rohi_auto_sheets_sync') === 'true';
  });
  const [syncingStatus, setSyncingStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [lastSyncTime, setLastSyncTime] = useState<string>(() => {
    return localStorage.getItem('rohi_last_sync_time') || '';
  });

  // Automatically save configuration options to localStorage
  useEffect(() => {
    localStorage.setItem('rohi_apps_script_url', appsScriptUrl);
  }, [appsScriptUrl]);

  useEffect(() => {
    localStorage.setItem('rohi_auto_sheets_sync', autoSheetsSync ? 'true' : 'false');
  }, [autoSheetsSync]);

  // Synchronize a specific record (asynchronously with fail-safes)
  const syncRecordToSheets = async (record: EnrolmentRecord, overrideUrl = appsScriptUrl) => {
    const url = overrideUrl.trim();
    if (!url) return;

    try {
      await fetch(url, {
        method: 'POST',
        mode: 'no-cors', // Solves Google Apps Script cross-origin redirect sandboxing
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'addRecord',
          record: {
            ...record,
            createdAtFormatted: new Date(record.createdAt).toLocaleString('en-US'),
            totalFeeFormatted: `${record.totalFee} PKR`
          }
        })
      });
      console.log('Synchronized to Google Sheet successfully');
    } catch (err) {
      console.error('Failed to auto-sync to Google Sheets:', err);
    }
  };

  // Synchronize all existing records in database to Google Sheets
  const handleBulkSyncToSheets = async () => {
    const url = appsScriptUrl.trim();
    if (!url) {
      showToast('Please provide a Google Apps Script Web App URL first.', 'err');
      return;
    }

    setSyncingStatus('syncing');
    showToast('Uploading records to Google Sheets...', 'info');

    try {
      // Create request payload
      const payload = {
        action: 'bulkSync',
        records: records.map(r => ({
          ...r,
          createdAtFormatted: r.createdAt ? new Date(r.createdAt).toLocaleString('en-US') : '',
          totalFeeFormatted: `${r.totalFee} PKR`
        }))
      };

      await fetch(url, {
        method: 'POST',
        mode: 'no-cors', // Web app returns status redirection which naturally trips CORS but finishes execution safely
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const nowStr = new Date().toLocaleString();
      setLastSyncTime(nowStr);
      localStorage.setItem('rohi_last_sync_time', nowStr);
      setSyncingStatus('success');
      showToast('All records successfully synchronized with Google Sheet!', 'success');
    } catch (err) {
      console.error('Google Sheets sync failed:', err);
      setSyncingStatus('error');
      showToast('Error syncing with Google Apps Script Web App.', 'err');
    }
  };

  // Test connection with Google Sheets Apps Script Web App
  const handleTestConnection = async () => {
    const url = appsScriptUrl.trim();
    if (!url) {
      showToast('Please provide a Google Apps Script Web App URL first.', 'err');
      return;
    }

    setSyncingStatus('syncing');
    showToast('Testing Web Service endpoint connection...', 'info');

    try {
      await fetch(url, {
        method: 'GET',
        mode: 'no-cors'
      });
      setSyncingStatus('idle');
      showToast('Connection handshake successful! Web app has responded.', 'success');
    } catch (err) {
      console.error('Connection check failed:', err);
      setSyncingStatus('error');
      showToast('Could not handshake. Please verify your Web App URL deployment.', 'err');
    }
  };

  // Export records to CSV
  const handleExportCSV = () => {
    if (records.length === 0) {
      showToast('No records available to export.', 'err');
      return;
    }

    const headers = [
      'Application ID',
      'First Name',
      'Last Name',
      'Father Name',
      'Email Address',
      'Mobile No',
      'CNIC',
      'Address',
      'Gender',
      'Laptop Needed',
      'Payment Plan',
      'Civil Status',
      'Discount Applied (PKR)',
      'Net Total Fee (PKR)',
      'Base Fee (PKR)',
      'Laptop Fee (PKR)',
      'Ledger Status',
      'Next Due Date',
      'Submission Date'
    ];

    const rows = records.map(rec => [
      `"${rec.regId}"`,
      `"${(rec.firstName || '').replace(/"/g, '""')}"`,
      `"${(rec.lastName || '').replace(/"/g, '""')}"`,
      `"${(rec.fatherName || '').replace(/"/g, '""')}"`,
      `"${(rec.email || '').replace(/"/g, '""')}"`,
      `"${(rec.mobile || '').replace(/"/g, '""')}"`,
      `"${(rec.cnic || '').replace(/"/g, '""')}"`,
      `"${(rec.address || '').replace(/"/g, '""')}"`,
      `"${rec.gender || ''}"`,
      rec.laptop ? 'Yes' : 'No',
      `"${rec.paymentPlan || 'Full'}"`,
      `"${rec.civilStatus || ''}"`,
      rec.discount || 0,
      rec.totalFee || 0,
      rec.baseFee || 30000,
      rec.laptopFee || 0,
      `"${rec.status || 'Pending'}"`,
      `"${rec.nextDueDate || ''}"`,
      `"${rec.createdAt || ''}"`
    ]);

    const csvContent = "\ufeff" + [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `STP_Enrolments_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Student ledger CSV successfully exported!', 'success');
  };

  // Trigger splash screen
  useEffect(() => {
    // Read from localStorage
    const saved = localStorage.getItem('rohi_enrolments');
    if (saved) {
      try {
        setRecords(JSON.parse(saved));
      } catch (e) {
        setRecords(INITIAL_RECORDS);
      }
    } else {
      setRecords(INITIAL_RECORDS);
      localStorage.setItem('rohi_enrolments', JSON.stringify(INITIAL_RECORDS));
    }

    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Save changes to localStorage whenever records update
  const saveRecords = (updated: EnrolmentRecord[]) => {
    setRecords(updated);
    localStorage.setItem('rohi_enrolments', JSON.stringify(updated));
  };

  // Helper to show Toast popup
  const showToast = (text: string, type: 'success' | 'err' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Employee CRUD operations
  const handleSaveEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeFormUsername.trim() || !employeeFormPassword.trim()) {
      showToast('Please fill out all employee fields', 'err');
      return;
    }

    if (editingEmployeeId) {
      setEmployees(prev => prev.map(emp => {
        if (emp.id === editingEmployeeId) {
          return {
            ...emp,
            username: employeeFormUsername.trim(),
            passwordInput: employeeFormPassword.trim(),
            role: employeeFormRole,
            course: employeeFormRole === 'Trainer' ? employeeFormCourse : undefined
          };
        }
        return emp;
      }));
      showToast('Employee account updated successfully', 'success');
      setEditingEmployeeId(null);
    } else {
      if (employees.some(emp => emp.username.toLowerCase() === employeeFormUsername.trim().toLowerCase())) {
        showToast('Username already exists in employee registry', 'err');
        return;
      }
      const newEmp: Employee = {
        id: Date.now().toString(),
        username: employeeFormUsername.trim(),
        passwordInput: employeeFormPassword.trim(),
        role: employeeFormRole,
        course: employeeFormRole === 'Trainer' ? employeeFormCourse : undefined
      };
      setEmployees(prev => [...prev, newEmp]);
      showToast('New employee registered successfully', 'success');
    }

    setEmployeeFormUsername('');
    setEmployeeFormPassword('');
    setEmployeeFormRole('Super Administrator');
    setEmployeeFormCourse('Web Design & Development');
  };

  const handleStartEditEmployee = (emp: Employee) => {
    setEditingEmployeeId(emp.id);
    setEmployeeFormUsername(emp.username);
    setEmployeeFormPassword(emp.passwordInput);
    setEmployeeFormRole(emp.role);
    if (emp.course) {
      setEmployeeFormCourse(emp.course);
    }
  };

  const handleDeleteEmployee = (id: string) => {
    if (id === '1') {
      showToast('Cannot delete the primary master Super Administrator account.', 'err');
      return;
    }
    setEmployees(prev => prev.filter(emp => emp.id !== id));
    showToast('Employee account deleted', 'info');
  };

  const handleCreateRole = (roleName: string) => {
    const trimmed = roleName.trim();
    if (!trimmed) return;
    if (availableRoles.some(r => r.toLowerCase() === trimmed.toLowerCase())) {
      showToast('Role status already exists in permission level.', 'err');
      return;
    }
    setAvailableRoles(prev => [...prev, trimmed]);
    showToast(`Role "${trimmed}" created successfully.`, 'success');
  };

  const handleDeleteRole = (roleName: string) => {
    if (['Super Administrator', 'Accountant', 'Trainer'].includes(roleName)) {
      showToast('Cannot delete standard system-defined roles.', 'err');
      return;
    }
    if (employees.some(emp => emp.role === roleName)) {
      showToast(`Cannot delete role "${roleName}" because it is currently assigned to active employees.`, 'err');
      return;
    }
    setAvailableRoles(prev => prev.filter(role => role !== roleName));
    showToast(`Role "${roleName}" has been successfully deleted from directory permissions.`, 'info');
  };

  const handleSeedSandboxData = () => {
    // 1. Courses
    const sampleCourses: Course[] = DEFAULT_COURSES;
    setCourses(sampleCourses);
    localStorage.setItem('rohi_courses', JSON.stringify(sampleCourses));

    // 2. Student Data (Generate exactly 500 high-quality, diverse, and programmatically complete records)
    const generatedRecords: EnrolmentRecord[] = [];
    const firstNames = [
      'Muhammad', 'Ali', 'Ahmed', 'Fatima', 'Aisha', 'Usman', 'Zainab', 'Bilal', 'Hamza', 'Sara',
      'Omer', 'Sana', 'Zeeshan', 'Maryam', 'Saad', 'Hina', 'Fahad', 'Raza', 'Kiran', 'Haris',
      'Amber', 'Asad', 'Sofia', 'Junaid', 'Tayyaba', 'Noman', 'Hassan', 'Farhan', 'Iqra', 'Adeel',
      'Saba', 'Ahsan', 'Aqsa', 'Faisal', 'Sidra', 'Tayyab', 'Kashif', 'Rida', 'Mehak', 'Arooj',
      'Arslan', 'Shoaib', 'Sohaib', 'Umair', 'Waqas', 'Haleema', 'Saeed', 'Zubair', 'Yasir', 'Talha'
    ];
    const lastNames = [
      'Ahmed', 'Ali', 'Khan', 'Hussain', 'Butt', 'Malik', 'Bukhari', 'Shah', 'Nawaz', 'Tariq',
      'Riaz', 'Arshad', 'Mehmood', 'Siddiqui', 'Ghafoor', 'Bashir', 'Latif', 'Jamil', 'Hassan',
      'Yasin', 'Raza', 'Gillani', 'Lodhi', 'Saeed', 'Farooq', 'Sardar', 'Dar', 'Abbasi', 'Nadeem', 'Awan'
    ];
    const cities = ['Bahawalpur', 'Multan', 'Rahim Yar Khan', 'Sadiqabad', 'Liaquatpur', 'Khanpur', 'Yazman', 'Ahmedpur East', 'Lodhran'];

    for (let i = 0; i < 500; i++) {
      const fName = firstNames[i % firstNames.length];
      const lName = lastNames[(i * 3) % lastNames.length];
      const father = firstNames[(i * 7 + 1) % firstNames.length] + ' ' + lastNames[(i * 11) % lastNames.length];
      
      const courseObj = sampleCourses[i % sampleCourses.length];
      const selectedCourseName = courseObj.name;
      
      const laptopOpt: 'Yes' | 'No' = (i % 3 === 0) ? 'Yes' : 'No';
      const civilStatusOpt = (i % 7 === 0) ? 'Military' : 'Civil';
      const milCategoryOpt = civilStatusOpt === 'Military' ? ((i % 2 === 0) ? 'Officer' : 'JCO') : '';
      
      let discountVal = 0;
      if (i % 4 === 1) discountVal = 1000;
      if (i % 4 === 2) discountVal = 2000;
      if (i % 8 === 3) discountVal = 3000;
      if (i % 12 === 0) discountVal = 5000;
      
      const calc = feeCalculator(sampleCourses, selectedCourseName, laptopOpt, civilStatusOpt, discountVal, milCategoryOpt as any);
      
      let statusOpt: 'Pending' | 'Verified' | 'Processing' | 'Enrolled' = 'Enrolled';
      if (i % 5 === 0) statusOpt = 'Verified';
      if (i % 8 === 0) statusOpt = 'Pending';
      if (i % 10 === 0) statusOpt = 'Processing';
      
      const padIndex = String(i).padStart(3, '0');
      const uniquePart = String(1000 + i);
      const cnicVal = `31202${uniquePart}49503${i % 10}`;
      
      const emailVal = `${fName.toLowerCase()}.${lName.toLowerCase()}.${padIndex}@rohilearning.edu.pk`;
      const mobileVal = `0300${padIndex}${String(7771234 + i).slice(-4)}`;
      const cityOpt = cities[i % cities.length];
      const addressVal = `${cityOpt === 'Bahawalpur' ? 'Model Town, Street ' + (i % 15 + 1) : 'Gulgasht Sector ' + (i % 10 + 1)}, ${cityOpt}`;
      
      const dobYear = 1995 + (i % 10);
      const dobMonth = String((i % 12) + 1).padStart(2, '0');
      const dobDay = String((i % 28) + 1).padStart(2, '0');
      
      const crDay = String((i % 25) + 1).padStart(2, '0');
      const crHour = String(i % 24).padStart(2, '0');
      const crMin = String(i % 60).padStart(2, '0');
      
      const femaleNames = ['Fatima', 'Aisha', 'Zainab', 'Sara', 'Sana', 'Maryam', 'Hina', 'Kiran', 'Amber', 'Sofia', 'Tayyaba', 'Iqra', 'Saba', 'Aqsa', 'Sidra', 'Rida', 'Mehak', 'Arooj', 'Haleema'];
      const isFemale = femaleNames.includes(fName);
      
      generatedRecords.push({
        regId: (147796229041800 + i).toString(),
        firstName: fName,
        lastName: lName,
        fatherName: father,
        mobile: mobileVal,
        cnic: cnicVal,
        email: emailVal,
        address: addressVal,
        gender: isFemale ? 'Female' : 'Male',
        laptop: laptopOpt,
        paymentPlan: (i % 3 === 0) ? 'Installment' : 'Full',
        civilStatus: civilStatusOpt,
        milCategory: milCategoryOpt as any,
        milRank: civilStatusOpt === 'Military' ? (milCategoryOpt === 'Officer' ? 'Major' : 'Subedar') : '',
        milUnit: civilStatusOpt === 'Military' ? `${10 + (i % 40)} Punjab Regiment` : '',
        milName: civilStatusOpt === 'Military' ? `Father ${father}` : '',
        milStation: civilStatusOpt === 'Military' ? 'Bahawalpur Cantt' : '',
        milRelation: civilStatusOpt === 'Military' ? 'Father' : '',
        discount: calc.discount,
        baseFee: calc.base,
        laptopFee: calc.laptop,
        totalFee: calc.total,
        status: statusOpt,
        nextDueDate: `2026-06-${String((i % 15) + 10).padStart(2, '0')}`,
        createdAt: `2026-05-${crDay}T${crHour}:${crMin}:00Z`,
        course: selectedCourseName,
        city: cityOpt,
        dob: `${dobYear}-${dobMonth}-${dobDay}`,
        createdByUsername: 'system_sandbox',
        createdByRole: 'Super Administrator'
      });
    }

    setRecords(generatedRecords);
    localStorage.setItem('rohi_enrolments', JSON.stringify(generatedRecords));

    // 3. Employees / Trainers
    const sampleEmployees: Employee[] = [
      { id: '1', username: 'admin', passwordInput: 'admin123', role: 'Super Administrator' },
      { id: '2', username: 'accountant', passwordInput: 'accountant123', role: 'Accountant' },
      { id: '3', username: 'trainer_web', passwordInput: 'trainer123', role: 'Trainer', course: 'Web Design & Development' },
      { id: '4', username: 'trainer_mobile', passwordInput: 'trainer123', role: 'Trainer', course: 'Mobile App Development' },
      { id: '5', username: 'trainer_cyber', passwordInput: 'trainer123', role: 'Trainer', course: 'Network & Cyber Security' },
      { id: '6', username: 'trainer_digital', passwordInput: 'trainer123', role: 'Trainer', course: 'Freelancing & Digital Marketing' }
    ];
    setEmployees(sampleEmployees);
    localStorage.setItem('rohi_employees', JSON.stringify(sampleEmployees));

    // 4. Startups In Incubator
    const sampleStartups = [
      { id: '1', name: 'Al-Khawarizmi AI Labs', founder: 'Dr. Usman Ghafoor', deskNumber: 'Desk A1', monthlyRent: 12000, joinedDate: '2026-01-10' },
      { id: '2', name: 'Zeta Byte Technologies', founder: 'Ayesha Khan', deskNumber: 'Desk B3', monthlyRent: 8500, joinedDate: '2026-03-01' },
      { id: '3', name: 'Apex Creative Agency', founder: 'Rayyan Baig', deskNumber: 'Desk C2', monthlyRent: 9000, joinedDate: '2026-04-15' },
      { id: '4', name: 'CloudWeave Solutions', founder: 'Zainab Fatima', deskNumber: 'Desk D4', monthlyRent: 15000, joinedDate: '2026-05-01' },
      { id: '5', name: 'CyberGuard Pakistan', founder: 'Major (R) Tariq Mahmood', deskNumber: 'Desk E1', monthlyRent: 11000, joinedDate: '2026-05-18' }
    ];
    localStorage.setItem('rohi_startups', JSON.stringify(sampleStartups));

    // 5. Room & Hall Bookings
    const sampleBookings = [
       {
        id: 'hb1',
        companyName: 'TechVision Solutions (Pvt.) Ltd.',
        personName: 'Kamran Malik',
        bookingFor: 'Seminar Hall',
        price: 40000,
        duration: '8 Hours (Full Day)',
        eventType: 'Corporate Seminar',
        seatingCapacity: 80,
        eventDate: '2026-05-28',
        timeSlot: '09:00 AM – 05:00 PM',
        venueRoom: 'Main Seminar Hall – A',
        createdAt: '2026-05-25T08:00:00Z'
      },
      {
        id: 'hb2',
        companyName: 'Ignite Pakistan Tech Incubator',
        personName: 'Sarah Ahmed',
        bookingFor: 'Executive Board Room',
        price: 25000,
        duration: '4 Hours (Half Day)',
        eventType: 'Startup Pitch Event',
        seatingCapacity: 25,
        eventDate: '2026-06-02',
        timeSlot: '02:00 PM – 06:00 PM',
        venueRoom: 'Board Room B',
        createdAt: '2026-05-25T09:30:00Z'
      },
      {
        id: 'hb3',
        companyName: 'Nexus Innovators Association',
        personName: 'Bilal Siddiqui',
        bookingFor: 'Lab Training Hall',
        price: 50000,
        duration: '12 Hours (Extended Full Day)',
        eventType: 'Python Bootcamp Lab Session',
        seatingCapacity: 50,
        eventDate: '2026-06-05',
        timeSlot: '08:00 AM – 08:00 PM',
        venueRoom: 'Advanced Computer Lab C',
        createdAt: '2026-05-25T11:00:00Z'
      },
      {
        id: 'hb4',
        companyName: 'Rohi Alumni Reunion',
        personName: 'Amara Bashir',
        bookingFor: 'Main Seminar Hall',
        price: 45000,
        duration: '6 Hours (Evening Session)',
        eventType: 'Interactive Alumni Networking Dinner',
        seatingCapacity: 100,
        eventDate: '2026-06-12',
        timeSlot: '04:00 PM – 10:00 PM',
        venueRoom: 'Main Seminar Hall – A',
        createdAt: '2026-05-25T14:45:00Z'
      }
    ];
    setHallBookings(sampleBookings);
    localStorage.setItem('rohi_hall_bookings', JSON.stringify(sampleBookings));

    // 6. Student Attendance Logs
    const sampleAttendanceLogs = [
      {
        id: 'seed-att-1',
        courseName: 'Web Design & Development',
        date: '2026-05-24',
        records: {
          '147796229041800': 'Present',
          '147796229041807': 'Present',
          '147796229041814': 'Absent'
        },
        createdAt: '2026-05-24T12:00:00Z'
      },
      {
        id: 'seed-att-2',
        courseName: 'Mobile App Development',
        date: '2026-05-24',
        records: {
          '147796229041801': 'Present',
          '147796229041808': 'Absent'
        },
        createdAt: '2026-05-24T12:00:00Z'
      },
      {
        id: 'seed-att-3',
        courseName: 'Network & Cyber Security',
        date: '2026-05-24',
        records: {
          '147796229041802': 'Present',
          '147796229041809': 'Leave'
        },
        createdAt: '2026-05-24T12:00:00Z'
      }
    ];
    setAttendanceLogs(sampleAttendanceLogs);
    localStorage.setItem('rohi_attendance_logs', JSON.stringify(sampleAttendanceLogs));

    // 7. Inventory Items
    const sampleInventory = [
      { id: '1', serial: 'HP-DX-821092', name: 'HP Core-i5 Pro Laptop', custodian: 'Muhammad Ahmed (Web Development)', status: 'Issued' },
      { id: '2', serial: 'EPS-PRJ-2491', name: 'Epson digital HD Projector', custodian: 'Office Hub', status: 'Available' },
      { id: '3', serial: 'TP-LNK-552', name: 'TP-Link mesh Gigabit router', custodian: 'Incubator hall', status: 'Available' },
      { id: '4', serial: 'MQ2-VR-2041', name: 'Meta Quest 2 VR Headset', custodian: 'Ali Hamza (AR/VR Lab Guest)', status: 'Issued' },
      { id: '5', serial: 'DELL-US-4820', name: 'Dell 27" UltraSharp Monitor', custodian: 'Lab Supervisor-A', status: 'Available' },
      { id: '6', serial: 'LOGI-CONF-559', name: 'Logitech MeetUp Video Camera', custodian: 'Board Room B', status: 'Available' },
      { id: '7', serial: 'MBP-M2-7712', name: 'MacBook Pro M2 Space Gray', custodian: 'Director Rohi Learning', status: 'Repairing' }
    ];
    localStorage.setItem('rohi_inventory', JSON.stringify(sampleInventory));

    // Roles
    const sampleRoles = ['Super Administrator', 'Accountant', 'Trainer', 'Admissions Officer'];
    setAvailableRoles(sampleRoles);
    localStorage.setItem('rohi_available_roles', JSON.stringify(sampleRoles));

    showToast('Sandbox testing databases successfully seeded! Reloading panels...', 'success');
    
    setTimeout(() => {
      window.location.reload();
    }, 1200);
  };

  const handleClearAllData = () => {
    localStorage.removeItem('rohi_enrolments');
    localStorage.removeItem('rohi_courses');
    localStorage.removeItem('rohi_employees');
    localStorage.removeItem('rohi_startups');
    localStorage.removeItem('rohi_hall_bookings');
    localStorage.removeItem('rohi_attendance_logs');
    localStorage.removeItem('rohi_inventory');
    localStorage.removeItem('rohi_available_roles');
    
    setRecords([]);
    setCourses([]);
    setEmployees([
      { id: '1', username: 'admin', passwordInput: 'admin123', role: 'Super Administrator' }
    ]);
    setHallBookings([]);
    setAttendanceLogs([]);
    setAvailableRoles(['Super Administrator', 'Accountant', 'Trainer']);
    
    showToast('All sandbox databases successfully cleared! Ready for pure production state.', 'info');
    setTimeout(() => {
      window.location.reload();
    }, 1200);
  };

  // Log in as any employee in our directory
  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    const cleanUser = usernameInput.trim().toLowerCase();
    const cleanPass = passwordInput.trim();

    // If they typed an email address like user@domain.com, extract the prefix/local-part
    const emailMatch = cleanUser.match(/^([^@]+)@/);
    const localPart = emailMatch ? emailMatch[1] : cleanUser;

    // Find in the dynamic employees registry using robust matching
    const matched = employees.find(emp => {
      const dbUser = emp.username.trim().toLowerCase();
      const userMatches = (dbUser === cleanUser || dbUser === localPart);
      
      // Support matching password with and without trim for absolute safety
      const passMatches = (emp.passwordInput === passwordInput || emp.passwordInput.trim() === cleanPass);
      
      return userMatches && passMatches;
    });

    // Fallback support for master password 'admin' / current passcode
    const isAdminMatch = (cleanUser === 'admin' || localPart === 'admin');
    if (!matched && isAdminMatch && (passwordInput === adminPassword || cleanPass === adminPassword.trim())) {
      const adminEmployee: Employee = {
        id: '1',
        username: 'admin',
        passwordInput: adminPassword,
        role: 'Super Administrator'
      };
      setCurrentUser(adminEmployee);
      setRole('admin');
      setActiveView('admin');
      setSidebarActiveItem('inquiry');
      setSelectedInquiryCourse(null);
      showToast('Successfully Logged in as Super Administrator', 'success');
      setAuthError('');
      setUsernameInput('');
      setPasswordInput('');
      return;
    }

    if (matched) {
      setCurrentUser(matched);
      setRole('admin');
      setActiveView('admin');
      setSidebarActiveItem('inquiry');
      
      // Auto locks trainer course filter
      if (matched.role === 'Trainer') {
        setSelectedInquiryCourse(matched.course || 'Web Design & Development');
      } else {
        setSelectedInquiryCourse(null);
      }
      
      showToast(`Successfully Logged in as ${matched.role} (${matched.username})`, 'success');
      setAuthError('');
      setUsernameInput('');
      setPasswordInput('');
    } else {
      setAuthError(`Invalid Username or Password. Note: Usernames are case-insensitive. Contact Super Administrator for credentials.`);
      showToast('Authentication failed', 'err');
    }
  };

  // Handle changing the administrator password
  const handleChangePassword = (e: FormEvent) => {
    e.preventDefault();
    if (!currentPassChange || !newPassChange || !confirmPassChange) {
      showToast('Please fill out all fields in the security console.', 'err');
      return;
    }
    if (currentPassChange !== adminPassword) {
      showToast('The current password you entered is incorrect.', 'err');
      return;
    }
    if (newPassChange.length < 5) {
      showToast('The new password must be at least 5 characters long.', 'err');
      return;
    }
    if (newPassChange !== confirmPassChange) {
      showToast('The new password and confirmation do not match.', 'err');
      return;
    }

    setAdminPassword(newPassChange);
    localStorage.setItem('rohi_admin_password', newPassChange);
    setCurrentPassChange('');
    setNewPassChange('');
    setConfirmPassChange('');
    showToast('Admin access password changed successfully!', 'success');
  };

  // Log out Admin/Staff
  const handleLogout = () => {
    setCurrentUser(null);
    setRole('student');
    setActiveView('form');
    setSidebarActiveItem('inquiry');
    setSelectedInquiryCourse(null);
    setFormStep(1);
    showToast('Successfully logged out of staff portal.', 'info');
  };

  // Auto pre-fill due dates helper
  useEffect(() => {
    if (!newNextDueDate) {
      const d = new Date();
      d.setDate(d.getDate() + 30);
      setNewNextDueDate(d.toISOString().slice(0, 10)); // YYYY-MM-DD
    }
  }, [newNextDueDate]);

  // Force Full package payment plan if student role is active
  useEffect(() => {
    if (role === 'student') {
      setNewPaymentPlan('Full');
    }
  }, [role]);

  // Find corresponding batch matching a course
  const findBatchForCourse = (courseName: string, activeBatches: Batch[]): { batchId?: string; batchName?: string } => {
    if (!activeBatches || activeBatches.length === 0) return {};
    const cleanCourse = courseName.trim().toLowerCase();
    
    // Check if any active batches specifically bundle this course
    const matches = activeBatches.filter(b => 
      (b.morningCourses && b.morningCourses.some(c => c.trim().toLowerCase() === cleanCourse)) ||
      (b.noonCourses && b.noonCourses.some(c => c.trim().toLowerCase() === cleanCourse)) ||
      (b.eveningCourses && b.eveningCourses.some(c => c.trim().toLowerCase() === cleanCourse))
    );

    if (matches.length > 0) {
      // If two or more batches are live, system prioritizes the latest matching batch
      const sortedMatches = [...matches].sort((a, b) => b.startDate.localeCompare(a.startDate));
      return {
        batchId: sortedMatches[0].id,
        batchName: sortedMatches[0].name
      };
    }

    // Default: find latest active batch to place the enrollment in
    const sortedAll = [...activeBatches].sort((a, b) => b.startDate.localeCompare(a.startDate));
    return {
      batchId: sortedAll[0].id,
      batchName: sortedAll[0].name
    };
  };

  // Safe and robust client-side CSV parser supporting quoted strings/commas
  const parseCSV = (text: string) => {
    const lines = text.split(/\r?\n/);
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
    const parsed: any[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const cols: string[] = [];
      let insideQuote = false;
      let currentCol = '';

      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        if (char === '"' || char === "'") {
          insideQuote = !insideQuote;
        } else if (char === ',' && !insideQuote) {
          cols.push(currentCol.trim());
          currentCol = '';
        } else {
          currentCol += char;
        }
      }
      cols.push(currentCol.trim());

      const rowObj: any = {};
      headers.forEach((h, index) => {
        let val = cols[index] || '';
        val = val.replace(/^["']|["']$/g, '').trim();
        rowObj[h] = val;
      });
      parsed.push(rowObj);
    }
    return parsed;
  };

  // Download a sample CSV template for staff/admins
  const handleDownloadCsvTemplate = () => {
    const headers = 'firstName,lastName,fatherName,mobile,cnic,email,address,gender,laptop,paymentPlan,civilStatus,discount,course,city,dob\n';
    const sampleRow = 'Muhammad,Ali,Ahmed,03001234567,31102-1234567-1,ali@gmail.com,Shalimar Colony,Male,No,Full,Civil,0,Web Design & Development,Multan,2001-05-12\n';
    const sampleRow2 = 'Ayesha,Khan,Sajid,03337654321,31102-7654321-2,ayesha@yahoo.com,Gulgasht Multan,Female,Yes,Installment,Military,1500,Mobile App Development,Khanewal,2002-11-20\n';

    const blob = new Blob([headers + sampleRow + sampleRow2], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'rohi_enrolments_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Download template CSV generated!', 'success');
  };

  // Handle previous records / manual records importing using CSV file uploads
  const handleCsvImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      try {
        const rawRows = parseCSV(text);
        if (rawRows.length === 0) {
          showToast('No record rows detected in the CSV file.', 'err');
          return;
        }

        const targetBatchSelect = document.getElementById('importBatchSelect') as HTMLSelectElement | null;
        const targetBatchId = targetBatchSelect ? targetBatchSelect.value : 'auto';

        const targetStatusSelect = document.getElementById('importStatusSelect') as HTMLSelectElement | null;
        const defaultStatus = targetStatusSelect ? targetStatusSelect.value : 'Enrolled';

        const importedRecords: EnrolmentRecord[] = [];

        rawRows.forEach((row, index) => {
          const firstName = row.firstName || row.name || `Imported_Student_${index + 1}`;
          const lastName = row.lastName || '';
          const fatherName = row.fatherName || 'Not Provided';
          const mobile = row.mobile || '0000000000';
          const cnic = row.cnic || '00000-0000000-0';
          const email = row.email || 'student@rohi.edu.pk';
          const address = row.address || 'Multan';
          const gender = row.gender || 'Male';
          const laptop = (row.laptop && row.laptop.toLowerCase().trim() === 'yes') ? 'Yes' : 'No';
          const paymentPlan = (row.paymentPlan && row.paymentPlan.toLowerCase().trim() === 'installment') ? 'Installment' : 'Full';
          const civilStatus = (row.civilStatus && row.civilStatus.toLowerCase().trim() === 'military') ? 'Military' : 'Civil';
          const discount = Number(row.discount) || 0;
          const course = row.course || 'Web Design & Development';
          const city = row.city || 'Multan';
          const dob = row.dob || '2000-01-01';

          // Military category matching
          const milCategory = row.milCategory || '';
          const milRank = row.milRank || '';
          const milUnit = row.milUnit || '';
          const milName = row.milName || '';
          const milStation = row.milStation || '';
          const milRelation = row.milRelation || '';

          // Recalculate candidate pricing according to guidelines
          const prices = calculateTotalFee(course, laptop, civilStatus, discount, milCategory);

          let matchId: string | undefined = undefined;
          let matchName: string | undefined = undefined;

          if (targetBatchId === 'auto') {
            const resolved = findBatchForCourse(course, batches);
            matchId = resolved.batchId;
            matchName = resolved.batchName;
          } else {
            const foundBatch = batches.find(b => b.id === targetBatchId);
            if (foundBatch) {
              matchId = foundBatch.id;
              matchName = foundBatch.name;
            }
          }

          const recordId = Math.floor(Math.random() * 900000000000000 + 100000000000000).toString();

          importedRecords.push({
            regId: recordId,
            firstName,
            lastName,
            fatherName,
            mobile,
            cnic,
            email,
            address,
            gender,
            laptop,
            paymentPlan,
            civilStatus,
            discount,
            baseFee: prices.base,
            laptopFee: prices.laptop,
            totalFee: prices.total,
            status: defaultStatus as any,
            nextDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
            createdAt: new Date().toISOString(),
            course,
            batchId: matchId,
            batchName: matchName,
            city,
            dob,
            milCategory,
            milRank,
            milUnit,
            milName,
            milStation,
            milRelation
          });
        });

        const merged = [...importedRecords, ...records];
        saveRecords(merged);
        showToast(`Successfully imported ${importedRecords.length} student records into Student Ledger!`, 'success');

        // Automate real Google Sheets background sync if appsScript configured
        if (autoSheetsSync && appsScriptUrl) {
          importedRecords.forEach(rec => syncRecordToSheets(rec));
        }
      } catch (err) {
        showToast('Failed to process. Please check CSV formatting headers.', 'err');
      }
    };

    reader.onerror = () => {
      showToast('Error reading the CSV stream.', 'err');
    };

    reader.readAsText(file);
    e.target.value = ''; // trigger onChange always
  };

  // Recalculate enrolment fee based on guidelines using centralized feeCalculator
  const calculateTotalFee = (
    courseName: string,
    laptopRequired: 'Yes' | 'No',
    civilStatus: string,
    discountAmount: number,
    milCategory?: 'Officer' | 'JCO' | ''
  ) => {
    return feeCalculator(courses, courseName, laptopRequired, civilStatus, discountAmount, milCategory);
  };

  // Dynamic fee calculation for NEW form
  const currentNewFeeLayout = useMemo(() => {
    return calculateTotalFee(newSelectedCourse, newLaptop, newCivilStatus, newDiscount, newMilCategory);
  }, [newSelectedCourse, newLaptop, newCivilStatus, newDiscount, newMilCategory, courses]);

  // Dynamic fee calculation for EDIT form
  const currentEditFeeLayout = useMemo(() => {
    return calculateTotalFee(editSelectedCourse || 'Web Design & Development', editLaptop, editCivilStatus, editDiscount, editMilCategory);
  }, [editSelectedCourse, editLaptop, editCivilStatus, editDiscount, editMilCategory, courses]);

  // Handle Form Submission (Both student-facing and admin new enrollment creation)
  const handleEnrolSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Verify fields in confirming state
    if (!newFirstName || !newLastName || !newCnic || !newMobile || !newEmail || !newAddress || !newCity || !newDob) {
      showToast('Please verify all required fields on Step 1 before submitting', 'err');
      setFormStep(1);
      return;
    }

    if (newCivilStatus === 'Military') {
      if (!newMilCategory || !newMilRank || !newMilUnit || !newMilName || !newMilStation || !newMilRelation) {
        showToast('Please verify all military details on Step 1 before submitting', 'err');
        setFormStep(1);
        return;
      }
    }

    // Generate unique 15-digit application ID
    const generatedRegId = Math.floor(Math.random() * 900000000000000 + 100000000000000).toString();

    const prices = calculateTotalFee(newSelectedCourse, newLaptop, newCivilStatus, newDiscount, newMilCategory);

    const matchedBatch = findBatchForCourse(newSelectedCourse, batches);

    const newRecord: EnrolmentRecord = {
      regId: generatedRegId,
      firstName: newFirstName.trim(),
      lastName: newLastName.trim(),
      fatherName: newFatherName.trim() || 'Not Provided',
      mobile: newMobile.trim(),
      cnic: newCnic.trim(),
      email: newEmail.trim(),
      address: newAddress.trim(),
      gender: newGender,
      laptop: newLaptop,
      paymentPlan: role === 'admin' ? newPaymentPlan : 'Full',
      civilStatus: newCivilStatus,
      discount: role === 'admin' ? newDiscount : 0,
      baseFee: prices.base,
      laptopFee: prices.laptop,
      totalFee: role === 'admin' ? prices.total : prices.total, // Student fee dynamically calculated
      status: role === 'admin' ? newStatus : 'Pending',
      nextDueDate: newNextDueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      createdAt: new Date().toISOString(),
      course: newSelectedCourse,
      batchId: matchedBatch.batchId,
      batchName: matchedBatch.batchName,
      city: newCity.trim(),
      dob: newDob,
      milCategory: newCivilStatus === 'Military' ? newMilCategory : '',
      milRank: newCivilStatus === 'Military' ? newMilRank.trim() : '',
      milUnit: newCivilStatus === 'Military' ? newMilUnit.trim() : '',
      milName: newCivilStatus === 'Military' ? newMilName.trim() : '',
      milStation: newCivilStatus === 'Military' ? newMilStation.trim() : '',
      milRelation: newCivilStatus === 'Military' ? newMilRelation.trim() : '',
      createdByUsername: currentUser?.username || 'self',
      createdByRole: currentUser?.role || 'student'
    };

    const updated = [newRecord, ...records];
    saveRecords(updated);

    // If Google Sheets auto-sync is enabled, push the new registration in background
    if (autoSheetsSync && appsScriptUrl) {
      syncRecordToSheets(newRecord);
    }

    // Save as currently processed
    setSubmittedRecord(newRecord);
    setVoucherRecord(newRecord);

    // Clear form
    setNewFirstName('');
    setNewLastName('');
    setNewFatherName('');
    setNewMobile('');
    setNewCnic('');
    setNewEmail('');
    setNewAddress('');
    setNewGender('Male');
    setNewLaptop('No');
    setNewPaymentPlan('Full');
    setNewCivilStatus('Civil');
    setNewDiscount(0);
    setNewStatus('Pending');
    setNewCity('');
    setNewDob('');
    setNewMilCategory('');
    setNewMilRank('');
    setNewMilUnit('');
    setNewMilName('');
    setNewMilStation('');
    setNewMilRelation('');

    setActiveView('success');
    showToast('Enrolment recorded successfully & Voucher Generated!', 'success');
  };

  // Navigate forward in multi-step student-facing / staff form
  const validateAndNextStep = (target: number) => {
    if (target === 2) {
      if (!newFirstName || !newLastName || !newFatherName || !newMobile || !newCnic || !newEmail || !newAddress || !newCity || !newDob) {
        showToast('Please fill out all personal details on Step 1', 'err');
        return;
      }
      if (newCivilStatus === 'Military') {
        if (!newMilCategory || !newMilRank || !newMilUnit || !newMilName || !newMilStation || !newMilRelation) {
          showToast('Please fill out all military service details on Step 1', 'err');
          return;
        }
      }
      // Simple phone/cnic structure advice
      if (newCnic.length < 10) {
        showToast('Please check CNIC number length', 'info');
      }
    }
    setFormStep(target);
  };

  // Verify Record Status from table directly
  const handleVerifyStatus = (regId: string) => {
    let affectedRecord: EnrolmentRecord | null = null;
    const updated = records.map(r => {
      if (r.regId === regId) {
        affectedRecord = { ...r, status: 'Verified' as const };
        return affectedRecord;
      }
      return r;
    });
    saveRecords(updated);
    showToast(`Application ${regId} successfully verified!`, 'success');

    // Sync updated status to Google Sheets
    if (autoSheetsSync && appsScriptUrl && affectedRecord) {
      syncRecordToSheets(affectedRecord);
    }
  };

  // Delete Record from list of enrollments
  const handleDeleteRecord = (regId: string) => {
    const updated = records.filter(r => r.regId !== regId);
    saveRecords(updated);
    setConfirmDeleteId(null);
    showToast(`Enrolment record ${regId} successfully deleted.`, 'success');
  };

  // Convert an inquiry student profile into verified active enrolment
  const handleApproveInquiry = (regId: string) => {
    let affectedRecord: EnrolmentRecord | undefined;
    const updated = records.map(r => {
      if (r.regId === regId) {
        affectedRecord = { ...r, status: 'Enrolled' as const };
        return affectedRecord;
      }
      return r;
    });

    saveRecords(updated);
    showToast(`Inquiry application ${regId} successfully verified & enrolled!`, 'success');

    // Sync state changes to Google Spreadsheet
    if (autoSheetsSync && appsScriptUrl && affectedRecord) {
      syncRecordToSheets(affectedRecord);
    }
  };

  // Create a new customized course program 
  const handleAddCourse = (e: FormEvent) => {
    e.preventDefault();
    const nameClean = courseFormName.trim();
    if (!nameClean) {
      showToast('Course Name/Title is required.', 'err');
      return;
    }
    if (courseFormMinFee > courseFormBaseFee) {
      showToast('Minimum discount floor cannot exceed Course Base Fee!', 'err');
      return;
    }
    if (courses.some(c => c.name.toLowerCase() === nameClean.toLowerCase())) {
      showToast('A course with this name already exists in config registry.', 'err');
      return;
    }

    const newCourse: Course = {
      id: Date.now().toString(),
      name: nameClean,
      category: courseFormCategory,
      baseFee: Number(courseFormBaseFee) || 0,
      minFee: Number(courseFormMinFee) || 0,
      milOfficerBaseFee: Number(courseFormMilOfficerBaseFee) || 0,
      milOfficerMinFee: Number(courseFormMilOfficerMinFee) || 0,
      milJcoBaseFee: Number(courseFormMilJcoBaseFee) || 0,
      milJcoMinFee: Number(courseFormMilJcoMinFee) || 0,
      instructorName: courseFormInstructor.trim() || undefined,
    };

    const updatedCourses = [...courses, newCourse];
    setCourses(updatedCourses);

    // Clear builder states
    setCourseFormName('');
    setCourseFormBaseFee(30000);
    setCourseFormMinFee(20000);
    setCourseFormMilOfficerBaseFee(27000);
    setCourseFormMilOfficerMinFee(18000);
    setCourseFormMilJcoBaseFee(24000);
    setCourseFormMilJcoMinFee(15000);
    setCourseFormInstructor('');

    showToast(`Successfully registered new course program: ${newCourse.name}`, 'success');
  };

  // Start editing a course program (including default system courses)
  const handleStartEditCourse = (c: Course) => {
    setEditingCourseId(c.id);
    setCourseFormName(c.name);
    setCourseFormCategory(c.category);
    setCourseFormBaseFee(c.baseFee);
    setCourseFormMinFee(c.minFee);
    setCourseFormMilOfficerBaseFee(c.milOfficerBaseFee ?? c.baseFee);
    setCourseFormMilOfficerMinFee(c.milOfficerMinFee ?? c.minFee);
    setCourseFormMilJcoBaseFee(c.milJcoBaseFee ?? c.baseFee);
    setCourseFormMilJcoMinFee(c.milJcoMinFee ?? c.minFee);
    setCourseFormInstructor(c.instructorName ?? '');
  };

  // Cancel any active course configuration editing
  const handleCancelEditCourse = () => {
    setEditingCourseId(null);
    setCourseFormName('');
    setCourseFormCategory('Technical');
    setCourseFormBaseFee(30000);
    setCourseFormMinFee(20000);
    setCourseFormMilOfficerBaseFee(27000);
    setCourseFormMilOfficerMinFee(18000);
    setCourseFormMilJcoBaseFee(24000);
    setCourseFormMilJcoMinFee(15000);
    setCourseFormInstructor('');
  };

  // Save changes to edited course program parameters
  const handleUpdateCourse = (e: FormEvent) => {
    e.preventDefault();
    const nameClean = courseFormName.trim();
    if (!nameClean) {
      showToast('Course Name/Title is required.', 'err');
      return;
    }
    if (courseFormMinFee > courseFormBaseFee) {
      showToast('Minimum discount floor cannot exceed Course Base Fee!', 'err');
      return;
    }
    // De-duplicate against names of other courses
    if (courses.some(c => c.id !== editingCourseId && c.name.toLowerCase() === nameClean.toLowerCase())) {
      showToast('A course with this name already exists in configuration registry.', 'err');
      return;
    }

    const updatedCourses = courses.map(c => {
      if (c.id === editingCourseId) {
        return {
          ...c,
          name: nameClean,
          category: courseFormCategory,
          baseFee: Number(courseFormBaseFee) || 0,
          minFee: Number(courseFormMinFee) || 0,
          milOfficerBaseFee: Number(courseFormMilOfficerBaseFee) || 0,
          milOfficerMinFee: Number(courseFormMilOfficerMinFee) || 0,
          milJcoBaseFee: Number(courseFormMilJcoBaseFee) || 0,
          milJcoMinFee: Number(courseFormMilJcoMinFee) || 0,
          instructorName: courseFormInstructor.trim() || undefined,
        };
      }
      return c;
    });

    setCourses(updatedCourses);
    handleCancelEditCourse();
    showToast(`Successfully updated course program setup: ${nameClean}`, 'success');
  };

  // Open Edit Dialog
  const handleOpenEdit = (r: EnrolmentRecord) => {
    setEditingRecordId(r.regId);
    setEditFirstName(r.firstName);
    setEditLastName(r.lastName);
    setEditFatherName(r.fatherName);
    setEditMobile(r.mobile);
    setEditCnic(r.cnic);
    setEditEmail(r.email);
    setEditAddress(r.address);
    setEditGender(r.gender);
    setEditLaptop(r.laptop);
    setEditCivilStatus(r.civilStatus);
    setEditDiscount(r.discount);
    setEditPaymentPlan(r.paymentPlan);
    setEditStatus(r.status);
    setEditNextDueDate(r.nextDueDate);
    setEditSelectedCourse(r.course || 'Web Design & Development');
    
    // Set extra fields with safe fallbacks
    setEditCity(r.city || '');
    setEditDob(r.dob || '');
    setEditMilCategory(r.milCategory || '');
    setEditMilRank(r.milRank || '');
    setEditMilUnit(r.milUnit || '');
    setEditMilName(r.milName || '');
    setEditMilStation(r.milStation || '');
    setEditMilRelation(r.milRelation || '');

    setIsEditModalOpen(true);
  };

  // Save changes from Edit Modal
  const handleSaveEdit = (andPrint: boolean) => {
    if (!editingRecordId) return;

    if (!editFirstName.trim() || !editLastName.trim() || !editCnic.trim()) {
      showToast('Student Name, Last Name and CNIC are required.', 'err');
      return;
    }

    const prices = calculateTotalFee(editSelectedCourse || 'Web Design & Development', editLaptop, editCivilStatus, editDiscount, editMilCategory);

    const updatedRecords = records.map(r => {
      if (r.regId === editingRecordId) {
        const activeCourse = editSelectedCourse || r.course || 'Web Design & Development';
        const matchedBatch = findBatchForCourse(activeCourse, batches);
        return {
          ...r,
          firstName: editFirstName.trim(),
          lastName: editLastName.trim(),
          fatherName: editFatherName.trim(),
          mobile: editMobile.trim(),
          cnic: editCnic.trim(),
          email: editEmail.trim(),
          address: editAddress.trim(),
          gender: editGender,
          laptop: editLaptop,
          civilStatus: editCivilStatus,
          discount: editDiscount,
          paymentPlan: editPaymentPlan,
          status: (andPrint && editStatus === 'Pending') ? 'Processing' as const : editStatus,
          nextDueDate: editNextDueDate,
          baseFee: prices.base,
          laptopFee: prices.laptop,
          totalFee: prices.total,
          course: activeCourse,
          batchId: matchedBatch.batchId ?? r.batchId,
          batchName: matchedBatch.batchName ?? r.batchName,
          city: editCity.trim(),
          dob: editDob,
          milCategory: editCivilStatus === 'Military' ? editMilCategory : '',
          milRank: editCivilStatus === 'Military' ? editMilRank.trim() : '',
          milUnit: editCivilStatus === 'Military' ? editMilUnit.trim() : '',
          milName: editCivilStatus === 'Military' ? editMilName.trim() : '',
          milStation: editCivilStatus === 'Military' ? editMilStation.trim() : '',
          milRelation: editCivilStatus === 'Military' ? editMilRelation.trim() : ''
        };
      }
      return r;
    });

    saveRecords(updatedRecords);

    // Filter out our current edited record
    const updatedRecord = updatedRecords.find(r => r.regId === editingRecordId);
    if (updatedRecord) {
      setVoucherRecord(updatedRecord);
    }

    // Sync edited record to Sheets
    if (autoSheetsSync && appsScriptUrl && updatedRecord) {
      syncRecordToSheets(updatedRecord);
    }

    setIsEditModalOpen(false);
    setEditingRecordId(null);
    showToast('Enrolment records changed successfully.', 'success');

    if (andPrint && updatedRecord) {
      setInvoiceBooking(null);
      setTimeout(() => {
        window.print();
      }, 500);
    }
  };

  // Move pending record to processing when printed
  const handleMovePendingToProcessing = (record: EnrolmentRecord) => {
    if (record && record.status === 'Pending') {
      const updatedRecords = records.map(r => {
        if (r.regId === record.regId) {
          const updatedRec = { ...r, status: 'Processing' as const };
          if (voucherRecord && voucherRecord.regId === record.regId) {
            setVoucherRecord(updatedRec);
          }
          if (submittedRecord && submittedRecord.regId === record.regId) {
            setSubmittedRecord(updatedRec);
          }
          return updatedRec;
        }
        return r;
      });
      saveRecords(updatedRecords);
      showToast(`Inquiry #${record.regId} moved to Processing desk.`, 'success');
      
      const syncRec = updatedRecords.find(r => r.regId === record.regId);
      if (syncRec && autoSheetsSync && appsScriptUrl) {
        syncRecordToSheets(syncRec);
      }
    }
  };

  // Trigger quick voucher printing from the grid/table
  const handlePrintVoucherDirect = (r: EnrolmentRecord) => {
    setVoucherRecord(r);
    handleMovePendingToProcessing(r);
    setInvoiceBooking(null);
    showToast('Preparing slip print interface...', 'info');
    setTimeout(() => {
      window.print();
    }, 400);
  };

  // Filter records based on search bar
  const filteredRecords = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return records;
    return records.filter(r =>
      r.regId.includes(q) ||
      `${r.firstName} ${r.lastName}`.toLowerCase().includes(q) ||
      r.cnic.includes(q) ||
      (r.fatherName && r.fatherName.toLowerCase().includes(q))
    );
  }, [records, searchQuery]);

  // Statistics calculation
  const stats = useMemo(() => {
    return {
      total: records.length,
      pending: records.filter(r => r.status === 'Pending' || r.status === 'Processing').length,
      verified: records.filter(r => r.status === 'Verified' || r.status === 'Enrolled').length,
      installment: records.filter(r => r.paymentPlan === 'Installment').length
    };
  }, [records]);

  // Handle printing action
  const triggerPrintService = (record?: EnrolmentRecord) => {
    const r = record || voucherRecord;
    if (r) {
      handleMovePendingToProcessing(r);
    }
    setInvoiceBooking(null);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  // Auto layout spacing heights calculator for pristine voucher representation
  const emptyRowCounts = useMemo(() => {
    if (!voucherRecord) return 8;
    // For installments, we have more rows in tables, so we render fewer blank lines to ensure A4 compatibility
    return voucherRecord.paymentPlan === 'Installment' ? 6 : 9;
  }, [voucherRecord]);

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* ── SPARKLY LOADER OVERLAY ── */}
      {loading && (
        <div id="loader" className="transition-all duration-500 ease-in-out">
          <img
            src="https://raw.githubusercontent.com/artbyartist98-co/stp-assets/main/logo.png"
            className="bounce w-32 h-32 object-contain"
            alt="Rohi Logo"
            referrerPolicy="no-referrer"
          />
          <h6 className="mt-6 text-xl font-bold tracking-wider text-[#004173] text-uppercase">
            STP Bahawalpur
          </h6>
          <p className="text-gray-400 text-xs mt-1 font-medium select-none">
            Rohi eSkills Learning Hub
          </p>
        </div>
      )}

      {/* ── TOAST NOTIFICATION ── */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 animate-bounce cursor-pointer shadow-xl rounded-md overflow-hidden no-print">
          <div
            className={`flex items-center gap-3 px-5 py-3 ${
              toastMessage.type === 'success'
                ? 'bg-emerald-600 text-white'
                : toastMessage.type === 'err'
                ? 'bg-red-600 text-white'
                : 'bg-blue-600 text-white'
            }`}
          >
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-xs font-semibold">{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* ── DECORATIVE PORTAL NAVIGATION (NO PRINT) ── */}
      <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-40 no-print">
        <div className="max-w-none px-4 sm:px-6 lg:px-8 xl:px-12 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="https://rohieskillslearninghub.com/" className="flex items-center gap-2">
              <img
                src="https://raw.githubusercontent.com/artbyartist98-co/stp-assets/main/logo.png"
                alt="Hub Logo"
                className="h-11 w-11 object-contain"
                referrerPolicy="no-referrer"
              />
              <div className="hidden sm:block">
                <span className="block text-sm font-bold text-gray-900 tracking-tight leading-none">
                  Rohi eSkills Hub
                </span>
                <span className="text-[10px] text-gray-500 font-semibold tracking-wider">
                  STP BAHAWALPUR
                </span>
              </div>
            </a>
          </div>

          <div className="flex items-center gap-3">
            {role === 'admin' ? (
              <>
                <button
                  onClick={() => {
                    setActiveView('admin');
                  }}
                  className={`text-xs px-4 py-2 rounded-md font-semibold transition ${
                    activeView === 'admin'
                      ? 'bg-[#004173] text-white'
                      : 'border border-[#004173] text-[#004173] hover:bg-gray-50'
                  }`}
                >
                  Admin Panel
                </button>
                <button
                  onClick={() => {
                    setFormStep(1);
                    setActiveView('form');
                  }}
                  className={`text-xs px-4 py-2 rounded-md font-semibold transition ${
                    activeView === 'form'
                      ? 'bg-[#004173] text-white'
                      : 'border border-[#004173] text-[#004173] hover:bg-gray-50'
                  }`}
                >
                  Direct Entry
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-50 text-red-600 hover:bg-red-100 text-xs px-3 py-2 rounded-md font-semibold flex items-center gap-1 transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setFormStep(1);
                    setActiveView('form');
                  }}
                  className="bg-[#004173] hover:bg-[#2491bf] text-white text-xs px-5 py-2 rounded-md font-semibold transition"
                >
                  Enroll Now
                </button>
                <button
                  onClick={() => setActiveView('login')}
                  className="border border-[#004173] text-[#004173] hover:bg-gray-50 text-xs px-4 py-2 rounded-md font-semibold flex items-center gap-1.5 transition"
                >
                  <Lock className="w-3 h-3" />
                  <span>LMS Login</span>
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── CORE SPA SCENE GRAPH (NO PRINT) ── */}
      <main className="max-w-none px-4 sm:px-6 lg:px-8 xl:px-12 py-8 flex-grow w-full no-print">
        {/* VIEW 1: STUDENT / STAFF ENROLMENT FORM */}
        {activeView === 'form' && (
          <div className="enrollment-container">
            <div className="form-header">
              <h3 className="text-xl font-bold tracking-tight">Executive Program Enrollment</h3>
              <p className="text-xs tracking-wider opacity-90 mt-1">
                {newSelectedCourse} Program · STP Bahawalpur
              </p>
            </div>

            {/* Step indicators */}
            <div className="progress-steps bg-gray-50">
              <div
                onClick={() => formStep > 1 && setFormStep(1)}
                className={`step cursor-pointer ${formStep >= 1 ? 'active' : ''}`}
                id="s1"
              >
                <div className="step-number text-xs">1</div>
                <span className="step-label">PERSONAL PROFILE</span>
              </div>
              <div
                onClick={() => {
                  if (newFirstName && newLastName && newCnic && newMobile) {
                    setFormStep(2);
                  }
                }}
                className={`step cursor-pointer ${formStep >= 2 ? 'active' : ''}`}
                id="s2"
              >
                <div className="step-number text-xs">2</div>
                <span className="step-label">COURSE DETAILS</span>
              </div>
              <div
                onClick={() => {
                  if (newFirstName && newLastName && newCnic && newMobile) {
                    setFormStep(3);
                  }
                }}
                className={`step cursor-pointer ${formStep >= 3 ? 'active' : ''}`}
                id="s3"
              >
                <div className="step-number text-xs">3</div>
                <span className="step-label">CONFIRMATION</span>
              </div>
            </div>

            <div className="form-inner">
              <form onSubmit={handleEnrolSubmit}>
                {/* STEP 1: Personal Profile Info */}
                {formStep === 1 && (
                  <div className="space-y-6">
                    <div className="card-box bg-white">
                      <div className="card-title text-[#004173] font-bold border-b border-gray-100 pb-2 mb-4">
                        Applicant Personal Information
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            First Name <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={newFirstName}
                            onChange={(e) => setNewFirstName(e.target.value)}
                            className="form-control w-full p-2.5 border border-gray-200 rounded-md focus:outline-none focus:border-sky-500 text-xs"
                            placeholder="Enter first name"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Last Name <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={newLastName}
                            onChange={(e) => setNewLastName(e.target.value)}
                            className="form-control w-full p-2.5 border border-gray-200 rounded-md focus:outline-none focus:border-sky-500 text-xs"
                            placeholder="Enter last name"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Father's Name <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={newFatherName}
                            onChange={(e) => setNewFatherName(e.target.value)}
                            className="form-control w-full p-2.5 border border-gray-200 rounded-md focus:outline-none focus:border-sky-500 text-xs"
                            placeholder="Enter Father's name"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Phone Number <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="tel"
                            value={newMobile}
                            onChange={(e) => setNewMobile(e.target.value)}
                            className="form-control w-full p-2.5 border border-gray-200 rounded-md focus:outline-none focus:border-sky-500 text-xs"
                            placeholder="e.g. 03001234567"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            CNIC Number <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={newCnic}
                            onChange={(e) => setNewCnic(e.target.value)}
                            className="form-control w-full p-2.5 border border-gray-200 rounded-md focus:outline-none focus:border-sky-500 text-xs"
                            placeholder="13-digit CNIC e.g. 3520244005827"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Email Address <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            className="form-control w-full p-2.5 border border-gray-200 rounded-md focus:outline-none focus:border-sky-500 text-xs"
                            placeholder="e.g. name@example.com"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            City <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={newCity}
                            onChange={(e) => setNewCity(e.target.value)}
                            className="form-control w-full p-2.5 border border-gray-200 rounded-md focus:outline-none focus:border-sky-500 text-xs"
                            placeholder="e.g. Bahawalpur"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Date Of Birth <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="date"
                            value={newDob}
                            onChange={(e) => setNewDob(e.target.value)}
                            className="form-control w-full p-2.5 border border-gray-200 rounded-md focus:outline-none focus:border-sky-500 text-xs text-gray-700"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Gender <span className="text-rose-500">*</span>
                          </label>
                          <select
                            value={newGender}
                            onChange={(e) => setNewGender(e.target.value)}
                            className="form-control w-full p-2.5 border border-gray-200 rounded-md focus:outline-none focus:border-sky-500 text-xs bg-white text-gray-700 font-semibold cursor-pointer"
                            required
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Rather not say">Rather not say</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Civil Military Status <span className="text-rose-500">*</span>
                          </label>
                          <select
                            value={newCivilStatus}
                            onChange={(e) => {
                              setNewCivilStatus(e.target.value);
                              if (e.target.value === 'Military' && !newMilCategory) {
                                setNewMilCategory('Officer');
                              }
                            }}
                            className="form-control w-full p-2.5 border border-gray-200 rounded-md focus:outline-none focus:border-sky-500 text-xs bg-white text-gray-700 font-semibold cursor-pointer"
                            required
                          >
                            <option value="Civil">Civil</option>
                            <option value="Military">Military</option>
                          </select>
                        </div>

                        {newCivilStatus === 'Military' && (
                          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                            <div className="md:col-span-2 text-xs font-bold text-[#004173] mb-1">
                              🪖 Military Service Personnel Verification Details
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">
                                Military Category <span className="text-rose-500">*</span>
                              </label>
                              <select
                                value={newMilCategory}
                                onChange={(e) => setNewMilCategory(e.target.value as any)}
                                className="form-control w-full p-2.5 border border-gray-200 rounded-md focus:outline-none focus:border-sky-500 text-xs bg-white text-gray-700 font-semibold cursor-pointer"
                                required
                              >
                                <option value="Officer">Officer</option>
                                <option value="JCO">JCO</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">
                                Rank <span className="text-rose-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={newMilRank}
                                onChange={(e) => setNewMilRank(e.target.value)}
                                className="form-control w-full p-2.5 border border-gray-200 rounded-md focus:outline-none focus:border-sky-500 text-xs bg-white"
                                placeholder="e.g. Captain / Subedar"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">
                                Unit <span className="text-rose-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={newMilUnit}
                                onChange={(e) => setNewMilUnit(e.target.value)}
                                className="form-control w-full p-2.5 border border-gray-200 rounded-md focus:outline-none focus:border-sky-500 text-xs bg-white"
                                placeholder="e.g. 15 FF Regiment"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">
                                Name of Service Member <span className="text-rose-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={newMilName}
                                onChange={(e) => setNewMilName(e.target.value)}
                                className="form-control w-full p-2.5 border border-gray-200 rounded-md focus:outline-none focus:border-sky-500 text-xs bg-white"
                                placeholder="Name of officer/JCO"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">
                                Station <span className="text-rose-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={newMilStation}
                                onChange={(e) => setNewMilStation(e.target.value)}
                                className="form-control w-full p-2.5 border border-gray-200 rounded-md focus:outline-none focus:border-sky-500 text-xs bg-white"
                                placeholder="e.g. Bahawalpur Cantt"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-700 mb-1">
                                Relation <span className="text-rose-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={newMilRelation}
                                onChange={(e) => setNewMilRelation(e.target.value)}
                                className="form-control w-full p-2.5 border border-gray-200 rounded-md focus:outline-none focus:border-sky-500 text-xs bg-white"
                                placeholder="e.g. Father / Son / Self"
                                required
                              />
                            </div>
                          </div>
                        )}

                        <div className="md:col-span-2">
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Residential Address <span className="text-rose-500">*</span>
                          </label>
                          <textarea
                            value={newAddress}
                            onChange={(e) => setNewAddress(e.target.value)}
                            className="form-control w-full p-2.5 border border-gray-200 rounded-md focus:outline-none focus:border-sky-500 text-xs"
                            rows={3}
                            placeholder="Complete residential address details"
                            required
                          ></textarea>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => validateAndNextStep(2)}
                        className="bg-[#004173] hover:bg-[#2491bf] text-white px-8 py-2.5 rounded-md font-semibold text-xs flex items-center gap-1 transition"
                      >
                        <span>Next Step</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: Program and Option parameters */}
                {formStep === 2 && (
                  <div className="space-y-6">
                    <div className="card-box bg-white">
                      <div className="card-title text-[#004173] font-bold border-b border-gray-100 pb-2 mb-4">
                        Program and Billing Options
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="md:col-span-2">
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Selected Course Program
                          </label>
                          <select
                            value={newSelectedCourse}
                            onChange={(e) => {
                              setNewSelectedCourse(e.target.value);
                              setNewDiscount(0); // reset discount overrides
                            }}
                            className="form-select w-full p-2.5 border border-gray-200 rounded-md text-xs font-semibold cursor-pointer"
                          >
                            {courses.map(c => (
                              <option key={c.id} value={c.name}>
                                {c.name} ({c.category}){currentUser ? ` · Base: ${c.baseFee.toLocaleString()} PKR (Floor: ${c.minFee.toLocaleString()} PKR)` : ''}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Gender
                          </label>
                          <select
                            value={newGender}
                            onChange={(e) => setNewGender(e.target.value)}
                            className="form-select w-full p-2.5 border border-gray-200 rounded-md text-xs"
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Laptop Required?
                          </label>
                          <select
                            value={newLaptop}
                            onChange={(e) => setNewLaptop(e.target.value as 'Yes' | 'No')}
                            className="form-select w-full p-2.5 border border-gray-200 rounded-md text-xs"
                          >
                            <option value="No">No</option>
                            <option value="Yes">Yes (+3,000 PKR)</option>
                          </select>
                        </div>

                        {/* Admin space values toggle */}
                        {role === 'admin' ? (
                          <div className="md:col-span-2 border-t border-dashed border-red-200 pt-4 mt-2">
                            <div className="bg-red-50/50 p-4 rounded-xl border border-rose-100">
                              <h5 className="text-red-800 text-xs font-bold uppercase tracking-wider mb-3">
                                Staff Administrative Overrides
                              </h5>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <label className="block text-[11px] font-bold text-gray-600 mb-1">
                                    Civil/Military Status
                                  </label>
                                  <select
                                    value={newCivilStatus === 'Military' ? (newMilCategory === 'Officer' ? 'Military (Officer Rank)' : 'Military (Lower Rank)') : 'Civil'}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      if (val === 'Civil') {
                                        setNewCivilStatus('Civil');
                                        setNewMilCategory('');
                                      } else if (val === 'Military (Officer Rank)') {
                                        setNewCivilStatus('Military');
                                        setNewMilCategory('Officer');
                                      } else if (val === 'Military (Lower Rank)') {
                                        setNewCivilStatus('Military');
                                        setNewMilCategory('JCO');
                                      }
                                    }}
                                    className="form-select w-full p-2 border border-gray-200 rounded text-xs bg-white cursor-pointer"
                                  >
                                    <option value="Civil">Civil</option>
                                    <option value="Military (Officer Rank)">
                                      Military (Officer Rank)
                                    </option>
                                    <option value="Military (Lower Rank)">
                                      Military (Lower Rank)
                                    </option>
                                  </select>
                                </div>

                                <div>
                                  <label className="block text-[11px] font-bold text-gray-600 mb-1">
                                    Direct Discount (PKR)
                                  </label>
                                  <input
                                    type="number"
                                    min="0"
                                    value={newDiscount}
                                    onChange={(e) => setNewDiscount(Number(e.target.value) || 0)}
                                    className="form-control w-full p-2 border border-gray-200 rounded text-xs bg-white"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[11px] font-bold text-gray-600 mb-1">
                                    Registration Status
                                  </label>
                                  <select
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value as 'Pending' | 'Verified')}
                                    className="form-select w-full p-2 border border-gray-200 rounded text-xs bg-white"
                                  >
                                    <option value="Pending">Pending</option>
                                    <option value="Verified">Verified</option>
                                  </select>
                                </div>
                              </div>

                              <div className="mt-3 flex items-center justify-between text-xs bg-white p-2.5 rounded border border-rose-100 font-semibold">
                                <span className="text-gray-600">Calculated Course Fee:</span>
                                <span className="text-[#004173] text-sm">
                                  {currentNewFeeLayout.total.toLocaleString()} PKR
                                </span>
                              </div>
                            </div>
                          </div>
                        ) : null}

                        {/* Payment Plan selector (Only visible to admin) */}
                        {role === 'admin' && (
                          <div className="md:col-span-2">
                            <label className="block text-xs font-semibold text-gray-700 mb-2">
                              Select Payment Schedule
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div
                                onClick={() => setNewPaymentPlan('Full')}
                                className={`plan-card ${newPaymentPlan === 'Full' ? 'selected' : ''}`}
                              >
                                <input
                                  type="radio"
                                  checked={newPaymentPlan === 'Full'}
                                  onChange={() => setNewPaymentPlan('Full')}
                                  className="mr-2"
                                />
                                <div>
                                  <span className="plan-label block">Full Package Payment</span>
                                  <span className="plan-desc block">
                                    Pay whole amount in single billing — {currentNewFeeLayout.total.toLocaleString()} PKR
                                  </span>
                                </div>
                              </div>

                              <div
                                onClick={() => {
                                  if (role === 'admin') {
                                    setNewPaymentPlan('Installment');
                                  } else {
                                    showToast('🔒 Installment plans are only available via Admin Desk registration.', 'info');
                                  }
                                }}
                                className={`plan-card ${newPaymentPlan === 'Installment' ? 'selected' : ''} ${
                                  role !== 'admin' ? 'opacity-60 cursor-not-allowed bg-gray-50/50 hover:bg-gray-50/55' : ''
                                }`}
                              >
                                <input
                                  type="radio"
                                  checked={newPaymentPlan === 'Installment'}
                                  disabled={role !== 'admin'}
                                  onChange={() => {
                                    if (role === 'admin') {
                                      setNewPaymentPlan('Installment');
                                    }
                                  }}
                                  className={`mr-2 ${role !== 'admin' ? 'cursor-not-allowed' : ''}`}
                                />
                                <div>
                                  <span className="plan-label block flex items-center gap-1.5">
                                    <span>Split 2 Installments</span>
                                    {role !== 'admin' && (
                                      <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                        🔒 Admin Only
                                      </span>
                                    )}
                                  </span>
                                  <span className="plan-desc block">
                                    {role === 'admin' 
                                      ? `1st: ${currentNewFeeLayout.firstInstallment.toLocaleString()} PKR now · 2nd: ${currentNewFeeLayout.secondInstallment.toLocaleString()} PKR due later`
                                      : 'Please contact STP administration to apply for instalment verification.'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Due Date Option for installment plan */}
                        {newPaymentPlan === 'Installment' && (
                          <div className="md:col-span-2">
                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                              2nd Installment Due Date
                            </label>
                            <input
                              type="date"
                              value={newNextDueDate}
                              onChange={(e) => setNewNextDueDate(e.target.value)}
                              className="form-control w-full sm:w-60 p-2.5 border border-sky-200 rounded-md focus:outline-none text-xs"
                            />
                            <p className="text-[10px] text-gray-400 mt-1">
                              This deadline date is printed on the dual voucher copies for the student's next installment deadline.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between pt-2">
                      <button
                        type="button"
                        onClick={() => setFormStep(1)}
                        className="border border-[#004173] text-[#004173] hover:bg-gray-50 px-6 py-2.5 rounded-md font-semibold text-xs flex items-center gap-1 transition"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => validateAndNextStep(3)}
                        className="bg-[#004173] hover:bg-[#2491bf] text-white px-8 py-2.5 rounded-md font-semibold text-xs flex items-center gap-1 transition"
                      >
                        <span>Confirm Enrollment</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: Read review summary info before submitting */}
                {formStep === 3 && (
                  <div className="space-y-6 animate-fade-in-quick">
                    <div className="card-box bg-white text-center py-8">
                      <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                      <h4 className="text-lg font-bold text-gray-900">Are you ready to submit details?</h4>
                      <p className="text-gray-500 text-xs mt-1 max-w-lg mx-auto">
                        Please review the details of your application below. Clicking submit initiates registration and generates your course voucher.
                      </p>

                      <div className="text-left mt-8 max-w-xl mx-auto p-4 rounded-xl bg-sky-50/50 border border-sky-100/80 text-xs space-y-2.5">
                        <div className="flex justify-between border-b border-sky-100/50 pb-2">
                          <span className="font-semibold text-gray-500">Student Profile:</span>
                          <span className="font-bold text-gray-800">
                            {newFirstName} {newLastName}
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-sky-100/50 pb-2">
                          <span className="font-semibold text-gray-500">Father's Name:</span>
                          <span className="font-medium text-gray-800">{newFatherName || '—'}</span>
                        </div>
                        <div className="flex justify-between border-b border-sky-100/50 pb-2">
                          <span className="font-semibold text-gray-500">National CNIC:</span>
                          <span className="font-medium font-mono text-gray-800">{newCnic}</span>
                        </div>
                        <div className="flex justify-between border-b border-sky-100/50 pb-2">
                          <span className="font-semibold text-gray-500">City / Origin:</span>
                          <span className="font-medium text-gray-800">{newCity || '—'}</span>
                        </div>
                        <div className="flex justify-between border-b border-sky-100/50 pb-2">
                          <span className="font-semibold text-gray-500">Date Of Birth:</span>
                          <span className="font-medium text-gray-800">{newDob || '—'}</span>
                        </div>
                        <div className="flex justify-between border-b border-sky-100/50 pb-2">
                          <span className="font-semibold text-gray-500">Program Target:</span>
                          <span className="font-semibold text-[#004173]">
                            {newSelectedCourse}
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-sky-100/50 pb-2">
                          <span className="font-semibold text-gray-500">Option Laptop:</span>
                          <span className="font-medium text-gray-800">
                            {newLaptop === 'Yes' ? 'Yes (+3,000 PKR)' : 'No'}
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-sky-100/50 pb-2">
                          <span className="font-semibold text-gray-500">Payment Plan chosen:</span>
                          <span className="font-bold text-gray-800">
                            {newPaymentPlan === 'Installment'
                              ? '2 Installments'
                              : 'Full Course Package'}
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-sky-100/50 pb-2">
                          <span className="font-semibold text-gray-500">Civil/Military Status:</span>
                          <span className="font-bold text-gray-800">
                            {newCivilStatus} {newCivilStatus === 'Military' ? `(${newMilCategory})` : ''}
                          </span>
                        </div>

                        {newCivilStatus === 'Military' && (
                          <div className="p-2.5 rounded bg-blue-50/40 border border-blue-100/50 text-[10px] space-y-1 my-1">
                            <div className="font-bold text-[#004173] text-[10.5px]">🪖 Military Verification:</div>
                            <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-gray-600 font-medium">
                              <div><span className="font-semibold text-gray-400">Rank:</span> {newMilRank}</div>
                              <div><span className="font-semibold text-gray-400">Unit:</span> {newMilUnit}</div>
                              <div><span className="font-semibold text-gray-400">Member Name:</span> {newMilName}</div>
                              <div><span className="font-semibold text-gray-400">Station:</span> {newMilStation}</div>
                              <div className="col-span-2"><span className="font-semibold text-gray-400">Relation:</span> {newMilRelation}</div>
                            </div>
                          </div>
                        )}

                        {role === 'admin' && newDiscount > 0 ? (
                          <div className="flex justify-between border-b border-rose-100/50 pb-2 pt-1 text-red-800 font-semibold bg-rose-50/50 px-1">
                            <span>Override Discount Applied:</span>
                            <span>{newDiscount.toLocaleString()} PKR</span>
                          </div>
                        ) : null}

                        <div className="flex justify-between text-sm pt-2 text-[#004173] font-bold">
                          <span>Calculated Amount Due:</span>
                          <span>
                            {currentNewFeeLayout.total.toLocaleString()} PKR
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between pt-2">
                      <button
                        type="button"
                        onClick={() => setFormStep(2)}
                        className="border border-[#004173] text-[#004173] hover:bg-gray-50 px-6 py-2.5 rounded-md font-semibold text-xs flex items-center gap-1 transition"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back</span>
                      </button>

                      <button
                        type="submit"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-2.5 rounded-md font-semibold text-xs flex items-center gap-1.5 transition shadow"
                      >
                        <Check className="w-4 h-4" />
                        <span>Submit &amp; Generate Voucher</span>
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        )}

        {/* VIEW 2: SUCCESS ENROLMENT SCREEN */}
        {activeView === 'success' && submittedRecord && (
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center animate-fade-in-quick">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-10 h-10 stroke-[3]" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900">Registration Complete!</h2>
            <p className="text-gray-500 text-xs mt-1">
              Your profile has been processed into Software Technology Park Bahawalpur system.
            </p>

            <div className="my-6 p-4 bg-gray-50 rounded-xl max-w-xs mx-auto">
              <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider block">
                Your Registration ID
              </span>
              <span className="text-lg font-mono font-bold text-gray-900 block mt-1 tracking-wider leading-none">
                {submittedRecord.regId}
              </span>
            </div>

            {submittedRecord.paymentPlan === 'Installment' && (
              <div className="bg-sky-50 text-sky-700 border border-sky-100 rounded-xl p-3.5 text-xs text-left max-w-md mx-auto space-y-1">
                <span className="font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-600 block"></span>
                  Active Split Plan Installment Details
                </span>
                <p className="pl-3.5 font-medium leading-relaxed">
                  1st Installment Due Today: <strong>{Math.round(submittedRecord.totalFee / 2).toLocaleString()} PKR</strong> <br />
                  2nd Installment Deadline: <strong>{submittedRecord.nextDueDate}</strong>
                </p>
              </div>
            )}

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  setVoucherRecord(submittedRecord);
                  triggerPrintService(submittedRecord);
                }}
                className="bg-[#004173] hover:bg-[#2491bf] text-white font-bold text-xs px-8 py-3 rounded-lg flex items-center justify-center gap-2 transition shadow-md"
              >
                <Printer className="w-4 h-4" />
                <span>🖨️ Print Fee Voucher</span>
              </button>

              <button
                onClick={() => {
                  setFormStep(1);
                  setActiveView('form');
                  setSubmittedRecord(null);
                }}
                className="border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold text-xs px-6 py-3 rounded-lg transition"
              >
                Return &amp; Register Again
              </button>
            </div>
          </div>
        )}

        {/* VIEW 3: STAFF LOGIN ACCESS */}
        {activeView === 'login' && (
          <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden flex flex-col lg:flex-row min-h-[640px] mt-4 mb-12 animate-fade-in-quick">
            
            {/* LEFT SIDE: AUTHENTICATION FORM */}
            <div className="w-full lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center items-center bg-white">
              
              {/* Detailed Circular Logo from stp-assets repository */}
              <div className="w-36 h-36 relative mb-6">
                <img 
                  src="https://raw.githubusercontent.com/artbyartist98-co/stp-assets/main/logo.png"
                  alt="Rohi Logo"
                  className="w-full h-full object-contain select-none"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Header Title matched to screenshot exactly */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center justify-center gap-1.5">
                  Welcome <span className="text-[#1fbda3] font-medium leading-none">Back</span>
                </h1>
                <p className="text-[#3bb09a] text-xs font-semibold mt-1.5 tracking-wide">
                  Sign in to continue your journey with us
                </p>
              </div>

              {/* Error Alert feedback message */}
              {authError && (
                <div className="bg-red-50 text-red-600 text-xs font-bold p-3.5 rounded-xl border border-red-100 mb-6 flex items-center gap-2 w-full max-w-sm">
                  <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              {/* Login Form customized fully */}
              <form onSubmit={handleLogin} className="space-y-5 w-full max-w-sm">
                
                {/* Email Address/Username Field */}
                <div>
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-xs font-medium placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#1fbda3]/40 focus:border-[#1fbda3] transition duration-150"
                    placeholder="E-mail*"
                    required
                  />
                </div>

                {/* Password input with built in eye toggler */}
                <div className="relative">
                  <input
                    type={showLoginPassword ? "text" : "password"}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-xs font-medium placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#1fbda3]/40 focus:border-[#1fbda3] transition duration-150 pr-10"
                    placeholder="Password*"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                    title={showLoginPassword ? "Hide password" : "Show password"}
                  >
                    {showLoginPassword ? (
                      <EyeOff className="w-4.5 h-4.5" />
                    ) : (
                      <Eye className="w-4.5 h-4.5" />
                    )}
                  </button>
                </div>

                {/* Double bottom properties */}
                <div className="flex justify-between items-center text-xs font-semibold select-none">
                  <label className="flex items-center gap-2 text-gray-500 cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded text-[#1ea7a8] focus:ring-[#1ea7a8] w-4 h-4 border-gray-300"
                    />
                    <span>Keep me logged in</span>
                  </label>
                  
                  <button
                    type="button"
                    onClick={() => showToast("Password recovery flow is routed through your registered supervisor's dashboard.", "info")}
                    className="text-gray-800 hover:text-black font-bold underline transition"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Main Sign in block button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#004173] to-[#20839e] hover:opacity-95 text-white py-3 rounded-xl font-bold text-xs transition shadow-sm mt-2 select-none"
                >
                  Sign In
                </button>
              </form>

              {/* Navigation toggle link back to form */}
              <div className="mt-8 text-center select-none">
                <button
                  onClick={() => setActiveView('form')}
                  className="text-gray-405 hover:text-slate-700 text-[11px] font-bold transition flex items-center gap-1 inline-flex"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Student Registration Page</span>
                </button>
              </div>
            </div>

            {/* SEPARATOR COLUMN FOR DESKTOP SCREEN */}
            <div className="hidden lg:block w-[1px] bg-slate-100 self-stretch my-10"></div>

            {/* RIGHT SIDE: CUSTOM PROCESS DIAGRAM OF CAREER COUNSELING SCREENSHOT */}
            <div className="hidden lg:flex lg:w-1/2 bg-slate-50/15 p-12 flex-col justify-center items-center relative overflow-hidden select-none">
              
              {/* Dynamic Connecting Lines representation (SVG Background) */}
              <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
                <svg width="100%" height="100%" viewBox="0 0 400 500" fill="none">
                  {/* Solid connecting line from Central circle */}
                  <line x1="80" y1="250" x2="300" y2="80" stroke="#004173" strokeWidth="2" strokeDasharray="3 3" />
                  <line x1="80" y1="250" x2="300" y2="150" stroke="#1fbda3" strokeWidth="2" strokeDasharray="3 3" />
                  <line x1="80" y1="250" x2="300" y2="220" stroke="#004173" strokeWidth="2" />
                  <line x1="80" y1="250" x2="300" y2="300" stroke="#1fbda3" strokeWidth="2" />
                  <line x1="80" y1="250" x2="300" y2="380" stroke="#004173" strokeWidth="2" strokeDasharray="3 3" />
                  <line x1="80" y1="250" x2="300" y2="450" stroke="#1fbda3" strokeWidth="2" strokeDasharray="3 3" />
                </svg>
              </div>

              {/* Visual Map Layout container */}
              <div className="w-full max-w-[420px] flex items-center justify-between gap-4 z-10 relative">
                
                {/* Left Orbit block: Careerr counseling core */}
                <div className="relative flex-shrink-0 flex items-center justify-center animate-pulse-slow">
                  
                  {/* Concentric outer shadow circle */}
                  <div className="absolute w-48 h-48 rounded-full bg-slate-100 border border-slate-200/50 opacity-15 filter blur-xs"></div>
                  <div className="absolute w-40 h-40 rounded-full bg-slate-100 border border-slate-200/50 opacity-40"></div>
                  <div className="absolute w-34 h-34 rounded-full bg-slate-200/40"></div>
                  
                  {/* Center Dark Deep Navy target core */}
                  <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-[#00345b] to-[#1d5b8c] text-white flex flex-col justify-center items-center p-3 text-center shadow-lg border border-[#1e5d8f]">
                    
                    {/* Centered target icon representing Career counseling chart */}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7 mb-1.5 stroke-white">
                      <line x1="18" y1="20" x2="18" y2="10" />
                      <line x1="12" y1="20" x2="12" y2="4" />
                      <line x1="6" y1="20" x2="6" y2="14" />
                      <circle cx="12" cy="4" r="1.5" fill="white" />
                      <circle cx="18" cy="10" r="1.5" fill="white" />
                      <circle cx="6" cy="14" r="1.5" fill="white" />
                    </svg>
                    
                    <span className="text-[11px] font-black uppercase tracking-wider leading-tight block">Career</span>
                    <span className="text-[11px] font-medium leading-none block text-blue-200">Counseling</span>
                  </div>
                </div>

                {/* Right Lists: The 6 capsule pointer labels stacked nicely vertically */}
                <div className="flex flex-col gap-3.5 flex-1 pl-4">
                  
                  {/* Item 1: Project Hunting */}
                  <div className="flex items-center relative group select-none cursor-help transform hover:translate-x-1.5 transition">
                    <div className="w-7 h-7 rounded-full bg-[#1dbda3] flex items-center justify-center text-white scale-90 z-15 shadow-sm border border-[#1aab93]">
                      <Search className="w-3.5 h-3.5" />
                    </div>
                    
                    {/* Pointy tag bubble matching the shape in the screenshot exactly */}
                    <div 
                      className="bg-[#2a7b82] text-white text-[10px] font-extrabold h-9 pl-6 pr-4 flex items-center rounded-l-md -ml-3.5 flex-1"
                      style={{ clipPath: 'polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%)' }}
                    >
                      <span>Project Hunting</span>
                    </div>
                  </div>

                  {/* Item 2: Skill Assessment */}
                  <div className="flex items-center relative group select-none cursor-help transform hover:translate-x-1.5 transition">
                    <div className="w-7 h-7 rounded-full bg-[#044173] flex items-center justify-center text-white scale-90 z-15 shadow-sm border border-[#033761]">
                      <Database className="w-3.5 h-3.5" />
                    </div>
                    
                    <div 
                      className="bg-[#0e7490] text-white text-[10px] font-extrabold h-9 pl-6 pr-4 flex items-center rounded-l-md -ml-3.5 flex-1"
                      style={{ clipPath: 'polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%)' }}
                    >
                      <span>Skill Assessment</span>
                    </div>
                  </div>

                  {/* Item 3: Profile Optimization */}
                  <div className="flex items-center relative group select-none cursor-help transform hover:translate-x-1.5 transition">
                    <div className="w-7 h-7 rounded-full bg-[#1dbda3] flex items-center justify-center text-white scale-90 z-15 shadow-sm border border-[#1aab93]">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    
                    <div 
                      className="bg-[#3e8a8b] text-white text-[10px] font-extrabold h-9 pl-6 pr-4 flex items-center rounded-l-md -ml-3.5 flex-1"
                      style={{ clipPath: 'polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%)' }}
                    >
                      <span>Profile Optimization</span>
                    </div>
                  </div>

                  {/* Item 4: Client Communication */}
                  <div className="flex items-center relative group select-none cursor-help transform hover:translate-x-1.5 transition">
                    <div className="w-7 h-7 rounded-full bg-[#044173] flex items-center justify-center text-white scale-90 z-15 shadow-sm border border-[#033761]">
                      <Briefcase className="w-3.5 h-3.5" />
                    </div>
                    
                    <div 
                      className="bg-[#1e5c7a] text-white text-[10px] font-extrabold h-9 pl-6 pr-4 flex items-center rounded-l-md -ml-3.5 flex-1"
                      style={{ clipPath: 'polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%)' }}
                    >
                      <span>Client Communication</span>
                    </div>
                  </div>

                  {/* Item 5: Diversification of Skills */}
                  <div className="flex items-center relative group select-none cursor-help transform hover:translate-x-1.5 transition">
                    <div className="w-7 h-7 rounded-full bg-[#1dbda3] flex items-center justify-center text-white scale-90 z-15 shadow-sm border border-[#1aab93]">
                      <Layers className="w-3.5 h-3.5" />
                    </div>
                    
                    <div 
                      className="bg-[#247f8c] text-white text-[10px] font-extrabold h-9 pl-6 pr-4 flex items-center rounded-l-md -ml-3.5 flex-1"
                      style={{ clipPath: 'polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%)' }}
                    >
                      <span>Diversification of Skills</span>
                    </div>
                  </div>

                  {/* Item 6: Pricing Strategies */}
                  <div className="flex items-center relative group select-none cursor-help transform hover:translate-x-1.5 transition">
                    <div className="w-7 h-7 rounded-full bg-[#044173] flex items-center justify-center text-white scale-90 z-15 shadow-sm border border-[#033761]">
                      <DollarSign className="w-3.5 h-3.5" />
                    </div>
                    
                    <div 
                      className="bg-[#1b6b80] text-white text-[10px] font-extrabold h-9 pl-6 pr-4 flex items-center rounded-l-md -ml-3.5 flex-1"
                      style={{ clipPath: 'polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%)' }}
                    >
                      <span>Pricing Strategies</span>
                    </div>
                  </div>

                </div>
              </div>

            </div>

          </div>
        )}

        {/* VIEW 4: MASTER HUB ADMIN DASHBOARD - MODERNIZED */}
        {activeView === 'admin' && (
          <div className="w-full flex flex-col lg:flex-row bg-[#f8fafc] font-sans text-gray-800 min-h-[calc(100vh-80px)] border-t border-gray-200">
            
            {/* COLUMN 1: SIDEBAR INTERFACE MATCHING SCREENSHOT */}
            <aside className="w-full lg:w-72 bg-white border-r border-[#e2e8f0] p-5 flex flex-col justify-between flex-shrink-0 lg:sticky lg:top-0 h-auto lg:h-[calc(100vh-80px)] overflow-y-auto no-print">
              <div className="space-y-6">
                
                {/* Branding Block from picture */}
                <div className="flex items-center gap-3 border-b border-gray-100 pb-5">
                  <div className="w-10 h-10 rounded-full border-2 border-dashed border-[#004173] p-1 flex items-center justify-center bg-blue-50/50">
                    <Building className="w-5 h-5 text-[#004173]" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-xs font-black text-[#004173] tracking-tight uppercase leading-tight">
                      STP Bahawalpur
                    </h2>
                    <p className="text-[10px] text-gray-500 font-bold tracking-wide mt-0.5">
                      Rohi eSkills Learning Hub
                    </p>
                  </div>
                </div>

                {/* Sidebar Navigation Stack with active indicators */}
                <nav className="space-y-2">
                  
                  {/* Item 1: Admin Panel (Analytics & Add Course) */}
                  {canSeeEnrollmentTabs && (
                    <button
                      type="button"
                      onClick={() => { setSidebarActiveItem('admin'); setSelectedInquiryCourse(null); }}
                      className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold transition duration-155 cursor-pointer ${
                        sidebarActiveItem === 'admin'
                          ? 'bg-blue-50/70 text-[#004173]'
                          : 'text-gray-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <PieChart className="w-4.5 h-4.5 text-[#004173]" />
                        <span>Admin Panel</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                  )}

                  {/* Item 2: Students */}
                  {canSeeEnrollmentTabs && (
                    <div className="space-y-1">
                      <button
                        type="button"
                        onClick={() => { 
                          setSidebarActiveItem('students'); 
                          setSelectedInquiryCourse(null); 
                        }}
                        className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold transition duration-155 cursor-pointer ${
                          sidebarActiveItem === 'students'
                            ? 'bg-blue-50/70 text-[#004173]'
                            : 'text-gray-600 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Users className="w-4.5 h-4.5 text-[#004173]" />
                          <span>Students</span>
                        </div>
                        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${
                          sidebarActiveItem === 'students' ? 'rotate-180' : ''
                        }`} />
                      </button>

                      {/* Sub-items list */}
                      {sidebarActiveItem === 'students' && (
                        <div className="pl-4 pr-1 py-1 space-y-1 bg-slate-50/40 rounded-xl border border-slate-100/50">
                          <button
                            type="button"
                            onClick={() => {
                              setStudentsSubView('summary');
                            }}
                            className={`w-full flex items-center justify-start p-2 rounded-lg text-[11px] font-extrabold transition cursor-pointer text-left ${
                              studentsSubView === 'summary'
                                ? 'bg-[#004173] text-white shadow-xs'
                                : 'text-gray-600 hover:bg-slate-100'
                            }`}
                          >
                            <span>Student Summary</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setStudentsSubView('profile');
                            }}
                            className={`w-full flex items-center justify-start p-2 rounded-lg text-[11px] font-extrabold transition cursor-pointer text-left ${
                              studentsSubView === 'profile'
                                ? 'bg-[#004173] text-white shadow-xs'
                                : 'text-gray-600 hover:bg-slate-100'
                            }`}
                          >
                            <span>Student Profile</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Item 3: Inquiry -> holding child Training (Exactly like picture) */}
                  <div className="space-y-1">
                    <div className="w-full flex items-center justify-between p-3 text-xs font-black text-gray-400 uppercase tracking-widest">
                      <span>Applications center</span>
                    </div>
                    <div className="pl-1.5 space-y-1">
                      <button
                        type="button"
                        onClick={() => { setSidebarActiveItem('inquiry'); setSelectedInquiryCourse(null); }}
                        className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold transition duration-205 cursor-pointer ${
                          sidebarActiveItem === 'inquiry'
                            ? 'bg-gradient-to-r from-[#003865] via-[#004173] to-[#2491bf] text-white shadow-md'
                            : 'text-gray-600 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <HelpCircle className="w-4.5 h-4.5" />
                          <span>Inquiry (Training)</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Item 4: Startups / Working space register */}
                  {currentUser?.role === 'Super Administrator' && (
                    <button
                      type="button"
                      onClick={() => { setSidebarActiveItem('startups'); setSelectedInquiryCourse(null); }}
                      className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold transition duration-155 cursor-pointer ${
                        sidebarActiveItem === 'startups'
                          ? 'bg-blue-50/70 text-[#004173]'
                          : 'text-gray-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Building className="w-4.5 h-4.5 text-[#004173]" />
                        <span>Startups Incubator</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                  )}

                  {/* Item 4b: Seminar Hall / Conference Room Booking */}
                  {currentUser?.role === 'Super Administrator' && (
                    <button
                      type="button"
                      onClick={() => { setSidebarActiveItem('hall-bookings'); setSelectedInquiryCourse(null); }}
                      className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold transition duration-155 cursor-pointer ${
                        sidebarActiveItem === 'hall-bookings'
                          ? 'bg-blue-50/70 text-[#004173]'
                          : 'text-gray-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Calendar className="w-4.5 h-4.5 text-[#004173]" />
                        <span>Room / Hall Bookings</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                  )}

                  {/* Item 5: Courses configuration database */}
                  {(currentUser?.role === 'Super Administrator' || currentUser?.role === 'Trainer') && (
                    <button
                      type="button"
                      onClick={() => { setSidebarActiveItem('courses'); setSelectedInquiryCourse(null); }}
                      className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold transition duration-155 cursor-pointer ${
                        sidebarActiveItem === 'courses'
                          ? 'bg-blue-50/70 text-[#004173]'
                          : 'text-gray-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <BookOpen className="w-4.5 h-4.5 text-[#004173]" />
                        <span>Courses & Training</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                  )}

                  {/* Item 6: Employees settings */}
                  <button
                    type="button"
                    onClick={() => { setSidebarActiveItem('employees'); setSelectedInquiryCourse(null); }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold transition duration-155 cursor-pointer ${
                      sidebarActiveItem === 'employees'
                        ? 'bg-blue-50/70 text-[#004173]'
                        : 'text-gray-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <ShieldAlert className="w-4.5 h-4.5 text-[#004173]" />
                      <span>Employees</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                  </button>

                  {/* Item 7: Inventory equipment register */}
                  {(currentUser?.role === 'Super Administrator' || currentUser?.role === 'Accountant') && (
                    <button
                      type="button"
                      onClick={() => { setSidebarActiveItem('inventory'); setSelectedInquiryCourse(null); }}
                      className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold transition duration-155 cursor-pointer ${
                        sidebarActiveItem === 'inventory'
                          ? 'bg-blue-50/70 text-[#004173]'
                          : 'text-gray-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Layers className="w-4.5 h-4.5 text-[#004173]" />
                        <span>Inventory Logs</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                  )}
                </nav>
              </div>

              {/* Sidebar bottom copyright & quick return */}
              <div className="pt-6 border-t border-gray-100 space-y-3">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full bg-[#fae8ff] hover:bg-[#f5d0fe] text-purple-700 font-extrabold text-[11px] py-2.5 rounded-xl transition duration-150 flex items-center justify-center gap-2 cursor-pointer border border-[#fae8ff]"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log out Administrative Workspace</span>
                </button>
                <div className="text-[9px] text-gray-400 font-bold text-center select-none uppercase tracking-widest">
                  STP LMS © 2026 Bahawalpur
                </div>
              </div>
            </aside>

            {/* COLUMN 2: MAIN DYNAMIC WORKSPACE CONTENT PANEL */}
            <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto w-full">
              
              {/* CENTRALIZED TOP HEADER PANEL */}
              <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 no-print">
                <div className="text-left self-stretch md:self-auto">
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest block font-mono">
                    Administrative Desk Network
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></div>
                    <h4 className="text-sm font-extrabold text-gray-800 uppercase tracking-tight">
                      STP-BWP Main Desk Central Branch
                    </h4>
                  </div>
                </div>

                {/* Right side: Active logged-in user profile badge */}
                <div className="flex items-center gap-4 self-stretch md:self-auto justify-end border-t md:border-t-0 border-gray-100 pt-3 md:pt-0">
                  <div className="relative cursor-pointer hover:opacity-85 transition">
                    <Bell className="w-5 h-5 text-gray-400" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
                  </div>

                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl p-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#004173] to-[#2491bf] font-black text-white text-xs flex items-center justify-center shadow-sm">
                      {currentUser?.username?.substring(0, 1).toUpperCase() || 'R'}
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-black text-gray-800 leading-none flex items-center gap-1">
                        <span>@{currentUser?.username || 'rohi'}</span>
                      </div>
                      <span className="text-[9.5px] font-extrabold text-[#004173] block uppercase tracking-wider mt-0.5 font-mono">
                        {currentUser?.role || 'Super Administrator'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>



              {/* VIEW MULTIPLEXER BASED ON SIDEBAR ACTIVE ITEM */}
              
              {/* SECTION A: ADMIN PANEL (ALL ANALYTICS & ADD NEW COURSE) */}
              {sidebarActiveItem === 'admin' && (
                <div className="space-y-6 animate-fade-in-quick">
                  <div>
                    <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                      <PieChart className="w-5 h-5 text-[#004173]" />
                      <span>Executive Administration Dashboard</span>
                    </h3>
                    <p className="text-xs text-gray-400">
                      General financial collections ledger totals, conversion tracking analysis, and course parameters setups.
                    </p>
                  </div>

                  {/* 3 Executive High Contrast Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs hover:border-gray-200 transition">
                      <span className="text-[10px] font-black tracking-widest text-[#004173] uppercase block select-none mb-1.5">
                        Gross Fee Revenue Collected
                      </span>
                      <div className="text-xl font-black text-gray-900 font-mono">
                        {visibleRecords
                          .filter(r => r.status === 'Enrolled' || r.status === 'Verified')
                          .reduce((acc, r) => acc + (r.totalFee !== undefined ? r.totalFee : calculateTotalFee(r.course, r.laptop, r.civilStatus, r.discount, r.milCategory).total), 0)
                          .toLocaleString()}{' '}
                        PKR
                      </div>
                      <p className="text-[9.5px] text-emerald-600 block mt-1 font-bold">
                        🟢 Confirmed ledger invoice checks
                      </p>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs hover:border-gray-200 transition">
                      <span className="text-[10px] font-black tracking-widest text-[#004173] uppercase block select-none mb-1.5">
                        Dues Outstanding Balance
                      </span>
                      <div className="text-xl font-black text-gray-900 font-mono">
                        {visibleRecords
                          .filter(r => r.status === 'Pending' || r.status === 'Processing')
                          .reduce((acc, r) => acc + (r.totalFee !== undefined ? r.totalFee : calculateTotalFee(r.course, r.laptop, r.civilStatus, r.discount, r.milCategory).total), 0)
                          .toLocaleString()}{' '}
                        PKR
                      </div>
                      <p className="text-[9.5px] text-amber-600 block mt-1 font-bold">
                        🟡 Pending Verification logs
                      </p>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs hover:border-gray-200 transition">
                      <span className="text-[10px] font-black tracking-widest text-[#004173] uppercase block select-none mb-1.5">
                        Student Retentions Index
                      </span>
                      <div className="text-xl font-black text-gray-900 font-mono">
                        {visibleRecords.length > 0
                          ? Math.round((visibleRecords.filter(r => r.status === 'Enrolled' || r.status === 'Verified').length / visibleRecords.length) * 100)
                          : 0}{' '}
                        %
                      </div>
                      <p className="text-[9.5px] text-indigo-600 block mt-1 font-bold">
                        ⚡ Active registrations ratio list
                      </p>
                    </div>
                  </div>

                  {/* Dynamic Recharts Visualization */}
                  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
                    <div className="border-b border-gray-100 pb-3 mb-4">
                      <h4 className="font-extrabold text-gray-900 text-sm">
                        Enrollments Admissions Trends
                      </h4>
                    </div>
                    <AdminCharts records={visibleRecords} />
                  </div>

                  {/* Add New Course Settings panel right inside Admin Panel (As requested) */}
                  {currentUser?.role === 'Super Administrator' && (
                    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs space-y-4">
                      <div className="border-b border-gray-100 pb-3">
                        <h4 className="font-extrabold text-[#004173] text-sm md:text-base">
                          {editingCourseId ? '✏️ Modify Existing Course Setting' : '➕ Register Course Program'}
                        </h4>
                        <p className="text-xs text-gray-400">
                          Set courses structures, base prices and hard discount floor settings. All fee calculations automatically adapt instantly!
                        </p>
                      </div>

                      <form
                        onSubmit={(e) => {
                          if (editingCourseId) {
                            handleUpdateCourse(e);
                          } else {
                            handleAddCourse(e);
                          }
                        }}
                        className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-gray-50/20 p-4 rounded-xl border border-gray-100/60"
                      >
                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">
                            Course / Program Title
                          </label>
                          <input
                            type="text"
                            required
                            value={courseFormName}
                            onChange={(e) => setCourseFormName(e.target.value)}
                            placeholder="e.g. Freelancing & Digital Marketing"
                            className="w-full text-xs p-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#2491bf] font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-black text-sky-700 uppercase mb-1 font-bold">
                            Civilian Base Fee (PKR)
                          </label>
                          <input
                            type="number"
                            required
                            value={courseFormBaseFee}
                            onChange={(e) => setCourseFormBaseFee(Number(e.target.value))}
                            className="w-full text-xs p-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#2491bf] font-mono font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-black text-sky-700 uppercase mb-1 font-bold">
                            Civil Min Floor Fee (PKR)
                          </label>
                          <input
                            type="number"
                            required
                            value={courseFormMinFee}
                            onChange={(e) => setCourseFormMinFee(Number(e.target.value))}
                            className="w-full text-xs p-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#2491bf] font-mono font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-black text-blue-700 uppercase mb-1 font-bold">
                            Mil Officer Base (PKR)
                          </label>
                          <input
                            type="number"
                            required
                            value={courseFormMilOfficerBaseFee}
                            onChange={(e) => setCourseFormMilOfficerBaseFee(Number(e.target.value))}
                            className="w-full text-xs p-2.5 bg-blue-50/40 border border-blue-100 rounded-lg focus:outline-none focus:border-[#2491bf] font-mono font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-black text-blue-700 uppercase mb-1 font-bold">
                            Mil Officer Floor (PKR)
                          </label>
                          <input
                            type="number"
                            required
                            value={courseFormMilOfficerMinFee}
                            onChange={(e) => setCourseFormMilOfficerMinFee(Number(e.target.value))}
                            className="w-full text-xs p-2.5 bg-blue-50/40 border border-blue-100 rounded-lg focus:outline-none focus:border-[#2491bf] font-mono font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-black text-indigo-700 uppercase mb-1 font-bold">
                            Mil JCO Base (PKR)
                          </label>
                          <input
                            type="number"
                            required
                            value={courseFormMilJcoBaseFee}
                            onChange={(e) => setCourseFormMilJcoBaseFee(Number(e.target.value))}
                            className="w-full text-xs p-2.5 bg-indigo-50/40 border border-indigo-100 rounded-lg focus:outline-none focus:border-[#2491bf] font-mono font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-black text-indigo-700 uppercase mb-1 font-bold">
                            Mil JCO Floor (PKR)
                          </label>
                          <input
                            type="number"
                            required
                            value={courseFormMilJcoMinFee}
                            onChange={(e) => setCourseFormMilJcoMinFee(Number(e.target.value))}
                            className="w-full text-xs p-2.5 bg-indigo-50/40 border border-indigo-100 rounded-lg focus:outline-none focus:border-[#2491bf] font-mono font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">
                            Classification Category
                          </label>
                          <select
                            value={courseFormCategory}
                            onChange={(e) => setCourseFormCategory(e.target.value as any)}
                            className="w-full text-xs p-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#2491bf] cursor-pointer"
                          >
                            <option value="Technical">Technical</option>
                            <option value="Non-Technical">Non-Technical</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">
                            Instructor Name
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Muhammad Asad"
                            value={courseFormInstructor}
                            onChange={(e) => setCourseFormInstructor(e.target.value)}
                            className="w-full text-xs p-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#2491bf] font-bold"
                          />
                        </div>

                        <div className="md:col-span-2 flex gap-2">
                          <button
                            type="submit"
                            className="bg-[#004173] hover:bg-[#2491bf] text-white text-xs font-bold py-2.5 px-6 rounded-xl transition shadow cursor-pointer mt-2"
                          >
                            {editingCourseId ? 'Save course adjustments' : 'Register Program setup'}
                          </button>
                          {editingCourseId && (
                            <button
                              type="button"
                              onClick={handleCancelEditCourse}
                              className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold py-2.5 px-6 rounded-xl transition cursor-pointer mt-2"
                            >
                              Cancel Edit
                            </button>
                          )}
                        </div>
                      </form>

                      {/* Summary list of courses inside Admin settings */}
                      <div className="overflow-x-auto border-t border-gray-50 pt-4 mt-2">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-wider pb-2">
                              <th className="pb-2">Course Name</th>
                              <th className="pb-2">Classification</th>
                              <th className="pb-2">Instructor</th>
                              <th className="pb-2">Civil (Base / Floor)</th>
                              <th className="pb-2">Mil Officer (Base / Floor)</th>
                              <th className="pb-2">Mil JCO (Base / Floor)</th>
                              <th className="pb-1 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50 font-medium">
                            {courses.map((c) => (
                              <tr key={c.id} className="hover:bg-slate-50/50">
                                <td className="py-2.5 font-bold text-[#004173]">{c.name}</td>
                                <td className="py-2.5">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    c.category === 'Technical' ? 'bg-teal-50 text-teal-600' : 'bg-purple-50 text-purple-600'
                                  }`}>
                                    {c.category}
                                  </span>
                                </td>
                                <td className="py-2.5 font-semibold text-gray-600">{c.instructorName || 'Muhammad Asad'}</td>
                                <td className="py-2.5 font-mono text-xs text-gray-700">
                                  <div>Base: <strong className="font-bold">{c.baseFee.toLocaleString()}</strong></div>
                                  <div>Floor: <span className="font-semibold text-rose-600">{c.minFee.toLocaleString()}</span></div>
                                </td>
                                <td className="py-2.5 font-mono text-xs text-gray-700">
                                  <div>Base: <strong className="font-bold text-blue-700">{(c.milOfficerBaseFee ?? c.baseFee).toLocaleString()}</strong></div>
                                  <div>Floor: <span className="font-semibold text-rose-600">{(c.milOfficerMinFee ?? c.minFee).toLocaleString()}</span></div>
                                </td>
                                <td className="py-2.5 font-mono text-xs text-gray-700">
                                  <div>Base: <strong className="font-bold text-indigo-700">{(c.milJcoBaseFee ?? c.baseFee).toLocaleString()}</strong></div>
                                  <div>Floor: <span className="font-semibold text-rose-600">{(c.milJcoMinFee ?? c.minFee).toLocaleString()}</span></div>
                                </td>
                                <td className="py-2.5 text-right font-bold pr-1">
                                  <div className="flex gap-2 justify-end">
                                    <button
                                      type="button"
                                      onClick={() => handleStartEditCourse(c)}
                                      className="text-blue-600 hover:bg-blue-50 p-1 rounded bg-transparent border-0 cursor-pointer text-xs"
                                      title="Edit course configuration"
                                    >
                                      ✏️
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setCourses((prev) => prev.filter((item) => item.id !== c.id));
                                        showToast(`Deleted course: ${c.name}`, 'info');
                                      }}
                                      className="text-red-500 hover:bg-red-50 p-1 rounded bg-transparent border-0 cursor-pointer text-xs"
                                      title="Delete course"
                                    >
                                      🗑️
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Create Batch Option inside Admin Panel (As requested) */}
                  {currentUser?.role === 'Super Administrator' && (
                    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs space-y-4">
                      <div className="border-b border-gray-100 pb-3">
                        <h4 className="font-extrabold text-[#004173] text-sm md:text-base">
                          ⚙️ Session Batches Configuration
                        </h4>
                        <p className="text-xs text-gray-400">
                          Create and configure active academic batches. Assign courses and programs specifically to Morning, Noon, or Evening shifts!
                        </p>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Form to Create/Edit Batch */}
                        <div className={`p-4 rounded-xl border space-y-3 transition-all duration-200 ${editingBatchId ? 'bg-blue-50/60 border-blue-200' : 'bg-slate-50/55 border-slate-100'}`}>
                          <h5 className="font-extrabold text-[#004173] text-xs uppercase tracking-wider flex justify-between items-center">
                            <span>{editingBatchId ? '✏️ Edit Session Batch' : '➕ Create New Batch'}</span>
                            {editingBatchId && (
                              <button
                                type="button"
                                onClick={handleCancelEditBatch}
                                className="text-[10px] bg-gray-200 hover:bg-gray-350 text-gray-700 px-1.5 py-0.5 rounded cursor-pointer border-0 font-black font-sans uppercase tracking-tight"
                              >
                                Cancel
                              </button>
                            )}
                          </h5>

                          <form onSubmit={handleAddBatch} className="space-y-3">
                            <div>
                              <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">
                                Batch Name / Identifier
                              </label>
                              <input
                                type="text"
                                required
                                value={batchFormName}
                                onChange={(e) => setBatchFormName(e.target.value)}
                                placeholder="e.g. Batch-15 (Fall 2026)"
                                className="w-full text-xs p-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#2491bf] font-bold"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">
                                  Start Date
                                </label>
                                <input
                                  type="date"
                                  required
                                  value={batchFormStartDate}
                                  onChange={(e) => setBatchFormStartDate(e.target.value)}
                                  className="w-full text-xs p-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#2491bf] font-mono"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">
                                  End Date
                                </label>
                                <input
                                  type="date"
                                  required
                                  value={batchFormEndDate}
                                  onChange={(e) => setBatchFormEndDate(e.target.value)}
                                  className="w-full text-xs p-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#2491bf] font-mono"
                                />
                              </div>
                            </div>

                            {/* Shifts courses selections with checklist boxes */}
                            <div className="space-y-3 pt-1.5 border-t border-slate-100">
                              <div>
                                <span className="block text-[10px] font-black text-amber-700 uppercase mb-1.5">
                                  🌅 Mornings Shift Courses
                                </span>
                                <div className="max-h-[110px] overflow-y-auto space-y-1.5 bg-white p-2 rounded-lg border border-gray-150">
                                  {courses.map(c => (
                                    <label key={c.id} className="flex items-center gap-2 text-[11px] font-semibold text-gray-650 cursor-pointer select-none">
                                      <input
                                        type="checkbox"
                                        checked={batchFormMorning.includes(c.name)}
                                        onChange={() => setBatchFormMorning(prev => prev.includes(c.name) ? prev.filter(item => item !== c.name) : [...prev, c.name])}
                                        className="rounded text-[#004173] w-3.5 h-3.5"
                                      />
                                      <span>{c.name}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <span className="block text-[10px] font-black text-sky-750 uppercase mb-1.5 font-bold">
                                  ☀️ Noons Shift Courses
                                </span>
                                <div className="max-h-[110px] overflow-y-auto space-y-1.5 bg-white p-2 rounded-lg border border-gray-150">
                                  {courses.map(c => (
                                    <label key={c.id} className="flex items-center gap-2 text-[11px] font-semibold text-gray-650 cursor-pointer select-none">
                                      <input
                                        type="checkbox"
                                        checked={batchFormNoon.includes(c.name)}
                                        onChange={() => setBatchFormNoon(prev => prev.includes(c.name) ? prev.filter(item => item !== c.name) : [...prev, c.name])}
                                        className="rounded text-[#004173] w-3.5 h-3.5"
                                      />
                                      <span>{c.name}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <span className="block text-[10px] font-black text-indigo-755 uppercase mb-1.5 font-bold font-sans">
                                  🌙 Evenings Shift Courses
                                </span>
                                <div className="max-h-[110px] overflow-y-auto space-y-1.5 bg-white p-2 rounded-lg border border-gray-150">
                                  {courses.map(c => (
                                    <label key={c.id} className="flex items-center gap-2 text-[11px] font-semibold text-gray-650 cursor-pointer select-none">
                                      <input
                                        type="checkbox"
                                        checked={batchFormEvening.includes(c.name)}
                                        onChange={() => setBatchFormEvening(prev => prev.includes(c.name) ? prev.filter(item => item !== c.name) : [...prev, c.name])}
                                        className="rounded text-[#004173] w-3.5 h-3.5"
                                      />
                                      <span>{c.name}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div className="flex gap-2 mt-1 font-sans">
                              <button
                                type="submit"
                                className="flex-1 bg-[#004173] hover:bg-[#2491bf] text-white text-xs font-bold py-2 px-4 rounded-lg transition shadow cursor-pointer"
                              >
                                {editingBatchId ? '💾 Save Batch Changes' : 'Create Session Batch'}
                              </button>
                              {editingBatchId && (
                                <button
                                  type="button"
                                  onClick={handleCancelEditBatch}
                                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold py-2 px-3 rounded-lg transition cursor-pointer"
                                >
                                  Cancel
                                </button>
                              )}
                            </div>
                          </form>

                          {/* 📥 CSV BATCH RECODR IMPORTER CARD */}
                          <div className="bg-[#e4f2eb] p-3.5 rounded-xl border border-emerald-200/60 space-y-3 mt-4">
                            <div className="flex items-center gap-2">
                              <span className="text-sm">📥</span>
                              <h5 className="font-extrabold text-[#006b3c] text-[11px] uppercase tracking-wider">
                                Batch Record Importer (CSV)
                              </h5>
                            </div>
                            <p className="text-[10px] text-emerald-850 leading-relaxed font-medium">
                              Upload student candidate lists to instantly register records into students ledger. Fee protecting structures will automatically recalculate for each record.
                            </p>

                            <div className="space-y-2.5">
                              <div>
                                <label className="block text-[8.5px] font-black text-emerald-800 uppercase mb-1">
                                  Default Target Batch Assignment
                                </label>
                                <select
                                  id="importBatchSelect"
                                  className="w-full text-[11px] p-2 bg-white border border-emerald-200 rounded-lg text-gray-700 font-bold focus:outline-none"
                                >
                                  <option value="auto">Auto-Detect Batch based on Subject</option>
                                  {batches.map(b => (
                                    <option key={b.id} value={b.id}>{b.name}</option>
                                  ))}
                                </select>
                              </div>

                              <div>
                                <label className="block text-[8.5px] font-black text-emerald-800 uppercase mb-1">
                                  Default Ledger Status
                                </label>
                                <select
                                  id="importStatusSelect"
                                  className="w-full text-[11px] p-2 bg-white border border-emerald-200 rounded-lg text-gray-700 font-bold focus:outline-none"
                                >
                                  <option value="Enrolled">Enrolled</option>
                                  <option value="Verified">Verified</option>
                                  <option value="Processing">Processing</option>
                                  <option value="Pending">Pending</option>
                                </select>
                              </div>

                              <div className="pt-1">
                                <input
                                  type="file"
                                  id="csvImportFileInput"
                                  accept=".csv"
                                  className="hidden"
                                  onChange={handleCsvImport}
                                />
                                <button
                                  type="button"
                                  onClick={() => document.getElementById('csvImportFileInput')?.click()}
                                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold py-2.5 px-3 rounded-lg transition shadow-xs cursor-pointer flex justify-center items-center gap-2 border-0"
                                >
                                  📁 Choose previous record CSV file
                                </button>
                              </div>

                              <div className="flex justify-between items-center text-[10px] text-emerald-800 font-bold border-t border-emerald-200/30 pt-2.5 mt-2">
                                <button
                                  type="button"
                                  onClick={handleDownloadCsvTemplate}
                                  className="text-emerald-700 hover:text-emerald-900 underline cursor-pointer bg-transparent border-0 font-bold text-[10.5px]"
                                >
                                  📥 Download sample template
                                </button>
                                <span className="text-[9px] text-[#006b3c]/80 uppercase">CSV supported</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Active Batches List Table */}
                        <div className="lg:col-span-2 space-y-2">
                          <h5 className="font-extrabold text-gray-900 text-xs uppercase tracking-wider">
                            📋 Registered Session Batches
                          </h5>
                          
                          {batches.length === 0 ? (
                            <div className="bg-slate-50 rounded-xl p-10 text-center text-xs text-gray-400 font-semibold border border-dashed">
                              No academic batches configured yet. Build your first batch schedule!
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[520px] overflow-y-auto pr-1">
                              {batches.map((b) => (
                                <div key={b.id} className="bg-white border border-gray-200/80 rounded-xl p-4 shadow-3xs hover:border-blue-100 transition relative">
                                  <div className="absolute top-4 right-4 flex gap-2 items-center">
                                    <button
                                      type="button"
                                      onClick={() => handleStartEditBatch(b)}
                                      className="text-blue-500 hover:text-blue-700 bg-transparent border-0 cursor-pointer text-xs p-1 hover:bg-slate-100 rounded transition"
                                      title="Edit batch"
                                    >
                                      ✏️
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteBatch(b.id)}
                                      className="text-red-400 hover:text-red-600 bg-transparent border-0 cursor-pointer text-xs p-1 hover:bg-slate-100 rounded transition"
                                      title="Delete batch"
                                    >
                                      🗑️
                                    </button>
                                  </div>
                                  
                                  <div className="border-b border-gray-100 pb-2 mb-2">
                                    <h6 className="font-black text-[#004173] text-sm">{b.name}</h6>
                                    <span className="text-[10px] font-mono text-gray-500 font-extrabold uppercase tracking-tight">
                                      📅 {b.startDate} to {b.endDate}
                                    </span>
                                  </div>

                                  <div className="space-y-2 text-xs">
                                    <div className="bg-amber-50/50 p-2 rounded-lg border border-amber-100/40">
                                      <span className="font-bold text-amber-800 text-[10px] uppercase block mb-1">🌅 Morning Shift</span>
                                      {b.morningCourses.length === 0 ? (
                                        <span className="text-[10px] text-gray-400 italic font-semibold">No Courses Assigned</span>
                                      ) : (
                                        <div className="flex flex-wrap gap-1">
                                          {b.morningCourses.map((c, i) => (
                                            <span key={i} className="bg-amber-100/60 text-amber-900 px-1.5 py-0.5 rounded text-[9.5px] font-bold">
                                              {c}
                                            </span>
                                          ))}
                                        </div>
                                      )}
                                    </div>

                                    <div className="bg-sky-50/50 p-2 rounded-lg border border-sky-100/40">
                                      <span className="font-bold text-sky-800 text-[10px] uppercase block mb-1">☀️ Noon Shift</span>
                                      {b.noonCourses.length === 0 ? (
                                        <span className="text-[10px] text-gray-400 italic font-semibold">No Courses Assigned</span>
                                      ) : (
                                        <div className="flex flex-wrap gap-1">
                                          {b.noonCourses.map((c, i) => (
                                            <span key={i} className="bg-sky-100/60 text-sky-900 px-1.5 py-0.5 rounded text-[9.5px] font-bold">
                                              {c}
                                            </span>
                                          ))}
                                        </div>
                                      )}
                                    </div>

                                    <div className="bg-indigo-50/50 p-2 rounded-lg border border-indigo-100/40">
                                      <span className="font-bold text-indigo-800 text-[10px] uppercase block mb-1">🌙 Evening Shift</span>
                                      {b.eveningCourses.length === 0 ? (
                                        <span className="text-[10px] text-gray-400 italic font-semibold">No Courses Assigned</span>
                                      ) : (
                                        <div className="flex flex-wrap gap-1">
                                          {b.eveningCourses.map((c, i) => (
                                            <span key={i} className="bg-indigo-100/60 text-indigo-900 px-1.5 py-0.5 rounded text-[9.5px] font-bold">
                                              {c}
                                            </span>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Change Password settings & Integrations webhooks */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-4">
                      <div className="border-b border-gray-100 pb-2.5">
                        <h4 className="font-extrabold text-[#004173] text-sm">
                          LMS Master System settings
                        </h4>
                        <p className="text-[10.5px] text-gray-400">
                          Update master system credential parameters safely.
                        </p>
                      </div>

                      <form onSubmit={handleChangePassword} className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">
                              Current Core Pass
                            </label>
                            <input
                              type="password"
                              value={currentPassChange}
                              onChange={(e) => setCurrentPassChange(e.target.value)}
                              placeholder="admin123"
                              className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2491bf]"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">
                              New Core Pass
                            </label>
                            <input
                              type="password"
                              value={newPassChange}
                              onChange={(e) => setNewPassChange(e.target.value)}
                              placeholder="New password"
                              className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2491bf]"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">
                              Confirm Pass
                            </label>
                            <input
                              type="password"
                              value={confirmPassChange}
                              onChange={(e) => setConfirmPassChange(e.target.value)}
                              placeholder="Verify"
                              className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2491bf]"
                              required
                            />
                          </div>
                        </div>
                        <button
                          type="submit"
                          className="bg-[#004173] hover:bg-[#2491bf] text-white text-xs px-5 py-2.5 rounded-xl font-bold transition flex-shrink-0 cursor-pointer h-[38px] flex items-center justify-center mt-2"
                        >
                          Save Password
                        </button>
                      </form>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-4">
                      <div className="border-b border-gray-100 pb-2.5">
                        <h4 className="font-extrabold text-[#004173] text-sm">
                          Google Sheets Synchronization
                        </h4>
                        <p className="text-[10.5px] text-gray-400">
                          Configure live Apps Script deployment webhooks.
                        </p>
                      </div>

                      <div className="space-y-3.5">
                        <label className="block text-xs font-semibold text-gray-655">Google sheets webhook macro deployment url</label>
                        <input
                          type="text"
                          value={appsScriptUrl}
                          onChange={(e) => setAppsScriptUrl(e.target.value)}
                          placeholder="e.g. https://script.google.com/macros/s/.../exec"
                          className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2491bf]"
                        />

                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="check-synclive"
                            checked={autoSheetsSync}
                            onChange={(e) => setAutoSheetsSync(e.target.checked)}
                            className="rounded text-[#004173]"
                          />
                          <label htmlFor="check-synclive" className="text-xs font-semibold text-gray-500 cursor-pointer select-none">
                            Enable live real-time sheets synchronization.
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION B: STUDENTS (DASHBOARD SUMMARY & ROSTER PROFILE) */}
              {sidebarActiveItem === 'students' && (() => {
                // Inline helper to assign instructors and classes dynamically based on course & batch
                const getInstructorAndClass = (r: EnrolmentRecord) => {
                  const course = r.course || '';
                  const batchName = r.batchName || 'Batch-3-2026';
                  
                  let instructor = 'Muhammad Asad';
                  let classStr = `Class-WD(F)-Hall 1-${batchName}-Morning`;
                  
                  if (course.includes('Network') || course.includes('Cyber')) {
                    instructor = 'Muhammad Haider Tallal';
                    classStr = `Class-AN&CS-Hall 2-${batchName}-Evening`;
                  } else if (course.includes('Freelancing') || course.includes('Digital Marketing') || course.includes('Social Media')) {
                    instructor = r.lastName.length % 2 === 0 ? 'Muhammad Zeeshan' : 'Ushna Shahid';
                    classStr = `Class-SMM-Hall 1-${batchName}-Morning`;
                  } else if (course.includes('AI') || course.includes('Automation')) {
                    instructor = 'Maimoona Rasheed';
                    classStr = `Class-AA-Hall 2-${batchName}-Morning`;
                  } else if (course.includes('eBay') || course.includes('TikTok') || course.includes('E-Commerce') || course.includes('Commerce')) {
                    instructor = 'Faizan Ali';
                    classStr = `Class-ECM-Hall 4-${batchName}-Evening`;
                  } else if (course.includes('Graphic') || course.includes('Video')) {
                    instructor = 'Anila Rajpout';
                    classStr = `Class-GDV-Hall 1-${batchName}-Morning`;
                  } else if (course.includes('Web Development Backend')) {
                    instructor = 'Muhammad Zeeshan';
                    classStr = `Class-WDB-Hall 2-${batchName}-Evening`;
                  } else if (course.includes('Mobile')) {
                    instructor = 'Muhammad Asad';
                    classStr = `Class-MAD-Hall 1-${batchName}-Morning`;
                  }

                  // Instructor override if custom name is entered on course creation/edition
                  const matchedCourse = courses.find(c => c.name.toLowerCase() === course.toLowerCase());
                  if (matchedCourse && matchedCourse.instructorName) {
                    instructor = matchedCourse.instructorName;
                  }
                  
                  const suffix = r.status === 'Enrolled' || r.status === 'Verified' ? '[Enrolled]' : '[Process]';
                  return {
                    instructor,
                    classStr: `${classStr} ${suffix}`
                  };
                };

                const isMockSummary = records.length <= 3 && !currentUser;
                const totalStudentsVal = isMockSummary ? 1445 : visibleRecords.length;
                
                // Filter summary records based on batch
                const filteredSummaryRecs = summaryBatchFilter === 'All' 
                  ? (isMockSummary ? records : visibleRecords)
                  : visibleRecords.filter(r => {
                      const recordBatch = r.batchName || (batches[0]?.name || 'Batch-14 (Summer 2026)');
                      return recordBatch === summaryBatchFilter || r.batchId === summaryBatchFilter;
                    });
                
                // Calculate / simulate metrics dynamically
                let mult = 1.0;
                if (summaryBatchFilter !== 'All') {
                  // Generate a deterministic and beautiful multiplier between 0.3 and 0.7 based on the select batch identifier
                  let hash = 0;
                  for (let i = 0; i < summaryBatchFilter.length; i++) {
                    hash = summaryBatchFilter.charCodeAt(i) + ((hash << 5) - hash);
                  }
                  mult = 0.3 + (Math.abs(hash % 41) / 100); 
                }
                
                const summaryBlockData = isMockSummary ? {
                  total: Math.round(1445 * mult),
                  active: Math.round(559 * mult),
                  military: Math.round(183 * mult),
                  civil: Math.round(376 * mult),
                  male: Math.round(295 * mult),
                  female: Math.round(264 * mult),
                  civTotal: Math.round(376 * mult),
                  civActive: Math.round((376 * mult) - (summaryBatchFilter === 'All' ? 1 : 0)),
                  civInactive: summaryBatchFilter === 'All' ? 1 : 0,
                  milTotal: Math.round(183 * mult),
                  milActive: Math.round(183 * mult),
                  milInactive: 0,
                  dropout: summaryBatchFilter === 'All' ? 25 : Math.round(25 * mult),
                  inactive: summaryBatchFilter === 'All' ? 1 : 0
                } : (() => {
                  const total = filteredSummaryRecs.length;
                  const activeRecs = filteredSummaryRecs.filter(r => r.status === 'Enrolled' || r.status === 'Verified');
                  const active = activeRecs.length;
                  
                  const militaryRecs = filteredSummaryRecs.filter(r => r.civilStatus === 'Military');
                  const militaryActive = militaryRecs.filter(r => r.status === 'Enrolled' || r.status === 'Verified').length;
                  
                  const civilRecs = filteredSummaryRecs.filter(r => r.civilStatus === 'Civil');
                  const civilActive = civilRecs.filter(r => r.status === 'Enrolled' || r.status === 'Verified').length;
                  
                  const maleActive = activeRecs.filter(r => r.gender === 'Male').length;
                  const femaleActive = activeRecs.filter(r => r.gender === 'Female').length;
                  
                  const civInactive = civilRecs.length - civilActive;
                  const milInactive = militaryRecs.length - militaryActive;
                  
                  const inactive = filteredSummaryRecs.filter(r => r.status === 'Processing').length;
                  const dropout = filteredSummaryRecs.filter(r => r.status === 'Pending').length;
                  
                  return {
                    total,
                    active,
                    military: militaryActive,
                    civil: civilActive,
                    male: maleActive,
                    female: femaleActive,
                    civTotal: civilRecs.length,
                    civActive: civilActive,
                    civInactive,
                    milTotal: militaryRecs.length,
                    milActive: militaryActive,
                    milInactive,
                    dropout,
                    inactive
                  };
                })();

                // Calculate Courses Enrolled Stats
                const courseCountsMap: { [key: string]: number } = {};
                courses.forEach(c => { courseCountsMap[c.name] = 0; });
                filteredSummaryRecs.forEach(r => {
                  if (r.status === 'Enrolled' || r.status === 'Verified') {
                    courseCountsMap[r.course] = (courseCountsMap[r.course] || 0) + 1;
                  }
                });

                const rawCourseCounts = Object.keys(courseCountsMap)
                  .map(name => ({
                    name: name.length > 20 ? name.substring(0, 18) + '...' : name,
                    fullName: name,
                    Students: courseCountsMap[name]
                  }))
                  .filter(item => item.Students > 0);

                const displayCourseCounts = (rawCourseCounts.length === 0 && isMockSummary) ? [
                  { name: 'Network & Cyber', Students: Math.round(183 * mult) },
                  { name: 'Freelancing & DM', Students: Math.round(135 * mult) },
                  { name: 'Web Dev Frontend', Students: Math.round(98 * mult) },
                  { name: 'AI Automation', Students: Math.round(64 * mult) },
                  { name: 'E-Commerce', Students: Math.round(47 * mult) },
                  { name: 'Graphic Design', Students: Math.round(32 * mult) }
                ] : rawCourseCounts;

                // Profile filtering logic
                const filteredProfileRecords = visibleRecords.filter((r, index) => {
                  // 1. Batch Filter
                  const matchedBatch = filterBatch === 'All' || 
                    (r.batchName === filterBatch || r.batchId === filterBatch);
                  if (!matchedBatch) return false;
                  
                  // 2. Status Filter
                  if (filterStatus === 'Enrolled') {
                    if (!(r.status === 'Enrolled' || r.status === 'Verified')) return false;
                  } else if (filterStatus === 'In Process') {
                    if (!(r.status === 'Processing' || r.status === 'Pending')) return false;
                  }
                  
                  // 3. Quota Filter
                  if (filterCivilStatus !== 'All') {
                    if (filterCivilStatus === 'Civilian' && r.civilStatus !== 'Civil') return false;
                    if (filterCivilStatus === 'Military' && r.civilStatus !== 'Military') return false;
                  }
                  
                  // 4. Search SR # (or Serial Index)
                  const srIndex = (index + 1).toString();
                  if (searchSRQuery.trim()) {
                    const srVal = searchSRQuery.toLowerCase().trim();
                    if (!srIndex.includes(srVal) && !r.regId.toLowerCase().includes(srVal)) return false;
                  }
                  
                  // 5. Search Name
                  if (searchNameQuery.trim()) {
                    const nameVal = searchNameQuery.toLowerCase().trim();
                    const fullName = `${r.firstName} ${r.lastName}`.toLowerCase();
                    if (!fullName.includes(nameVal)) return false;
                  }
                  
                  // 6. Search Email
                  if (searchEmailQuery.trim()) {
                    const emailVal = searchEmailQuery.toLowerCase().trim();
                    if (!r.email.toLowerCase().includes(emailVal)) return false;
                  }
                  
                  // 7. Search Instructor
                  if (searchInstructorQuery.trim()) {
                    const instVal = searchInstructorQuery.toLowerCase().trim();
                    const details = getInstructorAndClass(r);
                    if (!details.instructor.toLowerCase().includes(instVal)) return false;
                  }
                  
                  return true;
                });

                // Profile Pagination
                const totalItems = filteredProfileRecords.length;
                const totalPages = Math.ceil(totalItems / studentsPerPage) || 1;
                const safePage = Math.min(studentsPage, totalPages);
                const startIndex = (safePage - 1) * studentsPerPage;
                const endIndex = startIndex + studentsPerPage;
                const paginatedRecords = filteredProfileRecords.slice(startIndex, endIndex);

                return (
                  <div className="space-y-6">
                    {studentsSubView === 'summary' ? (
                      /* STUDENT SUMMARY VIEW */
                      <div className="space-y-6 animate-fade-in-quick">
                        {/* Title & Live Status */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-[#004173]/5 rounded-xl text-[#004173]">
                              <Users className="w-5 h-5" />
                            </div>
                            <div>
                              <h3 className="text-xl font-black text-gray-950">Student Summary</h3>
                              <p className="text-xs text-gray-400">
                                Overview of academic demographics, batch sizes, student classifications, and military quotas.
                              </p>
                            </div>
                          </div>

                          {/* Live Data Badge */}
                          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-4 py-1.5 rounded-full text-xs font-black border border-emerald-100 shadow-xs">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 block relative">
                              <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping" />
                            </span>
                            <span>Live Data Grid</span>
                          </div>
                        </div>

                        {/* Batches toggles */}
                        <div className="flex flex-wrap gap-2 py-1">
                          <button
                            type="button"
                            onClick={() => setSummaryBatchFilter('All')}
                            className={`px-4 py-2 text-xs font-extrabold rounded-lg transition-all duration-150 cursor-pointer shadow-2xs ${
                              summaryBatchFilter === 'All'
                                ? 'bg-[#004173] text-white'
                                : 'bg-white text-gray-600 border border-gray-100 hover:bg-slate-50'
                            }`}
                          >
                            All Batches
                          </button>
                          {batches.map((b) => (
                            <button
                              key={b.id}
                              type="button"
                              onClick={() => setSummaryBatchFilter(b.name)}
                              className={`px-4 py-2 text-xs font-extrabold rounded-lg transition-all duration-155 cursor-pointer shadow-2xs ${
                                summaryBatchFilter === b.name
                                  ? 'bg-[#004173] text-white'
                                  : 'bg-white text-gray-600 border border-gray-100 hover:bg-slate-50'
                              }`}
                            >
                              {b.name}
                            </button>
                          ))}
                        </div>

                        {/* 5 Upper Cards Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                          {/* Currently Enrolled */}
                          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs flex items-center justify-between hover:border-gray-200 transition duration-150">
                            <div className="space-y-1">
                              <span className="text-[10px] font-black tracking-wider text-gray-400 uppercase">
                                Currently Enrolled
                              </span>
                              <div className="text-2xl font-black text-gray-955 font-mono">
                                {summaryBlockData.active}
                              </div>
                              <span className="text-[10px] font-extrabold text-[#004173] block">
                                Active Students
                              </span>
                            </div>
                            <div className="p-3 bg-blue-50 text-[#004173] rounded-xl animate-fade-in-quick">
                              <Users className="w-5 h-5" />
                            </div>
                          </div>

                          {/* Military Students */}
                          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs flex items-center justify-between hover:border-gray-200 transition duration-150">
                            <div className="space-y-1">
                              <span className="text-[10px] font-black tracking-wider text-gray-400 uppercase">
                                Military Students
                              </span>
                              <div className="text-2xl font-black text-gray-955 font-mono">
                                {summaryBlockData.military}
                              </div>
                              <span className="text-[10px] font-extrabold text-teal-650 block">
                                {totalStudentsVal > 0 ? Math.round((summaryBlockData.military / totalStudentsVal) * 100) : 0}% of total
                              </span>
                            </div>
                            <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
                              <Shield className="w-5 h-5" />
                            </div>
                          </div>

                          {/* Civil Students */}
                          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs flex items-center justify-between hover:border-gray-200 transition duration-150">
                            <div className="space-y-1">
                              <span className="text-[10px] font-black tracking-wider text-gray-400 uppercase">
                                Civil Students
                              </span>
                              <div className="text-2xl font-black text-gray-955 font-mono">
                                {summaryBlockData.civil}
                              </div>
                              <span className="text-[10px] font-extrabold text-[#003865] block">
                                {totalStudentsVal > 0 ? Math.round((summaryBlockData.civil / totalStudentsVal) * 100) : 0}% of total
                              </span>
                            </div>
                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                              <Building className="w-5 h-5" />
                            </div>
                          </div>

                          {/* Male Students */}
                          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs flex items-center justify-between hover:border-gray-200 transition duration-150">
                            <div className="space-y-1">
                              <span className="text-[10px] font-black tracking-wider text-gray-400 uppercase">
                                Male Students
                              </span>
                              <div className="text-2xl font-black text-gray-955 font-mono">
                                {summaryBlockData.male}
                              </div>
                              <span className="text-[10px] font-extrabold text-emerald-650 block">
                                {totalStudentsVal > 0 ? Math.round((summaryBlockData.male / totalStudentsVal) * 100) : 0}% of total
                              </span>
                            </div>
                            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                              <User className="w-5 h-5" />
                            </div>
                          </div>

                          {/* Female Students */}
                          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs flex items-center justify-between hover:border-gray-200 transition duration-150">
                            <div className="space-y-1">
                              <span className="text-[10px] font-black tracking-wider text-gray-400 uppercase">
                                Female Students
                              </span>
                              <div className="text-2xl font-black text-gray-955 font-mono">
                                {summaryBlockData.female}
                              </div>
                              <span className="text-[10px] font-extrabold text-pink-600 block">
                                {totalStudentsVal > 0 ? Math.round((summaryBlockData.female / totalStudentsVal) * 100) : 0}% of total
                              </span>
                            </div>
                            <div className="p-3 bg-pink-50 text-pink-600 rounded-xl">
                              <User className="w-5 h-5" />
                            </div>
                          </div>
                        </div>

                        {/* Charts Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Student Categories (Donut) */}
                          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
                            <h4 className="text-xs font-black text-gray-900 mb-4 tracking-tight uppercase">
                              Student Categories
                            </h4>
                            <div className="h-64 relative flex items-center justify-center">
                              <ResponsiveContainer width="100%" height="100%">
                                <RechartsPieChart>
                                  <Pie
                                    data={[
                                      { name: 'Military', value: summaryBlockData.military || 0 },
                                      { name: 'Civil', value: summaryBlockData.civil || 0 }
                                    ].filter(d => d.value > 0)}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={95}
                                    paddingAngle={4}
                                    dataKey="value"
                                  >
                                    <Cell fill="#2491bf" />
                                    <Cell fill="#003865" />
                                  </Pie>
                                  <RechartsTooltip formatter={(value) => [`${value} Students`, 'Count']} />
                                </RechartsPieChart>
                              </ResponsiveContainer>
                              {/* Inner Content Label */}
                              <div className="absolute inset-x-0 inset-y-0 flex flex-col items-center justify-center pointer-events-none mt-2">
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Active</span>
                                <span className="text-3xl font-black text-[#003865] font-mono leading-none">
                                  {summaryBlockData.military + summaryBlockData.civil}
                                </span>
                                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">Recs</span>
                              </div>
                            </div>

                            {/* Legend below donut */}
                            <div className="flex gap-6 justify-center mt-3">
                              <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-[#2491bf] block" />
                                <span className="text-xs text-gray-600 font-extrabold animate-fade-in-quick">
                                  Military ({totalStudentsVal > 0 ? Math.round((summaryBlockData.military / totalStudentsVal) * 100) : 0}%)
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-[#003865] block" />
                                <span className="text-xs text-gray-600 font-extrabold animate-fade-in-quick">
                                  Civil ({totalStudentsVal > 0 ? Math.round((summaryBlockData.civil / totalStudentsVal) * 100) : 0}%)
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Course Vs Students Enrolled (Bar) */}
                          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
                            <h4 className="text-xs font-black text-gray-900 mb-4 tracking-tight uppercase">
                              Course Vs Students Enrolled
                            </h4>
                            <div className="h-64">
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                  layout="vertical"
                                  data={displayCourseCounts}
                                  margin={{ left: 10, right: 30, top: 0, bottom: 0 }}
                                >
                                  <XAxis type="number" hide />
                                  <YAxis 
                                    type="category" 
                                    dataKey="name" 
                                    stroke="#1e293b" 
                                    fontSize={10} 
                                    fontWeight="bold" 
                                    width={110} 
                                    tickLine={false}
                                    axisLine={false}
                                  />
                                  <RechartsTooltip formatter={(value) => [`${value} Enrolled`, 'Students']} />
                                  <Bar 
                                    dataKey="Students" 
                                    fill="#2491bf" 
                                    radius={[0, 6, 6, 0]} 
                                    barSize={16}
                                    label={{ position: 'right', fill: '#0a0a0a', fontSize: 10, fontWeight: 'black' }}
                                  />
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                        </div>

                        {/* Middle Breakdown Rows */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Military Students Breakdown */}
                          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs">
                            <h4 className="text-xs font-black text-gray-900 mb-3 uppercase tracking-wider pb-3 border-b border-gray-50 flex items-center gap-2">
                              <Shield className="w-4 h-4 text-[#2491bf]" />
                              <span>Military Students Breakdown</span>
                            </h4>
                            <div className="space-y-2.5">
                              <div className="flex justify-between items-center py-1">
                                <span className="text-xs text-gray-550 font-extrabold">Total Military Students</span>
                                <span className="text-xs font-black text-gray-955 font-mono bg-slate-50 px-2.5 py-1 rounded border border-slate-100/50">{summaryBlockData.milTotal}</span>
                              </div>
                              <div className="flex justify-between items-center bg-emerald-50/50 px-3 py-1.5 rounded-lg border border-emerald-100/30">
                                <span className="text-xs text-emerald-800 font-extrabold">Active Military Students</span>
                                <span className="text-xs font-black text-emerald-800 font-mono bg-emerald-100 pl-2 pr-2.5 py-0.5 rounded-full">{summaryBlockData.milActive}</span>
                              </div>
                              <div className="flex justify-between items-center py-1">
                                <span className="text-xs text-gray-550 font-extrabold">Inactive Military Students</span>
                                <span className="text-xs font-black text-gray-700 font-mono ">{summaryBlockData.milInactive}</span>
                              </div>
                            </div>
                          </div>

                          {/* Civilian Students Breakdown */}
                          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs">
                            <h4 className="text-xs font-black text-gray-900 mb-3 uppercase tracking-wider pb-3 border-b border-gray-50 flex items-center gap-2">
                              <Building className="w-4 h-4 text-[#004173]" />
                              <span>Civilian Students Breakdown</span>
                            </h4>
                            <div className="space-y-2.5">
                              <div className="flex justify-between items-center py-1">
                                <span className="text-xs text-gray-550 font-extrabold">Total Civilian Students</span>
                                <span className="text-xs font-black text-gray-955 font-mono bg-slate-50 px-2.5 py-1 rounded border border-slate-100/50">{summaryBlockData.civTotal}</span>
                              </div>
                              <div className="flex justify-between items-center bg-emerald-50/50 px-3 py-1.5 rounded-lg border border-emerald-100/30">
                                <span className="text-xs text-emerald-800 font-extrabold">Active Civilian Students</span>
                                <span className="text-xs font-black text-emerald-800 font-mono bg-emerald-100 pl-2 pr-2.5 py-0.5 rounded-full">{summaryBlockData.civActive}</span>
                              </div>
                              <div className="flex justify-between items-center py-1">
                                <span className="text-xs text-gray-550 font-extrabold">Inactive Civilian Students</span>
                                <span className="text-xs font-black text-gray-700 font-mono">{summaryBlockData.civInactive}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Bottom row: Overall Student Statistics */}
                        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs">
                          <h4 className="text-xs font-black text-gray-905 mb-4 uppercase tracking-widest">
                            Overall Student Statistics
                          </h4>
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-slate-50/60 rounded-xl border border-slate-100 animate-fade-in-quick">
                            {/* Total Students */}
                            <div className="bg-white rounded-xl border border-gray-100/80 p-4 shadow-3xs">
                              <span className="block text-[10px] font-black tracking-wider text-gray-400 uppercase mb-1">
                                Total Students
                              </span>
                              <div className="text-2xl font-black text-slate-800 font-mono">
                                {summaryBlockData.total}
                              </div>
                              <p className="text-[10px] text-gray-400 mt-1">Global log index</p>
                            </div>

                            {/* Currently Enrolled */}
                            <div className="bg-emerald-50 rounded-xl border border-emerald-100/80 p-4 shadow-3xs">
                              <span className="block text-[10px] font-black tracking-wider text-emerald-700 uppercase mb-1">
                                Currently Enrolled
                              </span>
                              <div className="text-2xl font-black text-emerald-800 font-mono">
                                {summaryBlockData.active}
                              </div>
                              <p className="text-[10px] text-emerald-650 mt-1">Active in programs</p>
                            </div>

                            {/* Inactive Students */}
                            <div className="bg-amber-50 rounded-xl border border-amber-100/85 p-4 shadow-3xs">
                              <span className="block text-[10px] font-black tracking-wider text-amber-700 uppercase mb-1">
                                Inactive Students
                              </span>
                              <div className="text-2xl font-black text-amber-800 font-mono">
                                {summaryBlockData.inactive}
                              </div>
                              <p className="text-[10px] text-amber-600 mt-1">Processing in queues</p>
                            </div>

                            {/* Dropout Students */}
                            <div className="bg-rose-50 rounded-xl border border-rose-100/85 p-4 shadow-3xs">
                              <span className="block text-[10px] font-black tracking-wider text-rose-700 uppercase mb-1">
                                Dropout Students
                              </span>
                              <div className="text-2xl font-black text-rose-800 font-mono">
                                {summaryBlockData.dropout}
                              </div>
                              <p className="text-[10px] text-rose-600 mt-1">Discontinued roster</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* STUDENT PROFILE VIEW */
                      <div className="space-y-6 animate-fade-in-quick">
                        {/* Brand Title Header with Add New + Button on Right */}
                        <div className="bg-[#004173] text-white p-4 px-5 rounded-2xl flex justify-between items-center shadow shadow-[#004173]/15">
                          <div className="flex items-center gap-2.5">
                            <Users className="w-5 h-5" />
                            <span className="font-extrabold uppercase tracking-widest text-[#9cd8f4] text-xs">Students Registry</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setIsInquiryEnrollModalOpen(true)}
                            className="bg-emerald-550 hover:bg-emerald-600 text-white font-bold px-4 py-2 rounded-xl text-xs transition border bg-emerald-500 border-transparent shadow shadow-emerald-500/10 flex items-center gap-1.5 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add New +</span>
                          </button>
                        </div>

                        {/* Roster Layout Filter Sections */}
                        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
                          {/* Filter Row 1: Batches */}
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
                            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider w-20">Batches:</span>
                            <div className="flex flex-wrap gap-1.5">
                              <button
                                type="button"
                                onClick={() => { setFilterBatch('All'); setStudentsPage(1); }}
                                className={`px-3.5 py-1.5 text-xs font-black rounded-lg transition-all duration-155 cursor-pointer shadow-3xs ${
                                  filterBatch === 'All'
                                    ? 'bg-[#004173] text-white font-black'
                                    : 'bg-gray-100/80 text-gray-500 hover:bg-gray-100'
                                }`}
                              >
                                All Batches
                              </button>
                             {batches.map((b) => (
                                <button
                                  key={b.id}
                                  type="button"
                                  onClick={() => { setFilterBatch(b.name); setStudentsPage(1); }}
                                  className={`px-3.5 py-1.5 text-xs font-black rounded-lg transition-all duration-155 cursor-pointer shadow-3xs ${
                                    filterBatch === b.name
                                      ? 'bg-[#004173] text-white font-black'
                                      : 'bg-gray-100/80 text-gray-500 hover:bg-gray-100'
                                  }`}
                                >
                                  {b.name}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Filter Row 2: Status */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
                              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider w-20">Statuses:</span>
                              <div className="flex flex-wrap gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => { setFilterStatus('All'); setStudentsPage(1); }}
                                  className={`px-3.5 py-1.5 text-xs font-black rounded-lg transition-all duration-155 cursor-pointer shadow-3xs ${
                                    filterStatus === 'All'
                                      ? 'bg-[#004173] text-white font-black'
                                      : 'bg-gray-100/80 text-gray-500 hover:bg-gray-100'
                                  }`}
                                >
                                  All Students ({records.length})
                                </button>
                                <button
                                  type="button"
                                  onClick={() => { setFilterStatus('Enrolled'); setStudentsPage(1); }}
                                  className={`px-3.5 py-1.5 text-xs font-black rounded-lg transition-all duration-155 cursor-pointer shadow-3xs ${
                                    filterStatus === 'Enrolled'
                                      ? 'bg-[#004173] text-white font-black'
                                      : 'bg-gray-100/80 text-gray-500 hover:bg-gray-100'
                                  }`}
                                >
                                  Enrolled ({records.filter(r => r.status === 'Enrolled' || r.status === 'Verified').length})
                                </button>
                                <button
                                  type="button"
                                  onClick={() => { setFilterStatus('In Process'); setStudentsPage(1); }}
                                  className={`px-3.5 py-1.5 text-xs font-black rounded-lg transition-all duration-155 cursor-pointer shadow-3xs ${
                                    filterStatus === 'In Process'
                                      ? 'bg-[#004173] text-white font-black'
                                      : 'bg-gray-100/80 text-gray-500 hover:bg-gray-100'
                                  }`}
                                >
                                  In Process ({records.filter(r => r.status === 'Processing' || r.status === 'Pending').length})
                                </button>
                              </div>
                            </div>

                            {/* Green Download Button */}
                            <button
                              type="button"
                              onClick={() => {
                                const headers = 'Register ID,First Name,Last Name,Father Name,Mobile,Gender,Course,Laptop,Quota,Payment Plan,Total Fee,Next Dues,Status\n';
                                const rows = records.map(r => {
                                  const calFee = r.totalFee !== undefined ? r.totalFee : calculateTotalFee(r.course, r.laptop, r.civilStatus, r.discount, r.milCategory).total;
                                  return `"${r.regId}","${r.firstName}","${r.lastName}","${r.fatherName || ''}","${r.mobile}","${r.gender}","${r.course}","${r.laptop}","${r.civilStatus}","${r.paymentPlan}",${calFee},"${r.nextDueDate}","${r.status}"`;
                                }).join('\n');
                                const blob = new Blob([headers + rows], { type: 'text/csv' });
                                const url = window.URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.setAttribute('href', url);
                                a.setAttribute('download', 'student_profiles.csv');
                                a.click();
                                showToast('CSV student profile logs downloaded successfully', 'success');
                              }}
                              className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black px-4 py-2 rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Download</span>
                            </button>
                          </div>

                          {/* Filter Row 3: Quota */}
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
                            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider w-20">Quotas:</span>
                            <div className="flex flex-wrap gap-1.5">
                              <button
                                type="button"
                                onClick={() => { setFilterCivilStatus('All'); setStudentsPage(1); }}
                                className={`px-3.5 py-1.5 text-xs font-black rounded-lg transition-all duration-155 cursor-pointer shadow-3xs ${
                                  filterCivilStatus === 'All'
                                    ? 'bg-[#004173] text-white font-black'
                                    : 'bg-gray-100/80 text-gray-500 hover:bg-gray-100'
                                }`}
                              >
                                All Students ({records.length})
                              </button>
                              <button
                                type="button"
                                onClick={() => { setFilterCivilStatus('Civilian'); setStudentsPage(1); }}
                                className={`px-3.5 py-1.5 text-xs font-black rounded-lg transition-all duration-155 cursor-pointer shadow-3xs ${
                                  filterCivilStatus === 'Civilian'
                                    ? 'bg-[#004173] text-white font-black'
                                    : 'bg-gray-100/80 text-gray-500 hover:bg-gray-100'
                                }`}
                              >
                                Civilian ({records.filter(r => r.civilStatus === 'Civil').length})
                              </button>
                              <button
                                type="button"
                                onClick={() => { setFilterCivilStatus('Military'); setStudentsPage(1); }}
                                className={`px-3.5 py-1.5 text-xs font-black rounded-lg transition-all duration-155 cursor-pointer shadow-3xs ${
                                  filterCivilStatus === 'Military'
                                    ? 'bg-[#004173] text-white font-black'
                                    : 'bg-gray-100/80 text-gray-500 hover:bg-gray-100'
                                }`}
                              >
                                Military ({records.filter(r => r.civilStatus === 'Military').length})
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Main Data Grid Table Panel */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 overflow-hidden">
                          <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse font-sans min-w-[1000px]">
                              <thead>
                                {/* Header Names */}
                                <tr className="border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest pb-3">
                                  <th className="pb-3 pl-2 w-16">SR #</th>
                                  <th className="pb-3 w-48">Name</th>
                                  <th className="pb-3 w-52">Email</th>
                                  <th className="pb-3 w-48">Instructor</th>
                                  <th className="pb-3 w-72">Class</th>
                                  <th className="pb-3 w-56">Course</th>
                                  <th className="pb-3 w-28">Category</th>
                                  <th className="pb-3 pr-2 text-right w-24">Action</th>
                                </tr>
                                {/* Search Inputs Beneath Headers */}
                                <tr className="bg-slate-50 border-b border-slate-100">
                                  <td className="py-2 pl-2">
                                    <input 
                                      type="text" 
                                      placeholder="Search SR #" 
                                      value={searchSRQuery}
                                      onChange={(e) => { setSearchSRQuery(e.target.value); setStudentsPage(1); }}
                                      className="w-full bg-white border border-gray-200 rounded p-1 text-[10px] font-black focus:outline-none focus:border-[#2491bf]"
                                    />
                                  </td>
                                  <td className="py-2 pr-2">
                                    <input 
                                      type="text" 
                                      placeholder="Search Name" 
                                      value={searchNameQuery}
                                      onChange={(e) => { setSearchNameQuery(e.target.value); setStudentsPage(1); }}
                                      className="w-full bg-white border border-gray-200 rounded p-1 text-[10px] font-black focus:outline-none focus:border-[#2491bf]"
                                    />
                                  </td>
                                  <td className="py-2 pr-2">
                                    <input 
                                      type="text" 
                                      placeholder="Search Email" 
                                      value={searchEmailQuery}
                                      onChange={(e) => { setSearchEmailQuery(e.target.value); setStudentsPage(1); }}
                                      className="w-full bg-white border border-gray-200 rounded p-1 text-[10px] font-black focus:outline-none focus:border-[#2491bf]"
                                    />
                                  </td>
                                  <td className="py-2 pr-2">
                                    <input 
                                      type="text" 
                                      placeholder="Search Instructor" 
                                      value={searchInstructorQuery}
                                      onChange={(e) => { setSearchInstructorQuery(e.target.value); setStudentsPage(1); }}
                                      className="w-full bg-white border border-gray-200 rounded p-1 text-[10px] font-black focus:outline-none focus:border-[#2491bf]"
                                    />
                                  </td>
                                  <td className="py-2" />
                                  <td className="py-2" />
                                  <td className="py-2" />
                                  <td className="py-2 pr-2" />
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-50 text-xs text-gray-700">
                                {paginatedRecords.length === 0 ? (
                                  <tr>
                                    <td colSpan={8} className="py-8 text-center text-sm text-gray-400 font-bold">
                                      No student records match the search filters
                                    </td>
                                  </tr>
                                ) : (
                                  paginatedRecords.map((r, i) => {
                                    // Find original index for SR #
                                    const originalIndex = records.findIndex(rec => rec.regId === r.regId) + 1;
                                    const details = getInstructorAndClass(r);
                                    const calFee = r.totalFee !== undefined ? r.totalFee : calculateTotalFee(r.course, r.laptop, r.civilStatus, r.discount, r.milCategory).total;

                                    return (
                                      <tr key={r.regId} className="hover:bg-slate-50/50 transition">
                                        {/* SR # */}
                                        <td className="py-3.5 pl-2 font-mono font-black text-gray-500">{originalIndex}</td>
                                        
                                        {/* Name */}
                                        <td className="py-3.5">
                                          <div className="font-extrabold text-[#004173] text-[12px]">{r.firstName} {r.lastName}</div>
                                          <div className="text-[9.5px] text-gray-400 font-mono mt-0.5 animate-fade-in-quick">CNIC: {r.cnic}</div>
                                        </td>
                                        
                                        {/* Email */}
                                        <td className="py-3.5 text-gray-500 font-medium truncate max-w-[190px]" title={r.email}>
                                          {r.email}
                                          <div className="text-[9.5px] text-gray-400 font-medium mt-0.5">Mob: {r.mobile}</div>
                                        </td>
                                        
                                        {/* Instructor */}
                                        <td className="py-3.5 font-bold text-gray-805">
                                          {details.instructor}
                                        </td>
                                        
                                        {/* Class */}
                                        <td className="py-3.5 text-left font-semibold text-gray-600 font-mono text-[10.5px]">
                                          <span className="p-1 px-1.5 rounded bg-slate-100 border border-slate-200/50 block w-fit truncate max-w-[270px]" title={details.classStr}>
                                            {details.classStr}
                                          </span>
                                        </td>
                                        
                                        {/* Course */}
                                        <td className="py-3.5 text-left">
                                          <div className="font-black text-gray-805 truncate max-w-[180px]" title={r.course}>{r.course}</div>
                                          <div className="text-[9.5px] text-indigo-505 font-black mt-0.5 font-mono">Paid: {calFee.toLocaleString()} PKR</div>
                                        </td>
                                        
                                        {/* Category */}
                                        <td className="py-3.5">
                                          <span className={`px-2.5 py-1 rounded font-black text-[9.5px] uppercase border ${
                                            r.civilStatus === 'Civil' 
                                              ? 'bg-blue-50 text-blue-700 border-blue-100' 
                                              : 'bg-purple-50 text-purple-700 border-purple-100'
                                          }`}>
                                            {r.civilStatus === 'Civil' ? 'Civilian' : 'Military'}
                                          </span>
                                        </td>
                                        
                                        {/* Settings Actions */}
                                        <td className="py-3.5 text-right pr-2">
                                          <div className="flex gap-2 justify-end items-center">
                                            {/* View Voucher Button (Eye icon) */}
                                            <button
                                              type="button"
                                              onClick={() => {
                                                setVoucherRecord(r);
                                                handleMovePendingToProcessing(r);
                                                setInvoiceBooking(null);
                                                setTimeout(() => window.print(), 150);
                                              }}
                                              className="p-1.5 bg-[#004173] text-white hover:bg-[#003055] rounded-lg transition duration-150 cursor-pointer"
                                              title="Print/View Fee Receipt Voucher"
                                            >
                                              <Eye className="w-3.5 h-3.5" />
                                            </button>
                                            
                                            {/* Edit Button (Pencil icon) */}
                                            <button
                                              type="button"
                                              onClick={() => handleOpenEdit(r)}
                                              className="p-1.5 bg-blue-500 text-white hover:bg-blue-600 rounded-lg transition duration-155 cursor-pointer"
                                              title="Edit Student Roster Details"
                                            >
                                              <Edit2 className="w-3.5 h-3.5" />
                                            </button>
                                            
                                            {/* Delete Button (Trash icon) */}
                                            <button
                                              type="button"
                                              onClick={() => handleDeleteRecord(r.regId)}
                                              className="p-1.5 bg-rose-500 text-white hover:bg-rose-600 rounded-lg transition duration-200 cursor-pointer"
                                              title="Delete Student enrollment profile"
                                            >
                                              <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                          </div>
                                        </td>
                                      </tr>
                                    );
                                  })
                                )}
                              </tbody>
                            </table>
                          </div>

                          {/* Interactive Pagination Controls Bar */}
                          <div className="mt-5 pt-4 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-3">
                            {/* Showing Entries Label */}
                            <div className="text-xs font-bold text-gray-500">
                              Showing {totalItems > 0 ? startIndex + 1 : 0} - {Math.min(endIndex, totalItems)} of {totalItems} candidates
                            </div>

                            {/* Navigation Buttons Pager */}
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                disabled={safePage === 1}
                                onClick={() => setStudentsPage(p => Math.max(1, p - 1))}
                                className="p-2 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 disabled:opacity-40 transition cursor-pointer"
                              >
                                <ArrowLeft className="w-3.5 h-3.5 text-gray-600" />
                              </button>

                              {/* Dynamic page keys */}
                              {Array.from({ length: totalPages }, (_, k) => k + 1)
                                .filter(pageNum => {
                                  return pageNum === 1 || pageNum === totalPages || Math.abs(pageNum - safePage) <= 1;
                                })
                                .map((pageNum, idx, arr) => {
                                  const prev = arr[idx - 1];
                                  const hasGap = prev && pageNum - prev > 1;

                                  return (
                                    <React.Fragment key={pageNum}>
                                      {hasGap && <span className="text-gray-400 font-bold px-1 text-xs">...</span>}
                                      <button
                                        type="button"
                                        onClick={() => setStudentsPage(pageNum)}
                                        className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all ${
                                          safePage === pageNum
                                            ? 'bg-[#004173] text-white shadow-2xs'
                                            : 'bg-white text-gray-650 border border-gray-200 hover:bg-slate-50'
                                        }`}
                                      >
                                        {pageNum}
                                      </button>
                                    </React.Fragment>
                                  );
                                })}

                              <button
                                type="button"
                                disabled={safePage === totalPages}
                                onClick={() => setStudentsPage(p => Math.min(totalPages, p + 1))}
                                className="p-2 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 disabled:opacity-40 transition cursor-pointer"
                              >
                                <ArrowRight className="w-3.5 h-3.5 text-gray-600" />
                              </button>
                            </div>

                            {/* Per Page Select & Go To Input */}
                            <div className="flex flex-wrap items-center gap-3">
                              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                                <span>Per page</span>
                                <select 
                                  value={studentsPerPage} 
                                  onChange={(e) => {
                                    setStudentsPerPage(Number(e.target.value));
                                    setStudentsPage(1);
                                  }}
                                  className="p-1 px-1.5 bg-white border border-gray-200 rounded cursor-pointer font-bold focus:outline-none focus:border-[#2491bf]"
                                >
                                  <option value={10}>10</option>
                                  <option value={20}>20</option>
                                  <option value={50}>50</option>
                                  <option value={100}>100</option>
                                </select>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <span className="text-[11px] text-gray-500 font-extrabold">Go to</span>
                                <input 
                                  type="number" 
                                  min={1} 
                                  max={totalPages} 
                                  value={safePage} 
                                  onChange={(e) => {
                                    const val = Number(e.target.value);
                                    if (val >= 1 && val <= totalPages) {
                                      setStudentsPage(val);
                                    }
                                  }}
                                  className="w-12 p-1 text-center bg-white border border-gray-200 rounded text-xs font-bold focus:outline-none focus:border-[#2491bf]"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* SECTION C: INQUIRY (SEPARATE CARDS GRID LOG) */}
              {sidebarActiveItem === 'inquiry' && (
                <InquiryPanel
                  records={records}
                  courses={courses}
                  currentUser={currentUser}
                  onApproveInquiry={handleApproveInquiry}
                  onOpenEdit={handleOpenEdit}
                  onDeleteRecord={handleDeleteRecord}
                  onOpenNewEnrollment={(courseName) => {
                    setPreselectedCourseForModal(courseName || null);
                    setIsInquiryEnrollModalOpen(true);
                  }}
                  calculateTotalFee={calculateTotalFee}
                />
              )}

              {/* SECTION D: STARTUPS INCUBATOR WORKSPACE */}
              {sidebarActiveItem === 'startups' && (
                <StartupPanel currentUser={currentUser} />
              )}

              {/* SECTION D2: SEMINAR HALL / CONFERENCE ROOM BOOKINGS */}
              {sidebarActiveItem === 'hall-bookings' && (
                <HallBookingPanel
                  currentUser={currentUser}
                  bookings={hallBookings}
                  onAddBooking={handleAddHallBooking}
                  onDeleteBooking={handleDeleteHallBooking}
                  onPrintInvoice={handlePrintBookingInvoice}
                />
              )}

              {/* SECTION E: COURSES TRAINING REGISTER CONFIGS */}
              {sidebarActiveItem === 'courses' && (
                <div className="space-y-6">
                  <AttendanceRegistry
                    currentUser={currentUser}
                    records={records}
                    courses={courses}
                    batches={batches}
                    attendanceLogs={attendanceLogs}
                    onSaveAttendanceLogs={handleSaveAttendanceLogs}
                    showToast={showToast}
                  />

                  {currentUser?.role === 'Super Administrator' && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4 animate-fade-in-quick">
                      <div>
                        <h4 className="text-sm font-black text-gray-950 flex items-center gap-2">
                          <BookOpen className="w-4.5 h-4.5 text-[#004173]" />
                          <span>Administrative Configuration Helpers</span>
                        </h4>
                        <p className="text-[10.5px] text-gray-400">
                          Edit tuition base prices, categories, and minimum thresholds. Students and registration systems react immediately to all modifications!
                        </p>
                      </div>

                      <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 text-xs text-blue-800 font-medium">
                        ✏️ Hint: To edit or delete any program, use the Course edit/add panel inside the <strong>Admin Panel</strong> view, or customize values directly within the ledger files. System default courses can also be fully updated or cleared.
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* SECTION F: EMPLOYEES DIRECTORY ACCOUNTS */}
              {sidebarActiveItem === 'employees' && (
                <EmployeePanel
                  employees={employees}
                  courses={courses}
                  currentUser={currentUser}
                  availableRoles={availableRoles}
                  onCreateRole={handleCreateRole}
                  onDeleteRole={handleDeleteRole}
                  onSaveEmployee={handleSaveEmployee}
                  onStartEditEmployee={handleStartEditEmployee}
                  onDeleteEmployee={handleDeleteEmployee}
                  employeeFormUsername={employeeFormUsername}
                  setEmployeeFormUsername={setEmployeeFormUsername}
                  employeeFormPassword={employeeFormPassword}
                  setEmployeeFormPassword={setEmployeeFormPassword}
                  employeeFormRole={employeeFormRole}
                  setEmployeeFormRole={setEmployeeFormRole}
                  employeeFormCourse={employeeFormCourse}
                  setEmployeeFormCourse={setEmployeeFormCourse}
                  editingEmployeeId={editingEmployeeId}
                  onCancelEditEmployee={() => { setEditingEmployeeId(null); setEmployeeFormUsername(''); setEmployeeFormPassword(''); }}
                />
              )}

              {/* SECTION G: LABORATORY INVENTORY CO-WORKING ASSETS */}
              {sidebarActiveItem === 'inventory' && (
                <InventoryPanel />
              )}
            </main>

            {/* NEW ENROLLMENT STAFF REGISTER POPUP MODAL */}
            <NewEnrollmentModal
              isOpen={isInquiryEnrollModalOpen}
              onClose={() => { setIsInquiryEnrollModalOpen(false); setPreselectedCourseForModal(null); }}
              courses={courses}
              currentUser={currentUser}
              preselectedCourse={preselectedCourseForModal}
              calculateTotalFee={calculateTotalFee}
              onSubmit={(data) => {
                const regId = 'ROHI-' + Math.floor(100000 + Math.random() * 900000);
                const fees = calculateTotalFee(data.course, data.laptop, data.civilStatus, data.discount, data.milCategory);
                const matchedBatch = findBatchForCourse(data.course, batches);
                const newRecord: EnrolmentRecord = {
                  ...data,
                  regId,
                  createdAt: new Date().toISOString(),
                  totalFee: fees.total,
                  baseFee: fees.base,
                  laptopFee: fees.laptop,
                  batchId: matchedBatch.batchId,
                  batchName: matchedBatch.batchName,
                  createdByUsername: currentUser?.username || 'self',
                  createdByRole: currentUser?.role || 'student'
                };
                const updated = [...records, newRecord];
                saveRecords(updated);
                if (autoSheetsSync) {
                  syncRecordToSheets(newRecord);
                }
                setIsInquiryEnrollModalOpen(false);
                setPreselectedCourseForModal(null);
                showToast(`Successfully enrolled candidate ${data.firstName} ${data.lastName}!`, 'success');
              }}
            />
          </div>
        )}
      </main>

      {/* ── SECTOR EDIT MODAL (NO PRINT) ── */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 no-print overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative animate-fade-in-quick max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-[#004173] flex items-center gap-1.5">
                <span>✏️ Edit Enrolment Record</span>
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 font-bold text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <div className="bg-blue-50 text-blue-800 text-xs px-3.5 py-1.5 rounded-lg border border-blue-100 mb-4 font-semibold">
              Editing System ID: <strong className="font-mono">{editingRecordId}</strong>
            </div>

            <div className="space-y-4">
              <div className="edit-section-heading">Personal Information System</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="edit-field-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    value={editFirstName}
                    onChange={(e) => setEditFirstName(e.target.value)}
                  />
                </div>
                <div className="edit-field-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    value={editLastName}
                    onChange={(e) => setEditLastName(e.target.value)}
                  />
                </div>
                <div className="edit-field-group">
                  <label>Father's Name</label>
                  <input
                    type="text"
                    value={editFatherName}
                    onChange={(e) => setEditFatherName(e.target.value)}
                  />
                </div>
                <div className="edit-field-group">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    value={editMobile}
                    onChange={(e) => setEditMobile(e.target.value)}
                  />
                </div>
                <div className="edit-field-group">
                  <label>CNIC</label>
                  <input
                    type="text"
                    value={editCnic}
                    onChange={(e) => setEditCnic(e.target.value)}
                  />
                </div>
                <div className="edit-field-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                  />
                </div>
                <div className="edit-field-group">
                  <label>City</label>
                  <input
                    type="text"
                    value={editCity}
                    onChange={(e) => setEditCity(e.target.value)}
                  />
                </div>
                <div className="edit-field-group">
                  <label>Date Of Birth</label>
                  <input
                    type="date"
                    value={editDob}
                    onChange={(e) => setEditDob(e.target.value)}
                  />
                </div>
                <div className="md:col-span-2 edit-field-group">
                  <label>Address</label>
                  <input
                    type="text"
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                  />
                </div>
              </div>

              <div className="edit-section-heading">Program details &amp; overrides</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="edit-field-group md:col-span-2">
                  <label>Selected Course Program</label>
                  <select
                    value={editSelectedCourse}
                    onChange={(e) => setEditSelectedCourse(e.target.value)}
                    className="form-select w-full p-2.5 border border-gray-200 rounded-md text-xs font-semibold cursor-pointer"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.name}>
                        {c.name} ({c.category}) · Base: {c.baseFee.toLocaleString()} PKR (Floor: {c.minFee.toLocaleString()} PKR)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="edit-field-group">
                  <label>Gender</label>
                  <select value={editGender} onChange={(e) => setEditGender(e.target.value)}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="edit-field-group">
                  <label>Laptop Required?</label>
                  <select
                    value={editLaptop}
                    onChange={(e) => setEditLaptop(e.target.value as 'Yes' | 'No')}
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes (+3,000 PKR)</option>
                  </select>
                </div>

                <div className="edit-field-group">
                  <label>Civilian / Military Category</label>
                  <select
                    value={editCivilStatus}
                    onChange={(e) => {
                      setEditCivilStatus(e.target.value);
                      if (e.target.value === 'Military' && !editMilCategory) {
                        setEditMilCategory('Officer');
                      }
                    }}
                  >
                    <option value="Civil">Civil</option>
                    <option value="Military">Military</option>
                  </select>
                </div>

                {editCivilStatus === 'Military' && (
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                    <div className="md:col-span-2 text-xs font-bold text-[#004173] mb-1">
                      🪖 Military Service Personnel Verification Details
                    </div>
                    <div className="edit-field-group">
                      <label>Military Category</label>
                      <select
                        value={editMilCategory}
                        onChange={(e) => setEditMilCategory(e.target.value as any)}
                        className="p-2 border border-gray-200 rounded text-xs bg-white cursor-pointer"
                      >
                        <option value="Officer">Officer</option>
                        <option value="JCO">JCO</option>
                      </select>
                    </div>
                    <div className="edit-field-group">
                      <label>Rank</label>
                      <input
                        type="text"
                        value={editMilRank}
                        onChange={(e) => setEditMilRank(e.target.value)}
                        placeholder="e.g. Captain / Subedar"
                      />
                    </div>
                    <div className="edit-field-group">
                      <label>Unit</label>
                      <input
                        type="text"
                        value={editMilUnit}
                        onChange={(e) => setEditMilUnit(e.target.value)}
                        placeholder="e.g. 15 FF Regiment"
                      />
                    </div>
                    <div className="edit-field-group">
                      <label>Name of Service Member</label>
                      <input
                        type="text"
                        value={editMilName}
                        onChange={(e) => setEditMilName(e.target.value)}
                        placeholder="Name of officer/JCO"
                      />
                    </div>
                    <div className="edit-field-group">
                      <label>Station</label>
                      <input
                        type="text"
                        value={editMilStation}
                        onChange={(e) => setEditMilStation(e.target.value)}
                        placeholder="e.g. Bahawalpur Cantt"
                      />
                    </div>
                    <div className="edit-field-group">
                      <label>Relation</label>
                      <input
                        type="text"
                        value={editMilRelation}
                        onChange={(e) => setEditMilRelation(e.target.value)}
                        placeholder="e.g. Father / Son / Self"
                      />
                    </div>
                  </div>
                )}

                <div className="edit-field-group">
                  <label>Staff discount (PKR)</label>
                  <input
                    type="number"
                    min="0"
                    value={editDiscount}
                    onChange={(e) => setEditDiscount(Number(e.target.value) || 0)}
                  />
                </div>

                {/* mini plan options inside modal */}
                <div className="md:col-span-2">
                  <label className="text-xs font-semibold text-gray-500 block mb-2">
                    Payment Plan Configuration
                  </label>
                  <div className="flex gap-3">
                    <div
                      onClick={() => setEditPaymentPlan('Full')}
                      className={`mini-plan ${editPaymentPlan === 'Full' ? 'selected' : ''}`}
                    >
                      <input
                        type="radio"
                        checked={editPaymentPlan === 'Full'}
                        onChange={() => setEditPaymentPlan('Full')}
                        className="mr-1"
                      />
                      <div>
                        <span className="mini-plan-label block">Full Package</span>
                        <span className="mini-plan-desc block">Single payment setup</span>
                      </div>
                    </div>

                    <div
                      onClick={() => setEditPaymentPlan('Installment')}
                      className={`mini-plan ${editPaymentPlan === 'Installment' ? 'selected' : ''}`}
                    >
                      <input
                        type="radio"
                        checked={editPaymentPlan === 'Installment'}
                        onChange={() => setEditPaymentPlan('Installment')}
                        className="mr-1"
                      />
                      <div>
                        <span className="mini-plan-label block">Installments</span>
                        <span className="mini-plan-desc block">
                          {Math.round(currentEditFeeLayout.total / 2).toLocaleString()} × 2 split
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recalculate preview strip */}
                <div className="md:col-span-2 bg-emerald-50 border border-emerald-100 rounded-lg p-3 text-xs flex justify-between items-center">
                  <span className="font-semibold text-emerald-800">
                    Calculated Total Ledger Fee:
                  </span>
                  <span className="font-bold text-sm text-emerald-900">
                    {currentEditFeeLayout.total.toLocaleString()} PKR
                  </span>
                </div>

                <div className="edit-field-group">
                  <label>Payment Ledger Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as 'Pending' | 'Verified')}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Verified">Verified</option>
                  </select>
                </div>

                {editPaymentPlan === 'Installment' && (
                  <div className="edit-field-group animate-fade-in-quick">
                    <label>2nd Installment Due Date</label>
                    <input
                      type="date"
                      value={editNextDueDate}
                      onChange={(e) => setEditNextDueDate(e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-2 border-t border-gray-100 pt-4 flex-wrap">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs px-5 py-2.5 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveEdit(false)}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-5 py-2.5 rounded-lg transition"
              >
                💾 Save Changes
              </button>
              <button
                onClick={() => handleSaveEdit(true)}
                className="bg-[#004173] hover:bg-[#2491bf] text-white font-bold text-xs px-5 py-2.5 rounded-lg transition shadow"
              >
                💾 Save &amp; Printer Reprint
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── FOOTER VISUAL NO-PRINT ── */}
      <footer className="bg-white border-t border-gray-100 py-6 text-center text-xs text-gray-400 no-print">
        <p className="font-semibold text-gray-500">
          Software Technology Park Bahawalpur — Rohi eSkills Learning Hub
        </p>
        <p className="text-[10px] text-gray-400 mt-1 select-none">
          Approved Course Enrolment Slip Portal &copy; {new Date().getFullYear()} All rights
          reserved.
        </p>
      </footer>

      {/* ════════════════════════════════════════════════════════
         PRINT-ONLY DUAL VOUCHER AREA — EXACT APPROVED FORMAT
         (Under normal viewing, wrapped in beautifully grey container)
         (Under print, everything else collapses to render this cleanly)
      ════════════════════════════════════════════════════════ */}
      {activeView === 'success' && (
        <div className="no-print bg-slate-100 py-8 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <div className="flex justify-between items-center mb-4 max-w-[1060px] mx-auto">
              <h4 className="text-sm font-bold text-gray-800 flex items-center gap-1">
                <span>🖨️ Interactive Print Voucher Preview</span>
              </h4>
              {voucherRecord ? (
                <button
                  onClick={triggerPrintService}
                  className="bg-[#004173] hover:bg-[#2491bf] text-white text-xs px-4 py-1.5 rounded font-bold flex items-center gap-1 transition shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Fee Voucher</span>
                </button>
              ) : null}
            </div>

          {voucherRecord ? (
            <div className="voucher-preview-container select-none">
              <div className="page" id="print-area">
                {/* ── STUDENT COPY ── */}
                <div className="slip">
                  <div className="slip-header">
                    <div className="logo-circle">
                      <img
                        src="https://raw.githubusercontent.com/artbyartist98-co/stp-assets/main/logo.png"
                        style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '3px' }}
                        alt="Logo"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="header-text">
                      <div className="line1">Software Technology Park Bahawalpur</div>
                      <div className="line2">Rohi eSkills Learning Hub</div>
                      <div className="line3">Executive Course Enrolment Slip</div>
                      <div className="line4 text-slate-500">Student Copy</div>
                    </div>
                  </div>

                  <table className="slip-body">
                    <tbody>
                      <tr className="blank-spacer">
                        <td colSpan={2}></td>
                      </tr>
                      <tr>
                        <td className="lbl">Application ID:</td>
                        <td className="val font-mono font-bold">{voucherRecord.regId}</td>
                      </tr>
                      <tr>
                        <td className="lbl">Student Name:</td>
                        <td className="val font-bold">
                          {voucherRecord.firstName} {voucherRecord.lastName}
                        </td>
                      </tr>
                      {voucherRecord.fatherName && (
                        <tr>
                          <td className="lbl">Father's Name:</td>
                          <td className="val">{voucherRecord.fatherName}</td>
                        </tr>
                      )}
                      <tr>
                        <td className="lbl">CNIC:</td>
                        <td className="val font-mono">{voucherRecord.cnic}</td>
                      </tr>
                      <tr>
                        <td className="lbl">Selected Course:</td>
                        <td className="val">{voucherRecord.course || 'Web Design & Development'}</td>
                      </tr>
                      <tr>
                        <td className="lbl">Base Course Fee:</td>
                        <td className="val">
                          {(voucherRecord.baseFee || 30000).toLocaleString()} PKR
                        </td>
                      </tr>
                      <tr>
                        <td className="lbl">Laptop Charges:</td>
                        <td className="val">
                          {(voucherRecord.laptopFee || 0).toLocaleString()} PKR
                        </td>
                      </tr>

                      {/* Display plan properties if Installment */}
                      {voucherRecord.paymentPlan === 'Installment' && (
                        <>
                          <tr>
                            <td className="lbl text-sky-800">1st Installment:</td>
                            <td className="val font-bold text-sky-800">
                              {Math.round(voucherRecord.totalFee / 2).toLocaleString()} PKR (Due
                              Today)
                            </td>
                          </tr>
                          <tr>
                            <td className="lbl text-sky-800">2nd Installment:</td>
                            <td className="val font-bold text-sky-800 border-b border-sky-200">
                              {(voucherRecord.totalFee - Math.round(voucherRecord.totalFee / 2)).toLocaleString()}{' '}
                              PKR
                            </td>
                          </tr>
                          <tr>
                            <td className="lbl text-[#990000]">Next Due Deadline:</td>
                            <td className="val font-bold text-[#990000]">
                              {voucherRecord.nextDueDate || '—'}
                            </td>
                          </tr>
                        </>
                      )}

                      {/* Padding spaces to keep double voucher slips synchronized in height */}
                      {Array.from({ length: emptyRowCounts }).map((_, idx) => (
                        <tr key={idx} className="empty">
                          <td className="lbl"></td>
                          <td className="val"></td>
                        </tr>
                      ))}

                      <tr className="total-row border-t-2 border-slate-400">
                        <td className="lbl">Total Payable:</td>
                        <td className="val tracking-wide font-extrabold text-sm font-sans text-black">
                          {voucherRecord.totalFee.toLocaleString()} PKR
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* ── ACCOUNTS OFFICE COPY ── */}
                <div className="slip">
                  <div className="slip-header">
                    <div className="logo-circle">
                      <img
                        src="https://raw.githubusercontent.com/artbyartist98-co/stp-assets/main/logo.png"
                        style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '3px' }}
                        alt="Logo"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="header-text">
                      <div className="line1">Software Technology Park Bahawalpur</div>
                      <div className="line2">Rohi eSkills Learning Hub</div>
                      <div className="line3">Executive Course Enrolment Slip</div>
                      <div className="line4 text-slate-500">Accounts Office Copy</div>
                    </div>
                  </div>

                  <table className="slip-body">
                    <tbody>
                      <tr className="blank-spacer">
                        <td colSpan={2}></td>
                      </tr>
                      <tr>
                        <td className="lbl">Application ID:</td>
                        <td className="val font-mono font-bold">{voucherRecord.regId}</td>
                      </tr>
                      <tr>
                        <td className="lbl">Student Name:</td>
                        <td className="val font-bold">
                          {voucherRecord.firstName} {voucherRecord.lastName}
                        </td>
                      </tr>
                      {voucherRecord.fatherName && (
                        <tr>
                          <td className="lbl">Father's Name:</td>
                          <td className="val">{voucherRecord.fatherName}</td>
                        </tr>
                      )}
                      <tr>
                        <td className="lbl">CNIC:</td>
                        <td className="val font-mono">{voucherRecord.cnic}</td>
                      </tr>
                      <tr>
                        <td className="lbl">Selected Course:</td>
                        <td className="val">{voucherRecord.course || 'Web Design & Development'}</td>
                      </tr>
                      <tr>
                        <td className="lbl">Base Course Fee:</td>
                        <td className="val">
                          {(voucherRecord.baseFee || 30000).toLocaleString()} PKR
                        </td>
                      </tr>
                      <tr>
                        <td className="lbl">Laptop Charges:</td>
                        <td className="val">
                          {(voucherRecord.laptopFee || 0).toLocaleString()} PKR
                        </td>
                      </tr>

                      {/* Display plan properties if Installment */}
                      {voucherRecord.paymentPlan === 'Installment' && (
                        <>
                          <tr>
                            <td className="lbl text-sky-800">1st Installment:</td>
                            <td className="val font-bold text-sky-800">
                              {Math.round(voucherRecord.totalFee / 2).toLocaleString()} PKR (Due
                              Today)
                            </td>
                          </tr>
                          <tr>
                            <td className="lbl text-sky-800">2nd Installment:</td>
                            <td className="val font-bold text-sky-800 border-b border-sky-200">
                              {(voucherRecord.totalFee - Math.round(voucherRecord.totalFee / 2)).toLocaleString()}{' '}
                              PKR
                            </td>
                          </tr>
                          <tr>
                            <td className="lbl text-[#990000]">Next Due Deadline:</td>
                            <td className="val font-bold text-[#990000]">
                              {voucherRecord.nextDueDate || '—'}
                            </td>
                          </tr>
                        </>
                      )}

                      {/* Padding spaces to keep double voucher slips synchronized in height */}
                      {Array.from({ length: emptyRowCounts }).map((_, idx) => (
                        <tr key={idx} className="empty">
                          <td className="lbl"></td>
                          <td className="val"></td>
                        </tr>
                      ))}

                      <tr className="total-row border-t-2 border-slate-400">
                        <td className="lbl">Total Payable:</td>
                        <td className="val tracking-wide font-extrabold text-sm font-sans text-black">
                          {voucherRecord.totalFee.toLocaleString()} PKR
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-[1060px] mx-auto bg-white p-12 text-center rounded-xl border border-gray-100/80 text-gray-400 font-semibold text-xs">
              Fill out and process the enrollment form to preview the dual-slip approved fee voucher.
            </div>
          )}
        </div>
      </div>
      )}

      {/* ════════════════════════════════════════════════════════
         PRINT-ONLY HIGH FIDELITY ELEMENT (ALWAYS LOADED - HIDDEN FROM NORMAL DOM)
         BUT TRIPPED ACTIVE DURING @MEDIA PRINT EMISSION FOR PERFECT OUTPUTS
      ════════════════════════════════════════════════════════ */}
      {voucherRecord && (
        <div className="hidden print-only">
          <div className="page" style={{ margin: 0, padding: 0 }}>
            {/* ── STUDENT COPY ── */}
            <div className="slip" style={{ border: '2px solid #222' }}>
              <div className="slip-header">
                <div className="logo-circle">
                  <img
                    src="https://raw.githubusercontent.com/artbyartist98-co/stp-assets/main/logo.png"
                    style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '3px' }}
                    alt="Logo"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="header-text">
                  <div className="line1">Software Technology Park Bahawalpur</div>
                  <div className="line2" style={{ fontSize: '14px', fontWeight: 'bold' }}>Rohi eSkills Learning Hub</div>
                  <div className="line3">Executive Course Enrolment Slip</div>
                  <div className="line4" style={{ fontWeight: 'bold' }}>Student Copy</div>
                </div>
              </div>

              <table className="slip-body">
                <tbody>
                  <tr className="blank-spacer">
                    <td colSpan={2}></td>
                  </tr>
                  <tr>
                    <td className="lbl">Application ID:</td>
                    <td className="val" style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{voucherRecord.regId}</td>
                  </tr>
                  <tr>
                    <td className="lbl">Student Name:</td>
                    <td className="val" style={{ fontWeight: 'bold' }}>
                      {voucherRecord.firstName} {voucherRecord.lastName}
                    </td>
                  </tr>
                  {voucherRecord.fatherName && (
                    <tr>
                      <td className="lbl">Father's Name:</td>
                      <td className="val">{voucherRecord.fatherName}</td>
                    </tr>
                  )}
                  <tr>
                    <td className="lbl">CNIC:</td>
                    <td className="val" style={{ fontFamily: 'monospace' }}>{voucherRecord.cnic}</td>
                  </tr>
                  <tr>
                    <td className="lbl">Selected Course:</td>
                    <td className="val">{voucherRecord.course || 'Web Design & Development'}</td>
                  </tr>
                  <tr>
                    <td className="lbl">Base Course Fee:</td>
                    <td className="val">
                      {(voucherRecord.baseFee || 30000).toLocaleString()} PKR
                    </td>
                  </tr>
                  <tr>
                    <td className="lbl">Laptop Charges:</td>
                    <td className="val">
                      {(voucherRecord.laptopFee || 0).toLocaleString()} PKR
                    </td>
                  </tr>

                  {/* Display plan properties if Installment */}
                  {voucherRecord.paymentPlan === 'Installment' && (
                    <>
                      <tr>
                        <td className="lbl" style={{ color: '#004173' }}>1st Installment:</td>
                        <td className="val" style={{ fontWeight: 'bold', color: '#004173' }}>
                          {Math.round(voucherRecord.totalFee / 2).toLocaleString()} PKR (Due Today)
                        </td>
                      </tr>
                      <tr>
                        <td className="lbl" style={{ color: '#004173' }}>2nd Installment:</td>
                        <td className="val" style={{ fontWeight: 'bold', color: '#004173', borderBottom: '1px solid #c8c8c8' }}>
                          {(voucherRecord.totalFee - Math.round(voucherRecord.totalFee / 2)).toLocaleString()} PKR
                        </td>
                      </tr>
                      <tr>
                        <td className="lbl" style={{ color: '#990000' }}>Next Due Deadline:</td>
                        <td className="val" style={{ fontWeight: 'bold', color: '#990000' }}>
                          {voucherRecord.nextDueDate || '—'}
                        </td>
                      </tr>
                    </>
                  )}

                  {/* Padding spaces to keep double voucher slips synchronized in height */}
                  {Array.from({ length: emptyRowCounts }).map((_, idx) => (
                    <tr key={idx} className="empty">
                      <td className="lbl"></td>
                      <td className="val"></td>
                    </tr>
                  ))}

                  <tr className="total-row" style={{ borderTop: '2.5px solid #222' }}>
                    <td className="lbl" style={{ fontSize: '13px', fontWeight: 'bold' }}>Total Payable:</td>
                    <td className="val" style={{ fontStyle: 'normal', fontWeight: '900', fontSize: '13.5px', color: '#000' }}>
                      {voucherRecord.totalFee.toLocaleString()} PKR
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* ── ACCOUNTS OFFICE COPY ── */}
            <div className="slip" style={{ border: '2px solid #222' }}>
              <div className="slip-header">
                <div className="logo-circle">
                  <img
                    src="https://raw.githubusercontent.com/artbyartist98-co/stp-assets/main/logo.png"
                    style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '3px' }}
                    alt="Logo"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="header-text">
                  <div className="line1">Software Technology Park Bahawalpur</div>
                  <div className="line2" style={{ fontSize: '14px', fontWeight: 'bold' }}>Rohi eSkills Learning Hub</div>
                  <div className="line3">Executive Course Enrolment Slip</div>
                  <div className="line4" style={{ fontWeight: 'bold' }}>Accounts Office Copy</div>
                </div>
              </div>

              <table className="slip-body">
                <tbody>
                  <tr className="blank-spacer">
                    <td colSpan={2}></td>
                  </tr>
                  <tr>
                    <td className="lbl">Application ID:</td>
                    <td className="val" style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{voucherRecord.regId}</td>
                  </tr>
                  <tr>
                    <td className="lbl">Student Name:</td>
                    <td className="val" style={{ fontWeight: 'bold' }}>
                      {voucherRecord.firstName} {voucherRecord.lastName}
                    </td>
                  </tr>
                  {voucherRecord.fatherName && (
                    <tr>
                      <td className="lbl">Father's Name:</td>
                      <td className="val">{voucherRecord.fatherName}</td>
                    </tr>
                  )}
                  <tr>
                    <td className="lbl">CNIC:</td>
                    <td className="val" style={{ fontFamily: 'monospace' }}>{voucherRecord.cnic}</td>
                  </tr>
                  <tr>
                    <td className="lbl">Selected Course:</td>
                    <td className="val">{voucherRecord.course || 'Web Design & Development'}</td>
                  </tr>
                  <tr>
                    <td className="lbl">Base Course Fee:</td>
                    <td className="val">
                      {(voucherRecord.baseFee || 30000).toLocaleString()} PKR
                    </td>
                  </tr>
                  <tr>
                    <td className="lbl">Laptop Charges:</td>
                    <td className="val">
                      {(voucherRecord.laptopFee || 0).toLocaleString()} PKR
                    </td>
                  </tr>

                  {/* Display plan properties if Installment */}
                  {voucherRecord.paymentPlan === 'Installment' && (
                    <>
                      <tr>
                        <td className="lbl" style={{ color: '#004173' }}>1st Installment:</td>
                        <td className="val" style={{ fontWeight: 'bold', color: '#004173' }}>
                          {Math.round(voucherRecord.totalFee / 2).toLocaleString()} PKR (Due Today)
                        </td>
                      </tr>
                      <tr>
                        <td className="lbl" style={{ color: '#004173' }}>2nd Installment:</td>
                        <td className="val" style={{ fontWeight: 'bold', color: '#004173', borderBottom: '1px solid #c8c8c8' }}>
                          {(voucherRecord.totalFee - Math.round(voucherRecord.totalFee / 2)).toLocaleString()} PKR
                        </td>
                      </tr>
                      <tr>
                        <td className="lbl" style={{ color: '#990000' }}>Next Due Deadline:</td>
                        <td className="val" style={{ fontWeight: 'bold', color: '#990000' }}>
                          {voucherRecord.nextDueDate || '—'}
                        </td>
                      </tr>
                    </>
                  )}

                  {/* Padding spaces to keep double voucher slips synchronized in height */}
                  {Array.from({ length: emptyRowCounts }).map((_, idx) => (
                    <tr key={idx} className="empty">
                      <td className="lbl"></td>
                      <td className="val"></td>
                    </tr>
                  ))}

                  <tr className="total-row" style={{ borderTop: '2.5px solid #222' }}>
                    <td className="lbl" style={{ fontSize: '13px', fontWeight: 'bold' }}>Total Payable:</td>
                    <td className="val" style={{ fontStyle: 'normal', fontWeight: '900', fontSize: '13.5px', color: '#000' }}>
                      {voucherRecord.totalFee.toLocaleString()} PKR
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── PRINT-ONLY HIGH FIDELITY HALL BOOKING INVOICE (ONLY LOADED DURING PRINT MODE) ── */}
      {invoiceBooking && (
        <div className="hidden print-only">
          <div className="bg-white min-h-screen text-slate-800 p-8 flex flex-col justify-between" style={{ fontFamily: '"DM Sans", system-ui, sans-serif' }}>
            {/* Header section */}
            <div className="border-b-2 border-slate-900 pb-6 mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-black text-slate-900 leading-none uppercase tracking-tight mb-2" style={{ fontFamily: '"Playfair Display", serif' }}>
                    Rohi eSkills Learning Hub
                  </h1>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block font-mono">
                    Software Technology Park • STP Bahawalpur
                  </span>
                </div>
                <div className="text-right border-l-2 border-slate-200 pl-4">
                  <span className="text-[11px] font-black uppercase text-slate-400 block tracking-widest font-mono">Receipt Invoice</span>
                  <div className="text-lg font-black text-slate-900 font-mono">#STP-HB-{invoiceBooking.id.substring(3).toUpperCase()}</div>
                  <span className="text-[10px] text-slate-505 font-semibold block">Date: {new Date(invoiceBooking.createdAt || Date.now()).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
              </div>
            </div>

            {/* Billed Party vs Booking Details info columns */}
            <div className="grid grid-cols-2 gap-8 mb-8 text-xs">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2 font-mono">Billed Party / Client</span>
                <div className="text-base font-black text-slate-900 mb-1">{invoiceBooking.companyName}</div>
                <div className="font-semibold text-slate-600">Attn: {invoiceBooking.personName}</div>
                <div className="text-slate-400 leading-relaxed mt-1">Authorized corporate representative associated with STP co-working and seminar bookings roster.</div>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1 font-mono">Booking Particulars</span>
                  <div className="font-bold text-[#004173] text-[13px]">{invoiceBooking.bookingFor} Reservation</div>
                  <div className="text-[11px] text-slate-605 font-medium mt-1">Event: {invoiceBooking.eventType}</div>
                </div>
                <div className="text-[10px] text-slate-505 font-mono uppercase tracking-tight border-t border-slate-200/60 pt-2 mt-2 font-semibold">
                  Event Date: {invoiceBooking.eventDate}
                </div>
              </div>
            </div>

            {/* Itemized Table of reservation details */}
            <div className="flex-1 mb-8">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b-2 border-slate-300 font-black text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                    <th className="py-2.5">Corporate Venue Space</th>
                    <th className="py-2.5">Schedule Range</th>
                    <th className="py-2.5 text-center">Duration</th>
                    <th className="py-2.5 text-center">Crowd Size</th>
                    <th className="py-2.5 text-right">Tuition / Space Fee</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  <tr>
                    <td className="py-4">
                      <div className="font-black text-slate-900 text-sm">{invoiceBooking.venueRoom}</div>
                      <span className="text-[10px] text-slate-400 font-semibold">Space designation matching STP executive roster</span>
                    </td>
                    <td className="py-4 text-slate-700 font-semibold font-mono">
                      {invoiceBooking.timeSlot}
                    </td>
                    <td className="py-4 text-center font-bold text-slate-600">
                      {invoiceBooking.duration}
                    </td>
                    <td className="py-4 text-center font-bold text-slate-600">
                      {invoiceBooking.seatingCapacity} pax
                    </td>
                    <td className="py-4 text-right font-bold font-mono text-slate-900">
                      {invoiceBooking.price.toLocaleString()} PKR
                    </td>
                  </tr>
                  
                  {/* Total calculation values block */}
                  <tr className="border-t border-slate-200">
                    <td colSpan={3} className="py-4"></td>
                    <td className="py-4 text-right font-bold text-slate-500 uppercase tracking-wider text-[10px] font-mono">Subtotal Amount:</td>
                    <td className="py-4 text-right font-black font-mono text-slate-900">{invoiceBooking.price.toLocaleString()} PKR</td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="py-2"></td>
                    <td className="py-2 text-right font-bold text-slate-500 uppercase tracking-wider text-[10px] font-mono">Tax / VAT Index (0%):</td>
                    <td className="py-2 text-right font-black font-mono text-slate-900">0.00 PKR</td>
                  </tr>
                  <tr className="border-t-2 border-slate-950">
                    <td colSpan={3} className="py-4"></td>
                    <td className="py-4 text-right font-black text-slate-900 uppercase tracking-wider text-xs font-sans">Total Balanced Payable:</td>
                    <td className="py-4 text-right font-black font-mono text-sm text-[#004173]">{invoiceBooking.price.toLocaleString()} PKR</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Corporate signatures, notes, terms & conditions */}
            <div className="space-y-6">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-[10.5px] leading-relaxed text-slate-500 font-light">
                <span className="font-bold text-slate-700 block mb-1">Terms & Conditions of Venue Operations:</span>
                1. This invoice is issued on behalf of STP learning workspace rosters. All space bookings must adhere to technology hub code of conduct.
                2. Cancelations requested under 48 hours are subject to a nominal preservation threshold check. No equipment rearrangements are permitted without authorization stamps.
              </div>

              <div className="pt-8 flex justify-between items-end border-t border-dashed border-slate-200">
                <div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-mono">System Approved Slip</div>
                  <div className="text-[9px] text-[#2491bf] font-mono font-bold uppercase tracking-tight mt-1">Biometric Hash Checked: OK</div>
                </div>
                <div className="text-center w-[160px] border-t border-slate-950 pt-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Authorized Officer Signature</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getAppsScriptCode(): string {
  return `/*
  ============================================================
           STP ENROLMENT LEDGER SHEET CONNECTOR SCRIPT
  ============================================================
  Instructions for Google Sheets Setup:
  1. Create a Google Sheet. Name the working sheet tab "Enrolments".
  2. Select 'Extensions' > 'Apps Script' from the top menu.
  3. Replace any auto-generated placeholder code with this code.
  4. Click the 'Save' icon, then click the 'Deploy' button > 'New deployment'.
  5. Select configuration type: 'Web app'.
  6. Execute as: 'Me' (your security account email).
  7. Who has access: 'Anyone' (Required for the dynamic POST requests to connect).
  8. Click Deploy, copy the "Web App URL" and paste into the administration console!
*/

function doPost(e) {
  var sheetName = "Enrolments";
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow([
      "Application ID", 
      "First Name", 
      "Last Name", 
      "Father Name", 
      "Mobile No", 
      "CNIC", 
      "Email Address", 
      "Address", 
      "Gender", 
      "Laptop Needed", 
      "Payment Plan", 
      "Civil Status", 
      "Discount Applied (PKR)", 
      "Net Total Fee (PKR)", 
      "Base Fee (PKR)", 
      "Laptop Fee (PKR)", 
      "Course",
      "Ledger Status", 
      "Next Due Date", 
      "Submission Date"
    ]);
    sheet.getRange(1, 1, 1, 20).setFontWeight("bold").setBackground("#f3f4f6");
  }
  
  try {
    var data = JSON.parse(e.postData.contents);
    
    if (data.action === "addRecord") {
      var rec = data.record;
      addOrUpdateRecord(sheet, rec);
      return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Processed" }))
        .setMimeType(ContentService.MimeType.JSON)
        .setHeader("Access-Control-Allow-Origin", "*");
    } 
    else if (data.action === "bulkSync") {
      var records = data.records;
      var lastRow = sheet.getLastRow();
      if (lastRow > 1) {
        sheet.deleteRows(2, lastRow - 1);
      }
      for (var i = 0; i < records.length; i++) {
        addOrUpdateRecord(sheet, records[i]);
      }
      return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Synced " + records.length + " rows" }))
        .setMimeType(ContentService.MimeType.JSON)
        .setHeader("Access-Control-Allow-Origin", "*");
    }
    
    return ContentService.createTextOutput(JSON.stringify({ status: "invalid_action" }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader("Access-Control-Allow-Origin", "*");
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader("Access-Control-Allow-Origin", "*");
  }
}

function addOrUpdateRecord(sheet, rec) {
  var dataRange = sheet.getDataRange();
  var values = dataRange.getValues();
  var regIdColIndex = 0; // Col A
  var existingRowIndex = -1;
  
  for (var i = 1; i < values.length; i++) {
    if (values[i][regIdColIndex].toString() === rec.regId.toString()) {
      existingRowIndex = i + 1;
      break;
    }
  }
  
  var rowData = [
    rec.regId.toString(),
    rec.firstName || "",
    rec.lastName || "",
    rec.fatherName || "",
    rec.mobile || "",
    rec.cnic || "",
    rec.email || "",
    rec.address || "",
    rec.gender || "",
    rec.laptop || "No",
    rec.paymentPlan || "Full",
    rec.civilStatus || "",
    rec.discount || 0,
    rec.totalFee || 0,
    rec.baseFee || 30000,
    rec.laptopFee || 0,
    rec.course || "Web Design & Development",
    rec.status || "Pending",
    rec.nextDueDate || "",
    rec.createdAtFormatted || rec.createdAt || new Date().toISOString()
  ];
  
  if (existingRowIndex > -1) {
    sheet.getRange(existingRowIndex, 1, 1, rowData.length).setValues([rowData]);
  } else {
    sheet.appendRow(rowData);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("STP Ledger Web App connector is working successfully!")
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeader("Access-Control-Allow-Origin", "*");
}`;
}
