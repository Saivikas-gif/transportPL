// // // src/utils/downloadExcel.js

// // import * as XLSX from "xlsx";
// // import { saveAs } from "file-saver";

// // // ========================================
// // // EXCEL DOWNLOAD UTILITY FUNCTION
// // // ========================================
// // const downloadExcel = (filteredData,editedRows = {}) => {
// //   // Prevent empty file download
// //   if (!filteredData || filteredData.length === 0) {
// //     alert("No data available to download");
// //     return;
// //   }

// //  const getRowKey = (item) => {
// //     return `${item.state_name}_${item.zone_name}_${item.BSBranchName}_${item.agm}_${item.ri_name}`;
// //   };



// //   // ========================================
// //   // FORMAT DATA FOR EXCEL EXPORT
// //   // ========================================
// //   const formattedData = filteredData.map((item) => ({

// //     State: item.state,
// //     Zone: item.zone,
// //     Branch: item.branch,
// //     AGM: item.agm,
// //     RI: item.RI,
// //     "State/CBSE": item.syllabus || "-",
// //     "Campus Type": item.ds_res || "-",
// //     "Year Of Establishment": item.year_establishment,
// //     "No Of Years": item.no_of_years,
// //     "Fusion Building Code": item.fusion_building_code,
// //     DS: Number(item.ds) || 0,
// //     Res: Number(item.res) || 0,
// //     "Total Strength": Number(item.total_strength) || 0,

// //     "Avg Fee For 25-26": Math.round(
// //       Number(item.avg_fee_for_25_26) || 0
// //     ),

// //     "Net Tution Fee": Math.round(
// //       Number(item.net_tuition_for_25_26) || 0
// //     ),

// //     "Application Fees For 25-26": Math.round(
// //       Number(item.application_fee_for_25_26) || 0
// //     ),

// //     "Admission For 25-26": Math.round(
// //       Number(item.admission_fee_for_25_26) || 0
// //     ),

// //     "Net Revenue For 25-26": Math.round(
// //       (Number(item.net_tuition_for_25_26) || 0) +
// //       (Number(item.application_fee_for_25_26) || 0) +
// //       (Number(item.admission_fee_for_25_26) || 0)
// //     ),

// //     "Avg Emp Count": Math.round(
// //       Number(item.avg_emp_count) || 0
// //     ),

// //     Salaries: Math.round(
// //       Number(item.salaries_for_25_26) || 0
// //     ),

// //     "Salaries %": Math.round(
// //       Number(item.salaries_percent_for_25_26) || 0
// //     ),

// //     "Total Rent SFT": Math.round(
// //       Number(item.total_rent_sft) || 0
// //     ),

// //     Rent: Math.round(Number(item.rent) || 0),

// //     "Rent %": Math.round(
// //       Number(item.rentper) || 0
// //     ),

// //     "Mess Exp": Math.round(
// //       Number(item.mess_exp) || 0
// //     ),

// //     "HK Exp": Math.round(
// //       Number(item.hk_exp) || 0
// //     ),

// //     Security: Math.round(
// //       Number(item.security) || 0
// //     ),

// //     Water: Math.round(
// //       Number(item.water) || 0
// //     ),

// //     Electricity: Math.round(
// //       Number(item.electricity) || 0
// //     ),

// //     Depreciation: Math.round(
// //       Number(item.depreciation_for_25_26) || 0
// //     ),

// //     "Electrical Consumable": Math.round(
// //       Number(item.electrical_consumables_for_25_26) || 0
// //     ),

// //     Marketing: Math.round(
// //       Number(item.marketing_for_25_26) || 0
// //     ),

// //     "R & M Bldg for 25-26": Math.round(
// //       Number(item.r_and_m_bldg_for_25_26) || 0
// //     ),

// //     "R & M Others For 25-26": Math.round(
// //       Number(item.r_and_m_others_for_25_26) || 0
// //     ),

// //     "Others Exp": Math.round(
// //       Number(
// //         item.other_exp_for_25_26_except_transport_rates_taxes_and_amc
// //       ) || 0
// //     ),

// //     "Total Oper": Math.round(
// //       Number(
// //         item.total_operating_exp_for_2025_26_except_salaries_rent_mess_hk
// //       ) || 0
// //     ),

// //     "Co Exp": Math.round(
// //       Number(item.co_exp_for_25_26_15_percent) || 0
// //     ),

// //     "Total Expenditure": Math.round(
// //       Number(item.total_expenditure_25_26) || 0
// //     ),

// //     "Total Expenditure %": Math.round(
// //       Number(item.total_expenditure_25_26_percent) || 0
// //     ),

// //     "P & L 25-26": Math.round(
// //       Number(item.pnl_for_the_year_2025_26) || 0
// //     ),

// //     "Profit/Loss %": Math.round(
// //       Number(item.profit_or_loss_percent_2025_26) || 0
// //     ),
// //   }));

// //   // ========================================
// //   // CREATE WORKSHEET
// //   // ========================================
// //   const worksheet = XLSX.utils.json_to_sheet(formattedData);

// //   // Apply Indian number format
// //   const range = XLSX.utils.decode_range(worksheet["!ref"]);

// //   for (let row = range.s.r + 1; row <= range.e.r; row++) {
// //     for (let col = 0; col <= range.e.c; col++) {
// //       const cellAddress = XLSX.utils.encode_cell({
// //         r: row,
// //         c: col,
// //       });

// //       const cell = worksheet[cellAddress];

// //       if (cell && typeof cell.v === "number") {
// //         cell.z = '#,##,##0;-#,##,##0;"-"';
// //       }
// //     }
// //   }

// //   // ========================================
// //   // CREATE WORKBOOK
// //   // ========================================
// //   const workbook = XLSX.utils.book_new();
// //   XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

