package br.com.alugacar.model;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.util.*;
import java.math.BigDecimal;
import java.time.LocalDate;
public record AvaliacaoRequest(
    @NotBlank @Pattern(regexp="POSITIVO|NEGATIVO") String result,
    @NotBlank @Size(max=3000) String note
) {}
