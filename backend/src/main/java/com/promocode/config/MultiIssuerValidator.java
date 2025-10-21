package com.promocode.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.List;

public class MultiIssuerValidator implements OAuth2TokenValidator<Jwt> {
    private static final Logger log = LoggerFactory.getLogger(MultiIssuerValidator.class);
    private final List<String> validIssuers;

    public MultiIssuerValidator(List<String> validIssuers) {
        this.validIssuers = validIssuers;
    }

    @Override
    public OAuth2TokenValidatorResult validate(Jwt jwt) {
        String issuer = jwt.getIssuer() != null ? jwt.getIssuer().toString() : null;

        log.debug("MultiIssuerValidator - Actual issuer in JWT: {}", issuer);
        log.debug("MultiIssuerValidator - Valid issuers: {}", validIssuers);

        if (issuer == null) {
            log.error("MultiIssuerValidator - The iss claim is missing");
            return OAuth2TokenValidatorResult.failure(
                new OAuth2Error("invalid_token", "The iss claim is missing", null)
            );
        }

        for (String validIssuer : validIssuers) {
            if (validIssuer.equals(issuer)) {
                log.debug("MultiIssuerValidator - Issuer {} matches valid issuer {}", issuer, validIssuer);
                return OAuth2TokenValidatorResult.success();
            }
        }

        log.error("MultiIssuerValidator - The iss claim is not valid. Expected one of {} but was {}", validIssuers, issuer);
        return OAuth2TokenValidatorResult.failure(
            new OAuth2Error("invalid_token",
                "The iss claim is not valid. Expected one of " + validIssuers + " but was " + issuer,
                null)
        );
    }
}
