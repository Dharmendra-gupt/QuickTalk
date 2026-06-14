// ==========================================================================
// Mock Database & State Management
// ==========================================================================

const EMOJIS = [
  "😀","😃","😄","😁","😆","😅","😂","🤣","😊","😇","🙂","🙃","😉","😌","😍","🥰","😘","😗","😙",
  "😋","😛","😜","🤪","😎","🤩","🥳","😏","😒","😞","😔","🥺","😢","😭","😡","🤯","🤔","🫣","🤫",
  "👍","👎","👌","✌️","👏","🙌","🤝","🙏","❤️","🔥","✨","🎉","💯","💡","💬"
];

// Helper to generate timestamps relative to current time
function getRelativeTime(offsetMinutes) {
  const date = new Date();
  date.setMinutes(date.getMinutes() - offsetMinutes);
  return date.toISOString();
}

let state = {
  currentUser: {
    name: "Felix",
    avatarSeed: "Felix",
    about: "Coding beautiful interfaces 🚀"
  },
  chats: [
    {
      id: "antigravity",
      name: "Antigravity AI",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Antigravity",
      phone: "+1 (800) DEEP-MIND",
      about: "Advanced AI pair programming assistant. Ask me anything!",
      status: "online",
      unreadCount: 2,
      messages: [
        {
          id: "ag-1",
          sender: "contact",
          text: "Hello there! I am Antigravity, your AI coding companion.",
          timestamp: getRelativeTime(120),
          status: "read",
          starred: false,
          reactions: []
        },
        {
          id: "ag-2",
          sender: "contact",
          text: "I heard you're building a gorgeous WhatsApp Web clone. Need any help with CSS glassmorphism, typing simulators, or layout responsiveness?",
          timestamp: getRelativeTime(119),
          status: "read",
          starred: false,
          reactions: ["💡"]
        }
      ]
    },
    {
      id: "sarah",
      name: "Sarah (Design)",
      avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Sarah",
      phone: "+1 (555) 389-4021",
      about: "Product Designer | Pixels & Prototypes 🎨",
      status: "offline",
      unreadCount: 0,
      messages: [
        {
          id: "s-1",
          sender: "user",
          text: "Hey Sarah, did you check out the new design system dark mode variables?",
          timestamp: getRelativeTime(60),
          status: "read",
          starred: false,
          reactions: []
        },
        {
          id: "s-2",
          sender: "contact",
          text: "OMG yes! The high-contrast slate colors look super premium. Let's definitely roll with them.",
          timestamp: getRelativeTime(58),
          status: "read",
          starred: true,
          reactions: ["❤️"]
        },
        {
          id: "s-3",
          sender: "contact",
          text: "Here is the mobile layout mockup we discussed. Let me know what you think!",
          timestamp: getRelativeTime(57),
          status: "read",
          starred: false,
          reactions: [],
          media: {
            type: "image",
            url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400"
          }
        }
      ]
    },
    {
      id: "project-group",
      name: "Dev Team Launch Group",
      avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=project",
      phone: "Group (3 participants)",
      about: "Critical discussions for the Q3 deployment launch.",
      status: "online",
      unreadCount: 0,
      messages: [
        {
          id: "pg-1",
          sender: "contact",
          senderName: "Bob (Lead)",
          text: "Is the database migration script completed?",
          timestamp: getRelativeTime(30),
          status: "read",
          starred: false,
          reactions: []
        },
        {
          id: "pg-2",
          sender: "contact",
          senderName: "Alice (Dev)",
          text: "Yes, Bob. Tested it on staging, ran all index checks, and it completed in 4.2 seconds.",
          timestamp: getRelativeTime(28),
          status: "read",
          starred: false,
          reactions: ["👍"]
        },
        {
          id: "pg-3",
          sender: "user",
          text: "Awesome! I'll prepare the release notes tonight.",
          timestamp: getRelativeTime(25),
          status: "read",
          starred: false,
          reactions: []
        }
      ]
    },
    {
      id: "dad",
      name: "Dad",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dad",
      phone: "+1 (555) 782-9901",
      about: "Out in the garden 🪴",
      status: "offline",
      unreadCount: 0,
      messages: [
        {
          id: "d-1",
          sender: "contact",
          text: "Are you coming over for dinner this Sunday? Your mother is making lasagna.",
          timestamp: getRelativeTime(1440 * 2), // 2 days ago
          status: "read",
          starred: false,
          reactions: []
        },
        {
          id: "d-2",
          sender: "user",
          text: "Definitely! I wouldn't miss her lasagna for the world.",
          timestamp: getRelativeTime(1440 * 2 - 10),
          status: "read",
          starred: false,
          reactions: []
        },
        {
          id: "d-3",
          sender: "contact",
          text: "Great. Also, why did the computer go to the doctor?",
          timestamp: getRelativeTime(1440 * 2 - 11),
          status: "read",
          starred: false,
          reactions: []
        },
        {
          id: "d-4",
          sender: "contact",
          text: "Because it had a virus! Hahaha, see you Sunday.",
          timestamp: getRelativeTime(1440 * 2 - 12),
          status: "read",
          starred: true,
          reactions: ["😂"]
        }
      ]
    }
  ],
  activeChatId: null,
  searchQuery: "",
  searchMsgQuery: "",
  searchMsgMatches: [],
  searchMsgActiveIndex: -1,
  replyingToMessage: null,
  contextMenuMessageId: null
};

// Selectors
const docHtml = document.documentElement;
const sidebarEl = document.querySelector(".sidebar");
const chatWindowEl = document.getElementById("chatWindow");
const emptyStateEl = document.getElementById("emptyStateScreen");
const chatHeaderEl = document.getElementById("chatHeader");
const messageAreaEl = document.getElementById("messageArea");
const messageFeedEl = document.getElementById("messageFeed");
const chatInputBarEl = document.getElementById("chatInputBar");
const chatListContainerEl = document.getElementById("chatListContainer");

