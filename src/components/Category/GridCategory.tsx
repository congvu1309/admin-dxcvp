'use client';

import { getAllCategoryApi } from '@/api/category';
import { ROUTE } from '@/constant/enum';
import { CategoryModel } from '@/models/category';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import SearchCategory from './SearchCategory';
import { useAuth } from '@/hooks/useAuth';

const GridCategory = () => {

    const { user: currentUser, loading } = useAuth();
    const router = useRouter();
    const [categories, setCategories] = useState<CategoryModel[]>([]);
    const [searchCategory, setSearchCategory] = useState('');

    useEffect(() => {

        if (!loading && currentUser?.role !== 'R1') {
            router.push(ROUTE.NOT_FOUND);
        }

        if (currentUser?.role === 'R1') {
            const fetchCategoryData = async () => {
                try {
                    const response = await getAllCategoryApi();
                    setCategories(response.data);
                } catch (error) {
                    console.error('Failed to fetch category data', error);
                }
            };

            fetchCategoryData();
        }

    }, [loading, currentUser?.role, router]);

    const filteredCategory = categories.filter(category => {
        const matchesSearchTerm = category.title.toLowerCase().includes(searchCategory.toLowerCase());
        return matchesSearchTerm;
    });

    const handleViewDetailCategory = (categoryId: any) => {
        router.push(`${ROUTE.EDIT_CATEGORY}/${categoryId}`);
    }

    if (!loading && currentUser?.role === 'R1') {
        return (
            <>
                <div className='overflow-x-auto'>
                    <SearchCategory
                        searchCategory={searchCategory}
                        setSearchCategory={setSearchCategory}
                    />
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                        {filteredCategory && filteredCategory.length > 0 && filteredCategory.map((category) => {
                            let imageBase64 = '';
                            if (category.image) {
                                imageBase64 = Buffer.from(category.image, 'base64').toString('binary');
                            }

                            return (
                                <div
                                    key={category.id}
                                    className='border p-4 rounded-md shadow-md cursor-pointer'
                                    onClick={() => handleViewDetailCategory(category.id)}
                                >
                                    <div className='flex items-center'>
                                        <img
                                            src={imageBase64}
                                            alt={category.title}
                                            className='mt-2 rounded-md mr-7 h-12 w-12'
                                        />
                                        <h2 className='text-xl font-semibold'>{category.title}</h2>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </>
        );
    }

    return null;
}

export default GridCategory;