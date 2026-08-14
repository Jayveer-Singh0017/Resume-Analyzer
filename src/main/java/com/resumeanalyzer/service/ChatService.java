package com.resumeanalyzer.service;

import org.springframework.stereotype.Service;

@Service
public class ChatService {

    private final GeminiService geminiService;

    public ChatService(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    public String chat(String userMessage) {

        String prompt = """
                You are an AI career assistant.

                Help the user with:
                - Job roles
                - Career guidance
                - Resume improvement
                - Required technical skills
                - Interview preparation
                - Experience-based career suggestions

                Give practical and professional answers.

                User message:
                %s
                """.formatted(userMessage);

        return geminiService.generateContent(prompt);
    }
}