package br.com.alugacar.controller;
import br.com.alugacar.model.PerfilRequest;
import br.com.alugacar.model.UsuarioView;
import br.com.alugacar.service.PedidoService;
import br.com.alugacar.service.UsuarioService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class UsuarioController {
    private final UsuarioService usuarios;
    private final PedidoService pedidos;
    public UsuarioController(UsuarioService usuarios, PedidoService pedidos) {
        this.usuarios = usuarios;
        this.pedidos = pedidos;
    }
    @GetMapping("/perfil")
    public UsuarioView consultarPerfil() {
        return usuarios.perfil();
    }

    @PutMapping({"/perfil", "/me"})
    public UsuarioView atualizarPerfil(@Valid @RequestBody PerfilRequest dados) {
        return usuarios.atualizar(dados);
    }

    @DeleteMapping({"/perfil", "/me"})
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluirPerfil(HttpServletRequest request) {
        usuarios.excluir();
        var session = request.getSession(false);
        if (session != null) session.invalidate();
        SecurityContextHolder.clearContext();
    }

    @GetMapping("/bancos")
    public List<UsuarioView> listarBancos() {
        return usuarios.bancos();
    }

    @GetMapping("/clientes") public List<UsuarioView> clients() { return pedidos.clientes(); }
    @GetMapping("/clientes/{id}/renda") public UsuarioView income(@PathVariable UUID id) { return pedidos.renda(id); }
}
