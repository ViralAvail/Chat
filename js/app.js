const { useState, useEffect, useRef, useMemo } = React;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: '' };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, errorInfo: error.toString() };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '24px', color: 'white', backgroundColor: '#e3342f', height: '100vh', width: '100vw', wordBreak: 'break-all', zIndex: 9999 }}>
          <h1 style={{fontSize: '24px', fontWidth:'bold', marginBottom:'12px'}}>Application Error</h1>
          <p style={{marginBottom:'16px'}}>An unexpected error occurred. Please review details below:</p>
          <code style={{fontSize: '13px', background: 'rgba(0,0,0,0.3)', padding: '12px', display:'block', borderRadius:'8px'}}>{this.state.errorInfo}</code>
          <button onClick={() => window.location.reload()} style={{marginTop:'20px', padding:'10px 20px', background:'white', color:'#e3342f', border:'none', borderRadius:'8px', fontWeight:'bold', cursor:'pointer'}}>Reload App</button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Brand Logo SVG Icon Component
const BrandLogoIcon = ({ size = "lg" }) => {
  const sizeMap = { sm: "w-8 h-8", md: "w-12 h-12", lg: "w-24 h-24", xl: "w-28 h-28" };
  return (
    <div className={`mx-auto ${sizeMap[size]} bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-xl shadow-blue-500/30 relative overflow-hidden group`}>
      <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <svg className="w-1/2 h-1/2 text-white drop-shadow-md" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.477 2 2 6.477 2 12C2 13.84 2.5 15.56 3.37 17.04L2.05 21.46C1.94 21.83 2.27 22.16 2.64 22.05L7.06 20.73C8.54 21.6 10.26 22.1 12.1 22.1C17.623 22.1 22.1 17.623 22.1 12.1C22.1 6.577 17.623 2 12 2Z" fill="currentColor" fillOpacity="0.3"/>
        <path d="M7.5 11C6.67 11 6 11.67 6 12.5V13.5C6 14.33 6.67 15 7.5 15C8.33 15 9 14.33 9 13.5V12.5C9 11.67 8.33 11 7.5 11ZM16.5 11C15.67 11 15 11.67 15 12.5V13.5C15 14.33 15.67 15 16.5 15C17.33 15 18 14.33 18 13.5V12.5C18 11.67 17.33 11 16.5 11ZM12 7.5C11.17 7.5 10.5 8.17 10.5 9V10C10.5 10.83 11.17 11.5 12 11.5C12.83 11.5 13.5 10.83 13.5 10V9C13.5 8.17 12.83 7.5 12 7.5Z" fill="white"/>
      </svg>
    </div>
  );
};

const EMOJIS = {
  common: ["😂", "❤️", "😍", "😭", "😊", "🥺", "💀", "🔥", "🥰", "✨", "👍", "🙏", "👀", "💯", "💕", "🤭", "🤣", "😘", "😜", "😎", "🤩", "🥳", "😏", "🙄", "😴", "🤯", "🎉", "🏆", "🎮", "🎲"],
  quick: ["❤️", "😂", "😮", "😢", "🙏", "👍", "🔥", "🎉"]
};

const THEMES = {
  colors: [
    { name: 'Blue', class: 'bg-blue-500', value: 'blue', text: 'text-blue-500', border: 'border-blue-500', glow: 'theme-glow-blue' }, 
    { name: 'Purple', class: 'bg-purple-500', value: 'purple', text: 'text-purple-500', border: 'border-purple-500', glow: 'theme-glow-purple' },
    { name: 'Pink', class: 'bg-pink-500', value: 'pink', text: 'text-pink-500', border: 'border-pink-500', glow: 'theme-glow-pink' }, 
    { name: 'Rose', class: 'bg-rose-500', value: 'rose', text: 'text-rose-500', border: 'border-rose-500', glow: 'theme-glow-rose' },
    { name: 'Emerald', class: 'bg-emerald-500', value: 'emerald', text: 'text-emerald-500', border: 'border-emerald-500', glow: 'theme-glow-emerald' }, 
    { name: 'Amber', class: 'bg-amber-500', value: 'amber', text: 'text-amber-500', border: 'border-amber-500', glow: 'theme-glow-amber' },
    { name: 'Dark', class: 'bg-gray-800', value: 'gray', text: 'text-gray-400', border: 'border-gray-600', glow: '' }
  ]
};

const DRAW_COLORS = ['#ffffff', '#000000', '#ff3b30', '#ff9500', '#34c759', '#007aff', '#af52de', '#ff2d55'];
const URL_REGEX = /(https?:\/\/[^\s]+)/g;

const formatTime = (iso) => { try { return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); } catch(e) { return ""; } };
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
    if (width > height && width > 1200) { height *= 1200 / width; width = 1200; } 
    else if (height > 1200) { width *= 1200 / height; height = 1200; }
    cvs.width = width; cvs.height = height;
    cvs.getContext('2d').drawImage(img, 0, 0, width, height);
    resolve(cvs.toDataURL('image/jpeg', 0.6));
  };
  img.src = dataUrl;
});

const compressDp = (dataUrl) => new Promise(resolve => {
  const img = new Image();
  img.onload = () => {
    const cvs = document.createElement('canvas');
    const size = 220; 
    cvs.width = size; cvs.height = size;
    const ctx = cvs.getContext('2d');
    const min = Math.min(img.width, img.height);
    const sx = (img.width - min) / 2;
    const sy = (img.height - min) / 2;
    ctx.drawImage(img, sx, sy, min, min, 0, 0, size, size);
    resolve(cvs.toDataURL('image/jpeg', 0.55));
  };
  img.src = dataUrl;
});

const blobToBase64 = blob => new Promise(res => { const r = new FileReader(); r.onloadend = () => res(r.result); r.readAsDataURL(blob); });

const formatTextWithLinks = (text) => {
  if (!text) return null;
  return text.split(URL_REGEX).map((part, i) => part.match(URL_REGEX) ? <a key={i} href={part} target="_blank" className="underline underline-offset-2 break-all decoration-white/40 hover:decoration-white transition-all font-medium" onClick={e => e.stopPropagation()}>{part}</a> : <span key={i}>{part}</span>);
};

const Avatar = ({ name, imgUrl, isOnline, size = "md", colorClass, onClick }) => {
  const sizes = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-24 h-24 text-4xl" };
  return (
    <div onClick={onClick} className={`rounded-full flex items-center justify-center text-white font-bold shadow-md relative shrink-0 ${colorClass} ${sizes[size]} ${onClick ? 'cursor-pointer hover:scale-105 transition-transform' : ''} bg-cover bg-center`} style={imgUrl ? { backgroundImage: `url(${imgUrl})` } : {}}>
      {!imgUrl && (name ? name.charAt(0).toUpperCase() : "?")}
      {isOnline && size !== "lg" && <div className={`absolute bottom-0 right-0 rounded-full bg-emerald-500 border-2 border-white dark:border-[#090a0f] ${size==='sm'?'w-2.5 h-2.5':'w-3 h-3'}`}></div>}
    </div>
  );
};

