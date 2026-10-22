// // // // Import React core and the useMemo hook for memoised calculations
// // // import React, { useMemo } from "react";

// // // // ============================================================
// // // // EXPENDITURE FIELDS CONSTANT
// // // // Must match EXPENDITURE_FIELDS / getUpdatedValue in ReportTable.jsx
// // // // ============================================================

// // // const EXPENDITURE_FIELDS = [
// // //   "amc",
// // //   "depreciation",
// // //   "drivers_charges",
// // //   "fuel",
// // //   "hire_charges",
// // //   "insurance",
// // //   "r_and_m",
// // //   "rates_and_taxes",
// // //   "salaries",
// // //   "finance_charges",
// // //   "substaff_salaries",
// // // ];

// // // // ============================================================
// // // // GLASSCARD SUB-COMPONENT
// // // // ============================================================

// // // function GlassCard({ title, value, color }) {
// // //   return (
// // //     <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12 mb-3">
// // //       <div
// // //         style={{
// // //           background: color,
// // //           borderRadius: "14px",
// // //           padding: "14px",
// // //           color: "#fff",
// // //           height: "105px",
// // //           boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
// // //           display: "flex",
// // //           flexDirection: "column",
// // //           justifyContent: "center",
// // //           alignItems: "center",
// // //           textAlign: "center",
// // //         }}
// // //       >
// // //         <h6 style={{ fontSize: "13px", fontWeight: "600", marginBottom: "8px" }}>
// // //           {title}
// // //         </h6>
// // //         <h4 style={{ fontSize: "18px", fontWeight: "bold", margin: 0, whiteSpace: "nowrap" }}>
// // //           {value}
// // //         </h4>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // // ============================================================
// // // // KPICARDS MAIN COMPONENT
// // // // ============================================================

// // // function KPICards({
// // //   // Same array as ReportTable's `filteredData` prop (pre-bucket-filter rows)
// // //   filteredData = [],

// // //   // Edited values keyed by getRowKey(item) -> { field: value }
// // //   editedRows = {},

// // //   // Currently selected P&L filter options: [{ value: "profit"|"loss"|"zero" }]
// // //   selectedPnlFilter = [],

// // //   // Comma-separated allowed buckets (from DB/user permissions), used as fallback
// // //   pnlActions = "",
// // // }) {

// // //   // ==========================================================
// // //   // -- SECTION 1: FORMAT HELPER ------------------------------
// // //   // ==========================================================

// // //   const formatCurrency = (num) => {
// // //     const rounded = Math.round(Number(num) || 0);
// // //     if (rounded === 0) return "-";
// // //     return rounded.toLocaleString("en-IN");
// // //   };

// // //   // ==========================================================
// // //   // -- SECTION 2: ROW KEY GENERATOR --------------------------
// // //   // MUST be identical to getRowKey() in ReportTable.jsx
// // //   // ==========================================================

// // //   const getRowKey = (item) =>
// // //     `${item.state_name}_${item.zone_name}_${item.BSBranchName}_${item.agm}_${item.ri_name}`;

// // //   // ==========================================================
// // //   // -- SECTION 3: UPDATED VALUE GETTER -----------------------
// // //   // MUST match getUpdatedValue() in ReportTable.jsx exactly
// // //   // ==========================================================

// // //   const getUpdatedValue = (item, field) => {
// // //     const rowKey = getRowKey(item);

// // //     if (editedRows?.[rowKey]?.[field] !== undefined) {
// // //       return Number(editedRows[rowKey][field]) || 0;
// // //     }

// // //     return Number(item?.[field]) || 0;
// // //   };

// // //   // ==========================================================
// // //   // -- SECTION 4: CALCULATION HELPERS ------------------------
// // //   // Mirrors ReportTable: revenue = total_amount,
// // //   // net_paid (received) = paid_amount, pnl = net_paid - expenditure
// // //   // ==========================================================

// // //   const calculateRevenue = (item) => Number(item?.total_amount) || 0;

// // //   const calculateReceived = (item) => Number(item?.paid_amount) || 0;

// // //   const calculateTotalExpenditure = (item, getUpdatedValueFn) =>
// // //     EXPENDITURE_FIELDS.reduce(
// // //       (sum, field) => sum + getUpdatedValueFn(item, field),
// // //       0
// // //     );

// // //   const calculatePnl = (item, getUpdatedValueFn) =>
// // //     calculateReceived(item) - calculateTotalExpenditure(item, getUpdatedValueFn);

// // //   // ==========================================================
// // //   // -- SECTION 5: FILTER LOGIC --------------------------------
// // //   // Mirrors ReportTable's effectiveBuckets logic
// // //   // ==========================================================

// // //   const activeBuckets = (selectedPnlFilter || []).map((o) => o.value);

// // //   const allowedBuckets = pnlActions ? pnlActions.split(",") : [];

// // //   const effectiveBuckets =
// // //     activeBuckets.length > 0 ? activeBuckets : allowedBuckets;

// // //   // ==========================================================
// // //   // -- SECTION 6: LIVE PER-ROW P&L % --------------------------
// // //   // percent = (pnl / net_paid) * 100, based on getLivePercent(item,"netpaid")
// // //   // ==========================================================

// // //   const getLivePercent = (item) => {
// // //     const pnlValue = calculatePnl(item, getUpdatedValue);
// // //     const received = calculateReceived(item);

// // //     return received > 0
// // //       ? Math.round((pnlValue / received) * 100)
// // //       : 0;
// // //   };

// // //   // ==========================================================
// // //   // -- SECTION 7: APPLY P&L BUCKET FILTER ---------------------
// // //   // ==========================================================

