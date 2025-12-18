import { BotMessageSquare, Clock, Headphones, MessageCircle, MessageSquare, Phone, Send, User } from 'lucide-react'; // Using lucide icons for placeholders
import * as React from 'react';
import AppLogoIcon from './app-logo-icon';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export default function ChatbotField() {
    return (
        <div className="">
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        // variant="outline"
                        className="fixed right-14 bottom-14 h-fit w-fit rounded-full bg-[#D9D9D9] py-3 text-[##212544] shadow-lg hover:bg-[#3d4d75] hover:text-white"
                    >
                        <MessageCircle className="size-14" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="right-10 w-[500px] overflow-hidden rounded-4xl bg-[#A8A9AA] p-0" side="left" align="end" sideOffset={16}>
                    <Tabs defaultValue="ai">
                        {/* Header */}
                        <header className="flex flex-col items-center rounded-b-[28px] bg-[#212544] px-4 pt-6 pb-4 text-white">
                            {/* Logo + Title */}
                            <div className="mb-2.5 flex items-center text-center">
                                <AppLogoIcon className="mr-3 size-24 fill-white" />
                                <h1 className="text-lg font-extralight">Lean Coffee Roastery Support</h1>
                            </div>

                            {/* Tabs */}
                            <TabsList className="mx-10 -mb-14 flex w-full gap-16 rounded-xl bg-transparent p-1 py-10 *:border *:bg-[#D9D9D9] *:py-4 *:text-[#212544] *:shadow-2xl data-[state=active]:mx-9 *:data-[state=active]:border *:data-[state=active]:border-[#212544]">
                                <TabsTrigger
                                    value="ai"
                                    className="flex flex-1 items-center justify-center gap-2 rounded-lg text-sm data-[state=active]:bg-[#D9D9D9] data-[state=active]:text-[#212544]"
                                >
                                    <BotMessageSquare className="h-4 w-4 border" />
                                    AI Assistant
                                </TabsTrigger>

                                <TabsTrigger
                                    value="live"
                                    className="flex flex-1 items-center justify-center gap-2 rounded-lg text-sm *:fill-[#212544] data-[state=active]:bg-[#D9D9D9] data-[state=active]:text-[#212544]"
                                >
                                    <IconCallCenter className="h-4 w-4" />
                                    Live Support
                                </TabsTrigger>
                            </TabsList>
                        </header>

                        {/* Tab Contents */}
                        <TabsContent value="ai" className="m-0 mt-9 p-0">
                            <ChatbotUI />
                        </TabsContent>
                        <TabsContent value="live" className="m-0 mt-9 p-0">
                            <LiveSupportUI />
                        </TabsContent>
                    </Tabs>
                </PopoverContent>
            </Popover>
        </div>
    );
}

