import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { allUsersRoute, host, registerRoute } from "../utils/APIRoutes";

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
    'https://i.imgur.com/UZXrkHC.jpg',
    'https://i.imgur.com/lbTlK2T.jpg',
    'https://i.imgur.com/WKBoA3q.jpg',
    'https://i.imgur.com/kog42Kf.jpg',
    'https://i.imgur.com/4wBtmZ1.jpg',
    'https://i.imgur.com/txrlT2T.jpg',
    'https://i.imgur.com/MwT1zEd.jpg',
    'https://i.imgur.com/2CQkmRj.jpg',
    'https://i.imgur.com/Zw4m4ZV.jpg',
    'https://i.imgur.com/5r5SP7A.jpg',
    'https://i.imgur.com/91w2Q7Z.jpg',
    'https://i.imgur.com/e29Hx1C.jpg',
    'https://i.imgur.com/86lGToA.jpg',
    'https://i.imgur.com/XSGX6AC.jpg',
    'https://i.imgur.com/g6rvH8j.jpg',
    'https://i.imgur.com/w0l0ngB.jpg',
    'https://i.imgur.com/w3uV7ok.jpg',
    'https://i.imgur.com/Y3q3Wny.jpg',
    'https://i.imgur.com/DYdYtW4.jpg',
    'https://i.imgur.com/6MWzLaH.jpg'
];


const avatarLink = avatarUrls[Math.floor(Math.random() * avatarUrls.length)]
const userName = nicknames[Math.floor(Math.random() * nicknames.length)]

export const Chat = () => {
    const socket = useRef();
    const [contacts, setContacts] = useState([]);
    const [currentChat, setCurrentChat] = useState(undefined);
    const [currentUser, setCurrentUser] = useState(undefined);

    const createAccount = async () => {
        let user = userName;
        const avatar = avatarLink;
        let counter = 0;

        while (true && counter++ < 5) {
            const { data } = await axios.post(registerRoute, ({
                username: user,
                avatarImage: avatar,
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

    useEffect(() => {
        const getData = async () => {
            if (currentUser) {
                const data = await axios.get(`${allUsersRoute}`);
                setContacts(data.data);
            }
        }

        getData();
    }, [currentUser]);

    const handleChatChange = (chat) => {
        setCurrentChat(chat);
    };

    return (
        <>
            123
        </>
    );
}
