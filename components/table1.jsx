// import React, { useState, useEffect, useRef } from "react";
// import "bootstrap-icons/font/bootstrap-icons.css";
// import {
//   calculateRevenue,
//   calculateOperatingExpense,
//   calculateCoExp,
//   calculateTotalExpenditure,
//   calculateTotalExpenditurePercent,
//   calculatePnl,
//   calculatePnlPercent,
//   calculateReceived,
// } from "./calculations";

// function TableView({
//   selectedColumnView,
//   data,
//   totals,
//   avgProfitPercent,
//   filteredData,
//   currentPage,
//   setCurrentPage,
//   jumpValue,
//   editedRows,
//   setJumpValue,
//   setEditedRows,
//   selectedPnlFilter,
//   onPnlFilteredData,
//   pnlActions,
// }) {
//   const [editingRow, setEditingRow] = useState(null);
//   const [originalRows, setOriginalRows] = useState({});

//   const colWidth = 150;
//   const stickyLeft = {
//     state: 0,
//     zone: colWidth,
//     branch: colWidth * 2,
//     agm: colWidth * 3,
//     riname: colWidth * 4,
//   };

//   const thStyle = {
//     background: "#0099e7",
//     color: "#fff",
//     fontSize: "15px",
//     padding: "8px",
//     whiteSpace: "nowrap",
//     textAlign: "center",
//   };

//   const alignRight = { textAlign: "right" };
//   const backgroundApply = { background: "#cfe2ff" };
//   const grandTd = { ...alignRight, ...backgroundApply };

//   const formatCurrency = (num) => {
//     const rounded = Math.round(Number(num) || 0);
//     if (rounded === 0) return "-";
//     return rounded.toLocaleString("en-IN");
//   };

//   const getRowKey = (item) =>
//     `${item.state}_${item.zone}_${item.branch}_${item.agm}_${item.RI}`;

//   const getUpdatedValue = (item, field) => {
//     const rowKey = getRowKey(item);
//     if (editedRows?.[rowKey]?.[field] !== undefined)
//       return Number(editedRows[rowKey][field]) || 0;
//     return Number(item?.[field]) || 0;
//   };

//   // getLivePercent uses current_net_revenue via calculateReceived
//   const getLivePercent = (item) => {
//     const pnlValue = calculatePnl(item, getUpdatedValue);
//     const revenue = calculateReceived(item); // ✅ uses current_net_revenue
//     return revenue > 0 ? Math.round((pnlValue / revenue) * 100) : 0;
//   };

//   // P&L filter
//   const activeBuckets = (selectedPnlFilter || []).map((o) => o.value);
//   const allowedBuckets = pnlActions ? pnlActions.split(",") : [];
//   const effectiveBuckets =
//     activeBuckets.length > 0 ? activeBuckets : allowedBuckets;

//   const pnlFilteredRows = (filteredData || []).filter((item) => {
//     if (effectiveBuckets.length === 0) return true;
//     const percent = getLivePercent(item);
//     return effectiveBuckets.some((bucket) => {
//       if (bucket === "loss") return percent < 0;
//       if (bucket === "zero") return percent === 0;
//       if (bucket === "profit") return percent > 0;
//       return false;
//     });
//   });

//   // Stable ref to avoid infinite loop
//   const onPnlFilteredDataRef = useRef(onPnlFilteredData);
//   useEffect(() => {
//     onPnlFilteredDataRef.current = onPnlFilteredData;
//   }, [onPnlFilteredData]);

//   useEffect(() => {
//     if (onPnlFilteredDataRef.current) {
//       onPnlFilteredDataRef.current(pnlFilteredRows);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [filteredData, selectedPnlFilter, editedRows]);

//   useEffect(() => {
//     setCurrentPage(1);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [selectedPnlFilter]);

//   useEffect(() => {
//     setCurrentPage(1);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [filteredData.length]);

//   // Pagination
//   const rowsPerPage = 100;
//   const startIndex = (currentPage - 1) * rowsPerPage;
//   const paginatedData = pnlFilteredRows.slice(startIndex, startIndex + rowsPerPage);
//   const totalPages = Math.ceil(pnlFilteredRows.length / rowsPerPage);

//   // Editable cell renderer
//   const renderRowCell = (item, field, rowTextStyle) => {
//     const rowKey = getRowKey(item);
//     const isEditing = editingRow === rowKey;
//     const value = editedRows?.[rowKey]?.[field] ?? item?.[field] ?? "";
//     const changed = String(value) !== String(item?.[field] ?? "");
//     return (
//       <td
//         style={{
//           ...rowTextStyle,
//           textAlign: "right",
//           backgroundColor: changed ? "#fff3cd" : "#cfe2ff",
//           fontWeight: changed ? "bold" : "normal",
//         }}
//       >
//         {isEditing ? (
//           <input
//             type="number"
//             value={value}
//             onChange={(e) => handleInputChange(rowKey, field, e.target.value)}
//             style={{
//               width: "100px",
//               padding: "4px",
//               border: "1px solid #0099e7",
//               borderRadius: "4px",
//               background: "#fff",
//             }}
//           />
//         ) : (
//           formatCurrency(value)
//         )}
//       </td>
//     );
//   };

