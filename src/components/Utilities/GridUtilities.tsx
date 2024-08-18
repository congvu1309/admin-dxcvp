'use client';

import { getAllUtilitiesApi } from '@/api/utilities';
import { ROUTE } from '@/constant/enum';
import { useAuth } from '@/hooks/useAuth';
import { UtilitiesModel } from '@/models/utilities';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import SearchUtilities from './SearchUtilities';

const GridUtilities = () => {

    const { user, loading } = useAuth();
    const router = useRouter();
    const [utilities, setUtilities] = useState<UtilitiesModel[]>([]);
    const [searchUtilities, setSearchUtilities] = useState('');

    useEffect(() => {

        if (user?.role === 'R1') {
            const fetchCategoryData = async () => {
                try {
                    const response = await getAllUtilitiesApi();
                    setUtilities(response.data);
                } catch (error) {
                    console.error('Failed to fetch category data', error);
                }
            };

            fetchCategoryData();
        }

    }, [user?.role]);

    const filteredUtility = utilities.filter(utility => {
        const matchesSearchTerm = utility.title.toLowerCase().includes(searchUtilities.toLowerCase());
        return matchesSearchTerm;
    }).reverse();

    const handleViewDetailUtility = (utilityId: any) => {
        router.push(`${ROUTE.EDIT_UTILITY}/${utilityId}`);
    }

    if (!loading && user?.role === 'R1') {
        return (
            <>
                <div className='overflow-x-auto'>
                    <SearchUtilities
                        searchUtilities={searchUtilities}
                        setSearchUtilities={setSearchUtilities}
                    />
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                        {filteredUtility && filteredUtility.length > 0 && filteredUtility.map((utility) => {
                            let imageBase64 = '';
                            if (utility.image) {
                                imageBase64 = Buffer.from(utility.image, 'base64').toString('binary');
                            }

                            return (
                                <div
                                    key={utility.id}
                                    className='border p-4 rounded-md shadow-md cursor-pointer'
                                    onClick={() => handleViewDetailUtility(utility.id)}
                                >
                                    <div className='flex items-center'>
                                        <img
                                            src={imageBase64}
                                            alt={utility.title}
                                            className='mt-2 rounded-md mr-7 h-12 w-12'
                                        />
                                        <h2 className='text-xl font-semibold'>{utility.title}</h2>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </>
        );
    }
}

export default GridUtilities;