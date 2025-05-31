import { Users, Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
interface User {
    id: string;
    name: string;
}

interface UserListProps {
    users: User[];
    roomId: string;
}

export const UserList = ({ users, roomId }: UserListProps) => {
    const [copied, setCopied] = useState(false);

    const copyInviteCode = async () => {
        try {
            await navigator.clipboard.writeText(roomId);
            setCopied(true);
            toast.message(
                "Copied!",
                { description: "Invitation code copied to clipboard" }
            );
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast.error(
                "Error",
                { description: "Failed to copy invitation code" }
            );
        }
    };

    const generateUserColor = (name: string) => {
        const colors = [
            "bg-gradient-to-br from-purple-500 to-pink-500",
            "bg-gradient-to-br from-blue-500 to-cyan-500",
            "bg-gradient-to-br from-green-500 to-emerald-500",
            "bg-gradient-to-br from-orange-500 to-red-500",
            "bg-gradient-to-br from-indigo-500 to-purple-500",
            "bg-gradient-to-br from-yellow-500 to-orange-500",
        ];
        const index = name.charCodeAt(0) % colors.length;
        return colors[index];
    };

    return (
        <div className="space-y-4">
            {/* Users Section */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 shadow-xl">
                <div className="flex items-center gap-2 mb-4">
                    <Users className="w-5 h-5 text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">
                        Users ({users.length})
                    </h3>
                </div>

                <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
                    {users.length > 0 ? (
                        users.map((user, index) => (
                            <div
                                key={user.id || index}
                                className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-200"
                            >
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${generateUserColor(
                                        user.name
                                    )} shadow-lg`}
                                >
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white font-medium truncate">{user.name}</p>
                                    <div className="flex items-center gap-1">
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                        <span className="text-xs text-green-400">Active</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8">
                            <Users className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                            <p className="text-gray-400">No users connected</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Invitation Code Section */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 shadow-xl">
                <h3 className="text-lg font-semibold text-white mb-3">Room Code</h3>
                <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-800/50 border border-gray-600 rounded-lg p-3">
                        <code className="text-blue-300 font-mono text-sm break-all">
                            {roomId || "Loading..."}
                        </code>
                    </div>
                    <button
                        onClick={copyInviteCode}
                        className="p-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200 group"
                        title="Copy invitation code"
                    >
                        {copied ? (
                            <Check className="w-4 h-4 text-white" />
                        ) : (
                            <Copy className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                        )}
                    </button>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                    Share this code with others to join the session
                </p>
            </div>
        </div>
    );
};