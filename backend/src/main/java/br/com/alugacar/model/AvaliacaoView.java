package br.com.alugacar.model;

import java.util.UUID;

public record AvaliacaoView(
        String result,
        String note,
        UUID by,
        String at) {
}