// //   const excelBuffer = XLSX.write(workbook, {
// //     bookType: "xlsx",
// //     type: "array",
// //   });

// //   const fileData = new Blob([excelBuffer], {
// //     type:
// //       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
// //   });

// //   saveAs(fileData, "Revenue_Report.xlsx");
// // };

// // export default downloadExcel;


// // src/utils/downloadExcel.js


// // import * as XLSX from "xlsx-js-style";
// // import { saveAs } from "file-saver";

// // const downloadExcel = (filteredData, editedRows = {}) => {
// //   if (!filteredData || filteredData.length === 0) {
// //     alert("No data available to download");
// //     return;
// //   }

// //   const getRowKey = (item) => {
// //     return `${item.state}_${item.zone}_${item.branch}_${item.agm}_${item.RI}`;
// //   };

// //   const formattedData = filteredData.map((item) => {
// //     const rowKey = getRowKey(item);
// //     const edited = editedRows[rowKey] || {};

// //     // =========================
// //     // TAKE EDITED VALUES
// //     // =========================
// //     const salaries =
// //       Number(
// //         edited.salaries_for_25_26 ??
// //           item.salaries_for_25_26
// //       ) || 0;

// //     const rent =
// //       Number(
// //         edited.rent ??
// //           item.rent
// //       ) || 0;

// //     const mess =
// //       Number(
// //         edited.mess_exp ??
// //           item.mess_exp
// //       ) || 0;

// //     const hk =
// //       Number(
// //         edited.hk_exp ??
// //           item.hk_exp
// //       ) || 0;

// //     const security =
// //       Number(
// //         edited.security ??
// //           item.security
// //       ) || 0;

// //     const electricity =
// //       Number(
// //         edited.electricity ??
// //           item.electricity
// //       ) || 0;

// //     const depreciation =
// //       Number(
// //         edited.depreciation_for_25_26 ??
// //           item.depreciation_for_25_26
// //       ) || 0;

// //     const electricalConsumables =
// //       Number(
// //         edited.electrical_consumables_for_25_26 ??
// //           item.electrical_consumables_for_25_26
// //       ) || 0;

// //     const marketing =
// //       Number(
// //         edited.marketing_for_25_26 ??
// //           item.marketing_for_25_26
// //       ) || 0;

// //     const rAndMBldg =
// //       Number(
// //         edited.r_and_m_bldg_for_25_26 ??
// //           item.r_and_m_bldg_for_25_26
// //       ) || 0;

// //     const rAndMOthers =
// //       Number(
// //         edited.r_and_m_others_for_25_26 ??
// //           item.r_and_m_others_for_25_26
// //       ) || 0;

// //     const otherExp =
// //       Number(
// //         item.other_exp_for_25_26_except_transport_rates_taxes_and_amc
// //       ) || 0;

// //     const coExp =
// //       Number(item.co_exp_for_25_26_15_percent) || 0;

// //     const water =
// //       Number(item.water) || 0;

// //     // =========================
// //     // NET REVENUE
// //     // =========================
// //     const netRevenue =
// //       (Number(item.net_tuition_for_25_26) || 0) +
// //       (Number(item.application_fee_for_25_26) || 0) +
// //       (Number(item.admission_fee_for_25_26) || 0);

// //     // =========================
// //     // TOTAL EXPENDITURE
// //     // =========================
// //     const totalExpenditure =
// //       salaries +
// //       rent +
// //       mess +
// //       hk +
// //       security +
// //       water +
// //       electricity +
// //       depreciation +
// //       electricalConsumables +
// //       marketing +
// //       rAndMBldg +
// //       rAndMOthers +
// //       otherExp +
// //       coExp;

// //     // =========================
// //     // P&L
// //     // =========================
// //     const pnl = netRevenue - totalExpenditure;

// //     // =========================
// //     // P&L %
// //     // =========================
// //     const profitLossPercent =
// //       netRevenue > 0
// //         ? Math.round((pnl / netRevenue) * 100)
// //         : 0;

// //     const totalExpenditurePercent =
// //       netRevenue > 0
// //         ? Math.round((totalExpenditure / netRevenue) * 100)
// //         : 0;

// //     return {
// //       State: item.state,
// //       Zone: item.zone,
// //       Branch: item.branch,
// //       AGM: item.agm,
// //       RI: item.RI,

// //       "Net Revenue": Math.round(netRevenue),

// //       Salaries: Math.round(salaries),
// //       Rent: Math.round(rent),
// //       Mess: Math.round(mess),
// //       HK: Math.round(hk),
// //       Security: Math.round(security),
// //       Water: Math.round(water),
// //       Electricity: Math.round(electricity),
// //       Depreciation: Math.round(depreciation),
// //       "Electrical Consumables": Math.round(
// //         electricalConsumables
// //       ),
// //       Marketing: Math.round(marketing),
// //       "R&M Bldg": Math.round(rAndMBldg),
// //       "R&M Others": Math.round(rAndMOthers),

// //       "Total Expenditure": Math.round(
// //         totalExpenditure
// //       ),

// //       "Total Expenditure %":
// //         totalExpenditurePercent,

// //       "P&L": Math.round(pnl),

// //       "Profit/Loss %":
// //         profitLossPercent,
// //     };
// //   });

// //   const worksheet =
// //     XLSX.utils.json_to_sheet(formattedData);

// //   const range = XLSX.utils.decode_range(
// //     worksheet["!ref"]
// //   );

// //   for (let row = range.s.r + 1; row <= range.e.r; row++) {
// //     for (let col = 0; col <= range.e.c; col++) {
// //       const cellAddress =
// //         XLSX.utils.encode_cell({
// //           r: row,
// //           c: col,
// //         });

// //       const cell = worksheet[cellAddress];

// //       if (cell && typeof cell.v === "number") {
// //         cell.z = '#,##,##0;-#,##,##0;"-"';
// //       }
// //     }
// //   }

