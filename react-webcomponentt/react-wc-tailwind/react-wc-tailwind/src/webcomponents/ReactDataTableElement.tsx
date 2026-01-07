import { createRoot, type Root } from "react-dom/client";
import DataTable from "../components/DataTable";
import type { ColumnDef, Density, RowData } from "../types";
import cssText from "../styles/tailwind-wc.compiled.css?raw";

type RowEventDetail = { id?: string; row: RowData };

function parseJsonArray<T>(raw: string, fallback: T[]): T[] {
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? (v as T[]) : fallback;
  } catch {
    return fallback;
  }
}

function clampInt(v: unknown, fallback: number, min: number) {
  const n = typeof v === "number" ? v : Number(v);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.trunc(n));
}

function normalizeDensity(v: unknown): Density {
  return v === "compact" || v === "comfortable" || v === "normal" ? v : "normal";
}

export class ReactDataTableElement extends HTMLElement {
  private root: Root | null = null;

  private _columns: ColumnDef[] = [];
  private _rows: RowData[] = [];

  private _pageSize = 5;
  private _rowIdKey = "id";
  private _editable = true;
  private _deletable = true;
  private _density: Density = "normal";
  private _emptyText = "No data";

  // Cache raw JSON to avoid re-parse/re-render
  private _columnsRaw: string | null = null;
  private _rowsRaw: string | null = null;

  private _renderQueued = false;

  static observedAttributes = [
    "columns",
    "rows",
    "page-size",
    "row-id-key",
    "editable",
    "deletable",
    "density",
    "empty-text",
  ];

  /* ================= ATTRIBUTES ================= */

  attributeChangedCallback(
    name: string,
    _oldValue: string | null,
    newValue: string | null
  ) {
    // boolean attrs: presence = true, absence = false
    if (name === "editable") {
      this.editable = newValue !== null;
      return;
    }
    if (name === "deletable") {
      this.deletable = newValue !== null;
      return;
    }

    if (newValue == null) return;

    switch (name) {
      case "columns":
        this.columns = newValue;
        break;
      case "rows":
        this.rows = newValue;
        break;
      case "page-size":
        this.pageSize = newValue; // accept string
        break;
      case "row-id-key":
        this.rowIdKey = newValue || "id";
        break;
      case "density":
        this.density = normalizeDensity(newValue);
        break;
      case "empty-text":
        this.emptyText = newValue || "No data";
        break;
    }
  }

  /* ================= PROPERTIES (Vaadin/Jmix-friendly) ================= */

  set columns(value: ColumnDef[] | string) {
    if (typeof value === "string") {
      if (value === this._columnsRaw) return;
      this._columnsRaw = value;
      this._columns = parseJsonArray<ColumnDef>(value, []);
    } else {
      this._columnsRaw = null;
      this._columns = Array.isArray(value) ? value : [];
    }
    this.queueRender();
  }
  get columns() {
    return this._columns;
  }

  set rows(value: RowData[] | string) {
    if (typeof value === "string") {
      if (value === this._rowsRaw) return;
      this._rowsRaw = value;
      this._rows = parseJsonArray<RowData>(value, []);
    } else {
      this._rowsRaw = null;
      this._rows = Array.isArray(value) ? value : [];
    }
    this.queueRender();
  }
  get rows() {
    return this._rows;
  }

  set pageSize(value: number | string) {
    const next = clampInt(value, 10, 1);
    if (next === this._pageSize) return;
    this._pageSize = next;
    this.queueRender();
  }
  get pageSize() {
    return this._pageSize;
  }

  set rowIdKey(value: string) {
    const next = (value || "id").trim();
    if (next === this._rowIdKey) return;
    this._rowIdKey = next;
    this.queueRender();
  }
  get rowIdKey() {
    return this._rowIdKey;
  }

  set editable(value: boolean) {
    const next = Boolean(value);
    if (next === this._editable) return;
    this._editable = next;
    this.queueRender();
  }
  get editable() {
    return this._editable;
  }

  set deletable(value: boolean) {
    const next = Boolean(value);
    if (next === this._deletable) return;
    this._deletable = next;
    this.queueRender();
  }
  get deletable() {
    return this._deletable;
  }

