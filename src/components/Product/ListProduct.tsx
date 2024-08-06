'use client';

import { ROUTE } from "@/constant/enum";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SearchProduct from "./SearchProduct";
import { ProductModel } from "@/models/product";
import { getAllProductApiByUserId } from "@/api/product";

const ListProduct = () => {
    const { user: currentUser, loading } = useAuth();
    const router = useRouter();
    const [products, setProducts] = useState<ProductModel[]>([]);
    const [searchProduct, setSearchProduct] = useState('');

    useEffect(() => {

        if (!loading && currentUser?.role !== 'R2') {
            router.push(ROUTE.NOT_FOUND);
        }

        if (currentUser?.role === 'R2') {
            const fetchProductData = async () => {
                try {
                    const response = await getAllProductApiByUserId(currentUser.id);
                    setProducts(response.data);
                } catch (error) {
                    console.error('Failed to fetch product data', error);
                }
            };

            if (currentUser.id) {
                fetchProductData();
            }
        }

    }, [loading, currentUser?.role, currentUser?.id, router]);

    const filteredProduct = products.filter(product => {
        const matchesSearchTerm = product.title.toLowerCase().includes(searchProduct.toLowerCase());
        return matchesSearchTerm;
    });


    const handleViewDetailProduct = (productId: any) => {
        router.push(`${ROUTE.EDIT_PRODUCT}/${productId}`);
    }

    if (!loading && currentUser?.role === 'R2') {
        return (
            <>
                <div className="overflow-x-auto">
                    <SearchProduct
                        searchProduct={searchProduct}
                        setSearchProduct={setSearchProduct}
                    />
                    <div className='grid grid-cols-1 gap-4 mt-4'>
                        {filteredProduct && filteredProduct.length > 0 && filteredProduct.map((product) => {
                            let imageBase64 = '';
                            if (product.imageProductData[0].image) {
                                imageBase64 = Buffer.from(product.imageProductData[0].image, 'base64').toString('binary');
                            }
                            
                            return (
                                <div
                                    key={product.id}
                                    className='border rounded-md shadow-md cursor-pointer'
                                    onClick={() => handleViewDetailProduct(product.id)}
                                >
                                    <div className='flex items-center'>
                                        <img
                                            src={imageBase64}
                                            alt={product.title}
                                            className='rounded-md mr-7 h-auto w-[400px] bg-no-repeat bg-center bg-cover'
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

    return null;

}

export default ListProduct;