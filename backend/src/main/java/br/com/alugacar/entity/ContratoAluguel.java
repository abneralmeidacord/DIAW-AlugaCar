package br.com.alugacar.entity;

import br.com.alugacar.exception.EstadoInvalidoException;

import jakarta.persistence.*;
import java.util.*;
import java.math.BigDecimal;
import java.time.*;

@Entity
@Table(name = "contratos_aluguel")
public class ContratoAluguel {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    public UUID getId() {
        return id;
    }
    @OneToOne(optional = false) @JoinColumn(name = "pedido_id", nullable = false, unique = true)
    private PedidoAluguel pedido;
    @Column(nullable = false, unique = true, length = 60)
    private String numero;
    @ManyToOne(optional = false) @JoinColumn(name = "agente_id", nullable = false)
    private Agente agente;
    @Column(nullable = false)
    private LocalDateTime formalizadoEm;
    
    private LocalDateTime aceitoEm;
    
    private LocalDateTime iniciadoEm;
    @Column(nullable = false, length = 30)
    private String status = "AGUARDANDO_ACEITE";
    @Column(nullable = false, length = 10000)
    private String termos;
    @OneToOne(mappedBy = "aluguel", cascade = CascadeType.ALL)
    private ContratoCredito credito;
    public ContratoAluguel() {}
    public PedidoAluguel getPedido() {
        return pedido;
    }
    public void setPedido(PedidoAluguel pedido) {
        this.pedido = pedido;
    }
    public String getNumero() {
        return numero;
    }
    public void setNumero(String numero) {
        this.numero = numero;
    }
    public Agente getAgente() {
        return agente;
    }
    public void setAgente(Agente agente) {
        this.agente = agente;
    }
    public LocalDateTime getFormalizadoEm() {
        return formalizadoEm;
    }
    public void setFormalizadoEm(LocalDateTime formalizadoEm) {
        this.formalizadoEm = formalizadoEm;
    }
    public LocalDateTime getAceitoEm() {
        return aceitoEm;
    }
    public void setAceitoEm(LocalDateTime aceitoEm) {
        this.aceitoEm = aceitoEm;
    }
    public LocalDateTime getIniciadoEm() {
        return iniciadoEm;
    }
    public void setIniciadoEm(LocalDateTime iniciadoEm) {
        this.iniciadoEm = iniciadoEm;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
    public String getTermos() {
        return termos;
    }
    public void setTermos(String termos) {
        this.termos = termos;
    }
    public ContratoCredito getCredito() {
        return credito;
    }
    public void setCredito(ContratoCredito credito) {
        this.credito = credito;
    }
    public void aceitar(LocalDateTime agora) {
        if (!"AGUARDANDO_ACEITE".equals(status)) throw new EstadoInvalidoException("O contrato ainda não está disponível para aceite.");
        status = "ACEITO";
        aceitoEm = agora;
        pedido.setStatus("APROVADO");
    }
    public void iniciarAluguel(LocalDateTime agora) {
        if ("VIGENTE".equals(status) && "ALUGADO".equals(pedido.getStatus())) return;
        if (!"ACEITO".equals(status) || !"APROVADO".equals(pedido.getStatus())) throw new EstadoInvalidoException("Aceite o contrato antes de iniciar o aluguel.");
        status = "VIGENTE";
        iniciadoEm = agora;
        pedido.setStatus("ALUGADO");
    }

}
