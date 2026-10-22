// import React, { useState, useEffect } from "react";
// import Select, { components } from "react-select";
// import { commonSortingHelper } from "../utils/helpers";
// import downloadExcel from "../utils/excelDownload";

// function Filters({
//     data,
//      pnlOptions,
//     filteredData,
//     selectedState,
//     selectedZone,
//     selectedBranch,
//     editedRows,
//     setEditedRows,
//     selectedZoneIncharge,
//     selectedRIName,
//     selectedAgm,
//     setSelectedState,
//     setSelectedZone,
//     setSelectedBranch,
//     setSelectedZoneIncharge,
//     setSelectedRIName,
//     setSelectedAgm,
//     setCurrentPage,
//     currentYear,
//     setCurrentYear,
//     currentMonth,
//     setCurrentMonth,
//     selectedPnlFilter,    // ← array of { value, label, color } objects
//     setSelectedPnlFilter,
//     pnlFilteredData,      // ← rows after P&L filter applied (for Excel export)
// }) {
//     // TEMP STATES
//     const [tempState, setTempState] = useState(selectedState || []);
//     const [tempZone, setTempZone] = useState(selectedZone || []);
//     const [tempBranch, setTempBranch] = useState(selectedBranch || []);
//     const [tempAgm, setTempAgm] = useState(selectedAgm || []);
//     const [tempRIName, setTempRIName] = useState(selectedRIName || []);

//     // SEARCH STATES
//     const [agmSearch, setAgmSearch] = useState("");
//     const [riSearch, setRiSearch] = useState("");
//     const [stateSearch, setStateSearch] = useState("");
//     const [zoneSearch, setZoneSearch] = useState("");
//     const [branchSearch, setBranchSearch] = useState("");



//     const years = [2025,2026];

//     const months = [
//         { value: 1, label: "Jan" }, { value: 2, label: "Feb" },
//         { value: 3, label: "Mar" }, { value: 4, label: "Apr" },
//         { value: 5, label: "May" }, { value: 6, label: "Jun" },
//         { value: 7, label: "Jul" }, { value: 8, label: "Aug" },
//         { value: 9, label: "Sep" }, { value: 10, label: "Oct" },
//         { value: 11, label: "Nov" }, { value: 12, label: "Dec" },
//     ];

//     // ✅ 3 separate P&L buckets
//     // const pnlOptions = [
//     //     {
//     //         value: "loss",
//     //         label: "📉 Loss (< 0%)",
//     //         color: "#dc3545",
//     //     },

//     //     {
//     //         value: "zero",
//     //         label: "➖ No Profit / Loss (0%)",
//     //         color: "#6c757d",
//     //     },

//     //     {
//     //         value: "profit",
//     //         label: "📈 Profit (> 0%)",
//     //         color: "#198754",
//     //     },
//     // ];

//     // KEEP TEMP STATES IN SYNC
//     useEffect(() => { setTempState(selectedState || []); }, [selectedState]);
//     useEffect(() => { setTempZone(selectedZone || []); }, [selectedZone]);
//     useEffect(() => { setTempBranch(selectedBranch || []); }, [selectedBranch]);
//     useEffect(() => { setTempAgm(selectedAgm || []); }, [selectedAgm]);
//     useEffect(() => { setTempRIName(selectedRIName || []); }, [selectedRIName]);

//     // AGM OPTIONS
//     const Agm = [...new Set(
//         data.filter((item) =>
//             (tempState.length === 0 || tempState.includes(item.state_name)) &&
//             (tempZone.length === 0 || tempZone.includes(item.zone_name)) &&
//             item.agm && item.agm.trim() !== ""
//         ).map((item) => item.agm || "Unknown")
//     )];

//     const states = [...new Set(
//         data.filter((item) => tempAgm.length === 0 || tempAgm.includes(item.agm))
//             .map((item) => item.state_name || "Unknown")
//     )];

//     const zones = [...new Set(
//         data.filter((item) =>
//             (tempState.length === 0 || tempState.includes(item.state_name)) &&
//             (tempAgm.length === 0 || tempAgm.includes(item.agm))
//         ).map((item) => item.zone_name || "Unknown")
//     )];

//     const Riname = [...new Set(
//         data.filter((item) =>
//             (tempState.length === 0 || tempState.includes(item.state_name)) &&
//             (tempZone.length === 0 || tempZone.includes(item.zone_name)) &&
//             (tempAgm.length === 0 || tempAgm.includes(item.agm))
//         ).map((item) => item.ri_name || "Unknown")
//     )];

//     const branches = [...new Set(
//         data.filter((item) =>
//             (tempState.length === 0 || tempState.includes(item.state_name)) &&
//             (tempZone.length === 0 || tempZone.includes(item.zone_name)) &&
//             (tempAgm.length === 0 || tempAgm.includes(item.agm)) &&
//             (tempRIName.length === 0 || tempRIName.includes(item.ri_name))
//         ).map((item) => item.BSBranchName || "Unknown")
//     )];

//     const stateOptions = states.map((s) => ({ value: s, label: s }));
//     const branchOptions = branches.map((b) => ({ value: b, label: b }));
//     const zoneOptions = zones.map((z) => ({ value: z, label: z }));
//     const agmOptions = Agm.map((a) => ({ value: a, label: a }));
//     const riOptions = Riname.map((r) => ({ value: r, label: r }));

