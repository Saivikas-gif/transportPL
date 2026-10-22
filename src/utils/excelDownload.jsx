// //  import * as XLSX from "xlsx";
// //  import { saveAs } from "file-saver";

// //  const downloadExcel = (filteredData,editedRows) => {
// //   if (!filteredData || filteredData.length === 0) {
// //      alert("No data available to download");
// //      return;
// //    }

// //     const currentYear = new Date().getFullYear();
// //     const excelData = filteredData.map((item) => {
      
// //    const getRowKey = (item) => {
// //   return `${item.state_name}_${item.zone_name}_${item.BSBranchName}_${item.agm}_${item.ri_name}`;
// // };
  
// //       const net25 = Math.round(Number(item.total_amount) || 0);
// //       const students = Number(item.student_count) || 0;
// //       const year = Number(item.established_year) || 0;

// //       const noOfYears = year && year <= currentYear ? currentYear - year : 0;

// //       // const expenditure = Math.round(Number(item.expenditure) || 0);

// //       const rowKey = getRowKey(item);

// // const amc =
// //   Number(editedRows[rowKey]?.amc ?? item.amc) || 0;

// // const depreciation =
// //   Number(editedRows[rowKey]?.depreciation ?? item.depreciation) || 0;

// // const drivers =
// //   Number(editedRows[rowKey]?.drivers_charges ?? item.drivers_charges) || 0;

// // const fuel =
// //   Number(editedRows[rowKey]?.fuel ?? item.fuel) || 0;

// // const hire =
// //   Number(editedRows[rowKey]?.hire_charges ?? item.hire_charges) || 0;

// // const insurance =
// //   Number(editedRows[rowKey]?.insurance ?? item.insurance) || 0;

// // const rm =
// //   Number(editedRows[rowKey]?.r_and_m ?? item.r_and_m) || 0;

// // const taxes =
// //   Number(editedRows[rowKey]?.rates_and_taxes ?? item.rates_and_taxes) || 0;

// // const salaries =
// //   Number(editedRows[rowKey]?.salaries ?? item.salaries) || 0;

// // const finance =
// //   Number(editedRows[rowKey]?.finance_charges ?? item.finance_charges) || 0;

// // const substaff =
// //   Number(
// //     editedRows[rowKey]?.substaff_salaries ??
// //     item.substaff_salaries
// //   ) || 0;

// // const expenditure =
// //   amc +
// //   depreciation +
// //   drivers +
// //   fuel +
// //   hire +
// //   insurance +
// //   rm +
// //   taxes +
// //   salaries +
// //   finance +
// //   substaff;

// //       const pnl = net25 - expenditure;

// //       let percent = 0;
// //       if (net25 > 0) {
// //         percent = (pnl * 100) / net25;
// //       }

// //       const finalPercent = Math.round(percent);

// //       return {
// //         State: item.state_name,
// //         Zone: item.zone_name,
// //         Branch: item.BSBranchName,
// //         AGM: item.agm,
// //         "RI Name": item.ri_name || "-",
// //         "State/CBSE": item.syllabus || "-",
// //         "Campus Type": item.ds_res || "-",
// //         "Year Of Establishment": item.established_year,
// //         "No of Years": noOfYears,

// //         "Fusion Code": Number(item?.fusion_building_code) || 0,

// //         Students: Math.round(students),

// //         "Revenue 25-26": net25,

// //         // AMC: Math.round(Number(item?.amc) || 0),
// //         AMC: Math.round(amc),

// //         // Depreciation: Math.round(Number(item?.depreciation) || 0),
// //         Depreciation: Math.round(depreciation),

// //         // "Drivers Batha": Math.round(Number(item?.drivers_charges) || 0),
// //         "Drivers Batha": Math.round(drivers),

// //         // Fuel: Math.round(Number(item?.fuel) || 0),
// //         Fuel: Math.round(fuel),

// //         // "Hire Charges": Math.round(Number(item?.hire_charges) || 0),

// //         "Hire Charges": Math.round(hire),

// //         // Insurance: Math.round(Number(item?.insurance) || 0),

// //         Insurance: Math.round(insurance),

