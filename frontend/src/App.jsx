import { Routes, Route } from 'react-router-dom';
import { NotificationProvider } from './utils/observer/NotificationContext';
import { SupportChatUI } from './utils/mediator/ChatMediator';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import Favorites from './pages/Favorites';
import AdminDashboard from './pages/AdminDashboard';
import CustomPC from './pages/CustomPC';
import Support from './pages/Support';

function App() {
  return (
    <NotificationProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/custom-pc" element={<CustomPC />} />
        <Route path="/support" element={<Support />} />
      </Routes>
      <SupportChatUI />
    </NotificationProvider>
  )
}

export default App;
