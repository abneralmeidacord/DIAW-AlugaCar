package br.com.alugacar.model;
import java.util.UUID;
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
