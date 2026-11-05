package br.com.alugacar.model;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.util.*;
import java.math.BigDecimal;
import java.time.LocalDate;
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
