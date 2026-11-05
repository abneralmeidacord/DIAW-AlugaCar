package br.com.alugacar.model;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.util.*;
import java.math.BigDecimal;
import java.time.LocalDate;
public record CreditoRequest(
    @NotNull @DecimalMin("0.01") @Digits(integer=12, fraction=2) BigDecimal amount
) {}
