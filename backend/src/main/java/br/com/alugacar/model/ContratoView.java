package br.com.alugacar.model;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.util.*;
import java.math.BigDecimal;
import java.time.LocalDate;
public record ContratoView(
    String id,
    UUID uuid,
    String status,
    String formalizedAt,
    UUID formalizedBy,
    String acceptedAt,
    String startedAt,
    String terms
) {}
