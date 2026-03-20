const { useState, useEffect, useRef } = React;

const APP_ID = 'daksh-brahmgeet-ultimate-v1';
const WEBHOOKS = {
  Daksh: "https://discord.com/api/webhooks/1484129273173381130/Nl0nlQlzK9HlU_t1jgW_tyqvQYIWmC2l-1fOmUfIAQxOK4c4DpZhCZQIxg4qp-PHe5fN",
  Brahmgeet: "https://discord.com/api/webhooks/1484129276109262909/oIAQEcDMz1ahh4mfT5oaIzbchnXKlpLgoWcJGQ7L-3zLSayINLWVQfKWRApxn4dXh8Wz"
};

const EMOJIS = {
  common: ["😂", "❤️", "😍", "😭", "😊", "🥺", "💀", "🔥", "🥰", "✨", "👍", "🙏", "👀", "💯", "💕", "🤭", "🤣", "😘", "😜", "😎", "🤩", "🥳", "😏", "🙄", "😴", "🤯"],
  quick: ["❤️", "😂", "😮", "😢", "🙏", "👍"]
};

const THEMES = {
  colors: [
    { name: 'Blue', class: 'bg-blue-500', value: 'blue' }, { name: 'Purple', class: 'bg-purple-500', value: 'purple' },
    { name: 'Pink', class: 'bg-pink-500', value: 'pink' }, { name: 'Rose', class: 'bg-rose-500', value: 'rose' },
    { name: 'Emerald', class: 'bg-emerald-500', value: 'emerald' }, { name: 'Dark', class: 'bg-gray-800', value: 'gray' }
  ],
  wallpapers: [
    { name: 'Clean', class: '' }, { name: 'Grid', class: 'bg-paper-grid' }, { name: 'Doodle', class: 'bg-paper-doodle' }, { name: 'Stars', class: 'bg-paper-stars' }
  ]
};

// Utilities
const formatTime = (iso) => new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
const isSameDay = (d1, d2) => { const a=new Date(d1),b=new Date(d2); return a.getFullYear()===b.getFullYear()&&a.getMonth()===b.getMonth()&&a.getDate()===b.getDate(); };
const getDateLabel = (iso) => {
  const d = new Date(iso), t = new Date(), y = new Date(t); y.setDate(y.getDate()-1);
  if(isSameDay(d, t)) return "Today"; if(isSameDay(d, y)) return "Yesterday";
  return d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
};

const compressImage = (dataUrl) => new Promise(resolve => {
  const img = new Image();
  img.onload = () => {
    const cvs = document.createElement('canvas');
    let { width, height } = img;
    if (width > height && width > 1000) { height *= 1000 / width; width = 1000; } 
    else if (height > 1000) { width *= 1000 / height; height = 1000; }
    cvs.width = width; cvs.height = height;
    cvs.getContext('2d').drawImage(img, 0, 0, width, height);
    resolve(cvs.toDataURL('image/jpeg', 0.7));
  };
  img.src = dataUrl;
});
const blobToBase64 = blob => new Promise(res => { const r = new FileReader(); r.onloadend = () => res(r.result); r.readAsDataURL(blob); });

const formatTextWithLinks = (text) => {
  if (!text) return null;
  const regex = /(https?:\/\/[^\s]+)/g;
  return text.split(regex).map((part, i) => 
    part.match(regex) ? <a key={i} href={part} target="_blank" className="text-blue-300 dark:text-blue-400 underline underline-offset-2 break-words" onClick={e => e.stopPropagation()}>{part}</a> : <span key={i}>{part}</span>
  );
};

// Avatar Component
const Avatar = ({ name, isOnline, size = "md", colorClass }) => {
  const sizes = { sm: "w-8 h-8 text-sm", md: "w-10 h-10 text-base", lg: "w-20 h-20 text-3xl" };
  return (
    <div className={`rounded-full flex items-center justify-center text-white font-bold shadow-sm relative shrink-0 ${colorClass} ${sizes[size]}`}>
      {name ? name.charAt(0).toUpperCase() : "?"}
      {isOnline && size !== "lg" && <div className={`absolute bottom-0 right-0 rounded-full bg-green-500 border-2 border-white dark:border-[#1a1d24] ${size==='sm'?'w-2.5 h-2.5':'w-3 h-3'}`}></div>}
    </div>
  );
};

