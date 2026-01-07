package com.company.jmixwebcomponent.component.loader;

import com.company.jmixwebcomponent.component.ReactDataTable;
import io.jmix.flowui.xml.layout.loader.AbstractComponentLoader;

public class ReactDataTableLoader extends AbstractComponentLoader<ReactDataTable> {

    @Override
    protected ReactDataTable createComponent() {
        return factory.create(ReactDataTable.class);
    }

    @Override
    public void loadComponent() {
        componentLoader().loadSizeAttributes(resultComponent, element);
    }
}
