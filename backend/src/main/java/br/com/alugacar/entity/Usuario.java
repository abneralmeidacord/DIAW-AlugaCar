package br.com.alugacar.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.Table;
import java.util.UUID;

@Entity
@Table(name = "usuarios")
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class Usuario {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    public UUID getId() {
        return id;
    }
    @Column(nullable = false, unique = true, length = 254)
    private String login;
    @Column(nullable = false, length = 100)
    private String senhaHash;
    public Usuario() {}
    public String getLogin() {
        return login;
    }
    public void setLogin(String login) {
        this.login = login;
    }
    public String getSenhaHash() {
        return senhaHash;
    }
    public void setSenhaHash(String senhaHash) {
        this.senhaHash = senhaHash;
    }
    public abstract String getPerfil();
    public abstract String getNomeExibicao();

}
