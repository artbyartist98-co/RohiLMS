import React, { useState, useEffect } from 'react';
import { Course, Employee } from '../types';
import { DollarSign, Check, X, Calendar, User, Phone, Mail, Award, Laptop, FileText } from 'lucide-react';

interface NewEnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  currentUser: Employee | null;
  onSubmit: (data: {
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
    civilStatus: string;
    discount: number;
    nextDueDate: string;
    status: 'Pending' | 'Verified' | 'Processing' | 'Enrolled';
    course: string;
    milCategory?: 'Officer' | 'JCO' | '';
    milRank?: string;
    milUnit?: string;
    milName?: string;
    milRelation?: string;
  }) => void;
  calculateTotalFee: (
    courseName: string,
    laptop: 'Yes' | 'No',
    civilStatus: string,
    discount: number,
    milCategory?: 'Officer' | 'JCO' | ''
  ) => { 
    base: number; 
    minFee: number; 
    laptop: number;
    discount: number; 
    total: number;
    firstInstallment: number;
    secondInstallment: number;
  };
  preselectedCourse?: string | null;
}

export default function NewEnrollmentModal({
  isOpen,
  onClose,
  courses,
  currentUser,
  onSubmit,
  calculateTotalFee,
  preselectedCourse
}: NewEnrollmentModalProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [mobile, setMobile] = useState('');
  const [cnic, setCnic] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('Male');
  const [course, setCourse] = useState('');
  const [laptop, setLaptop] = useState<'Yes' | 'No'>('No');
  const [civilStatus, setCivilStatus] = useState('Civil');
  const [discount, setDiscount] = useState(0);
  const [paymentPlan, setPaymentPlan] = useState<'Full' | 'Installment'>('Full');
  const [status, setStatus] = useState<'Pending' | 'Verified' | 'Processing' | 'Enrolled'>('Pending');
  const [nextDueDate, setNextDueDate] = useState('');

  // Military state fields
  const [milCategory, setMilCategory] = useState<'Officer' | 'JCO' | ''>('');
  const [milRank, setMilRank] = useState('');
  const [milUnit, setMilUnit] = useState('');
  const [milName, setMilName] = useState('');
  const [milRelation, setMilRelation] = useState('Father');

  // Sync state values on Open
  useEffect(() => {
    if (isOpen) {
      setFirstName('');
      setLastName('');
      setFatherName('');
      setMobile('');
      setCnic('');
      setEmail('');
      setAddress('');
      setGender('Male');
      setCourse(preselectedCourse || (currentUser?.role === 'Trainer' ? (currentUser.course || courses[0]?.name || '') : (courses[0]?.name || '')));
      setLaptop('No');
      setCivilStatus('Civil');
      setDiscount(0);
      setPaymentPlan('Full');
      setStatus('Pending');
      setMilCategory('');
      setMilRank('');
      setMilUnit('');
      setMilName('');
      setMilRelation('Father');
      
      const d = new Date();
      d.setDate(d.getDate() + 30);
      setNextDueDate(d.toISOString().split('T')[0]);
    }
  }, [isOpen, courses, currentUser, preselectedCourse]);

  if (!isOpen) return null;

  const currentFeesGroup = calculateTotalFee(
    course, 
    laptop, 
    civilStatus, 
    discount, 
    civilStatus === 'Military' ? milCategory : undefined
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !mobile.trim() || !cnic.trim()) return;

    onSubmit({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      fatherName: fatherName.trim(),
      mobile: mobile.trim(),
      cnic: cnic.trim(),
      email: email.trim() || `${firstName.toLowerCase()}@rohi.edu.pk`,
      address: address.trim() || 'STP Office Desk Branch',
      gender,
      course,
      laptop,
      civilStatus,
      discount,
      paymentPlan,
      status,
      nextDueDate,
      ...(civilStatus === 'Military' ? {
        milCategory,
        milRank: milRank.trim(),
        milUnit: milUnit.trim(),
        milName: milName.trim(),
        milRelation
      } : {
        milCategory: '',
        milRank: '',
        milUnit: '',
        milName: '',
        milRelation: ''
      })
    });

    // Reset states
    setFirstName('');
    setLastName('');
    setFatherName('');
    setMobile('');
    setCnic('');
    setEmail('');
    setAddress('');
    setGender('Male');
    setLaptop('No');
    setCivilStatus('Civil');
    setDiscount(0);
    setPaymentPlan('Full');
    setStatus('Pending');
    setMilCategory('');
    setMilRank('');
    setMilUnit('');
    setMilName('');
    setMilRelation('Father');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl relative animate-fade-in-quick max-h-[90vh] overflow-y-auto">
        
        {/* Header toolbar */}
        <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
          <div>
            <h3 className="text-[#004173] font-black text-base flex items-center gap-1.5">
              <span>➕ Record New Student Enrolment</span>
            </h3>
            <p className="text-[10.5px] text-gray-400 mt-0.5">
              Staff console wizard for onboarding student registrations directly.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 font-bold p-1 hover:bg-gray-50 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Section 1: Candidate Basic Profile */}
          <div className="space-y-3">
            <div className="text-[10px] font-black tracking-wider text-gray-400 uppercase border-b border-gray-100 pb-1 flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              <span>Personal Information Record</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10.5px] font-bold text-gray-700 mb-1">First Name *</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  placeholder="e.g. Muhammad"
                  className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#2491bf] transition font-bold"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-bold text-gray-700 mb-1">Last Name *</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  placeholder="e.g. Ahmed"
                  className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#2491bf] transition font-bold"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-bold text-gray-700 mb-1">Father's Name</label>
                <input
                  type="text"
                  required
                  value={fatherName}
                  onChange={e => setFatherName(e.target.value)}
                  placeholder="Name of Father"
                  className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#2491bf] transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10.5px] font-bold text-gray-700 mb-1">Mobile Contact *</label>
                <input
                  type="text"
                  required
                  value={mobile}
                  onChange={e => setMobile(e.target.value)}
                  placeholder="e.g. 03001234567"
                  className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#2491bf] transition font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-bold text-gray-700 mb-1">CNIC / ID Number *</label>
                <input
                  type="text"
                  required
                  value={cnic}
                  onChange={e => setCnic(e.target.value)}
                  placeholder="31101-1234567-1"
                  className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#2491bf] transition font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-bold text-gray-700 mb-1">Email ID</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#2491bf] transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-[10.5px] font-bold text-gray-700 mb-1">Residential Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Street and City name"
                  className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#2491bf] transition"
                />
              </div>
              <div>
                <label className="block text-[10.5px] font-bold text-gray-700 mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={e => setGender(e.target.value)}
                  className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#2491bf] transition cursor-pointer font-semibold"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Rather not say">Rather not say</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Course & Config Criteria */}
          <div className="space-y-3">
            <div className="text-[10px] font-black tracking-wider text-gray-400 uppercase border-b border-gray-100 pb-1 flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              <span>Program Setup Selection</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10.5px] font-bold text-gray-700 mb-1">Course Program</label>
                <select
                  value={course}
                  onChange={e => {
                    setCourse(e.target.value);
                    setDiscount(0); // reset discount to prevent limits mismatch
                  }}
                  disabled={currentUser?.role === 'Trainer'} // Lock course if trainer
                  className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#2491bf] cursor-pointer font-bold text-[#004173]"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.name}>
                      {c.name} (Base Fee: {c.baseFee.toLocaleString()} PKR · Floor: {c.minFee.toLocaleString()} PKR)
                    </option>
                  ))}
                </select>
                {currentUser?.role === 'Trainer' && (
                  <span className="text-[9.5px] text-[#004173] font-bold mt-1 block">
                    🔒 Locked course profile assignment.
                  </span>
                )}
              </div>

              <div>
                <label className="block text-[10.5px] font-bold text-gray-700 mb-1">Quota / Group Discounts</label>
                <select
                  value={civilStatus}
                  onChange={e => {
                    setCivilStatus(e.target.value);
                    setDiscount(0); // reset to prevent limit overflow
                    if (e.target.value === 'Military' && !milCategory) {
                      setMilCategory('Officer');
                    }
                  }}
                  className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#2491bf] cursor-pointer font-semibold text-gray-700 font-bold"
                >
                  <option value="Civil">Standard Civil Desk Applicant (No Quota overrides)</option>
                  <option value="Military">Military Service Quota</option>
                  <option value="Government Employee Child">Government Employee Dependents (15% concession)</option>
                  <option value="Disabled / Special">Underprivileged / Special Needs (Full Concession Floor)</option>
                  <option value="STP Alumnus">STP Active Alumnus Group (10% Concession)</option>
                </select>
              </div>

              {civilStatus === 'Military' && (
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-5 gap-3 bg-blue-50/50 p-3.5 rounded-xl border border-blue-100 mt-2">
                  <div className="md:col-span-5 text-xs font-black text-[#004173] flex items-center gap-1">
                    <span>🪖 Military Service Personnel Verification Details</span>
                  </div>
                  <div>
                    <label className="block text-[9.5px] font-bold text-gray-700 mb-1">Military Category *</label>
                    <select
                      value={milCategory}
                      onChange={e => setMilCategory(e.target.value as any)}
                      className="w-full text-[11px] p-2 bg-white border border-gray-200 rounded-lg focus:outline-none cursor-pointer font-semibold"
                    >
                      <option value="Officer">Officer</option>
                      <option value="JCO">JCO</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9.5px] font-bold text-gray-700 mb-1">Rank *</label>
                    <input
                      type="text"
                      required
                      value={milRank}
                      onChange={e => setMilRank(e.target.value)}
                      placeholder="e.g. Captain"
                      className="w-full text-[11px] p-2 bg-white border border-gray-200 rounded-lg focus:outline-none font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[9.5px] font-bold text-gray-700 mb-1">Unit *</label>
                    <input
                      type="text"
                      required
                      value={milUnit}
                      onChange={e => setMilUnit(e.target.value)}
                      placeholder="e.g. 15 FF"
                      className="w-full text-[11px] p-2 bg-white border border-gray-200 rounded-lg focus:outline-none font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[9.5px] font-bold text-gray-700 mb-1">Service Member Name *</label>
                    <input
                      type="text"
                      required
                      value={milName}
                      onChange={e => setMilName(e.target.value)}
                      placeholder="Member Name"
                      className="w-full text-[11px] p-2 bg-white border border-gray-200 rounded-lg focus:outline-none font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[9.5px] font-bold text-gray-700 mb-1">Relation *</label>
                    <select
                      value={milRelation}
                      onChange={e => setMilRelation(e.target.value)}
                      className="w-full text-[11px] p-2 bg-white border border-gray-200 rounded-lg focus:outline-none cursor-pointer font-semibold"
                    >
                      <option value="Self">Self</option>
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Spouse">Spouse</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2">
                <Laptop className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <label className="block text-[10.5px] font-bold text-gray-700">Laptop Required?</label>
                  <div className="flex gap-1.5 mt-1">
                    {['No', 'Yes'].map(opt => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setLaptop(opt as any)}
                        className={`px-3 py-1 text-[11px] font-bold rounded-lg transition ${
                          laptop === opt
                            ? 'bg-[#004173] text-white'
                            : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10.5px] font-bold text-gray-700 mb-1">Custom discount Ledger Override</label>
                <input
                  type="number"
                  value={discount}
                  onChange={e => setDiscount(Math.max(0, Number(e.target.value)))}
                  className="w-full text-xs p-1.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#2491bf] font-mono text-red-600 font-bold"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-bold text-gray-700 mb-1">Initial registration status</label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as any)}
                  className="w-full text-xs p-1.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#2491bf] cursor-pointer"
                >
                  <option value="Pending">Pending (Unpaid)</option>
                  <option value="Processing">Processing Desk</option>
                  <option value="Enrolled">Verified &amp; Joined</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Ledger Plan details & calculations */}
          <div className="space-y-3">
            <div className="text-[10px] font-black tracking-wider text-gray-400 uppercase border-b border-gray-100 pb-1 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5" />
              <span>Invoice plans & live dynamic estimates</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10.5px] font-bold text-gray-700 mb-1 flex justify-between">
                  <span>Selected Installments split Plan</span>
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentPlan('Full')}
                    className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl border transition ${
                      paymentPlan === 'Full'
                        ? 'bg-blue-50 border-[#004173] text-[#004173]'
                        : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    🚀 Full payment plan dues
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentPlan('Installment')}
                    className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl border transition ${
                      paymentPlan === 'Installment'
                        ? 'bg-blue-50 border-[#004173] text-[#004173]'
                        : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    💳 2-Months Instals (50:50)
                  </button>
                </div>
              </div>

              {paymentPlan === 'Installment' && (
                <div className="animate-fade-in-quick">
                  <label className="block text-[10.5px] font-bold text-gray-700 mb-1">Second Installment Deadline</label>
                  <div className="relative">
                    <Calendar className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gray-400" />
                    <input
                      type="date"
                      value={nextDueDate}
                      onChange={e => setNextDueDate(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#2491bf] font-mono leading-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* LIVE DYNAMIC SYSTEM FEE COMPUTATIONS */}
            <div className="bg-[#004173]/5 rounded-2xl p-4 border border-[#004173]/10 grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
              <div className="p-1">
                <span className="text-[9px] text-gray-400 font-bold tracking-wider block uppercase mb-0.5">Original Tuition</span>
                <span className="font-extrabold text-sm text-gray-700 font-mono">{currentFeesGroup.base.toLocaleString()} PKR</span>
              </div>

              <div className="p-1">
                <span className="text-[9px] text-gray-400 font-bold tracking-wider block uppercase mb-0.5">Laptop fees added</span>
                <span className="font-extrabold text-sm text-gray-700 font-mono">{currentFeesGroup.laptop.toLocaleString()} PKR</span>
              </div>

              <div className="p-1">
                <span className="text-[9px] text-gray-400 font-bold tracking-wider block uppercase mb-0.5">Discounts Deductions</span>
                <span className="font-extrabold text-sm text-rose-600 font-mono">-{currentFeesGroup.discount.toLocaleString()} PKR</span>
              </div>

              <div className="p-1 bg-[#004173] text-white rounded-xl shadow-xs px-3 py-2 font-sans">
                <span className="text-[8.5px] text-sky-200 font-black tracking-wider block uppercase mb-0.5">Net tuition due</span>
                <span className="font-black text-sm text-white font-mono break-all">{currentFeesGroup.total.toLocaleString()} PKR</span>
              </div>
            </div>

            {paymentPlan === 'Installment' && (
              <div className="bg-sky-50 text-sky-800 border border-sky-100 rounded-xl p-3.5 text-xs flex justify-between gap-4 mt-2 font-semibold">
                <div>
                  <span className="font-black text-[9px] text-sky-600 tracking-wider block uppercase mb-0.5">1st Installment (Due Today)</span>
                  <span className="font-bold text-sm text-sky-900 font-mono">{currentFeesGroup.firstInstallment.toLocaleString()} PKR</span>
                </div>
                <div>
                  <span className="font-black text-[9px] text-sky-600 tracking-wider block uppercase mb-0.5">2nd Installment (Due Later)</span>
                  <span className="font-bold text-sm text-sky-900 font-mono">{currentFeesGroup.secondInstallment.toLocaleString()} PKR</span>
                </div>
                <div>
                  <span className="font-black text-[9px] text-sky-600 tracking-wider block uppercase mb-0.5">Next Due Deadline</span>
                  <span className="font-bold text-sm text-rose-800 font-mono">{nextDueDate || '—'}</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2 justify-end border-t border-gray-100 pt-4 mt-2">
            <button
              onClick={onClose}
              type="button"
              className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold px-5 py-2.5 rounded-xl transition cursor-pointer"
            >
              Close
            </button>
            <button
              type="submit"
              className="bg-[#004173] hover:bg-[#2491bf] text-white text-xs font-bold px-6 py-2.5 rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer font-sans"
            >
              <Check className="w-4 h-4" />
              <span>Save &amp; Record Enrollment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