// //   // const range = XLSX.utils.decode_range(worksheet["!ref"]);

// // const headers = Object.keys(excelData[0]);

// // const pnlColIndex = headers.indexOf("P & L");
// // const percentColIndex = headers.indexOf("P & L %");

// // for (let R = 1; R <= range.e.r; ++R) {
// //   const pnlCellAddress = XLSX.utils.encode_cell({ r: R, c: pnlColIndex });
// //   const percentCellAddress = XLSX.utils.encode_cell({ r: R, c: percentColIndex });

// //   const style = {
// //     font: { color: { rgb: "FF0000" }, bold: true },
// //   };

// //   if (worksheet[pnlCellAddress]) {
// //     worksheet[pnlCellAddress].s = style;
// //   }

// //   if (worksheet[percentCellAddress]) {
// //     worksheet[percentCellAddress].s = style;
// //   }
// // }
// //   const workbook = XLSX.utils.book_new();

// //   XLSX.utils.book_append_sheet(
// //     workbook,
// //     worksheet,
// //     "Report"
// //   );

// //   const excelBuffer = XLSX.write(workbook, {
// //     bookType: "xlsx",
// //     type: "array",
// //   });

// //   const fileData = new Blob([excelBuffer], {
// //     type:
// //       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
// //   });

// //   saveAs(fileData, "Revenue_Report.xlsx");
// // };

// // export default downloadExcel;






// // import * as XLSX from "xlsx-js-style";
// // import { saveAs } from "file-saver";

// // const downloadExcel = (filteredData, editedRows = {}) => {
// //   if (!filteredData || filteredData.length === 0) {
// //     alert("No data available to download");
// //     return;
// //   }

// //   const getRowKey = (item) =>
// //     `${item.state}_${item.zone}_${item.branch}_${item.agm}_${item.RI}`;

// //   // =========================
// //   // PREPARE DATA
// //   // =========================
// //   const formattedData = filteredData.map((item) => {
// //     const rowKey = getRowKey(item);
// //     const edited = editedRows[rowKey] || {};

// //     const salaries = Number(edited.salaries_for_25_26 ?? item.salaries_for_25_26) || 0;
// //     const rent = Number(edited.rent ?? item.rent) || 0;
// //     const mess = Number(edited.mess_exp ?? item.mess_exp) || 0;
// //     const hk = Number(edited.hk_exp ?? item.hk_exp) || 0;
// //     const security = Number(edited.security ?? item.security) || 0;
// //     const electricity = Number(edited.electricity ?? item.electricity) || 0;
// //     const depreciation = Number(edited.depreciation_for_25_26 ?? item.depreciation_for_25_26) || 0;
// //     const electricalConsumables = Number(
// //       edited.electrical_consumables_for_25_26 ?? item.electrical_consumables_for_25_26
// //     ) || 0;
// //     const marketing = Number(edited.marketing_for_25_26 ?? item.marketing_for_25_26) || 0;
// //     const rAndMBldg = Number(edited.r_and_m_bldg_for_25_26 ?? item.r_and_m_bldg_for_25_26) || 0;
// //     const rAndMOthers = Number(
// //       edited.r_and_m_others_for_25_26 ?? item.r_and_m_others_for_25_26
// //     ) || 0;

// //     const otherExp =
// //       Number(item.other_exp_for_25_26_except_transport_rates_taxes_and_amc) || 0;

// //     const coExp = Number(item.co_exp_for_25_26_15_percent) || 0;
// //     const water = Number(item.water) || 0;

// //     const netRevenue =
// //       (Number(item.net_tuition_for_25_26) || 0) +
// //       (Number(item.application_fee_for_25_26) || 0) +
// //       (Number(item.admission_fee_for_25_26) || 0);

// //     const totalExpenditure =
// //       salaries +
// //       rent +
// //       mess +
// //       hk +
// //       security +
// //       water +
// //       electricity +
// //       depreciation +
// //       electricalConsumables +
// //       marketing +
// //       rAndMBldg +
// //       rAndMOthers +
// //       otherExp +
// //       coExp;

// //     const pnl = netRevenue - totalExpenditure;

// //     const profitLossPercent =
// //       netRevenue > 0 ? Math.round((pnl / netRevenue) * 100) : 0;

// //     const totalExpenditurePercent =
// //       netRevenue > 0 ? Math.round((totalExpenditure / netRevenue) * 100) : 0;

// //     return {
// //       State: item.state,
// //       Zone: item.zone,
// //       Branch: item.branch,
// //       AGM: item.agm,
// //       RI: item.RI,

// //       "Net Revenue": Math.round(netRevenue),

// //       Salaries: Math.round(salaries),
// //       Rent: Math.round(rent),
// //       Mess: Math.round(mess),
// //       HK: Math.round(hk),
// //       Security: Math.round(security),
// //       Water: Math.round(water),
// //       Electricity: Math.round(electricity),
// //       Depreciation: Math.round(depreciation),
// //       "Electrical Consumables": Math.round(electricalConsumables),
// //       Marketing: Math.round(marketing),
// //       "R&M Bldg": Math.round(rAndMBldg),
// //       "R&M Others": Math.round(rAndMOthers),

// //       "Total Expenditure": Math.round(totalExpenditure),
// //       "Total Expenditure %": totalExpenditurePercent,

// //       "P&L": Math.round(pnl),
// //       "Profit/Loss %": profitLossPercent,
// //     };
// //   });

// //   // =========================
// //   // CREATE SHEET
// //   // =========================
// //   const worksheet = XLSX.utils.json_to_sheet(formattedData);

// //   const range = XLSX.utils.decode_range(worksheet["!ref"]);

// //   // =========================
// //   // NUMBER FORMAT
// //   // =========================
// //   for (let R = range.s.r + 1; R <= range.e.r; R++) {
// //     for (let C = range.s.c; C <= range.e.c; C++) {
// //       const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
// //       const cell = worksheet[cellAddress];

