import React, { useState } from "react";
import Select, { components } from "react-select";

function Filters({
  data,
  selectedState,
  selectedZone,
  selectedBranch,
  selectedRIName,
  selectedAgm,
  setSelectedState,
  setSelectedZone,
  setSelectedBranch,
  setSelectedRIName,
  setSelectedAgm,
  setCurrentPage,
}) {
  const [tempState, setTempState] = useState(selectedState || []);
  const [tempZone, setTempZone] = useState(selectedZone || []);
  const [tempBranch, setTempBranch] = useState(selectedBranch || []);
  const [tempAgm, setTempAgm] = useState(selectedAgm || []);
  const [tempRIName, setTempRIName] = useState(selectedRIName || []);

  const [agmSearch, setAgmSearch] = useState("");
  const [stateSearch, setStateSearch] = useState("");
  const [zoneSearch, setZoneSearch] = useState("");
  const [riSearch, setRiSearch] = useState("");
  const [branchSearch, setBranchSearch] = useState("");

  // ===============================
  // CREATE OPTIONS WITH SEARCH
  // ===============================
  const createOptions = (arr, searchText = "") =>
    [...new Set(arr.filter(Boolean))]
      .filter((item) =>
        item.toLowerCase().includes(searchText.toLowerCase())
      )
      .map((v) => ({
        label: v,
        value: v,
      }));

  // ===============================
  // OPTIONS
  // ===============================
  const agmOptions = createOptions(
    data.map((i) => i.agm),
    agmSearch
  );

  const stateOptions = createOptions(
    data
      .filter(
        (i) =>
          tempAgm.length === 0 ||
          tempAgm.includes(i.agm)
      )
      .map((i) => i.state_name),
    stateSearch
  );

  const zoneOptions = createOptions(
    data
      .filter(
        (i) =>
          (tempAgm.length === 0 ||
            tempAgm.includes(i.agm)) &&
          (tempState.length === 0 ||
            tempState.includes(i.state_name))
      )
      .map((i) => i.zone_name),
    zoneSearch
  );

  const riOptions = createOptions(
    data
      .filter(
        (i) =>
          (tempAgm.length === 0 ||
            tempAgm.includes(i.agm)) &&
          (tempState.length === 0 ||
            tempState.includes(i.state_name)) &&
          (tempZone.length === 0 ||
            tempZone.includes(i.zone_name))
      )
      .map((i) => i.ri_name),
    riSearch
  );

  const branchOptions = createOptions(
    data
      .filter(
        (i) =>
          (tempAgm.length === 0 ||
            tempAgm.includes(i.agm)) &&
          (tempState.length === 0 ||
            tempState.includes(i.state_name)) &&
          (tempZone.length === 0 ||
            tempZone.includes(i.zone_name)) &&
          (tempRIName.length === 0 ||
            tempRIName.includes(i.ri_name))
      )
      .map((i) => i.BSBranchName),
    branchSearch
  );

  // ===============================
  // CHECKBOX UI
  // ===============================
  const CheckboxOption = (props) => {
    return (
      <components.Option {...props}>
        <input
          type="checkbox"
          checked={props.isSelected}
          readOnly
          style={{ marginRight: 10 }}
        />
        <label>{props.label}</label>
      </components.Option>
    );
  };

  const multiSelectStyles = {
    control: (base) => ({
      ...base,
      minHeight: "40px",
      width: "220px",
    }),
    valueContainer: (base) => ({
      ...base,
      maxHeight: "70px",
      overflowY: "auto",
      flexWrap: "wrap",
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: "#d9e8ff",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999,
    }),
  };

  return (
    <div className="d-flex flex-wrap gap-2 mb-3">

      {/* AGM */}
      <Select
        isMulti
        isSearchable
        blurInputOnSelect={false}
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
        options={agmOptions}
        components={{ Option: CheckboxOption }}
        value={agmOptions.filter((x) =>
          tempAgm.includes(x.value)
        )}
        styles={multiSelectStyles}
        inputValue={agmSearch}
        onInputChange={(val, meta) => {
          if (meta.action === "input-change") {
            setAgmSearch(val);
          }
        }}
        onChange={(selected) =>
          setTempAgm(
            selected ? selected.map((s) => s.value) : []
          )
        }
        onBlur={() => {
          setSelectedAgm(tempAgm);
          setSelectedState([]);
          setSelectedZone([]);
          setSelectedRIName([]);
          setSelectedBranch([]);

          setTempState([]);
          setTempZone([]);
          setTempRIName([]);
          setTempBranch([]);

          setCurrentPage(1);
          setAgmSearch("");
        }}
        placeholder="Select AGM"
      />

      {/* STATE */}
      <Select
        isMulti
        isSearchable
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
        options={stateOptions}
        components={{ Option: CheckboxOption }}
        value={stateOptions.filter((x) =>
          tempState.includes(x.value)
        )}
        styles={multiSelectStyles}
        inputValue={stateSearch}
        onInputChange={(val, meta) => {
          if (meta.action === "input-change") {
            setStateSearch(val);
          }
        }}
        onChange={(selected) =>
          setTempState(
            selected ? selected.map((s) => s.value) : []
          )
        }
        onBlur={() => {
          setSelectedState(tempState);
          setSelectedZone([]);
          setSelectedRIName([]);
          setSelectedBranch([]);

          setTempZone([]);
          setTempRIName([]);
          setTempBranch([]);

          setCurrentPage(1);
          setStateSearch("");
        }}
        placeholder="Select State"
      />

      {/* ZONE */}
      <Select
        isMulti
        isSearchable
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
        options={zoneOptions}
        components={{ Option: CheckboxOption }}
        value={zoneOptions.filter((x) =>
          tempZone.includes(x.value)
        )}
        styles={multiSelectStyles}
        inputValue={zoneSearch}
        onInputChange={(val, meta) => {
          if (meta.action === "input-change") {
            setZoneSearch(val);
          }
        }}
        onChange={(selected) =>
          setTempZone(
            selected ? selected.map((s) => s.value) : []
          )
        }
        onBlur={() => {
          setSelectedZone(tempZone);
          setSelectedRIName([]);
          setSelectedBranch([]);

          setTempRIName([]);
          setTempBranch([]);

          setCurrentPage(1);
          setZoneSearch("");
        }}
        placeholder="Select Zone"
      />

      {/* RI */}
      <Select
        isMulti
        isSearchable
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
        options={riOptions}
        components={{ Option: CheckboxOption }}
        value={riOptions.filter((x) =>
          tempRIName.includes(x.value)
        )}
        styles={multiSelectStyles}
        inputValue={riSearch}
        onInputChange={(val, meta) => {
          if (meta.action === "input-change") {
            setRiSearch(val);
          }
        }}
        onChange={(selected) =>
          setTempRIName(
            selected ? selected.map((s) => s.value) : []
          )
        }
        onBlur={() => {
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
        isSearchable
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
        options={branchOptions}
        components={{ Option: CheckboxOption }}
        value={branchOptions.filter((x) =>
          tempBranch.includes(x.value)
        )}
        styles={multiSelectStyles}
        inputValue={branchSearch}
        onInputChange={(val, meta) => {
          if (meta.action === "input-change") {
            setBranchSearch(val);
          }
        }}
        onChange={(selected) =>
          setTempBranch(
            selected ? selected.map((s) => s.value) : []
          )
        }
        onBlur={() => {
          setSelectedBranch(tempBranch);
          setCurrentPage(1);
          setBranchSearch("");
        }}
        placeholder="Select Branch"
      />
    </div>
  );
}

export default Filters;