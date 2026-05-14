namespace ECommerceApp.States
{
    public class ShippedState : IOrderState
    {
        public void Pay(OrderContext context)
        {
            System.Console.WriteLine("Comanda este deja platita si expediata.");
        }

        public void Ship(OrderContext context)
        {
            System.Console.WriteLine("Comanda este deja in tranzit.");
        }

        public void Cancel(OrderContext context)
        {
            System.Console.WriteLine("Eroare: Comanda nu mai poate fi anulata deoarece a fost deja expediata.");
        }

        public string GetStatus() => "Expediata";
    }
}
