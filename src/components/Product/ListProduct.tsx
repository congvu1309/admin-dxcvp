'use client';

import { ROUTE } from "@/constant/enum";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SearchProduct from "./SearchProduct";
import { ProductModel } from "@/models/product";
import { getAllProductApi } from "@/api/product";
import defaultImage from '@/public/no-image.jpg';
import Image from 'next/image';

const ListProduct = () => {
    
    const { user, loading } = useAuth();
    const router = useRouter();
    const [products, setProducts] = useState<ProductModel[]>([]);
    const [searchProduct, setSearchProduct] = useState('');

    useEffect(() => {

        if (user?.role === 'R2') {
            const fetchProductData = async () => {
                try {
                    const response = await getAllProductApi(user.id);
                    setProducts(response.data);
                } catch (error) {
                    console.error('Failed to fetch product data', error);
                }
            };

            if (user.id) {
                fetchProductData();
            }
        }

    }, [user?.role, user?.id]);

    const filteredProduct = products
        .filter(product => product.status === 'S1')
        .filter(product => {
            const matchesSearchTerm = product.title.toLowerCase().includes(searchProduct.toLowerCase());
            return matchesSearchTerm;
        }).reverse();

    const handleViewDetailProduct = (productId: any) => {
        router.push(`${ROUTE.EDIT_PRODUCT}/${productId}`);
    }

    if (!loading && user?.role === 'R2') {
        return (
            <>
                <div className="overflow-x-auto">
                    <SearchProduct
                        searchProduct={searchProduct}
                        setSearchProduct={setSearchProduct}
                    />
                    <div className='grid grid-cols-1 gap-4 mt-4'>
                        {filteredProduct?.length > 0 && filteredProduct.map((product) => {
                            let imageSrc = defaultImage.src;
                            const imageProductData = product.imageProductData?.[0];

                            if (imageProductData?.image) {
                                try {
                                    imageSrc = Buffer.from(imageProductData.image, 'base64').toString('binary');
                                } catch (error) {
                                    imageSrc = defaultImage.src;
                                }
                            }

                            return (
                                <div
                                    key={product.id}
                                    className='border rounded-md shadow-md cursor-pointer'
                                    onClick={() => handleViewDetailProduct(product.id)}
                                >
                                    <div className='flex items-center'>
                                        <Image
                                            src={imageSrc}
                                            alt={product.title}
                                            width={400}
                                            height={400}
                                            className='rounded-md mr-7 bg-no-repeat bg-center bg-cover'
                                        />
                                        <h2 className='text-xl font-semibold'>{product.title}</h2>
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

export default ListProduct;