// Forms & Inputs
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const chatSearchInput = document.getElementById("chatSearchInput");
const clearSearchBtn = document.getElementById("clearSearchBtn");

// Theme Toggle
const themeToggleBtn = document.getElementById("themeToggle");

// Drawers & Modals
const infoDrawerEl = document.getElementById("infoDrawer");
const toggleInfoBtn = document.getElementById("toggleInfoBtn");
const closeDrawerBtn = document.getElementById("closeDrawerBtn");
const profileModalEl = document.getElementById("profileModal");
const userProfileBtn = document.getElementById("userProfileBtn");
const closeProfileModalBtn = document.getElementById("closeProfileModal");
const cancelProfileBtn = document.getElementById("cancelProfileBtn");
const saveProfileBtn = document.getElementById("saveProfileBtn");

// Context Menu & Emojis
const messageContextMenuEl = document.getElementById("messageContextMenu");
const emojiToggleBtn = document.getElementById("emojiToggleBtn");
const emojiPickerEl = document.getElementById("emojiPicker");
const emojiListEl = document.getElementById("emojiList");
const attachmentToggleBtn = document.getElementById("attachmentToggleBtn");
const attachmentMenuEl = document.getElementById("attachmentMenu");
const scrollDownBtn = document.getElementById("scrollDownBtn");
const scrollDownBadge = document.getElementById("scrollDownBadge");

// Mobile Back Navigation
const backToSidebarBtn = document.getElementById("backToSidebarBtn");

// Reply Preview elements
const replyPreviewContainer = document.getElementById("replyPreviewContainer");
const replyPreviewSender = document.getElementById("replyPreviewSender");
const replyPreviewText = document.getElementById("replyPreviewText");
const closeReplyPreviewBtn = document.getElementById("closeReplyPreviewBtn");

// Search Messages Elements
const searchChatMessagesBtn = document.getElementById("searchChatMessagesBtn");
const searchMessagesBar = document.getElementById("searchMessagesBar");
const searchMsgInput = document.getElementById("searchMsgInput");
const searchMsgCount = document.getElementById("searchMsgCount");
const prevSearchMsgBtn = document.getElementById("prevSearchMsg");
const nextSearchMsgBtn = document.getElementById("nextSearchMsg");
const closeSearchMsgBtn = document.getElementById("closeSearchMsgBtn");

// ==========================================================================
// Initialization
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initEmojis();
  renderChatList();
  setupEventListeners();
  
  // Clean up skeletons and show standard view
  const skeletons = document.querySelector(".skeleton-chats");
  if (skeletons) skeletons.style.display = "none";
});

function initTheme() {
  const savedTheme = localStorage.getItem("talk-theme") || "dark";
  docHtml.setAttribute("data-theme", savedTheme);
}

function initEmojis() {
  emojiListEl.innerHTML = "";
  EMOJIS.forEach(emoji => {
    const btn = document.createElement("button");
    btn.className = "emoji-picker-item";
    btn.innerText = emoji;
    btn.addEventListener("click", () => {
      messageInput.value += emoji;
      messageInput.focus();
      triggerInputResize();
      toggleSendIcon();
    });
    emojiListEl.appendChild(btn);
  });
}

// ==========================================================================
// Render Sidebar Chat List
// ==========================================================================

function renderChatList() {
  chatListContainerEl.innerHTML = "";
  
  const filteredChats = state.chats.filter(chat => {
    const nameMatch = chat.name.toLowerCase().includes(state.searchQuery.toLowerCase());
    const messageMatch = chat.messages.some(m => m.text.toLowerCase().includes(state.searchQuery.toLowerCase()));
    return nameMatch || messageMatch;
  });

  if (filteredChats.length === 0) {
    chatListContainerEl.innerHTML = `
      <div style="padding: 30px; text-align: center; color: var(--text-muted); font-size: 0.9rem;">
        No conversations found
      </div>
    `;
    return;
  }

  // Sort: show chats with most recent messages first
  filteredChats.sort((a, b) => {
    const lastMsgA = a.messages[a.messages.length - 1];
    const lastMsgB = b.messages[b.messages.length - 1];
    const timeA = lastMsgA ? new Date(lastMsgA.timestamp).getTime() : 0;
    const timeB = lastMsgB ? new Date(lastMsgB.timestamp).getTime() : 0;
    return timeB - timeA;
  });

  filteredChats.forEach(chat => {
    const lastMsg = chat.messages[chat.messages.length - 1];
    const isTyping = chat.status === "typing...";
    
    let previewText = "No messages yet";
    let previewTime = "";
    let ticksHtml = "";

    if (lastMsg) {
      previewText = lastMsg.text;
      if (lastMsg.media) {
        previewText = lastMsg.media.type === "image" ? "📷 Image" : "📄 Document";
      }
      previewTime = formatTimeBrief(lastMsg.timestamp);
      
      if (lastMsg.sender === "user") {
        const isRead = lastMsg.status === "read";
        ticksHtml = `
          <svg class="tick-icon ${isRead ? 'read' : ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"></polyline>
            ${lastMsg.status !== 'sent' ? '<polyline points="20 12 13 19 9 15"></polyline>' : ''}
          </svg>
        `;
      }
    }

    const isActive = chat.id === state.activeChatId;
    const itemEl = document.createElement("div");
    itemEl.className = `chat-item ${isActive ? 'active' : ''}`;
    itemEl.dataset.id = chat.id;

    itemEl.innerHTML = `
      <div class="chat-item-avatar-wrapper">
        <img src="${chat.avatar}" alt="${chat.name}" class="contact-avatar">
        <span class="status-indicator ${chat.status === 'online' || isTyping ? 'online' : ''} ${isTyping ? 'typing' : ''}"></span>
      </div>
      <div class="chat-item-details">
        <div class="chat-item-row-1">
          <span class="chat-item-name">${chat.name}</span>
          <span class="chat-item-time">${previewTime}</span>
        </div>
        <div class="chat-item-row-2">
          <span class="chat-item-msg-preview ${isTyping ? 'typing-state' : ''}">
            ${isTyping ? 'typing...' : previewText}
          </span>
          <div class="chat-item-meta">
            ${ticksHtml}
            ${chat.unreadCount > 0 && !isActive ? `<span class="chat-item-unread">${chat.unreadCount}</span>` : ''}
          </div>
        </div>
      </div>
    `;

    itemEl.addEventListener("click", () => openChat(chat.id));
    chatListContainerEl.appendChild(itemEl);
  });
}

