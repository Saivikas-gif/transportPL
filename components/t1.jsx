import React from "react";
import { useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import {
  calculateRevenue,
  calculateTotalExpenditure,
  calculatePnl,
  calculatePnlPercent
} from "./calculations";

function TableView({
  selectedColumnView,
  data,
  totals,
  avgProfitPercent,
  totalRows,
  filteredData,
  currentPage,
  totalPages,
  setCurrentPage,
  jumpValue,
  editedRows,
  setJumpValue,
  setEditedRows,
}) {
  const [editableData, setEditableData] = React.useState(() => {
    const saved = localStorage.getItem("editedTableData");
    return saved ? JSON.parse(saved) : {};
  });

  const [editingCell, setEditingCell] = React.useState(null);
  const [editingRow, setEditingRow] = useState(null);
  const [originalRows, setOriginalRows] = useState({});

  React.useEffect(() => {
    localStorage.setItem("editedTableData", JSON.stringify(editableData));
  }, [editableData]);

  const colWidth = 150;

  const stickyLeft = {
    state: 0,
    zone: colWidth,
    branch: colWidth * 2,
    agm: colWidth * 3,
    riname: colWidth * 4,
  };

  // ─── Background color helpers ───────────────────────────────────────────────
  /**
   * Returns a background color for a table row based on the P&L percent.
   *   > 0   → light green   (profitable)
   *   < 0   → light red     (loss-making)
   *   == 0  → light yellow  (break-even)
   */
//   const getRowBg = (pnlPercent) => {
//     if (pnlPercent > 0) return "#e8f5e9";   // light green
//     if (pnlPercent < 0) return "#ffebee";   // light red
//     return "#fffde7";                        // light yellow
//   };
 const getRowBg = (pnlPercent) => {
  return "#d6eaf8";   // light blue (same for all rows)
};

  /**
   * Returns a darker accent for the sticky left cells so they still stand out
   * against the row background.
   */
//   const getStickyBg = (pnlPercent) => {
//     if (pnlPercent > 0) return "#c8e6c9";   // medium green
//     if (pnlPercent < 0) return "#ffcdd2";   // medium red
//     return "#fff9c4";                        // medium yellow
//   };

const getStickyBg = (pnlPercent) => {
  return "#b3d7f5";   // slightly deeper blue for sticky columns
};
  /**
   * Alternating zebra stripe layered on top of the P&L colour.
   * Keeps alternate rows slightly darker so long rows are easier to read.
   */
  const getZebraOverlay = (index) =>
    index % 2 === 0 ? "rgba(0,0,0,0)" : "rgba(0,0,0,0.03)";
  // ────────────────────────────────────────────────────────────────────────────

  const thStyle = {
    background: "#0099e7",
    color: "#fff",
    fontSize: "15px",
    padding: "8px",
    whiteSpace: "nowrap",
    textAlign: "center",
  };

  const formatCurrency = (num) => {
    const rounded = Math.round(Number(num) || 0);
    if (rounded === 0) return "-";
    return rounded.toLocaleString("en-IN");
  };

  const renderEditableCell = (item, field, originalValue, isPercent = false) => {
    const cellKey = `${item.zone}_${item.branch}_${item.agm}_${item.RI}_${field}`;
    const value =
      editableData[cellKey] !== undefined ? editableData[cellKey] : originalValue;
    const isEditing = editingCell === cellKey;

    return isEditing ? (
      <input
        type="number"
        autoFocus
        value={value}
        onChange={(e) =>
          setEditableData({ ...editableData, [cellKey]: e.target.value })
        }
        onBlur={() => setEditingCell(null)}
        style={{
          width: "100px",
          padding: "4px",
          border: "1px solid #0099e7",
          borderRadius: "6px",
          background: "#eef8ff",
        }}
      />
    ) : (
      <div
        onClick={() => setEditingCell(cellKey)}
        style={{
          cursor: "pointer",
          background:
            editableData[cellKey] !== undefined ? "#dff6dd" : "transparent",
          padding: "4px",
          borderRadius: "6px",
        }}
      >
        {isPercent ? `${value}%` : formatCurrency(value)}
      </div>
    );
  };

  const totalsSalariesPersentage = (totals.salaries / totals.net_revenue) * 100;
  const totalsRentPersentage = (totals.rent / totals.net_revenue) * 100;
  const totalsExpenditurePercentage =
    (totals.total_expenditure / totals.net_revenue) * 100;

  const totalNetRevenue =
    (Number(totals.net_tuition) || 0) +
    (Number(totals.application_fee) || 0) +
    (Number(totals.admission_fee) || 0);

  const total_profit_or_loss_percent_2025_26 =
    totalNetRevenue > 0 ? Math.round((totals.pnl / totalNetRevenue) * 100) : 0;

  const heading = { textAlign: "left" };
  const alignRight = { textAlign: "right" };

  const getRowKey = (item) =>
    `${item.state}_${item.zone}_${item.branch}_${item.agm}_${item.RI}`;

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
      await response.json();
      setEditingRow(null);
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  const handleInputChange = (rowKey, field, value) => {
    const updated = {
      ...editedRows,
      [rowKey]: { ...editedRows[rowKey], [field]: value },
    };
    setEditedRows(updated);
    localStorage.setItem("edited_rows", JSON.stringify(updated));
  };

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

  const renderRowCell = (item, field, rowTextStyle, rowBg) => {
    const rowKey = getRowKey(item);
    const isEditing = editingRow === rowKey;
    const value = editedRows?.[rowKey]?.[field] ?? item?.[field] ?? "";
    const changed = String(value) !== String(item?.[field] ?? "");

    return (
      <td
        style={{
          ...rowTextStyle,
          textAlign: "right",
          backgroundColor: changed ? "#fff3cd" : rowBg,
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

  const getUpdatedValue = (item, field) => {
    const rowKey = getRowKey(item);
    if (editedRows?.[rowKey]?.[field] !== undefined) {
      return Number(editedRows[rowKey][field]) || 0;
    }
    return Number(item?.[field]) || 0;
  };

  const liveTotals = (filteredData || []).reduce(
    (acc, item) => {
      acc.electrical += getUpdatedValue(item, "electrical_consumables_for_25_26");
      acc.electricity += getUpdatedValue(item, "electricity");
      acc.r_and_m_bldg += getUpdatedValue(item, "r_and_m_bldg_for_25_26");
      acc.r_and_m_others += getUpdatedValue(item, "r_and_m_others_for_25_26");
      acc.depreciation += getUpdatedValue(item, "depreciation_for_25_26");
      acc.hk_exp += getUpdatedValue(item, "hk_exp");
      acc.marketing += getUpdatedValue(item, "marketing_for_25_26");
      acc.rent += getUpdatedValue(item, "rent");
      acc.security += getUpdatedValue(item, "security");
      acc.salaries += getUpdatedValue(item, "salaries_for_25_26");
      return acc;
    },
    {
      electrical: 0, electricity: 0, r_and_m_bldg: 0, r_and_m_others: 0,
      depreciation: 0, hk_exp: 0, marketing: 0, rent: 0, security: 0, salaries: 0,
    }
  );

  const liveTotalExpenditure =
    (Number(totals.total_expenditure) || 0) -
    (Number(totals.electrical) || 0) -
    (Number(totals.electricity) || 0) -
    (Number(totals.r_and_m_bldg) || 0) -
    (Number(totals.r_and_m_others) || 0) -
    (Number(totals.depreciation) || 0) -
    (Number(totals.hk_exp) || 0) -
    (Number(totals.marketing) || 0) -
    (Number(totals.rent) || 0) -
    (Number(totals.security) || 0) -
    (Number(totals.salaries) || 0) +
    liveTotals.electrical + liveTotals.electricity + liveTotals.r_and_m_bldg +
    liveTotals.r_and_m_others + liveTotals.depreciation + liveTotals.hk_exp +
    liveTotals.marketing + liveTotals.rent + liveTotals.security + liveTotals.salaries;

  const liveTotalExpenditurePercentage =
    totalNetRevenue > 0
      ? Math.round((liveTotalExpenditure / totalNetRevenue) * 100)
      : 0;

  const livePnl = totalNetRevenue - liveTotalExpenditure;

  const liveProfitLossPercentage =
    totalNetRevenue > 0
      ? Math.round((livePnl / totalNetRevenue) * 100)
      : 0;

  // ─── Table-level background (wrapper) ──────────────────────────────────────
  const tableWrapperStyle = {
    background: "linear-gradient(135deg, #f0f4f8 0%, #e8edf2 100%)",
    borderRadius: "12px",
    padding: "4px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  };

  return (
    <div>
      {/* TABLE */}
      <div style={tableWrapperStyle}>
        <div
          className="table-responsive"
          style={{
            maxHeight: "70vh",
            overflow: "auto",
            borderRadius: "10px",
            background: "#f8fafc",
          }}
        >
          <table
            className="table table-bordered text-center"
            style={{
              background: "#ffffff",
              marginBottom: 0,
            }}
          >
            {/* ── THEAD ──────────────────────────────────────────────────── */}
            <thead
              style={{
                position: "sticky",
                top: 0,
                zIndex: 300,
                background: "#0099e7",
              }}
            >
              {/* Column header row */}
              <tr>
                <th
                  style={{
                    position: "sticky",
                    left: stickyLeft.state,
                    minWidth: colWidth,
                    maxWidth: colWidth,
                    zIndex: 50,
                    background: "#0077c2",
                    color: "#fff",
                    borderRight: "2px solid #005fa3",
                  }}
                >
                  State
                </th>
                <th
                  style={{
                    position: "sticky",
                    left: stickyLeft.zone,
                    minWidth: colWidth,
                    maxWidth: colWidth,
                    zIndex: 50,
                    background: "#0077c2",
                    color: "#fff",
                    borderRight: "2px solid #005fa3",
                  }}
                >
                  Zone
                </th>
                <th
                  style={{
                    position: "sticky",
                    left: stickyLeft.branch,
                    minWidth: colWidth,
                    maxWidth: colWidth,
                    zIndex: 50,
                    background: "#0077c2",
                    color: "#fff",
                    borderRight: "2px solid #005fa3",
                  }}
                >
                  Branch
                </th>
                <th
                  style={{
                    position: "sticky",
                    left: stickyLeft.agm,
                    minWidth: colWidth,
                    maxWidth: colWidth,
                    zIndex: 50,
                    background: "#0077c2",
                    color: "#fff",
                    borderRight: "2px solid #005fa3",
                  }}
                >
                  AGM
                </th>
                <th
                  style={{
                    position: "sticky",
                    left: stickyLeft.riname,
                    zIndex: 46,
                    background: "#0077c2",
                    color: "#fff",
                    borderRight: "2px solid #005fa3",
                  }}
                >
                  RI Name
                </th>

                {/* ── Revenue group ── light blue section header tint */}
                <th style={{ ...thStyle, background: "#0099e7" }}>State/CBSE</th>
                <th style={{ ...thStyle, background: "#0099e7" }}>Campus type</th>
                <th style={{ ...thStyle, background: "#0099e7" }}>
                  Year Of <br />Establishment
                </th>
                <th style={{ ...thStyle, background: "#0099e7" }}>No Of <br />Years</th>
                <th style={{ ...thStyle, background: "#0099e7" }}>Fusion Building Code</th>
                <th style={{ ...thStyle, background: "#0099e7" }}>DS</th>
                <th style={{ ...thStyle, background: "#0099e7" }}>RES</th>
                <th style={{ ...thStyle, background: "#0099e7" }}>
                  25-26 <br />Total Strength
                </th>
                <th style={{ ...thStyle, background: "#0288d1" }}>Avg Fee</th>
                <th style={{ ...thStyle, background: "#0288d1" }}>Net Tuition</th>
                <th style={{ ...thStyle, background: "#0288d1" }}>
                  Application <br />Fee
                </th>
                <th style={{ ...thStyle, background: "#0288d1" }}>
                  Admission <br />Fee
                </th>
                <th style={{ ...thStyle, background: "#01579b", fontWeight: "bold" }}>
                  Net Revenue
                </th>

                {/* ── Expenditure group ── slightly warm */}
                <th style={{ ...thStyle, background: "#0277bd" }}>Emp Count</th>
                <th style={{ ...thStyle, background: "#f57c00", color: "#fff" }}>Salaries</th>
                <th style={{ ...thStyle, background: "#f57c00", color: "#fff" }}>Salaries %</th>
                <th style={{ ...thStyle, background: "#e65100", color: "#fff" }}>Total SFT</th>
                <th style={{ ...thStyle, background: "#e65100", color: "#fff" }}>Rent</th>
                <th style={{ ...thStyle, background: "#e65100", color: "#fff" }}>Rent %</th>
                <th style={{ ...thStyle, background: "#6a1a4c", color: "#fff" }}>Mess</th>
                <th style={{ ...thStyle, background: "#6a1a4c", color: "#fff" }}>HK</th>
                <th style={{ ...thStyle, background: "#6a1a4c", color: "#fff" }}>Security</th>
                <th style={{ ...thStyle, background: "#6a1a4c", color: "#fff" }}>Water</th>
                <th style={{ ...thStyle, background: "#6a1a4c", color: "#fff" }}>Electricity</th>
                <th style={{ ...thStyle, background: "#37474f", color: "#fff" }}>Depreciation</th>
                <th style={{ ...thStyle, background: "#37474f", color: "#fff" }}>
                  Electrical <br />Consumables
                </th>
                <th style={{ ...thStyle, background: "#37474f", color: "#fff" }}>Marketing</th>
                <th style={{ ...thStyle, background: "#37474f", color: "#fff" }}>R&M Bldg</th>
                <th style={{ ...thStyle, background: "#37474f", color: "#fff" }}>R&M Others</th>
                <th style={{ ...thStyle, background: "#4a148c", color: "#fff" }}>Other Exp</th>
                <th style={{ ...thStyle, background: "#4a148c", color: "#fff" }}>Operating Exp</th>
                <th style={{ ...thStyle, background: "#4a148c", color: "#fff" }}>CO Exp</th>
                <th style={{ ...thStyle, background: "#b71c1c", color: "#fff", fontWeight: "bold" }}>
                  Total <br />Expenditure
                </th>
                <th style={{ ...thStyle, background: "#b71c1c", color: "#fff" }}>
                  Total <br />Expenditure %
                </th>

                {/* ── P&L group ── */}
                <th style={{ ...thStyle, background: "#1b5e20", color: "#fff", fontWeight: "bold" }}>P&L</th>
                <th style={{ ...thStyle, background: "#1b5e20", color: "#fff", fontWeight: "bold" }}>Profit/Loss %</th>
                <th style={{ ...thStyle, background: "#263238", color: "#fff" }}>Action</th>
              </tr>

              {/* Grand Total row */}
              <tr style={{ background: "#fff3cd", fontWeight: "bold" }}>
                <th
                  style={{
                    position: "sticky",
                    left: stickyLeft.state,
                    minWidth: colWidth,
                    maxWidth: colWidth,
                    zIndex: 40,
                    textAlign: "left",
                    background: "#ffe082",
                    borderRight: "2px solid #ddd",
                  }}
                />
                <th
                  style={{
                    position: "sticky",
                    left: stickyLeft.zone,
                    zIndex: 39,
                    textAlign: "left",
                    background: "#ffe082",
                    borderRight: "2px solid #ddd",
                  }}
                />
                <th
                  style={{
                    position: "sticky",
                    left: stickyLeft.branch,
                    zIndex: 38,
                    textAlign: "left",
                    background: "#ffe082",
                    borderRight: "2px solid #ddd",
                  }}
                />
                <th
                  style={{
                    position: "sticky",
                    left: stickyLeft.agm,
                    zIndex: 37,
                    textAlign: "left",
                    background: "#ffe082",
                    borderRight: "2px solid #ddd",
                  }}
                />
                <th
                  style={{
                    position: "sticky",
                    left: stickyLeft.riname,
                    zIndex: 36,
                    textAlign: "left",
                    background: "#ffe082",
                    borderRight: "2px solid #ddd",
                  }}
                />

                <th colSpan="4" style={{ textAlign: "center", background: "#fff3cd" }}>
                  Grand Total
                </th>
                <td style={{ background: "#fff3cd" }} />
                <td style={{ textAlign: "right", background: "#e3f2fd" }}>{formatCurrency(totals.ds)}</td>
                <td style={{ textAlign: "right", background: "#e3f2fd" }}>{formatCurrency(totals.res)}</td>
                <td style={{ textAlign: "right", background: "#e3f2fd" }}>{formatCurrency(totals.total_strength)}</td>
                <td style={{ textAlign: "right", background: "#e1f5fe" }}>{formatCurrency(totals.avg_fee)}</td>
                <td style={{ textAlign: "right", background: "#e1f5fe" }}>{formatCurrency(totals.net_tuition)}</td>
                <td style={{ textAlign: "right", background: "#e1f5fe" }}>{formatCurrency(totals.application_fee)}</td>
                <td style={{ textAlign: "right", background: "#e1f5fe" }}>{formatCurrency(totals.admission_fee)}</td>
                <td style={{ textAlign: "right", background: "#bbdefb", fontWeight: "bold" }}>
                  {formatCurrency(totalNetRevenue)}
                </td>
                <td style={{ textAlign: "right", background: "#fff3e0" }}>{formatCurrency(totals.avg_emp_count)}</td>
                <td style={{ textAlign: "right", background: "#ffe0b2" }}>{formatCurrency(liveTotals.salaries)}</td>
                <td style={{ textAlign: "right", background: "#ffe0b2" }}>{formatCurrency(totalsSalariesPersentage)}%</td>
                <td style={{ textAlign: "right", background: "#fbe9e7" }}>{formatCurrency(totals.total_rent_sft)}</td>
                <td style={{ textAlign: "right", background: "#fbe9e7" }}>{formatCurrency(liveTotals.rent)}</td>
                <td style={{ textAlign: "right", background: "#fbe9e7" }}>{formatCurrency(totalsRentPersentage)}%</td>
                <td style={{ textAlign: "right", background: "#fce4ec" }}>{formatCurrency(totals.mess_exp)}</td>
                <td style={{ textAlign: "right", background: "#fce4ec" }}>{formatCurrency(liveTotals.hk_exp)}</td>
                <td style={{ textAlign: "right", background: "#fce4ec" }}>{formatCurrency(liveTotals.security)}</td>
                <td style={{ textAlign: "right", background: "#fce4ec" }}>{formatCurrency(totals.water)}</td>
                <td style={{ textAlign: "right", background: "#fce4ec" }}>{formatCurrency(liveTotals.electricity)}</td>
                <td style={{ textAlign: "right", background: "#eceff1" }}>{formatCurrency(liveTotals.depreciation)}</td>
                <td style={{ textAlign: "right", background: "#eceff1" }}>{formatCurrency(liveTotals.electrical)}</td>
                <td style={{ textAlign: "right", background: "#eceff1" }}>{formatCurrency(liveTotals.marketing)}</td>
                <td style={{ textAlign: "right", background: "#eceff1" }}>{formatCurrency(liveTotals.r_and_m_bldg)}</td>
                <td style={{ textAlign: "right", background: "#eceff1" }}>{formatCurrency(liveTotals.r_and_m_others)}</td>
                <td style={{ textAlign: "right", background: "#ede7f6" }}>{formatCurrency(totals.other_exp)}</td>
                <td style={{ textAlign: "right", background: "#ede7f6" }}>{formatCurrency(totals.operating_exp)}</td>
                <td style={{ textAlign: "right", background: "#ede7f6" }}>{formatCurrency(totals.co_exp)}</td>
                <td style={{ textAlign: "right", background: "#ffcdd2", fontWeight: "bold" }}>
                  {formatCurrency(liveTotalExpenditure)}
                </td>
                <td style={{ textAlign: "right", background: "#ffcdd2" }}>
                  {formatCurrency(totalsExpenditurePercentage)}%
                </td>
                <td style={{ textAlign: "right", background: "#c8e6c9", fontWeight: "bold" }}>
                  {formatCurrency(totals.pnl)}
                </td>
                <td style={{ textAlign: "right", background: "#c8e6c9", fontWeight: "bold" }}>
                  {liveProfitLossPercentage}%
                </td>
                <td style={{ background: "#fff" }} />
              </tr>
            </thead>

            {/* ── TBODY ──────────────────────────────────────────────────── */}
            <tbody>
              {data.length > 0 ? (
                data.map((item, index) => {
                  const pnlPercent = item.profit_or_loss_percent_2025_26 ?? 0;
                  const rowBg = getRowBg(pnlPercent);
                  const stickyBg = getStickyBg(pnlPercent);
                  const zebraOverlay = getZebraOverlay(index);

                  // Merge zebra over the P&L colour by combining as a layered background
                  const cellBg = rowBg;
                  const textColor =
                    pnlPercent > 0 ? "#1b5e20" : pnlPercent < 0 ? "#b71c1c" : "#333";

                  const rowTextStyle = {
                    color: textColor,
                    fontWeight: "500",
                    backgroundColor: cellBg,
                  };

                  const stickyTdBase = {
                    background: stickyBg,
                    color: textColor,
                    fontWeight: "500",
                  };

                  return (
                    <tr
                      key={index}
                      style={{
                        background: rowBg,
                        // subtle zebra overlay using outline box-shadow trick
                        boxShadow: index % 2 !== 0 ? "inset 0 0 0 9999px rgba(0,0,0,0.025)" : "none",
                      }}
                    >
                      {/* ── Sticky columns ── */}
                      <td
                        style={{
                          position: "sticky",
                          left: stickyLeft.state,
                          minWidth: colWidth,
                          maxWidth: colWidth,
                          zIndex: 40,
                          textAlign: "left",
                          borderRight: "2px solid #ccc",
                          ...stickyTdBase,
                        }}
                      >
                        {item.state}
                      </td>
                      <td
                        style={{
                          position: "sticky",
                          left: stickyLeft.zone,
                          minWidth: colWidth,
                          maxWidth: colWidth,
                          zIndex: 39,
                          textAlign: "left",
                          borderRight: "2px solid #ccc",
                          ...stickyTdBase,
                        }}
                      >
                        {item.zone}
                      </td>
                      <td
                        style={{
                          position: "sticky",
                          left: stickyLeft.branch,
                          minWidth: colWidth,
                          maxWidth: colWidth,
                          zIndex: 38,
                          textAlign: "left",
                          borderRight: "2px solid #ccc",
                          ...stickyTdBase,
                        }}
                      >
                        {item.branch}
                      </td>
                      <td
                        style={{
                          position: "sticky",
                          left: stickyLeft.agm,
                          minWidth: colWidth,
                          maxWidth: colWidth,
                          zIndex: 37,
                          textAlign: "left",
                          borderRight: "2px solid #ccc",
                          ...stickyTdBase,
                        }}
                      >
                        {item.agm || "-"}
                      </td>
                      <td
                        style={{
                          position: "sticky",
                          left: stickyLeft.riname,
                          minWidth: colWidth,
                          maxWidth: colWidth,
                          zIndex: 36,
                          textAlign: "left",
                          borderRight: "2px solid #ccc",
                          ...stickyTdBase,
                        }}
                      >
                        {item.RI || "-"}
                      </td>

                      {/* ── Data columns ── */}
                      <td style={{ ...alignRight, ...rowTextStyle }}>{item.syllabus || "-"}</td>
                      <td style={{ ...alignRight, ...rowTextStyle }}>{item.ds_res || "-"}</td>
                      <td style={{ ...alignRight, ...rowTextStyle }}>{item.year_establishment}</td>
                      <td style={{ ...alignRight, ...rowTextStyle }}>{item.no_of_years}</td>
                      <td style={{ ...alignRight, ...rowTextStyle }}>
                        {formatCurrency(item.fusion_building_code)}
                      </td>
                      <td style={{ ...alignRight, ...rowTextStyle }}>{formatCurrency(item.ds)}</td>
                      <td style={{ ...alignRight, ...rowTextStyle }}>{formatCurrency(item.res)}</td>
                      <td style={{ ...alignRight, ...rowTextStyle }}>
                        {formatCurrency(item.total_strength)}
                      </td>

                      {/* Revenue columns — slightly blue-tinted */}
                      <td style={{ ...alignRight, ...rowTextStyle, 
                        // background: rowBg === "#e8f5e9" ? "#dceefb" : rowBg === "#ffebee" ? "#fde8f0" : "#fef9e3" 
                        background: "#c2d9f0"
                        }}>
                        {formatCurrency(item.avg_fee_for_25_26)}
                      </td>
                      <td style={{ ...alignRight, ...rowTextStyle, background: rowBg === "#e8f5e9" ? "#dceefb" : rowBg === "#ffebee" ? "#fde8f0" : "#fef9e3" }}>
                        {formatCurrency(item.net_tuition_for_25_26)}
                      </td>
                      <td style={{ ...alignRight, ...rowTextStyle, background: rowBg === "#e8f5e9" ? "#dceefb" : rowBg === "#ffebee" ? "#fde8f0" : "#fef9e3" }}>
                        {formatCurrency(item.application_fee_for_25_26)}
                      </td>
                      <td style={{ ...alignRight, ...rowTextStyle, background: rowBg === "#e8f5e9" ? "#dceefb" : rowBg === "#ffebee" ? "#fde8f0" : "#fef9e3" }}>
                        {formatCurrency(item.admission_fee_for_25_26)}
                      </td>
                      <td
                        style={{
                          ...alignRight,
                          ...rowTextStyle,
                          fontWeight: "bold",
                        //   background: rowBg === "#e8f5e9" ? "#c5e1f5" : rowBg === "#ffebee" ? "#fbd0dc" : "#fdf0c0",
                        background: "#a8c8e8"
                        }}
                      >
                        {formatCurrency(
                          (Number(item.net_tuition_for_25_26) || 0) +
                          (Number(item.application_fee_for_25_26) || 0) +
                          (Number(item.admission_fee_for_25_26) || 0)
                        )}
                      </td>

                      <td style={{ ...alignRight, ...rowTextStyle }}>{formatCurrency(item.avg_emp_count)}</td>

                      {renderRowCell(item, "salaries_for_25_26", rowTextStyle, cellBg)}
                      <td style={{ ...alignRight, ...rowTextStyle }}>
                        {item.salaries_percent_for_25_26}%
                      </td>
                      <td style={{ ...alignRight, ...rowTextStyle }}>
                        {formatCurrency(item.total_rent_sft)}
                      </td>
                      {renderRowCell(item, "rent", rowTextStyle, cellBg)}
                      <td style={{ ...alignRight, ...rowTextStyle }}>{item.rentper || 0}%</td>
                      <td style={{ ...alignRight, ...rowTextStyle }}>{formatCurrency(item.mess_exp)}</td>
                      {renderRowCell(item, "hk_exp", rowTextStyle, cellBg)}
                      {renderRowCell(item, "security", rowTextStyle, cellBg)}
                      <td style={{ ...alignRight, ...rowTextStyle }}>{formatCurrency(item.water)}</td>
                      {renderRowCell(item, "electricity", rowTextStyle, cellBg)}
                      {renderRowCell(item, "depreciation_for_25_26", rowTextStyle, cellBg)}
                      {renderRowCell(item, "electrical_consumables_for_25_26", rowTextStyle, cellBg)}
                      {renderRowCell(item, "marketing_for_25_26", rowTextStyle, cellBg)}
                      {renderRowCell(item, "r_and_m_bldg_for_25_26", rowTextStyle, cellBg)}
                      {renderRowCell(item, "r_and_m_others_for_25_26", rowTextStyle, cellBg)}

                      <td style={{ ...alignRight, ...rowTextStyle }}>
                        {formatCurrency(
                          item.other_exp_for_25_26_except_transport_rates_taxes_and_amc
                        )}
                      </td>
                      <td style={{ ...alignRight, ...rowTextStyle }}>
                        {formatCurrency(
                          item.total_operating_exp_for_2025_26_except_salaries_rent_mess_hk
                        )}
                      </td>
                      <td style={{ ...alignRight, ...rowTextStyle }}>
                        {formatCurrency(item.co_exp_for_25_26_15_percent)}
                      </td>

                      {/* Total Expenditure — red-tinted */}
                      <td
                        style={{
                          ...alignRight,
                          ...rowTextStyle,
                          fontWeight: "bold",
                          background: "#ffe0e0",
                          color: "#b71c1c",
                        }}
                      >
                        {formatCurrency(calculateTotalExpenditure(item, getUpdatedValue))}
                      </td>
                      <td
                        style={{
                          ...alignRight,
                          ...rowTextStyle,
                          background: "#ffe0e0",
                          color: "#b71c1c",
                        }}
                      >
                        {calculateTotalExpenditurePercent(item, getUpdatedValue)}%
                      </td>

                      {/* P&L — green or red badge style */}
                      <td
                        style={{
                          ...alignRight,
                          fontWeight: "bold",
                          color: pnlPercent >= 0 ? "#1b5e20" : "#b71c1c",
                          background: pnlPercent >= 0 ? "#c8e6c9" : "#ffcdd2",
                        }}
                      >
                        {formatCurrency(calculatePnl(item, getUpdatedValue))}
                      </td>
                      <td
                        style={{
                          ...alignRight,
                          fontWeight: "bold",
                          color: pnlPercent >= 0 ? "#1b5e20" : "#b71c1c",
                          background: pnlPercent >= 0 ? "#c8e6c9" : "#ffcdd2",
                        }}
                      >
                        {calculatePnlPercent(item, getUpdatedValue)}%
                      </td>

                      {/* Action */}
                      <td style={{ background: "#f5f5f5" }}>
                        {editingRow === getRowKey(item) ? (
                          <>
                            <button
                              className="btn btn-success btn-sm me-2"
                              onClick={() => handleSave(item)}
                              title="Save"
                            >
                              <i className="bi bi-check-lg" />
                            </button>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleCancel(item)}
                              title="Cancel"
                            >
                              <i className="bi bi-x-lg" />
                            </button>
                          </>
                        ) : (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleEdit(item)}
                            title="Edit"
                          >
                            <i className="bi bi-pencil-square" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="100%" style={{ background: "#fff8e1", padding: "24px", color: "#888" }}>
                    ❌ No Data Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── PAGINATION ─────────────────────────────────────────────────────── */}
      <div
        className="d-flex justify-content-between align-items-center mt-3 px-2 py-2"
        style={{
          background: "#f0f4f8",
          borderRadius: "8px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}
      >
        <div>
          <strong>Total Rows: {totalRows}</strong>
        </div>

        <div className="d-flex align-items-center gap-2">
          <button
            className="btn btn-sm btn-primary"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            ◀
          </button>
          <span>
            Page {currentPage} / {totalPages}
          </span>
          <button
            className="btn btn-sm btn-primary"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            ▶
          </button>
        </div>

        <div className="d-flex gap-2">
          <input
            type="number"
            placeholder="Go to page"
            value={jumpValue}
            onChange={(e) => setJumpValue(e.target.value)}
            style={{ width: "100px" }}
          />
          <button
            className="btn btn-sm btn-secondary"
            onClick={() => {
              const page = Number(jumpValue);
              if (page >= 1 && page <= totalPages) setCurrentPage(page);
            }}
          >
            Go
          </button>
        </div>
      </div>
    </div>
  );
}

export default TableView;