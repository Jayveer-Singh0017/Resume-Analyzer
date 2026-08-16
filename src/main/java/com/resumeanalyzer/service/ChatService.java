package com.resumeanalyzer.service;

import com.resumeanalyzer.dto.ChatHistoryResponse;
import com.resumeanalyzer.entity.ChatConversation;
import com.resumeanalyzer.entity.ChatMessage;
import com.resumeanalyzer.repository.ChatConversationRepository;
import com.resumeanalyzer.repository.ChatMessageRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatService {

    private final GeminiService geminiService;
    private final ChatConversationRepository conversationRepository;
    private final ChatMessageRepository messageRepository;

    public ChatService(
            GeminiService geminiService,
            ChatConversationRepository conversationRepository,
            ChatMessageRepository messageRepository) {

        this.geminiService = geminiService;
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
    }

    public ChatConversation createConversation(String firstMessage) {

        ChatConversation conversation = new ChatConversation();

        String title = firstMessage.length() > 40
                ? firstMessage.substring(0, 40) + "..."
                : firstMessage;

        conversation.setTitle(title);

        return conversationRepository.save(conversation);
    }

    public String sendMessage(Long conversationId, String userMessage) {

        ChatConversation conversation =
                conversationRepository.findById(conversationId)
                        .orElseThrow(() ->
                                new RuntimeException("Conversation not found"));

        ChatMessage userMessageEntity =
                new ChatMessage(
                        conversation,
                        "user",
                        userMessage
                );

        messageRepository.save(userMessageEntity);

        String prompt = """
                You are an AI career assistant.

                Help the user with:
                - Career guidance
                - Job roles
                - Technical skills
                - Interview preparation
                - Resume improvement
                - Career planning

                User message:
                %s
                """.formatted(userMessage);

        String aiResponse = geminiService.generateContent(prompt);

        ChatMessage aiMessage =
                new ChatMessage(
                        conversation,
                        "assistant",
                        aiResponse
                );

        messageRepository.save(aiMessage);

        return aiResponse;
    }

    public List<ChatHistoryResponse> getMessages(Long conversationId) {

        return messageRepository
                .findByConversationIdOrderByCreatedAtAsc(conversationId)
                .stream()
                .map(message ->
                        new ChatHistoryResponse(
                                message.getId(),
                                message.getRole(),
                                message.getContent(),
                                message.getCreatedAt()
                        )
                )
                .toList();
    }

    public List<ChatConversation> getAllConversations() {
        return conversationRepository.findAll();
    }

    public void deleteConversation(Long conversationId) {

        ChatConversation conversation =
                conversationRepository.findById(conversationId)
                        .orElseThrow(() ->
                                new RuntimeException("Conversation not found"));

        conversationRepository.delete(conversation);
    }
}