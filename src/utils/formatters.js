// Helper formatters & financial computation algorithms

export function formatINR(val) {
  if (val === undefined || val === null || isNaN(val)) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(val);
}

export function formatDate(dateString) {
  if (!dateString) return "";
  const d = new Date(dateString);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

// Compute Indian Income Tax (New vs Old Regime)
export function computeTaxRegimes(grossIncome, deductions = {}) {
  const standardDeduction = 75000; // Updated budget slab
  
  // NEW REGIME calculation
  const newTaxable = Math.max(0, grossIncome - standardDeduction);
  let newTax = 0;
  if (newTaxable <= 300000) {
    newTax = 0;
  } else if (newTaxable <= 700000) {
    newTax = (newTaxable - 300000) * 0.05;
  } else if (newTaxable <= 1000000) {
    newTax = 20000 + (newTaxable - 700000) * 0.10;
  } else if (newTaxable <= 1200000) {
    newTax = 50000 + (newTaxable - 1000000) * 0.15;
  } else if (newTaxable <= 1500000) {
    newTax = 80000 + (newTaxable - 1200000) * 0.20;
  } else {
    newTax = 140000 + (newTaxable - 1500000) * 0.30;
  }

  // Section 87A rebate for New Regime (taxable up to 7L gets zero tax)
  if (newTaxable <= 700000) {
    newTax = 0;
  }
  const newCess = newTax * 0.04;
  const totalNewTax = Math.round(newTax + newCess);

  // OLD REGIME calculation
  const sec80C = Math.min(150000, Number(deductions.sec80C || 0));
  const sec80D = Math.min(75000, Number(deductions.sec80D || 0));
  const hra = Number(deductions.hra || 0);
  const homeLoanInt = Math.min(200000, Number(deductions.homeLoan || 0));
  const totalOldDeductions = 50000 + sec80C + sec80D + hra + homeLoanInt;
  
  const oldTaxable = Math.max(0, grossIncome - totalOldDeductions);
  let oldTax = 0;
  if (oldTaxable <= 250000) {
    oldTax = 0;
  } else if (oldTaxable <= 500000) {
    oldTax = (oldTaxable - 250000) * 0.05;
  } else if (oldTaxable <= 1000000) {
    oldTax = 12500 + (oldTaxable - 500000) * 0.20;
  } else {
    oldTax = 112500 + (oldTaxable - 1000000) * 0.30;
  }

  // Section 87A rebate for Old Regime (taxable up to 5L)
  if (oldTaxable <= 500000) {
    oldTax = 0;
  }
  const oldCess = oldTax * 0.04;
  const totalOldTax = Math.round(oldTax + oldCess);

  const savings = Math.abs(totalOldTax - totalNewTax);
  const recommended = totalNewTax <= totalOldTax ? "New Regime" : "Old Regime";

  return {
    grossIncome,
    newRegime: {
      taxable: newTaxable,
      tax: newTax,
      cess: newCess,
      total: totalNewTax
    },
    oldRegime: {
      deductions: totalOldDeductions,
      taxable: oldTaxable,
      tax: oldTax,
      cess: oldCess,
      total: totalOldTax
    },
    savings,
    recommended
  };
}
