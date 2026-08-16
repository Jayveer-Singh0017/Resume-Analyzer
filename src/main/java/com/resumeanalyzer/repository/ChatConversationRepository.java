package com.resumeanalyzer.repository;

import com.resumeanalyzer.entity.ChatConversation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatConversationRepository
        extends JpaRepository<ChatConversation, Long> {
}