// Main App
function App() {
  const [user, setUser] = useState(() => localStorage.getItem('chat_user') || null);
  
  const [messages, setMessages] = useState([]);
  const [partnerStatus, setPartnerStatus] = useState({ online: false, lastActive: 0, typing: false });
  
  const [input, setInput] = useState("");
  const [pendingImages, setPendingImages] = useState([]); // NEW: Image preview state
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingMsg, setEditingMsg] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  
  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [viewingImage, setViewingImage] = useState(null);
  
  const [showEmojis, setShowEmojis] = useState(false);
  const [showGifs, setShowGifs] = useState(false);
  const [tenorGifs, setTenorGifs] = useState([]);
  const [gifSearch, setGifSearch] = useState("");
  const [isSearchingGifs, setIsSearchingGifs] = useState(false);
  
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);

  // Settings
  const [isDark, setIsDark] = useState(() => { const s = localStorage.getItem('chat_theme'); return s ? s === 'dark' : true; });
  const [chatColor, setChatColor] = useState(() => localStorage.getItem('chat_color') || 'blue');
  const [wallpaper, setWallpaper] = useState(() => localStorage.getItem('chat_wallpaper') || '');
  const [nickname, setNickname] = useState(() => localStorage.getItem('chat_nickname') || '');

  const chatRef = useRef(null);
  const inputRef = useRef(null);
  const fileRef = useRef(null);
  const camRef = useRef(null);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const timerRef = useRef(null);
  const typingTimer = useRef(null);

  const defaultPartner = user === 'Daksh' ? 'Brahmgeet' : 'Daksh';
  const partnerName = nickname.trim() !== '' ? nickname : defaultPartner;
  const avatarColor = partnerName === 'Brahmgeet' || partnerName.toLowerCase().includes('brahm') ? 'bg-pink-500' : 'bg-blue-500';

  useEffect(() => {
    if (window.Firebase && window.Firebase.auth) {
        window.Firebase.signInAnonymously(window.Firebase.auth).catch(console.error);
    }
  }, []);

  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('chat_theme', isDark ? 'dark' : 'light');
  }, [isDark]);
  useEffect(() => localStorage.setItem('chat_color', chatColor), [chatColor]);
  useEffect(() => localStorage.setItem('chat_wallpaper', wallpaper), [wallpaper]);
  useEffect(() => localStorage.setItem('chat_nickname', nickname), [nickname]);

  useEffect(() => {
    if (!user || !window.Firebase || !window.Firebase.auth.currentUser) return;
    const { db, collection, doc, onSnapshot, setDoc, updateDoc, query, orderBy } = window.Firebase;
    
    const q = query(collection(db, 'artifacts', APP_ID, 'public', 'data', 'messages'), orderBy('timestamp', 'asc'));
    const unsubMsgs = onSnapshot(q, snap => {
      const msgs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      msgs.forEach(m => {
        if (m.sender !== user && m.status !== 'read') {
          updateDoc(doc(db, 'artifacts', APP_ID, 'public', 'data', 'messages', m.id), { status: 'read' }).catch(()=>{});
        }
      });
      setMessages(msgs);
      setTimeout(() => chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight }), 50);
    });

    const myRef = doc(db, 'artifacts', APP_ID, 'public', 'data', 'presence', user);
    const pRef = doc(db, 'artifacts', APP_ID, 'public', 'data', 'presence', defaultPartner);

    const updateOnline = () => setDoc(myRef, { online: true, lastActive: Date.now() }, { merge: true }).catch(()=>{});
    updateOnline();
    const heartbeat = setInterval(updateOnline, 30000);
    
    const handleVis = () => {
      if (document.visibilityState === 'hidden') setDoc(myRef, { online: false, lastActive: Date.now() }, { merge: true });
      else updateOnline();
    };
    document.addEventListener('visibilitychange', handleVis);

    const unsubPresence = onSnapshot(pRef, d => { if (d.exists()) setPartnerStatus(d.data()); });

    return () => { unsubMsgs(); unsubPresence(); clearInterval(heartbeat); document.removeEventListener('visibilitychange', handleVis); };
  }, [user]);

  useEffect(() => {
    if (!showGifs) return;
    const fetchGifs = async () => {
      setIsSearchingGifs(true);
      try {
        const q = gifSearch.trim() || 'trending';
        const res = await fetch(`https://g.tenor.com/v1/${q === 'trending' ? 'trending' : 'search?q='+q}&key=LIVDSRZULELA&limit=30`);
        const data = await res.json();
        if (data.results) setTenorGifs(data.results.map(g => g.media[0].gif.url));
      } catch (e) {} finally { setIsSearchingGifs(false); }
    };
    const t = setTimeout(fetchGifs, 400);
    return () => clearTimeout(t);
  }, [gifSearch, showGifs]);

  const handleType = (e) => {
    setInput(e.target.value);
    if (inputRef.current) {
      inputRef.current.style.height = '40px';
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 120) + 'px';
    }
    if (user && window.Firebase) {
      const ref = window.Firebase.doc(window.Firebase.db, 'artifacts', APP_ID, 'public', 'data', 'presence', user);
      window.Firebase.setDoc(ref, { typing: true, lastActive: Date.now() }, { merge: true });
      clearTimeout(typingTimer.current);
      typingTimer.current = setTimeout(() => window.Firebase.setDoc(ref, { typing: false }, { merge: true }), 2000);
    }
  };

  const startVoice = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];
      mediaRecorder.current.ondataavailable = e => { if (e.data.size > 0) audioChunks.current.push(e.data); };
      mediaRecorder.current.onstop = async () => {
        const blob = new Blob(audioChunks.current, { type: 'audio/webm' });
        stream.getTracks().forEach(t => t.stop());
        const b64 = await blobToBase64(blob);
        sendPayload({ audio: b64 });
      };
      mediaRecorder.current.start();
      setIsRecording(true);
      setRecordTime(0);
      timerRef.current = setInterval(() => {
        setRecordTime(p => { if (p >= 59) { stopVoice(); return 60; } return p + 1; });
      }, 1000);
    } catch (e) { alert("Mic access denied"); }
  };
  const stopVoice = () => { if (mediaRecorder.current && isRecording) { mediaRecorder.current.stop(); setIsRecording(false); clearInterval(timerRef.current); } };
  const cancelVoice = () => { if (mediaRecorder.current && isRecording) { mediaRecorder.current.onstop = () => { mediaRecorder.current.stream.getTracks().forEach(t => t.stop()); }; mediaRecorder.current.stop(); setIsRecording(false); clearInterval(timerRef.current); } };

  // NEW: Handle multiple file selections and put them in preview state
  const handleFile = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    
    const compressedImages = await Promise.all(files.map(file => {
      return new Promise((resolve) => {
        const r = new FileReader();
        r.onloadend = async () => {
          const comp = await compressImage(r.result);
          resolve(comp);
        };
        r.readAsDataURL(file);
      });
    }));

    setPendingImages(prev => [...prev, ...compressedImages]);
    e.target.value = ''; // Reset input
  };

  const removePendingImage = (indexToRemove) => {
    setPendingImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const sendPayload = async ({ text = null, audio = null }) => {
    const finalText = text !== null ? text : input.trim();
    if (!finalText && pendingImages.length === 0 && !audio) return;

    setInput(""); setShowEmojis(false); setShowGifs(false); setActiveMenu(null);
    if (inputRef.current) inputRef.current.style.height = '40px';

    if (editingMsg && pendingImages.length === 0 && !audio) {
      await window.Firebase.updateDoc(window.Firebase.doc(window.Firebase.db, 'artifacts', APP_ID, 'public', 'data', 'messages', editingMsg.id), { text: finalText, isEdited: true });
      setEditingMsg(null);
      return;
    }

    const payload = {
      id: Date.now().toString(),
      sender: user,
      timestamp: new Date().toISOString(),
      status: 'sent',
      reactions: []
    };

    if (finalText) payload.text = finalText;
    if (audio) payload.audio = audio;
    
    // Attach array of images if multiple exist
    if (pendingImages.length > 0) {
      payload.images = pendingImages;
    }
    
    if (replyingTo) { payload.replyTo = { sender: replyingTo.sender, text: replyingTo.text || 'Attachment' }; setReplyingTo(null); }

    await window.Firebase.setDoc(window.Firebase.doc(window.Firebase.db, 'artifacts', APP_ID, 'public', 'data', 'messages', payload.id), payload);
    setPendingImages([]); // Clear previews after sending
    setTimeout(() => chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' }), 50);

    // Webhook logic
    const hook = WEBHOOKS[user];
    if (hook && !audio) {
      let content = finalText || (pendingImages.length > 0 ? `[Sent ${pendingImages.length} Image(s)]` : "");
      if (payload.replyTo) content = `> **Replying to ${payload.replyTo.sender}:** *${payload.replyTo.text}*\n\n${content}`;
      const body = { username: user, content };
      // Discord only takes URL strings for embeds, so we skip base64 embeds to avoid crashing discord
      fetch(hook, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).catch(()=>{});
    }
  };

  const handleReaction = async (id, emoji, curr = []) => {
    if (!curr.includes(emoji)) {
      curr.push(emoji);
      await window.Firebase.updateDoc(window.Firebase.doc(window.Firebase.db, 'artifacts', APP_ID, 'public', 'data', 'messages', id), { reactions: curr });
    }
    setActiveMenu(null);
  };

  const clearHistory = async () => {
    if (confirm("Delete chat history globally?")) {
      messages.forEach(m => window.Firebase.deleteDoc(window.Firebase.doc(window.Firebase.db, 'artifacts', APP_ID, 'public', 'data', 'messages', m.id)).catch(()=>{}));
      setShowSettings(false);
    }
  };

  if (!user) {
    return (
      <div className="h-[100dvh] w-full flex flex-col justify-center items-center p-6 bg-gray-50 dark:bg-[#0f1115] transition-colors relative overflow-hidden">
        <div className="w-full max-w-sm p-8 bg-white dark:bg-[#1a1d24] rounded-[2rem] shadow-xl border border-gray-100 dark:border-gray-800 text-center relative z-10 animate-fade-in">
          <div className="w-20 h-20 mx-auto bg-gradient-to-tr from-blue-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-lg mb-6 transform -rotate-6"><i className="fa-solid fa-bolt text-white text-3xl"></i></div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">Direct Messages</h1>
          <p className="text-sm text-gray-500 mb-8 font-medium">Select your identity to sync.</p>
          <button onClick={() => { setUser('Daksh'); localStorage.setItem('chat_user', 'Daksh'); }} className="w-full py-4 mb-4 bg-blue-500 text-white rounded-2xl font-bold shadow-md hover:bg-blue-600 transition-colors text-lg">I am Daksh</button>
          <button onClick={() => { setUser('Brahmgeet'); localStorage.setItem('chat_user', 'Brahmgeet'); }} className="w-full py-4 bg-pink-500 text-white rounded-2xl font-bold shadow-md hover:bg-pink-600 transition-colors text-lg">I am Brahmgeet</button>
        </div>
      </div>
    );
  }

  let statusText = "Connecting...";
  if (partnerStatus.online && Date.now() - partnerStatus.lastActive < 60000) {
    statusText = partnerStatus.typing ? "Typing..." : "Online";
  } else if (partnerStatus.lastActive) {
    statusText = `Last seen ${formatTime(new Date(partnerStatus.lastActive).toISOString())}`;
  }

  const grouped = [];
  let lastD = null;
  messages.forEach(m => {
    const dStr = new Date(m.timestamp).toDateString();
    if (dStr !== lastD) { grouped.push({ type: 'date', id: `d-${m.id}`, val: m.timestamp }); lastD = dStr; }
    grouped.push({ type: 'msg', ...m });
  });

  return (
    <div className="flex flex-col h-[100dvh] w-full sm:max-w-2xl lg:max-w-4xl mx-auto bg-white dark:bg-[#0f1115] sm:border-x border-gray-200 dark:border-gray-800 relative shadow-2xl overflow-hidden" onClick={() => { setActiveMenu(null); setShowEmojis(false); setShowGifs(false); }}>
      
      {viewingImage && (
        <div className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4 animate-fade-in" onClick={() => setViewingImage(null)}>
          <button className="absolute top-6 right-6 w-10 h-10 bg-white/20 rounded-full text-white"><i className="fa-solid fa-xmark"></i></button>
          <img src={viewingImage} className="max-w-full max-h-[85vh] rounded-lg object-contain" onClick={e=>e.stopPropagation()} />
        </div>
      )}

      {/* Inputs changed to accept multiple files */}
      <input type="file" ref={fileRef} onChange={handleFile} accept="image/*" multiple className="hidden" />
      <input type="file" ref={camRef} onChange={handleFile} accept="image/*" capture="environment" className="hidden" />

      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute inset-0 z-50 bg-white dark:bg-[#1a1d24] flex flex-col animate-slide-in-right" onClick={e=>e.stopPropagation()}>
          <div className="flex items-center px-4 py-4 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1a1d24]">
            <button onClick={() => setShowSettings(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 mr-4"><i className="fa-solid fa-arrow-left"></i></button>
            <h2 className="font-bold text-lg text-gray-900 dark:text-white">Settings</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50 dark:bg-[#0f1115]">
            <div className="bg-white dark:bg-[#1a1d24] rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsDark(!isDark)}>
                <div className="flex items-center gap-3 text-gray-900 dark:text-white font-semibold">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-amber-500/20 text-amber-500'}`}><i className={`fa-solid ${isDark ? 'fa-moon' : 'fa-sun'}`}></i></div> Dark Mode
                </div>
                <div className={`w-12 h-6 rounded-full p-1 transition-colors relative ${isDark ? 'bg-blue-500' : 'bg-gray-300'}`}><div className={`w-4 h-4 bg-white rounded-full transition-transform ${isDark ? 'translate-x-6' : 'translate-x-0'}`} /></div>
              </div>
            </div>
            <div className="bg-white dark:bg-[#1a1d24] rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Nickname</label>
                <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder={defaultPartner} className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#0f1115] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white outline-none focus:border-blue-500 font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Accent Color</label>
                <div className="flex gap-3">
                  {THEMES.colors.map(c => (
                    <button key={c.value} onClick={() => setChatColor(c.value)} className={`w-10 h-10 rounded-full shadow-sm ${c.class} ${chatColor === c.value ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-offset-[#1a1d24]' : ''}`} title={c.name}></button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Wallpaper</label>
                <div className="grid grid-cols-2 gap-2">
                  {THEMES.wallpapers.map(w => (
                    <button 
