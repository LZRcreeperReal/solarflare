document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab');
    const contents = document.querySelectorAll('.tab-content');
    const menuBtn = document.querySelector('.menu-btn');
    const menuOverlay = document.querySelector('.menu-overlay');
    const closeMenu = document.querySelector('.close-menu');
    const cloakSelect = document.getElementById('cloak-select');
    const applyCloak = document.getElementById('apply-cloak');
    const gamesList = document.getElementById('games-list');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');

    const games = [
        {name:"1v1.LOL",file:"1v1lol.html"},
        {name:"Retro Bowl",file:"retro-bowl.html"},
        {name:"Slope",file:"slope.html"},
        {name:"Basket Random",file:"basket-random.html"},
        {name:"Drift Hunters",file:"drift-hunters.html"},
        {name:"Cookie Clicker",file:"cookie-clicker.html"},
        {name:"Shell Shockers",file:"shellshockers.html"},
        {name:"Krunker",file:"krunker.html"},
        {name:"Basketball Stars",file:"basketball-stars.html"},
        {name:"BitLife",file:"bitlife.html"}
    ];

    tabs.forEach(tab => tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.add('hidden'));
        tab.classList.add('active');
        document.getElementById(tab.dataset.tab + '-tab').classList.remove('hidden');
        if (tab.dataset.tab === 'games') loadGames();
    }));

    function loadGames() {
        gamesList.innerHTML = '';
        games.forEach(game => {
            const li = document.createElement('li');
            li.textContent = game.name;
            li.onclick = () => window.location = 'games/' + game.file;
            gamesList.appendChild(li);
        });
    }

    menuBtn.onclick = () => menuOverlay.classList.remove('hidden');
    closeMenu.onclick = () => menuOverlay.classList.add('hidden');
    menuOverlay.onclick = (e) => { if(e.target === menuOverlay) menuOverlay.classList.add('hidden'); };

    applyCloak.onclick = () => {
        const val = cloakSelect.value;
        const cloaks = {
            google: {title:"Google", icon:"https://google.com/favicon.ico"},
            drive: {title:"My Drive - Google Drive", icon:"https://drive.google.com/favicon.ico"},
            classroom: {title:"Classes - Google Classroom", icon:"https://classroom.google.com/favicon.ico"}
        };
        const c = cloaks[val];
        document.title = c.title;
        document.querySelector('link[rel="icon"]').href = c.icon;
        menuOverlay.classList.add('hidden');
    };

    sendBtn.onclick = sendMessage;
    chatInput.addEventListener('keypress', e => { if(e.key==='Enter') sendMessage(); });

    async function sendMessage() {
        const msg = chatInput.value.trim();
        if(!msg) return;
        addMessage('You', msg);
        chatInput.value = '';
        const res = await fetch('https://api.x.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer no-key-needed-for-public-grok'
            },
            body: JSON.stringify({
                messages: [{role:"user",content:msg}],
                model: "grok-beta",
                stream: false
            })
        });
        const data = await res.json();
        const reply = data.choices[0]?.message?.content || "no response";
        addMessage('Grok', reply);
    }

    function addMessage(sender, text) {
        const div = document.createElement('div');
        div.innerHTML = `<b>${sender}:</b> ${text.replace(/\n/g,'<br>')}`;
        div.style.marginBottom = '10px';
        chatMessages.appendChild(div);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});