// //       if (cell && typeof cell.v === "number") {
// //         cell.z = '#,##,##0;-#,##,##0;"-"';
// //       }
// //     }
// //   }



// //   // =========================
// //   // APPLY COLOR TO P&L COLUMNS
// //   // =========================
// //   const headers = Object.keys(formattedData[0]);

// //   const pnlColIndex = headers.indexOf("P&L");
// //   const percentColIndex = headers.indexOf("Profit/Loss %");

// //   if (pnlColIndex === -1 || percentColIndex === -1) {
// //     console.error("Column not found!");
// //   } else {
// //     for (let R = 1; R <= range.e.r; R++) {
// //       const pnlCellAddress = XLSX.utils.encode_cell({ r: R, c: pnlColIndex });
// //       const percentCellAddress = XLSX.utils.encode_cell({
// //         r: R,
// //         c: percentColIndex,
// //       });

// //       const percentValue = worksheet[percentCellAddress]?.v || 0;

// //       let style = { font: { color: { rgb: "000000" } } }; // black

// //       if (percentValue < 0) {
// //         style = { font: { color: { rgb: "FF0000" }, bold: true } }; // red
// //       } else if (percentValue > 0) {
// //         style = { font: { color: { rgb: "008000" }, bold: true } }; // green
// //       }

// //       if (worksheet[pnlCellAddress]) {
// //         worksheet[pnlCellAddress].s = style;
// //       }

// //       if (worksheet[percentCellAddress]) {
// //         worksheet[percentCellAddress].s = style;
// //       }
// //     }
// //   }

// //   // =========================
// //   // CREATE FILE
// //   // =========================
// //   const workbook = XLSX.utils.book_new();
// //   XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

// //   const excelBuffer = XLSX.write(workbook, {
// //     bookType: "xlsx",
// //     type: "array",
// //   });

// //   const fileData = new Blob([excelBuffer], {
// //     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
// //   });

// //   saveAs(fileData, "Revenue_Report.xlsx");
// // };

// // export default downloadExcel;





// // import * as XLSX from "xlsx-js-style";
// // import { saveAs } from "file-saver";

// // const downloadExcel = (filteredData, editedRows = {}) => {
// //   if (!filteredData || filteredData.length === 0) {
// //     alert("No data available to download");
// //     return;
// //   }

// //   const getRowKey = (item) =>
// //     `${item.state}_${item.zone}_${item.branch}_${item.agm}_${item.RI}`;

// //   // =========================
// //   // PREPARE DATA
// //   // =========================
// //   const formattedData = filteredData.map((item) => {
// //     const rowKey = getRowKey(item);
// //     const edited = editedRows[rowKey] || {};

// //     const salaries = Number(edited.salaries_for_25_26 ?? item.salaries_for_25_26) || 0;
// //     const rent = Number(edited.rent ?? item.rent) || 0;
// //     const mess = Number(edited.mess_exp ?? item.mess_exp) || 0;
// //     const hk = Number(edited.hk_exp ?? item.hk_exp) || 0;
// //     const security = Number(edited.security ?? item.security) || 0;
// //     const electricity = Number(edited.electricity ?? item.electricity) || 0;
// //     const depreciation = Number(edited.depreciation_for_25_26 ?? item.depreciation_for_25_26) || 0;
// //     const electricalConsumables = Number(
// //       edited.electrical_consumables_for_25_26 ?? item.electrical_consumables_for_25_26
// //     ) || 0;
// //     const marketing = Number(edited.marketing_for_25_26 ?? item.marketing_for_25_26) || 0;
// //     const rAndMBldg = Number(edited.r_and_m_bldg_for_25_26 ?? item.r_and_m_bldg_for_25_26) || 0;
// //     const rAndMOthers = Number(
// //       edited.r_and_m_others_for_25_26 ?? item.r_and_m_others_for_25_26
// //     ) || 0;

// //     // const otherExp =
// //     //   Number(item.other_exp_for_25_26_except_transport_rates_taxes_and_amc) || 0;

// //     const otherExp = Number(item.other_exp);


// //     const coExp = Number(item.co_exp_for_25_26_15_percent) || 0;

// //     const operatingExp =
// //       hk +
// //       security +
// //       electricity +
// //       depreciation +
// //       electricalConsumables +
// //       marketing +
// //       rAndMBldg +
// //       rAndMOthers;

// //     const water = Number(item.water) || 0;


// //     const netRevenue =
// //       (Number(item.net_tuition_for_25_26) || 0) +
// //       (Number(item.application_fee_for_25_26) || 0) +
// //       (Number(item.admission_fee_for_25_26) || 0);

// //     const totalExpenditure =
// //       salaries +
// //       rent +
// //       mess +
// //       hk +
// //       security +
// //       water +
// //       electricity +
// //       depreciation +
// //       electricalConsumables +
// //       marketing +
// //       rAndMBldg +
// //       rAndMOthers +
// //       operatingExp +
// //       otherExp +
// //       coExp;

// //     const pnl = netRevenue - totalExpenditure;

// //     const profitLossPercent =
// //       netRevenue > 0 ? Math.round((pnl / netRevenue) * 100) : 0;

// //     const totalExpenditurePercent =
// //       netRevenue > 0 ? Math.round((totalExpenditure / netRevenue) * 100) : 0;

// //     return {
// //       State: item.state,
// //       Zone: item.zone,
// //       Branch: item.branch,
// //       AGM: item.agm,
// //       RI: item.RI,

// //       "Net Revenue": Math.round(netRevenue),

