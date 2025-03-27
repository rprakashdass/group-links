import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import SERVER_URL from '../../../config/api';
import { IoMdSend } from 'react-icons/io';

type ChatType = {
    senderName: string;
    message: string;
    timeStamp: Date;
}

type GroupType = {
    name: string;
    groupUrl: string;
    chats: ChatType[];
    visits: number;
    createdAt: Date;
}

const GroupView = () => {

    const [message, setMessage] = useState<string>("");
    const {groupUrl} = useParams<{ groupUrl : string}>();
    const [group, setGroup] = useState<GroupType | null>(null);
    const [chats, setChats] = useState<ChatType[]>([]);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(()  => {
        if(!groupUrl) return;
        axios.get(`${SERVER_URL}/group/${groupUrl}`)
            .then((response) => {
                setGroup(response.data)
                setChats(response.data.chats)
            })
            .catch(err => {
                console.error(err);
            })
    }, [groupUrl])

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'instant' });
    }, [chats]);

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!message.trim()) return;
        try{
            const response = await axios.post(`${SERVER_URL}/group/${groupUrl}/send-message`, {
                senderName : "Anonymous",
                message,
            })
            setChats([...(response.data.chats || [])] );
            setMessage("");
        } catch (err) {
            console.error("Error sending message", err);
        }
    }

    return (
        <div className='bg-yellow-50 h-screen'>
            <div className="w-full top-0 bg-blue-500 text-white border-b-1">
                <h1 className="text-xl p-3 text-center font-semibold">
                    {group?.name}
                </h1>
            </div>
            <div className="flex flex-row justify-center h-[92vh] bg-blue-400">
                <div className="flex flex-col gap-5 rounded-md p-5 w-full md:w-[75%] h-full bottom-0 justify-between">
                    {/* messages */}
                    <div className="flex flex-col gap-4 p-4 overflow-scroll">
                        {chats && chats.map((item, index) => (
                            <div key={index} className="flex flex-col max-w-md p-3 rounded-lg shadow-md bg-blue-100/30">
                                <span className="text-white/75">
                                    {item.timeStamp ? new Date(item.timeStamp).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Invalid Date"}
                                </span>
                                <p className="text-lg font-semibold text-white">{item.message}</p>
                                <div className="flex justify-between text-xs mt-2">
                                    <span className="font-semibold text-white/65">{item.senderName}</span>
                                    <span className="text-white/55">
                                        {item.timeStamp ? new Date(item.timeStamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "Invalid Time"}
                                    </span>
                                </div>
                            </div>
                        ))}
                        <div ref={chatEndRef}></div>
                    </div>
                    <div className='static'>
                        <form onSubmit={sendMessage} className='flex flex-row bg-white p-1 rounded-md'>
                            <input type='text'
                                name='message'
                                className='w-[95%] bg-white-300 bg-blue-100/50 p-1 rounded-md me-2'
                                onChange={(e) => setMessage(e.target.value)}
                                value={message}
                            />
                            <button type='submit'>
                                <IoMdSend
                                    size={24}
                                    className={`text-blue-500 ${!message.trim() && "opacity-50"}`}
                                />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GroupView;