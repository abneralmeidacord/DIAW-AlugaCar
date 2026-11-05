package br.com.alugacar.entity;

import java.math.BigDecimal;
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
@Table(name = "automoveis")
public class Automovel {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    public UUID getId() {
        return id;
    }

    @Column(nullable = false, unique = true, length = 50)
    private String codigo;
    @Column(nullable = false, unique = true, length = 50)
    private String matricula;
    @Column(nullable = false)
    private Integer ano;
    @Column(nullable = false, length = 50)
    private String marca;
    @Column(nullable = false, length = 100)
    private String modelo;
    @Column(nullable = false, unique = true, length = 20)
    private String placa;
    @Column(nullable = false, length = 50)
    private String categoria;
    @ManyToOne(optional = false)
    @JoinColumn(name = "proprietario_id", nullable = false)
    private Usuario proprietario;
    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal diaria;
    @Column(nullable = false, length = 50)
    private String combustivel = "Gasolina";
    @Column(length = 50)
    private String cor;
    @Column(length = 2000)
    private String foto;
    @Column(length = 150)
    private String destaque;

    public Automovel() {
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getMatricula() {
        return matricula;
    }

    public void setMatricula(String matricula) {
        this.matricula = matricula;
    }

    public Integer getAno() {
        return ano;
    }

    public void setAno(Integer ano) {
        this.ano = ano;
    }

    public String getMarca() {
        return marca;
    }

    public void setMarca(String marca) {
        this.marca = marca;
    }

    public String getModelo() {
        return modelo;
    }

    public void setModelo(String modelo) {
        this.modelo = modelo;
    }

    public String getPlaca() {
        return placa;
    }

    public void setPlaca(String placa) {
        this.placa = placa;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public Usuario getProprietario() {
        return proprietario;
    }

    public void setProprietario(Usuario proprietario) {
        this.proprietario = proprietario;
    }

    public BigDecimal getDiaria() {
        return diaria;
    }

    public void setDiaria(BigDecimal diaria) {
        this.diaria = diaria;
    }

    public String getCombustivel() {
        return combustivel;
    }

    public void setCombustivel(String combustivel) {
        this.combustivel = combustivel;
    }

    public String getCor() {
        return cor;
    }

    public void setCor(String cor) {
        this.cor = cor;
    }

    public String getFoto() {
        return foto;
    }

    public void setFoto(String foto) {
        this.foto = foto;
    }

    public String getDestaque() {
        return destaque;
    }

    public void setDestaque(String destaque) {
        this.destaque = destaque;
    }
}
