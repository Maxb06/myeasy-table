import { useState, useEffect, ReactNode } from "react";
import "./DataTable.css";

interface ColumnDef<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: T[keyof T], row: T) => ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  sortable?: boolean;
  pagination?: boolean;
  onRowClick?: (row: T) => void;
  onDelete?: (id: string) => void;
}

const DataTable = <T extends { id: string }>({
  data = [],
  columns,
  sortable = true,
  pagination = true,
  onRowClick,
  onDelete,
}: DataTableProps<T>) => {
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState<T[]>([]);

  const [sortConfig, setSortConfig] = useState<{ key: keyof T | null; direction: "asc" | "desc" }>({
    key: null,
    direction: "asc",
  });

  useEffect(() => {
    if (!data || !Array.isArray(data)) {
      setFilteredData([]);
      return;
    }

    let result = data.filter((item) =>
      Object.values(item).some((val) => val?.toString().toLowerCase().includes(search.toLowerCase()))
    );

    if (sortable && sortConfig.key) {
      result = [...result].sort((a, b) => {
        const aValue = a[sortConfig.key!];
        const bValue = b[sortConfig.key!];

        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
        }

        const strA = String(aValue);
        const strB = String(bValue);
        return sortConfig.direction === "asc" ? strA.localeCompare(strB) : strB.localeCompare(strA);
      });
    }

    setFilteredData(result);
  }, [search, data, sortConfig, sortable]);

  useEffect(() => {
    setCurrentPage(1);
  }, [entries, search]);

  const requestSort = (key: keyof T) => {
    if (!sortable) return;

    setSortConfig((prev) => {
      if (prev.key === key) {
        if (prev.direction === "asc") {
          return { key, direction: "desc" };
        }
        return { key: null, direction: "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const indexOfLastItem = currentPage * entries;
  const indexOfFirstItem = indexOfLastItem - entries;
  const currentItems = pagination ? filteredData.slice(indexOfFirstItem, indexOfLastItem) : filteredData;
  const totalPages = pagination ? Math.ceil(filteredData.length / entries) : 1;

  return (
    <div className="container">
      <div className="header">
        <label>
          Show
          <select value={entries} onChange={(e) => setEntries(Number(e.target.value))}>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>{" "}
          entries
        </label>

        <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <table className="table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={String(col.key)} onClick={() => col.sortable && requestSort(col.key)}>
                {col.label}
                {sortable && col.sortable && (
                  <>
                    {sortConfig.key === col.key ? (sortConfig.direction === "asc" ? " ▲" : " ▼") : null}
                  </>
                )}
              </th>
            ))}
            {onDelete && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((item) => (
              <tr key={item.id} onClick={() => onRowClick?.(item)}>
                {columns.map((col) => (
                  <td key={String(col.key)}>
                    {col.render ? col.render(item[col.key], item) : String(item[col.key] ?? "N/A")}
                  </td>
                ))}
                {onDelete && (
                  <td>
                    <button onClick={() => onDelete(item.id)}>🗑</button>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + (onDelete ? 1 : 0)}>No data found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {pagination && (
        <div className="footer">
          <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
            Previous
          </button>
          <span>{currentPage}</span>
          <button
            onClick={() => setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))}
            disabled={currentPage >= totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default DataTable;
