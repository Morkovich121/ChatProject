import React, { useEffect, useState } from "react";
import axios from "axios";

import useDebounce from '../../utils/hooks/useDebounce';

import { allUsersRoute } from "../../utils/APIRoutes";

import './Contacts.css';
import { useCallback } from "react";

const Contacts = ({ handleChatChange }) => {

    const [contacts, setContacts] = useState([]);
    const [currentSelected, setCurrentSelected] = useState(undefined);
    const [currentUser, setCurrentUser] = useState(undefined);
    const [isFiltered, setIsFiltered] = useState(false);
    const [query, setQuery] = useState('');
    const [searchedUsers, setSearchedUsers] = useState([]);
    const debouncedQuery = useDebounce(query, 500);

    function handleSearch(event) {
        setQuery(event.target.value);
    }

    const handleDebouncedSearch = useCallback(() => {
        let foundUsers = [];
        if (debouncedQuery)
            foundUsers = contacts.filter((el) => el.username.startsWith(debouncedQuery));
        setSearchedUsers(foundUsers);
    }, [contacts, debouncedQuery])

    useEffect(() => {
        handleDebouncedSearch();
    }, [debouncedQuery, handleDebouncedSearch]);

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
            let allUsers = data.data.filter((el) => el._id !== currentUser._id);
            if (isFiltered) {
                allUsers = allUsers.filter((el) => el.networkStatus === "online");
            }
            setContacts(allUsers);
        }

        if (currentUser) {
            getData();
        }
    }, [currentUser, isFiltered])

    const changeCurrentChat = (index, contact) => {
        setCurrentSelected(index);
        handleChatChange(contact);
    };

    const resourceData = debouncedQuery.length > 0 ? searchedUsers : contacts

    return (
        <div className="contactsContainer">
            <div className="statusFilter">
                <button className={`${isFiltered ? "activeButton button" : "button"}`} onClick={() => { setIsFiltered(true) }}>Online</button>
                <button className={`${!isFiltered ? "activeButton button" : "button"}`} onClick={() => { setIsFiltered(false) }}>All</button>
            </div>
            <div className="contactsSection">
                {
                    resourceData.map((contact, index) => (
                        <div
                            className={`contact ${index === currentSelected ? "activeChat userCard" : "userCard"}`}
                            key={contact._id}
                            onClick={() => changeCurrentChat(index, contact)}
                        >
                            <div className="avatarSection">
                                {contact.networkStatus === "online" ? <div className="onlineStatus"></div> : null}
                                <img src={contact.avatarImage} alt="no img" />
                            </div>
                            <div className="userInfo">
                                <div className="nickname">{contact.username}</div>
                                <div className="status">Fusce dapibus, tellus ac curvus commodo, tort...</div>
                            </div>
                        </div>
                    ))}
            </div>
            <input type="text" placeholder="Search..." className="search" value={query} onChange={handleSearch} />
        </div>
    )
}

export default Contacts