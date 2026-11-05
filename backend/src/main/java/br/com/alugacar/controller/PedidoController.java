package br.com.alugacar.controller;
import br.com.alugacar.model.*;
import br.com.alugacar.service.PedidoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {
    private final PedidoService pedidos;
    public PedidoController(PedidoService pedidos) {
        this.pedidos = pedidos;
    }
    @GetMapping public List<PedidoView> list() { return pedidos.listar(); }
    @GetMapping("/{id}") public PedidoView get(@PathVariable UUID id) { return pedidos.consultar(id); }
    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    public PedidoView create(@Valid @RequestBody PedidoRequest data) {
        return pedidos.criar(data);
    }
    @PutMapping("/{id}") public PedidoView update(@PathVariable UUID id, @Valid @RequestBody PeriodoRequest data) { return pedidos.alterar(id, data); }
    @PostMapping("/{id}/cancelar") public PedidoView cancel(@PathVariable UUID id) { return pedidos.cancelar(id); }
    @PostMapping({"/{id}/avaliar", "/{id}/avaliacao"})
    public PedidoView avaliar(@PathVariable UUID id, @Valid @RequestBody AvaliacaoRequest dados) {
        return pedidos.avaliar(id, dados);
    }

    @PostMapping({"/{id}/formalizar", "/{id}/contrato"})
    public PedidoView formalizar(@PathVariable UUID id, @Valid @RequestBody ContratoRequest dados) {
        return pedidos.formalizar(id, dados);
    }
    @PostMapping("/{id}/aceitar") public PedidoView accept(@PathVariable UUID id) { return pedidos.aceitar(id); }
    @PostMapping("/{id}/alugar") public PedidoView rent(@PathVariable UUID id) { return pedidos.alugar(id); }
    @PostMapping("/{id}/credito") public PedidoView credit(@PathVariable UUID id, @Valid @RequestBody CreditoRequest data) { return pedidos.concederCredito(id, data); }
}
