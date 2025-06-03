import { useState, useEffect } from "react";
import MonacoEditor from '@monaco-editor/react';
import { userAtom } from "../atoms/userAtom";
import { useRecoilState } from "recoil";
import { socketAtom } from "../atoms/socketAtom";
import { useNavigate, useParams } from "react-router-dom";
import { connectedUsersAtom } from "../atoms/connectedUsersAtom";
import { CodeEditorHeader } from "@/components/CodeEditorHeader";
import { UserList } from "@/components/UsersList";
import { CodeOutput } from "@/components/CodeOutput";
import { toast } from "sonner";

export const CodeEditor = () => {
    const [code, setCode] = useState<any>("// Write your code here...");
    const [language, setLanguage] = useState("javascript");
    const [output, setOutput] = useState<string[]>([]); // Output logs
    const [socket, setSocket] = useRecoilState<WebSocket | null>(socketAtom);
    const [isLoading, setIsLoading] = useState(false); // Loading state
    const [currentButtonState, setCurrentButtonState] = useState("Submit Code");
    const [input, setInput] = useState<string>(""); // Input for code
    const [user, setUser] = useRecoilState(userAtom);
    const navigate = useNavigate();

    // multipleyer state
    const [connectedUsers, setConnectedUsers] = useRecoilState<any[]>(connectedUsersAtom);
    const params = useParams();

    useEffect(() => {
        if (!socket) {
            navigate('/' + params.roomId);
        } else {
            socket.send(
                JSON.stringify({
                    type: "requestToGetUsers",
                    roomId: user.roomId
                })
            );

            socket.send(
                JSON.stringify({
                    type: "requestForAllData",
                })
            )

            socket.onclose = () => {
                console.log('Socket closed');
                setUser({
                    id: "",
                    name: "",
                    roomId: ""
                })

                setSocket(null);
            }

            return () => {
                socket?.close();
            }
        }
    }, [socket, user.id]);

    useEffect(() => {
        if (!socket) {
            navigate('/' + params.roomId);
        } else {
            socket.onmessage = (event) => {
                const data = JSON.parse(event.data);

                if (data.type === 'users') {
                    toast.success("Users updated in room")
                    setConnectedUsers(data.users);
                }

                if (data.type === "code") {
                    setCode(data.code);
                }

                if (data.type === "output") {
                    setOutput((prevOutput) => [...prevOutput, data.message]);
                    toast.success("Code compiled successfully", {
                        description: "You can see the code output in output section",
                    })
                    handleButtonStatus("Submit Code", false);
                }
                if (data.type === "input") {
                    setInput(data.input);
                }

                if (data.type === "language") {
                    toast.success(`Language changed to ${data.language}`)
                    setLanguage(data.language);
                }

                if (data.type === "submitBtnStatus") {
                    setCurrentButtonState(data.value);
                    setIsLoading(data.isLoading);
                }

                if(data.type === "cursorPosition") {
                    const updatedUsers = connectedUsers.map((user) => {
                        if(user.id === data.userId) {
                            return {
                                ...user,
                                cursorPosition: data.cursorPosition
                            }
                        }
                        return user;
                    });
                    setConnectedUsers(updatedUsers);
                }

                if(data.type === "requestForAllData") {
                    socket.send(
                        JSON.stringify({
                            type: "allData",
                            code: code,
                            language: language,
                            input: input,
                            output: output,
                            currentButtonState,
                            isLoading,
                            userId: data.userId
                        })
                    )
                }

                if(data.type === "allData") {
                    setCode(data.code);
                    setLanguage(data.language);
                    setInput(data.input);
                    setCurrentButtonState(data.currentButtonState);
                    setIsLoading(data.isLoading);
                }
            }

        }
    },[code, input, language, currentButtonState, isLoading, connectedUsers])

    const handleSubmit = async () => {
        console.log("clicked")
        handleButtonStatus("Submitting...", true);

        const submission = {
            code,
            language,
            roomId: user.roomId,
            input
        };

        console.log("submission here->")
        console.log(JSON.stringify(submission));

        socket?.send(user?.id ? user.id : "");

        console.log(submission);

        const res = await fetch(`${import.meta.env.VITE_PRIMARY_BACKEND_URL}/submit`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(submission),
        });

        handleButtonStatus("Compiling...", true);

        if (!res.ok) {
            setOutput((prevOutput) => [
                ...prevOutput,
                "Error submitting code. Please try again.",
            ]);
            handleButtonStatus("Submit Code", false);
        }

    }

    const handleCodeChange = (value: any) => {
        setCode(value);
        socket?.send(
            JSON.stringify({
                type: "code",
                code: value,
                roomId: user.roomId
            })
        )
    }

    const handleInputChange = (e: any) => {
        setInput(e.target.value);
        socket?.send(
            JSON.stringify({
                type: "input",
                input: e.target.value,
                roomId: user.roomId
            })
        )
    }

    const handleLanguageChange = (value: any) => {
        setLanguage(value);
        socket?.send(
            JSON.stringify({
                type: "language",
                language: value,
                roomId: user.roomId
            })
        )
    }

    const handleButtonStatus = (value: any, isLoading: any) => {
        setCurrentButtonState(value);
        setIsLoading(isLoading);
        socket?.send(
            JSON.stringify({
                type: "submitBtnStatus",
                value: value,
                isLoading: isLoading,
                roomId: user.roomId
            })
        )
    }

    const handleEditorDidMount = (editor: any) => {
        if(editor){
            editor.onDidChangeCursorPosition((e: any) => {
                const cursorPosition = editor.getPosition();
                socket?.send(
                    JSON.stringify({
                        type: "cursorPosition",
                        cursorPosition: cursorPosition,
                        user: user.id
                    })
                )
            })

            editor.onDidChangeModelContent((e: any) => {
                setCode(editor.getValue());
                socket?.send(
                    JSON.stringify({
                        type: "code",
                        code: editor.getValue(),
                        roomId: user.roomId
                    })
                )
            })

            editor.onDidChangeCursorSelection((e: any) => {
                const selection = editor.getSelection();
                const selectedText = editor.getModel()?.getValueInRange(selection);
                console.log("Selected Code:", selectedText);
            })
        }

    }

    return (
        <div className="w-full h-full min-h-screen  min-w-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
            <div className="container mx-auto p-4 max-w-7xl">
                <CodeEditorHeader
                    language={language}
                    onLanguageChange={handleLanguageChange}
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                    currentButtonState={currentButtonState}
                />

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 h-[calc(100vh-160px)]">
                    {/* Code Editor - Takes most space on desktop */}
                    <div className="xl:col-span-2 order-2 xl:order-1">
                        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden shadow-xl h-full">
                            <MonacoEditor
                                value={code}
                                language={language}
                                theme="vs-dark"
                                onChange={(value)=>handleCodeChange(value)}
                                height="80vh"
                                onMount={handleEditorDidMount}
                            />
                        </div>
                    </div>

                    {/* User List - Left sidebar on desktop, top on mobile */}
                    <div className="xl:col-span-1 order-1 xl:order-2">
                        <UserList users={connectedUsers} roomId={user.roomId} />
                    </div>

                    {/* Input/Output - Right sidebar on desktop, bottom on mobile */}
                    <div className="xl:col-span-1 order-3">
                        <CodeOutput
                            output={output}
                            onClear={() => setOutput([])}
                            input={input}
                            onInputChange={handleInputChange}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}