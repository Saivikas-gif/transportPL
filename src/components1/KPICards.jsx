// // // import React, { useMemo } from "react";

// // // // ======================================================
// // // // GLASS CARD
// // // // ======================================================

// // // function GlassCard({ title, value, color }) {

// // //   return (

// // //     <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12 mb-3">

// // //       <div
// // //         style={{
// // //           background: color,
// // //           borderRadius: "16px",
// // //           padding: "16px",
// // //           color: "#fff",
// // //           height: "110px",
// // //           boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
// // //           display: "flex",
// // //           flexDirection: "column",
// // //           justifyContent: "center",
// // //           alignItems: "center",
// // //           textAlign: "center",
// // //         }}
// // //       >

// // //         <h6
// // //           style={{
// // //             fontSize: "13px",
// // //             fontWeight: "600",
// // //             marginBottom: "10px",
// // //           }}
// // //         >
// // //           {title}
// // //         </h6>

// // //         <h4
// // //           style={{
// // //             fontSize: "20px",
// // //             fontWeight: "bold",
// // //             margin: 0,
// // //             whiteSpace: "nowrap",
// // //           }}
// // //         >
// // //           {value}
// // //         </h4>

// // //       </div>

// // //     </div>
// // //   );
// // // }

// // // // ======================================================
// // // // KPI CARDS
// // // // ======================================================

// // // function KPICards({

// // //   pnlFilteredData = [],
// // //   editedRows = {},

// // // }) {

// // //   // ======================================================
// // //   // FORMAT
// // //   // ======================================================

// // //   const formatCurrency = (num) => {

// // //     const rounded =
// // //       Math.round(Number(num) || 0);

// // //     return rounded.toLocaleString("en-IN");
// // //   };

// // //   // ======================================================
// // //   // ROW KEY
// // //   // ======================================================

// // //   const getRowKey = (item) =>

// // //     `${item.state_name}_${item.zone_name}_${item.BSBranchName}_${item.agm}_${item.ri_name}`;

// // //   // ======================================================
// // //   // GET UPDATED VALUE
// // //   // ======================================================

// // //   const getUpdatedValue = (item, field) => {

// // //     const rowKey = getRowKey(item);

// // //     if (
// // //       editedRows?.[rowKey] &&
// // //       editedRows[rowKey][field] !== undefined
// // //     ) {

// // //       return Number(
// // //         editedRows[rowKey][field]
// // //       ) || 0;
// // //     }

// // //     return Number(item?.[field]) || 0;
// // //   };

// // //   // ======================================================
// // //   // LIVE TOTALS
// // //   // ======================================================

// // //   const liveTotals = useMemo(() => {

// // //     return pnlFilteredData.reduce(

// // //       (acc, item) => {

// // //         // =================================================
// // //         // REVENUE
// // //         // =================================================

// // //         const revenue =
// // //           Number(item.total_amount) || 0;

// // //         // =================================================
// // //         // EXPENDITURE
// // //         // =================================================

// // //         const amc =
// // //           getUpdatedValue(item, "amc");

// // //         const depreciation =
// // //           getUpdatedValue(item, "depreciation");

// // //         const drivers =
// // //           getUpdatedValue(item, "drivers_charges");

// // //         const fuel =
// // //           getUpdatedValue(item, "fuel");

// // //         const hire =
// // //           getUpdatedValue(item, "hire_charges");

// // //         const insurance =
// // //           getUpdatedValue(item, "insurance");

// // //         const rm =
// // //           getUpdatedValue(item, "r_and_m");

// // //         const taxes =
// // //           getUpdatedValue(item, "rates_and_taxes");

// // //         const salaries =
// // //           getUpdatedValue(item, "salaries");

// // //         const finance =
// // //           getUpdatedValue(item, "finance_charges");

// // //         const substaff =
// // //           getUpdatedValue(item, "substaff_salaries");

// // //         // =================================================
// // //         // TOTAL EXPENDITURE
// // //         // =================================================

// // //         const expenditure =

// // //           amc +
// // //           depreciation +
// // //           drivers +
// // //           fuel +
// // //           hire +
// // //           insurance +
// // //           rm +
// // //           taxes +
// // //           salaries +
// // //           finance +
// // //           substaff;

// // //         // =================================================
// // //         // PNL
// // //         // =================================================

// // //         const pnl =
// // //           Number(revenue) -
// // //           Number(expenditure);

// // //         // =================================================
// // //         // GRAND TOTALS
// // //         // =================================================

// // //         acc.students +=
// // //           Number(item.student_count) || 0;

// // //         acc.revenue += revenue;

