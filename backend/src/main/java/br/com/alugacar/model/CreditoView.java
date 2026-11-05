package br.com.alugacar.model;
import java.util.UUID;
import java.math.BigDecimal;
public record CreditoView(
    boolean requested,
    UUID bankOrg,
    String bankName,
    String status,
    BigDecimal amount,
    BigDecimal incomeConsidered,
    String grantedAt,
    UUID grantedBy
) {}
