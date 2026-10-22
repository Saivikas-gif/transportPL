import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import Filters from "./components/Filters";
import ReportTable from "./components/ReportTable";
import Pagination from "./components/Pagination";
import downloadExcel from "./utils/excelDownload";

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedYear, setSelectedYear] = useState("2025");

  const [selectedState, setSelectedState] = useState([]);
  const [selectedZone, setSelectedZone] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState([]);
  const [selectedZoneIncharge, setSelectedZoneIncharge] = useState([]);
  const [selectedAgm, setSelectedAgm] = useState([]);
  const [selectedRIName, setSelectedRIName] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [jumpValue, setJumpValue] = useState("");
  const [selectedColumnView, setSelectedColumnView] = useState("ALL");

  const rowsPerPage = 100;

  // ✅ FETCH DATA BASED ON YEAR
  useEffect(() => {
    setLoading(true);

    fetch(
      `http://192.168.0.1/sctsadmissions/p_and_l_report_apis.php?endpoint=report&academic_year=${selectedYear}`
    )
      .then((res) => res.json())
      .then((result) => {
        setData(result.data || []);
        setCurrentPage(1); // reset page
        setLoading(false);
      })
      .catch((error) => {
        console.error("API Error:", error);
        setLoading(false);
      });
  }, [selectedYear]);

  // ✅ FILTER LOGIC
  const filteredData = data.filter((item) => {
    const matchAgm =
      selectedAgm.length === 0 ||
      selectedAgm.includes(item.agm);

    const matchState =
      selectedState.length === 0 ||
      selectedState.includes(item.state_name);

    const matchZone =
      selectedZone.length === 0 ||
      selectedZone.includes(item.zone_name);

    const matchRI =
      selectedRIName.length === 0 ||
      selectedRIName.includes(item.ri_name);

    const matchBranch =
      selectedBranch.length === 0 ||
      selectedBranch.includes(item.BSBranchName);

    return (
      matchAgm &&
      matchState &&
      matchZone &&
      matchRI &&
      matchBranch
    );
  });

  const totalRows = filteredData.length;

  const totalPages = Math.max(
    1,
    Math.ceil(totalRows / rowsPerPage)
  );

  const currentData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // ✅ TOTALS
  const totals = filteredData.reduce(
    (acc, item) => {
      acc.fusion += Number(item.fusion_building_code) || 0;
      acc.students += Number(item.student_count) || 0;
      acc.revenue += Math.round(Number(item.total_amount) || 0);

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

      acc.finance_charges +=
        Math.round(Number(item.finance_charges) || 0);

      const exp = Math.round(Number(item.expenditure) || 0);
      const pnl = Math.round(Number(item.total_amount) || 0) - exp;

      acc.expenditure += exp;
      acc.pnl += pnl;

      return acc;
    },
    {
      fusion: 0,
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
      substaff: 0,
      finance_charges: 0,
      expenditure: 0,
      pnl: 0,
    }
  );

  if (loading) {
    return <h4 className="text-center mt-5">Loading...</h4>;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        overflow: "hidden",
      }}
    >
      <div
        className="min-h-screen bg-gray-100 py-6 pl-4 pr-8"
        style={{
          background: "rgba(255,255,255,0.95)",
          borderRadius: "12px",
          paddingRight: "65px",
        }}
      >
        <h2 className="text-center mb-3 text-primary">
          🚚 Transportation P & L Report
        </h2>

        {/* ✅ YEAR BUTTONS */}
        <div className="mb-3">
          <button
            className={`btn me-2 ${
              selectedYear === "2025"
                ? "btn-primary"
                : "btn-outline-primary"
            }`}
            onClick={() => setSelectedYear("2025")}
          >
            2025
          </button>

          <button
            className={`btn ${
              selectedYear === "2026"
                ? "btn-primary"
                : "btn-outline-primary"
            }`}
            onClick={() => setSelectedYear("2026")}
          >
            2026
          </button>
        </div>

        <Filters
          data={data}
          filteredData={filteredData}
          selectedState={selectedState}
          selectedZone={selectedZone}
          selectedBranch={selectedBranch}
          selectedZoneIncharge={selectedZoneIncharge}
          selectedRIName={selectedRIName}
          selectedAgm={selectedAgm}
          setSelectedState={setSelectedState}
          setSelectedZone={setSelectedZone}
          setSelectedBranch={setSelectedBranch}
          setSelectedZoneIncharge={setSelectedZoneIncharge}
          setSelectedRIName={setSelectedRIName}
          setSelectedAgm={setSelectedAgm}
          setCurrentPage={setCurrentPage}
        />

        <ReportTable
          data={currentData}
          filteredData={filteredData}
          totals={totals}
          totalRows={totalRows}
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          jumpValue={jumpValue}
          setJumpValue={setJumpValue}
        />

        <Pagination
          filteredData={filteredData}
          totalRows={totalRows}
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          jumpValue={jumpValue}
          setJumpValue={setJumpValue}
        />
      </div>
    </div>
  );
}

export default App;
// import React, { useState, useEffect } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";

// import Filters from "./components/Filters";
// import ReportTable from "./components/ReportTable";
// import Pagination from "./components/Pagination";
// import  downloadExcel  from "./utils/excelDownload"

