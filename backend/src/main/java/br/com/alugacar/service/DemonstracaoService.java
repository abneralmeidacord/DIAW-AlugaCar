package br.com.alugacar.service;

import java.math.BigDecimal;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.alugacar.entity.Banco;
import br.com.alugacar.entity.Cliente;
import br.com.alugacar.entity.Empresa;
import br.com.alugacar.entity.Usuario;
import br.com.alugacar.entity.VinculoEmpregaticio;
import br.com.alugacar.model.AutomovelRequest;
import br.com.alugacar.entity.Automovel;
import jakarta.persistence.EntityManager;

@Service
@ConditionalOnProperty(name = "app.seed-demo", havingValue = "true")
public class DemonstracaoService implements CommandLineRunner {
    private final EntityManager bancoDeDados;
    private final UsuarioService usuarios;
    private final PasswordEncoder encoder;

    public DemonstracaoService(EntityManager bancoDeDados, UsuarioService usuarios, PasswordEncoder encoder) {
        this.bancoDeDados = bancoDeDados;
        this.usuarios = usuarios;
        this.encoder = encoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        Usuario company = usuarios.buscarPorLogin("empresa@alugacar.demo");
        if (company == null) {
            var u = new Empresa();
            u.setLogin("empresa@alugacar.demo");
            u.setSenhaHash(encoder.encode("demo123"));
            u.setRazaoSocial("Aurora Mobilidade");
            u.setCnpj("00.000.000/0000-01");
            bancoDeDados.persist(u);
            company = u;
        }
        if (usuarios.buscarPorLogin("banco@alugacar.demo") == null) {
            var u = new Banco();
            u.setLogin("banco@alugacar.demo");
            u.setSenhaHash(encoder.encode("demo123"));
            u.setRazaoSocial("Banco Horizonte");
            u.setCnpj("00.000.000/0000-02");
            bancoDeDados.persist(u);
        }
        if (usuarios.buscarPorLogin("cliente@alugacar.demo") == null) {
            var u = new Cliente();
            u.setLogin("cliente@alugacar.demo");
            u.setSenhaHash(encoder.encode("demo123"));
            u.setNome("Abner Almeida");
            u.setCpf("000.000.000-00");
            u.setEndereco("Belo Horizonte, MG");
            u.setProfissao("Estudante");
            var job = new VinculoEmpregaticio();
            job.setCliente(u);
            job.setEntidadeEmpregadora("Empresa de demonstração");
            job.setRendimento(new BigDecimal("6500.00"));
            job.setPosicao(0);
            u.getVinculos().add(job);
            bancoDeDados.persist(u);
        }
        cadastrarCarro(company, new AutomovelRequest(
                "porsche", "AC-001", 2024, "Porsche", "911 Carrera", "DEMO-01", "Premium",
                new BigDecimal("890.00"), "Gasolina", "Prata",
                "https://www.enterprise.co.uk/en/exotic-car-hire/vehicles/sports-car-convertible/porsche-911-carrera-s-coupe/_jcr_content/root/teaser_image.coreimg.png/1648144257625/porsche-911-carrera-s-coupe-hero-thumbnail-2048x1360.png",
                "Uma experiência à parte", Automovel.LOCALIDADE_PADRAO));
        cadastrarCarro(company, new AutomovelRequest(
                "mercedes", "AC-002", 2024, "Mercedes-Benz", "C 200", "DEMO-02", "Sedan",
                new BigDecimal("429.00"), "Híbrido", "Prata",
                "https://fa-coreapi-pro.azurewebsites.net/api/Storage/trim/download/mercedes_c200_68ede658aeab85001dfc8023.png",
                "Conforto em cada detalhe", "Betim, MG"));
        cadastrarCarro(company, new AutomovelRequest(
                "volvo", "AC-003", 2024, "Volvo", "XC60", "DEMO-03", "SUV",
                new BigDecimal("549.00"), "Híbrido", "Branco",
                "https://ik.imagekit.io/hertzch/minilease/media/volvo_xc60_1.png?tr=w-1000%2Car-810-466%2Cfo-center",
                "Espaço para novos planos", "Contagem, MG"));
        cadastrarCarro(company, new AutomovelRequest(
                "bmw", "AC-004", 2023, "BMW", "320i", "DEMO-04", "Sedan",
                new BigDecimal("389.00"), "Gasolina", "Laranja",
                "https://cdn.imgbin.com/12/2/5/imgbin-2018-bmw-320i-xdrive-car-luxury-vehicle-sedan-temperature-zones-sc-zi8vGPnCPfHDqwjcPV37GWXzr.jpg",
                "O prazer de dirigir", Automovel.LOCALIDADE_PADRAO));
        cadastrarCarro(company, new AutomovelRequest(
                "volvo2", "AC-005", 2025, "Volvo", "XC60 Plus", "DEMO-05", "SUV",
                new BigDecimal("599.00"), "Híbrido", "Branco",
                "https://ik.imagekit.io/hertzch/minilease/media/volvo_xc60_1.png?tr=w-1000%2Car-810-466%2Cfo-center",
                "Para ir um pouco além", "Contagem, MG"));
        cadastrarCarro(company, new AutomovelRequest(
                "mercedes2", "AC-006", 2025, "Mercedes-Benz", "C 200 Exclusive", "DEMO-06", "Premium",
                new BigDecimal("489.00"), "Híbrido", "Prata",
                "https://fa-coreapi-pro.azurewebsites.net/api/Storage/trim/download/mercedes_c200_68ede658aeab85001dfc8023.png",
                "Sua viagem merece", "Betim, MG"));
    }

    private void cadastrarCarro(Usuario empresa, AutomovelRequest dados) {
        Automovel existente = bancoDeDados.createQuery(
                "select a from Automovel a where a.codigo = :codigo", Automovel.class)
                .setParameter("codigo", dados.code())
                .getSingleResultOrNull();
        if (existente == null) {
            bancoDeDados.persist(dados.novoCarro(empresa));
        } else if (existente.getLocalidade() == null && existente.getProprietario().getId().equals(empresa.getId())) {
            existente.setLocalidade(dados.location());
        }
    }
}
