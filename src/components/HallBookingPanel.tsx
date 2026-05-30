import React, { useState } from 'react';
import { 
  Calendar, 
  Plus, 
  Trash2, 
  Printer, 
  Building, 
  User, 
  DollarSign, 
  Users, 
  Clock, 
  Tag, 
  AlertTriangle, 
  ChevronLeft, 
  ChevronRight, 
  Info, 
  List, 
  CheckCircle, 
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { Employee, HallBooking } from '../types';

interface HallBookingPanelProps {
  currentUser: Employee | null;
  bookings: HallBooking[];
  onAddBooking: (b: HallBooking) => void;
  onDeleteBooking: (id: string) => void;
  onPrintInvoice: (b: HallBooking) => void;
}

export default function HallBookingPanel({
  currentUser,
  bookings,
  onAddBooking,
  onDeleteBooking,
  onPrintInvoice,
}: HallBookingPanelProps) {
  // Form state
  const [companyName, setCompanyName] = useState('');
  const [personName, setPersonName] = useState('');
  const [bookingFor, setBookingFor] = useState<'Seminar Hall' | 'Conference Room'>('Seminar Hall');
  const [price, setPrice] = useState<number>(35000);
  const [duration, setDuration] = useState('8 Hours (Full Day)');
  const [eventType, setEventType] = useState('Corporate Training');
  const [seatingCapacity, setSeatingCapacity] = useState<number>(80);
  const [eventDate, setEventDate] = useState('2026-05-25'); // Default to current date context
  const [timeSlot, setTimeSlot] = useState('09:00 AM – 05:00 PM');
  const [venueRoom, setVenueRoom] = useState('Main Seminar Hall – A');

  // Multi-view active tab inside bookings panel
  const [activeTab, setActiveTab] = useState<'calendar' | 'list'>('calendar');

  // Calendar State (Defaulting to May 2026 based on environmental current time 2026-05-25)
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(2026, 4, 1)); // May 1st, 2026
  const [selectedDateStr, setSelectedDateStr] = useState<string>('2026-05-25');
  const [calendarSpaceFilter, setCalendarSpaceFilter] = useState<'All' | 'Seminar Hall' | 'Conference Room'>('All');

  const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Stats Counters
  const totalBookings = bookings.length;
  const totalRevenue = bookings.reduce((sum, b) => sum + b.price, 0);
  const averageCapacity = totalBookings > 0 
    ? Math.round(bookings.reduce((sum, b) => sum + b.seatingCapacity, 0) / totalBookings) 
    : 0;

  // Conflict Detection Helpers
  const getBookingsOnDate = (dateStr: string) => {
    return bookings.filter(b => b.eventDate === dateStr);
  };

  const hasRoomConflictOnDate = (dateStr: string) => {
    const dayBookings = getBookingsOnDate(dateStr);
    const rooms = dayBookings.map(b => b.venueRoom.toLowerCase().trim());
    return rooms.some((room, index) => rooms.indexOf(room) !== index);
  };

  const getConflictsOnDate = (dateStr: string) => {
    const dayBookings = getBookingsOnDate(dateStr);
    const conflicts: HallBooking[] = [];
    for (let i = 0; i < dayBookings.length; i++) {
      for (let j = i + 1; j < dayBookings.length; j++) {
        if (dayBookings[i].venueRoom.toLowerCase().trim() === dayBookings[j].venueRoom.toLowerCase().trim()) {
          if (!conflicts.some(c => c.id === dayBookings[i].id)) conflicts.push(dayBookings[i]);
          if (!conflicts.some(c => c.id === dayBookings[j].id)) conflicts.push(dayBookings[j]);
        }
      }
    }
    return conflicts;
  };

  // Live checker for the current form entries to prevent conflicts in real-time
  const activeFormConflict = bookings.find(b => 
    b.eventDate === eventDate && 
    b.venueRoom.toLowerCase().trim() === venueRoom.toLowerCase().trim()
  );

  const handlePrevMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleSelectCalendarDate = (dateStr: string) => {
    setSelectedDateStr(dateStr);
    setEventDate(dateStr); // Synchronize with booking creation form date field
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !personName.trim() || !eventDate) {
      alert('Please fully specify Company Name, Contact Person, and Event Date.');
      return;
    }

    // Explicit conflict warning block to prevent user from booking overlapping room slots unconsciously
    if (activeFormConflict) {
      const confirmOverride = window.confirm(
        `⚠️ VENUE SCHEDULING CONFLICT DETECTED!\n\n` +
        `"${venueRoom}" is already reserved on ${eventDate} by "${activeFormConflict.companyName}" for the event "${activeFormConflict.eventType}" (${activeFormConflict.timeSlot}).\n\n` +
        `Do you want to ignore this warning and override this booking, resulting in a scheduling conflict?`
      );
      if (!confirmOverride) {
        return;
      }
    }

    const newBooking: HallBooking = {
      id: 'hb-' + Date.now().toString(),
      companyName: companyName.trim(),
      personName: personName.trim(),
      bookingFor,
      price,
      duration: duration.trim() || '8 Hours (Full Day)',
      eventType: eventType.trim() || 'General Event',
      seatingCapacity: seatingCapacity || 50,
      eventDate,
      timeSlot: timeSlot.trim() || '09:00 AM – 05:00 PM',
      venueRoom: venueRoom.trim() || 'Main Hall',
      createdAt: new Date().toISOString(),
    };

    onAddBooking(newBooking);

    // Reset Form fields elegantly
    setCompanyName('');
    setPersonName('');
    setBookingFor('Seminar Hall');
    setPrice(35000);
    setDuration('8 Hours (Full Day)');
    setEventType('Corporate Training');
    setSeatingCapacity(80);
    setTimeSlot('09:00 AM – 05:00 PM');
    setVenueRoom('Main Seminar Hall – A');
  };

  // Calendar math structure generation (7 cols x 6 rows max grid of Dates)
  const generateCalendarCells = () => {
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const startDayOfWeek = startOfMonth.getDay(); // 0 (Sun) to 6 (Sat)
    const totalDays = endOfMonth.getDate();

    const cells: { date: Date; isCurrentMonth: boolean; dateString: string }[] = [];

    // Prior Month buffering days
    const prevMonthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0);
    const prevMonthTotalDays = prevMonthEnd.getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, prevMonthTotalDays - i);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      cells.push({
        date: d,
        isCurrentMonth: false,
        dateString: `${y}-${m}-${day}`
      });
    }

    // Active Month days
    for (let i = 1; i <= totalDays; i++) {
      const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      cells.push({
        date: d,
        isCurrentMonth: true,
        dateString: `${y}-${m}-${day}`
      });
    }

    // Posterior Month trailing days to fit full grid
    const remainingDays = 42 - cells.length;
    for (let i = 1; i <= remainingDays; i++) {
      const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, i);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      cells.push({
        date: d,
        isCurrentMonth: false,
        dateString: `${y}-${m}-${day}`
      });
    }

    return cells;
  };

  const calendarDays = generateCalendarCells();
  const selectedDayBookings = getBookingsOnDate(selectedDateStr);
  const selectedDayConflicts = getConflictsOnDate(selectedDateStr);

  return (
    <div className="space-y-6 animate-fade-in-quick">
      {/* Header section */}
      <div>
        <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#004173]" />
          <span>Seminar Hall & Conference Room Booking desk</span>
        </h3>
        <p className="text-xs text-gray-400">
          Book high-quality corporate spaces and seminar halls. Track scheduling conflicts, view live occupancy logs, and download print-ready receipts!
        </p>
      </div>

      {/* KPI Stats widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-2xs flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-[#004173] rounded-xl">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-black tracking-widest text-[#004173] uppercase block select-none">
              Total Space Bookings
            </span>
            <div className="text-lg font-black text-gray-900 font-mono">
              {totalBookings} Reserved
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-2xs flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-black tracking-widest text-emerald-600 uppercase block select-none">
              Gross Venue Billing Value
            </span>
            <div className="text-lg font-black text-gray-900 font-mono">
              {totalRevenue.toLocaleString()} PKR
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-2xs flex items-center gap-3">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-black tracking-widest text-purple-600 uppercase block select-none">
              Average Crowd Space Capacity
            </span>
            <div className="text-lg font-black text-gray-900 font-mono">
              ~{averageCapacity} Persons
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side Column: Space Reservation Form */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4 h-fit">
          <div className="border-b border-gray-100 pb-3">
            <h4 className="font-extrabold text-[#004173] text-sm flex items-center gap-1.5">
              <span>📅 Reserve Venue Space</span>
            </h4>
            <p className="text-[10.5px] text-gray-400">
              Create a new premium booking record for conferences or corporate events.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">Company / Org Name</label>
              <input
                type="text"
                required
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                placeholder="e.g. TechVision Solutions"
                className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2491bf] font-bold"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">Contact Person Name</label>
              <input
                type="text"
                required
                value={personName}
                onChange={e => setPersonName(e.target.value)}
                placeholder="e.g. Kamran Malik"
                className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2491bf] font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">Booking For</label>
                <select
                  value={bookingFor}
                  onChange={e => {
                    const val = e.target.value as any;
                    setBookingFor(val);
                    setPrice(val === 'Seminar Hall' ? 40000 : 15000);
                    setVenueRoom(val === 'Seminar Hall' ? 'Main Seminar Hall – A' : 'Executive Boardroom – 1');
                    setSeatingCapacity(val === 'Seminar Hall' ? 80 : 25);
                  }}
                  className="w-full text-xs p-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2491bf] font-bold cursor-pointer"
                >
                  <option value="Seminar Hall">Seminar Hall</option>
                  <option value="Conference Room">Conference Room</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">Total Fee (PKR)</label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={e => setPrice(Number(e.target.value))}
                  className="w-full text-xs p-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2491bf] font-mono font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">Event Duration</label>
                <input
                  type="text"
                  required
                  value={duration}
                  onChange={e => setDuration(e.target.value)}
                  placeholder="e.g. 8 Hours (Full Day)"
                  className="w-full text-xs p-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2491bf]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">Event Type / Title</label>
                <input
                  type="text"
                  required
                  value={eventType}
                  onChange={e => setEventType(e.target.value)}
                  placeholder="e.g. Corporate Seminar"
                  className="w-full text-xs p-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2491bf]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">Seating Capacity</label>
                <input
                  type="number"
                  required
                  value={seatingCapacity}
                  onChange={e => setSeatingCapacity(Number(e.target.value))}
                  className="w-full text-xs p-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2491bf] font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">Event Date</label>
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={e => setEventDate(e.target.value)}
                  className="w-full text-xs p-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2491bf] font-mono font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">Time Slot Range</label>
                <input
                  type="text"
                  required
                  value={timeSlot}
                  onChange={e => setTimeSlot(e.target.value)}
                  placeholder="e.g. 09:00 AM – 05:00 PM"
                  className="w-full text-xs p-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2491bf]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">Venue / Room Name</label>
                <select
                  value={venueRoom}
                  onChange={e => setVenueRoom(e.target.value)}
                  className="w-full text-xs p-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2491bf] font-bold cursor-pointer"
                >
                  {bookingFor === 'Seminar Hall' ? (
                    <>
                      <option value="Main Seminar Hall – A">Main Seminar Hall – A</option>
                      <option value="Upper Auditorium – B">Upper Auditorium – B</option>
                      <option value="Exhibition Lounge – C">Exhibition Lounge – C</option>
                    </>
                  ) : (
                    <>
                      <option value="Executive Boardroom – 1">Executive Boardroom – 1</option>
                      <option value="Premium Meeting Room – 2">Premium Meeting Room – 2</option>
                      <option value="Team Collaboration Cell – 3">Team Collaboration Cell – 3</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            {/* LIVE CONFLICT WARNING ELEMENT (Directly displays any venue double-booking as you fill the calendar) */}
            <div className="pt-2">
              {activeFormConflict ? (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 space-y-2 text-rose-900 text-xs animate-pulse">
                  <div className="flex items-center gap-1.5 font-extrabold text-red-600">
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>🚨 ROOM SCHEDULING CONFLICT</span>
                  </div>
                  <p className="font-medium text-slate-700 leading-relaxed text-[11px]">
                    <strong>{activeFormConflict.companyName}</strong> has already booked <strong>{venueRoom}</strong> for <em>"{activeFormConflict.eventType}"</em> on {eventDate}.
                  </p>
                  <div className="text-[10px] font-mono text-red-600 font-extrabold flex items-center gap-1 bg-red-100/50 py-1 px-1.5 rounded w-fit uppercase">
                    Slot Taken: {activeFormConflict.timeSlot}
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-emerald-800 text-xs flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold text-emerald-950 block">🟢 Space Status Available</span>
                    <p className="text-[10.5px] text-gray-500 font-medium">
                      "{venueRoom}" is vacant and completely open for booking on {eventDate || 'No selected date'}.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              className={`w-full text-[11px] font-bold py-2.5 rounded-lg shadow transition flex items-center justify-center gap-1.5 cursor-pointer mt-3 ${
                activeFormConflict 
                  ? 'bg-amber-600 hover:bg-amber-700 text-white' 
                  : 'bg-[#004173] hover:bg-[#2491bf] text-white'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{activeFormConflict ? 'Force Double-Book Venue' : 'Confirm Space Reservation'}</span>
            </button>
          </form>
        </div>

        {/* Right Side Column: Tab Switcher & Display View (Conflict Calendar or Bookings Ledger) */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Tab Selection Switches */}
          <div className="flex bg-slate-100 rounded-xl p-1 w-full sm:w-fit border border-slate-200">
            <button
              type="button"
              onClick={() => setActiveTab('calendar')}
              className={`flex-1 sm:flex-none flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition duration-150 cursor-pointer ${
                activeTab === 'calendar'
                  ? 'bg-white text-[#004173] shadow-xs border border-slate-200/50'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <Calendar className="w-4 h-4 text-[#004173]" />
              <span>📅 Interactive Conflict Calendar</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('list')}
              className={`flex-1 sm:flex-none flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition duration-150 cursor-pointer ${
                activeTab === 'list'
                  ? 'bg-white text-[#004173] shadow-xs border border-slate-200/50'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <List className="w-4 h-4 text-[#004173]" />
              <span>📋 Bookings Ledger ({totalBookings})</span>
            </button>
          </div>

          {/* VIEW SWITCHER: TAB A (INTERACTIVE冲突CALENDAR) */}
          {activeTab === 'calendar' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4 animate-fade-in-quick">
              
              {/* Calendar Controls and Filter Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
                <div>
                  <h4 className="font-extrabold text-gray-900 text-sm">
                    STP Venue Occupancy Calendar
                  </h4>
                  <p className="text-[10.5px] text-gray-400">
                    Map scheduling slots visually. Select any date to view individual room allocations and resolve overlaps immediately.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Space filter list */}
                  <select
                    value={calendarSpaceFilter}
                    onChange={e => setCalendarSpaceFilter(e.target.value as any)}
                    className="text-xs p-2 border border-gray-200 bg-slate-50 font-bold rounded-lg focus:outline-none focus:border-[#2491bf] cursor-pointer"
                  >
                    <option value="All">All Spaces (Seminar & Boardrooms)</option>
                    <option value="Seminar Hall">Seminar Halls Only</option>
                    <option value="Conference Room">Conference Rooms Only</option>
                  </select>

                  {/* Month navigation controls */}
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
                    <button
                      type="button"
                      onClick={handlePrevMonth}
                      className="p-1 hover:bg-white text-gray-600 rounded transition cursor-pointer"
                      title="Previous Month"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-extrabold font-mono text-gray-800 px-2 select-none">
                      {MONTH_NAMES[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                    </span>
                    <button
                      type="button"
                      onClick={handleNextMonth}
                      className="p-1 hover:bg-white text-gray-600 rounded transition cursor-pointer"
                      title="Next Month"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Legend of Calendar color codes */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[10px] font-bold text-gray-500 bg-slate-50 p-2.5 rounded-xl border border-dashed">
                <span className="text-slate-400 uppercase tracking-widest block font-mono mr-1">Legend:</span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-amber-500/15 border border-amber-300 block"></span>
                  <span>Seminar Space</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-sky-500/15 border border-sky-300 block"></span>
                  <span>Boardroom / Meet Space</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-rose-500/10 border border-rose-400/50 block"></span>
                  <span className="text-rose-700">🚨 Scheduling Conflict (Overlap Room on Date)</span>
                </span>
              </div>

              {/* Calendar Grid UI */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
                {/* 7 Day Headings */}
                <div className="grid grid-cols-7 text-center border-b border-slate-150 py-2.5 bg-slate-100 font-black text-[9.5px] uppercase tracking-widest text-[#004173]">
                  <div>Sun</div>
                  <div>Mon</div>
                  <div>Tue</div>
                  <div>Wed</div>
                  <div>Thu</div>
                  <div>Fri</div>
                  <div>Sat</div>
                </div>

                {/* Date slots grid */}
                <div className="grid grid-cols-7 divide-x divide-y divide-slate-150 border-t -mt-[1px]">
                  {calendarDays.map((cell, idx) => {
                    const dayBookings = getBookingsOnDate(cell.dateString).filter(b => 
                      calendarSpaceFilter === 'All' ? true : b.bookingFor === calendarSpaceFilter
                    );
                    const dayConflicts = getConflictsOnDate(cell.dateString).filter(b => 
                      calendarSpaceFilter === 'All' ? true : b.bookingFor === calendarSpaceFilter
                    );
                    const hasConflict = dayConflicts.length > 0;
                    
                    const isSelected = cell.dateString === selectedDateStr;
                    const isCurrentMonth = cell.isCurrentMonth;
                    
                    // Highlight May 25, 2026 specifically as today's focus context of the app
                    const isToday = cell.dateString === '2026-05-25';

                    return (
                      <div
                        key={idx}
                        onClick={() => handleSelectCalendarDate(cell.dateString)}
                        className={`min-h-[85px] sm:min-h-[95px] p-1.5 flex flex-col justify-between transition relative cursor-pointer group ${
                          isCurrentMonth ? 'bg-white hover:bg-slate-50/40' : 'bg-slate-50/20 text-slate-350 hover:bg-slate-50/10'
                        } ${
                          isSelected ? 'ring-2 ring-[#004173] ring-inset z-10' : ''
                        } ${
                          hasConflict ? 'bg-rose-50/40 hover:bg-rose-100/30' : ''
                        }`}
                      >
                        {/* Day indicator & conflict label combo */}
                        <div className="flex justify-between items-center">
                          <span className={`text-[10.5px] font-black font-mono px-1.5 py-0.5 rounded-full ${
                            isToday 
                              ? 'bg-[#004173] text-white text-[10.5px]' 
                              : isSelected
                                ? 'bg-[#2491bf] text-white font-black'
                                : isCurrentMonth ? 'text-gray-800' : 'text-gray-300'
                          }`}>
                            {cell.date.getDate()}
                          </span>

                          {hasConflict && (
                            <span className="text-[8.5px] font-black bg-rose-500 text-white rounded px-1 flex items-center gap-0.5 animate-pulse uppercase tracking-tighter" title="Multiple reservations of the same venue on this date">
                              Conflict
                            </span>
                          )}
                        </div>

                        {/* High-density layout showing booking tags for that date */}
                        <div className="space-y-1 mt-1.5">
                          {dayBookings.slice(0, 3).map(b => {
                            const isConflictedElement = dayConflicts.some(dc => dc.id === b.id);
                            const isSeminar = b.bookingFor === 'Seminar Hall';
                            return (
                              <div
                                key={b.id}
                                className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded truncate select-none border tracking-tight ${
                                  isConflictedElement
                                    ? 'bg-rose-500/10 text-rose-800 border-rose-400/50'
                                    : isSeminar 
                                      ? 'bg-amber-500/10 text-amber-900 border-amber-300/30' 
                                      : 'bg-sky-500/15 text-sky-900 border-sky-300/30'
                                }`}
                                title={`${b.companyName} | ${b.venueRoom}\nSlot: ${b.timeSlot}`}
                              >
                                {isConflictedElement ? '⚠️ ' : ''}
                                <span className="font-semibold block sm:inline">{b.companyName.substring(0, 8)}..</span> 
                                <span className="text-[8px] font-extrabold opacity-75 font-mono ml-0.5">({isSeminar ? 'Hall' : 'Meet'})</span>
                              </div>
                            );
                          })}

                          {dayBookings.length > 3 && (
                            <div className="text-[8px] font-mono text-gray-500 font-black text-center">
                              +{dayBookings.length - 3} More Spaces Blocked
                            </div>
                          )}
                        </div>
                        
                        {/* Selected date border and hovering indicators */}
                        {isSelected && !isToday && (
                          <div className="absolute right-1 bottom-1 w-1.5 h-1.5 rounded-full bg-[#2491bf]"></div>
                        )}
                        {isToday && (
                          <span className="absolute right-1.5 bottom-1 text-[8px] font-extrabold tracking-widest text-[#004173] font-mono select-none uppercase scale-90 opacity-60">Today</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Day's Detail Subsection when clicking calendar cell to view conflicts directly & choose alternate plans */}
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-150 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">📅</span>
                    <div>
                      <h5 className="font-extrabold text-gray-900 text-xs uppercase tracking-wider">
                        Occupancy Details: {new Date(selectedDateStr + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
                      </h5>
                      <p className="text-[10px] text-gray-400">
                        Check booked spaces and schedules specifically scheduled on this day.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setEventDate(selectedDateStr);
                      // focus on form
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }}
                    className="bg-white hover:bg-[#004173] text-[#004173] hover:text-white font-black text-[10.5px] py-1.5 px-3.5 rounded-xl border border-slate-200 shadow-3xs transition flex items-center gap-1.5 cursor-pointer ml-auto sm:ml-0"
                  >
                    <span>➕ Schedule on this Date</span>
                  </button>
                </div>

                {selectedDayBookings.length === 0 ? (
                  <div className="bg-white rounded-xl p-8 text-center border border-dashed border-slate-200 text-xs text-gray-400 font-semibold flex flex-col items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-400 animate-bounce" />
                    <span>Purely Vacant! No events planned for this date. Space reservation handles successfully!</span>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {/* Conflict Highlight alert on active day selection */}
                    {selectedDayConflicts.length > 0 && (
                      <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-950 flex items-start gap-2 animate-fade-in">
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-extrabold block text-rose-950">🚨 RED WARNING: DOUBLE VENUE CONFLICT FOUND</span>
                          <p className="text-[10.5px] leading-relaxed mt-0.5 text-slate-600 font-medium">
                            Multiple distinct companies have reserved the same venue room at the exact same calendar date! 
                            Review contact details below to coordinate rescheduling, shift room codes, or enforce custom intervals.
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedDayBookings.map((b) => {
                        const isConflicted = selectedDayConflicts.some(dc => dc.id === b.id);
                        return (
                          <div 
                            key={b.id} 
                            className={`rounded-xl p-3.5 border transition ${
                              isConflicted 
                                ? 'bg-rose-50/40 border-rose-200 shadow-3xs hover:border-rose-350' 
                                : 'bg-white border-gray-150 shadow-3xs hover:border-[#2491bf]'
                            }`}
                          >
                            <div className="flex justify-between items-start gap-2 border-b border-slate-100 pb-2 mb-2">
                              <div>
                                <span className={`inline-block px-2 py-0.5 rounded text-[9.5px] font-extrabold ${
                                  b.bookingFor === 'Seminar Hall' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-sky-55 text-sky-700 border border-sky-100'
                                }`}>
                                  {b.bookingFor}
                                </span>
                                <h6 className="font-extrabold text-[#004173] text-xs mt-1.5 flex items-center gap-1">
                                  <span>🏢 {b.companyName}</span>
                                </h6>
                              </div>
                              
                              <div className="text-right font-mono text-[10.5px] font-black text-slate-800">
                                {b.price.toLocaleString()} PKR
                              </div>
                            </div>

                            <div className="space-y-1.5 text-[10.5px] text-gray-500 font-semibold">
                              <div className="flex items-center gap-1.5 text-slate-700">
                                <span className="font-black text-slate-900">Room:</span>
                                <span>{b.venueRoom}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                <span>{b.timeSlot} ({b.duration})</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5 text-slate-400" />
                                <span>Contact: {b.personName} | Type: {b.eventType}</span>
                              </div>
                            </div>

                            <div className="flex gap-2 justify-end pt-2 border-t border-slate-50 mt-2.5">
                              <button
                                type="button"
                                onClick={() => onPrintInvoice(b)}
                                className="bg-slate-50 hover:bg-[#004173] text-[#004173] hover:text-white font-extrabold text-[9.5px] py-1 px-2.5 rounded-lg transition border border-slate-200 flex items-center gap-1 cursor-pointer"
                              >
                                <Printer className="w-3.5 h-3.5" />
                                <span>Print Invoice</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm('Are you sure you want to cancel and remove this booking?')) {
                                    onDeleteBooking(b.id);
                                  }
                                }}
                                className="text-red-500 hover:text-white hover:bg-red-550 border border-slate-200 hover:border-transparent p-1 rounded-lg cursor-pointer text-xs"
                                title="Remove Booking"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* VIEW SWITCHER: TAB B (STANDARD LEDGER SPREADSHEET LIST) */}
          {activeTab === 'list' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4 animate-fade-in-quick">
              <div className="border-b border-gray-100 pb-3">
                <h4 className="font-extrabold text-gray-900 text-sm">
                  Active Space Reservations
                </h4>
                <p className="text-[10.5px] text-gray-400">
                  List of scheduled bookings for conferences, board meetings, and professional seminars at STP.
                </p>
              </div>

              {bookings.length === 0 ? (
                <div className="bg-slate-50/50 rounded-xl p-12 text-center border border-dashed border-slate-200 text-gray-400 font-medium text-xs">
                  No space bookings registered yet. Configure your first seminar space reservation on the left!
                </div>
              ) : (
                <div className="overflow-x-auto overflow-y-auto max-h-[500px]">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-wider pb-2">
                        <th className="pb-2">Billed Party</th>
                        <th className="pb-2">Booking Info</th>
                        <th className="pb-2">Venue & Schedule</th>
                        <th className="pb-2">Charges</th>
                        <th className="pb-1 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 font-medium">
                      {bookings.map((b) => {
                        const dayConflicts = getConflictsOnDate(b.eventDate);
                        const isConflicted = dayConflicts.some(dc => dc.id === b.id);
                        
                        return (
                          <tr key={b.id} className={`hover:bg-slate-50/55 transition ${
                            isConflicted ? 'bg-rose-50/30' : ''
                          }`}>
                            <td className="py-3 pr-2">
                              <div className="font-black text-gray-950 text-xs flex items-center gap-1.5">
                                <span>{b.companyName}</span>
                                {isConflicted && (
                                  <span className="text-[8px] bg-red-500 text-white font-extrabold py-0.5 px-1 rounded animate-pulse uppercase tracking-widest font-mono">Conflict</span>
                                )}
                              </div>
                              <div className="text-[10px] text-gray-400 font-semibold mt-0.5 flex items-center gap-1">
                                <User className="w-3 h-3 text-gray-400" />
                                <span>{b.personName}</span>
                              </div>
                            </td>
                            <td className="py-3 pr-2">
                              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold ${
                                b.bookingFor === 'Seminar Hall' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-sky-50 text-sky-700 border border-sky-100'
                              }`}>
                                {b.bookingFor}
                              </span>
                              <div className="text-[10px] text-gray-500 font-medium mt-1">
                                {b.eventType}
                              </div>
                            </td>
                            <td className="py-3 pr-2">
                              <div className="font-bold text-[#004173] text-[11px]">{b.venueRoom}</div>
                              <div className="text-[10px] text-gray-500 uppercase font-black font-mono tracking-tight mt-0.5">
                                📅 {b.eventDate} ({b.duration})
                              </div>
                              <div className="text-[9.5px] text-gray-400 font-semibold flex items-center gap-1 mt-0.5">
                                <Clock className="w-3 h-3 text-gray-400" />
                                <span>{b.timeSlot} | {b.seatingCapacity} pax</span>
                              </div>
                            </td>
                            <td className="py-3 pr-2 font-mono">
                              <div className="text-xs font-black text-emerald-600">{b.price.toLocaleString()} PKR</div>
                              <div className="text-[9px] text-gray-400 uppercase font-extrabold mt-0.5">
                                Unpaid Invoice
                              </div>
                            </td>
                            <td className="py-3 text-right">
                              <div className="flex gap-1.5 justify-end">
                                <button
                                  type="button"
                                  onClick={() => onPrintInvoice(b)}
                                  className="bg-blue-50 hover:bg-[#004173] text-[#004173] hover:text-white font-extrabold text-[10px] py-1 px-2.5 rounded-lg transition border border-blue-100 flex items-center gap-1.5 cursor-pointer shadow-3xs"
                                  title="Print invoice for this room booking"
                                >
                                  <Printer className="w-3.5 h-3.5" />
                                  <span>Invoice</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (confirm('Are you sure you want to delete this space booking?')) {
                                      onDeleteBooking(b.id);
                                    }
                                  }}
                                  className="text-red-500 hover:text-white hover:bg-red-500 p-1.5 rounded-lg border border-transparent hover:border-red-100 cursor-pointer text-xs"
                                  title="Delete booking"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
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
          )}
        </div>
      </div>
    </div>
  );
}