// // //         acc.expenditure += expenditure;

// // //         acc.pnl += pnl;

// // //         return acc;
// // //       },

// // //       {
// // //         students: 0,
// // //         revenue: 0,
// // //         expenditure: 0,
// // //         pnl: 0,
// // //       }
// // //     );

// // //   }, [pnlFilteredData, editedRows]);

// // //   // ======================================================
// // //   // FINAL PNL %
// // //   // ======================================================

// // //   const finalPnlPercent =

// // //     liveTotals.revenue !== 0

// // //       ? Math.round(

// // //           (liveTotals.pnl /
// // //             liveTotals.revenue) * 100

// // //         )

// // //       : 0;

// // //   // ======================================================
// // //   // UI
// // //   // ======================================================

// // //   return (

// // //     <div className="container-fluid mb-4">

// // //       <div className="row">

// // //         {/* STUDENT COUNT */}

// // //         <GlassCard
// // //           title="Student Count"
// // //           value={formatCurrency(liveTotals.students)}
// // //           color="linear-gradient(135deg, #0F4C81, #1E88E5)"
// // //         />

// // //         {/* REVENUE */}

// // //         <GlassCard
// // //           title="Revenue"
// // //           value={`₹ ${formatCurrency(liveTotals.revenue)}`}
// // //           color="linear-gradient(135deg, #00695C, #26A69A)"
// // //         />

// // //         {/* EXPENDITURE */}

// // //         <GlassCard
// // //           title="Total Expenditure"
// // //           value={`₹ ${formatCurrency(liveTotals.expenditure)}`}
// // //           color="linear-gradient(135deg, #6A1B9A, #8E24AA)"
// // //         />

// // //         {/* P & L */}

// // //         <GlassCard
// // //           title="P & L"
// // //           value={`₹ ${formatCurrency(liveTotals.pnl)}`}
// // //           color={
// // //             liveTotals.pnl >= 0

// // //               ? "linear-gradient(135deg, #1565C0, #42A5F5)"

// // //               : "linear-gradient(135deg, #C62828, #EF5350)"
// // //           }
// // //         />

// // //         {/* P & L % */}

// // //         <GlassCard
// // //           title="P & L %"
// // //           value={`${finalPnlPercent}%`}
// // //           color={
// // //             finalPnlPercent >= 0

// // //               ? "linear-gradient(135deg, #2E7D32, #66BB6A)"

// // //               : "linear-gradient(135deg, #D84315, #FF7043)"
// // //           }
// // //         />

// // //       </div>

// // //     </div>
// // //   );
// // // }

// // // export default KPICards;


// // import React, { useMemo } from "react";

// // // ======================================================
// // // GLASS CARD
// // // ======================================================

// // function GlassCard({ title, value, color }) {
// //   return (
// //     <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12 mb-3">
// //       <div
// //         style={{
// //           background: color,
// //           borderRadius: "16px",
// //           padding: "16px",
// //           color: "#fff",
// //           height: "110px",
// //           boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
// //           display: "flex",
// //           flexDirection: "column",
// //           justifyContent: "center",
// //           alignItems: "center",
// //           textAlign: "center",
// //         }}
// //       >
// //         <h6 style={{ fontSize: "13px", fontWeight: "600", marginBottom: "10px" }}>
// //           {title}
// //         </h6>
// //         <h4 style={{ fontSize: "20px", fontWeight: "bold", margin: 0, whiteSpace: "nowrap" }}>
// //           {value}
// //         </h4>
// //       </div>
// //     </div>
// //   );
// // }

// // // ======================================================
// // // KPI CARDS
// // // ======================================================

// // function KPICards({ pnlFilteredData = [], editedRows = {} }) {

// //   // ======================================================
// //   // FORMAT — preserves negative sign
// //   // ======================================================

// //   const formatCurrency = (num) => {
// //     const rounded = Math.round(Number(num) || 0);
// //     // toLocaleString on negative numbers works correctly in en-IN
// //     return rounded.toLocaleString("en-IN");
// //   };

// //   // ======================================================
// //   // ROW KEY — must match ReportTable exactly
// //   // ======================================================

// //   const getRowKey = (item) =>
// //     `${item.state_name}_${item.zone_name}_${item.BSBranchName}_${item.agm}_${item.ri_name}`;

// //   // ======================================================
// //   // GET UPDATED VALUE — must match ReportTable exactly
// //   // ======================================================

