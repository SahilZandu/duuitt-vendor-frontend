// components/DataTable.tsx
import DataTable from 'react-data-table-component';
import type { TableColumn } from "react-data-table-component"; 

interface DataTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  pagination?: boolean;
  selectableRows?: boolean;
}

const GlobalDataTable = <T,>({
  columns,
  data,
  pagination = true,
  selectableRows = true,
}: DataTableProps<T>) => {
  return (
    <DataTable
      columns={columns}
      data={data}
      pagination={pagination}
      selectableRows={selectableRows}
      highlightOnHover
      responsive
      striped
    />
  );
};

export default GlobalDataTable;