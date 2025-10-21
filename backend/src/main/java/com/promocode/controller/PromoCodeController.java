package com.promocode.controller;

import com.promocode.dto.PromoCodeRequest;
import com.promocode.dto.PromoCodeResponse;
import com.promocode.model.PromoCode;
import com.promocode.service.PromoCodeService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/promo-codes")
public class PromoCodeController {

    private final PromoCodeService promoCodeService;

    public PromoCodeController(PromoCodeService promoCodeService) {
        this.promoCodeService = promoCodeService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PromoCodeResponse> createPromoCode(@Valid @RequestBody PromoCodeRequest request) {
        PromoCodeResponse response = promoCodeService.createPromoCode(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'BUSINESS')")
    public ResponseEntity<List<PromoCodeResponse>> getAllPromoCodes() {
        List<PromoCodeResponse> response = promoCodeService.getAllPromoCodes();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'BUSINESS')")
    public ResponseEntity<PromoCodeResponse> getPromoCodeById(@PathVariable Long id) {
        PromoCodeResponse response = promoCodeService.getPromoCodeById(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PromoCodeResponse> updatePromoCode(
            @PathVariable Long id,
            @Valid @RequestBody PromoCodeRequest request) {
        PromoCodeResponse response = promoCodeService.updatePromoCode(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletePromoCode(@PathVariable Long id) {
        promoCodeService.deletePromoCode(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/report")
    @PreAuthorize("hasAnyRole('ADMIN', 'BUSINESS')")
    public ResponseEntity<List<PromoCodeResponse>> getPromoCodesReport(
            @RequestParam(required = false) PromoCode.PromoCodeStatus status,
            @RequestParam(required = false) String code,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<PromoCodeResponse> response = promoCodeService.getPromoCodesReport(status, code, startDate, endDate);
        return ResponseEntity.ok(response);
    }
}