// //       Salaries: Math.round(salaries),
// //       Rent: Math.round(rent),
// //       Mess: Math.round(mess),
// //       HK: Math.round(hk),
// //       Security: Math.round(security),
// //       Water: Math.round(water),
// //       Electricity: Math.round(electricity),
// //       Depreciation: Math.round(depreciation),
// //       "Electrical Consumables": Math.round(electricalConsumables),
// //       Marketing: Math.round(marketing),
// //       "R&M Bldg": Math.round(rAndMBldg),
// //       "R&M Others": Math.round(rAndMOthers),
// //       "Other Exp": Math.round(otherExp),
// //       "Operating Exp": Math.round(operatingExp),

// //       "OverHead Exp": Math.round(coExp),

// //       "Total Expenditure": Math.round(totalExpenditure),
// //       "Total Expenditure %": totalExpenditurePercent,

// //       "P&L": Math.round(pnl),
// //       "Profit/Loss %": profitLossPercent,
// //     };
// //   });

// //   // =========================
// //   // CREATE SHEET
// //   // =========================
// //   const worksheet = XLSX.utils.json_to_sheet(formattedData);

// //   const range = XLSX.utils.decode_range(worksheet["!ref"]);

// //   // =========================
// //   // BOLD HEADER ROW
// //   // =========================
// //   const headers = Object.keys(formattedData[0]);

// //   headers.forEach((header, C) => {
// //     const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C }); // r: 0 = header row
// //     if (worksheet[cellAddress]) {
// //       worksheet[cellAddress].s = {
// //         font: {
// //           bold: true,
// //           sz: 12,
// //           color: { rgb: "FFFFFF" },   // White text
// //         },
// //         fill: {
// //           patternType: "solid",
// //           fgColor: { rgb: "1F4E79" }, // Dark blue background
// //         },
// //         alignment: {
// //           horizontal: "center",
// //           vertical: "center",
// //         },
// //       };
// //     }
// //   });

// //   // =========================
// //   // NUMBER FORMAT
// //   // =========================
// //   for (let R = range.s.r + 1; R <= range.e.r; R++) {
// //     for (let C = range.s.c; C <= range.e.c; C++) {
// //       const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
// //       const cell = worksheet[cellAddress];

// //       if (cell && typeof cell.v === "number") {
// //         cell.z = '#,##,##0;-#,##,##0;"-"';
// //       }
// //     }
// //   }

// //   // =========================
// //   // APPLY COLOR TO P&L COLUMNS
// //   // =========================
// //   const pnlColIndex = headers.indexOf("P&L");
// //   const percentColIndex = headers.indexOf("Profit/Loss %");

// //   if (pnlColIndex === -1 || percentColIndex === -1) {
// //     console.error("Column not found!");
// //   } else {
// //     for (let R = 1; R <= range.e.r; R++) {
// //       const pnlCellAddress = XLSX.utils.encode_cell({ r: R, c: pnlColIndex });
// //       const percentCellAddress = XLSX.utils.encode_cell({
// //         r: R,
// //         c: percentColIndex,
// //       });

// //       const percentValue = worksheet[percentCellAddress]?.v || 0;

// //       let style = { font: { color: { rgb: "000000" } } }; // black

// //       if (percentValue < 0) {
// //         style = { font: { color: { rgb: "FF0000" }, bold: true } }; // red
// //       } else if (percentValue > 0) {
// //         style = { font: { color: { rgb: "008000" }, bold: true } }; // green
// //       }

// //       if (worksheet[pnlCellAddress]) {
// //         worksheet[pnlCellAddress].s = style;
// //       }

// //       if (worksheet[percentCellAddress]) {
// //         worksheet[percentCellAddress].s = style;
// //       }
// //     }
// //   }

// //   // =========================
// //   // CREATE FILE
// //   // =========================
// //   const workbook = XLSX.utils.book_new();
// //   XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

// //   const excelBuffer = XLSX.write(workbook, {
// //     bookType: "xlsx",
// //     type: "array",
// //   });

// //   const fileData = new Blob([excelBuffer], {
// //     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
// //   });

// //   saveAs(fileData, "Revenue_Report.xlsx");
// // };

// // export default downloadExcel;



// import * as XLSX from "xlsx-js-style";
// import { saveAs } from "file-saver";

// const downloadExcel = (filteredData, editedRows = {}) => {

//   if (!filteredData || filteredData.length === 0) {
//     alert("No data available to download");
//     return;
//   }

//   // =========================
//   // SAFE NUMBER FUNCTION
//   // =========================
//   const num = (value) => {
//     const n = Number(value);
//     return isNaN(n) ? 0 : n;
//   };

//   // =========================
//   // UNIQUE ROW KEY
//   // =========================
//   const getRowKey = (item) =>
//     `${item.state}_${item.zone}_${item.branch}_${item.agm}_${item.RI}`;

//   // =========================
//   // PREPARE DATA
//   // =========================
//   const formattedData = filteredData.map((item) => {

//     const rowKey = getRowKey(item);

//     const edited = editedRows[rowKey] || {};

//     // =========================
//     // EXPENSES
//     // =========================
//     const salaries = num(
//       edited.salaries_for_25_26 ?? item.salaries_for_25_26
//     );

//     const rent = num(
//       edited.rent ?? item.rent
//     );

//     const mess = num(
//       edited.mess_exp ?? item.mess_exp
//     );

//     const hk = num(
//       edited.hk_exp ?? item.hk_exp
//     );

//     const security = num(
//       edited.security ?? item.security
//     );

//     const water = num(
//       edited.water ?? item.water
//     );

//     const electricity = num(
//       edited.electricity ?? item.electricity
//     );

//     const depreciation = num(
//       edited.depreciation_for_25_26 ??
//       item.depreciation_for_25_26
//     );

//     const electricalConsumables = num(
//       edited.electrical_consumables_for_25_26 ??
//       item.electrical_consumables_for_25_26
//     );

//     const marketing = num(
//       edited.marketing_for_25_26 ??
//       item.marketing_for_25_26
//     );

