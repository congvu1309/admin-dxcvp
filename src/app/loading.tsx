'use client';

import ClipLoader from 'react-spinners/ClipLoader';

const LoadingPage = () => {
    return (
        <div className='flex items-center justify-center min-h-screen'>
            <ClipLoader loading={true} size={50} />
            <span className='text-lg pl-5'>Xin vui lòng chờ ...</span>
        </div>
    );
}

export default LoadingPage;