let name = "";
while (name === null || name.trim() === "") {
  name = prompt("Please enter your name to continue :");
}

let chatArea = document.querySelector("#chat-area");
var socket = io({
  query: {
    user: name,
  },
});

chatArea.appendChild(newJoinedUser("You", "Joined"));
socket.on("new_user", function (user) {
  chatArea.appendChild(newJoinedUser(user.newUser, "Joined"));
  document.querySelector("#countUsers").innerHTML = Object.keys(
    user.room
  ).length;
});

socket.on("user_left", function (user) {
  console.log(user);
  chatArea.appendChild(newJoinedUser(user.userLeft, "Leave"));
  document.querySelector("#countUsers").innerHTML = Object.keys(
    user.room
  ).length;
});
socket.on("usersList", function (user) {
  document.querySelector("#countUsers").innerHTML = Object.keys(
    user.room
  ).length;
});
socket.on("user-message", function (msg) {
  const currentTime = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  chatArea.appendChild(userMessageHTML(msg.user, currentTime, msg.msg));
  chatArea.scrollTop = chatArea.scrollHeight;
});

let form = document.querySelector("#message-form");
let input = document.querySelector("#user-message");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (input.value) {
    socket.emit("chat-message", { msg: input.value, user: name });
    const currentTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    chatArea.appendChild(myMessageHTML(name, currentTime, input.value));
    chatArea.scrollTop = chatArea.scrollHeight;
    input.value = "";
  }
});

function myMessageHTML(senderName, sendingTime, messageText) {
  // Create parent container
  const divContainer = document.createElement("div");
  divContainer.classList.add("msg", "right-msg");

  // Create message bubble
  const divBubble = document.createElement("div");
  divBubble.classList.add("msg-bubble");

  // Create message info
  const divInfo = document.createElement("div");
  divInfo.classList.add("msg-info");

  // Create message sender's name
  const divName = document.createElement("div");
  divName.classList.add("msg-info-name");
  divName.textContent = senderName;

  // Create message sending time
  const divTime = document.createElement("div");
  divTime.classList.add("msg-info-time");
  divTime.textContent = sendingTime;

  // Append name and time to info container
  divInfo.appendChild(divName);
  divInfo.appendChild(divTime);

  // Create message text
  const divText = document.createElement("div");
  divText.classList.add("msg-text");
  divText.textContent = messageText;

  // Append info and text to message bubble
  divBubble.appendChild(divInfo);
  divBubble.appendChild(divText);

  // Append message bubble to container
  divContainer.appendChild(divBubble);

  return divContainer;
}

function userMessageHTML(senderName, sendingTime, messageText) {
  // Create parent container
  const divContainer = document.createElement("div");
  divContainer.classList.add("msg", "left-msg");

  // Create message bubble
  const divBubble = document.createElement("div");
  divBubble.classList.add("msg-bubble");

  // Create message info
  const divInfo = document.createElement("div");
  divInfo.classList.add("msg-info");

  // Create message sender's name
  const divName = document.createElement("div");
  divName.classList.add("msg-info-name");
  divName.textContent = senderName;

  // Create message sending time
  const divTime = document.createElement("div");
  divTime.classList.add("msg-info-time");
  divTime.textContent = sendingTime;

  // Append name and time to info container
  divInfo.appendChild(divName);
  divInfo.appendChild(divTime);

  // Create message text
  const divText = document.createElement("div");
  divText.classList.add("msg-text");
  divText.textContent = messageText;

  // Append info and text to message bubble
  divBubble.appendChild(divInfo);
  divBubble.appendChild(divText);

  // Append message bubble to container
  divContainer.appendChild(divBubble);

  return divContainer;
}

function newJoinedUser(username, status) {
  const divContainer = document.createElement("div");
  divContainer.className = "new-user";
  divContainer.style.display = "flex";
  divContainer.style.justifyContent = "center";

  const paragraph = document.createElement("p");
  paragraph.className = "msg-info msg-bubble";
  paragraph.textContent = `${username} ${status} the chat!`;

  divContainer.appendChild(paragraph);

  return divContainer;
}
