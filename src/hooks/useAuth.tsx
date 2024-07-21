import { useRouter } from 'next/navigation';
import { getMeApi, logoutApi } from '@/api/user';
import { toast } from 'react-toastify';
import { ROUTE } from '@/constant/enum';
import { useEffect, useState } from 'react';
import { UserModel } from '@/models/user';

export const useAuth = () => {
    const [user, setUser] = useState<UserModel | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await getMeApi();
                if (response.status === 0) {
                    setUser(response.data);
                }
            } catch (error) {
                setUser(null);
                console.error('Failed to get me', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const logout = async () => {
        try {
            const response = await logoutApi({});

            if (response.status === 0) {
                toast.success('Đăng xuất thành công!');
                setTimeout(() => {
                    router.push(ROUTE.LOGIN);
                }, 2000);
            }
        } catch (error) {
            console.error('Logout failed', error);
        }
    }

    return { user, loading, logout };
};
