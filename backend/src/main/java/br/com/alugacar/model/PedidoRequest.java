package br.com.alugacar.model;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.util.*;
import java.math.BigDecimal;
import java.time.LocalDate;
public record PedidoRequest(
    @NotNull UUID carId,
    @NotNull LocalDate start,
    @NotNull LocalDate end,
    boolean credit,
    UUID bankId
) {}