// //         // "R & M": Math.round(Number(item?.r_and_m) || 0),
// //         "R & M": Math.round(rm),

// //         // "Rates & Taxes": Math.round(Number(item?.rates_and_taxes) || 0),
// //         "Rates & Taxes": Math.round(taxes),

// //         // Salaries: Math.round(Number(item?.salaries) || 0),
// //         Salaries: Math.round(salaries),

// //         // finance_charges: Math.round(Number(item?.finance_charges) || 0),
// //         finance_charges: Math.round(finance),

// //         // "SubStaff Salaries": Math.round(Number(item?.substaff_salaries) || 0),
// //         "SubStaff Salaries": Math.round(substaff),

// //         Expenditure: Math.round(expenditure),

// //         "P & L": Math.round(pnl),

// //         "P & L % Profit/Loss": finalPercent,
// //       };
// //     });

// //     // Convert JSON → Sheet
// //     // Convert JSON → Sheet
// //     const worksheet = XLSX.utils.json_to_sheet(excelData);

// //     // ✅ Get headers and find year column index
// //     const headers = Object.keys(excelData[0]);
// //     const yearColIndex = headers.indexOf("Year of Establishment");

// //     // ✅ Apply Indian comma formatting
// //     const range = XLSX.utils.decode_range(worksheet["!ref"]);
// //     for (let row = range.s.r + 1; row <= range.e.r; row++) {
// //       for (let col = 0; col <= range.e.c; col++) {
// //         const cellAddress = XLSX.utils.encode_cell({
// //           r: row,
// //           c: col,
// //         });

// //         const cell = worksheet[cellAddress];

// //         if (cell && typeof cell.v === "number") {
// //           cell.z = '#,##,##0;-#,##,##0;"-"';
// //         }
// //       }
// //     }


// //     // Create workbook
// //     const workbook = XLSX.utils.book_new();
// //     XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

// //     // Convert to file
// //     const excelBuffer = XLSX.write(workbook, {
// //       bookType: "xlsx",
// //       type: "array",
// //     });

// //     const blob = new Blob([excelBuffer], {
// //       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
// //     });

// //     saveAs(blob, "transport_report.xlsx");
// //   };
// //    export default downloadExcel;


// // import * as XLSX from "xlsx";
// // import { saveAs } from "file-saver";

// // const downloadExcel = (filteredData, editedRows = {}) => {
// //   // console.log(filteredData);
// //   // console.log(editedRows);
// //   if (!filteredData || filteredData.length === 0) {
// //     alert("No data available to download");
// //     return;
// //   }

// //   const currentYear = new Date().getFullYear();

// //   // Common row key generator
// //   const getRowKey = (item) => {
// //     return `${item.state_name}_${item.zone_name}_${item.BSBranchName}_${item.agm}_${item.ri_name}`;
// //   };

// //   const excelData = filteredData.map((item) => {
// //       const rowKey = `${item.state_name}_${item.zone_name}_${item.BSBranchName}_${item.agm}_${item.ri_name}`;

// //     const net25 = Math.round(Number(item.total_amount) || 0);
// //     const students = Number(item.student_count) || 0;
// //     const year = Number(item.established_year) || 0;

// //     const noOfYears =
// //       year && year <= currentYear ? currentYear - year : 0;

// //     // Updated values from editedRows OR fallback to original item values
// //     const amc =
// //       Number(editedRows[rowKey]?.amc ?? item.amc) || 0;

// //     const depreciation =
// //       Number(
// //         editedRows[rowKey]?.depreciation ??
// //           item.depreciation
// //       ) || 0;

// //     const drivers =
// //       Number(
// //         editedRows[rowKey]?.drivers_charges ??
// //           item.drivers_charges
// //       ) || 0;

// //     const fuel =
// //       Number(editedRows[rowKey]?.fuel ?? item.fuel) || 0;

// //     const hire =
// //       Number(
// //         editedRows[rowKey]?.hire_charges ??
// //           item.hire_charges
// //       ) || 0;

// //     const insurance =
// //       Number(
// //         editedRows[rowKey]?.insurance ??
// //           item.insurance
// //       ) || 0;

