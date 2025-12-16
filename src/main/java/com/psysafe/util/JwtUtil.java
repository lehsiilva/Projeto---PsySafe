package com.psysafe.util;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import java.util.Date;

public class JwtUtil {

    private static final String SECRET = "minhaChaveSuperSecreta"; // guarde em variável de ambiente
    private static final long EXPIRATION_MS = 1000 * 60 * 60 * 2; // 2h

    public static String generateToken(String userId, String role, String name, String email, Integer idEmpresa) {
        return JWT.create()
                .withSubject(userId)
                .withClaim("role", role)
                .withClaim("name", name)
                .withClaim("email", email)
                .withClaim("idEmpresa", idEmpresa)
                .withExpiresAt(new Date(System.currentTimeMillis() + EXPIRATION_MS))
                .sign(Algorithm.HMAC256(SECRET));
    }

    public static DecodedJWT verifyToken(String token) throws Exception {
        return JWT.require(Algorithm.HMAC256(SECRET))
                  .build()
                  .verify(token);
    }

    public static String getUserId(String token) throws Exception {
        return verifyToken(token).getSubject();
    }

    public static String getUserRole(String token) throws Exception {
        return verifyToken(token).getClaim("role").asString();
    }

    public static String getUserName(String token) throws Exception {
        return verifyToken(token).getClaim("name").asString();
    }

    public static String getUserEmail(String token) throws Exception {
        return verifyToken(token).getClaim("email").asString();
    }
    
    public static Integer getUserEmpresaId(String token) throws Exception {
        return verifyToken(token).getClaim("idEmpresa").asInt();
    }

}
