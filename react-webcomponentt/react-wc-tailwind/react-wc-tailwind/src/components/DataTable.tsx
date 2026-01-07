import { useMemo, useState } from "react";
import type { ColumnDef, RowData } from "../types";

interface Props {
  columns: ColumnDef[];
  rows: RowData[];
  pageSize?: number;
  onEdit?: (row: RowData) => void;
  onDelete?: (row: RowData) => void;
}

export default function DataTable({
  columns,
  rows,
  pageSize = 10,
  onEdit,
  onDelete,
}: Props) {
  const [page, setPage] = useState(0);

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));

  const pageRows = useMemo(() => {
    const start = page * pageSize;
    return rows.slice(start, start + pageSize);
  }, [rows, page, pageSize]);

  if (!columns.length) {
    return <div className="tw-empty">No columns defined</div>;
  }

  return (
    <div className="tw-wrapper tw-full">
      <div className="tw-table-container">
        <table className="tw-table tw-table-full">
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col.key} className="tw-th">
                  {col.label}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="tw-th tw-actions-header">Actions</th>
              )}
            </tr>
          </thead>

          <tbody>
            {pageRows.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                  className="tw-empty"
                >
                  No data
                </td>
              </tr>
            )}

            {pageRows.map((row, i) => (
              <tr
                key={i}
                className={i % 2 === 0 ? "tw-row-even" : "tw-row-odd"}
              >
                {columns.map(col => (
                  <td key={col.key} className="tw-td">
                    {String(row[col.key] ?? "")}
                  </td>
                ))}

                {(onEdit || onDelete) && (
                  <td className="tw-td tw-actions-cell">
                    <div className="tw-actions">
                      {onEdit && (
                        <button
                          className="tw-action tw-action-edit"
                          onClick={() => onEdit(row)}
                          title="Edit"
                        >
                          {/* Material-style edit icon */}
                          <svg
                            viewBox="0 0 24 24"
                            width="18"
                            height="18"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                          </svg>
                        </button>
                      )}

                      {onDelete && (
                        <button
                          className="tw-action tw-action-delete"
                          onClick={() => onDelete(row)}
                          title="Delete"
                        >
                          {/* Material-style delete icon */}
                          <svg
                            viewBox="0 0 24 24"
                            width="18"
                            height="18"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M3 6h18" />
                            <path d="M8 6V4h8v2" />
                            <path d="M19 6l-1 14H6L5 6" />
                            <path d="M10 11v6" />
                            <path d="M14 11v6" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="tw-pagination">
        <button
          className="tw-page-btn"
          disabled={page === 0}
          onClick={() => setPage(p => p - 1)}
        >
          ◀
        </button>

        <span className="tw-page-info">
          Page {page + 1} / {totalPages}
        </span>

        <button
          className="tw-page-btn"
          disabled={page >= totalPages - 1}
          onClick={() => setPage(p => p + 1)}
        >
          ▶
        </button>
      </div>
    </div>
  );
}
