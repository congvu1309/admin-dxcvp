import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import './custom.css';
import { AppProvider } from '@/provider/AppProvider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const myLocalFont = localFont({
  src: '../../public/font//Nunito-VariableFont_wght.ttf',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'dxcvp',
  description: 'Booking',
};
export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang='en'>
      <body className={myLocalFont.className}>
        <AppProvider>
          {children}
          <ToastContainer
            position='top-right'
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme='light'
          />
        </AppProvider>
      </body>
    </html>
  );
}
