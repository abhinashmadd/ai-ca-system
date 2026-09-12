import React, { createContext, useContext, useState, useEffect } from "react";
import {
  INITIAL_CLIENTS,
  INITIAL_INVOICES,
  GST_FILING_RECORDS,
  PAYROLL_EMPLOYEES,
  COMPLIANCE_DEADLINES
} from "../utils/mockData";

const DataContext = createContext(null);

export function DataProvider({ children }) {
  // Clients state
  const [clients, setClients] = useState(() => {
    try {
      const saved = localStorage.getItem("ai_ca_clients");
      return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
    } catch {
      return INITIAL_CLIENTS;
    }
  });

  // Invoices state
  const [invoices, setInvoices] = useState(() => {
    try {
      const saved = localStorage.getItem("ai_ca_invoices");
      return saved ? JSON.parse(saved) : INITIAL_INVOICES;
    } catch {
      return INITIAL_INVOICES;
    }
  });

  // GST records state
  const [gstRecords, setGstRecords] = useState(() => {
    try {
      const saved = localStorage.getItem("ai_ca_gst");
      return saved ? JSON.parse(saved) : GST_FILING_RECORDS;
    } catch {
      return GST_FILING_RECORDS;
    }
  });

  // Employees state
  const [employees, setEmployees] = useState(() => {
    try {
      const saved = localStorage.getItem("ai_ca_employees");
      return saved ? JSON.parse(saved) : PAYROLL_EMPLOYEES;
    } catch {
      return PAYROLL_EMPLOYEES;
    }
  });

  // Compliance Deadlines state
  const [complianceList, setComplianceList] = useState(() => {
    try {
      const saved = localStorage.getItem("ai_ca_compliance");
      return saved ? JSON.parse(saved) : COMPLIANCE_DEADLINES;
    } catch {
      return COMPLIANCE_DEADLINES;
    }
  });

  // Persist to local storage
  useEffect(() => {
    localStorage.setItem("ai_ca_clients", JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem("ai_ca_invoices", JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem("ai_ca_gst", JSON.stringify(gstRecords));
  }, [gstRecords]);

  useEffect(() => {
    localStorage.setItem("ai_ca_employees", JSON.stringify(employees));
  }, [employees]);

  // Client CRUD
  const addClient = (newClient) => {
    const item = {
      ...newClient,
      id: "CLT-" + (100 + clients.length + 1),
      complianceScore: newClient.complianceScore || 95,
      pendingReturns: 0
    };
    setClients((prev) => [item, ...prev]);
    return item;
  };

  const updateClient = (id, updatedFields) => {
    setClients((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedFields } : c))
    );
  };

  const deleteClient = (id) => {
    setClients((prev) => prev.filter((c) => c.id !== id));
  };

  // Invoice CRUD
  const addInvoice = (newInv) => {
    const item = {
      ...newInv,
      id: "INV-2026-" + String(invoices.length + 90).padStart(3, "0"),
      date: newInv.date || new Date().toISOString().split("T")[0],
      status: newInv.status || "Pending"
    };
    setInvoices((prev) => [item, ...prev]);
    return item;
  };

  const updateInvoiceStatus = (id, status) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status } : inv))
    );
  };

  // Employee CRUD
  const addEmployee = (newEmp) => {
    const item = {
      ...newEmp,
      id: "EMP-" + String(employees.length + 1).padStart(2, "0"),
      attendance: "100%",
      status: "Active"
    };
    setEmployees((prev) => [item, ...prev]);
    return item;
  };

  const deleteEmployee = (id) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== id));
  };

  // GST filing simulate
  const markGstFiled = (period, form) => {
    setGstRecords((prev) =>
      prev.map((g) =>
        g.period === period && g.form === form
          ? {
              ...g,
              status: "Filed",
              arn: "AA" + Math.floor(100000000000 + Math.random() * 900000000000),
              filedOn: new Date().toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric"
              })
            }
          : g
      )
    );
  };

  return (
    <DataContext.Provider
      value={{
        clients,
        invoices,
        gstRecords,
        employees,
        complianceList,
        addClient,
        updateClient,
        deleteClient,
        addInvoice,
        updateInvoiceStatus,
        addEmployee,
        deleteEmployee,
        markGstFiled
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
