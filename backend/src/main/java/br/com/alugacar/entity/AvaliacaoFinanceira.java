package br.com.alugacar.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.util.UUID;
import java.time.LocalDateTime;

@Entity
@Table(name = "avaliacoes_financeiras")
public class AvaliacaoFinanceira {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    public UUID getId() {
        return id;
    }
    @ManyToOne(optional = false) @JoinColumn(name = "pedido_id", nullable = false)
    private PedidoAluguel pedido;
    @ManyToOne(optional = false) @JoinColumn(name = "agente_id", nullable = false)
    private Agente agente;
    @Column(nullable = false, length = 20)
    private String parecer;
    @Column(nullable = false, length = 3000)
    private String justificativa;
    @Column(nullable = false)
    private LocalDateTime avaliadaEm;
    public AvaliacaoFinanceira() {}
    public PedidoAluguel getPedido() {
        return pedido;
    }
    public void setPedido(PedidoAluguel pedido) {
        this.pedido = pedido;
    }
    public Agente getAgente() {
        return agente;
    }
    public void setAgente(Agente agente) {
        this.agente = agente;
    }
    public String getParecer() {
        return parecer;
    }
    public void setParecer(String parecer) {
        this.parecer = parecer;
    }
    public String getJustificativa() {
        return justificativa;
    }
    public void setJustificativa(String justificativa) {
        this.justificativa = justificativa;
    }
    public LocalDateTime getAvaliadaEm() {
        return avaliadaEm;
    }
    public void setAvaliadaEm(LocalDateTime avaliadaEm) {
        this.avaliadaEm = avaliadaEm;
    }
}
