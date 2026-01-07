package com.company.jmixwebcomponent.config;

import com.company.jmixwebcomponent.component.ReactDataTable;
import com.company.jmixwebcomponent.component.loader.ReactDataTableLoader;
import io.jmix.flowui.sys.registration.ComponentRegistration;
import io.jmix.flowui.sys.registration.ComponentRegistrationBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ReactDataTableRegistration {

    @Bean
    public ComponentRegistration reactDataTable() {
        return ComponentRegistrationBuilder.create(ReactDataTable.class)
                .withComponentLoader("reactDataTable", ReactDataTableLoader.class)
                .build();
    }
}
