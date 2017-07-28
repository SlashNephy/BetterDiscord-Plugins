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
    return "0.2.0";
};

SpeechVCEvents.prototype.getAuthor = function () {
    return "Slash Nephy";
};

SpeechVCEvents.prototype.start = function () {};
SpeechVCEvents.prototype.stop = function () {};

SpeechVCEvents.prototype.observer = function(e) {
    var added = e.addedNodes[0];
    var removed = e.removedNodes[0];
    
    if (added && added.className && added.className.indexOf("listDefault-3i7eWQ") >= 0) {
        this.play("joined", $(added).prev().text(), $(added).text());
    } else if (removed && removed.className && removed.className.indexOf("listDefault-3i7eWQ") >= 0) {
        this.play("left", $(e.previousSibling).text(), $(removed).text());
    }
};

SpeechVCEvents.prototype.play = function (event, channel, name) {
    var text;
    switch (event) {
        case "joined":
            text = `${name} が ${channel} に接続しました.`;
            break;
        case "left":
            text = `${name} が ${channel} から切断しました.`;
            break;
    }

    console.info(text);
    this.speak(text);
}

SpeechVCEvents.prototype.speak = function (text) {
    var speech = new SpeechSynthesisUtterance(text);
    speech.volume = 0.7;
	speech.rate = 1.1;
    speech.pitch = 1;
    
    for (var voice in speechSynthesis.getVoices()) {
        if (voice.default) {
            speech.voice = voice;
            break;
        }
    }

	window.speechSynthesis.speak(speech);
}
