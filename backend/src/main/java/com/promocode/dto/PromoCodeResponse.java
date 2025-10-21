package com.promocode.dto;

import com.promocode.model.PromoCode;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PromoCodeResponse {
    private Long id;
    private String code;
    private BigDecimal amount;
    private PromoCode.DiscountType discountType;
    private LocalDate expiryDate;
    private Integer usageLimit;
    private Integer usageCount;
    private PromoCode.PromoCodeStatus status;

    public static PromoCodeResponse fromEntity(PromoCode promoCode) {
        return new PromoCodeResponse(
                promoCode.getId(),
                promoCode.getCode(),
                promoCode.getAmount(),
                promoCode.getDiscountType(),
                promoCode.getExpiryDate(),
                promoCode.getUsageLimit(),
                promoCode.getUsageCount(),
                promoCode.getStatus()
        );
    }
}
