package com.company.jmixwebcomponent.config;

import com.company.jmixwebcomponent.component.ReactDataTable;
import io.jmix.flowui.xml.layout.loader.AbstractComponentLoader;

public class ReactDataTableLoader extends AbstractComponentLoader<ReactDataTable> {

    @Override
    protected ReactDataTable createComponent() {
        return factory.create(ReactDataTable.class);
    }

    @Override
    public void loadComponent() {
        // Load standard/common attributes
        loadId(resultComponent, element);
        loadVisible(resultComponent, element);

        componentLoader().loadSizeAttributes(resultComponent, element);
        componentLoader().loadClassNames(resultComponent, element);
        componentLoader().loadCss(resultComponent, element);

        // Load your custom props (Studio-friendly)
        loadInteger(element, "pageSize", resultComponent::setPageSize);
        loadString(element, "rowIdKey", resultComponent::setRowIdKey);
        loadBoolean(element, "editable", resultComponent::setEditable);
        loadBoolean(element, "deletable", resultComponent::setDeletable);
        loadString(element, "density", resultComponent::setDensity);
        loadString(element, "emptyText", resultComponent::setEmptyText);
        System.out.println("ReactDataTableLoader loaded: pageSize=" + element.attributeValue("pageSize"));
    }
}
