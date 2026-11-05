package br.com.alugacar.model;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;
import java.time.LocalDate;
public record PedidoRequest(
    @NotNull UUID carId,
    @NotNull LocalDate start,
    @NotNull LocalDate end,
    boolean credit,
    UUID bankId
) {}
