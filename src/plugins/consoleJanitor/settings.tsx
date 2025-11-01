import { React, Forms } from "@webpack/common";

export default function Settings({ plugin }) {
  const { useState } = React;
  const [accountName, setAccountName] = useState(plugin.settings.accountName || "");
  const [keybind, setKeybind] = useState(plugin.settings.keybind || "Ctrl+F21");

  const handleKey = (e) => {
    e.preventDefault();
    const keys = [];
    if (e.ctrlKey) keys.push("Ctrl");
    if (e.shiftKey) keys.push("Shift");
    if (e.altKey) keys.push("Alt");
    let name = e.code?.startsWith("F") ? e.code : e.key;
    keys.push(name);
    setKeybind(keys.join("+"));
  };

  const save = () => {
    plugin.saveSettings({ accountName, keybind });
    plugin.settings = { accountName, keybind };
  };

  return (
    <div style={{ padding: 12 }}>
      <Forms.FormTitle>MutePlayer Settings</Forms.FormTitle>
      <Forms.FormTextLabel>Account Name</Forms.FormTextLabel>
      <input
        value={accountName}
        placeholder="@username"
        onChange={(e) => setAccountName(e.target.value)}
        style={{ width: "100%", padding: 6 }}
      />
      <Forms.FormTextLabel style={{ marginTop: 8 }}>Keybind</Forms.FormTextLabel>
      <input
        value={keybind}
        onKeyDown={handleKey}
        onChange={(e) => setKeybind(e.target.value)}
        style={{ width: "100%", padding: 6 }}
      />
      <button style={{ marginTop: 8 }} onClick={save}>
        Save
      </button>
    </div>
  );
}
