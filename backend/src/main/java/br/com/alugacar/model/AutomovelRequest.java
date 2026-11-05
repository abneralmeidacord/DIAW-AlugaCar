package br.com.alugacar.model;

import java.math.BigDecimal;

import br.com.alugacar.entity.Automovel;
import br.com.alugacar.entity.Usuario;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record AutomovelRequest(
        @NotBlank @Size(max = 50) String code,
        @NotBlank @Size(max = 50) String matricula,
        @NotNull @Min(1900) @Max(2100) Integer year,
        @NotBlank @Size(max = 50) String brand,
        @NotBlank @Size(max = 100) String model,
        @NotBlank @Size(max = 20) String plate,
        @NotBlank @Size(max = 50) String category,
        @NotNull @DecimalMin("0.01") @Digits(integer = 12, fraction = 2) BigDecimal price,
        @NotBlank @Size(max = 50) String fuel,
        @Size(max = 50) String color,
        @Size(max = 2000) String photo,
        @Size(max = 150) String tag,
        @Size(max = 120) String location) {
    public Automovel novoCarro(Usuario proprietario) {
        Automovel carro = new Automovel();
        carro.setProprietario(proprietario);
        carro.setCodigo(code.trim());
        carro.setMatricula(matricula.trim());
        carro.setAno(year);
        carro.setMarca(brand.trim());
        carro.setModelo(model.trim());
        carro.setPlaca(plate.trim());
        carro.setCategoria(category.trim());
        carro.setDiaria(price);
        carro.setCombustivel(fuel);
        carro.setCor(color);
        carro.setFoto(photo);
        carro.setDestaque(tag);
        if (location != null && !location.isBlank()) {
            carro.setLocalidade(location.strip());
        }
        return carro;
    }
}
