namespace ECommerceApp.Visitors
{
    public interface IProductVisitor
    {
        void Visit(Product product);
        void Visit(ElectronicsProduct electronics);
        void Visit(ClothingProduct clothing);
    }
}