// //   const getUpdatedValue = (item, field) => {
// //     const rowKey = getRowKey(item);
// //     if (editedRows?.[rowKey] && editedRows[rowKey][field] !== undefined) {
// //       return Number(editedRows[rowKey][field]) || 0;
// //     }
// //     return Number(item?.[field]) || 0;
// //   };

// //   // ======================================================
// //   // LIVE TOTALS — same fields/order as ReportTable liveTotals
// //   // ======================================================

// //   const liveTotals = useMemo(() => {

// //     return pnlFilteredData.reduce(
// //       (acc, item) => {

// //         const revenue = Number(item.total_amount) || 0;

// //         // Same 11 fields as ReportTable, same order
// //         const expenditure =
// //           getUpdatedValue(item, "amc") +
// //           getUpdatedValue(item, "depreciation") +
// //           getUpdatedValue(item, "drivers_charges") +
// //           getUpdatedValue(item, "fuel") +
// //           getUpdatedValue(item, "hire_charges") +
// //           getUpdatedValue(item, "insurance") +
// //           getUpdatedValue(item, "r_and_m") +
// //           getUpdatedValue(item, "rates_and_taxes") +
// //           getUpdatedValue(item, "salaries") +
// //           getUpdatedValue(item, "finance_charges") +
// //           getUpdatedValue(item, "substaff_salaries");

// //         // ✅ pnl can be negative — keep the sign
// //         const pnl = revenue - expenditure;

// //         acc.students    += Number(item.student_count) || 0;
// //         acc.revenue     += revenue;
// //         acc.expenditure += expenditure;
// //         acc.pnl         += pnl;   // ← signed accumulation

// //         return acc;
// //       },
// //       { students: 0, revenue: 0, expenditure: 0, pnl: 0 }
// //     );

// //   }, [pnlFilteredData, editedRows]);

// //   // ======================================================
// //   // FINAL PNL %
// //   // Same formula as ReportTable: Math.round((pnl/revenue)*100)
// //   // ✅ Result is signed — negative when loss
// //   // ======================================================

// //   const finalPnlPercent =
// //     liveTotals.revenue !== 0
// //       ? Math.round((liveTotals.pnl / liveTotals.revenue) * 100)
// //       : 0;

// //   // ======================================================
// //   // P&L display value
// //   // ✅ formatCurrency handles negatives via toLocaleString("en-IN")
// //   //    but we prefix ₹ outside so the sign comes before ₹ correctly
// //   // ======================================================

// //   const pnlDisplay = liveTotals.pnl < 0
// //     ? `₹ -${formatCurrency(Math.abs(liveTotals.pnl))}`
// //     : `₹ ${formatCurrency(liveTotals.pnl)}`;

// //   // ======================================================
// //   // UI
// //   // ======================================================

// //   return (
// //     <div className="container-fluid mb-4">
// //       <div className="row">

// //         {/* STUDENT COUNT */}
// //         <GlassCard
// //           title="Student Count"
// //           value={formatCurrency(liveTotals.students)}
// //           color="linear-gradient(135deg, #0F4C81, #1E88E5)"
// //         />

// //         {/* REVENUE */}
// //         <GlassCard
// //           title="Revenue"
// //           value={`₹ ${formatCurrency(liveTotals.revenue)}`}
// //           color="linear-gradient(135deg, #00695C, #26A69A)"
// //         />

// //         {/* EXPENDITURE */}
// //         <GlassCard
// //           title="Total Expenditure"
// //           value={`₹ ${formatCurrency(liveTotals.expenditure)}`}
// //           color="linear-gradient(135deg, #6A1B9A, #8E24AA)"
// //         />

// //         {/* P & L — red when loss, blue when profit */}
// //         <GlassCard
// //           title="P & L"
// //           value={pnlDisplay}
// //           color={
// //             liveTotals.pnl >= 0
// //               ? "linear-gradient(135deg, #1565C0, #42A5F5)"
// //               : "linear-gradient(135deg, #C62828, #EF5350)"
// //           }
// //         />

// //         {/* P & L % — red when negative, green when positive */}
// //         <GlassCard
// //           title="P & L %"
// //           value={`${finalPnlPercent}%`}
// //           color={
// //             finalPnlPercent >= 0
// //               ? "linear-gradient(135deg, #2E7D32, #66BB6A)"
// //               : "linear-gradient(135deg, #D84315, #FF7043)"
// //           }
// //         />

// //       </div>
// //     </div>
// //   );
// // }

// // export default KPICards;

// import React, { useMemo } from "react";

// function GlassCard({ title, value, color }) {

//   return (

//     <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12 mb-3">

