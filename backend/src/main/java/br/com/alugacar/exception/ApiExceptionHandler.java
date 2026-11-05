package br.com.alugacar.exception;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.http.ResponseEntity;
import jakarta.persistence.LockTimeoutException;
import jakarta.persistence.PessimisticLockException;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import java.util.Map;

@RestControllerAdvice
public class ApiExceptionHandler {
    @ExceptionHandler(ApiException.class)
    ResponseEntity<?> handle(ApiException error) { return ResponseEntity.status(error.getStatus()).body(Map.of("message", error.getMessage())); }
    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<?> validation(MethodArgumentNotValidException error) {
        var fields = error.getBindingResult().getFieldErrors().stream().map(e -> e.getField() + ": " + e.getDefaultMessage()).toList();
        return ResponseEntity.badRequest().body(Map.of("message", "Confira os campos informados.", "fields", fields));
    }
    @ExceptionHandler(EstadoInvalidoException.class)
    ResponseEntity<?> estadoInvalido(EstadoInvalidoException erro) {
        return handle(ApiException.conflict(erro.getMessage()));
    }

    @ExceptionHandler({PessimisticLockException.class, LockTimeoutException.class})
    ResponseEntity<?> pedidoEmAtualizacao() {
        return handle(ApiException.conflict("Este pedido está sendo atualizado. Tente novamente."));
    }

    @ExceptionHandler(ConstraintViolationException.class)
    ResponseEntity<?> restricaoDoBanco() {
        return handle(ApiException.conflict("Já existe um cadastro com esses dados ou o registro possui vínculos que impedem esta operação."));
    }
    @ExceptionHandler({HttpMessageNotReadableException.class, MethodArgumentTypeMismatchException.class})
    ResponseEntity<?> malformed(Exception error) { return ResponseEntity.badRequest().body(Map.of("message", "Dados ou identificador inválidos.")); }
}
