package br.com.alugacar.entity;

import jakarta.persistence.*;
import java.util.*;
import java.math.BigDecimal;
import java.time.*;

@Entity
@Table(name = "bancos")
public class Banco extends Agente {
    public Banco() {}
    @Override public String getPerfil() { return "banco"; }
}
