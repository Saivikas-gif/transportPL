import React, { useEffect } from "react";

function Pagination({
  filteredData,
  selectedState,
  selectedZone,
  selectedBranch,
  selectedZoneIncharge,
  selectedRIName,
  selectedAgm,
  selectedPnlFilter,   // ← NEW: array of P&L filter objects
  totalRows,           // ← should be pnlFilteredData.length from App
  currentPage,
  totalPages,          // ← should be based on pnlFilteredData.length
  setCurrentPage,
  jumpValue,
  setJumpValue,
}) {
  const rowsPerPage = 100;

  // Reset to page 1 when any dropdown filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [
    selectedState,
    selectedBranch,
    selectedZone,
    selectedAgm,
    selectedRIName,
    selectedPnlFilter,  // ← also reset when P&L filter changes
  ]);

  // If current page exceeds total pages (e.g. after filtering), clamp it
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages || 1);
    }
  }, [totalPages]);

  const startRow = totalRows === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
  const endRow   = Math.min(currentPage * rowsPerPage, totalRows);

  return (
    <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">

      {/* Row count info */}
      <div>
        <strong>
          {totalRows === 0
            ? "No rows"
            : `Showing ${startRow}–${endRow} of ${totalRows} rows`}
        </strong>
      </div>

      {/* Page navigation */}
       <div className="d-flex align-items-center gap-2">
        <button
          className="btn btn-sm btn-primary"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(1)}
          title="First page"
        >
          ««
        </button>

        <button
          className="btn btn-sm btn-primary"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          title="Previous page"
        >
          ◀
        </button>

        <span>
          Page <strong>{currentPage}</strong> / <strong>{totalPages}</strong>
        </span>

        <button
          className="btn btn-sm btn-primary"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage(currentPage + 1)}
          title="Next page"
        >
          ▶
        </button>

        <button
          className="btn btn-sm btn-primary"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage(totalPages)}
          title="Last page"
        >
          »»
        </button>
      </div>

      {/* Jump to page */}
      <div className="d-flex gap-2 align-items-center">
        <input
          type="number"
          className="form-control form-control-sm"
          placeholder="Go to page"
          value={jumpValue}
          min={1}
          max={totalPages}
          style={{ width: "110px" }}
          onChange={(e) => setJumpValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const page = Number(jumpValue);
              if (page >= 1 && page <= totalPages) {
                setCurrentPage(page);
                setJumpValue("");
              }
            }
          }}
        />
        <button
          className="btn btn-sm btn-secondary"
          onClick={() => {
            const page = Number(jumpValue);
            if (page >= 1 && page <= totalPages) {
              setCurrentPage(page);
              setJumpValue("");
            }
          }}
        >
          Go
        </button>
      </div>

    </div>
  );
}

export default Pagination;