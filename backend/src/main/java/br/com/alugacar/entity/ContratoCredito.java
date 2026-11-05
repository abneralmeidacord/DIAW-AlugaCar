package br.com.alugacar.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.util.UUID;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "contratos_credito")
public class ContratoCredito {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    public UUID getId() {
        return id;
    }
    @OneToOne(optional = false) @JoinColumn(name = "aluguel_id", nullable = false, unique = true)
    private ContratoAluguel aluguel;
    @ManyToOne(optional = false) @JoinColumn(name = "banco_id", nullable = false)
    private Banco banco;
    @Column(nullable = false, unique = true, length = 60)
    private String numero;
    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal valor;
    @Column(nullable = false)
    private LocalDate dataConcessao;
    @Column(nullable = false)
    private LocalDateTime concedidoEm;
    @Column(nullable = false, precision = 16, scale = 2)
    private BigDecimal rendaConsiderada;
    public ContratoCredito() {}
    public void setAluguel(ContratoAluguel aluguel) {
        this.aluguel = aluguel;
    }
    public Banco getBanco() {
        return banco;
    }
    public void setBanco(Banco banco) {
        this.banco = banco;
    }
    public String getNumero() {
        return numero;
    }
    public void setNumero(String numero) {
        this.numero = numero;
    }
    public BigDecimal getValor() {
        return valor;
    }
    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }
    public void setDataConcessao(LocalDate dataConcessao) {
        this.dataConcessao = dataConcessao;
    }
    public LocalDateTime getConcedidoEm() {
        return concedidoEm;
    }
    public void setConcedidoEm(LocalDateTime concedidoEm) {
        this.concedidoEm = concedidoEm;
    }
    public BigDecimal getRendaConsiderada() {
        return rendaConsiderada;
    }
    public void setRendaConsiderada(BigDecimal rendaConsiderada) {
        this.rendaConsiderada = rendaConsiderada;
    }
}
