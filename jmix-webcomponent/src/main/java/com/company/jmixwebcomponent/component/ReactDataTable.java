package com.company.jmixwebcomponent.component;

import com.vaadin.flow.component.*;
import com.vaadin.flow.component.dependency.JsModule;
import com.vaadin.flow.shared.Registration;

@Tag("react-data-table")
@JsModule("./react-data-table.js")
public class ReactDataTable extends Component implements HasSize, HasStyle {

    public ReactDataTable() {
        // ✅ Defaults: không phụ thuộc XML/Studio
        setPageSize(10);
        setRowIdKey("id");
        setEditable(true);
        setDeletable(true);
        setDensity("normal");
        setEmptyText("No data");
    }

    /* ================= EVENTS ================= */

    @DomEvent("row-edit")
    public static class RowEditEvent extends ComponentEvent<ReactDataTable> {
        private final String detailJson;

        public RowEditEvent(ReactDataTable source, boolean fromClient,
                            @EventData("JSON.stringify(event.detail)") String detailJson) {
            super(source, fromClient);
            this.detailJson = detailJson;
        }

        public String getDetailJson() {
            return detailJson;
        }
    }

    public Registration addRowEditListener(ComponentEventListener<RowEditEvent> listener) {
        return addListener(RowEditEvent.class, listener);
    }

    @DomEvent("row-delete")
    public static class RowDeleteEvent extends ComponentEvent<ReactDataTable> {
        private final String detailJson;

        public RowDeleteEvent(ReactDataTable source, boolean fromClient,
                              @EventData("JSON.stringify(event.detail)") String detailJson) {
            super(source, fromClient);
            this.detailJson = detailJson;
        }

        public String getDetailJson() {
            return detailJson;
        }
    }

    public Registration addRowDeleteListener(ComponentEventListener<RowDeleteEvent> listener) {
        return addListener(RowDeleteEvent.class, listener);
    }

    /* ================= RUNTIME DATA ================= */

    public void setColumns(String json) {
        // columns/rows bạn đang observe "columns","rows" -> setAttribute để chắc chắn trigger
        getElement().setProperty("columns", json);
        if (json != null) getElement().setAttribute("columns", json);
        else getElement().removeAttribute("columns");
    }

    public void setRows(String json) {
        getElement().setProperty("rows", json);
        if (json != null) getElement().setAttribute("rows", json);
        else getElement().removeAttribute("rows");
    }

    /* ================= STUDIO-FRIENDLY PROPS ================= */

    public void setPageSize(int pageSize) {
        int v = Math.max(1, pageSize);

        // camelCase property (Vaadin hay set kiểu này)
        getElement().setProperty("pageSize", v);

        // ✅ kebab-case attribute (WebComponent bạn đang observe: "page-size")
        getElement().setAttribute("page-size", String.valueOf(v));
    }

    public void setRowIdKey(String rowIdKey) {
        String v = (rowIdKey == null || rowIdKey.isBlank()) ? "id" : rowIdKey.trim();

        getElement().setProperty("rowIdKey", v);
        getElement().setAttribute("row-id-key", v); // ✅
    }

    public void setEditable(boolean editable) {
        getElement().setProperty("editable", editable);

        // boolean attribute: presence=true, absence=false
        if (editable) getElement().setAttribute("editable", "");
        else getElement().removeAttribute("editable");
    }

    public void setDeletable(boolean deletable) {
        getElement().setProperty("deletable", deletable);

        if (deletable) getElement().setAttribute("deletable", "");
        else getElement().removeAttribute("deletable");
    }

    public void setDensity(String density) {
        String v = (density == null || density.isBlank()) ? "normal" : density.trim();

        getElement().setProperty("density", v);
        getElement().setAttribute("density", v); // ok (observe "density")
    }

    public void setEmptyText(String emptyText) {
        String v = (emptyText == null) ? "No data" : emptyText;

        getElement().setProperty("emptyText", v);
        getElement().setAttribute("empty-text", v); // ✅ observe "empty-text"
    }
}
