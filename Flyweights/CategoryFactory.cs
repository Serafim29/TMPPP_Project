using System;
using System.Collections.Generic;

public class CategoryFactory
{
    private Dictionary<string, ProductCategory> _categories = new Dictionary<string, ProductCategory>();

    public ProductCategory GetCategory(string name)
    {
        if (!_categories.ContainsKey(name))
        {
            string description = $"Descriere standard pentru categoria {name}";
            string iconUrl = $"http://cdn.store.com/icons/{name.ToLower()}.png";
            
            _categories[name] = new ProductCategory(name, description, iconUrl);
        }
        else
        {
            Console.WriteLine($"[Flyweight] Reutilizam categoria existenta din memorie: {name}");
        }

        return _categories[name];
    }

    public int GetTotalCategoriesCreated()
    {
        return _categories.Count;
    }
}
