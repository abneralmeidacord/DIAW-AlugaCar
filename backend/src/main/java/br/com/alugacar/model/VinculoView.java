package br.com.alugacar.model;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.util.*;
import java.math.BigDecimal;
import java.time.LocalDate;
public record VinculoView(
    String employer,
    BigDecimal income
) {}
