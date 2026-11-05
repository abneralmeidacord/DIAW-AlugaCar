package br.com.alugacar.model;
import java.math.BigDecimal;
public record VinculoView(
    String employer,
    BigDecimal income
) {}
