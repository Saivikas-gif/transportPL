// // export const num = (value) => Number(value) || 0;

// // // =========================
// // // ROW LEVEL CALCULATIONS
// // // =========================

// // export const calculateRevenue = (item) => {
// //   return (
// //     num(item.net_tuition_for_25_26) +
// //     num(item.application_fee_for_25_26) +
// //     num(item.admission_fee_for_25_26)
// //   );
// // };

// // export const calculateOperatingExpense = (item, getValue) => {
// //   return (
// //     getValue(item, "hk_exp") +
// //     num(item.mess_exp) +
// //     getValue(item, "security") +
// //     num(item.water) +
// //     getValue(item, "electricity") +
// //     getValue(item, "depreciation_for_25_26") +
// //     getValue(item, "electrical_consumables_for_25_26") +
// //     getValue(item, "marketing_for_25_26") +
// //     getValue(item, "r_and_m_bldg_for_25_26") +
// //     getValue(item, "r_and_m_others_for_25_26") +
// //     num(item.other_exp_for_25_26_except_transport_rates_taxes_and_amc)
// //   );
// // };

// // export const calculateCoExp = (item) => {
// //   return Math.round((calculateRevenue(item) * 15) / 100);
// // };

// // export const calculateTotalExpenditure = (item, getValue) => {
// //   return (
// //     getValue(item, "salaries_for_25_26") +
// //     getValue(item, "rent") +
// //     calculateOperatingExpense(item, getValue) +
// //     calculateCoExp(item)
// //   );
// // };

// // export const calculatePnl = (item, getValue) => {
// //   return calculateRevenue(item) -
// //     calculateTotalExpenditure(item, getValue);
// // };

// // export const calculatePnlPercent = (item, getValue) => {
// //   const revenue = calculateRevenue(item);

// //   if (revenue === 0) return 0;

// //   return Math.round(
// //     (calculatePnl(item, getValue) / revenue) * 100
// //   );
// // };

// // export const calculateExpenditurePercent = (item, getValue) => {
// //   const revenue = calculateRevenue(item);

// //   if (revenue === 0) return 0;

// //   return Math.round(
// //     (calculateTotalExpenditure(item, getValue) / revenue) * 100
// //   );
// // };

// // export const num = (value) => Number(value) || 0;

// // // =========================
// // // ROW LEVEL CALCULATIONS
// // // =========================

// // export const calculateRevenue = (item) => {
// //   return (
// //     num(item.net_tuition_for_25_26) +
// //     num(item.application_fee_for_25_26) +
// //     num(item.admission_fee_for_25_26)
// //   );
// // };

// // export const calculateOperatingExpense = (item, getValue) => {
// //   return (
// //     getValue(item, "hk_exp") +
// //     num(item.mess_exp) +
// //     getValue(item, "security") +
// //     num(item.water) +
// //     getValue(item, "electricity") +
// //     getValue(item, "depreciation_for_25_26") +
// //     getValue(item, "electrical_consumables_for_25_26") +
// //     getValue(item, "marketing_for_25_26") +
// //     getValue(item, "r_and_m_bldg_for_25_26") +
// //     getValue(item, "r_and_m_others_for_25_26") +
// //     num(item.other_exp_for_25_26_except_transport_rates_taxes_and_amc)
// //   );
// // };

// // // CO Exp is 15% of revenue (revenue fields are read-only, so no getValue needed)
// // export const calculateCoExp = (item) => {
// //   return Math.round((calculateRevenue(item) * 15) / 100);
// // };

// // export const calculateTotalExpenditure = (item, getValue) => {
// //   return (
// //     getValue(item, "salaries_for_25_26") +
// //     getValue(item, "rent") +
// //     calculateOperatingExpense(item, getValue) +
// //     calculateCoExp(item)
// //   );
// // };

// // export const calculatePnl = (item, getValue) => {
// //   return calculateRevenue(item) - calculateTotalExpenditure(item, getValue);
// // };