//     const rAndMBldg = num(
//       edited.r_and_m_bldg_for_25_26 ??
//       item.r_and_m_bldg_for_25_26
//     );

//     const rAndMOthers = num(
//       edited.r_and_m_others_for_25_26 ??
//       item.r_and_m_others_for_25_26
//     );

//     // =========================
//     // OTHER EXP
//     // =========================
//     const otherExp = num(
//       item.other_exp_for_25_26_except_transport_rates_taxes_and_amc
//     );

//     // =========================
//     // OVERHEAD EXP
//     // =========================
//     const coExp = num(
//       item.co_exp_for_25_26_15_percent
//     );

//     // =========================
//     // OPERATING EXP
//     // =========================
//     const operatingExp =
//       hk +
//       security + 
//       mess+                                                             
//       electricity +
//       depreciation +
//       electricalConsumables +
//       marketing +
//       rAndMBldg +
//       rAndMOthers +
//       otherExp;

//       console.log(operatingExp);
//       console.log("House",hk);
//       console.log("Other",otherExp);
//       console.log("security",security);
//       console.log("depreciation",depreciation);
//       console.log("electricalConsumables",electricalConsumables);
//       console.log(" rAndMBldg", rAndMBldg);
//       console.log("rAndMOthers",rAndMOthers);

//     // =========================
//     // REVENUE
//     // =========================
//     const netRevenue =
//       num(item.net_tuition_for_25_26) +
//       num(item.application_fee_for_25_26) +
//       num(item.admission_fee_for_25_26);

//     // =========================
//     // TOTAL EXPENDITURE
//     // IMPORTANT:
//     // DO NOT ADD operatingExp AGAIN
//     // because it already contains
//     // hk + security + etc
//     // =========================
//     const totalExpenditure =
//       salaries +
//       rent +
//       mess +
//       water +
//       operatingExp +
//       otherExp +
//       coExp;

//     // =========================
//     // P&L
//     // =========================
//     const pnl = netRevenue - totalExpenditure;

//     // =========================
//     // PERCENTAGES
//     // =========================
//     const profitLossPercent =
//       netRevenue > 0
//         ? Math.round((pnl / netRevenue) * 100)
//         : 0;

//     const totalExpenditurePercent =
//       netRevenue > 0
//         ? Math.round((totalExpenditure / netRevenue) * 100)
//         : 0;

//     // =========================
//     // RETURN ROW
//     // =========================
//     return {

//       State: item.state || "-",
//       Zone: item.zone || "-",
//       Branch: item.branch || "-",
//       AGM: item.agm || "-",
//       RI: item.RI || "-",

//       "Net Revenue": Math.round(netRevenue),

//       Salaries: Math.round(salaries),

//       Rent: Math.round(rent),

//       Mess: Math.round(mess),

//       HK: Math.round(hk),

//       Security: Math.round(security),

//       Water: Math.round(water),

//       Electricity: Math.round(electricity),

//       Depreciation: Math.round(depreciation),

//       "Electrical Consumables":
//         Math.round(electricalConsumables),

//       Marketing: Math.round(marketing),

//       "R&M Bldg": Math.round(rAndMBldg),

//       "R&M Others": Math.round(rAndMOthers),

//       "Other Exp": Math.round(otherExp),

//       "Operating Exp": Math.round(operatingExp),

//       "OverHead Exp": Math.round(coExp),

//       "Total Expenditure":
//         Math.round(totalExpenditure),

//       "Total Expenditure %":
//         totalExpenditurePercent,

//       "P&L":
//         Math.round(pnl),

//       "Profit/Loss %":
//         profitLossPercent,
//     };
//   });

//   // =========================
//   // CREATE SHEET
//   // =========================
//   const worksheet =
//     XLSX.utils.json_to_sheet(formattedData);

//   // =========================
//   // RANGE
//   // =========================
//   const range =
//     XLSX.utils.decode_range(worksheet["!ref"]);

//   // =========================
//   // HEADERS
//   // =========================
//   const headers =
//     Object.keys(formattedData[0]);

//   // =========================
//   // HEADER STYLE
//   // =========================
//   headers.forEach((header, C) => {

//     const cellAddress =
//       XLSX.utils.encode_cell({
//         r: 0,
//         c: C
//       });

//     if (worksheet[cellAddress]) {

//       worksheet[cellAddress].s = {

//         font: {
//           bold: true,
//           sz: 12,
//           color: { rgb: "FFFFFF" },
//         },

//         fill: {
//           patternType: "solid",
//           fgColor: { rgb: "1F4E79" },
//         },

//         alignment: {
//           horizontal: "center",
//           vertical: "center",
//         },
//       };
//     }
//   });

//   // =========================
//   // NUMBER FORMAT
//   // =========================
//   for (let R = range.s.r + 1; R <= range.e.r; R++) {

//     for (let C = range.s.c; C <= range.e.c; C++) {

//       const cellAddress =
//         XLSX.utils.encode_cell({
//           r: R,
//           c: C
//         });

//       const cell =
//         worksheet[cellAddress];

//       if (cell && typeof cell.v === "number") {

//         cell.z =
//           '#,##,##0;-#,##,##0;"-"';
//       }
//     }
//   }

//   // =========================
//   // P&L COLORS
//   // =========================
//   const pnlColIndex =
//     headers.indexOf("P&L");

//   const percentColIndex =
//     headers.indexOf("Profit/Loss %");

//   for (let R = 1; R <= range.e.r; R++) {

//     const pnlCellAddress =
//       XLSX.utils.encode_cell({
//         r: R,
//         c: pnlColIndex
//       });

//     const percentCellAddress =
//       XLSX.utils.encode_cell({
//         r: R,
//         c: percentColIndex
//       });

//     const percentValue =
//       worksheet[percentCellAddress]?.v || 0;

