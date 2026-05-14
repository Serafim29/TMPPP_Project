using System;

public class DiscountProxy : IDiscountService
{
    private RealDiscountService _realService;
    private string _userRole;

    public DiscountProxy(string userRole)
    {
        _userRole = userRole;
    }

    public double ApplyDiscount(double originalPrice, string discountCode)
    {
        if (_userRole != "Admin" && discountCode == "VIP20")
        {
            Console.WriteLine("[DiscountProxy] Acces Respins: Doar administratorii pot aplica acest cod premium!");
            return originalPrice; 
        }

        if (_realService == null)
        {
            Console.WriteLine("[DiscountProxy] ⌛ Initializare intarziata (Lazy Load) pentru RealDiscountService...");
            _realService = new RealDiscountService();
        }

        Console.WriteLine("[DiscountProxy] Cerere aprobata. Delegare catre serviciul real...");
        return _realService.ApplyDiscount(originalPrice, discountCode);
    }
}




