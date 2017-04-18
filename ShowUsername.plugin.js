//META{"name":"ShowUsername"}*//

var ShowUsername = function () {};

function apply(element) {
    var wrapper = $(element);
    if (wrapper.next().hasClass("bot-tag")) {
        return;
    }

    var nickname = wrapper.text();
    var userids = BdApi.getUserIdByName(nickname);
    if (! userids) {
        return;
    }
    var userid = userids[0];

    var data = JSON.parse(localStorage.ShowUsername) || {};
    if (userid in data) {
        if (! wrapper.next().hasClass("discord-username")) {
            wrapper.parent().append("<span class=\"discord-username\"> @" + data[userid] + "</span>");
        }
    }
}

ShowUsername.prototype.check = function () {
    $(".message .user-name").each(function (i, t) {
        apply(t);
    });
};

ShowUsername.prototype.callback = function (mutations) {
    if ($(".username").length > 1) {
        var user = $(".username").last();
        if (user.next().next().text() === "BOT") {
            return;
        }

        var username = user.text();
        var nickname = user.parent().prev().text() || username;
        var userid = BdApi.getUserIdByName(nickname)[0];

        var data = JSON.parse(localStorage.ShowUsername) || {};
        data[userid] = username;

        localStorage.ShowUsername = JSON.stringify(data);
    }
};

ShowUsername.prototype.onMessage = this.check;

ShowUsername.prototype.start = function () {
    window.addEventListener("click", this.check);

    this.mo = new MutationObserver(this.callback);
    this.mo.observe(document, {childList: true, subtree: true});
};

ShowUsername.prototype.stop = function () {
	this.mo.disconnect();
};

ShowUsername.prototype.load = function () {
};

ShowUsername.prototype.unload = function () {
};

ShowUsername.prototype.getName = function () {
    return "Show Username";
};

ShowUsername.prototype.getDescription = function () {
    return "Show username with their name.";
};

ShowUsername.prototype.getVersion = function () {
    return "0.1.1";
};

ShowUsername.prototype.getAuthor = function () {
    return "Slash Nephy";
};

ShowUsername.prototype.getSettingsPanel = function () {
    return "";
};
