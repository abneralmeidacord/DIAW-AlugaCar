package br.com.alugacar.service;

import br.com.alugacar.model.AvaliacaoRequest;
import br.com.alugacar.model.ContratoRequest;
import br.com.alugacar.model.CreditoRequest;
import br.com.alugacar.model.PedidoRequest;
import br.com.alugacar.model.PedidoView;
import br.com.alugacar.model.PeriodoRequest;
import br.com.alugacar.model.UsuarioView;
import br.com.alugacar.exception.ApiException;
import br.com.alugacar.entity.Agente;
import br.com.alugacar.entity.Automovel;
import br.com.alugacar.entity.AvaliacaoFinanceira;
import br.com.alugacar.entity.Banco;
import br.com.alugacar.entity.Cliente;
import br.com.alugacar.entity.ContratoAluguel;
import br.com.alugacar.entity.ContratoCredito;
import br.com.alugacar.entity.EventoPedido;
import br.com.alugacar.entity.PedidoAluguel;
import br.com.alugacar.entity.Usuario;
import jakarta.persistence.EntityManager;
import jakarta.persistence.LockModeType;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.hibernate.Hibernate;
import java.time.Clock;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@Transactional
public class PedidoService {
    private final EntityManager bancoDeDados;
    private final UsuarioService usuarios;
    private final Clock clock;
    private final boolean primeiroAtendimento;

    public PedidoService(EntityManager bancoDeDados, UsuarioService usuarios, Clock clock,
                         @Value("${app.allow-first-contact:true}") boolean primeiroAtendimento) {
        this.bancoDeDados = bancoDeDados;
        this.usuarios = usuarios;
        this.clock = clock;
        this.primeiroAtendimento = primeiroAtendimento;
    }

    public List<PedidoView> listar() {
        Usuario user = usuarios.atual();
        return visiveis(user).stream().map(pedido -> PedidoView.de(pedido, user)).toList();
    }
    public List<UsuarioView> clientes() {
        Usuario user = usuarios.atual();
        if (!(user instanceof Agente)) throw ApiException.forbidden();
        Map<UUID, Cliente> clients = new LinkedHashMap<>();
        visiveis(user).forEach(p -> clients.put(p.getCliente().getId(), p.getCliente()));
        return clients.values().stream().map(c -> UsuarioView.resumo(c, user instanceof Banco && vinculadoAoBanco(user, c))).toList();
    }

    public UsuarioView renda(UUID id) {
        Usuario user = usuarios.atual();
        if (!(user instanceof Banco)) throw ApiException.forbidden();
        var order = pedidosDoBanco(user.getId())
                .stream().filter(p -> p.getCliente().getId().equals(id)).findFirst().orElseThrow(ApiException::forbidden);
        return UsuarioView.resumo(order.getCliente(), true);
    }

    private boolean vinculadoAoBanco(Usuario bank, Cliente client) {
        return pedidosDoBanco(bank.getId()).stream()
                .anyMatch(p -> p.getCliente().getId().equals(client.getId()));
    }

    private List<PedidoAluguel> pedidosDoBanco(UUID bancoId) {
        return bancoDeDados.createQuery("""
                select p from PedidoAluguel p
                where p.bancoCredito.id = :banco and p.creditoSolicitado = true
                order by p.criadoEm desc
                """, PedidoAluguel.class)
                .setParameter("banco", bancoId)
                .getResultList();
    }

    private List<PedidoAluguel> visiveis(Usuario user) {
        if (user instanceof Cliente) {
            return bancoDeDados.createQuery("""
                    select p from PedidoAluguel p where p.cliente.id = :cliente order by p.criadoEm desc
                    """, PedidoAluguel.class)
                    .setParameter("cliente", user.getId())
                    .getResultList();
        }

        List<PedidoAluguel> recebidos = bancoDeDados.createQuery("""
                select p from PedidoAluguel p where p.destinatario.id = :agente order by p.criadoEm desc
                """, PedidoAluguel.class)
                .setParameter("agente", user.getId())
                .getResultList();

        Map<UUID, PedidoAluguel> orders = new LinkedHashMap<>();
        for (PedidoAluguel pedido : recebidos) {
            if (podeGerenciar(user, pedido)) {
                orders.put(pedido.getId(), pedido);
            }
        }
        if (user instanceof Banco) {
            for (PedidoAluguel pedido : pedidosDoBanco(user.getId())) {
                orders.put(pedido.getId(), pedido);
            }
        }
        return orders.values().stream().sorted(Comparator.comparing(PedidoAluguel::getCriadoEm).reversed()).toList();
    }

