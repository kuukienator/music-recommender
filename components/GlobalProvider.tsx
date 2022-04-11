import clsx from 'clsx';
import React, { FC, useEffect, useRef } from 'react';

export enum MessageType {
    Error = 'error',
    Warning = 'warning',
    Info = 'info',
    Success = 'success',
}

export type Message = {
    id: string;
    title: string;
    text: string;
    type: MessageType;
    timeout?: number;
};

type GlobalContextType = {
    addMessage: (message: Message) => void;
    clearMessages: () => void;
};

export const GlobalContext = React.createContext<GlobalContextType>({
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    addMessage: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    clearMessages: () => {},
});

export const getId = (): string =>
    `${Date.now()}-${Math.floor(Math.random() * 100)}`;

export const GlobalContextProvider: FC = ({ children }) => {
    const [messages, setMessages] = React.useState<Message[]>([]);
    const addMessage = (message: Message) => {
        setMessages([...messages, message]);
        if (message.timeout) {
            setTimeout(() => {
                setMessages((prev) => prev.filter((m) => m.id !== message.id));
            }, message.timeout);
        }
    };

    const clearMessages = () => {
        setMessages([]);
    };

    return (
        <GlobalContext.Provider value={{ addMessage, clearMessages }}>
            {children}
            {messages.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 z-50">
                    <div className="flex flex-col space-y-4 mx-4 my-8">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={clsx(
                                    'text-white p-2 border-2 w-full rounded-md',
                                    {
                                        'bg-red-500 border-red-700':
                                            message.type === MessageType.Error,
                                        'bg-blue-500 border-blue-700':
                                            message.type === MessageType.Info,
                                        'bg-yellow-500 border-yellow-700':
                                            message.type ===
                                            MessageType.Warning,
                                        'bg-green-500 border-green-700':
                                            message.type ===
                                            MessageType.Success,
                                    }
                                )}
                            >
                                <p className="font-bold">{message.title}</p>
                                <p>{message.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </GlobalContext.Provider>
    );
};
