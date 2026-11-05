package br.com.alugacar.model;
import br.com.alugacar.entity.Automovel;
import java.util.UUID;
import java.math.BigDecimal;
public record AutomovelView(
    UUID id,
    String code,
    String matricula,
    int year,
    String brand,
    String model,
    String plate,
    String category,
    BigDecimal price,
    String fuel,
    String color,
    UUID org,
    String orgName,
    String photo,
    String tag,
    String location
) {
    public AutomovelView(Automovel carro) {
        this(carro.getId(), carro.getCodigo(), carro.getMatricula(), carro.getAno(),
            carro.getMarca(), carro.getModelo(), carro.getPlaca(), carro.getCategoria(),
            carro.getDiaria(), carro.getCombustivel(), carro.getCor(),
            carro.getProprietario().getId(), carro.getProprietario().getNomeExibicao(),
            carro.getFoto(), carro.getDestaque(), carro.localidadeRetirada());
    }
}
