import ProductForm from './components/ProductForm.jsx'
import ProductList from './components/ProductList.jsx';

export default function App() {
  return (
    <div className="container">
      {/* <h1>Product Inventory</h1> */}
      <ProductForm />
      <ProductList/>
    </div>
  );
}