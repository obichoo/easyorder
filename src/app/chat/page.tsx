'use client';

import {useEffect, useState} from "react";
import fakeChats from "@/app/chat/fake-chats";
import { FaSpinner } from 'react-icons/fa';

const Chat = () => {
    const [chatsData, setChatsData] = useState(fakeChats);
    const [selectedChat, setSelectedChat] = useState(chatsData[0] || null);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        // Scroll automatique vers le bas du chat
        const chatContainer = document.querySelector(".bg-gray-100");
        if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight
        }
    }, [chatsData]);

    const handleSendMessage = () => {
        if (newMessage.trim() === "") return;

        setLoading(true);

        // Simuler une requête d'envoi de message
        setTimeout(() => {
            if (selectedChat) {
                const updatedChat = {
                    ...selectedChat,
                    messages: [
                        ...selectedChat.messages,
                        {
                            id: selectedChat.messages.length + 1,
                            sender: "artisan",
                            content: newMessage,
                            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        },
                    ],
                };
                // Mise à jour de l'état des chats
                setChatsData((prevChats) =>
                    prevChats.map((chat) =>
                        chat.id === selectedChat.id ? updatedChat : chat
                    )
                );
                setSelectedChat(updatedChat);
            }
            setNewMessage("");
            setLoading(false); // Fin du chargement
        }, 1000); // Simule un délai de 1 seconde
    };

    return (
        <>
            <h1 className="text-3xl my-8">Messagerie</h1>
            <div className="flex mb-8 h-[700px]">
                {/* Sidebar pour les discussions */}
                <div className="w-1/3 bg-white shadow-lg rounded-l-lg">
                    <div className="p-4">
                        {chatsData.length > 0 ? (
                            chatsData.map((chat) => (
                                <div
                                    key={chat.id}
                                    onClick={() => setSelectedChat(chat)}
                                    className={`p-3 mb-2 cursor-pointer rounded-md hover:bg-easyorder-gray ${
                                        selectedChat?.id === chat.id ? "bg-easyorder-gray" : ""
                                    }`}
                                >
                                    <h3 className="font-bold text-gray-900">{chat.name}</h3>
                                    <p className="text-sm text-gray-600 truncate">
                                        {chat.messages[chat.messages.length - 1]?.content || "Aucun message."}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-600">Aucun message disponible.</p>
                        )}
                    </div>
                </div>

                {/* Zone de chat */}
                <div className="w-2/3 bg-gray-50 flex flex-col rounded-r-lg overflow-hidden shadow">
                    {selectedChat ? (
                        <>
                            <div className="flex items-center p-4 bg-white shadow-md">
                                <div className="w-12 h-12 rounded-full mr-4 overflow-hidden">
                                    <img src="https://picsum.photos/48/48" className="w-100 h-100 object-cover" alt=""/>
                                </div>
                                <h2 className="text-xl font-bold">{selectedChat.name}</h2>
                            </div>
                            <div className="flex-1 p-6 overflow-y-auto bg-easyorder-gray ">
                                {selectedChat.messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`mb-4 p-4 max-w-lg rounded-md shadow-md ${
                                            message.sender === "client" ? "bg-white self-end" : "ml-auto bg-easyorder-green self-start"
                                        }`}
                                    >
                                        <p>{message.content}</p>
                                        <span className="text-xs text-gray-500">{message.timestamp}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="p-4 bg-white shadow-md flex items-center">
                                <input
                                    type="text"
                                    placeholder="Message..."
                                    className="w-full p-2 border rounded-l-md border-easyorder-black border-r-0 outline-0"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                                <button
                                    onClick={handleSendMessage}
                                    className={`bg-easyorder-green border border-easyorder-black text-white px-4 py-2 rounded-r-md hover:bg-easyorder-black transition flex items-center justify-center gap-2 ${
                                        loading ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <FaSpinner className="animate-spin" /> Envoi...
                                        </>
                                    ) : (
                                        "Envoyer"
                                    )}
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center flex-1">
                            <p className="text-gray-500">Aucun chat sélectionné</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Chat;
