package br.com.alugacar.model;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.util.List;
public record CadastroRequest(
    @NotBlank @Pattern(regexp="cliente|empresa|banco") String role,
    @NotBlank @Size(min=2, max=150) String name,
    @NotBlank @Email @Size(max=254) String email,
    @NotBlank @Size(min=6, max=72) String password,
    @Size(max=20) String cpf,
    @Size(max=300) String address,
    @Size(max=100) String profession,
    @Size(max=25) String cnpj,
    @Size(max=3) List<@NotNull @Valid VinculoRequest> jobs
) {}
