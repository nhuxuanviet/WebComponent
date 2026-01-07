import { useMemo, useState } from "react";
import type { ColumnDef, Density, RowData } from "../types";

type Props = {
  columns: ColumnDef[];
  rows: RowData[];

  pageSize: number;
  emptyText: string;
  density: Density;

  editable: boolean;
  deletable: boolean;

  getRowKey: (row: RowData, index: number) => string;

  onEdit?: (row: RowData) => void;
  onDelete?: (row: RowData) => void;
};

export default function DataTable({
  columns,
  rows,
  pageSize,
  emptyText,
  density,
  editable,
  deletable,
  getRowKey,
  onEdit,
  onDelete,
}: Props) {
  const [page, setPage] = useState(0);

  const size = Math.max(1, pageSize);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(rows.length / size)),
    [rows.length, size]
  );

  const safePage = Math.min(Math.max(0, page), totalPages - 1);

  const pageRows = useMemo(() => {
    const start = safePage * size;
    return rows.slice(start, start + size);
  }, [rows, safePage, size]);

  const showActions = editable || deletable;

  if (!columns.length) {
    return <div className="tw-empty">No columns defined</div>;
  }

  return (
    <div className={`tw-wrapper tw-density-${density}`}>
      <div className="tw-table-container">
        <table className="tw-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="tw-th"
                  style={{ textAlign: col.align ?? "center" }}
                >
                  {col.label}
                </th>
              ))}
              {showActions && <th className="tw-th tw-actions-header">Actions</th>}
            </tr>
          </thead>

          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (showActions ? 1 : 0)}
                  className="tw-empty"
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              pageRows.map((row, i) => (
                <tr
                  key={getRowKey(row, i)}
                  className={i % 2 === 0 ? "tw-row-even" : "tw-row-odd"}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="tw-td"
                      style={{ textAlign: col.align ?? "center" }}
                    >
                      {String(row[col.key] ?? "")}
                    </td>
                  ))}

                  {showActions && (
                    <td className="tw-td tw-actions-cell">
                      <div className="tw-actions">
                        {editable && onEdit && (
                          <button
                            className="tw-action tw-action-edit"
                            onClick={() => onEdit(row)}
                            title="Edit"
                            type="button"
                          >
                            {/* icon */}
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

                        {deletable && onDelete && (
                          <button
                            className="tw-action tw-action-delete"
                            onClick={() => onDelete(row)}
                            title="Delete"
                            type="button"
                          >
                            {/* icon */}
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
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="tw-pagination">
          <button
            className="tw-page-btn"
            disabled={safePage === 0}
            onClick={() => setPage(() => Math.max(0, safePage - 1))}
            type="button"
          >
            ◀
          </button>

          <span className="tw-page-info">
            Page {safePage + 1} / {totalPages}
          </span>

          <button
            className="tw-page-btn"
            disabled={safePage >= totalPages - 1}
            onClick={() => setPage(() => Math.min(totalPages - 1, safePage + 1))}
            type="button"
          >
            ▶
          </button>
        </div>
      )}
    </div>
  );
}
