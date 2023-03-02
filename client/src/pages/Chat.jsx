import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { host, registerRoute, updateRoute } from "../utils/APIRoutes";
import Contacts from "../components/Contacts/Contacts";

import './Chat.css';
import ChatSection from "../components/ChatSection/ChatSection";


//Needs to be reworked with classes
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
    const [currentChat, setCurrentChat] = useState(undefined);
    const [currentUser, setCurrentUser] = useState(undefined);

    const socket = io('http://localhost:5000');

    console.log(currentUser);

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

        while (true && counter++ < 1) {
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
    }, [currentUser]);

    const handleChatChange = (chat) => {
        setCurrentChat(chat);
        console.log(chat);
    };

    return (
        <>
            <div className="chatContainer">
                <Contacts handleChatChange={handleChatChange} />
            </div>
        </>
    );
}
