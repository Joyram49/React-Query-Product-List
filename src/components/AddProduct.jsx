import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { EditableProduct } from "../context";

const AddProduct = () => {
  const queryClient = useQueryClient();
  const { editableProduct } = useContext(EditableProduct);
  // const [state, setState] = useState(
  //   editableProduct || {
  //     title: "",
  //     description: "",
  //     price: 0,
  //     rating: 5,
  //     thumbnail: "",
  //   }
  // );

  const [state, setState] = useState({
    title: "",
    description: "",
    price: 0,
    rating: 5,
    thumbnail: "",
  });

  const isAdd = Object.is(editableProduct, null);

  useEffect(() => {
    if (editableProduct) {
      setState((prev) => ({
        ...prev,
        ...editableProduct,
      }));
    }
    if (isAdd) {
      setState({
        title: "",
        description: "",
        price: 0,
        rating: 5,
        thumbnail: "",
      });
    }
  }, [editableProduct, setState, isAdd]);

  // product post function
  const mutation = useMutation({
    mutationFn: (newProduct) =>
      axios.post("http://localhost:8000/products", newProduct),
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
      setState({
        ...state,
        title: "",
        description: "",
        price: 0,
        thumbnail: "",
      });
    },
  });

  const editMutation = useMutation({
    mutationFn: (nextProduct) =>
      axios.patch(
        `http://localhost:8000/products/${nextProduct.id}`,
        nextProduct
      ),
    onSuccess: () => {
      queryClient.invalidateQueries([state.id]);
    },
  });

  const handleChange = (e) => {
    const name = e.target.name;
    const value =
      e.target.type === "number" ? e.target.valueAsNumber : event.target.value;
    if (name === "price" && isNaN(value)) {
      return;
    }

    setState({ ...state, [name]: value });
  };

  const submitData = (e) => {
    e.preventDefault();
    if (isAdd) {
      const newData = { ...state, id: crypto.randomUUID().toString() };
      console.log(newData);
      mutation.mutate(newData);
    } else {
      editMutation.mutate(state);
    }
  };

  if (mutation.isLoading) {
    return <span>Submitting...</span>;
  }
  if (mutation.isError) {
    return <span>Error: {mutation.error.message}</span>;
  }

  return (
    <div className='m-2 p-2 bg-gray-100 w-1/5 h-1/2'>
      <h2 className='text-2xl my-2'>
        {isAdd ? "Add a Product" : "Edit Product"}
      </h2>
      {mutation.isSuccess && <p>Product Added!</p>}
      <form className='flex flex-col' onSubmit={submitData}>
        <input
          type='text'
          value={state.title}
          name='title'
          onChange={handleChange}
          className='my-2 border p-2 rounded'
          placeholder='Enter a product title'
        />
        <textarea
          value={state.description}
          name='description'
          onChange={handleChange}
          className='my-2 border p-2 rounded'
          placeholder='Enter a product description'
        />

        <input
          type='number'
          value={state.price}
          name='price'
          onChange={handleChange}
          className='my-2 border p-2 rounded'
          placeholder='Enter a product price'
        />
        <input
          type='text'
          value={state.thumbnail}
          name='thumbnail'
          onChange={handleChange}
          className='my-2 border p-2 rounded'
          placeholder='Enter a product thumbnail URL'
        />

        <button
          disabled={mutation.isPending}
          type='submit'
          className='bg-black m-auto text-white text-xl p-1 rounded-md'
        >
          {isAdd ? "Add" : "Edit"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
