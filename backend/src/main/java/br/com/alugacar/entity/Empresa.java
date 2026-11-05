package br.com.alugacar.entity;

import jakarta.persistence.*;
import java.util.*;
import java.math.BigDecimal;
import java.time.*;

@Entity
@Table(name = "empresas")
public class Empresa extends Agente {
    public Empresa() {}
    @Override public String getPerfil() { return "empresa"; }
}
