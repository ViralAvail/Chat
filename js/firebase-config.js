// Firebase Configuration and Realtime Firestore Wrapper

const firebaseConfig = {
  apiKey: "AIzaSyBh-63U8Zmi9IrCH17q_Lym31W4Dl4nHNU",
  authDomain: "myorifatechat.firebaseapp.com",
  projectId: "myorifatechat",
  storageBucket: "myorifatechat.firebasestorage.app",
  messagingSenderId: "514262745271",
  appId: "1:514262745271:web:0f7c45f38e68279b390d32"
};

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
auth.setPersistence(firebase.auth.Auth.Persistence.NONE).catch(() => {});

window.Firebase = {
  db, auth,
  collection: (database, ...path) => ({ type: 'collection', path }),
  doc: (database, ...path) => ({ type: 'doc', path }),
  setDoc: async (docRef, data, options) => { 
    const p = docRef.path.join('/'); 
    return options?.merge ? db.doc(p).set(data, { merge: true }) : db.doc(p).set(data); 
  },
  updateDoc: async (docRef, data) => { 
    const p = docRef.path.join('/'); 
    return db.doc(p).update(data); 
  },
  deleteDoc: async (docRef) => { 
    const p = docRef.path.join('/'); 
    return db.doc(p).delete(); 
  },
  onSnapshot: (ref, onSuccess, onError) => {
    const p = ref.path.join('/');
    if (ref.type === 'collection') return db.collection(p).onSnapshot(onSuccess, onError);
    return db.doc(p).onSnapshot(docSnap => onSuccess({ id: docSnap.id, exists: () => docSnap.exists, data: () => docSnap.data() }), onError);
  },
  signInAnonymously: async () => auth.signInAnonymously(),
  onAuthStateChanged: (callback) => auth.onAuthStateChanged(callback)
};
