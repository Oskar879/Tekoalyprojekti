// Alustetaan muisti selaimen localStorageen
let aiMemory = JSON.parse(localStorage.getItem("aiMemory")) || [];

// Funktio, jolla tekoäly vastaa tekstillä
function getResponse(input) {
  const responses = {
    "hei": "Hei siellä!",
    "mitä kuuluu": "Kuuluu hyvää, entä sinulle?",
    "kuka olet": "Olen selaintekoälysi, joka oppii muistamaan sinut!",
  };
  return responses[input.toLowerCase()] || "En ymmärtänyt, voitko toistaa?";
}

// Päivitä chat-ikkuna
function addMessage(sender, text) {
  const box = document.getElementById("chat-box");
  const msg = document.createElement("p");
  msg.textContent = `${sender}: ${text}`;
  box.appendChild(msg);
  box.scrollTop = box.scrollHeight;
}

// Puhuminen ääneen
function speak(text) {
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "fi-FI";
  speechSynthesis.speak(utter);
}

// Kuunteleminen
const listenBtn = document.getElementById("listen-btn");
listenBtn.addEventListener("click", () => {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "fi-FI";
  recognition.start();

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    addMessage("Sinä", transcript);
    aiMemory.push({ user: transcript });
    localStorage.setItem("aiMemory", JSON.stringify(aiMemory));

    const response = getResponse(transcript);
    addMessage("Tekoäly", response);
    speak(response);
  };
});

// Puhu-nappi testiksi (antaa valmiin viestin)
document.getElementById("talk-btn").addEventListener("click", () => {
  const text = "Tämä on testiviesti. Kuinka voin auttaa sinua?";
  addMessage("Tekoäly", text);
  speak(text);

  // Lähetä-nappi
document.getElementById("send-btn").addEventListener("click", () => {
  const input = document.getElementById("user-input");
  const text = input.value.trim();

  if (text === "") return;

  addMessage("Sinä", text);
  aiMemory.push({ user: text });
  localStorage.setItem("aiMemory", JSON.stringify(aiMemory));

  const response = getResponse(text);
  addMessage("Tekoäly", response);
  speak(response);

  input.value = ""; // Tyhjennä tekstikenttä

  document.getElementById("user-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    document.getElementById("send-btn").click();
  }
});
});
});
