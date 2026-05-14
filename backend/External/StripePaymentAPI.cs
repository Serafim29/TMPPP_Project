using System;

// Simulam un serviciu extern de plati care are o interfata complet diferita (Incompatibila cu IPaymentMethod)
public class StripePaymentAPI
{
    public void MakePayment(double sum, string validationCode)
    {
        Console.WriteLine($"[Stripe API] Procesare plata de {sum} Lei. Cod de validare: {validationCode}");
        Logger.Instance.Log($"Stripe a procesat plata cu succes pentru suma de {sum}.");
    }
}