//       <div
//         style={{
//           background: color,
//           borderRadius: "16px",
//           padding: "16px",
//           color: "#fff",
//           height: "110px",
//           boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "center",
//           alignItems: "center",
//           textAlign: "center",
//         }}
//       >

//         <h6
//           style={{
//             fontSize: "13px",
//             fontWeight: "600",
//             marginBottom: "10px",
//           }}
//         >
//           {title}
//         </h6>

//         <h4
//           style={{
//             fontSize: "20px",
//             fontWeight: "bold",
//             margin: 0,
//             whiteSpace: "nowrap",
//           }}
//         >
//           {value}
//         </h4>

//       </div>

//     </div>
//   );
// }

// function KPICards({

//   pnlFilteredData = [],
//   editedRows = {},

// }) {

//   const formatCurrency = (num) => {

//     return Math.round(
//       Number(num) || 0
//     ).toLocaleString("en-IN");
//   };

//   const getRowKey = (item) =>

//     `${item.state_name}_${item.zone_name}_${item.BSBranchName}_${item.agm}_${item.ri_name}`;

//   const getUpdatedValue = (item, field) => {

//     const rowKey = getRowKey(item);

//     if (
//       editedRows?.[rowKey]?.[field] !== undefined
//     ) {

//       return Number(
//         editedRows[rowKey][field]
//       ) || 0;
//     }

//     return Number(item?.[field]) || 0;
//   };

//   const liveTotals = useMemo(() => {

//     return pnlFilteredData.reduce(

//       (acc, item) => {

//         const revenue =
//           Number(item.total_amount) || 0;

//         const expenditure =

//           getUpdatedValue(item, "amc") +

//           getUpdatedValue(item, "depreciation") +

//           getUpdatedValue(item, "drivers_charges") +

//           getUpdatedValue(item, "fuel") +

//           getUpdatedValue(item, "hire_charges") +

//           getUpdatedValue(item, "insurance") +

//           getUpdatedValue(item, "r_and_m") +

//           getUpdatedValue(item, "rates_and_taxes") +

//           getUpdatedValue(item, "salaries") +

//           getUpdatedValue(item, "finance_charges") +

//           getUpdatedValue(item, "substaff_salaries");

//         const pnl =
//           Number(revenue) -
//           Number(expenditure);

//         acc.students +=
//           Number(item.student_count) || 0;

//         acc.revenue += revenue;

//         acc.expenditure += expenditure;

//         acc.pnl += pnl;

//         return acc;

//       },

//       {
//         students: 0,
//         revenue: 0,
//         expenditure: 0,
//         pnl: 0,
//       }
//     );

//   }, [pnlFilteredData, editedRows]);

//   const finalPnlPercent =

//     Number(liveTotals.revenue) !== 0

//       ? Math.round(
//           (Number(liveTotals.pnl) /
//             Number(liveTotals.revenue)) * 100
//         )

//       : 0;

//   return (

//     <div className="container-fluid mb-4">

//       <div className="row">

//         <GlassCard
//           title="Student Count"
//           value={formatCurrency(liveTotals.students)}
//           color="linear-gradient(135deg, #0F4C81, #1E88E5)"
//         />

//         <GlassCard
//           title="Revenue"
//           value={`₹ ${formatCurrency(liveTotals.revenue)}`}
//           color="linear-gradient(135deg, #00695C, #26A69A)"
//         />

//         <GlassCard
//           title="Total Expenditure"
//           value={`₹ ${formatCurrency(liveTotals.expenditure)}`}
//           color="linear-gradient(135deg, #6A1B9A, #8E24AA)"
//         />

//         <GlassCard
//           title="P & L"
//           value={`₹ ${formatCurrency(liveTotals.pnl)}`}
//           color={
//             liveTotals.pnl >= 0
//               ? "linear-gradient(135deg, #1565C0, #42A5F5)"
//               : "linear-gradient(135deg, #C62828, #EF5350)"
//           }
//         />

//         <GlassCard
//           title="P & L %"
//           value={`${finalPnlPercent}%`}
//           color={
//             finalPnlPercent >= 0
//               ? "linear-gradient(135deg, #2E7D32, #66BB6A)"
//               : "linear-gradient(135deg, #D84315, #FF7043)"
//           }
//         />

//       </div>

//     </div>
//   );
// }

// export default KPICards;

// import React, { useMemo } from "react";

// // ======================================================
// // ALL EXPENDITURE FIELDS — must match ReportTable exactly
// // ======================================================

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

// // ======================================================
// // GLASS CARD
// // ======================================================

