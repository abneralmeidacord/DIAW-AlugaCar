package br.com.alugacar.entity;

import br.com.alugacar.exception.EstadoInvalidoException;

import jakarta.persistence.*;
import java.util.*;
import java.math.BigDecimal;
import java.time.*;

@Entity
@Table(name = "pedidos_aluguel")
public class PedidoAluguel {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    public UUID getId() {
        return id;
    }
    @ManyToOne(optional = false) @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;
    @ManyToOne(optional = false) @JoinColumn(name = "automovel_id", nullable = false)
    private Automovel automovel;
    @ManyToOne(optional = false) @JoinColumn(name = "destinatario_id", nullable = false)
    private Agente destinatario;
    @Column(nullable = false)
    private LocalDateTime criadoEm;
    @Column(nullable = false)
    private LocalDate dataInicio;
    @Column(nullable = false)
    private LocalDate dataFim;
    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal diaria;
    @Column(length = 120)
    private String localidade;
    @Column(nullable = false, length = 30)
    private String status = "PENDENTE";
    @Column(nullable = false)
    private boolean creditoSolicitado = false;
    @ManyToOne @JoinColumn(name = "banco_credito_id")
    private Banco bancoCredito;
    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL) @OrderBy("avaliadaEm asc")
    private List<AvaliacaoFinanceira> avaliacoes = new ArrayList<>();
    @OneToOne(mappedBy = "pedido", cascade = CascadeType.ALL)
    private ContratoAluguel contrato;
    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true) @OrderBy("posicao asc")
    private List<EventoPedido> eventos = new ArrayList<>();
    public PedidoAluguel() {}
    public Cliente getCliente() {
        return cliente;
    }
    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }
    public Automovel getAutomovel() {
        return automovel;
    }
    public void setAutomovel(Automovel automovel) {
        this.automovel = automovel;
    }
    public Agente getDestinatario() {
        return destinatario;
    }
    public void setDestinatario(Agente destinatario) {
        this.destinatario = destinatario;
    }
    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }
    public void setCriadoEm(LocalDateTime criadoEm) {
        this.criadoEm = criadoEm;
    }
    public LocalDate getDataInicio() {
        return dataInicio;
    }
    public void setDataInicio(LocalDate dataInicio) {
        this.dataInicio = dataInicio;
    }
    public LocalDate getDataFim() {
        return dataFim;
    }
    public void setDataFim(LocalDate dataFim) {
        this.dataFim = dataFim;
    }
    public BigDecimal getDiaria() {
        return diaria;
    }
    public void setDiaria(BigDecimal diaria) {
        this.diaria = diaria;
    }

    public String getLocalidade() {
        return localidade == null ? Automovel.LOCALIDADE_PADRAO : localidade;
    }

    public void setLocalidade(String localidade) {
        this.localidade = localidade;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
    public boolean getCreditoSolicitado() {
        return creditoSolicitado;
    }
    public void setCreditoSolicitado(boolean creditoSolicitado) {
        this.creditoSolicitado = creditoSolicitado;
    }
    public Banco getBancoCredito() {
        return bancoCredito;
    }
    public void setBancoCredito(Banco bancoCredito) {
        this.bancoCredito = bancoCredito;
    }
    public List<AvaliacaoFinanceira> getAvaliacoes() {
        return avaliacoes;
    }
    public void setAvaliacoes(List<AvaliacaoFinanceira> avaliacoes) {
        this.avaliacoes = avaliacoes;
    }
    public ContratoAluguel getContrato() {
        return contrato;
    }
    public void setContrato(ContratoAluguel contrato) {
        this.contrato = contrato;
    }
    public List<EventoPedido> getEventos() {
        return eventos;
    }
    public void setEventos(List<EventoPedido> eventos) {
        this.eventos = eventos;
    }
    public void alterarPedido(LocalDate inicio, LocalDate fim) {
        if (!"PENDENTE".equals(status) || !avaliacoes.isEmpty()) throw new EstadoInvalidoException("Somente pedidos não avaliados podem ser alterados.");
        this.dataInicio = inicio;
        this.dataFim = fim;
    }
    public void cancelar() {
        if (!"PENDENTE".equals(status) || !avaliacoes.isEmpty()) throw new EstadoInvalidoException("Somente pedidos não avaliados podem ser cancelados.");
        this.status = "CANCELADO";
    }

}
