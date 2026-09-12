import React, { useState } from "react";
import { useData } from "../../context/DataContext";
import { formatINR } from "../../utils/formatters";
import Modal from "../../components/common/Modal";
import Toast from "../../components/common/Toast";
import {
  CreditCard,
  Printer,
  Plus,
  Users,
  CheckCircle2,
  FileSpreadsheet,
  Download
} from "lucide-react";

export default function Payroll() {
  const { employees, addEmployee } = useData();
  const [selectedEmployee, setSelectedEmployee] = useState(employees[0] || null);
  const [payslipModal, setPayslipModal] = useState(false);
  const [addEmpModal, setAddEmpModal] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const [newEmp, setNewEmp] = useState({
    name: "",
    role: "Financial Analyst",
    department: "Auditing",
    pan: "",
    basic: 60000,
    hra: 24000,
    allowances: 10000,
    pf: 7200,
    tds: 5000
  });

  const handleCreateEmployee = (e) => {
    e.preventDefault();
    const basic = Number(newEmp.basic);
    const hra = Number(newEmp.hra);
    const allowances = Number(newEmp.allowances);
    const pf = Number(newEmp.pf);
    const tds = Number(newEmp.tds);
    const netPay = basic + hra + allowances - pf - tds;

    addEmployee({
      ...newEmp,
      basic,
      hra,
      allowances,
      pf,
      tds,
      netPay
    });

    setAddEmpModal(false);
    setToastMsg(`Employee ${newEmp.name} added to payroll ledger!`);
    setNewEmp({
      name: "",
      role: "Financial Analyst",
      department: "Auditing",
      pan: "",
      basic: 60000,
      hra: 24000,
      allowances: 10000,
      pf: 7200,
      tds: 5000
    });
  };

  const openPayslip = (emp) => {
    setSelectedEmployee(emp);
    setPayslipModal(true);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg("")} />}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800 }}>Payroll & Compensation Management</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
            Monthly salary disbursements, Provident Fund (PF), professional tax, and instant employee payslips.
          </p>
        </div>

        <button onClick={() => setAddEmpModal(true)} className="btn btn-primary btn-sm">
          <Plus size={16} /> Add Employee
        </button>
      </div>

      {/* Employees Table */}
      <div className="glass-panel" style={{ padding: "20px" }}>
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Employee Name</th>
                <th>Designation</th>
                <th>PAN</th>
                <th>Gross Earnings</th>
                <th>Deductions (PF + TDS)</th>
                <th>Net In-Hand Pay</th>
                <th>Attendance</th>
                <th>Payslip</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => {
                const gross = emp.basic + emp.hra + emp.allowances;
                const deductions = emp.pf + emp.tds;
                return (
                  <tr key={emp.id}>
                    <td style={{ fontFamily: "var(--font-mono)", fontWeight: 600, color: "#fff" }}>
                      {emp.id}
                    </td>
                    <td style={{ fontWeight: 600 }}>{emp.name}</td>
                    <td>{emp.role}</td>
                    <td style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}>{emp.pan}</td>
                    <td>{formatINR(gross)}</td>
                    <td style={{ color: "#f87171" }}>{formatINR(deductions)}</td>
                    <td style={{ fontWeight: 700, color: "var(--accent-secondary)" }}>
                      {formatINR(emp.netPay)}
                    </td>
                    <td>
                      <span className="badge badge-success">{emp.attendance}</span>
                    </td>
                    <td>
                      <button
                        onClick={() => openPayslip(emp)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: "4px 10px", fontSize: "0.75rem" }}
                      >
                        <Printer size={13} /> View Slip
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Employee Modal */}
      <Modal
        isOpen={addEmpModal}
        onClose={() => setAddEmpModal(false)}
        title="Add Employee to Payroll"
      >
        <form onSubmit={handleCreateEmployee}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              value={newEmp.name}
              onChange={(e) => setNewEmp({ ...newEmp, name: e.target.value })}
              required
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Designation</label>
              <input
                type="text"
                className="form-input"
                value={newEmp.role}
                onChange={(e) => setNewEmp({ ...newEmp, role: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">PAN Number</label>
              <input
                type="text"
                className="form-input"
                maxLength={10}
                value={newEmp.pan}
                onChange={(e) => setNewEmp({ ...newEmp, pan: e.target.value.toUpperCase() })}
                required
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Basic Salary (₹)</label>
              <input
                type="number"
                className="form-input"
                value={newEmp.basic}
                onChange={(e) => setNewEmp({ ...newEmp, basic: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">HRA (₹)</label>
              <input
                type="number"
                className="form-input"
                value={newEmp.hra}
                onChange={(e) => setNewEmp({ ...newEmp, hra: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Provident Fund (PF ₹)</label>
              <input
                type="number"
                className="form-input"
                value={newEmp.pf}
                onChange={(e) => setNewEmp({ ...newEmp, pf: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Monthly TDS (₹)</label>
              <input
                type="number"
                className="form-input"
                value={newEmp.tds}
                onChange={(e) => setNewEmp({ ...newEmp, tds: e.target.value })}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: 12 }}>
            Register Employee
          </button>
        </form>
      </Modal>

      {/* Printable Payslip Modal */}
      {selectedEmployee && (
        <Modal
          isOpen={payslipModal}
          onClose={() => setPayslipModal(false)}
          title={`Salary Slip — ${selectedEmployee.name}`}
          maxWidth={600}
        >
          <div style={{ padding: "16px", background: "rgba(10, 6, 20, 0.95)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}>
            <div style={{ textAlign: "center", borderBottom: "1px solid var(--border-subtle)", paddingBottom: 12, marginBottom: 16 }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800 }}>Maddheshiya & Associates CA</h3>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Monthly Salary Voucher for August 2026</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: "0.85rem", marginBottom: 16 }}>
              <div>Employee Name: <strong>{selectedEmployee.name}</strong></div>
              <div>Employee ID: <strong>{selectedEmployee.id}</strong></div>
              <div>Designation: <strong>{selectedEmployee.role}</strong></div>
              <div>PAN: <strong>{selectedEmployee.pan}</strong></div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, borderTop: "1px solid var(--border-subtle)", paddingTop: 12 }}>
              {/* Earnings */}
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--success)", marginBottom: 8 }}>EARNINGS</div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: 4 }}>
                  <span>Basic Salary:</span>
                  <span>{formatINR(selectedEmployee.basic)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: 4 }}>
                  <span>House Rent Allowance:</span>
                  <span>{formatINR(selectedEmployee.hra)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: 4 }}>
                  <span>Special Allowance:</span>
                  <span>{formatINR(selectedEmployee.allowances)}</span>
                </div>
              </div>

              {/* Deductions */}
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--danger)", marginBottom: 8 }}>DEDUCTIONS</div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: 4 }}>
                  <span>Provident Fund (EPF):</span>
                  <span>{formatINR(selectedEmployee.pf)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: 4 }}>
                  <span>Income Tax (TDS):</span>
                  <span>{formatINR(selectedEmployee.tds)}</span>
                </div>
              </div>
            </div>

            <div style={{ borderTop: "1px solid var(--border-focus)", marginTop: 16, paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 700 }}>Net Disbursed Take-Home:</span>
              <span style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--accent-secondary)" }}>
                {formatINR(selectedEmployee.netPay)}
              </span>
            </div>

            <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
              <button onClick={() => window.print()} className="btn btn-primary btn-sm" style={{ flexGrow: 1 }}>
                <Printer size={15} /> Print Payslip
              </button>
              <button onClick={() => setPayslipModal(false)} className="btn btn-outline btn-sm">
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
