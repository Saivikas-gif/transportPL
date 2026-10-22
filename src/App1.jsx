// import React, { useState, useEffect, useMemo } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";


// import Filters from "./components/fil";
// import ReportTable from "./components/t";
// import Pagination from "./components/pag";
// import KPICards from "./components/KPICards";
// function App() {

//   // =========================================
//   // MAIN STATES
//   // =========================================
//   const [data, setData] = useState([]);

//   const [loading, setLoading] = useState(true);

//   const [error, setError] = useState(null);

//   // =========================================
//   // FILTER STATES
//   // =========================================
//   const [selectedState, setSelectedState] = useState([]);

//   const [selectedZone, setSelectedZone] = useState([]);

//   const [selectedBranch, setSelectedBranch] = useState([]);

//   const [selectedZoneIncharge, setSelectedZoneIncharge] = useState([]);

//   const [selectedAgm, setSelectedAgm] = useState([]);

//   const [selectedRIName, setSelectedRIName] = useState([]);

//   const [pnlActions, setPnlActions] = useState("");

//   // =========================================
//   // PNL FILTER
//   // =========================================
//   // const [selectedPnlFilter, setSelectedPnlFilter] = useState(['loss']);

//   const [selectedPnlFilter, setSelectedPnlFilter] = useState([
//     { value: "loss", label: "📉 Loss (< 0%)", color: "#dc3545", bg: "#f8d7da" },

//     {
//       value: "zero",
//       label: "➖ No Profit / Loss (0%)",
//       color: "#6c757d",
//     },

//     {
//       value: "profit",
//       label: "📈 Profit (> 0%)",
//       color: "#198754",
//     },
//   ]);

//   // =========================================
//   // EDITED ROWS
//   // =========================================
//   const [editedRows, setEditedRows] = useState({});

//   // =========================================
//   // PAGINATION
//   // =========================================
//   const [currentPage, setCurrentPage] = useState(1);

//   const [jumpValue, setJumpValue] = useState("");

//   const rowsPerPage = 100;

//   // =========================================
//   // YEAR / MONTH
//   // =========================================
//   const [currentYear, setCurrentYear] = useState(2025);

//   const [currentMonth, setCurrentMonth] = useState(3);

//   // =========================================
//   // PNL FILTERED DATA
//   // =========================================
//   const [pnlFilteredData, setPnlFilteredData] = useState([]);

//   const allPnlOptions = [
//     {
//       value: "loss",
//       label: "📉 Loss (<0%)",
//       color: "#dc3545",
//     },

//     {
//       value: "zero",
//       label: "➖ No Profit / Loss(0%)",
//       color: "#6c757d",
//     },

//     {
//       value: "profit",
//       label: "📈 Profit (> 0%)",
//       color: "#198754",
//     },
//   ];

//   // Pnl actions

//   useEffect(() => {
//     const hiddenInput = document.getElementById("pnl_actions_transport");

//     const value = hiddenInput?.value?.trim();

//     console.log("Hidden Input Value: ", value || "Not Found");

//     if (value) {
//       console.log("Setting p&L filter from hidden input: ", value);

//       setPnlActions(value);
//     }
//     else {
//       console.log("Hidden input empty/not found,setting default P&L filter to 'loss'");
//       // setPnlActions("loss,profit,zero");
//       setPnlActions("loss");
//     }
//   }, []);

//   const allowedPnlValues = pnlActions
//     ? pnlActions.split(",")
//     : [];

//   const filteredPnlOptions = allPnlOptions.filter((item) =>
//     allowedPnlValues.includes(item.value));

//   useEffect(() => {

//     if (filteredPnlOptions.length > 0) {

//       setSelectedPnlFilter(filteredPnlOptions);

//     } else {

//       // Default fallback = LOSS
//       setSelectedPnlFilter([
//         {
//           value: "loss",
//           label: "📉 Loss (<0%)",
//           color: "#dc3545",
//         },
//       ]);

//     }

//   }, [pnlActions]);


//   // =========================================
//   // FETCH API
//   // =========================================
//   useEffect(() => {

//     setLoading(true);

//     setError(null);

//     fetch(
//       `http://192.168.0.1/sctsadmissions/p_and_l_report_apis.php?endpoint=report1&academic_year=2026`
//     )