// function GlassCard({ title, value, color }) {
//   return (
//     <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12 mb-3">
//       <div
//         style={{
//           background: color,
//           borderRadius: "16px",
//           padding: "16px",
//           color: "#fff",
//           height: "110px",
//           boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "center",
//           alignItems: "center",
//           textAlign: "center",
//         }}
//       >
//         <h6
//           style={{
//             fontSize: "13px",
//             fontWeight: "600",
//             marginBottom: "10px",
//           }}
//         >
//           {title}
//         </h6>
//         <h4
//           style={{
//             fontSize: "20px",
//             fontWeight: "bold",
//             margin: 0,
//             whiteSpace: "nowrap",
//           }}
//         >
//           {value}
//         </h4>
//       </div>
//     </div>
//   );
// }

// // ======================================================
// // KPI CARDS
// // ======================================================

// function KPICards({ pnlFilteredData = [], editedRows = {} }) {

//   // ======================================================
//   // FORMAT — handles negatives correctly in en-IN
//   // ======================================================

//   const formatCurrency = (num) =>
//     Math.round(Number(num) || 0).toLocaleString("en-IN");

//   // ======================================================
//   // ROW KEY — must be identical to ReportTable
//   // ======================================================

//   const getRowKey = (item) =>
//     `${item.state_name}_${item.zone_name}_${item.BSBranchName}_${item.agm}_${item.ri_name}`;

//   // ======================================================
//   // GET UPDATED VALUE — must be identical to ReportTable
//   // ======================================================

//   const getUpdatedValue = (item, field) => {
//     const rowKey = getRowKey(item);
//     if (editedRows?.[rowKey]?.[field] !== undefined) {
//       return Number(editedRows[rowKey][field]) || 0;
//     }
//     return Number(item?.[field]) || 0;
//   };

//   // ======================================================
//   // LIVE TOTALS
//   //
//   // KEY FIX: ReportTable uses paid_amount (net paid) as
//   // the base for P&L and P&L%, NOT total_amount (revenue).
//   //   pnl     = net_paid - expenditure
//   //   pnl%    = (pnl / net_paid) * 100
//   //
//   // The old KPICards was using total_amount for pnl which
//   // caused the mismatch with the table's values.
//   // ======================================================

//   const liveTotals = useMemo(() => {

//     return pnlFilteredData.reduce(
//       (acc, item) => {

//         // Revenue (display only — not used in P&L calc)
//         const revenue = Number(item.total_amount) || 0;

//         // Net paid — this is the P&L base (matches ReportTable)
//         const net_paid = Number(item.paid_amount) || 0;

//         // Total expenditure across all 11 fields
//         const expenditure = EXPENDITURE_FIELDS.reduce(
//           (sum, field) => sum + getUpdatedValue(item, field),
//           0
//         );

//         // P&L = net paid - expenditure  (matches ReportTable)
//         const pnl = net_paid - expenditure;

//         acc.students    += Number(item.student_count) || 0;
//         acc.revenue     += revenue;
//         acc.net_paid    += net_paid;
//         acc.expenditure += expenditure;
//         acc.pnl         += pnl;   // signed — preserves negatives

//         return acc;
//       },
//       {
//         students: 0,
//         revenue: 0,
//         net_paid: 0,
//         expenditure: 0,
//         pnl: 0,
//       }
//     );

//   }, [pnlFilteredData, editedRows]);

//   // ======================================================
//   // P&L % — denominator is net_paid (matches ReportTable)
//   // ======================================================

//   const finalPnlPercent =
//     liveTotals.net_paid !== 0
//       ? Math.round((liveTotals.pnl / liveTotals.net_paid) * 100)
//       : 0;

//   // ======================================================
//   // P&L DISPLAY — show ₹ -1,23,456 for negatives
//   // ======================================================

//   const pnlDisplay =
//     liveTotals.pnl < 0
//       ? `₹ -${formatCurrency(Math.abs(liveTotals.pnl))}`
//       : `₹ ${formatCurrency(liveTotals.pnl)}`;

//   // ======================================================
//   // UI
//   // ======================================================

//   return (
//     <div className="container-fluid mb-4">
//       <div className="row">

//         {/* STUDENT COUNT */}
//         <GlassCard
//           title="Student Count"
//           value={formatCurrency(liveTotals.students)}
//           color="linear-gradient(135deg, #0F4C81, #1E88E5)"
//         />

//         {/* REVENUE */}
//         <GlassCard
//           title="Revenue"
//           value={`₹ ${formatCurrency(liveTotals.revenue)}`}
//           color="linear-gradient(135deg, #00695C, #26A69A)"
//         />

