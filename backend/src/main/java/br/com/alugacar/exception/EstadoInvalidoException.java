package br.com.alugacar.exception;

public class EstadoInvalidoException extends RuntimeException {
    public EstadoInvalidoException(String mensagem) {
        super(mensagem);
    }
}
