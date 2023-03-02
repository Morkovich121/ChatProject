import React, { useState } from "react";

import './ChatInput.css';

const ChatInput = ({ handleSendMsg }) => {
    const [msg, setMsg] = useState("");

    const sendChat = (event) => {
        event.preventDefault();
        if (msg.length > 0) {
            handleSendMsg(msg);
            setMsg("");
        }
    };

    return (
        <form className="inputContainer" onSubmit={(event) => sendChat(event)}>
            <input
                type="text"
                placeholder="Start chatting!"
                onChange={(e) => setMsg(e.target.value)}
                value={msg}
            />
            <button type="submit">
                Send message
            </button>
        </form>
    )
}

export default ChatInput