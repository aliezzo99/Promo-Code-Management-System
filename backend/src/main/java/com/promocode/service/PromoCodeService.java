package com.promocode.service;

import com.promocode.dto.PromoCodeRequest;
import com.promocode.dto.PromoCodeResponse;
import com.promocode.exception.ResourceNotFoundException;
import com.promocode.model.PromoCode;
import com.promocode.repository.PromoCodeRepository;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class PromoCodeService {

    private final PromoCodeRepository promoCodeRepository;

    public PromoCodeService(PromoCodeRepository promoCodeRepository) {
        this.promoCodeRepository = promoCodeRepository;
    }

    public PromoCodeResponse createPromoCode(PromoCodeRequest request) {
        PromoCode promoCode = new PromoCode();
        promoCode.setCode(request.getCode());
        promoCode.setAmount(request.getAmount());
        promoCode.setDiscountType(request.getDiscountType());
        promoCode.setExpiryDate(request.getExpiryDate());
        promoCode.setUsageLimit(request.getUsageLimit());
        promoCode.setUsageCount(0);
        promoCode.setStatus(request.getStatus());

        PromoCode saved = promoCodeRepository.save(promoCode);
        return PromoCodeResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<PromoCodeResponse> getAllPromoCodes() {
        return promoCodeRepository.findAll().stream()
                .map(PromoCodeResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PromoCodeResponse getPromoCodeById(Long id) {
        PromoCode promoCode = promoCodeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Promo code not found with id: " + id));
        return PromoCodeResponse.fromEntity(promoCode);
    }

    public PromoCodeResponse updatePromoCode(Long id, PromoCodeRequest request) {
        PromoCode promoCode = promoCodeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Promo code not found with id: " + id));

        promoCode.setCode(request.getCode());
        promoCode.setAmount(request.getAmount());
        promoCode.setDiscountType(request.getDiscountType());
        promoCode.setExpiryDate(request.getExpiryDate());
        promoCode.setUsageLimit(request.getUsageLimit());
        promoCode.setStatus(request.getStatus());

        PromoCode updated = promoCodeRepository.save(promoCode);
        return PromoCodeResponse.fromEntity(updated);
    }

    public void deletePromoCode(Long id) {
        if (!promoCodeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Promo code not found with id: " + id);
        }
        promoCodeRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<PromoCodeResponse> getPromoCodesReport(
            PromoCode.PromoCodeStatus status,
            String code,
            LocalDate startDate,
            LocalDate endDate) {

        Specification<PromoCode> spec = (root, query, cb) -> cb.conjunction();

        if (status != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("status"), status));
        }

        if (code != null && !code.isEmpty()) {
            spec = spec.and((root, query, cb) -> cb.like(cb.lower(root.get("code")), "%" + code.toLowerCase() + "%"));
        }

        if (startDate != null) {
            spec = spec.and((root, query, cb) -> cb.greaterThanOrEqualTo(root.get("expiryDate"), startDate));
        }

        if (endDate != null) {
            spec = spec.and((root, query, cb) -> cb.lessThanOrEqualTo(root.get("expiryDate"), endDate));
        }

        return promoCodeRepository.findAll(spec).stream()
                .map(PromoCodeResponse::fromEntity)
                .collect(Collectors.toList());
    }
}
