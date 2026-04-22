using System;
using System.Threading;

public class RealDiscountService : IDiscountService
{
    public double ApplyDiscount(double originalPrice, string discountCode)
    {
        Console.WriteLine("[RealDiscountService] Verificare si aplicare cupon în baza de date ...");
        
        if (discountCode == "VIP20")
        {
            Console.WriteLine("[RealDiscountService] Reducere de 20% aplicata cu succes.");
            return originalPrice * 0.80; 
        }

        Console.WriteLine("[RealDiscountService] Cod invalid.");
        return originalPrice;
    }
}
