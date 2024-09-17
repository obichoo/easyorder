'use client';

import { useState } from "react";
import fakeChats from "@/app/chat/fake-chats";
import { FaArrowLeft } from 'react-icons/fa';

const Chat = () => {
    const [chatsData, setChatsData] = useState(fakeChats);

    const [selectedChat, setSelectedChat] = useState(chatsData[0] || null);

    return (
        <>
            <h1 className="text-3xl my-8">Messagerie</h1>
            <div className="flex mb-8 h-[700px]">
                {/* Sidebar pour les discussions */}
                <div className="w-1/3 bg-white shadow-lg rounded-l-lg">
                    <div className="p-4">
                        <h2 className="text-lg font-semibold mb-4">Discussions</h2>
                        {chatsData.length > 0 ? (
                            chatsData.map((chat) => (
                                <div
                                    key={chat.id}
                                    onClick={() => setSelectedChat(chat)}
                                    className={`p-3 mb-2 cursor-pointer rounded-md hover:bg-gray-200 ${
                                        selectedChat?.id === chat.id ? "bg-gray-200" : ""
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
                <div className="w-2/3 bg-gray-50 flex flex-col rounded-r-lg overflow-hidden">
                    {selectedChat ? (
                        <>
                            <div className="flex items-center p-4 bg-white shadow-md">
                                <div className="w-12 h-12 rounded-full bg-gray-400 mr-4"></div>
                                <h2 className="text-xl font-bold">{selectedChat.name}</h2>
                            </div>
                            <div className="flex-1 p-6 overflow-y-auto bg-gray-100">
                                {selectedChat.messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`mb-4 p-4 max-w-lg rounded-md shadow-md ${
                                            message.sender === "client" ? "bg-white self-end" : "ml-auto bg-blue-100 self-start"
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
                                    className="w-full p-2 border rounded-l-md border-gray-300 outline-0"
                                />
                                <button className="bg-easyorder-green text-white px-4 py-2 rounded-r-md hover:bg-easyorder-black transition">
                                    Envoyer
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
