import React, { useState } from "react";
import { useData } from "../../context/DataContext";
import { formatINR } from "../../utils/formatters";
import Modal from "../../components/common/Modal";
import Toast from "../../components/common/Toast";
import { UserCheck, Plus, Trash2, Mail, Phone } from "lucide-react";

export default function Employees() {
  const { employees, addEmployee, deleteEmployee } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const [form, setForm] = useState({
    name: "",
    role: "Junior Audit Associate",
    department: "Statutory Audit",
    pan: "",
    basic: 50000,
    hra: 20000,
    allowances: 8000,
    pf: 6000,
    tds: 4000
  });

  const handleCreate = (e) => {
    e.preventDefault();
    const basic = Number(form.basic);
    const hra = Number(form.hra);
    const allowances = Number(form.allowances);
    const pf = Number(form.pf);
    const tds = Number(form.tds);
    const netPay = basic + hra + allowances - pf - tds;

    addEmployee({
      ...form,
      basic,
      hra,
      allowances,
      pf,
      tds,
      netPay
    });

    setModalOpen(false);
    setToastMsg(`Staff member ${form.name} added.`);
    setForm({
      name: "",
      role: "Junior Audit Associate",
      department: "Statutory Audit",
      pan: "",
      basic: 50000,
      hra: 20000,
      allowances: 8000,
      pf: 6000,
      tds: 4000
    });
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Remove staff ${name}?`)) {
      deleteEmployee(id);
      setToastMsg(`Staff ${name} removed.`);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg("")} />}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800 }}>Audit Team & Staff Directory</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
            Manage Chartered Accountants, articled assistants, tax lawyers, and back-office associates.
          </p>
        </div>

        <button onClick={() => setModalOpen(true)} className="btn btn-primary btn-sm">
          <Plus size={16} /> Add Team Member
        </button>
      </div>

      <div className="glass-panel" style={{ padding: "20px" }}>
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Emp ID</th>
                <th>Name</th>
                <th>Designation</th>
                <th>Practice Area</th>
                <th>PAN</th>
                <th>Net Monthly Pay</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id}>
                  <td style={{ fontFamily: "var(--font-mono)", fontWeight: 600, color: "#fff" }}>
                    {emp.id}
                  </td>
                  <td style={{ fontWeight: 600 }}>{emp.name}</td>
                  <td>{emp.role}</td>
                  <td>
                    <span className="badge badge-purple">{emp.department}</span>
                  </td>
                  <td style={{ fontFamily: "var(--font-mono)", fontSize: "0.825rem" }}>{emp.pan}</td>
                  <td style={{ fontWeight: 700, color: "var(--accent-secondary)" }}>
                    {formatINR(emp.netPay)}
                  </td>
                  <td>
                    <span className="badge badge-success">{emp.status}</span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(emp.id, emp.name)}
                      className="topbar-icon-btn"
                      style={{ width: 32, height: 32, color: "#f87171" }}
                      title="Remove Staff"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Staff Member">
        <form onSubmit={handleCreate}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Priya Sharma"
              required
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Designation</label>
              <input
                type="text"
                className="form-input"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Department</label>
              <select
                className="form-select"
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
              >
                <option value="Statutory Audit">Statutory Audit</option>
                <option value="Direct Tax">Direct Tax</option>
                <option value="Indirect Tax (GST)">Indirect Tax (GST)</option>
                <option value="Transfer Pricing">Transfer Pricing</option>
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="form-group">
              <label className="form-label">PAN Number</label>
              <input
                type="text"
                className="form-input"
                maxLength={10}
                value={form.pan}
                onChange={(e) => setForm({ ...form, pan: e.target.value.toUpperCase() })}
                placeholder="ABCDE1234F"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Monthly Gross Pay (₹)</label>
              <input
                type="number"
                className="form-input"
                value={form.basic}
                onChange={(e) => setForm({ ...form, basic: e.target.value })}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: 12 }}>
            Register Team Member
          </button>
        </form>
      </Modal>
    </div>
  );
}
