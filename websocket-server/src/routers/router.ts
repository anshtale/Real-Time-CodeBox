
export type MessageTypes =
    | "requestToGetUsers"
    | "requestForAllData"
    | "code"
    | "input"
    | "language"
    | "submitBtnStatus"
    | "users"
    | "allData"
    | "cursorPosition"

interface MessageHandler {
    ( data: any, context: { userId: string | null, roomId: string, rooms: any }): void;
}

const requestRouter: Record<string, MessageHandler> = {
    requestToGetUsers: ( data, { userId, roomId, rooms }) => {
        const users = rooms[roomId].map((user: any) => ({
            id: user.userId,
            name: user.name,
        }));

        rooms[roomId].forEach((user: any) => {
            user.ws.send(JSON.stringify({ type: "users", users }));
        });
    },
    
    requestForAllData: ( data, { userId, roomId, rooms }) => {
        const otherUser = rooms[roomId].find(
            (user: any) => user.userId !== userId
        );

        if (otherUser) {
            otherUser.ws.send(
                JSON.stringify({
                    type: "requestForAllData",
                    userId: userId,
                })
            );
        }
    },

    code: (data, { userId, roomId, rooms }) => {
        broadcastToOthers(rooms[roomId], userId, { type: "code", code: data.code });
    },

    input: ( data, { userId, roomId, rooms }) => {
        broadcastToOthers(rooms[roomId], userId, { type: "input", input: data.input });
    },

    language: (data, { userId, roomId, rooms }) => {
        broadcastToOthers(rooms[roomId], userId, { type: "language", language: data.language });
    },

    submitBtnStatus: (data, { userId, roomId, rooms }) => {
        broadcastToOthers(rooms[roomId], userId, {
            type: "submitBtnStatus",
            value: data.value,
            isLoading: data.isLoading,
        });
    },

    users: ( data, { userId, roomId, rooms }) => {
        broadcastToOthers(rooms[roomId], userId, { type: "users", users: data.users });
    },

    allData: ( data, { userId, roomId, rooms }) => {
        const targetUser = rooms[roomId].find((user: any) => user.userId === data.userId);
        if (targetUser) {
            targetUser.ws.send(
                JSON.stringify({
                    type: "allData",
                    code: data.code,
                    input: data.input,
                    language: data.language,
                    currentButtonState: data.currentButtonState,
                    isLoading: data.isLoading,
                })
            );
        }
    },

    cursorPosition: ( data, { userId, roomId, rooms }) => {
        broadcastToOthers(rooms[roomId], userId, {
            type: "cursorPosition",
            cursorPosition: data.cursorPosition,
            userId: userId,
        });
    },
};

function broadcastToOthers(roomUsers: any[], excludeUserId: string | null, message: any) {
    roomUsers.forEach((user: any) => {
        if (user.userId !== excludeUserId) {
            user.ws.send(JSON.stringify(message));
        }
    });
}

export default requestRouter