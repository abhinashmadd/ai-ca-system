import React, { useState } from "react";
import { useData } from "../../context/DataContext";
import Modal from "../../components/common/Modal";
import Toast from "../../components/common/Toast";
import {
  Users,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  Building,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";

export default function Clients() {
  const { clients, addClient, updateClient, deleteClient } = useData();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");

  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState(null);
  const [profileModal, setProfileModal] = useState(null);
  const [toastMsg, setToastMsg] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    pan: "",
    gstin: "",
    type: "Private Limited",
    email: "",
    phone: "",
    turnover: "₹5.0 Cr",
    address: ""
  });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.pan) {
      setToastMsg("Company name and PAN are required.");
      return;
    }
    const created = addClient(formData);
    setCreateModal(false);
    setToastMsg(`Client ${created.name} registered.`);
    setFormData({
      name: "",
      pan: "",
      gstin: "",
      type: "Private Limited",
      email: "",
      phone: "",
      turnover: "₹5.0 Cr",
      address: ""
    });
  };

  const handleEdit = (e) => {
    e.preventDefault();
    if (!editModal) return;
    updateClient(editModal.id, editModal);
    setEditModal(null);
    setToastMsg("Client details updated successfully.");
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      deleteClient(id);
      setToastMsg(`Client ${name} removed.`);
    }
  };

  const filtered = clients.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.pan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.gstin.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "All" || c.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg("")} />}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800 }}>Client Entity Registry</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
            Comprehensive management of corporate entities, LLPs, proprietorships, and compliance audits.
          </p>
        </div>

        <button onClick={() => setCreateModal(true)} className="btn btn-primary btn-sm">
          <Plus size={16} /> Onboard New Client
        </button>
      </div>

      {/* Search & Filter */}
      <div className="glass-panel" style={{ padding: "16px", display: "flex", gap: 16, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flexGrow: 1, minWidth: 260 }}>
          <Search size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)" }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: 40 }}
            placeholder="Search by company name, PAN, or GSTIN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          {["All", "Private Limited", "LLP", "Partnership"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`btn btn-sm ${filterType === type ? "btn-primary" : "btn-outline"}`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Clients Table */}
      <div className="glass-panel" style={{ padding: "20px" }}>
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Entity Name</th>
                <th>Type</th>
                <th>PAN</th>
                <th>GSTIN</th>
                <th>Turnover</th>
                <th>Audit Status</th>
                <th>Compliance</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 600, color: "#fff" }}>{c.name}</td>
                  <td>
                    <span className="badge badge-purple">{c.type}</span>
                  </td>
                  <td style={{ fontFamily: "var(--font-mono)", fontSize: "0.825rem" }}>{c.pan}</td>
                  <td style={{ fontFamily: "var(--font-mono)", fontSize: "0.825rem" }}>{c.gstin}</td>
                  <td>{c.turnover}</td>
                  <td>
                    <span
                      className={`badge ${
                        c.auditStatus === "Completed"
                          ? "badge-success"
                          : c.auditStatus === "In Progress"
                          ? "badge-warning"
                          : "badge-danger"
                      }`}
                    >
                      {c.auditStatus}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 45, height: 6, background: "rgba(168, 85, 247, 0.15)", borderRadius: 999 }}>
                        <div style={{ width: `${c.complianceScore}%`, height: "100%", background: "#10b981", borderRadius: 999 }} />
                      </div>
                      <span style={{ fontSize: "0.75rem", fontWeight: 700 }}>{c.complianceScore}%</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        onClick={() => setProfileModal(c)}
                        className="topbar-icon-btn"
                        style={{ width: 32, height: 32 }}
                        title="View Profile"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => setEditModal(c)}
                        className="topbar-icon-btn"
                        style={{ width: 32, height: 32 }}
                        title="Edit Client"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id, c.name)}
                        className="topbar-icon-btn"
                        style={{ width: 32, height: 32, color: "#f87171" }}
                        title="Delete Client"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Onboard Client Modal */}
      <Modal
        isOpen={createModal}
        onClose={() => setCreateModal(false)}
        title="Onboard Corporate Client"
      >
        <form onSubmit={handleCreate}>
          <div className="form-group">
            <label className="form-label">Entity Full Name</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Apex Global Technologies Pvt Ltd"
              required
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="form-group">
              <label className="form-label">PAN Number</label>
              <input
                type="text"
                className="form-input"
                maxLength={10}
                value={formData.pan}
                onChange={(e) => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
                placeholder="AAACA1234F"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">GSTIN</label>
              <input
                type="text"
                className="form-input"
                maxLength={15}
                value={formData.gstin}
                onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                placeholder="07AAACA1234F1Z5"
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Constitution Type</label>
              <select
                className="form-select"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="Private Limited">Private Limited</option>
                <option value="Public Limited">Public Limited</option>
                <option value="LLP">LLP</option>
                <option value="Partnership">Partnership</option>
                <option value="Proprietorship">Proprietorship</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Annual Turnover</label>
              <input
                type="text"
                className="form-input"
                value={formData.turnover}
                onChange={(e) => setFormData({ ...formData, turnover: e.target.value })}
                placeholder="₹15.0 Cr"
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Official Email</label>
              <input
                type="email"
                className="form-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="finance@apextech.in"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Contact Phone</label>
              <input
                type="text"
                className="form-input"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98112 34567"
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: 12 }}>
            Save Client Profile
          </button>
        </form>
      </Modal>

      {/* Edit Client Modal */}
      {editModal && (
        <Modal
          isOpen={!!editModal}
          onClose={() => setEditModal(null)}
          title={`Edit Client — ${editModal.name}`}
        >
          <form onSubmit={handleEdit}>
            <div className="form-group">
              <label className="form-label">Company Name</label>
              <input
                type="text"
                className="form-input"
                value={editModal.name}
                onChange={(e) => setEditModal({ ...editModal, name: e.target.value })}
                required
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div className="form-group">
                <label className="form-label">PAN</label>
                <input
                  type="text"
                  className="form-input"
                  value={editModal.pan}
                  onChange={(e) => setEditModal({ ...editModal, pan: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">GSTIN</label>
                <input
                  type="text"
                  className="form-input"
                  value={editModal.gstin}
                  onChange={(e) => setEditModal({ ...editModal, gstin: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Audit Status</label>
                <select
                  className="form-select"
                  value={editModal.auditStatus}
                  onChange={(e) => setEditModal({ ...editModal, auditStatus: e.target.value })}
                >
                  <option value="Completed">Completed</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Review Needed">Review Needed</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Turnover</label>
                <input
                  type="text"
                  className="form-input"
                  value={editModal.turnover}
                  onChange={(e) => setEditModal({ ...editModal, turnover: e.target.value })}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: 12 }}>
              Update Changes
            </button>
          </form>
        </Modal>
      )}

      {/* Client Profile Modal */}
      {profileModal && (
        <Modal
          isOpen={!!profileModal}
          onClose={() => setProfileModal(null)}
          title="Client Entity Dossier"
          maxWidth={550}
        >
          <div style={{ padding: "16px", background: "rgba(10, 6, 20, 0.95)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18, borderBottom: "1px solid var(--border-subtle)", paddingBottom: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: "var(--radius-md)", background: "var(--accent-gradient)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800 }}>
                {profileModal.name.charAt(0)}
              </div>
              <div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 800 }}>{profileModal.name}</h3>
                <span className="badge badge-purple">{profileModal.type}</span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: "0.875rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Permanent Account No (PAN):</span>
                <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}>{profileModal.pan}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>GST Identification No (GSTIN):</span>
                <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}>{profileModal.gstin}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Reported Turnover:</span>
                <span style={{ fontWeight: 600 }}>{profileModal.turnover}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Registered Office:</span>
                <span>{profileModal.address || "New Delhi / NCR"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Statutory Audit Status:</span>
                <span className="badge badge-success">{profileModal.auditStatus}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--text-muted)" }}>Compliance Adherence:</span>
                <span style={{ fontWeight: 700, color: "#10b981" }}>{profileModal.complianceScore}%</span>
              </div>
            </div>

            <button onClick={() => setProfileModal(null)} className="btn btn-secondary btn-sm" style={{ width: "100%", marginTop: 20 }}>
              Close Dossier
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
