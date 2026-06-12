<x-app-layout>
    <x-slot name="header">
        <div class="flex justify-between items-center">
            <h2 class="font-semibold text-xl text-indigo-600 leading-tight flex items-center space-x-2">
                <span>✨</span>
                <span>{{ __('Hermes AI Assistant') }}</span>
            </h2>
        </div>
    </x-slot>

    <div class="py-12" x-data="hermesChat()">
        <div class="max-w-4xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex flex-col h-[70vh]">
                
                <!-- Chat Header -->
                <div class="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white flex items-center space-x-4 shadow-md z-10">
                    <div class="bg-white p-2 rounded-full shadow-inner">
                        <span class="text-xl">🤖</span>
                    </div>
                    <div>
                        <h3 class="font-bold text-lg leading-tight">Hermes</h3>
                        <p class="text-indigo-200 text-xs font-medium">Online | Financial Advisor</p>
                    </div>
                </div>

                <!-- Chat Messages Area -->
                <div class="flex-1 overflow-y-auto p-6 bg-gray-50 space-y-6" id="chat-messages">
                    <!-- AI Welcome Message -->
                    <div class="flex items-start space-x-3">
                        <div class="bg-indigo-100 p-2 rounded-full mt-1">
                            <span class="text-sm">🤖</span>
                        </div>
                        <div class="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 max-w-[80%] text-gray-800 text-sm">
                            <p class="mb-2">Halo! Saya <strong>Hermes</strong>, asisten keuangan pribadi Anda.</p>
                            <p>Anda bisa mengetik laporan transaksi sehari-hari, contohnya: <br><span class="bg-gray-100 px-2 py-1 rounded text-indigo-600 font-mono text-xs block mt-2 mb-2">"Saya baru saja beli makan siang Nasi Padang 35 ribu pakai Gopay"</span></p>
                            <p>Saya akan otomatis mencatatnya ke dalam pengeluaran Anda. Ada yang bisa saya bantu hari ini?</p>
                        </div>
                    </div>

                    <!-- Dynamic Messages -->
                    <template x-for="(msg, index) in messages" :key="index">
                        <div>
                            <!-- User Message -->
                            <div x-show="msg.role === 'user'" class="flex items-start space-x-3 justify-end mb-6">
                                <div class="bg-indigo-600 text-white p-4 rounded-2xl rounded-tr-none shadow-md max-w-[80%] text-sm" x-text="msg.content"></div>
                            </div>

                            <!-- AI Response -->
                            <div x-show="msg.role === 'assistant'" class="flex items-start space-x-3 mb-6">
                                <div class="bg-indigo-100 p-2 rounded-full mt-1">
                                    <span class="text-sm">🤖</span>
                                </div>
                                <div class="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 max-w-[80%] text-gray-800 text-sm whitespace-pre-wrap" x-html="msg.content"></div>
                            </div>
                        </div>
                    </template>

                    <!-- Loading Indicator -->
                    <div x-show="isLoading" class="flex items-start space-x-3" x-cloak>
                        <div class="bg-indigo-100 p-2 rounded-full mt-1">
                            <span class="text-sm">🤖</span>
                        </div>
                        <div class="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 flex items-center space-x-2">
                            <div class="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                            <div class="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                            <div class="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
                        </div>
                    </div>
                </div>

                <!-- Chat Input Area -->
                <div class="p-4 bg-white border-t border-gray-100">
                    <form @submit.prevent="sendMessage" class="flex items-center space-x-3 relative">
                        <input type="text" x-model="newMessage" :disabled="isLoading" placeholder="Ketik transaksi atau tanya seputar keuangan..." 
                            class="flex-1 border-gray-300 rounded-full pl-5 pr-12 py-3 shadow-sm focus:border-indigo-400 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm transition duration-200">
                        <button type="submit" :disabled="isLoading || newMessage.trim() === ''" class="absolute right-4 text-indigo-600 hover:text-indigo-800 p-2 rounded-full transition duration-150 disabled:opacity-50">
                            <svg class="w-6 h-6 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <script>
        document.addEventListener('alpine:init', () => {
            Alpine.data('hermesChat', () => ({
                newMessage: '',
                messages: [],
                isLoading: false,

                async sendMessage() {
                    if (this.newMessage.trim() === '') return;
                    
                    const messageContent = this.newMessage;
                    this.messages.push({ role: 'user', content: messageContent });
                    this.newMessage = '';
                    this.isLoading = true;
                    this.scrollToBottom();

                    try {
                        const response = await fetch("{{ route('hermes.sendMessage') }}", {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-CSRF-TOKEN': '{{ csrf_token() }}'
                            },
                            body: JSON.stringify({ message: messageContent })
                        });
                        
                        const data = await response.json();
                        
                        if (data.status === 'success') {
                            let formattedReply = data.reply.replace(/\n/g, '<br>');
                            this.messages.push({ role: 'assistant', content: formattedReply });
                        } else {
                            this.messages.push({ role: 'assistant', content: '<i>Terjadi kesalahan: ' + data.reply + '</i>' });
                        }
                    } catch (error) {
                        this.messages.push({ role: 'assistant', content: '<i>Gagal mengirim pesan. Periksa koneksi internet Anda.</i>' });
                    } finally {
                        this.isLoading = false;
                        this.scrollToBottom();
                    }
                },

                scrollToBottom() {
                    setTimeout(() => {
                        const container = document.getElementById('chat-messages');
                        if (container) {
                            container.scrollTop = container.scrollHeight;
                        }
                    }, 100);
                }
            }));
        });
    </script>
</x-app-layout>