//       .then((res) => {

//         if (!res.ok) {
//           throw new Error("API Error");
//         }

//         return res.json();
//       })

//       .then((result) => {

//         setData(result.data || []);

//         setCurrentPage(1);

//         setLoading(false);
//       })

//       .catch((err) => {

//         console.log(err);

//         setError("Server Not Responding");

//         setLoading(false);
//       });

//   }, [currentYear, currentMonth]);

//   // =========================================
//   // FILTERED DATA
//   // =========================================
//   const filteredData = useMemo(() => {

//     return data.filter((item) => {

//       const matchAgm =
//         selectedAgm.length === 0 ||
//         selectedAgm.includes(item.agm);

//       const matchState =
//         selectedState.length === 0 ||
//         selectedState.includes(item.state_name);

//       const matchZone =
//         selectedZone.length === 0 ||
//         selectedZone.includes(item.zone_name);

//       const matchRI =
//         selectedRIName.length === 0 ||
//         selectedRIName.includes(item.ri_name);

//       const matchBranch =
//         selectedBranch.length === 0 ||
//         selectedBranch.includes(item.BSBranchName);

//       return (
//         matchAgm &&
//         matchState &&
//         matchZone &&
//         matchRI &&
//         matchBranch
//       );
//     });

//   }, [
//     data,
//     selectedAgm,
//     selectedState,
//     selectedZone,
//     selectedRIName,
//     selectedBranch,
//   ]);

//   // =========================================
//   // SYNC PNL FILTER DATA
//   // =========================================


//   // =========================================
//   // TOTAL ROWS
//   // =========================================
//   const totalRows = pnlFilteredData.length;

//   const totalPages = Math.max(
//     1,
//     Math.ceil(totalRows / rowsPerPage)
//   );

//   // =========================================
//   // GRAND TOTALS
//   // =========================================
//   const totals = useMemo(() => {

//     return filteredData.reduce(

//       (acc, item) => {

//         acc.fusion += Number(item.fusion_building_code) || 0;

//         acc.students += Number(item.student_count) || 0;

//         acc.revenue +=
//           Math.round(Number(item.total_amount) || 0);

//         acc.amc +=
//           Math.round(Number(item.amc) || 0);

//         acc.depreciation +=
//           Math.round(Number(item.depreciation) || 0);

//         acc.drivers +=
//           Math.round(Number(item.drivers_charges) || 0);

//         acc.fuel +=
//           Math.round(Number(item.fuel) || 0);

//         acc.hire +=
//           Math.round(Number(item.hire_charges) || 0);

//         acc.insurance +=
//           Math.round(Number(item.insurance) || 0);

//         acc.rm +=
//           Math.round(Number(item.r_and_m) || 0);

//         acc.taxes +=
//           Math.round(Number(item.rates_and_taxes) || 0);

//         acc.salary +=
//           Math.round(Number(item.salaries) || 0);

//         acc.substaff +=
//           Math.round(Number(item.substaff_salaries) || 0);

//         acc.finance_charges +=
//           Math.round(Number(item.finance_charges) || 0);

//         const exp =
//           Math.round(Number(item.expenditure) || 0);

//         acc.expenditure += exp;

//         acc.pnl +=
//           Math.round(Number(item.total_amount) || 0) - exp;

//         return acc;
//       },

//       {
//         fusion: 0,
//         students: 0,
//         revenue: 0,
//         amc: 0,
//         depreciation: 0,
//         drivers: 0,
//         fuel: 0,
//         hire: 0,
//         insurance: 0,
//         rm: 0,
//         taxes: 0,
//         salary: 0,
//         substaff: 0,
//         finance_charges: 0,
//         expenditure: 0,
//         pnl: 0,
//       }
//     );

//   }, [filteredData]);

//   // =========================================
//   // LOADING
//   // =========================================
//   if (loading) {

//     return (
//       <h4 className="text-center mt-5">
//         ⏳ Loading...
//       </h4>
//     );
//   }

//   // =========================================
//   // ERROR
//   // =========================================
//   if (error) {

//     return (
//       <h4 className="text-center mt-5 text-danger">
//         ❌ {error}
//       </h4>
//     );
//   }

//   // =========================================
//   // UI
//   // =========================================
//   return (

