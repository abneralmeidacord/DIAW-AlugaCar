package br.com.alugacar;

import br.com.alugacar.entity.Automovel;
import br.com.alugacar.entity.AvaliacaoFinanceira;
import br.com.alugacar.entity.Banco;
import br.com.alugacar.entity.Cliente;
import br.com.alugacar.entity.ContratoAluguel;
import br.com.alugacar.entity.ContratoCredito;
import br.com.alugacar.entity.Empresa;
import br.com.alugacar.entity.PedidoAluguel;
import br.com.alugacar.entity.Usuario;
import br.com.alugacar.entity.VinculoEmpregaticio;
import br.com.alugacar.model.PedidoView;
import br.com.alugacar.exception.EstadoInvalidoException;
import org.junit.jupiter.api.Test;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class ModeloTest {
    @Test
    void rendaEASomaDosVinculos() {
        var client = new Cliente();
        assertThat(client.getRendaDeclarada()).isEqualByComparingTo("0");
        for (String value : new String[] { "123.45", "200.10", "500.00" }) {
            var job = new VinculoEmpregaticio();
            job.setRendimento(new BigDecimal(value));
            client.getVinculos().add(job);
        }
        assertThat(client.getRendaDeclarada()).isEqualByComparingTo("823.55");
    }

    @Test
    void aceiteEAtivacaoSaoSeparadosEAtivacaoEIdempotente() {
        var order = new PedidoAluguel();
        order.setStatus("AGUARDANDO_ACEITE");
        var contract = new ContratoAluguel();
        contract.setPedido(order);
        order.setContrato(contract);
        var now = LocalDateTime.of(2026, 11, 4, 12, 0);
        assertThatThrownBy(() -> contract.iniciarAluguel(now)).isInstanceOf(EstadoInvalidoException.class);
        contract.aceitar(now);
        assertThat(order.getStatus()).isEqualTo("APROVADO");
        assertThat(contract.getStatus()).isEqualTo("ACEITO");
        assertThat(contract.getAceitoEm()).isEqualTo(now);
        contract.iniciarAluguel(now.plusMinutes(1));
        contract.iniciarAluguel(now.plusMinutes(2));
        assertThat(order.getStatus()).isEqualTo("ALUGADO");
        assertThat(contract.getStatus()).isEqualTo("VIGENTE");
        assertThat(contract.getIniciadoEm()).isEqualTo(now.plusMinutes(1));
        assertThatThrownBy(() -> contract.aceitar(now)).isInstanceOf(EstadoInvalidoException.class);
    }

    @Test
    void pedidoAvaliadoNaoPodeSerAlteradoOuCancelado() {
        var order = new PedidoAluguel();
        var start = LocalDate.of(2026, 12, 1);
        var end = start.plusDays(2);
        order.alterarPedido(start, end);
        assertThat(order.getDataFim()).isEqualTo(end);
        order.getAvaliacoes().add(new AvaliacaoFinanceira());
        assertThatThrownBy(() -> order.alterarPedido(start, end.plusDays(1)))
                .isInstanceOf(EstadoInvalidoException.class);
        assertThatThrownBy(order::cancelar).isInstanceOf(EstadoInvalidoException.class);
        var canceled = new PedidoAluguel();
        canceled.cancelar();
        assertThat(canceled.getStatus()).isEqualTo("CANCELADO");
    }

    @Test
    void respostaNaoEntregaRendaConsideradaAEmpresaOuBancoAlheio() throws Exception {
        var client = identify(new Cliente());
        var company = identify(new Empresa());
        var bank = identify(new Banco());
        var other = identify(new Banco());
        var order = new PedidoAluguel();
        var field = PedidoAluguel.class.getDeclaredField("id");
        field.setAccessible(true);
        field.set(order, UUID.randomUUID());
        order.setCliente(client);
        order.setDestinatario(company);
        order.setAutomovel(new Automovel());
        order.setCreditoSolicitado(true);
        order.setBancoCredito(bank);
        order.setCriadoEm(LocalDateTime.now());
        var contract = new ContratoAluguel();
        contract.setAgente(company);
        order.setContrato(contract);
        var credit = new ContratoCredito();
        credit.setBanco(bank);
        credit.setRendaConsiderada(new BigDecimal("6500"));
        contract.setCredito(credit);
        assertThat(PedidoView.de(order, company).credit().incomeConsidered()).isNull();
        assertThat(PedidoView.de(order, other).credit().incomeConsidered()).isNull();
        assertThat(PedidoView.de(order, bank).credit().incomeConsidered()).isEqualByComparingTo("6500");
        assertThat(PedidoView.de(order, client).credit().incomeConsidered()).isEqualByComparingTo("6500");
    }

    private <T extends Usuario> T identify(T user) throws Exception {
        var field = Usuario.class.getDeclaredField("id");
        field.setAccessible(true);
        field.set(user, UUID.randomUUID());
        return user;
    }
}
