import IDiscountService from './IDiscountService';

class RealDiscountService extends IDiscountService {
    applyDiscount(originalPrice, discountCode) {
        console.log("[RealDiscountService] Verificare si aplicare cupon...");
        
        if (discountCode === "VIP20") {
            console.log("[RealDiscountService] Reducere de 20% aplicata cu succes.");
            return { success: true, price: originalPrice * 0.80, message: "VIP20 aplicat cu succes." }; 
        }

        if (discountCode === "SALE10") {
            console.log("[RealDiscountService] Reducere de 10% aplicata cu succes.");
            return { success: true, price: originalPrice * 0.90, message: "SALE10 aplicat cu succes." };
        }

        console.log("[RealDiscountService] Cod invalid sau fara reducere.");
        return { success: false, price: originalPrice, message: "Cod invalid." };
    }
}

export default RealDiscountService;
