'use client';

import { ROUTE } from '@/constant/enum';
import { useRouter } from 'next/navigation';

interface SearchCategoryProps {
    searchCategory: string;
    setSearchCategory: React.Dispatch<React.SetStateAction<string>>;
}

const SearchCategory: React.FC<SearchCategoryProps> = ({ searchCategory, setSearchCategory }) => {

    const router = useRouter();
    const handleAddCategoryClick = () => {
        router.push(ROUTE.ADD_CATEGORY);
    };

    return (
        <>
            <div className='flex items-center pb-14'>
                <div className='flex flex-1'>
                    <div className='w-1/2'>
                        <label htmlFor='searchInput' className='sr-only'>Tìm kiếm theo tên</label>
                        <input
                            id='searchInput'
                            type='text'
                            placeholder='Tìm kiếm theo tên...'
                            value={searchCategory}
                            onChange={(e) => setSearchCategory(e.target.value)}
                            className='block w-full rounded-md border-0 py-2 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                        />
                    </div>
                </div>
                <div className=''>
                    <button
                        onClick={handleAddCategoryClick}
                        className='bg-primary text-white px-4 py-2 rounded hover:bg-primary-foreground'
                    >
                        Tạo mới
                    </button>
                </div>
            </div>
        </>
    );
};

export default SearchCategory;