//META{"name":"SpeechVCEvents"}*//

var SpeechVCEvents = function () {};
var cache = {};

function play(event, channel, name) {
    var text;
    switch (event) {
        case "join":
            text = `${name} has joined ${channel}.`;
            break;
        case "leave":
            text = `${name} has left ${channel}.`;
            break;
    }

    speak(text);
}

function speak(text) {
    var speech = new SpeechSynthesisUtterance(text);
    var voices = speechSynthesis.getVoices();

    speech.volume = 0.7;
	speech.rate = 1;
	speech.pitch = 1;
    for (i=0; i<voices.length; i++) {
        if (voices[i].default) {
            speech.voice = voices[i];
            break;
        }
    }
	
	window.speechSynthesis.speak(speech);
}

SpeechVCEvents.prototype.collect = function () {
    $(".userDefault-2_cnT0").each(function () {
        var channel = $(this).parent().parent().prev().text();

        if (! (channel in cache)) {
            cache[channel] = [];
        }

        cache[channel].push($(this).text());
    });
}

SpeechVCEvents.prototype.callback = function (mutations) {
    var latest = {};

    $(".userDefault-2_cnT0").each(function () {
        var name = $(this).text();
        var channel = $(this).parent().parent().prev().text();

        if (! (channel in cache)) {
            cache[channel] = [];
        }
        if (! (channel in latest)) {
            latest[channel] = [];
        }

        if (cache[channel].indexOf(name) == -1) {
            console.info("joined");
            console.info(cache)
            play("join", channel, name);
            cache[channel].push(name);
        }
        latest[channel].push(name);
    });

    if (! latest) {
        return;
    }

    for (channel in cache) {
        for (i=0; i<cache[channel].length; i++) {
            if (latest[channel].indexOf(cache[channel][i]) == -1) {
                console.info("left");
                console.info(cache);
                play("leave", channel, cache[channel][i]);
                cache[channel].splice(i, 1);
            }
        }
    }
}

SpeechVCEvents.prototype.start = function () {
    this.collect();

    this.mo = new MutationObserver(this.callback);
    this.mo.observe($(".scroller-fzNley").get(0), {childList: true, subtree: true});
};

SpeechVCEvents.prototype.stop = function () {
	this.mo.disconnect();
};

SpeechVCEvents.prototype.load = function () {
};

SpeechVCEvents.prototype.unload = function () {
};

SpeechVCEvents.prototype.getName = function () {
    return "SpeechVCEvents";
};

SpeechVCEvents.prototype.getDescription = function () {
    return "Notify VC member changes with TTS.";
};

SpeechVCEvents.prototype.getVersion = function () {
    return "0.1.0";
};

SpeechVCEvents.prototype.getAuthor = function () {
    return "Slash Nephy";
};

SpeechVCEvents.prototype.getSettingsPanel = function () {
    return "";
};
