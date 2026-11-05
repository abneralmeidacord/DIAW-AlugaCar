package br.com.alugacar.model;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.util.*;
import java.math.BigDecimal;
import java.time.LocalDate;
public record VinculoRequest(
    @NotBlank @Size(max=150) String employer,
    @NotNull @DecimalMin("0.00") @Digits(integer=12, fraction=2) BigDecimal income
) {}
