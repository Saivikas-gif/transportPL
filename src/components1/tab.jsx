import React, { useState, useEffect } from "react";
import { formatCurrency } from "../utils/helpers";
import "bootstrap-icons/font/bootstrap-icons.css";

function ReportTable({
  data,
  filteredData,
  totals,
  totalRows,
  currentPage,
  totalPages,
  setCurrentPage,
  jumpValue,
  setJumpValue,
  editedRows,
  setEditedRows,
  selectedPnlFilter,  // ← array of { value: "loss"|"zero"|"profit", ... }
  onPnlFilteredData,  // ← callback to bubble filtered rows up to App for Excel
}) {
  const [increasePercent, setIncreasePercent] = useState(100);
  const [editingRow, setEditingRow] = useState(null);
  const [originalRows, setOriginalRows] = useState({});

  const rowsPerPage = 100;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  const colWidth = 150;
  const currentYear = new Date().getFullYear();

  const stickyLeft = {
    state: 0,
    zone: colWidth,
    branch: colWidth * 2,
    agm: colWidth * 3,
    riname: colWidth * 4,
  };

  const yearColStyle = {
    width: "90px", minWidth: "90px", maxWidth: "90px",
    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
  };

  // ─────────────────────────────────────────────
  // Helpers
  // ─────────────────────────────────────────────
  const getRowKey = (item) =>
    `${item.state_name}_${item.zone_name}_${item.BSBranchName}_${item.agm}_${item.ri_name}`;

  const getUpdatedValue = (item, field) => {
    const rowKey = getRowKey(item);
    if (editedRows[rowKey]?.[field] !== undefined) return Number(editedRows[rowKey][field]);
    return Number(item[field]) || 0;
  };

  // Live P&L percent for a row (uses edited values)
  const getLivePercent = (item) => {
    const revenue = Number(item.total_amount) || 0;
    const expenditure =
      getUpdatedValue(item, "amc") +
      getUpdatedValue(item, "depreciation") +
      getUpdatedValue(item, "drivers_charges") +
      getUpdatedValue(item, "fuel") +
      getUpdatedValue(item, "hire_charges") +
      getUpdatedValue(item, "insurance") +
      getUpdatedValue(item, "r_and_m") +
      getUpdatedValue(item, "rates_and_taxes") +
      getUpdatedValue(item, "salaries") +
      getUpdatedValue(item, "finance_charges") +
      getUpdatedValue(item, "substaff_salaries");
    const pnl = revenue - expenditure;
    return revenue > 0 ? Math.round((pnl * 100) / revenue) : 0;
  };


  // ─────────────────────────────────────────────
  // ✅ P&L FILTER
  // ─────────────────────────────────────────────

  // const activeBuckets = (selectedPnlFilter || []).map(
  //   (o) => o.value
  // );

  const activeBuckets =
  selectedPnlFilter && selectedPnlFilter.length > 0
    ? selectedPnlFilter.map((o) => o.value)
    : ["loss"];

  const pnlFilteredData = filteredData.filter((item) => {

    // No filter selected → show all
    if (activeBuckets.length === 0) {
      return true;
    }

    const percent = getLivePercent(item);

    return activeBuckets.some((bucket) => {

      if (bucket === "loss") {
        return percent < 0;
      }

      if (bucket === "zero") {
        return percent === 0;
      }

      if (bucket === "profit") {
        return percent > 0;
      }

      return false;
    });
  });

  useEffect(() => {
    if (onPnlFilteredData) {
      onPnlFilteredData(pnlFilteredData);
    }
  }, [pnlFilteredData, selectedPnlFilter, onPnlFilteredData]);

  // Sort: negatives first → zero → positives
  const sortedData = [...pnlFilteredData].sort((a, b) => getLivePercent(a) - getLivePercent(b));

  // ✅ Paginate AFTER filter+sort — this was the bug
  const paginatedData = sortedData.slice(startIndex, endIndex);

  // ─────────────────────────────────────────────
  // Live grand totals (reflects filter + edits)
  // ─────────────────────────────────────────────
  const liveTotals = pnlFilteredData.reduce(
    (acc, item) => {
      const revenue = Number(item.total_amount) || 0;
      const amc = getUpdatedValue(item, "amc");
      const depreciation = getUpdatedValue(item, "depreciation");
      const drivers = getUpdatedValue(item, "drivers_charges");
      const fuel = getUpdatedValue(item, "fuel");
      const hire = getUpdatedValue(item, "hire_charges");
      const insurance = getUpdatedValue(item, "insurance");
      const rm = getUpdatedValue(item, "r_and_m");
      const taxes = getUpdatedValue(item, "rates_and_taxes");
      const salaries = getUpdatedValue(item, "salaries");
      const finance = getUpdatedValue(item, "finance_charges");
      const substaff = getUpdatedValue(item, "substaff_salaries");
      const expenditure = amc + depreciation + drivers + fuel + hire + insurance + rm + taxes + salaries + finance + substaff;
      const pnl = revenue - expenditure;

      acc.students += Number(item.student_count) || 0;
      acc.revenue += revenue;
      acc.amc += amc;
      acc.depreciation += depreciation;
      acc.drivers += drivers;
      acc.fuel += fuel;
      acc.hire += hire;
      acc.insurance += insurance;
      acc.rm += rm;
      acc.taxes += taxes;
      acc.salary += salaries;
      acc.finance_charges += finance;
      acc.substaff += substaff;
      acc.expenditure += expenditure;
      acc.pnl += pnl;
      return acc;
    },
    { students: 0, revenue: 0, amc: 0, depreciation: 0, drivers: 0, fuel: 0, hire: 0, insurance: 0, rm: 0, taxes: 0, salary: 0, finance_charges: 0, substaff: 0, expenditure: 0, pnl: 0 }
  );

  const finalTotalsPercent = liveTotals.revenue > 0
    ? Math.round((liveTotals.pnl * 100) / liveTotals.revenue)
    : 0;

  // ─────────────────────────────────────────────
  // Edit helpers
  // ─────────────────────────────────────────────
  const renderRowCell = (item, field, rowTextColor) => {
    const rowKey = getRowKey(item);
    const isEditing = editingRow === rowKey;
    const value = editedRows[rowKey]?.[field] ?? item[field] ?? "";
    const changed = Number(value) !== Number(item[field] || 0);

    return (
      <td style={{ color: rowTextColor, textAlign: "right", backgroundColor: changed ? "#fff3cd" : "#cfe2ff", fontWeight: changed ? "bold" : "normal" }}>
        {isEditing ? (
          <input type="number" value={value ?? ""}
            onChange={(e) => handleInputChange(rowKey, field, e.target.value)}
            style={{ width: "100px", background: "#fff8dc" }} />
        ) : (
          formatCurrency(value)
        )}
      </td>
    );
  };

  const handleEdit = (item) => {
    const rowKey = getRowKey(item);
    const originalData = {
      amc: item.amc || 0,
      depreciation: item.depreciation || 0,
      drivers_charges: item.drivers_charges || 0,
      fuel: item.fuel || 0,
      hire_charges: item.hire_charges || 0,
      insurance: item.insurance || 0,
      r_and_m: item.r_and_m || 0,
      rates_and_taxes: item.rates_and_taxes || 0,
      salaries: item.salaries || 0,
      finance_charges: item.finance_charges || 0,
      substaff_salaries: item.substaff_salaries || 0,
    };
    setOriginalRows((prev) => ({ ...prev, [rowKey]: originalData }));
    setEditedRows((prev) => ({ ...prev, [rowKey]: { ...originalData, ...(prev[rowKey] || {}) } }));
    setEditingRow(rowKey);
  };

  const handleCancel = (item) => {
    const rowKey = getRowKey(item);
    setEditedRows((prev) => ({ ...prev, [rowKey]: originalRows[rowKey] }));
    setEditingRow(null);
  };

  const handleSave = async (item) => {
    const rowKey = getRowKey(item);
    const oldData = originalRows[rowKey];
    const newData = editedRows[rowKey];
    const changed_fields = Object.keys(newData || {}).filter(
      (field) => Number(oldData[field]) !== Number(newData[field])
    );
    const payload = { key: rowKey, branch_id: item.branch_id, changed_fields, old_data: oldData, new_data: newData };
    console.log("Sending payload:", payload);
    try {
      const response = await fetch(
        "http://192.168.0.1/sctsadmissions/p_and_l_report_apis.php?updatedata",
        { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }
      );
      const result = await response.json();
      console.log("Server response:", result);
      setEditingRow(null);
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  const handleInputChange = (rowKey, field, value) => {
    const updated = { ...editedRows, [rowKey]: { ...editedRows[rowKey], [field]: value } };
    setEditedRows(updated);
    localStorage.setItem("edited_rows", JSON.stringify(updated));
  };

  // ─────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────
  const thStyle = { background: "#0099e7", color: "#fff" };
  const stickyTh = (left, zIndex, extra = {}) => ({
    position: "sticky", left, zIndex, background: "#0099e7", color: "#fff",
    minWidth: colWidth, maxWidth: colWidth, ...extra,
  });

  return (
    <div style={{ maxHeight: "70vh", overflow: "auto", border: "1px solid #ddd", borderRadius: "10px", background: "white" }}>
      {/* ✅ Row count badge */}
      {/* <div style={{ padding: "6px 12px", background: "#f8f9fc", borderBottom: "1px solid #ddd", fontSize: "13px", color: "#495057" }}>
        Showing <strong>{pnlFilteredData.length}</strong> rows
        {activeBuckets.length > 0 && (
          <span style={{ marginLeft: "8px", color: "#0099e7" }}>
            (filtered by P&L: {activeBuckets.join(", ")})
          </span>
        )}
      </div> */}

      <table className="table table-hover text-center shadow table-primary table-bordered">
        <thead style={{ position: "sticky", top: 0, zIndex: 300, background: "#0099e7", textAlign: "center", verticalAlign: "middle", whiteSpace: "nowrap", color: "white" }}>
          <tr>
            <th style={stickyTh(stickyLeft.state, 50)}>State</th>
            <th style={stickyTh(stickyLeft.zone, 50)}>Zone</th>
            <th style={stickyTh(stickyLeft.branch, 50)}>Branch</th>
            <th style={stickyTh(stickyLeft.agm, 50)}>AGM</th>
            <th style={stickyTh(stickyLeft.riname, 46, { minWidth: undefined, maxWidth: undefined })}>RI Name</th>
            <th style={thStyle}>State/CBSE</th>
            <th style={thStyle}>Campus type</th>
            <th style={{ ...yearColStyle, ...thStyle }} title="Year of establishment">Year of establishment</th>
            <th style={thStyle}>No of years</th>
            <th style={{ ...yearColStyle, ...thStyle }} title="Fusion Building Code">Fusion Building Code</th>
            <th style={thStyle}>Students count</th>
            <th style={thStyle}>Revenue for 25-26</th>
            <th style={thStyle}>AMC</th>
            <th style={thStyle}>Depreciation</th>
            <th style={thStyle}>Drivers Batha</th>
            <th style={thStyle}>Fuel</th>
            <th style={thStyle}>Hire Charges</th>
            <th style={thStyle}>Insurance</th>
            <th style={thStyle}>R &amp; M</th>
            <th style={thStyle}>Rates and Taxes</th>
            <th style={thStyle}>Salaries</th>
            <th style={thStyle}>Finance Charges</th>
            <th style={thStyle}>SubStaff Salaries</th>
            <th style={thStyle}>Total Expenditure @ 25-26</th>
            <th style={thStyle}>P &amp; L for the year 25-26</th>
            <th style={thStyle}>P &amp; L Profit or Loss % - 25-26</th>
            <th style={thStyle}>Action</th>
          </tr>

          {/* Grand total row */}
          <tr style={{ background: "#0088d5", fontWeight: "bold" }}>
            {[
              { left: stickyLeft.state, zIndex: 40 },
              { left: stickyLeft.zone, zIndex: 39 },
              { left: stickyLeft.branch, zIndex: 38 },
              { left: stickyLeft.agm, zIndex: 37 },
              { left: stickyLeft.riname, zIndex: 36 },
            ].map(({ left, zIndex }, i) => (
              <th key={i} style={{ position: "sticky", left, zIndex, textAlign: "left", borderRight: "2px solid #ddd" }} />
            ))}
            <th colSpan="5" style={{ textAlign: "center" }}>Grand Total</th>
            <th style={{ textAlign: "right" }}>{formatCurrency(liveTotals.students)}</th>
            <th style={{ textAlign: "right" }}>{formatCurrency(liveTotals.revenue)}</th>
            <th style={{ textAlign: "right" }}>{formatCurrency(liveTotals.amc)}</th>
            <th style={{ textAlign: "right" }}>{formatCurrency(liveTotals.depreciation)}</th>
            <th style={{ textAlign: "right" }}>{formatCurrency(liveTotals.drivers)}</th>
            <th style={{ textAlign: "right" }}>{formatCurrency(liveTotals.fuel)}</th>
            <th style={{ textAlign: "right" }}>{formatCurrency(liveTotals.hire)}</th>
            <th style={{ textAlign: "right" }}>{formatCurrency(liveTotals.insurance)}</th>
            <th style={{ textAlign: "right" }}>{formatCurrency(liveTotals.rm)}</th>
            <th style={{ textAlign: "right" }}>{formatCurrency(liveTotals.taxes)}</th>
            <th style={{ textAlign: "right" }}>{formatCurrency(liveTotals.salary)}</th>
            <th style={{ textAlign: "right" }}>{formatCurrency(liveTotals.finance_charges)}</th>
            <th style={{ textAlign: "right" }}>{formatCurrency(liveTotals.substaff)}</th>
            <th style={{ textAlign: "right" }}>{formatCurrency(liveTotals.expenditure)}</th>
            <th style={{ textAlign: "right" }}>{formatCurrency(liveTotals.pnl)}</th>
            <th style={{ textAlign: "right" }}>{finalTotalsPercent}%</th>
            <th style={{ background: "#cfe2ff" }}></th>
          </tr>
        </thead>

        <tbody>
          {paginatedData.length === 0 ? (
            <tr>
              <td colSpan="100%" style={{ textAlign: "center", padding: "20px" }}>❌ No Data Found</td>
            </tr>
          ) : (
            paginatedData.map((item, index) => {
              const net25 = Math.round(item.total_amount) || 0;
              // console.log(total_amount);
              const students = Number(item.student_count) || 0;
              const year = Number(item.established_year) || 0;
              const noOfYears = year && year <= currentYear ? currentYear - year : "0";

              const expenditure =
                getUpdatedValue(item, "amc") +
                getUpdatedValue(item, "depreciation") +
                getUpdatedValue(item, "drivers_charges") +
                getUpdatedValue(item, "fuel") +
                getUpdatedValue(item, "hire_charges") +
                getUpdatedValue(item, "insurance") +
                getUpdatedValue(item, "r_and_m") +
                getUpdatedValue(item, "rates_and_taxes") +
                getUpdatedValue(item, "salaries") +
                getUpdatedValue(item, "finance_charges") +
                getUpdatedValue(item, "substaff_salaries");

              const pnl = net25 - expenditure;
              const finalPercent = net25 > 0 ? Math.round((pnl * 100) / net25) : 0;
              const rowTextColor = finalPercent > 0 ? "green" : finalPercent < 0 ? "red" : "black";

              return (
                <tr key={index}>
                  <td style={{ position: "sticky", left: stickyLeft.state, minWidth: colWidth, maxWidth: colWidth, color: rowTextColor, zIndex: 40, textAlign: "left", borderRight: "2px solid #ddd" }}>{item.state_name}</td>
                  <td style={{ position: "sticky", left: stickyLeft.zone, color: rowTextColor, zIndex: 39, textAlign: "left", borderRight: "2px solid #ddd" }}>{item.zone_name}</td>
                  <td style={{ position: "sticky", left: stickyLeft.branch, color: rowTextColor, zIndex: 38, textAlign: "left", borderRight: "2px solid #ddd" }}>{item.BSBranchName}</td>
                  <td style={{ position: "sticky", left: stickyLeft.agm, color: rowTextColor, zIndex: 37, textAlign: "left", borderRight: "2px solid #ddd" }}>{item.agm || "-"}</td>
                  <td style={{ position: "sticky", left: stickyLeft.riname, color: rowTextColor, zIndex: 36, textAlign: "left", borderRight: "2px solid #ddd" }}>{item.ri_name || "-"}</td>
                  <td style={{ textAlign: "left", color: rowTextColor }}>{item.syllabus || "-"}</td>
                  <td style={{ textAlign: "left", color: rowTextColor }}>{item.ds_res || "-"}</td>
                  <td style={{ ...yearColStyle, textAlign: "right", color: rowTextColor }}>{year || "-"}</td>
                  <td style={{ textAlign: "right", color: rowTextColor }}>{noOfYears}</td>
                  <td style={{ textAlign: "right", color: rowTextColor }}>{item.fusion_building_code || "0"}</td>
                  <td style={{ textAlign: "right", color: rowTextColor }}>{formatCurrency(students)}</td>
                  <td style={{ textAlign: "right", color: rowTextColor }}>{formatCurrency(net25)}</td>

                  {renderRowCell(item, "amc", rowTextColor)}
                  {renderRowCell(item, "depreciation", rowTextColor)}
                  {renderRowCell(item, "drivers_charges", rowTextColor)}
                  {renderRowCell(item, "fuel", rowTextColor)}
                  {renderRowCell(item, "hire_charges", rowTextColor)}
                  {renderRowCell(item, "insurance", rowTextColor)}
                  {renderRowCell(item, "r_and_m", rowTextColor)}
                  {renderRowCell(item, "rates_and_taxes", rowTextColor)}
                  {renderRowCell(item, "salaries", rowTextColor)}
                  {renderRowCell(item, "finance_charges", rowTextColor)}
                  {renderRowCell(item, "substaff_salaries", rowTextColor)}

                  <td style={{ textAlign: "right", color: rowTextColor }}>{formatCurrency(expenditure)}</td>
                  <td style={{ textAlign: "right", color: rowTextColor }}>{formatCurrency(pnl)}</td>
                  <td style={{ color: rowTextColor, fontWeight: "bold", textAlign: "right" }}>{finalPercent}%</td>
                  <td>
                    {editingRow === getRowKey(item) ? (
                      <>
                        <button className="btn btn-success btn-sm me-2" onClick={() => handleSave(item)} title="Save">
                          <i className="bi bi-check-lg"></i>
                        </button>
                        <button className="btn btn-secondary btn-sm" onClick={() => handleCancel(item)} title="Cancel">
                          <i className="bi bi-x-lg"></i>
                        </button>
                      </>
                    ) : (
                      <button className="btn btn-primary btn-sm" onClick={() => handleEdit(item)} title="Edit">
                        <i className="bi bi-pencil-square"></i>
                      </button>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ReportTable;