using System;

namespace ECommerceApp.Visitors
{
    public class ExportVisitor : IProductVisitor
    {
        public void Visit(Product product)
        {
            Console.WriteLine($"[Export Visitor] Export JSON: {{ \"Id\": {product.Id}, \"Name\": \"{product.Name}\", \"Price\": {product.Price} }}");
        }

        public void Visit(ElectronicsProduct electronics)
        {
            Console.WriteLine($"[Export Visitor] Export XML: <Electronic><Name>{electronics.Name}</Name><Price>{electronics.Price}</Price><Warranty>{electronics.WarrantyPeriod}</Warranty></Electronic>");
        }

        public void Visit(ClothingProduct clothing)
        {
            Console.WriteLine($"[Export Visitor] Export CSV: {clothing.Id},{clothing.Name},{clothing.Price},{clothing.Size},{clothing.Material}");
        }
    }
}
