package br.com.alugacar.entity;

import jakarta.persistence.*;
import java.util.*;
import java.math.BigDecimal;
import java.time.*;

@Entity
@Table(name = "vinculos_empregaticios")
public class VinculoEmpregaticio {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    public UUID getId() {
        return id;
    }
    @ManyToOne(optional = false) @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;
    @Column(nullable = false, length = 150)
    private String entidadeEmpregadora;
    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal rendimento;
    @Column(nullable = false)
    private int posicao;
    public VinculoEmpregaticio() {}
    public Cliente getCliente() {
        return cliente;
    }
    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }
    public String getEntidadeEmpregadora() {
        return entidadeEmpregadora;
    }
    public void setEntidadeEmpregadora(String entidadeEmpregadora) {
        this.entidadeEmpregadora = entidadeEmpregadora;
    }
    public BigDecimal getRendimento() {
        return rendimento;
    }
    public void setRendimento(BigDecimal rendimento) {
        this.rendimento = rendimento;
    }
    public int getPosicao() {
        return posicao;
    }
    public void setPosicao(int posicao) {
        this.posicao = posicao;
    }
}
