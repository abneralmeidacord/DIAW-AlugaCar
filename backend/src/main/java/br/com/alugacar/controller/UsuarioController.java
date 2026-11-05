package br.com.alugacar.controller;
import br.com.alugacar.model.*;
import br.com.alugacar.service.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.*;

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
