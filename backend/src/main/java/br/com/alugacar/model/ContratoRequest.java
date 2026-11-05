package br.com.alugacar.model;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.util.*;
import java.math.BigDecimal;
import java.time.LocalDate;
public record ContratoRequest(
    @NotBlank @Size(max=10000) String terms
) {}
