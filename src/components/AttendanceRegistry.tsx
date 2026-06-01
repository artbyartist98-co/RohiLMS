import React, { useState, useEffect } from 'react';
import { 
  Check, 
  X, 
  Calendar as CalendarIcon, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Search, 
  RotateCcw, 
  FileText, 
  User,
  ChevronRight,
  ChevronDown,
  Award,
  Download
} from 'lucide-react';
import { Course, EnrolmentRecord, Batch, Employee, AttendanceLog } from '../types';

interface AttendanceRegistryProps {
  currentUser: Employee | null;
  records: EnrolmentRecord[];
  courses: Course[];
  batches: Batch[];
  attendanceLogs: AttendanceLog[];
  onSaveAttendanceLogs: (logs: AttendanceLog[]) => void;
  showToast: (text: string, type?: 'success' | 'err' | 'info') => void;
}

export default function AttendanceRegistry({
  currentUser,
  records,
  courses,
  batches,
  attendanceLogs,
  onSaveAttendanceLogs,
  showToast
}: AttendanceRegistryProps) {
  // Tabs: 'take' (Daily Attendance) | 'ledger' (Attendance Records / Alert)
  const [activeTab, setActiveTab] = useState<'take' | 'ledger'>('take');

  // Course configuration defaults based on logged-in role
  const isTrainer = currentUser?.role === 'Trainer';
  const trainerCourse = currentUser?.course || 'Web Design & Development';

  // Selection states
  const [selectedCourse, setSelectedCourse] = useState<string>(() => {
    return isTrainer ? trainerCourse : (courses[0]?.name || 'Web Design & Development');
  });
  const [selectedBatch, setSelectedBatch] = useState<string>('All');
  
  // Date state (defaults to today in local timezone format YYYY-MM-DD)
  const [attendanceDate, setAttendanceDate] = useState<string>(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });

  // Search filter for lists
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Student selection detail view (active student for history slide-over modal)
  const [detailedStudentId, setDetailedStudentId] = useState<string | null>(null);

  // Buffer state to hold unsaved current attendance sheet
  // maps student regId -> 'Present' | 'Absent' | 'Leave'
  const [workingSheet, setWorkingSheet] = useState<{ [regId: string]: 'Present' | 'Absent' | 'Leave' }>({});

  // Reset or lock course choice when current user logs in or switches
  useEffect(() => {
    if (isTrainer) {
      setSelectedCourse(trainerCourse);
    }
  }, [currentUser, isTrainer, trainerCourse]);

  // Load the list of eligible students based on filters
  const getFilteredStudents = () => {
    return records.filter(r => {
      // Must match selected course
      if (r.course !== selectedCourse) return false;
      
      // Must match selected batch if not 'All'
      if (selectedBatch !== 'All') {
        if (r.batchId !== selectedBatch && r.batchName !== selectedBatch) return false;
      }
      
      // Let's filter to active students (Enrolled or Verified)
      // or if empty, let's include processing to be robust.
      const isEligibleStatus = r.status === 'Enrolled' || r.status === 'Verified' || r.status === 'Processing';
      return isEligibleStatus;
    });
  };

  const filteredStudents = getFilteredStudents();

  // Load existing working attendance sheet if one exists for the selected Course + Batch + Date
  useEffect(() => {
    const existingLog = attendanceLogs.find(
      log => log.courseName === selectedCourse && log.date === attendanceDate
    );

    if (existingLog) {
      setWorkingSheet(existingLog.records);
    } else {
      // Initialize with default 'Present' for all filtered students
      const initial: { [regId: string]: 'Present' | 'Absent' | 'Leave' } = {};
      filteredStudents.forEach(student => {
        initial[student.regId] = 'Present';
      });
      setWorkingSheet(initial);
    }
  }, [selectedCourse, attendanceDate, selectedBatch, records]);

  // Handle single student toggle
  const handleMarkStatus = (regId: string, status: 'Present' | 'Absent' | 'Leave') => {
    setWorkingSheet(prev => ({
      ...prev,
      [regId]: status
    }));
  };

  // Bulk status controls
  const handleBulkMark = (status: 'Present' | 'Absent' | 'Leave') => {
    const updated = { ...workingSheet };
    filteredStudents.forEach(student => {
      updated[student.regId] = status;
    });
    setWorkingSheet(updated);
    showToast(`Marked all ${filteredStudents.length} students as ${status}`, 'info');
  };

  // Save attendance sheet
  const handleSaveSheet = () => {
    if (filteredStudents.length === 0) {
      showToast('No students enrolled to record attendance for!', 'err');
      return;
    }

    // Verify all filtered students have a marked state
    const finalisedRecords: { [regId: string]: 'Present' | 'Absent' | 'Leave' } = {};
    filteredStudents.forEach(student => {
      finalisedRecords[student.regId] = workingSheet[student.regId] || 'Present';
    });

    // Check if we are modifying an existing one or appending a new log
    const existingIndex = attendanceLogs.findIndex(
      log => log.courseName === selectedCourse && log.date === attendanceDate
    );

    const logEntry: AttendanceLog = {
      id: existingIndex >= 0 ? attendanceLogs[existingIndex].id : `att-${selectedCourse}-${attendanceDate}-${Date.now()}`,
      courseName: selectedCourse,
      date: attendanceDate,
      records: finalisedRecords,
      createdAt: existingIndex >= 0 ? attendanceLogs[existingIndex].createdAt : new Date().toISOString()
    };

    let updatedLogs = [...attendanceLogs];
    if (existingIndex >= 0) {
      updatedLogs[existingIndex] = logEntry;
      showToast(`Daily attendance rolls updated for ${selectedCourse} on ${attendanceDate}!`, 'success');
    } else {
      updatedLogs = [logEntry, ...updatedLogs];
      showToast(`Daily attendance successfully recorded for ${selectedCourse} on ${attendanceDate}!`, 'success');
    }

    onSaveAttendanceLogs(updatedLogs);
  };

  // CSV Report Serializer for Archival
  const handleDownloadCSV = () => {
    // Select relevant logs for the selected course
    const courseLogs = attendanceLogs.filter(log => log.courseName === selectedCourse);

    if (courseLogs.length === 0) {
      showToast('No logged attendance sessions available for this course to download.', 'info');
      return;
    }

    const csvRows: string[][] = [];

    // Header metadata rows for the report
    csvRows.push(['STUDENT ATTENDANCE ARCHIVAL REPORT']);
    csvRows.push(['Course Name:', selectedCourse]);
    csvRows.push(['Academics Batch Filter:', selectedBatch === 'All' ? 'All Active Batches' : selectedBatch]);
    csvRows.push(['Total Class Sessions Conducted:', String(courseLogs.length)]);
    csvRows.push(['Report Dynamic Date:', new Date().toLocaleDateString()]);
    csvRows.push([]); // Spacer row

    // Columns Headers
    csvRows.push([
      'Session Date',
      'Student Registration ID',
      'Student Name',
      'Father Name',
      'Contact Mobile',
      'CNIC',
      'Batch Identifier',
      'Assigned Course Program',
      'Roll-Call Attendance state'
    ]);

    // Sort sessions in chronological order
    const sortedLogs = [...courseLogs].sort((a, b) => a.date.localeCompare(b.date));

    let exportedRecordsCount = 0;

    sortedLogs.forEach(log => {
      Object.entries(log.records).forEach(([regId, status]) => {
        const student = records.find(r => r.regId === regId);
        
        // Filter student based on selected Batch filter
        if (selectedBatch !== 'All') {
          if (student && student.batchName !== selectedBatch && student.batchId !== selectedBatch) {
            return;
          }
        }

        const date = log.date;
        const studentId = regId;
        const studentName = student ? `${student.firstName} ${student.lastName}` : 'N/A';
        const fatherName = student ? (student.fatherName || 'Not available') : 'Not available';
        const mobile = student ? (student.mobile || 'N/A') : 'N/A';
        const cnic = student ? (student.cnic || 'N/A') : 'N/A';
        const batchName = student ? (student.batchName || student.batchId || 'N/A') : 'N/A';
        const courseTitle = log.courseName;

        csvRows.push([
          date,
          studentId,
          studentName,
          fatherName,
          mobile,
          cnic,
          batchName,
          courseTitle,
          status
        ]);
        
        exportedRecordsCount++;
      });
    });

    if (exportedRecordsCount === 0) {
      showToast('No record matched the selected filters under the registered sessions.', 'err');
      return;
    }

    // Wrap and serialise safely
    const csvContent = csvRows.map(row => 
      row.map(cell => {
        const escapedValue = String(cell ?? '').replace(/"/g, '""');
        return `"${escapedValue}"`;
      }).join(',')
    ).join('\n');

    try {
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const blobUrl = URL.createObjectURL(blob);
      const tempLink = document.createElement('a');
      tempLink.setAttribute('href', blobUrl);
      
      const safeCourseName = selectedCourse.replace(/[^a-zA-Z0-9]/g, '_');
      const safeBatchName = selectedBatch.replace(/[^a-zA-Z0-9]/g, '_');
      const fileName = `Attendance_Archival_Report_${safeCourseName}_${safeBatchName}_${attendanceDate}.csv`;
      
      tempLink.setAttribute('download', fileName);
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
      URL.revokeObjectURL(blobUrl);

      showToast(`Successfully downloaded archive of ${exportedRecordsCount} attendance records!`, 'success');
    } catch (err) {
      console.error('Failed to export daily attendance logs:', err);
      showToast('Failed to build download archive. Check browser security permissions.', 'err');
    }
  };

  // Math helper to calculate attendance percentage for a student ID
  const computeStudentStats = (studentRegId: string, studentCourse: string) => {
    // Find logs that belong to this student's course and include this student in the records map
    const courseLogs = attendanceLogs.filter(
      log => log.courseName === studentCourse && log.records[studentRegId] !== undefined
    );

    const totalDays = courseLogs.length;
    const presentDays = courseLogs.filter(log => log.records[studentRegId] === 'Present').length;
    const absentDays = courseLogs.filter(log => log.records[studentRegId] === 'Absent').length;
    const leaveDays = courseLogs.filter(log => log.records[studentRegId] === 'Leave').length;

    const percentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 100;

    return {
      total: totalDays,
      present: presentDays,
      absent: absentDays,
      leave: leaveDays,
      percentage
    };
  };

  // Extract critical counts
  const getWorkingSummaryCounts = () => {
    let presentCount = 0;
    let absentCount = 0;
    let leaveCount = 0;

    filteredStudents.forEach(st => {
      const state = workingSheet[st.regId] || 'Present';
      if (state === 'Present') presentCount++;
      else if (state === 'Absent') absentCount++;
      else if (state === 'Leave') leaveCount++;
    });

    return { presentCount, absentCount, leaveCount };
  };

  const { presentCount, absentCount, leaveCount } = getWorkingSummaryCounts();

  // Search filtered ledger list
  const getLedgerData = () => {
    const eligibleStudents = records.filter(r => {
      if (r.course !== selectedCourse) return false;
      if (selectedBatch !== 'All' && r.batchId !== selectedBatch && r.batchName !== selectedBatch) return false;
      
      const eligible = r.status === 'Enrolled' || r.status === 'Verified' || r.status === 'Processing';
      if (!eligible) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const fullName = `${r.firstName} ${r.lastName}`.toLowerCase();
        const fatherName = (r.fatherName || '').toLowerCase();
        const regId = (r.regId || '').toLowerCase();
        return fullName.includes(query) || fatherName.includes(query) || regId.includes(query);
      }
      return true;
    });

    return eligibleStudents.map(student => {
      const stats = computeStudentStats(student.regId, student.course);
      return {
        student,
        stats
      };
    });
  };

  const ledgerData = getLedgerData();

  // Stats summaries
  const totalClassesConducted = attendanceLogs.filter(log => log.courseName === selectedCourse).length;
  
  const lowAttendanceCount = ledgerData.filter(item => item.stats.percentage < 75 && item.stats.total > 0).length;

  const averageAttendancePct = (() => {
    if (ledgerData.length === 0) return 100;
    const sum = ledgerData.reduce((acc, curr) => acc + curr.stats.percentage, 0);
    return Math.round(sum / ledgerData.length);
  })();

  // Student specific history log helper
  const getStudentHistoryDetails = (regId: string, studentCourse: string) => {
    const studentLogs = attendanceLogs
      .filter(log => log.courseName === studentCourse && log.records[regId] !== undefined)
      .sort((a, b) => b.date.localeCompare(a.date)); // Sort latest first

    return studentLogs.map(log => ({
      date: log.date,
      status: log.records[regId]
    }));
  };

  const selectedStudentDetails = detailedStudentId 
    ? records.find(r => r.regId === detailedStudentId) 
    : null;

  const selectedStudentHistory = detailedStudentId && selectedStudentDetails
    ? getStudentHistoryDetails(detailedStudentId, selectedStudentDetails.course)
    : [];

  return (
    <div className="space-y-6 animate-fade-in-quick">
      
      {/* HEADER SECTION */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-md relative overflow-hidden border border-slate-800">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-y-4">
          <Clock className="w-64 h-64 text-blue-400" />
        </div>
        
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold tracking-widest text-[#2491bf] uppercase">
                Academic Operations Registry
              </span>
              <h3 className="text-2xl font-black tracking-tight flex items-center gap-2">
                <Users className="w-6 h-6 text-[#2491bf]" />
                <span>Student Daily Attendance Portal</span>
              </h3>
              <p className="text-xs text-slate-400 max-w-xl">
                Real-time cumulative calculation & attendance taking ledger. Highlighting active absentees and short-attendance critical warnings adaptively.
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleDownloadCSV}
                className="bg-[#2491bf] hover:bg-[#1a7ca5] text-white font-extrabold text-[11px] px-3.5 py-3 rounded-xl border border-transparent transition flex items-center gap-2 shadow-md cursor-pointer select-none active:scale-95"
                title="Download Attendance Report as formatted CSV file for archival"
              >
                <Download className="w-4 h-4 text-white" />
                <span>Download Attendance Report</span>
              </button>

              {/* TABS SELECTOR */}
              <div className="bg-slate-800/80 p-1 rounded-xl flex border border-slate-700/60 font-bold text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('take')}
                  className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'take'
                      ? 'bg-[#2491bf] text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <CalendarIcon className="w-4 h-4" />
                  <span>Take Daily Sheet</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('ledger')}
                  className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'ledger'
                      ? 'bg-[#2491bf] text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Attendance Ledger</span>
                  {lowAttendanceCount > 0 && (
                    <span className="bg-red-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                      {lowAttendanceCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* SHARED CONTROL FILTER REGISTRY BAR */}
          <div className="bg-slate-950/80 p-4 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-4 border border-slate-800/60">
            <div>
              <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Select Course Program
              </label>
              {isTrainer ? (
                <div className="w-full bg-slate-800 border border-slate-700/60 rounded-xl px-3 py-2 text-xs font-bold text-slate-200">
                  🔒 {selectedCourse} (Assigned)
                </div>
              ) : (
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full bg-slate-800 hover:bg-slate-700/50 border border-slate-700/60 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#2491bf]"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Academics Batch Filter
              </label>
              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="w-full bg-slate-800 hover:bg-slate-700/50 border border-slate-700/60 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#2491bf]"
              >
                <option value="All">All Active Batches</option>
                {batches.map(b => (
                  <option key={b.id} value={b.name}>{b.name}</option>
                ))}
              </select>
            </div>

            <div>
              {activeTab === 'take' ? (
                <>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Daily Roll-Call Date
                  </label>
                  <input
                    type="date"
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                    className="w-full bg-slate-800 hover:bg-slate-700/50 border border-slate-700/60 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#2491bf]"
                  />
                </>
              ) : (
                <>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Search Student Name or ID
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search ID, Name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-800 hover:bg-slate-700/50 border border-slate-700/60 rounded-xl pl-9 pr-3 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-[#2491bf]"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── TAB ONE: DAILY ROLL CALL ATTENDANCE SHEET ── */}
      {activeTab === 'take' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ROLL CALL LIST AND CONTROLS (LEFT 2 COLS) */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-3">
              <div>
                <h4 className="font-extrabold text-[#004173] text-sm flex items-center gap-1.5">
                  <span>Class Roll-Call Sheet</span>
                  <span className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded-full font-black">
                    {filteredStudents.length} Students
                  </span>
                </h4>
                <p className="text-[10px] text-gray-400">
                  Taking attendance for {selectedCourse} on <strong>{attendanceDate}</strong>.
                </p>
              </div>

              {/* BULK MARKS CONTROLS */}
              {filteredStudents.length > 0 && (
                <div className="flex items-center gap-1 bg-slate-50 p-1.5 rounded-xl border border-slate-200 text-[10px] font-bold">
                  <span className="text-gray-500 mr-2 ml-1">Bulk Mark:</span>
                  <button
                    type="button"
                    onClick={() => handleBulkMark('Present')}
                    className="flex items-center gap-1 bg-white hover:bg-green-50 text-green-700 px-2 py-1 rounded-lg border border-green-200 transition font-black cursor-pointer"
                  >
                    <Check className="w-3 h-3 text-green-500" />
                    <span>All Present</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleBulkMark('Absent')}
                    className="flex items-center gap-1 bg-white hover:bg-red-50 text-red-700 px-2 py-1 rounded-lg border border-red-200 transition font-black cursor-pointer"
                  >
                    <X className="w-3 h-3 text-red-500" />
                    <span>All Absent</span>
                  </button>
                </div>
              )}
            </div>

            {/* ERROR / EMPTY STATE */}
            {filteredStudents.length === 0 ? (
              <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-gray-200 space-y-3">
                <Users className="w-12 h-12 text-slate-300 mx-auto" />
                <div className="space-y-1">
                  <p className="font-bold text-gray-700 text-sm">No Active Students Found</p>
                  <p className="text-xs text-gray-400 max-w-sm mx-auto">
                    There are no enrolled or verified students registered under <strong>{selectedCourse}</strong> for the filtered batch.
                  </p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">
                      <th className="pb-2 pl-2">Student Ledger ID</th>
                      <th className="pb-2">FullName</th>
                      <th className="pb-2 text-center">Cumulative (Pct)</th>
                      <th className="pb-2 text-right pr-2">Daily Mark State</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-xs">
                    {filteredStudents.map((st) => {
                      const stats = computeStudentStats(st.regId, st.course);
                      const currentStatus = workingSheet[st.regId] || 'Present';
                      
                      // Highlight if below 75%
                      const isLowAttendance = stats.percentage < 75 && stats.total > 0;

                      return (
                        <tr 
                          key={st.regId} 
                          className={`hover:bg-slate-50/70 transition-all ${
                            isLowAttendance ? 'bg-red-50/20' : ''
                          }`}
                        >
                          {/* RegId */}
                          <td className="py-3 pl-2 font-mono font-bold text-[#003865]">
                            {st.regId}
                          </td>

                          {/* Student Details */}
                          <td className="py-3">
                            <div className="flex flex-col">
                              <span className="font-black text-gray-800 leading-tight">
                                {st.firstName} {st.lastName}
                              </span>
                              <span className="text-[10px] text-gray-400">
                                S/O: {st.fatherName || 'Not available'}
                              </span>
                            </div>
                          </td>

                          {/* Cumulative Stats and red highlighting if < 75% */}
                          <td className="py-3 text-center">
                            <div className="inline-flex flex-col items-center">
                              {stats.total === 0 ? (
                                <span className="bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded-md text-[10.5px]">
                                  No entries
                                </span>
                              ) : (
                                <span 
                                  className={`font-black text-[11px] px-2.5 py-1 rounded-full border flex items-center gap-1 ${
                                    isLowAttendance 
                                      ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse' 
                                      : 'bg-green-50 text-green-700 border-green-200'
                                  }`}
                                >
                                  {isLowAttendance && <AlertTriangle className="w-3 h-3 text-rose-500" />}
                                  {stats.percentage}%
                                </span>
                              )}
                              <span className="text-[9px] text-gray-400 mt-0.5">
                                ({stats.present}/{stats.total} classes)
                              </span>
                            </div>
                          </td>

                          {/* Toggle selectors (Present / Absent / Leave) */}
                          <td className="py-3 text-right pr-2">
                            <div className="inline-flex items-center gap-1.5 p-1 bg-gray-100 rounded-xl border border-gray-200">
                              <button
                                type="button"
                                onClick={() => handleMarkStatus(st.regId, 'Present')}
                                className={`px-2.5 py-1 rounded-lg text-[10.5px] font-black transition-all flex items-center gap-1 cursor-pointer ${
                                  currentStatus === 'Present'
                                    ? 'bg-green-600 text-white shadow-sm'
                                    : 'text-gray-500 hover:text-gray-800'
                                }`}
                              >
                                <Check className="w-3 h-3" />
                                <span>P</span>
                              </button>
                              
                              <button
                                type="button"
                                onClick={() => handleMarkStatus(st.regId, 'Absent')}
                                className={`px-2.5 py-1 rounded-lg text-[10.5px] font-black transition-all flex items-center gap-1 cursor-pointer ${
                                  currentStatus === 'Absent'
                                    ? 'bg-red-600 text-white shadow-sm'
                                    : 'text-gray-500 hover:text-gray-800'
                                }`}
                              >
                                <X className="w-3 h-3" />
                                <span>A</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleMarkStatus(st.regId, 'Leave')}
                                className={`px-2.5 py-1 rounded-lg text-[10.5px] font-black transition-all flex items-center gap-1 cursor-pointer ${
                                  currentStatus === 'Leave'
                                    ? 'bg-amber-500 text-white shadow-sm'
                                    : 'text-gray-500 hover:text-gray-800'
                                }`}
                              >
                                <Clock className="w-2.5 h-2.5" />
                                <span>L</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* SAVE CONTROLLER & STATE CONSOLE (RIGHT 1 COL) */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
              <div className="border-b border-gray-100 pb-3">
                <h4 className="font-extrabold text-[#004173] text-sm flex items-center gap-1.5">
                  <span>Attendance Console</span>
                </h4>
                <p className="text-[10.5px] text-gray-400">
                  Daily roll summary statistics prior to record submission.
                </p>
              </div>

              {/* STATS COUNT */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-3.5 bg-green-50 border border-green-100 rounded-xl space-y-1">
                  <p className="text-[9.5px] font-extrabold text-green-700 uppercase tracking-wider">Present</p>
                  <p className="text-xl font-black text-green-800">{presentCount}</p>
                </div>
                <div className="p-3.5 bg-red-50 border border-red-100 rounded-xl space-y-1">
                  <p className="text-[9.5px] font-extrabold text-red-700 uppercase tracking-wider">Absent</p>
                  <p className="text-xl font-black text-red-800">{absentCount}</p>
                </div>
                <div className="p-3.5 bg-amber-50 border border-amber-100 rounded-xl space-y-1">
                  <p className="text-[9.5px] font-extrabold text-amber-700 uppercase tracking-wider">Leave</p>
                  <p className="text-xl font-black text-amber-800">{leaveCount}</p>
                </div>
              </div>

              {/* SAVE BUTTON */}
              <button
                type="button"
                onClick={handleSaveSheet}
                className="w-full bg-[#004173] hover:bg-[#003865] text-white py-3 px-4 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Save Daily Roll Call Sheet</span>
              </button>

              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 text-[10.5px] text-blue-900 flex gap-2">
                <AlertTriangle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Persistent Storage</span>
                  <p className="text-gray-500 text-[10px] mt-0.5">
                    Submitting this form synchronizes class rolls locally with immediate reflection in attendance calculations and alerts.
                  </p>
                </div>
              </div>
            </div>

            {/* QUICK HISTORY LOG SECTION INSIDE ATTENDANCE CONSOLE */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-3">
              <div className="border-b border-gray-100 pb-2">
                <h4 className="font-extrabold text-gray-800 text-xs flex items-center gap-1.5">
                  <span>Course History Logs</span>
                </h4>
                <p className="text-[10px] text-gray-400">
                  Previously compiled session records for this program.
                </p>
              </div>

              {attendanceLogs.filter(log => log.courseName === selectedCourse).length === 0 ? (
                <p className="text-[10.5px] text-gray-400 italic py-2 text-center">
                  No attendance history logged yet.
                </p>
              ) : (
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {attendanceLogs
                    .filter(log => log.courseName === selectedCourse)
                    .map((log, index) => {
                      const present = Object.values(log.records).filter(v => v === 'Present').length;
                      const total = Object.values(log.records).length;

                      return (
                        <div 
                          key={log.id || `log-${log.date}-${index}`} 
                          onClick={() => setAttendanceDate(log.date)}
                          className={`flex items-center justify-between p-2 rounded-lg border text-xs cursor-pointer hover:bg-slate-50 transition-all ${
                            attendanceDate === log.date
                              ? 'border-[#2491bf] bg-blue-50/40'
                              : 'border-gray-100 bg-white'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
                            <span className="font-extrabold text-gray-700">{log.date}</span>
                          </div>
                          <span className="text-[10px] font-bold text-[#2491bf] bg-blue-50 px-2 py-0.5 rounded">
                            {present} / {total} Present
                          </span>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB TWO: CUMULATIVE ATTENDANCE LEDGER & ALERTS ── */}
      {activeTab === 'ledger' && (
        <div className="space-y-6">
          {/* STATISTICS OVERVIEW BOARD */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex items-center gap-4">
              <div className="bg-slate-100 p-3.5 rounded-2xl text-slate-800">
                <CalendarIcon className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">
                  Total Sessions Held
                </span>
                <span className="text-xl font-black text-gray-900">{totalClassesConducted} Classes</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex items-center gap-4">
              <div className="bg-green-50 p-3.5 rounded-2xl text-green-700 border border-green-100">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">
                  Overall Average Pct
                </span>
                <span className="text-xl font-black text-gray-900">{averageAttendancePct}% Average</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex items-center gap-4">
              <div className={`p-3.5 rounded-2xl border ${
                lowAttendanceCount > 0 
                  ? 'bg-rose-50 text-rose-700 border-rose-100 animate-pulse' 
                  : 'bg-slate-50 text-slate-400 border-slate-100'
              }`}>
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">
                  Short Attendance (Below 75%)
                </span>
                <span className={`text-xl font-black ${lowAttendanceCount > 0 ? 'text-rose-600' : 'text-gray-900'}`}>
                  {lowAttendanceCount} Students Alert
                </span>
              </div>
            </div>
          </div>

          {/* LEDGER GRID LOG */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-3">
              <div>
                <h4 className="font-extrabold text-[#004173] text-sm">
                  Full Course Cumulative Attendance Dashboard
                </h4>
                <p className="text-[10px] text-gray-400">
                  Detailed active statistics matching the dynamic system rules. Students below 75% are highlighted in red.
                </p>
              </div>
              <button
                type="button"
                onClick={handleDownloadCSV}
                className="bg-[#2491bf] hover:bg-[#1a7ca5] text-white py-2 px-4 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs select-none active:scale-95 shrink-0"
                title="Download Attendance Report as formatted CSV for archiving"
              >
                <Download className="w-4 h-4 text-white" />
                <span>Download Attendance Report</span>
              </button>
            </div>

            {ledgerData.length === 0 ? (
              <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-gray-200 space-y-2">
                <Search className="w-10 h-10 text-slate-300 mx-auto" strokeWidth={1.5} />
                <p className="font-bold text-gray-700 text-sm">No matched registry students</p>
                <p className="text-xs text-gray-400">Try adjusting your filters or search terms.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">
                      <th className="pb-2.5 pl-2">Student ID</th>
                      <th className="pb-2.5">Name</th>
                      <th className="pb-2.5 text-center">Classes Attended</th>
                      <th className="pb-2.5 text-center">Classes Absent/Leave</th>
                      <th className="pb-2.5 text-center">Attendance % (Calculated)</th>
                      <th className="pb-2.5 text-center">Academic Standing Status</th>
                      <th className="pb-2.5 text-right pr-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-xs">
                    {ledgerData.map(({ student, stats }) => {
                      const isLowAttendance = stats.percentage < 75 && stats.total > 0;

                      return (
                        <tr 
                          key={student.regId} 
                          className={`hover:bg-slate-50/70 transition-all ${
                            isLowAttendance ? 'bg-red-50/35 border-l-4 border-l-red-500 font-medium' : ''
                          }`}
                        >
                          {/* RegId */}
                          <td className="py-3.5 pl-2 font-mono font-bold text-[#003865]">
                            {student.regId}
                          </td>

                          {/* Student Details */}
                          <td className="py-3.5">
                            <div className="flex flex-col">
                              <span className={`font-black text-gray-900 ${isLowAttendance ? 'text-red-700' : 'text-gray-800'}`}>
                                {student.firstName} {student.lastName}
                              </span>
                              <span className="text-[10.5px] text-gray-400">
                                S/O: {student.fatherName || 'Not available'}
                              </span>
                            </div>
                          </td>

                          {/* Attended Count */}
                          <td className="py-3.5 text-center font-bold text-green-700">
                            {stats.present} / {stats.total}
                          </td>

                          {/* Absents Count */}
                          <td className="py-3.5 text-center text-gray-500 font-bold">
                            {stats.absent} Abs / {stats.leave} Lve
                          </td>

                          {/* Attendance percentage indicator (Mark Student RED if below 75%) */}
                          <td className="py-3.5 text-center">
                            <span 
                              className={`font-black text-[12px] px-3 py-1 rounded-full border ${
                                isLowAttendance
                                  ? 'bg-red-100 text-red-700 border-red-300 animate-pulse'
                                  : stats.total === 0 
                                    ? 'bg-slate-100 text-slate-500 border-slate-200'
                                    : 'bg-green-100 text-green-700 border-green-300'
                              }`}
                            >
                              {stats.percentage}%
                            </span>
                          </td>

                          {/* Standing Status (Mark Student Status text / badge RED if below 75%) */}
                          <td className="py-3.5 text-center">
                            {isLowAttendance ? (
                              <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 border border-red-200 text-[10px] font-black uppercase px-2 py-0.5 rounded-lg">
                                <AlertTriangle className="w-3 h-3 text-red-500" />
                                <span>Short Attendance Warning</span>
                              </span>
                            ) : stats.total === 0 ? (
                              <span className="inline-flex items-center gap-1 bg-slate-50 text-slate-500 border border-slate-200 text-[10px] font-black uppercase px-2 py-0.5 rounded-lg">
                                <span>No Roll Held Yet</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 border border-green-200 text-[10px] font-black uppercase px-2 py-0.5 rounded-lg">
                                <CheckCircle className="w-3 h-3 text-green-500" />
                                <span>Eligible / Standing Regular</span>
                              </span>
                            )}
                          </td>

                          {/* Drill-down action list */}
                          <td className="py-3.5 text-right pr-2">
                            <button
                              type="button"
                              onClick={() => setDetailedStudentId(student.regId)}
                              className="bg-slate-100 hover:bg-[#004173] hover:text-white text-slate-700 text-[10.5px] font-extrabold px-3 py-1 rounded-lg border border-slate-200/60 transition cursor-pointer"
                            >
                              View log history
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── DRILL DOWN HISTORY MODAL / SLIDE OVER ── */}
      {detailedStudentId && selectedStudentDetails && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl max-w-md w-full relative overflow-hidden animate-fade-in-quick">
            {/* Header banner */}
            <div className="bg-slate-900 text-white p-6 relative">
              <button
                type="button"
                onClick={() => setDetailedStudentId(null)}
                className="absolute right-4 top-4 text-slate-400 hover:text-white cursor-pointer bg-slate-800 p-1.5 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="space-y-1">
                <span className="text-[10px] font-bold tracking-widest text-[#2491bf] uppercase">
                  Individual Student Attendance Log
                </span>
                <h4 className="font-black text-lg">
                  {selectedStudentDetails.firstName} {selectedStudentDetails.lastName}
                </h4>
                <p className="text-[10.5px] text-slate-400 leading-tight">
                  Reg ID: <strong className="font-mono text-[#2491bf]">{selectedStudentDetails.regId}</strong> · Course: {selectedStudentDetails.course}
                </p>
              </div>
            </div>

            {/* Attendance Analytics summary for student */}
            {(() => {
              const studentStats = computeStudentStats(selectedStudentDetails.regId, selectedStudentDetails.course);
              const isLow = studentStats.percentage < 75 && studentStats.total > 0;

              return (
                <div className="p-6 space-y-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-0.5">Classes</span>
                      <span className="text-sm font-black text-slate-800">{studentStats.total}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-0.5">Attended</span>
                      <span className="text-sm font-black text-green-700">{studentStats.present}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-0.5">Abs/Leave</span>
                      <span className="text-sm font-black text-rose-700">{studentStats.absent + studentStats.leave}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3.5 rounded-xl border border-dashed text-xs">
                    <span className="font-extrabold text-gray-500">Cumulative Attendance standing:</span>
                    <span 
                      className={`font-black text-[13px] px-3.5 py-1 rounded-full ${
                        isLow
                          ? 'bg-red-100 text-red-800 border-red-300'
                          : 'bg-green-100 text-green-800 border-green-300'
                      }`}
                    >
                      {studentStats.percentage}%
                    </span>
                  </div>

                  {isLow && (
                    <div className="bg-red-50 border border-red-100 rounded-xl p-3 flex gap-2 text-[10.5px] text-red-900 font-medium">
                      <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-black block text-red-950">SHORT ATTENDANCE WARNING ACCREDITED</span>
                        Student attendance is under the mandatory 75% threshold! Immediate coaching warning required to retain registration eligibility.
                      </div>
                    </div>
                  )}

                  {/* History Logs list */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">
                      Chronological Roll Entry Database
                    </p>
                    {selectedStudentHistory.length === 0 ? (
                      <p className="text-xs text-center text-gray-400 italic py-6">
                        No roll sessions recorded for this student.
                      </p>
                    ) : (
                      <div className="space-y-1 ml-1.5 border-l-2 border-slate-100 max-h-48 overflow-y-auto pr-1">
                        {selectedStudentHistory.map((item, index) => (
                          <div key={index} className="flex items-center justify-between pl-3.5 py-1.5 relative group">
                            {/* Chronology Dot */}
                            <div className={`absolute -left-[5px] top-[14px] w-2 h-2 rounded-full border border-white ${
                              item.status === 'Present'
                                ? 'bg-green-500'
                                : item.status === 'Leave'
                                  ? 'bg-amber-400'
                                  : 'bg-red-500'
                            }`} />
                            
                            <span className="text-xs font-bold text-gray-700">{item.date}</span>
                            
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                              item.status === 'Present'
                                ? 'bg-green-50 text-green-700 border border-green-100'
                                : item.status === 'Leave'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-100'
                                  : 'bg-red-50 text-red-700 border border-red-100'
                            }`}>
                              {item.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Footer close option */}
            <div className="bg-slate-50 p-4 border-t border-slate-100 text-center">
              <button
                type="button"
                onClick={() => setDetailedStudentId(null)}
                className="bg-slate-800 hover:bg-slate-950 text-white rounded-xl text-xs font-extrabold px-6 py-2 transition cursor-pointer"
              >
                Close Logs Console
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
