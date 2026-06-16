<div x-data="hermesChat()" class="fixed bottom-6 right-6 z-50 font-sans">
    
    <!-- Chat Window -->
    <div x-show="isOpen" x-transition:enter="transition ease-out duration-200 transform" x-transition:enter-start="opacity-0 translate-y-4 scale-95" x-transition:enter-end="opacity-100 translate-y-0 scale-100" x-transition:leave="transition ease-in duration-150 transform" x-transition:leave-start="opacity-100 translate-y-0 scale-100" x-transition:leave-end="opacity-0 translate-y-4 scale-95" style="display: none;" class="absolute bottom-20 right-0 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden" style="height: 500px; max-height: calc(100vh - 120px);">
        
        <!-- Header -->
        <div class="bg-indigo-600 text-white p-4 flex justify-between items-center shadow-md z-10">
            <div class="flex items-center space-x-2">
                <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <span class="text-xl">✨</span>
                </div>
                <div>
                    <h3 class="font-bold text-sm">Hermes AI</h3>
                    <p class="text-xs text-indigo-100">Financial Assistant</p>
                </div>
            </div>
            <button @click="isOpen = false" class="text-indigo-100 hover:text-white transition focus:outline-none">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        </div>

        <!-- Messages Area -->
        <div x-ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 flex flex-col">
            <template x-for="(msg, index) in messages" :key="index">
                <div :class="msg.role === 'user' ? 'self-end' : 'self-start'" class="max-w-[85%]">
                    <div :class="msg.role === 'user' ? 'bg-indigo-600 text-white rounded-l-2xl rounded-tr-2xl' : 'bg-white border border-gray-100 text-gray-800 rounded-r-2xl rounded-tl-2xl shadow-sm'" class="px-4 py-2 text-sm leading-relaxed whitespace-pre-wrap" x-text="msg.text"></div>
                </div>
            </template>
            
            <!-- Typing Indicator -->
            <div x-show="isTyping" class="self-start max-w-[85%]">
                <div class="bg-white border border-gray-100 rounded-r-2xl rounded-tl-2xl shadow-sm px-4 py-3 flex space-x-1 items-center">
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0s;"></div>
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s;"></div>
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.4s;"></div>
                </div>
            </div>
        </div>

        <!-- Input Area -->
        <div class="p-3 bg-white border-t border-gray-100">
            <form @submit.prevent="sendMessage" class="flex space-x-2">
                <input type="text" x-model="inputText" placeholder="Ketik transaksi atau tanya AI..." class="flex-1 border-gray-300 rounded-full px-4 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 disabled:opacity-50" :disabled="isTyping">
                <button type="submit" :disabled="isTyping || inputText.trim() === ''" class="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                    <svg class="w-4 h-4 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                </button>
            </form>
        </div>
    </div>

    <!-- Floating Button -->
    <button @click="isOpen = !isOpen" class="w-16 h-16 rounded-full bg-indigo-600 text-white shadow-xl hover:bg-indigo-700 hover:shadow-2xl hover:scale-105 transition transform duration-200 flex items-center justify-center focus:outline-none border-4 border-white">
        <svg x-show="!isOpen" class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
        </svg>
        <svg x-cloak x-show="isOpen" class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
    </button>
</div>

<script>
document.addEventListener('alpine:init', () => {
    Alpine.data('hermesChat', () => ({
        isOpen: false,
        inputText: '',
        isTyping: false,
        messages: [
            { role: 'bot', text: 'Halo! Saya Hermes ✨\nAsisten finansial Anda. Ketik pengeluaran atau pemasukan hari ini, atau tanyakan ringkasan keuangan Anda!' }
        ],
        sendMessage() {
            if (this.inputText.trim() === '') return;
            
            const currentInput = this.inputText;
            this.messages.push({ role: 'user', text: currentInput });
            this.inputText = '';
            this.isTyping = true;
            this.scrollToBottom();

            fetch('{{ route("hermes.sendMessage") }}', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify({ message: currentInput })
            })
            .then(response => response.json())
            .then(data => {
                this.isTyping = false;
                if (data.status === 'success') {
                    this.messages.push({ role: 'bot', text: data.reply });
                } else {
                    this.messages.push({ role: 'bot', text: 'Maaf, terjadi kesalahan: ' + data.reply });
                }
                this.scrollToBottom();
            })
            .catch(error => {
                this.isTyping = false;
                this.messages.push({ role: 'bot', text: 'Maaf, koneksi ke server gagal. Pastikan internet Anda lancar.' });
                this.scrollToBottom();
            });
        },
        scrollToBottom() {
            setTimeout(() => {
                if (this.$refs.messagesContainer) {
                    this.$refs.messagesContainer.scrollTop = this.$refs.messagesContainer.scrollHeight;
                }
            }, 50);
        }
    }));
});
</script>
