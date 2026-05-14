using System;

// Adaptorul asigura compatibilitatea intre interfata asteptata de sistemul nostru (IPaymentMethod)
// si implementarea complexa/incompatibila a API-ului extern (StripePaymentAPI).
public class StripePaymentAdapter : IPaymentMethod
{
    private StripePaymentAPI _stripeService;

    public StripePaymentAdapter(StripePaymentAPI stripeService)
    {
        _stripeService = stripeService;
    }

    public void Pay(double amount)
    {
        Console.WriteLine("Adaptorul preia cererea si o transforma in formatul Stripe...");
        // Transforma cererea astfel incat sa corespunda cu metoda MakePayment asteptata de Stripe
        _stripeService.MakePayment(amount, "STRIPE-VALID-1234");
    }
}
