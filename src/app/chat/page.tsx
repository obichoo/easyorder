'use client';

import React, { Suspense, useEffect, useState } from "react";
import {FaCheck, FaPaperPlane, FaQuestion} from 'react-icons/fa';
import MessageService from "@/services/message.service";
import { Message } from "@/models/message.model";
import getUser from "@/utils/get-user";
import { User } from "@/models/user.model";
import UserService from "@/services/user.service";
import { useSearchParams } from "next/navigation";
import Title from "@/app/components/title/page";
import Loading from "@/app/components/loading/page";
import {ImCross} from "react-icons/im";

interface Chat {
    id: number;
    recipient: User;
    messages: Message[];
}

const Conversation = ({ chat, onChatUpdate }: { chat: Chat | null, onChatUpdate: Function }) => {
    const [userId, setUserId] = useState<User['_id']>('');
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        scrollChatToBottom();
    }, [chat?.messages]);

    useEffect(() => {
        setUserId(getUser()?._id);
    }, []);

    const scrollChatToBottom = () => {
        setTimeout(() => {
            const chatContainer = document.getElementById("chat");
            if (chatContainer) {
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }
        }, 0);
    };

    const handleSendMessage = () => {
        if (newMessage.trim() === "") return;

        setLoading(true);

        const messageToSend: Message = {
            sender_id: userId,
            content: newMessage,
            recipient_id: chat?.recipient._id,
        };

        MessageService.createMessage(messageToSend)
            .then(response => {
                if (!chat) return;

                const updatedChat: Chat = chat;
                updatedChat.messages.push(response.data);
                onChatUpdate(updatedChat);

                setNewMessage("");
                setLoading(false);
            })
            .catch(e => {
                setLoading(false);
            });
    };

    const replaceURL = (content: any) => {
        if (!content) return;
        const urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
        return content.replace(urlRegex,
            function (url: any) {
            let hyperlink = url;
            if (!hyperlink.match('^https?:\/\/')) {
                hyperlink = 'http://' + hyperlink;
            }
            return '<a class="underline" href="' + hyperlink + '" target="_blank" rel="noopener noreferrer">' + url + '</a>'
        });
    }


    return chat ? (
        <>
            <div className="flex items-center p-4 bg-easyorder-green text-white shadow-md border-b">
                <div className="relative w-12 h-12 mr-4">
                    <img src={chat?.recipient?.profile_pic} className="w-100 h-100 object-cover rounded-full" alt="" />
                    {
                        chat?.recipient?.company && (chat.recipient?.company?.etat == 'validé' ? (
                            <span
                                className="bg-green-500 text-white rounded-full p-1 text-xs absolute right-0 bottom-0 tooltip">
                                                  <FaCheck/>
                                                  <span className="tooltiptext">Entreprise vérifiée</span>
                                              </span>
                        ) : chat.recipient?.company?.etat == 'en attente' ? (
                            <span
                                className="bg-gray-500 text-white rounded-full block p-1 text-xs absolute right-0 bottom-0 tooltip">
                                                  <FaQuestion/>
                                                  <span className="tooltiptext">Entreprise en attente de vérification</span>
                                              </span>
                        ) : (
                            <span
                                className="bg-red-500 text-white rounded-full p-1 text-xs absolute right-0 bottom-0 tooltip">
                                                  <ImCross/>
                                                  <span className="tooltiptext">Entreprise non vérifiée</span>
                                              </span>
                        ))
                    }
                </div>
                <div>
                    <h2 className="text-xl font-bold">
                        {
                            chat?.recipient?.company ?
                                chat?.recipient?.company?.denomination + " (" + chat?.recipient?.name + ")"
                                :
                                chat?.recipient?.name
                        }
                    </h2>
                    <p>{chat?.recipient?.email}</p>
                </div>
            </div>
            <div id="chat" className="flex-1 p-6 overflow-y-auto bg-easyorder-gray ">
                {chat?.messages.map((message: Message) => (
                    <div
                        key={message._id}
                        className={`mb-3 p-4 max-w-[66%] w-fit rounded-md shadow-lg ${
                            message.sender_id !== userId ? "bg-white self-start" : "ml-auto bg-easyorder-green text-white self-end"
                        }`}
                    >
                        <p className="text-lg" dangerouslySetInnerHTML={{__html: replaceURL(message.content)}}></p>
                        <span className="text-xs text-easyorder-black block mt-2">
                            {new Date(message.created_at as any).toLocaleString()}
                        </span>
                    </div>
                ))}
            </div>
            <div className="p-4 bg-white shadow-md">
                <div className="border flex items-center rounded-full overflow-hidden">
                    <input
                        type="text"
                        placeholder="Écrire un message..."
                        className="w-full p-3 outline-none text-easyorder-black"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button
                        onClick={handleSendMessage}
                        className={`bg-easyorder-green text-white px-6 py-3 flex items-center justify-center gap-2 transition ${
                            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-easyorder-black"
                        }`}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <p>Envoi...</p>
                            </>
                        ) : (
                            <>
                                <FaPaperPlane /> Envoyer
                            </>
                        )}
                    </button>
                </div>
            </div>
        </>
    ) : (
        <div className="flex-1 flex items-center justify-center">
            <p className="">Sélectionnez un utilisateur pour commencer à discuter.</p>
        </div>
    );
};

