import { Plugin } from "src/Vencord";
import { React, Forms } from "@webpack/common";
import Settings from "./settings";

export default class ConsoleJanitor extends Plugin {
    settings = {
        accountName: "",
        keybind: "Ctrl+F21"
    };

    onLoad() {
        this.registerSettings({
            id: "ConsoleJanitor",
            name: "MutePlayer",
            render: (props) => <Settings {...props} />
        });

        window.addEventListener("keydown", this.onKeyDown);
    }

    onUnload() {
        window.removeEventListener("keydown", this.onKeyDown);
    }

    onKeyDown = (e: KeyboardEvent) => {
        const { keybind, accountName } = this.settings;
        if (!accountName) return;

        const parts = keybind.toLowerCase().split("+");
        const requiresCtrl = parts.includes("ctrl");
        const mainKey = parts.pop()?.toLowerCase();

        if (requiresCtrl && !e.ctrlKey) return;
        if ((mainKey?.startsWith("f") ? e.code.toLowerCase() : e.key.toLowerCase()) !== mainKey)
            return;

        e.preventDefault();
        this.toggleMute(accountName);
    };

    async toggleMute(username: string) {
        try {
            const Users = this.webpack.findByUniqueProperties(["getUser"]);
            const VoiceStateStore = this.webpack.findByUniqueProperties(["getVoiceStatesForGuild"]);
            const VoiceActions = this.webpack.findByUniqueProperties(["setMuted"]);
            const SelectedGuildStore = this.webpack.findByUniqueProperties(["getGuildId"]);

            const guildId = SelectedGuildStore.getGuildId();
            if (!guildId) return;

            const allStates = VoiceStateStore.getVoiceStatesForGuild(guildId);
            const targetState = Object.values(allStates).find(
                (v: any) => Users.getUser(v.userId)?.username === username
            );
            if (!targetState) return;

            const userId = targetState.userId;
            const currentlyMuted = targetState.mute || targetState.self_mute;

            VoiceActions.setMuted(guildId, userId, !currentlyMuted);
        } catch (err) {
            console.error("MutePlayer toggle failed:", err);
        }
    }
}