//     let style = {
//       font: {
//         color: { rgb: "000000" }
//       }
//     };

//     if (percentValue < 0) {

//       style = {
//         font: {
//           color: { rgb: "FF0000" },
//           bold: true
//         }
//       };

//     } else if (percentValue > 0) {

//       style = {
//         font: {
//           color: { rgb: "008000" },
//           bold: true
//         }
//       };
//     }

//     if (worksheet[pnlCellAddress]) {
//       worksheet[pnlCellAddress].s = style;
//     }

//     if (worksheet[percentCellAddress]) {
//       worksheet[percentCellAddress].s = style;
//     }
//   }

//   // =========================
//   // AUTO COLUMN WIDTH
//   // =========================
//   worksheet["!cols"] = headers.map((header) => ({
//     wch: Math.max(header.length + 5, 18),
//   }));

//   // =========================
//   // CREATE WORKBOOK
//   // =========================
//   const workbook =
//     XLSX.utils.book_new();

//   XLSX.utils.book_append_sheet(
//     workbook,
//     worksheet,
//     "Report"
//   );

//   // =========================
//   // WRITE FILE
//   // =========================
//   const excelBuffer =
//     XLSX.write(workbook, {
//       bookType: "xlsx",
//       type: "array",
//     });

//   const fileData = new Blob(
//     [excelBuffer],
//     {
//       type:
//         "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//     }
//   );

//   saveAs(fileData, "Revenue_Report.xlsx");
// };

// export default downloadExcel;

import * as XLSX from "xlsx-js-style";
import { saveAs } from "file-saver";

