using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System;
using Npgsql;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly CategoryFactory _categoryFactory;
    private readonly string _connString = "Host=localhost;Port=5433;Database=ecommerce;Username=admin;Password=password";

    public ProductsController()
    {
        _categoryFactory = new CategoryFactory();
    }

    [HttpGet]
    public ActionResult<IEnumerable<object>> GetProducts()
    {
        Logger.Instance.Log("GET /api/products request received (From DB).");

        ProductFactory electronicsFactory = new ElectronicsFactory(24);
        ProductFactory clothingFactory = new ClothingFactory("L", "Cotton");
        ProductCollection collection = new ProductCollection();
        var resultList = new List<object>();

        try 
        {
            using var conn = new NpgsqlConnection(_connString);
            conn.Open();
            using var cmd = new NpgsqlCommand("SELECT id, name, description, price, image_url, category FROM products ORDER BY id ASC", conn);
            using var reader = cmd.ExecuteReader();

            while (reader.Read())
            {
                int id = reader.GetInt32(0);
                string name = reader.GetString(1);
                string desc = reader.IsDBNull(2) ? "" : reader.GetString(2);
                double price = Convert.ToDouble(reader.GetDecimal(3));
                string img = reader.IsDBNull(4) ? "" : reader.GetString(4);
                string cat = reader.IsDBNull(5) ? "Other" : reader.GetString(5);

                Product p = cat.Contains("Music") || cat.Contains("Home") || cat.Contains("Electronic")
                    ? electronicsFactory.CreateProduct(name, price)
                    : clothingFactory.CreateProduct(name, price);

                p.Id = id;
                p.Category = _categoryFactory.GetCategory(cat);
                collection.AddProduct(p);

                resultList.Add(new { id = p.Id, name = p.Name, description = desc, price = p.Price, image_url = img, category = p.Category.Name });
            }

            // Demonstrating Iterator pattern usage
            IIterator<Product> iterator = collection.CreateIterator();
            while (iterator.HasNext()) { var p = iterator.Next(); /* pattern usage */ }

            return Ok(resultList);
        }
        catch(Exception ex) { return StatusCode(500, new { error = ex.Message }); }
    }

    [HttpGet("{id}")]
    public ActionResult<object> GetProduct(int id)
    {
        Logger.Instance.Log($"GET /api/products/{id} request received.");
        try 
        {
            using var conn = new NpgsqlConnection(_connString);
            conn.Open();
            using var cmd = new NpgsqlCommand("SELECT id, name, description, price, image_url, category FROM products WHERE id = @id", conn);
            cmd.Parameters.AddWithValue("id", id);
            using var reader = cmd.ExecuteReader();

            if (reader.Read())
            {
                Product baseProduct = new Product(reader.GetInt32(0), reader.GetString(1), Convert.ToDouble(reader.GetDecimal(3)));
                Product cloned = baseProduct.Clone(); // Prototype pattern
                return Ok(new { 
                    id = cloned.Id, name = cloned.Name, 
                    description = reader.IsDBNull(2) ? "" : reader.GetString(2), 
                    price = cloned.Price, 
                    image_url = reader.IsDBNull(4) ? "" : reader.GetString(4), 
                    category = reader.IsDBNull(5) ? "" : reader.GetString(5) 
                });
            }
            return NotFound(new { error = "Product not found" });
        }
        catch(Exception ex) { return StatusCode(500, new { error = ex.Message }); }
    }

    [HttpPost]
    public ActionResult<object> CreateProduct([FromBody] System.Text.Json.JsonElement payload)
    {
        try {
            using var conn = new NpgsqlConnection(_connString);
            conn.Open();
            using var cmd = new NpgsqlCommand("INSERT INTO products (name, description, price, image_url, category) VALUES (@n, @d, @p, @i, @c) RETURNING id", conn);
            cmd.Parameters.AddWithValue("n", payload.GetProperty("name").GetString());
            cmd.Parameters.AddWithValue("d", payload.GetProperty("description").GetString());
            cmd.Parameters.AddWithValue("p", payload.GetProperty("price").GetDecimal());
            cmd.Parameters.AddWithValue("i", payload.GetProperty("imageUrl").GetString());
            cmd.Parameters.AddWithValue("c", payload.GetProperty("category").GetString());
            int newId = (int)cmd.ExecuteScalar();
            return Created("", new { id = newId });
        }
        catch(Exception ex) { return StatusCode(500, new { error = ex.Message }); }
    }

    [HttpPut("{id}")]
    public ActionResult<object> UpdateProduct(int id, [FromBody] System.Text.Json.JsonElement payload)
    {
        try {
            using var conn = new NpgsqlConnection(_connString);
            conn.Open();
            using var cmd = new NpgsqlCommand("UPDATE products SET name=@n, description=@d, price=@p, image_url=@i, category=@c WHERE id=@id", conn);
            cmd.Parameters.AddWithValue("id", id);
            cmd.Parameters.AddWithValue("n", payload.GetProperty("name").GetString());
            cmd.Parameters.AddWithValue("d", payload.GetProperty("description").GetString());
            cmd.Parameters.AddWithValue("p", payload.GetProperty("price").GetDecimal());
            cmd.Parameters.AddWithValue("i", payload.GetProperty("imageUrl").GetString());
            cmd.Parameters.AddWithValue("c", payload.GetProperty("category").GetString());
            cmd.ExecuteNonQuery();
            return Ok(new { message = "Updated" });
        }
        catch(Exception ex) { return StatusCode(500, new { error = ex.Message }); }
    }

    [HttpDelete("{id}")]
    public ActionResult<object> DeleteProduct(int id)
    {
        try {
            using var conn = new NpgsqlConnection(_connString);
            conn.Open();
            using var cmd = new NpgsqlCommand("DELETE FROM products WHERE id=@id", conn);
            cmd.Parameters.AddWithValue("id", id);
            cmd.ExecuteNonQuery();
            return Ok(new { message = "Deleted" });
        }
        catch(Exception ex) { return StatusCode(500, new { error = ex.Message }); }
    }
}
