import React, { useState } from 'react';
import { 
  HelpCircle, ChevronRight, Laptop, User, Shield, 
  Smartphone, Code, Package, Briefcase, BookOpen, 
  Search, Plus, ArrowLeft, Printer, Edit2, Trash2, CheckCircle 
} from 'lucide-react';
import { Course, EnrolmentRecord, Employee } from '../types';

interface InquiryPanelProps {
  records: EnrolmentRecord[];
  courses: Course[];
  currentUser: Employee | null;
  onApproveInquiry: (regId: string) => void;
  onOpenEdit: (record: EnrolmentRecord) => void;
  onDeleteRecord: (regId: string) => void;
  onOpenNewEnrollment: (courseName?: string) => void;
  calculateTotalFee: (courseName: string, laptop: 'Yes' | 'No', civilStatus: string, discount: number) => { base: number; minFee: number; discount: number; total: number };
}

export default function InquiryPanel({
  records,
  courses,
  currentUser,
  onApproveInquiry,
  onOpenEdit,
  onDeleteRecord,
  onOpenNewEnrollment,
  calculateTotalFee
}: InquiryPanelProps) {
  const [inquiryCategory, setInquiryCategory] = useState<'Technical' | 'Non-Technical'>('Technical');
  const [selectedCourseName, setSelectedCourseName] = useState<string | null>(() => {
    // If Trainer, auto-select their own course
    return currentUser?.role === 'Trainer' ? (currentUser.course || null) : null;
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Filter courses by category
  const activeCourses = courses.filter(c => c.category === inquiryCategory);

  // If Trainer, they can only view their own coursecard
  const displayCourses = currentUser?.role === 'Trainer'
    ? activeCourses.filter(c => c.name === currentUser.course)
    : activeCourses;

  // Helper to retrieve course-specific icon
  const getCourseIcon = (name: string) => {
    const title = name.toLowerCase();
    if (title.includes('web')) return <Code className="w-6 h-6 text-teal-600" />;
    if (title.includes('mobile') || title.includes('app')) return <Smartphone className="w-6 h-6 text-indigo-600" />;
    if (title.includes('security') || title.includes('cyber')) return <Shield className="w-6 h-6 text-amber-600" />;
    if (title.includes('ebay') || title.includes('tiktok') || title.includes('shop')) return <Package className="w-6 h-6 text-purple-600" />;
    if (title.includes('marketing') || title.includes('freelance')) return <Briefcase className="w-6 h-6 text-emerald-600" />;
    return <BookOpen className="w-6 h-6 text-blue-600" />;
  };

  const getCourseBg = (name: string) => {
    const title = name.toLowerCase();
    if (title.includes('web')) return 'bg-teal-50';
    if (title.includes('mobile') || title.includes('app')) return 'bg-indigo-50';
    if (title.includes('security') || title.includes('cyber')) return 'bg-amber-50';
    if (title.includes('ebay') || title.includes('tiktok') || title.includes('shop')) return 'bg-purple-50';
    if (title.includes('marketing') || title.includes('freelance')) return 'bg-emerald-50';
    return 'bg-blue-50';
  };

  // Calculations of Technical / Non-Technical counts for tab badges
  const technicalCount = records.filter(r => {
    const c = courses.find(course => course.name === r.course);
    return c?.category === 'Technical';
  }).length;

  const nonTechnicalCount = records.filter(r => {
    const c = courses.find(course => course.name === r.course);
    return c?.category === 'Non-Technical';
  }).length;

  return (
    <div className="space-y-6">
      {selectedCourseName === null ? (
        // STATE 1: main separate course cards layout matching screenshot
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#004173]" />
                <span>Training Inquiries</span>
              </h3>
              <p className="text-xs text-gray-400">
                Desk branch status center showing separate metrics and registration statuses of active courses.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenNewEnrollment}
                className="bg-gradient-to-r from-[#003865] via-[#004173] to-[#2491bf] hover:opacity-90 hover:scale-[1.01] text-white text-[11px] font-bold px-4 py-2.5 rounded-lg transition shadow flex items-center gap-1.5 cursor-pointer"
                id="btn-inquiry-new-enrollment"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Enrolment</span>
              </button>
            </div>
          </div>

          {/* Interactive Course Type Tabs (Technical/Non-Technical with dynamic counts) */}
          <div className="grid grid-cols-2 gap-4 max-w-lg">
            <button
              onClick={() => setInquiryCategory('Technical')}
              className={`flex items-center justify-between p-3.5 rounded-2xl border transition duration-200 cursor-pointer ${
                inquiryCategory === 'Technical'
                  ? 'bg-gradient-to-r from-[#004173] to-[#2491bf] border-[#004173] text-white shadow-md font-bold'
                  : 'bg-white border-gray-200 text-gray-600 font-medium hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2.5 text-xs">
                <Code className="w-4.5 h-4.5" />
                <span>Technical Courses</span>
              </div>
              <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold font-mono ${
                inquiryCategory === 'Technical' ? 'bg-white text-[#004173]' : 'bg-gray-100 text-gray-600'
              }`}>
                {technicalCount}
              </span>
            </button>

            <button
              onClick={() => setInquiryCategory('Non-Technical')}
              className={`flex items-center justify-between p-3.5 rounded-2xl border transition duration-200 cursor-pointer ${
                inquiryCategory === 'Non-Technical'
                  ? 'bg-gradient-to-r from-[#004173] to-[#2491bf] border-[#004173] text-white shadow-md font-bold'
                  : 'bg-white border-gray-200 text-gray-600 font-medium hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2.5 text-xs">
                <Briefcase className="w-4.5 h-4.5" />
                <span>Non Technical Courses</span>
              </div>
              <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold font-mono ${
                inquiryCategory === 'Non-Technical' ? 'bg-white text-[#004173]' : 'bg-gray-100 text-gray-600'
              }`}>
                {nonTechnicalCount}
              </span>
            </button>
          </div>

          {/* Separate cards showing course metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayCourses.map(course => {
              const courseEnrolments = records.filter(r => r.course === course.name);
              const totalCount = courseEnrolments.length;
              const pending = courseEnrolments.filter(r => r.status === 'Pending').length;
              const processing = courseEnrolments.filter(r => r.status === 'Processing').length;
              const enrolled = courseEnrolments.filter(r => r.status === 'Enrolled' || r.status === 'Verified').length;

              return (
                <div 
                  key={course.id} 
                  className="bg-white rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition duration-300 p-5 flex flex-col justify-between"
                  id={`course-card-${course.id}`}
                >
                  <div>
                    {/* Top block */}
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-3 rounded-2xl ${getCourseBg(course.name)}`}>
                        {getCourseIcon(course.name)}
                      </div>
                      <div className="text-right">
                        <span className="bg-gradient-to-r from-[#004173] to-[#2491bf] text-white text-[11px] font-mono font-black px-2.5 py-1 rounded-full block text-center min-w-[36px]">
                          {totalCount}
                        </span>
                        <span className="text-[9px] text-gray-400 block font-bold tracking-wider mt-0.5 uppercase">
                          Total
                        </span>
                      </div>
                    </div>

                    {/* Mid block */}
                    <h4 className="text-sm font-extrabold text-gray-900 leading-snug hover:text-[#004173] transition mb-1">
                      {course.name}
                    </h4>
                    <p className="text-[10px] font-black tracking-wider text-gray-400 uppercase mb-4">
                      STUDENT ENROLMENTS
                    </p>

                    {/* Breakdown metrics list */}
                    <div className="space-y-2.5 border-t border-gray-50 pt-3">
                      <div className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-1.5 text-gray-500">
                          <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                          <span>Pending Logs</span>
                        </div>
                        <span className="font-semibold text-gray-800 font-mono">{pending}</span>
                      </div>

                      <div className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-1.5 text-gray-500">
                          <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                          <span>Processing Desk</span>
                        </div>
                        <span className="font-semibold text-gray-800 font-mono">{processing}</span>
                      </div>

                      <div className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-1.5 text-gray-500">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          <span>Enrolled / Verified</span>
                        </div>
                        <span className="font-semibold text-gray-800 font-mono">{enrolled}</span>
                      </div>

                      {/* Cumulative Total Row highlighted */}
                      <div className="bg-teal-50/50 hover:bg-teal-50/70 py-2 px-3.5 rounded-xl flex justify-between items-center text-xs font-extrabold text-[#004173] mt-4 border border-teal-100/50 transition">
                        <span>Cumulative Inquiries</span>
                        <span className="font-mono">{totalCount}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom link block */}
                  <div className="mt-5 border-t border-gray-100 pt-3 flex justify-between items-center">
                    <span className="text-[10.5px] font-semibold text-gray-400">Base: {course.baseFee.toLocaleString()} PKR</span>
                    <button
                      onClick={() => setSelectedCourseName(course.name)}
                      className="text-xs font-bold text-[#004173] hover:text-[#2491bf] transition flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>View details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        // STATE 2: Detailed course-specific applicant listing with full client workflows
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <button
                onClick={() => {
                  // Do not let trainers return if locked to their course
                  if (currentUser?.role === 'Trainer') return;
                  setSelectedCourseName(null);
                }}
                disabled={currentUser?.role === 'Trainer'}
                className={`text-xs font-bold text-[#004173] hover:text-[#2491bf] flex items-center gap-1 mb-1 bg-transparent border-0 p-0 ${
                  currentUser?.role === 'Trainer' ? 'hidden' : 'cursor-pointer'
                }`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Courses Overview</span>
              </button>
              <h3 className="text-xl font-extrabold text-gray-900 truncate max-w-xl">
                {selectedCourseName} Applicant Log
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Review specific applicants, edit parameters, print vouchers, and verify registration dues.
              </p>
            </div>

            <div className="flex gap-2 items-center">
              <button
                onClick={() => onOpenNewEnrollment(selectedCourseName || undefined)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold px-4 py-2.5 rounded-lg transition shadow flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Enrolment</span>
              </button>
            </div>
          </div>

          {/* Table quick-filters and search */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search candidates by name, CNIC, or register ID..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl text-xs focus:outline-none focus:bg-white focus:border-[#2491bf] transition placeholder-gray-400"
              />
            </div>

            <div className="flex gap-1.5 self-stretch md:self-auto overflow-x-auto pb-1 md:pb-0">
              {['All', 'Pending', 'Processing', 'Enrolled'].map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    statusFilter === status
                      ? 'bg-blue-50 text-[#004173] border border-blue-100 shadow-2xs'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Applicants filtered list */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {(() => {
              const applicants = records.filter(r => {
                const sameCourse = r.course === selectedCourseName;
                const matchesStatus = statusFilter === 'All' 
                  ? true 
                  : (statusFilter === 'Enrolled' ? (r.status === 'Enrolled' || r.status === 'Verified') : r.status === statusFilter);
                
                const q = searchQuery.toLowerCase().trim();
                const matchesQuery = !q || (
                  r.regId.toLowerCase().includes(q) ||
                  `${r.firstName} ${r.lastName}`.toLowerCase().includes(q) ||
                  r.cnic.includes(q) ||
                  r.mobile.includes(q)
                );

                return sameCourse && matchesStatus && matchesQuery;
              });

              if (applicants.length === 0) {
                return (
                  <div className="col-span-full bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400 font-semibold space-y-2 shadow-xs">
                    <p>No candidate entries match your filter configuration.</p>
                    <p className="text-[11px] text-gray-400 font-normal">
                      Try resetting the search bar, toggling status filter tabs, or record a new enrollment entry!
                    </p>
                  </div>
                );
              }

              return applicants.map(r => {
                const calculated = calculateTotalFee(r.course, r.laptop, r.civilStatus, r.discount);
                return (
                  <div 
                    key={r.regId} 
                    className="bg-white rounded-2xl shadow-xs border border-gray-100 hover:border-gray-200 p-5 space-y-4 transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-center border-b border-gray-100 pb-2.5 mb-3">
                        <span className="text-[10px] font-mono text-gray-400 font-bold">
                          ID: {r.regId}
                        </span>
                        <span className={`text-[9.5px] font-black px-2.5 py-0.5 rounded-full uppercase ${
                          r.status === 'Pending' ? 'bg-amber-50 text-amber-600 border border-amber-100/50' :
                          r.status === 'Processing' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100/50' :
                          'bg-emerald-50 text-emerald-600 border border-emerald-100/50'
                        }`}>
                          {r.status === 'Verified' ? 'Enrolled' : r.status}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h5 className="font-extrabold text-gray-900 text-sm leading-snug">
                          {r.firstName} {r.lastName}
                        </h5>
                        <p className="text-xs text-gray-500">
                          Father: <strong className="text-gray-800 font-semibold">{r.fatherName || 'Unspecified'}</strong>
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 mt-3 text-[11px] border-t border-gray-50 pt-3">
                        <div>
                          <span className="text-gray-400 block font-medium">Contact No</span>
                          <span className="font-bold text-gray-800 font-mono">{r.mobile}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block font-medium">CNIC Card</span>
                          <span className="font-bold text-gray-800 font-mono">{r.cnic}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-400 block font-medium">Email Address</span>
                          <span className="font-semibold text-gray-800 truncate block" title={r.email}>{r.email}</span>
                        </div>
                      </div>

                      <div className="bg-slate-50 border border-slate-100/50 rounded-xl p-3 mt-3.5 space-y-1 text-[11px]">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Required Laptop:</span>
                          <span className="font-medium text-gray-800">{r.laptop === 'Yes' ? 'Yes (+3,000 PKR)' : 'No'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Quota:</span>
                          <span className="font-semibold text-indigo-700">{r.civilStatus}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Discount Added:</span>
                          <span className="font-medium text-rose-600">-{r.discount.toLocaleString()} PKR</span>
                        </div>
                        <div className="flex justify-between border-t border-dashed border-gray-200 pt-1.5 font-bold mt-1.5 text-xs text-emerald-800">
                          <span>Tuition Balance:</span>
                          <span>{calculated.total.toLocaleString()} PKR</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-1.5 border-t border-gray-50 pt-3 flex-wrap">
                      {(r.status === 'Pending' || r.status === 'Processing') && (
                        <button
                          onClick={() => onApproveInquiry(r.regId)}
                          className="flex-grow bg-[#004173] hover:bg-[#2491bf] text-white text-[10.5px] font-bold px-3 py-2 rounded-lg transition flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Enroll Student</span>
                        </button>
                      )}

                      <button
                        onClick={() => onOpenEdit(r)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-[10.5px] font-bold px-2.5 py-2 rounded-lg transition flex items-center justify-center cursor-pointer"
                        title="Edit Registration Properties"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onDeleteRecord(r.regId)}
                        className="bg-red-50 hover:bg-red-100 text-red-600 text-[10.5px] font-bold px-2.5 py-2 rounded-lg transition flex items-center justify-center cursor-pointer"
                        title="Reject Candidacy"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
