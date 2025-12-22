package com.saif.portfolio.util;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.access-expiration}")
    private long accessExpiration;

    @Value("${jwt.refresh-expiration}")
    private long refreshExpiration;

    public String generateAccessToken(UserDetails userDetails, String tokenVersion) {
        return generateToken(userDetails.getUsername(), accessExpiration, tokenVersion);
    }

    public String generateRefreshToken(UserDetails userDetails, String tokenVersion) {
        return generateToken(userDetails.getUsername(), refreshExpiration, tokenVersion);
    }

    private String generateToken(String subject, long expiration, String tokenVersion) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("version", tokenVersion);
        claims.put("rand", UUID.randomUUID().toString()); // anti replay

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret)), SignatureAlgorithm.HS512)
                .compact();
    }

    public Claims parseClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret)))
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public void validateToken(String token, UserDetails userDetails, String tokenVersion) {
        Claims claims = parseClaims(token); // expiry auto-checked

        if (!claims.getSubject().equals(userDetails.getUsername())) {
            throw new JwtException("USERNAME_MISMATCH");
        }

        if (!tokenVersion.equals(claims.get("version", String.class))) {
            throw new JwtException("TOKEN_VERSION_MISMATCH");
        }
    }

    public long getRefreshExpiration() {
        return refreshExpiration;
    }

    public String extractUsernameSafely(String token) {
    return parseClaims(token).getSubject();
}

}