// // //   const pnlFilteredRows = useMemo(() => {
// // //     return (filteredData || []).filter((item) => {

// // //       if (effectiveBuckets.length === 0) return true;

// // //       const percent = getLivePercent(item);

// // //       return effectiveBuckets.some((bucket) => {
// // //         if (bucket === "loss") return percent < 0;
// // //         else if (bucket === "zero") return percent === 0;
// // //         else if (bucket === "profit") return percent > 0;
// // //         return false;
// // //       });
// // //     });
// // //   }, [filteredData, editedRows, selectedPnlFilter, pnlActions]);

// // //   // ==========================================================
// // //   // -- SECTION 8: LIVE TOTALS CALCULATION ---------------------
// // //   // ==========================================================

// // //   const liveTotals = useMemo(() => {
// // //     return pnlFilteredRows.reduce(
// // //       (acc, item) => {
// // //         const students = Number(item.student_count) || 0;
// // //         const revenue = calculateRevenue(item);
// // //         const received = calculateReceived(item);
// // //         const expenditure = calculateTotalExpenditure(item, getUpdatedValue);
// // //         const pnl = calculatePnl(item, getUpdatedValue);

// // //         acc.students += students;
// // //         acc.revenue += revenue;
// // //         acc.received += received;
// // //         acc.expenditure += expenditure;
// // //         acc.pnl += pnl;

// // //         return acc;
// // //       },
// // //       {
// // //         students: 0,
// // //         revenue: 0,
// // //         received: 0,
// // //         expenditure: 0,
// // //         pnl: 0,
// // //       }
// // //     );
// // //   }, [pnlFilteredRows, editedRows]);

// // //   // ==========================================================
// // //   // -- SECTION 9: P&L PERCENTAGE -------------------------------
// // //   // Matches ReportTable's finalTotalsPercent (denominator = net_paid)
// // //   // ==========================================================

// // //   const liveProfitLossPercentage =
// // //     liveTotals.received > 0
// // //       ? Math.round((liveTotals.pnl / liveTotals.received) * 100)
// // //       : 0;

// // //   // ==========================================================
// // //   // -- SECTION 10: RENDER --------------------------------------
// // //   // ==========================================================

// // //   return (
// // //     <div className="container-fluid mb-4">
// // //       <div className="row">

// // //         <GlassCard
// // //           title="Student Count"
// // //           value={formatCurrency(liveTotals.students)}
// // //           color="linear-gradient(135deg, #2563eb, #1e40af)"
// // //         />

// // //         <GlassCard
// // //           title="Net Revenue"
// // //           value={`₹ ${formatCurrency(liveTotals.revenue)}`}
// // //           color="linear-gradient(135deg, #059669, #047857)"
// // //         />

// // //         <GlassCard
// // //           title="Net Received"
// // //           value={`₹ ${formatCurrency(liveTotals.received)}`}
// // //           color="linear-gradient(135deg, #f59e0b, #d97706)"
// // //         />

// // //         <GlassCard
// // //           title="Total Expenditure"
// // //           value={`₹ ${formatCurrency(liveTotals.expenditure)}`}
// // //           color="linear-gradient(135deg, #7c3aed, #5b21b6)"
// // //         />

// // //         <GlassCard
// // //           title="P & L"
// // //           value={`₹ ${formatCurrency(liveTotals.pnl)}`}
// // //           color={
// // //             liveTotals.pnl >= 0
// // //               ? "linear-gradient(135deg, #10b981, #047857)"
// // //               : "linear-gradient(135deg, #06b6d4, #0e7490)"
// // //           }
// // //         />

// // //         <GlassCard
// // //           title="Profit / Loss %"
// // //           value={`${liveProfitLossPercentage}%`}
// // //           color={
// // //             liveProfitLossPercentage >= 0
// // //               ? "linear-gradient(135deg, #43e97b, #38f9d7)"
// // //               : "linear-gradient(135deg, #dc2626, #991b1b)"
// // //           }
// // //         />

// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // export default KPICards;


// // // Import React core and the useMemo hook for memoised calculations
// // import React, { useMemo } from "react";

// // // ============================================================
// // // EXPENDITURE FIELDS CONSTANT
// // // Must match EXPENDITURE_FIELDS / getUpdatedValue in ReportTable.jsx
// // // ============================================================

// // const EXPENDITURE_FIELDS = [
// //   "amc",
// //   "depreciation",
// //   "drivers_charges",
// //   "fuel",
// //   "hire_charges",
// //   "insurance",
// //   "r_and_m",
// //   "rates_and_taxes",
// //   "salaries",
// //   "finance_charges",
// //   "substaff_salaries",
// // ];

// // // ============================================================
// // // GLASSCARD SUB-COMPONENT
// // // ============================================================

// // function GlassCard({ title, value, color }) {
// //   return (
// //     <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12 mb-3">
// //       <div
// //         style={{
// //           background: color,
// //           borderRadius: "14px",
// //           padding: "14px",
// //           color: "#fff",
// //           height: "105px",
// //           boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
// //           display: "flex",
// //           flexDirection: "column",
// //           justifyContent: "center",
// //           alignItems: "center",
// //           textAlign: "center",
// //         }}
// //       >
// //         <h6 style={{ fontSize: "13px", fontWeight: "600", marginBottom: "8px" }}>
// //           {title}
// //         </h6>
// //         <h4 style={{ fontSize: "18px", fontWeight: "bold", margin: 0, whiteSpace: "nowrap" }}>
// //           {value}
// //         </h4>
// //       </div>
// //     </div>
// //   );
// // }

