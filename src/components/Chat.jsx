import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { createSocketConnection } from '../utils/socket';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';


const Chat = () => {
    const { targetUserId } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const user = useSelector((store) => store.user);
    const userId = user?._id;

    const fetchChatMessages = async () => {
        try {
            const chat = await axios.get(BASE_URL + "/chat/" + targetUserId, {
                withCredentials: true,
            });
            const chatMessages = chat?.data?.data?.messages.map(msg => {
                const { senderId, text } = msg;
                return {
                    firstName: senderId?.firstName,
                    lastName: senderId?.lastName,
                    text: text
                }
            });
            setMessages(chatMessages);
            console.log(chatMessages);
        } catch (err) {
            console.error('Error fetching chat messages:', err);
        }
    };

    useEffect(() => {
        fetchChatMessages();
    }, [messages]);

    useEffect(() => {
        if (!userId) return;
        const socket = createSocketConnection();
        socket.emit("joinChat", { firstName: user.firstName, userId, targetUserId });
        socket.on("messageReceived", ({ firstName, lastName, text }) => {
            console.log(firstName + " : " + text)
            setMessages((messages) => [...messages, { firstName, lastName, text }]);
        });
        return () => {
            socket.disconnect();
        }
    }, [userId, targetUserId]);

    const sendMessage = () => {
        const socket = createSocketConnection();
        socket.emit("sendMessage", { firstName: user.firstName, lastName: user.lastName, userId, targetUserId, text: newMessage });
        setNewMessage("");
    };

    return (
        <div className='w-1/2 mx-auto border border-gray-300 rounded-lg bg-base-200 my-10 h-[70vh] flex flex-col'>
            <h1 className='p-5 border-b border-gray-300'>Chat</h1>
            <div className='flex-1 overflow-scroll p-5'>
                {messages.map((msg, index) => {
                    return (
                        <div key={index} className={"chat " + (user.firstName === msg.firstName ? "chat-end" : "chat-start")}>
                            <div className="chat-header m-2">
                                {`${msg.firstName} ${msg.lastName}`}
                                <time className="text-xs opacity-50">a while ago</time>
                            </div>
                            <div className="chat-bubble">{msg.text}</div>
                            <div className="chat-footer opacity-50 m-1">Seen</div>
                        </div>
                    )
                })}
            </div>
            <div className='p-5 border-t border-gray-600 flex items-center '>
                <input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                    }
                }
                } type="text" placeholder="Type your message here..." className="flex-1 border border-gray-400 text-white rounded p-2" />
                <button onClick={sendMessage} className="btn btn-primary ml-2">Send</button>
            </div>
        </div>
    )
}

export default Chat;