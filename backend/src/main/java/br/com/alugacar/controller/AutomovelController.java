package br.com.alugacar.controller;
import br.com.alugacar.model.*;
import br.com.alugacar.service.AutomovelService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping({"/api/carros", "/api/automoveis"})
public class AutomovelController {
    private final AutomovelService automoveis;
    public AutomovelController(AutomovelService automoveis) {
        this.automoveis = automoveis;
    }
    @GetMapping
    public List<AutomovelView> listar(@RequestParam(required = false) String marca,
                                    @RequestParam(required = false) String categoria,
                                    @RequestParam(required = false) String busca) {
        return automoveis.pesquisar(marca, categoria, busca);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AutomovelView cadastrar(@Valid @RequestBody AutomovelRequest dados) {
        return automoveis.cadastrar(dados);
    }
}
