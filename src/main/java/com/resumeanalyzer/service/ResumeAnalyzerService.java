package com.resumeanalyzer.service;

import com.resumeanalyzer.dto.ResumeAnalysisResponse;
import org.springframework.stereotype.Service;

@Service
public class ResumeAnalyzerService {

    private final GeminiService geminiService;
    private final tools.jackson.databind.ObjectMapper objectMapper;

    public ResumeAnalyzerService(
            GeminiService geminiService,
            tools.jackson.databind.ObjectMapper objectMapper) {

        this.geminiService = geminiService;
        this.objectMapper = objectMapper;
    }

    public ResumeAnalysisResponse analyzeResume(String resumeText) {

        String prompt = """
                Analyze the following resume and return the result as JSON.

                The JSON must contain exactly these fields:

                {
                  "overallAssessment": "string",
                  "skills": ["string"],
                  "strengths": ["string"],
                  "weaknesses": ["string"],
                  "recommendedSkills": ["string"],
                  "suitableJobRoles": ["string"],
                  "suggestions": ["string"]
                }

                Important instructions:
                - Return ONLY valid JSON.
                - Do not use markdown.
                - Do not use ```json.
                - Do not add any explanation outside the JSON.
                - Use empty arrays if information is not available.
                - Base the analysis only on the provided resume.

                Resume:

                %s
                """.formatted(resumeText);

        try {

            String geminiResponse = geminiService.generateContent(prompt);

            return objectMapper.readValue(
                    geminiResponse,
                    ResumeAnalysisResponse.class
            );

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to parse Gemini resume analysis",
                    e
            );
        }
    }
}