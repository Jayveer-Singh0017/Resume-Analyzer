package com.resumeanalyzer.controller;

import com.resumeanalyzer.dto.ChatRequest;
import com.resumeanalyzer.dto.ChatResponse;
import com.resumeanalyzer.dto.ChatHistoryResponse;
import com.resumeanalyzer.entity.ChatConversation;
import com.resumeanalyzer.service.ChatService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/conversation")
    public ChatConversation createConversation(
            @RequestBody ChatRequest request) {

        return chatService.createConversation(
                request.getMessage()
        );
    }

    @PostMapping("/{conversationId}/message")
    public ChatResponse sendMessage(
            @PathVariable Long conversationId,
            @RequestBody ChatRequest request) {

        String response =
                chatService.sendMessage(
                        conversationId,
                        request.getMessage()
                );

        return new ChatResponse(response);
    }

    @GetMapping
    public List<ChatConversation> getConversations() {
        return chatService.getAllConversations();
    }

    @GetMapping("/{conversationId}/messages")
    public List<ChatHistoryResponse> getMessages(
            @PathVariable Long conversationId) {

        return chatService.getMessages(conversationId);
    }

    @DeleteMapping("/{conversationId}")
    public String deleteConversation(
            @PathVariable Long conversationId) {

        chatService.deleteConversation(conversationId);

        return "Conversation deleted successfully";
    }
}