  set density(value: Density) {
    const next = normalizeDensity(value);
    if (next === this._density) return;
    this._density = next;
    this.queueRender();
  }
  get density() {
    return this._density;
  }

  set emptyText(value: string) {
    const next = (value || "No data").trim();
    if (next === this._emptyText) return;
    this._emptyText = next;
    this.queueRender();
  }
  get emptyText() {
    return this._emptyText;
  }

  /* ================= LIFECYCLE HELPERS ================= */

  // Fix case: Vaadin sets properties before custom element is defined
  private upgradeProperty(prop: string) {
    const self = this as unknown as Record<string, unknown>;

    if (Object.prototype.hasOwnProperty.call(self, prop)) {
      const value = self[prop];
      delete self[prop];
      self[prop] = value; // triggers setter
    }
  }

  // Fix case: attributes already exist (page-size="5") but attributeChangedCallback is not called
  private syncFromAttributes() {
    const ps = this.getAttribute("page-size");
    if (ps != null) this._pageSize = clampInt(ps, 10, 1);

    const rik = this.getAttribute("row-id-key");
    if (rik != null && rik.trim()) this._rowIdKey = rik.trim();

    const den = this.getAttribute("density");
    if (den != null) this._density = normalizeDensity(den);

    const et = this.getAttribute("empty-text");
    if (et != null) this._emptyText = et;

    // boolean attributes: presence = true
    this._editable = this.hasAttribute("editable");
    this._deletable = this.hasAttribute("deletable");

    const cols = this.getAttribute("columns");
    if (cols != null && cols !== this._columnsRaw) {
      this._columnsRaw = cols;
      this._columns = parseJsonArray<ColumnDef>(cols, []);
    }

    const rows = this.getAttribute("rows");
    if (rows != null && rows !== this._rowsRaw) {
      this._rowsRaw = rows;
      this._rows = parseJsonArray<RowData>(rows, []);
    }
  }

  /* ================= LIFECYCLE ================= */

  connectedCallback() {
    if (this.shadowRoot) return;

    // upgrade early-set props
    this.upgradeProperty("pageSize");
    this.upgradeProperty("rowIdKey");
    this.upgradeProperty("editable");
    this.upgradeProperty("deletable");
    this.upgradeProperty("density");
    this.upgradeProperty("emptyText");
    this.upgradeProperty("columns");
    this.upgradeProperty("rows");

    // read initial attrs (important for Vaadin/Jmix)
    this.syncFromAttributes();

    const shadow = this.attachShadow({ mode: "open" });

    const style = document.createElement("style");
    style.textContent = cssText;

    const mount = document.createElement("div");
    mount.className = "tw-root";

    shadow.append(style, mount);

    this.root = createRoot(mount);
    this.queueRender();
  }

  disconnectedCallback() {
    this.root?.unmount();
    this.root = null;
  }

  /* ================= RENDER ================= */

  private queueRender() {
    if (this._renderQueued) return;
    this._renderQueued = true;

    queueMicrotask(() => {
      this._renderQueued = false;
      this.renderNow();
    });
  }

  private getRowKey = (row: RowData, index: number) => {
    const v = row?.[this._rowIdKey];
    return v == null ? String(index) : String(v);
  };

  private fire(name: "row-edit" | "row-delete", row: RowData) {
    const idVal = row?.[this._rowIdKey];
    const detail: RowEventDetail = {
      id: idVal == null ? undefined : String(idVal),
      row,
    };

    this.dispatchEvent(
      new CustomEvent<RowEventDetail>(name, {
        detail,
        bubbles: true,
        composed: true,
      })
    );
  }

  private renderNow() {
    if (!this.root) return;

    const editable = this._editable;
    const deletable = this._deletable;

    this.root.render(
      <DataTable
        columns={this._columns}
        rows={this._rows}
        pageSize={this._pageSize}
        emptyText={this._emptyText}
        density={this._density}
        editable={editable}
        deletable={deletable}
        getRowKey={this.getRowKey}
        onEdit={editable ? (row) => this.fire("row-edit", row) : undefined}
        onDelete={deletable ? (row) => this.fire("row-delete", row) : undefined}
      />
    );
  }
}

if (!customElements.get("react-data-table")) {
  customElements.define("react-data-table", ReactDataTableElement);
}