// // // ============================================================
// // // KPICARDS MAIN COMPONENT
// // //
// // // Props passed from App.jsx:
// // //   pnlFilteredData — rows already filtered by ReportTable's
// // //                      P&L bucket logic (the rows visible in the table)
// // //   editedRows      — user-edited expenditure values, same shape
// // //                      as used by ReportTable
// // // ============================================================

// // function KPICards({
// //   pnlFilteredData = [],
// //   editedRows = {},
// // }) {

// //   // ==========================================================
// //   // -- SECTION 1: FORMAT HELPER ------------------------------
// //   // ==========================================================

// //   const formatCurrency = (num) => {
// //     const rounded = Math.round(Number(num) || 0);
// //     if (rounded === 0) return "-";
// //     return rounded.toLocaleString("en-IN");
// //   };

// //   // ==========================================================
// //   // -- SECTION 2: ROW KEY GENERATOR --------------------------
// //   // MUST be identical to getRowKey() in ReportTable.jsx
// //   // ==========================================================

// //   const getRowKey = (item) =>
// //     `${item.state_name}_${item.zone_name}_${item.BSBranchName}_${item.agm}_${item.ri_name}`;

// //   // ==========================================================
// //   // -- SECTION 3: UPDATED VALUE GETTER -----------------------
// //   // MUST match getUpdatedValue() in ReportTable.jsx exactly
// //   // ==========================================================

// //   const getUpdatedValue = (item, field) => {
// //     const rowKey = getRowKey(item);

// //     if (editedRows?.[rowKey]?.[field] !== undefined) {
// //       return Number(editedRows[rowKey][field]) || 0;
// //     }

// //     return Number(item?.[field]) || 0;
// //   };

// //   // ==========================================================
// //   // -- SECTION 4: CALCULATION HELPERS ------------------------
// //   // Mirrors ReportTable: revenue = total_amount,
// //   // net_paid (received) = paid_amount, pnl = net_paid - expenditure
// //   // ==========================================================

// //   const calculateRevenue = (item) => Number(item?.total_amount) || 0;

// //   const calculateReceived = (item) => Number(item?.paid_amount) || 0;

// //   const calculateTotalExpenditure = (item, getUpdatedValueFn) =>
// //     EXPENDITURE_FIELDS.reduce(
// //       (sum, field) => sum + getUpdatedValueFn(item, field),
// //       0
// //     );

// //   const calculatePnl = (item, getUpdatedValueFn) =>
// //     calculateReceived(item) - calculateTotalExpenditure(item, getUpdatedValueFn);

// //   // ==========================================================
// //   // -- SECTION 5: LIVE TOTALS CALCULATION ---------------------
// //   // pnlFilteredData is ALREADY filtered by ReportTable's P&L
// //   // bucket logic, so we just sum across it directly — this
// //   // guarantees the cards always match the Grand Total row.
// //   // ==========================================================

// //   const liveTotals = useMemo(() => {
// //     return (pnlFilteredData || []).reduce(
// //       (acc, item) => {
// //         const students = Number(item.student_count) || 0;
// //         const revenue = calculateRevenue(item);
// //         const received = calculateReceived(item);
// //         const expenditure = calculateTotalExpenditure(item, getUpdatedValue);
// //         const pnl = calculatePnl(item, getUpdatedValue);

// //         acc.students += students;
// //         acc.revenue += revenue;
// //         acc.received += received;
// //         acc.expenditure += expenditure;
// //         acc.pnl += pnl;

// //         return acc;
// //       },
// //       {
// //         students: 0,
// //         revenue: 0,
// //         received: 0,
// //         expenditure: 0,
// //         pnl: 0,
// //       }
// //     );
// //   }, [pnlFilteredData, editedRows]);

// //   // ==========================================================
// //   // -- SECTION 6: P&L PERCENTAGE -------------------------------
// //   // Matches ReportTable's finalTotalsPercent (denominator = net_paid)
// //   // ==========================================================

// //   const liveProfitLossPercentage =
// //     liveTotals.received > 0
// //       ? Math.round((liveTotals.pnl / liveTotals.received) * 100)
// //       : 0;

// //   // ==========================================================
// //   // -- SECTION 7: RENDER --------------------------------------
// //   // ==========================================================

// //   return (
// //     <div className="container-fluid mb-4">
// //       <div className="row">

// //         <GlassCard
// //           title="Student Count"
// //           value={formatCurrency(liveTotals.students)}
// //           color="linear-gradient(135deg, #2563eb, #1e40af)"
// //         />

// //         <GlassCard
// //           title="Net Revenue"
// //           value={`₹ ${formatCurrency(liveTotals.revenue)}`}
// //           color="linear-gradient(135deg, #059669, #047857)"
// //         />

// //         <GlassCard
// //           title="Net Received"
// //           value={`₹ ${formatCurrency(liveTotals.received)}`}
// //           color="linear-gradient(135deg, #f59e0b, #d97706)"
// //         />

// //         <GlassCard
// //           title="Total Expenditure"
// //           value={`₹ ${formatCurrency(liveTotals.expenditure)}`}
// //           color="linear-gradient(135deg, #7c3aed, #5b21b6)"
// //         />

// //         <GlassCard
// //           title="P & L"
// //           value={`₹ ${formatCurrency(liveTotals.pnl)}`}
// //           color={
// //             liveTotals.pnl >= 0
// //               ? "linear-gradient(135deg, #10b981, #047857)"
// //               : "linear-gradient(135deg, #06b6d4, #0e7490)"
// //           }
// //         />

