import { createRoot, type Root } from "react-dom/client";
import DataTable from "../components/DataTable";
import type { ColumnDef, RowData } from "../types";
import cssText from "../styles/tailwind-wc.compiled.css?raw";

export class ReactDataTableElement extends HTMLElement {
  private root: Root | null = null;

  private _columns: ColumnDef[] = [];
  private _rows: RowData[] = [];

  static observedAttributes = ["columns", "rows"];

  /* ================= ATTRIBUTES ================= */

  attributeChangedCallback(name: string, _: string, value: string) {
    if (!value) return;

    if (name === "columns") {
      this.columns = value;
    }

    if (name === "rows") {
      this.rows = value;
    }
  }

  /* ================= PROPERTIES ================= */

  set columns(value: ColumnDef[] | string) {
    this._columns =
      typeof value === "string" ? JSON.parse(value) : value ?? [];
    this.render();
  }

  get columns() {
    return this._columns;
  }

  set rows(value: RowData[] | string) {
    this._rows =
      typeof value === "string" ? JSON.parse(value) : value ?? [];
    this.render();
  }

  get rows() {
    return this._rows;
  }

  /* ================= LIFECYCLE ================= */

  connectedCallback() {
    if (this.shadowRoot) return; // chống double mount (#299)

    const shadow = this.attachShadow({ mode: "open" });

    const style = document.createElement("style");
    style.textContent = cssText;

    const mount = document.createElement("div");
    mount.className = "tw-wrapper";

    shadow.append(style, mount);

    this.root = createRoot(mount);
    this.render();
  }

  disconnectedCallback() {
    this.root?.unmount();
    this.root = null;
  }

  /* ================= RENDER ================= */

  private render() {
    if (!this.root) return;
    if (!Array.isArray(this._columns)) return;

    this.root.render(
      <DataTable
        columns={this._columns}
        rows={this._rows}
        onEdit={(row) =>
          this.dispatchEvent(
            new CustomEvent("row-edit", {
              detail: row,
              bubbles: true,
              composed: true,
            })
          )
        }
        onDelete={(row) =>
          this.dispatchEvent(
            new CustomEvent("row-delete", {
              detail: row,
              bubbles: true,
              composed: true,
            })
          )
        }
      />
    );
  }
}

customElements.define("react-data-table", ReactDataTableElement);
