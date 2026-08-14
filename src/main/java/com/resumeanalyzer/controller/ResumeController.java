package com.resumeanalyzer.controller;

import com.resumeanalyzer.dto.ResumeAnalysisResponse;
import com.resumeanalyzer.service.ResumeAnalyzerService;
import com.resumeanalyzer.util.PdfService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/resume")
public class ResumeController {

    private final PdfService pdfService;
    private final ResumeAnalyzerService resumeAnalyzerService;

    public ResumeController(
            PdfService pdfService,
            ResumeAnalyzerService resumeAnalyzerService) {

        this.pdfService = pdfService;
        this.resumeAnalyzerService = resumeAnalyzerService;
    }

    @PostMapping(
            value = "/analyze-pdf",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResumeAnalysisResponse analyzePdf(
            @RequestParam("file") MultipartFile file) {

        String resumeText = pdfService.extractText(file);

        return resumeAnalyzerService.analyzeResume(resumeText);
    }
}