// // export const calculatePnlPercent = (item, getValue) => {
// //   const revenue = calculateRevenue(item);
// //   if (revenue === 0) return 0;
// //   return Math.round((calculatePnl(item, getValue) / revenue) * 100);
// // };

// // // FIX: was named calculateExpenditurePercent in original — renamed to match TableView call
// // export const calculateTotalExpenditurePercent = (item, getValue) => {
// //   const revenue = calculateRevenue(item);
// //   if (revenue === 0) return 0;
// //   return Math.round((calculateTotalExpenditure(item, getValue) / revenue) * 100);
// // };

// export const num = (value) => Number(value) || 0;

// // =========================
// // ROW LEVEL CALCULATIONS
// // =========================

// export const calculateRevenue = (item) => {
//   return (
//     num(item.net_tuition_for_25_26) +
//     num(item.application_fee_for_25_26) +
//     num(item.admission_fee_for_25_26)
//   );

//   // return num(item.paid_amount || 0);
// };

// export const calculateReceived = (item) => {
//   return (
//     num(item.paid_amount)
//   );

//   // return num(item.paid_amount || 0);
// };

// // FIX: Now exported — TableView needs this to show live Operating Exp per row
// // and to compute the live grand total Operating Exp column.
// // Editable fields inside: hk_exp, security, electricity, depreciation,
// // electrical_consumables, marketing, r_and_m_bldg, r_and_m_others
// // Non-editable (always from item): mess_exp, water, other_exp
// export const calculateOperatingExpense = (item, getValue) => {
//   return (
//     getValue(item, "hk_exp") +
//     num(item.mess_exp) +
//     getValue(item, "security") +
//     num(item.water) +
//     getValue(item, "electricity") +
//     getValue(item, "depreciation_for_25_26") +
//     getValue(item, "electrical_consumables_for_25_26") +
//     getValue(item, "marketing_for_25_26") +
//     getValue(item, "r_and_m_bldg_for_25_26") +
//     getValue(item, "r_and_m_others_for_25_26") +
//     num(item.other_exp_for_25_26_except_transport_rates_taxes_and_amc)
//   );
// };

// // CO Exp = 15% of revenue. Revenue fields are not editable so this is stable.
// export const calculateCoExp = (item) => {
//   return Math.round((calculateReceived(item) * 15) / 100);
// };

// export const calculateTotalExpenditure = (item, getValue) => {
//   console.log("salary: ", getValue(item, "salaries_for_25_26"));
//   console.log("Rent: ",   getValue(item, "rent"));
//   console.log("op: ", calculateOperatingExpense(item, getValue));
//   console.log("cop: ",calculateCoExp(item));
//   console.log("branch",item.branch,"hi");
//   return (
//      getValue(item, "salaries_for_25_26") +
    
//     getValue(item, "rent") +
//     calculateOperatingExpense(item, getValue) +
//     calculateCoExp(item)
//   );
// };

// export const calculatePnl = (item, getValue) => {
//   return calculateReceived(item) - calculateTotalExpenditure(item, getValue);
// };

// export const calculatePnlPercent = (item, getValue) => {
//   const revenue = calculateReceived(item);
//   if (revenue === 0) return 0;
//   return Math.round((calculatePnl(item, getValue) / revenue) * 100);
// };

// export const calculateTotalExpenditurePercent = (item, getValue) => {
//   const revenue = calculateRevenue(item);
//   if (revenue === 0) return 0;
//   return Math.round((calculateTotalExpenditure(item, getValue) / revenue) * 100);
// };

// export const num = (value) => Number(value) || 0;

// // =========================
// // ROW LEVEL CALCULATIONS
// // =========================

// export const calculateRevenue = (item) => {
//   return (
//     num(item.net_tuition_for_25_26) +
//     num(item.application_fee_for_25_26) +
//     num(item.admission_fee_for_25_26)
//   );
// };

