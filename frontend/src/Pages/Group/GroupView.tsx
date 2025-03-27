import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SERVER_URL from '../../../config/api';

type GroupType = {
    name: string;
    groupUrl: string;
    chats: Array<{
        senderName: string;
        message: string;
        timeStamp: Date;
    }>;
    visits: number;
    createdAt: Date;
}

const GroupView = () => {

    const groupUrl = useParams<{ groupUrl : string}>();
    const [group, setGroup] = useState<GroupType | null>(null);

    useEffect(() => {
        if(!groupUrl) return;
        axios.get(`${SERVER_URL}/group/${groupUrl.groupUrl}`)
            .then(group => setGroup(group.data))
            .catch(err => {
                console.error(err);
            })
    }, [groupUrl])

    return (
        <div>
            <div className="border border-gray-700 mb-5">
                <h1 className="text-xl m-6 text-center font-semibold">
                    {group?.name}
                </h1>
            </div>
            <div className="flex flex-row justify-center h-[80vh]">
                {/* messages */}
                <div className="flex flex-col gap-5 rounded-md p-5 bg-blue-500/20 w-[75%] h-full bottom-0 justify-between">
                    <div className="flex flex-col gap-4 p-4">
                        {group?.chats.map((item, index) => (
                            <div key={index} className="flex flex-col max-w-md p-3 rounded-lg shadow-md bg-blue-500">
                                <span className="text-gray-500">
                                    {item.timeStamp ? new Date(item.timeStamp).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Invalid Date"}
                                </span>

                                <p className="text-lg font-semibold text-white">{item.message}</p>

                                <div className="flex justify-between text-xs mt-2">
                                    <span className="font-semibold">{item.senderName}</span>
                                    <span className="text-gray-500">
                                        {item.timeStamp ? new Date(item.timeStamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "Invalid Time"}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='flex flex-col bg-white p-5 rounded-md'>
                        <button></button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GroupView;