// ==========================================================================
// Open Chat Window
// ==========================================================================

function openChat(chatId) {
  state.activeChatId = chatId;
  
  // Reset unread count
  const chat = state.chats.find(c => c.id === chatId);
  if (chat) {
    chat.unreadCount = 0;
  }
  
  // Close details panel / search messages
  closeSearchMessages();
  state.replyingToMessage = null;
  replyPreviewContainer.classList.add("hidden");

  // Visual state updates
  renderChatList();
  
  // Reveal chat window structures
  emptyStateEl.classList.add("hidden");
  chatWindowEl.classList.remove("empty-state");
  chatHeaderEl.classList.remove("hidden");
  messageAreaEl.classList.remove("hidden");
  chatInputBarEl.classList.remove("hidden");

  // Support mobile layout sliding
  chatWindowEl.classList.add("active-mobile");

  // Render chat header details
  document.getElementById("activeContactAvatar").src = chat.avatar;
  document.getElementById("activeContactName").innerText = chat.name;
  updateHeaderStatus(chat);

  // Render messages
  renderMessages();
  scrollToBottom(true);
  
  // Focus text field
  messageInput.focus();
}

function updateHeaderStatus(chat) {
  const statusEl = document.getElementById("activeContactStatus");
  statusEl.className = "contact-status";
  
  if (chat.status === "typing...") {
    statusEl.innerText = "typing...";
    statusEl.classList.add("typing-state");
  } else if (chat.status === "online") {
    statusEl.innerText = "online";
  } else {
    statusEl.innerText = "offline";
  }
}

// ==========================================================================
// Render Messages with Groupings
// ==========================================================================

function renderMessages() {
  messageFeedEl.innerHTML = "";
  
  const chat = state.chats.find(c => c.id === state.activeChatId);
  if (!chat || chat.messages.length === 0) {
    messageFeedEl.innerHTML = `
      <div style="flex: 1; display: flex; justify-content: center; align-items: center; height: 100%; color: var(--text-muted); font-size: 0.9rem;">
        No messages. Say hello!
      </div>
    `;
    return;
  }

  let lastDateStr = "";
  
  chat.messages.forEach((msg, idx) => {
    // 1. DATE GROUPING SEPARATOR
    const msgDate = new Date(msg.timestamp);
    const dateStr = formatDateGroup(msgDate);
    
    if (dateStr !== lastDateStr) {
      const dateRow = document.createElement("div");
      dateRow.className = "message-date-group";
      dateRow.innerHTML = `<span class="message-date-badge">${dateStr}</span>`;
      messageFeedEl.appendChild(dateRow);
      lastDateStr = dateStr;
    }

    // 2. SENDER GROUPING & TAIL CALCULATION
    const prevMsg = chat.messages[idx - 1];
    let showSenderName = chat.phone.includes("Group") && msg.sender === "contact";
    let isTailNone = false;

    if (prevMsg) {
      const timeDiffMinutes = (new Date(msg.timestamp) - new Date(prevMsg.timestamp)) / 60000;
      // If same sender AND within 2 minutes AND date didn't change
      if (prevMsg.sender === msg.sender && 
          (!showSenderName || prevMsg.senderName === msg.senderName) && 
          timeDiffMinutes < 2 && 
          formatDateGroup(new Date(prevMsg.timestamp)) === dateStr) {
        isTailNone = true;
      }
    }

    // 3. BUILD BUBBLE HTML
    const rowEl = document.createElement("div");
    rowEl.className = `message-row ${msg.sender} ${isTailNone ? 'tail-none' : ''}`;
    rowEl.dataset.msgId = msg.id;

    // Checkticks
    let ticksHtml = "";
    if (msg.sender === "user") {
      const isRead = msg.status === "read";
      ticksHtml = `
        <svg class="tick-icon ${isRead ? 'read' : ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width: 13px; height: 13px; margin-left: 2px;">
          <polyline points="20 6 9 17 4 12"></polyline>
          ${msg.status !== 'sent' ? '<polyline points="20 12 13 19 9 15"></polyline>' : ''}
        </svg>
      `;
    }

    // Group name header
    let senderHeaderHtml = "";
    if (showSenderName && !isTailNone) {
      senderHeaderHtml = `<span class="message-sender">${msg.senderName}</span>`;
    }

    // Quoted reply
    let replyQuoteHtml = "";
    if (msg.replyTo) {
      const quotedMsg = chat.messages.find(m => m.id === msg.replyTo);
      if (quotedMsg) {
        const quoteSender = quotedMsg.sender === "user" ? "You" : (quotedMsg.senderName || chat.name);
        let quoteText = quotedMsg.text;
        if (quotedMsg.media) {
          quoteText = quotedMsg.media.type === "image" ? "📷 Image" : "📄 Document";
        }
        replyQuoteHtml = `
          <div class="message-reply-quote" data-quote-id="${quotedMsg.id}">
            <span class="quote-sender">${quoteSender}</span>
            <span class="quote-text">${quoteText}</span>
          </div>
        `;
      }
    }

    // Media attachment
    let mediaHtml = "";
    if (msg.media) {
      if (msg.media.type === "image") {
        mediaHtml = `
          <div class="message-media-container">
            <img src="${msg.media.url}" alt="Attachment" class="message-media-img">
          </div>
        `;
      }
    }

    // Starred badge
    let starHtml = "";
    if (msg.starred) {
      starHtml = `
        <span class="star-indicator" title="Starred">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        </span>
      `;
    }

    // Reactions html
    let reactionsBadgeHtml = "";
    if (msg.reactions && msg.reactions.length > 0) {
      const reactionCounts = {};
      msg.reactions.forEach(r => reactionCounts[r] = (reactionCounts[r] || 0) + 1);
      
      const distinctReactions = Object.keys(reactionCounts);
      reactionsBadgeHtml = `
        <div class="message-reactions-badge" data-msg-id="${msg.id}">
          <div class="reactions-list">${distinctReactions.slice(0, 3).join("")}</div>
          ${msg.reactions.length > 1 ? `<span class="reactions-count">${msg.reactions.length}</span>` : ''}
        </div>
      `;
    }

    rowEl.innerHTML = `
      <div class="message-bubble">
        ${senderHeaderHtml}
        ${replyQuoteHtml}
        ${mediaHtml}
        <div class="message-text">${highlightTextMatches(msg.text)}</div>
        <div class="message-footer">
          ${starHtml}
          <span class="message-time">${formatTimeOnly(msg.timestamp)}</span>
          ${ticksHtml}
        </div>
        ${reactionsBadgeHtml}
      </div>
    `;

    // Hook up context menu / right click listeners
    const bubbleEl = rowEl.querySelector(".message-bubble");
    bubbleEl.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      showContextMenu(msg.id, e.clientX, e.clientY);
    });

    // Tap to scroll to quote source
    const quoteEl = rowEl.querySelector(".message-reply-quote");
    if (quoteEl) {
      quoteEl.addEventListener("click", () => {
        const quoteId = quoteEl.dataset.quoteId;
        const targetEl = document.querySelector(`[data-msg-id="${quoteId}"]`);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          targetEl.classList.add("highlighted");
          setTimeout(() => targetEl.classList.remove("highlighted"), 2000);
        }
      });
    }

    messageFeedEl.appendChild(rowEl);
  });

  // 4. RENDERING CONTACT TYPING DOTS IF IN TYPING STATE
  if (chat.status === "typing...") {
    const typingRow = document.createElement("div");
    typingRow.className = "message-row other typing-bubble-row";
    typingRow.innerHTML = `
      <div class="typing-bubble">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    `;
    messageFeedEl.appendChild(typingRow);
  }
}