// function App() {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [selectedState, setSelectedState] = useState([]);
//   const [selectedZone, setSelectedZone] = useState([]);
//   const [selectedBranch, setSelectedBranch] = useState([]);
//   const [selectedZoneIncharge, setSelectedZoneIncharge] = useState([]);
//   const [selectedAgm, setSelectedAgm] = useState([]);
//   const [selectedRIName, setSelectedRIName] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [jumpValue, setJumpValue] = useState("");
//   const [selectedColumnView, setSelectedColumnView] = useState("ALL");

//   const rowsPerPage = 100;

//   useEffect(() => {
//     fetch(
//       "http://192.168.0.1/sctsadmissions/p_and_l_report_apis.php?endpoint=report&academic_year=2025"
//     )
//       .then((res) => res.json())
//       .then((result) => {
//         setData(result.data || []);
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error("API Error:", error);
//         setLoading(false);
//       });
//   }, []);

//   // ✅ FULL FILTER LOGIC
//   const filteredData = data.filter((item) => {
//     const matchAgm =
//       selectedAgm.length === 0 ||
//       selectedAgm.includes(item.agm);

//     const matchState =
//       selectedState.length === 0 ||
//       selectedState.includes(item.state_name);

//     const matchZone =
//       selectedZone.length === 0 ||
//       selectedZone.includes(item.zone_name);

//     const matchRI =
//       selectedRIName.length === 0 ||
//       selectedRIName.includes(item.ri_name);

//     const matchBranch =
//       selectedBranch.length === 0 ||
//       selectedBranch.includes(item.BSBranchName);

//     return (
//       matchAgm &&
//       matchState &&
//       matchZone &&
//       matchRI &&
//       matchBranch
//     );
//   });

//   const totalRows = filteredData.length;

//   const totalPages = Math.max(
//     1,
//     Math.ceil(totalRows / rowsPerPage)
//   );

//   const currentData = filteredData.slice(
//     (currentPage - 1) * rowsPerPage,
//     currentPage * rowsPerPage
//   );

//   const totals = filteredData.reduce(
//     (acc, item) => {
//       acc.fusion += Number(item.fusion_building_code) || 0;
//       acc.students += Number(item.student_count) || 0;
//       acc.revenue += Math.round(Number(item.total_amount) || 0);

//       acc.amc += Math.round(Number(item.amc) || 0);
//       acc.depreciation += Math.round(Number(item.depreciation) || 0);
//       acc.drivers += Math.round(Number(item.drivers_charges) || 0);
//       acc.fuel += Math.round(Number(item.fuel) || 0);
//       acc.hire += Math.round(Number(item.hire_charges) || 0);
//       acc.insurance += Math.round(Number(item.insurance) || 0);
//       acc.rm += Math.round(Number(item.r_and_m) || 0);
//       acc.taxes += Math.round(Number(item.rates_and_taxes) || 0);
//       acc.salary += Math.round(Number(item.salaries) || 0);
//       acc.substaff += Math.round(Number(item.substaff_salaries) || 0);

//       acc.finance_charges +=
//         Math.round(Number(item.finance_charges) || 0);

//       const exp = Math.round(Number(item.expenditure) || 0);
//       const pnl = Math.round(Number(item.total_amount) || 0) - exp;

//       acc.expenditure += exp;
//       acc.pnl += pnl;

//       return acc;
//     },
//     {
//       fusion: 0,
//       students: 0,
//       revenue: 0,
//       amc: 0,
//       depreciation: 0,
//       drivers: 0,
//       fuel: 0,
//       hire: 0,
//       insurance: 0,
//       rm: 0,
//       taxes: 0,
//       salary: 0,
//       substaff: 0,
//       finance_charges: 0,
//       expenditure: 0,
//       pnl: 0,
//     }
//   );

//   if (loading) {
//     return <h4 className="text-center mt-5">Loading...</h4>;
//   }

//   return (
//     <div
//             style={{
//                 minHeight: "100vh",
//                 overflow: "hidden",
//             }}
//         >
//             <div
//                 className="min-h-screen bg-gray-100 py-6 pl-4 pr-8"
//                 style={{
//                     background: "rgba(255,255,255,0.95)",
//                     borderRadius: "12px",
//                     paddingRight: "65px",
//                 }}
//             >
//         <h2 className="text-center mb-3 text-primary">
//           🚚 Transportation P & L Report
//         </h2>
      
//         <div>
//       <div 
//        >
//         <Filters
//           data={data}
//           filteredData={filteredData}
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
//         />
//         </div>

          
//         <ReportTable
//           data={currentData}
//           filteredData={filteredData}
//           totals={totals}
//           totalRows={totalRows}
//           currentPage={currentPage}
//           totalPages={totalPages}
//           setCurrentPage={setCurrentPage}
//           jumpValue={jumpValue}
//           setJumpValue={setJumpValue}
//         />
        
//         <Pagination
//           filteredData={filteredData}
//           totalRows={totalRows}
//           currentPage={currentPage}
//           totalPages={totalPages}
//           setCurrentPage={setCurrentPage}
//           jumpValue={jumpValue}
//           setJumpValue={setJumpValue}
//         />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;
