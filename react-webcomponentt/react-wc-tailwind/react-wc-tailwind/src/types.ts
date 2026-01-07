export type Density = "compact" | "normal" | "comfortable";

export interface ColumnDef {
  key: string;
  label: string;
  align?: "left" | "center" | "right";
}

export type RowData = Record<string, unknown>;
