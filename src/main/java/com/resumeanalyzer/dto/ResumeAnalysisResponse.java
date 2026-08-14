package com.resumeanalyzer.dto;

import java.util.List;

public class ResumeAnalysisResponse {

    private String overallAssessment;
    private List<String> skills;
    private List<String> strengths;
    private List<String> weaknesses;
    private List<String> recommendedSkills;
    private List<String> suitableJobRoles;
    private List<String> suggestions;

    public ResumeAnalysisResponse() {
    }

    public String getOverallAssessment() {
        return overallAssessment;
    }

    public void setOverallAssessment(String overallAssessment) {
        this.overallAssessment = overallAssessment;
    }

    public List<String> getSkills() {
        return skills;
    }

    public void setSkills(List<String> skills) {
        this.skills = skills;
    }

    public List<String> getStrengths() {
        return strengths;
    }

    public void setStrengths(List<String> strengths) {
        this.strengths = strengths;
    }

    public List<String> getWeaknesses() {
        return weaknesses;
    }

    public void setWeaknesses(List<String> weaknesses) {
        this.weaknesses = weaknesses;
    }

    public List<String> getRecommendedSkills() {
        return recommendedSkills;
    }

    public void setRecommendedSkills(List<String> recommendedSkills) {
        this.recommendedSkills = recommendedSkills;
    }

    public List<String> getSuitableJobRoles() {
        return suitableJobRoles;
    }

    public void setSuitableJobRoles(List<String> suitableJobRoles) {
        this.suitableJobRoles = suitableJobRoles;
    }

    public List<String> getSuggestions() {
        return suggestions;
    }

    public void setSuggestions(List<String> suggestions) {
        this.suggestions = suggestions;
    }
}