    private boolean podeGerenciar(Usuario user, PedidoAluguel order) {
        if (!(user instanceof Agente) || !user.getId().equals(order.getDestinatario().getId())) {
            return false;
        }
        if (primeiroAtendimento) {
            return true;
        }

        return !bancoDeDados.createQuery("""
                select p.id from PedidoAluguel p
                where p.destinatario.id = :agente and p.cliente.id = :cliente
                and p.contrato.status in ('VIGENTE', 'ENCERRADO')
                """, UUID.class)
                .setParameter("agente", user.getId())
                .setParameter("cliente", order.getCliente().getId())
                .setMaxResults(1)
                .getResultList().isEmpty();
    }

    private boolean podeConsultar(Usuario user, PedidoAluguel order) {
        if (user instanceof Cliente) return user.getId().equals(order.getCliente().getId());
        return podeGerenciar(user, order) || user instanceof Banco && order.getCreditoSolicitado() && order.getBancoCredito() != null && user.getId().equals(order.getBancoCredito().getId());
    }

    private PedidoAluguel obter(UUID id, Usuario user, boolean lock) {
        PedidoAluguel order;
        if (lock) {
            order = bancoDeDados.createQuery("select p from PedidoAluguel p where p.id = :id", PedidoAluguel.class)
                    .setParameter("id", id)
                    .setLockMode(LockModeType.PESSIMISTIC_WRITE)
                    .getSingleResultOrNull();
        } else {
            order = bancoDeDados.find(PedidoAluguel.class, id);
        }
        if (order == null) throw ApiException.notFound("Pedido");
        if (!podeConsultar(user, order)) throw ApiException.forbidden();
        return order;
    }

    public PedidoView consultar(UUID id) {
        Usuario user = usuarios.atual();
        return PedidoView.de(obter(id, user, false), user);
    }
    public PedidoView criar(PedidoRequest data) {
        Usuario user = usuarios.atual();
        if (!(user instanceof Cliente client)) throw ApiException.forbidden();
        validarPeriodo(data.start(), data.end());
        Automovel car = bancoDeDados.find(Automovel.class, data.carId());
        if (car == null) throw ApiException.notFound("Automóvel");
        if (!(Hibernate.unproxy(car.getProprietario()) instanceof Agente agent)) throw ApiException.invalid("Este automóvel não está disponível para aluguel por uma organização.");
        var order = new PedidoAluguel();
        order.setCliente(client);
        order.setAutomovel(car);
        order.setDestinatario(agent);
        order.setDataInicio(data.start());
        order.setDataFim(data.end());
        order.setCriadoEm(agora());
        order.setDiaria(car.getDiaria());
        order.setLocalidade(car.localidadeRetirada());
        order.setCreditoSolicitado(data.credit());
        if (data.credit()) {
            Banco bank;
            if (data.bankId() != null) {
                bank = bancoDeDados.find(Banco.class, data.bankId());
                if (bank == null) throw ApiException.notFound("Banco");
            } else {
                var available = usuarios.listarBancos();
                if (available.size() != 1) throw ApiException.invalid("Informe o banco para a solicitação de crédito (bankId).");
                bank = available.getFirst();
            }
            order.setBancoCredito(bank);
        }
        evento(order, "Pedido enviado");
        bancoDeDados.persist(order);
        return resposta(order, user);
    }

    public PedidoView alterar(UUID id, PeriodoRequest data) {
        Usuario user = usuarios.atual();
        var order = obter(id, user, true);
        if (!(user instanceof Cliente) && !podeGerenciar(user, order)) throw ApiException.forbidden();
        validarPeriodo(data.start(), data.end());
        order.alterarPedido(data.start(), data.end());
        evento(order, "Período do pedido atualizado");
        return resposta(order, user);
    }

    public PedidoView cancelar(UUID id) {
        Usuario user = usuarios.atual();
        var order = obter(id, user, true);
        exigirCliente(user, order);
        order.cancelar();
        evento(order, "Pedido cancelado pelo cliente");
        return resposta(order, user);
    }

    public PedidoView avaliar(UUID id, AvaliacaoRequest data) {
        Usuario user = usuarios.atual();
        var order = obter(id, user, true);
        if (!podeGerenciar(user, order)) throw ApiException.forbidden();
        if (!"PENDENTE".equals(order.getStatus()) || !order.getAvaliacoes().isEmpty()) throw ApiException.conflict("Este pedido já foi avaliado ou não está pendente.");
        var evaluation = new AvaliacaoFinanceira();
        evaluation.setPedido(order);
        evaluation.setAgente((Agente) user);
        evaluation.setParecer(data.result());
        evaluation.setJustificativa(data.note().trim());
        evaluation.setAvaliadaEm(agora());
        order.getAvaliacoes().add(evaluation);
        if ("NEGATIVO".equals(data.result())) order.setStatus("REPROVADO");
        evento(order, "POSITIVO".equals(data.result()) ? "Parecer favorável registrado" : "Pedido não aprovado");
        return resposta(order, user);
    }

