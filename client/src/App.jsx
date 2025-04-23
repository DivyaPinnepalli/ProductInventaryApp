import { useState } from 'react';
import './App.css'
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx'

import ProductForm from './components/ProductForm.jsx'
import ProductList from './components/ProductList.jsx';
import {Link, Route, Routes, useNavigate} from 'react-router-dom'
import axios from 'axios';

function Dashboard() {
  return (
    <>
      <h2>Inventory Dashboard</h2>
      <ProductForm />
      <ProductList />
    </>
  );
}

export default function App() {

  const [user,setUser] = useState(null);
  const navigate = useNavigate();

  const handleLogin = (userData)=>{
    setUser(userData);
    axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
    navigate('/');
  }

  const handleLogout = () => {
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
    navigate('/login');
  };
  
  
  return (
    <div className="container">
      {/* header */}
      <header className="header">
        <h1>Barcode Inventory</h1>
        <nav>
          {!user ? (
            <>              
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </>
          ) : (
            <button onClick={handleLogout}>Logout</button>
          )}
        </nav>
      </header>

      {/* routing */}
      <Routes>
        <Route
          path="/"
          element={user ? <Dashboard /> : <Login onLogin={handleLogin} />}
        />
        <Route
          path="/login"
          element={<Login onLogin={handleLogin} />}
        />
        <Route
          path="/signup"
          element={<Signup onLogin={handleLogin} />}
        />
      </Routes>
      
    </div>
  );
}



// import ProductForm from './components/ProductForm.jsx'
// import ProductList from './components/ProductList.jsx';

// export default function App() {

//   return (
//     <div className="container">
//       {/* <h1>Product Inventory</h1> */}
//       <ProductForm />
//       <ProductList/>
//     </div>
//   );
// }