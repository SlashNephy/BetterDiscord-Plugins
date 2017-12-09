//META{"name":"SpeechVCEvents"}*//

function SpeechVCEvents() {};

SpeechVCEvents.prototype.start = function () {
    this.cache = {};
};
SpeechVCEvents.prototype.stop = function () {};
SpeechVCEvents.prototype.load = function () {};
SpeechVCEvents.prototype.unload = function () {};

SpeechVCEvents.prototype.getName = function () {
    return "SpeakVCEvents";
};
SpeechVCEvents.prototype.getDescription = function () {
    return "DiscordのVCで誰かが参加したり退出したりした際に読み上げます";
};
SpeechVCEvents.prototype.getVersion = function () {
    return "0.3.0";
};
SpeechVCEvents.prototype.getAuthor = function () {
    return "Slash Nephy";
};

SpeechVCEvents.prototype.observer = function (e) {
    const addedNodes = e.addedNodes;
    addedNodes.forEach(added => {
        if (added instanceof Element && added.classList.contains("draggable-3SphXU")) {
            const name = added.getElementsByClassName("nameDefault-1I0lx8")[0].textContent;
            const id = added.getElementsByClassName("avatarDefault-3jtQoc")[0].style.backgroundImage.match(/\d+/)[0];
            const channelName = added.parentElement.parentElement.getElementsByClassName("name-2SL4ev")[0].textContent;
            this.speak(`${name}が${channelName}に参加しました`);
            this.cache[id] = channelName;
        }
    });

    const removedNodes = e.removedNodes;
    removedNodes.forEach(removed => {
        if (removed instanceof Element && removed.classList.contains("draggable-3SphXU")) {
            const name = removed.getElementsByClassName("nameDefault-1I0lx8")[0].textContent;
            const id = removed.getElementsByClassName("avatarDefault-3jtQoc")[0].style.backgroundImage.match(/\d+/)[0];
            const channelName = this.cache[id] || null;
            if (channelName !== null) {
                this.speak(`${name}が${channelName}から退出しました`);
            } else {
                this.speak(`${name}が切断しました`);
            }
            delete this.cache[id];
        }
    });
};

SpeechVCEvents.prototype.speak = function (text) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.volume = 0.6;
	speech.rate = 1.2;
    speech.pitch = 1;
    
    for (const voice in speechSynthesis.getVoices()) {
        if (voice.default) {
            speech.voice = voice;
            break;
        }
    }

    window.speechSynthesis.speak(speech);
}