// //         <GlassCard
// //           title="Profit / Loss %"
// //           value={`${liveProfitLossPercentage}%`}
// //           color={
// //             liveProfitLossPercentage >= 0
// //               ? "linear-gradient(135deg, #43e97b, #38f9d7)"
// //               : "linear-gradient(135deg, #dc2626, #991b1b)"
// //           }
// //         />

// //       </div>
// //     </div>
// //   );
// // }

// // export default KPICards;



// // Import React core and the useMemo hook for memoised calculations
// import React, { useMemo } from "react";

// // ============================================================
// // EXPENDITURE FIELDS CONSTANT
// // Must match EXPENDITURE_FIELDS / getUpdatedValue in ReportTable.jsx
// // ============================================================

// const EXPENDITURE_FIELDS = [
//   "amc",
//   "depreciation",
//   "drivers_charges",
//   "fuel",
//   "hire_charges",
//   "insurance",
//   "r_and_m",
//   "rates_and_taxes",
//   "salaries",
//   "finance_charges",
//   "substaff_salaries",
// ];

// // ============================================================
// // GLASSCARD SUB-COMPONENT
// // ============================================================

// function GlassCard({ title, value, color }) {
//   return (
//     <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12 mb-3">
//       <div
//         style={{
//           background: color,
//           borderRadius: "14px",
//           padding: "14px",
//           color: "#fff",
//           height: "105px",
//           boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "center",
//           alignItems: "center",
//           textAlign: "center",
//         }}
//       >
//         <h6 style={{ fontSize: "13px", fontWeight: "600", marginBottom: "8px" }}>
//           {title}
//         </h6>
//         <h4 style={{ fontSize: "18px", fontWeight: "bold", margin: 0, whiteSpace: "nowrap" }}>
//           {value}
//         </h4>
//       </div>
//     </div>
//   );
// }

// // ============================================================
// // KPICARDS MAIN COMPONENT
// //
// // Props passed from App.jsx:
// //   filteredData      — client-side filtered rows (State/Zone/
// //                        Branch/AGM/RI filters applied, BEFORE
// //                        the P&L bucket filter)
// //   editedRows        — user-edited expenditure values, same shape
// //                        as used by ReportTable
// //   selectedPnlFilter — active P&L bucket selection
// //                        [] (cleared)   -> show ALL rows
// //                        [{value:"loss"}] -> show only loss rows, etc.
// // ============================================================

// function KPICards({
//   filteredData = [],
//   editedRows = {},
//   selectedPnlFilter = [],
// }) {

//   // ==========================================================
//   // -- SECTION 1: FORMAT HELPER ------------------------------
//   // ==========================================================

//   const formatCurrency = (num) => {
//     const rounded = Math.round(Number(num) || 0);
//     if (rounded === 0) return "-";
//     return rounded.toLocaleString("en-IN");
//   };

//   // ==========================================================
//   // -- SECTION 2: ROW KEY GENERATOR --------------------------
//   // MUST be identical to getRowKey() in ReportTable.jsx
//   // ==========================================================

//   const getRowKey = (item) =>
//     `${item.state_name}_${item.zone_name}_${item.BSBranchName}_${item.agm}_${item.ri_name}`;

//   // ==========================================================
//   // -- SECTION 3: UPDATED VALUE GETTER -----------------------
//   // MUST match getUpdatedValue() in ReportTable.jsx exactly
//   // ==========================================================

//   const getUpdatedValue = (item, field) => {
//     const rowKey = getRowKey(item);

//     if (editedRows?.[rowKey]?.[field] !== undefined) {
//       return Number(editedRows[rowKey][field]) || 0;
//     }

//     return Number(item?.[field]) || 0;
//   };

//   // ==========================================================
//   // -- SECTION 4: CALCULATION HELPERS ------------------------
//   // Mirrors ReportTable: revenue = total_amount,
//   // net_paid (received) = paid_amount, pnl = net_paid - expenditure
//   // ==========================================================

//   const calculateRevenue = (item) => Number(item?.total_amount) || 0;

//   const calculateReceived = (item) => Number(item?.paid_amount) || 0;

//   const calculateTotalExpenditure = (item, getUpdatedValueFn) =>
//     EXPENDITURE_FIELDS.reduce(
//       (sum, field) => sum + getUpdatedValueFn(item, field),
//       0
//     );

//   const calculatePnl = (item, getUpdatedValueFn) =>
//     calculateReceived(item) - calculateTotalExpenditure(item, getUpdatedValueFn);

//   // ==========================================================
//   // -- SECTION 5: LIVE PER-ROW P&L % --------------------------
//   // Same denominator (paid_amount) as ReportTable's
//   // getLivePercent(item, "netpaid")
//   // ==========================================================

//   const getLivePercent = (item) => {
//     const pnlValue = calculatePnl(item, getUpdatedValue);
//     const received = calculateReceived(item);

//     return received > 0
//       ? Math.round((pnlValue / received) * 100)
//       : 0;
//   };

//   // ==========================================================
//   // -- SECTION 6: APPLY P&L BUCKET FILTER ---------------------
//   // No fallback to pnlActions here — by design:
//   //   selectedPnlFilter = []   -> show ALL rows
//   //   selectedPnlFilter = [..] -> only rows matching a selected bucket
//   // ==========================================================

//   const kpiFilteredRows = useMemo(() => {
//     const activeBuckets = (selectedPnlFilter || []).map((o) => o.value);

//     return (filteredData || []).filter((item) => {

//       // Nothing selected -> show everything
//       if (activeBuckets.length === 0) return true;

//       const percent = getLivePercent(item);

