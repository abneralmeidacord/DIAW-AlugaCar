package br.com.alugacar.model;
import br.com.alugacar.entity.Agente;
import br.com.alugacar.entity.Cliente;
import br.com.alugacar.entity.Usuario;
import java.util.List;
import java.util.UUID;
import java.math.BigDecimal;
public record UsuarioView(
    UUID id,
    String role,
    String name,
    String email,
    UUID org,
    String cpf,
    String address,
    String profession,
    String cnpj,
    BigDecimal income,
    List<VinculoView> jobs
) {
    public static UsuarioView perfil(Usuario usuario) {
        return de(usuario, true, true);
    }

    public static UsuarioView resumo(Usuario usuario, boolean exibirRenda) {
        return de(usuario, false, exibirRenda);
    }

    private static UsuarioView de(Usuario usuario, boolean perfilCompleto, boolean exibirRenda) {
        if (usuario instanceof Cliente cliente) {
            List<VinculoView> vinculos = List.of();
            BigDecimal renda = null;
            if (exibirRenda) {
                renda = cliente.getRendaDeclarada();
                vinculos = cliente.getVinculos().stream()
                    .map(v -> new VinculoView(v.getEntidadeEmpregadora(), v.getRendimento()))
                    .toList();
            }
            return new UsuarioView(usuario.getId(), usuario.getPerfil(), cliente.getNome(),
                usuario.getLogin(), null, perfilCompleto ? cliente.getCpf() : null,
                perfilCompleto ? cliente.getEndereco() : null, cliente.getProfissao(), null,
                renda, vinculos);
        }

        Agente agente = (Agente) usuario;
        return new UsuarioView(usuario.getId(), usuario.getPerfil(), agente.getRazaoSocial(),
            usuario.getLogin(), usuario.getId(), null, null, null,
            perfilCompleto ? agente.getCnpj() : null, null, List.of());
    }
}
