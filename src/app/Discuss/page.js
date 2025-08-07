// src/app/Discuss/page.js
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchUser } from "@/lib/actions/user.actions";
import DiscussChannels from "@/components/DiscussChannels";

export default async function DiscussPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar with channels */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold">Discussion Channels</h1>
        </div>
        <DiscussChannels />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b bg-white">
          <h2 className="text-lg font-semibold">#general</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {/* Messages will go here */}
          <div className="space-y-4">
            {/* Sample message */}
            <div className="bg-white p-3 rounded-lg shadow">
              <div className="flex items-center space-x-2">
                <img 
                  src={userInfo.image} 
                  alt="User" 
                  className="w-8 h-8 rounded-full"
                />
                <span className="font-semibold">{userInfo.name}</span>
                <span className="text-xs text-gray-500">2:30 PM</span>
              </div>
              <p className="mt-2">Welcome to the general discussion channel!</p>
            </div>
          </div>
        </div>
        <div className="p-4 border-t bg-white">
          <form className="flex space-x-2">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}