//     const CheckboxOption = (props) => (
//         <div {...props.innerProps} style={{ padding: "8px", cursor: "pointer" }}>
//             <input type="checkbox" checked={props.isSelected} onChange={() => null} style={{ marginRight: "8px" }} />
//             <label>{props.label}</label>
//         </div>
//     );

//     // const CheckboxOption = (props) => {
//     //     return (
//     //         <components.Option {...props}>
//     //             <input
//     //                 type="checkbox"
//     //                 checked={props.isSelected}
//     //                 onChange={() => null}
//     //                 style={{ marginRight: 8 }}
//     //             />

//     //             <label>{props.label}</label>
//     //         </components.Option>
//     //     );
//     // };

//     const multiSelectStyles = {
//         control: (base) => ({ ...base, height: "50px", minHeight: "50px", alignItems: "flex-start", overflow: "hidden" }),
//         valueContainer: (base) => ({ ...base, display: "block", maxHeight: "50px", overflowY: "hidden", padding: "8px 8px", fontWeight: "bold", fontSize: "18px" }),
//         multiValue: (base) => ({ ...base, margin: "2px 0" }),
//         indicatorsContainer: (base) => ({ ...base, height: "50px" }),
//         menuPortal: (base) => ({ ...base, zIndex: 9999 }),
//         menu: (base) => ({ ...base, zIndex: 9999 }),
//     };

//     // ✅ Colored chips for P&L dropdown
//     const pnlSelectStyles = {
//         control: (base) => ({
//             ...base,
//             minHeight: "50px",
//             height: "auto",
//             borderRadius: "6px",
//             border: "1px solid #dee2e6",
//             boxShadow: "none",
//             fontSize: "13px",
//             minWidth: "230px",
//             cursor: "pointer",
//         }),
//         valueContainer: (base) => ({ ...base, flexWrap: "wrap", gap: "2px", padding: "4px 8px" }),
//         multiValue: (base, state) => ({ ...base, backgroundColor: state.data.color, borderRadius: "4px" }),
//         multiValueLabel: (base) => ({ ...base, color: "#fff", fontWeight: "600", fontSize: "12px" }),
//         multiValueRemove: (base) => ({
//             ...base, color: "#fff",
//             ":hover": { backgroundColor: "rgba(0,0,0,0.2)", color: "#fff" },
//         }),
//         option: (base, state) => ({
//             ...base,
//             backgroundColor: state.isSelected ? state.data.color : state.isFocused ? "#f0f0f0" : "#fff",
//             color: state.isSelected ? "#fff" : "#212529",
//             fontSize: "13px",
//             cursor: "pointer",
//             fontWeight: state.isSelected ? "600" : "normal",
//         }),
//         placeholder: (base) => ({ ...base, fontSize: "13px", color: "#6c757d" }),
//         menuPortal: (base) => ({ ...base, zIndex: 9999 }),
//         menu: (base) => ({ ...base, zIndex: 9999 }),
//     };

//     const labelStyle = { fontSize: "11px", color: "#6c757d", display: "block", marginBottom: "2px", fontWeight: "500" };

//     return (
//         <div
//             className="d-flex flex-wrap gap-3 mb-3 align-items-end"
//             style={{ background: "#f8f9fc", margin: "5px", padding: "10px 12px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
//         >
//             {/* YEAR */}
//             <div>
//                 <label style={labelStyle}>Year</label>
//                 <select value={currentYear} 
//                 onChange={(e) => setCurrentYear(Number(e.target.value))
//                 }
//                     className="form-select" 
//                     style={{ width: "150px", height: "50px"}}>
//                     {years.map((year) =>
//                      <option key={year} value={year}> {year}-{year + 1}</option>)}
//                 </select>
//             </div>

//             {/* MONTH */}
//             <div>
//                 <label style={labelStyle}>Month</label>
//                 <select value={currentMonth} onChange={(e) => setCurrentMonth(Number(e.target.value))}
//                     className="form-select" style={{ width: "90px", height: "50px" }}>
//                     {months.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
//                 </select>
//             </div>

//             {/* ✅ P&L MULTI-SELECT DROPDOWN */}
//             {/* <div>
//                 <label style={labelStyle}>P&amp;L Filter</label>
//                 <Select
//                     isMulti
//                     options={pnlOptions}
//                     value={selectedPnlFilter}
//                     components={{ Option: CheckboxOption }}
//                     onChange={(selected) => {
//                         setSelectedPnlFilter(selected || []);
//                         setCurrentPage(1);
//                     }}
//                     placeholder="All (Loss / Zero / Profit)..."
//                     closeMenuOnSelect={false}
//                     hideSelectedOptions={false}
//                     styles={pnlSelectStyles}
//                     menuPortalTarget={document.body}
//                 />
//             </div> */}
            
//             <div>
//                 <label style={labelStyle}>P&amp;L Filter</label>

//                 <Select
//                     isMulti
//                     options={pnlOptions}

//                     // ✅ SAME STRUCTURE AS AGM
//                     components={{ Option: CheckboxOption }}

