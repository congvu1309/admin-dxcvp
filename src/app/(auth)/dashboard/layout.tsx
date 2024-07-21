import Sidebar from '@/components/navigation/Sidebar';
import { ProtectedProvider } from '@/provider/ProtectedProvider';

export default function DashboardLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {

    return (
        <ProtectedProvider>
            <Sidebar>
                {children}
            </Sidebar>
        </ProtectedProvider >
    );
}
