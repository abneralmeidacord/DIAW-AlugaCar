package br.com.alugacar.model;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
public record VinculoRequest(
    @NotBlank @Size(max=150) String employer,
    @NotNull @DecimalMin("0.00") @Digits(integer=12, fraction=2) BigDecimal income
) {}
