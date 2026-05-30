import React from 'react';
import { ShieldAlert, Plus, Edit2, Trash2, CheckCircle, Key, User, BookOpen } from 'lucide-react';
import { Employee, Course } from '../types';

interface EmployeePanelProps {
  employees: Employee[];
  courses: Course[];
  currentUser: Employee | null;
  onSaveEmployee: (e: React.FormEvent) => void;
  onStartEditEmployee: (emp: Employee) => void;
  onDeleteEmployee: (id: string) => void;
  employeeFormUsername: string;
  setEmployeeFormUsername: (v: string) => void;
  employeeFormPassword: string;
  setEmployeeFormPassword: (v: string) => void;
  employeeFormRole: string;
  setEmployeeFormRole: (v: string) => void;
  employeeFormCourse: string;
  setEmployeeFormCourse: (v: string) => void;
  editingEmployeeId: string | null;
  onCancelEditEmployee: () => void;
  
  // Custom roles props
  availableRoles: string[];
  onCreateRole: (roleName: string) => void;
  onDeleteRole: (roleName: string) => void;
}

export default function EmployeePanel({
  employees,
  courses,
  currentUser,
  onSaveEmployee,
  onStartEditEmployee,
  onDeleteEmployee,
  employeeFormUsername,
  setEmployeeFormUsername,
  employeeFormPassword,
  setEmployeeFormPassword,
  employeeFormRole,
  setEmployeeFormRole,
  employeeFormCourse,
  setEmployeeFormCourse,
  editingEmployeeId,
  onCancelEditEmployee,
  availableRoles,
  onCreateRole,
  onDeleteRole
}: EmployeePanelProps) {

  const [newRoleName, setNewRoleName] = React.useState('');

  // Role Gate check - Only Super Administrator has permission
  if (currentUser?.role !== 'Super Administrator') {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center max-w-xl mx-auto space-y-4 shadow-sm animate-fade-in-quick mt-8">
        <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center mx-auto border border-rose-100">
          <ShieldAlert className="w-8 h-8 text-rose-600 animate-pulse" />
        </div>
        <h4 className="text-base font-black text-gray-900 uppercase tracking-tight">
          Security Access Restriction
        </h4>
        <p className="text-xs text-gray-500 leading-relaxed">
          The employee credential registers console is highly restricted. Only users matching the <strong>Super Administrator</strong> profile can create, read, update, or clear administrative workspace accounts.
        </p>
        <div className="text-[10px] text-gray-400 font-mono">
          SYSTEM ERROR: INSUFFICIENT_SECURITY_CLEARANCE_STP
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-quick">
      <div>
        <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
          <User className="w-5 h-5 text-[#004173]" />
          <span>Employees Accounts Configurations</span>
        </h3>
        <p className="text-xs text-gray-400">
          Manage system administrators, accountants, and instructional trainers. Set custom passwords and restrict course permissions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side Container: Both Registration & Custom Roles Forms */}
        <div className="space-y-6 lg:col-span-1">
          {/* Card 1: Create / Edit account Form */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4 h-fit">
            <div className="border-b border-gray-100 pb-3">
              <h4 className="font-extrabold text-[#004173] text-sm">
                {editingEmployeeId ? '✏️ Edit Team Account' : '➕ Create Employee Account'}
              </h4>
              <p className="text-[10.5px] text-gray-400 mt-0.5">
                Set role capabilities and credentials for accessing client workspaces.
              </p>
            </div>

            <form onSubmit={onSaveEmployee} className="space-y-4">
              <div>
                <label className="block text-[10.5px] font-black text-gray-700 uppercase tracking-wider mb-1">
                  Workspace Username <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={employeeFormUsername}
                  onChange={e => setEmployeeFormUsername(e.target.value)}
                  placeholder="e.g. jameela_accountant"
                  className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#2491bf] transition font-semibold"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-black text-gray-700 uppercase tracking-wider mb-1">
                  Account Access Password <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={employeeFormPassword}
                  onChange={e => setEmployeeFormPassword(e.target.value)}
                  placeholder="Minimum 5 characters"
                  className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#2491bf] transition font-mono"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-black text-gray-700 uppercase tracking-wider mb-1">
                  Authorized Role Permission <span className="text-rose-500">*</span>
                </label>
                <select
                  value={employeeFormRole}
                  onChange={e => setEmployeeFormRole(e.target.value)}
                  className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#2491bf] transition cursor-pointer font-bold text-gray-700"
                >
                  {availableRoles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              {/* If Trainer role is checked, show Course assignment selection */}
              {employeeFormRole === 'Trainer' && (
                <div className="animate-fade-in-quick bg-blue-50/50 p-3 rounded-xl border border-blue-100/30">
                  <label className="block text-[10.5px] font-black text-[#004173] uppercase tracking-wider mb-1 flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Assigned Course Program</span>
                  </label>
                  <select
                    value={employeeFormCourse}
                    onChange={e => setEmployeeFormCourse(e.target.value)}
                    className="w-full text-xs p-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#2491bf] transition cursor-pointer font-semibold text-gray-700"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                  <p className="text-[9px] text-gray-400 mt-1 block leading-normal">
                    Important: Trainers are strictly locked to administering only registrations and logs inside their assigned course.
                  </p>
                </div>
              )}

              <div className="flex gap-2 pt-2 border-t border-gray-100">
                <button
                  type="submit"
                  className="flex-1 bg-[#004173] hover:bg-[#2491bf] text-white text-[11px] font-bold py-2.5 px-4 rounded-lg transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{editingEmployeeId ? 'Save Changes' : 'Register Account'}</span>
                </button>

                {editingEmployeeId && (
                  <button
                    type="button"
                    onClick={onCancelEditEmployee}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-[11px] font-bold py-2.5 px-4 rounded-lg transition cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Card 2: Custom Role Creator & Management */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
            <div className="border-b border-gray-100 pb-3">
              <h4 className="font-extrabold text-[#004173] text-sm flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-[#2491bf]" />
                <span>Create Custom Role</span>
              </h4>
              <p className="text-[10.5px] text-gray-400 mt-0.5 leading-relaxed">
                Define a custom role. Accounts assigned this role can see <strong>only</strong> the enrolments registered by users matching this role!
              </p>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (!newRoleName.trim()) return;
              onCreateRole(newRoleName.trim());
              setNewRoleName('');
            }} className="space-y-3">
              <div>
                <label className="block text-[10.5px] font-black text-gray-700 uppercase tracking-wider mb-1">
                  New Role Name
                </label>
                <input
                  type="text"
                  required
                  value={newRoleName}
                  onChange={e => setNewRoleName(e.target.value)}
                  placeholder="e.g. Admissions Agent"
                  className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#2491bf] transition font-semibold"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#004173] hover:bg-[#2491bf] text-white text-[11px] font-bold py-2 px-3 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Custom Role</span>
              </button>
            </form>

            {/* Active Custom Roles List */}
            <div className="pt-2">
              <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">
                Custom Defined Roles
              </h5>
              <div className="space-y-1.5 max-h-[150px] overflow-y-auto pr-1">
                {availableRoles.filter(r => r !== 'Super Administrator' && r !== 'Accountant' && r !== 'Trainer').length === 0 ? (
                  <p className="text-[10px] text-gray-400 italic font-medium">No custom roles defined yet.</p>
                ) : (
                  availableRoles.filter(r => r !== 'Super Administrator' && r !== 'Accountant' && r !== 'Trainer').map(role => (
                    <div key={role} className="flex items-center justify-between p-2 bg-slate-50/50 rounded-lg border border-slate-100/30 text-xs text-slate-700">
                      <span className="font-extrabold text-[#004173]">{role}</span>
                      <button
                        type="button"
                        onClick={() => onDeleteRole(role)}
                        className="text-red-500 hover:text-red-700 p-1 hover:bg-rose-50 rounded transition cursor-pointer"
                        title="Delete custom role"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Employees tabular data logs */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 overflow-x-auto">
          <div className="border-b border-gray-100 pb-3 mb-4">
            <h4 className="font-extrabold text-gray-900 text-sm">
              Registered System Accounts
            </h4>
            <p className="text-[10.5px] text-gray-400 mt-0.5">
              Active users who have structural administrative portal authorization.
            </p>
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-wider">
                <th className="pb-3 pl-2">Username</th>
                <th className="pb-3">Password Credentials</th>
                <th className="pb-3">Permission Level</th>
                <th className="pb-3">Course Restrictions</th>
                <th className="pb-3 pr-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs">
              {employees.map(emp => (
                <tr key={emp.id} className="hover:bg-slate-50/50 transition duration-150">
                  <td className="py-3 pl-2 font-bold text-[#004173] flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-50 border border-blue-100 text-[10px] font-black text-[#004173] flex items-center justify-center">
                      {emp.username.substring(0, 2).toUpperCase()}
                    </div>
                    <span>{emp.username}</span>
                  </td>
                  <td className="py-3 font-mono font-medium text-gray-500">
                    <span className="bg-slate-100 py-1 px-2 rounded text-[10.5px] border border-slate-200/50">
                      {emp.passwordInput}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wide ${
                      emp.role === 'Super Administrator' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                      emp.role === 'Accountant' ? 'bg-purple-50 text-purple-600 border border-purple-100' :
                      'bg-teal-50 text-teal-600 border border-teal-100'
                    }`}>
                      {emp.role}
                    </span>
                  </td>
                  <td className="py-3 text-gray-500">
                    {emp.role === 'Trainer' ? (
                      <span className="font-semibold text-[#004173] break-all block max-w-[140px]" title={emp.course}>
                        🎯 {emp.course || 'All'}
                      </span>
                    ) : (
                      <span className="text-gray-400 font-mono">Unrestricted</span>
                    )}
                  </td>
                  <td className="py-3 text-right pr-2">
                    <div className="flex gap-1 justify-end">
                      <button
                        onClick={() => onStartEditEmployee(emp)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded bg-transparent border-0 cursor-pointer"
                        title="Edit properties"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteEmployee(emp.id)}
                        disabled={emp.id === '1'}
                        className={`p-1.5 rounded bg-transparent border-0 ${
                          emp.id === '1' ? 'text-gray-300 cursor-not-allowed' : 'text-red-600 hover:bg-rose-50 cursor-pointer'
                        }`}
                        title={emp.id === '1' ? 'Master administrator cannot be deleted' : 'Delete employee'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
