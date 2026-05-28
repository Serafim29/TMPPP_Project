import IDiscountService from './IDiscountService';
import RealDiscountService from './RealDiscountService';

class DiscountProxy extends IDiscountService {
    constructor(userRole) {
        super();
        this.userRole = userRole;
        this.realService = null;
    }

    applyDiscount(originalPrice, discountCode) {
        if (this.userRole !== 'Admin' && discountCode === 'VIP20') {
            console.warn("[DiscountProxy] Acces Respins: Doar administratorii pot aplica acest cod premium!");
            return { price: originalPrice, success: false, message: "Acces Respins: Doar administratorii pot aplica acest cod premium!" };
        }

        if (!this.realService) {
            console.log("[DiscountProxy] ⌛ Initializare intarziata (Lazy Load) pentru RealDiscountService...");
            this.realService = new RealDiscountService();
        }

        console.log("[DiscountProxy] Cerere aprobata. Delegare catre serviciul real...");
        const result = this.realService.applyDiscount(originalPrice, discountCode);
        
        return result;
    }
}

export default DiscountProxy;
