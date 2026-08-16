   // CHAT ELEMENTS

const chatMessages = document.getElementById("chatMessages");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
const chatHistory = document.getElementById("chatHistory");

   // CURRENT CONVERSATION
let currentConversationId = null;

   // INITIALIZE
document.addEventListener("DOMContentLoaded", () => {

    loadChatHistory();

    messageInput.focus();

});

   // LOAD CHAT HISTORY

async function loadChatHistory() {

    try {

        const response = await fetch("/api/chat");

        if (!response.ok) {

            throw new Error(
                "Failed to load chat history: " +
                response.status
            );

        }

        const conversations = await response.json();

        console.log(
            "Chat history:",
            conversations
        );

        renderChatHistory(conversations);

    } catch (error) {

        console.error(
            "Chat history error:",
            error
        );

    }

}

   // RENDER CHAT HISTORY
   function renderChatHistory(conversations) {

       if (!chatHistory) {
           return;
       }

       chatHistory.innerHTML = "";

       if (
           !conversations ||
           conversations.length === 0
       ) {

           chatHistory.innerHTML = `
            <div class="chat-history-empty">
                No previous chats
            </div>
        `;

           return;
       }


       // Newest chat first
       conversations.sort((a, b) => {

           return new Date(b.createdAt) -
               new Date(a.createdAt);

       });


       conversations.forEach(conversation => {

           /*
            * Main history item
            */
           const item =
               document.createElement("div");

           item.className =
               "chat-history-item";


           /*
            * Active conversation
            */
           if (
               conversation.id ===
               currentConversationId
           ) {

               item.classList.add("active");

           }


           /*
            * Open conversation button
            */
           const openButton =
               document.createElement("button");

           openButton.className =
               "chat-history-open";


           /*
            * Chat title
            */
           const title =
               document.createElement("div");

           title.className =
               "chat-history-title";

           title.textContent =
               conversation.title ||
               "New Conversation";


           openButton.appendChild(title);


           /*
            * Open conversation
            */
           openButton.addEventListener(
               "click",
               () => {

                   openConversation(
                       conversation.id
                   );

               }
           );


           /*
            * Delete button
            */
           const deleteButton =
               document.createElement("button");

           deleteButton.className =
               "chat-delete-button";

           deleteButton.type =
               "button";

           deleteButton.title =
               "Delete conversation";

           deleteButton.setAttribute(
               "aria-label",
               "Delete conversation"
           );

           deleteButton.innerHTML =
               "🗑";


           /*
            * Delete conversation
            */
           deleteButton.addEventListener(
               "click",
               (event) => {

                   event.stopPropagation();

                   deleteConversation(
                       conversation.id
                   );

               }
           );


           /*
            * Add everything
            */
           item.appendChild(
               openButton
           );

           item.appendChild(
               deleteButton
           );

           chatHistory.appendChild(
               item
           );

       });

   }


   /* =========================================================
   DELETE CONVERSATION
========================================================= */

   async function deleteConversation(
       conversationId
   ) {

       const confirmed =
           confirm(
               "Are you sure you want to delete this conversation?"
           );


       if (!confirmed) {
           return;
       }


       try {

           const response =
               await fetch(
                   `/api/chat/${conversationId}`,
                   {
                       method: "DELETE"
                   }
               );


           if (!response.ok) {

               const errorText =
                   await response.text();

               console.error(
                   "Delete conversation failed:",
                   response.status,
                   errorText
               );

               throw new Error(
                   "Failed to delete conversation"
               );

           }


           console.log(
               "Conversation deleted:",
               conversationId
           );


           /*
            * If the deleted conversation
            * is currently open.
            */
           if (
               currentConversationId ===
               conversationId
           ) {

               currentConversationId =
                   null;

               clearChatScreen();

               showWelcomeScreen();

           }


           /*
            * Refresh sidebar
            */
           await loadChatHistory();


       } catch (error) {

           console.error(
               "Delete conversation error:",
               error
           );


           alert(
               "Unable to delete the conversation."
           );

       }

   }

   // CREATE NEW CHAT
async function startNewChat() {

    const initialMessage = "New conversation";

    try {

        const response = await fetch("/api/chat/conversation", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: initialMessage
            })
        });

        if (!response.ok) {

            const errorText = await response.text();

            console.error(
                "Create conversation failed:",
                response.status,
                errorText
            );

            throw new Error(
                "Failed to create conversation: " +
                response.status
            );
        }

        const conversation = await response.json();

        console.log(
            "New conversation created:",
            conversation
        );

        currentConversationId = conversation.id;

        clearChatScreen();

        showWelcomeScreen();

        await loadChatHistory();

        messageInput.focus();

    } catch (error) {

        console.error(
            "New chat error:",
            error
        );

        addMessage(
            "Unable to start a new conversation.",
            "ai"
        );
    }
}

 // OPEN EXISTING CONVERSATION
