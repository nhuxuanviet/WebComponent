export interface ColumnDef {
  key: string;      // field name trong row
  label: string;    // header text
  align?: "left" | "center" | "right";
}


export type RowData = Record<string, unknown>;
