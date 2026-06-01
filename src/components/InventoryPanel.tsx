import React, { useState } from 'react';
import { ClipboardList, Plus, Trash2, ShieldAlert } from 'lucide-react';

interface InventoryItem {
  id: string;
  serial: string;
  name: string;
  custodian: string;
  status: 'Available' | 'Issued' | 'Repairing';
}

export default function InventoryPanel() {
  const [items, setItems] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('rohi_inventory');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: '1', serial: 'HP-DX-821092', name: 'HP Core-i5 Pro Laptop', custodian: 'Muhammad Ahmed (Web Development)', status: 'Issued' },
      { id: '2', serial: 'EPS-PRJ-2491', name: 'Epson digital HD Projector', custodian: 'Office Hub', status: 'Available' },
      { id: '3', serial: 'TP-LNK-552', name: 'TP-Link mesh Gigabit router', custodian: 'Incubator hall', status: 'Available' },
      { id: '4', serial: 'MQ2-VR-2041', name: 'Meta Quest 2 VR Headset', custodian: 'Ali Hamza (AR/VR Lab Guest)', status: 'Issued' },
      { id: '5', serial: 'DELL-US-4820', name: 'Dell 27" UltraSharp Monitor', custodian: 'Lab Supervisor-A', status: 'Available' },
      { id: '6', serial: 'LOGI-CONF-559', name: 'Logitech MeetUp Video Camera', custodian: 'Board Room B', status: 'Available' },
      { id: '7', serial: 'MBP-M2-7712', name: 'MacBook Pro M2 Space Gray', custodian: 'Director Rohi Learning', status: 'Repairing' }
    ];
  });

  const [serial, setSerial] = useState('');
  const [name, setName] = useState('');
  const [custodian, setCustodian] = useState('');
  const [status, setStatus] = useState<'Available' | 'Issued' | 'Repairing'>('Available');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serial.trim() || !name.trim()) return;

    const newItem: InventoryItem = {
      id: Date.now().toString(),
      serial: serial.trim(),
      name: name.trim(),
      custodian: custodian.trim() || 'Central Pool Office',
      status: status
    };

    const updated = [...items, newItem];
    setItems(updated);
    localStorage.setItem('rohi_inventory', JSON.stringify(updated));

    setSerial('');
    setName('');
    setCustodian('');
    setStatus('Available');
  };

  const handleDeleteItem = (id: string) => {
    const updated = items.filter(it => it.id !== id);
    setItems(updated);
    localStorage.setItem('rohi_inventory', JSON.stringify(updated));
  };

  return (
    <div className="space-y-6 animate-fade-in-quick">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-[#004173]" />
            <span>STP Lab & Equipment Inventory</span>
          </h3>
          <p className="text-xs text-gray-400">
            Log serial numbers of training hardware, projectors, workstations, and network machinery at Rohi eSkills Hub.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hardware Register Form */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4 h-fit">
          <div className="border-b border-gray-100 pb-3">
            <h4 className="font-extrabold text-[#004173] text-sm flex items-center gap-1.5">
              <span>Register Hardware Asset</span>
            </h4>
            <p className="text-[10.5px] text-gray-400">
              Record dynamic items into central lab inventory lists.
            </p>
          </div>

          <form onSubmit={handleAddItem} className="space-y-3.5">
            <div>
              <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">Device Name/Variant</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Dell Latitude 5490 Laptop"
                className="w-full text-xs p-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2491bf] font-bold"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">Dynamic Serial Number</label>
              <input
                type="text"
                required
                value={serial}
                onChange={e => setSerial(e.target.value)}
                placeholder="e.g. SER-DELL-8821B"
                className="w-full text-xs p-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2491bf] font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">Custodian/Location</label>
              <input
                type="text"
                value={custodian}
                onChange={e => setCustodian(e.target.value)}
                placeholder="Central Pool / Student Name"
                className="w-full text-xs p-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2491bf] font-medium"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-500 uppercase mb-1">Condition Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as any)}
                className="w-full text-xs p-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2491bf] cursor-pointer text-gray-700 font-bold"
              >
                <option value="Available">Available (In Lab Pool)</option>
                <option value="Issued">Issued (Active Custody)</option>
                <option value="Repairing">Repairing (In Workshop)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-[#004173] hover:bg-[#2491bf] text-white text-[11px] font-bold py-2.5 rounded-lg shadow transition flex items-center justify-center gap-1.5 cursor-pointer mt-2"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Hardware Asset</span>
            </button>
          </form>
        </div>

        {/* Inventory Log Table Grid */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="border-b border-gray-100 pb-3 mb-4">
            <h4 className="font-extrabold text-gray-900 text-sm">
              Hardware Equipment Log Registers
            </h4>
            <p className="text-[10.5px] text-gray-400">
              Interactive ledger recording the locations, custodians, and serial barcodes of learning technology assets.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-wider pb-3">
                  <th className="pb-3 pl-2">Equipment Part</th>
                  <th className="pb-3">Dynamic Serial</th>
                  <th className="pb-3">Custodian Assignment</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 pr-2 text-right">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs">
                {items.map(it => (
                  <tr key={it.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-3 pl-2">
                      <div className="font-extrabold text-[#004173]">{it.name}</div>
                    </td>
                    <td className="py-3 font-mono font-medium text-gray-500">
                      <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200/50">
                        {it.serial}
                      </span>
                    </td>
                    <td className="py-3 font-semibold text-gray-700">
                      {it.custodian}
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[9.5px] font-bold ${
                        it.status === 'Available' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100/30' :
                        it.status === 'Issued' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100/30' :
                        'bg-red-50 text-red-600 border border-red-100/30'
                      }`}>
                        {it.status}
                      </span>
                    </td>
                    <td className="py-3 text-right pr-2">
                      <button
                        onClick={() => handleDeleteItem(it.id)}
                        className="p-1.5 text-red-600 hover:bg-rose-50 rounded bg-transparent border-0 cursor-pointer"
                        title="Delete asset log"
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
