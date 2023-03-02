import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { sendMessageRoute, recieveMessageRoute } from "../../utils/APIRoutes";

import './ChatSection.css';
import ChatInput from "../ChatInput/ChatInput";


const ChatSection = ({ currentChat, socket }) => {
    const [messages, setMessages] = useState([]);
    const scrollRef = useRef();
    const [arrivalMessage, setArrivalMessage] = useState(null);

    useEffect(() => {
        const getData = async () => {
            const data = await JSON.parse(
                localStorage.getItem('currentUser')
            );
            const response = await axios.post(recieveMessageRoute, {
                from: data._id,
                to: currentChat._id,
            });
            setMessages(response.data);
        }
        getData();
    }, [currentChat]);

    const handleSendMsg = async (msg) => {
        const data = await JSON.parse(
            localStorage.getItem('currentUser')
        );
        socket.current.emit("send-msg", {
            to: currentChat._id,
            from: data._id,
            msg,
        });
        await axios.post(sendMessageRoute, {
            from: data._id,
            to: currentChat._id,
            message: msg,
        });

        const date = new Date()
        const msgs = [...messages];
        msgs.push({
            fromSelf: true, message: msg, createdAt: date.getHours() + ":" + (date.getMinutes() < 10 ?
                "0" + date.getMinutes() :
                date.getMinutes())
        });
        setMessages(msgs);
    };

    useEffect(() => {
        if (socket.current) {
            socket.current.on("msg-recieve", (msg) => {
                const date = new Date()
                scrollRef.current?.scrollIntoView({ behavior: "smooth" });
                setArrivalMessage({
                    fromSelf: false,
                    message: msg,
                    createdAt: date.getHours() + ":" + (date.getMinutes() < 10 ?
                        "0" + date.getMinutes() :
                        date.getMinutes())
                });
            })
        }
    }, [socket]);

    useEffect(() => {
        arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className='chatSection'>
            <div className='chatSectionHeader'>
                <img src={currentChat.avatarImage} alt="no img" className='chatUserImage' />
                <div className='chatUserInfo'>
                    <div className='chatUserInfoUsername'>{currentChat.username}</div>
                    <div className='chatUserInfoText'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Beatae, consequuntur possimus perferendis esse deserunt quod exercitationem, dolore necessitatibus, neque qui reiciendis corporis voluptatum aliquam! Omnis, adipisci ducimus voluptas accusamus aliquam voluptatum magnam nostrum laudantium optio cum porro est dicta odio quisquam mollitia quod, nobis repudiandae ut, expedita dolorem</div>
                </div>
            </div>
            <div className='chatSectionMain'>
                {messages.map((message) => {
                    return (
                        <div ref={scrollRef} key={uuidv4()}>
                            <div
                                className={`message ${message.fromSelf ? "sended" : "recieved"
                                    }`}
                            >
                                <div className="sender">
                                    <span>{message.fromSelf ? JSON.parse(localStorage.getItem('currentUser')).username : currentChat.username}</span>
                                    <span>{message.createdAt}</span>
                                </div>
                                <div className="messageText">
                                    {message.message}
                                    <div className="triangle"></div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className='chatSectionSearch'>
                <ChatInput handleSendMsg={handleSendMsg} />
            </div>
        </div>
    )
}

export default ChatSection