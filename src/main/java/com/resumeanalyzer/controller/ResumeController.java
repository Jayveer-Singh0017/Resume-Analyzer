//package com.resumeanalyzer.controller;
//
//import com.resumeanalyzer.dto.ResumeAnalysisRequest;
//import com.resumeanalyzer.dto.ResumeAnalysisResponse;
//import com.resumeanalyzer.service.ExternalApiService;
//import com.resumeanalyzer.service.GeminiService;
//import com.resumeanalyzer.service.ResumeAnalyzerService;
//import com.resumeanalyzer.service.ResumeService;
//import com.resumeanalyzer.util.PdfService;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.multipart.MultipartFile;
//
//@RestController
//@RequestMapping("/api/resume")
//public class ResumeController {
//
//    private final ResumeService resumeService;
//    private final ExternalApiService externalApiService;
//    private final GeminiService geminiService;
//    private final PdfService pdfService;
//    private final ResumeAnalyzerService resumeAnalyzerService;
//
//    public ResumeController(ResumeService resumeService, ExternalApiService externalApiService, GeminiService geminiService, PdfService pdfService, ResumeAnalyzerService resumeAnalyzerService) {
//        this.resumeService = resumeService;
//        this.externalApiService = externalApiService;
//        this.geminiService = geminiService;
//        this.pdfService = pdfService;
//        this.resumeAnalyzerService = resumeAnalyzerService;
//    }
//
//    @PostMapping("/analyze")
//    public ResumeAnalysisResponse analyzeResume(@RequestBody ResumeAnalysisRequest request){
//        return resumeService.analyzeResume(request);
//    }
//
//    @GetMapping("/external-test")
//    public String externalTest() {
//        return externalApiService.getExternalData();
//    }
//
//    @GetMapping("/gemini-test")
//    public String geminiTest() {
//
//        return geminiService.generateContent(
//                "Explain what Spring Boot is in two sentences."
//        );
//    }
//
//    @GetMapping("/models")
//    public String models() {
//        return geminiService.getModels();
//    }
//
//    @PostMapping("/pdf-test")
//    public String pdfTest(@RequestParam("file") MultipartFile file) {
//
//        return pdfService.extractText(file);
//    }
//
//    @PostMapping(
//            value = "/analyze-pdf",
//            consumes = "multipart/form-data"
//    )
//    public ResumeAnalysisResponse analyzePdf(@RequestParam("file") MultipartFile file) {
//
//        String resumeText = pdfService.extractText(file);
//
//        return resumeAnalyzerService.analyzeResume(resumeText);
//    }
//}



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