// //     const rm =
// //       Number(
// //         editedRows[rowKey]?.r_and_m ??
// //           item.r_and_m
// //       ) || 0;

// //     const taxes =
// //       Number(
// //         editedRows[rowKey]?.rates_and_taxes ??
// //           item.rates_and_taxes
// //       ) || 0;

// //     const salaries =
// //       Number(
// //         editedRows[rowKey]?.salaries ??
// //           item.salaries
// //       ) || 0;

// //     const finance =
// //       Number(
// //         editedRows[rowKey]?.finance_charges ??
// //           item.finance_charges
// //       ) || 0;

// //     const substaff =
// //       Number(
// //         editedRows[rowKey]?.substaff_salaries ??
// //           item.substaff_salaries
// //       ) || 0;

     
      
// //     const expenditure =
// //       amc +
// //       depreciation +
// //       drivers +
// //       fuel +
// //       hire +
// //       insurance +
// //       rm +
// //       taxes +
// //       salaries +
// //       finance +
// //       substaff;

// //     const pnl = net25 - expenditure;

// //     let percent = 0;
// //     if (net25 > 0) {
// //       percent = (pnl * 100) / net25;
// //     }

// //     const finalPercent = Math.round(percent);

// //     return {
// //       State: item.state_name,
// //       Zone: item.zone_name,
// //       Branch: item.BSBranchName,
// //       AGM: item.agm,
// //       "RI Name": item.ri_name || "-",
// //       "State/CBSE": item.syllabus || "-",
// //       "Campus Type": item.ds_res || "-",
// //       "Year Of Establishment": year,
// //       "No of Years": noOfYears,
// //       "Fusion Code":
// //         Number(item?.fusion_building_code) || 0,
// //       Students: Math.round(students),
// //       "Revenue 25-26": net25,
// //       AMC: Math.round(amc),
// //       Depreciation: Math.round(depreciation),
// //       "Drivers Batha": Math.round(drivers),
// //       Fuel: Math.round(fuel),
// //       "Hire Charges": Math.round(hire),
// //       Insurance: Math.round(insurance),
// //       "R & M": Math.round(rm),
// //       "Rates & Taxes": Math.round(taxes),
// //       Salaries: Math.round(salaries),
// //       Finance_Charges: Math.round(finance),
// //       "SubStaff Salaries": Math.round(substaff),
// //       Expenditure: Math.round(expenditure),
// //       "P & L": Math.round(pnl),
// //       "P & L % Profit/Loss": finalPercent,
// //     };
// //   });

// //   const worksheet =
// //     XLSX.utils.json_to_sheet(excelData);

// //   // Indian number formatting
// //   const range = XLSX.utils.decode_range(
// //     worksheet["!ref"]
// //   );

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

// //   const blob = new Blob([excelBuffer], {
// //     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
// //   });

// //   saveAs(blob, "transport_report.xlsx");
// // };

// // export default downloadExcel;



// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";

// const downloadExcel = (filteredData, editedRows = {}) => {
//   if (!filteredData || filteredData.length === 0) {
//     alert("No data available to download");
//     return;
//   }

//   const currentYear = new Date().getFullYear();

//   const getRowKey = (item) => {
//     return `${item.state_name}_${item.zone_name}_${item.BSBranchName}_${item.agm}_${item.ri_name}`;
//   };

//   const excelData = filteredData.map((item) => {
//     const rowKey = getRowKey(item);

//     const net25 = Math.round(Number(item.total_amount) || 0);
//     const students = Number(item.student_count) || 0;
//     const year = Number(item.established_year) || 0;

//     const noOfYears =
//       year && year <= currentYear
//         ? currentYear - year
//         : 0;

//     const amc =
//       Number(editedRows[rowKey]?.amc ?? item.amc) || 0;

//     const depreciation =
//       Number(
//         editedRows[rowKey]?.depreciation ??
//           item.depreciation
//       ) || 0;

//     const drivers =
//       Number(
//         editedRows[rowKey]?.drivers_charges ??
//           item.drivers_charges
//       ) || 0;

//     const fuel =
//       Number(editedRows[rowKey]?.fuel ?? item.fuel) || 0;