// --- Chatbot UI Component ---
const ChatbotUI = () => {
    const chatMessages = [
        {
            id: 1,
            type: 'bot' as const,
            text: "Hi! I'm your coffee assistant. How can I help you today?",
            time: '04:59 PM',
        },
        {
            id: 2,
            type: 'user' as const,
            text: 'Can you help me?',
            time: '04:59 PM',
        },
        {
            id: 3,
            type: 'bot' as const,
            text: "I'd be happy to help you with information about our coffee, locations, menu, or orders. What specific information are you looking for?",
            time: '05:00 PM',
        },
    ];

    return (
        <div className="flex h-[500px] w-full flex-col overflow-hidden shadow-lg">
            {/* Chat Area */}
            <div className="flex-1 space-y-4 overflow-y-auto p-4">
                {chatMessages.map((message) => (
                    <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {message.type === 'bot' && (
                            <div className="flex items-start">
                                <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 p-1 text-[#212544]">
                                    <MessageSquare size={16} />
                                </div>
                                <div className="max-w-xs rounded-xl rounded-tl-none bg-gray-100 p-3 shadow-sm">
                                    <p className="text-sm text-gray-800">{message.text}</p>
                                    <p className="mt-1 text-right text-[10px] text-gray-500">{message.time}</p>
                                </div>
                            </div>
                        )}

                        {message.type === 'user' && (
                            <div className="flex items-start">
                                <div className="max-w-xs rounded-xl rounded-br-none bg-[#212544] p-3 text-white shadow-sm">
                                    <p className="text-sm">{message.text}</p>
                                    <p className="mt-1 text-left text-[10px] opacity-70">{message.time}</p>
                                </div>
                                <div className="ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 p-1 text-[#212544]">
                                    <User size={16} />
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Input Footer */}
            <footer className="flex items-center gap-3 border-t bg-[#212544] p-3 py-14">
                <Input
                    type="text"
                    placeholder="Ask anything you need..."
                    className="flex-1 rounded-lg border-gray-300 bg-gray-100 px-4 py-2 text-black focus-visible:ring-gray-700"
                />
                <Button className="group items-center rounded-lg bg-white p-2 hover:bg-[#3d4d75]">
                    <Send size={20} className="text-[#212544] group-hover:text-white" />
                </Button>
            </footer>
        </div>
    );
};

// --- Live Support UI Component ---
const LiveSupportUI = () => {
    return (
        <div className="flex h-[500px] w-full flex-col overflow-hidden shadow-lg">
            {/* Main Content */}
            <div className="flex flex-1 flex-col items-center justify-start space-y-6 overflow-y-auto p-8">
                <div className="flex items-center justify-center rounded-full text-[#212544]">
                    <Headphones className="size-24" />
                </div>
                <h2 className="text-2xl font-bold text-[#212544]">Live Customer Support</h2>
                <p className="text-center text-sm text-[#212544]">
                    Connect with our customer service team
                    <br />
                    for personalized assistance
                </p>

                {/* Support Hours Card */}
                <div className="w-full max-w-xs rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center">
                        <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-[#212544]">
                            <Clock size={20} />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-800">Support Hours</p>
                            <p className="text-sm text-gray-600">Mon-Sun: 8:00 AM - 10:00 PM</p>
                        </div>
                    </div>
                </div>

                {/* Call Us Card */}
                <div className="w-full max-w-xs rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center">
                        <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-[#212544]">
                            <Phone size={20} />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-800">Call Us</p>
                            <p className="text-sm text-gray-600">+62 21 1234 5678</p>
                        </div>
                    </div>
                </div>

                {/* Start Live Chat Button */}
                <Button className="mt-2 w-full max-w-xs rounded-lg bg-[#212544] py-3 text-white hover:bg-[#3d4d75]">Start Live Chat</Button>
                <div className="items-center bg-green-400 px-7">
                    <p className="text-xs font-extralight text-[#212544]">Avg. wait time: 3 minutes</p>
                </div>
            </div>
        </div>
    );
};

const IconCallCenter = (props: React.SVGAttributes<SVGElement>) => {
    return (
        <svg width="24" height="24" {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M10.7034 7.546C11.1431 7.62892 11.5554 7.8198 11.9031 8.10149C12.2508 8.38317 12.5231 8.74684 12.6955 9.15981C12.8679 9.57278 12.9349 10.0221 12.8907 10.4674C12.8464 10.9127 12.6922 11.34 12.4419 11.711L19.3589 17.08C19.5841 16.9633 19.8423 16.9262 20.0913 16.9746C20.3403 17.0231 20.5657 17.1543 20.7307 17.347C20.8958 17.5397 20.9909 17.7825 21.0006 18.036C21.0102 18.2896 20.9339 18.5389 20.784 18.7436C20.6341 18.9483 20.4194 19.0963 20.1748 19.1636C19.9302 19.2309 19.67 19.2135 19.4365 19.1143C19.2029 19.0151 19.0098 18.8399 18.8885 18.6171C18.7671 18.3943 18.7246 18.137 18.7679 17.887L11.7329 12.426C11.4016 12.653 11.0238 12.8033 10.6271 12.8658C10.2304 12.9284 9.82478 12.9017 9.43972 12.7876C9.05466 12.6735 8.69989 12.475 8.40127 12.2065C8.10264 11.9379 7.86768 11.6062 7.7135 11.2354C7.55932 10.8645 7.4898 10.464 7.51001 10.0629C7.53023 9.6618 7.63966 9.27027 7.83034 8.91682C8.02102 8.56338 8.28814 8.25692 8.61225 8.01978C8.93636 7.78263 9.30929 7.62078 9.70387 7.546L9.70287 3H10.7029L10.7034 7.546ZM11.1029 10.2C11.1029 10.3182 11.0796 10.4352 11.0344 10.5444C10.9891 10.6536 10.9228 10.7528 10.8393 10.8364C10.7557 10.92 10.6565 10.9863 10.5473 11.0315C10.4381 11.0767 10.3211 11.1 10.2029 11.1C10.0847 11.1 9.96764 11.0767 9.85845 11.0315C9.74926 10.9863 9.65004 10.92 9.56647 10.8364C9.4829 10.7528 9.4166 10.6536 9.37137 10.5444C9.32615 10.4352 9.30287 10.3182 9.30287 10.2C9.30287 9.96131 9.39769 9.73239 9.56647 9.5636C9.73525 9.39482 9.96417 9.3 10.2029 9.3C10.4416 9.3 10.6705 9.39482 10.8393 9.5636C11.008 9.73239 11.1029 9.96131 11.1029 10.2Z"
                // fill="#303182"
            />
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M10.7034 7.546C11.1431 7.62892 11.5554 7.8198 11.9031 8.10149C12.2508 8.38317 12.5231 8.74684 12.6955 9.15981C12.8679 9.57278 12.9349 10.0221 12.8907 10.4674C12.8464 10.9127 12.6922 11.34 12.4419 11.711L19.3589 17.08C19.5841 16.9633 19.8423 16.9262 20.0913 16.9746C20.3403 17.0231 20.5657 17.1543 20.7307 17.347C20.8958 17.5397 20.9909 17.7825 21.0006 18.036C21.0102 18.2896 20.9339 18.5389 20.784 18.7436C20.6341 18.9483 20.4194 19.0963 20.1748 19.1636C19.9302 19.2309 19.67 19.2135 19.4365 19.1143C19.2029 19.0151 19.0098 18.8399 18.8885 18.6171C18.7671 18.3943 18.7246 18.137 18.7679 17.887L11.7329 12.426C11.4016 12.653 11.0238 12.8033 10.6271 12.8658C10.2304 12.9284 9.82478 12.9017 9.43972 12.7876C9.05466 12.6735 8.69989 12.475 8.40127 12.2065C8.10264 11.9379 7.86768 11.6062 7.7135 11.2354C7.55932 10.8645 7.4898 10.464 7.51001 10.0629C7.53023 9.6618 7.63966 9.27027 7.83034 8.91682C8.02102 8.56338 8.28814 8.25692 8.61225 8.01978C8.93636 7.78263 9.30929 7.62078 9.70387 7.546L9.70287 3H10.7029L10.7034 7.546ZM11.1029 10.2C11.1029 10.3182 11.0796 10.4352 11.0344 10.5444C10.9891 10.6536 10.9228 10.7528 10.8393 10.8364C10.7557 10.92 10.6565 10.9863 10.5473 11.0315C10.4381 11.0767 10.3211 11.1 10.2029 11.1C10.0847 11.1 9.96764 11.0767 9.85845 11.0315C9.74926 10.9863 9.65004 10.92 9.56647 10.8364C9.4829 10.7528 9.4166 10.6536 9.37137 10.5444C9.32615 10.4352 9.30287 10.3182 9.30287 10.2C9.30287 9.96131 9.39769 9.73239 9.56647 9.5636C9.73525 9.39482 9.96417 9.3 10.2029 9.3C10.4416 9.3 10.6705 9.39482 10.8393 9.5636C11.008 9.73239 11.1029 9.96131 11.1029 10.2Z"
                fill="black"
                fill-opacity="0.2"
            />
            <path
                d="M13.815 10.192C13.8152 9.50034 13.6162 8.82328 13.2417 8.24178C12.8672 7.66028 12.3332 7.19895 11.7035 6.91298V3.05298C13.848 3.24148 14.962 3.91698 15.9595 4.84148C16.0098 4.88848 16.0591 4.93398 16.1075 4.97798C16.5325 5.36798 16.8705 5.67898 17.045 6.14398L19.162 11.78C19.2186 11.9313 19.2377 12.094 19.2177 12.2543C19.1977 12.4145 19.1392 12.5676 19.0471 12.7003C18.9551 12.8331 18.8323 12.9415 18.6892 13.0164C18.5461 13.0913 18.387 13.1305 18.2255 13.1305H17.41V14.3L13.6225 11.359C13.7506 10.9834 13.8158 10.5893 13.8155 10.1925M8.70345 6.92298V3.12048C4.20845 3.79698 3.00195 7.15048 3.00195 8.98748C3.00195 11.871 4.84345 14.1075 5.70695 15.004V21H14.263V17.744H16.4095C16.5605 17.744 16.7045 17.71 16.8325 17.65L11.54 13.54C10.6652 13.901 9.6835 13.903 8.80726 13.5457C7.93102 13.1883 7.23071 12.5003 6.85787 11.6306C6.48504 10.7608 6.46965 9.77923 6.81505 8.89822C7.16044 8.0172 7.83884 7.30761 8.70345 6.92298Z"
                // fill="#303182"
            />
            <path
                d="M13.815 10.192C13.8152 9.50034 13.6162 8.82328 13.2417 8.24178C12.8672 7.66028 12.3332 7.19895 11.7035 6.91298V3.05298C13.848 3.24148 14.962 3.91698 15.9595 4.84148C16.0098 4.88848 16.0591 4.93398 16.1075 4.97798C16.5325 5.36798 16.8705 5.67898 17.045 6.14398L19.162 11.78C19.2186 11.9313 19.2377 12.094 19.2177 12.2543C19.1977 12.4145 19.1392 12.5676 19.0471 12.7003C18.9551 12.8331 18.8323 12.9415 18.6892 13.0164C18.5461 13.0913 18.387 13.1305 18.2255 13.1305H17.41V14.3L13.6225 11.359C13.7506 10.9834 13.8158 10.5893 13.8155 10.1925M8.70345 6.92298V3.12048C4.20845 3.79698 3.00195 7.15048 3.00195 8.98748C3.00195 11.871 4.84345 14.1075 5.70695 15.004V21H14.263V17.744H16.4095C16.5605 17.744 16.7045 17.71 16.8325 17.65L11.54 13.54C10.6652 13.901 9.6835 13.903 8.80726 13.5457C7.93102 13.1883 7.23071 12.5003 6.85787 11.6306C6.48504 10.7608 6.46965 9.77923 6.81505 8.89822C7.16044 8.0172 7.83884 7.30761 8.70345 6.92298Z"
                fill="black"
                fill-opacity="0.2"
            />
        </svg>
    );
};