// // ✅ CHANGED: now uses current_net_revenue instead of paid_amount
// export const calculateReceived = (item) => {
//   return num(item.current_net_revenue);
// };

// export const calculateOperatingExpense = (item, getValue) => {
//   return (
//     getValue(item, "hk_exp") +
//     num(item.mess_exp) +
//     getValue(item, "security") +
//     num(item.water) +
//     getValue(item, "electricity") +
//     getValue(item, "depreciation_for_25_26") +
//     getValue(item, "electrical_consumables_for_25_26") +
//     getValue(item, "marketing_for_25_26") +
//     getValue(item, "r_and_m_bldg_for_25_26") +
//     getValue(item, "r_and_m_others_for_25_26") +
//     num(item.other_exp_for_25_26_except_transport_rates_taxes_and_amc)
//   );
// };

// // CO Exp = 15% of current_net_revenue (via calculateReceived)
// export const calculateCoExp = (item) => {
//   return Math.round((calculateReceived(item) * 15) / 100);
// };

// export const calculateTotalExpenditure = (item, getValue) => {
//   return (
//     getValue(item, "salaries_for_25_26") +
//     getValue(item, "rent") +
//     calculateOperatingExpense(item, getValue) +
//     calculateCoExp(item)
//   );
// };

// export const calculatePnl = (item, getValue) => {
//   return calculateReceived(item) - calculateTotalExpenditure(item, getValue);
// };

// export const calculatePnlPercent = (item, getValue) => {
//   const revenue = calculateReceived(item);
//   if (revenue === 0) return 0;
//   return Math.round((calculatePnl(item, getValue) / revenue) * 100);
// };

// export const calculateTotalExpenditurePercent = (item, getValue) => {
//   const revenue = calculateRevenue(item);
//   if (revenue === 0) return 0;
//   return Math.round((calculateTotalExpenditure(item, getValue) / revenue) * 100);
// };

export const num = (value) => Number(value) || 0;

export const calculateRevenue = (item) => {
  return (
    num(item.net_tuition_for_25_26) +
    num(item.application_fee_for_25_26) +
    num(item.admission_fee_for_25_26)
  );
};

// Net Received = actual cash paid by students
// export const calculateReceived = (item) => {
//   return num(item.paid_amount);
// };

  // current_net_revenue = currently given Amount 
  export const calculateReceived = (item) => {
    return num(item.current_net_revenue);
  };

export const calculateOperatingExpense = (item, getValue) => {
  return (
    getValue(item, "hk_exp") +
    num(item.mess_exp) +
    getValue(item, "security") +
    num(item.water) +
    getValue(item, "electricity") +
    getValue(item, "depreciation_for_25_26") +
    getValue(item, "electrical_consumables_for_25_26") +
    getValue(item, "marketing_for_25_26") +
    getValue(item, "r_and_m_bldg_for_25_26") +
    getValue(item, "r_and_m_others_for_25_26") +
    num(item.other_exp_for_25_26_except_transport_rates_taxes_and_amc)
  );
};

// CO Exp = 15% of current_net_revenue (not paid_amount)
export const calculateCoExp = (item) => {
  return Math.round((num(item.current_net_revenue) * 15) / 100);
};

export const calculateTotalExpenditure = (item, getValue) => {
  return (
    getValue(item, "salaries_for_25_26") +
    getValue(item, "rent") +
    calculateOperatingExpense(item, getValue) +
    calculateCoExp(item)
  );
};

export const calculatePnl = (item, getValue) => {
  return calculateReceived(item) - calculateTotalExpenditure(item, getValue);
};

export const calculatePnlPercent = (item, getValue) => {
  const revenue = calculateReceived(item);
  if (revenue === 0) return 0;
  return Math.round((calculatePnl(item, getValue) / revenue) * 100);
};

export const calculateTotalExpenditurePercent = (item, getValue) => {
  const revenue = calculateRevenue(item);
  if (revenue === 0) return 0;
  return Math.round((calculateTotalExpenditure(item, getValue) / revenue) * 100);
};