//     <div
//       style={{
//         minHeight: "100vh",
//         overflow: "hidden",
//       }}
//     >

//       <div
//         className="min-h-screen bg-gray-100 py-6 pl-4 pr-8"
//         style={{
//           background: "rgba(255,255,255,0.95)",
//           borderRadius: "12px",
//           paddingRight: "65px",
//         }}
//       >

//         <h2 className="text-center mb-3 text-primary">
//           🚚 Transportation P &amp; L Report
//         </h2>

//         {/* ========================================= */}
//         {/* FILTERS */}
//         {/* ========================================= */}

//         <Filters
//           data={data}
//           filteredData={filteredData}
//           editedRows={editedRows}
//           setEditedRows={setEditedRows}

//           selectedState={selectedState}
//           selectedZone={selectedZone}
//           selectedBranch={selectedBranch}
//           selectedZoneIncharge={selectedZoneIncharge}
//           selectedRIName={selectedRIName}
//           selectedAgm={selectedAgm}

//           setSelectedState={setSelectedState}
//           setSelectedZone={setSelectedZone}
//           setSelectedBranch={setSelectedBranch}
//           setSelectedZoneIncharge={setSelectedZoneIncharge}
//           setSelectedRIName={setSelectedRIName}
//           setSelectedAgm={setSelectedAgm}

//           setCurrentPage={setCurrentPage}

//           currentYear={currentYear}
//           setCurrentYear={setCurrentYear}

//           currentMonth={currentMonth}
//           setCurrentMonth={setCurrentMonth}

//           selectedPnlFilter={selectedPnlFilter}
//           setSelectedPnlFilter={setSelectedPnlFilter}

//           pnlFilteredData={pnlFilteredData}
//           pnlOptions={filteredPnlOptions}
//         />

//         {/* ========================================= */}
//         {/* KPI CARDS */}
//         {/* ========================================= */}
//         <KPICards
//           pnlFilteredData={pnlFilteredData}
//           editedRows={editedRows}
//         />


//         {/* ========================================= */}
//         {/* TABLE */}
//         {/* ========================================= */}

//         <ReportTable
//           data={filteredData}
//           filteredData={filteredData}

//           totals={totals}

//           totalRows={totalRows}

//           currentPage={currentPage}
//           totalPages={totalPages}

//           setCurrentPage={setCurrentPage}

//           jumpValue={jumpValue}
//           setJumpValue={setJumpValue}

//           editedRows={editedRows}
//           setEditedRows={setEditedRows}

//           selectedPnlFilter={selectedPnlFilter}

//           onPnlFilteredData={setPnlFilteredData}
//           pnlActions={pnlActions}
//         />

//         {/* ========================================= */}
//         {/* PAGINATION */}
//         {/* ========================================= */}

//         <Pagination
//           filteredData={pnlFilteredData}

//           selectedState={selectedState}
//           selectedZone={selectedZone}
//           selectedBranch={selectedBranch}
//           selectedAgm={selectedAgm}
//           selectedRIName={selectedRIName}

//           selectedPnlFilter={selectedPnlFilter}

//           totalRows={totalRows}

//           currentPage={currentPage}
//           totalPages={totalPages}

//           setCurrentPage={setCurrentPage}

//           jumpValue={jumpValue}
//           setJumpValue={setJumpValue}
//         />

//       </div>

//     </div>
//   );
// }

// export default App;



// ============================================================
// App.jsx — Root 
// This is the top-level component that:
//   1. Fetches data from the API
//   2. Manages all filter/edit/pagination state
//   3. Passes data down to Filters, KPICards, ReportTable, Pagination
// ============================================================

// Import React core and the hooks we need
import React, { useState, useEffect, useMemo } from "react";

// Import Bootstrap CSS globally so all child components can use Bootstrap classes
import "bootstrap/dist/css/bootstrap.min.css";

// Import child components — each handles one section of the UI
import Filters from "./components1/fil";     // Filter dropdowns (State, Zone, Branch, AGM, RI, P&L)
import ReportTable from "./components1/t";      // Main data table with editable expenditure cells
import Pagination from "./components1/pag";     // Page navigation controls
import KPICards from "./components1/KPI"; // Summary cards (Students, Revenue, P&L, etc.)

