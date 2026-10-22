​import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Select from "react-select";
import * as XLSX from "xlsx-js-style";
import { saveAs } from "file-saver";

function App() {
  const [data, setData] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState([]);
  const [selectedState, setSelectedState] = useState([]);
  const [selectedZone, setSelectedZone] = useState([]);
  const [selectedAgm, setSelectedAgm] = useState([]);
  const [selectedRiname, setSelectedRiname] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [tempState, setTempState] = useState([]); // selection while choosing
  const [tempZone, setTempZone] = useState([]);
  const [tempBranch, setTempBranch] = useState([]);
  const [tempAgm, setTempAgm] = useState([]);
  const [tempRiname, setTempRiname] = useState([]);

  const [increasePercent, setIncreasePercent] = useState(100);

  const [inputValue, setInputValue] = useState("");

  const [stateSearch, setStateSearch] = useState("");
  const [zoneSearch, setZoneSearch] = useState("");
  const [agmSearch, setAgmSearch] = useState("");
  const [riSearch, setRiSearch] = useState("");
  const [branchSearch, setBranchSearch] = useState("");

  // 🔥 NEW: pagination + jump
  const [currentPage, setCurrentPage] = useState(1);
  const [jumpValue, setJumpValue] = useState("");

  const rowsPerPage = 100;

  const today = new Date();

  const currentYearValue = today.getFullYear();
  const currentMonthValue = today.getMonth() + 1;

  const prevMonth = currentMonthValue === 1 ? 12 : currentMonthValue - 1;
  const prevMonthYear =
    currentMonthValue === 1 ? currentYearValue - 1 : currentYearValue;

  // ✅ state
  const [currentYear, setCurrentYear] = useState(2025);
  const [currentMonth, setCurrentMonth] = useState("3");

  // ✅ years array
  const years = [currentYearValue - 1, currentYearValue];

  // ✅ months array
  const months = [
    { value: 1, label: "Jan" },
    { value: 2, label: "Feb" },
    { value: 3, label: "Mar" },
    { value: 4, label: "Apr" },
    { value: 5, label: "May" },
    { value: 6, label: "Jun" },
    { value: 7, label: "Jul" },
    { value: 8, label: "Aug" },
    { value: 9, label: "Sep" },
    { value: 10, label: "Oct" },
    { value: 11, label: "Nov" },
    { value: 12, label: "Dec" },
  ];

  // useEffect(() => {
  //   fetch(
  //     "http://192.168.0.1/sctsadmissions/p_and_l_report_apis.php?endpoint=report1&academic_year=" +
  //       currentYear +
  //       "&month=" +
  //       currentMonth,
  //   )
  //     .then((res) => {
  //       if (!res.ok) throw new Error("API Error");
  //       return res.json();
  //     })
  //     .then((result) => {
  //       setData(result.data || []);
  //       setLoading(false);
  //     })
  //     .catch(() => {
  //       setError("Server Not Responding");
  //       setLoading(false);
  //     });
  // }, []);

  useEffect(() => {
    setLoading(true);

    fetch(
      "http://192.168.0.1/sctsadmissions/p_and_l_report_apis.php?endpoint=report1&academic_year=" +
        currentYear +
        "&month=" +
        currentMonth,
    )
      .then((res) => {
        if (!res.ok) throw new Error("API Error");
        return res.json();
      })
      .then((result) => {
        setData(result.data || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Server Not Responding");
        setLoading(false);
      });
  }, [currentYear, currentMonth]); // ✅ IMPORTANT

  // States
  const states = [
    ...new Set(
      data
        .filter(
          (item) => selectedAgm.length === 0 || selectedAgm.includes(item.agm),
        )
        .map((item) => item.state_name || "Unknown"),
    ),
  ];

  // branches
  const branches = [
    ...new Set(
      data
        .filter(
          (item) =>
            (selectedState.length === 0 ||
              selectedState.includes(item.state_name)) &&
            (selectedZone.length === 0 ||
              selectedZone.includes(item.zone_name)) &&
            (selectedAgm.length === 0 || selectedAgm.includes(item.agm)) &&
            (selectedRiname.length === 0 ||
              selectedRiname.includes(item.ri_name)),
        )
        .map((item) => item.BSBranchName || "Unknown"),
    ),
  ];

  // Zones
  const zones = [
    ...new Set(
      data
        .filter(
          (item) =>
            (selectedState.length === 0 ||
              selectedState.includes(item.state_name)) &&
            (selectedAgm.length === 0 || selectedAgm.includes(item.agm)),
        )
        .map((item) => item.zone_name || "Unknown"),
    ),
  ];

  // AGM
  const Agm = [
    ...new Set(
      data
        .filter(
          (item) =>
            (selectedState.length === 0 ||
              selectedState.includes(item.state_name)) &&
            (selectedZone.length === 0 ||
              selectedZone.includes(item.zone_name)) &&
            item.agm &&
            item.agm.trim() !== "",
        )
        .map((item) => item.agm || "Unknown"),
    ),
  ];

  //   Ri Name
  const Riname = [
    ...new Set(
      data
        .filter(
          (item) =>
            (selectedState.length === 0 ||
              selectedState.includes(item.state_name)) &&
            (selectedZone.length === 0 ||
              selectedZone.includes(item.zone_name)) &&
            (selectedAgm.length === 0 || selectedAgm.includes(item.agm)),
        )
        .map((item) => item.ri_name || "Unknown"),
    ),
  ];

  // multiple Selceted Options
  const stateOptions = states.map((s) => ({ value: s, label: s }));
  const branchOptions = branches.map((b) => ({ value: b, label: b }));
  const zoneOptions = zones.map((z) => ({ value: z, label: z }));
  const agmOptions = Agm.map((a) => ({ value: a, label: a }));
  const riOptions = Riname.map((r) => ({ value: r, label: r }));

  // State Filter
  const filteredData = data.filter((item) => {
    // console.log(item.agm, "checking filters");
    // console.log(selectedState.length, selected);

    const matchState =
      selectedState.length === 0 || selectedState.includes(item.state_name);

    // Branch Filter
    const matchBranch =
      selectedBranch.length === 0 || selectedBranch.includes(item.BSBranchName);

    // Zone Filter
    const matchZone =
      selectedZone.length === 0 || selectedZone.includes(item.zone_name);

    // AGM Filter
    const matchAgm = selectedAgm.length === 0 || selectedAgm.includes(item.agm);

    //   RI_name Filter
    const ri_name =
      selectedRiname.length === 0 || selectedRiname.includes(item.ri_name);

    // console.log(matchState, matchZone, matchAgm, ri_name, matchBranch);

    return matchState && matchBranch && matchZone && matchAgm && ri_name;
  });

  const formatCurrency = (num) => {
    if (!num) return "-";
    return Math.round(Number(num)).toLocaleString("en-IN");
  };

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

      acc.finance_charges =
        (Number(acc.finance_charges) || 0) +
        Math.round(Number(item.finance_charges) || 0);

      console.log(acc.finance_charges, "Total");

      // acc.finance_charges +=Math.round(Number(item.finance_charges)||0);

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
    },
  );

  // ✅ DEFAULT SORT: P&L ASC (small → big)
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

  // 🔥 PAGINATION LOGIC
  const totalRows = sortedData.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = sortedData.slice(startIndex, startIndex + rowsPerPage);

  // 🔥 JUMP TO ROW (ex: 45 → page 5)
  useEffect(() => {
    setCurrentPage(1);
  }, [
    selectedState,
    selectedBranch,
    selectedZone,
    selectedAgm,
    selectedRiname,
  ]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages || 1);
    }
  }, [totalPages]);

  // const downloadExcel = () => {
  //   const excelData = filteredData.map((item) => {
  //     const net25 = Math.round(Number(item.total_amount) || 0);
  //     const students = Number(item.student_count) || 0;
  //     const year = Number(item.established_year) || 0;

  //     const noOfYears = year && year <= currentYear ? currentYear - year : 0;

  //     const expenditure = Math.round(Number(item.expenditure) || 0);

  //     const pnl = net25 - expenditure;

  //     let percent = 0;
  //     if (net25 > 0) {
  //       percent = (pnl * 100) / net25;
  //     }

  //     const finalPercent = Math.round(percent);

  //     return {
  //       State: item.state_name,
  //       Zone: item.zone_name,
  //       Branch: item.BSBranchName,
  //       AGM: item.agm,
  //       "RI Name": item.ri_name || "-",
  //       "State/CBSE": item.syllabus || "-",
  //       "Campus Type": item.ds_res || "-",
  //       "Year Of Establishment": item.established_year,
  //       "No of Years": noOfYears,

  //       "Fusion Code": Number(item?.fusion_building_code) || 0,

  //       Students: Math.round(students),

  //       "Revenue 25-26": net25,

  //       AMC: Math.round(Number(item?.amc) || 0),

  //       Depreciation: Math.round(Number(item?.depreciation) || 0),

  //       "Drivers Batha": Math.round(Number(item?.drivers_charges) || 0),

  //       Fuel: Math.round(Number(item?.fuel) || 0),

  //       "Hire Charges": Math.round(Number(item?.hire_charges) || 0),

  //       Insurance: Math.round(Number(item?.insurance) || 0),

  //       "R & M": Math.round(Number(item?.r_and_m) || 0),

  //       "Rates & Taxes": Math.round(Number(item?.rates_and_taxes) || 0),

  //       Salaries: Math.round(Number(item?.salaries) || 0),

  //       finance_charges: Math.round(Number(item?.finance_charges) || 0),

  //       "SubStaff Salaries": Math.round(Number(item?.substaff_salaries) || 0),

  //       Expenditure: Math.round(expenditure),

  //       "P & L": Math.round(pnl),

  //       "P & L % Profit/Loss": finalPercent,
  //     };
  //   });

  //   // Convert JSON → Sheet
  //   // Convert JSON → Sheet
  //   const worksheet = XLSX.utils.json_to_sheet(excelData);

  //   // ✅ Get headers and find year column index
  //   const headers = Object.keys(excelData[0]);
  //   const yearColIndex = headers.indexOf("Year of Establishment");

  //   // ✅ Apply Indian comma formatting
  //   const range = XLSX.utils.decode_range(worksheet["!ref"]);
  //   for (let row = range.s.r + 1; row <= range.e.r; row++) {
  //     for (let col = 0; col <= range.e.c; col++) {
  //       const cellAddress = XLSX.utils.encode_cell({
  //         r: row,
  //         c: col,
  //       });

  //       const cell = worksheet[cellAddress];

  //       if (cell && typeof cell.v === "number") {
  //         cell.z = '#,##,##0;-#,##,##0;"-"';
  //       }
  //     }
  //   }

  //   // Create workbook
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

  //   // Convert to file
  //   const excelBuffer = XLSX.write(workbook, {
  //     bookType: "xlsx",
  //     type: "array",
  //   });

  //   const blob = new Blob([excelBuffer], {
  //     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //   });

  //   saveAs(blob, "transport_report.xlsx");
  // };

  const downloadExcel = () => {
    // ✅ helper
    const calculatePercent = (item) => {
      const net = Math.round(Number(item.total_amount) || 0);
      const exp = Math.round(Number(item.expenditure) || 0);
      const pnl = net - exp;

      return net > 0 ? (pnl * 100) / net : 0;
    };

    // ✅ SORT FIRST (ASCENDING)
    const sortedData = [...filteredData].sort(
      (a, b) => calculatePercent(a) - calculatePercent(b),
    );

    // ✅ THEN MAP
    const formattedData = sortedData.map((item) => {
      const net25 = Math.round(Number(item.total_amount) || 0);
      const students = Number(item.student_count) || 0;
      const year = Number(item.established_year) || 0;

      const noOfYears = year && year <= currentYear ? currentYear - year : 0;

      const expenditure = Math.round(Number(item.expenditure) || 0);
      const pnl = net25 - expenditure;

      let percent = 0;
      if (net25 > 0) {
        percent = (pnl * 100) / net25;
      }

      const finalPercent = Math.round(percent);

      return {
        State: item.state_name,
        Zone: item.zone_name,
        Branch: item.BSBranchName,
        AGM: item.agm,
        "RI Name": item.ri_name || "-",
        "State/CBSE": item.syllabus || "-",
        "Campus Type": item.ds_res || "-",
        "Year Of Establishment": item.established_year,
        "No of Years": noOfYears,
        "Fusion Code": (item?.fusion_building_code) || 0,
        Students: Math.round(students),
        "Revenue 25-26": net25,
        AMC: Math.round(Number(item?.amc) || 0),
        Depreciation: Math.round(Number(item?.depreciation) || 0),
        "Drivers Batha": Math.round(Number(item?.drivers_charges) || 0),
        Fuel: Math.round(Number(item?.fuel) || 0),
        "Hire Charges": Math.round(Number(item?.hire_charges) || 0),
        Insurance: Math.round(Number(item?.insurance) || 0),
        "R & M": Math.round(Number(item?.r_and_m) || 0),
        "Rates & Taxes": Math.round(Number(item?.rates_and_taxes) || 0),
        Salaries: Math.round(Number(item?.salaries) || 0),
        "Finance Charges": Math.round(Number(item?.finance_charges) || 0),
        "SubStaff Salaries": Math.round(Number(item?.substaff_salaries) || 0),
        Expenditure: Math.round(expenditure),

        "P & L": Math.round(pnl),
        "P & L % Profit/Loss": finalPercent,
      };
    });

    // =========================
    // CREATE SHEET
    // =========================
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const range = XLSX.utils.decode_range(worksheet["!ref"]);

    // =========================
    // NUMBER FORMAT
    // =========================
    for (let R = range.s.r + 1; R <= range.e.r; R++) {
      for (let C = range.s.c; C <= range.e.c; C++) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        const cell = worksheet[cellAddress];

        if (cell && typeof cell.v === "number") {
          cell.z = '#,##,##0;-#,##,##0;"-"';
        }
      }
    }

    // =========================
    // APPLY COLOR
    // =========================
    const headers = Object.keys(formattedData[0]);

    const pnlColIndex = headers.indexOf("P & L");
    const percentColIndex = headers.indexOf("P & L % Profit/Loss"); // ✅ FIXED

    for (let R = 1; R <= range.e.r; R++) {
      const pnlCell = XLSX.utils.encode_cell({ r: R, c: pnlColIndex });
      const percentCell = XLSX.utils.encode_cell({ r: R, c: percentColIndex });

      const percentValue = worksheet[percentCell]?.v || 0;

      let style = { font: { color: { rgb: "000000" } } };

      if (percentValue < 0) {
        style = { font: { color: { rgb: "FF0000" }, bold: true } };
      } else if (percentValue > 0) {
        style = { font: { color: { rgb: "008000" }, bold: true } };
      }

      if (worksheet[pnlCell]) worksheet[pnlCell].s = style;
      if (worksheet[percentCell]) worksheet[percentCell].s = style;
    }

    // =========================
    // EXPORT
    // =========================
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    saveAs(
      new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      "transport_report.xlsx",
    );
  };

  if (loading) return <h2 className="text-center mt-5">⏳ Loading...</h2>;
  if (error) return <h2 className="text-center text-danger">{error}</h2>;

  const multiSelectStyles = {
    control: (base) => ({
      ...base,
      height: "50px",
      minHeight: "50px",
      alignItems: "flex-start",
      overflow: "hidden",
    }),

    valueContainer: (base) => ({
      ...base,
      display: "block",
      maxHeight: "50px",
      overflowY: "hidden",
      padding: "8px 8px",
      fontWeight: "bold",
      fontSize: "18px",
    }),

    multiValue: (base) => ({
      ...base,
      margin: "2px 0",
    }),

    indicatorsContainer: (base) => ({
      ...base,
      height: "50px",
    }),

    // 🔥 MOST IMPORTANT
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),

    menu: (base) => ({
      ...base,
      zIndex: 9999,
    }),
  };
  const CheckboxOption = (props) => {
    return (
      <div {...props.innerProps} style={{ padding: "8px", cursor: "pointer" }}>
        <input
          type="checkbox"
          checked={props.isSelected}
          onChange={() => null}
          style={{ marginRight: "8px" }}
        />
        <label>{props.label}</label>
      </div>
    );
  };

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

  let totalPercent = 0;

  // console.log(totals.pnl, totals.revenue, "totals");

  if (totals.pnl !== 0) {
    totalPercent = (totals.pnl * 100) / totals.revenue;
  }

  const finalTotalsPercent = Math.round(totalPercent);

  const commonSortingHelper = (options) =>
    [...options].sort((a, b) => a.label.localeCompare(b.label));

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

        <div
          className="d-flex gap-3 mb-3"
          style={{
            background: "#f8f9fc",
            padding: "10px",
            borderRadius: "10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          {/* year */}
          <select
            value={currentYear}
            onChange={(e) => {
              setCurrentYear(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="form-select"
            style={{ width: "100px" }}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          {/* month */}
          <select
            value={currentMonth}
            onChange={(e) => {
              setCurrentMonth(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="form-select"
            style={{ width: "80px" }}
          >
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
          {/* AGM */}
          <Select
            isMulti
            options={commonSortingHelper(agmOptions)}
            components={{ Option: CheckboxOption }}
            value={agmOptions.filter((opt) => tempAgm.includes(opt.value))}
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
            styles={multiSelectStyles}
            inputValue={agmSearch}
            onInputChange={(val, { action }) => {
              if (action === "input-change") setAgmSearch(val);
            }}
            onChange={(selected) => {
              const values = selected ? selected.map((s) => s.value) : [];
              setTempAgm(values);
            }}
            onMenuClose={() => {
              setSelectedAgm(tempAgm); // ✅ IMPORTANT FIX

              // 🔥 reset children
              setSelectedState([]);
              setTempState([]);

              setSelectedZone([]);
              setTempZone([]);

              setSelectedBranch([]);
              setTempBranch([]);

              setSelectedRiname([]);
              setTempRiname([]);

              setCurrentPage(1);
              setAgmSearch("");
            }}
            placeholder="Select AGM"
          />
          {/* STATE */}
          <Select
            isMulti
            options={commonSortingHelper(stateOptions)}
            components={{ Option: CheckboxOption }}
            value={stateOptions.filter((opt) => tempState.includes(opt.value))}
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
            styles={multiSelectStyles}
            inputValue={stateSearch}
            onInputChange={(val, { action }) => {
              if (action === "input-change") setStateSearch(val);
            }}
            onChange={(selected) => {
              const values = selected ? selected.map((s) => s.value) : [];
              setTempState(values);
            }}
            onMenuClose={() => {
              setSelectedState(tempState);

              // 🔥 reset children
              setSelectedZone([]);
              setTempZone([]);

              setSelectedBranch([]);
              setTempBranch([]);

              setSelectedRiname([]);
              setTempRiname([]);

              setCurrentPage(1);
              setStateSearch("");
            }}
            placeholder="Select States"
          />
          {/* ZONE */}
          <Select
            isMulti
            options={commonSortingHelper(zoneOptions)}
            components={{ Option: CheckboxOption }}
            value={zoneOptions.filter((opt) => tempZone.includes(opt.value))}
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
            styles={multiSelectStyles}
            inputValue={zoneSearch}
            onInputChange={(val, { action }) => {
              if (action === "input-change") setZoneSearch(val);
            }}
            onChange={(selected) => {
              const values = selected ? selected.map((s) => s.value) : [];
              setTempZone(values);
            }}
            onMenuClose={() => {
              setSelectedZone(tempZone); // ✅ IMPORTANT FIX

              // 🔥 reset children
              setSelectedBranch([]);
              setTempBranch([]);

              setSelectedRiname([]);
              setTempRiname([]);

              setCurrentPage(1);
              setZoneSearch("");
            }}
            placeholder="Select Zones"
          />
          {/* RI NAME */}
          <Select
            isMulti
            options={commonSortingHelper(riOptions)}
            components={{ Option: CheckboxOption }}
            value={riOptions.filter((opt) => tempRiname.includes(opt.value))}
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
            styles={multiSelectStyles}
            inputValue={riSearch}
            onInputChange={(val, { action }) => {
              if (action === "input-change") setRiSearch(val);
            }}
            onChange={(selected) => {
              const values = selected ? selected.map((s) => s.value) : [];
              setTempRiname(values);
            }}
            onMenuClose={() => {
              setSelectedRiname(tempRiname); // ✅ IMPORTANT FIX

              // 🔥 reset child
              setSelectedBranch([]);
              setTempBranch([]);

              setCurrentPage(1);
              setRiSearch("");
            }}
            placeholder="Select RI Name"
          />
          {/* BRANCH */}
          <Select
            isMulti
            options={branchOptions}
            components={{ Option: CheckboxOption }}
            value={branchOptions.filter((opt) =>
              tempBranch.includes(opt.value),
            )}
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
            styles={multiSelectStyles}
            inputValue={branchSearch}
            onInputChange={(val, { action }) => {
              if (action === "input-change") setBranchSearch(val);
            }}
            onChange={(selected) => {
              const values = selected ? selected.map((s) => s.value) : [];
              setTempBranch(values);
            }}
            onMenuClose={() => {
              setSelectedBranch(tempBranch);

              setCurrentPage(1);
              setBranchSearch("");
            }}
            placeholder="Select Branches"
          />{" "}
          <button className="btn btn-success" onClick={downloadExcel}>
            ⬇ Excel
          </button>
        </div>

        <div
          className="table-responsive"
          style={{
            maxHeight: "65vh",
            overflowY: "auto",
            overflowX: "auto",
            background: "white",
            borderRadius: "10px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
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
                {/* <th style={{ background: "#0099e7", color: "#fff" }}>
                  Net Cost @
                  <input
                    type="number"
                    value={increasePercent}
                    onChange={(e) =>
                      setIncreasePercent(Number(e.target.value) || 0)
                    }
                    style={{
                      color: "#000000",
                      width: "60px",
                      marginLeft: "5px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      padding: "2px 5px",
                    }}
                  />
                  % Increase for 26-27
                </th> */}
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
              </tr>

              <tr style={{ background: "#e8f4ff", fontWeight: "bold" }}>
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
                <th style={{ textAlign: "right" }}>{totals.students}</th>

                <th style={{ textAlign: "right" }}>
                  {formatCurrency(totals.revenue)}
                </th>

                <th style={{ textAlign: "right" }}>
                  {formatCurrency(totals.amc)}
                </th>

                <th style={{ textAlign: "right" }}>
                  {formatCurrency(totals.depreciation)}
                </th>

                <th style={{ textAlign: "right" }}>
                  {formatCurrency(totals.drivers)}
                </th>

                <th style={{ textAlign: "right" }}>
                  {formatCurrency(totals.fuel)}
                </th>

                <th style={{ textAlign: "right" }}>
                  {formatCurrency(totals.hire)}
                </th>

                <th style={{ textAlign: "right" }}>
                  {formatCurrency(totals.insurance)}
                </th>

                <th style={{ textAlign: "right" }}>
                  {formatCurrency(totals.rm)}
                </th>

                <th style={{ textAlign: "right" }}>
                  {formatCurrency(totals.taxes)}
                </th>

                <th style={{ textAlign: "right" }}>
                  {formatCurrency(totals.salary)}
                </th>

                <th style={{ textAlign: "right" }}>
                  {formatCurrency(totals.finance_charges)}
                </th>

                <th style={{ textAlign: "right" }}>
                  {formatCurrency(totals.substaff)}
                </th>

                <th style={{ textAlign: "right" }}>
                  {formatCurrency(totals.expenditure)}
                </th>

                <th style={{ textAlign: "right" }}>
                  {formatCurrency(totals.pnl)}
                </th>

                <th style={{ textAlign: "right" }}> {finalTotalsPercent}%</th>
              </tr>
            </thead>

            <tbody>
              {currentData.length === 0 ? (
                <tr>
                  <td
                    colSpan={"100%"}
                    style={{ textAlign: "center", padding: "20px" }}
                  >
                    ❌ No Data Found
                  </td>
                </tr>
              ) : (
                currentData.map((item, index) => {
                  const net25 = Math.round(item.total_amount) || 0;
                  const newCost = Math.round(
                    net25 * (1 + increasePercent / 100),
                  );

                  const students = Number(item.student_count) || 0;

                  const year = Number(item.established_year) || 0;
                  const noOfYears =
                    year && year <= currentYear ? currentYear - year : "0";

                  const expenditure = Math.round(item.expenditure || 0);
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

                  // const getRowBg = (value) => {
                  //     if (value > 0) return "#d4edda"; // green
                  //     if (value < 0) return "#f8d7da"; // red
                  //     return "#ffffff"; // white for zero
                  // };

                  // console.log(
                  //     item.BSBranchName,
                  //     finalPercent,
                  //     "finalPercent",
                  //     getRowBg(finalPercent),
                  // );

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
                          //background: getRowBg(finalPercent),
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
                          // background: getRowBg(finalPercent),
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
                          // background: getRowBg(finalPercent),
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
                          // background: getRowBg(finalPercent),
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
                          // background: getRowBg(finalPercent),
                        }}
                      >
                        {item.ri_name || "-"}
                      </td>
                      <td
                        style={{
                          textAlign: "left",
                          color: rowTextColor,
                          // background: getRowBg(finalPercent)
                        }}
                      >
                        {item.syllabus || "-"}
                      </td>
                      <td
                        style={{
                          textAlign: "left",
                          color: rowTextColor,
                          //  background: getRowBg(finalPercent)
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
                          // background: getRowBg(finalPercent),
                        }}
                      >
                        {year || "-"}
                      </td>
                      <td
                        style={{
                          textAlign: "right",
                          color: rowTextColor,
                          // background: getRowBg(finalPercent),
                        }}
                      >
                        {noOfYears}
                      </td>
                      <td
                        style={{
                          textAlign: "right",
                          color: rowTextColor,
                          // background: getRowBg(finalPercent),
                        }}
                      >
                        {item.fusion_building_code || "0"}
                      </td>
                      <td
                        style={{
                          textAlign: "right",
                          color: rowTextColor,
                          // background: getRowBg(finalPercent),
                        }}
                      >
                        {formatCurrency(students)}
                      </td>
                      <td
                        style={{
                          textAlign: "right",
                          color: rowTextColor,
                          // background: getRowBg(finalPercent),
                        }}
                      >
                        {formatCurrency(net25)}
                      </td>
                      {/* <td style={{ textAlign: "right", background: getRowBg(finalPercent) }}>
                        {" "}
                        {formatCurrency(newCost)}
                      </td> */}
                      <td
                        style={{
                          textAlign: "right",
                          color: rowTextColor,
                          // background: getRowBg(finalPercent),
                        }}
                      >
                        {formatCurrency(Math.round(item.amc || 0))}
                      </td>
                      <td
                        style={{
                          textAlign: "right",
                          color: rowTextColor,
                          // background: getRowBg(finalPercent),
                        }}
                      >
                        {formatCurrency(Math.round(item.depreciation || 0))}
                      </td>
                      <td
                        style={{
                          textAlign: "right",
                          color: rowTextColor,
                          // background: getRowBg(finalPercent),
                        }}
                      >
                        {formatCurrency(Math.round(item.drivers_charges || 0))}
                      </td>
                      <td
                        style={{
                          textAlign: "right",
                          color: rowTextColor,
                          // background: getRowBg(finalPercent),
                        }}
                      >
                        {formatCurrency(Math.round(item.fuel || 0))}
                      </td>
                      <td
                        style={{
                          textAlign: "right",
                          color: rowTextColor,
                          // background: getRowBg(finalPercent),
                        }}
                      >
                        {formatCurrency(Math.round(item.hire_charges || 0))}
                      </td>
                      <td
                        style={{
                          textAlign: "right",
                          color: rowTextColor,
                          // background: getRowBg(finalPercent),
                        }}
                      >
                        {formatCurrency(Math.round(item.insurance || 0))}
                      </td>
                      <td
                        style={{
                          textAlign: "right",
                          color: rowTextColor,
                          // background: getRowBg(finalPercent),
                        }}
                      >
                        {formatCurrency(Math.round(item.r_and_m || 0))}
                      </td>
                      <td
                        style={{
                          textAlign: "right",
                          color: rowTextColor,
                          // background: getRowBg(finalPercent),
                        }}
                      >
                        {formatCurrency(Math.round(item.rates_and_taxes || 0))}
                      </td>
                      <td
                        style={{
                          textAlign: "right",
                          color: rowTextColor,
                          // background: getRowBg(finalPercent),
                        }}
                      >
                        {formatCurrency(Math.round(item.salaries || 0))}
                      </td>
                      <td
                        style={{
                          textAlign: "right",
                          color: rowTextColor,
                          // background: getRowBg(finalPercent),
                        }}
                      >
                        {formatCurrency(
                          Math.round(item.substaff_salaries || 0),
                        )}
                      </td>
                      <td style={{ textAlign: "right", color: rowTextColor }}>
                        {formatCurrency(Math.round(item.finance_charges)) || 0}
                      </td>
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
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 🔥 BELOW TABLE ADDITIONS */}
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

          {/* 🔥 JUMP TO ROW */}
          <div className="d-flex gap-2">
            <input
              type="number"
              placeholder="Go to page"
              value={jumpValue}
              onChange={(e) => setJumpValue(e.target.value)}
            />

            <button
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
    </div>
  );
}

export default App;
