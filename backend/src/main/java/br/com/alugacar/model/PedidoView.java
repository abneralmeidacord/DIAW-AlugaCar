package br.com.alugacar.model;
import br.com.alugacar.entity.*;
import java.util.List;
import java.util.UUID;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
public record PedidoView(
    UUID id,
    String number,
    UUID userId,
    UUID carId,
    UUID org,
    String orgName,
    LocalDate start,
    LocalDate end,
    BigDecimal daily,
    String status,
    String createdAt,
    AvaliacaoView evaluation,
    ContratoView contract,
    CreditoView credit,
    List<EventoView> events
) {
    public static PedidoView de(PedidoAluguel pedido, Usuario usuario) {
        String numero = "ALG-" + pedido.getId().toString().substring(0, 8).toUpperCase();
        List<EventoView> eventos = pedido.getEventos().stream()
            .map(evento -> new EventoView(evento.getDescricao(), dataUtc(evento.getRegistradoEm())))
            .toList();

        return new PedidoView(pedido.getId(), numero, pedido.getCliente().getId(),
            pedido.getAutomovel().getId(), pedido.getDestinatario().getId(),
            pedido.getDestinatario().getNomeExibicao(), pedido.getDataInicio(), pedido.getDataFim(),
            pedido.getDiaria(), pedido.getStatus(), dataUtc(pedido.getCriadoEm()),
            avaliacao(pedido), contrato(pedido.getContrato()), credito(pedido, usuario), eventos);
    }

    private static AvaliacaoView avaliacao(PedidoAluguel pedido) {
        if (pedido.getAvaliacoes().isEmpty()) {
            return null;
        }
        AvaliacaoFinanceira avaliacao = pedido.getAvaliacoes().getLast();
        return new AvaliacaoView(avaliacao.getParecer(), avaliacao.getJustificativa(),
            avaliacao.getAgente().getId(), dataUtc(avaliacao.getAvaliadaEm()));
    }

    private static ContratoView contrato(ContratoAluguel contrato) {
        if (contrato == null) {
            return null;
        }
        return new ContratoView(contrato.getNumero(), contrato.getId(), contrato.getStatus(),
            dataUtc(contrato.getFormalizadoEm()), contrato.getAgente().getId(),
            dataUtc(contrato.getAceitoEm()), dataUtc(contrato.getIniciadoEm()), contrato.getTermos());
    }

    private static CreditoView credito(PedidoAluguel pedido, Usuario usuario) {
        if (!pedido.getCreditoSolicitado()) {
            return null;
        }
        Banco banco = pedido.getBancoCredito();
        ContratoAluguel contrato = pedido.getContrato();
        ContratoCredito credito = contrato == null ? null : contrato.getCredito();
        if (credito == null) {
            return new CreditoView(true, banco.getId(), banco.getNomeExibicao(),
                "PENDENTE", null, null, null, null);
        }
        boolean podeVerRenda = (usuario instanceof Cliente && usuario.getId().equals(pedido.getCliente().getId()))
            || (usuario instanceof Banco && usuario.getId().equals(banco.getId()));
        return new CreditoView(true, banco.getId(), banco.getNomeExibicao(), "CONCEDIDO",
            credito.getValor(), podeVerRenda ? credito.getRendaConsiderada() : null,
            dataUtc(credito.getConcedidoEm()), credito.getBanco().getId());
    }

    private static String dataUtc(LocalDateTime data) {
        return data == null ? null : data.atOffset(ZoneOffset.UTC).toString();
    }
}