    public PedidoView formalizar(UUID id, ContratoRequest data) {
        Usuario user = usuarios.atual();
        var order = obter(id, user, true);
        if (!podeGerenciar(user, order)) throw ApiException.forbidden();
        var evaluation = order.getAvaliacoes().isEmpty() ? null : order.getAvaliacoes().getLast();
        if (!"PENDENTE".equals(order.getStatus()) || order.getContrato() != null || evaluation == null || !"POSITIVO".equals(evaluation.getParecer()) || !evaluation.getAgente().getId().equals(user.getId()))
            throw ApiException.conflict("O mesmo agente que registrou o parecer favorável deve formalizar o contrato.");
        var contract = new ContratoAluguel();
        contract.setPedido(order);
        contract.setAgente((Agente) user);
        contract.setNumero("CT-" + order.getId());
        contract.setTermos(data.terms().trim());
        contract.setFormalizadoEm(agora());
        order.setContrato(contract);
        order.setStatus("AGUARDANDO_ACEITE");
        bancoDeDados.persist(contract);
        evento(order, "Contrato formalizado");
        return resposta(order, user);
    }

    public PedidoView aceitar(UUID id) {
        Usuario user = usuarios.atual();
        var order = obter(id, user, true);
        exigirCliente(user, order);
        if (order.getContrato() == null || !"AGUARDANDO_ACEITE".equals(order.getStatus())) throw ApiException.conflict("O contrato ainda não está disponível para aceite.");
        order.getContrato().aceitar(agora());
        evento(order, "Contrato aceito pelo cliente");
        return resposta(order, user);
    }

    public PedidoView alugar(UUID id) {
        Usuario user = usuarios.atual();
        var order = obter(id, user, true);
        exigirCliente(user, order);
        if (order.getContrato() == null) throw ApiException.conflict("Aceite o contrato antes de iniciar o aluguel.");
        if ("ALUGADO".equals(order.getStatus()) && "VIGENTE".equals(order.getContrato().getStatus())) return PedidoView.de(order, user);
        order.getContrato().iniciarAluguel(agora());
        evento(order, "Aluguel iniciado");
        return resposta(order, user);
    }

    public PedidoView concederCredito(UUID id, CreditoRequest data) {
        Usuario user = usuarios.atual();
        var order = obter(id, user, true);
        if (!(user instanceof Banco bank) || !order.getCreditoSolicitado() || !bank.getId().equals(order.getBancoCredito().getId())) throw ApiException.forbidden();
        var contract = order.getContrato();
        if (contract == null) throw ApiException.conflict("A organização deve formalizar o contrato de aluguel antes da concessão de crédito.");
        if (contract.getCredito() != null) throw ApiException.conflict("Este aluguel já possui crédito concedido.");
        if (List.of("CANCELADO", "REPROVADO", "FINALIZADO").contains(order.getStatus())) throw ApiException.conflict("Não é possível conceder crédito para um pedido encerrado.");
        var credit = new ContratoCredito();
        credit.setAluguel(contract);
        credit.setBanco(bank);
        credit.setNumero("CR-" + order.getId());
        credit.setValor(data.amount());
        credit.setRendaConsiderada(order.getCliente().getRendaDeclarada());
        credit.setDataConcessao(hoje());
        credit.setConcedidoEm(agora());
        contract.setCredito(credit);
        bancoDeDados.persist(credit);
        evento(order, "Crédito de aluguel concedido");
        return resposta(order, user);
    }

    private void exigirCliente(Usuario user, PedidoAluguel order) {
        if (!(user instanceof Cliente) || !user.getId().equals(order.getCliente().getId())) throw ApiException.forbidden();
    }
    private void validarPeriodo(LocalDate start, LocalDate end) {
        if (start.isBefore(hoje()) || !end.isAfter(start)) throw ApiException.invalid("A devolução deve ser posterior à retirada, em um período futuro.");
    }
    private LocalDate hoje() {
        return LocalDate.now(clock.withZone(ZoneId.of("America/Sao_Paulo")));
    }
    private LocalDateTime agora() {
        return LocalDateTime.now(clock);
    }
    private void evento(PedidoAluguel order, String description) {
        var event = new EventoPedido();
        event.setPedido(order);
        event.setDescricao(description);
        event.setRegistradoEm(agora());
        event.setPosicao(order.getEventos().size());
        order.getEventos().add(event);
    }
    private PedidoView resposta(PedidoAluguel order, Usuario user) {
        bancoDeDados.flush();
        return PedidoView.de(order, user);
    }
}
