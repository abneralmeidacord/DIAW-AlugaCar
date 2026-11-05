package br.com.alugacar.model;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
public record PerfilRequest(
    @NotBlank @Size(min=2, max=150) String name,
    @Size(max=20) String cpf,
    @Size(max=300) String address,
    @Size(max=100) String profession,
    @Size(max=25) String cnpj,
    @Size(max=3) List<@NotNull @Valid VinculoRequest> jobs
) {}