//   // Edit handlers
//   const handleEdit = (item) => {
//     const rowKey = getRowKey(item);
//     const originalData = {
//       salaries_for_25_26: item.salaries_for_25_26 || 0,
//       rent: item.rent || 0,
//       hk_exp: item.hk_exp || 0,
//       security: item.security || 0,
//       electricity: item.electricity || 0,
//       depreciation_for_25_26: item.depreciation_for_25_26 || 0,
//       electrical_consumables_for_25_26: item.electrical_consumables_for_25_26 || 0,
//       marketing_for_25_26: item.marketing_for_25_26 || 0,
//       r_and_m_bldg_for_25_26: item.r_and_m_bldg_for_25_26 || 0,
//       r_and_m_others_for_25_26: item.r_and_m_others_for_25_26 || 0,
//     };
//     setOriginalRows((prev) => ({ ...prev, [rowKey]: originalData }));
//     setEditedRows((prev) => ({
//       ...prev,
//       [rowKey]: { ...originalData, ...(prev[rowKey] || {}) },
//     }));
//     setEditingRow(rowKey);
//   };

//   const handleCancel = (item) => {
//     const rowKey = getRowKey(item);
//     setEditedRows((prev) => ({ ...prev, [rowKey]: originalRows[rowKey] }));
//     setEditingRow(null);
//   };

//   const handleInputChange = (rowKey, field, value) => {
//     const updated = {
//       ...editedRows,
//       [rowKey]: { ...editedRows[rowKey], [field]: value },
//     };
//     setEditedRows(updated);
//     localStorage.setItem("edited_rows", JSON.stringify(updated));
//   };

//   const handleSave = async (item) => {
//     const rowKey = getRowKey(item);
//     const oldData = originalRows?.[rowKey] || {};
//     const newData = editedRows?.[rowKey] || {};
//     const changed_fields = Object.keys(newData).filter(
//       (f) => Number(oldData[f]) !== Number(newData[f])
//     );
//     const payload = {
//       key: rowKey,
//       branch_id: item.branch_id,
//       changed_fields,
//       old_data: oldData,
//       new_data: newData,
//     };
//     try {
//       const response = await fetch(
//         "http://192.168.0.1/sctsadmissions/p_and_l_report_apis.php?endpoint=updated",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(payload),
//         }
//       );
//       const result = await response.json();
//       console.log("Server response:", result);
//       setEditingRow(null);
//     } catch (error) {
//       console.error("Save error:", error);
//     }
//   };

//   // ── Grand-total live aggregations (from pnlFilteredRows) ────────────────
//   const liveTotals = pnlFilteredRows.reduce(
//     (acc, item) => {
//       acc.salaries += getUpdatedValue(item, "salaries_for_25_26");
//       acc.rent += getUpdatedValue(item, "rent");
//       acc.hk_exp += getUpdatedValue(item, "hk_exp");
//       acc.security += getUpdatedValue(item, "security");
//       acc.electricity += getUpdatedValue(item, "electricity");
//       acc.depreciation += getUpdatedValue(item, "depreciation_for_25_26");
//       acc.electrical += getUpdatedValue(item, "electrical_consumables_for_25_26");
//       acc.marketing += getUpdatedValue(item, "marketing_for_25_26");
//       acc.r_and_m_bldg += getUpdatedValue(item, "r_and_m_bldg_for_25_26");
//       acc.r_and_m_others += getUpdatedValue(item, "r_and_m_others_for_25_26");
//       acc.operating_exp += calculateOperatingExpense(item, getUpdatedValue);
//       acc.co_exp += calculateCoExp(item);
//       return acc;
//     },
//     {
//       salaries: 0,
//       rent: 0,
//       hk_exp: 0,
//       security: 0,
//       electricity: 0,
//       depreciation: 0,
//       electrical: 0,
//       marketing: 0,
//       r_and_m_bldg: 0,
//       r_and_m_others: 0,
//       operating_exp: 0,
//       co_exp: 0,
//     }
//   );

//   // Grand total Net Revenue (tuition + app + admission fees)
//   const totalNetRevenue = pnlFilteredRows.reduce((sum, item) => {
//     return (
//       sum +
//       (Number(item.net_tuition_for_25_26) || 0) +
//       (Number(item.application_fee_for_25_26) || 0) +
//       (Number(item.admission_fee_for_25_26) || 0)
//     );
//   }, 0);

//   // ✅ CHANGED: Grand total Net Received now uses current_net_revenue
//   const totalNetReceived = pnlFilteredRows.reduce((sum, item) => {
//     return sum + (Number(item.current_net_revenue) || 0);
//   }, 0);

//   const liveTotalExpenditure =
//     liveTotals.salaries +
//     liveTotals.rent +
//     liveTotals.operating_exp +
//     liveTotals.co_exp;

//   const liveTotalExpenditurePercentage =
//     totalNetRevenue > 0
//       ? Math.round((liveTotalExpenditure / totalNetRevenue) * 100)
//       : 0;

//   // ✅ CHANGED: P&L uses current_net_revenue based totalNetReceived
//   const livePnl = totalNetReceived - liveTotalExpenditure;

//   const liveProfitLossPercentage =
//     totalNetReceived > 0
//       ? Math.round((livePnl / totalNetReceived) * 100)
//       : 0;

//   const liveSalariesPercent =
//     totalNetRevenue > 0
//       ? Math.round((liveTotals.salaries / totalNetRevenue) * 100)
//       : 0;

//   const liveRentPercent =
//     totalNetRevenue > 0
//       ? Math.round((liveTotals.rent / totalNetRevenue) * 100)
//       : 0;

