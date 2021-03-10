const ws = new WebSocket("ws://localhost:3000");

ws.onmessage = (msg) => {
  renderMessages(JSON.parse(msg.data));
};

const renderMessages = (data) => {
  let html = "";
  for (let i = 0; i < data.length; i++) {
    let json = JSON.parse(data[i]);
    html += `<p> Message: ${json.message}, Author: ${json.author}, TS: ${json.ts}</p>`
  }
  document.getElementById("messages").innerHTML = html;
};

const handleSubmit = (evt) => {
  evt.preventDefault();
  const message = document.getElementById("message");
  const author = document.getElementById("author");
  let data = {
    message: message.value,
    author: author.value,
    ts: Date.now()
  }
  let dataValue = JSON.stringify(data);
  ws.send(dataValue);
  dataValue = "";
  message.value = "";
  author.value = "";
};

const form = document.getElementById("form");
form.addEventListener("submit", handleSubmit);