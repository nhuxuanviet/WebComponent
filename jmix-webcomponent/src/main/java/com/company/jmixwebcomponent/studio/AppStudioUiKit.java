package com.company.jmixwebcomponent.studio;

import io.jmix.flowui.kit.meta.*;

@StudioUiKit
public interface AppStudioUiKit {

    @StudioComponent(
            name = "React Data Table",
            category = "Custom Components",
            classFqn = "com.company.jmixwebcomponent.component.ReactDataTable",
            xmlElement = "reactDataTable",
            xmlns = "http://company.com/schema/app-ui-components",
            xmlnsAlias = "app",
            icon = "io/jmix/flowui/kit/meta/icon/component/table.svg",
            properties = {
                    @StudioProperty(xmlAttribute = "id", type = StudioPropertyType.COMPONENT_ID),
                    @StudioProperty(xmlAttribute = "width", type = StudioPropertyType.SIZE),
                    @StudioProperty(xmlAttribute = "height", type = StudioPropertyType.SIZE),

                    @StudioProperty(xmlAttribute = "pageSize", type = StudioPropertyType.INTEGER, defaultValue = "10"),
                    @StudioProperty(xmlAttribute = "rowIdKey", type = StudioPropertyType.STRING, defaultValue = "id"),
                    @StudioProperty(xmlAttribute = "editable", type = StudioPropertyType.BOOLEAN, defaultValue = "true"),
                    @StudioProperty(xmlAttribute = "deletable", type = StudioPropertyType.BOOLEAN, defaultValue = "true"),
                    @StudioProperty(xmlAttribute = "density", type = StudioPropertyType.ENUMERATION,
                            defaultValue = "normal", options = {"compact", "normal", "comfortable"}),
                    @StudioProperty(xmlAttribute = "emptyText", type = StudioPropertyType.STRING, defaultValue = "No data")
            }
    )
    void reactDataTable();
}