//     const hire =
//       Number(
//         editedRows[rowKey]?.hire_charges ??
//           item.hire_charges
//       ) || 0;

//     const insurance =
//       Number(
//         editedRows[rowKey]?.insurance ??
//           item.insurance
//       ) || 0;

//     const rm =
//       Number(
//         editedRows[rowKey]?.r_and_m ??
//           item.r_and_m
//       ) || 0;

//     const taxes =
//       Number(
//         editedRows[rowKey]?.rates_and_taxes ??
//           item.rates_and_taxes
//       ) || 0;

//     const salaries =
//       Number(
//         editedRows[rowKey]?.salaries ??
//           item.salaries
//       ) || 0;

//     const finance =
//       Number(
//         editedRows[rowKey]?.finance_charges ??
//           item.finance_charges
//       ) || 0;

//     const substaff =
//       Number(
//         editedRows[rowKey]?.substaff_salaries ??
//           item.substaff_salaries
//       ) || 0;

//     const expenditure =
//       amc +
//       depreciation +
//       drivers +
//       fuel +
//       hire +
//       insurance +
//       rm +
//       taxes +
//       salaries +
//       finance +
//       substaff;

//     const pnl = net25 - expenditure;

//     const percent =
//       net25 > 0
//         ? Math.round((pnl * 100) / net25)
//         : 0;

//     return {
//       State: item.state_name,
//       Zone: item.zone_name,
//       Branch: item.BSBranchName,
//       AGM: item.agm,
//       "RI Name": item.ri_name || "-",
//       "State/CBSE": item.syllabus || "-",
//       "Campus Type": item.ds_res || "-",
//       "Year Of Establishment": year,
//       "No of Years": noOfYears,
//       "Fusion Code":
//         Number(item.fusion_building_code) || 0,
//       Students: Math.round(students),
//       "Revenue 25-26": net25,
//       AMC: Math.round(amc),
//       Depreciation: Math.round(depreciation),
//       "Drivers Batha": Math.round(drivers),
//       Fuel: Math.round(fuel),
//       "Hire Charges": Math.round(hire),
//       Insurance: Math.round(insurance),
//       "R & M": Math.round(rm),
//       "Rates & Taxes": Math.round(taxes),
//       Salaries: Math.round(salaries),
//       Finance_Charges: Math.round(finance),
//       "SubStaff Salaries": Math.round(substaff),
//       Expenditure: Math.round(expenditure),
//       "P & L": Math.round(pnl),
//       "P & L % Profit/Loss": percent,
//     };
//   });

//   const worksheet =
//     XLSX.utils.json_to_sheet(excelData);

//   const range = XLSX.utils.decode_range(
//     worksheet["!ref"]
//   );

//   for (let row = range.s.r + 1; row <= range.e.r; row++) {
//     for (let col = 0; col <= range.e.c; col++) {
//       const cellAddress = XLSX.utils.encode_cell({
//         r: row,
//         c: col,
//       });

//       const cell = worksheet[cellAddress];

//       if (cell && typeof cell.v === "number") {
//         cell.z = '#,##,##0;-#,##,##0;"-"';
//       }
//     }
//   }

//   const workbook = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(
//     workbook,
//     worksheet,
//     "Report"
//   );

//   const excelBuffer = XLSX.write(workbook, {
//     bookType: "xlsx",
//     type: "array",
//   });

//   const blob = new Blob([excelBuffer], {
//     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//   });

//   saveAs(blob, "transport_report.xlsx");
// };

// export default downloadExcel;

// import * as XLSX from "xlsx-js-style";
// import { saveAs } from "file-saver";


// // ========================================
// // EXCEL DOWNLOAD UTILITY FUNCTION
// // ========================================
// const downloadExcel = (filteredData, editedRows = {}) => {
//   // Prevent empty file download
//   if (!filteredData || filteredData.length === 0) {
//     alert("No data available to download");
//     return;
//   }

//   const currentYear = new Date().getFullYear();

//   const getRowKey = (item) => {
//     return `${item.state_name}_${item.zone_name}_${item.BSBranchName}_${item.agm}_${item.ri_name}`;
//   };

