// Utility for CSV export and browser-based PDF printing

export const exportService = {
  // Export array of JSON objects as CSV file
  exportCSV(data, fileName = "export.csv") {
    if (!data || !data.length) return;
    const headers = Object.keys(data[0]);
    const csvRows = [];

    // Header row
    csvRows.push(headers.join(","));

    // Data rows
    for (const row of data) {
      const values = headers.map((header) => {
        const val = row[header];
        const escaped = ("" + (val ?? "")).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(","));
    }

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  // Trigger browser print dialog for current view or targeted element
  printWindow() {
    window.print();
  }
};