//       return activeBuckets.some((bucket) => {
//         if (bucket === "loss") return percent < 0;
//         else if (bucket === "zero") return percent === 0;
//         else if (bucket === "profit") return percent > 0;
//         return false;
//       });
//     });
//   }, [filteredData, editedRows, selectedPnlFilter]);

//   // ==========================================================
//   // -- SECTION 7: LIVE TOTALS CALCULATION ---------------------
//   // ==========================================================

//   const liveTotals = useMemo(() => {
//     return kpiFilteredRows.reduce(
//       (acc, item) => {
//         const students = Number(item.student_count) || 0;
//         const revenue = calculateRevenue(item);
//         const received = calculateReceived(item);
//         const expenditure = calculateTotalExpenditure(item, getUpdatedValue);
//         const pnl = calculatePnl(item, getUpdatedValue);

//         acc.students += students;
//         acc.revenue += revenue;
//         acc.received += received;
//         acc.expenditure += expenditure;
//         acc.pnl += pnl;

//         return acc;
//       },
//       {
//         students: 0,
//         revenue: 0,
//         received: 0,
//         expenditure: 0,
//         pnl: 0,
//       }
//     );
//   }, [kpiFilteredRows, editedRows]);

//   // ==========================================================
//   // -- SECTION 8: P&L PERCENTAGE -------------------------------
//   // ==========================================================

//   const liveProfitLossPercentage =
//     liveTotals.received > 0
//       ? Math.round((liveTotals.pnl / liveTotals.received) * 100)
//       : 0;

//   // ==========================================================
//   // -- SECTION 9: RENDER --------------------------------------
//   // ==========================================================

//   return (
//     <div className="container-fluid mb-4">
//       <div className="row">

//         <GlassCard
//           title="Student Count"
//           value={formatCurrency(liveTotals.students)}
//           color="linear-gradient(135deg, #2563eb, #1e40af)"
//         />

//         <GlassCard
//           title="Net Revenue"
//           value={`₹ ${formatCurrency(liveTotals.revenue)}`}
//           color="linear-gradient(135deg, #059669, #047857)"
//         />

//         <GlassCard
//           title="Net Received"
//           value={`₹ ${formatCurrency(liveTotals.received)}`}
//           color="linear-gradient(135deg, #f59e0b, #d97706)"
//         />

//         <GlassCard
//           title="Total Expenditure"
//           value={`₹ ${formatCurrency(liveTotals.expenditure)}`}
//           color="linear-gradient(135deg, #7c3aed, #5b21b6)"
//         />

//         <GlassCard
//           title="P & L"
//           value={`₹ ${formatCurrency(liveTotals.pnl)}`}
//           color={
//             liveTotals.pnl >= 0
//               ? "linear-gradient(135deg, #10b981, #047857)"
//               : "linear-gradient(135deg, #06b6d4, #0e7490)"
//           }
//         />

//         <GlassCard
//           title="Profit / Loss %"
//           value={`${liveProfitLossPercentage}%`}
//           color={
//             liveProfitLossPercentage >= 0
//               ? "linear-gradient(135deg, #43e97b, #38f9d7)"
//               : "linear-gradient(135deg, #dc2626, #991b1b)"
//           }
//         />

//       </div>
//     </div>
//   );
// }

// export default KPICards;




// ============================================================
// KPICards.jsx
// ------------------------------------------------------------
// Displays 6 summary KPI cards (Student Count, Net Revenue,
// Net Received, Total Expenditure, P & L, Profit/Loss %) for
// the Transportation P&L Report.
//
// IMPORTANT: This component does its OWN P&L bucket filtering
// (Loss / Zero / Profit) independent of ReportTable. This means:
//   - If selectedPnlFilter is EMPTY            -> ALL rows are summed
//   - If selectedPnlFilter has buckets selected -> only rows whose
//                                                   live P&L% falls in
//                                                   one of those buckets
//                                                   are summed
//
// This guarantees: "select Loss filter -> KPI shows loss totals"
// and "clear the filter -> KPI shows totals for everything".
// ============================================================

// Import React core and the useMemo hook for memoised calculations
import React, { useMemo } from "react";

// ============================================================
// EXPENDITURE FIELDS CONSTANT
//
// List of all 11 expenditure field names that make up
// "Total Expenditure". This list MUST exactly match the
// EXPENDITURE_FIELDS / getUpdatedValue field list used inside
// ReportTable.jsx — if a field is added/removed there, add or
// remove it here too, otherwise the KPI totals and the table's
// Grand Total row will not match.
// ============================================================

const EXPENDITURE_FIELDS = [
  "amc",               // Annual Maintenance Contract
  "depreciation",      // Vehicle depreciation
  "drivers_charges",   // Driver batha / allowances
  "fuel",              // Fuel expenses
  "hire_charges",      // Vehicle hire / lease charges
  "insurance",         // Vehicle insurance premium
  "r_and_m",           // Repairs and Maintenance
  "rates_and_taxes",   // Government rates and taxes
  "salaries",          // Staff salaries
  "finance_charges",   // Loan EMI / finance charges
  "substaff_salaries", // Sub-staff salaries
];

// ============================================================
// GLASSCARD SUB-COMPONENT
//
// A single rounded "glass" style card showing a title and a
// big value below it. Used 6 times inside KPICards — once per
// metric. Purely presentational, takes no logic.
//
// Props:
//   title — small label shown at the top (e.g. "Net Revenue")
//   value — big bold text shown below the title
//           (e.g. "₹ 12,34,567" or "15%")
//   color — CSS background value (usually a linear-gradient
//           string) controlling the card's color
// ============================================================

