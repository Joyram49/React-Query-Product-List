import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useContext, useState } from "react";
import { EditableProduct, ProductIdContext } from "../context";

const getProducts = async ({ queryKey }) => {
  const response = await axios.get(
    `http://localhost:8000/${queryKey[0]}?_page=${queryKey[1].page}&_per_page=5`
  );
  return response.data;
};

const deleteProduct = async (id) => {
  const response = await axios.delete(`http://localhost:8000/products/${id}`);
  return response.data;
};

export default function Products() {
  const queryClient = useQueryClient();
  const { setProductId } = useContext(ProductIdContext);
  const { setEditableProduct } = useContext(EditableProduct);
  const [page, setPage] = useState(1);
  const {
    data: products,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["products", { page }],
    queryFn: getProducts,
  });

  const mutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
    },
  });

  const deleteHandler = (id) => {
    setEditableProduct(null);
    setProductId(undefined);
    mutation.mutate(id);
  };

  if (isLoading) {
    return <div>Fetching products.....</div>;
  }
  if (!isLoading && error) {
    return <div>An error occured: {error.message}</div>;
  }

  if (mutation.isError) {
    return <span>Error: {mutation.error.message}</span>;
  }

  return (
    <div className='flex flex-col justify-center items-center w-3/5'>
      <h2 className='text-3xl my-2'>Products List</h2>
      <button
        className='px-2 py-1  bg-gray-500 text-white border cursor-pointer rounded-md self-start ml-4'
        onClick={() => setPage(1)}
      >
        Home
      </button>
      <ul className='flex flex-wrap justify-center items-center'>
        {products.data &&
          products.data.map((product) => (
            <li
              key={product.id}
              className='flex flex-col items-center m-2 border rounded-sm'
            >
              <button onClick={() => setProductId(product.id)}>
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className='object-cover w-96 h-64 rounded-sm'
                />
              </button>
              <p>{product.title}</p>
              <div className=' justify-self-center flex gap-x-4 my-3'>
                <button
                  className='px-2 py-1  bg-gray-100 border cursor-pointer rounded-md'
                  onClick={() => setEditableProduct({ ...product })}
                >
                  Edit
                </button>
                <button
                  className='px-2 py-1  bg-rose-500 text-white border cursor-pointer rounded-md'
                  disabled={mutation.isPending}
                  onClick={() => deleteHandler(product.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
      </ul>
      <div className='flex'>
        {products.prev && (
          <button
            className='p-1 mx-1 bg-gray-100 border cursor-pointer rounded-sm'
            onClick={() => setPage(products.prev)}
          >
            Prev
          </button>
        )}
        {products.next && (
          <button
            className='p-1 mx-1 bg-gray-100 border cursor-pointer rounded-sm'
            onClick={() => setPage(products.next)}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