// Highlight matches in chat text if search is active
function highlightTextMatches(text) {
  if (!state.searchMsgQuery) return text;
  const regex = new RegExp(`(${state.searchMsgQuery.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
  return text.replace(regex, `<mark style="background-color: #f1c40f; color: #000; border-radius: 2px; padding: 0 2px;">$1</mark>`);
}

// ==========================================================================
// Scroll Management
// ==========================================================================

function scrollToBottom(force = false) {
  const scrollHeight = messageAreaEl.scrollHeight;
  const clientHeight = messageAreaEl.clientHeight;
  const scrollTop = messageAreaEl.scrollTop;

  // Only autoscroll if user was already near the bottom (within 150px) or forced
  const isNearBottom = (scrollHeight - clientHeight - scrollTop) < 150;
  
  if (isNearBottom || force) {
    messageAreaEl.scrollTop = scrollHeight;
    scrollDownBtn.classList.add("hidden");
    scrollDownBadge.classList.add("hidden");
    scrollDownBadge.innerText = "0";
  } else {
    // Show scroll down float badge
    scrollDownBtn.classList.remove("hidden");
  }
}

messageAreaEl.addEventListener("scroll", () => {
  const scrollHeight = messageAreaEl.scrollHeight;
  const clientHeight = messageAreaEl.clientHeight;
  const scrollTop = messageAreaEl.scrollTop;
  const isAtBottom = (scrollHeight - clientHeight - scrollTop) < 30;
  
  if (isAtBottom) {
    scrollDownBtn.classList.add("hidden");
    scrollDownBadge.classList.add("hidden");
    scrollDownBadge.innerText = "0";
  }
});

scrollDownBtn.addEventListener("click", () => scrollToBottom(true));

// ==========================================================================
// Core User Messaging Actions
// ==========================================================================

function sendMessage() {
  const text = messageInput.value.trim();
  if (!text && !state.replyingToMessage) return;

  const chat = state.chats.find(c => c.id === state.activeChatId);
  if (!chat) return;

  const newMsgId = "msg-" + Date.now();
  const newMsg = {
    id: newMsgId,
    sender: "user",
    text: text,
    timestamp: new Date().toISOString(),
    status: "sent",
    starred: false,
    reactions: []
  };

  if (state.replyingToMessage) {
    newMsg.replyTo = state.replyingToMessage.id;
    // Clear reply state
    state.replyingToMessage = null;
    replyPreviewContainer.classList.add("hidden");
  }

  chat.messages.push(newMsg);
  
  // Clear input
  messageInput.value = "";
  triggerInputResize();
  toggleSendIcon();
  
  // Re-render and scroll
  renderMessages();
  scrollToBottom(true);
  renderChatList();

  // Simulated deliveries status updates
  setTimeout(() => {
    newMsg.status = "delivered";
    renderMessages();
    renderChatList();
  }, 1000);

  // Trigger reply simulation
  triggerContactReplySimulation(chat, text);
}

// ==========================================================================
// Contact Reply Simulation (Advanced Typing Effects)
// ==========================================================================

function triggerContactReplySimulation(chat, userMessageText) {
  // If dad is offline, maybe dad won't reply immediately, but AI bot always replies.
  // We simulate typing behavior for all contacts for testing.
  
  setTimeout(() => {
    // 1. Contact turns "online"
    chat.status = "online";
    updateHeaderStatus(chat);
    renderChatList();

    setTimeout(() => {
      // 2. Contact turns "typing..."
      chat.status = "typing...";
      updateHeaderStatus(chat);
      renderChatList();
      renderMessages();
      scrollToBottom(true);

      // Change user message status to read (blue ticks) when contact starts typing
      chat.messages.forEach(m => {
        if (m.sender === "user" && m.status !== "read") {
          m.status = "read";
        }
      });
      renderMessages();

      // Typing length based on text content
      const replyDelay = 1500 + Math.random() * 1500;
      
      setTimeout(() => {
        // 3. Append response message
        chat.status = "online";
        const replyText = getSmartReply(chat.id, userMessageText);
        
        const responseMsg = {
          id: "msg-reply-" + Date.now(),
          sender: "contact",
          text: replyText,
          timestamp: new Date().toISOString(),
          status: "read",
          starred: false,
          reactions: []
        };

        // If it's a group, pick a random developer name
        if (chat.phone.includes("Group")) {
          const names = ["Alice (Dev)", "Bob (Lead)", "Charlie (QA)"];
          responseMsg.senderName = names[Math.floor(Math.random() * names.length)];
        }

        chat.messages.push(responseMsg);
        
        // Render and play custom vibration feel
        renderMessages();
        scrollToBottom(true);
        renderChatList();
        updateHeaderStatus(chat);

        // Put contact offline after 8 seconds if not AI or Group
        if (chat.id !== "antigravity" && chat.id !== "project-group") {
          setTimeout(() => {
            if (state.activeChatId === chat.id) {
              chat.status = "offline";
              updateHeaderStatus(chat);
              renderChatList();
            }
          }, 8000);
        }

      }, replyDelay);

    }, 800);

  }, 1000);
}

// Generate smart mock replies depending on contact persona and query
function getSmartReply(contactId, queryText) {
  const text = queryText.toLowerCase();
  
  if (contactId === "antigravity") {
    if (text.includes("help") || text.includes("how")) {
      return "Sure! For layout responsiveness, I recommend using a flex/grid setup with CSS custom variables. Toggling light/dark is as simple as adding `document.documentElement.setAttribute('data-theme', 'light')`. Try it out using the sun/moon icon at the top!";
    }
    if (text.includes("glassmorphism") || text.includes("glass")) {
      return "To achieve a nice glassmorphic effect in dark mode, try: `background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.1);`. It looks spectacular on dark slate gradients!";
    }
    if (text.includes("group") || text.includes("date")) {
      return "For grouping, I check the date transition between consecutive messages. If they differ, I render a dynamic `<div class='message-date-group'>` badge. Try sending a message and looking at the structure!";
    }
    return "Fascinating! I'm programmed to assist you with front-end web engineering, high-fidelity UI design, and advanced algorithms. Let me know what you'd like to build next.";
  }
  
  if (contactId === "sarah") {
    if (text.includes("design") || text.includes("mockup") || text.includes("figma")) {
      return "I'm updating the Figma board right now. I added some micro-interactions on hover and custom emojis. Take a look at the link in the shared media section of my profile!";
    }
    return "That sounds awesome! Let's schedule a design review call tomorrow at 10 AM. I want to double-check the spacing on smaller screens.";
  }

  if (contactId === "dad") {
    const jokes = [
      "Why don't skeletons fight each other? They don't have the guts.",
      "What do you call a fake noodle? An impasta.",
      "Why did the bullet end up losing its job? It got fired.",
      "How does a penguin build its house? Igloos it together!"
    ];
    if (text.includes("joke")) {
      return `Here's a good one: ${jokes[Math.floor(Math.random() * jokes.length)]}`;
    }
    return "Great! Text me when you leave the office. Don't forget to buy milk on your way back.";
  }

  if (contactId === "project-group") {
    const groupResponses = [
      "Understood, checking the latest commits now.",
      "Should we merge the UI styling branch into master?",
      "I'm on it. Let's aim for deployment in 2 hours.",
      "Perfect! Let's jump on a quick huddle if we hit any bugs."
    ];
    return groupResponses[Math.floor(Math.random() * groupResponses.length)];
  }

  return "Thanks for the message! I'll read and reply as soon as I get a moment.";
}

