import { useRef } from "react";
import SERVER_URL from "../../../config/api";
import axios from "axios";

const CreateGroupView = () => {
    const nameRef = useRef<HTMLInputElement>(null);
    const groupUrlRef = useRef<HTMLInputElement>(null);
    const adminOnlyChatRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const name = nameRef?.current?.value;
        const groupUrl = groupUrlRef?.current?.value;
        const adminOnlyChat = adminOnlyChatRef.current?.checked || false;

        if(!name || !groupUrl){
            alert("Both fields are required");
        }
        try{
            const urlExists = await axios.get(`${SERVER_URL}/group/exists/${groupUrl}`)
            if(urlExists.data){
                alert("Url already exists, try other");
                return;
            }
            const response = await axios.post(`${SERVER_URL}/group/create-group`, {
                name,
                groupUrl,
                adminOnlyChat
            })
            console.log("Group successfully created!", response.data);
            alert("Group created successfully!");
            window.location.href = `/group/${groupUrl}`;
        } catch (error) {
            console.error("Error creating group:", error);
            alert("Failed to create group!");
        }
    }
    return (
        <div className="">
            <div className="flex flex-col justify-center items-center">
                <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                    <label htmlFor="groupName">Enter the group name</label>
                    <input type="text" ref={nameRef} name="groupName" className="border border-green-500 rounded-md"></input>
                    <label htmlFor="groupUrl">Enter the group url</label>
                    <input type="text" ref={groupUrlRef} name="groupUrl" className="border border-green-500 rounded-md"></input>
                    <label htmlFor="adminOnlyChat" className="flex items-center gap-2">
                        <input type="checkbox" ref={adminOnlyChatRef} name="adminOnlyChat" className="h-4 w-4" />
                        Admin Only Chat
                    </label>
                    <button type="submit" className="bg-green-500 rounded-md p-3">Create Group</button>
                </form>
            </div>
        </div>
    )
}
export default CreateGroupView;