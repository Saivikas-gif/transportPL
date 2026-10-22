import * as XLSX from "xlsx-js-style";
import { saveAs } from "file-saver";

/**
 * downloadExcel
 * @param {Array} filteredData
 * @param {Object} editedRows
 */

function downloadExcel(filteredData, editedRows = {}) {

  // ======================
  // UNIQUE ROW KEY
  // ======================
  const getRowKey = (item) =>
    `${item.state_name}_${item.zone_name}_${item.BSBranchName}_${item.agm}_${item.ri_name}`;

  // ======================
  // GET EDITED VALUE
  // ======================
  const getVal = (item, field) => {
    const rowKey = getRowKey(item);

    if (editedRows[rowKey]?.[field] !== undefined) {
      return Number(editedRows[rowKey][field]);
    }

    return Number(item[field]) || 0;
  };

  // ======================
  // PREPARE EXCEL DATA
  // ======================
  const excelData = filteredData.map((item) => {

    const revenue      = Math.round(Number(item.total_amount) || 0);

    const amc          = getVal(item, "amc");
    const depreciation = getVal(item, "depreciation");
    const drivers      = getVal(item, "drivers_charges");
    const fuel         = getVal(item, "fuel");
    const hire         = getVal(item, "hire_charges");
    const insurance    = getVal(item, "insurance");
    const rm           = getVal(item, "r_and_m");
    const taxes        = getVal(item, "rates_and_taxes");
    const salaries     = getVal(item, "salaries");
    const finance      = getVal(item, "finance_charges");
    const substaff     = getVal(item, "substaff_salaries");

    // ======================
    // CALCULATIONS
    // ======================
    const totalExpenditure =
      amc +
      depreciation +
      drivers +
      fuel +
      hire +
      insurance +
      rm +
      taxes +
      salaries +
      finance +
      substaff;

    const pnl = revenue - totalExpenditure;

    const pnlPercent =
      revenue > 0
        ? Math.round((pnl * 100) / revenue)
        : 0;

    return {
      "State": item.state_name || "-",
      "Zone": item.zone_name || "-",
      "Branch": item.BSBranchName || "-",
      "AGM": item.agm || "-",
      "RI Name": item.ri_name || "-",

      "Revenue": revenue,
      "AMC": amc,
      "Depreciation": depreciation,
      "Drivers Batha": drivers,
      "Fuel": fuel,
      "Hire Charges": hire,
      "Insurance": insurance,
      "R & M": rm,
      "Rates and Taxes": taxes,
      "Salaries": salaries,
      "Finance Charges": finance,
      "SubStaff Salaries": substaff,

      "Total Expenditure": totalExpenditure,

      "P & L": pnl,

      "P & L %": `${pnlPercent}%`,
    };
  });

  // ======================
  // IF NO DATA
  // ======================
  if (excelData.length === 0) {
    alert("No data available");
    return;
  }

  // ======================
  // CREATE SHEET
  // ======================
  const worksheet = XLSX.utils.json_to_sheet(excelData);

  const headers = Object.keys(excelData[0]);

  const pnlColIndex = headers.indexOf("P & L");
  const percentColIndex = headers.indexOf("P & L %");

  const range = XLSX.utils.decode_range(worksheet["!ref"]);

  // ======================
  // HEADER STYLE
  // ======================
  headers.forEach((header, C) => {

    const cellAddress = XLSX.utils.encode_cell({
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

  // ======================
  // BODY STYLING
  // ======================
  for (let R = 1; R <= range.e.r; ++R) {

    for (let C = 0; C <= range.e.c; ++C) {

      const addr = XLSX.utils.encode_cell({
        r: R,
        c: C,
      });

      const cell = worksheet[addr];

      if (!cell) continue;

      // NUMBER FORMAT
      if (typeof cell.v === "number") {

        cell.v = Math.round(cell.v);

        cell.z = "#,##,##0";
      }
    }

    // ======================
    // PNL COLOR
    // ======================
    const pnlAddr = XLSX.utils.encode_cell({
      r: R,
      c: pnlColIndex,
    });

    const percentAddr = XLSX.utils.encode_cell({
      r: R,
      c: percentColIndex,
    });

    const pnlCell = worksheet[pnlAddr];

    const percentCell = worksheet[percentAddr];

    const pnlValue = pnlCell?.v || 0;

    let color = "000000";

    if (pnlValue > 0) {
      color = "008000";
    }
    else if (pnlValue < 0) {
      color = "FF0000";
    }

    const style = {
      font: {
        color: { rgb: color },
        bold: true,
      },
    };

    if (pnlCell) {
      pnlCell.s = style;
      pnlCell.z = "#,##,##0";
    }

    if (percentCell) {
      percentCell.s = style;
    }
  }

  // ======================
  // COLUMN WIDTH
  // ======================
  worksheet["!cols"] = headers.map(() => ({
    wch: 20,
  }));

  // ======================
  // CREATE WORKBOOK
  // ======================
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Transport Report"
  );

  // ======================
  // WRITE FILE
  // ======================
  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  // ======================
  // SAVE FILE
  // ======================
  const blob = new Blob(
    [excelBuffer],
    {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }
  );

  saveAs(blob, "transport_report.xlsx");
}

export default downloadExcel;