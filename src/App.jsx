import { useState } from "react";
import AddProduct from "./components/AddProduct";
import ProductDetails from "./components/ProductDetails";
import Products from "./components/Products";
import { EditableProduct, ProductIdContext } from "./context";

export default function App() {
  const [productId, setProductId] = useState();
  const [editableProduct, setEditableProduct] = useState(null);
  return (
    <div className='flex m-2'>
      <EditableProduct.Provider value={{ editableProduct, setEditableProduct }}>
        <ProductIdContext.Provider value={{ productId, setProductId }}>
          <AddProduct />
          <Products />
          <ProductDetails />
        </ProductIdContext.Provider>
      </EditableProduct.Provider>
    </div>
  );
}