// ==========================================================================
// Theme Toggling (Dark / Light Mode)
// ==========================================================================

themeToggleBtn.addEventListener("click", () => {
  const currentTheme = docHtml.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  
  docHtml.setAttribute("data-theme", newTheme);
  localStorage.setItem("talk-theme", newTheme);
});

// ==========================================================================
// Sidebar & Text Input Event Listeners
// ==========================================================================

function setupEventListeners() {
  // Chat list filter search
  chatSearchInput.addEventListener("input", (e) => {
    state.searchQuery = e.target.value;
    if (state.searchQuery) {
      clearSearchBtn.style.display = "flex";
    } else {
      clearSearchBtn.style.display = "none";
    }
    renderChatList();
  });

  clearSearchBtn.addEventListener("click", () => {
    chatSearchInput.value = "";
    state.searchQuery = "";
    clearSearchBtn.style.display = "none";
    renderChatList();
    chatSearchInput.focus();
  });

  // Enter key inside message input to send
  messageInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  messageInput.addEventListener("input", () => {
    triggerInputResize();
    toggleSendIcon();
  });

  sendBtn.addEventListener("click", () => {
    const isMicIcon = sendBtn.querySelector(".send-icon").classList.contains("hidden");
    if (isMicIcon) {
      // Mock starting voice recording
      alert("🎙️ Voice recording feature is a mock demonstration!");
    } else {
      sendMessage();
    }
  });

  // Toggle Emoji Picker dropdown
  emojiToggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    attachmentMenuEl.classList.remove("show");
    const isExpanded = emojiPickerEl.classList.toggle("show");
    emojiToggleBtn.setAttribute("aria-expanded", isExpanded);
  });

  // Toggle Attachment dropdown
  attachmentToggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    emojiPickerEl.classList.remove("show");
    const isExpanded = attachmentMenuEl.classList.toggle("show");
    attachmentToggleBtn.setAttribute("aria-expanded", isExpanded);
  });

  // Close menus on clicking outside
  document.addEventListener("click", (e) => {
    if (!emojiPickerEl.contains(e.target) && e.target !== emojiToggleBtn && !emojiToggleBtn.contains(e.target)) {
      emojiPickerEl.classList.remove("show");
      emojiToggleBtn.setAttribute("aria-expanded", "false");
    }
    if (!attachmentMenuEl.contains(e.target) && e.target !== attachmentToggleBtn && !attachmentToggleBtn.contains(e.target)) {
      attachmentMenuEl.classList.remove("show");
      attachmentToggleBtn.setAttribute("aria-expanded", "false");
    }
    
    // Close context menu
    messageContextMenuEl.style.display = "none";
    
    // Close sidebar dropdown menu
    document.getElementById("sidebarMenu").classList.remove("show");
  });

  // Header Dropdown Menu triggers
  document.getElementById("sidebarMenuBtn").addEventListener("click", (e) => {
    e.stopPropagation();
    document.getElementById("sidebarMenu").classList.toggle("show");
  });

  // Contact Info Drawer toggles
  toggleInfoBtn.addEventListener("click", () => {
    infoDrawerEl.classList.toggle("collapsed");
    renderStarredDrawerList();
  });

  closeDrawerBtn.addEventListener("click", () => {
    infoDrawerEl.classList.add("collapsed");
  });

  // Sidebar info drawer opening
  document.getElementById("activeContactHeaderInfo").addEventListener("click", () => {
    infoDrawerEl.classList.remove("collapsed");
    renderStarredDrawerList();
  });

  // Profile modal settings toggles
  userProfileBtn.addEventListener("click", () => {
    document.getElementById("avatarSeedInput").value = state.currentUser.avatarSeed;
    document.getElementById("profileNameInput").value = state.currentUser.name;
    document.getElementById("profileStatusInput").value = state.currentUser.about;
    document.getElementById("modalUserAvatar").src = `https://api.dicebear.com/7.x/adventurer/svg?seed=${state.currentUser.avatarSeed}`;
    profileModalEl.classList.remove("hidden");
  });

  const closeProfile = () => profileModalEl.classList.add("hidden");
  closeProfileModalBtn.addEventListener("click", closeProfile);
  cancelProfileBtn.addEventListener("click", closeProfile);
  
  document.getElementById("regenerateAvatarBtn").addEventListener("click", () => {
    const seed = document.getElementById("avatarSeedInput").value.trim() || "Felix";
    document.getElementById("modalUserAvatar").src = `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`;
  });

  saveProfileBtn.addEventListener("click", () => {
    const seed = document.getElementById("avatarSeedInput").value.trim() || "Felix";
    const name = document.getElementById("profileNameInput").value.trim() || "You";
    const about = document.getElementById("profileStatusInput").value.trim() || "Available";

    state.currentUser.avatarSeed = seed;
    state.currentUser.name = name;
    state.currentUser.about = about;

    document.getElementById("myAvatar").src = `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`;
    document.querySelector(".user-name").innerText = name;
    document.querySelector(".user-status").innerText = about;

    closeProfile();
  });

  // Mobile Back button navigation
  backToSidebarBtn.addEventListener("click", () => {
    chatWindowEl.classList.remove("active-mobile");
    state.activeChatId = null;
    renderChatList();
  });

  // Attachment mocks
  document.getElementById("attachImage").addEventListener("click", () => mockAttachMedia("image"));
  document.getElementById("attachDoc").addEventListener("click", () => mockAttachMedia("document"));
  document.getElementById("attachCamera").addEventListener("click", () => mockAttachMedia("camera"));
  document.getElementById("attachContact").addEventListener("click", () => mockAttachMedia("contact"));

  // Header Dropdown Menu actions
  document.getElementById("menuProfile").addEventListener("click", () => userProfileBtn.click());
  document.getElementById("menuSettings").addEventListener("click", () => alert("⚙️ Settings configuration is a mock panel!"));
  document.getElementById("menuStarred").addEventListener("click", () => {
    infoDrawerEl.classList.remove("collapsed");
    renderStarredDrawerList();
  });
  document.getElementById("menuLogout").addEventListener("click", () => alert("Logged out successfully. Reload the page to restart."));

  // Star list toggle on block/mute mock
  document.getElementById("blockContactBtn").addEventListener("click", () => alert("🚫 Contact has been blocked."));
  document.getElementById("muteContactBtn").addEventListener("click", () => alert("🔕 Chat notifications have been muted."));

  // Message Search Bar toggles
  searchChatMessagesBtn.addEventListener("click", toggleMessageSearchBox);
  closeSearchMsgBtn.addEventListener("click", closeSearchMessages);
  searchMsgInput.addEventListener("input", filterMessagesInFeed);
  prevSearchMsgBtn.addEventListener("click", () => navigateSearchHighlights(-1));
  nextSearchMsgBtn.addEventListener("click", () => navigateSearchHighlights(1));
}

