const TIME_LIMIT = 12;
const STORAGE_KEY = "quiz_high_scores_v1";

const qs = [
  {
    q: "Which language runs in a browser?",
    o: ["Java", "C++", "JavaScript", "Python"],
    a: 2,
    h: "Starts like Java but is not Java.",
  },
  {
    q: "Which tag holds JavaScript?",
    o: ["<js>", "<script>", "<javascript>", "<code>"],
    a: 1,
    h: "It literally says script.",
  },
  {
    q: "What does CSS stand for?",
    o: [
      "Cascading Style Sheets",
      "Coding Style System",
      "Creative Style Syntax",
      "Color Styling Sheet",
    ],
    a: 0,
    h: "Used for styling web pages.",
  },
  {
    q: "HTML is used to?",
    o: ["Style pages", "Structure pages", "Add logic", "Hack sites"],
    a: 1,
    h: "It builds webpage skeletons.",
  },
  {
    q: "Which is NOT a programming language?",
    o: ["Python", "Ruby", "HTML", "Java"],
    a: 2,
    h: "It is markup, not logic.",
  },
  {
    q: "JS function keyword?",
    o: ["func", "function", "method", "def"],
    a: 1,
    h: "It starts with fun.",
  },
  {
    q: "Which array method adds to end?",
    o: ["push", "pop", "shift", "slice"],
    a: 0,
    h: "Push pushes to the end.",
  },
  {
    q: "Which compares strict equality?",
    o: ["==", "!=", "===", "="],
    a: 2,
    h: "Three equals.",
  },
  {
    q: "Which CSS makes text bigger?",
    o: ["font-size", "text-scale", "size-text", "bigger-text"],
    a: 0,
    h: "Controls typography.",
  },
  {
    q: "Node.js is used for?",
    o: ["Backend JS", "Styling", "Markup", "Mobile apps only"],
    a: 0,
    h: "JS outside the browser.",
  },
];

let i = 0,
  score = 0,
  timeLeft = TIME_LIMIT,
  timer;

const start = document.getElementById("start");
const quiz = document.getElementById("quiz");
const end = document.getElementById("end");
const scores = document.getElementById("scores");
const qEl = document.getElementById("question");
const optEl = document.getElementById("options");
const fb = document.getElementById("feedback");
const timerEl = document.getElementById("timer");

document.getElementById("startBtn").onclick = () => {
  begin();
};
document.getElementById("nextBtn").onclick = () => {
  i++;
  i < qs.length ? loadQ() : finish();
};
document.getElementById("restart").onclick = () => {
  end.classList.add("hidden");
  start.classList.remove("hidden");
};
document.getElementById("showScores").onclick = () => showScores();
document.getElementById("back").onclick = () => {
  scores.classList.add("hidden");
  start.classList.remove("hidden");
};
document.getElementById("clearScores").onclick = () => {
  localStorage.removeItem(STORAGE_KEY);
  showScores();
};
document.getElementById("saveScore").onclick = saveHighScore;

function begin() {
  i = 0;
  score = 0;
  start.classList.add("hidden");
  quiz.classList.remove("hidden");
  loadQ();
}

function loadQ() {
  clearInterval(timer);
  timeLeft = TIME_LIMIT;
  updateTimer();
  timer = setInterval(countdown, 1000);

  fb.classList.add("hidden");
  document.getElementById("nextBtn").classList.add("hidden");

  const q = qs[i];
  qEl.textContent = q.q;
  optEl.innerHTML = "";

  q.o.forEach((t, idx) => {
    const b = document.createElement("button");
    b.textContent = t;
    b.onclick = () => select(idx);
    optEl.appendChild(b);
  });
}

function countdown() {
  timeLeft--;
  updateTimer();
  if (timeLeft <= 0) {
    clearInterval(timer);
    timeUp();
  }
}

function updateTimer() {
  timerEl.textContent = "Time left: " + timeLeft + "s";
}

function select(idx) {
  clearInterval(timer);
  disable();
  const q = qs[i];
  fb.classList.remove("hidden");
  if (idx === q.a) {
    score++;
    fb.className = "feedback correct";
    fb.textContent = "Correct!";
  } else {
    fb.className = "feedback wrong";
    fb.textContent = "Wrong! Hint: " + q.h;
  }
  document.getElementById("nextBtn").classList.remove("hidden");
}

function timeUp() {
  disable();
  fb.className = "feedback wrong";
  fb.textContent = "Time up! Hint: " + qs[i].h;
  fb.classList.remove("hidden");
  document.getElementById("nextBtn").classList.remove("hidden");
}

function disable() {
  optEl.querySelectorAll("button").forEach((b) => b.classList.add("disabled"));
}

function finish() {
  quiz.classList.add("hidden");
  end.classList.remove("hidden");
  document.getElementById("finalScore").textContent = score + " / " + qs.length;
}

function saveHighScore() {
  const name = document.getElementById("nameInput").value || "Player";
  const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  list.push({ name, score });
  list.sort((a, b) => b.score - a.score);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, 10)));
  showScores();
}

function showScores() {
  start.classList.add("hidden");
  quiz.classList.add("hidden");
  end.classList.add("hidden");
  scores.classList.remove("hidden");
  const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  let html = "<ol>";
  list.forEach((s) => (html += `<li>${s.name} - ${s.score}</li>`));
  html += "</ol>";
  document.getElementById("scoreList").innerHTML = html;
}
