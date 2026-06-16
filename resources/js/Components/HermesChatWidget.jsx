import { useState, useRef, useEffect } from 'react';

export default function HermesChatWidget() {
    const [isOpen, setIsOpen] = useState(() => {
        const saved = sessionStorage.getItem('hermes_isOpen');
        return saved ? JSON.parse(saved) : false;
    });
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [messages, setMessages] = useState(() => {
        const saved = sessionStorage.getItem('hermes_messages');
        return saved ? JSON.parse(saved) : [
            { role: 'bot', text: 'Halo! Saya Hermes ✨\nAsisten finansial Anda. Ketik pengeluaran atau pemasukan hari ini, atau tanyakan ringkasan keuangan Anda!' }
        ];
    });

    useEffect(() => {
        sessionStorage.setItem('hermes_isOpen', JSON.stringify(isOpen));
    }, [isOpen]);

    useEffect(() => {
        sessionStorage.setItem('hermes_messages', JSON.stringify(messages));
    }, [messages]);
    
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const triggerSendMessage = async (messageText) => {
        if (messageText.trim() === '') return;
        
        setMessages(prev => [...prev, { role: 'user', text: messageText }]);
        setInputText('');
        setIsTyping(true);

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            
            const response = await fetch('/hermes/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ message: messageText })
            });
            
            const data = await response.json();
            setIsTyping(false);

            if (data.status === 'success') {
                setMessages(prev => [...prev, { role: 'bot', text: data.reply }]);
            } else {
                setMessages(prev => [...prev, { role: 'bot', text: 'Maaf, terjadi kesalahan: ' + data.reply }]);
            }
        } catch (error) {
            setIsTyping(false);
            setMessages(prev => [...prev, { role: 'bot', text: 'Maaf, koneksi ke server gagal. Pastikan internet Anda lancar.' }]);
        }
    };

    const sendMessage = (e) => {
        e.preventDefault();
        triggerSendMessage(inputText);
    };

    useEffect(() => {
        const handleQuickMessage = (e) => {
            const msg = e.detail;
            setIsOpen(true);
            triggerSendMessage(msg);
        };

        window.addEventListener('hermes-quick-message', handleQuickMessage);
        return () => window.removeEventListener('hermes-quick-message', handleQuickMessage);
    }, []);

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans">
            
            {/* Main Chat Window */}
            {isOpen && (
                <div className="absolute bottom-16 right-0 w-80 sm:w-96 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700 flex flex-col h-[500px] max-h-[80vh] animate-fade-in-up transition-colors duration-200">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900/50 rounded-t-2xl">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center border border-indigo-200 dark:border-indigo-700">
                                <span className="text-indigo-600 dark:text-indigo-400 font-bold text-sm">H</span>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">Hermes Assistant</h3>
                                <div className="flex items-center text-xs text-green-500 dark:text-green-400">
                                    <span className="w-2 h-2 rounded-full bg-green-500 dark:bg-green-400 mr-1"></span>
                                    Online
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-slate-900/20">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                                    msg.role === 'user' 
                                    ? 'bg-indigo-600 text-white rounded-tr-sm shadow-sm' 
                                    : 'bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-100 rounded-tl-sm shadow-sm border border-gray-100 dark:border-slate-600'
                                }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-white dark:bg-slate-700 text-gray-500 dark:text-gray-400 rounded-2xl rounded-tl-sm px-4 py-2 text-sm shadow-sm border border-gray-100 dark:border-slate-600 flex space-x-1 items-center">
                                    <div className="w-2 h-2 bg-gray-300 dark:bg-gray-500 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-gray-300 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    <div className="w-2 h-2 bg-gray-300 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={sendMessage} className="p-3 bg-white dark:bg-slate-800 border-t border-gray-100 dark:border-slate-700 rounded-b-2xl">
                        <div className="flex items-center bg-gray-50 dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-600 px-2 py-1 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 dark:focus-within:ring-indigo-500/40 transition-all">
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Tulis transaksi (misal: Beli kopi 30rb)"
                                className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 px-2 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                            />
                            <button 
                                type="submit" 
                                disabled={!inputText.trim()}
                                className="p-2 text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 dark:disabled:bg-indigo-800 disabled:cursor-not-allowed rounded-lg transition-colors"
                            >
                                <svg className="w-4 h-4 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Floating Button */}
            <button onClick={() => setIsOpen(!isOpen)} className="w-16 h-16 rounded-full bg-indigo-600 text-white shadow-xl hover:bg-indigo-700 hover:shadow-2xl hover:scale-105 transition transform duration-200 flex items-center justify-center focus:outline-none border-4 border-white">
                {!isOpen ? (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                ) : (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                )}
            </button>
        </div>
    );
}