//                     // value={pnlOptions.filter((opt) =>
//                     //     selectedPnlFilter.includes(opt.value)
//                     // )}

//                       value={selectedPnlFilter}

//                     closeMenuOnSelect={false}
//                     hideSelectedOptions={false}

//                     styles={multiSelectStyles}

//                     onChange={(selected) => {
//                         setSelectedPnlFilter(selected || []);
//                         setCurrentPage(1);
//                     }}

//                     placeholder="Select P&L"

//                     menuPortalTarget={document.body}
//                 />
//             </div> 

//             {/* AGM */}
//             <div>
//                 <label style={labelStyle}>AGM</label>
//                 <Select isMulti options={commonSortingHelper(agmOptions)}
//                     components={{ Option: CheckboxOption }}
//                     value={agmOptions.filter((opt) => tempAgm.includes(opt.value))}
//                     closeMenuOnSelect={false} hideSelectedOptions={false} styles={multiSelectStyles}
//                     inputValue={agmSearch}
//                     onInputChange={(val, { action }) => { if (action === "input-change") setAgmSearch(val); }}
//                     onChange={(selected) => setTempAgm(selected ? selected.map((s) => s.value) : [])}
//                     onMenuClose={() => {
//                         setSelectedAgm(tempAgm);
//                         setSelectedState([]); setTempState([]);
//                         setSelectedZone([]); setTempZone([]);
//                         setSelectedBranch([]); setTempBranch([]);
//                         setSelectedRIName([]); setTempRIName([]);
//                         setCurrentPage(1); setAgmSearch("");
//                     }}
//                     placeholder="Select AGM" menuPortalTarget={document.body} />
//             </div>

//             {/* STATE */}
//             <div>
//                 <label style={labelStyle}>State</label>
//                 <Select isMulti options={commonSortingHelper(stateOptions)} components={{ Option: CheckboxOption }}
//                     value={stateOptions.filter((opt) => tempState.includes(opt.value))}
//                     closeMenuOnSelect={false} hideSelectedOptions={false} styles={multiSelectStyles}
//                     inputValue={stateSearch}
//                     onInputChange={(val, { action }) => { if (action === "input-change") setStateSearch(val); }}
//                     onChange={(selected) => setTempState(selected ? selected.map((s) => s.value) : [])}
//                     onMenuClose={() => {
//                         setSelectedState(tempState);
//                         setSelectedZone([]); setTempZone([]);
//                         setSelectedBranch([]); setTempBranch([]);
//                         setSelectedRIName([]); setTempRIName([]);
//                         setCurrentPage(1); setStateSearch("");
//                     }}
//                     placeholder="Select States" menuPortalTarget={document.body} />
//             </div>

//             {/* ZONE */}
//             <div>
//                 <label style={labelStyle}>Zone</label>
//                 <Select isMulti options={commonSortingHelper(zoneOptions)} components={{ Option: CheckboxOption }}
//                     value={zoneOptions.filter((opt) => tempZone.includes(opt.value))}
//                     closeMenuOnSelect={false} hideSelectedOptions={false} styles={multiSelectStyles}
//                     inputValue={zoneSearch}
//                     onInputChange={(val, { action }) => { if (action === "input-change") setZoneSearch(val); }}
//                     onChange={(selected) => setTempZone(selected ? selected.map((s) => s.value) : [])}
//                     onMenuClose={() => {
//                         setSelectedZone(tempZone);
//                         setSelectedBranch([]); setTempBranch([]);
//                         setSelectedRIName([]); setTempRIName([]);
//                         setCurrentPage(1); setZoneSearch("");
//                     }}
//                     placeholder="Select Zones" menuPortalTarget={document.body} />
//             </div>

//             {/* RI */}
//             <div>
//                 <label style={labelStyle}>RI Name</label>
//                 <Select isMulti options={commonSortingHelper(riOptions)} components={{ Option: CheckboxOption }}
//                     value={riOptions.filter((opt) => tempRIName.includes(opt.value))}
//                     closeMenuOnSelect={false} hideSelectedOptions={false} styles={multiSelectStyles}
//                     inputValue={riSearch}
//                     onInputChange={(val, { action }) => { if (action === "input-change") setRiSearch(val); }}
//                     onChange={(selected) => setTempRIName(selected ? selected.map((s) => s.value) : [])}
//                     onMenuClose={() => {
//                         setSelectedRIName(tempRIName);
//                         setSelectedBranch([]); setTempBranch([]);
//                         setCurrentPage(1); setRiSearch("");
//                     }}
//                     placeholder="Select RI Name" menuPortalTarget={document.body} />
//             </div>

//             {/* BRANCH */}
//             <div>
//                 <label style={labelStyle}>Branch</label>
//                 <Select isMulti options={commonSortingHelper(branchOptions)} components={{ Option: CheckboxOption }}
//                     value={branchOptions.filter((opt) => tempBranch.includes(opt.value))}
//                     closeMenuOnSelect={false} hideSelectedOptions={false} styles={multiSelectStyles}
//                     inputValue={branchSearch}
//                     onInputChange={(val, { action }) => { if (action === "input-change") setBranchSearch(val); }}
//                     onChange={(selected) => setTempBranch(selected ? selected.map((s) => s.value) : [])}
//                     onMenuClose={() => {
//                         setSelectedBranch(tempBranch);
//                         setCurrentPage(1); setBranchSearch("");
//                     }}
//                     placeholder="Select Branches" menuPortalTarget={document.body} />
//             </div>