async function openConversation(
    conversationId
) {

    try {

        currentConversationId =
            conversationId;


        clearChatScreen();


        const response =
            await fetch(
                `/api/chat/${conversationId}/messages`
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load messages: " +
                response.status
            );

        }


        const messages =
            await response.json();


        console.log(
            "Conversation messages:",
            messages
        );


        if (
            !messages ||
            messages.length === 0
        ) {
            showWelcomeScreen();
        } else {
            messages.forEach(message => {

                const sender =
                    message.role === "user"
                        ? "user"
                        : "ai";

                addMessage(
                    message.content,
                    sender
                );
            });
        }

        await loadChatHistory();
        messageInput.focus();

    } catch (error) {
        console.error(
            "Open conversation error:",
            error
        );

        addMessage(
            "Unable to load this conversation.",
            "ai"
        );
    }
}
   // SEND MESSAGE
async function sendMessage() {

    const message =
        messageInput.value.trim();

    if (!message) {
        return;
    }

    /*
     * If there is no active conversation,
     * create one first.
     */
    if (!currentConversationId) {

        try {

            const response = await fetch(
                "/api/chat/conversation",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        message: message
                    })
                }
            );

            if (!response.ok) {

                const errorText = await response.text();

                console.error(
                    "Create conversation failed:",
                    response.status,
                    errorText
                );

                throw new Error(
                    "Failed to create conversation"
                );
            }

            const conversation =
                await response.json();

            console.log(
                "Conversation created:",
                conversation
            );

            currentConversationId =
                conversation.id;

        } catch (error) {

            console.error(error);

            addMessage(
                "Unable to start a new conversation.",
                "ai"
            );

            return;
        }
    }


    hideWelcomeScreen();


    addMessage(
        message,
        "user"
    );


    messageInput.value = "";

    autoResizeTextarea();


    sendButton.disabled = true;


    const typingMessage =
        addTypingMessage();


    try {

        const response =
            await fetch(
                `/api/chat/${currentConversationId}/message`,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        message: message
                    })

                }
            );


        if (!response.ok) {

            throw new Error(
                "Server returned HTTP " +
                response.status
            );

        }


        const data =
            await response.json();


        console.log(
            "Chat response:",
            data
        );


        typingMessage.remove();


        /*
         * Adjust this property if your backend
         * returns a different response field.
         */

        const aiResponse =
            data.reply ||
            data.response ||
            data.content ||
            data.message;


        addMessage(
            aiResponse,
            "ai"
        );

        /*
         * Refresh sidebar because
         * conversation title/update may have changed.
         */

        await loadChatHistory();

    } catch (error) {

        console.error(
            "Chat error:",
            error
        );

        typingMessage.remove();

        addMessage(
            "Sorry, something went wrong while contacting the AI.",
            "ai"
        );
    }

    finally {
        sendButton.disabled = false;
        messageInput.focus();
    }
}

   // ADD MESSAGE
function addMessage(
    text,
    sender
) {

    const messageDiv =
        document.createElement("div");

    messageDiv.className =
        sender === "user"
            ? "message user-message"
            : "message ai-message";

    const avatar =
        sender === "user"
            ? "You"
            : "AI";

    const name =
        sender === "user"
            ? "You"
            : "Resume AI";

    messageDiv.innerHTML = `

        <div class="avatar">
            ${avatar}
        </div>
        
        <div class="message-content">

            <div class="message-name">
                ${name}
            </div>
            <div class="message-bubble"></div>
        </div>
    `;

    const bubble =
        messageDiv.querySelector(
            ".message-bubble"
        );


    if (sender === "ai") {

        bubble.innerHTML =
            formatAIResponse(text ?? "");

    } else {

        // Keep user messages as plain text
        // so user input cannot create HTML.
        bubble.textContent =
            text ?? "";

    }


    chatMessages.appendChild(
        messageDiv
    );


    scrollToBottom();

}

   // FORMAT AI RESPONSE
