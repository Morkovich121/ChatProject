import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { sendMessageRoute, recieveMessageRoute } from "../../utils/APIRoutes";

import './ChatSection.css';
import ChatInput from "../ChatInput/ChatInput";


//Эту часть задания я сделал максимально расширяемой, классов используется не так уж и много потому что функция по сути всего одна
//Но тем не менее я создал родительский класс Bot который в случае надобности можно будет расширить, что позволит расширить и ботов-потомков
//Так же я создал класс MessageGenerator который будет генерировать ответы для ботов, в данном случае он используется как генератор случайных сообщений
//для SpamBot
//Так же в конструктор каждого класса можно передать опции для изменения ответа бота(в данном случае не используется)

//1.Создать экземпляр бота
//2.Обработать сообщение
//3.Сгенерировать ответ
//4.Вернуть ответ пользователю

class Bot {
    constructor(options) {
        this.options = options;
    }

    reply(message) {
        return "";
    }
}

class EchoBot extends Bot {
    constructor(options = {}) {
        super(options);
    }

    reply(message) {
        const { prefix = '', postfix = '' } = this.options;
        return `${prefix}${message}${postfix}`;
    }
}

class IgnoreBot extends Bot {
    constructor(options = {}) {
        super(options);
    }

    reply(message) {
        return '';
    }
}

export class SpamBot extends Bot {
    constructor(generateMessage) {
        super();
        this.generateMessage = generateMessage;
    }

    reply() {
        return this.generateMessage();
    }
}


class ReverseBot extends Bot {
    constructor(options = {}) {
        super(options);
    }

    reply(message) {
        const { transformFn = (str) => str.split('').reverse().join('') } = this.options;
        return transformFn(message);
    }
}

export class MessageGenerator {
    constructor(options = {}) {
        this.options = options;
    }

    generateMessage(options) {
        if (!options?.generateMessage) {
            const alphabet = 'abcdefghijklmnopqrstuvwxyz ';
            const messageLength = Math.floor(Math.random() * 40) + 1;
            let message = '';

            for (let i = 0; i < messageLength; i++) {
                const randomIndex = Math.floor(Math.random() * alphabet.length);
                message += alphabet[randomIndex];
            }

            return message;
        }
        else {
            return options.generateMessage();
        }
    }
}


const ChatSection = ({ currentChat, socket }) => {

    const reverseBot = new ReverseBot();
    const ignoreBot = new IgnoreBot();
    const echoBot = new EchoBot();

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

        console.log("Message sent");
        const date = new Date()
        const msgs = [...messages];
        msgs.push({
            fromSelf: true, message: msg, createdAt: date.getHours() + ":" + (date.getMinutes() < 10 ?
                "0" + date.getMinutes() :
                date.getMinutes())
        });

        if (currentChat.username === "Echo bot") {
            await axios.post(sendMessageRoute, {
                from: currentChat._id,
                to: data._id,
                message: echoBot.reply(msg),
            })

            msgs.push({
                fromSelf: false, message: echoBot.reply(msg), createdAt: date.getHours() + ":" + (date.getMinutes() < 10 ?
                    "0" + date.getMinutes() :
                    date.getMinutes())
            });
        }

        if (currentChat.username === "Reverse bot") {
            await axios.post(sendMessageRoute, {
                from: currentChat._id,
                to: data._id,
                message: reverseBot.reply(msg),
            })

            msgs.push({
                fromSelf: false, message: reverseBot.reply(msg), createdAt: date.getHours() + ":" + (date.getMinutes() < 10 ?
                    "0" + date.getMinutes() :
                    date.getMinutes())
            });
        }

        if (currentChat.username === "Ignorebot") {

            if (ignoreBot.reply(msg)) {
                await axios.post(sendMessageRoute, {
                    from: currentChat._id,
                    to: data._id,
                    message: ignoreBot.reply(msg),
                })
                msgs.push({
                    fromSelf: false, message: ignoreBot.reply(msg), createdAt: date.getHours() + ":" + (date.getMinutes() < 10 ?
                        "0" + date.getMinutes() :
                        date.getMinutes())
                });
            }

        }

        setMessages(msgs);
    };

    useEffect(() => {
        if (socket.current) {
            socket.current.on("msg-recieve", (msg) => {
                const date = new Date();
                console.log("New message");
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