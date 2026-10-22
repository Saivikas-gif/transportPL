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

  const stickyBody1 = {
    position: "sticky",
    left: stickyLeft.state,
    background: "#00a3b7",
    color: "#fff",
    zIndex: 4,
    minWidth: colWidth,
    maxWidth: colWidth,
    textAlign: "left",
  };

  const stickyBody2 = {
    position: "sticky",
    left: stickyLeft.zone,
    backgroundColor: "#00a3b7",
    color: "#fff",
    zIndex: 4,
    minWidth: colWidth,
    maxWidth: colWidth,
    textAlign: "left",
  };

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


  const renderEditableCell = (
    item,
    field,
    originalValue,
    isPercent = false,
  ) => {
    const cellKey = `${item.zone}_${item.branch}_${item.agm}_${item.RI}_${field}`;

    const value =
      editableData[cellKey] !== undefined
        ? editableData[cellKey]
        : originalValue;

    const isEditing = editingCell === cellKey;

    return isEditing ? (
      <input
        type="number"
        autoFocus
        value={value}
        onChange={(e) =>
          setEditableData({
            ...editableData,
            [cellKey]: e.target.value,
          })
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

  console.log(totals.net_tuition);
  console.log(totals.application_fee);
  console.log(totals.admission_fee);
  const totalNetRevenue =
    (Number(totals.net_tuition) || 0) +
    (Number(totals.application_fee) || 0) +
    (Number(totals.admission_fee) || 0);

  console.log(totalNetRevenue);




  const total_profit_or_loss_percent_2025_26 =
    totalNetRevenue > 0 ? Math.round((totals.pnl / totalNetRevenue) * 100) : 0;
  console.log(total_profit_or_loss_percent_2025_26);

  const heading = {
    textAlign: "left",
  };
  const alignRight = {
    textAlign: "right",
  };

  // edited Row Key Return Value
  const getRowKey = (item) => {
    return `${item.state}_${item.zone}_${item.branch}_${item.agm}_${item.RI}`;
  }



  const handleSave = async (item) => {
    const rowKey = getRowKey(item);

    const oldData = originalRows?.[rowKey] || {};
    const newData = editedRows?.[rowKey] || {};

    const changed_fields = Object.keys(newData).filter(
      (field) => Number(oldData[field]) !== Number(newData[field])
    );

    const payload = {
      key: rowKey,
      branch_id: item.branch_id,   // or item.branch_id
      changed_fields,
      old_data: oldData,
      new_data: newData
    };

    console.log("Sending payload:", payload);

    try {
      const response = await fetch(
        "http://192.168.0.1/sctsadmissions/p_and_l_report_apis.php?endpoint=updated", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      console.log("Server response:", result);

      setEditingRow(null);
    } catch (error) {
      console.error("Save error:", error);
    }
  };


  const handleInputChange = (rowKey, field, value) => {
    const updated = {
      ...editedRows,
      [rowKey]: {
        ...editedRows[rowKey],
        [field]: (value),
      },
    };
    setEditedRows(updated);

    localStorage.setItem("edited_rows", JSON.stringify(updated));
  }

  const handleEdit = (item) => {
    const rowKey = getRowKey(item);

    const originalData = {
      salaries_for_25_26: item.salaries_for_25_26 || 0,
      rent: item.rent || 0,
      hk_exp: item.hk_exp || 0,
      security: item.security || 0,
      electricity: item.electricity || 0,
      depreciation_for_25_26: item.depreciation_for_25_26 || 0,
      electrical_consumables_for_25_26:
        item.electrical_consumables_for_25_26 || 0,
      marketing_for_25_26: item.marketing_for_25_26 || 0,
      r_and_m_bldg_for_25_26:
        item.r_and_m_bldg_for_25_26 || 0,
      r_and_m_others_for_25_26:
        item.r_and_m_others_for_25_26 || 0,
    };
    setOriginalRows((prev) => ({
      ...prev,
      [rowKey]: originalData,
    }));

    setEditedRows((prev) => ({
      ...prev,
      [rowKey]: {
        ...originalData,
        ...(prev[rowKey] || {}),
      },
    }));
    setEditingRow(rowKey);
  };

  const handleCancel = (item) => {
    const rowKey = getRowKey(item);

    setEditedRows((prev) => ({
      ...prev,
      [rowKey]: originalRows[rowKey],
    }));

    setEditingRow(null);
  };

  const renderRowCell = (item, field, rowTextStyle) => {
    const rowKey = getRowKey(item);
    const isEditing = editingRow === rowKey;

    const value =
      editedRows?.[rowKey]?.[field] ??
      item?.[field] ??
      "";

    const changed =
      String(value) !== String(item?.[field] ?? "");

    return (
      <td
        style={{
          ...rowTextStyle,
          textAlign: "right",
          backgroundColor: changed ? "#fff3cd" : "#fff",
          fontWeight: changed ? "bold" : "normal",
        }}
      >
        {isEditing ? (
          <input
            type="number"
            value={value}
            onChange={(e) =>
              handleInputChange(rowKey, field, e.target.value)
            }
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


  // Cal Live Data
  const getUpdatedValue = (item, field) => {
    const rowKey = getRowKey(item);

    if (editedRows?.[rowKey]?.[field] !== undefined) {
      return Number(editedRows[rowKey][field]) || 0;
    }

    return Number(item?.[field]) || 0;
  };



  const liveTotals = (filteredData || []).reduce(
    (acc, item) => {
      acc.electrical += getUpdatedValue(
        item,
        "electrical_consumables_for_25_26"
      );

      acc.electricity += getUpdatedValue(
        item,
        "electricity"
      );

      acc.r_and_m_bldg += getUpdatedValue(
        item,
        "r_and_m_bldg_for_25_26"
      );

      acc.r_and_m_others += getUpdatedValue(
        item,
        "r_and_m_others_for_25_26"
      );

      acc.depreciation += getUpdatedValue(
        item,
        "depreciation_for_25_26"
      );

      acc.hk_exp += getUpdatedValue(
        item,
        "hk_exp"
      );

      acc.marketing += getUpdatedValue(
        item,
        "marketing_for_25_26"
      );

      acc.rent += getUpdatedValue(
        item,
        "rent"
      );

      acc.security += getUpdatedValue(
        item,
        "security"
      );

      acc.salaries += getUpdatedValue(
        item,
        "salaries_for_25_26"
      );

      return acc;
    },
    {
      electrical: 0,
      electricity: 0,
      r_and_m_bldg: 0,
      r_and_m_others: 0,
      depreciation: 0,
      hk_exp: 0,
      marketing: 0,
      rent: 0,
      security: 0,
      salaries: 0,
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
    liveTotals.electrical +
    liveTotals.electricity +
    liveTotals.r_and_m_bldg +
    liveTotals.r_and_m_others +
    liveTotals.depreciation +
    liveTotals.hk_exp +
    liveTotals.marketing +
    liveTotals.rent +
    liveTotals.security +
    liveTotals.salaries;

  const liveTotalExpenditurePercentage =
    totalNetRevenue > 0
      ? Math.round((liveTotalExpenditure / totalNetRevenue) * 100)
      : 0;

  const livePnl = totalNetRevenue - liveTotalExpenditure;

  const liveProfitLossPercentage =
    totalNetRevenue > 0
      ? Math.round((livePnl / totalNetRevenue) * 100)
      : 0;

  // const calculateRowProfitLossPercent = (item) => {
  //   const rowRevenue =
  //     (Number(item.net_tuition_for_25_26) || 0) +
  //     (Number(item.application_fee_for_25_26) || 0) +
  //     (Number(item.admission_fee_for_25_26) || 0);

  //   const rowExp =
  //     getUpdatedValue(item, "salaries_for_25_26") +
  //     getUpdatedValue(item, "rent") +
  //     getUpdatedValue(item, "hk_exp") +
  //     getUpdatedValue(item, "security") +
  //     getUpdatedValue(item, "electricity") +
  //     getUpdatedValue(item, "depreciation_for_25_26") +
  //     getUpdatedValue(item, "electrical_consumables_for_25_26") +
  //     getUpdatedValue(item, "marketing_for_25_26") +
  //     getUpdatedValue(item, "r_and_m_bldg_for_25_26") +
  //     getUpdatedValue(item, "r_and_m_others_for_25_26") +
  //     (Number(item.other_exp_for_25_26_except_transport_rates_taxes_and_amc) || 0) +
  //     (Number(item.co_exp_for_25_26_15_percent) || 0);

  //   const rowPnl = rowRevenue - rowExp;

  //   return rowRevenue > 0
  //     ? Math.round((rowPnl / rowRevenue) * 100)
  //     : 0;
  // };

  // const calculateRowRevenue = (item) => {
  //   return (
  //     (Number(item?.net_tuition_for_25_26) || 0) +
  //     (Number(item?.application_fee_for_25_26) || 0) +
  //     (Number(item?.admission_fee_for_25_26) || 0)
  //   );
  // };

  // const calculateRowTotalExpenditure = (item) => {
  //   return (
  //     (getUpdatedValue(item, "salaries_for_25_26") || 0) +
  //     (getUpdatedValue(item, "rent") || 0) +
  //     (getUpdatedValue(item, "hk_exp") || 0) +
  //     (getUpdatedValue(item, "security") || 0) +
  //     (getUpdatedValue(item, "electricity") || 0) +
  //     (getUpdatedValue(item, "depreciation_for_25_26") || 0) +
  //     (getUpdatedValue(item, "electrical_consumables_for_25_26") || 0) +
  //     (getUpdatedValue(item, "marketing_for_25_26") || 0) +
  //     (getUpdatedValue(item, "r_and_m_bldg_for_25_26") || 0) +
  //     (getUpdatedValue(item, "r_and_m_others_for_25_26") || 0) +
  //     (Number(item?.other_exp_for_25_26_except_transport_rates_taxes_and_amc) || 0) +
  //     (Number(item?.co_exp_for_25_26_15_percent) || 0)
  //   );
  // };

  // const calculateRowProfitLossPercent = (item) => {
  //   const rowRevenue = calculateRowRevenue(item);
  //   const rowExp = calculateRowExpenditure(item);
  //   const rowPnl = rowRevenue - rowExp;

  //   return rowRevenue > 0
  //     ? Math.round((rowPnl / rowRevenue) * 100)
  //     : 0;
  // };
  //  const expenditure = calculateRowTotalExpenditure(item);
  //   const calculateRowTotalExpenditurePercent = (item) => {
  //   const revenue =
  //     (Number(item?.net_tuition_for_25_26) || 0) +
  //     (Number(item?.application_fee_for_25_26) || 0) +
  //     (Number(item?.admission_fee_for_25_26) || 0);

  //  const expenditure = calculateRowTotalExpenditure(item);

  //   return revenue > 0
  //     ? Math.round((expenditure / revenue) * 100)
  //     : 0;
  // };

  // const calculateRowPnl = (item) => {
  //   const revenue =
  //     (Number(item?.net_tuition_for_25_26) || 0) +
  //     (Number(item?.application_fee_for_25_26) || 0) +
  //     (Number(item?.admission_fee_for_25_26) || 0);

  //   return revenue - calculateRowTotalExpenditure(item);
  // };

  // const calculateRowPnlPercent = (item) => {
  //   const revenue =
  //     (Number(item?.net_tuition_for_25_26) || 0) +
  //     (Number(item?.application_fee_for_25_26) || 0) +
  //     (Number(item?.admission_fee_for_25_26) || 0);

  //   const pnl = calculateRowPnl(item);

  //   return revenue > 0
  //     ? Math.round((pnl / revenue) * 100)
  //     : 0;
  // };

  // const calculateRowRevenue = (item) => {
  //   return (
  //     (Number(item?.net_tuition_for_25_26) || 0) +
  //     (Number(item?.application_fee_for_25_26) || 0) +
  //     (Number(item?.admission_fee_for_25_26) || 0)
  //   );
  // };

  // const calculateRowTotalExpenditure = (item) => {
  //   return (
  //     getUpdatedValue(item, "salaries_for_25_26") +
  //     getUpdatedValue(item, "rent") +
  //     getUpdatedValue(item, "hk_exp") +
  //     getUpdatedValue(item, "security") +
  //     getUpdatedValue(item, "electricity") +
  //     getUpdatedValue(item, "depreciation_for_25_26") +
  //     getUpdatedValue(item, "electrical_consumables_for_25_26") +
  //     getUpdatedValue(item, "marketing_for_25_26") +
  //     getUpdatedValue(item, "r_and_m_bldg_for_25_26") +
  //     getUpdatedValue(item, "r_and_m_others_for_25_26") +
  //     (Number(item?.other_exp_for_25_26_except_transport_rates_taxes_and_amc) || 0) +
  //     (Number(item?.co_exp_for_25_26_15_percent) || 0)
  //   );
  // };

  // const calculateRowTotalExpenditurePercent = (item) => {
  //   const revenue = calculateRowRevenue(item);
  //   const expenditure = calculateRowTotalExpenditure(item);

  //   return revenue > 0
  //     ? Math.round((expenditure / revenue) * 100)
  //     : 0;
  // };

  // const calculateRowPnl = (item) => {
  //   return calculateRowRevenue(item) - calculateRowTotalExpenditure(item);
  // };

  // const calculateRowPnlPercent = (item) => {
  //   const revenue = calculateRowRevenue(item);
  //   const pnl = calculateRowPnl(item);

  //   return revenue > 0
  //     ? Math.round((pnl / revenue) * 100)
  //     : 0;
  // };

  return (
    <div>
      {/* TABLE */}
      <div
        className="table-responsive"
        style={{ maxHeight: "70vh", overflow: "auto" }}
      >
        <table className="table table-bordered text-center">
          <thead
            style={{
              position: "sticky",
              minWidth: colWidth,
              maxWidth: colWidth,
              top: 0,
              zIndex: 300,
              background: "#0099e7",
              padding: "6px 4px",
              textAlign: "center", // 👈 horizontal center
              verticalAlign: "middle", // 👈 vertical center
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              color: "white",
            }}
          >
            <tr>

              <th
                style={{
                  position: "sticky",
                  left: stickyLeft.state,
                  minWidth: colWidth,
                  maxWidth: colWidth,
                  zIndex: 50,
                  background: "#0099e7",
                  color: "#fff",
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
                  background: "#0099e7",
                  color: "#fff",
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
                  background: "#0099e7",
                  color: "#fff",
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
                  background: "#0099e7",
                  color: "#fff",
                }}
              >
                AGM
              </th>

              <th
                style={{
                  position: "sticky",
                  left: stickyLeft.riname,
                  zIndex: 46,
                  background: "#0099e7",
                  color: "#fff",
                }}
              >
                RI Name
              </th>




              <th style={thStyle}>
                State/CBSE
              </th>
              <th style={thStyle} >
                Campus type
              </th>
              <th style={thStyle}>
                {" "}
                Year Of <br />
                Establishment
              </th>

              <th style={thStyle}>
                No Of <br />
                Years
              </th>
              <th style={thStyle}>Fusion Building Code</th>
              <th style={thStyle}>DS</th>
              <th style={thStyle}>RES</th>
              <th style={thStyle}>
                25-26 <br />
                Total Strength
              </th>

              {/* <th style={thStyle}>Capacity</th>
            <th style={thStyle}>Capacity Diff</th> */}

              <th style={thStyle}>Avg Fee</th>
              <th style={thStyle}>Net Tuition</th>

              <th style={thStyle}>
                Application <br /> Fee
              </th>
              <th style={thStyle}>
                Admission <br /> Fee
              </th>
              <th style={thStyle}>Net Revenue</th>

              <th style={thStyle}>Emp Count</th>
              <th style={thStyle}>Salaries</th>
              <th style={thStyle}>Salaries %</th>

              <th style={thStyle}>Total SFT</th>
              <th style={thStyle}>Rent</th>
              <th style={thStyle}>Rent % </th>
              <th style={thStyle}>Mess</th>
              <th style={thStyle}>HK</th>

              <th style={thStyle}>Security</th>
              <th style={thStyle}>Water</th>
              <th style={thStyle}>Electricity</th>

              <th style={thStyle}>Depreciation</th>
              <th style={thStyle}>
                Electrical <br /> Consumables
              </th>
              <th style={thStyle}>Marketing</th>

              <th style={thStyle}>R&M Bldg</th>
              <th style={thStyle}>R&M Others</th>

              <th style={thStyle}>Other Exp</th>
              <th style={thStyle}>Operating Exp</th>
              <th style={thStyle}>CO Exp</th>

              <th style={thStyle}>
                Total <br /> Expenditure
              </th>
              <th style={thStyle}>
                Total <br />
                Expenditure %
              </th>

              <th style={thStyle}>P&L</th>
              <th style={thStyle}>Profit/Loss %</th>
              <th style={thStyle}>Action</th>
            </tr>
            <tr style={{ background: "#fff3cd", fontWeight: "bold" }}>
              <th
                style={{
                  position: "sticky",

                  minWidth: colWidth,
                  maxWidth: colWidth,
                  left: stickyLeft.state,

                  zIndex: 40,
                  textAlign: "left",
                  borderRight: "2px solid #ddd",
                  //background: getRowBg(finalPercent),
                }}
              ></th>

              <th
                style={{
                  position: "sticky",
                  left: stickyLeft.zone,

                  zIndex: 39,
                  textAlign: "left",
                  borderRight: "2px solid #ddd",
                  // background: getRowBg(finalPercent),
                }}
              ></th>
              <th
                style={{
                  position: "sticky",
                  left: stickyLeft.branch,

                  zIndex: 38,
                  textAlign: "left",
                  borderRight: "2px solid #ddd",
                  // background: getRowBg(finalPercent),
                }}
              ></th>

              <th
                style={{
                  position: "sticky",
                  left: stickyLeft.agm,

                  zIndex: 37,
                  textAlign: "left",
                  borderRight: "2px solid #ddd",
                }}
              ></th>

              <th
                style={{
                  position: "sticky",
                  left: stickyLeft.riname,

                  zIndex: 36,
                  textAlign: "left",
                  borderRight: "2px solid #ddd",
                }}
              ></th>

              <th colSpan="4" style={{ textAlign: "center" }}>
                Grand Total
              </th>

              <td></td>

              {/* <td style={{textAlign: "right"}}>{formatCurrency(totals.fusion_building_code)}</td> */}
              <td style={{ textAlign: "right" }}>
                {formatCurrency(totals.ds)}
              </td>
              <td style={{ textAlign: "right" }}>
                {formatCurrency(totals.res)}
              </td>
              <td style={{ textAlign: "right" }}>
                {formatCurrency(totals.total_strength)}
              </td>

              <td style={{ textAlign: "right" }}>
                {formatCurrency(totals.avg_fee)}
              </td>
              <td style={{ textAlign: "right" }}>
                {formatCurrency(totals.net_tuition)}
              </td>

              <td style={{ textAlign: "right" }}>
                {formatCurrency(totals.application_fee)}
              </td>
              <td style={{ textAlign: "right" }}>
                {formatCurrency(totals.admission_fee)}
              </td>
              <td style={{ textAlign: "right" }}>
                {formatCurrency(totalNetRevenue)}
              </td>

              <td style={{ textAlign: "right" }}>
                {formatCurrency(totals.avg_emp_count)}
              </td>
              <td style={{ textAlign: "right" }}>
                {formatCurrency(liveTotals.salaries)}
              </td>
              <td style={{ textAlign: "right" }}>
                {formatCurrency(totalsSalariesPersentage)}%
              </td>

              <td style={{ textAlign: "right" }}>
                {formatCurrency(totals.total_rent_sft)}
              </td>
              <td style={{ textAlign: "right" }}>
                {formatCurrency(liveTotals.rent)}
              </td>
              <td style={{ textAlign: "right" }}>
                {formatCurrency(totalsRentPersentage)}%
              </td>

              <td style={{ textAlign: "right" }}>
                {formatCurrency(totals.mess_exp)}
              </td>
              <td style={{ textAlign: "right" }}>
                {formatCurrency(liveTotals.hk_exp)}
              </td>

              <td style={{ textAlign: "right" }}>
                {formatCurrency(liveTotals.security)}
              </td>
              <td style={{ textAlign: "right" }}>
                {formatCurrency(totals.water)}
              </td>
              <td style={{ textAlign: "right" }}>
                {formatCurrency(liveTotals.electricity)}
              </td>

              <td style={{ textAlign: "right" }}>
                {formatCurrency(liveTotals.depreciation)}
              </td>
              <td style={{ textAlign: "right" }}>
                {formatCurrency(liveTotals.electrical)}
              </td>
              <td style={{ textAlign: "right" }}>
                {formatCurrency(liveTotals.marketing)}
              </td>

              <td style={{ textAlign: "right" }}>
                {formatCurrency(liveTotals.r_and_m_bldg)}
              </td>
              <td style={{ textAlign: "right" }}>
                {formatCurrency(liveTotals.r_and_m_others)}
              </td>

              <td style={{ textAlign: "right" }}>
                {formatCurrency(totals.other_exp)}
              </td>
              <td style={{ textAlign: "right" }}>
                {formatCurrency(totals.operating_exp)}
              </td>
              <td style={{ textAlign: "right" }}>
                {formatCurrency(totals.co_exp)}
              </td>

              <td style={{ textAlign: "right" }}>
                {/* {formatCurrency(totals.total_expenditure)} */}
                {formatCurrency(liveTotalExpenditure)}
              </td>

              <td style={{ textAlign: "right" }}>
                {formatCurrency(totalsExpenditurePercentage)}%

              </td>

              <td style={{ textAlign: "right" }}>
                {formatCurrency(totals.pnl)}

              </td>

              <td
                style={{
                  // color:
                  // total_profit_or_loss_percent_2025_26 > 0
                  //   ? "green"
                  //   : total_profit_or_loss_percent_2025_26 < 0
                  //     ? "red"
                  //     : "orange",
                  fontWeight: "bold",
                  textAlign: "right",
                }}
              >
                {/* {total_profit_or_loss_percent_2025_26}% */}
                {/* {calculateRowPnlPercent}% */}
                 {liveProfitLossPercentage}%
              </td>
              <td style={{ background: "#fff" }}></td>
            </tr>
          </thead>

          <tbody>
            {data.length > 0 ? (
              data.map((item, index) => {
                const rowTextStyle = {
                  color:
                    item.profit_or_loss_percent_2025_26 > 0
                      ? "green"
                      : item.profit_or_loss_percent_2025_26 < 0
                        ? "red"
                        : "black",
                  fontWeight: "500",
                  
                };
                // const rowValues = calculateRowProfitLossPercent(item);
                // console.log(rowValues);
                return (
                  <tr key={index}>
                    <td
                      style={{
                        position: "sticky",
                        left: stickyLeft.state,
                        minWidth: colWidth,
                        maxWidth: colWidth,
                        backgroundColor: "#6f95cf",
                        zIndex: 40,
                        textAlign: "left",
                        borderRight: "2px solid #ddd",
                        ...rowTextStyle,
                      }}
                    >
                      {/* {item.state} */}
                     HI
                    </td>
                    <td
                      style={{
                        position: "sticky",
                        left: stickyLeft.zone,
                        minWidth: colWidth,
                        maxWidth: colWidth,
                        background: "#fff",
                        zIndex: 39,
                        textAlign: "left",
                        borderRight: "2px solid #ddd",
                        ...rowTextStyle,
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
                         backgroundColor: "#6f95cf",
                        zIndex: 38,
                        textAlign: "left",
                        borderRight: "2px solid #ddd",
                        ...rowTextStyle,
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
                        background: "#fff",
                        zIndex: 37,
                        textAlign: "left",
                        borderRight: "2px solid #ddd",
                        ...rowTextStyle,
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
                        background: "#fff",
                        zIndex: 36,
                        textAlign: "left",
                        borderRight: "2px solid #ddd",
                        ...rowTextStyle,
                      }}
                    >
                      {item.RI || "-"}
                    </td>

                    <td style={{ ...alignRight, ...rowTextStyle }}>{item.syllabus || "-"}</td>
                    <td style={{ ...alignRight, ...rowTextStyle }}>{item.ds_res || "-"}</td>
                    <td style={{ ...alignRight, ...rowTextStyle }}>
                      {item.year_establishment}
                    </td>
                    <td style={{ ...alignRight, ...rowTextStyle }}>
                      {item.no_of_years}
                    </td>
                    <td style={{ ...alignRight, ...rowTextStyle }}>
                      {formatCurrency(item.fusion_building_code)}
                    </td>
                    <td style={{ ...alignRight, ...rowTextStyle }}>
                      {formatCurrency(item.ds)}
                    </td>
                    <td style={{ ...alignRight, ...rowTextStyle }}>
                      {formatCurrency(item.res)}
                    </td>
                    <td style={{ ...alignRight, ...rowTextStyle }}>
                      {formatCurrency(item.total_strength)}
                    </td>
                    <td style={{ ...alignRight, ...rowTextStyle }}>
                      {
                        formatCurrency(item.avg_fee_for_25_26)
                      }
                    </td>
                    <td style={{ ...alignRight, ...rowTextStyle }}>
                      {formatCurrency(item.net_tuition_for_25_26)}
                    </td>
                    <td style={{ ...alignRight, ...rowTextStyle }}>
                      {formatCurrency(item.application_fee_for_25_26)}
                    </td>
                    <td style={{ ...alignRight, ...rowTextStyle }}>
                      {formatCurrency(item.admission_fee_for_25_26)}
                    </td>
                    <td style={{ ...alignRight, ...rowTextStyle }}>
                      {formatCurrency((Number(item.net_tuition_for_25_26) || 0) +
                        (Number(item.application_fee_for_25_26) || 0) +
                        (Number(item.admission_fee_for_25_26) || 0))}
                    </td>
                    <td style={{ ...alignRight, ...rowTextStyle }}>
                      {formatCurrency(item.avg_emp_count)}
                    </td>
                    {/* <td style={{ ...alignRight, ...rowTextStyle }}>
                      {formatCurrency(item.salaries_for_25_26)}
                    </td> */}
                    {renderRowCell(item, "salaries_for_25_26", rowTextStyle)}
                    <td style={{ ...alignRight, ...rowTextStyle }}>
                      {item.salaries_percent_for_25_26}%
                    </td>
                    <td style={{ ...alignRight, ...rowTextStyle }}>
                      {formatCurrency(item.total_rent_sft)}
                    </td>
                    {/* <td style={{ ...alignRight, ...rowTextStyle }}>
                      {formatCurrency(item.rent)}
                    </td> */}
                    {renderRowCell(item, "rent", rowTextStyle)}
                    <td style={{ ...alignRight, ...rowTextStyle }}>
                      {item.rentper || 0}%
                    </td>
                    <td style={{ ...alignRight, ...rowTextStyle }}>
                      {formatCurrency(item.mess_exp)}
                    </td>
                    {/* <td style={{ ...alignRight, ...rowTextStyle }}>
                      {formatCurrency(item.hk_exp)}
                    </td> */}
                    {renderRowCell(item, "hk_exp", rowTextStyle)}
                    {renderRowCell(item, "security", rowTextStyle)}
                    {/* <td style={{ ...alignRight, ...rowTextStyle }}>
                      {formatCurrency(item.security)}
                    </td> */}
                    <td style={{ ...alignRight, ...rowTextStyle }}>
                      {formatCurrency(item.water)}
                    </td>
                    {/* <td style={{ ...alignRight, ...rowTextStyle }}>
                      {formatCurrency(item.electricity)}
                    </td> */}
                    {/* <td style={{ ...alignRight, ...rowTextStyle }}>
                      {formatCurrency(item.depreciation_for_25_26)}
                    </td> */}
                    {renderRowCell(item, "electricity", rowTextStyle)}
                    {renderRowCell(item, "depreciation_for_25_26", rowTextStyle)}
                    {/* <td style={{ ...alignRight, ...rowTextStyle }}>
                      {formatCurrency(item.electrical_consumables_for_25_26)}
                    </td> */}

                    {renderRowCell(item, "electrical_consumables_for_25_26", rowTextStyle)}
                    {renderRowCell(item, "marketing_for_25_26", rowTextStyle)}
                    {/* <td style={{ ...alignRight, ...rowTextStyle }}>
                      {formatCurrency(item.marketing_for_25_26)}
                    </td> */}


                    {renderRowCell(item, "r_and_m_bldg_for_25_26", rowTextStyle)}



                    {renderRowCell(item, "r_and_m_others_for_25_26", rowTextStyle)}

                    {/* // <td style={{ ...alignRight, ...rowTextStyle }}>
                    //   {formatCurrency(item.r_and_m_bldg_for_25_26)}
                    // </td>
                    // <td style={{ ...alignRight, ...rowTextStyle }}>
                    //   {formatCurrency(item.r_and_m_others_for_25_26)}
                    // </td> */}
                    <td style={{ ...alignRight, ...rowTextStyle }}>
                      {formatCurrency(
                        item.other_exp_for_25_26_except_transport_rates_taxes_and_amc,
                      )}
                    </td>
                    <td style={{ ...alignRight, ...rowTextStyle }}>
                      {formatCurrency(
                        item.total_operating_exp_for_2025_26_except_salaries_rent_mess_hk,
                      )}
                    </td>
                    <td style={{ ...alignRight, ...rowTextStyle }}>
                      {formatCurrency(item.co_exp_for_25_26_15_percent)}
                    </td>
                    {/* <td style={{ ...alignRight, ...rowTextStyle }}>
                       {/* {formatCurrency(item.total_expenditure_25_26)}  */}
                    {/* {formatCurrency(calculateRowProfitLossPercent(item))} */}
                    {/* </td> */}
                    {/* <td style={{ ...alignRight, ...rowTextStyle }}>
                      {formatCurrency(calculateRowTotalExpenditure(item))}
                    </td> */}
                    <td style={{ ...alignRight, ...rowTextStyle }}>
                      {formatCurrency(calculateTotalExpenditure(item, getUpdatedValue))}
                    </td>
                    {/* <td style={{ ...alignRight, ...rowTextStyle }}>
                      {formatCurrency(calculateRowExpenditure(item))}
                    </td> */}
                    {/* <td style={{ ...alignRight, ...rowTextStyle }}>
                      {/* {item.total_expenditure_25_26_percent}% */}
                    {/* {calculateRowTotalExpenditurePercent(item)}%
                    </td>  */}
                    <td style={{ ...alignRight, ...rowTextStyle }}>
                      {calculateTotalExpenditurePercent(item, getUpdatedValue)}%
                    </td>
                    {/* </td>
                    <td style={{ ...alignRight, ...rowTextStyle }}>
                      {formatCurrency(item.pnl_for_the_year_2025_26)}
                    </td>
                    <td style={{ ...alignRight, ...rowTextStyle }}>
                      {item.profit_or_loss_percent_2025_26}%
                    </td> */}
                    {/* <td style={{ ...alignRight, ...rowTextStyle }}>
                        {formatCurrency(
                          ((Number(item.net_tuition_for_25_26) || 0) +
                            (Number(item.application_fee_for_25_26) || 0) +
                            (Number(item.admission_fee_for_25_26) || 0)) -
                          (
                            getUpdatedValue(item, "salaries_for_25_26") +
                            getUpdatedValue(item, "rent") +
                            getUpdatedValue(item, "hk_exp") +
                            getUpdatedValue(item, "security") +
                            getUpdatedValue(item, "electricity") +
                            getUpdatedValue(item, "depreciation_for_25_26") +
                            getUpdatedValue(item, "electrical_consumables_for_25_26") +
                            getUpdatedValue(item, "marketing_for_25_26") +
                            getUpdatedValue(item, "r_and_m_bldg_for_25_26") +
                            getUpdatedValue(item, "r_and_m_others_for_25_26") +
                            (Number(
                              item.other_exp_for_25_26_except_transport_rates_taxes_and_amc
                            ) || 0) +
                            (Number(item.co_exp_for_25_26_15_percent) || 0)
                          )
                        )}
                      </td>

                      <td style={{ ...alignRight, ...rowTextStyle }}>
                        {calculateRowProfitLossPercent(item)}%
                      </td> */}
                    {/* <td style={{ ...alignRight, ...rowTextStyle }}> */}
                    {/* {formatCurrency(item.pnl_for_the_year_2025_26)} */}
                    {/* {formatCurrency(calculateRowPnl(item))}
                    </td> */}
                    <td style={{ ...alignRight, ...rowTextStyle }}>
                      {formatCurrency(calculatePnl(item, getUpdatedValue))}
                    </td>
                    {/* <td style={{ ...alignRight, ...rowTextStyle }}>
                      {item.profit_or_loss_percent_2025_26}% */}
                    {/* {calculateRowPnlPercent(item)}% */}
                    {/* {calculateRowPnlPercent(item)}% */}
                    {/* </td> */}
                    <td style={{ ...alignRight, ...rowTextStyle }}>
                      {calculatePnlPercent(item, getUpdatedValue)}%
                    </td>
                    <td>
                      {editingRow === getRowKey(item) ? (
                        <>
                          <button
                            className="btn btn-success btn-sm me-2"
                            onClick={() => handleSave(item)}
                            title="Save"
                          >
                            <i className="bi bi-check-lg"></i>
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleCancel(item)}
                            title="Cancel"
                          >
                            <i className="bi bi-x-lg"></i>
                          </button>
                        </>
                      ) : (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleEdit(item)}
                          title="Edit"
                        >
                          <i className="bi bi-pencil-square"></i>
                        </button>
                      )}</td>
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

      {/* ✅ PAGINATION */}
      <div className="d-flex justify-content-between align-items-center mt-3">
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
          />

          <button
            className="btn btn-sm btn-secondary"
            onClick={() => {
              const page = Number(jumpValue);
              if (page >= 1 && page <= totalPages) {
                setCurrentPage(page);
              }
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