// ==========================================================================
// Textarea Auto-Growing & Send Transition
// ==========================================================================

function triggerInputResize() {
  messageInput.style.height = "auto";
  const newHeight = Math.min(messageInput.scrollHeight - 6, 100);
  messageInput.style.height = `${newHeight}px`;
}

function toggleSendIcon() {
  const sendIcon = sendBtn.querySelector(".send-icon");
  const micIcon = sendBtn.querySelector(".mic-icon");
  
  if (messageInput.value.trim().length > 0) {
    sendIcon.classList.remove("hidden");
    micIcon.classList.add("hidden");
  } else {
    sendIcon.classList.add("hidden");
    micIcon.classList.remove("hidden");
  }
}

// ==========================================================================
// Quoted Reply Actions
// ==========================================================================

function setupReplyState(msg) {
  state.replyingToMessage = msg;
  const chat = state.chats.find(c => c.id === state.activeChatId);
  const senderName = msg.sender === "user" ? "You" : (msg.senderName || chat.name);
  
  let textPreview = msg.text;
  if (msg.media) {
    textPreview = msg.media.type === "image" ? "📷 Image" : "📄 Document";
  }

  replyPreviewSender.innerText = senderName;
  replyPreviewText.innerText = textPreview;
  replyPreviewContainer.classList.remove("hidden");
  
  messageInput.focus();
}

