const Page = () => {
    return (
        <div className="">
            <div className="flex h-screen flex-col justify-center items-center">
                <form className="flex flex-col gap-5">
                    <label htmlFor="groupName">Enter the group name</label>
                    <input type="text" name="groupName" className="border border-black rounded-sm " placeholder="ex. group1"></input>
                    <button type="submit" className="bg-blue-600 rounded-md p-3">Create Group</button>
                </form>
            </div>
        </div>
    )
}
export default Page;