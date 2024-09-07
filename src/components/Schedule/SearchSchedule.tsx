'use client';

interface SearchScheduleProps {
    searchSchedule: string;
    setSearchSchedule: React.Dispatch<React.SetStateAction<string>>;
    searchSelected: string;
    setSearchSelected: React.Dispatch<React.SetStateAction<string>>;
}

const SearchSchedule: React.FC<SearchScheduleProps> = ({ searchSchedule, setSearchSchedule, searchSelected, setSearchSelected }) => {

    return (
        <>
            <div className='flex items-center pb-14'>
                <div className='flex flex-1'>
                    <div className='w-1/2'>
                        <label htmlFor='searchInput' className='sr-only'>Tìm kiếm theo ngày hoặc tên nhà cung cấp</label>
                        <input
                            id='searchInput'
                            type='text'
                            placeholder='Tìm kiếm theo ngày'
                            value={searchSchedule}
                            onChange={(e) => setSearchSchedule(e.target.value)}
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
                            <option value='pending'>Đang chờ xử lý</option>
                            <option value='arrange'>Đang chờ sắp xếp</option>
                            <option value='accept'>Chuẩn bị phòng</option>
                            <option value='completed'>Hoàn thành</option>
                            <option value='refuse'>Đã từ chối</option>
                            <option value='canceled'>Đã hủy</option>
                        </select>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SearchSchedule;