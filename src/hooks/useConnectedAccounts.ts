import { useState, useEffect } from 'react';
import { auth, db } from '@/firebase/firebase';
import { GoogleAuthProvider, linkWithPopup, unlink, User } from 'firebase/auth';
import { doc, setDoc, getDoc, deleteField, updateDoc } from 'firebase/firestore';

export interface ConnectedAccount {
  displayName: string;
  photoUrl: string;
  connectedAt: string;
}

export interface ConnectedAccounts {
  google?: ConnectedAccount;
  line?: ConnectedAccount;
}

export function useConnectedAccounts() {
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccounts>({});
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchConnectedAccounts(currentUser.uid);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Listen for LINE Login popup messages
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      // Verify the message origin for security
      if (event.origin !== window.location.origin) return;

      if (event.data.type === 'LINE_LOGIN_SUCCESS' && event.data.profile && user) {
        const lineProfile = event.data.profile;
        
        const lineAccount: ConnectedAccount = {
          displayName: lineProfile.displayName,
          photoUrl: lineProfile.pictureUrl || '',
          connectedAt: new Date().toISOString(),
        };

        try {
          await setDoc(
            doc(db, 'users', user.uid),
            {
              connectedAccounts: {
                line: lineAccount,
              },
            },
            { merge: true }
          );

          setConnectedAccounts((prev) => ({
            ...prev,
            line: lineAccount,
          }));
        } catch (error) {
          console.error('Error saving LINE account:', error);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [user]);

  const fetchConnectedAccounts = async (userId: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setConnectedAccounts(data.connectedAccounts || {});
      }
    } catch (error) {
      console.error('Error fetching connected accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const connectGoogle = async () => {
    if (!user) return;

    try {
      const provider = new GoogleAuthProvider();
      const result = await linkWithPopup(user, provider);
      
      const googleAccount: ConnectedAccount = {
        displayName: result.user.displayName || 'Unknown',
        photoUrl: result.user.photoURL || '',
        connectedAt: new Date().toISOString(),
      };

      await setDoc(
        doc(db, 'users', user.uid),
        {
          connectedAccounts: {
            google: googleAccount,
          },
        },
        { merge: true }
      );

      setConnectedAccounts((prev) => ({
        ...prev,
        google: googleAccount,
      }));

      return { success: true };
    } catch (error: any) {
      console.error('Error connecting Google:', error);
      
      // Handle account already linked
      if (error.code === 'auth/provider-already-linked') {
        // Fetch the existing Google account info
        const googleProvider = user.providerData.find(p => p.providerId === 'google.com');
        if (googleProvider) {
          const googleAccount: ConnectedAccount = {
            displayName: googleProvider.displayName || 'Unknown',
            photoUrl: googleProvider.photoURL || '',
            connectedAt: new Date().toISOString(),
          };

          await setDoc(
            doc(db, 'users', user.uid),
            {
              connectedAccounts: {
                google: googleAccount,
              },
            },
            { merge: true }
          );

          setConnectedAccounts((prev) => ({
            ...prev,
            google: googleAccount,
          }));
        }
        return { success: true, message: 'Google account already connected' };
      }
      
      return { success: false, error: error.message };
    }
  };

  const disconnectGoogle = async () => {
    if (!user) return;

    try {
      await unlink(user, 'google.com');
      
      await updateDoc(doc(db, 'users', user.uid), {
        'connectedAccounts.google': deleteField(),
      });

      setConnectedAccounts((prev) => {
        const updated = { ...prev };
        delete updated.google;
        return updated;
      });

      return { success: true };
    } catch (error: any) {
      console.error('Error disconnecting Google:', error);
      return { success: false, error: error.message };
    }
  };

  const connectLine = async () => {
    // LINE Login implementation
    // This requires LINE Login Channel configuration
    // For now, we'll create a placeholder that opens LINE Login URL
    
    if (!user) return { success: false, error: 'User not authenticated' };

    // TODO: Replace with your LINE Channel ID from .env
    const LINE_CHANNEL_ID = process.env.NEXT_PUBLIC_LINE_CHANNEL_ID || 'YOUR_LINE_CHANNEL_ID';
    const REDIRECT_URI = `${window.location.origin}/api/line/callback`;
    const STATE = Math.random().toString(36).substring(7);
    
    // Store state in sessionStorage for verification
    sessionStorage.setItem('line_oauth_state', STATE);
    sessionStorage.setItem('line_user_id', user.uid);

    const lineAuthUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${LINE_CHANNEL_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=${STATE}&scope=profile%20openid`;

    // Open LINE Login in a popup
    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    window.open(
      lineAuthUrl,
      'LINE Login',
      `width=${width},height=${height},left=${left},top=${top}`
    );

    return { success: true, message: 'Opening LINE Login...' };
  };

  const disconnectLine = async () => {
    if (!user) return;

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        'connectedAccounts.line': deleteField(),
      });

      setConnectedAccounts((prev) => {
        const updated = { ...prev };
        delete updated.line;
        return updated;
      });

      return { success: true };
    } catch (error: any) {
      console.error('Error disconnecting LINE:', error);
      return { success: false, error: error.message };
    }
  };

  return {
    connectedAccounts,
    loading,
    connectGoogle,
    disconnectGoogle,
    connectLine,
    disconnectLine,
  };
}

