package br.com.alugacar.entity;

import jakarta.persistence.*;
import java.util.*;
import java.math.BigDecimal;
import java.time.*;

@Entity
@Table(name = "agentes")
public abstract class Agente extends Usuario {
    @Column(nullable = false, length = 150)
    private String razaoSocial;
    @Column(nullable = false, length = 25)
    private String cnpj;
    public Agente() {}
    public String getRazaoSocial() {
        return razaoSocial;
    }
    public void setRazaoSocial(String razaoSocial) {
        this.razaoSocial = razaoSocial;
    }
    public String getCnpj() {
        return cnpj;
    }
    public void setCnpj(String cnpj) {
        this.cnpj = cnpj;
    }
    @Override public String getNomeExibicao() { return razaoSocial; }
}