//   const excelData = filteredData.map((item) => {
//     const rowKey = getRowKey(item);

//     // ======================
//     // UPDATED VALUES
//     // ======================
//     const amc = Number(editedRows[rowKey]?.amc ?? item.amc) || 0;
//     const depreciation =
//       Number(editedRows[rowKey]?.depreciation ?? item.depreciation) || 0;
//     const drivers =
//       Number(
//         editedRows[rowKey]?.drivers_charges ??
//           item.drivers_charges
//       ) || 0;
//     const fuel =
//       Number(editedRows[rowKey]?.fuel ?? item.fuel) || 0;
//     const hire =
//       Number(
//         editedRows[rowKey]?.hire_charges ??
//           item.hire_charges
//       ) || 0;
//     const insurance =
//       Number(
//         editedRows[rowKey]?.insurance ??
//           item.insurance
//       ) || 0;
//     const rm =
//       Number(
//         editedRows[rowKey]?.r_and_m ??
//           item.r_and_m
//       ) || 0;
//     const taxes =
//       Number(
//         editedRows[rowKey]?.rates_and_taxes ??
//           item.rates_and_taxes
//       ) || 0;
//     const salaries =
//       Number(
//         editedRows[rowKey]?.salaries ??
//           item.salaries
//       ) || 0;
//     const finance =
//       Number(
//         editedRows[rowKey]?.finance_charges ??
//           item.finance_charges
//       ) || 0;
//     const substaff =
//       Number(
//         editedRows[rowKey]?.substaff_salaries ??
//           item.substaff_salaries
//       ) || 0;

//     // ======================
//     // CALCULATIONS
//     // ======================
//     const revenue = Number(item.total_amount) || 0;

//     const expenditure =
//       amc +
//       depreciation +
//       drivers +
//       fuel +
//       hire +
//       insurance +
//       rm +
//       taxes +
//       salaries +
//       finance +
//       substaff;

//     const pnl = revenue - expenditure;

//     const percent =
//       revenue > 0
//         ? Math.round((pnl * 100) / revenue)
//         : 0;

//     const year =
//       Number(item.established_year) || 0;

//     const noOfYears =
//       year && year <= currentYear
//         ? currentYear - year
//         : 0;

//     // ======================
//     // COLUMN FORMAT
//     // ======================
//     return {
//       State: item.state_name,
//       Zone: item.zone_name,
//       Branch: item.BSBranchName,
//       AGM: item.agm,
//       "RI Name": item.ri_name || "-",
//       "State / CBSE": item.syllabus || "-",
//       "Campus Type": item.ds_res || "-",
//       "Year Of Establishment": year,
//       "No Of Years": noOfYears,
//       "Fusion Code":
//         Number(item.fusion_building_code) || "-",
//       Students:
//         Number(item.student_count) || "-",
//       "Revenue 25-26": revenue  || "-",

//       AMC: amc  || "-",
//       Depreciation: depreciation  || "-",
//       "Drivers Batha": drivers  || "-",
//       Fuel: fuel  || "-",
//       "Hire Charges": hire  || "-",
//       Insurance: insurance  || "-",
//       "R & M": rm  || "-",
//       "Rates & Taxes": taxes  || "-",
//       Salaries: salaries || "-",
//       "Finance Charges": finance  || "-",
//       "SubStaff Salaries": substaff  || "-",

//       Expenditure: expenditure,
//       "P & L": pnl,
//       "P & L %": percent,
//     };
//   });


  
//   // ======================
//   // CREATE EXCEL SHEET
//   // ======================
//   const worksheet =
//     XLSX.utils.json_to_sheet(excelData);

//   // Auto column width
//   worksheet["!cols"] = [
//     { wch: 15 }, // State
//     { wch: 15 }, // Zone
//     { wch: 20 }, // Branch
//     { wch: 15 }, // AGM
//     { wch: 20 }, // RI Name
//     { wch: 15 },
//     { wch: 15 },
//     { wch: 12 },
//     { wch: 12 },
//     { wch: 15 },
//     { wch: 12 },
//     { wch: 15 },