function formatAIResponse(text) {

    if (!text) {
        return "";
    }

    let html = escapeHTML(text);

       // CODE BLOCKS
    html = html.replace(
        /```([\s\S]*?)```/g,
        function(match, code) {

            return `
                <pre class="ai-code-block"><code>${code.trim()}</code></pre>
            `;
        }
    );


       // INLINE CODE
    html = html.replace(
        /`([^`\n]+)`/g,
        `<code class="ai-inline-code">$1</code>`
    );


       // HEADINGS
    html = html.replace(
        /^### (.*)$/gm,
        `<h4>$1</h4>`
    );

    html = html.replace(
        /^## (.*)$/gm,
        `<h3>$1</h3>`
    );

    html = html.replace(
        /^# (.*)$/gm,
        `<h2>$1</h2>`
    );


       // BOLD
    html = html.replace(
        /\*\*(.*?)\*\*/g,
        `<strong>$1</strong>`
    );


       // ITALIC
    html = html.replace(
        /(?<!\*)\*([^*\n]+)\*(?!\*)/g,
        `<em>$1</em>`
    );


       // BULLET LISTS
    html = html.replace(
        /(^|\n)(?:[-*]) (.+)(?=\n|$)/g,
        `$1<li>$2</li>`
    );


    /*
     * Wrap consecutive <li> elements
     * inside an unordered list.
     */
    html = html.replace(
        /((?:<li>.*?<\/li>\s*)+)/g,
        `<ul>$1</ul>`
    );

       // NUMBERED LISTS
    html = html.replace(
        /(^|\n)\d+\.\s+(.+)(?=\n|$)/g,
        `$1<li>$2</li>`
    );

    /*
     * Convert remaining line breaks
     * into paragraphs / breaks.
     */

    html = html.replace(
        /\n{2,}/g,
        `</p><p>`
    );

    html = html.replace(
        /\n/g,
        `<br>`
    );


    return `<div class="ai-formatted-response">${html}</div>`;
}

   // ESCAPE HTML
function escapeHTML(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

   // TYPING INDICATOR
function addTypingMessage() {

    const messageDiv =
        document.createElement("div");
    messageDiv.className =
        "message ai-message";

    messageDiv.innerHTML = `

        <div class="avatar">
            AI
        </div>

        <div class="message-content">

            <div class="message-name">
                Resume AI
            </div>

            <div class="message-bubble typing">

                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>

            </div>

        </div>

    `;


    chatMessages.appendChild(
        messageDiv
    );
    scrollToBottom();
    return messageDiv;
}

   // QUICK MESSAGE
   function sendQuickMessage(message) {

    messageInput.value =
        message;

    autoResizeTextarea();

    sendMessage();

}


   // KEYBOARD
function handleKeyDown(event) {

    if (
        event.key === "Enter" &&
        !event.shiftKey
    ) {

        event.preventDefault();

        sendMessage();

    }

}


   // AUTO RESIZE
messageInput.addEventListener(
    "input",
    autoResizeTextarea
);


function autoResizeTextarea() {

    messageInput.style.height =
        "auto";


    messageInput.style.height =
        Math.min(
            messageInput.scrollHeight,
            140
        ) + "px";

}


   // CLEAR CHAT SCREEN
function clearChatScreen() {
    chatMessages.innerHTML = "";
}
   // WELCOME SCREEN
function showWelcomeScreen() {

    chatMessages.innerHTML = `
        <div id="welcomeScreen"
             class="welcome-screen">

            <div class="welcome-icon">
                ✦
            </div>

            <h2>
                How can I help with your career?
            </h2>

            <p>
                Ask me about your resume, skills,
                job roles, interviews, or career growth.
            </p>

            <div class="welcome-cards">

                <button
                    onclick="sendQuickMessage(
                        'Which job roles are suitable for me?'
                    )">

                    <span class="welcome-card-icon">
                        ◈
                    </span>

                    <strong>
                        Find suitable roles
                    </strong>

                    <small>
                        Discover jobs matching your skills
                    </small>

                </button>


                <button
                    onclick="sendQuickMessage(
                        'What skills should I learn for a Java Developer job?'
                    )">

                    <span class="welcome-card-icon">
                        ✦
                    </span>

                    <strong>
                        Skills to learn
                    </strong>

                    <small>
                        Find the skills employers expect
                    </small>

                </button>


                <button
                    onclick="sendQuickMessage(
                        'How should I prepare for a Java Developer interview?'
                    )">

                    <span class="welcome-card-icon">
                        ?
                    </span>

                    <strong>
                        Interview preparation
                    </strong>

                    <small>
                        Prepare for your next interview
                    </small>

                </button>


                <button
                    onclick="sendQuickMessage(
                        'How can I improve my resume?'
                    )">

                    <span class="welcome-card-icon">
                        ↑
                    </span>

                    <strong>
                        Improve resume
                    </strong>

                    <small>
                        Make your resume stronger
                    </small>

                </button>

            </div>

        </div>

    `;

}

   // HIDE WELCOME
function hideWelcomeScreen() {

    const welcomeScreen =
        document.getElementById(
            "welcomeScreen"
        );


    if (welcomeScreen) {

        welcomeScreen.remove();

    }

}


   // SCROLL
function scrollToBottom() {

    requestAnimationFrame(() => {
        chatMessages.scrollTop =
            chatMessages.scrollHeight;
    });
}
   // MOBILE SIDEBAR
function toggleSidebar() {

    const sidebar =
        document.querySelector(
            ".sidebar"
        );

    const overlay =
        document.getElementById(
            "sidebarOverlay"
        );
    sidebar.classList.toggle(
        "open"
    );
    overlay.classList.toggle(
        "show"
    );
}