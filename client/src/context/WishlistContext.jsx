import { createContext, useContext, useEffect, useState } from 'react';
import { API } from '../api/http.js';
import { useAuth } from './AuthContext.jsx';

const C = createContext(null);
const KEY = 'RR MASALA_guest_wishlist';

export function WishlistProvider({ children }) {
    const { user } = useAuth();
    const [items, setItems] = useState(() => JSON.parse(localStorage.getItem(KEY) || '[]'));

    useEffect(() => {
        if (user) {
            API.get('/wishlist')
                .then(r => setItems(r.data?.data?.products || []))
                .catch(() => { });
        } else {
            localStorage.setItem(KEY, JSON.stringify(items));
        }
    }, [user]);

    const has = p => items.some(x => String(x?._id || x?.id) === String(p?._id || p?.id));

    const toggle = async p => {
        const id = String(p?._id || p?.id);
        const exists = items.some(x => String(x?._id || x?.id) === id);

        // 1. Click panna udaney (0 delay) UI update aagum
        const updated = exists
            ? items.filter(x => String(x?._id || x?.id) !== id)
            : [...items, p];

        setItems(updated);

        if (!user) {
            localStorage.setItem(KEY, JSON.stringify(updated));
            return;
        }

        // 2. Background-la API call pogum
        try {
            const r = await API.post(`/wishlist/${id}/toggle`);
            if (r.data?.data?.products) {
                setItems(r.data.data.products);
            }
        } catch (error) {
            // API fail aana mattum pazhaya items thirumba restore aagum
            setItems(items);
            window.alert(error?.response?.data?.message || "Could not update wishlist.");
        }
    };

    return <C.Provider value={{ items, has, toggle }}>{children}</C.Provider>;
}

export const useWishlist = () => useContext(C);