closeReplyPreviewBtn.addEventListener("click", () => {
  state.replyingToMessage = null;
  replyPreviewContainer.classList.add("hidden");
});

// ==========================================================================
// Custom Message Context Menu (Reactions, Delete, Star, Reply)
// ==========================================================================

function showContextMenu(msgId, clientX, clientY) {
  state.contextMenuMessageId = msgId;
  const chat = state.chats.find(c => c.id === state.activeChatId);
  const msg = chat.messages.find(m => m.id === msgId);
  
  if (!msg) return;

  // Toggle Star text based on state
  const starTextEl = document.getElementById("contextStarText");
  starTextEl.innerText = msg.starred ? "Unstar Message" : "Star Message";

  // Setup bounds for positioning safely
  messageContextMenuEl.style.display = "flex";
  
  const menuWidth = messageContextMenuEl.offsetWidth || 180;
  const menuHeight = messageContextMenuEl.offsetHeight || 250;
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  let posX = clientX;
  let posY = clientY;

  // Horizontal check
  if (clientX + menuWidth > windowWidth) {
    posX = clientX - menuWidth;
  }
  // Vertical check
  if (clientY + menuHeight > windowHeight) {
    posY = clientY - menuHeight;
  }

  messageContextMenuEl.style.left = `${posX}px`;
  messageContextMenuEl.style.top = `${posY}px`;

  // Attach context item listeners
  const handleAction = (action) => {
    messageContextMenuEl.style.display = "none";
    performContextAction(action, msg);
  };

  document.getElementById("contextReply").onclick = () => handleAction("reply");
  document.getElementById("contextStar").onclick = () => handleAction("star");
  document.getElementById("contextCopy").onclick = () => handleAction("copy");
  document.getElementById("contextDelete").onclick = () => handleAction("delete");

  // React button bindings
  const reactionBtns = messageContextMenuEl.querySelectorAll(".reaction-btn");
  reactionBtns.forEach(btn => {
    btn.onclick = () => {
      const reaction = btn.dataset.reaction;
      messageContextMenuEl.style.display = "none";
      toggleReactionOnMessage(msg, reaction);
    };
  });
}

function performContextAction(action, msg) {
  if (action === "reply") {
    setupReplyState(msg);
  } else if (action === "star") {
    msg.starred = !msg.starred;
    renderMessages();
    renderStarredDrawerList();
  } else if (action === "copy") {
    navigator.clipboard.writeText(msg.text).then(() => {
      // Small toast mock
      alert("📋 Text copied to clipboard!");
    });
  } else if (action === "delete") {
    const chat = state.chats.find(c => c.id === state.activeChatId);
    chat.messages = chat.messages.filter(m => m.id !== msg.id);
    renderMessages();
    renderChatList();
  }
}

function toggleReactionOnMessage(msg, reaction) {
  if (!msg.reactions) msg.reactions = [];
  
  const idx = msg.reactions.indexOf(reaction);
  if (idx > -1) {
    msg.reactions.splice(idx, 1); // remove
  } else {
    msg.reactions.push(reaction); // add
  }
  
  renderMessages();
}

// Handle clicking reaction badge on bubble directly to remove
document.addEventListener("click", (e) => {
  const badge = e.target.closest(".message-reactions-badge");
  if (badge) {
    const msgId = badge.dataset.msgId;
    const chat = state.chats.find(c => c.id === state.activeChatId);
    const msg = chat.messages.find(m => m.id === msgId);
    if (msg && msg.reactions.length > 0) {
      msg.reactions.pop(); // remove last
      renderMessages();
    }
  }
});

// ==========================================================================
// Shared Media & Starred Messages Info Panel drawer
// ==========================================================================

