package com.resumeanalyzer.service;

import com.resumeanalyzer.dto.GeminiResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import tools.jackson.databind.ObjectMapper;

import java.util.Map;

@Service
public class GeminiService {

    private final WebClient webClient;

    @Value("${gemini.api.url}")
    private String apiUrl;

    @Value("${gemini.api.model}")
    private String model;

    private final String apiKey;

    private final ObjectMapper objectMapper;

    public GeminiService(ObjectMapper objectMapper) {
        this.webClient = WebClient.builder().build();
        this.apiKey = System.getenv("GEMINI_API_KEY");
        this.objectMapper = objectMapper;
        System.out.println("API KEY PRESENT: " + (apiKey != null));
        System.out.println("API KEY EMPTY: " + (apiKey == null || apiKey.isBlank()));
    }

    public String generateContent(String prompt) {

        try {

            Map<String, Object> requestBody = Map.of(
                    "contents", new Object[] {
                            Map.of(
                                    "parts", new Object[] {
                                            Map.of("text", prompt)
                                    }
                            )
                    }
            );

            GeminiResponse response = webClient
                    .post()
                    .uri(apiUrl + "/models/" + model.trim() + ":generateContent")
                    .header("x-goog-api-key", apiKey)
                    .header("Content-Type", "application/json")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(GeminiResponse.class)
                    .block();

            return response
                    .getCandidates()
                    .get(0)
                    .getContent()
                    .getParts()
                    .get(0)
                    .getText();

        } catch (Exception e) {

            throw new RuntimeException(
                    "Gemini API request failed: " + e.getMessage(),
                    e
            );
        }
    }
}