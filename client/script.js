// public/script.js
document.getElementById("send").addEventListener("click", async () => {
  const input = document.getElementById("user-input");
  const chatbox = document.getElementById("chatbox");

  const userMessage = input.value.trim();
  if (!userMessage) return;

  // Add user message to chat
  chatbox.innerHTML += `<li class="user">${userMessage}</li>`;
  input.value = "";

  // Add placeholder bot response
  chatbox.innerHTML += `<li class="bot">Thinking...</li>`;

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: userMessage }),
  });

  const data = await res.json();
  chatbox.lastChild.textContent = data.reply;
});
