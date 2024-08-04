'use client';

import { ROUTE } from '@/constant/enum';
import { useRouter } from 'next/navigation';

interface SearchUserProps {
    searchUser: string;
    setSearchUser: React.Dispatch<React.SetStateAction<string>>;
    searchSelected: string;
    setSearchSelected: React.Dispatch<React.SetStateAction<string>>;
}

const SearchUser: React.FC<SearchUserProps> = ({ searchUser, setSearchUser, searchSelected, setSearchSelected }) => {

    const router = useRouter();
    const handleAddUserClick = () => {
        router.push(ROUTE.ADD_USER);
    };

    return (
        <>
            <div className='flex items-center pb-14'>
                <div className='flex flex-1'>
                    <div className='w-1/2'>
                        <label htmlFor='searchInput' className='sr-only'>Tìm kiếm theo email hoặc tên</label>
                        <input
                            id='searchInput'
                            type='text'
                            placeholder='Tìm kiếm theo email hoặc tên...'
                            value={searchUser}
                            onChange={(e) => setSearchUser(e.target.value)}
                            className='block w-full rounded-md border-0 py-2 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                        />
                    </div>
                    <div className='w-1/4 mx-2'>
                        <label htmlFor='searchSelect' className='sr-only'>Chọn trạng thái</label>
                        <select
                            id='searchSelect'
                            value={searchSelected}
                            onChange={(e) => setSearchSelected(e.target.value)}
                            className='block w-full rounded-md border-0 py-2.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                        >
                            <option value='ALL'>Tất cả</option>
                            <option value='R2'>Người cung cấp dịch vụ</option>
                            <option value='R3'>Khách</option>
                            <option value='S1'>Hoạt động</option>
                            <option value='S2'>Chặn</option>
                        </select>
                    </div>
                </div>
                <div>
                    <button
                        onClick={handleAddUserClick}
                        className='bg-primary text-white px-4 py-2 rounded hover:bg-primary-foreground'
                    >
                        Tạo mới
                    </button>
                </div>
            </div>
        </>
    );
}

export default SearchUser;