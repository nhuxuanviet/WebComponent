package com.company.jmixwebcomponent.view.reactdatatable;

import com.company.jmixwebcomponent.entity.User;
import com.company.jmixwebcomponent.view.main.MainView;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.vaadin.flow.component.EventData;
import com.vaadin.flow.component.Html;
import com.vaadin.flow.component.UI;
import com.vaadin.flow.router.Route;
import io.jmix.core.DataManager;
import io.jmix.flowui.Dialogs;
import io.jmix.flowui.ViewNavigators;
import io.jmix.flowui.action.DialogAction;
import io.jmix.flowui.view.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.*;
import java.util.stream.Collectors;

@Route(value = "react-data-table-view", layout = MainView.class)
@ViewController(id = "ReactDataTableView")
@ViewDescriptor(path = "react-data-table-view.xml")
public class ReactDataTableView extends StandardView {

    @ViewComponent
    private Html reactTableHost;

    @Autowired
    private DataManager dataManager;

    @Autowired
    private ViewNavigators viewNavigators;

    @Autowired
    private Dialogs dialogs;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Subscribe
    public void onBeforeShow(BeforeShowEvent event) {

        // Load Web Component JS
        UI.getCurrent().getPage()
                .addJavaScript("/react-data-table.js");

        // ===== COLUMNS =====
        List<Map<String, Object>> columns = List.of(
                Map.of("key", "username",  "label", "Username"),
                Map.of("key", "firstName", "label", "First name"),
                Map.of("key", "lastName",  "label", "Last name"),
                Map.of("key", "email",     "label", "Email"),
                Map.of("key", "active",    "label", "Active")
        );

        // ===== LOAD USERS =====
        reloadTable(columns);
    }

    /**
     * EDIT USER
     */
    @Subscribe(id = "reactTableHost", subject = "row-edit")
    public void onRowEdit(@EventData("event.detail") Map<String, Object> row) {

        UUID userId = UUID.fromString(row.get("id").toString());

        User user = dataManager.load(User.class)
                .id(userId)
                .one();

        viewNavigators
                .detailView(this, User.class)
                .editEntity(user)
                .navigate();
    }

    /**
     * DELETE USER
     */
    @Subscribe(id = "reactTableHost", subject = "row-delete")
    public void onRowDelete(@EventData("event.detail") Map<String, Object> row) {

        UUID userId = UUID.fromString(row.get("id").toString());

        dialogs.createOptionDialog()
                .withHeader("Delete user")
                .withText("Are you sure you want to delete this user?")
                .withActions(
                        new DialogAction(DialogAction.Type.YES)
                                .withHandler(e -> {
                                    User user = dataManager.load(User.class)
                                            .id(userId)
                                            .one();

                                    dataManager.remove(user);

                                    reloadTable(null);
                                }),
                        new DialogAction(DialogAction.Type.NO)
                )
                .open();
    }

    /**
     * Reload table data
     */
    private void reloadTable(List<Map<String, Object>> columns) {
        try {
            List<User> users = dataManager.load(User.class)
                    .all()
                    .list();

            List<Map<String, Object>> rows = users.stream()
                    .map(u -> {
                        Map<String, Object> map = new HashMap<>();
                        map.put("id", u.getId().toString());
                        map.put("username", u.getUsername());
                        map.put("firstName", u.getFirstName());
                        map.put("lastName", u.getLastName());
                        map.put("email", u.getEmail());
                        map.put("active", u.getActive());
                        return map;
                    })
                    .collect(Collectors.toList());

            if (columns != null) {
                reactTableHost.getElement().executeJs(
                        """
                        this.setAttribute('columns', $0);
                        this.setAttribute('rows', $1);
                        """,
                        objectMapper.writeValueAsString(columns),
                        objectMapper.writeValueAsString(rows)
                );
            } else {
                reactTableHost.getElement().executeJs(
                        """
                        this.setAttribute('rows', $0);
                        """,
                        objectMapper.writeValueAsString(rows)
                );
            }
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }
}
