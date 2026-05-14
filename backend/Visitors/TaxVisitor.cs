using System;

namespace ECommerceApp.Visitors
{
    public class TaxVisitor : IProductVisitor
    {
        public void Visit(Product product)
        {
            double tax = product.Price * 0.19; 
            Console.WriteLine($"[Tax Visitor] Produs generic '{product.Name}': Taxa este {tax}");
        }

        public void Visit(ElectronicsProduct electronics)
        {
            double tax = electronics.Price * 0.25; 
            Console.WriteLine($"[Tax Visitor] Electronice '{electronics.Name}': Taxa este {tax}");
        }

        public void Visit(ClothingProduct clothing)
        {
            double tax = clothing.Price * 0.05; 
            Console.WriteLine($"[Tax Visitor] Imbracaminte '{clothing.Name}': Taxa este {tax}");
        }
    }
}
