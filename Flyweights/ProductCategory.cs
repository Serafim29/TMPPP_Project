using System;

public class ProductCategory
{
    public string Name { get; private set; }
    public string Description { get; private set; }
    public string SharedIconUrl { get; private set; } 

    public ProductCategory(string name, string description, string sharedIconUrl)
    {
        Name = name;
        Description = description;
        SharedIconUrl = sharedIconUrl;
        Console.WriteLine($"[Flyweight] A fost instantiata o noua categorie in memorie: {Name}");
    }

    public void DisplayCategoryInfo()
    {
        Console.WriteLine($"[Categorie: {Name} | Desc: {Description} | Icon: {SharedIconUrl}]");
    }
}
