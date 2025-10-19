package com.saif.portfolio.util;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;

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
    return generateToken(userDetails, accessExpiration, tokenVersion);
}

public String generateRefreshToken(UserDetails userDetails, String tokenVersion) {
    return generateToken(userDetails, refreshExpiration, tokenVersion);
}


    private String generateToken(UserDetails userDetails, long expiration, String tokenVersion) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", userDetails.getAuthorities());
        claims.put("version", tokenVersion);
        claims.put("rand", UUID.randomUUID().toString());
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret)), SignatureAlgorithm.HS512)
                .compact();
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret)))
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public void validateToken(String token, UserDetails userDetails, String tokenVersion) {
    final String username = extractUsername(token);
    final String jwtVersion = extractClaim(token, claims -> (String) claims.get("version"));
    if (!username.equals(userDetails.getUsername())) {
        throw new JwtException("USERNAME_MISMATCH");
    }

    if (!jwtVersion.equals(tokenVersion)) {
        throw new JwtException("TOKEN_VERSION_MISMATCH"); // ✅ separate handling
    }

    if (isTokenExpired(token)) {
        throw new io.jsonwebtoken.ExpiredJwtException(null, null, "TOKEN_EXPIRED");
    }
    }


    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public long getRefreshExpiration() {
        return refreshExpiration;
    }
}