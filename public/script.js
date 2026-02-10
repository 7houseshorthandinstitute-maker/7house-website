const firebaseConfig = { databaseURL: "https://house-shorthand-default-rtdb.firebaseio.com/" };
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let allData = [];
let correctText = "";
let timerInterval;

// Data Fetching
db.ref('dictations').on('value', (snap) => {
    allData = [];
    snap.forEach(child => { allData.push(child.val()); });
});

function showCategory(cat) {
    document.getElementById('mainNav').style.display = 'none';
    if(cat === '7House') {
        document.getElementById('subHouseNav').style.display = 'flex';
    } else {
        renderFiles('Kailash');
    }
}

function filterSub(subType) {
    document.getElementById('subHouseNav').style.display = 'none';
    renderFiles(subType);
}

function renderFiles(filter) {
    const container = document.getElementById('files-container');
    const header = document.getElementById('listHeader');
    container.innerHTML = "";
    container.style.display = 'flex';
    header.style.display = 'flex';
    document.getElementById('categoryTitle').innerText = filter + " Dictations";

    allData.filter(d => d.category === filter).forEach(d => {
        container.innerHTML += `
            <div class="file-icon" onclick="load('${d.title}', '${d.audioUrl}', \`${d.text}\`)">
                <i class="fa-solid fa-file-audio"></i><br>
                <small>${d.title}</small>
            </div>`;
    });
}

function goHome() {
    location.reload(); // Simplest way to reset view
}

function backToSub() {
    document.getElementById('files-container').style.display = 'none';
    document.getElementById('listHeader').style.display = 'none';
    document.getElementById('practiceArea').style.display = 'none';
    document.getElementById('mainNav').style.display = 'flex';
}

function load(title, url, text) {
    document.getElementById('practiceArea').style.display = 'block';
    document.getElementById('curTitle').innerText = title;
    document.getElementById('player').src = url;
    correctText = text;
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

// ... Start and Check functions remain the same as previous response ...
function start() {
    document.getElementById('player').play();
    document.getElementById('typingArea').disabled = false;
    document.getElementById('typingArea').focus();
    let timeLeft = 3000;
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        let mins = Math.floor(timeLeft/60); let secs = timeLeft%60;
        document.getElementById('timerDisplay').innerText = `${mins}:${secs<10?'0'+secs:secs}`;
        if(timeLeft<=0) { clearInterval(timerInterval); check(); }
    }, 1000);
}

function check() {
    clearInterval(timerInterval);
    const typed = document.getElementById('typingArea').value.trim();
    const original = correctText.trim().split(/\s+/);
    const typedWords = typed.split(/\s+/);
    let mistakes = 0; let html = "";
    original.forEach((w, i) => {
        let uW = typedWords[i] || "";
        if(uW.toLowerCase().replace(/[.,#!]/g,"") === w.toLowerCase().replace(/[.,#!]/g,"") && uW !== "") {
            html += `<span style="color:green">${w} </span>`;
        } else {
            mistakes++;
            html += `<span style="color:red">${uW || '___'}</span> <small style="color:blue">(${w})</small> `;
        }
    });
    document.getElementById('stats').innerHTML = `<h3>Mistakes: ${mistakes} | Accuracy: ${(100 - (mistakes/original.length*100)).toFixed(2)}%</h3>`;
    document.getElementById('comparison').innerHTML = html;
    document.getElementById('resultBox').style.display = "block";
}