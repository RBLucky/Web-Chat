// Store conversation history
let conversationHistory = [];
let chatbotType = 'store'; // Default type

document.addEventListener("DOMContentLoaded", () => {
  // Set up type selector if it exists
  const typeSelector = document.getElementById("chatbot-type");
  if (typeSelector) {
    typeSelector.addEventListener("change", (e) => {
      chatbotType = e.target.value;
      // Optionally clear history when changing context
      if (confirm("Change chatbot type? This will clear the current conversation.")) {
        conversationHistory = [];
        document.getElementById("chatbox").innerHTML = "";
      }
    });
  }

  document.getElementById("send").addEventListener("click", sendMessage);
  
  // Add event listener for pressing Enter
  document.getElementById("user-input").addEventListener("keypress", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent default behavior (newline)
      sendMessage();
    }
  });
});

async function sendMessage() {
  const input = document.getElementById("user-input");
  const chatbox = document.getElementById("chatbox");

  const userMessage = input.value.trim();
  if (!userMessage) return;

  // Add user message to chat
  const userLi = document.createElement("li");
  userLi.className = "user";
  userLi.textContent = userMessage;
  chatbox.appendChild(userLi);
  input.value = "";

  // Add thinking indicator
  const botLi = document.createElement("li");
  botLi.className = "bot";
  botLi.textContent = "Thinking...";
  chatbox.appendChild(botLi);
  
  // Auto-scroll to bottom
  chatbox.scrollTop = chatbox.scrollHeight;

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        message: userMessage,
        chatType: chatbotType,
        conversationHistory: conversationHistory
      }),
    });

    if (!res.ok) {
      throw new Error('Server responded with an error');
    }

    const data = await res.json();
    
    // Update the bot response
    botLi.textContent = data.reply;
    
    // Update conversation history
    conversationHistory = data.updatedHistory || [
      ...conversationHistory,
      { role: "user", content: userMessage },
      { role: "assistant", content: data.reply }
    ];
    
    // Auto-scroll to bottom
    chatbox.scrollTop = chatbox.scrollHeight;
  } catch (error) {
    console.error("Error:", error);
    botLi.textContent = "Sorry, there was an error connecting to the server.";
  }
}