//             <button className="btn btn-success" style={{ height: "50px" }}
//                 onClick={() => downloadExcel(pnlFilteredData || filteredData, editedRows)}>
//                 ⬇ Excel
//             </button>
//         </div>
//     );
// }

// export default Filters;



// ============================================================
// Filters.jsx — Filter Bar component for Transportation P&L Report
// This component renders all filter dropdowns at the top of the page:
//   Year, Month, P&L Filter, AGM, State, Zone, RI Name, Branch
// Also renders the Excel Download button.
//
// KEY DESIGN PATTERN — "Temp State" pattern:
//   Each multi-select dropdown has a local "temp" state.
//   While the user is selecting options inside the dropdown menu,
//   changes go into tempState/tempZone/etc. (local only).
//   Only when the user CLOSES the dropdown (onMenuClose) do we
//   push the temp values up to App via setSelectedState/etc.
//   This avoids re-filtering the table on every single checkbox click.
// ============================================================

// Import React core and the hooks we need
import React, { useState, useEffect } from "react";

// Import react-select for styled multi-select dropdowns with checkbox options
import Select, { components } from "react-select";

// Import a custom sorting helper that sorts option arrays alphabetically
import { commonSortingHelper } from "../utils/helpers";

// Import the Excel download utility function
import downloadExcel from "../utils/excelDownload";

// ============================================================
// COMPONENT DEFINITION
// ============================================================

