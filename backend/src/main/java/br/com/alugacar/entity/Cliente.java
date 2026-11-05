package br.com.alugacar.entity;

import jakarta.persistence.*;
import java.util.*;
import java.math.BigDecimal;
import java.time.*;

@Entity
@Table(name = "clientes")
public class Cliente extends Usuario {
    @Column(nullable = false, length = 20)
    private String cpf;
    @Column(nullable = false, length = 150)
    private String nome;
    @Column(nullable = false, length = 300)
    private String endereco;
    @Column(nullable = false, length = 100)
    private String profissao;
    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("posicao asc")
    private List<VinculoEmpregaticio> vinculos = new ArrayList<>();
    public Cliente() {}
    public String getCpf() {
        return cpf;
    }
    public void setCpf(String cpf) {
        this.cpf = cpf;
    }
    public String getNome() {
        return nome;
    }
    public void setNome(String nome) {
        this.nome = nome;
    }
    public String getEndereco() {
        return endereco;
    }
    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }
    public String getProfissao() {
        return profissao;
    }
    public void setProfissao(String profissao) {
        this.profissao = profissao;
    }
    public List<VinculoEmpregaticio> getVinculos() {
        return vinculos;
    }
    public void setVinculos(List<VinculoEmpregaticio> vinculos) {
        this.vinculos = vinculos;
    }
    @Override public String getPerfil() { return "cliente"; }
    @Override public String getNomeExibicao() { return nome; }
    @Transient public BigDecimal getRendaDeclarada() {
        return vinculos.stream().map(VinculoEmpregaticio::getRendimento).reduce(BigDecimal.ZERO, BigDecimal::add);
    }

}