// ============================================================
// ROOT COMPONENT
// ============================================================
function App() {

  // ==========================================================
  // ── SECTION 1: MAIN DATA STATE ────────────────────────────
  // ==========================================================

  // Holds the full raw dataset returned by the API
  const [data, setData] = useState([]);

  // true while the API call is in-flight — shows a loading spinner
  const [loading, setLoading] = useState(true);

  // Stores an error message string if the API call fails, null otherwise
  const [error, setError] = useState(null);

  // ==========================================================
  // ── SECTION 2: FILTER STATES ──────────────────────────────
  // Each filter is an array of selected values (multi-select).
  // Empty array = "no filter applied" = show all rows.
  // ==========================================================

  // Stores which state names the user has selected in the State filter
  const [selectedState, setSelectedState] = useState([]);

  // Stores which zone names the user has selected in the Zone filter
  const [selectedZone, setSelectedZone] = useState([]);

  // Stores which branch names the user has selected in the Branch filter
  const [selectedBranch, setSelectedBranch] = useState([]);

  // Stores which zone incharges the user has selected (passed to Filters but not used in filteredData yet)
  const [selectedZoneIncharge, setSelectedZoneIncharge] = useState([]);

  // Stores which AGM names the user has selected in the AGM filter
  const [selectedAgm, setSelectedAgm] = useState([]);

  // Stores which RI names the user has selected in the RI Name filter
  const [selectedRIName, setSelectedRIName] = useState([]);

  // Stores the raw comma-separated P&L action string read from the hidden HTML input
  // e.g. "loss,profit" or "loss" — controls which P&L buckets are allowed
  const [pnlActions, setPnlActions] = useState("");

  // ==========================================================
  // ── SECTION 3: P&L FILTER STATE ───────────────────────────
  // selectedPnlFilter is an array of option objects.
  // Each object has { value, label, color }.
  // Default shows all three buckets (loss, zero, profit).
  // ==========================================================

  const [selectedPnlFilter, setSelectedPnlFilter] = useState([
    // Loss bucket — rows where P&L % < 0
    { value: "loss", label: "📉 Loss (< 0%)", color: "#dc3545", bg: "#f8d7da" },
    // Zero bucket — rows where P&L % = 0
    { value: "zero", label: "➖ No Profit / Loss (0%)", color: "#6c757d" },
    // Profit bucket — rows where P&L % > 0
    { value: "profit", label: "📈 Profit (> 0%)", color: "#198754" },
  ]);

  // ==========================================================
  // ── SECTION 4: EDITED ROWS STATE ──────────────────────────
  // Stores user-edited expenditure values for any row.
  // Shape: { "rowKey": { amc: 123, fuel: 456, ... }, ... }
  // rowKey = "state_zone_branch_agm_riname" (unique per row)
  // ==========================================================

  const [editedRows, setEditedRows] = useState({});

  // ==========================================================
  // ── SECTION 5: PAGINATION STATE ───────────────────────────
  // ==========================================================

  // Which page the user is currently on (1-indexed)
  const [currentPage, setCurrentPage] = useState(1);

  // The value typed into the "Jump to page" input field
  const [jumpValue, setJumpValue] = useState("");

  // How many rows to show per page — fixed at 100
  const rowsPerPage = 100;

  // ==========================================================
  // ── SECTION 6: YEAR / MONTH STATE ─────────────────────────
  // Used to pass the academic year to the API call.
  // (currentMonth is stored but the API currently uses a fixed year)
  // ==========================================================

  // Currently selected academic year — default 2025
  const [currentYear, setCurrentYear] = useState(2025);

  // Currently selected month — default March (3)
  const [currentMonth, setCurrentMonth] = useState(3);

  // ==========================================================
  // ── SECTION 7: PNL-FILTERED DATA STATE ────────────────────
  // This state is SET by ReportTable (via onPnlFilteredData callback)
  // and READ by KPICards, Pagination, and totalRows calculation.
  // It holds only the rows that pass the active P&L bucket filter.
  // ==========================================================

  const [pnlFilteredData, setPnlFilteredData] = useState([]);

  // ==========================================================
  // ── SECTION 8: ALL P&L OPTIONS DEFINITION ─────────────────
  // Master list of all possible P&L filter options.
  // The hidden input in the HTML page controls which of these
  // are actually shown to the user (via filteredPnlOptions below).
  // ==========================================================

  const allPnlOptions = [
    { value: "loss", label: "📉 Loss (<0%)", color: "#dc3545" },
    { value: "zero", label: "➖ No Profit / Loss(0%)", color: "#6c757d" },
    { value: "profit", label: "📈 Profit (> 0%)", color: "#198754" },
  ];

  // ==========================================================
  // ── SECTION 9: READ HIDDEN INPUT ON MOUNT ─────────────────
  // The parent PHP/HTML page injects a hidden <input> element
  // with id="pnl_actions_transport" whose value is a comma-
  // separated list like "loss" or "loss,profit".
  // We read it once on mount to restrict which P&L buckets
  // the user can see/filter by.
  // ==========================================================

  useEffect(() => {
    // Try to find the hidden input element in the DOM
    const hiddenInput = document.getElementById("pnl_actions_transport");

    // Read its value and strip leading/trailing whitespace
    const value = hiddenInput?.value?.trim();

    // Log what we found — useful for debugging in production
    console.log("Hidden Input Value: ", value || "Not Found");

    if (value) {
      // If the hidden input has a value, use it to set allowed P&L buckets
      console.log("Setting p&L filter from hidden input: ", value);
      setPnlActions(value); // e.g. "loss" or "loss,profit"
    } else {
      // If the hidden input is missing or empty, default to showing only "loss" rows
      console.log("Hidden input empty/not found, setting default P&L filter to 'loss'");
      setPnlActions("loss");
    }
  }, []); // Empty dependency array = run only once when the component first mounts

  // ==========================================================
  // ── SECTION 10: DERIVE ALLOWED P&L OPTIONS ────────────────
  // Split the pnlActions string ("loss,profit") into an array
  // ["loss", "profit"], then filter allPnlOptions to only keep
  // the ones whose value is in that array.
  // ==========================================================

  // Convert "loss,profit" → ["loss", "profit"]
  // If pnlActions is empty string, produce an empty array
  const allowedPnlValues = pnlActions
    ? pnlActions.split(",")
    : [];

  // Keep only the option objects whose .value is in allowedPnlValues
  // e.g. if allowedPnlValues = ["loss"], filteredPnlOptions = [{ value:"loss", ... }]
  const filteredPnlOptions = allPnlOptions.filter((item) =>
    allowedPnlValues.includes(item.value)
  );

  // ==========================================================
  // ── SECTION 11: SYNC selectedPnlFilter WITH pnlActions ────
  // Whenever pnlActions changes (set from the hidden input),
  // update selectedPnlFilter to match the allowed options.
  // This ensures the filter UI and active filter stay in sync.
  // ==========================================================

  useEffect(() => {
    if (filteredPnlOptions.length > 0) {
      // If there are valid allowed options, set them as the active filter
      setSelectedPnlFilter(filteredPnlOptions);
    } else {
      // Fallback: if no valid options were found, default to loss-only
      setSelectedPnlFilter([
        { value: "loss", label: "📉 Loss (<0%)", color: "#dc3545" },
      ]);
    }
  }, [pnlActions]); // Re-run whenever pnlActions changes

  // ==========================================================
  // ── SECTION 12: FETCH DATA FROM API ───────────────────────
  // Fetches the P&L report data whenever currentYear or
  // currentMonth changes. Runs on first mount too (both have
  // initial values set above).
  // ==========================================================

  useEffect(() => {
    // Show the loading spinner while the request is in-flight
    setLoading(true);

    // Clear any previous error message
    setError(null);

    // Make a GET request to the PHP API with academic_year as query param
    // Note: currentMonth is in state but the URL currently uses a fixed year (2026)
    fetch(
      "http://192.168.0.1/sctsadmissions/p_and_l_report_apis.php?endpoint=report1&academic_year=" +
      currentYear + "&month=" + currentMonth
    )
      .then((res) => {
        // If the HTTP status is not 2xx, throw an error to jump to .catch()
        if (!res.ok) {
          throw new Error("API Error");
        }
        // Parse the response body as JSON
        return res.json();
      })
      .then((result) => {
        // Store the rows array from the API response
        // If result.data is undefined/null, fall back to an empty array
        setData(result.data || []);

        // Reset to page 1 whenever new data arrives
        setCurrentPage(1);

        // Hide the loading spinner now that data is ready
        setLoading(false);
      })
      .catch((err) => {
        // Log the error details to the console for debugging
        console.log(err);

        // Show a user-friendly error message in the UI
        setError("Server Not Responding");

        // Hide the loading spinner even on failure
        setLoading(false);
      });

  }, [currentYear, currentMonth]); // Re-fetch whenever the year or month changes

  // ==========================================================
  // ── SECTION 13: FILTERED DATA (client-side) ───────────────
  // Applies the State / Zone / Branch / AGM / RI Name filters
  // to the full `data` array.
  // useMemo prevents re-filtering on every render — only
  // recalculates when data or any filter selection changes.
  // ==========================================================

  const filteredData = useMemo(() => {

    return data.filter((item) => {

      // If no AGMs are selected, all rows pass; otherwise the row's agm must be in the selected list
      const matchAgm =
        selectedAgm.length === 0 ||
        selectedAgm.includes(item.agm);

      // If no states are selected, all rows pass; otherwise match state_name
      const matchState =
        selectedState.length === 0 ||
        selectedState.includes(item.state_name);

      // If no zones are selected, all rows pass; otherwise match zone_name
      const matchZone =
        selectedZone.length === 0 ||
        selectedZone.includes(item.zone_name);

      // If no RI names are selected, all rows pass; otherwise match ri_name
      const matchRI =
        selectedRIName.length === 0 ||
        selectedRIName.includes(item.ri_name);

      // If no branches are selected, all rows pass; otherwise match BSBranchName
      const matchBranch =
        selectedBranch.length === 0 ||
        selectedBranch.includes(item.BSBranchName);

      // Row must pass ALL five filters to be included
      return matchAgm && matchState && matchZone && matchRI && matchBranch;
    });

  }, [
    data,           // Re-filter when raw data changes (new API response)
    selectedAgm,    // Re-filter when AGM selection changes
    selectedState,  // Re-filter when State selection changes
    selectedZone,   // Re-filter when Zone selection changes
    selectedRIName, // Re-filter when RI Name selection changes
    selectedBranch, // Re-filter when Branch selection changes
  ]);

  // ==========================================================
  // ── SECTION 14: PAGINATION TOTALS ─────────────────────────
  // totalRows and totalPages are derived from pnlFilteredData
  // (the rows that pass the P&L bucket filter), not filteredData.
  // This ensures the page count reflects what's actually visible.
  // ==========================================================

  // Total number of rows after P&L filter — drives page count and Pagination display
  const totalRows = pnlFilteredData.length;

  // Total pages = ceil(rows / rowsPerPage), minimum 1 so we never show "0 of 0 pages"
  const totalPages = Math.max(
    1,
    Math.ceil(totalRows / rowsPerPage)
  );

  // ==========================================================
  // ── SECTION 15: GRAND TOTALS (for table footer / export) ──
  // Computes column totals across filteredData (NOT pnlFilteredData).
  // These totals are passed to ReportTable as the `totals` prop.
  // Note: uses item.expenditure from the API (not recalculated from
  // individual fields), so it may differ from the live-edited totals
  // shown in the table's Grand Total row.
  // ==========================================================

  const totals = useMemo(() => {

    return filteredData.reduce(
      (acc, item) => {

        // Accumulate fusion building codes (numeric IDs summed)
        acc.fusion += Number(item.fusion_building_code) || 0;

        // Accumulate student count
        acc.students += Number(item.student_count) || 0;

        // Accumulate revenue (total billed amount), rounded to whole rupees
        acc.revenue += Math.round(Number(item.total_amount) || 0);

        // Accumulate each expenditure category, rounded to whole rupees
        acc.amc += Math.round(Number(item.amc) || 0);
        acc.depreciation += Math.round(Number(item.depreciation) || 0);
        acc.drivers += Math.round(Number(item.drivers_charges) || 0);
        acc.fuel += Math.round(Number(item.fuel) || 0);
        acc.hire += Math.round(Number(item.hire_charges) || 0);
        acc.insurance += Math.round(Number(item.insurance) || 0);
        acc.rm += Math.round(Number(item.r_and_m) || 0);
        acc.taxes += Math.round(Number(item.rates_and_taxes) || 0);
        acc.salary += Math.round(Number(item.salaries) || 0);
        acc.substaff += Math.round(Number(item.substaff_salaries) || 0);
        acc.finance_charges += Math.round(Number(item.finance_charges) || 0);

        // Total expenditure comes directly from the API field (pre-summed by the server)
        const exp = Math.round(Number(item.expenditure) || 0);
        acc.expenditure += exp;

        // P&L = revenue - expenditure (using API's expenditure field, not re-summed)
        acc.pnl += Math.round(Number(item.total_amount) || 0) - exp;

        return acc;
      },
      // Initial accumulator — all values start at zero
      {
        fusion: 0, students: 0, revenue: 0,
        amc: 0, depreciation: 0, drivers: 0, fuel: 0,
        hire: 0, insurance: 0, rm: 0, taxes: 0,
        salary: 0, substaff: 0, finance_charges: 0,
        expenditure: 0, pnl: 0,
      }
    );

  }, [filteredData]); // Recalculate only when filteredData changes

  // ==========================================================
  // ── SECTION 16: LOADING STATE RENDER ──────────────────────
  // If the API call is still in-flight, show a loading message
  // and skip rendering the rest of the UI entirely.
  // ==========================================================

  if (loading) {
    return (
      <h4 className="text-center mt-5">
        ⏳ Loading...
      </h4>
    );
  }

  // ==========================================================
  // ── SECTION 17: ERROR STATE RENDER ────────────────────────
  // If the API call failed, show the error message and skip
  // rendering the rest of the UI.
  // ==========================================================

  if (error) {
    return (
      <h4 className="text-center mt-5 text-danger">
        ❌ {error}
      </h4>
    );
  }

  // ==========================================================
  // ── SECTION 18: MAIN UI RENDER ────────────────────────────
  // Rendered only when data has loaded successfully.
  // ==========================================================

  return (

    // Outer wrapper — full viewport height, hides any horizontal overflow
    <div style={{ minHeight: "100vh", overflow: "hidden" }}>

      {/* Inner card — white background with rounded corners and right padding */}
      <div
        className="min-h-screen bg-gray-100 py-6 pl-4 pr-8"
        style={{
          background: "rgba(255,255,255,0.95)", // Slightly transparent white
          borderRadius: "12px",
          paddingRight: "65px",                 // Extra right padding for table scroll area
        }}
      >

        {/* Page title */}
        <h2 className="text-center mb-3 text-primary">
          🚚 Transportation P &amp; L Report
        </h2>

        {/* ================================================= */}
        {/* FILTERS SECTION                                    */}
        {/* Renders all filter dropdowns at the top.           */}
        {/* Receives current filter state + setters so it can  */}
        {/* update them when the user changes a selection.     */}
        {/* ================================================= */}
        <Filters
          // Full raw dataset — used to build dropdown options (unique states, zones, etc.)
          data={data}

          // Client-side filtered data — used to further narrow dropdown options
          filteredData={filteredData}

          // Edited rows state — passed so Filters can show the export button with live values
          editedRows={editedRows}
          setEditedRows={setEditedRows}

          // Current filter selections (read by Filters to show selected values in dropdowns)
          selectedState={selectedState}
          selectedZone={selectedZone}
          selectedBranch={selectedBranch}
          selectedZoneIncharge={selectedZoneIncharge}
          selectedRIName={selectedRIName}
          selectedAgm={selectedAgm}

          // Setters — called by Filters when user changes a dropdown selection
          setSelectedState={setSelectedState}
          setSelectedZone={setSelectedZone}
          setSelectedBranch={setSelectedBranch}
          setSelectedZoneIncharge={setSelectedZoneIncharge}
          setSelectedRIName={setSelectedRIName}
          setSelectedAgm={setSelectedAgm}

          // Reset to page 1 whenever a filter changes (so we don't land on a now-empty page)
          setCurrentPage={setCurrentPage}

          // Year selector — lets user switch academic year
          currentYear={currentYear}
          setCurrentYear={setCurrentYear}

          // Month selector — lets user switch month
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}

          // Active P&L bucket filter — shown as toggle buttons/chips in the filter bar
          selectedPnlFilter={selectedPnlFilter}
          setSelectedPnlFilter={setSelectedPnlFilter}

          // Rows that pass the P&L filter — used by Filters for export (Excel download)
          pnlFilteredData={pnlFilteredData}

          // Only the P&L options allowed by the hidden input — restricts what the user can toggle
          pnlOptions={filteredPnlOptions}
        />

        {/* ================================================= */}
        {/* KPI CARDS SECTION                                  */}
        {/* Shows summary metrics (Students, Revenue, Net      */}
        {/* Received, Expenditure, P&L, P&L%) calculated from */}
        {/* pnlFilteredData + editedRows so they always match  */}
        {/* the table's Grand Total row values.                */}
        {/* ================================================= */}
        {/* <KPICards
          // Only the P&L-filtered rows — cards show totals for what's visible in the table
          pnlFilteredData={pnlFilteredData}

          // User-edited expenditure values — cards use these instead of API values for edited rows
          editedRows={editedRows}
        /> */}

        <KPICards
          filteredData={filteredData}
          editedRows={editedRows}
          selectedPnlFilter={selectedPnlFilter}
        />

        {/* ================================================= */}
        {/* REPORT TABLE SECTION                               */}
        {/* The main scrollable data grid. Handles:            */}
        {/*   - P&L filtering (produces pnlFilteredData)       */}
        {/*   - Sorting (losses first, then zero, then profit) */}
        {/*   - Pagination (shows 100 rows per page)           */}
        {/*   - Inline editing of expenditure cells            */}
        {/*   - Saving edits back to the server API            */}
        {/* ================================================= */}
        <ReportTable
          // Raw unfiltered data (not currently used inside ReportTable but passed for reference)
          data={filteredData}

          // Client-side filtered data — ReportTable applies P&L filter on top of this
          filteredData={filteredData}

          // Grand totals object (from Section 15) — used for any additional footer display
          totals={totals}

          // Total row count after P&L filter — used to calculate total pages
          totalRows={totalRows}

          // Current page number — table slices pnlFilteredData to show only this page's rows
          currentPage={currentPage}
          totalPages={totalPages}

          // Lets the table reset to page 1 when filters change internally
          setCurrentPage={setCurrentPage}

          // Jump-to-page input value — shared between table and pagination
          jumpValue={jumpValue}
          setJumpValue={setJumpValue}

          // Edited row values — table reads these to show live-edited expenditure cells
          editedRows={editedRows}

          // Lets the table update edited values when user types in an expenditure cell
          setEditedRows={setEditedRows}

          // Which P&L buckets are active — table uses this to decide which rows to show
          selectedPnlFilter={selectedPnlFilter}

          // Callback — ReportTable calls this with the P&L-filtered array after every filter change
          // App stores it in pnlFilteredData, which feeds KPICards and Pagination
          onPnlFilteredData={setPnlFilteredData}

          // Raw P&L action string — passed so the table can log/debug the active permission
          pnlActions={pnlActions}
        />

        {/* ================================================= */}
        {/* PAGINATION SECTION                                 */}
        {/* Shows page numbers, Prev/Next buttons, and a       */}
        {/* "Jump to page" input. Works on pnlFilteredData     */}
        {/* so page count reflects the filtered row count.     */}
        {/* ================================================= */}
        <Pagination
          // The P&L-filtered rows — used to compute totalRows and totalPages inside Pagination
          filteredData={pnlFilteredData}

          // Current filter selections — passed so Pagination can show filter summary if needed
          selectedState={selectedState}
          selectedZone={selectedZone}
          selectedBranch={selectedBranch}
          selectedAgm={selectedAgm}
          selectedRIName={selectedRIName}

          // Active P&L bucket filter — passed for display purposes inside Pagination
          selectedPnlFilter={selectedPnlFilter}

          // Total row count — shown as "Showing X of Y rows"
          totalRows={totalRows}

          // Current and total page — controls which page button is highlighted
          currentPage={currentPage}
          totalPages={totalPages}

          // Lets Pagination update the page when user clicks a page button or presses Next/Prev
          setCurrentPage={setCurrentPage}

          // Jump-to-page input value — two-way synced with the table's jump input
          jumpValue={jumpValue}
          setJumpValue={setJumpValue}
        />

      </div>
    </div>
  );
}

// Export App as the default export so index.js can import and render it
export default App;