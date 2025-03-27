import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

type GroupType = {
    name: string;
    groupUrl: string;
    chats: Array<{
        senderName: string;
        message: string;
        timestamp: Date;
    }>;
    visits: number;
    createdAt: Date;
}

const Group = () => {

    const groupUrl = useParams<{ groupUrl : string}>();
    const [group, setGroup] = useState<GroupType | null>(null);

    useEffect(() => {
        // if(!groupUrl) return;
        axios.get(`http://localhost:3000/group/${groupUrl.groupUrl}`)
            .then(group => setGroup(group.data))
            .catch(err => console.error(err))
    }, [groupUrl])

    return (
        <div>
            <div className="border border-gray-700 mb-5">
                <h1 className="text-xl m-6">
                    {group?.name}
                </h1>
            </div>
            <div className="flex flex-row justify-center">
                {/* messages */}
                <div className="flex flex-col gap-5">
                    {/* sample messages */}
                    <div className="rounded-md p-5">
                        <div>{group?.chats.map((item) => (
                            <div className='p-5 border border-green-400 text-md mb-2'>
                                {item.message}
                            </div>
                        ))}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Group