//   // Grand totals for non-editable fields
//   const filteredTotals = pnlFilteredRows.reduce(
//     (acc, item) => {
//       acc.ds += Number(item.ds || 0);
//       acc.res += Number(item.res || 0);
//       acc.total_strength += Number(item.total_strength || 0);
//       acc.avg_fee += Number(item.avg_fee_for_25_26 || 0);
//       acc.net_tuition += Number(item.net_tuition_for_25_26 || 0);
//       // ✅ CHANGED: accumulate current_net_revenue instead of paid_amount
//       acc.current_net_revenue += Number(item.current_net_revenue || 0);
//       acc.application_fee += Number(item.application_fee_for_25_26 || 0);
//       acc.admission_fee += Number(item.admission_fee_for_25_26 || 0);
//       acc.avg_emp_count += Number(item.avg_emp_count || 0);
//       acc.total_rent_sft += Number(item.total_rent_sft || 0);
//       acc.mess_exp += Number(item.mess_exp || 0);
//       acc.water += Number(item.water || 0);
//       acc.other_exp += Number(
//         item.other_exp_for_25_26_except_transport_rates_taxes_and_amc || 0
//       );
//       return acc;
//     },
//     {
//       ds: 0,
//       res: 0,
//       total_strength: 0,
//       avg_fee: 0,
//       net_tuition: 0,
//       application_fee: 0,
//       admission_fee: 0,
//       current_net_revenue: 0, // ✅ CHANGED: was paid_amount
//       avg_emp_count: 0,
//       total_rent_sft: 0,
//       mess_exp: 0,
//       water: 0,
//       other_exp: 0,
//     }
//   );

//   // Sticky helpers
//   const makeStickyTh = (left, zIndex = 50) => ({
//     position: "sticky",
//     left,
//     minWidth: colWidth,
//     maxWidth: colWidth,
//     zIndex,
//     background: "#0099e7",
//     color: "#fff",
//   });

//   const makeStickyGrandTh = (left, zIndex) => ({
//     position: "sticky",
//     left,
//     minWidth: colWidth,
//     maxWidth: colWidth,
//     zIndex,
//     textAlign: "left",
//     borderRight: "2px solid #ddd",
//     background: "#cfe2ff",
//   });

//   const avgFee =
//     Number(filteredTotals.total_strength) > 0
//       ? Math.round(
//           Number(filteredTotals.net_tuition) /
//             Number(filteredTotals.total_strength)
//         )
//       : 0;

//   return (
//     <div>
//       <div
//         className="table-responsive"
//         style={{ maxHeight: "70vh", overflow: "auto" }}
//       >
//         <table className="table table-bordered text-center">
//           <thead
//             style={{
//               position: "sticky",
//               top: 0,
//               zIndex: 300,
//               background: "#0099e7",
//               color: "white",
//             }}
//           >
//             <tr>
//               <th style={makeStickyTh(stickyLeft.state)}>State</th>
//               <th style={makeStickyTh(stickyLeft.zone)}>Zone</th>
//               <th style={makeStickyTh(stickyLeft.branch)}>Branch</th>
//               <th style={makeStickyTh(stickyLeft.agm)}>AGM</th>
//               <th
//                 style={{
//                   position: "sticky",
//                   left: stickyLeft.riname,
//                   zIndex: 46,
//                   background: "#0099e7",
//                   color: "#fff",
//                 }}
//               >
//                 RI Name
//               </th>
//               <th style={thStyle}>State/CBSE</th>
//               <th style={thStyle}>Campus type</th>
//               <th style={thStyle}>Year Of Establishment</th>
//               <th style={thStyle}>No Of Years</th>
//               <th style={thStyle}>Fusion Building Code</th>
//               <th style={thStyle}>DS</th>
//               <th style={thStyle}>RES</th>
//               <th style={thStyle}>Total Strength</th>
//               <th style={thStyle}>Avg Fee</th>
//               <th style={thStyle}>Net Tuition</th>
//               <th style={thStyle}>Application Fee</th>
//               <th style={thStyle}>Admission Fee</th>
//               <th style={thStyle}>Net Revenue</th>
//               <th style={thStyle}>
//                 Current
//                 <br />
//                 Net Revenue
//               </th>
//               {/* ✅ CHANGED: header label kept as "Net Received" but now shows current_net_revenue */}
//               <th style={thStyle}>Net Received</th>
//               <th style={thStyle}>Emp Count</th>
//               <th style={thStyle}>Salaries</th>
//               <th style={thStyle}>Salaries %</th>
//               <th style={thStyle}>Total SFT</th>
//               <th style={thStyle}>Rent</th>
//               <th style={thStyle}>Rent %</th>
//               <th style={thStyle}>Mess</th>
//               <th style={thStyle}>HK</th>
//               <th style={thStyle}>Security</th>
//               <th style={thStyle}>Water</th>
//               <th style={thStyle}>Electricity</th>
//               <th style={thStyle}>Depreciation</th>
//               <th style={thStyle}>Electrical Consumables</th>
//               <th style={thStyle}>Marketing</th>
//               <th style={thStyle}>R&amp;M Bldg</th>
//               <th style={thStyle}>R&amp;M Others</th>
//               <th style={thStyle}>Other Exp</th>
//               <th style={thStyle}>Operating Exp</th>
//               <th style={thStyle}>Over Head Exp</th>
//               <th style={thStyle}>Total Expenditure</th>
//               <th style={thStyle}>Total Expenditure %</th>
//               <th style={thStyle}>P&amp;L</th>
//               <th style={thStyle}>Profit/Loss %</th>
//             </tr>

