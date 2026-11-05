package br.com.alugacar.controller;
import br.com.alugacar.model.AutomovelRequest;
import br.com.alugacar.model.AutomovelView;
import br.com.alugacar.service.AutomovelService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
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
                                    @RequestParam(required = false) String busca,
                                    @RequestParam(required = false) String localidade) {
        return automoveis.pesquisar(marca, categoria, busca, localidade);
    }

    @GetMapping("/localidades")
    public List<String> localidades() {
        return automoveis.localidades();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AutomovelView cadastrar(@Valid @RequestBody AutomovelRequest dados) {
        return automoveis.cadastrar(dados);
    }
}
