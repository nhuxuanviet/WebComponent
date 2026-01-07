import { createRoot, type Root } from "react-dom/client";
import DataTable from "../components/DataTable";
import type { ColumnDef, RowData } from "../types";
import cssText from "../styles/tailwind-wc.compiled.css?raw";

export class ReactDataTableElement extends HTMLElement {
  private root: Root | null = null;
  private columns: ColumnDef[] = [];
  private rows: RowData[] = [];

  static observedAttributes = ["columns", "rows"];

  connectedCallback() {
    if (this.shadowRoot) return; // 🔥 chống double mount (#299)

    const shadow = this.attachShadow({ mode: "open" });

    const style = document.createElement("style");
    style.textContent = cssText;

    const mount = document.createElement("div");
    mount.className = "tw-wrapper";

    shadow.append(style, mount);

    this.root = createRoot(mount);
    this.render();
  }

  attributeChangedCallback(name: string, _: string, value: string) {
    if (!value) return;

    try {
      if (name === "columns") {
        this.columns = JSON.parse(value);
      }

      if (name === "rows") {
        this.rows = JSON.parse(value);
      }

      this.render();
    } catch (e) {
      console.error(`[react-data-table] Invalid JSON for ${name}`, e);
    }
  }

  private render() {
    if (!this.root) return;

    this.root.render(
      <DataTable
        columns={this.columns}
        rows={this.rows}
        onEdit={(row) => {
          this.dispatchEvent(
            new CustomEvent("row-edit", {
              detail: row,
              bubbles: true,
              composed: true,
            })
          );
        }}
        onDelete={(row) => {
          this.dispatchEvent(
            new CustomEvent("row-delete", {
              detail: row,
              bubbles: true,
              composed: true,
            })
          );
        }}
      />
    );
  }

  disconnectedCallback() {
    // cleanup khi Jmix / Vaadin destroy view
    this.root?.unmount();
    this.root = null;
  }
}

customElements.define("react-data-table", ReactDataTableElement);
