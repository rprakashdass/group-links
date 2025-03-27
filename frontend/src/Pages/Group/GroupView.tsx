import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

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
        axios.get(`http://localhost:3000/group/${groupUrl.groupUrl}`)
            .then(group => setGroup(group.data))
            .catch(err => console.error(err))
    }, [groupUrl])

    return (
        <div>
            <div className="border border-gray-700 mb-5">
                <h1 className="text-xl m-6 text-center font-semibold">
                    {group?.name}
                </h1>
            </div>
            <div className="flex flex-row justify-center">
                {/* messages */}
                <div className="flex flex-col gap-5">
                    <div className="rounded-md p-5">
                        <div className="flex flex-col gap-4 p-4">
                        {group?.chats.map((item, index) => (
                            <div key={index} className={`flex flex-col max-w-md p-3 rounded-lg shadow-md 
                                ${item.senderName === "You" ? "bg-blue-500 text-white self-end" : "bg-gray-200 text-gray-900 self-start"}`}>
                                <span className="text-gray-500">
                                    {item.timeStamp ? new Date(item.timeStamp).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Invalid Date"}
                                </span>

                                <p className="text-lg font-semibold">{item.message}</p>

                                <div className="flex justify-between text-xs mt-2">
                                    <span className="font-semibold">{item.senderName}</span>
                                    <span className="text-gray-500">
                                        {item.timeStamp ? new Date(item.timeStamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "Invalid Time"}
                                    </span>
                                </div>
                            </div>
                        ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GroupView;