function Filters({
    // Full raw dataset from the API — used to derive unique dropdown option lists
    data,

    // Only the P&L bucket options allowed by the hidden input (e.g. just "loss", or "loss,profit")
    pnlOptions,

    // Client-side filtered data (after State/Zone/Branch/AGM/RI filters) — used for Excel fallback
    filteredData,

    // Current active filter selections (read-only in this component — displayed as selected values)
    selectedState,
    selectedZone,
    selectedBranch,

    // Edited expenditure row values — passed to Excel download so export reflects user edits
    editedRows,
    setEditedRows,

    // Zone incharge filter (passed in but not rendered as a dropdown in the current UI)
    selectedZoneIncharge,

    // More active filter selections
    selectedRIName,
    selectedAgm,

    // Setters — called when the user closes a dropdown, to push temp selections up to App
    setSelectedState,
    setSelectedZone,
    setSelectedBranch,
    setSelectedZoneIncharge,
    setSelectedRIName,
    setSelectedAgm,

    // Resets page to 1 whenever a filter changes, so we don't land on a now-empty page
    setCurrentPage,

    // Year and month selectors — control which academic year/month the API is queried for
    currentYear,
    setCurrentYear,
    currentMonth,
    setCurrentMonth,

    // Active P&L bucket filter — array of { value, label, color } objects
    // e.g. [{ value: "loss", label: "📉 Loss (< 0%)", color: "#dc3545" }]
    selectedPnlFilter,
    setSelectedPnlFilter,

    // Rows that pass both the field filters AND the P&L bucket filter
    // Used for Excel export so the downloaded file matches exactly what's on screen
    pnlFilteredData,
}) {

    // ==========================================================
    // ── SECTION 1: TEMP STATES ─────────────────────────────────
    // Each dropdown has a local "temp" copy of its selected values.
    // Temp values update on every checkbox click inside the menu.
    // The real App-level state only updates when the menu closes.
    // This prevents the table from re-filtering on every click.
    // ==========================================================

    // Local copy of selected states — updates while the State dropdown is open
    const [tempState, setTempState] = useState(selectedState || []);

    // Local copy of selected zones — updates while the Zone dropdown is open
    const [tempZone, setTempZone] = useState(selectedZone || []);

    // Local copy of selected branches — updates while the Branch dropdown is open
    const [tempBranch, setTempBranch] = useState(selectedBranch || []);

    // Local copy of selected AGMs — updates while the AGM dropdown is open
    const [tempAgm, setTempAgm] = useState(selectedAgm || []);

    // Local copy of selected RI Names — updates while the RI dropdown is open
    const [tempRIName, setTempRIName] = useState(selectedRIName || []);

    // ==========================================================
    // ── SECTION 2: SEARCH INPUT STATES ─────────────────────────
    // Each multi-select dropdown has its own search/input state.
    // react-select uses "controlled input" mode here so we can
    // clear the search text when the menu closes (onMenuClose).
    // ==========================================================

    // Text the user is typing inside the AGM dropdown search box
    const [agmSearch, setAgmSearch] = useState("");

    // Text the user is typing inside the RI Name dropdown search box
    const [riSearch, setRiSearch] = useState("");

    // Text the user is typing inside the State dropdown search box
    const [stateSearch, setStateSearch] = useState("");

    // Text the user is typing inside the Zone dropdown search box
    const [zoneSearch, setZoneSearch] = useState("");

    // Text the user is typing inside the Branch dropdown search box
    const [branchSearch, setBranchSearch] = useState("");

    // ==========================================================
    // ── SECTION 3: STATIC OPTION LISTS ─────────────────────────
    // These never change — they are the fixed year and month options
    // for the Year and Month <select> dropdowns.
    // ==========================================================

    // Academic years available for selection in the Year dropdown
    const years = [2025, 2026];

    // Month options — value is the month number (1–12), label is 3-letter abbreviation
    const months = [
        { value: 1,  label: "Jan" }, { value: 2,  label: "Feb" },
        { value: 3,  label: "Mar" }, { value: 4,  label: "Apr" },
        { value: 5,  label: "May" }, { value: 6,  label: "Jun" },
        { value: 7,  label: "Jul" }, { value: 8,  label: "Aug" },
        { value: 9,  label: "Sep" }, { value: 10, label: "Oct" },
        { value: 11, label: "Nov" }, { value: 12, label: "Dec" },
    ];

    // ==========================================================
    // ── SECTION 4: SYNC TEMP STATES WITH PARENT ────────────────
    // If App resets a filter externally (e.g. AGM change clears
    // State/Zone/Branch), these effects keep the local temp state
    // in sync so the dropdowns display the correct selected values.
    // ==========================================================

    // When selectedState changes in App, update the local tempState to match
    useEffect(() => { setTempState(selectedState || []); }, [selectedState]);

    // When selectedZone changes in App, update the local tempZone to match
    useEffect(() => { setTempZone(selectedZone || []); }, [selectedZone]);

    // When selectedBranch changes in App, update the local tempBranch to match
    useEffect(() => { setTempBranch(selectedBranch || []); }, [selectedBranch]);

    // When selectedAgm changes in App, update the local tempAgm to match
    useEffect(() => { setTempAgm(selectedAgm || []); }, [selectedAgm]);

    // When selectedRIName changes in App, update the local tempRIName to match
    useEffect(() => { setTempRIName(selectedRIName || []); }, [selectedRIName]);

    // ==========================================================
    // ── SECTION 5: DYNAMIC DROPDOWN OPTIONS ────────────────────
    // Each dropdown's option list is derived from `data` filtered
    // by the current temp selections of the OTHER dropdowns.
    // This creates a "cascading filter" effect:
    //   - Selecting a State narrows the Zone options
    //   - Selecting a Zone narrows the Branch options, etc.
    // We use Set to deduplicate, and spread [...] to get an array.
    // ==========================================================

    // AGM options — filtered by tempState and tempZone selections
    // Only shows AGMs that exist within the currently selected states/zones
    const Agm = [...new Set(
        data
            .filter((item) =>
                // Include only rows matching the selected states (or all if none selected)
                (tempState.length === 0 || tempState.includes(item.state_name)) &&
                // Include only rows matching the selected zones (or all if none selected)
                (tempZone.length === 0 || tempZone.includes(item.zone_name)) &&
                // Exclude rows where agm is missing or blank
                item.agm && item.agm.trim() !== ""
            )
            // Extract just the agm value from each matching row
            .map((item) => item.agm || "Unknown")
    )];

    // State options — filtered by tempAgm selection
    // Only shows states that have at least one branch managed by a selected AGM
    const states = [...new Set(
        data
            .filter((item) =>
                // Include only rows matching the selected AGMs (or all if none selected)
                tempAgm.length === 0 || tempAgm.includes(item.agm)
            )
            // Extract just the state_name value from each matching row
            .map((item) => item.state_name || "Unknown")
    )];

    // Zone options — filtered by tempState AND tempAgm
    // Only shows zones within the selected states/AGMs
    const zones = [...new Set(
        data
            .filter((item) =>
                (tempState.length === 0 || tempState.includes(item.state_name)) &&
                (tempAgm.length === 0 || tempAgm.includes(item.agm))
            )
            .map((item) => item.zone_name || "Unknown")
    )];

    // RI Name options — filtered by tempState, tempZone, AND tempAgm
    // Only shows RI Names within the selected states/zones/AGMs
    const Riname = [...new Set(
        data
            .filter((item) =>
                (tempState.length === 0 || tempState.includes(item.state_name)) &&
                (tempZone.length === 0 || tempZone.includes(item.zone_name)) &&
                (tempAgm.length === 0 || tempAgm.includes(item.agm))
            )
            .map((item) => item.ri_name || "Unknown")
    )];

    // Branch options — filtered by tempState, tempZone, tempAgm, AND tempRIName
    // Most restricted: only shows branches matching ALL other active temp selections
    const branches = [...new Set(
        data
            .filter((item) =>
                (tempState.length === 0 || tempState.includes(item.state_name)) &&
                (tempZone.length === 0 || tempZone.includes(item.zone_name)) &&
                (tempAgm.length === 0 || tempAgm.includes(item.agm)) &&
                // Also filter by RI Name if any are selected
                (tempRIName.length === 0 || tempRIName.includes(item.ri_name))
            )
            .map((item) => item.BSBranchName || "Unknown")
    )];

    // ==========================================================
    // ── SECTION 6: CONVERT ARRAYS TO react-select OPTION FORMAT ─
    // react-select expects options as { value, label } objects.
    // We convert each unique string value into this format.
    // ==========================================================

    // State options in { value, label } format for react-select
    const stateOptions = states.map((s) => ({ value: s, label: s }));

    // Branch options in { value, label } format for react-select
    const branchOptions = branches.map((b) => ({ value: b, label: b }));

    // Zone options in { value, label } format for react-select
    const zoneOptions = zones.map((z) => ({ value: z, label: z }));

    // AGM options in { value, label } format for react-select
    const agmOptions = Agm.map((a) => ({ value: a, label: a }));

    // RI Name options in { value, label } format for react-select
    const riOptions = Riname.map((r) => ({ value: r, label: r }));

    // ==========================================================
    // ── SECTION 7: CUSTOM CHECKBOX OPTION COMPONENT ────────────
    // Replaces the default react-select option with one that
    // includes a checkbox. The checkbox state is controlled by
    // react-select's isSelected prop — we pass onChange={() => null}
    // because react-select handles selection state internally.
    // ==========================================================

    const CheckboxOption = (props) => (
        // Spread innerProps gives the div the click/keyboard handlers react-select needs
        <div {...props.innerProps} style={{ padding: "8px", cursor: "pointer" }}>
            {/* Checkbox — checked state mirrors react-select's isSelected */}
            {/* onChange is no-op because react-select manages selection internally */}
            <input
                type="checkbox"
                checked={props.isSelected}
                onChange={() => null}
                style={{ marginRight: "8px" }}
            />
            {/* Display the option label text next to the checkbox */}
            <label>{props.label}</label>
        </div>
    );

    // ==========================================================
    // ── SECTION 8: SHARED MULTI-SELECT STYLES ──────────────────
    // Applied to AGM, State, Zone, RI Name, Branch dropdowns.
    // Fixes the control height to 50px and hides overflow so
    // multiple selected values don't push the dropdown taller.
    // ==========================================================

    const multiSelectStyles = {
        // The main visible input box — fixed 50px height
        control: (base) => ({
            ...base,
            height: "50px",
            minHeight: "50px",
            alignItems: "flex-start",
            overflow: "hidden",         // Hides any selected chips that would overflow
        }),
        // The area that shows selected value chips — also fixed to 50px with scroll hidden
        valueContainer: (base) => ({
            ...base,
            display: "block",
            maxHeight: "50px",
            overflowY: "hidden",        // Prevents vertical expansion when multiple items selected
            padding: "8px 8px",
            fontWeight: "bold",
            fontSize: "18px",
        }),
        // Each selected value chip
        multiValue: (base) => ({ ...base, margin: "2px 0" }),
        // The dropdown arrow and clear button area — matches the 50px control height
        indicatorsContainer: (base) => ({ ...base, height: "50px" }),
        // Portal the dropdown menu to document.body so it appears above other elements
        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
        // The dropdown menu itself
        menu: (base) => ({ ...base, zIndex: 9999 }),
    };

    // ==========================================================
    // ── SECTION 9: P&L DROPDOWN STYLES ─────────────────────────
    // Used only for the P&L Filter dropdown.
    // Selected chips are colored (red for loss, gray for zero,
    // green for profit) using the color property on each option.
    // ==========================================================

    const pnlSelectStyles = {
        // Main control box — auto height so chips can wrap if needed
        control: (base) => ({
            ...base,
            minHeight: "50px",
            height: "auto",
            borderRadius: "6px",
            border: "1px solid #dee2e6",
            boxShadow: "none",
            fontSize: "13px",
            minWidth: "230px",
            cursor: "pointer",
        }),
        // Allow selected chips to wrap onto multiple lines
        valueContainer: (base) => ({
            ...base,
            flexWrap: "wrap",
            gap: "2px",
            padding: "4px 8px",
        }),
        // Each selected chip uses the option's color property (red/gray/green)
        multiValue: (base, state) => ({
            ...base,
            backgroundColor: state.data.color, // e.g. "#dc3545" for loss
            borderRadius: "4px",
        }),
        // White text on the colored chip
        multiValueLabel: (base) => ({
            ...base,
            color: "#fff",
            fontWeight: "600",
            fontSize: "12px",
        }),
        // The × remove button on each chip — white with a subtle dark hover
        multiValueRemove: (base) => ({
            ...base,
            color: "#fff",
            ":hover": { backgroundColor: "rgba(0,0,0,0.2)", color: "#fff" },
        }),
        // Dropdown list items — selected ones use the option's color as background
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected
                ? state.data.color   // Colored background when selected
                : state.isFocused
                ? "#f0f0f0"          // Light gray on hover
                : "#fff",            // White when unselected
            color: state.isSelected ? "#fff" : "#212529",
            fontSize: "13px",
            cursor: "pointer",
            fontWeight: state.isSelected ? "600" : "normal",
        }),
        // Gray placeholder text when nothing is selected
        placeholder: (base) => ({ ...base, fontSize: "13px", color: "#6c757d" }),
        // Portal and menu — render above all other page elements
        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
        menu:       (base) => ({ ...base, zIndex: 9999 }),
    };

    // ==========================================================
    // ── SECTION 10: SHARED LABEL STYLE ─────────────────────────
    // Small gray label displayed above each filter control.
    // ==========================================================

    const labelStyle = {
        fontSize: "11px",
        color: "#6c757d",
        display: "block",
        marginBottom: "2px",
        fontWeight: "500",
    };

    // ==========================================================
    // ── SECTION 11: RENDER ─────────────────────────────────────
    // Renders a horizontal flex row of filter controls.
    // gap-3 adds spacing between each filter.
    // align-items-end aligns all controls to the bottom so their
    // 50px inputs line up even when label heights differ.
    // ==========================================================

    return (
        <div
            className="d-flex flex-wrap gap-3 mb-3 align-items-end"
            style={{
                background: "#f8f9fc",
                margin: "5px",
                padding: "10px 12px",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
        >
            {/* ================================================ */}
            {/* YEAR DROPDOWN                                      */}
            {/* Native <select> — changes trigger API re-fetch     */}
            {/* via the currentYear state in App.                  */}
            {/* ================================================ */}
            <div>
                <label style={labelStyle}>Year</label>
                <select
                    value={currentYear}
                    // Convert the string value back to a number before storing
                    onChange={(e) => setCurrentYear(Number(e.target.value))}
                    className="form-select"
                    style={{ width: "150px", height: "50px" }}
                >
                    {/* Render one <option> per year — label shows "2025-2026" format */}
                    {years.map((year) => (
                        <option key={year} value={year}>
                            {year}-{year + 1}
                        </option>
                    ))}
                </select>
            </div>

            {/* ================================================ */}
            {/* MONTH DROPDOWN                                     */}
            {/* Native <select> — value is the month number 1-12  */}
            {/* ================================================ */}
            <div>
                <label style={labelStyle}>Month</label>
                <select
                    value={currentMonth}
                    // Convert string back to number before storing
                    onChange={(e) => setCurrentMonth(Number(e.target.value))}
                    className="form-select"
                    style={{ width: "90px", height: "50px" }}
                >
                    {/* Render one <option> per month — label is 3-letter abbreviation */}
                    {months.map((m) => (
                        <option key={m.value} value={m.value}>
                            {m.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* ================================================ */}
            {/* P&L FILTER MULTI-SELECT                           */}
            {/* Allows the user to toggle which P&L buckets are   */}
            {/* visible: Loss, Zero, Profit (or any combination). */}
            {/* Options are restricted to what pnlOptions allows  */}
            {/* (set by the hidden input in the PHP page).         */}
            {/* Changes apply immediately (no temp state needed)   */}
            {/* because this filter doesn't cascade into others.   */}
            {/* ================================================ */}
            <div>
                <label style={labelStyle}>P&amp;L Filter</label>
                <Select
                    isMulti                              // Allow multiple bucket selections
                    options={pnlOptions}                 // Only the buckets allowed by hidden input
                    components={{ Option: CheckboxOption }} // Checkbox-style option rows
                    value={selectedPnlFilter}            // Controlled value — reflects active buckets
                    closeMenuOnSelect={false}            // Keep menu open after each checkbox click
                    hideSelectedOptions={false}          // Show all options even when selected
                    styles={multiSelectStyles}           // Standard 50px dropdown style
                    onChange={(selected) => {
                        // Update active P&L buckets immediately in App (no temp state needed)
                        setSelectedPnlFilter(selected || []);
                        // Reset to page 1 so user sees results from the beginning
                        setCurrentPage(1);
                    }}
                    placeholder="Select P&L"
                    menuPortalTarget={document.body}    // Render menu outside the filter bar to avoid clipping
                />
            </div>

            {/* ================================================ */}
            {/* AGM MULTI-SELECT                                   */}
            {/* Selecting an AGM narrows State, Zone, RI, Branch  */}
            {/* options (cascading filter).                        */}
            {/* When the menu CLOSES, the real selectedAgm is      */}
            {/* updated and all downstream filters are reset.      */}
            {/* ================================================ */}
            <div>
                <label style={labelStyle}>AGM</label>
                <Select
                    isMulti
                    // commonSortingHelper sorts options alphabetically
                    options={commonSortingHelper(agmOptions)}
                    components={{ Option: CheckboxOption }}
                    // Show checkmarks next to already-selected AGMs
                    value={agmOptions.filter((opt) => tempAgm.includes(opt.value))}
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                    styles={multiSelectStyles}
                    // Controlled search input — lets us clear the search text on close
                    inputValue={agmSearch}
                    onInputChange={(val, { action }) => {
                        // Only update search text when the user is actually typing
                        // (ignores other actions like "menu-close" or "set-value")
                        if (action === "input-change") setAgmSearch(val);
                    }}
                    onChange={(selected) =>
                        // Update local temp state — does NOT yet apply to the table
                        setTempAgm(selected ? selected.map((s) => s.value) : [])
                    }
                    onMenuClose={() => {
                        // Push tempAgm to App — this triggers filteredData to recalculate
                        setSelectedAgm(tempAgm);
                        // Reset all downstream filters since AGM change invalidates them
                        setSelectedState([]); setTempState([]);
                        setSelectedZone([]);  setTempZone([]);
                        setSelectedBranch([]); setTempBranch([]);
                        setSelectedRIName([]); setTempRIName([]);
                        // Go back to page 1 so user sees results from the start
                        setCurrentPage(1);
                        // Clear the search box inside this dropdown
                        setAgmSearch("");
                    }}
                    placeholder="Select AGM"
                    menuPortalTarget={document.body}
                />
            </div>

            {/* ================================================ */}
            {/* STATE MULTI-SELECT                                 */}
            {/* Options are narrowed by tempAgm selection.        */}
            {/* Closing the menu resets Zone, Branch, RI Name.    */}
            {/* ================================================ */}
            <div>
                <label style={labelStyle}>State</label>
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
                    onChange={(selected) =>
                        // Update local temp — table won't re-filter until menu closes
                        setTempState(selected ? selected.map((s) => s.value) : [])
                    }
                    onMenuClose={() => {
                        // Push tempState to App — triggers filteredData recalculation
                        setSelectedState(tempState);
                        // Reset downstream filters — zones/branches depend on state selection
                        setSelectedZone([]);   setTempZone([]);
                        setSelectedBranch([]); setTempBranch([]);
                        setSelectedRIName([]); setTempRIName([]);
                        setCurrentPage(1);
                        setStateSearch("");
                    }}
                    placeholder="Select States"
                    menuPortalTarget={document.body}
                />
            </div>

            {/* ================================================ */}
            {/* ZONE MULTI-SELECT                                  */}
            {/* Options narrowed by tempState + tempAgm.          */}
            {/* Closing the menu resets Branch and RI Name.       */}
            {/* ================================================ */}
            <div>
                <label style={labelStyle}>Zone</label>
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
                    onChange={(selected) =>
                        setTempZone(selected ? selected.map((s) => s.value) : [])
                    }
                    onMenuClose={() => {
                        // Push tempZone to App
                        setSelectedZone(tempZone);
                        // Reset Branch and RI since they depend on zone selection
                        setSelectedBranch([]); setTempBranch([]);
                        setSelectedRIName([]); setTempRIName([]);
                        setCurrentPage(1);
                        setZoneSearch("");
                    }}
                    placeholder="Select Zones"
                    menuPortalTarget={document.body}
                />
            </div>

            {/* ================================================ */}
            {/* RI NAME MULTI-SELECT                               */}
            {/* Options narrowed by tempState + tempZone + tempAgm*/}
            {/* Closing the menu resets Branch only.              */}
            {/* ================================================ */}
            <div>
                <label style={labelStyle}>RI Name</label>
                <Select
                    isMulti
                    options={commonSortingHelper(riOptions)}
                    components={{ Option: CheckboxOption }}
                    value={riOptions.filter((opt) => tempRIName.includes(opt.value))}
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                    styles={multiSelectStyles}
                    inputValue={riSearch}
                    onInputChange={(val, { action }) => {
                        if (action === "input-change") setRiSearch(val);
                    }}
                    onChange={(selected) =>
                        setTempRIName(selected ? selected.map((s) => s.value) : [])
                    }
                    onMenuClose={() => {
                        // Push tempRIName to App
                        setSelectedRIName(tempRIName);
                        // Reset Branch since it is narrowed by RI Name selection
                        setSelectedBranch([]); setTempBranch([]);
                        setCurrentPage(1);
                        setRiSearch("");
                    }}
                    placeholder="Select RI Name"
                    menuPortalTarget={document.body}
                />
            </div>

            {/* ================================================ */}
            {/* BRANCH MULTI-SELECT                                */}
            {/* Options narrowed by tempState + tempZone +        */}
            {/* tempAgm + tempRIName (most restricted dropdown).  */}
            {/* Closing the menu only resets the page number —    */}
            {/* Branch is the last filter in the cascade.         */}
            {/* ================================================ */}
            <div>
                <label style={labelStyle}>Branch</label>
                <Select
                    isMulti
                    options={commonSortingHelper(branchOptions)}
                    components={{ Option: CheckboxOption }}
                    value={branchOptions.filter((opt) => tempBranch.includes(opt.value))}
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                    styles={multiSelectStyles}
                    inputValue={branchSearch}
                    onInputChange={(val, { action }) => {
                        if (action === "input-change") setBranchSearch(val);
                    }}
                    onChange={(selected) =>
                        setTempBranch(selected ? selected.map((s) => s.value) : [])
                    }
                    onMenuClose={() => {
                        // Push tempBranch to App — this is the final step in the cascade
                        setSelectedBranch(tempBranch);
                        // No downstream filters to reset — Branch is the last level
                        setCurrentPage(1);
                        setBranchSearch("");
                    }}
                    placeholder="Select Branches"
                    menuPortalTarget={document.body}
                />
            </div>

            {/* ================================================ */}
            {/* EXCEL DOWNLOAD BUTTON                             */}
            {/* Calls downloadExcel with pnlFilteredData so the  */}
            {/* exported file contains exactly the rows visible   */}
            {/* on screen (after all filters including P&L).     */}
            {/* Falls back to filteredData if pnlFilteredData is  */}
            {/* empty (e.g. before ReportTable has mounted).      */}
            {/* editedRows is passed so the export uses live-     */}
            {/* edited expenditure values, not the API originals. */}
            {/* ================================================ */}
            <button
                className="btn btn-success"
                style={{ height: "50px" }}
                onClick={() => downloadExcel(pnlFilteredData || filteredData, editedRows)}
            >
                ⬇ Excel
            </button>

        </div>
    );
}

// Export Filters as the default export so App.jsx can import it
export default Filters;