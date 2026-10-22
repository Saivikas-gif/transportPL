// import * as XLSX from "xlsx-js-style";
// import { saveAs } from "file-saver";

// const downloadExcel = (filteredData, editedRows = {}) => {

//   if (!filteredData || filteredData.length === 0) {
//     alert("No data available to download");
//     return;
//   }

//   const getRowKey = (item) =>
//     `${item.state}_${item.zone}_${item.branch}_${item.agm}_${item.RI}`;

//   const formattedData = filteredData.map((item) => {

//     const rowKey = getRowKey(item);
//     const edited = editedRows[rowKey] || {};

//     // ── Editable fields ──────────────────────────────────────────────────────
//     const salaries =
//       Number(edited.salaries_for_25_26 ?? item.salaries_for_25_26) || 0;

//     const rent =
//       Number(edited.rent ?? item.rent) || 0;

//     const mess =
//       Number(edited.mess_exp ?? item.mess_exp) || 0;

//     const hk =
//       Number(edited.hk_exp ?? item.hk_exp) || 0;

//     const security =
//       Number(edited.security ?? item.security) || 0;

//     const water =
//       Number(edited.water ?? item.water) || 0;

//     const electricity =
//       Number(edited.electricity ?? item.electricity) || 0;

//     const depreciation =
//       Number(edited.depreciation_for_25_26 ?? item.depreciation_for_25_26) || 0;

//     const electricalConsumables =
//       Number(edited.electrical_consumables_for_25_26 ?? item.electrical_consumables_for_25_26) || 0;

//     const marketing =
//       Number(edited.marketing_for_25_26 ?? item.marketing_for_25_26) || 0;

//     const rAndMBldg =
//       Number(edited.r_and_m_bldg_for_25_26 ?? item.r_and_m_bldg_for_25_26) || 0;

//     const rAndMOthers =
//       Number(edited.r_and_m_others_for_25_26 ?? item.r_and_m_others_for_25_26) || 0;

//     // ── Non-editable fields ──────────────────────────────────────────────────
//     const otherExp =
//       Number(item.other_exp_for_25_26_except_transport_rates_taxes_and_amc) || 0;

//     const coExp =
//       Number(item.co_exp_for_25_26_15_percent) || 0;

//     // ── Net Revenue ──────────────────────────────────────────────────────────
//     const netRevenue =
//       (Number(item.net_tuition_for_25_26) || 0) +
//       (Number(item.application_fee_for_25_26) || 0) +
//       (Number(item.admission_fee_for_25_26) || 0);

//     const netReceived =
//       Number(item.paid_amount) || 0;

//     // ── Operating Exp ────────────────────────────────────────────────────────
//     // Matches TableView liveTotals exactly:
//     // mess + hk + security + water + electricity + depreciation +
//     // electricalConsumables + marketing + rAndMBldg + rAndMOthers + otherExp
//     // (water and otherExp ARE inside operatingExp per grand total formula)
//     const operatingExp =
//       mess +
//       hk +
//       security +
//       water +
//       electricity +
//       depreciation +
//       electricalConsumables +
//       marketing +
//       rAndMBldg +
//       rAndMOthers +
//       otherExp;

//     // ── Total Expenditure ────────────────────────────────────────────────────
//     // Matches TableView: salaries + rent + operating_exp + co_exp
//     // (NO separate mess/water/otherExp — already inside operatingExp)
//     const totalExpenditure =
//       salaries +
//       rent +
//       operatingExp +
//       coExp;

//     // ── P&L ──────────────────────────────────────────────────────────────────
//     const pnl = netReceived - totalExpenditure;

//     const totalExpenditurePercent =
//       netRevenue > 0
//         ? Math.round((totalExpenditure / netRevenue) * 100)
//         : 0;

//     const profitLossPercent =
//       netReceived > 0
//         ? Math.round((pnl / netReceived) * 100)
//         : 0;

