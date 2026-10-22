import React from "react";
import { useState,useEffect } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import {
  calculateRevenue,
  calculateOperatingExpense,        // FIX: imported so row + grand total react to edits
  calculateCoExp,                   // FIX: imported for grand total CO Exp live display
  calculateTotalExpenditure,
  calculateTotalExpenditurePercent,
  calculatePnl,
  calculatePnlPercent,
} from "./calculations";

function TableView({
  selectedColumnView,
  data,
  totals,
  avgProfitPercent,
  totalRows,
  filteredData,
  currentPage,
//   totalPages,
  setCurrentPage,
  jumpValue,
  editedRows,
  setJumpValue,
  setEditedRows,
  selectedPnlFilter,  // ← array of { value: "loss"|"zero"|"profit", ... }
  onPnlFilteredData,  // ← callback to bubble filtered rows up to App for Excel

}) {
  const [editingRow, setEditingRow] = useState(null);
  const [originalRows, setOriginalRows] = useState({});

  const colWidth = 150;

  const stickyLeft = {
    state: 0,
    zone: colWidth,
    branch: colWidth * 2,
    agm: colWidth * 3,
    riname: colWidth * 4,
  };

  const thStyle = {
    background: "#0099e7",
    color: "#fff",
    fontSize: "15px",
    padding: "8px",
    whiteSpace: "nowrap",
    textAlign: "center",
  };

  const alignRight = { textAlign: "right" };

  const formatCurrency = (num) => {
    const rounded = Math.round(Number(num) || 0);
    if (rounded === 0) return "-";
    return rounded.toLocaleString("en-IN");
  };

  // ─── Row key ────────────────────────────────────────────────────────────────
  const getRowKey = (item) =>
    `${item.state}_${item.zone}_${item.branch}_${item.agm}_${item.RI}`;

  // ─── Live value: edited override or raw item value ───────────────────────────
  const getUpdatedValue = (item, field) => {
    const rowKey = getRowKey(item);
    if (editedRows?.[rowKey]?.[field] !== undefined) {
      return Number(editedRows[rowKey][field]) || 0;
    }
    return Number(item?.[field]) || 0;
  };

  // ─── Editable row cell renderer ──────────────────────────────────────────────
  const renderRowCell = (item, field, rowTextStyle) => {
    const rowKey = getRowKey(item);
    const isEditing = editingRow === rowKey;
    const value = editedRows?.[rowKey]?.[field] ?? item?.[field] ?? "";
    const changed = String(value) !== String(item?.[field] ?? "");

   

    return (
      <td
        style={{
          ...rowTextStyle,
          textAlign: "right",
          backgroundColor: changed ? "#fff3cd" : "#cfe2ff",
          fontWeight: changed ? "bold" : "normal",
        }}
      >
        {isEditing ? (
          <input
            type="number"
            value={value}
            onChange={(e) => handleInputChange(rowKey, field, e.target.value)}
            style={{
              width: "100px",
              padding: "4px",
              border: "1px solid #0099e7",
              borderRadius: "4px",
              background: "#fff",
            }}
          />
        ) : (
          formatCurrency(value)
        )}
      </td>
    );
  };



//    Live P&L percent for a row (uses edited values)
  const getLivePercent = (item) => {
    const revenue = calculateRevenue(item) || 0;
    const expenditure =
      getUpdatedValue(item, "salaries_for_25_26") +
      getUpdatedValue(item, "rent") +
      getUpdatedValue(item, "hk_exp") +
      getUpdatedValue(item, "security") +
      getUpdatedValue(item, "electricity") +
      getUpdatedValue(item, "depreciation_for_25_26") +
      getUpdatedValue(item, "electrical_consumables_for_25_26") +
      getUpdatedValue(item, "marketing_for_25_26") +
      getUpdatedValue(item, "r_and_m_bldg_for_25_26") +
      getUpdatedValue(item, "r_and_m_others_for_25_26");
    const pnl = revenue - expenditure;
    return revenue > 0 ? Math.round((pnl * 100) / revenue) : 0;
  };



  
  // ─────────────────────────────────────────────
  // ✅ P&L FILTER
  // ─────────────────────────────────────────────

  const activeBuckets = (selectedPnlFilter || []).map(
    (o) => o.value
  );

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


  // ─── Row edit handlers ───────────────────────────────────────────────────────
  const handleEdit = (item) => {
    const rowKey = getRowKey(item);
    const originalData = {
      salaries_for_25_26: item.salaries_for_25_26 || 0,
      rent: item.rent || 0,
      hk_exp: item.hk_exp || 0,
      security: item.security || 0,
      electricity: item.electricity || 0,
      depreciation_for_25_26: item.depreciation_for_25_26 || 0,
      electrical_consumables_for_25_26: item.electrical_consumables_for_25_26 || 0,
      marketing_for_25_26: item.marketing_for_25_26 || 0,
      r_and_m_bldg_for_25_26: item.r_and_m_bldg_for_25_26 || 0,
      r_and_m_others_for_25_26: item.r_and_m_others_for_25_26 || 0,
    };
    setOriginalRows((prev) => ({ ...prev, [rowKey]: originalData }));
    setEditedRows((prev) => ({
      ...prev,
      [rowKey]: { ...originalData, ...(prev[rowKey] || {}) },
    }));
    setEditingRow(rowKey);
  };

  const handleCancel = (item) => {
    const rowKey = getRowKey(item);
    setEditedRows((prev) => ({ ...prev, [rowKey]: originalRows[rowKey] }));
    setEditingRow(null);
  };

  const handleInputChange = (rowKey, field, value) => {
    const updated = {
      ...editedRows,
      [rowKey]: { ...editedRows[rowKey], [field]: value },
    };
    setEditedRows(updated);
    localStorage.setItem("edited_rows", JSON.stringify(updated));
  };

  const handleSave = async (item) => {
    const rowKey = getRowKey(item);
    const oldData = originalRows?.[rowKey] || {};
    const newData = editedRows?.[rowKey] || {};
    const changed_fields = Object.keys(newData).filter(
      (field) => Number(oldData[field]) !== Number(newData[field])
    );
    const payload = {
      key: rowKey,
      branch_id: item.branch_id,
      changed_fields,
      old_data: oldData,
      new_data: newData,
    };
    try {
      const response = await fetch(
        "http://192.168.0.1/sctsadmissions/p_and_l_report_apis.php?endpoint=updated",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const result = await response.json();
      console.log("Server response:", result);
      setEditingRow(null);
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  // ─── Grand-total live aggregations ──────────────────────────────────────────
  // Built purely from filteredData + getUpdatedValue so edits are always reflected
  const liveTotals = (pnlFilteredData || []).reduce(
    (acc, item) => {
      acc.salaries += getUpdatedValue(item, "salaries_for_25_26");
      acc.rent += getUpdatedValue(item, "rent");
      acc.hk_exp += getUpdatedValue(item, "hk_exp");
      acc.security += getUpdatedValue(item, "security");
      acc.electricity += getUpdatedValue(item, "electricity");
      acc.depreciation += getUpdatedValue(item, "depreciation_for_25_26");
      acc.electrical += getUpdatedValue(item, "electrical_consumables_for_25_26");
      acc.marketing += getUpdatedValue(item, "marketing_for_25_26");
      acc.r_and_m_bldg += getUpdatedValue(item, "r_and_m_bldg_for_25_26");
      acc.r_and_m_others += getUpdatedValue(item, "r_and_m_others_for_25_26");

      // FIX: Operating Exp grand total now uses calculateOperatingExpense
      // so it reacts to all 8 editable fields inside it
      acc.operating_exp += calculateOperatingExpense(item, getUpdatedValue);

      // CO Exp is 15% of revenue; revenue not editable, but sum it live for consistency
      acc.co_exp += calculateCoExp(item);

      return acc;
    },
    {
      salaries: 0,
      rent: 0,
      hk_exp: 0,
      security: 0,
      electricity: 0,
      depreciation: 0,
      electrical: 0,
      marketing: 0,
      r_and_m_bldg: 0,
      r_and_m_others: 0,
      operating_exp: 0,  // FIX: added — was missing from liveTotals entirely
      co_exp: 0,         // FIX: added — was reading stale totals.co_exp in grand total row
    }
  );

  // Grand total revenue (revenue fields are read-only)
  const totalNetRevenue =
    (Number(totals.net_tuition) || 0) +
    (Number(totals.application_fee) || 0) +
    (Number(totals.admission_fee) || 0);

  // Non-editable fixed portion of expenditure (mess, water, other_exp already in totals)
  const fixedExpFromTotals =
    (Number(totals.mess_exp) || 0) +
    (Number(totals.water) || 0) +
    (Number(totals.other_exp) || 0);

  // Live total expenditure = all live editable sums + live CO Exp + fixed non-editables
  const liveTotalExpenditure =
    liveTotals.salaries +
    liveTotals.rent +
    liveTotals.operating_exp +   // FIX: includes all 8 editable op-exp fields + fixed ones
    liveTotals.co_exp +
     fixedExpFromTotals;

  const liveTotalExpenditurePercentage =
    totalNetRevenue > 0
      ? Math.round((liveTotalExpenditure / totalNetRevenue) * 100)
      : 0;

  const livePnl = totalNetRevenue - liveTotalExpenditure;

  const liveProfitLossPercentage =
    totalNetRevenue > 0
      ? Math.round((livePnl / totalNetRevenue) * 100)
      : 0;

  const liveSalariesPercent =
    totalNetRevenue > 0
      ? Math.round((liveTotals.salaries / totalNetRevenue) * 100)
      : 0;

  const liveRentPercent =
    totalNetRevenue > 0
      ? Math.round((liveTotals.rent / totalNetRevenue) * 100)
      : 0;

  // ─── Sticky helpers ──────────────────────────────────────────────────────────
  const makeStickyTh = (left, zIndex = 50) => ({
    position: "sticky",
    left,
    minWidth: colWidth,
    maxWidth: colWidth,
    zIndex,
    background: "#0099e7",
    color: "#fff",
  });

  const makeStickyGrandTh = (left, zIndex) => ({
    position: "sticky",
    left,
    minWidth: colWidth,
    maxWidth: colWidth,
    zIndex,
    textAlign: "left",
    borderRight: "2px solid #ddd",
    background: "#cfe2ff"
  });

  const backgroundApply = ({
    background: "#cfe2ff"
  })

  // ================= PAGINATION LOGIC =================

const rowsPerPage = 100;

const startIndex = (currentPage - 1) * rowsPerPage;

const endIndex = startIndex + rowsPerPage;

const paginatedData = pnlFilteredData.slice(startIndex, endIndex);
const totalPages = Math.ceil(pnlFilteredData.length / rowsPerPage);

  return (
    <div>
      <div className="table-responsive" style={{ maxHeight: "70vh", overflow: "auto" }}>
        <table className="table table-bordered text-center">
          <thead style={{ position: "sticky", top: 0, zIndex: 300, background: "#0099e7", color: "white" }}>

            {/* ── Column headers ── */}
            <tr>
              <th style={makeStickyTh(stickyLeft.state)}>State</th>
              <th style={makeStickyTh(stickyLeft.zone)}>Zone</th>
              <th style={makeStickyTh(stickyLeft.branch)}>Branch</th>
              <th style={makeStickyTh(stickyLeft.agm)}>AGM</th>
              <th style={{ position: "sticky", left: stickyLeft.riname, zIndex: 46, background: "#0099e7", color: "#fff" }}>
                RI Name
              </th>
              <th style={thStyle}>State/CBSE</th>
              <th style={thStyle}>Campus type</th>
              <th style={thStyle}>Year Of <br />Establishment</th>
              <th style={thStyle}>No Of <br />Years</th>
              <th style={thStyle}>Fusion Building Code</th>
              <th style={thStyle}>DS</th>
              <th style={thStyle}>RES</th>
              <th style={thStyle}>25-26 <br />Total Strength</th>
              <th style={thStyle}>Avg Fee</th>
              <th style={thStyle}>Net Tuition</th>
              <th style={thStyle}>Application <br />Fee</th>
              <th style={thStyle}>Admission <br />Fee</th>
              <th style={thStyle}>Net Revenue</th>
              <th style={thStyle}>Emp Count</th>
              <th style={thStyle}>Salaries</th>
              <th style={thStyle}>Salaries %</th>
              <th style={thStyle}>Total SFT</th>
              <th style={thStyle}>Rent</th>
              <th style={thStyle}>Rent %</th>
              <th style={thStyle}>Mess</th>
              <th style={thStyle}>HK</th>
              <th style={thStyle}>Security</th>
              <th style={thStyle}>Water</th>
              <th style={thStyle}>Electricity</th>
              <th style={thStyle}>Depreciation</th>
              <th style={thStyle}>Electrical <br />Consumables</th>
              <th style={thStyle}>Marketing</th>
              <th style={thStyle}>R&amp;M Bldg</th>
              <th style={thStyle}>R&amp;M Others</th>
              <th style={thStyle}>Other Exp</th>
              <th style={thStyle}>Operating Exp</th>
              {/* Changed THe column name other CO Exp as OverHead Exp */}
              <th style={thStyle}>Over Head Exp </th>
              <th style={thStyle}>Total <br />Expenditure</th>
              <th style={thStyle}>Total <br />Expenditure %</th>
              <th style={thStyle}>P&amp;L</th>
              <th style={thStyle}>Profit/Loss %</th>
              <th style={thStyle}>Action</th>
            </tr>

            {/* ── Grand Total row ── */}
            <tr style={{ background: "#fff3cd", fontWeight: "bold" }}>
              <th style={makeStickyGrandTh(stickyLeft.state, 40)} />
              <th style={makeStickyGrandTh(stickyLeft.zone, 39)} />
              <th style={makeStickyGrandTh(stickyLeft.branch, 38)} />
              <th style={makeStickyGrandTh(stickyLeft.agm, 37)} />
              <th style={makeStickyGrandTh(stickyLeft.riname, 36)} />

              <th colSpan="4" style={{ textAlign: "center", background: "#cfe2ff" }}>Grand Total</th>
              <td style={{ background: "#cfe2ff" }} />
              <td style={alignRight, backgroundApply}>{formatCurrency(totals.ds)}</td>
              <td style={alignRight, backgroundApply}>{formatCurrency(totals.res)}</td>
              <td style={alignRight, backgroundApply}>{formatCurrency(totals.total_strength)}</td>
              <td style={alignRight, backgroundApply}>{formatCurrency(totals.avg_fee)}</td>
              <td style={alignRight, backgroundApply}>{formatCurrency(totals.net_tuition)}</td>
              <td style={alignRight, backgroundApply}>{formatCurrency(totals.application_fee)}</td>
              <td style={alignRight, backgroundApply}>{formatCurrency(totals.admission_fee)}</td>
              <td style={alignRight, backgroundApply}>{formatCurrency(totalNetRevenue)}</td>
              <td style={alignRight, backgroundApply}>{formatCurrency(totals.avg_emp_count)}</td>
              <td style={alignRight, backgroundApply}>{formatCurrency(liveTotals.salaries)}</td>
              <td style={alignRight, backgroundApply}>{liveSalariesPercent}%</td>
              <td style={alignRight, backgroundApply}>{formatCurrency(totals.total_rent_sft)}</td>
              <td style={alignRight, backgroundApply}>{formatCurrency(liveTotals.rent)}</td>
              <td style={alignRight, backgroundApply}>{liveRentPercent}%</td>
              <td style={alignRight, backgroundApply}>{formatCurrency(totals.mess_exp)}</td>
              <td style={alignRight, backgroundApply}>{formatCurrency(liveTotals.hk_exp)}</td>
              <td style={alignRight, backgroundApply}>{formatCurrency(liveTotals.security)}</td>
              <td style={alignRight, backgroundApply}>{formatCurrency(totals.water)}</td>
              <td style={alignRight, backgroundApply}>{formatCurrency(liveTotals.electricity)}</td>
              <td style={alignRight, backgroundApply}>{formatCurrency(liveTotals.depreciation)}</td>
              <td style={alignRight, backgroundApply}>{formatCurrency(liveTotals.electrical)}</td>
              <td style={alignRight, backgroundApply}>{formatCurrency(liveTotals.marketing)}</td>
              <td style={alignRight, backgroundApply}>{formatCurrency(liveTotals.r_and_m_bldg)}</td>
              <td style={alignRight, backgroundApply}>{formatCurrency(liveTotals.r_and_m_others)}</td>
              <td style={alignRight, backgroundApply}>{formatCurrency(totals.other_exp)}</td>
              {/* FIX: Grand total Operating Exp now uses liveTotals.operating_exp */}
              <td style={alignRight, backgroundApply}>{formatCurrency(liveTotals.operating_exp)}</td>
              {/* FIX: Grand total CO Exp now uses liveTotals.co_exp */}
              <td style={alignRight, backgroundApply}>{formatCurrency(liveTotals.co_exp)}</td>
              <td style={alignRight, backgroundApply}>{formatCurrency(liveTotalExpenditure)}</td>
              <td style={alignRight, backgroundApply}>{liveTotalExpenditurePercentage}%</td>
              <td style={alignRight, backgroundApply}>{formatCurrency(livePnl)}</td>
              <td style={{ fontWeight: "bold", textAlign: "right", background: "#cfe2ff" }}>{liveProfitLossPercentage}%</td>
              <td style={{ background: "#cfe2ff" }} />
            </tr>
          </thead>

          <tbody>
            {paginatedData.length > 0 ? (
               paginatedData.map((item, index) => {
                const pnlPct = calculatePnlPercent(item, getUpdatedValue);
                const rowTextStyle = {
                  background: "#cfe2ff",
                  color: pnlPct > 0 ? "green" : pnlPct < 0 ? "red" : "black",
                  fontWeight: "500",
                };

                return (
                  <tr key={index}>
                    {/* Sticky identifier columns */}
                    {[
                      { left: stickyLeft.state, value: item.state, zIndex: 40 },
                      { left: stickyLeft.zone, value: item.zone, zIndex: 39 },
                      { left: stickyLeft.branch, value: item.branch, zIndex: 38 },
                      { left: stickyLeft.agm, value: item.agm || "-", zIndex: 37 },
                      { left: stickyLeft.riname, value: item.RI || "-", zIndex: 36 },
                    ].map(({ left, value, zIndex }, i) => (
                      <td
                        key={i}
                        style={{
                          position: "sticky",
                          left,
                          minWidth: colWidth,
                          maxWidth: colWidth,
                          background: "#cfe2ff",
                          zIndex,
                          textAlign: "left",
                          borderRight: "2px solid #ddd",
                          ...rowTextStyle,
                        }}
                      >
                        {value}
                      </td>
                    ))}

                    <td style={{ ...alignRight, ...rowTextStyle }}>{item.syllabus || "-"}</td>
                    <td style={{ ...alignRight, ...rowTextStyle }}>{item.ds_res || "-"}</td>
                    <td style={{ ...alignRight, ...rowTextStyle }}>{item.year_establishment}</td>
                    <td style={{ ...alignRight, ...rowTextStyle }}>{item.no_of_years}</td>
                    <td style={{ ...alignRight, ...rowTextStyle }}>{(item.fusion_building_code)}</td>
                    <td style={{ ...alignRight, ...rowTextStyle }}>{formatCurrency(item.ds)}</td>
                    <td style={{ ...alignRight, ...rowTextStyle }}>{formatCurrency(item.res)}</td>
                    <td style={{ ...alignRight, ...rowTextStyle }}>{formatCurrency(item.total_strength)}</td>
                    <td style={{ ...alignRight, ...rowTextStyle }}>{formatCurrency(item.avg_fee_for_25_26)}</td>
                    <td style={{ ...alignRight, ...rowTextStyle }}>{formatCurrency(item.net_tuition_for_25_26)}</td>
                    <td style={{ ...alignRight, ...rowTextStyle }}>{formatCurrency(item.application_fee_for_25_26)}</td>
                    <td style={{ ...alignRight, ...rowTextStyle }}>{formatCurrency(item.admission_fee_for_25_26)}</td>
                    <td style={{ ...alignRight, ...rowTextStyle }}>{formatCurrency(calculateRevenue(item))}</td>
                    <td style={{ ...alignRight, ...rowTextStyle }}>{formatCurrency(item.avg_emp_count)}</td>

                    {renderRowCell(item, "salaries_for_25_26", rowTextStyle)}
                    <td style={{ ...alignRight, ...rowTextStyle }}>{item.salaries_percent_for_25_26}%</td>
                    <td style={{ ...alignRight, ...rowTextStyle }}>{formatCurrency(item.total_rent_sft)}</td>
                    {renderRowCell(item, "rent", rowTextStyle)}
                    <td style={{ ...alignRight, ...rowTextStyle }}>{item.rentper || 0}%</td>
                    <td style={{ ...alignRight, ...rowTextStyle }}>{formatCurrency(item.mess_exp)}</td>
                    {renderRowCell(item, "hk_exp", rowTextStyle)}
                    {renderRowCell(item, "security", rowTextStyle)}
                    <td style={{ ...alignRight, ...rowTextStyle }}>{formatCurrency(item.water)}</td>
                    {renderRowCell(item, "electricity", rowTextStyle)}
                    {renderRowCell(item, "depreciation_for_25_26", rowTextStyle)}
                    {renderRowCell(item, "electrical_consumables_for_25_26", rowTextStyle)}
                    {renderRowCell(item, "marketing_for_25_26", rowTextStyle)}
                    {renderRowCell(item, "r_and_m_bldg_for_25_26", rowTextStyle)}
                    {renderRowCell(item, "r_and_m_others_for_25_26", rowTextStyle)}

                    <td style={{ ...alignRight, ...rowTextStyle }}>
                      {formatCurrency(item.other_exp_for_25_26_except_transport_rates_taxes_and_amc)}
                    </td>

                    {/* FIX: Operating Exp per row now uses calculateOperatingExpense
                        so it reflects live edits to hk, security, electricity,
                        depreciation, electrical, marketing, r&m bldg, r&m others */}
                    <td style={{ ...alignRight, ...rowTextStyle }}>
                      {formatCurrency(calculateOperatingExpense(item, getUpdatedValue))}
                    </td>

                    {/* CO Exp: 15% of revenue — revenue not editable, stays stable */}
                    {/* Changed THe column name other CO Exp as OverHead Exp */}
                    <td style={{ ...alignRight, ...rowTextStyle }}>
                      {formatCurrency(item.co_exp_for_25_26_15_percent)}
                    </td>

                    <td style={{ ...alignRight, ...rowTextStyle }}>
                      {formatCurrency(calculateTotalExpenditure(item, getUpdatedValue))}
                    </td>
                    <td style={{ ...alignRight, ...rowTextStyle }}>
                      {calculateTotalExpenditurePercent(item, getUpdatedValue)}%
                    </td>
                    <td style={{ ...alignRight, ...rowTextStyle }}>
                      {formatCurrency(calculatePnl(item, getUpdatedValue))}
                    </td>
                    <td style={{ ...alignRight, ...rowTextStyle }}>
                      {calculatePnlPercent(item, getUpdatedValue)}%
                    </td>

                    <td style={{ background: "#cfe2ff" }} >
                      {editingRow === getRowKey(item) ? (
                        <>
                          <button className="btn btn-success btn-sm me-2" onClick={() => handleSave(item)} title="Save">
                            <i className="bi bi-check-lg" />
                          </button>
                          <button className="btn btn-secondary btn-sm" onClick={() => handleCancel(item)} title="Cancel">
                            <i className="bi bi-x-lg" />
                          </button>
                        </>
                      ) : (
                        <button className="btn btn-primary btn-sm" onClick={() => handleEdit(item)} title="Edit">
                          <i className="bi bi-pencil-square" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="100%">❌ No Data Found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <div><strong>Total Rows: {pnlFilteredData.length}</strong></div>
        <div className="d-flex align-items-center gap-2">
          <button className="btn btn-sm btn-primary" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>◀</button>
          <span>Page {currentPage} / {totalPages}</span>
          <button className="btn btn-sm btn-primary" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>▶</button>
        </div>
        <div className="d-flex gap-2">
          <input type="number" placeholder="Go to page" value={jumpValue} onChange={(e) => setJumpValue(e.target.value)} />
          <button className="btn btn-sm btn-secondary" onClick={() => {
            const page = Number(jumpValue);
            if (page >= 1 && page <= totalPages) setCurrentPage(page);
          }}>Go</button>
        </div>
      </div>
    </div>
  );
}
             
export default TableView;