import React from 'react';

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface GlassTableProps {
  columns: Column[];
  data: any[];
  onRowClick?: (row: any) => void;
  emptyMessage?: string;
}

export const GlassTable: React.FC<GlassTableProps> = ({
  columns,
  data,
  onRowClick,
  emptyMessage = 'Өгөгдөл байхгүй',
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white border-opacity-20">
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-4 py-3 text-left text-lg font-semibold text-text-secondary"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-text-muted"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`glass-table-row ${onRowClick ? 'cursor-pointer' : ''}`}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-3 text-base text-white">
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