//             {/* Grand Total row */}
//             <tr style={{ background: "#cfe2ff", fontWeight: "bold" }}>
//               <th style={makeStickyGrandTh(stickyLeft.state, 40)} />
//               <th style={makeStickyGrandTh(stickyLeft.zone, 39)} />
//               <th style={makeStickyGrandTh(stickyLeft.branch, 38)} />
//               <th style={makeStickyGrandTh(stickyLeft.agm, 37)} />
//               <th style={makeStickyGrandTh(stickyLeft.riname, 36)} />
//               <th
//                 colSpan="4"
//                 style={{ textAlign: "center", ...backgroundApply }}
//               >
//                 Grand Total
//               </th>
//               <td style={backgroundApply} />
//               <td style={grandTd}>{formatCurrency(filteredTotals.ds)}</td>
//               <td style={grandTd}>{formatCurrency(filteredTotals.res)}</td>
//               <td style={grandTd}>
//                 {formatCurrency(filteredTotals.total_strength)}
//               </td>
//               <td style={grandTd}>{formatCurrency(avgFee)}</td>
//               <td style={grandTd}>
//                 {formatCurrency(filteredTotals.net_tuition)}
//               </td>
//               <td style={grandTd}>
//                 {formatCurrency(filteredTotals.application_fee)}
//               </td>
//               <td style={grandTd}>
//                 {formatCurrency(filteredTotals.admission_fee)}
//               </td>
//               <td style={grandTd}>{formatCurrency(totalNetRevenue)}</td>
//               {/* Current Net Revenue column */}
//               <td style={grandTd}>
//                 {formatCurrency(filteredTotals.current_net_revenue)}
//               </td>
//               {/* ✅ CHANGED: Net Received grand total now uses current_net_revenue sum */}
//               <td style={grandTd}>{formatCurrency(totalNetReceived)}</td>
//               <td style={grandTd}>
//                 {formatCurrency(filteredTotals.avg_emp_count)}
//               </td>
//               <td style={grandTd}>{formatCurrency(liveTotals.salaries)}</td>
//               <td style={grandTd}>{liveSalariesPercent}%</td>
//               <td style={grandTd}>
//                 {formatCurrency(filteredTotals.total_rent_sft)}
//               </td>
//               <td style={grandTd}>{formatCurrency(liveTotals.rent)}</td>
//               <td style={grandTd}>{liveRentPercent}%</td>
//               <td style={grandTd}>
//                 {formatCurrency(filteredTotals.mess_exp)}
//               </td>
//               <td style={grandTd}>{formatCurrency(liveTotals.hk_exp)}</td>
//               <td style={grandTd}>{formatCurrency(liveTotals.security)}</td>
//               <td style={grandTd}>{formatCurrency(filteredTotals.water)}</td>
//               <td style={grandTd}>
//                 {formatCurrency(liveTotals.electricity)}
//               </td>
//               <td style={grandTd}>
//                 {formatCurrency(liveTotals.depreciation)}
//               </td>
//               <td style={grandTd}>{formatCurrency(liveTotals.electrical)}</td>
//               <td style={grandTd}>{formatCurrency(liveTotals.marketing)}</td>
//               <td style={grandTd}>
//                 {formatCurrency(liveTotals.r_and_m_bldg)}
//               </td>
//               <td style={grandTd}>
//                 {formatCurrency(liveTotals.r_and_m_others)}
//               </td>
//               <td style={grandTd}>
//                 {formatCurrency(filteredTotals.other_exp)}
//               </td>
//               <td style={grandTd}>
//                 {formatCurrency(liveTotals.operating_exp)}
//               </td>
//               <td style={grandTd}>{formatCurrency(liveTotals.co_exp)}</td>
//               <td style={grandTd}>
//                 {formatCurrency(liveTotalExpenditure)}
//               </td>
//               <td style={grandTd}>{liveTotalExpenditurePercentage}%</td>
//               <td style={grandTd}>{formatCurrency(livePnl)}</td>
//               <td
//                 style={{
//                   fontWeight: "bold",
//                   textAlign: "right",
//                   ...backgroundApply,
//                 }}
//               >
//                 {liveProfitLossPercentage}%
//               </td>
//             </tr>
//           </thead>

//           <tbody>
//             {paginatedData.length > 0 ? (
//               paginatedData.map((item, index) => {
//                 const pnlPct = calculatePnlPercent(item, getUpdatedValue);
//                 const rowTextStyle = {
//                   background: "#cfe2ff",
//                   color:
//                     pnlPct > 0 ? "green" : pnlPct < 0 ? "red" : "black",
//                   fontWeight: "500",
//                 };

//                 return (
//                   <tr key={index}>
//                     {[
//                       { left: stickyLeft.state, value: item.state, zIndex: 40 },
//                       { left: stickyLeft.zone, value: item.zone, zIndex: 39 },
//                       {
//                         left: stickyLeft.branch,
//                         value: item.branch,
//                         zIndex: 38,
//                       },
//                       {
//                         left: stickyLeft.agm,
//                         value: item.agm || "-",
//                         zIndex: 37,
//                       },
//                       {
//                         left: stickyLeft.riname,
//                         value: item.RI || "-",
//                         zIndex: 36,
//                       },
//                     ].map(({ left, value, zIndex }, i) => (
//                       <td
//                         key={i}
//                         style={{
//                           position: "sticky",
//                           left,
//                           minWidth: colWidth,
//                           maxWidth: colWidth,
//                           background: "#cfe2ff",
//                           zIndex,
//                           textAlign: "left",
//                           borderRight: "2px solid #ddd",
//                           ...rowTextStyle,
//                         }}
//                       >
//                         {value}
//                       </td>
//                     ))}

