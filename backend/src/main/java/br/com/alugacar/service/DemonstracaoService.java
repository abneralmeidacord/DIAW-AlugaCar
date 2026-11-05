package br.com.alugacar.service;

import java.math.BigDecimal;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.alugacar.entity.Agente;
import br.com.alugacar.entity.Automovel;
import br.com.alugacar.entity.Banco;
import br.com.alugacar.entity.Cliente;
import br.com.alugacar.entity.Empresa;
import br.com.alugacar.entity.Usuario;
import br.com.alugacar.entity.VinculoEmpregaticio;
import br.com.alugacar.model.AutomovelRequest;
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
        Agente aurora = cadastrarAgente(new Empresa(), "empresa@alugacar.demo",
                "Aurora Mobilidade", "00.000.000/0000-01");
        Agente rotaMinas = cadastrarAgente(new Empresa(), "rotaminas@alugacar.demo",
                "Rota Minas Rent", "00.000.000/0000-03");
        Agente viaVerde = cadastrarAgente(new Empresa(), "viaverde@alugacar.demo",
                "Via Verde Locações", "00.000.000/0000-04");
        cadastrarAgente(new Banco(), "banco@alugacar.demo", "Banco Horizonte", "00.000.000/0000-02");
        cadastrarAgente(new Banco(), "banco.serra@alugacar.demo", "Banco Serra", "00.000.000/0000-05");
        cadastrarAgente(new Banco(), "banco.veredas@alugacar.demo", "Banco Veredas", "00.000.000/0000-06");
        cadastrarCliente();

        cadastrarCarro(aurora, new AutomovelRequest(
                "porsche", "AC-001", 2024, "Porsche", "911 Carrera", "DEMO-01", "Premium",
                BigDecimal.valueOf(890), "Gasolina", "Prata",
                "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/95/2024_Porsche_911_992_Carrera.jpg/960px-2024_Porsche_911_992_Carrera.jpg",
                "Uma experiência à parte", Automovel.LOCALIDADE_PADRAO));
        cadastrarCarro(aurora, new AutomovelRequest(
                "mercedes", "AC-002", 2024, "Mercedes-Benz", "C 200", "DEMO-02", "Sedan",
                BigDecimal.valueOf(429), "Híbrido", "Prata",
                "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f0/Mercedes-Benz_C_200_AVANTGARDE_%28W206%29_front.jpg/960px-Mercedes-Benz_C_200_AVANTGARDE_%28W206%29_front.jpg",
                "Conforto em cada detalhe", "Betim, MG"));
        cadastrarCarro(aurora, new AutomovelRequest(
                "volvo", "AC-003", 2024, "Volvo", "XC60", "DEMO-03", "SUV",
                BigDecimal.valueOf(549), "Híbrido", "Branco",
                "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9c/2023_Volvo_XC60_T8_R-Line_front.jpg/960px-2023_Volvo_XC60_T8_R-Line_front.jpg",
                "Espaço para novos planos", "Contagem, MG"));
        cadastrarCarro(aurora, new AutomovelRequest(
                "bmw", "AC-004", 2023, "BMW", "320i", "DEMO-04", "Sedan",
                BigDecimal.valueOf(389), "Gasolina", "Laranja",
                "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ab/BMW_320i_%28G20%2C_2023%29_%2854524564626%29.jpg/960px-BMW_320i_%28G20%2C_2023%29_%2854524564626%29.jpg",
                "O prazer de dirigir", Automovel.LOCALIDADE_PADRAO));
        cadastrarCarro(aurora, new AutomovelRequest(
                "volvo2", "AC-005", 2025, "Volvo", "XC60 Plus", "DEMO-05", "SUV",
                BigDecimal.valueOf(599), "Híbrido", "Branco",
                "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/59/Volvo_XC60_B5_AWD_Pine_Grey_Metallic_CN-spec_diplomatic_front_right.jpg/960px-Volvo_XC60_B5_AWD_Pine_Grey_Metallic_CN-spec_diplomatic_front_right.jpg",
                "Para ir um pouco além", "Contagem, MG"));
        cadastrarCarro(aurora, new AutomovelRequest(
                "mercedes2", "AC-006", 2025, "Mercedes-Benz", "C 200 Exclusive", "DEMO-06", "Premium",
                BigDecimal.valueOf(489), "Híbrido", "Prata",
                "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b2/Mercedes-Benz_C200_AVANTGARDE_%28W206%29_front.jpg/960px-Mercedes-Benz_C200_AVANTGARDE_%28W206%29_front.jpg",
                "Sua viagem merece", "Betim, MG"));
        cadastrarCarro(rotaMinas, new AutomovelRequest(
                "demo-taycan", "AC-019", 2024, "Porsche", "Taycan", "DEMO-19", "Elétrico",
                BigDecimal.valueOf(799), "Elétrico", null,
                "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e2/Porsche_Taycan_%282024%29_%2854731488492%29.jpg/960px-Porsche_Taycan_%282024%29_%2854731488492%29.jpg",
                "Elétrico", Automovel.LOCALIDADE_PADRAO));
        cadastrarCarro(rotaMinas, new AutomovelRequest(
                "demo-macan-gts", "AC-020", 2023, "Porsche", "Macan GTS", "DEMO-20", "SUV",
                BigDecimal.valueOf(679), "Gasolina", null,
                "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e4/The_frontview_of_Porsche_Macan_GTS_%2895B%29.jpg/960px-The_frontview_of_Porsche_Macan_GTS_%2895B%29.jpg",
                "SUV", "Divinópolis, MG"));
        cadastrarCarro(rotaMinas, new AutomovelRequest(
                "demo-bmw-x3", "AC-021", 2023, "BMW", "X3 xDrive30i", "DEMO-21", "SUV",
                BigDecimal.valueOf(449), "Gasolina", null,
                "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bd/BMW_X3_xDrive30i_%28G01%2C_2023%29_%2853584158370%29.jpg/960px-BMW_X3_xDrive30i_%28G01%2C_2023%29_%2853584158370%29.jpg",
                "SUV", "Sete Lagoas, MG"));
        cadastrarCarro(rotaMinas, new AutomovelRequest(
                "demo-bmw-i4", "AC-022", 2024, "BMW", "i4 eDrive40", "DEMO-22", "Elétrico",
                BigDecimal.valueOf(529), "Elétrico", null,
                "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2a/BMW_i4_eDrive40_M_Sport_%28G26%29_front.jpg/960px-BMW_i4_eDrive40_M_Sport_%28G26%29_front.jpg",
                "Elétrico", "Betim, MG"));
        cadastrarCarro(rotaMinas, new AutomovelRequest(
                "demo-mercedes-glc", "AC-023", 2024, "Mercedes-Benz", "GLC 300 4MATIC", "DEMO-23", "SUV",
                BigDecimal.valueOf(525), "Híbrido", null,
                "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/12/2024_Mercedes-Benz_GLC_300_4MATIC_%28hire_car%29_front.jpg/960px-2024_Mercedes-Benz_GLC_300_4MATIC_%28hire_car%29_front.jpg",
                "SUV", "Divinópolis, MG"));
        cadastrarCarro(viaVerde, new AutomovelRequest(
                "demo-volvo-ex30", "AC-024", 2025, "Volvo", "EX30", "DEMO-24", "Elétrico",
                BigDecimal.valueOf(339), "Elétrico", null,
                "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0b/2025_Volvo_EX30%2C_front_left_4.11.25.jpg/960px-2025_Volvo_EX30%2C_front_left_4.11.25.jpg",
                "Elétrico", "Nova Lima, MG"));
        cadastrarCarro(viaVerde, new AutomovelRequest(
                "demo-mitsubishi-triton", "AC-025", 2024, "Mitsubishi", "L200 Triton", "DEMO-25", "Picape",
                BigDecimal.valueOf(369), "Diesel", null,
                "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e6/PIMS_2024_-_Mitsubishi_Triton_Athlete_4WD_%28front%29.jpg/330px-PIMS_2024_-_Mitsubishi_Triton_Athlete_4WD_%28front%29.jpg",
                "Picape", "Sete Lagoas, MG"));
        cadastrarCarro(viaVerde, new AutomovelRequest(
                "demo-mitsubishi-outlander", "AC-026", 2024, "Mitsubishi", "Outlander PHEV", "DEMO-26", "SUV",
                BigDecimal.valueOf(399), "Híbrido", null,
                "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3a/Mitsubishi_OUTLANDER_PHEV_P_Executive_Package_%285LA-GN0W-XDUHZ%29_front.jpg/960px-Mitsubishi_OUTLANDER_PHEV_P_Executive_Package_%285LA-GN0W-XDUHZ%29_front.jpg",
                "SUV", "Nova Lima, MG"));
        cadastrarCarro(viaVerde, new AutomovelRequest(
                "demo-mitsubishi-eclipse", "AC-027", 2022, "Mitsubishi", "Eclipse Cross", "DEMO-27", "SUV",
                BigDecimal.valueOf(289), "Gasolina", null,
                "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6f/2022_Mitsubishi_Eclipse_Cross_LE_S-AWC%2C_front_left%2C_09-10-2022.jpg/330px-2022_Mitsubishi_Eclipse_Cross_LE_S-AWC%2C_front_left%2C_09-10-2022.jpg",
                "SUV", Automovel.LOCALIDADE_PADRAO));
        cadastrarCarro(viaVerde, new AutomovelRequest(
                "demo-mitsubishi-mirage", "AC-028", 2024, "Mitsubishi", "Mirage", "DEMO-28", "Hatch",
                BigDecimal.valueOf(139), "Gasolina", "Vermelho",
                "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/23/2024_Mitsubishi_Mirage_1.2_GLX_in_Red_Metallic%2C_front_right%2C_07-04-2024.jpg/960px-2024_Mitsubishi_Mirage_1.2_GLX_in_Red_Metallic%2C_front_right%2C_07-04-2024.jpg",
                "Hatch", "Divinópolis, MG"));
    }

    private Agente cadastrarAgente(Agente novo, String login, String nome, String cnpj) {
        Usuario existente = usuarios.buscarPorLogin(login);
        if (existente instanceof Agente agente && novo.getPerfil().equals(agente.getPerfil())
                && cnpj.equals(agente.getCnpj())) {
            return agente;
        }
        if (existente != null) {
            return null;
        }

        novo.setLogin(login);
        novo.setSenhaHash(encoder.encode("demo123"));
        novo.setRazaoSocial(nome);
        novo.setCnpj(cnpj);
        bancoDeDados.persist(novo);
        return novo;
    }

    private void cadastrarCliente() {
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
    }

    private void cadastrarCarro(Agente empresa, AutomovelRequest dados) {
        if (empresa == null) {
            return;
        }

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
