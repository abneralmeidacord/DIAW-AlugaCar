package br.com.alugacar;

import br.com.alugacar.entity.Automovel;
import br.com.alugacar.entity.Usuario;
import jakarta.persistence.EntityManager;
import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.ObjectMapper;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class FluxoApiTest {
    @Autowired
    MockMvc mvc;
    @Autowired
    ObjectMapper json;
    @Autowired
    EntityManager bancoDeDados;
    @Autowired
    PasswordEncoder encoder;

    record Browser(MockHttpSession session, String token) {
    }

    Browser csrf(MockHttpSession session) throws Exception {
        var request = get("/api/auth/csrf");
        if (session != null)
            request.session(session);
        var result = mvc.perform(request).andExpect(status().isOk()).andReturn();
        return new Browser((MockHttpSession) result.getRequest().getSession(), read(result, "token"));
    }

    Browser login(String email) throws Exception {
        var browser = csrf(null);
        var result = mvc
                .perform(post("/api/auth/login").session(browser.session()).header("X-CSRF-TOKEN", browser.token())
                        .param("login", email).param("senha", "demo123"))
                .andExpect(status().isNoContent()).andReturn();
        return csrf((MockHttpSession) result.getRequest().getSession());
    }

    ResultActions send(Browser browser, MockHttpServletRequestBuilder request, Object body) throws Exception {
        request.session(browser.session()).header("X-CSRF-TOKEN", browser.token());
        if (body != null)
            request.contentType("application/json").content(json.writeValueAsString(body));
        return mvc.perform(request);
    }

    String read(MvcResult result, String field) throws Exception {
        return JsonPath.read(result.getResponse().getContentAsString(), "$." + field);
    }

    Map<String, Object> client(String email) {
        return new HashMap<>(
                Map.of("role", "cliente", "name", "Cliente de teste", "email", email, "password", "demo123",
                        "cpf", "111.111.111-11", "address", "Rua de teste, 10", "profession", "Estudante", "jobs",
                        List.of(Map.of("employer", "Empresa", "income", 1200))));
    }

    void register(Map<String, Object> data) throws Exception {
        send(csrf(null), post("/api/auth/register"), data).andExpect(status().isCreated());
    }

    Usuario buscarUsuario(String login) {
        return bancoDeDados.createQuery("select u from Usuario u where u.login = :login", Usuario.class)
                .setParameter("login", login)
                .getSingleResultOrNull();
    }

    String order(Browser client, boolean credit) throws Exception {
        Automovel car = bancoDeDados
                .createQuery("select a from Automovel a where a.codigo = 'porsche'", Automovel.class)
                .getSingleResult();
        Map<String, Object> dados = new HashMap<>(Map.of(
                "carId", car.getId(), "start", LocalDate.now().plusDays(3).toString(),
                "end", LocalDate.now().plusDays(5).toString(), "credit", credit));
        if (credit) {
            dados.put("bankId", buscarUsuario("banco@alugacar.demo").getId());
        }
        var result = send(client, post("/api/pedidos"), dados)
                .andExpect(status().isCreated()).andExpect(jsonPath("$.status").value("PENDENTE")).andReturn();
        return read(result, "id");
    }

    void formalize(Browser company, String id) throws Exception {
        send(company, post("/api/pedidos/" + id + "/avaliar"),
                Map.of("result", "POSITIVO", "note", "Parecer favorável"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.status").value("PENDENTE"));
        send(company, post("/api/pedidos/" + id + "/formalizar"), Map.of("terms", "Condições de teste do contrato."))
                .andExpect(status().isOk()).andExpect(jsonPath("$.contract.status").value("AGUARDANDO_ACEITE"));
    }

    @Test
    void loginProtegeConsultasEExigeCsrf() throws Exception {
        mvc.perform(get("/api/automoveis")).andExpect(status().isUnauthorized());
        mvc.perform(post("/api/auth/register").contentType("application/json")
                .content(json.writeValueAsString(client("novo@teste.com"))))
                .andExpect(status().isForbidden());
        var browser = csrf(null);
        mvc.perform(post("/api/auth/login").session(browser.session()).header("X-CSRF-TOKEN", browser.token())
                .param("login", "cliente@alugacar.demo").param("senha", "errada"))
                .andExpect(status().isUnauthorized());
        var logged = login("CLIENTE@ALUGACAR.DEMO");
        send(logged, get("/api/perfil"), null).andExpect(status().isOk()).andExpect(jsonPath("$.role").value("cliente"))
                .andExpect(jsonPath("$.rg").doesNotHaveJsonPath())
                .andExpect(jsonPath("$.senhaHash").doesNotExist()).andExpect(jsonPath("$.password").doesNotExist());
        send(logged, post("/api/auth/logout"), null).andExpect(status().isNoContent());
        mvc.perform(get("/api/auth/me")).andExpect(status().isUnauthorized());
    }

    @Test
    void cadastroTemLoginUnicoHashEPerfisLivres() throws Exception {
        register(client("novo@teste.com"));
        var user = buscarUsuario("novo@teste.com");
        assertThat(user.getSenhaHash()).isNotEqualTo("demo123");
        assertThat(encoder.matches("demo123", user.getSenhaHash())).isTrue();
        send(csrf(null), post("/api/auth/register"), client("NOVO@teste.com")).andExpect(status().isConflict());
        for (String role : List.of("empresa", "banco")) {
            register(new HashMap<>(Map.of("role", role, "name", "Organização de teste", "email", role + "@teste.com",
                    "password", "demo123", "cnpj", "11.111.111/0001-11")));
            var browser = login(role + "@teste.com");
            send(browser, get("/api/auth/me"), null).andExpect(jsonPath("$.role").value(role));
        }
    }

    @Test
    void rendaAceitaAteTresVinculosEAtualizaCadastro() throws Exception {
        var browser = login("cliente@alugacar.demo");
        var data = client("cliente@alugacar.demo");
        data.put("jobs", List.of(Map.of("employer", "A", "income", 100), Map.of("employer", "B", "income", 200),
                Map.of("employer", "C", "income", 300)));
        send(browser, put("/api/perfil"), data).andExpect(status().isOk()).andExpect(jsonPath("$.income").value(600));
        data.put("jobs", List.of(Map.of("employer", "A", "income", 1), Map.of("employer", "B", "income", 2),
                Map.of("employer", "C", "income", 3), Map.of("employer", "D", "income", 4)));
        send(browser, put("/api/me"), data).andExpect(status().isBadRequest());
    }

    @Test
    void pedidosNaoVazamParaClienteOuOrganizacaoAlheios() throws Exception {
        var client = login("cliente@alugacar.demo");
        String id = order(client, false);
        register(client("outro@teste.com"));
        var other = login("outro@teste.com");
        send(other, get("/api/pedidos"), null).andExpect(jsonPath("$.length()").value(0));
        send(other, get("/api/pedidos/" + id), null).andExpect(status().isForbidden());
        send(other, post("/api/pedidos/" + id + "/aceitar"), null).andExpect(status().isForbidden());
        register(new HashMap<>(Map.of("role", "empresa", "name", "Outra empresa", "email", "outra@teste.com",
                "password", "demo123", "cnpj", "22.222.222/0001-22")));
        var company = login("outra@teste.com");
        send(company, get("/api/pedidos"), null).andExpect(jsonPath("$.length()").value(0));
        send(company, post("/api/pedidos/" + id + "/avaliacao"), Map.of("result", "POSITIVO", "note", "Não autorizado"))
                .andExpect(status().isForbidden());
        send(login("empresa@alugacar.demo"), get("/api/pedidos/" + id), null).andExpect(status().isOk());
    }

    @Test
    void fluxoSeparaParecerContratoAceiteEAluguelIdempotente() throws Exception {
        var client = login("cliente@alugacar.demo");
        var company = login("empresa@alugacar.demo");
        String id = order(client, false);
        send(client, post("/api/pedidos/" + id + "/alugar"), null).andExpect(status().isConflict());
        send(company, post("/api/pedidos/" + id + "/contrato"), Map.of("terms", "Ainda sem parecer"))
                .andExpect(status().isConflict());
        formalize(company, id);
        send(company, post("/api/pedidos/" + id + "/aceitar"), null).andExpect(status().isForbidden());
        send(client, post("/api/pedidos/" + id + "/aceitar"), null).andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("APROVADO"))
                .andExpect(jsonPath("$.contract.status").value("ACEITO"))
                .andExpect(jsonPath("$.contract.acceptedAt").isNotEmpty());
        send(client, post("/api/pedidos/" + id + "/alugar"), null).andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("ALUGADO"))
                .andExpect(jsonPath("$.contract.status").value("VIGENTE"));
        send(client, post("/api/pedidos/" + id + "/alugar"), null).andExpect(status().isOk());
        assertThat(bancoDeDados.createQuery("select count(c) from ContratoAluguel c", Long.class).getSingleResult())
                .isEqualTo(1);
        send(client, get("/api/pedidos/" + id), null).andExpect(jsonPath("$.events.length()").value(5));
        send(client, delete("/api/me"), null).andExpect(status().isConflict());
    }

    @Test
    void parecerNegativoImpedeContratoEAlteracoesNaoReiniciamAnalise() throws Exception {
        var client = login("cliente@alugacar.demo");
        var company = login("empresa@alugacar.demo");
        String id = order(client, false);
        send(company, post("/api/pedidos/" + id + "/avaliacao"), Map.of("result", "NEGATIVO", "note", "Não aprovado"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.status").value("REPROVADO"));
        send(company, post("/api/pedidos/" + id + "/contrato"), Map.of("terms", "Inválido"))
                .andExpect(status().isConflict());
        send(client, put("/api/pedidos/" + id),
                Map.of("start", LocalDate.now().plusDays(4).toString(), "end", LocalDate.now().plusDays(6).toString()))
                .andExpect(status().isConflict());
        send(client, post("/api/pedidos/" + id + "/cancelar"), null).andExpect(status().isConflict());
    }

    @Test
    void alteraECancelaSemApagarHistoricoEValidaPeriodo() throws Exception {
        var client = login("cliente@alugacar.demo");
        String id = order(client, false);
        send(client, put("/api/pedidos/" + id),
                Map.of("start", LocalDate.now().minusDays(1).toString(), "end", LocalDate.now().plusDays(1).toString()))
                .andExpect(status().isBadRequest());
        send(login("empresa@alugacar.demo"), put("/api/pedidos/" + id),
                Map.of("start", LocalDate.now().plusDays(4).toString(), "end", LocalDate.now().plusDays(6).toString()))
                .andExpect(status().isOk()).andExpect(jsonPath("$.status").value("PENDENTE"));
        send(client, post("/api/pedidos/" + id + "/cancelar"), null).andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CANCELADO"));
        send(client, get("/api/pedidos/" + id), null).andExpect(status().isOk());
        send(client, delete("/api/me"), null).andExpect(status().isConflict());
    }

    @Test
    void bancoSoConsultaRendaVinculadaECreditoGuardaRendaDoServidor() throws Exception {
        var client = login("cliente@alugacar.demo");
        var company = login("empresa@alugacar.demo");
        var bank = login("banco@alugacar.demo");
        String clientId = buscarUsuario("cliente@alugacar.demo").getId().toString();
        String privateOrder = order(client, false);
        send(bank, get("/api/pedidos/" + privateOrder), null).andExpect(status().isForbidden());
        send(bank, get("/api/clientes/" + clientId + "/renda"), null).andExpect(status().isForbidden());
        String id = order(client, true);
        var otherBank = login("banco.serra@alugacar.demo");
        send(otherBank, get("/api/pedidos/" + id), null).andExpect(status().isForbidden());
        send(company, get("/api/clientes"), null).andExpect(jsonPath("$[0].jobs.length()").value(0))
                .andExpect(jsonPath("$[0].cpf").isEmpty());
        send(bank, get("/api/clientes/" + clientId + "/renda"), null).andExpect(status().isOk())
                .andExpect(jsonPath("$.income").value(6500));
        send(bank, post("/api/pedidos/" + id + "/credito"), Map.of("amount", 1000)).andExpect(status().isConflict());
        formalize(company, id);
        send(bank, post("/api/pedidos/" + id + "/credito"), Map.of("amount", 0)).andExpect(status().isBadRequest());
        send(bank, post("/api/pedidos/" + id + "/credito"), Map.of("amount", 1000, "income", 999999))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.credit.incomeConsidered").value(6500))
                .andExpect(jsonPath("$.status").value("AGUARDANDO_ACEITE"));
        send(client, put("/api/me"), client("cliente@alugacar.demo")).andExpect(status().isOk())
                .andExpect(jsonPath("$.income").value(1200));
        send(company, get("/api/pedidos/" + id), null).andExpect(jsonPath("$.credit.incomeConsidered").isEmpty());
        send(bank, get("/api/pedidos/" + id), null).andExpect(jsonPath("$.credit.incomeConsidered").value(6500));
        send(bank, post("/api/pedidos/" + id + "/credito"), Map.of("amount", 1000)).andExpect(status().isConflict());
        assertThat(bancoDeDados.createQuery("select count(c) from ContratoCredito c", Long.class).getSingleResult())
                .isEqualTo(1);
    }

    @Test
    void pesquisaFiltraMarcaECategoria() throws Exception {
        var browser = login("cliente@alugacar.demo");
        send(browser, get("/api/carros").param("categoria", "Elétrico").param("localidade", "Nova Lima, MG"), null)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].orgName").value("Via Verde Locações"));
        send(browser, get("/api/automoveis").param("marca", "Volvo").param("categoria", "SUV"), null)
                .andExpect(status().isOk()).andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].brand").value("Volvo"));
        send(browser, get("/api/automoveis").param("marca", "Volvo").param("categoria", "Sedan"), null)
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    void pesquisaPorLocalidadeEGravaRetiradaNoPedido() throws Exception {
        mvc.perform(get("/api/carros/localidades")).andExpect(status().isOk())
                .andExpect(jsonPath("$[0]").value("Belo Horizonte, MG"))
                .andExpect(jsonPath("$[1]").value("Betim, MG"))
                .andExpect(jsonPath("$[2]").value("Contagem, MG"));

        var client = login("cliente@alugacar.demo");
        var resultado = send(client, get("/api/carros").param("localidade", "Contagem, MG"), null)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].location").value("Contagem, MG"))
                .andExpect(jsonPath("$[1].location").value("Contagem, MG"))
                .andReturn();
        String carId = JsonPath.read(resultado.getResponse().getContentAsString(), "$[0].id");
        var pedido = send(client, post("/api/pedidos"), Map.of(
                "carId", carId,
                "start", LocalDate.now().plusDays(3).toString(),
                "end", LocalDate.now().plusDays(5).toString(),
                "credit", false,
                "location", "Betim, MG"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.location").value("Contagem, MG"))
                .andReturn();

        Automovel car = bancoDeDados.find(Automovel.class, UUID.fromString(carId));
        car.setLocalidade("Betim, MG");
        bancoDeDados.flush();
        bancoDeDados.clear();
        send(client, get("/api/pedidos/" + read(pedido, "id")), null)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.location").value("Contagem, MG"));
    }

    @Test
    void cadastraCarroComApenasOsCamposDoCatalogo() throws Exception {
        var empresa = login("empresa@alugacar.demo");
        var dados = Map.ofEntries(
                Map.entry("code", "carro-teste"),
                Map.entry("matricula", "AC-TESTE"),
                Map.entry("year", 2025),
                Map.entry("brand", "Marca de Teste"),
                Map.entry("model", "Modelo de Teste"),
                Map.entry("plate", "ABC1D23"),
                Map.entry("category", "SUV"),
                Map.entry("price", 150),
                Map.entry("fuel", "Flex"),
                Map.entry("color", "Branco"),
                Map.entry("photo", "/images/car-fallback.svg"),
                Map.entry("tag", "Teste de catálogo"));

        send(empresa, post("/api/carros"), dados)
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.code").value("carro-teste"))
                .andExpect(jsonPath("$.fuel").value("Flex"))
                .andExpect(jsonPath("$.seats").doesNotHaveJsonPath())
                .andExpect(jsonPath("$.gear").doesNotHaveJsonPath())
                .andExpect(jsonPath("$.power").doesNotHaveJsonPath())
                .andExpect(jsonPath("$.tone").doesNotHaveJsonPath());

        send(empresa, get("/api/carros").param("marca", "Marca de Teste"), null)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].plate").value("ABC1D23"));

        send(empresa, post("/api/carros"), dados)
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").isString());
    }

    @Test
    void excluiSomenteClienteSemHistoricoEInvalidaSessao() throws Exception {
        register(client("apagar@teste.com"));
        var browser = login("apagar@teste.com");
        send(browser, delete("/api/perfil"), null).andExpect(status().isNoContent());
        assertThat(buscarUsuario("apagar@teste.com")).isNull();
        mvc.perform(get("/api/auth/me")).andExpect(status().isUnauthorized());
    }
}