//                     <td style={{ ...alignRight, ...rowTextStyle }}>
//                       {item.syllabus || "-"}
//                     </td>
//                     <td style={{ ...alignRight, ...rowTextStyle }}>
//                       {item.ds_res || "-"}
//                     </td>
//                     <td style={{ ...alignRight, ...rowTextStyle }}>
//                       {item.year_establishment}
//                     </td>
//                     <td style={{ ...alignRight, ...rowTextStyle }}>
//                       {item.no_of_years}
//                     </td>
//                     <td style={{ ...alignRight, ...rowTextStyle }}>
//                       {item.fusion_building_code}
//                     </td>
//                     <td style={{ ...alignRight, ...rowTextStyle }}>
//                       {formatCurrency(item.ds)}
//                     </td>
//                     <td style={{ ...alignRight, ...rowTextStyle }}>
//                       {formatCurrency(item.res)}
//                     </td>
//                     <td style={{ ...alignRight, ...rowTextStyle }}>
//                       {formatCurrency(item.total_strength)}
//                     </td>
//                     <td style={{ ...alignRight, ...rowTextStyle }}>
//                       {formatCurrency(item.avg_fee_for_25_26)}
//                     </td>
//                     <td style={{ ...alignRight, ...rowTextStyle }}>
//                       {formatCurrency(item.net_tuition_for_25_26)}
//                     </td>
//                     <td style={{ ...alignRight, ...rowTextStyle }}>
//                       {formatCurrency(item.application_fee_for_25_26)}
//                     </td>
//                     <td style={{ ...alignRight, ...rowTextStyle }}>
//                       {formatCurrency(item.admission_fee_for_25_26)}
//                     </td>
//                     <td style={{ ...alignRight, ...rowTextStyle }}>
//                       {formatCurrency(calculateRevenue(item))}
//                     </td>
                    
//                     {/* Current Net Revenue column */}
//                     <td style={{ ...alignRight, ...rowTextStyle }}>
//                       {formatCurrency(item.current_net_revenue)}
//                     </td>
//                     {/* ✅ CHANGED: Net Received now shows current_net_revenue */}
//                     <td style={{ ...alignRight, ...rowTextStyle }}>
//                       {formatCurrency(item.paid_amount)}
//                     </td>
//                     <td style={{ ...alignRight, ...rowTextStyle }}>
//                       {formatCurrency(item.avg_emp_count)}
//                     </td>

//                     {renderRowCell(item, "salaries_for_25_26", rowTextStyle)}
//                     <td style={{ ...alignRight, ...rowTextStyle }}>
//                       {item.salaries_percent_for_25_26}%
//                     </td>
//                     <td style={{ ...alignRight, ...rowTextStyle }}>
//                       {formatCurrency(item.total_rent_sft)}
//                     </td>
//                     {renderRowCell(item, "rent", rowTextStyle)}
//                     <td style={{ ...alignRight, ...rowTextStyle }}>
//                       {item.rentper || 0}%
//                     </td>
//                     <td style={{ ...alignRight, ...rowTextStyle }}>
//                       {formatCurrency(item.mess_exp)}
//                     </td>
//                     {renderRowCell(item, "hk_exp", rowTextStyle)}
//                     {renderRowCell(item, "security", rowTextStyle)}
//                     <td style={{ ...alignRight, ...rowTextStyle }}>
//                       {formatCurrency(item.water)}
//                     </td>
//                     {renderRowCell(item, "electricity", rowTextStyle)}
//                     {renderRowCell(item, "depreciation_for_25_26", rowTextStyle)}
//                     {renderRowCell(
//                       item,
//                       "electrical_consumables_for_25_26",
//                       rowTextStyle
//                     )}
//                     {renderRowCell(item, "marketing_for_25_26", rowTextStyle)}
//                     {renderRowCell(
//                       item,
//                       "r_and_m_bldg_for_25_26",
//                       rowTextStyle
//                     )}
//                     {renderRowCell(
//                       item,
//                       "r_and_m_others_for_25_26",
//                       rowTextStyle
//                     )}
//                     <td style={{ ...alignRight, ...rowTextStyle }}>
//                       {formatCurrency(
//                         item.other_exp_for_25_26_except_transport_rates_taxes_and_amc
//                       )}
//                     </td>
//                     <td style={{ ...alignRight, ...rowTextStyle }}>
//                       {formatCurrency(
//                         calculateOperatingExpense(item, getUpdatedValue)
//                       )}
//                     </td>
//                     <td style={{ ...alignRight, ...rowTextStyle }}>
//                       {formatCurrency(item.co_exp_for_25_26_15_percent)}
//                     </td>
//                     <td style={{ ...alignRight, ...rowTextStyle }}>
//                       {formatCurrency(
//                         calculateTotalExpenditure(item, getUpdatedValue)
//                       )}
//                     </td>
//                     <td style={{ ...alignRight, ...rowTextStyle }}>
//                       {calculateTotalExpenditurePercent(item, getUpdatedValue)}%
//                     </td>
//                     <td style={{ ...alignRight, ...rowTextStyle }}>
//                       {formatCurrency(calculatePnl(item, getUpdatedValue))}
//                     </td>
//                     <td style={{ ...alignRight, ...rowTextStyle }}>
//                       {calculatePnlPercent(item, getUpdatedValue)}%
//                     </td>
//                   </tr>
//                 );
//               })
//             ) : (
//               <tr>
//                 <td colSpan="100%">❌ No Data Found</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       <div className="d-flex justify-content-between align-items-center mt-3">
//         <div>
//           <strong>Total Rows: {pnlFilteredRows.length}</strong>
//         </div>
//         <div className="d-flex align-items-center gap-2">
//           <button
//             className="btn btn-sm btn-primary"
//             disabled={currentPage === 1}
//             onClick={() => setCurrentPage(currentPage - 1)}
//           >
//             ◀
//           </button>
//           <span>
//             Page {currentPage} / {totalPages}
//           </span>
//           <button
//             className="btn btn-sm btn-primary"
//             disabled={currentPage === totalPages}
//             onClick={() => setCurrentPage(currentPage + 1)}
//           >
//             ▶
//           </button>
//         </div>
//         <div className="d-flex gap-2">
//           <input
//             type="number"
//             placeholder="Go to page"
//             value={jumpValue}
//             onChange={(e) => setJumpValue(e.target.value)}
//           />
//           <button
//             className="btn btn-sm btn-secondary"
//             onClick={() => {
//               const page = Number(jumpValue);
//               if (page >= 1 && page <= totalPages) setCurrentPage(page);
//             }}
//           >
//             Go
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default TableView;





