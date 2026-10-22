import React, { useState, useEffect } from "react";
import Select from "react-select";
import { commonSortingHelper } from "../utils/helpers";
import downloadExcel from "../utils/excelDownload"

function Filters({
  data,
  filteredData,
  selectedState,
  selectedZone,
  selectedBranch,
  editedRows,
  setEditedRows,
  selectedZoneIncharge,
  selectedRIName,
  selectedAgm,
  setSelectedState,
  setSelectedZone,
  setSelectedBranch,
  setSelectedZoneIncharge,
  setSelectedRIName,
  setSelectedAgm,
  setCurrentPage,
   currentYear,
  setCurrentYear,
  currentMonth,
  setCurrentMonth
}) {
  // TEMP STATES
  const [tempState, setTempState] = useState(selectedState || []);
  const [tempZone, setTempZone] = useState(selectedZone || []);
  const [tempBranch, setTempBranch] = useState(selectedBranch || []);
  const [tempAgm, setTempAgm] = useState(selectedAgm || []);
  const [tempRIName, setTempRIName] = useState(selectedRIName || []);

  // SEARCH STATES
  const [agmSearch, setAgmSearch] = useState("");
  const [riSearch, setRiSearch] = useState("");
  const [stateSearch, setStateSearch] = useState("");
  const [zoneSearch, setZoneSearch] = useState("");
  const [branchSearch, setBranchSearch] = useState("");
  
  // console.log("editedRows in filter", editedRows);
  // console.log("editedRows:", editedRows);


   const today = new Date();

  // ✅ years array
  const years = [currentYear + 1, currentYear];

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

  // KEEP TEMP STATES IN SYNC
  useEffect(() => {
    setTempState(selectedState || []);
  }, [selectedState]);

  useEffect(() => {
    setTempZone(selectedZone || []);
  }, [selectedZone]);

  useEffect(() => {
    setTempBranch(selectedBranch || []);
  }, [selectedBranch]);

  useEffect(() => {
    setTempAgm(selectedAgm || []);
  }, [selectedAgm]);

  useEffect(() => {
    setTempRIName(selectedRIName || []);
  }, [selectedRIName]);

  // AGM OPTIONS
  const Agm = [
    ...new Set(
      data
        .filter(
          (item) =>
            (tempState.length === 0 ||
              tempState.includes(item.state_name)) &&
            (tempZone.length === 0 ||
              tempZone.includes(item.zone_name)) &&
            item.agm &&
            item.agm.trim() !== ""
        )
        .map((item) => item.agm || "Unknown")
    ),
  ];

  // STATE OPTIONS
  const states = [
    ...new Set(
      data
        .filter(
          (item) =>
            tempAgm.length === 0 ||
            tempAgm.includes(item.agm)
        )
        .map((item) => item.state_name || "Unknown")
    ),
  ];

  // ZONE OPTIONS
  const zones = [
    ...new Set(
      data
        .filter(
          (item) =>
            (tempState.length === 0 ||
              tempState.includes(item.state_name)) &&
            (tempAgm.length === 0 ||
              tempAgm.includes(item.agm))
        )
        .map((item) => item.zone_name || "Unknown")
    ),
  ];

  // RI OPTIONS
  const Riname = [
    ...new Set(
      data
        .filter(
          (item) =>
            (tempState.length === 0 ||
              tempState.includes(item.state_name)) &&
            (tempZone.length === 0 ||
              tempZone.includes(item.zone_name)) &&
            (tempAgm.length === 0 ||
              tempAgm.includes(item.agm))
        )
        .map((item) => item.ri_name || "Unknown")
    ),
  ];

  // BRANCH OPTIONS
  const branches = [
    ...new Set(
      data
        .filter(
          (item) =>
            (tempState.length === 0 ||
              tempState.includes(item.state_name)) &&
            (tempZone.length === 0 ||
              tempZone.includes(item.zone_name)) &&
            (tempAgm.length === 0 ||
              tempAgm.includes(item.agm)) &&
            (tempRIName.length === 0 ||
              tempRIName.includes(item.ri_name))
        )
        .map((item) => item.BSBranchName || "Unknown")
    ),
  ];

  const stateOptions = states.map((s) => ({
    value: s,
    label: s,
  }));

  const branchOptions = branches.map((b) => ({
    value: b,
    label: b,
  }));

  const zoneOptions = zones.map((z) => ({
    value: z,
    label: z,
  }));

  const agmOptions = Agm.map((a) => ({
    value: a,
    label: a,
  }));

  const riOptions = Riname.map((r) => ({
    value: r,
    label: r,
  }));

  const CheckboxOption = (props) => {
    return (
      <div
        {...props.innerProps}
        style={{
          padding: "8px",
          cursor: "pointer",
        }}
      >
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

  
  return (
    <div className="d-flex flex-wrap gap-3 mb-3" 
     style={{
            background: "#f8f9fc",
            margin:"5px",
            padding: "8px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
           
          }}>

            
      {/* year */}
      <select
        value={currentYear}
        onChange={(e) => {
          setCurrentYear(Number(e.target.value));
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
        value={agmOptions.filter((opt) =>
          tempAgm.includes(opt.value)
        )}
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
        styles={multiSelectStyles}
        inputValue={agmSearch}
        onInputChange={(val, { action }) => {
          if (action === "input-change") setAgmSearch(val);
        }}
        onChange={(selected) => {
          const values = selected
            ? selected.map((s) => s.value)
            : [];
          setTempAgm(values);
        }}
        onMenuClose={() => {
          setSelectedAgm(tempAgm);

          setSelectedState([]);
          setTempState([]);

          setSelectedZone([]);
          setTempZone([]);

          setSelectedBranch([]);
          setTempBranch([]);

          setSelectedRIName([]);
          setTempRIName([]);

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
        value={stateOptions.filter((opt) =>
          tempState.includes(opt.value)
        )}
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
        styles={multiSelectStyles}
        inputValue={stateSearch}
        onInputChange={(val, { action }) => {
          if (action === "input-change") setStateSearch(val);
        }}
        onChange={(selected) => {
          const values = selected
            ? selected.map((s) => s.value)
            : [];
          setTempState(values);
        }}
        onMenuClose={() => {
          setSelectedState(tempState);

          setSelectedZone([]);
          setTempZone([]);

          setSelectedBranch([]);
          setTempBranch([]);

          setSelectedRIName([]);
          setTempRIName([]);

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
        value={zoneOptions.filter((opt) =>
          tempZone.includes(opt.value)
        )}
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
        styles={multiSelectStyles}
        inputValue={zoneSearch}
        onInputChange={(val, { action }) => {
          if (action === "input-change") setZoneSearch(val);
        }}
        onChange={(selected) => {
          const values = selected
            ? selected.map((s) => s.value)
            : [];
          setTempZone(values);
        }}
        onMenuClose={() => {
          setSelectedZone(tempZone);

          setSelectedBranch([]);
          setTempBranch([]);

          setSelectedRIName([]);
          setTempRIName([]);

          setCurrentPage(1);
          setZoneSearch("");
        }}
        placeholder="Select Zones"
      />

      {/* RI */}
      <Select
        isMulti
        options={commonSortingHelper(riOptions)}
        components={{ Option: CheckboxOption }}
        value={riOptions.filter((opt) =>
          tempRIName.includes(opt.value)
        )}
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
        styles={multiSelectStyles}
        inputValue={riSearch}
        onInputChange={(val, { action }) => {
          if (action === "input-change") setRiSearch(val);
        }}
        onChange={(selected) => {
          const values = selected
            ? selected.map((s) => s.value)
            : [];
          setTempRIName(values);
        }}
        onMenuClose={() => {
          setSelectedRIName(tempRIName);

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
        options={commonSortingHelper(branchOptions)}
        components={{ Option: CheckboxOption }}
        value={branchOptions.filter((opt) =>
          tempBranch.includes(opt.value)
        )}
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
        styles={multiSelectStyles}
        inputValue={branchSearch}
        onInputChange={(val, { action }) => {
          if (action === "input-change") setBranchSearch(val);
        }}
        onChange={(selected) => {
          const values = selected
            ? selected.map((s) => s.value)
            : [];
          setTempBranch(values);
        }}
        onMenuClose={() => {
          setSelectedBranch(tempBranch);
          setCurrentPage(1);
          setBranchSearch("");
        }}
        placeholder="Select Branches"
      />
      <button
        className="btn btn-success"
        onClick={() => downloadExcel(filteredData, editedRows)}
      >
        ⬇ Excel
      </button>
    </div>
  );
}

export default Filters;