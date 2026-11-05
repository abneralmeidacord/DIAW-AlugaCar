package br.com.alugacar.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "eventos_pedido")
public class EventoPedido {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    public UUID getId() {
        return id;
    }

    @ManyToOne(optional = false)
    @JoinColumn(name = "pedido_id", nullable = false)
    private PedidoAluguel pedido;
    @Column(nullable = false, length = 150)
    private String descricao;
    @Column(nullable = false)
    private LocalDateTime registradoEm;
    @Column(nullable = false)
    private int posicao;

    public EventoPedido() {
    }

    public PedidoAluguel getPedido() {
        return pedido;
    }

    public void setPedido(PedidoAluguel pedido) {
        this.pedido = pedido;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public LocalDateTime getRegistradoEm() {
        return registradoEm;
    }

    public void setRegistradoEm(LocalDateTime registradoEm) {
        this.registradoEm = registradoEm;
    }

    public int getPosicao() {
        return posicao;
    }

    public void setPosicao(int posicao) {
        this.posicao = posicao;
    }
}
