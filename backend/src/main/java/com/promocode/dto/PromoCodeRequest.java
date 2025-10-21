package com.promocode.dto;

import com.promocode.model.PromoCode;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class PromoCodeRequest {

    @NotBlank(message = "Code is required")
    private String code;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Amount must be greater than 0")
    private BigDecimal amount;

    @NotNull(message = "Discount type is required")
    private PromoCode.DiscountType discountType;

    @NotNull(message = "Expiry date is required")
    @Future(message = "Expiry date must be in the future")
    private LocalDate expiryDate;

    @Min(value = 0, message = "Usage limit must be 0 or greater")
    private Integer usageLimit;

    @NotNull(message = "Status is required")
    private PromoCode.PromoCodeStatus status;
}
