import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Filters from "./components/filters";
import TableView from "./components/table1";
import downloadExcel from "./components/exc";
import KPICards from "./components/KPICards";

function App() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedState, setSelectedState] = useState([]);
    const [selectedZone, setSelectedZone] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState([]);
    const [selectedZoneIncharge, setSelectedZoneIncharge] = useState([]);
    const [selectedAgm, setSelectedAgm] = useState([]);
    const [selectedRIName, setSelectedRIName] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [jumpValue, setJumpValue] = useState("");
    const [selectedColumnView, setSelectedColumnView] = useState("ALL");
    const [editedRows, setEditedRows] = useState({});
    const [currentYear, setCurrentYear] = useState(2025);
    const [currentMonth, setCurrentMonth] = useState(3);
    const [pnlActions, setPnlActions] = useState("");

    // ✅ Default P&L filter = Loss only
    const [selectedPnlFilter, setSelectedPnlFilter] = useState([
        { value: "loss", label: "📉 Loss (< 0%)", color: "#dc3545", bg: "#f8d7da" },

        {
            value: "zero",
            label: "➖ No Profit / Loss (0%)",
            color: "#6c757d",
        },

        {
            value: "profit",
            label: "📈 Profit (> 0%)",
            color: "#198754",
        },
    ]);

    // use db filtered options
    const [pnlFilteredData, setPnlFilteredData] = useState([]);

    const allPnlOptions = [
        {
            value: "loss",
            label: "📉 Loss (< 0%)",
            color: "#dc3545",
        },

        {
            value: "zero",
            label: "➖ No Profit / Loss (0%)",
            color: "#6c757d",
        },

        {
            value: "profit",
            label: "📈 Profit (> 0%)",
            color: "#198754",
        },
    ];

    useEffect(() => {
        const hiddenInput = document.getElementById("pnl_actions");

        const value = hiddenInput?.value?.trim();

        console.log(
            "Hidden Input Value:",
            value || "Not Found"
        );

        if (value) {
            console.log("Setting P&L filter from hidden input:", value);

            setPnlActions(value);
        } else {
            console.log(
                "Hidden input empty/not found, setting default P&L filter to 'loss'"
            );

            setPnlActions("loss");
        }
    }, []);

    const allowedPnlValues = pnlActions
        ? pnlActions.split(",")
        : [];

    const filteredPnlOptions = allPnlOptions.filter((item) =>
        allowedPnlValues.includes(item.value)
    );

    useEffect(() => {
        setSelectedPnlFilter(filteredPnlOptions);
    }, [pnlActions]);

    //end db filtered options
    const rowsPerPage = 100;

    useEffect(() => {
        setLoading(true);
        fetch(
            "http://192.168.0.1/sctsadmissions/p_and_l_report_apis.php?endpoint=revenue_report1&academic_year=" +
            currentYear + "&month=" + currentMonth
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
    }, [currentYear, currentMonth]);

    const filteredData = data
        .filter((item) =>
            (selectedZone.length === 0 || selectedZone.includes(item.zone)) &&
            (selectedState.length === 0 || selectedState.includes(item.state)) &&
            (selectedBranch.length === 0 || selectedBranch.includes(item.branch)) &&
            (selectedZoneIncharge.length === 0 || selectedZoneIncharge.includes(item.zone_incharge)) &&
            (selectedAgm.length === 0 || selectedAgm.includes(item.agm)) &&
            (selectedRIName.length === 0 || selectedRIName.includes(item.RI))
        )
        .map((item) => {
            const estYear = Number(item.year_establishment);
            let years = 0;
            if (!isNaN(estYear) && estYear > 1900) {
                years = estYear >= currentYear ? 0 : currentYear - estYear;
            }

            const avgFee =
                Number(item.total_strength) > 0
                    ? Math.round(Number(item.net_tuition_for_25_26) / Number(item.total_strength))
                    : 0;

            const revenue =
                (Number(item.net_tuition_for_25_26) || 0) +
                (Number(item.application_fee_for_25_26) || 0) +
                (Number(item.admission_fee_for_25_26) || 0);

            const netReceived = Number(item.paid_amount) || 0;

            const salariesPercent =
                revenue > 0
                    ? Math.round((Number(item.salaries_for_25_26) * 100) / revenue)
                    : 0;

            const totalOperatingExp = Math.round(
                [
                    item.hk_exp,
                    item.mess_exp,
                    item.security,
                    item.water,
                    item.electricity,
                    item.depreciation_for_25_26,
                    item.electrical_consumables_for_25_26,
                    item.marketing_for_25_26,
                    item.r_and_m_bldg_for_25_26,
                    item.r_and_m_others_for_25_26,
                    item.other_exp_for_25_26_except_transport_rates_taxes_and_amc,
                ].reduce((sum, val) => sum + Number(val || 0), 0)
            );

            const coExpFor25_26_15_percent = Math.round((netReceived * 15) / 100);

            const totalExpenditure = Math.round(
                Number(item.salaries_for_25_26 || 0) +
                Number(item.rent || 0) +
                Number(totalOperatingExp || 0) +
                Number(coExpFor25_26_15_percent || 0)
            );

            const totalExpenditurePercent =
                revenue > 0 ? Math.round((totalExpenditure / revenue) * 100) : 0;

            const pnl_for_the_year_2025_26 = netReceived - totalExpenditure;

            const profit_or_loss_percent_2025_26 =
                netReceived > 0 ? Math.round((pnl_for_the_year_2025_26 / netReceived) * 100) : 0;

            const rentPercentage =
                revenue > 0 ? Math.round((Number(item.rent || 0) * 100) / revenue) : 0;

            return {
                ...item,
                no_of_years: years,
                capacity_diff: (Number(item.capacity) || 0) - (Number(item.total_strength) || 0),
                avg_fee_for_25_26: avgFee,
                salaries_percent_for_25_26: salariesPercent,
                total_operating_exp_for_2025_26_except_salaries_rent_mess_hk: totalOperatingExp,
                co_exp_for_25_26_15_percent: coExpFor25_26_15_percent,
                total_expenditure_25_26: totalExpenditure,
                total_expenditure_25_26_percent: totalExpenditurePercent,
                pnl_for_the_year_2025_26,
                profit_or_loss_percent_2025_26,
                rentper: rentPercentage,
            };
        })
        .sort((a, b) => a.profit_or_loss_percent_2025_26 - b.profit_or_loss_percent_2025_26);

    const totals = filteredData.reduce(
        (acc, item) => {
            acc.ds += Number(item.ds || 0);
            acc.res += Number(item.res || 0);
            acc.total_strength += Number(item.total_strength || 0);
            acc.avg_fee += Number(item.avg_fee_for_25_26 || 0);
            acc.net_tuition += Number(item.net_tuition_for_25_26 || 0);
            acc.application_fee += Number(item.application_fee_for_25_26 || 0);
            acc.admission_fee += Number(item.admission_fee_for_25_26 || 0);
            acc.net_revenue += (Number(item.net_tuition_for_25_26) || 0) +
                (Number(item.application_fee_for_25_26) || 0) +
                (Number(item.admission_fee_for_25_26) || 0);
            acc.paid_amount += Number(item.paid_amount || 0);
            acc.avg_emp_count += Number(item.avg_emp_count || 0);
            acc.salaries += Number(item.salaries_for_25_26 || 0);
            acc.total_rent_sft += Number(item.total_rent_sft || 0);
            acc.rent += Number(item.rent || 0);
            acc.mess_exp += Number(item.mess_exp || 0);
            acc.hk_exp += Number(item.hk_exp || 0);
            acc.security += Number(item.security || 0);
            acc.water += Number(item.water || 0);
            acc.electricity += Number(item.electricity || 0);
            acc.depreciation += Number(item.depreciation_for_25_26 || 0);
            acc.electrical += Number(item.electrical_consumables_for_25_26 || 0);
            acc.marketing += Number(item.marketing_for_25_26 || 0);
            acc.r_and_m_bldg += Number(item.r_and_m_bldg_for_25_26 || 0);
            acc.r_and_m_others += Number(item.r_and_m_others_for_25_26 || 0);
            acc.other_exp += Number(item.other_exp_for_25_26_except_transport_rates_taxes_and_amc || 0);
            acc.operating_exp += Number(item.total_operating_exp_for_2025_26_except_salaries_rent_mess_hk || 0);
            acc.co_exp += Number(item.co_exp_for_25_26_15_percent || 0);
            acc.total_expenditure += Number(item.total_expenditure_25_26 || 0);
            acc.pnl += Number(item.pnl_for_the_year_2025_26 || 0);
            acc.profit_percent += Number(item.profit_or_loss_percent_2025_26 || 0);
            return acc;
        },
        {
            ds: 0, res: 0, total_strength: 0, avg_fee: 0,
            net_tuition: 0, application_fee: 0, admission_fee: 0, net_revenue: 0, paid_amount: 0,
            avg_emp_count: 0, salaries: 0, total_rent_sft: 0, rent: 0,
            mess_exp: 0, hk_exp: 0, security: 0, water: 0, electricity: 0,
            depreciation: 0, electrical: 0, marketing: 0, r_and_m_bldg: 0,
            r_and_m_others: 0, other_exp: 0, operating_exp: 0, co_exp: 0,
            total_expenditure: 0, pnl: 0, profit_percent: 0,
        }
    );

    // console.log("Filtered Data:", filteredData);
    // console.log("Totals:", totals);
    const avgProfitPercent =
        filteredData.length > 0
            ? Math.round(totals.profit_percent / filteredData.length)
            : 0;

    // const totalRows = filteredData.length;
    // const totalPages = Math.ceil(totalRows / rowsPerPage);
    // const startIndex = (currentPage - 1) * rowsPerPage;
    // const currentData = filteredData.slice(startIndex, startIndex + rowsPerPage);

    // ✅ Excel downloads pnlFilteredData (filtered by P&L) or filteredData as fallback
    const handleDownloadExcel = () => {
        const dataToExport = pnlFilteredData.length > 0 ? pnlFilteredData : filteredData;
        downloadExcel(dataToExport, editedRows);
    };

    if (loading) return <h3 className="text-center mt-5">Loading data...</h3>;
    if (error) return <h3 className="text-center mt-5 text-danger">{error}</h3>;

    return (
        <div style={{ minHeight: "100vh", overflow: "hidden" }}>
            <div style={{
                background: "rgba(255,255,255,0.1)",
                borderRadius: "15px",
                padding: "20px",
                marginBottom: "20px",
                textAlign: "center",
            }}>
                <h2>📈 Revenue P &amp; L Report</h2>
            </div>

            <div className="me-5 ms-2">
                {/* ✅ onDownloadExcel passed to Filters so Excel button appears inside filter bar */}
                <Filters
                    data={data}
                    pnlOptions={filteredPnlOptions}
                    currentYear={currentYear}
                    setCurrentYear={setCurrentYear}
                    currentMonth={currentMonth}
                    setCurrentMonth={setCurrentMonth}
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
                    selectedPnlFilter={selectedPnlFilter}
                    setSelectedPnlFilter={setSelectedPnlFilter}
                    pnlFilteredData={pnlFilteredData}
                    onDownloadExcel={handleDownloadExcel}
                />

                <KPICards
                    data={pnlFilteredData}
                    editedRows={editedRows}
                     filteredData = { filteredData}
                      selectedPnlFilter = { selectedPnlFilter}
                />

                <TableView
                    data={filteredData}
                    totals={totals}
                    filteredData={filteredData}
                    avgProfitPercent={avgProfitPercent}
                    selectedColumnView={selectedColumnView}
                    //  totalRows={totalRows}
                    currentPage={currentPage}
                    // totalPages={totalPages}
                    setCurrentPage={setCurrentPage}
                    jumpValue={jumpValue}
                    setJumpValue={setJumpValue}
                    editedRows={editedRows}
                    setEditedRows={setEditedRows}
                    selectedPnlFilter={selectedPnlFilter}
                    onPnlFilteredData={setPnlFilteredData}
                    pnlActions={pnlActions}
                />
            </div>
        </div>
    );
}

export default App;
