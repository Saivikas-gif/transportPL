import React from "react";
import { useState } from "react";

function TableView({
  selectedColumnView,
  data,
  totals,
  avgProfitPercent,
  totalRows,
  currentPage,
  totalPages,
  setCurrentPage,
  jumpValue,
  setJumpValue,
}) {
  const [editableData, setEditableData] = React.useState(() => {
    const saved = localStorage.getItem("editedTableData");
    return saved ? JSON.parse(saved) : {};
  });

  const [editingCell, setEditingCell] = React.useState(null);

  React.useEffect(() => {
    localStorage.setItem("editedTableData", JSON.stringify(editableData));
  }, [editableData]);

  // const colWidth = {
  //   state:80,
  //   zone: 120,
  //   branch: 160,
  // };

  // const thStyle = {
  //   background: "#0099e7",
  //   color: "#fff",
  //   fontSize: "15px",
  //   padding: "8px",
  //   whiteSpace: "nowrap",
  //   textAlign: "center",
  // };

  // const stickyHeader = {
  //   position: "sticky",
  //   top: 0,
  //   zIndex: 5,
  //   boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
  // };

  const colWidth = 150;

  const stickyLeft = {
    state: 0,
    zone: colWidth,
    branch: colWidth * 2,
    agm: colWidth * 3,
    riname: colWidth * 4,
  };


  // const stickyCol = {
  //   position : "sticky",
  //   left : 0,
  //   zindex: 10,
  //   background : "#0099e7",
  //   minwidth:colWidth.state,
  // };
  // const stickyCol1 = {
  //   position: "sticky",
  //   left: colWidth.state,
  //   zIndex: 6,
  //   background: "#0099e7",
  //   minWidth: colWidth.zone,
  // };

  // const stickyCol2 = {
  //   position: "sticky",
  //   left: colWidth.branch,
  //   zIndex: 6,
  //   background: "#0099e7",
  //   minWidth: colWidth.branch,
  // };

  // const stickyBody = {
  //   position : "sticky",
  //   left:0,
  //   background: " #00a3b7",
  //   zindex:6,
  //   minWidth:colWidth.state,
  //   textAlign:"left"
  // }
  // const stickyBody1 = {
  //   position: "sticky",
  //   left: colWidth.state,
  //   background: "#00a3b7",
  //   color: "#fff",
  //   zIndex: 4,
  //   minWidth: colWidth.zone,
  //   textAlign: "left",
  // };

  // const stickyBody2 = {
  //   position: "sticky",
  //   left: colWidth.zone,
  //   backgroundColor: "#00a3b7",
  //   color: "#fff",
  //   zIndex: 4,
  //   minWidth: colWidth.branch,
  //   textAlign: "left",
  // };
  // const heading = {
  //   textAlign: "left",
  // };
  // const alignRight = {
  //   textAlign: "right",
  // };



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

  return (
    <div>
      {/* TABLE */}
      <div
        className="table-responsive"
        style={{ maxHeight: "70vh", overflow: "auto" }}
      >
        <table className="table table-bordered text-center">
          <thead 
          style={stickyHeader}>
            <tr>
              {/* <th style={{...thStyle,...stickyCol }}>State</th> */}
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
              <th style={{ ...thStyle, ...stickyCol1 }}>Zone</th>
              <th style={{ ...thStyle, ...stickyCol2 }}>Branch</th>
                 <th style={thStyle}>AGM</th>
                  <th style={thStyle}>RI</th>

              {/* <th style={thStyle}>Metro / City / Rural</th> */}
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
            </tr>
            <tr style={{ background: "#fff3cd", fontWeight: "bold" }}>
              <td style={stickyBody1}></td>
              <td style={stickyBody2}></td>
              <td colSpan="6">TOTAL</td>

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
                {formatCurrency(totals.salaries)}
              </td>
              <td style={{ textAlign: "right" }}>
                {formatCurrency(totalsSalariesPersentage)}%
              </td>

              <td style={{ textAlign: "right" }}>
                {formatCurrency(totals.total_rent_sft)}
              </td>
              <td style={{ textAlign: "right" }}>
                {formatCurrency(totals.rent)}
              </td>
              <td style={{ textAlign: "right" }}>
                {formatCurrency(totalsRentPersentage)}%
              </td>

              <td style={{ textAlign: "right" }}>
                {formatCurrency(totals.mess_exp)}
              </td>
              <td style={{ textAlign: "right" }}>
                {formatCurrency(totals.hk_exp)}
              </td>

              <td style={{ textAlign: "right" }}>
                {formatCurrency(totals.security)}
              </td>
              <td style={{ textAlign: "right" }}>
                {formatCurrency(totals.water)}
              </td>
              <td style={{ textAlign: "right" }}>
                {formatCurrency(totals.electricity)}
              </td>

              <td style={{ textAlign: "right" }}>
                {formatCurrency(totals.depreciation)}
              </td>
              <td style={{ textAlign: "right" }}>
                {formatCurrency(totals.electrical)}
              </td>
              <td style={{ textAlign: "right" }}>
                {formatCurrency(totals.marketing)}
              </td>

              <td style={{ textAlign: "right" }}>
                {formatCurrency(totals.r_and_m_bldg)}
              </td>
              <td style={{ textAlign: "right" }}>
                {formatCurrency(totals.r_and_m_others)}
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
                {formatCurrency(totals.total_expenditure)}
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
                {total_profit_or_loss_percent_2025_26}%
              </td>
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

                return (
                  <tr key={index}>
                    <td style={{...stickyBody, ...rowTextStyle}}>{item.state}</td>
                    <td style={{ ...stickyBody1, ...rowTextStyle }}>
                      {item.zone}
                    </td>
                    <td style={{ ...stickyBody2, ...rowTextStyle }}>
                      {item.branch}
                    </td>
                    {/* <td style={{ ...heading, ...rowTextStyle }}>
                      {item.state}
                    </td> */}
                    <td style={{ ...heading, ...rowTextStyle }}>
                      {item.location}
                    </td>

                    <td style={{ ...heading, ...rowTextStyle }}>
                      {item.RI || "-"}
                    </td>

                    <td style={{ ...heading, ...rowTextStyle }}>
                      {item.agm || "-"}
                    </td>
                    <td style={{ ...alignRight, ...rowTextStyle }}>
                      {item.year_establishment}
                    </td>
                    <td style={{ ...alignRight, ...rowTextStyle }}>
                      {item.no_of_years}
                    </td>
                    <td style={{...alignRight,...rowTextStyle}}>
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
                    <td style={{ ...alignRight, ...rowTextStyle }}>
                      {formatCurrency(item.salaries_for_25_26)}
                    </td>
                    <td style={{ ...alignRight, ...rowTextStyle }}>
                      {item.salaries_percent_for_25_26}%
                    </td>
                    <td style={{ ...alignRight, ...rowTextStyle }}>
                      {formatCurrency(item.total_rent_sft)}
                    </td>
                    <td style={{ ...alignRight, ...rowTextStyle }}>
                      {formatCurrency(item.rent)}
                    </td>
                    <td style={{ ...alignRight, ...rowTextStyle }}>
                      {item.rentper || 0}%
                    </td>
                    <td style={{ ...alignRight, ...rowTextStyle }}>
                      {formatCurrency(item.mess_exp)}
                    </td>
                    <td style={{ ...alignRight, ...rowTextStyle }}>
                      {formatCurrency(item.hk_exp)}
                    </td>
                    <td style={{ ...alignRight, ...rowTextStyle }}>
                      {formatCurrency(item.security)}
                    </td>
                    <td style={{ ...alignRight, ...rowTextStyle }}>
                      {formatCurrency(item.water)}
                    </td>
                    <td style={{ ...alignRight, ...rowTextStyle }}>
                      {formatCurrency(item.electricity)}
                    </td>
                    <td style={{ ...alignRight, ...rowTextStyle }}>
                      {formatCurrency(item.depreciation_for_25_26)}
                    </td>
                    <td style={{ ...alignRight, ...rowTextStyle }}>
                      {formatCurrency(item.electrical_consumables_for_25_26)}
                    </td>
                    <td style={{ ...alignRight, ...rowTextStyle }}>
                      {formatCurrency(item.marketing_for_25_26)}
                    </td>
                    <td style={{ ...alignRight, ...rowTextStyle }}>
                      {formatCurrency(item.r_and_m_bldg_for_25_26)}
                    </td>
                    <td style={{ ...alignRight, ...rowTextStyle }}>
                      {formatCurrency(item.r_and_m_others_for_25_26)}
                    </td>
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
                    <td style={{ ...alignRight, ...rowTextStyle }}>
                      {formatCurrency(item.total_expenditure_25_26)}
                    </td>
                    <td style={{ ...alignRight, ...rowTextStyle }}>
                      {item.total_expenditure_25_26_percent}%
                    </td>
                    <td style={{ ...alignRight, ...rowTextStyle }}>
                      {formatCurrency(item.pnl_for_the_year_2025_26)}
                    </td>
                    <td style={{ ...alignRight, ...rowTextStyle }}>
                      {item.profit_or_loss_percent_2025_26}%
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
