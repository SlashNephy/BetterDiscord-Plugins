//META{"name":"SpeechVCEvents"}*//

function SpeechVCEvents() {};

SpeechVCEvents.prototype.load = function () {};
SpeechVCEvents.prototype.unload = function () {};

SpeechVCEvents.prototype.getName = function () {
    return "SpeechVCEvents";
};

SpeechVCEvents.prototype.getDescription = function () {
    return "Make TTS when someone joined to/left from your VC.";
};

SpeechVCEvents.prototype.getVersion = function () {
    return "0.2.1";
};

SpeechVCEvents.prototype.getAuthor = function () {
    return "Slash Nephy";
};

SpeechVCEvents.prototype.start = function () {};
SpeechVCEvents.prototype.stop = function () {};

SpeechVCEvents.prototype.observer = function(e) {
    const added = e.addedNodes[0];
    const removed = e.removedNodes[0];
    
    if (added && typeof added.className === "string" && added.className.indexOf("listDefault-3i7eWQ") !== -1) {
        this.play("joined", $(added).prev().text(), $(added).text());
    } else if (removed && typeof removed.className === "string" && removed.className.indexOf("listDefault-3i7eWQ") !== -1) {
        this.play("left", $(e.previousSibling).text(), $(removed).text());
    }
};

SpeechVCEvents.prototype.play = function (event, channel, name) {
    let text;
    switch (event) {
        case "joined":
            text = `${name} が ${channel} に接続しました.`;
            break;
        case "left":
            text = `${name} が ${channel} から切断しました.`;
            break;
    }

    this.speak(text);
}

SpeechVCEvents.prototype.speak = function (text) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.volume = 0.7;
	speech.rate = 1.1;
    speech.pitch = 1;
    
    for (const voice in speechSynthesis.getVoices()) {
        if (voice.default) {
            speech.voice = voice;
            break;
        }
    }

    window.speechSynthesis.speak(speech);
}