// ========================================
// EXCEL DOWNLOAD UTILITY FUNCTION
// ========================================
const downloadExcel = (filteredData, editedRows = {}) => {

  // ========================================
  // PREVENT EMPTY EXPORT
  // ========================================
  if (!filteredData || filteredData.length === 0) {
    alert("No data available to download");
    return;
  }

  // ========================================
  // UNIQUE ROW KEY
  // ========================================
  const getRowKey = (item) =>
    `${item.state}_${item.zone}_${item.branch}_${item.agm}_${item.RI}`;

  // ========================================
  // FORMAT DATA FOR EXCEL
  // ========================================
  const formattedData = filteredData.map((item) => {

    const rowKey = getRowKey(item);

    const edited = editedRows[rowKey] || {};

    // ========================================
    // EDITABLE VALUES
    // ========================================
    const salaries =
      Number(
        edited.salaries_for_25_26 ??
        item.salaries_for_25_26
      ) || 0;

    const rent =
      Number(
        edited.rent ??
        item.rent
      ) || 0;

    const mess =
      Number(
        edited.mess_exp ??
        item.mess_exp
      ) || 0;

    const hk =
      Number(
        edited.hk_exp ??
        item.hk_exp
      ) || 0;

    const security =
      Number(
        edited.security ??
        item.security
      ) || 0;

    const water =
      Number(
        edited.water ??
        item.water
      ) || 0;

    const electricity =
      Number(
        edited.electricity ??
        item.electricity
      ) || 0;

    const depreciation =
      Number(
        edited.depreciation_for_25_26 ??
        item.depreciation_for_25_26
      ) || 0;

    const electricalConsumables =
      Number(
        edited.electrical_consumables_for_25_26 ??
        item.electrical_consumables_for_25_26
      ) || 0;

    const marketing =
      Number(
        edited.marketing_for_25_26 ??
        item.marketing_for_25_26
      ) || 0;

    const rAndMBldg =
      Number(
        edited.r_and_m_bldg_for_25_26 ??
        item.r_and_m_bldg_for_25_26
      ) || 0;

    const rAndMOthers =
      Number(
        edited.r_and_m_others_for_25_26 ??
        item.r_and_m_others_for_25_26
      ) || 0;

    // ========================================
    // OTHER EXP
    // ========================================
    const otherExp =
      Number(
        item.other_exp_for_25_26_except_transport_rates_taxes_and_amc
      ) || 0;

    // ========================================
    // OVERHEAD EXP
    // ========================================
    const coExp =
      Number(
        item.co_exp_for_25_26_15_percent
      ) || 0;

    // ========================================
    // OPERATING EXP
    // ========================================
    // SAME LOGIC AS TABLE
    // ========================================
    // ========================================
    // OPERATING EXP
    // ========================================
     const operatingExp =
      hk +
      security + 
      mess+                                                             
      electricity +
      depreciation +
      electricalConsumables +
      marketing +
      rAndMBldg +
      rAndMOthers +
      otherExp;

    // ========================================
    // NET REVENUE
    // ========================================
    const netRevenue =
      (Number(item.net_tuition_for_25_26) || 0) +
      (Number(item.application_fee_for_25_26) || 0) +
      (Number(item.admission_fee_for_25_26) || 0);

    // ========================================
    // TOTAL EXPENDITURE
    // ========================================
    // IMPORTANT:
    // DO NOT ADD HK/SECURITY/ELECTRICITY AGAIN
    // because operatingExp already contains them
    // ========================================
    const totalExpenditure =
      salaries +
      rent +
      mess +
      water +
      operatingExp +
      otherExp +
      coExp;

    // ========================================
    // P&L
    // ========================================
    const pnl =
      netRevenue - totalExpenditure;

    // ========================================
    // TOTAL EXP %
    // ========================================
    const totalExpenditurePercent =
      netRevenue > 0
        ? Math.round(
          (totalExpenditure / netRevenue) * 100
        )
        : 0;

    // ========================================
    // P&L %
    // ========================================
    const profitLossPercent =
      netRevenue > 0
        ? Math.round(
          (pnl / netRevenue) * 100
        )
        : 0;

    // ========================================
    // RETURN EXCEL ROW
    // ========================================
    return {

      State: item.state,
      Zone: item.zone,
      Branch: item.branch,
      AGM: item.agm,
      RI: item.RI,

      "State/CBSE":
        item.syllabus || "-",

      "Campus Type":
        item.ds_res || "-",

      "Year Of Establishment":
        item.year_establishment,

      "No Of Years":
        item.no_of_years,

      "Fusion Building Code":
        item.fusion_building_code,

      DS:
        Number(item.ds) || 0,

      RES:
        Number(item.res) || 0,

      "Total Strength":
        Number(item.total_strength) || 0,

      "Avg Fee":
        Math.round(
          Number(item.avg_fee_for_25_26) || 0
        ),

      "Net Tuition":
        Math.round(
          Number(item.net_tuition_for_25_26) || 0
        ),

      "Application Fee":
        Math.round(
          Number(item.application_fee_for_25_26) || 0
        ),

      "Admission Fee":
        Math.round(
          Number(item.admission_fee_for_25_26) || 0
        ),

      "Net Revenue":
        Math.round(netRevenue),

      "Avg Emp Count":
        Math.round(
          Number(item.avg_emp_count) || 0
        ),

      Salaries:
        Math.round(salaries),

      "Salaries %":
        Math.round(
          Number(item.salaries_percent_for_25_26) || 0
        ),

      "Total Rent SFT":
        Math.round(
          Number(item.total_rent_sft) || 0
        ),

      Rent:
        Math.round(rent),

      "Rent %":
        Math.round(
          Number(item.rentper) || 0
        ),

      Mess:
        Math.round(mess),

      HK:
        Math.round(hk),

      Security:
        Math.round(security),

      Water:
        Math.round(water),

      Electricity:
        Math.round(electricity),

      Depreciation:
        Math.round(depreciation),

      "Electrical Consumables":
        Math.round(electricalConsumables),

      Marketing:
        Math.round(marketing),

      "R&M Bldg":
        Math.round(rAndMBldg),

      "R&M Others":
        Math.round(rAndMOthers),

      "Other Exp":
        Math.round(otherExp),

      "Operating Exp":
        Math.round(operatingExp),

      "OverHead Exp":
        Math.round(coExp),

      "Total Expenditure":
        Math.round(totalExpenditure),

      "Total Expenditure %":
        totalExpenditurePercent,

      "P&L":
        Math.round(pnl),

      "Profit/Loss %":
        profitLossPercent,
    };
  });

  // ========================================
  // CREATE WORKSHEET
  // ========================================
  const worksheet =
    XLSX.utils.json_to_sheet(formattedData);

  // ========================================
  // GET RANGE
  // ========================================
  const range =
    XLSX.utils.decode_range(worksheet["!ref"]);

  // ========================================
  // HEADERS
  // ========================================
  const headers =
    Object.keys(formattedData[0]);

  // ========================================
  // HEADER STYLING
  // ========================================
  headers.forEach((header, C) => {

    const cellAddress =
      XLSX.utils.encode_cell({
        r: 0,
        c: C,
      });

    if (worksheet[cellAddress]) {

      worksheet[cellAddress].s = {

        font: {
          bold: true,
          sz: 12,
          color: { rgb: "FFFFFF" },
        },

        fill: {
          patternType: "solid",
          fgColor: { rgb: "1F4E79" },
        },

        alignment: {
          horizontal: "center",
          vertical: "center",
        },
      };
    }
  });

  // ========================================
  // NUMBER FORMAT
  // ========================================
  for (
    let R = range.s.r + 1;
    R <= range.e.r;
    R++
  ) {

    for (
      let C = range.s.c;
      C <= range.e.c;
      C++
    ) {

      const cellAddress =
        XLSX.utils.encode_cell({
          r: R,
          c: C,
        });

      const cell =
        worksheet[cellAddress];

      if (
        cell &&
        typeof cell.v === "number"
      ) {

        cell.z =
          '#,##,##0;-#,##,##0;"-"';
      }
    }
  }

  // ========================================
  // P&L COLOR STYLING
  // ========================================
  const pnlColIndex =
    headers.indexOf("P&L");

  const percentColIndex =
    headers.indexOf("Profit/Loss %");

  if (
    pnlColIndex !== -1 &&
    percentColIndex !== -1
  ) {

    for (
      let R = 1;
      R <= range.e.r;
      R++
    ) {

      const pnlCellAddress =
        XLSX.utils.encode_cell({
          r: R,
          c: pnlColIndex,
        });

      const percentCellAddress =
        XLSX.utils.encode_cell({
          r: R,
          c: percentColIndex,
        });

      const percentValue =
        worksheet[percentCellAddress]?.v || 0;

      let style = {
        font: {
          color: { rgb: "000000" },
        },
      };

      // LOSS
      if (percentValue < 0) {

        style = {
          font: {
            color: { rgb: "FF0000" },
            bold: true,
          },
        };
      }

      // PROFIT
      else if (percentValue > 0) {

        style = {
          font: {
            color: { rgb: "008000" },
            bold: true,
          },
        };
      }

      if (worksheet[pnlCellAddress]) {
        worksheet[pnlCellAddress].s = style;
      }

      if (worksheet[percentCellAddress]) {
        worksheet[percentCellAddress].s = style;
      }
    }
  }

  // ========================================
  // AUTO COLUMN WIDTH
  // ========================================
  worksheet["!cols"] = headers.map(() => ({
    wch: 18,
  }));

  // ========================================
  // CREATE WORKBOOK
  // ========================================
  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Report"
  );

  // ========================================
  // WRITE EXCEL
  // ========================================
  const excelBuffer =
    XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

  // ========================================
  // CREATE FILE
  // ========================================
  const fileData =
    new Blob(
      [excelBuffer],
      {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }
    );

  // ========================================
  // DOWNLOAD
  // ========================================
  saveAs(
    fileData,
    "Revenue_Report.xlsx"
  );
};

export default downloadExcel;