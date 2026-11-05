package br.com.alugacar.model;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
public record AvaliacaoRequest(
    @NotBlank @Pattern(regexp="POSITIVO|NEGATIVO") String result,
    @NotBlank @Size(max=3000) String note
) {}
