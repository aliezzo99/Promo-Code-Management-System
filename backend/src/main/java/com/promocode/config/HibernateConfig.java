package com.promocode.config;

import org.hibernate.cfg.AvailableSettings;
import org.springframework.boot.autoconfigure.orm.jpa.HibernatePropertiesCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Map;

@Configuration
public class HibernateConfig {

    private final SchemaPerTenantConnectionProvider schemaPerTenantConnectionProvider;
    private final TenantSchemaResolver tenantSchemaResolver;

    public HibernateConfig(SchemaPerTenantConnectionProvider schemaPerTenantConnectionProvider,
                           TenantSchemaResolver tenantSchemaResolver) {
        this.schemaPerTenantConnectionProvider = schemaPerTenantConnectionProvider;
        this.tenantSchemaResolver = tenantSchemaResolver;
    }

    @Bean
    public HibernatePropertiesCustomizer hibernatePropertiesCustomizer() {
        return hibernateProperties -> {
            hibernateProperties.put(AvailableSettings.MULTI_TENANT_CONNECTION_PROVIDER, schemaPerTenantConnectionProvider);
            hibernateProperties.put(AvailableSettings.MULTI_TENANT_IDENTIFIER_RESOLVER, tenantSchemaResolver);
        };
    }
}