//     { wch: 12 },
//     { wch: 15 },
//     { wch: 15 },
//     { wch: 12 },
//     { wch: 15 },
//     { wch: 15 },
//     { wch: 12 },
//     { wch: 15 },
//     { wch: 15 },
//     { wch: 15 },
//     { wch: 18 },

//     { wch: 15 },
//     { wch: 15 },
//     { wch: 10 },
//   ];

//   const range = XLSX.utils.decode_range(worksheet["!ref"]);

// const headers = Object.keys(excelData[0]);

// const pnlColIndex = headers.indexOf("P & L");
// const percentColIndex = headers.indexOf("P & L %");

// for (let R = 1; R <= range.e.r; ++R) {
//   const pnlCellAddress = XLSX.utils.encode_cell({ r: R, c: pnlColIndex });
//   const percentCellAddress = XLSX.utils.encode_cell({ r: R, c: percentColIndex });

//   if (worksheet[pnlCellAddress]) {
//     worksheet[pnlCellAddress].s = {
//       font: { color: { rgb: "FF0000" }, bold: true },
//     };

//     // ✅ ADD THIS LINE (for commas + rounding)
//     worksheet[pnlCellAddress].z = '#,##,##0';   // Indian format
//   }

//   if (worksheet[percentCellAddress]) {
//     worksheet[percentCellAddress].s = {
//       font: { color: { rgb: "FF0000" }, bold: true },
//     };

//     // ✅ ADD THIS LINE
//     worksheet[percentCellAddress].z = '0';  // percentage (no decimal)
//   }
// }

//   const workbook = XLSX.utils.book_new();

//   XLSX.utils.book_append_sheet(
//     workbook,
//     worksheet,
//     "Transport Report"
//   );

//   const excelBuffer = XLSX.write(workbook, {
//     bookType: "xlsx",
//     type: "array",
//   });

//   const blob = new Blob([excelBuffer], {
//     type:
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//   });

//   saveAs(blob, "transport_report.xlsx");
// };

// export default downloadExcel;





import * as XLSX from "xlsx-js-style";
import { saveAs } from "file-saver";
// import * as XLSX from 'xlsx';

