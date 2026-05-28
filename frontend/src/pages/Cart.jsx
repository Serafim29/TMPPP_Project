import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { standardShipping, ShippingStrategySelector } from '../utils/strategy/ShippingStrategy';
import { usePaymentAdapter, StripePaymentForm } from '../utils/adapter/StripePaymentAdapter';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [user, setUser] = useState(null);
  const [deliveryData, setDeliveryData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [shippingStrategy, setShippingStrategy] = useState(standardShipping);
  const { processPayment, isProcessing: isPaymentProcessing, error: paymentError } = usePaymentAdapter();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      navigate('/login');
      return;
    }

    try {
      setUser(JSON.parse(userData));
    } catch (e) {
      console.error(e);
    }

    const savedDelivery = localStorage.getItem('deliveryData');
    if (savedDelivery) {
      try {
        setDeliveryData(JSON.parse(savedDelivery));
      } catch (e) {
        console.error(e);
      }
    }

    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        const items = JSON.parse(storedCart);
        setCartItems(items);
        const sum = items.reduce((acc, item) => acc + (Number(item.displayPrice || item.price) * (item.quantity || 1)), 0);
        setTotal(sum);
      } catch (e) {
        console.error(e);
      }
    }
  }, [navigate]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Strategy Pattern: get shipping cost
    const shippingCost = shippingStrategy.calculate(total);
    const finalTotal = total + shippingCost;

    // Adapter Pattern: process payment first
    const paymentResult = await processPayment({ cardNumber: '4111222233334444', expiry: '12/25', cvv: '123' }, finalTotal);
    
    if (!paymentResult.success) {
      alert(`Payment failed: ${paymentResult.error}`);
      setIsProcessing(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5200/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          items: cartItems,
          total: finalTotal,
          shipping: shippingCost,
          transactionId: paymentResult.transactionId
        })
      });

      if (response.ok) {
        localStorage.removeItem('cart');
        setCartItems([]);
        setTotal(0);
        setIsProcessing(false);
        setIsSuccess(true);
        
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        alert('Failed to place order.');
        setIsProcessing(false);
      }
    } catch (err) {
      console.error(err);
      alert('Error placing order.');
      setIsProcessing(false);
    }
  };

  const removeFromCart = (indexToRemove) => {
    const updatedCart = cartItems.filter((_, idx) => idx !== indexToRemove);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    const sum = updatedCart.reduce((acc, item) => acc + (Number(item.displayPrice || item.price) * (item.quantity || 1)), 0);
    setTotal(sum);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-4xl font-extrabold text-black mb-4">Payment Successful!</h1>
        <p className="text-neutral-500 font-medium mb-8">Thank you for your purchase. We are redirecting you back to the home page...</p>
        <button onClick={() => navigate('/')} className="px-8 py-4 bg-black text-white font-bold rounded-full hover:bg-neutral-800 transition-colors">
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans selection:bg-black selection:text-white">
      {/* Simple Header */}
      <nav className="bg-white border-b border-neutral-100 py-4 px-6 md:px-12 sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <svg className="w-6 h-6 text-black" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            <span className="font-extrabold text-xl tracking-tight text-black">TechStore</span>
          </div>
          <button onClick={() => navigate(-1)} className="text-sm font-bold text-neutral-500 hover:text-black">
            Continue Shopping
          </button>
        </div>
      </nav>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Cart Items Section */}
          <div className="flex-[3]">
            <h1 className="text-3xl font-extrabold text-black mb-8">Your Cart</h1>
            
            {cartItems.length === 0 ? (
              <div className="bg-white p-12 rounded-[2rem] text-center border border-neutral-100 shadow-sm">
                <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6 text-neutral-400">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                </div>
                <h2 className="text-xl font-bold mb-2">Your cart is empty</h2>
                <p className="text-neutral-500 mb-8">Looks like you haven't added anything yet.</p>
                <button onClick={() => navigate('/')} className="px-8 py-4 bg-black text-white font-bold rounded-full hover:bg-neutral-800 transition-colors">
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-[2rem] flex flex-col md:flex-row items-center gap-6 border border-neutral-100 shadow-sm relative group">
                    <button 
                      onClick={() => removeFromCart(idx)}
                      className="absolute top-4 right-4 w-8 h-8 bg-neutral-50 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-full flex items-center justify-center transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>

                    <div className="w-32 h-32 bg-[#f5f5f4] rounded-2xl p-4 flex shrink-0 items-center justify-center">
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                    </div>
                    
                    <div className="flex-1 flex flex-col md:flex-row justify-between w-full">
                      <div className="mb-4 md:mb-0">
                        <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2 block">{item.category}</span>
                        <h3 className="font-bold text-lg text-black leading-tight mb-2 pr-8">{item.name}</h3>
                        <div className="flex gap-4 text-xs font-semibold text-neutral-500">
                          {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                          {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                        </div>
                      </div>
                      
                      <div className="flex items-end justify-between md:flex-col md:items-end">
                        <span className="font-extrabold text-2xl text-black">
                          ${Number(item.displayPrice || item.price).toFixed(2)}
                        </span>
                        <div className="flex items-center gap-4 mt-4 bg-neutral-50 px-3 py-1.5 rounded-full border border-neutral-200">
                          <button className="text-neutral-400 hover:text-black font-bold">-</button>
                          <span className="text-sm font-bold w-4 text-center">{item.quantity || 1}</span>
                          <button className="text-neutral-400 hover:text-black font-bold">+</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Checkout Form Section */}
          {cartItems.length > 0 && (
            <div className="flex-[2]">
              <div className="bg-white p-8 rounded-[2rem] border border-neutral-100 shadow-xl sticky top-24">
                <h2 className="text-2xl font-extrabold text-black mb-8">Checkout Details</h2>
                
                {!deliveryData ? (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 bg-yellow-50 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    </div>
                    <h3 className="text-lg font-bold text-black mb-2">Delivery Details Missing</h3>
                    <p className="text-sm text-neutral-500 mb-6">Please complete your delivery details in your profile to proceed with the checkout.</p>
                    <button 
                      onClick={() => navigate('/profile')}
                      className="px-6 py-3 bg-black text-white font-bold rounded-xl hover:bg-neutral-800 transition-colors"
                    >
                      Go to Profile
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handlePlaceOrder} className="space-y-6">
                    
                    {/* Shipping Summary */}
                    <div>
                      <h3 className="font-bold text-sm text-neutral-800 mb-4 uppercase tracking-wider">Shipping To</h3>
                      <div className="bg-[#fafafa] p-4 rounded-xl border border-neutral-100 flex items-start gap-4">
                        <div className="w-10 h-10 bg-neutral-200 rounded-full flex items-center justify-center shrink-0">
                          <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        </div>
                        <div>
                          <p className="font-bold text-sm text-black">{deliveryData.fullName}</p>
                          <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                            {deliveryData.address}<br />
                            {deliveryData.city}, {deliveryData.postalCode}
                          </p>
                          <button 
                            type="button"
                            onClick={() => navigate('/profile')}
                            className="text-xs font-bold text-neutral-400 hover:text-black mt-2 transition-colors"
                          >
                            Edit in Profile
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="h-px bg-neutral-100 w-full my-6"></div>

                  {/* Payment Info (Adapter Pattern) */}
                  <div>
                    <h3 className="font-bold text-sm text-neutral-800 mb-4 uppercase tracking-wider">Payment Details</h3>
                    <StripePaymentForm />
                    {paymentError && <p className="text-red-500 text-xs font-bold mt-2">{paymentError}</p>}
                  </div>

                  <div className="h-px bg-neutral-100 w-full my-6"></div>

                  {/* Strategy Pattern: Shipping Selector */}
                  <div className="mb-6">
                    <h3 className="font-bold text-sm text-neutral-800 mb-2 uppercase tracking-wider">Select Shipping</h3>
                    <ShippingStrategySelector 
                      selectedStrategy={shippingStrategy} 
                      onSelect={setShippingStrategy} 
                    />
                  </div>

                  <div className="h-px bg-neutral-100 w-full my-6"></div>

                  {/* Summary */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm font-semibold text-neutral-500">
                      <span>Subtotal</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold text-neutral-500">
                      <span>Shipping ({shippingStrategy.name})</span>
                      <span className="text-black font-bold">${shippingStrategy.calculate(total).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-extrabold text-black pt-4 border-t border-neutral-100">
                      <span>Total</span>
                      <span>${(total + shippingStrategy.calculate(total)).toFixed(2)}</span>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isProcessing || isPaymentProcessing}
                    className="w-full py-4 bg-black text-white font-bold rounded-xl hover:bg-neutral-800 transition-colors flex items-center justify-center gap-3 disabled:bg-neutral-400"
                  >
                    {(isProcessing || isPaymentProcessing) ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        Pay ${(total + shippingStrategy.calculate(total)).toFixed(2)}
                      </>
                    )}
                  </button>

                  <p className="text-[10px] text-center text-neutral-400 font-semibold mt-4">
                    By confirming this order you agree to our Terms and Conditions. Your payment is secure and encrypted.
                  </p>
                  </form>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Cart;
