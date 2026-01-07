package com.company.jmixwebcomponent.config;

import com.company.jmixwebcomponent.component.ReactDataTable;
import io.jmix.flowui.sys.registration.ComponentRegistration;
import io.jmix.flowui.sys.registration.ComponentRegistrationBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppUiComponentsConfiguration {

    @Bean
    public ComponentRegistration reactDataTable() {
        return ComponentRegistrationBuilder
                .create(ReactDataTable.class)
                .withComponentLoader("reactDataTable", ReactDataTableLoader.class)
                .build();
    }
}