function GlassCard({ title, value, color }) {
  return (
    // Bootstrap grid column:
    //   xl screens -> 2/12 width (6 cards per row)
    //   lg screens -> 3/12 width (4 cards per row)
    //   md screens -> 4/12 width (3 cards per row)
    //   sm screens -> 6/12 width (2 cards per row)
    //   xs screens -> 12/12 width (1 card per row)
    // mb-3 adds bottom margin so cards don't touch when wrapped
    <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12 mb-3">

      {/* Card box itself */}
      <div
        style={{
          background: color,                          // gradient/solid color passed in as prop
          borderRadius: "14px",                       // rounded corners
          padding: "14px",                            // inner spacing around text
          color: "#fff",                              // white text so it's visible on colored bg
          height: "105px",                            // fixed height -> all cards line up evenly
          boxShadow: "0 4px 12px rgba(0,0,0,0.12)",  // soft shadow for a "lifted" look
          display: "flex",
          flexDirection: "column",                    // stack title on top, value below
          justifyContent: "center",                   // vertically center content in the 105px box
          alignItems: "center",                       // horizontally center content
          textAlign: "center",
        }}
      >
        {/* Small title text, e.g. "Net Revenue" */}
        <h6
          style={{
            fontSize: "13px",
            fontWeight: "600",
            marginBottom: "8px",   // gap between title and value
          }}
        >
          {title}
        </h6>

        {/* Big value text, e.g. "₹ 12,34,567" */}
        <h4
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            margin: 0,
            whiteSpace: "nowrap", // keep long numbers on a single line (no wrapping)
          }}
        >
          {value}
        </h4>
      </div>
    </div>
  );
}

// ============================================================
// KPICARDS MAIN COMPONENT
//
// Props received from App.jsx:
//
//   filteredData
//     - The array of report rows AFTER the client-side filters
//       (State / Zone / Branch / AGM / RI Name) have been applied,
//       but BEFORE any P&L bucket (Loss/Zero/Profit) filter.
//     - This is the SAME array App.jsx passes into ReportTable
//       as `filteredData`.
//
//   editedRows
//     - Object holding any expenditure values the user has
//       edited inline in the table.
//     - Shape: { "<rowKey>": { amc: 123, fuel: 456, ... }, ... }
//     - Same object used by ReportTable, so KPI totals stay in
//       sync with live edits.
//
//   selectedPnlFilter
//     - Array of currently selected P&L filter chips, e.g.:
//         []                         -> nothing selected, show ALL rows
//         [{ value: "loss" }]        -> show only Loss rows
//         [{ value: "loss" },
//          { value: "profit" }]      -> show Loss OR Profit rows
//     - This is the SAME state App.jsx passes into ReportTable
//       as `selectedPnlFilter`.
// ============================================================