const SelectUser = ({ onSelect, users }: { onSelect: Function, users: User[] }) => {
    const [searchedUsers, setSearchedUsers] = useState<User[]>([]);
    const [search, setSearch] = useState<string>("");

    useEffect(() => {
        getSearchedUsers();
    }, [search]);

    const getSearchedUsers = () => {
        if (search.length === 0) {
            setSearchedUsers([]);
            return;
        }

        const searchResults = users.filter((user: User) =>
            user?.name?.toLowerCase().includes(search.toLowerCase())
            || user?.email?.toLowerCase().includes(search.toLowerCase())
            || user?.company?.denomination?.toLowerCase().includes(search.toLowerCase())
        );

        setSearchedUsers(searchResults);
    };

    const handleSelect = (user: User) => {
        setSearch("");
        setSearchedUsers([]);
        onSelect(user);
    };

    return (
        <div>
            <input
                placeholder="Démarrer une nouvelle discussion..."
                type="search"
                value={search}
                onChange={(e: any) => setSearch(e.target.value)}
                className="w-full p-3 rounded-full shadow-sm border border-easyorder-gray focus:outline-none focus:ring-2 focus:ring-easyorder-green"
            />
            {search?.length > 0 && (
                <div className="relative">
                    {searchedUsers?.length > 0 ? (
                        <div className="absolute w-full bg-white shadow-lg rounded-lg mt-2 max-h-60 overflow-auto">
                            {searchedUsers.map((user) => (
                                <div
                                    key={user._id}
                                    onClick={() => handleSelect(user)}
                                    className="p-4 cursor-pointer hover:bg-easyorder-gray"
                                >
                                    {
                                        user.company ?
                                            (
                                                <h3 className="font-bold text-easyorder-black">{user.company.denomination} ({user.name})</h3>
                                            )
                                            :
                                        <h3 className="font-bold text-easyorder-black">{user.name}</h3>

                                    }
                                    <p className="text-sm ">{user.email}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="absolute w-full bg-white shadow-md rounded-lg mt-2 p-4">Aucun utilisateur trouvé.</p>
                    )}
                </div>
            )}
        </div>
    );
};

const Chat = () => {
    const searchParams = useSearchParams();
    const [users, setUsers] = useState<User[]>([]);
    const [allChats, setAllChats] = useState<Chat[]>([]);
    const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
    const [chatsFetched, setChatsFetched] = useState(false);

    useEffect(() => {
        getUsers();
    }, []);

    useEffect(() => {
        if (users.length > 0) {
            getChatsData();
        }
    }, [users]);

    useEffect(() => {
        if (chatsFetched) {
            getDefaultChat();
        }
    }, [allChats]);

    const getUsers = () => {
        UserService.getAllUsers()
            .then(response => {
                setUsers(response.data);
            })
    };

    const onChatUpdate = (updatedChat: any) => {
        const updatedChatIndex = allChats.findIndex((chat: Chat) => chat.recipient?._id === updatedChat.recipient._id);
        allChats[updatedChatIndex] = updatedChat;

        const sortedChats = allChats
            .map((chat: Chat) => {
                chat.messages.sort((a: Message, b: Message) =>
                    new Date(a.created_at as any).getTime() - new Date(b.created_at as any).getTime()
                );
                return chat;
            })
            .sort((a: Chat, b: Chat) =>
                new Date(b.messages[b.messages.length - 1].created_at as any).getTime() -
                new Date(a.messages[a.messages.length - 1].created_at as any).getTime()
            );

        setAllChats(sortedChats);
    };

    const getDefaultChat = () => {
        if (chatsFetched && searchParams.get('user')) {
            const userToChat = users.find((user: User) => user._id === searchParams.get('user'));
            if (userToChat) {
                onSelectUser(userToChat);
            }
        }
    };

    const onSelectUser = (user: User) => {
        const existingChat = allChats.find((chat: Chat) => chat.recipient?._id === user._id);

        if (existingChat) {
            setSelectedChat(existingChat);
            return;
        }

        const newChat: Chat = {
            id: allChats.length + 1,
            recipient: user,
            messages: [],
        };

        setAllChats([newChat, ...allChats]);
        setSelectedChat(newChat);
    };

    const getChatsData = () => {
        MessageService.getAllMessages()
            .then(response => {
                const userMessages = response.data.filter((message: Message) =>
                    message.sender_id === getUser()?._id || message.recipient_id === getUser()?._id
                );
                const userChats: Chat[] = [];

                userMessages.forEach((message: Message) => {
                    const otherUserId: User['_id'] = message.sender_id === getUser()?._id ? message.recipient_id : message.sender_id;

                    const existingChat = userChats.find((chat: Chat) => otherUserId === chat.recipient?._id);
                    if (existingChat) {
                        existingChat.messages.push(message);
                    } else {
                        const otherUser: User | undefined = users.find((user: User) => user._id === otherUserId);

                        if (!otherUser) return;

                        userChats.push({
                            id: userChats.length + 1,
                            recipient: otherUser as User,
                            messages: [message],
                        });
                    }
                });

                const sortedChats = userChats
                    .map((chat: Chat) => {
                        chat.messages.sort((a: Message, b: Message) =>
                            new Date(a.created_at as any).getTime() - new Date(b.created_at as any).getTime()
                        );
                        return chat;
                    })
                    .sort((a: Chat, b: Chat) =>
                        new Date(b.messages[b.messages.length - 1].created_at as any).getTime() -
                        new Date(a.messages[a.messages.length - 1].created_at as any).getTime()
                    );

                setChatsFetched(true);
                setAllChats(sortedChats);
            })
    };

    return (
        <>
            <Title>Messagerie</Title>
            <div className="flex mb-8 h-[700px]">
                <div className="w-1/3 bg-white shadow-lg rounded-l-lg">
                    <div className="p-4">
                        <SelectUser users={users} onSelect={onSelectUser} />
                        <div className="mt-4">
                            {allChats.length > 0 ? (
                                allChats.map((chat: Chat) => (
                                    <div
                                        key={chat.id}
                                        onClick={() => setSelectedChat(chat)}
                                        className={`p-3 mb-2 cursor-pointer rounded-lg hover:bg-easyorder-gray ${
                                            selectedChat?.id === chat.id ? "bg-easyorder-gray" : ""
                                        }`}
                                    >
                                        <h3 className="font-bold text-easyorder-black">
                                            {
                                                chat?.recipient?.company ?
                                                    chat?.recipient?.company?.denomination + " (" + chat?.recipient?.name + ")"
                                                    :
                                                    chat?.recipient?.name
                                            }
                                        </h3>
                                        <p className="text-sm  truncate">
                                            {chat.messages[chat.messages.length - 1]?.content || (
                                                <span className="italic">Aucun message</span>
                                            )}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="">Aucun message disponible.</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="w-2/3 flex flex-col rounded-r-lg shadow">
                    <Conversation chat={selectedChat} onChatUpdate={onChatUpdate} />
                </div>
            </div>
        </>
    );
};

const Page = () => {
    return (
        <Suspense>
            <Chat />
        </Suspense>
    );
};

export default Page;
