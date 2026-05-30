import React, { useState } from 'react';
import { Building, Plus, CheckCircle, Trash2, Calendar, ClipboardList } from 'lucide-react';
import { Employee } from '../types';

interface Startup {
  id: string;
  name: string;
  founder: string;
  deskNumber: string;
  monthlyRent: number;
  joinedDate: string;
}

interface StartupPanelProps {
  currentUser: Employee | null;
}

export default function StartupPanel({ currentUser }: StartupPanelProps) {
  const [startups, setStartups] = useState<Startup[]>(() => {
    const saved = localStorage.getItem('rohi_startups');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: '1', name: 'Al-Khawarizmi AI Labs', founder: 'Dr. Usman Ghafoor', deskNumber: 'Desk A1', monthlyRent: 12000, joinedDate: '2026-01-10' },
      { id: '2', name: 'Zeta Byte Technologies', founder: 'Ayesha Khan', deskNumber: 'Desk B3', monthlyRent: 8500, joinedDate: '2026-03-01' },
      { id: '3', name: 'Apex Creative Agency', founder: 'Rayyan Baig', deskNumber: 'Desk C2', monthlyRent: 9000, joinedDate: '2026-04-15' },
      { id: '4', name: 'CloudWeave Solutions', founder: 'Zainab Fatima', deskNumber: 'Desk D4', monthlyRent: 15000, joinedDate: '2026-05-01' },
      { id: '5', name: 'CyberGuard Pakistan', founder: 'Major (R) Tariq Mahmood', deskNumber: 'Desk E1', monthlyRent: 11000, joinedDate: '2026-05-18' }
    ];
  });

  const [formName, setFormName] = useState('');
  const [formFounder, setFormFounder] = useState('');
  const [formDesk, setFormDesk] = useState('Desk A1');
  const [formRent, setFormRent] = useState(10000);

  const handleAddStartup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formFounder.trim()) return;

    const newStart: Startup = {
      id: Date.now().toString(),
      name: formName.trim(),
      founder: formFounder.trim(),
      deskNumber: formDesk,
      monthlyRent: formRent,
      joinedDate: new Date().toISOString().split('T')[0]
    };

    const updated = [...startups, newStart];
    setStartups(updated);
    localStorage.setItem('rohi_startups', JSON.stringify(updated));

    setFormName('');
    setFormFounder('');
    setFormDesk('Desk A1');
    setFormRent(10000);
  };

  const handleDeleteStartup = (id: string) => {
    const updated = startups.filter(s => s.id !== id);
    setStartups(updated);
    localStorage.setItem('rohi_startups', JSON.stringify(updated));
  };

  const deskOptions = Array.from({ length: 15 }, (_, i) => `Desk ${String.fromCharCode(65 + Math.floor(i / 5))}${i % 5 + 1}`);

  return (
    <div className="space-y-6 animate-fade-in-quick">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
            <Building className="w-5 h-5 text-[#004173]" />
            <span>Startups & Incubator Co-working space</span>
          </h3>
          <p className="text-xs text-gray-400">
            STP Bahawalpur technology incubation desks allocation registers. Track rent collections and startup profiles.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Desk Allocation Register Form */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4 h-fit">
          <div className="border-b border-gray-100 pb-3">
            <h4 className="font-extrabold text-[#004173] text-sm flex items-center gap-1.5">
              <span>Allocate Space desk</span>
            </h4>
            <p className="text-[10.5px] text-gray-400">
              Register a new tech startup or entrepreneur in co-working desks.
            </p>
          </div>

          <form onSubmit={handleAddStartup} className="space-y-3.5">
            <div>
              <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">Company / Team Name</label>
              <input
                type="text"
                required
                value={formName}
                onChange={e => setFormName(e.target.value)}
                placeholder="e.g. Rohi Cyber Labs"
                className="w-full text-xs p-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2491bf] font-bold"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">Founder / Team Lead Name</label>
              <input
                type="text"
                required
                value={formFounder}
                onChange={e => setFormFounder(e.target.value)}
                placeholder="e.g. Muhammad Kashif"
                className="w-full text-xs p-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2491bf] font-semibold"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">Assigned Co-working Desk</label>
              <select
                value={formDesk}
                onChange={e => setFormDesk(e.target.value)}
                className="w-full text-xs p-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2491bf] cursor-pointer text-gray-700 font-bold"
              >
                {deskOptions.map(desk => (
                  <option key={desk} value={desk}>{desk}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">Monthly space Rent (PKR)</label>
              <input
                type="number"
                required
                value={formRent}
                onChange={e => setFormRent(Number(e.target.value))}
                className="w-full text-xs p-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2491bf] font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#004173] hover:bg-[#2491bf] text-white text-[11px] font-bold py-2.5 rounded-lg shadow transition flex items-center justify-center gap-1.5 cursor-pointer mt-2"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Allocate Space</span>
            </button>
          </form>
        </div>

        {/* Startups Table List */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="border-b border-gray-100 pb-3 mb-4">
            <h4 className="font-extrabold text-gray-900 text-sm">
              Active Incubated Startups
            </h4>
            <p className="text-[10.5px] text-gray-400">
              Tech ventures currently operating from within Rohi eSkills Hub Software Technology Park.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-wider pb-3">
                  <th className="pb-3 pl-2">Company / Founder</th>
                  <th className="pb-3">Desk Number</th>
                  <th className="pb-3">Monthly Rent Dues</th>
                  <th className="pb-3">Joined Date</th>
                  <th className="pb-3 pr-2 text-right">Cancel Space</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs">
                {startups.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-3 pl-2">
                      <div className="font-extrabold text-[#004173]">{s.name}</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">Lead: {s.founder}</div>
                    </td>
                    <td className="py-3 font-semibold font-mono text-indigo-700">
                      <span className="bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100/30">
                        {s.deskNumber}
                      </span>
                    </td>
                    <td className="py-3 font-bold text-emerald-800 font-mono">
                      {s.monthlyRent.toLocaleString()} PKR
                    </td>
                    <td className="py-3 text-gray-500 font-medium">
                      {s.joinedDate}
                    </td>
                    <td className="py-3 text-right pr-2">
                      <button
                        onClick={() => handleDeleteStartup(s.id)}
                        className="p-1.5 text-red-600 hover:bg-rose-50 rounded bg-transparent border-0 cursor-pointer"
                        title="Cancel workspace lease"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
