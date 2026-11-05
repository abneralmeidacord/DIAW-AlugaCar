package br.com.alugacar.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "empresas")
public class Empresa extends Agente {
    public Empresa() {}
    @Override public String getPerfil() { return "empresa"; }
}