//         {/* NET RECEIVED — same field the table uses for P&L base */}
//         <GlassCard
//           title="Net Received"
//           value={`₹ ${formatCurrency(liveTotals.net_paid)}`}
//           color="linear-gradient(135deg, #1565C0, #42A5F5)"
//         />

//         {/* EXPENDITURE */}
//         <GlassCard
//           title="Total Expenditure"
//           value={`₹ ${formatCurrency(liveTotals.expenditure)}`}
//           color="linear-gradient(135deg, #6A1B9A, #8E24AA)"
//         />

//         {/* P & L — red when loss, blue when profit */}
//         <GlassCard
//           title="P & L"
//           value={pnlDisplay}
//           color={
//             liveTotals.pnl >= 0
//               ? "linear-gradient(135deg, #2E7D32, #66BB6A)"
//               : "linear-gradient(135deg, #C62828, #EF5350)"
//           }
//         />

//         {/* P & L % — red when negative, green when positive */}
//         <GlassCard
//           title="P & L %"
//           value={`${finalPnlPercent}%`}
//           color={
//             finalPnlPercent >= 0
//               ? "linear-gradient(135deg, #2E7D32, #66BB6A)"
//               : "linear-gradient(135deg, #D84315, #FF7043)"
//           }
//         />

//       </div>
//     </div>
//   );
// }

// export default KPICards;


// ============================================================
// KPICards.jsx — Summary metric cards for Transportation P&L Report
//
// Renders a row of colored "glass" cards showing:
//   1. Student Count     — total students across visible rows
//   2. Revenue           — total gross billed (total_amount)
//   3. Net Received      — total actually collected (paid_amount)
//   4. Total Expenditure — sum of all 11 expenditure fields
//   5. P & L             — Net Received minus Expenditure (can be negative)
//   6. P & L %           — (P&L / Net Received) * 100
//
// CRITICAL: All calculations use paid_amount (net received) as
// the P&L base — exactly matching ReportTable's Grand Total row.
// The old code used total_amount (revenue) which caused a mismatch.
// ============================================================

// Import React core and the useMemo hook for memoised calculations
import React, { useMemo } from "react";

// ============================================================
// EXPENDITURE FIELDS CONSTANT
//
// All 11 expenditure field names — must be identical to the
// EXPENDITURE_FIELDS list in ReportTable.jsx.
// If a field is added or removed, update both files.
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
// Renders a single colored card with a title and a value.
// Used by KPICards to display each metric as a separate card.
// Props:
//   title  — label shown above the value (e.g. "Revenue")
//   value  — formatted string shown in large text (e.g. "Rs 12,34,567")
//   color  — CSS background (gradient string) for the card
// ============================================================

