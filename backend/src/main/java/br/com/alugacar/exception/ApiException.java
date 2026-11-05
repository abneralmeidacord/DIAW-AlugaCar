package br.com.alugacar.exception;
import org.springframework.http.HttpStatus;
public class ApiException extends RuntimeException {
    private final HttpStatus status;
    public ApiException(HttpStatus status, String message) {
        super(message);
        this.status = status;
    }
    public HttpStatus getStatus() {
        return status;
    }
    public static ApiException forbidden() {
        return new ApiException(HttpStatus.FORBIDDEN, "Você não tem acesso a este atendimento.");
    }
    public static ApiException notFound(String item) {
        return new ApiException(HttpStatus.NOT_FOUND, item + " não encontrado.");
    }
    public static ApiException conflict(String message) {
        return new ApiException(HttpStatus.CONFLICT, message);
    }
    public static ApiException invalid(String message) {
        return new ApiException(HttpStatus.BAD_REQUEST, message);
    }
}
