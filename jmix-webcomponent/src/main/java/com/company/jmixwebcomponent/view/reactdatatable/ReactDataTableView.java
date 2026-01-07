package com.company.jmixwebcomponent.view.reactdatatable;

import com.company.jmixwebcomponent.component.ReactDataTable;
import com.company.jmixwebcomponent.entity.User;
import com.company.jmixwebcomponent.view.main.MainView;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.vaadin.flow.router.Route;
import io.jmix.core.DataManager;
import io.jmix.flowui.Dialogs;
import io.jmix.flowui.ViewNavigators;
import io.jmix.flowui.action.DialogAction;
import io.jmix.flowui.view.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.*;

@Route(value = "react-data-table-view", layout = MainView.class)
@ViewController(id = "ReactDataTableView")
@ViewDescriptor(path = "react-data-table-view.xml")
public class ReactDataTableView extends StandardView {

    @ViewComponent
    private ReactDataTable table;

    @Autowired
    private DataManager dataManager;

    @Autowired
    private ViewNavigators viewNavigators;

    @Autowired
    private Dialogs dialogs;

    private final ObjectMapper mapper = new ObjectMapper();
    private List<User> users = new ArrayList<>();

    @Subscribe
    public void onInit(InitEvent event) {
        table.setSizeFull();
    }


    @Subscribe
    public void onBeforeShow(BeforeShowEvent event) {
        loadTable();
        initListeners();
    }

    private void initListeners() {

        table.addRowEditListener(e -> {
            try {
                Map<String, Object> row =
                        mapper.readValue(e.getRowJson(), Map.class);

                UUID userId = UUID.fromString(row.get("id").toString());

                User user = dataManager.load(User.class)
                        .id(userId)
                        .one();

                viewNavigators
                        .detailView(this, User.class)
                        .editEntity(user)
                        .navigate();

            } catch (Exception ex) {
                throw new RuntimeException(ex);
            }
        });

        table.addRowDeleteListener(e -> dialogs.createOptionDialog()
                .withHeader("Vui lòng xác nhận")
                .withText("Bạn có chắc chắn muốn xóa?")
                .withActions(
                        new DialogAction(DialogAction.Type.YES)
                                .withHandler(ev -> {
                                    try {
                                        Map<String, Object> row =
                                                mapper.readValue(e.getRowJson(), Map.class);

                                        UUID userId = UUID.fromString(row.get("id").toString());

                                        User user = dataManager.load(User.class)
                                                .id(userId)
                                                .one();

                                        dataManager.remove(user);
                                        loadTable(); // reload

                                    } catch (Exception ex) {
                                        throw new RuntimeException(ex);
                                    }
                                }),
                        new DialogAction(DialogAction.Type.NO)
                )
                .open());

    }

    private void loadTable() {
        try {
            users = dataManager.load(User.class).all().list();

            List<Map<String, Object>> columns = List.of(
                    Map.of("key", "username", "label", "Username"),
                    Map.of("key", "firstName", "label", "First name"),
                    Map.of("key", "lastName", "label", "Last name"),
                    Map.of("key", "email", "label", "Email"),
                    Map.of("key", "active", "label", "Active")
            );

            List<Map<String, Object>> rows = new ArrayList<>();

            for (User u : users) {
                Map<String, Object> m = new HashMap<>();
                m.put("id", u.getId().toString()); // ⭐ BẮT BUỘC
                m.put("username", u.getUsername());
                m.put("firstName", u.getFirstName());
                m.put("lastName", u.getLastName());
                m.put("email", u.getEmail());
                m.put("active", u.getActive());
                rows.add(m);
            }

            table.setColumns(mapper.writeValueAsString(columns));
            table.setRows(mapper.writeValueAsString(rows));

        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }
}