const downloadExcel = (filteredData, editedRows = {}) => {
  if (!filteredData || filteredData.length === 0) {
    alert("No data available to download");
    return;
  }

  const getRowKey = (item) => {
    return `${item.state_name}_${item.zone_name}_${item.BSBranchName}_${item.agm}_${item.ri_name}`;
  };

 

  // ======================
  // PREPARE DATA
  // ======================
  const excelData = filteredData.map((item) => {
    const rowKey = getRowKey(item);

    const salaries = Number(editedRows[rowKey]?.salaries ?? item.salaries) || 0;
    const rent = Number(editedRows[rowKey]?.rent ?? item.rent) || 0;
    const amc = Number(editedRows[rowKey]?.amc ?? item.amc) || 0;
    const depreciation = Number(editedRows[rowKey]?.depreciation ?? item.depreciation) || 0;
    const drivers = Number(editedRows[rowKey]?.drivers_charges ?? item.drivers_charges) || 0;
    const fuel = Number(editedRows[rowKey]?.fuel ?? item.fuel) || 0;
    const hire = Number(editedRows[rowKey]?.hire_charges ?? item.hire_charges) || 0;
    const insurance = Number(editedRows[rowKey]?.insurance ?? item.insurance) || 0;
    const rm = Number(editedRows[rowKey]?.r_and_m ?? item.r_and_m) || 0;
    const taxes = Number(editedRows[rowKey]?.rates_and_taxes ?? item.rates_and_taxes) || 0;
    const finance = Number(editedRows[rowKey]?.finance_charges ?? item.finance_charges) || 0;
    const substaff = Number(editedRows[rowKey]?.substaff_salaries ?? item.substaff_salaries) || 0;

    const revenue = Number(item.total_amount) || 0;
     const net_paid = Number(item.paid_amount) || 0;
     console.log("Paid amount:", item.paid_amount);

      const currentYear = new Date().getFullYear();
       const year =
       (item.established_year) || 0;

    const noOfYears =
      year && year <= currentYear
        ? currentYear - year
        : 0;

    const expenditure =
      amc + depreciation + drivers + fuel + hire + insurance +
      rm + taxes + salaries + finance + substaff;

    //const pnl = revenue - expenditure;
     const pnl = net_paid - expenditure;
     const percent =  net_paid > 0 ? Math.round((pnl*100) / net_paid) : 0;

    // const percent = revenue > 0 ? Math.round((pnl * 100) / revenue) : 0;

    return {
      State: item.state_name,
      Zone: item.zone_name,
      Branch: item.BSBranchName,
      AGM: item.agm,
      "RI Name": item.ri_name || "-",
      "State / CBSE": item.syllabus || "-",
       "Campus Type": item.ds_res || "-",
       "Year Of Establishment": year,
       "No Of Years": noOfYears,
       "Fusion Code":
         (item.fusion_building_code) || "-",
      Students:
         Number(item.student_count) || "-",

      "Revenue 25-26": Math.round(revenue),
      "Net Paid" : Math.round(net_paid),

      AMC: Math.round(amc),
      Depreciation: Math.round(depreciation),
      "Drivers Batha": Math.round(drivers),
      Fuel: Math.round(fuel),
      "Hire Charges": Math.round(hire),
      Insurance: Math.round(insurance),
      "R & M": Math.round(rm),
      "Rates & Taxes": Math.round(taxes),
      Salaries: Math.round(salaries),
      "Finance Charges": Math.round(finance),
      "SubStaff Salaries": Math.round(substaff),

      Expenditure: Math.round(expenditure),
      // "P & L": Math.round(pnl),
       "P & L": Math.round(pnl),
      // "P & L %": percent,
       "P & L %" : percent,
    };
  });

  // ======================
  // CREATE SHEET
  // ======================
  const worksheet = XLSX.utils.json_to_sheet(excelData);

  const headers = Object.keys(excelData[0]);

  const pnlColIndex = headers.indexOf("P & L");
  const percentColIndex = headers.indexOf("P & L %");

  const range = XLSX.utils.decode_range(worksheet["!ref"]);

  headers.forEach((header, C) => {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C }); // r: 0 = header row
    if (worksheet[cellAddress]) {
      worksheet[cellAddress].s = {
        font: {
          bold: true,
          sz: 12,
          color: { rgb: "FFFFFF" },   // White text
        },
        fill: {
          patternType: "solid",
          fgColor: { rgb: "1F4E79" }, // Dark blue background
        },
        alignment: {
          horizontal: "center",
          vertical: "center",
        },
      };
    }
  });
  // ======================
  // APPLY FORMATTING + COLORS
  // ======================
  for (let R = 1; R <= range.e.r; ++R) {
    for (let C = 0; C <= range.e.c; ++C) {
      const addr = XLSX.utils.encode_cell({ r: R, c: C });
      const cell = worksheet[addr];

      if (!cell) continue;

      // ✅ Apply rounding + Indian format
      if (typeof cell.v === "number") {
        cell.v = Math.round(cell.v);
        cell.z = "#,##,##0";
      }
    }

    // ======================
    // COLOR LOGIC (P&L)
    // ======================
    const pnlAddr = XLSX.utils.encode_cell({ r: R, c: pnlColIndex });
    const percentAddr = XLSX.utils.encode_cell({ r: R, c: percentColIndex });

    const pnlCell = worksheet[pnlAddr];
    const percentCell = worksheet[percentAddr];

    const pnlValue = pnlCell?.v || 0;

    let color = "000000"; // black default

    if (pnlValue > 0) color = "008000"; // green
    else if (pnlValue < 0) color = "FF0000"; // red

    const style = {
      font: { color: { rgb: color }, bold: true },
    };

    if (pnlCell) {
      pnlCell.s = style;
      pnlCell.z = "#,##,##0";
    }

    if (percentCell) {
      percentCell.s = style;
      percentCell.z = "0";
    }
  }

  // ======================
  // COLUMN WIDTH
  // ======================
  worksheet["!cols"] = headers.map(() => ({ wch: 18 }));

  // ======================
  // CREATE FILE
  // ======================
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Transport Report");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(blob, "transport_report.xlsx");
};

export default downloadExcel;