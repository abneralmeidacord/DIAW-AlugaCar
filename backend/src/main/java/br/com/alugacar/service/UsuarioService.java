package br.com.alugacar.service;

import br.com.alugacar.model.*;
import br.com.alugacar.exception.ApiException;
import br.com.alugacar.entity.*;
import jakarta.persistence.EntityManager;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.hibernate.Hibernate;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
@Transactional
public class UsuarioService implements UserDetailsService {
    private final EntityManager bancoDeDados;
    private final PasswordEncoder encoder;

    public UsuarioService(EntityManager bancoDeDados, PasswordEncoder encoder) {
        this.bancoDeDados = bancoDeDados;
        this.encoder = encoder;
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String login) {
        Usuario usuario = buscarPorLogin(login.trim().toLowerCase(Locale.ROOT));
        if (usuario == null) {
            throw new UsernameNotFoundException("Credenciais inválidas.");
        }
        return User.withUsername(usuario.getLogin())
                .password(usuario.getSenhaHash())
                .roles(usuario.getPerfil().toUpperCase(Locale.ROOT))
                .build();
    }

    Usuario buscarPorLogin(String login) {
        return bancoDeDados.createQuery("select u from Usuario u where u.login = :login", Usuario.class)
                .setParameter("login", login)
                .getSingleResultOrNull();
    }

    public Usuario atual() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) throw ApiException.forbidden();
        Usuario user = buscarPorLogin(auth.getName());
        if (user == null) throw ApiException.forbidden();
        return (Usuario) Hibernate.unproxy(user);
    }

    public UsuarioView cadastrar(CadastroRequest data) {
        String login = data.email().trim().toLowerCase(Locale.ROOT);
        if (buscarPorLogin(login) != null) throw ApiException.conflict("Este e-mail já está cadastrado.");
        if (data.password().getBytes(StandardCharsets.UTF_8).length > 72) throw ApiException.invalid("A senha deve ter no máximo 72 bytes.");
        Usuario user = switch (data.role()) {
            case "cliente" -> new Cliente();
            case "empresa" -> new Empresa();
            case "banco" -> new Banco();
            default -> throw ApiException.invalid("Perfil inválido.");
        };
        user.setLogin(login);
        user.setSenhaHash(encoder.encode(data.password()));
        atualizarDados(user, new PerfilRequest(data.name(), data.cpf(), data.address(), data.profession(), data.cnpj(), data.jobs()));
        bancoDeDados.persist(user);
        bancoDeDados.flush();
        return UsuarioView.perfil(user);
    }

    public UsuarioView perfil() {
        return UsuarioView.perfil(atual());
    }
    public UsuarioView atualizar(PerfilRequest data) {
        Usuario user = atual();
        atualizarDados(user, data);
        bancoDeDados.flush();
        return UsuarioView.perfil(user);
    }

    public List<UsuarioView> bancos() {
        return listarBancos().stream()
            .map(banco -> UsuarioView.resumo(banco, false))
            .toList();
    }

    List<Banco> listarBancos() {
        return bancoDeDados.createQuery("select b from Banco b order by b.razaoSocial", Banco.class)
                .getResultList();
    }

    private void atualizarDados(Usuario user, PerfilRequest data) {
        if (user instanceof Cliente client) {
            client.setNome(data.name().trim());
            client.setCpf(obrigatorio(data.cpf(), "CPF"));
            client.setEndereco(obrigatorio(data.address(), "Endereço"));
            client.setProfissao(obrigatorio(data.profession(), "Profissão"));
            var jobs = data.jobs() == null ? List.<VinculoRequest>of() : data.jobs();
            if (jobs.size() > 3) throw ApiException.invalid("Informe no máximo três vínculos empregatícios.");
            client.getVinculos().clear();
            for (int i = 0; i < jobs.size(); i++) {
                var job = jobs.get(i);
                var vinculo = new VinculoEmpregaticio();
                vinculo.setCliente(client);
                vinculo.setEntidadeEmpregadora(job.employer().trim());
                vinculo.setRendimento(job.income());
                vinculo.setPosicao(i);
                client.getVinculos().add(vinculo);
            }
        } else {
            Agente agent = (Agente) user;
            agent.setRazaoSocial(data.name().trim());
            agent.setCnpj(obrigatorio(data.cnpj(), "CNPJ"));
        }
    }

    public void excluir() {
        Usuario user = atual();
        if (!(user instanceof Cliente)) throw ApiException.forbidden();
        List<PedidoAluguel> orders = bancoDeDados.createQuery(
                "select p from PedidoAluguel p where p.cliente.id = :cliente", PedidoAluguel.class)
                .setParameter("cliente", user.getId())
                .getResultList();
        boolean active = orders.stream().anyMatch(p -> "ALUGADO".equals(p.getStatus()) || p.getContrato() != null && "VIGENTE".equals(p.getContrato().getStatus()));
        if (active) throw ApiException.conflict("Cadastro com aluguel ativo ou contrato vigente não pode ser excluído.");
        if (!orders.isEmpty()) throw ApiException.conflict("A exclusão com histórico permanece pendente de definição.");
        bancoDeDados.remove(user);
        bancoDeDados.flush();
    }

    private String obrigatorio(String value, String label) {
        if (value == null || value.isBlank()) throw ApiException.invalid(label + " é obrigatório.");
        return value.trim();
    }
}
