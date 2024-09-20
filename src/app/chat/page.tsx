'use client';

import {ReactNode, Suspense, useEffect, useState} from "react";
import { FaSpinner } from 'react-icons/fa';
import MessageService from "@/services/message.service";
import {Message} from "@/models/message.model";
import getUser from "@/utils/get-user";
import {User} from "@/models/user.model";
import UserService from "@/services/user.service";
import {useSearchParams} from "next/navigation";

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
        setUserId(getUser()?._id)
    }, [])

    const scrollChatToBottom = () => {
        setTimeout(() => {
            const chatContainer = document.getElementById("chat");
            if (chatContainer) {
                chatContainer.scrollTop = chatContainer.scrollHeight
            }
        })
    }

    const handleSendMessage = () => {
        if (newMessage.trim() === "") return;

        setLoading(true);

        const messageToSend: Message = {
            sender_id: userId,
            content: newMessage,
            recipient_id: chat?.recipient._id,
        }

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
                console.log(e);
                setLoading(false);
            })
    };

    return (
        chat ?
            <>
                <div className="flex items-center p-4 bg-white shadow-md border-b">
                    <div className="w-12 h-12 rounded-full mr-4 overflow-hidden">
                        <img src={chat?.recipient?.profile_pic} className="w-100 h-100 object-cover" alt=""/>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">{chat?.recipient?.name}</h2>
                        <p>{chat?.recipient?.email}</p>
                    </div>
                </div>
                <div id="chat" className="flex-1 p-6 overflow-y-auto bg-easyorder-gray ">
                    {chat?.messages.map((message: Message) => (
                        <div
                            key={message._id}
                            className={`mb-3 p-2 max-w-[66%] w-fit rounded-md shadow-md ${
                                message.sender_id !== userId ? "bg-white self-end" : "ml-auto bg-easyorder-green self-start"
                            }`}
                        >
                            <p className="text-lg">{message.content}</p>
                            <span className="text-xs text-easyorder-black">
                                {new Date(message.created_at as any).toLocaleString()}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="p-4 bg-white shadow-md">
                    <div className="border flex items-center rounded-md overflow-hidden">
                        <input
                            type="text"
                            placeholder="Message..."
                            className="w-full p-2 outline-0"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <button
                            onClick={handleSendMessage}
                            className={`bg-easyorder-green text-white px-4 py-2 hover:bg-easyorder-black transition flex items-center justify-center gap-2 ${
                                loading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <FaSpinner className="animate-spin"/> Envoi...
                                </>
                            ) : (
                                "Envoyer"
                            )}
                        </button>
                    </div>
                </div>
            </>
            :
            <div className="flex-1 flex items-center justify-center">
                <p className="text-gray-600">Sélectionnez un utilisateur pour commencer à discuter.</p>
            </div>
    )
}

const SelectUser = ({onSelect, users}: { onSelect: Function, users: User[] }) => {
    const [searchedUsers, setSearchedUsers] = useState<User[]>([]);
    const [search, setSearch] = useState<string>("");

    useEffect(() => {
        getSearchedUsers();
    }, [search])

    const getSearchedUsers = () => {
        if (search.length === 0) {
            setSearchedUsers([]);
            return;
        }

        const searchResults = users.filter((user: User) =>
            user?.name?.toLowerCase().includes(search.toLowerCase())
        );

        setSearchedUsers(searchResults);
    }

    const handleSelect = (user: User) => {
        setSearch("");
        setSearchedUsers([]);
        onSelect(user);
    }

    return (
        <div>
            <input
                placeholder="Démarrer une nouvelle discussion..."
                type="search"
                value={search}
                onChange={(e: any) => setSearch(e.target.value)}
                className="w-full p-2 outline-0 border rounded-md"
            />
            {search?.length > 0 && (
                <div className="relative">
                    {searchedUsers?.length > 0 ? (
                        <div className="absolute w-full bg-white shadow-md rounded-md mt-2 max-h-60 overflow-auto">
                            {searchedUsers.map((user) => (
                                <div
                                    key={user._id}
                                    onClick={() => handleSelect(user)}
                                    className="p-2 cursor-pointer hover:bg-gray-100"
                                >
                                    <h3 className="font-bold text-gray-900">{user.name}</h3>
                                    <p className="text-sm text-gray-600">{user.email}</p>
                                </div>
                            ))}
                        </div>
                    ): (
                        <p className="absolute w-full bg-white shadow-md rounded-md mt-2 p-2">Aucun utilisateur trouvé.</p>
                    )}
                </div>
            )}
        </div>
    )
}

const Chat = () => {
    const searchParams = useSearchParams()
    const [users, setUsers] = useState<User[]>([]);
    const [allChats, setAllChats] = useState<Chat[]>([]);
    const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
    const [chatsFetched, setChatsFetched] = useState(false);

    useEffect(() => {
        getUsers();
    }, [])

    useEffect(() => {
        if (users.length > 0) {
            getChatsData();
        }
    }, [users])

    useEffect(() => {
        if (chatsFetched) {
            getDefaultChat();
        }
    }, [allChats]);

    const getUsers = () => {
        UserService.getAllUsers()
            .then(response => {
                setUsers(response.data)
            })
            .catch(e => {
                console.log(e);
            })
    }

    const onChatUpdate = (updatedChat: any) => {
        const updatedChatIndex = allChats.findIndex((chat: Chat) => chat.recipient?._id === updatedChat.recipient._id);
        allChats[updatedChatIndex] = updatedChat;

        const sortedChats = allChats.map((chat: Chat) => {
            chat.messages.sort((a: Message, b: Message) =>
                new Date(a.created_at as any).getTime() - new Date(b.created_at as any).getTime()
            )
            return chat;
        }).sort((a: Chat, b: Chat) =>
            new Date(b.messages[b.messages.length - 1].created_at as any).getTime() -
            new Date(a.messages[a.messages.length - 1].created_at as any).getTime()
        )

        setAllChats(sortedChats);
    }

    const getDefaultChat = () => {
        if (chatsFetched && searchParams.get('user')) {
            const userToChat = users.find((user: User) => user._id === searchParams.get('user'));
            if (userToChat) {
                onSelectUser(userToChat);
            }
        }
    }
    
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
        }

        setAllChats([newChat, ...allChats]);
        setSelectedChat(newChat);
    }

    const getChatsData = () => {
        MessageService.getAllMessages()
            .then(response => {
                const userMessages = response.data.filter((message: Message) =>
                    message.sender_id === getUser()?._id || message.recipient_id === getUser()?._id
                );
                const userChats: Chat[] = []

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
                        })
                    }
                })

                const sortedChats = userChats.map((chat: Chat) => {
                    chat.messages.sort((a: Message, b: Message) =>
                        new Date(a.created_at as any).getTime() - new Date(b.created_at as any).getTime()
                    )
                    return chat;
                }).sort((a: Chat, b: Chat) =>
                    new Date(b.messages[b.messages.length - 1].created_at as any).getTime() -
                    new Date(a.messages[a.messages.length - 1].created_at as any).getTime()
                )

                setChatsFetched(true);
                setAllChats(sortedChats);
            })
            .catch(e => {
                console.log(e);
            })
    }

    return (
        <>
            <h1 className="text-3xl my-8">Messagerie</h1>
            <div className="flex mb-8 h-[700px]">
                {/* Sidebar pour les discussions */}
                <div className="w-1/3 bg-white shadow-lg rounded-l-lg">
                    <div className="p-4">
                        <SelectUser users={users} onSelect={onSelectUser}></SelectUser>
                        <div className="mt-4">
                            {allChats.length > 0 ? (
                                allChats.map((chat: Chat) => (
                                    <div
                                        key={chat.id}
                                        onClick={() => setSelectedChat(chat)}
                                        className={`p-3 mb-2 cursor-pointer rounded-md hover:bg-easyorder-gray ${
                                            selectedChat?.id === chat.id ? "bg-easyorder-gray" : ""
                                        }`}
                                    >
                                        <h3 className="font-bold text-gray-900">{chat.recipient?.name}</h3>
                                        <p className="text-sm text-gray-600 truncate">
                                            {
                                                chat.messages[chat.messages.length - 1]?.content ||
                                                (<span className="italic">Aucun message</span>)
                                            }
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-600">Aucun message disponible.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Zone de chat */}
                <div className="w-2/3 bg-gray-50 flex flex-col rounded-r-lg overflow-hidden shadow">
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
}

export default Page;