function GlassCard({ title, value, color }) {
  return (
    // Bootstrap column — responsive: 2 cols on xl, 3 on lg, 4 on md, 6 on sm, 12 on xs
    <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12 mb-3">

      {/* Card container — colored background, fixed 110px height, centered content */}
      <div
        style={{
          background: color,                          // Gradient or solid color passed as prop
          borderRadius: "16px",                       // Rounded corners for the card
          padding: "16px",                            // Inner spacing
          color: "#fff",                              // White text on colored background
          height: "110px",                            // Fixed height so all cards are the same size
          boxShadow: "0 6px 16px rgba(0,0,0,0.15)",  // Subtle drop shadow for depth
          display: "flex",
          flexDirection: "column",                    // Stack title and value vertically
          justifyContent: "center",                   // Center vertically within the 110px height
          alignItems: "center",                       // Center horizontally
          textAlign: "center",
        }}
      >
        {/* CARD TITLE — small uppercase-style label */}
        <h6
          style={{
            fontSize: "13px",
            fontWeight: "600",
            marginBottom: "10px",    // Space between title and value
          }}
        >
          {title}
        </h6>

        {/* CARD VALUE — large bold number */}
        <h4
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            margin: 0,
            whiteSpace: "nowrap",   // Prevent long numbers from wrapping to a second line
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
// ============================================================

function KPICards({
  // Array of row objects that pass the current P&L bucket filter
  // Comes from ReportTable -> App -> KPICards via pnlFilteredData state
  // KPICards calculates all totals from THIS array so the cards
  // always match the Grand Total row in the table
  pnlFilteredData = [],  // Default to empty array if not yet populated

  // Object of user-edited expenditure values
  // Shape: { "rowKey": { amc: 123, fuel: 456, ... }, ... }
  // Must be passed so edited values are included in calculations
  editedRows = {},       // Default to empty object if no edits made yet
}) {

  // ==========================================================
  // -- SECTION 1: FORMAT HELPER ------------------------------
  // Converts a number to Indian locale format (e.g. 1234567 -> "12,34,567")
  // Math.round removes any decimal places before formatting.
  // Number(num) handles cases where num might be a string.
  // Falls back to 0 if num is null, undefined, or NaN.
  // ==========================================================

  const formatCurrency = (num) =>
    Math.round(Number(num) || 0).toLocaleString("en-IN");

  // ==========================================================
  // -- SECTION 2: ROW KEY GENERATOR --------------------------
  // Generates the same unique row key as ReportTable.
  // MUST be identical to getRowKey() in ReportTable.jsx --
  // if they differ, editedRows lookups will fail and edits
  // will not be reflected in the KPI card values.
  // ==========================================================

  const getRowKey = (item) =>
    `${item.state_name}_${item.zone_name}_${item.BSBranchName}_${item.agm}_${item.ri_name}`;

  // ==========================================================
  // -- SECTION 3: UPDATED VALUE GETTER -----------------------
  // Returns the current value for a given field on a given row.
  // If the user has edited the field, returns the edited value.
  // Otherwise returns the original value from the API response.
  // Falls back to 0 if the field is null, undefined, or missing.
  //
  // MUST match getUpdatedValue() in ReportTable.jsx exactly.
  // ==========================================================

  const getUpdatedValue = (item, field) => {
    const rowKey = getRowKey(item);

    // Check if an edited value exists for this specific row + field combination
    if (editedRows?.[rowKey]?.[field] !== undefined) {
      // Return the user-edited value, coerced to a number (|| 0 handles empty strings)
      return Number(editedRows[rowKey][field]) || 0;
    }

    // No edit found — return the original API value, coerced to a number
    return Number(item?.[field]) || 0;
  };

  // ==========================================================
  // -- SECTION 4: LIVE TOTALS CALCULATION --------------------
  //
  // Calculates grand totals across ALL pnlFilteredData rows.
  // useMemo prevents recalculation on every render — only
  // recalculates when pnlFilteredData or editedRows changes.
  //
  // KEY: Uses paid_amount (net received) as the P&L base,
  // NOT total_amount (revenue). This matches ReportTable.
  //   pnl   = net_paid - expenditure
  //   pnl%  = (pnl / net_paid) * 100
  // ==========================================================

  const liveTotals = useMemo(() => {

    // .reduce() iterates over all filtered rows, accumulating running totals
    return pnlFilteredData.reduce(
      (acc, item) => {

        // -- Revenue ------------------------------------------
        // Gross billed amount — displayed in Revenue card
        // NOT used as the P&L base (paid_amount is used instead)
        const revenue = Number(item.total_amount) || 0;

        // -- Net Paid -----------------------------------------
        // Actual amount received from the branch
        // THIS is the P&L base (matches ReportTable's Grand Total row)
        const net_paid = Number(item.paid_amount) || 0;

        // -- Total Expenditure ---------------------------------
        // Sum all 11 expenditure fields using getUpdatedValue
        // so user edits are included in the card values
        const expenditure = EXPENDITURE_FIELDS.reduce(
          (sum, field) => sum + getUpdatedValue(item, field),
          0  // Start the inner accumulator at 0
        );

        // -- P&L Amount ----------------------------------------
        // Net received minus total expenditure
        // Can be negative (loss) — the sign is preserved in acc.pnl
        const pnl = net_paid - expenditure;

        // -- Accumulate into running totals -------------------

        // Add this row's student count to the running total
        acc.students += Number(item.student_count) || 0;

        // Add this row's revenue to the running total
        acc.revenue += revenue;

        // Add this row's net paid to the running total
        acc.net_paid += net_paid;

        // Add this row's expenditure to the running total
        acc.expenditure += expenditure;

        // Add this row's P&L to the running total (signed — negatives reduce the total)
        acc.pnl += pnl;

        return acc; // Return the updated accumulator for the next iteration
      },

      // Initial accumulator — all totals start at zero
      {
        students: 0,
        revenue: 0,
        net_paid: 0,
        expenditure: 0,
        pnl: 0,
      }
    );

  }, [pnlFilteredData, editedRows]);
  // Only recalculate when the filtered rows or edited values change

  // ==========================================================
  // -- SECTION 5: P&L PERCENTAGE -----------------------------
  // Overall P&L % = (total_pnl / total_net_paid) * 100
  // Denominator is net_paid (matches ReportTable's Grand Total row)
  // Returns 0 when net_paid is 0 to prevent division by zero
  // Result is signed — negative when total is a loss
  // ==========================================================

  const finalPnlPercent =
    liveTotals.net_paid !== 0
      ? Math.round((liveTotals.pnl / liveTotals.net_paid) * 100)
      : 0;

  // ==========================================================
  // -- SECTION 6: P&L DISPLAY STRING -------------------------
  // Formats the P&L value with the Rs symbol.
  // For negative values: "Rs -1,23,456" (sign before number)
  // For positive values: "Rs 1,23,456"
  //
  // We handle the sign manually (rather than letting toLocaleString
  // do it) so the Rs symbol always comes before the number,
  // not before the minus sign (Rs-1,23,456 looks incorrect).
  // ==========================================================

  const pnlDisplay =
    liveTotals.pnl < 0
      ? `Rs -${formatCurrency(Math.abs(liveTotals.pnl))}` // Negative: "Rs -1,23,456"
      : `Rs ${formatCurrency(liveTotals.pnl)}`;            // Positive: "Rs 1,23,456"

  // ==========================================================
  // -- SECTION 7: RENDER -------------------------------------
  // Renders a Bootstrap row containing all 6 KPI cards.
  // container-fluid removes horizontal padding so cards fill
  // the full width of the parent container.
  // ==========================================================

  return (
    <div className="container-fluid mb-4">

      {/* Bootstrap row — cards sit side by side, wrap on smaller screens */}
      <div className="row">

        {/* --- CARD 1: STUDENT COUNT -------------------------------- */}
        {/* Shows total student headcount across all filtered rows */}
        {/* Blue gradient — neutral informational color */}
        <GlassCard
          title="Student Count"
          value={formatCurrency(liveTotals.students)} // e.g. "1,23,456"
          color="linear-gradient(135deg, #0F4C81, #1E88E5)"
        />

        {/* --- CARD 2: REVENUE ------------------------------------- */}
        {/* Shows total gross billed amount (total_amount) */}
        {/* Teal gradient — represents income/money coming in */}
        <GlassCard
          title="Revenue"
          value={`Rs ${formatCurrency(liveTotals.revenue)}`} // e.g. "Rs 12,34,567"
          color="linear-gradient(135deg, #00695C, #26A69A)"
        />

        {/* --- CARD 3: NET RECEIVED --------------------------------- */}
        {/* Shows total actually collected (paid_amount) */}
        {/* This is the denominator used for all P&L % calculations */}
        {/* Shown here so the user can see the base that P&L % is from */}
        {/* Blue gradient — distinguishable from Revenue card */}
        <GlassCard
          title="Net Received"
          value={`Rs ${formatCurrency(liveTotals.net_paid)}`} // e.g. "Rs 10,00,000"
          color="linear-gradient(135deg, #1565C0, #42A5F5)"
        />

        {/* --- CARD 4: TOTAL EXPENDITURE ---------------------------- */}
        {/* Shows sum of all 11 expenditure fields */}
        {/* Reflects user edits in real time */}
        {/* Purple gradient — neutral "cost" color */}
        <GlassCard
          title="Total Expenditure"
          value={`Rs ${formatCurrency(liveTotals.expenditure)}`} // e.g. "Rs 8,50,000"
          color="linear-gradient(135deg, #6A1B9A, #8E24AA)"
        />

        {/* --- CARD 5: P & L AMOUNT --------------------------------- */}
        {/* Net Received minus Total Expenditure */}
        {/* GREEN card when profit (pnl >= 0) */}
        {/* RED card when loss (pnl < 0) — color flips automatically */}
        <GlassCard
          title="P & L"
          value={pnlDisplay}   // e.g. "Rs 1,50,000" or "Rs -50,000"
          color={
            liveTotals.pnl >= 0
              ? "linear-gradient(135deg, #2E7D32, #66BB6A)" // Green for profit
              : "linear-gradient(135deg, #C62828, #EF5350)"  // Red for loss
          }
        />

        {/* --- CARD 6: P & L PERCENTAGE ----------------------------- */}
        {/* (P&L / Net Received) * 100, rounded to integer */}
        {/* GREEN card when >= 0%, ORANGE-RED card when < 0% */}
        <GlassCard
          title="P & L %"
          value={`${finalPnlPercent}%`}  // e.g. "15%" or "-8%"
          color={
            finalPnlPercent >= 0
              ? "linear-gradient(135deg, #2E7D32, #66BB6A)"  // Green for profit %
              : "linear-gradient(135deg, #D84315, #FF7043)"   // Orange-red for loss %
          }
        />

      </div>
    </div>
  );
}

// Export KPICards as the default export so App.jsx can import it
export default KPICards;