import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { allUsersRoute } from "../../utils/APIRoutes";

import './Contacts.css';

const Contacts = ({ handleChatChange }) => {

    const [contacts, setContacts] = useState([]);
    const [currentSelected, setCurrentSelected] = useState(undefined);
    const [currentUser, setCurrentUser] = useState(undefined);

    useEffect(() => {
        const getData = async () => {
            if (localStorage.getItem("currentUser")) {
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
        const getData = async () => {
            const data = await axios.get(allUsersRoute);
            const allUsers = data.data.filter((el) => el._id !== currentUser._id);
            setContacts(allUsers);
        }

        if (currentUser) {
            getData();
        }
    }, [currentUser])

    const changeCurrentChat = (index, contact) => {
        setCurrentSelected(index);
        handleChatChange(contact);
    };

    return (
        <div className="contactsContainer">
            <div className="statusFilter">
            </div>
            <div className="contactsList">
                {contacts.map((contact, index) => (
                    <div
                        className={`contact ${index === currentSelected ? "activeChat userCard" : "userCard"
                            }`}
                        key={contact._id}
                        onClick={() => changeCurrentChat(index, contact)}
                    >
                        <img src={contact.avatarImage} alt="no img" />
                        <div className="userInfo">
                            <div className='nickname'>
                                {contact.username}
                            </div>
                            <div className='status'>
                                Lorem ipsum, dolor sit amet consectetur adipi...
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <input type="text" placeholder="Search..." />
        </div>
    )
}

export default Contacts