import React, { useState, useEffect, useRef } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import {
  calculateRevenue,
  calculateOperatingExpense,
  calculateCoExp,
  calculateTotalExpenditure,
  calculateTotalExpenditurePercent,
  calculatePnl,
  calculatePnlPercent,
  calculateReceived,
} from "./calculations";

function TableView({
  selectedColumnView,
  data,
  totals,
  avgProfitPercent,
  filteredData,
  currentPage,
  setCurrentPage,
  jumpValue,
  editedRows,
  setJumpValue,
  setEditedRows,
  selectedPnlFilter,
  onPnlFilteredData,
  pnlActions,
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
  const backgroundApply = { background: "#cfe2ff" };
  const grandTd = { ...alignRight, ...backgroundApply };

  const formatCurrency = (num) => {
    const rounded = Math.round(Number(num) || 0);
    if (rounded === 0) return "-";
    return rounded.toLocaleString("en-IN");
  };

  const getRowKey = (item) =>
    `${item.state}_${item.zone}_${item.branch}_${item.agm}_${item.RI}`;

  const getUpdatedValue = (item, field) => {
    const rowKey = getRowKey(item);
    if (editedRows?.[rowKey]?.[field] !== undefined)
      return Number(editedRows[rowKey][field]) || 0;
    return Number(item?.[field]) || 0;
  };

  const getLivePercent = (item) => {
    const pnlValue = calculatePnl(item, getUpdatedValue);
    const revenue = calculateReceived(item); // uses current_net_value
    return revenue > 0 ? Math.round((pnlValue / revenue) * 100) : 0;
  };

  // P&L filter
  const activeBuckets = (selectedPnlFilter || []).map((o) => o.value);
  const allowedBuckets = pnlActions ? pnlActions.split(",") : [];
  const effectiveBuckets =
    activeBuckets.length > 0 ? activeBuckets : allowedBuckets;

  const pnlFilteredRows = (filteredData || []).filter((item) => {
    if (effectiveBuckets.length === 0) return true;
    const percent = getLivePercent(item);
    return effectiveBuckets.some((bucket) => {
      if (bucket === "loss") return percent < 0;
      if (bucket === "zero") return percent === 0;
      if (bucket === "profit") return percent > 0;
      return false;
    });
  });

  const onPnlFilteredDataRef = useRef(onPnlFilteredData);
  useEffect(() => {
    onPnlFilteredDataRef.current = onPnlFilteredData;
  }, [onPnlFilteredData]);

  useEffect(() => {
    if (onPnlFilteredDataRef.current) {
      onPnlFilteredDataRef.current(pnlFilteredRows);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredData, selectedPnlFilter, editedRows]);

  useEffect(() => {
    setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPnlFilter]);

  useEffect(() => {
    setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredData.length]);

  // Sorted Data Code
  const sortedData = [...pnlFilteredRows].sort(
        (a, b) => getLivePercent(a, "netpaid") - getLivePercent(b, "netpaid")
    );

  // Pagination
  const rowsPerPage = 100;
  const startIndex = (currentPage - 1) * rowsPerPage;
   const endIndex = startIndex + rowsPerPage;
  const paginatedData = sortedData.slice(startIndex, endIndex);
  // const paginatedData = pnlFilteredRows.slice(startIndex, startIndex + rowsPerPage);
  const totalPages = Math.ceil(pnlFilteredRows.length / rowsPerPage);

  

  // Editable cell renderer
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

  // Edit handlers
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
      (f) => Number(oldData[f]) !== Number(newData[f])
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

  // ── Grand-total live aggregations ────────────────
  const liveTotals = pnlFilteredRows.reduce(
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
      acc.operating_exp += calculateOperatingExpense(item, getUpdatedValue);
      acc.co_exp += calculateCoExp(item);
      return acc;
    },
    {
      salaries: 0, rent: 0, hk_exp: 0, security: 0, electricity: 0,
      depreciation: 0, electrical: 0, marketing: 0,
      r_and_m_bldg: 0, r_and_m_others: 0, operating_exp: 0, co_exp: 0,
    }
  );

  // Grand total Net Revenue = tuition + application + admission
  const totalNetRevenue = pnlFilteredRows.reduce((sum, item) => {
    return (
      sum +
      (Number(item.net_tuition_for_25_26) || 0) +
      (Number(item.application_fee_for_25_26) || 0) +
      (Number(item.admission_fee_for_25_26) || 0)
    );
  }, 0);

  // Grand total Current Net Revenue = sum of current_net_revenue
  const totalCurrentNetRevenue = pnlFilteredRows.reduce((sum, item) => {
    return sum + (Number(item.current_net_revenue) || 0);
  }, 0);

  // Grand total Net Received = sum of paid_amount (actual cash received)
  const totalNetReceived = pnlFilteredRows.reduce((sum, item) => {
    return sum + (Number(item.paid_amount) || 0);
    // return sum + (Number(item.current_net_revenue) || 0);
  }, 0);

  // const totalCurrentNetRevenue = pnlFilteredRows.reduce((sum,item) => {
  //   return sum + (Number(item.current_net_revenue) || 0);
  // }, 0)

  const liveTotalExpenditure =
    liveTotals.salaries +
    liveTotals.rent +
    liveTotals.operating_exp +
    liveTotals.co_exp;

  const liveTotalExpenditurePercentage =
    totalNetRevenue > 0
      ? Math.round((liveTotalExpenditure / totalNetRevenue) * 100)
      : 0;

  // P&L uses Net Received (paid_amount)
  // const livePnl = totalNetReceived - liveTotalExpenditure;
  const livePnl = totalCurrentNetRevenue - liveTotalExpenditure;

  // const liveProfitLossPercentage =
  //   totalNetReceived > 0
  //     ? Math.round((livePnl / totalNetReceived) * 100)
  //     : 0;

  const liveProfitLossPercentage = 
  totalCurrentNetRevenue > 0 
          ? Math.round((livePnl/totalCurrentNetRevenue) * 100)
          :0;

  const liveSalariesPercent =
    totalNetRevenue > 0
      ? Math.round((liveTotals.salaries / totalNetRevenue) * 100)
      : 0;

  const liveRentPercent =
    totalNetRevenue > 0
      ? Math.round((liveTotals.rent / totalNetRevenue) * 100)
      : 0;

  // Grand totals for non-editable fields
  const filteredTotals = pnlFilteredRows.reduce(
    (acc, item) => {
      acc.ds += Number(item.ds || 0);
      acc.res += Number(item.res || 0);
      acc.total_strength += Number(item.total_strength || 0);
      acc.avg_fee += Number(item.avg_fee_for_25_26 || 0);
      acc.net_tuition += Number(item.net_tuition_for_25_26 || 0);
      acc.paid_amount += Number(item.paid_amount || 0);         // Net Received
      acc.current_net_revenue += Number(item.current_net_revenue || 0); // Current Net Revenue
      acc.application_fee += Number(item.application_fee_for_25_26 || 0);
      acc.admission_fee += Number(item.admission_fee_for_25_26 || 0);
      acc.avg_emp_count += Number(item.avg_emp_count || 0);
      acc.total_rent_sft += Number(item.total_rent_sft || 0);
      acc.mess_exp += Number(item.mess_exp || 0);
      acc.water += Number(item.water || 0);
      acc.other_exp += Number(
        item.other_exp_for_25_26_except_transport_rates_taxes_and_amc || 0
      );
      return acc;
    },
    {
      ds: 0, res: 0, total_strength: 0, avg_fee: 0, net_tuition: 0,
      paid_amount: 0,           // Net Received
      current_net_revenue: 0,   // Current Net Revenue
      application_fee: 0, admission_fee: 0,
      avg_emp_count: 0, total_rent_sft: 0,
      mess_exp: 0, water: 0, other_exp: 0,
    }
  );

  // Sticky helpers
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
    background: "#cfe2ff",
  });

  const avgFee =
    Number(filteredTotals.total_strength) > 0
      ? Math.round(
          Number(filteredTotals.net_tuition) /
            Number(filteredTotals.total_strength)
        )
      : 0;

  return (
    <div>
      <div
        className="table-responsive"
        style={{ maxHeight: "70vh", overflow: "auto" }}
      >
        <table className="table table-bordered text-center">
          <thead
            style={{
              position: "sticky",
              top: 0,
              zIndex: 300,
              background: "#0099e7",
              color: "white",
            }}
          >
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
              <th style={thStyle}>Year Of Establishment</th>
              <th style={thStyle}>No Of Years</th>
              <th style={thStyle}>Fusion Building Code</th>
              <th style={thStyle}>DS</th>
              <th style={thStyle}>RES</th>
              <th style={thStyle}>Total Strength</th>
              <th style={thStyle}>Avg Fee</th>
              <th style={thStyle}>Net Tuition</th>
              <th style={thStyle}>Application Fee</th>
              <th style={thStyle}>Admission Fee</th>
              <th style={thStyle}>Net Revenue</th>
              <th style={thStyle}>Current<br />Net Revenue</th>
              <th style={thStyle}>Net Received</th>
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
              <th style={thStyle}>Electrical Consumables</th>
              <th style={thStyle}>Marketing</th>
              <th style={thStyle}>R&amp;M Bldg</th>
              <th style={thStyle}>R&amp;M Others</th>
              <th style={thStyle}>Other Exp</th>
              <th style={thStyle}>Operating Exp</th>
              <th style={thStyle}>Over Head Exp</th>
              <th style={thStyle}>Total Expenditure</th>
              <th style={thStyle}>Total Expenditure %</th>
              <th style={thStyle}>P&amp;L</th>
              <th style={thStyle}>Profit/Loss %</th>
            </tr>

            {/* Grand Total row */}
            <tr style={{ background: "#cfe2ff", fontWeight: "bold" }}>
              <th style={makeStickyGrandTh(stickyLeft.state, 40)} />
              <th style={makeStickyGrandTh(stickyLeft.zone, 39)} />
              <th style={makeStickyGrandTh(stickyLeft.branch, 38)} />
              <th style={makeStickyGrandTh(stickyLeft.agm, 37)} />
              <th style={makeStickyGrandTh(stickyLeft.riname, 36)} />
              <th colSpan="4" style={{ textAlign: "center", ...backgroundApply }}>Grand Total</th>
              <td style={backgroundApply} />
              <td style={grandTd}>{formatCurrency(filteredTotals.ds)}</td>
              <td style={grandTd}>{formatCurrency(filteredTotals.res)}</td>
              <td style={grandTd}>{formatCurrency(filteredTotals.total_strength)}</td>
              <td style={grandTd}>{formatCurrency(avgFee)}</td>
              <td style={grandTd}>{formatCurrency(filteredTotals.net_tuition)}</td>
              <td style={grandTd}>{formatCurrency(filteredTotals.application_fee)}</td>
              <td style={grandTd}>{formatCurrency(filteredTotals.admission_fee)}</td>

              {/* Net Revenue = tuition + app + admission */}
              <td style={grandTd}>{formatCurrency(totalNetRevenue)}</td>

              {/* Current Net Revenue = current_net_revenue field */}
              <td style={grandTd}>{formatCurrency(totalCurrentNetRevenue)}</td>

              {/* Net Received = paid_amount (actual cash) */}
              <td style={grandTd}>{formatCurrency(totalNetReceived)}</td>

              <td style={grandTd}>{formatCurrency(filteredTotals.avg_emp_count)}</td>
              <td style={grandTd}>{formatCurrency(liveTotals.salaries)}</td>
              <td style={grandTd}>{liveSalariesPercent}%</td>
              <td style={grandTd}>{formatCurrency(filteredTotals.total_rent_sft)}</td>
              <td style={grandTd}>{formatCurrency(liveTotals.rent)}</td>
              <td style={grandTd}>{liveRentPercent}%</td>
              <td style={grandTd}>{formatCurrency(filteredTotals.mess_exp)}</td>
              <td style={grandTd}>{formatCurrency(liveTotals.hk_exp)}</td>
              <td style={grandTd}>{formatCurrency(liveTotals.security)}</td>
              <td style={grandTd}>{formatCurrency(filteredTotals.water)}</td>
              <td style={grandTd}>{formatCurrency(liveTotals.electricity)}</td>
              <td style={grandTd}>{formatCurrency(liveTotals.depreciation)}</td>
              <td style={grandTd}>{formatCurrency(liveTotals.electrical)}</td>
              <td style={grandTd}>{formatCurrency(liveTotals.marketing)}</td>
              <td style={grandTd}>{formatCurrency(liveTotals.r_and_m_bldg)}</td>
              <td style={grandTd}>{formatCurrency(liveTotals.r_and_m_others)}</td>
              <td style={grandTd}>{formatCurrency(filteredTotals.other_exp)}</td>
              <td style={grandTd}>{formatCurrency(liveTotals.operating_exp)}</td>
              <td style={grandTd}>{formatCurrency(liveTotals.co_exp)}</td>
              <td style={grandTd}>{formatCurrency(liveTotalExpenditure)}</td>
              <td style={grandTd}>{liveTotalExpenditurePercentage}%</td>
              <td style={grandTd}>{formatCurrency(livePnl)}</td>
              <td style={{ fontWeight: "bold", textAlign: "right", ...backgroundApply }}>
                {liveProfitLossPercentage}%
              </td>
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
                    <td style={{ ...alignRight, ...rowTextStyle }}>{item.fusion_building_code}</td>
                    <td style={{ ...alignRight, ...rowTextStyle }}>{formatCurrency(item.ds)}</td>
                    <td style={{ ...alignRight, ...rowTextStyle }}>{formatCurrency(item.res)}</td>
                    <td style={{ ...alignRight, ...rowTextStyle }}>{formatCurrency(item.total_strength)}</td>
                    <td style={{ ...alignRight, ...rowTextStyle }}>{formatCurrency(item.avg_fee_for_25_26)}</td>
                    <td style={{ ...alignRight, ...rowTextStyle }}>{formatCurrency(item.net_tuition_for_25_26)}</td>
                    <td style={{ ...alignRight, ...rowTextStyle }}>{formatCurrency(item.application_fee_for_25_26)}</td>
                    <td style={{ ...alignRight, ...rowTextStyle }}>{formatCurrency(item.admission_fee_for_25_26)}</td>

                    {/* Net Revenue = tuition + app + admission */}
                    <td style={{ ...alignRight, ...rowTextStyle }}>
                      {formatCurrency(calculateRevenue(item))}
                    </td>

                    {/* Current Net Revenue = current_net_revenue field */}
                    <td style={{ ...alignRight, ...rowTextStyle }}>
                      {formatCurrency(item.current_net_revenue)}
                    </td>

                    {/* Net Received = paid_amount (actual cash received) */}
                    <td style={{ ...alignRight, ...rowTextStyle }}>
                      {formatCurrency(item.paid_amount)}
                    </td>

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
                    <td style={{ ...alignRight, ...rowTextStyle }}>
                      {formatCurrency(calculateOperatingExpense(item, getUpdatedValue))}
                    </td>
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

      {/* Pagination */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <div>
          <strong>Total Rows: {pnlFilteredRows.length}</strong>
        </div>
        <div className="d-flex align-items-center gap-2">
          <button className="btn btn-sm btn-primary"
          disabled = {currentPage === 1}
          onClick={() => setCurrentPage(1)}
          title="First Page"> ««  </button>
          <button
            className="btn btn-sm btn-primary"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            ◀
          </button>
          <span>Page {currentPage} / {totalPages}</span>
          <button
            className="btn btn-sm btn-primary"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            ▶
          </button>
          <button
          className="btn btn-sm btn-primary"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage(totalPages)}
          title="Last Page"> »» </button>
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
