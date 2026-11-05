package br.com.alugacar.model;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.util.*;
import java.math.BigDecimal;
import java.time.LocalDate;
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