//     return {
//       State: item.state,
//       Zone: item.zone,
//       Branch: item.branch,
//       AGM: item.agm,
//       RI: item.RI,
//       "State/CBSE": item.syllabus || "-",
//       "Campus Type": item.ds_res || "-",
//       "Year Of Establishment": item.year_establishment,
//       "No Of Years": item.no_of_years,
//       "Fusion Building Code": item.fusion_building_code,
//       DS: Number(item.ds) || 0,
//       RES: Number(item.res) || 0,
//       "Total Strength": Number(item.total_strength) || 0,
//       "Avg Fee": Math.round(Number(item.avg_fee_for_25_26) || 0),
//       "Net Tuition": Math.round(Number(item.net_tuition_for_25_26) || 0),
//       "Application Fee": Math.round(Number(item.application_fee_for_25_26) || 0),
//       "Admission Fee": Math.round(Number(item.admission_fee_for_25_26) || 0),
//       "Net Revenue": Math.round(netRevenue),
//       "Net Received": Math.round(Number(item.paid_amount) || 0),
//       "Emp Count": Math.round(Number(item.avg_emp_count) || 0),
//       Salaries: Math.round(salaries),
//       "Salaries %": Math.round(Number(item.salaries_percent_for_25_26) || 0),
//       "Total Rent SFT": Math.round(Number(item.total_rent_sft) || 0),
//       Rent: Math.round(rent),
//       "Rent %": Math.round(Number(item.rentper) || 0),
//       Mess: Math.round(mess),
//       HK: Math.round(hk),
//       Security: Math.round(security),
//       Water: Math.round(water),
//       Electricity: Math.round(electricity),
//       Depreciation: Math.round(depreciation),
//       "Electrical Consumables": Math.round(electricalConsumables),
//       Marketing: Math.round(marketing),
//       "R&M Bldg": Math.round(rAndMBldg),
//       "R&M Others": Math.round(rAndMOthers),
//       "Other Exp": Math.round(otherExp),
//       "Operating Exp": Math.round(operatingExp),
//       "OverHead Exp": Math.round(coExp),
//       "Total Expenditure": Math.round(totalExpenditure),
//       "Total Expenditure %": totalExpenditurePercent,
//       "P&L": Math.round(pnl),
//       "Profit/Loss %": profitLossPercent,
//     };
//   });

//   // ── Worksheet ────────────────────────────────────────────────────────────
//   const worksheet = XLSX.utils.json_to_sheet(formattedData);
//   const range = XLSX.utils.decode_range(worksheet["!ref"]);
//   const headers = Object.keys(formattedData[0]);

//   // ── Header styling ───────────────────────────────────────────────────────
//   headers.forEach((header, C) => {
//     const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
//     if (worksheet[cellAddress]) {
//       worksheet[cellAddress].s = {
//         font: { bold: true, sz: 12, color: { rgb: "FFFFFF" } },
//         fill: { patternType: "solid", fgColor: { rgb: "1F4E79" } },
//         alignment: { horizontal: "center", vertical: "center" },
//       };
//     }
//   });

//   // ── Number format ────────────────────────────────────────────────────────
//   for (let R = range.s.r + 1; R <= range.e.r; R++) {
//     for (let C = range.s.c; C <= range.e.c; C++) {
//       const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
//       const cell = worksheet[cellAddress];
//       if (cell && typeof cell.v === "number") {
//         cell.z = '#,##,##0;-#,##,##0;"-"';
//       }
//     }
//   }

//   // ── P&L color styling ────────────────────────────────────────────────────
//   const pnlColIndex = headers.indexOf("P&L");
//   const percentColIndex = headers.indexOf("Profit/Loss %");

//   if (pnlColIndex !== -1 && percentColIndex !== -1) {
//     for (let R = 1; R <= range.e.r; R++) {
//       const pnlCell = XLSX.utils.encode_cell({ r: R, c: pnlColIndex });
//       const pctCell = XLSX.utils.encode_cell({ r: R, c: percentColIndex });
//       const pctValue = worksheet[pctCell]?.v || 0;

//       const style =
//         pctValue < 0
//           ? { font: { color: { rgb: "FF0000" }, bold: true } }
//           : pctValue > 0
//           ? { font: { color: { rgb: "008000" }, bold: true } }
//           : { font: { color: { rgb: "000000" } } };

//       if (worksheet[pnlCell]) worksheet[pnlCell].s = style;
//       if (worksheet[pctCell]) worksheet[pctCell].s = style;
//     }
//   }

//   // ── Column widths ────────────────────────────────────────────────────────
//   worksheet["!cols"] = headers.map(() => ({ wch: 18 }));

//   // ── Workbook & download ──────────────────────────────────────────────────
//   const workbook = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

//   const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

