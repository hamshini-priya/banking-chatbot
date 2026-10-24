const chatBox = document.getElementById("chat-box");
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");

function addInlineFormatting(parent, text) {
  // Safe minimal formatting for **bold** and `inline code`.
  const pattern = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let lastIndex = 0;
  for (const match of text.matchAll(pattern)) {
    if (match.index > lastIndex) parent.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
    const token = match[0];
    const element = document.createElement(token.startsWith("**") ? "strong" : "code");
    element.textContent = token.startsWith("**") ? token.slice(2, -2) : token.slice(1, -1);
    parent.appendChild(element);
    lastIndex = match.index + token.length;
  }
  if (lastIndex < text.length) parent.appendChild(document.createTextNode(text.slice(lastIndex)));
}

function renderAnswer(container, rawText) {
  // Normalize Gemini's Markdown-like output before rendering it safely.
  let cleaned = String(rawText || "").replace(/\r\n/g, "\n");
  cleaned = cleaned
    .replace(/\\([*#-])/g, "$1")
    .replace(/\s*---+\s*/g, "\n\n")
    .replace(/\s+(#{1,3}\s+)/g, "\n\n$1")
    .replace(/\s+(\d+[.)]\s+)/g, "\n$1")
    .replace(/\s+([*•-]\s+)/g, "\n$1");

  const lines = cleaned.split("\n");
  let paragraph = [];
  let list = null;

  function flushParagraph() {
    if (!paragraph.length) return;
    const p = document.createElement("p");
    addInlineFormatting(p, paragraph.join(" "));
    container.appendChild(p);
    paragraph = [];
  }
  function closeList() { list = null; }

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) { flushParagraph(); closeList(); continue; }

    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      flushParagraph(); closeList();
      const h = document.createElement(heading[1].length === 1 ? "h2" : "h3");
      addInlineFormatting(h, heading[2]);
      container.appendChild(h);
      continue;
    }

    const bullet = line.match(/^[-*•]\s+(.+)$/);
    const numbered = line.match(/^\d+[.)]\s+(.+)$/);
    if (bullet || numbered) {
      flushParagraph();
      const tag = bullet ? "ul" : "ol";
      if (!list || list.tagName.toLowerCase() !== tag) {
        closeList();
        list = document.createElement(tag);
        container.appendChild(list);
      }
      const li = document.createElement("li");
      addInlineFormatting(li, (bullet || numbered)[1]);
      list.appendChild(li);
      continue;
    }

    closeList();
    paragraph.push(line);
  }
  flushParagraph();
}

function addMessage(kind, label, text, formatted = false) {
  const article = document.createElement("article");
  article.className = `message ${kind}-message`;

  if (kind === "assistant") {
    const avatar = document.createElement("div");
    avatar.className = "avatar";
    avatar.setAttribute("aria-hidden", "true");
    avatar.textContent = "R";
    article.appendChild(avatar);
  }

  const content = document.createElement("div");
  content.className = "message-content";
  const labelRow = document.createElement("div");
  labelRow.className = "message-label";
  labelRow.textContent = label;

  if (kind === "assistant") {
    const role = document.createElement("span");
    role.textContent = "Assistant";
    labelRow.appendChild(role);
  }

  const bubble = document.createElement("div");
  bubble.className = "message-bubble";
  if (formatted) renderAnswer(bubble, text);
  else {
    const p = document.createElement("p");
    p.textContent = text;
    bubble.appendChild(p);
  }

  content.appendChild(labelRow);
  content.appendChild(bubble);
  article.appendChild(content);
  chatBox.appendChild(article);
  chatBox.scrollTop = chatBox.scrollHeight;
  return article;
}

function resizeInput() {
  userInput.style.height = "auto";
  userInput.style.height = `${Math.min(userInput.scrollHeight, 140)}px`;
}
userInput.addEventListener("input", resizeInput);
userInput.addEventListener("keydown", event => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    chatForm.requestSubmit();
  }
});

chatForm.addEventListener("submit", async event => {
  event.preventDefault();
  const message = userInput.value.trim();
  if (!message || sendButton.disabled) return;

  addMessage("user", "You", message);
  userInput.value = "";
  resizeInput();
  sendButton.disabled = true;
  sendButton.querySelector("span").textContent = "Sending…";

  // Build the loading message with DOM APIs instead of injecting HTML.
  const loading = document.createElement("article");
  loading.className = "message assistant-message";
  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.textContent = "R";
  avatar.setAttribute("aria-hidden", "true");
  const content = document.createElement("div");
  content.className = "message-content";
  const label = document.createElement("div");
  label.className = "message-label";
  label.textContent = "Riya";
  const role = document.createElement("span");
  role.textContent = "Assistant";
  label.appendChild(role);
  const bubble = document.createElement("div");
  bubble.className = "message-bubble typing-indicator";
  bubble.textContent = "Riya is preparing a response…";
  content.appendChild(label);
  content.appendChild(bubble);
  loading.appendChild(avatar);
  loading.appendChild(content);
  chatBox.appendChild(loading);
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const response = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });
    const data = await response.json().catch(() => ({}));
    loading.remove();

    if (!response.ok) addMessage("assistant", "Riya", data.error || "I couldn't process that request. Please try again.");
    else if (data.response) addMessage("assistant", "Riya", data.response, true);
    else addMessage("assistant", "Riya", "I received an empty response. Please try again.");
  } catch (error) {
    loading.remove();
    addMessage("assistant", "Riya", "I couldn't connect to the server. Please check that the chatbot is running and try again.");
    console.error("Chat request failed:", error);
  } finally {
    sendButton.disabled = false;
    sendButton.querySelector("span").textContent = "Send";
    userInput.focus();
  }
});
