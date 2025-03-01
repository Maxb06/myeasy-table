import { useState, useEffect } from 'react';
import styles from './DataTable.module.css';

interface ColumnDef<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
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
  data,
  columns,
  sortable = true,
  pagination = true,
  onRowClick,
  onDelete,
}: DataTableProps<T>) => {
  const [search, setSearch] = useState('');
  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState<T[]>(data);
  const [sortConfig, setSortConfig] = useState<{ key: keyof T | null; direction: 'asc' | 'desc' }>({
    key: null,
    direction: 'asc',
  });

  useEffect(() => {
    let result = data.filter((item) =>
      Object.values(item).some((val) =>
        val?.toString().toLowerCase().includes(search.toLowerCase())
      )
    );

    if (sortable && sortConfig.key) {
      result = [...result].sort((a, b) => {
        const aValue: unknown = a[sortConfig.key!];
        const bValue: unknown = b[sortConfig.key!];

        const isNumeric = (val: unknown): boolean =>
          typeof val === "number" || (typeof val === "string" && !isNaN(parseFloat(val)));

        const extractNumber = (val: unknown): number =>
          typeof val === "string" ? parseFloat(val.replace(/[^0-9.]/g, "")) : (val as number);

        if (isNumeric(aValue) && isNumeric(bValue)) {
          const numA = extractNumber(aValue);
          const numB = extractNumber(bValue);
          return sortConfig.direction === "asc" ? numA - numB : numB - numA;
        }

        const strA = aValue !== undefined ? String(aValue) : "";
        const strB = bValue !== undefined ? String(bValue) : "";

        return sortConfig.direction === "asc"
          ? strA.localeCompare(strB)
          : strB.localeCompare(strA);
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
        if (prev.direction === 'asc') {
          return { key, direction: 'desc' };
        }
        return { key: null, direction: 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };


  const indexOfLastItem = currentPage * entries;
  const indexOfFirstItem = indexOfLastItem - entries;
  const currentItems = pagination ? filteredData.slice(indexOfFirstItem, indexOfLastItem) : filteredData;
  const totalPages = pagination ? Math.ceil(filteredData.length / entries) : 1;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <label>
          Show
          <select value={entries} onChange={(e) => setEntries(Number(e.target.value))}>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>{' '}
          entries
        </label>

        <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key.toString()} onClick={() => col.sortable && requestSort(col.key)}>
                {col.label}
                {sortable && col.sortable && (
                  <>
                    {sortConfig.key === col.key ? (
                      sortConfig.direction === 'asc' ? ' ▲' : ' ▼'
                    ) : null}
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
                  <td key={col.key.toString()}>{String(item[col.key])}</td>
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
        <div className={styles.footer}>
          <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
            Previous
          </button>
          <span>{currentPage}</span>
          <button onClick={() => setCurrentPage((prev) => prev < totalPages ? prev + 1 : prev)} disabled={currentPage >= totalPages}>
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default DataTable;
