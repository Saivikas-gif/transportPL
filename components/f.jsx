import React, { useState, useMemo } from "react";
import Select from "react-select";

function Filters({
  data,
  filteredData,
  selectedState,
  selectedZone,
  selectedBranch,
  selectedZoneIncharge,
  selectedRIName,
  selectedAgm,

  setSelectedState,
  setSelectedZone,
  setSelectedBranch,
  setSelectedZoneIncharge,
  setSelectedRIName,
  setSelectedAgm,
  currentYear,
  setCurrentYear,
  currentMonth,
  setCurrentMonth,

  selectedPnlFilter,
  setSelectedPnlFilter,
  pnlFilteredData,
  onDownloadExcel,
}) {
  const [tempState, setTempState] = useState(selectedState || []);
  const [tempZone, setTempZone] = useState(selectedZone || []);
  const [tempBranch, setTempBranch] = useState(selectedBranch || []);
  const [tempAgm, setTempAgm] = useState(selectedAgm || []);
  const [tempRIName, setTempRIName] = useState(selectedRIName || []);

  const [agmSearch, setAgmSearch] = useState("");
  const [riSearch, setRiSearch] = useState("");
  const [stateSearch, setStateSearch] = useState("");
  const [zoneSearch, setZoneSearch] = useState("");
  const [branchSearch, setBranchSearch] = useState("");

  const years = [currentYear + 1, currentYear];
  const months = [
    { value: 1, label: "Jan" }, { value: 2, label: "Feb" },
    { value: 3, label: "Mar" }, { value: 4, label: "Apr" },
    { value: 5, label: "May" }, { value: 6, label: "Jun" },
    { value: 7, label: "Jul" }, { value: 8, label: "Aug" },
    { value: 9, label: "Sep" }, { value: 10, label: "Oct" },
    { value: 11, label: "Nov" }, { value: 12, label: "Dec" },
  ];

  const pnlOptions = [
    { value: "loss", label: "📉 Loss (< 0%)", color: "#dc3545", bg: "#f8d7da" },
    { value: "zero", label: "➖ No Profit / Loss (0%)", color: "#6c757d", bg: "#e2e3e5" },
    { value: "profit", label: "📈 Profit (> 0%)", color: "#198754", bg: "#d1e7dd" },
  ];

  // ── Unique data ──────────────────────────────────────────────────────────
  const states = [...new Set(data.map((i) => i.state || "Unknown"))];

  const zones = [...new Set(
    data
      .filter((i) => tempState.length === 0 || tempState.includes(i.state))
      .map((i) => i.zone || "Unknown")
  )];

  const branches = [...new Set(
    data
      .filter((i) =>
        (tempState.length === 0 || tempState.includes(i.state)) &&
        (tempZone.length === 0 || tempZone.includes(i.zone)) &&
        (tempAgm.length === 0 || tempAgm.includes(i.agm)) &&
        (tempRIName.length === 0 || tempRIName.includes(i.RI))
      )
      .map((i) => i.branch || "Unknown")
  )];

  const agmList = [...new Set(
    data
      .filter((i) =>
        (tempState.length === 0 || tempState.includes(i.state)) &&
        (tempZone.length === 0 || tempZone.includes(i.zone)) &&
        i.agm && i.agm.trim() !== ""
      )
      .map((i) => i.agm.trim())
  )];

  const riNames = [...new Set(
    data
      .filter((i) =>
        (tempState.length === 0 || tempState.includes(i.state)) &&
        (tempZone.length === 0 || tempZone.includes(i.zone)) &&
        (tempAgm.length === 0 || tempAgm.includes(i.agm))
      )
      .map((i) => (i.RI || "Unknown").trim())
  )];

  const toOptions = (arr) => arr.map((v) => ({ label: v, value: v }));

  const agmOptions = useMemo(() => toOptions(agmList), [agmList]);
  const riOptions = useMemo(() => toOptions(riNames), [riNames]);
  const stateOptions = useMemo(() => toOptions(states), [states]);
  const zoneOptions = useMemo(() => toOptions(zones), [zones]);
  const branchOptions = useMemo(() => toOptions(branches), [branches]);

  // ── Checkbox option ──────────────────────────────────────────────────────
  const CheckboxOption = (props) => (
    <div
      {...props.innerProps}
      style={{
        padding: "8px 10px",
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        backgroundColor: props.isFocused ? "#f0f4ff" : "#fff",
      }}
    >
      <input
        type="checkbox"
        checked={props.isSelected}
        readOnly
        style={{
          marginRight: "10px",
          width: "15px",
          height: "15px",
          accentColor: "green",
          cursor: "pointer",
        }}
      />
      <label style={{ margin: 0, cursor: "pointer", fontSize: "13px" }}>
        {props.label}
      </label>
    </div>
  );

  // ── Base select styles (AGM / State / Zone / RI / Branch) ────────────────
  const multiSelectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: "38px",
      height: "38px",
      overflow: "hidden",
      borderRadius: "6px",
      borderColor: state.isFocused ? "#86b7fe" : "#ced4da",
      boxShadow: state.isFocused ? "0 0 0 0.2rem rgba(13,110,253,.25)" : "none",
      backgroundColor: "#fff",
      "&:hover": { borderColor: "#86b7fe" },
    }),
    valueContainer: (base) => ({
      ...base,
      flexWrap: "nowrap",
      overflowX: "hidden",
      maxHeight: "34px",
      padding: "0 8px",
    }),
    multiValue: (base) => ({
      ...base,
      margin: "2px",
      flexShrink: 0,
      backgroundColor: "#e9ecef",
      borderRadius: "4px",
    }),
    multiValueLabel: (base) => ({
      ...base,
      fontSize: "12px",
      color: "#495057",
      padding: "2px 4px",
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: "#6c757d",
      ":hover": { backgroundColor: "#dee2e6", color: "#343a40" },
    }),
    indicatorsContainer: (base) => ({
      ...base,
      height: "38px",
    }),
    clearIndicator: (base) => ({
      ...base,
      padding: "4px",
      color: "#6c757d",
      cursor: "pointer",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      padding: "4px",
      color: "#6c757d",
    }),
    indicatorSeparator: (base) => ({
      ...base,
      backgroundColor: "#dee2e6",
    }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    placeholder: (base) => ({
      ...base,
      color: "#6c757d",
      fontSize: "13px",
      whiteSpace: "nowrap",
    }),
    option: (base, { isFocused }) => ({
      ...base,
      backgroundColor: isFocused ? "#f0f4ff" : "#fff",
      color: "#212529",
    }),
  };

  // ── P&L select styles — colored tags matching Image 1 ────────────────────
  const pnlSelectStyles = {
    ...multiSelectStyles,
    control: (base, state) => ({
      ...multiSelectStyles.control(base, state),
      minWidth: "200px",
    }),
    option: (base, { data, isSelected, isFocused }) => ({
      ...base,
      color: isSelected ? "#fff" : data.color,
      backgroundColor: isSelected ? data.color : isFocused ? data.bg : "#fff",
      fontWeight: "600",
      fontSize: "13px",
    }),
    // ── TAG (multiValue) — solid color background like Image 1 ──────────────
    multiValue: (base, { data }) => ({
      ...base,
      backgroundColor: data.color,   // solid red / grey / green
      borderRadius: "4px",
      margin: "2px",
      flexShrink: 0,
    }),
    multiValueLabel: (base, { data }) => ({
      ...base,
      color: "#fff",
      fontWeight: "600",
      fontSize: "12px",
      padding: "2px 4px",
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: "#fff",
      ":hover": { backgroundColor: "rgba(0,0,0,0.15)", color: "#fff" },
    }),
  };

  const sort = (opts) => [...opts].sort((a, b) => a.label.localeCompare(b.label));

  // ── Label style matching Image 1 ─────────────────────────────────────────
  const labelStyle = {
    fontSize: "11px",
    color: "#6c757d",
    display: "block",
    marginBottom: "2px",
    fontWeight: "500",
  };

  const filterBox = {
    display: "flex",
    flexDirection: "column",
    minWidth: "160px",
  };

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "12px",
        marginBottom: "16px",
        alignItems: "flex-end",
        padding: "12px 16px",
        backgroundColor: "#f8f9fa",
        borderRadius: "8px",
        border: "1px solid #e9ecef",
      }}
    >
      {/* ── Year ── */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label style={labelStyle}>Year</label>
        <select
          value={currentYear}
          onChange={(e) => setCurrentYear(Number(e.target.value))}
          className="form-select"
          style={{ height: "38px", width: "100px", fontSize: "13px" }}
        >
          {years.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      {/* ── Month ── */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label style={labelStyle}>Month</label>
        <select
          value={currentMonth}
          onChange={(e) => setCurrentMonth(Number(e.target.value))}
          className="form-select"
          style={{ height: "38px", width: "90px", fontSize: "13px" }}
        >
          {months.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
        </select>
      </div>

      {/* ── P&L Filter ── */}
      <div>
        <label style={labelStyle}>P&amp;L Filter</label>

        <Select
          isMulti
          options={pnlOptions}

          // ✅ SAME STRUCTURE AS AGM
          components={{ Option: CheckboxOption }}

          // value={pnlOptions.filter((opt) =>
          //     selectedPnlFilter.includes(opt.value)
          // )}

          value={selectedPnlFilter}

          closeMenuOnSelect={false}
          hideSelectedOptions={false}

          styles={multiSelectStyles}

          onChange={(selected) => {
            setSelectedPnlFilter(selected || []);
            setCurrentPage(1);
          }}

          placeholder="Select P&L"

          menuPortalTarget={document.body}
        />
      </div>

      {/* ── AGM ── */}
      <div style={filterBox}>
        <label style={labelStyle}>AGM</label>
        <Select
          isMulti
          options={sort(agmOptions)}
          value={agmOptions.filter((o) => tempAgm.includes(o.value))}
          onChange={(s) => setTempAgm(s ? s.map((i) => i.value) : [])}
          inputValue={agmSearch}
          onInputChange={(v, { action }) => { if (action === "input-change") setAgmSearch(v); }}
          onMenuClose={() => {
            setSelectedAgm(tempAgm);
            setSelectedRIName([]);
            setTempRIName([]);
            setAgmSearch("");
          }}
          components={{ Option: CheckboxOption }}
          styles={multiSelectStyles}
          closeMenuOnSelect={false}
          hideSelectedOptions={false}
          placeholder="Select AGM"
          menuPortalTarget={document.body}
        />
      </div>

      {/* ── State ── */}
      <div style={filterBox}>
        <label style={labelStyle}>State</label>
        <Select
          isMulti
          options={sort(stateOptions)}
          value={stateOptions.filter((o) => tempState.includes(o.value))}
          onChange={(s) => setTempState(s ? s.map((i) => i.value) : [])}
          inputValue={stateSearch}
          onInputChange={(v, { action }) => { if (action === "input-change") setStateSearch(v); }}
          onMenuClose={() => {
            setSelectedState(tempState);
            setSelectedZone([]); setTempZone([]);
            setSelectedBranch([]); setTempBranch([]);
            setSelectedAgm([]); setTempAgm([]);
            setSelectedRIName([]); setTempRIName([]);
            setStateSearch("");
          }}
          components={{ Option: CheckboxOption }}
          styles={multiSelectStyles}
          closeMenuOnSelect={false}
          hideSelectedOptions={false}
          placeholder="Select States"
          menuPortalTarget={document.body}
        />
      </div>

      {/* ── Zone ── */}
      <div style={filterBox}>
        <label style={labelStyle}>Zone</label>
        <Select
          isMulti
          options={sort(zoneOptions)}
          value={zoneOptions.filter((o) => tempZone.includes(o.value))}
          onChange={(s) => setTempZone(s ? s.map((i) => i.value) : [])}
          inputValue={zoneSearch}
          onInputChange={(v, { action }) => { if (action === "input-change") setZoneSearch(v); }}
          onMenuClose={() => {
            setSelectedZone(tempZone);
            setSelectedBranch([]); setTempBranch([]);
            setSelectedAgm([]); setTempAgm([]);
            setSelectedRIName([]); setTempRIName([]);
            setZoneSearch("");
          }}
          components={{ Option: CheckboxOption }}
          styles={multiSelectStyles}
          closeMenuOnSelect={false}
          hideSelectedOptions={false}
          placeholder="Select Zones"
          menuPortalTarget={document.body}
        />
      </div>

      {/* ── RI Name ── */}
      <div style={filterBox}>
        <label style={labelStyle}>RI Name</label>
        <Select
          isMulti
          options={sort(riOptions)}
          value={riOptions.filter((o) => tempRIName.includes(o.value))}
          onChange={(s) => setTempRIName(s ? s.map((i) => i.value) : [])}
          inputValue={riSearch}
          onInputChange={(v, { action }) => { if (action === "input-change") setRiSearch(v); }}
          onMenuClose={() => { setSelectedRIName(tempRIName); setRiSearch(""); }}
          components={{ Option: CheckboxOption }}
          styles={multiSelectStyles}
          closeMenuOnSelect={false}
          hideSelectedOptions={false}
          placeholder="Select RI Name"
          menuPortalTarget={document.body}
        />
      </div>

      {/* ── Branch ── */}
      <div style={filterBox}>
        <label style={labelStyle}>Branch</label>
        <Select
          isMulti
          options={sort(branchOptions)}
          value={branchOptions.filter((o) => tempBranch.includes(o.value))}
          onChange={(s) => setTempBranch(s ? s.map((i) => i.value) : [])}
          inputValue={branchSearch}
          onInputChange={(v, { action }) => { if (action === "input-change") setBranchSearch(v); }}
          onMenuClose={() => { setSelectedBranch(tempBranch); setBranchSearch(""); }}
          components={{ Option: CheckboxOption }}
          styles={multiSelectStyles}
          closeMenuOnSelect={false}
          hideSelectedOptions={false}
          placeholder="Select Branches"
          menuPortalTarget={document.body}
        />
      </div>

      {/* ── Excel Button ── */}
      {onDownloadExcel && (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ ...labelStyle, visibility: "hidden" }}>Excel</label>
          <button
            onClick={onDownloadExcel}
            style={{
              height: "38px",
              padding: "0 20px",
              backgroundColor: "#198754",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              fontWeight: "600",
              fontSize: "14px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              whiteSpace: "nowrap",
              boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
            }}
          >
            ⬇️ Excel
          </button>
        </div>
      )}

    </div>
  );
}

export default Filters;