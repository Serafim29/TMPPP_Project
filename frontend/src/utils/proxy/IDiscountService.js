// IDiscountService.js
// Interfata / clasa de baza pentru Serviciul de Discount

class IDiscountService {
    /**
     * Aplica o reducere
     * @param {number} originalPrice - pretul original
     * @param {string} discountCode - codul cuponului introdus
     * @returns {number} noul pret dupa reducere
     */
    applyDiscount(originalPrice, discountCode) {
        throw new Error("Metoda applyDiscount trebuie implementata");
    }
}

export default IDiscountService;
