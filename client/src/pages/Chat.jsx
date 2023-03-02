import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { host, registerRoute, updateRoute } from "../utils/APIRoutes";
import Contacts from "../components/Contacts/Contacts";
import { allUsersRoute, sendMessageRoute } from "../utils/APIRoutes";
import ChatSection from "../components/ChatSection/ChatSection";
import { SpamBot } from "../components/ChatSection/ChatSection";
import { MessageGenerator } from "../components/ChatSection/ChatSection";
import MyUseState from "../utils/myUseState";

import './Chat.css';
import { useRef } from "react";


const nicknames = [
    'LuckyLeaf',
    'FrostyGaze',
    'MysticWhirlwind',
    'EmberWish',
    'NeonNova',
    'SparklingPixel',
    'OceanEcho',
    'LunarFlame',
    'CrimsonSoul',
    'ShadowSylph',
    'CrystalSpectrum',
    'ThunderboltAce',
    'PhoenixBlaze',
    'ElectricLynx',
    'SilverSong',
    'SolarSeraph',
    'MidnightRaven',
    'DiamondDusk',
    'RadiantRider',
    'GalaxyGlimmer'
];

const avatarUrls = [
    "//phonoteka.org/uploads/posts/2021-07/1625100835_10-phonoteka_org-p-oboi-na-rabochii-stol-patrik-krasivo-11.jpg"
];

const avatarLink = avatarUrls[Math.floor(Math.random() * avatarUrls.length)]
const userName = nicknames[Math.floor(Math.random() * nicknames.length)]

export const Chat = () => {
    const myRef = useRef(null);
    const [contacts, setContacts] = useState([]);
    const [currentChat, setCurrentChat] = useState(undefined);
    const [currentUser, setCurrentUser] = useState(undefined);

    const [test1, setTest1] = MyUseState(1);
    const [test2, setTest2] = MyUseState(1);

    const socket = io('http://localhost:5000');

    useEffect(() => {
        const getData = async () => {
            const data = await axios.get(allUsersRoute);
            let allUsers = data.data.filter((el) => el._id !== currentUser._id);
            setContacts(allUsers);
        }

        if (currentUser) {
            getData();
        }
    }, [currentUser])

    useEffect(() => {
        window.addEventListener("beforeunload", () => {
            socket.disconnect();
        });
        return () => {
            window.removeEventListener("beforeunload", () => {
                socket.disconnect();
            });
        };
    }, [socket]);

    useEffect(() => {

        const createBot = async (user, avatar) => {
            await axios.post(registerRoute, ({
                username: user,
                avatarImage: avatar,
                networkStatus: "online"
            }));
        }

        if (currentUser) {
            const areBotsAdded = contacts.filter((el) => el.username === "Echo bot").length === 1;
            if (!areBotsAdded) {
                createBot('Echo bot', avatarLink);
                createBot('Reverse bot', avatarLink);
                createBot('Spam bot', avatarLink);
                createBot('Ignorebot', avatarLink);

            }
        }
    }, [contacts, currentUser])

    useEffect(() => {
        const messageGenerator = new MessageGenerator();
        const spamBot = new SpamBot(messageGenerator.generateMessage);
        const data = contacts.filter((el) => el.username === "Spam bot")[0]
        const sendSpam = async () => {
            const interval = Math.floor(Math.random() * (120000 - 10000 + 1)) + 10000;
            setTimeout(() => {
                const msg = spamBot.reply();
                socket.current.emit("send-msg", {
                    from: data._id,
                    to: currentUser._id,
                    message: msg,
                });
                axios.post(sendMessageRoute, {
                    from: data._id,
                    to: currentUser._id,
                    message: msg,
                });
                console.log("New spam");
            }, interval);
        }
        if (data) sendSpam();
    }, [contacts, currentUser, socket])

    if (currentUser)
        socket.on('connect', async () => {
            const url = updateRoute + currentUser._id;
            axios.put(url, ({
                status: "online"
            }))
        });

    if (currentUser)
        socket.on('disconnect', async () => {
            const url = updateRoute + currentUser._id;
            axios.put(url, ({
                status: "offline"
            }))
        });



    const createAccount = async () => {
        let user = userName;
        const avatar = avatarLink;
        let counter = 0;

        while (true && counter++ < 20) {
            const { data } = await axios.post(registerRoute, ({
                username: user,
                avatarImage: avatar,
                networkStatus: "offline"
            }));

            if (data.status === true) {
                localStorage.setItem("currentUser", JSON.stringify(data.user));
                break;
            }
            else {
                user = nicknames[Math.floor(Math.random() * nicknames.length)];
            }
        }
    };

    useEffect(() => {
        const getData = async () => {
            if (!localStorage.getItem("currentUser")) {
                localStorage.clear();
                createAccount();
            } else {
                setCurrentUser(
                    await JSON.parse(
                        localStorage.getItem("currentUser")
                    )
                );
            }
        }

        getData();
    }, []);

    useEffect(() => {
        if (currentUser) {
            socket.current = io(host);
            socket.current.emit("add-user", currentUser._id);
        }
    }, [currentUser, socket]);

    const handleChatChange = (chat) => {
        setCurrentChat(chat);
    };

    //Для проверки MyUseState в последнем условии false ? ... изменить на true ? ...

    return (
        <>
            <div ref={myRef} className="chatContainer">
                {currentChat ? <ChatSection currentChat={currentChat} socket={socket} /> :
                    <div
                        className="chatSection"
                        style={{ justifyContent: "center" }}>
                        <h3>Choose active chat</h3>
                    </div>}
                <Contacts handleChatChange={handleChatChange} />
            </div>
            {false ? (<div><button onClick={() => { setTest1(test1 + 1) }}>{test1}</button>
                <button onClick={() => { setTest2(test2 + 1) }}>{test2}</button></div>) : null}
        </>
    );
}

