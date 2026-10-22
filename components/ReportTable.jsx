import React from "react";
import { useState } from "react";
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
  setEditedRows
}) {
  const [increasePercent, setIncreasePercent] = useState(100);
  const [editingRow, setEditingRow] = useState(null);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [originalRows, setOriginalRows] = useState({});
  // const [editedRows, setEditedRows] = useState(() => {
  //   return JSON.parse(localStorage.getItem("edited_rows")) || {};
  // });
  // const[editedRows,setEditedRows] = useState({});

  const rowsPerPage = 100;

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  // console.log("editedRows:", editedRows);

  const sortedData = [...filteredData].sort((a, b) => {
    const netA = Math.round(a.total_amount) || 0;
    const expA = Math.round(a.expenditure) || 0;
    const pnlA = netA - expA;

    let percentA = 0;
    if (netA > 0) {
      percentA = (pnlA * 100) / netA;
    }
    const finalPercentA = Math.min(100, Math.max(-100, Math.round(percentA)));

    const netB = Math.round(b.total_amount) || 0;
    const expB = Math.round(b.expenditure) || 0;
    const pnlB = netB - expB;

    let percentB = 0;
    if (netB > 0) {
      percentB = (pnlB * 100) / netB;
    }
    const finalPercentB = Math.min(100, Math.max(-100, Math.round(percentB)));

    return finalPercentA - finalPercentB; // 🔥 SORT BY %
  });

  const currentYear = new Date().getFullYear();
  const paginatedData = sortedData.slice(startIndex, endIndex);


  const colWidth = 150;

  const stickyLeft = {
    state: 0,
    zone: colWidth,
    branch: colWidth * 2,
    agm: colWidth * 3,
    riname: colWidth * 4,
  };

  const yearColStyle = {
    width: "90px",
    minWidth: "90px",
    maxWidth: "90px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  //   1. Identify row
  // 2. Check edit mode
  // 3. Get latest value
  // 4. Highlight changes
  // 5. Show input or text
  const renderRowCell = (item, field, rowTextColor) => {
    const rowKey = getRowKey(item);
    const isEditing = editingRow === rowKey;


    //  const value = isEditing
    // ? editedRows[rowKey]?.[field] ?? item[field] ?? ""
    // // : item[field] ?? "";

    const value =
      editedRows[rowKey]?.[field] ?? item[field] ?? "";

    const changed =
      Number(value) !== Number(item[field] || 0);

    return (
      <td
        style={{
          color: rowTextColor,
          textAlign: "right",
          backgroundColor: changed ? "#fff3cd" : "#cfe2ff",
          fontWeight: changed ? "bold" : "normal",
        }}
      >
        {isEditing ? (
          <input
            type="number"
            value={value ?? ""}
            onChange={(e) =>
              handleInputChange(rowKey, field, e.target.value)
            }
            style={{
              width: "100px",
              background: "#fff8dc",
            }}
          />
        ) : (
          formatCurrency(value)
        )}
      </td>
    );
  };



  const getRowKey = (item) => {
    return `${item.state_name}_${item.zone_name}_${item.BSBranchName}_${item.agm}_${item.ri_name}`;
  };



  // HandleEdit
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

  // const handleSave = async (item) => {
  //   const rowKey = getRowKey(item);
  //   const newValues = editedRows[rowKey];

  //   const payload = {
  //     key: rowKey,
  //     old_data: {
  //       amc: item.amc,
  //       depreciation: item.depreciation,
  //       drivers_charges: item.drivers_charges,
  //       fuel: item.fuel,
  //       hire_charges: item.hire_charges,
  //       insurance: item.insurance,
  //       r_and_m: item.r_and_m,
  //       rates_and_taxes: item.rates_and_taxes,
  //       salaries: item.salaries,
  //       finance_charges: item.finance_charges,
  //       substaff_salaries: item.substaff_salaries,
  //     },
  //     new_data: newValues,
  //   };

  //   // try {
  //   //   await fetch("YOUR_BACKEND_SAVE_URL", {
  //   //     method: "POST",
  //   //     headers: {
  //   //       "Content-Type": "application/json",
  //   //     },
  //   //     body: JSON.stringify(payload),
  //   //   });

  //   try {
  //     const response = await fetch(
  //       "http://192.168.0.1/sctsadmissions/p_and_l_report_apis.php?endpoint=save_report",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(payload),
  //       }
  //     );

  //     const result = await response.json();
  //     console.log("Save response:", result);

  //     localStorage.setItem(
  //       "edited_rows",
  //       JSON.stringify(editedRows)
  //     );

  //     setEditingRow(null);
  //   } catch (error) {
  //     alert("Save failed");
  //   }
  //   setOriginalRows((prev) => {
  //     const updated = { ...prev };
  //     delete updated[rowKey];
  //     return updated;
  //   });
  // };

//   const handleSave = async (item) => {
//   const payload = {
//     id: item.id,
//     oldAmc: item.oldAmc,
//     newAmc: item.newAmc
//   };

//   try {
//     const response = await fetch("http://localhost:5000/update-amc", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify(payload)
//     });

//     const result = await response.json();
//     console.log(result);
//   } catch (error) {
//     console.error("Error:", error);
//   }
// };

// HandleSave Function  
const handleSave = async (item) => {
  const rowKey = getRowKey(item);

  const oldData = originalRows[rowKey];
  const newData = editedRows[rowKey];

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
    const response = await fetch("http://192.168.0.1/sctsadmissions/p_and_l_report_apis.php?updatedata", {
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
  };

  const calculateProfitPercent = (item) => {
    const revenue = Number(item.total_amount) || 0;
    const expenditure = Number(item.expenditure) || 0;

    return revenue > 0
      ? Math.round(((revenue - expenditure) * 100) / revenue)
      : 0;
  };

  
  const getUpdatedValue = (item, field) => {
    const rowKey = getRowKey(item);

    if (editedRows[rowKey]?.[field] !== undefined) {
      return Number(editedRows[rowKey][field]);
    }

    return Number(item[field]) || 0;
  };

  const negativeRows = data.filter(
    (item) => calculateProfitPercent(item) < 0
  );

  const zeroRows = data.filter(
    (item) => calculateProfitPercent(item) === 0
  );

  const positiveRows = data.filter(
    (item) => calculateProfitPercent(item) > 0
  );

  const groupedData = [
    ...negativeRows,
    ...zeroRows,
    ...positiveRows,
  ];


  const liveTotals = filteredData.reduce(
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

      const expenditure =
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
    {
      students: 0,
      revenue: 0,
      amc: 0,
      depreciation: 0,
      drivers: 0,
      fuel: 0,
      hire: 0,
      insurance: 0,
      rm: 0,
      taxes: 0,
      salary: 0,
      finance_charges: 0,
      substaff: 0,
      expenditure: 0,
      pnl: 0,
    }
  );

  let totalPercent = 0;

  if (liveTotals.revenue > 0) {
    totalPercent =
      (liveTotals.pnl * 100) / liveTotals.revenue;
  }

  const finalTotalsPercent = Math.round(totalPercent);



  return (
    <div
      style={{
        maxHeight: "70vh",
        overflow: "auto",
        border: "1px solid #ddd",
        borderRadius: "10px",
        background: "white",
      }}
    >


      <table className="table table-hover text-center shadow table-primary table-bordered">
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
            <th style={{ background: "#0099e7", color: "#fff" }}>
              State/CBSE
            </th>
            <th style={{ background: "#0099e7", color: "#fff" }}>
              Campus type
            </th>
            <th
              style={{
                ...yearColStyle,
                background: "#0099e7",
                color: "#fff",
              }}
              title="Year of establishment"
            >
              Year of establishment
            </th>
            <th style={{ background: "#0099e7", color: "#fff" }}>
              No of years
            </th>
            <th
              style={{
                ...yearColStyle,
                background: "#0099e7",
                color: "#fff",
              }}
              title="Fusion Building Code"
            >
              Fusion Building Code
            </th>
            <th style={{ background: "#0099e7", color: "#fff" }}>
              Students count
            </th>
            <th style={{ background: "#0099e7", color: "#fff" }}>
              {" "}
              Revenue for 25-26
            </th>

            <th style={{ background: "#0099e7", color: "#fff" }}>AMC</th>
            <th style={{ background: "#0099e7", color: "#fff" }}>
              Depreciation
            </th>
            <th style={{ background: "#0099e7", color: "#fff" }}>
              Drivers Batha
            </th>
            <th style={{ background: "#0099e7", color: "#fff" }}>Fuel</th>
            <th style={{ background: "#0099e7", color: "#fff" }}>
              Hire Charges
            </th>
            <th style={{ background: "#0099e7", color: "#fff" }}>
              Insurance
            </th>
            <th style={{ background: "#0099e7", color: "#fff" }}>R & M</th>
            <th style={{ background: "#0099e7", color: "#fff" }}>
              Rates and Taxes
            </th>
            <th style={{ background: "#0099e7", color: "#fff" }}>
              Salaries
            </th>
            <th style={{ background: "#0099e7", color: "#fff" }}>
              Finance Charges
            </th>
            <th style={{ background: "#0099e7", color: "#fff" }}>
              SubStaff Salaries
            </th>
            <th style={{ background: "#0099e7", color: "#fff" }}>
              Total Expenditure @ 25-26
            </th>
            <th style={{ background: "#0099e7", color: "#fff" }}>
              P & L for the year 25-26
            </th>
            <th style={{ background: "#0099e7", color: "#fff" }}>
              P & L Profit or Loss % - 25-26
            </th>
            <th style={{ background: "#0099e7", color: "#fff" }}>Action</th>
          </tr>

          <tr style={{ background:  "#0088d5", fontWeight: "bold" }}>
            {/* <th colSpan="10" style={{ textAlign: "center" }}>
                  Grand Total
                </th> */}
            <th
              style={{
                position: "sticky",
                left: stickyLeft.state,
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
                // background: getRowBg(finalPercent),
              }}
            ></th>

            <th colSpan="5" style={{ textAlign: "center" }}>
              Grand Total
            </th>
            <th style={{ textAlign: "right" }}>{formatCurrency(totals.students)}</th>

            <th style={{ textAlign: "right" }}>
              {formatCurrency(totals.revenue)}
            </th>

            <th style={{ textAlign: "right" }}>
              {/* {formatCurrency(totals.amc)} */}
              {formatCurrency(liveTotals.amc)}
            </th>

            <th style={{ textAlign: "right" }}>
              {/* {formatCurrency(totals.depreciation)} */}
              {formatCurrency(liveTotals.depreciation)}
            </th>

            <th style={{ textAlign: "right" }}>
              {formatCurrency(liveTotals.drivers)}
              {/* {formatCurrency(totals.drivers)} */}
            </th>

            <th style={{ textAlign: "right" }}>
              {formatCurrency(liveTotals.fuel)}
              {/* {formatCurrency(totals.fuel)} */}
            </th>

            <th style={{ textAlign: "right" }}>
              {formatCurrency(liveTotals.hire)}
              {/* {formatCurrency(totals.hire)} */}
            </th>

            <th style={{ textAlign: "right" }}>
              {formatCurrency(liveTotals.insurance)}
              {/* {formatCurrency(totals.insurance)} */}
            </th>

            <th style={{ textAlign: "right" }}>
              {formatCurrency(liveTotals.rm)}
              {/* {formatCurrency(totals.rm)} */}
            </th>

            <th style={{ textAlign: "right" }}>
              {formatCurrency(liveTotals.taxes)}
              {/* {formatCurrency(totals.taxes)} */}
            </th>

            <th style={{ textAlign: "right" }}>
              {formatCurrency(liveTotals.salary)}
              {/* {formatCurrency(totals.salary)} */}
            </th>

            <th style={{ textAlign: "right" }}>
              {formatCurrency(liveTotals.finance_charges)}
              {/* {formatCurrency(totals.finance_charges)} */}
            </th>

            <th style={{ textAlign: "right" }}>
              {formatCurrency(liveTotals.substaff)}
              {/* {formatCurrency(totals.substaff)} */}
            </th>

            <th style={{ textAlign: "right" }}>
              {formatCurrency(liveTotals.expenditure)}
              {/* {formatCurrency(totals.expenditure)} */}
            </th>

            <th style={{ textAlign: "right" }}>
              {formatCurrency(liveTotals.pnl)}
              {/* {formatCurrency(totals.pnl)} */}
            </th>
            

            <th style={{ textAlign: "right" }}> {finalTotalsPercent}%</th>
            <th style={{background:"#cfe2ff"}}></th>

          </tr>
        </thead>

        <tbody>
          {paginatedData.length === 0 ? (
            <tr>
              <td
                colSpan={"100%"}
                style={{ textAlign: "center", padding: "20px" }}
              >
                ❌ No Data Found
              </td>
            </tr>
          ) : (
            paginatedData.map((item, index) => {
              const net25 = Math.round(item.total_amount) || 0;
              const newCost = Math.round(
                net25 * (1 + increasePercent / 100),
              );

              const students = Number(item.student_count) || 0;

              const year = Number(item.established_year) || 0;
              const noOfYears =
                year && year <= currentYear ? currentYear - year : "0";

              // const expenditure = Math.round(item.expenditure || 0);

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
              // console.log(item.BSBranchName, item.expenditure);
              const pnl = net25 - expenditure;
              let percent = 0;

              if (net25 > 0) {
                percent = (pnl * 100) / net25;
              }

              const finalPercent = Math.round(percent);

              const rowTextColor =
                finalPercent > 0
                  ? "green"
                  : finalPercent < 0
                    ? "red"
                    : "black";


              return (
                <tr key={index}>
                  <td
                    style={{
                      position: "sticky",
                      left: stickyLeft.state,
                      minWidth: colWidth,
                      maxWidth: colWidth,
                      left: stickyLeft.state,
                      color: rowTextColor,
                      zIndex: 40,
                      textAlign: "left",
                      borderRight: "2px solid #ddd",
                    }}
                  >
                    {item.state_name}
                  </td>

                  <td
                    style={{
                      position: "sticky",
                      left: stickyLeft.zone,
                      color: rowTextColor,
                      zIndex: 39,
                      textAlign: "left",
                      borderRight: "2px solid #ddd",
                    }}
                  >
                    {item.zone_name}
                  </td>

                  <td
                    style={{
                      position: "sticky",
                      left: stickyLeft.branch,
                      color: rowTextColor,
                      zIndex: 38,
                      textAlign: "left",
                      borderRight: "2px solid #ddd",
                    }}
                  >
                    {item.BSBranchName}
                  </td>

                  <td
                    style={{
                      position: "sticky",
                      left: stickyLeft.agm,
                      color: rowTextColor,
                      zIndex: 37,
                      textAlign: "left",
                      borderRight: "2px solid #ddd",
                    }}
                  >
                    {item.agm || "-"}
                  </td>

                  <td
                    style={{
                      position: "sticky",
                      left: stickyLeft.riname,
                      color: rowTextColor,
                      zIndex: 36,
                      textAlign: "left",
                      borderRight: "2px solid #ddd",
                    }}
                  >
                    {item.ri_name || "-"}
                  </td>
                  <td
                    style={{
                      textAlign: "left",
                      color: rowTextColor,
                    }}
                  >
                    {item.syllabus || "-"}
                  </td>
                  <td
                    style={{
                      textAlign: "left",
                      color: rowTextColor,
                    }}
                  >
                    {item.ds_res || "-"}
                  </td>
                  <td
                    data-bs-toggle="tooltip"
                    style={{
                      ...yearColStyle,
                      textAlign: "right",
                      color: rowTextColor,
                    }}
                  >
                    {year || "-"}
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      color: rowTextColor,
                    }}
                  >
                    {noOfYears}
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      color: rowTextColor,
                    }}
                  >
                    {item.fusion_building_code || "0"}
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      color: rowTextColor,
                    }}
                  >
                    {formatCurrency(students)}
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      color: rowTextColor,
                    }}
                  >
                    {formatCurrency(net25)}
                  </td>
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

                  <td
                    style={{
                      textAlign: "right",
                      color: rowTextColor,
                      // background: getRowBg(finalPercent),
                    }}
                  >
                    {formatCurrency(expenditure)}
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      color: rowTextColor,
                      // background: getRowBg(finalPercent),
                    }}
                  >
                    {formatCurrency(pnl)}
                  </td>
                  <td
                    style={{
                      color: rowTextColor,
                      fontWeight: "bold",
                      textAlign: "right",
                    }}
                  >
                    {finalPercent}%
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
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  )
}

export default ReportTable;