function App() {
  const [user, setUser] = useState(() => window.safeStorage.get('chat_user') || null);
  const [backendUser, setBackendUser] = useState(null); 
  const [messages, setMessages] = useState([]);
  const [events, setEvents] = useState([]);
  
  const [myDp, setMyDp] = useState(null);
  const [partnerDp, setPartnerDp] = useState(null);
  const [partnerStatus, setPartnerStatus] = useState({ online: false, lastActive: 0, typing: false });
  
  const [input, setInput] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingMsg, setEditingMsg] = useState(null);
  const [pinnedMsg, setPinnedMsg] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const [activeMenu, setActiveMenu] = useState(null);
  const [pendingImages, setPendingImages] = useState([]);
  const [pendingDoc, setPendingDoc] = useState(null);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  
  const [activeModal, setActiveModal] = useState(null); 
  const [viewingImage, setViewingImage] = useState(null);
  const [activeGame, setActiveGame] = useState('ttt'); 
  
  const [profileTab, setProfileTab] = useState('media');
  const [toast, setToast] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(() => window.safeStorage.get('chat_sound') !== 'false');

  const [showEmojis, setShowEmojis] = useState(false);
  const [showGifs, setShowGifs] = useState(false);
  const [tenorGifs, setTenorGifs] = useState([]);
  const [gifSearch, setGifSearch] = useState("");
  const [isSearchingGifs, setIsSearchingGifs] = useState(false);
  
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);

  const [drawColor, setDrawColor] = useState('#ffffff');
  const [drawSize, setDrawSize] = useState(6);
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);

  // Games State
  const [tttBoard, setTttBoard] = useState(Array(9).fill(null));
  const [tttTurn, setTttTurn] = useState('X');
  const [tttWinner, setTttWinner] = useState(null);

  const [memCards, setMemCards] = useState([]);
  const [memFlipped, setMemFlipped] = useState([]);
  const [memMatched, setMemMatched] = useState([]);
  const [memScore, setMemScore] = useState(0);

  const [tdIndex, setTdIndex] = useState(0);

  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDate, setNewEventDate] = useState("");

  const [isDark, setIsDark] = useState(() => { const s = window.safeStorage.get('chat_theme'); return s ? s === 'dark' : true; });
  const [chatColor, setChatColor] = useState(() => window.safeStorage.get('chat_color') || 'blue');
  
  const chatRef = useRef(null);
  const inputRef = useRef(null);
  const fileRef = useRef(null);
  const docRef = useRef(null);
  const camRef = useRef(null);
  const dpRef = useRef(null);
  
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const timerRef = useRef(null);
  const typingTimer = useRef(null);
  const toastTimer = useRef(null);

  const defaultPartner = user === 'Daksh' ? 'Brahmgeet' : 'Daksh';
  const partnerName = defaultPartner;
  const avatarColor = partnerName.toLowerCase().includes('brahm') ? 'bg-gradient-to-br from-pink-400 to-rose-500' : 'bg-gradient-to-br from-blue-400 to-indigo-500';
  const myAvatarColor = user === 'Brahmgeet' ? 'bg-gradient-to-br from-pink-400 to-rose-500' : 'bg-gradient-to-br from-blue-400 to-indigo-500';

  const themeObj = useMemo(() => THEMES.colors.find(c => c.value === chatColor) || THEMES.colors[0], [chatColor]);

  const initMemoryGame = () => {
    const emojis = ["🚀", "💖", "🍕", "🎮", "🦄", "⚡", "🌟", "🎈"];
    const deck = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
    setMemCards(deck);
    setMemFlipped([]);
    setMemMatched([]);
    setMemScore(0);
  };

  useEffect(() => { initMemoryGame(); }, []);

  useEffect(() => {
    if (!window.Firebase) return;
    window.Firebase.signInAnonymously().catch(console.error);
    const unsub = window.Firebase.onAuthStateChanged(setBackendUser);
    return () => unsub();
  }, []);

  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    window.safeStorage.set('chat_theme', isDark ? 'dark' : 'light');
    window.safeStorage.set('chat_color', chatColor);
    window.safeStorage.set('chat_sound', soundEnabled ? 'true' : 'false');
  }, [isDark, chatColor, soundEnabled]);

  useEffect(() => {
    if (!user || !backendUser) return;
    const { db, collection, doc, onSnapshot, updateDoc } = window.Firebase;
    
    const msgsRef = collection(db, 'artifacts', window.APP_ID, 'public', 'data', 'messages');
    const unsubMsgs = onSnapshot(msgsRef, snap => {
      const rawMsgs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      
      let playSound = false;
      rawMsgs.forEach(m => { 
        if (m.sender !== user && m.status !== 'read') {
          playSound = true;
          updateDoc(doc(db, 'artifacts', window.APP_ID, 'public', 'data', 'messages', m.id), { status: 'read' }).catch(()=>{}); 
        }
      });

      if (playSound) window.soundEngine.play('receive');

      rawMsgs.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      setMessages(rawMsgs);
      
      const pinned = rawMsgs.slice().reverse().find(m => m.isPinned);
      setPinnedMsg(pinned || null);

      setTimeout(() => { if (chatRef.current) chatRef.current.scrollTo({ top: chatRef.current.scrollHeight }); }, 50);
    });

    const eventsRef = collection(db, 'artifacts', window.APP_ID, 'public', 'data', 'events');
    const unsubEvents = onSnapshot(eventsRef, snap => {
      const evts = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      evts.sort((a, b) => new Date(a.date) - new Date(b.date));
      setEvents(evts);
    });

    const myRef = doc(db, 'artifacts', window.APP_ID, 'public', 'data', 'presence', user);
    const pRef = doc(db, 'artifacts', window.APP_ID, 'public', 'data', 'presence', defaultPartner);

    const unsubPresence = onSnapshot(pRef, d => { 
      if (d.exists()) {
        setPartnerStatus(d.data()); 
        if(d.data().dp) setPartnerDp(d.data().dp);
      } 
    });

    const unsubMyPresence = onSnapshot(myRef, d => {
      if (d.exists() && d.data().dp) setMyDp(d.data().dp);
    });

    const updateOnline = () => window.Firebase.setDoc(myRef, { online: true, lastActive: Date.now() }, { merge: true }).catch(()=>{});
    updateOnline();
    const heartbeat = setInterval(updateOnline, 25000);
    
    const handleVis = () => document.visibilityState === 'hidden' ? window.Firebase.setDoc(myRef, { online: false, lastActive: Date.now() }, { merge: true }) : updateOnline();
    document.addEventListener('visibilitychange', handleVis);

    return () => { unsubMsgs(); unsubEvents(); unsubPresence(); unsubMyPresence(); clearInterval(heartbeat); document.removeEventListener('visibilitychange', handleVis); };
  }, [user, backendUser]);

  useEffect(() => {
    if (!showGifs) return;
    const fetchGifs = async () => {
      setIsSearchingGifs(true);
      try {
        const q = gifSearch.trim() || 'trending';
        const res = await fetch(`https://g.tenor.com/v1/${q === 'trending' ? 'trending' : 'search?q='+q}&key=LIVDSRZULELA&limit=30`);
        const data = await res.json();
        if (data && data.results) {
          const urls = data.results.map(g => g?.media?.[0]?.gif?.url).filter(Boolean);
          setTenorGifs(urls);
        }
      } catch (e) {
        console.error("GIF Error", e);
      } finally {
        setIsSearchingGifs(false);
      }
    };
    const t = setTimeout(fetchGifs, 350);
    return () => clearTimeout(t);
  }, [gifSearch, showGifs]);

  useEffect(() => {
    if(activeModal === 'draw' && canvasRef.current) {
      const cvs = canvasRef.current;
      cvs.width = cvs.offsetWidth;
      cvs.height = cvs.offsetHeight;
      const ctx = cvs.getContext('2d');
      ctx.fillStyle = '#12131a';
      ctx.fillRect(0,0, cvs.width, cvs.height);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
  }, [activeModal]);

  const mediaItems = useMemo(() => {
    const items = [];
    messages.forEach(m => {
      if (m.images) m.images.forEach(img => items.push({ url: img, id: m.id }));
      else if (m.image) items.push({ url: m.image, id: m.id });
    });
    return items.reverse();
  }, [messages]);

  const linkItems = useMemo(() => {
    const items = [];
    messages.forEach(m => {
      if (m.text) {
        const matches = m.text.match(URL_REGEX);
        if (matches) matches.forEach(url => items.push({ url, id: m.id, time: m.timestamp, sender: m.sender }));
      }
    });
    return items.reverse();
  }, [messages]);

  const docItems = useMemo(() => {
    const items = [];
    messages.forEach(m => {
      if (m.doc) items.push({ doc: m.doc, id: m.id, time: m.timestamp, sender: m.sender });
    });
    return items.reverse();
  }, [messages]);

  const filteredMessages = useMemo(() => {
    if (!searchQuery.trim()) return messages;
    return messages.filter(m => m.text && m.text.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [messages, searchQuery]);

  const openModal = (type, data = null) => { 
    window.soundEngine.play('tap');
    if (type === 'image') setViewingImage(data); 
    setActiveModal(type); 
    setActiveMenu(null); 
    setShowAttachmentMenu(false); 
  };

  const closeCurrentModal = () => { 
    window.soundEngine.play('tap');
    setActiveModal(null); 
    setViewingImage(null); 
  };
  
  const showToast = (msg, icon) => {
    setToast({ msg, icon });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  };

  const handleType = (e) => {
    setInput(e.target.value);
    if (inputRef.current) { inputRef.current.style.height = '40px'; inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 120) + 'px'; }
    if (user && backendUser) {
      const ref = window.Firebase.doc(window.Firebase.db, 'artifacts', window.APP_ID, 'public', 'data', 'presence', user);
      window.Firebase.setDoc(ref, { typing: true, lastActive: Date.now() }, { merge: true });
      clearTimeout(typingTimer.current);
      typingTimer.current = setTimeout(() => window.Firebase.setDoc(ref, { typing: false }, { merge: true }), 2000);
    }
  };

  const startDraw = (e) => {
    if (!canvasRef.current) return;
    isDrawingRef.current = true;
    const ctx = canvasRef.current.getContext('2d');
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0] && e.touches[0].clientY)) - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };
  
  const draw = (e) => {
    if(!isDrawingRef.current || !canvasRef.current) return;
    e.preventDefault(); 
    const ctx = canvasRef.current.getContext('2d');
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0] && e.touches[0].clientY)) - rect.top;
    ctx.strokeStyle = drawColor;
    ctx.lineWidth = drawSize;
    ctx.lineTo(x, y);
    ctx.stroke();
  };
  
  const stopDraw = () => { isDrawingRef.current = false; };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setShowAttachmentMenu(false);
    const compressedImgs = await Promise.all(files.map(async file => {
       const dataUrl = await new Promise(resolve => { const r = new FileReader(); r.onloadend = () => resolve(r.result); r.readAsDataURL(file); });
       return await compressImage(dataUrl);
    }));
    setPendingImages(prev => [...prev, ...compressedImgs]);
  };

  const handleDpUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const dataUrl = await new Promise(resolve => { const r = new FileReader(); r.onloadend = () => resolve(r.result); r.readAsDataURL(file); });
    const compressedDp = await compressDp(dataUrl);
    
    await window.Firebase.updateDoc(window.Firebase.doc(window.Firebase.db, 'artifacts', window.APP_ID, 'public', 'data', 'presence', user), { dp: compressedDp });
    setMyDp(compressedDp);
    showToast("Profile Picture Updated!", "fa-circle-check text-emerald-500");
  };

  const handleDocUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setShowAttachmentMenu(false);
    if (file.size > 500 * 1024) {
      showToast(`File is ${Math.round(file.size/1024)}KB. Max limit is 500KB.`, "fa-circle-xmark text-rose-500");
      e.target.value = null;
      return;
    }
    const dataUrl = await blobToBase64(file);
    setPendingDoc({ name: file.name, size: file.size, data: dataUrl });
  };

  const saveCalendarEvent = async () => {
    if(!newEventTitle || !newEventDate) return;
    await window.Firebase.setDoc(window.Firebase.doc(window.Firebase.db, 'artifacts', window.APP_ID, 'public', 'data', 'events', Date.now().toString()), {
      title: newEventTitle,
      date: newEventDate,
      creator: user,
      timestamp: new Date().toISOString()
    });
    setNewEventTitle(""); setNewEventDate("");
    showToast("Event Added to Calendar", "fa-calendar-check text-emerald-500");
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
        sendPayload({ audio: await blobToBase64(blob) });
      };
      mediaRecorder.current.start();
      setIsRecording(true); setRecordTime(0);
      timerRef.current = setInterval(() => setRecordTime(p => p >= 59 ? (stopVoice(), 60) : p + 1), 1000);
    } catch (e) { showToast("Microphone access denied", "fa-microphone-slash text-rose-500"); }
  };
  
  const stopVoice = () => { if (mediaRecorder.current && isRecording) { mediaRecorder.current.stop(); setIsRecording(false); clearInterval(timerRef.current); } };
  const cancelVoice = () => { if (mediaRecorder.current && isRecording) { mediaRecorder.current.onstop = () => mediaRecorder.current.stream.getTracks().forEach(t => t.stop()); mediaRecorder.current.stop(); setIsRecording(false); clearInterval(timerRef.current); } };

  const sendPayload = async ({ text = null, image = null, audio = null, gameCard = null }) => {
    const finalText = text !== null ? text : input.trim();
    const imgsToSave = image ? [image] : [...pendingImages];
    const docToSave = pendingDoc;
    
    if (!finalText && imgsToSave.length === 0 && !audio && !docToSave && !gameCard) return;

    setInput(""); setShowEmojis(false); setShowGifs(false); setActiveMenu(null); setShowAttachmentMenu(false);
    setPendingImages([]); setPendingDoc(null);
    if (inputRef.current) inputRef.current.style.height = '40px';

    if (editingMsg && imgsToSave.length === 0 && !audio && !docToSave) {
      await window.Firebase.updateDoc(window.Firebase.doc(window.Firebase.db, 'artifacts', window.APP_ID, 'public', 'data', 'messages', editingMsg.id), { text: finalText, isEdited: true });
      setEditingMsg(null); return;
    }

    const payload = { id: Date.now().toString(), sender: user, timestamp: new Date().toISOString(), status: 'sent', reactions: [] };
    if (finalText) payload.text = finalText;
    if (audio) payload.audio = audio;
    if (docToSave) payload.doc = docToSave;
    if (gameCard) payload.gameCard = gameCard;
    if (imgsToSave.length === 1) payload.image = imgsToSave[0];
    else if (imgsToSave.length > 1) payload.images = imgsToSave;
    if (replyingTo) { payload.replyTo = { sender: replyingTo.sender, text: replyingTo.text || 'Attachment' }; setReplyingTo(null); }

    window.soundEngine.play('send');
    await window.Firebase.setDoc(window.Firebase.doc(window.Firebase.db, 'artifacts', window.APP_ID, 'public', 'data', 'messages', payload.id), payload);
    setTimeout(() => { if (chatRef.current) chatRef.current.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' }) }, 50);
  };

  const handlePinMessage = async (msg) => {
    const newPinState = !msg.isPinned;
    await window.Firebase.updateDoc(window.Firebase.doc(window.Firebase.db, 'artifacts', window.APP_ID, 'public', 'data', 'messages', msg.id), { isPinned: newPinState });
    showToast(newPinState ? "Message Pinned to Top" : "Message Unpinned", "fa-thumbtack text-amber-500");
    setActiveMenu(null);
  };

  const handleReaction = async (id, emoji, curr = []) => {
    window.soundEngine.play('tap');
    if (!curr.includes(emoji)) { curr.push(emoji); await window.Firebase.updateDoc(window.Firebase.doc(window.Firebase.db, 'artifacts', window.APP_ID, 'public', 'data', 'messages', id), { reactions: curr }); }
    setActiveMenu(null);
  };

  const playTttMove = (index) => {
    if (tttBoard[index] || tttWinner) return;
    window.soundEngine.play('tap');
    const next = [...tttBoard];
    next[index] = tttTurn;
    setTttBoard(next);

    const w = window.checkTttWinner(next);
    if (w) {
      setTttWinner(w);
      if (w !== 'Tie') window.soundEngine.play('win');
    } else {
      setTttTurn(tttTurn === 'X' ? 'O' : 'X');
    }
  };

  const resetTtt = () => {
    setTttBoard(Array(9).fill(null));
    setTttTurn('X');
    setTttWinner(null);
  };

  const sendGameChallenge = (title, details) => {
    sendPayload({ gameCard: { title, details, winner: tttWinner || null } });
    closeCurrentModal();
    showToast("Game Challenge Sent to Chat!", "fa-gamepad text-purple-500");
  };

  const flipMemCard = (idx) => {
    if (memFlipped.length === 2 || memFlipped.includes(idx) || memMatched.includes(idx)) return;
    window.soundEngine.play('tap');
    const newFlipped = [...memFlipped, idx];
    setMemFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (memCards[first] === memCards[second]) {
        setMemMatched(prev => [...prev, first, second]);
        setMemScore(s => s + 100);
        setMemFlipped([]);
        if (memMatched.length + 2 === memCards.length) window.soundEngine.play('win');
      } else {
        setTimeout(() => setMemFlipped([]), 800);
      }
    }
  };

  const formatBytes = (bytes) => {
    if(bytes < 1024) return bytes + " B";
    else if(bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  if (!user) {
    return (
      <div className="h-[100dvh] w-full flex flex-col justify-center items-center p-6 transition-colors relative overflow-hidden bg-ios-light dark:bg-ios-dark">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        
        <div className="w-full max-w-sm p-8 bg-white/80 dark:bg-[#141620]/80 backdrop-blur-2xl rounded-[36px] shadow-2xl border border-gray-200/50 dark:border-white/10 text-center relative z-10 animate-slide-up">
          
          <BrandLogoIcon size="lg" />

          <h1 className="text-3xl font-extrabold font-display text-gray-900 dark:text-white mt-5 mb-2 tracking-tight">V3 Premium</h1>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-8 uppercase tracking-widest">Select Synced Profile</p>
          
          <div className="space-y-3.5">
            <button onClick={() => { window.soundEngine.play('tap'); setUser('Daksh'); window.safeStorage.set('chat_user', 'Daksh'); }} className="w-full flex items-center p-4 bg-gray-50 dark:bg-white/5 hover:bg-blue-500/10 dark:hover:bg-blue-500/20 border border-gray-200/60 dark:border-white/5 rounded-2xl transition-all group">
              <Avatar name="Daksh" size="md" colorClass="bg-gradient-to-br from-blue-500 to-indigo-600" />
              <div className="ml-4 text-left">
                <span className="font-bold text-lg block group-hover:text-blue-500 transition-colors">Daksh</span>
                <span className="text-xs text-gray-400">Main Account</span>
              </div>
              <i className="fa-solid fa-chevron-right ml-auto text-gray-400 group-hover:translate-x-1 transition-transform"></i>
            </button>
            
            <button onClick={() => { window.soundEngine.play('tap'); setUser('Brahmgeet'); window.safeStorage.set('chat_user', 'Brahmgeet'); }} className="w-full flex items-center p-4 bg-gray-50 dark:bg-white/5 hover:bg-pink-500/10 dark:hover:bg-pink-500/20 border border-gray-200/60 dark:border-white/5 rounded-2xl transition-all group">
              <Avatar name="Brahmgeet" size="md" colorClass="bg-gradient-to-br from-pink-500 to-rose-600" />
              <div className="ml-4 text-left">
                <span className="font-bold text-lg block group-hover:text-pink-500 transition-colors">Brahmgeet</span>
                <span className="text-xs text-gray-400">Main Account</span>
              </div>
              <i className="fa-solid fa-chevron-right ml-auto text-gray-400 group-hover:translate-x-1 transition-transform"></i>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const grouped = [];
  let lastD = null;
  filteredMessages.forEach(m => {
    const dStr = new Date(m.timestamp).toDateString();
    if (dStr !== lastD) { grouped.push({ type: 'date', id: `d-${m.id}`, val: m.timestamp }); lastD = dStr; }
    grouped.push({ type: 'msg', ...m });
  });

  const hasContentToSend = input.trim() || pendingImages.length > 0 || pendingDoc || editingMsg;
  let statusText = "offline";
  if (partnerStatus.online && Date.now() - partnerStatus.lastActive < 60000) statusText = partnerStatus.typing ? "typing..." : "online";
  else if (partnerStatus.lastActive) statusText = `last seen ${formatTime(new Date(partnerStatus.lastActive).toISOString())}`;

  return (
    <div className="flex h-[100dvh] w-full max-w-[1440px] mx-auto bg-ios-light dark:bg-ios-dark overflow-hidden text-[15px] select-none" onClick={() => { setActiveMenu(null); setShowEmojis(false); setShowGifs(false); setShowAttachmentMenu(false); }}>
      
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-80 border-r border-gray-200 dark:border-white/10 bg-white/50 dark:bg-[#0e0f17]/50 backdrop-blur-xl shrink-0 p-5 justify-between">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Avatar name={user} imgUrl={myDp} size="md" colorClass={myAvatarColor} />
            <div>
              <h3 className="font-bold text-lg font-display leading-tight">{user}</h3>
              <span className="text-xs text-emerald-500 font-semibold flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> Active Sync</span>
            </div>
          </div>

          <nav className="space-y-2.5">
            <button onClick={() => openModal('games')} className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 text-purple-600 dark:text-purple-400 font-bold transition-all border border-purple-500/20 ${themeObj.glow}`}>
              <div className="w-8 h-8 rounded-xl bg-purple-500 text-white flex items-center justify-center text-sm shadow-md"><i className="fa-solid fa-gamepad"></i></div>
              <span>Mini Games Arcade</span>
            </button>
            
            <button onClick={() => openModal('calendar')} className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl bg-gray-100/70 dark:bg-white/5 hover:bg-gray-200/70 dark:hover:bg-white/10 font-semibold transition-all">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center text-sm"><i className="fa-regular fa-calendar-days"></i></div>
              <span>Shared Events</span>
              <span className="ml-auto px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-500 text-xs font-bold">{events.length}</span>
            </button>
            
            <button onClick={() => openModal('profile')} className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl bg-gray-100/70 dark:bg-white/5 hover:bg-gray-200/70 dark:hover:bg-white/10 font-semibold transition-all">
              <div className="w-8 h-8 rounded-xl bg-pink-500/10 text-pink-500 flex items-center justify-center text-sm"><i className="fa-solid fa-photo-film"></i></div>
              <span>Shared Media</span>
              <span className="ml-auto px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-500 text-xs font-bold">{mediaItems.length}</span>
            </button>

            <button onClick={() => openModal('settings')} className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl bg-gray-100/70 dark:bg-white/5 hover:bg-gray-200/70 dark:hover:bg-white/10 font-semibold transition-all">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-sm"><i className="fa-solid fa-sliders"></i></div>
              <span>Settings & Audio</span>
            </button>
          </nav>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#151722] border border-gray-200/60 dark:border-white/5 shadow-sm">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Connected Partner</div>
          <div className="flex items-center gap-3">
            <Avatar name={partnerName} imgUrl={partnerDp} isOnline={partnerStatus.online && Date.now() - partnerStatus.lastActive < 60000} size="sm" colorClass={avatarColor} />
            <div className="truncate">
              <div className="font-bold text-sm truncate">{partnerName}</div>
              <div className={`text-xs ${statusText==='online'||statusText==='typing...'?'text-emerald-500':'text-gray-400'}`}>{statusText}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CHAT CONTAINER */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        
        <input type="file" ref={fileRef} onChange={handleImageUpload} onClick={e=> {if(e.target) e.target.value=null;}} accept="image/*" multiple className="hidden" />
        <input type="file" ref={camRef} onChange={handleImageUpload} onClick={e=> {if(e.target) e.target.value=null;}} accept="image/*" capture="environment" className="hidden" />
        <input type="file" ref={docRef} onChange={handleDocUpload} onClick={e=> {if(e.target) e.target.value=null;}} accept=".pdf,.doc,.docx,.txt,.csv,.zip,.rtf" className="hidden" />
        <input type="file" ref={dpRef} onChange={handleDpUpload} onClick={e=> {if(e.target) e.target.value=null;}} accept="image/*" className="hidden" />

        {/* TOAST NOTIFICATION */}
        {toast && (
           <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[200] animate-toast-drop flex items-center gap-3 px-5 py-3 glass-panel rounded-full shadow-2xl border border-gray-200 dark:border-white/10 whitespace-nowrap">
              <i className={`fa-solid ${toast.icon} text-lg`}></i>
              <span className="font-semibold text-sm">{toast.msg}</span>
           </div>
        )}

        {/* IMAGE LIGHTBOX MODAL */}
        {activeModal === 'image' && viewingImage && (
          <div className="fixed inset-0 bg-black/95 z-[100] flex flex-col animate-fade-in" onClick={closeCurrentModal}>
            <div className="w-full p-4 flex justify-between items-center z-10">
              <button className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center text-xl backdrop-blur-md" onClick={closeCurrentModal}><i className="fa-solid fa-arrow-left"></i></button>
              <a href={viewingImage} download="Shared_Image" className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center text-xl backdrop-blur-md" onClick={e=>e.stopPropagation()}><i className="fa-solid fa-download"></i></a>
            </div>
            <div className="flex-1 flex items-center justify-center p-4">
              <img src={viewingImage} className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl" onClick={e=>e.stopPropagation()} />
            </div>
          </div>
        )}

        {/* DRAWING CANVAS MODAL */}
        {activeModal === 'draw' && (
          <div className="absolute inset-0 z-[120] bg-[#12131a] flex flex-col animate-slide-up overflow-hidden" onClick={e=>e.stopPropagation()}>
            <div className="absolute top-0 w-full p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/80 to-transparent">
              <button className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center backdrop-blur-md" onClick={closeCurrentModal}><i className="fa-solid fa-xmark"></i></button>
              <span className="font-bold text-white text-lg font-display flex items-center gap-2"><i className="fa-solid fa-paintbrush text-pink-400"></i> Sketch & Draw</span>
              <button className="px-6 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-bold backdrop-blur-md hover:scale-105 transition-transform shadow-lg" onClick={() => { sendPayload({ image: canvasRef.current.toDataURL('image/jpeg', 0.8) }); closeCurrentModal(); }}>Send</button>
            </div>
            
            <canvas ref={canvasRef} className="draw-canvas w-full h-full flex-1 cursor-crosshair" onPointerDown={startDraw} onPointerMove={draw} onPointerUp={stopDraw} onPointerOut={stopDraw}></canvas>
            
            <div className="absolute bottom-0 w-full p-6 pb-safe bg-gradient-to-t from-black/90 via-black/60 to-transparent flex flex-col gap-4 z-10">
              <div className="flex items-center gap-4">
                 <i className="fa-solid fa-paintbrush text-white opacity-60"></i>
                 <input type="range" min="2" max="36" value={drawSize} onChange={e=>setDrawSize(e.target.value)} className="flex-1 accent-blue-500" />
              </div>
              <div className="flex justify-between items-center px-2">
                {DRAW_COLORS.map(c => (
                   <button key={c} onClick={() => setDrawColor(c)} className={`w-9 h-9 rounded-full border-[3px] transition-transform ${drawColor === c ? 'scale-125 border-white shadow-lg' : 'border-transparent hover:scale-110'}`} style={{backgroundColor: c}}></button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MINI GAMES MODAL */}
        {activeModal === 'games' && (
          <div className="absolute inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-md animate-fade-in" onClick={closeCurrentModal}></div>
            <div className="relative z-50 bg-ios-light dark:bg-ios-dark flex flex-col animate-slide-right overflow-hidden w-full md:w-[480px] border-l border-gray-200 dark:border-white/10 shadow-2xl" onClick={e=>e.stopPropagation()}>
              <div className="glass-header px-5 py-4 flex items-center shrink-0 justify-between">
                <button onClick={closeCurrentModal} className="w-9 h-9 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors"><i className="fa-solid fa-xmark"></i></button>
                <h2 className="font-bold text-xl font-display flex items-center gap-2"><i className="fa-solid fa-gamepad text-purple-500"></i> Mini Games Arcade</h2>
                <div className="w-9"></div>
              </div>

              <div className="flex border-b border-gray-200 dark:border-white/10 bg-white/40 dark:bg-black/20 shrink-0">
                <button onClick={() => setActiveGame('ttt')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${activeGame==='ttt'?'border-purple-500 text-purple-500':'border-transparent text-gray-400'}`}>Tic Tac Toe</button>
                <button onClick={() => setActiveGame('memory')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${activeGame==='memory'?'border-purple-500 text-purple-500':'border-transparent text-gray-400'}`}>Memory Match</button>
                <button onClick={() => setActiveGame('td')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${activeGame==='td'?'border-purple-500 text-purple-500':'border-transparent text-gray-400'}`}>Truth / Dare</button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar flex flex-col items-center justify-center">
                {activeGame === 'ttt' && (
                  <div className="w-full flex flex-col items-center animate-fade-in">
                    <div className="mb-6 text-center">
                      <h3 className="text-xl font-bold font-display">Tic Tac Toe Challenge</h3>
                      <p className="text-sm text-gray-500 mt-1">{tttWinner ? (tttWinner === 'Tie' ? "It's a Tie!" : `Winner: ${tttWinner} 🎉`) : `Current Turn: ${tttTurn}`}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-3 w-64 h-64 mb-6">
                      {tttBoard.map((val, idx) => (
                        <button key={idx} onClick={() => playTttMove(idx)} className="w-full h-full bg-white dark:bg-[#1a1c28] border border-gray-200 dark:border-white/10 rounded-2xl flex items-center justify-center text-3xl font-extrabold shadow-sm hover:scale-105 transition-transform text-purple-500">
                          {val}
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-3 w-full max-w-xs">
                      <button onClick={resetTtt} className="flex-1 py-3 rounded-xl bg-gray-200 dark:bg-white/10 font-bold hover:opacity-80 transition-opacity">Reset</button>
                      <button onClick={() => sendGameChallenge("Tic-Tac-Toe Showdown", tttWinner ? `Finished match - Result: ${tttWinner}` : `Active Game in Progress!`)} className="flex-1 py-3 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-bold transition-opacity shadow-lg">Share to Chat</button>
                    </div>
                  </div>
                )}

                {activeGame === 'memory' && (
                  <div className="w-full flex flex-col items-center animate-fade-in">
                    <div className="mb-4 text-center">
                      <h3 className="text-xl font-bold font-display">Memory Flip Challenge</h3>
                      <p className="text-sm text-gray-500">Score: {memScore} pts | Matched: {memMatched.length / 2} / 8</p>
                    </div>

                    <div className="grid grid-cols-4 gap-2.5 w-72 mb-6">
                      {memCards.map((emoji, idx) => {
                        const isFlipped = memFlipped.includes(idx) || memMatched.includes(idx);
                        return (
                          <button key={idx} onClick={() => flipMemCard(idx)} className={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold transition-all transform duration-300 ${isFlipped ? 'bg-purple-500 text-white scale-100 rotate-0' : 'bg-white dark:bg-[#1a1c28] border border-gray-200 dark:border-white/10 hover:scale-105'}`}>
                            {isFlipped ? emoji : "❓"}
                          </button>
                        );
                      })}
                    </div>

                    <button onClick={initMemoryGame} className="px-6 py-3 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-bold shadow-lg">New Game</button>
                  </div>
                )}

                {activeGame === 'td' && (
                  <div className="w-full flex flex-col items-center text-center animate-fade-in">
                    <div className="w-20 h-20 rounded-3xl bg-pink-500/10 text-pink-500 flex items-center justify-center text-3xl mb-4 shadow-md">
                      <i className="fa-solid fa-heart"></i>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-pink-500 mb-2">{window.TRUTH_OR_DARE_QUESTIONS[tdIndex].type}</span>
                    <p className="text-xl font-bold font-display text-gray-900 dark:text-white px-4 leading-relaxed mb-8">
                      "{window.TRUTH_OR_DARE_QUESTIONS[tdIndex].text}"
                    </p>

                    <div className="flex gap-3 w-full max-w-xs">
                      <button onClick={() => setTdIndex((tdIndex + 1) % window.TRUTH_OR_DARE_QUESTIONS.length)} className="flex-1 py-3 rounded-xl bg-gray-200 dark:bg-white/10 font-bold">Next Card</button>
                      <button onClick={() => sendGameChallenge(`${window.TRUTH_OR_DARE_QUESTIONS[tdIndex].type} Challenge!`, `"${window.TRUTH_OR_DARE_QUESTIONS[tdIndex].text}"`)} className="flex-1 py-3 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold shadow-lg">Send to Chat</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* SHARED EVENTS CALENDAR MODAL */}
        {activeModal === 'calendar' && (
          <div className="absolute inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-md animate-fade-in" onClick={closeCurrentModal}></div>
            <div className="relative z-50 bg-ios-light dark:bg-ios-dark flex flex-col animate-slide-right overflow-hidden w-full md:w-[420px] border-l border-gray-200 dark:border-white/10 shadow-2xl" onClick={e=>e.stopPropagation()}>
              <div className="glass-header px-5 py-4 flex items-center justify-between shrink-0">
                <button onClick={closeCurrentModal} className="w-9 h-9 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center text-gray-500 hover:text-gray-800 dark:hover:text-white"><i className="fa-solid fa-xmark"></i></button>
                <h2 className="font-bold text-xl font-display flex items-center gap-2"><i className="fa-regular fa-calendar-days text-blue-500"></i> Shared Events</h2>
                <div className="w-9"></div>
              </div>
              
              <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-5">
                 <div className="bg-white dark:bg-[#141620] rounded-2xl p-4 shadow-sm border border-gray-200/60 dark:border-white/5">
                   <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-wider"><i className="fa-solid fa-calendar-plus mr-1.5 text-blue-500"></i> Add Shared Event</h3>
                   <input type="text" placeholder="Event Title (e.g. Movie Night, Birthday)" value={newEventTitle} onChange={e=>setNewEventTitle(e.target.value)} className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 mb-3 outline-none focus:border-blue-500 text-sm font-medium" />
                   <div className="flex gap-3">
                     <input type="date" value={newEventDate} onChange={e=>setNewEventDate(e.target.value)} className="flex-1 bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500 text-sm font-medium dark:[color-scheme:dark]" />
                     <button onClick={saveCalendarEvent} className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-5 rounded-xl transition-colors shadow-md">Save</button>
                   </div>
                 </div>

                 <div className="space-y-3">
                   {events.length === 0 ? <div className="text-center text-gray-400 py-12 font-medium">No upcoming events scheduled</div> : events.map(evt => (
                     <div key={evt.id} className="bg-white dark:bg-[#141620] rounded-2xl p-4 shadow-sm border border-gray-200/60 dark:border-white/5 flex items-center justify-between">
                       <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex flex-col items-center justify-center shrink-0">
                           <span className="text-[10px] font-extrabold uppercase opacity-80 leading-none mb-0.5">{new Date(evt.date).toLocaleString('default', { month: 'short' })}</span>
                           <span className="text-lg font-bold leading-none">{new Date(evt.date).getDate()}</span>
                         </div>
                         <div>
                           <div className="font-bold text-gray-900 dark:text-white text-base leading-snug">{evt.title}</div>
                           <div className="text-xs text-gray-400 mt-0.5">Added by {evt.creator}</div>
                         </div>
                       </div>
                       <button onClick={() => window.Firebase.deleteDoc(window.Firebase.doc(window.Firebase.db, 'artifacts', window.APP_ID, 'public', 'data', 'events', evt.id))} className="w-8 h-8 rounded-full hover:bg-red-500/10 text-gray-400 hover:text-rose-500 transition-colors flex items-center justify-center"><i className="fa-solid fa-trash-can text-sm"></i></button>
                     </div>
                   ))}
                 </div>
              </div>
            </div>
          </div>
        )}

        {/* PROFILE & MEDIA VAULT MODAL */}
        {activeModal === 'profile' && (
          <div className="absolute inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-md animate-fade-in" onClick={closeCurrentModal}></div>
            <div className="relative z-50 bg-ios-light dark:bg-ios-dark flex flex-col animate-slide-right overflow-hidden w-full md:w-[420px] border-l border-gray-200 dark:border-white/10 shadow-2xl" onClick={e=>e.stopPropagation()}>
              <div className="glass-header px-5 py-4 flex items-center justify-between shrink-0">
                <button onClick={closeCurrentModal} className="w-9 h-9 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center text-gray-500 hover:text-gray-800 dark:hover:text-white"><i className="fa-solid fa-xmark"></i></button>
                <h2 className="font-bold text-xl font-display flex items-center gap-2"><i className="fa-solid fa-photo-film text-pink-500"></i> User Info & Vault</h2>
                <div className="w-9"></div>
              </div>
              
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="flex flex-col items-center justify-center pt-8 pb-6 bg-white dark:bg-[#141620] border-b border-gray-200 dark:border-white/5 shadow-sm">
                  <Avatar name={partnerName} imgUrl={partnerDp} size="lg" colorClass={avatarColor} />
                  <h2 className="text-2xl font-bold font-display mt-4">{partnerName}</h2>
                  <p className={`text-sm mt-1 font-semibold ${statusText==='online'||statusText==='typing...'?'text-emerald-500':'text-gray-400'}`}>{statusText}</p>
                </div>

                <div className="bg-white dark:bg-[#141620] mt-4 border-y border-gray-200 dark:border-white/5 shadow-sm min-h-[50vh]">
                  <div className="flex border-b border-gray-200 dark:border-white/5">
                    <button onClick={()=>setProfileTab('media')} className={`flex-1 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${profileTab==='media'?'border-blue-500 text-blue-500':'border-transparent text-gray-400'}`}>Photos ({mediaItems.length})</button>
                    <button onClick={()=>setProfileTab('docs')} className={`flex-1 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${profileTab==='docs'?'border-blue-500 text-blue-500':'border-transparent text-gray-400'}`}>Docs ({docItems.length})</button>
                    <button onClick={()=>setProfileTab('links')} className={`flex-1 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${profileTab==='links'?'border-blue-500 text-blue-500':'border-transparent text-gray-400'}`}>Links ({linkItems.length})</button>
                  </div>
                  
                  <div className="p-1">
                    {profileTab === 'media' && (
                      <div className="grid grid-cols-3 gap-1">
                        {mediaItems.length === 0 ? <div className="col-span-3 py-12 text-center text-gray-400 text-sm font-medium">No media photos found</div> : mediaItems.map((img, i) => (
                          <div key={i} className="aspect-square bg-gray-100 dark:bg-gray-800 cursor-pointer overflow-hidden group" onClick={() => openModal('image', img.url)}>
                            <img src={img.url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {profileTab === 'docs' && (
                      <div className="flex flex-col divide-y divide-gray-100 dark:divide-white/5">
                         {docItems.length === 0 ? <div className="py-12 text-center text-gray-400 text-sm font-medium">No documents uploaded</div> : docItems.map((d, i) => (
                           <div key={i} className="flex items-center p-3.5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                             <div className="w-11 h-11 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center text-xl mr-3.5 shrink-0"><i className="fa-solid fa-file-lines"></i></div>
                             <div className="flex-1 min-w-0 mr-3">
                               <div className="font-semibold text-sm truncate">{d.doc.name}</div>
                               <div className="text-xs text-gray-400 flex gap-2 mt-0.5"><span>{formatBytes(d.doc.size)}</span><span>•</span><span>{new Date(d.time).toLocaleDateString()}</span></div>
                             </div>
                             <a href={d.doc.data} download={d.doc.name} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-blue-500 hover:bg-blue-500 hover:text-white transition-colors"><i className="fa-solid fa-arrow-down text-xs"></i></a>
                           </div>
                         ))}
                      </div>
                    )}

                    {profileTab === 'links' && (
                      <div className="flex flex-col divide-y divide-gray-100 dark:divide-white/5">
                        {linkItems.length === 0 ? <div className="py-12 text-center text-gray-400 text-sm font-medium">No links shared</div> : linkItems.map((l, i) => (
                          <a key={i} href={l.url} target="_blank" className="flex items-center p-3.5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                             <div className="w-11 h-11 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400 mr-3.5 shrink-0 group-hover:bg-blue-500 group-hover:text-white transition-colors"><i className="fa-solid fa-link"></i></div>
                             <div className="flex-1 min-w-0">
                               <div className="font-medium text-sm text-blue-500 truncate">{l.url}</div>
                               <div className="text-xs text-gray-400 mt-0.5">Sent by {l.sender}</div>
                             </div>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SETTINGS MODAL */}
        {activeModal === 'settings' && (
          <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-md flex flex-col justify-end md:justify-center md:items-center animate-fade-in p-0 md:p-6" onClick={closeCurrentModal}>
            <div className="bg-ios-light dark:bg-[#12131c] w-full md:w-[460px] rounded-t-[36px] md:rounded-[36px] flex flex-col max-h-[90vh] md:max-h-[85vh] animate-drawer-up md:animate-slide-up shadow-2xl border-t md:border border-gray-200 dark:border-white/10" onClick={e=>e.stopPropagation()}>
              <div className="drag-handle md:hidden"></div>
              <div className="px-6 pb-2 md:pt-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold font-display text-gray-900 dark:text-white flex items-center gap-2"><i className="fa-solid fa-sliders text-emerald-500"></i> Settings</h2>
                <button onClick={closeCurrentModal} className="w-8 h-8 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-white/20 transition-colors"><i className="fa-solid fa-xmark"></i></button>
              </div>
              
              <div className="flex-1 overflow-y-auto px-6 pb-8 custom-scrollbar space-y-5">
                <div className="flex flex-col items-center justify-center py-4">
                   <div className="relative group cursor-pointer" onClick={() => { if(dpRef.current) dpRef.current.click() }}>
                      <Avatar name={user} imgUrl={myDp} size="lg" colorClass={myAvatarColor} />
                      <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <i className="fa-solid fa-camera text-white text-2xl"></i>
                      </div>
                   </div>
                   <div className="mt-3 text-xs text-gray-400 font-medium">Tap avatar to change profile photo</div>
                </div>

                <div className="bg-white dark:bg-[#1a1c28] rounded-2xl p-4 shadow-sm border border-gray-200/60 dark:border-white/5 flex items-center justify-between cursor-pointer" onClick={() => setIsDark(!isDark)}>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-amber-500/20 text-amber-500'}`}><i className={`fa-solid ${isDark ? 'fa-moon' : 'fa-sun'}`}></i></div> 
                    <div><div className="font-bold text-gray-900 dark:text-white">Dark Interface</div><div className="text-xs text-gray-400">Toggle dark visual mode</div></div>
                  </div>
                  <div className={`w-14 h-8 rounded-full p-1 transition-colors relative ${isDark ? 'bg-blue-500' : 'bg-gray-200'}`}><div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${isDark ? 'translate-x-6' : 'translate-x-0'}`} /></div>
                </div>

                <div className="bg-white dark:bg-[#1a1c28] rounded-2xl p-4 shadow-sm border border-gray-200/60 dark:border-white/5 flex items-center justify-between cursor-pointer" onClick={() => setSoundEnabled(!soundEnabled)}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center text-lg"><i className={`fa-solid ${soundEnabled ? 'fa-volume-high' : 'fa-volume-xmark'}`}></i></div> 
                    <div><div className="font-bold text-gray-900 dark:text-white">Sound Effects</div><div className="text-xs text-gray-400">Audio feedback & chimes</div></div>
                  </div>
                  <div className={`w-14 h-8 rounded-full p-1 transition-colors relative ${soundEnabled ? 'bg-purple-500' : 'bg-gray-200'}`}><div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${soundEnabled ? 'translate-x-6' : 'translate-x-0'}`} /></div>
                </div>

                <div className="bg-white dark:bg-[#1a1c28] rounded-2xl p-5 shadow-sm border border-gray-200/60 dark:border-white/5">
                  <label className="flex items-center text-xs font-bold text-gray-400 uppercase tracking-wider mb-3"><i className="fa-solid fa-palette mr-2"></i> Chat Accent Color</label>
                  <div className="flex flex-wrap gap-3">
                    {THEMES.colors.map(c => (
                      <button key={c.value} onClick={() => setChatColor(c.value)} className={`w-10 h-10 rounded-full shadow-md transition-transform hover:scale-110 ${c.class} ${chatColor === c.value ? 'ring-4 ring-offset-2 ring-gray-300 dark:ring-offset-[#1a1c28] dark:ring-gray-600 scale-110' : ''}`} title={c.name}></button>
                    ))}
                  </div>
                </div>

                <div className="bg-rose-50 dark:bg-rose-500/10 rounded-2xl border border-rose-100 dark:border-rose-500/20 overflow-hidden">
                  <button onClick={() => { if(confirm("Wipe all messages globally?")) { messages.forEach(m => window.Firebase.deleteDoc(window.Firebase.doc(window.Firebase.db, 'artifacts', window.APP_ID, 'public', 'data', 'messages', m.id))); closeCurrentModal(); } }} className="w-full flex items-center p-4 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-600 transition-colors text-left border-b border-rose-100 dark:border-rose-500/20">
                    <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center mr-3.5 shrink-0"><i className="fa-solid fa-trash-can"></i></div>
                    <div><div className="font-bold text-sm">Clear Chat History</div><div className="text-xs opacity-80">Deletes messages for everyone</div></div>
                  </button>
                  <button onClick={() => { setUser(null); window.safeStorage.rem('chat_user'); closeCurrentModal(); }} className="w-full flex items-center p-4 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-600 transition-colors text-left">
                    <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center mr-3.5 shrink-0"><i className="fa-solid fa-right-from-bracket"></i></div>
                    <div className="font-bold text-sm">Logout & Switch User</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* HEADER */}
        <header className="glass-header z-20 px-4 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => openModal('profile')}>
            <Avatar name={partnerName} imgUrl={partnerDp} isOnline={partnerStatus.online && Date.now() - partnerStatus.lastActive < 60000} size="md" colorClass={avatarColor} />
            <div className="flex flex-col">
              <span className="font-bold text-lg font-display leading-tight group-hover:opacity-80 transition-opacity flex items-center gap-1.5">{partnerName}</span>
              <span className={`text-xs font-semibold leading-tight ${statusText === 'online' || statusText === 'typing...' ? 'text-emerald-500' : 'text-gray-400'}`}>{statusText}</span>
            </div>
          </div>

          {showSearch ? (
            <div className="flex-1 max-w-xs mx-4 flex items-center gap-2 bg-black/5 dark:bg-white/10 px-3.5 py-1.5 rounded-full animate-fade-in">
              <i className="fa-solid fa-magnifying-glass text-gray-400 text-xs"></i>
              <input type="text" placeholder="Search messages..." value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} className="bg-transparent border-none outline-none text-xs w-full text-gray-900 dark:text-white font-medium" autoFocus />
              <button onClick={() => { setShowSearch(false); setSearchQuery(""); }} className="text-gray-400 hover:text-gray-600 text-xs"><i className="fa-solid fa-xmark"></i></button>
            </div>
          ) : null}

          <div className="flex items-center gap-1.5">
            <button onClick={() => setShowSearch(!showSearch)} className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/10 transition-colors" title="Search"><i className="fa-solid fa-magnifying-glass text-base"></i></button>
            <button onClick={() => openModal('games')} className={`w-10 h-10 rounded-full flex items-center justify-center text-purple-500 hover:bg-purple-500/10 transition-colors ${themeObj.glow}`} title="Mini Games"><i className="fa-solid fa-gamepad text-lg"></i></button>
            <button onClick={() => openModal('calendar')} className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/10 transition-colors" title="Calendar"><i className="fa-regular fa-calendar-days text-base"></i></button>
            <button onClick={() => openModal('settings')} className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/10 transition-colors" title="Settings"><i className="fa-solid fa-sliders text-base"></i></button>
          </div>
        </header>

        {pinnedMsg && (
          <div className="bg-amber-500/10 dark:bg-amber-500/15 border-b border-amber-500/20 px-4 py-2 flex items-center justify-between text-xs z-10 animate-fade-in">
            <div className="flex items-center gap-2 truncate pr-4">
              <i className="fa-solid fa-thumbtack text-amber-500"></i>
              <span className="font-bold text-amber-600 dark:text-amber-400 shrink-0">Pinned:</span>
              <span className="truncate opacity-90">{pinnedMsg.text || 'Attachment'}</span>
            </div>
            <button onClick={() => handlePinMessage(pinnedMsg)} className="text-gray-400 hover:text-amber-500"><i className="fa-solid fa-xmark"></i></button>
          </div>
        )}

        <main ref={chatRef} className="flex-1 overflow-y-auto px-4 pb-4 pt-4 custom-scrollbar relative z-10 bg-ios-light dark:bg-ios-dark">
          {grouped.map((item, i) => {
            if (item.type === 'date') return <div key={item.id} className="flex justify-center my-6"><span className="text-[11px] font-bold tracking-wide uppercase px-3.5 py-1 rounded-full bg-black/5 dark:bg-white/10 text-gray-400 shadow-sm">{getDateLabel(item.val)}</span></div>;

            const msg = item;
            const isMe = msg.sender === user;
            const showMenu = activeMenu === msg.id;
            
            const prev = i > 0 && grouped[i-1].type === 'msg' ? grouped[i-1] : null;
            const next = i < grouped.length - 1 && grouped[i+1].type === 'msg' ? grouped[i+1] : null;
            const isFirst = !prev || prev.sender !== msg.sender || (new Date(msg.timestamp) - new Date(prev.timestamp) > 300000); 
            const isLast = !next || next.sender !== msg.sender || (new Date(next.timestamp) - new Date(msg.timestamp) > 300000);

            const bgClass = isMe ? `bg-${chatColor}-500 text-white shadow-md shadow-${chatColor}-500/20` : 'bg-white dark:bg-[#1c1d27] text-gray-900 dark:text-gray-100 shadow-sm border border-gray-200/50 dark:border-white/5';
            
            let rounded = 'rounded-[22px]'; 
            if (isMe) { 
              if (!isFirst) rounded += ' rounded-tr-[6px]'; 
              if (!isLast) rounded += ' rounded-br-[6px]'; 
            } else { 
              if (!isFirst) rounded += ' rounded-tl-[6px]'; 
              if (!isLast) rounded += ' rounded-bl-[6px]'; 
            }

            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} ${isLast ? 'mb-3' : 'mb-[3px]'}`}>
                <div className={`flex items-end gap-2 max-w-[88%] sm:max-w-[78%] md:max-w-[62%] relative group`}>
                  
                  <div className={`opacity-0 group-hover:opacity-100 transition-opacity flex items-center ${isMe ? 'order-1 pr-1' : 'order-2 pl-1'}`}>
                    <button onClick={(e) => { e.stopPropagation(); setActiveMenu(showMenu ? null : msg.id); }} className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"><i className="fa-solid fa-ellipsis-vertical text-xs"></i></button>
                  </div>

                  {showMenu && (
                    <div className={`absolute ${isLast ? 'bottom-full mb-2' : 'top-0 mt-8'} ${isMe ? 'right-0' : 'left-0'} z-50 flex flex-col p-2 rounded-2xl shadow-2xl bg-white dark:bg-[#181a26] border border-gray-200 dark:border-white/10 w-56 animate-fade-in origin-${isMe?'bottom-right':'bottom-left'}`} onClick={e=>e.stopPropagation()}>
                      <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-black/40 rounded-xl mb-1.5">
                        {EMOJIS.quick.map(em => (<button key={em} onClick={() => handleReaction(msg.id, em, msg.reactions||[])} className="text-xl hover:scale-125 transition-transform origin-bottom">{em}</button>))}
                      </div>
                      <div className="flex flex-col space-y-0.5">
                        <button onClick={() => { setReplyingTo(msg); setActiveMenu(null); }} className="w-full flex items-center gap-3 p-2.5 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl text-sm font-semibold"><i className="fa-solid fa-reply text-gray-400 w-4"></i> Reply</button>
                        <button onClick={() => handlePinMessage(msg)} className="w-full flex items-center gap-3 p-2.5 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl text-sm font-semibold"><i className="fa-solid fa-thumbtack text-gray-400 w-4"></i> {msg.isPinned ? 'Unpin' : 'Pin Message'}</button>
                        {msg.text && <button onClick={() => { navigator.clipboard.writeText(msg.text); setActiveMenu(null); showToast("Text Copied!", "fa-copy text-blue-500"); }} className="w-full flex items-center gap-3 p-2.5 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl text-sm font-semibold"><i className="fa-regular fa-copy text-gray-400 w-4"></i> Copy</button>}
                        {isMe && msg.text && !msg.image && (!msg.images || msg.images.length === 0) && !msg.audio && !msg.doc && <button onClick={() => { setEditingMsg(msg); setInput(msg.text); setActiveMenu(null); }} className="w-full flex items-center gap-3 p-2.5 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl text-sm font-semibold"><i className="fa-solid fa-pen text-gray-400 w-4"></i> Edit</button>}
                        {isMe && <div className="h-px bg-gray-100 dark:bg-white/10 my-1"></div>}
                        {isMe && <button onClick={() => { window.Firebase.deleteDoc(window.Firebase.doc(window.Firebase.db, 'artifacts', window.APP_ID, 'public', 'data', 'messages', msg.id)); setActiveMenu(null); }} className="w-full flex items-center gap-3 p-2.5 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl text-sm font-semibold text-rose-500"><i className="fa-solid fa-trash-can w-4"></i> Delete</button>}
                      </div>
                    </div>
                  )}

                  <div className={`flex flex-col relative ${bgClass} ${rounded} transition-all`} style={{ wordBreak: 'break-word' }} onDoubleClick={() => handleReaction(msg.id, '❤️', msg.reactions||[])}>
                    
                    <div className={`px-4 py-2.5 min-w-[76px] ${msg.image || (msg.images&&msg.images.length>0) ? 'p-1.5' : ''}`}>
                      
                      {msg.replyTo && (
                        <div className={`mb-2 pl-3 border-l-2 text-xs rounded-r-lg py-1 px-2.5 ${isMe ? 'border-white/80 bg-black/10' : 'border-blue-500 bg-blue-500/5'}`}>
                          <div className={`font-bold mb-0.5 ${isMe ? 'text-white' : 'text-blue-500'}`}>{msg.replyTo.sender}</div>
                          <div className="line-clamp-2 opacity-90">{formatTextWithLinks(msg.replyTo.text)}</div>
                        </div>
                      )}

                      {msg.gameCard && (
                        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-gray-900 dark:text-white mb-2">
                          <div className="flex items-center gap-2 font-bold font-display text-purple-600 dark:text-purple-400 mb-1">
                            <i className="fa-solid fa-gamepad"></i> {msg.gameCard.title}
                          </div>
                          <p className="text-xs opacity-90">{msg.gameCard.details}</p>
                        </div>
                      )}

                      {msg.doc && (
                        <div className={`flex items-center gap-3 p-2.5 rounded-xl mb-1 ${isMe ? 'bg-black/10' : 'bg-gray-100 dark:bg-black/40'}`}>
                           <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0 ${isMe ? 'bg-white/20 text-white' : 'bg-blue-500 text-white'}`}><i className="fa-solid fa-file-lines"></i></div>
                           <div className="flex-1 min-w-0 pr-2">
                             <div className="font-bold text-sm truncate leading-tight">{msg.doc.name}</div>
                             <div className="text-xs opacity-75 mt-0.5">{formatBytes(msg.doc.size)}</div>
                           </div>
                           <a href={msg.doc.data} download={msg.doc.name} className={`w-8 h-8 rounded-full flex items-center justify-center transition-opacity ${isMe ? 'bg-white text-gray-900' : 'bg-gray-200 dark:bg-gray-700 text-gray-300'}`}><i className="fa-solid fa-arrow-down text-xs"></i></a>
                        </div>
                      )}

                      {(msg.image || (msg.images && msg.images.length > 0)) && (
                        <div className={`grid gap-[3px] rounded-[18px] overflow-hidden ${msg.text ? 'mb-1.5' : ''} ${(msg.images && msg.images.length >= 2) ? 'grid-cols-2' : 'grid-cols-1'}`}>
                           {(msg.images || [msg.image]).map((img, idx) => (
                             <div key={idx} className={`cursor-zoom-in relative group/img ${((msg.images && msg.images.length === 3) || (!msg.images && msg.image)) && idx === 0 ? 'col-span-full' : ''}`} onClick={() => openModal('image', img)}>
                               <img src={img} className="w-full object-cover rounded-xl" style={{ aspectRatio: (msg.images && msg.images.length > 1) ? '1' : 'auto', maxHeight: (msg.images && msg.images.length > 1) ? 'auto' : '320px', minHeight: '130px' }} loading="lazy" />
                             </div>
                           ))}
                        </div>
                      )}

                      {msg.audio && (
                        <div className={`flex items-center gap-3 p-1 rounded-full ${msg.text ? 'mb-2' : ''} ${isMe ? 'bg-black/10' : 'bg-black/5 dark:bg-white/5'}`}>
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isMe ? 'bg-white text-gray-900' : 'bg-blue-500 text-white'}`}><i className="fa-solid fa-play text-xs ml-0.5"></i></div>
                          <audio controls src={msg.audio} className="h-8 w-44 outline-none opacity-90" style={{ filter: isDark && !isMe ? 'invert(0.9) hue-rotate(180deg)' : (isMe ? 'invert(1) hue-rotate(180deg) brightness(1.5)' : 'none') }}></audio>
                        </div>
                      )}
                      
                      {msg.text && <div className="leading-normal whitespace-pre-wrap">{formatTextWithLinks(msg.text)}</div>}
                      
                      <div className={`text-[10px] flex justify-end items-center gap-1 font-semibold select-none mt-1 ${isMe ? 'text-white/80' : 'text-gray-400'}`}>
                        {msg.isEdited && <span className="opacity-70 font-normal italic mr-1">edited</span>}
                        <span>{formatTime(msg.timestamp)}</span>
                        {isMe && (
                          <span className="flex items-center ml-0.5 relative w-3.5 h-3.5">
                            {msg.status === 'sent' && <i className="fa-solid fa-check text-[10px] opacity-70 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></i>}
                            {msg.status === 'delivered' && <i className="fa-solid fa-check-double text-[10px] opacity-90 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></i>}
                            {msg.status === 'read' && (
                              <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[14px] h-[14px] drop-shadow-sm" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.5 12L7.5 17L18 6.5" stroke="#34d399" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M7.5 12L12.5 17L23 6.5" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            )}
                          </span>
                        )}
                      </div>
                    </div>

                    {(msg.reactions && msg.reactions.length > 0) && (
                      <div className={`absolute -bottom-3.5 ${isMe ? 'right-3' : 'left-3'} bg-white dark:bg-[#181a26] rounded-full px-2 py-0.5 shadow-md border border-gray-200/60 dark:border-white/10 flex items-center gap-1 text-[12px] z-10`}>
                        {Array.from(new Set(msg.reactions)).map(emoji => {
                          const count = msg.reactions.filter(r => r === emoji).length;
                          return <span key={emoji} className="flex items-center gap-1">{emoji} {count > 1 && <span className="text-[10px] font-bold text-gray-500">{count}</span>}</span>
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {partnerStatus.online && partnerStatus.typing && (
            <div className="flex items-start mb-4 animate-fade-in">
              <div className="bg-white dark:bg-[#1c1d27] border border-gray-200/50 dark:border-white/5 rounded-[22px] rounded-bl-[6px] px-4 py-3 flex items-center gap-1.5 shadow-sm">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.15s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.3s'}}></div>
              </div>
            </div>
          )}
          <div className="h-4"></div>
        </main>

        <footer className="glass-footer shrink-0 px-4 py-3 pb-safe z-30" onClick={e=>e.stopPropagation()}>
          
          {(editingMsg || replyingTo) && (
            <div className={`mb-2 px-3.5 py-2 bg-black/5 dark:bg-white/5 rounded-2xl flex items-center justify-between animate-slide-up border-l-[4px] ${editingMsg ? 'border-emerald-500' : 'border-blue-500'}`}>
              <div className="flex flex-col truncate pr-4">
                <span className={`text-xs font-bold mb-0.5 ${editingMsg ? 'text-emerald-500' : 'text-blue-500'}`}>{editingMsg ? 'Edit Message' : `Replying to ${(replyingTo||{}).sender}`}</span>
                <span className="text-xs text-gray-600 dark:text-gray-300 truncate">{(editingMsg||replyingTo||{}).text || 'Attachment'}</span>
              </div>
              <button onClick={() => { setEditingMsg(null); setReplyingTo(null); setInput(""); }} className="w-7 h-7 flex items-center justify-center bg-black/10 dark:bg-white/10 rounded-full text-gray-400 hover:text-gray-600"><i className="fa-solid fa-xmark text-xs"></i></button>
            </div>
          )}

          {pendingDoc && (
            <div className="mb-2 px-3 py-2 bg-black/5 dark:bg-white/5 rounded-2xl flex items-center justify-between animate-slide-up">
               <div className="flex items-center min-w-0 pr-2">
                 <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center text-base mr-3"><i className="fa-solid fa-file"></i></div>
                 <div className="flex flex-col truncate">
                   <span className="text-xs font-bold truncate text-gray-900 dark:text-white">{pendingDoc.name}</span>
                   <span className="text-[10px] text-gray-400">{formatBytes(pendingDoc.size)}</span>
                 </div>
               </div>
               <button onClick={() => setPendingDoc(null)} className="w-6 h-6 flex items-center justify-center bg-black/10 dark:bg-white/10 rounded-full text-gray-400"><i className="fa-solid fa-xmark text-xs"></i></button>
            </div>
          )}

          {pendingImages.length > 0 && (
            <div className="mb-2 p-2 bg-black/5 dark:bg-white/5 rounded-2xl flex flex-wrap gap-2 overflow-y-auto max-h-32 custom-scrollbar animate-slide-up">
              {pendingImages.map((img, idx) => (
                <div key={idx} className="relative w-16 h-16 group shrink-0">
                  <img src={img} className="w-full h-full object-cover rounded-xl border border-black/10 dark:border-white/10 shadow-sm" />
                  <button type="button" onClick={() => setPendingImages(prev => prev.filter((_, i) => i !== idx))} className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-white rounded-full flex items-center justify-center text-[10px] shadow-md"><i className="fa-solid fa-xmark"></i></button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-end gap-2.5">
            {!editingMsg && (
              <div className="relative mb-0.5">
                <button type="button" onClick={() => setShowAttachmentMenu(!showAttachmentMenu)} className="w-10 h-10 flex items-center justify-center rounded-full transition-all text-blue-500 hover:bg-blue-500/10"><i className={`fa-solid fa-plus text-xl transition-transform ${showAttachmentMenu ? 'rotate-45' : ''}`}></i></button>
                
                {showAttachmentMenu && (
                  <div className="absolute bottom-full left-0 mb-3 flex items-center gap-3 animate-slide-up z-50 bg-white dark:bg-[#181a26] p-3 rounded-3xl shadow-2xl border border-gray-200/60 dark:border-white/10">
                    <button type="button" onClick={() => { setShowAttachmentMenu(false); camRef.current?.click(); }} className="flex flex-col items-center group"><div className="w-12 h-12 rounded-2xl bg-blue-500 text-white flex items-center justify-center text-xl mb-1 group-hover:scale-105 transition-transform shadow-md"><i className="fa-solid fa-camera"></i></div><span className="text-[10px] font-bold text-gray-400">Camera</span></button>
                    <button type="button" onClick={() => { setShowAttachmentMenu(false); fileRef.current?.click(); }} className="flex flex-col items-center group"><div className="w-12 h-12 rounded-2xl bg-purple-500 text-white flex items-center justify-center text-xl mb-1 group-hover:scale-105 transition-transform shadow-md"><i className="fa-regular fa-image"></i></div><span className="text-[10px] font-bold text-gray-400">Photo</span></button>
                    <button type="button" onClick={() => { setShowAttachmentMenu(false); docRef.current?.click(); }} className="flex flex-col items-center group"><div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-xl mb-1 group-hover:scale-105 transition-transform shadow-md"><i className="fa-solid fa-file-lines"></i></div><span className="text-[10px] font-bold text-gray-400">Doc</span></button>
                    <button type="button" onClick={() => { setShowAttachmentMenu(false); openModal('draw'); }} className="flex flex-col items-center group"><div className="w-12 h-12 rounded-2xl bg-pink-500 text-white flex items-center justify-center text-xl mb-1 group-hover:scale-105 transition-transform shadow-md"><i className="fa-solid fa-paintbrush"></i></div><span className="text-[10px] font-bold text-gray-400">Draw</span></button>
                  </div>
                )}
              </div>
            )}

            <div className={`flex-1 min-w-0 flex items-end rounded-[22px] transition-colors border ${isDark ? 'bg-[#181a26] border-white/5' : 'bg-white border-gray-200/80 shadow-sm'}`}>
              {isRecording ? (
                <div className="flex-1 h-10 flex items-center justify-between px-4">
                  <div className="flex items-center gap-2">
                    <div className="relative flex items-center justify-center"><div className="w-2.5 h-2.5 bg-rose-500 rounded-full relative z-10"></div><div className="w-2.5 h-2.5 bg-rose-500 rounded-full absolute recording-pulse"></div></div>
                    <span className="text-rose-500 font-bold font-mono tracking-wide text-sm">00:{recordTime < 10 ? `0${recordTime}` : recordTime}</span>
                  </div>
                  <button type="button" onClick={cancelVoice} className="text-xs font-semibold text-gray-400 hover:text-gray-200">Cancel</button>
                </div>
              ) : (
                <>
                  <textarea ref={inputRef} value={input} onChange={handleType} placeholder={editingMsg ? "Edit message..." : "Type a message..."} className="flex-1 bg-transparent border-none text-[15px] px-4 py-[10px] outline-none resize-none m-0 leading-snug text-gray-900 dark:text-gray-100 placeholder-gray-400 font-normal" style={{ height: '40px', minHeight: '40px', maxHeight: '140px' }} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendPayload({}); } }} />
                  
                  <div className="flex items-center pb-1 pr-2 shrink-0 gap-1">
                    <button type="button" onClick={() => { setShowEmojis(!showEmojis); setShowGifs(false); setShowAttachmentMenu(false); }} className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors text-gray-400 hover:text-blue-500 ${showEmojis ? 'bg-blue-500/10 text-blue-500' : ''}`}><i className="fa-regular fa-face-smile text-lg"></i></button>
                    
                    <button type="button" onClick={() => { setShowGifs(!showGifs); setShowEmojis(false); setShowAttachmentMenu(false); }} className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors text-gray-400 hover:text-blue-500 ${showGifs ? 'bg-blue-500/10 text-blue-500' : ''}`}>
                       <div className="border-[2px] border-current rounded-[4px] px-[3px] text-[8px] font-extrabold uppercase mt-0.5">GIF</div>
                    </button>
                    
                    {showEmojis && (
                      <div className="absolute bottom-14 right-10 md:right-0 shadow-2xl rounded-3xl p-4 w-[290px] h-[310px] flex flex-col gap-2 z-[70] bg-white dark:bg-[#181a26] border border-gray-200 dark:border-white/10 animate-slide-up">
                         <div className="grid grid-cols-5 gap-2 overflow-y-auto custom-scrollbar">
                            {EMOJIS.common.map((e, i) => <button key={i} type="button" onClick={() => handleType({target:{value: input + e}})} className="text-3xl p-1 hover:scale-125 transition-transform origin-bottom">{e}</button>)}
                         </div>
                      </div>
                    )}

                    {showGifs && (
                      <div className="absolute bottom-14 right-0 shadow-2xl rounded-3xl p-3 w-[310px] h-[350px] flex flex-col gap-2 z-[70] bg-white dark:bg-[#181a26] border border-gray-200 dark:border-white/10 animate-slide-up">
                        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100 dark:bg-black/40">
                          <i className="fa-solid fa-magnifying-glass text-gray-400 text-xs"></i>
                          <input type="text" placeholder="Search GIFs..." value={gifSearch} onChange={(e) => setGifSearch(e.target.value)} className="bg-transparent border-none outline-none w-full text-xs font-medium text-gray-900 dark:text-white" />
                        </div>
                        <div className="flex-1 overflow-y-auto grid grid-cols-2 gap-1.5 custom-scrollbar pr-1">
                          {isSearchingGifs ? <div className="col-span-2 flex items-center justify-center text-gray-400"><i className="fa-solid fa-circle-notch animate-spin text-2xl"></i></div> : tenorGifs.map((url, i) => (<img key={i} src={url} onClick={() => sendPayload({ image: url })} className="rounded-xl h-24 w-full object-cover cursor-pointer hover:opacity-80 transition-opacity" />))}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
            
            <div className="mb-0.5 shrink-0">
              {!hasContentToSend && !isRecording ? (
                <button type="button" onClick={startVoice} className="w-10 h-10 flex items-center justify-center text-blue-500 hover:bg-blue-500/10 rounded-full transition-all" title="Hold voice note"><i className="fa-solid fa-microphone text-lg"></i></button>
              ) : isRecording ? (
                <button type="button" onClick={stopVoice} className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-full transition-transform hover:scale-110 shadow-md"><i className="fa-solid fa-arrow-up text-sm"></i></button>
              ) : (
                <button type="button" onClick={(e) => sendPayload({})} className={`w-10 h-10 flex items-center justify-center rounded-full transition-transform hover:scale-110 text-white shadow-md ${editingMsg ? 'bg-emerald-500' : (THEMES.colors.find(c => c.value === chatColor)?.class || 'bg-blue-500')}`}>
                  {editingMsg ? <i className="fa-solid fa-check"></i> : <i className="fa-solid fa-arrow-up text-sm"></i>}
                </button>
              )}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ErrorBoundary><App /></ErrorBoundary>);