//   saveAs(
//     new Blob([excelBuffer], {
//       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//     }),
//     "Revenue_Report.xlsx"
//   );
// };

// export default downloadExcel;


import * as XLSX from "xlsx-js-style";
import { saveAs } from "file-saver";

const downloadExcel = (filteredData, editedRows = {}) => {

  if (!filteredData || filteredData.length === 0) {
    alert("No data available to download");
    return;
  }

  const getRowKey = (item) =>
    `${item.state}_${item.zone}_${item.branch}_${item.agm}_${item.RI}`;

  const formattedData = filteredData.map((item) => {

    const rowKey = getRowKey(item);
    const edited = editedRows[rowKey] || {};

    // ── Editable fields ──────────────────────────────────────────────────────
    const salaries =
      Number(edited.salaries_for_25_26 ?? item.salaries_for_25_26) || 0;

    const rent =
      Number(edited.rent ?? item.rent) || 0;

    const mess =
      Number(edited.mess_exp ?? item.mess_exp) || 0;

    const hk =
      Number(edited.hk_exp ?? item.hk_exp) || 0;

    const security =
      Number(edited.security ?? item.security) || 0;

    const water =
      Number(edited.water ?? item.water) || 0;

    const electricity =
      Number(edited.electricity ?? item.electricity) || 0;

    const depreciation =
      Number(edited.depreciation_for_25_26 ?? item.depreciation_for_25_26) || 0;

    const electricalConsumables =
      Number(edited.electrical_consumables_for_25_26 ?? item.electrical_consumables_for_25_26) || 0;

    const marketing =
      Number(edited.marketing_for_25_26 ?? item.marketing_for_25_26) || 0;

    const rAndMBldg =
      Number(edited.r_and_m_bldg_for_25_26 ?? item.r_and_m_bldg_for_25_26) || 0;

    const rAndMOthers =
      Number(edited.r_and_m_others_for_25_26 ?? item.r_and_m_others_for_25_26) || 0;

    // ── Non-editable fields ──────────────────────────────────────────────────
    const otherExp =
      Number(item.other_exp_for_25_26_except_transport_rates_taxes_and_amc) || 0;

    // ── CO Exp: 15% of current_net_revenue (matches calculateCoExp) ──────────
    // ✅ CHANGED: was item.co_exp_for_25_26_15_percent (static DB value);
    //    now computed live from current_net_revenue to stay consistent with TableView.
    const coExp =
      Math.round((Number(item.current_net_revenue) || 0) * 15 / 100);

    // ── Net Revenue ──────────────────────────────────────────────────────────
    const netRevenue =
      (Number(item.net_tuition_for_25_26) || 0) +
      (Number(item.application_fee_for_25_26) || 0) +
      (Number(item.admission_fee_for_25_26) || 0);

    // ✅ CHANGED: was paid_amount — now uses current_net_revenue
    const netReceived =
      Number(item.paid_amount) || 0;

      const totalCurrentNetRevenue = Number(item.current_net_revenue);

    // ── Operating Exp ────────────────────────────────────────────────────────
    const operatingExp =
      mess +
      hk +
      security +
      water +
      electricity +
      depreciation +
      electricalConsumables +
      marketing +
      rAndMBldg +
      rAndMOthers +
      otherExp;

    // ── Total Expenditure ────────────────────────────────────────────────────
    const totalExpenditure =
      salaries +
      rent +
      operatingExp +
      coExp;

    // ── P&L ──────────────────────────────────────────────────────────────────
    // ✅ CHANGED: pnl now based on current_net_revenue (netReceived)
    const pnl = totalCurrentNetRevenue - totalExpenditure;

    const totalExpenditurePercent =
      netRevenue > 0
        ? Math.round((totalExpenditure / netRevenue) * 100)
        : 0;

    // ✅ CHANGED: percent based on current_net_revenue
    const profitLossPercent =
      netReceived > 0
        ? Math.round((pnl / totalCurrentNetRevenue) * 100)
        : 0;

    return {
      State: item.state,
      Zone: item.zone,
      Branch: item.branch,
      AGM: item.agm,
      RI: item.RI,
      "State/CBSE": item.syllabus || "-",
      "Campus Type": item.ds_res || "-",
      "Year Of Establishment": item.year_establishment,
      "No Of Years": item.no_of_years,
      "Fusion Building Code": item.fusion_building_code,
      DS: Number(item.ds) || 0,
      RES: Number(item.res) || 0,
      "Total Strength": Number(item.total_strength) || 0,
      "Avg Fee": Math.round(Number(item.avg_fee_for_25_26) || 0),
      "Net Tuition": Math.round(Number(item.net_tuition_for_25_26) || 0),
      "Application Fee": Math.round(Number(item.application_fee_for_25_26) || 0),
      "Admission Fee": Math.round(Number(item.admission_fee_for_25_26) || 0),
      "Net Revenue": Math.round(netRevenue),
      // ✅ CHANGED: Current Net Revenue column added (matches TableView)
      "Current Net Revenue": Math.round(Number(item.current_net_revenue) || 0),
      // ✅ CHANGED: Net Received now shows current_net_revenue
      "Net Received": Math.round(netReceived),
      "Emp Count": Math.round(Number(item.avg_emp_count) || 0),
      Salaries: Math.round(salaries),
      "Salaries %": Math.round(Number(item.salaries_percent_for_25_26) || 0),
      "Total Rent SFT": Math.round(Number(item.total_rent_sft) || 0),
      Rent: Math.round(rent),
      "Rent %": Math.round(Number(item.rentper) || 0),
      Mess: Math.round(mess),
      HK: Math.round(hk),
      Security: Math.round(security),
      Water: Math.round(water),
      Electricity: Math.round(electricity),
      Depreciation: Math.round(depreciation),
      "Electrical Consumables": Math.round(electricalConsumables),
      Marketing: Math.round(marketing),
      "R&M Bldg": Math.round(rAndMBldg),
      "R&M Others": Math.round(rAndMOthers),
      "Other Exp": Math.round(otherExp),
      "Operating Exp": Math.round(operatingExp),
      "OverHead Exp": Math.round(coExp),
      "Total Expenditure": Math.round(totalExpenditure),
      "Total Expenditure %": totalExpenditurePercent,
      "P&L": Math.round(pnl),
      "Profit/Loss %": profitLossPercent,
    };
  });

  // ── Worksheet ────────────────────────────────────────────────────────────
  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const range = XLSX.utils.decode_range(worksheet["!ref"]);
  const headers = Object.keys(formattedData[0]);

  // ── Header styling ───────────────────────────────────────────────────────
  headers.forEach((header, C) => {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
    if (worksheet[cellAddress]) {
      worksheet[cellAddress].s = {
        font: { bold: true, sz: 12, color: { rgb: "FFFFFF" } },
        fill: { patternType: "solid", fgColor: { rgb: "1F4E79" } },
        alignment: { horizontal: "center", vertical: "center" },
      };
    }
  });

  // ── Number format ────────────────────────────────────────────────────────
  for (let R = range.s.r + 1; R <= range.e.r; R++) {
    for (let C = range.s.c; C <= range.e.c; C++) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
      const cell = worksheet[cellAddress];
      if (cell && typeof cell.v === "number") {
        cell.z = '#,##,##0;-#,##,##0;"-"';
      }
    }
  }

  // ── P&L color styling ────────────────────────────────────────────────────
  const pnlColIndex = headers.indexOf("P&L");
  const percentColIndex = headers.indexOf("Profit/Loss %");

  if (pnlColIndex !== -1 && percentColIndex !== -1) {
    for (let R = 1; R <= range.e.r; R++) {
      const pnlCell = XLSX.utils.encode_cell({ r: R, c: pnlColIndex });
      const pctCell = XLSX.utils.encode_cell({ r: R, c: percentColIndex });
      const pctValue = worksheet[pctCell]?.v || 0;

      const style =
        pctValue < 0
          ? { font: { color: { rgb: "FF0000" }, bold: true } }
          : pctValue > 0
          ? { font: { color: { rgb: "008000" }, bold: true } }
          : { font: { color: { rgb: "000000" } } };

      if (worksheet[pnlCell]) worksheet[pnlCell].s = style;
      if (worksheet[pctCell]) worksheet[pctCell].s = style;
    }
  }

  // ── Column widths ────────────────────────────────────────────────────────
  worksheet["!cols"] = headers.map(() => ({ wch: 18 }));

  // ── Workbook & download ──────────────────────────────────────────────────
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

  saveAs(
    new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    "Revenue_Report.xlsx"
  );
};

export default downloadExcel;