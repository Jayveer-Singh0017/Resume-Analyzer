/* =========================================================
   CHAT ELEMENTS
========================================================= */

const chatMessages =
    document.getElementById("chatMessages");

const messageInput =
    document.getElementById("messageInput");

const sendButton =
    document.getElementById("sendButton");

const welcomeScreen =
    document.getElementById("welcomeScreen");



/* =========================================================
   SEND MESSAGE
========================================================= */

async function sendMessage() {

    const message =
        messageInput.value.trim();


    /*
     * Do nothing when input is empty
     */

    if (!message) {

        return;

    }


    /*
     * Hide welcome screen
     */

    if (welcomeScreen) {

        welcomeScreen.style.display = "none";

    }


    /*
     * Display user message
     */

    addMessage(
        message,
        "user"
    );


    /*
     * Clear input
     */

    messageInput.value = "";

    autoResizeTextarea();


    /*
     * Disable send button
     */

    sendButton.disabled = true;


    /*
     * Show typing indicator
     */

    const typingMessage =
        addTypingMessage();


    try {


        /* =================================================
           CALL YOUR EXISTING SPRING BOOT API
        ================================================= */

        const response =
            await fetch(
                "/api/chat",
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


        /*
         * Check HTTP response
         */

        if (!response.ok) {

            throw new Error(
                "Server returned HTTP " +
                response.status
            );

        }


        /*
         * Convert response to JSON
         */

        const data =
            await response.json();


        console.log(
            "Chat response:",
            data
        );


        /*
         * Remove typing indicator
         */

        typingMessage.remove();


        /*
         * Display AI response
         */

        addMessage(
            data.reply,
            "ai"
        );


    }

    catch (error) {


        console.error(
            "Chat error:",
            error
        );


        /*
         * Remove typing indicator
         */

        typingMessage.remove();


        /*
         * Display error message
         */

        addMessage(
            "Sorry, something went wrong while contacting the AI. Please try again.",
            "ai"
        );

    }


    finally {


        /*
         * Enable send button
         */

        sendButton.disabled = false;


        /*
         * Focus input

         */

        messageInput.focus();

    }

}



/* =========================================================
   ADD MESSAGE
========================================================= */

function addMessage(
    text,
    sender
) {


    const messageDiv =
        document.createElement("div");


    /*
     * Message class
     */

    messageDiv.className =
        sender === "user"
            ? "message user-message"
            : "message ai-message";


    /*
     * Avatar
     */

    const avatar =
        sender === "user"
            ? "You"
            : "AI";


    /*
     * Name
     */

    const name =
        sender === "user"
            ? "You"
            : "Resume AI";


    /*
     * Build message
     */

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


    /*
     * Find bubble
     */

    const bubble =
        messageDiv.querySelector(
            ".message-bubble"
        );


    /*
     * textContent is used instead of innerHTML
     * so AI/user text cannot inject HTML.
     */

    bubble.textContent =
        text ?? "";


    /*
     * Add message
     */

    chatMessages.appendChild(
        messageDiv
    );


    /*
     * Scroll to bottom
     */

    scrollToBottom();

}



/* =========================================================
   TYPING INDICATOR
========================================================= */

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



/* =========================================================
   QUICK PROMPT
========================================================= */

function sendQuickMessage(
    message
) {


    /*
     * Put message inside input
     */

    messageInput.value =
        message;


    autoResizeTextarea();


    /*
     * Send
     */

    sendMessage();

}



/* =========================================================
   KEYBOARD HANDLING
========================================================= */

function handleKeyDown(
    event
) {


    /*
     * Enter = send
     */

    if (
        event.key === "Enter" &&
        !event.shiftKey
    ) {

        event.preventDefault();

        sendMessage();

    }

}



/* =========================================================
   AUTO RESIZE TEXTAREA
========================================================= */

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



/* =========================================================
   SCROLL TO BOTTOM
========================================================= */

function scrollToBottom() {

    requestAnimationFrame(() => {

        chatMessages.scrollTop =
            chatMessages.scrollHeight;

    });

}



/* =========================================================
   NEW CHAT
========================================================= */

function startNewChat() {


    /*
     * Remove existing messages
     * but keep welcome screen.
     */

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
                    onclick="sendQuickMessage('Which job roles are suitable for me?')">

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
                    onclick="sendQuickMessage('What skills should I learn for a Java Developer job?')">

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
                    onclick="sendQuickMessage('How should I prepare for a Java Developer interview?')">

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
                    onclick="sendQuickMessage('How can I improve my resume?')">

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


    messageInput.value = "";

    autoResizeTextarea();

    messageInput.focus();

}



/* =========================================================
   MOBILE SIDEBAR
========================================================= */

function toggleSidebar() {

    const sidebar =
        document.querySelector(".sidebar");

    const overlay =
        document.getElementById(
            "sidebarOverlay"
        );


    sidebar.classList.toggle("open");

    overlay.classList.toggle("show");

}