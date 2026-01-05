package com.quitq.ecommerce.config;

import com.quitq.ecommerce.service.CustomUserDetailsService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.quitq.ecommerce.security.TokenBlacklist;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Value("${jwt.secret}")
    private String secret;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String header = request.getHeader("Authorization");
        String requestURI = request.getRequestURI();

        System.out.println("Processing request: " + requestURI + ", Header: " + header); // Debug


        if (requestURI.equals("/api/auth/logout")) {
            chain.doFilter(request, response);
            return;
        }

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            System.out.println("Token extracted: " + token); // Debug
            if (TokenBlacklist.isBlacklisted(token)) {
                SecurityContextHolder.clearContext();
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token has been invalidated");
                return;
            }

            try {
                Claims claims = Jwts.parser().setSigningKey(secret).parseClaimsJws(token).getBody();
                String username = claims.getSubject();
                String roleFromToken = claims.get("role", String.class);

                System.out.println("Parsed token - Username: " + username + ", Role: " + roleFromToken); // Debug

                UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);
                if (userDetails != null) {
                    java.util.Collection<? extends GrantedAuthority> authorities = userDetails.getAuthorities();
                    System.out.println("Existing authorities from UserDetails: " + authorities);
                    String roleAuthority = "ROLE_" + (roleFromToken != null ? roleFromToken.toUpperCase() : userDetails.getAuthorities().iterator().next().getAuthority().replace("ROLE_", ""));
                    System.out.println("Constructed roleAuthority: " + roleAuthority);
                    if (!authorities.stream().anyMatch(a -> a.getAuthority().equals(roleAuthority))) {
                        authorities = new java.util.ArrayList<>(authorities);
                        ((java.util.List) authorities).add(new SimpleGrantedAuthority(roleAuthority));
                        System.out.println("Added new authority: " + roleAuthority);
                    }
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            userDetails, null, authorities);
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    System.out.println("Set authentication for user: " + username + " with authorities: " + authorities);
                }
            } catch (Exception e) {
                System.out.println("Invalid JWT token: " + e.getMessage()); // Debug
            }
        } else {
            System.out.println("No Authorization header or not a Bearer token"); // Debug
        }

        chain.doFilter(request, response);
    }
}
