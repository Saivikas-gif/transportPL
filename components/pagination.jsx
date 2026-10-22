import React from "react";
import { useEffect } from "react";

function Pagination({
  filteredData,
  selectedState,
  selectedZone,
  selectedBranch,
  selectedZoneIncharge,
  selectedRIName,
  selectedAgm,
  totalRows,
  currentPage,
  totalPages,
  setCurrentPage,
  jumpValue,
  setJumpValue,
}) {

    // 🔥 JUMP TO ROW (ex: 45 → page 5)
  useEffect(() => {
    setCurrentPage(1);
  }, [
    selectedState,
    selectedBranch,
    selectedZone,
    selectedAgm,
    selectedRIName,
  ]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages || 1);
    }
  }, [totalPages]);

  const rowsPerPage = 100;

const startIndex = (currentPage - 1) * rowsPerPage;
const endIndex = startIndex + rowsPerPage;

const paginatedData = filteredData.slice(startIndex, endIndex);

  return (
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
  );
}

export default Pagination;