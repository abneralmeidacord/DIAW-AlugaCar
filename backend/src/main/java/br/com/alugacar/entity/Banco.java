package br.com.alugacar.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "bancos")
public class Banco extends Agente {
    public Banco() {}
    @Override public String getPerfil() { return "banco"; }
}
