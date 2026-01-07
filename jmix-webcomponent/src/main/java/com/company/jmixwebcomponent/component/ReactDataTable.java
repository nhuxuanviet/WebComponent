package com.company.jmixwebcomponent.component;

import com.vaadin.flow.component.*;
import com.vaadin.flow.component.dependency.JsModule;
import com.vaadin.flow.shared.Registration;

@Tag("react-data-table")                       // ✅ trùng custom element name
@JsModule("./react-data-table.js")             // ✅ path tính từ thư mục frontend (xem note bên dưới)
public class ReactDataTable extends Component implements HasSize, HasStyle {

    /* ============== EVENTS ============== */

    @DomEvent("row-edit")
    public static class RowEditEvent extends ComponentEvent<ReactDataTable> {
        private final String rowJson;

        public RowEditEvent(ReactDataTable source, boolean fromClient,
                            @EventData("JSON.stringify(event.detail)") String rowJson) {
            super(source, fromClient);
            this.rowJson = rowJson;
        }
        public String getRowJson() { return rowJson; }
    }

    public Registration addRowEditListener(ComponentEventListener<RowEditEvent> listener) {
        return addListener(RowEditEvent.class, listener);
    }

    @DomEvent("row-delete")
    public static class RowDeleteEvent extends ComponentEvent<ReactDataTable> {
        private final String rowJson;

        public RowDeleteEvent(ReactDataTable source, boolean fromClient,
                              @EventData("JSON.stringify(event.detail)") String rowJson) {
            super(source, fromClient);
            this.rowJson = rowJson;
        }
        public String getRowJson() { return rowJson; }
    }

    public Registration addRowDeleteListener(ComponentEventListener<RowDeleteEvent> listener) {
        return addListener(RowDeleteEvent.class, listener);
    }

    /* ============== API (PROPS) ============== */

    public void setColumns(String json) {
        getElement().setProperty("columns", json);
    }

    public void setRows(String json) {
        getElement().setProperty("rows", json);
    }
}
