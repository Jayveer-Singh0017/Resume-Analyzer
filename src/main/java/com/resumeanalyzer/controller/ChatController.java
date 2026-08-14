package com.resumeanalyzer.controller;

import com.resumeanalyzer.dto.ChatRequest;
import com.resumeanalyzer.dto.ChatResponse;
import com.resumeanalyzer.service.ChatService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping
    public ChatResponse chat(@RequestBody ChatRequest request) {

        String reply = chatService.chat(request.getMessage());

        return new ChatResponse(reply);
    }
}