function KPICards({
  filteredData = [],       // default: empty array if no data loaded yet
  editedRows = {},         // default: no edits made yet
  selectedPnlFilter = [],  // default: no P&L filter selected
}) {

  // ==========================================================
  // -- SECTION 1: FORMAT HELPER ------------------------------
  //
  // Converts a raw number into Indian-style comma formatting,
  // e.g. 1234567 -> "12,34,567".
  //
  // - Math.round() removes decimals first.
  // - Number(num) || 0 safely handles null/undefined/NaN/strings.
  // - If the final rounded value is exactly 0, we show "-"
  //   instead of "0" (matches the look of the table's empty cells).
  // ==========================================================

  const formatCurrency = (num) => {
    const rounded = Math.round(Number(num) || 0);

    if (rounded === 0) return "-";

    return rounded.toLocaleString("en-IN");
  };

  // ==========================================================
  // -- SECTION 2: ROW KEY GENERATOR --------------------------
  //
  // Builds a unique string "key" for each row, based on its
  // State / Zone / Branch / AGM / RI Name.
  //
  // This key is used to look up edited values in `editedRows`.
  //
  // ⚠️ CRITICAL: This function MUST produce EXACTLY the same
  // string as getRowKey() in ReportTable.jsx. If the two ever
  // differ (e.g. different field names or different order),
  // then edits made in the table will NOT be reflected in the
  // KPI totals — the lookup in editedRows will simply fail.
  // ==========================================================

  const getRowKey = (item) =>
    `${item.state_name}_${item.zone_name}_${item.BSBranchName}_${item.agm}_${item.ri_name}`;

  // ==========================================================
  // -- SECTION 3: UPDATED VALUE GETTER -----------------------
  //
  // For a given row (item) and a given expenditure field name
  // (e.g. "fuel"), returns the value that should currently be
  // used in calculations:
  //
  //   1. If the user has edited this row+field, return the
  //      EDITED value (from editedRows), converted to a Number.
  //   2. Otherwise, return the ORIGINAL value from the API
  //      response (item[field]), converted to a Number.
  //   3. If neither exists / is invalid, fall back to 0.
  //
  // ⚠️ CRITICAL: This logic MUST match getUpdatedValue() in
  // ReportTable.jsx exactly, so that live edits are reflected
  // identically in both the table's Grand Total row and these
  // KPI cards.
  // ==========================================================

  const getUpdatedValue = (item, field) => {
    // Build this row's unique key so we can look it up in editedRows
    const rowKey = getRowKey(item);

    // Check: has the user edited THIS field for THIS row?
    if (editedRows?.[rowKey]?.[field] !== undefined) {
      // Yes -> use the edited value (Number(...) || 0 handles
      // empty string inputs like "" which would otherwise be NaN)
      return Number(editedRows[rowKey][field]) || 0;
    }

    // No edit found -> fall back to the original value from the API
    return Number(item?.[field]) || 0;
  };

  // ==========================================================
  // -- SECTION 4: CALCULATION HELPERS ------------------------
  //
  // Small helper functions that compute the core financial
  // values for a SINGLE row. These mirror the logic used inside
  // ReportTable.jsx so that per-row math is identical everywhere.
  // ==========================================================

  // -- Revenue: the gross billed amount for this row.
  //    Comes straight from the API field `total_amount`.
  //    NOTE: This is shown in the "Net Revenue" card, but it is
  //    NOT used as the denominator for P&L % (paid_amount is).
  const calculateRevenue = (item) => Number(item?.total_amount) || 0;

  // -- Received: the amount actually received/collected for
  //    this row, from the API field `paid_amount`.
  //    This is used as the P&L base (denominator for P&L %).
  const calculateReceived = (item) => Number(item?.paid_amount) || 0;

  // -- Total Expenditure: sums up all 11 EXPENDITURE_FIELDS for
  //    this row, using getUpdatedValue() so that any user edits
  //    are reflected immediately (live).
  const calculateTotalExpenditure = (item, getUpdatedValueFn) =>
    EXPENDITURE_FIELDS.reduce(
      (sum, field) => sum + getUpdatedValueFn(item, field),
      0 // start the sum at 0
    );

  // -- P&L (Profit & Loss) for this row:
  //      pnl = received - total_expenditure
  //    Can be negative (a loss) — the sign is preserved.
  const calculatePnl = (item, getUpdatedValueFn) =>
    calculateReceived(item) - calculateTotalExpenditure(item, getUpdatedValueFn);

  // ==========================================================
  // -- SECTION 5: LIVE PER-ROW P&L % --------------------------
  //
  // Computes the P&L percentage for a SINGLE row, using LIVE
  // (possibly edited) expenditure values:
  //
  //     percent = (pnl / received) * 100
  //
  // - If `received` (paid_amount) is 0, returns 0 to avoid a
  //   divide-by-zero error.
  // - This matches ReportTable's getLivePercent(item, "netpaid")
  //   — i.e. the denominator is `paid_amount`, NOT `total_amount`.
  //
  // This percent is what decides whether a row counts as
  // "loss" (< 0), "zero" (= 0), or "profit" (> 0) for the
  // P&L bucket filter below.
  // ==========================================================

  const getLivePercent = (item) => {
    const pnlValue = calculatePnl(item, getUpdatedValue);
    const received = calculateReceived(item);

    return received > 0
      ? Math.round((pnlValue / received) * 100)
      : 0;
  };

  // ==========================================================
  // -- SECTION 6: APPLY P&L BUCKET FILTER ---------------------
  //
  // Filters `filteredData` down to only the rows that should
  // count toward the KPI totals, based on `selectedPnlFilter`.
  //
  // Behaviour (NO fallback to any "default" bucket):
  //   - selectedPnlFilter is EMPTY  -> every row passes (ALL rows)
  //   - selectedPnlFilter has values -> a row passes if its live
  //     P&L% matches AT LEAST ONE of the selected buckets:
  //       "loss"   -> percent < 0
  //       "zero"   -> percent === 0
  //       "profit" -> percent > 0
  //
  // Wrapped in useMemo so this filtering only re-runs when one
  // of its dependencies actually changes (avoids recalculating
  // on every single render).
  // ==========================================================

  const kpiFilteredRows = useMemo(() => {

    // Turn [{ value: "loss" }, { value: "profit" }] into ["loss", "profit"]
    const activeBuckets = (selectedPnlFilter || []).map((o) => o.value);

    return (filteredData || []).filter((item) => {

      // CASE 1: No P&L filter chips selected at all
      // -> include every row (this is the "show ALL values" case)
      if (activeBuckets.length === 0) return true;

      // CASE 2: One or more buckets are selected
      // -> compute this row's live P&L% once...
      const percent = getLivePercent(item);

      // ...then check if it matches ANY of the selected buckets
      return activeBuckets.some((bucket) => {
        if (bucket === "loss") return percent < 0;     // Loss bucket
        else if (bucket === "zero") return percent === 0;  // Zero bucket
        else if (bucket === "profit") return percent > 0;  // Profit bucket
        return false; // unknown bucket value -> exclude
      });
    });

  }, [filteredData, editedRows, selectedPnlFilter]);
  // Re-run this filter whenever:
  //  - the underlying data changes (filteredData)
  //  - the user edits a cell (editedRows)
  //  - the user changes the P&L filter chips (selectedPnlFilter)

  // ==========================================================
  // -- SECTION 7: LIVE TOTALS CALCULATION ---------------------
  //
  // Sums up every numeric KPI across `kpiFilteredRows` (the
  // rows that survived the P&L bucket filter above).
  //
  // Produces one object `liveTotals` with these fields:
  //   students    -> total student count
  //   revenue     -> total Net Revenue (sum of total_amount)
  //   received    -> total Net Received (sum of paid_amount)
  //   expenditure -> total Total Expenditure (sum of all 11 fields,
  //                   using live/edited values)
  //   pnl         -> total P&L (received - expenditure), signed
  //
  // Wrapped in useMemo so it only recalculates when the filtered
  // rows or the edited values actually change.
  // ==========================================================

  const liveTotals = useMemo(() => {

    // .reduce() walks through every row once, building up totals
    return kpiFilteredRows.reduce(
      (acc, item) => {

        // -- Per-row values -------------------------------------

        // Student headcount for this row
        const students = Number(item.student_count) || 0;

        // Gross billed amount for this row
        const revenue = calculateRevenue(item);

        // Net amount actually received for this row
        const received = calculateReceived(item);

        // Sum of all 11 expenditure fields (live/edited) for this row
        const expenditure = calculateTotalExpenditure(item, getUpdatedValue);

        // P&L for this row = received - expenditure (can be negative)
        const pnl = calculatePnl(item, getUpdatedValue);

        // -- Add this row's values onto the running totals -------

        acc.students += students;
        acc.revenue += revenue;
        acc.received += received;
        acc.expenditure += expenditure;
        acc.pnl += pnl; // signed addition — losses reduce the total

        return acc; // pass the updated accumulator to the next iteration
      },

      // Initial totals — everything starts at zero
      {
        students: 0,
        revenue: 0,
        received: 0,
        expenditure: 0,
        pnl: 0,
      }
    );

  }, [kpiFilteredRows, editedRows]);
  // Recalculate only when the filtered row set or edited values change

  // ==========================================================
  // -- SECTION 8: PROFIT / LOSS PERCENTAGE --------------------
  //
  // Overall Profit/Loss % across all kpiFilteredRows:
  //
  //     liveProfitLossPercentage = (total_pnl / total_received) * 100
  //
  // - Denominator is `received` (sum of paid_amount), matching
  //   the per-row getLivePercent() denominator above and
  //   ReportTable's finalTotalsPercent.
  // - If total `received` is 0 (e.g. no rows), returns 0 to
  //   avoid a divide-by-zero error.
  // - Result is signed: negative = overall loss, positive = profit.
  // ==========================================================

  const liveProfitLossPercentage =
    liveTotals.received > 0
      ? Math.round((liveTotals.pnl / liveTotals.received) * 100)
      : 0;

  // ==========================================================
  // -- SECTION 9: RENDER --------------------------------------
  //
  // Renders a Bootstrap row containing the 6 KPI cards, each
  // built from the `liveTotals` computed above.
  //
  // container-fluid removes default Bootstrap container padding
  // so the row of cards spans the full available width.
  // ==========================================================

  return (
    <div className="container-fluid mb-4">

      {/* Bootstrap row: cards sit side-by-side and wrap on small screens */}
      <div className="row">

        {/* --- CARD 1: STUDENT COUNT ------------------------------- */}
        {/* Total student headcount across kpiFilteredRows.            */}
        {/* Blue gradient — neutral "informational" color.             */}
        <GlassCard
          title="Student Count"
          value={formatCurrency(liveTotals.students)}   // e.g. "1,23,456"
          color="linear-gradient(135deg, #2563eb, #1e40af)"
        />

        {/* --- CARD 2: NET REVENUE ---------------------------------- */}
        {/* Total gross billed amount (sum of total_amount).           */}
        {/* Green gradient — represents money billed/income side.      */}
        <GlassCard
          title="Net Revenue"
          value={`₹ ${formatCurrency(liveTotals.revenue)}`}  // e.g. "₹ 12,34,567"
          color="linear-gradient(135deg, #059669, #047857)"
        />

        {/* --- CARD 3: NET RECEIVED ---------------------------------- */}
        {/* Total amount actually collected (sum of paid_amount).       */}
        {/* This is the denominator used for the P&L % calculation.     */}
        {/* Amber gradient — visually distinct from Net Revenue.        */}
        <GlassCard
          title="Net Received"
          value={`₹ ${formatCurrency(liveTotals.received)}`}  // e.g. "₹ 10,00,000"
          color="linear-gradient(135deg, #f59e0b, #d97706)"
        />

        {/* --- CARD 4: TOTAL EXPENDITURE ------------------------------ */}
        {/* Sum of all 11 expenditure fields, including live edits.      */}
        {/* Purple gradient — neutral "cost" color.                      */}
        <GlassCard
          title="Total Expenditure"
          value={`₹ ${formatCurrency(liveTotals.expenditure)}`}  // e.g. "₹ 8,50,000"
          color="linear-gradient(135deg, #7c3aed, #5b21b6)"
        />

        {/* --- CARD 5: P & L ------------------------------------------ */}
        {/* Net Received minus Total Expenditure.                        */}
        {/* Card color flips depending on profit vs loss:                */}
        {/*   pnl >= 0 -> "profit" color (green)                          */}
        {/*   pnl <  0 -> "loss" color (teal/blue)                        */}
        <GlassCard
          title="P & L"
          value={`₹ ${formatCurrency(liveTotals.pnl)}`}  // e.g. "₹ 1,50,000" or "₹ -50,000"
          color={
            liveTotals.pnl >= 0
              ? "linear-gradient(135deg, #10b981, #047857)" // Profit color
              : "linear-gradient(135deg, #06b6d4, #0e7490)"  // Loss color
          }
        />

        {/* --- CARD 6: PROFIT / LOSS % --------------------------------- */}
        {/* (Total P&L / Total Net Received) * 100, rounded to integer.   */}
        {/* Card color flips depending on sign:                           */}
        {/*   percent >= 0 -> green/teal (profit)                         */}
        {/*   percent <  0 -> red (loss)                                  */}
        <GlassCard
          title="Profit / Loss %"
          value={`${liveProfitLossPercentage}%`}  // e.g. "15%" or "-8%"
          color={
            liveProfitLossPercentage >= 0
              ? "linear-gradient(135deg, #43e97b, #38f9d7)"  // Profit %
              : "linear-gradient(135deg, #dc2626, #991b1b)"   // Loss %
          }
        />

      </div>
    </div>
  );
}

// Export KPICards as the default export so App.jsx can import and render it
export default KPICards;