function renderStarredDrawerList() {
  const starredListEl = document.getElementById("drawerStarredList");
  starredListEl.innerHTML = "";

  const chat = state.chats.find(c => c.id === state.activeChatId);
  if (!chat) return;

  // Render info details
  document.getElementById("drawerAvatar").src = chat.avatar;
  document.getElementById("drawerContactName").innerText = chat.name;
  document.getElementById("drawerContactPhone").innerText = chat.phone;
  document.getElementById("drawerAboutText").innerText = chat.about;

  const badgeEl = document.getElementById("drawerStatusBadge");
  badgeEl.className = `drawer-status-badge ${chat.status === 'online' || chat.status === 'typing...' ? 'online' : ''}`;
  badgeEl.innerText = chat.status === "typing..." ? "typing..." : chat.status;

  const starredMsgs = chat.messages.filter(m => m.starred);

  if (starredMsgs.length === 0) {
    starredListEl.innerHTML = `<p class="no-starred">No starred messages in this chat.</p>`;
    return;
  }

  starredMsgs.forEach(msg => {
    const item = document.createElement("div");
    item.className = "starred-item-bubble";
    
    let textPreview = msg.text;
    if (msg.media) {
      textPreview = msg.media.type === "image" ? "📷 Image attachment" : "📄 Document attachment";
    }

    item.innerHTML = `
      <div style="font-weight: 600; font-size: 0.78rem; color: var(--accent-color); margin-bottom: 2px;">
        ${msg.sender === "user" ? "You" : chat.name}
      </div>
      <div>${textPreview}</div>
      <span class="starred-item-time">${formatTimeBrief(msg.timestamp)}</span>
    `;

    // Click to scroll to target starred message
    item.addEventListener("click", () => {
      const targetEl = document.querySelector(`[data-msg-id="${msg.id}"]`);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        targetEl.classList.add("highlighted");
        setTimeout(() => targetEl.classList.remove("highlighted"), 2000);
      }
    });

    starredListEl.appendChild(item);
  });
}

// ==========================================================================
// In-Chat Message Text Search
// ==========================================================================

function toggleMessageSearchBox() {
  searchMessagesBar.classList.toggle("hidden");
  if (!searchMessagesBar.classList.contains("hidden")) {
    searchMsgInput.focus();
  } else {
    closeSearchMessages();
  }
}

function closeSearchMessages() {
  searchMessagesBar.classList.add("hidden");
  searchMsgInput.value = "";
  state.searchMsgQuery = "";
  state.searchMsgMatches = [];
  state.searchMsgActiveIndex = -1;
  searchMsgCount.innerText = "0/0";
  renderMessages();
}

function filterMessagesInFeed() {
  const query = searchMsgInput.value.trim().toLowerCase();
  state.searchMsgQuery = query;
  
  if (!query) {
    state.searchMsgMatches = [];
    state.searchMsgActiveIndex = -1;
    searchMsgCount.innerText = "0/0";
    renderMessages();
    return;
  }

  // Force re-render with marks highlighted
  renderMessages();

  // Find all matched highlight elements
  const allMarks = Array.from(messageFeedEl.querySelectorAll("mark"));
  state.searchMsgMatches = allMarks.map(mark => mark.closest(".message-row"));
  
  if (state.searchMsgMatches.length > 0) {
    state.searchMsgActiveIndex = 0;
    searchMsgCount.innerText = `1/${state.searchMsgMatches.length}`;
    scrollToHighlightedMatch();
  } else {
    state.searchMsgActiveIndex = -1;
    searchMsgCount.innerText = "0/0";
  }
}

function navigateSearchHighlights(direction) {
  const count = state.searchMsgMatches.length;
  if (count === 0) return;

  state.searchMsgActiveIndex = (state.searchMsgActiveIndex + direction + count) % count;
  searchMsgCount.innerText = `${state.searchMsgActiveIndex + 1}/${count}`;
  scrollToHighlightedMatch();
}

function scrollToHighlightedMatch() {
  const targetRow = state.searchMsgMatches[state.searchMsgActiveIndex];
  if (targetRow) {
    targetRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Pulse animation trigger
    const bubble = targetRow.querySelector(".message-bubble");
    bubble.style.boxShadow = "0 0 0 3px #f1c40f";
    setTimeout(() => {
      bubble.style.boxShadow = "";
    }, 1500);
  }
}

// ==========================================================================
// Mock Attachment Media Loader
// ==========================================================================

function mockAttachMedia(type) {
  const chat = state.chats.find(c => c.id === state.activeChatId);
  if (!chat) return;

  attachmentMenuEl.classList.remove("show");

  let mediaObj = null;
  let textMsg = "";

  if (type === "image") {
    mediaObj = {
      type: "image",
      url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400"
    };
    textMsg = "Check out this beautiful abstract design background!";
  } else if (type === "document") {
    mediaObj = {
      type: "document",
      url: "#"
    };
    textMsg = "Shared PDF document: Project_Briefing_2026.pdf";
  } else if (type === "camera") {
    mediaObj = {
      type: "image",
      url: "https://images.unsplash.com/photo-1493612276216-ee3925520721?auto=format&fit=crop&q=80&w=400"
    };
    textMsg = "Captured photo from desk camera 📸";
  } else {
    textMsg = "Shared Contact Details: Jane Doe (+1-555-019-2834)";
  }

  const newMsg = {
    id: "msg-media-" + Date.now(),
    sender: "user",
    text: textMsg,
    timestamp: new Date().toISOString(),
    status: "sent",
    starred: false,
    reactions: [],
    media: mediaObj
  };

  chat.messages.push(newMsg);
  renderMessages();
  scrollToBottom(true);
  renderChatList();

  setTimeout(() => {
    newMsg.status = "delivered";
    renderMessages();
    renderChatList();
  }, 1000);

  triggerContactReplySimulation(chat, textMsg);
}

// ==========================================================================
// Time & Date Formatter Utilities
// ==========================================================================

function formatTimeOnly(isoString) {
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatTimeBrief(isoString) {
  const date = new Date(isoString);
  const now = new Date();
  
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 1 && date.getDate() === now.getDate()) {
    return formatTimeOnly(isoString);
  } else if (diffDays <= 2 && date.getDate() === now.getDate() - 1) {
    return "Yesterday";
  } else if (diffDays <= 7) {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[date.getDay()];
  } else {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
}

function formatDateGroup(dateObj) {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  if (dateObj.toDateString() === now.toDateString()) {
    return "Today";
  } else if (dateObj.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  } else {
    return dateObj.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }
}
