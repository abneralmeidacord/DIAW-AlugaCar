package br.com.alugacar.model;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
public record PeriodoRequest(
    @NotNull LocalDate start,
    @NotNull LocalDate end
) {}
