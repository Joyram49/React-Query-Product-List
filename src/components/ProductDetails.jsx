import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext } from "react";
import { ProductIdContext } from "../context";

const getProduct = async ({ queryKey }) => {
  const response = await axios.get(
    `http://localhost:8000/${queryKey[0]}/${queryKey[1]}`
  );
  return response.data;
};

export default function ProductDetails() {
  const { productId: id } = useContext(ProductIdContext);
  console.log(id);
  const {
    data: product,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["products", id],
    queryFn: getProduct,
    enabled: !!id,
    retry: false,
  });

  if (!id) {
    return (
      <div className='w-1/5 '>
        <h1 className='text-3xl my-2'>Product Details</h1>
        <h2>Please select a product from product list.</h2>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className='w-1/5 '>
        <h1 className='text-3xl my-2'>Product Details</h1>
        <h2>Fetching products........</h2>
      </div>
    );
  }
  if (!isLoading && error) {
    return (
      <div className='w-1/5 '>
        <h1 className='text-3xl my-2'>Product Details</h1>
        <h2>An error occured: {error.message}</h2>;
      </div>
    );
  }

  return (
    <div className='w-1/5'>
      <h1 className='text-3xl my-2'>Product Details</h1>
      <div className='border bg-gray-100  p-1 text-md rounded flex flex-col'>
        <img
          src={product.thumbnail}
          alt={product.title}
          className='object-cover  h-24 w-24 border rounded-full m-auto'
        />
        <p>{product.title}</p>
        <p>{product.description}</p>
        <p>USD {product.price}</p>
        <p>{product.rating}/5</p>
      </div>
    </div>
  );
}
