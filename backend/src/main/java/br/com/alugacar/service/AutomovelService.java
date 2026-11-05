package br.com.alugacar.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.alugacar.entity.Agente;
import br.com.alugacar.entity.Automovel;
import br.com.alugacar.entity.Usuario;
import br.com.alugacar.exception.ApiException;
import br.com.alugacar.model.AutomovelRequest;
import br.com.alugacar.model.AutomovelView;
import jakarta.persistence.EntityManager;

@Service
@Transactional
public class AutomovelService {
    private final EntityManager bancoDeDados;
    private final UsuarioService usuarios;

    public AutomovelService(EntityManager bancoDeDados, UsuarioService usuarios) {
        this.bancoDeDados = bancoDeDados;
        this.usuarios = usuarios;
    }

    public List<AutomovelView> pesquisar(String marca, String categoria, String busca) {
        String termo = busca == null ? "" : busca.toLowerCase(Locale.ROOT);
        List<AutomovelView> resultado = new ArrayList<>();
        List<Automovel> carros = bancoDeDados.createQuery(
                "select a from Automovel a order by a.marca, a.modelo", Automovel.class)
                .getResultList();
        for (Automovel carro : carros) {
            if ("cliente".equals(carro.getProprietario().getPerfil()))
                continue;
            if (marca != null && !marca.isBlank() && !carro.getMarca().equalsIgnoreCase(marca))
                continue;
            if (categoria != null && !categoria.isBlank() && !carro.getCategoria().equalsIgnoreCase(categoria))
                continue;

            String descricao = carro.getMarca() + " " + carro.getModelo() + " " + carro.getCategoria();
            if (descricao.toLowerCase(Locale.ROOT).contains(termo)) {
                resultado.add(new AutomovelView(carro));
            }
        }
        return resultado;
    }

    public AutomovelView cadastrar(AutomovelRequest dados) {
        Usuario proprietario = usuarios.atual();
        if (!(proprietario instanceof Agente)) {
            throw ApiException.forbidden();
        }
        Automovel carro = dados.novoCarro(proprietario);
        bancoDeDados.persist(carro);
        bancoDeDados.flush();
        return new AutomovelView(carro);
    }
}
