// src/components/DiscussChannels.jsx
import Link from "next/link";

export default function DiscussChannels() {
  const channels = [
    { id: "general", name: "General Discussion" },
    { id: "welcome", name: "Welcome" },
    { id: "common", name: "Common Room" },
    { id: "help", name: "Help & Support" },
  ];

  return (
    <div className="space-y-1 p-2">
      {channels.map((channel) => (
        <Link
          key={channel.id}
          href={`/Discuss/${channel.id}`}
          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
        >
          # {channel.name}
        </Link>
      ))}
    </div>
  );
}