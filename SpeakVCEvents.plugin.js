//META{"name":"SpeechVCEvents"}*//
class SpeechVCEvents {
    constructor() {}
    start() {
        this.voice = null;
        for (const voice in speechSynthesis.getVoices()) {
            if (voice.default) {
                this.voice = voice;
                break;
            }
        }

        this.cache = {};
    }
    stop() {}
    load() {}
    unload() {}

    getName() {
        return "SpeakVCEvents";
    }
    getDescription() {
        return "VCで誰かが参加したり退出したりした際に読み上げます";
    }
    getVersion() {
        return "0.4.0";
    }
    getAuthor() {
        return "Slash Nephy";
    }

    getUserElement(element) {
        if (! (element instanceof Element)) {
            return null;
        }
        return element.querySelector(".draggable-1KoBzC");
    }
    getUserName(element) {
        return element.querySelector(".nameDefault-2s3kbY").textContent;
    }
    getUserId(element) {
        return element.querySelector(".avatarDefault-35WC3R").style.backgroundImage.match(/\d+/)[0];
    }
    getUserChannel(element) {
        return element.parentElement.parentElement.querySelector(".name-3M0b8v").textContent;
    }

    observer(e) {
        e.removedNodes.forEach(removed => {
            const user = this.getUserElement(removed);
            if (user === null) {
                return;
            }

            const name = this.getUserName(user);
            const id = this.getUserId(user);
            const channelName = this.cache[id] || null;
            if (channelName !== null) {
                this.speak(`${name}が${channelName}から退出しました`);
            }
            else {
                this.speak(`${name}が切断しました`);
            }
            delete this.cache[id];
        });
        e.addedNodes.forEach(added => {
            const user = this.getUserElement(added);
            if (user === null) {
                return;
            }
            const name = this.getUserName(user);
            const id = this.getUserId(user);
            const channelName = this.getUserChannel(user);
            this.speak(`${name}が${channelName}に参加しました`);
            this.cache[id] = channelName;
        });
    }
    
    speak(text) {
        const speech = new SpeechSynthesisUtterance(text);
        speech.volume = 0.4;
        speech.rate = 1.3;
        speech.pitch = 1;
        speech.voice = this.voice;
        window.speechSynthesis.speak(speech);
        console.debug(`[SpeckVCEvents] ${text}`);
    }
}
