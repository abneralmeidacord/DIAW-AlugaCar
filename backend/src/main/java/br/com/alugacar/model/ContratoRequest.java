package br.com.alugacar.model;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
public record ContratoRequest(
    @NotBlank @Size(max=10000) String terms
) {}
