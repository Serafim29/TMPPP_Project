using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System;
using Npgsql;

[ApiController]
[Route("api/[controller]")]
public class CustomPCController : ControllerBase
{
    private readonly string _connString = "Host=localhost;Port=5433;Database=ecommerce;Username=admin;Password=password";

    [HttpPost]
    public ActionResult<object> BuildPC([FromBody] JsonElement payload)
    {
        try
        {
            string cpu = payload.GetProperty("cpu").GetString();
            string ram = payload.GetProperty("ram").GetString();
            string gpu = payload.GetProperty("gpu").GetString();

            // Execute Builder Pattern
            CustomPCBuilder builder = new CustomPCBuilder();
            CustomPC myPC = builder.SetCPU(cpu).SetRAM(ram).SetGPU(gpu).Build();

            string description = myPC.ToString();
            string img = "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&q=80&w=1000";

            // Save new product in DB so the user can buy it!
            using var conn = new NpgsqlConnection(_connString);
            conn.Open();
            using var cmd = new NpgsqlCommand("INSERT INTO products (name, description, price, image_url, category) VALUES (@n, @d, @p, @i, @c) RETURNING id", conn);
            cmd.Parameters.AddWithValue("n", myPC.Name);
            cmd.Parameters.AddWithValue("d", description);
            cmd.Parameters.AddWithValue("p", (decimal)myPC.Price);
            cmd.Parameters.AddWithValue("i", img);
            cmd.Parameters.AddWithValue("c", "For Home");
            
            int newId = (int)cmd.ExecuteScalar();

            return Created("", new {
                id = newId,
                name = myPC.Name,
                description = description,
                price = myPC.Price,
                message = "Custom PC built successfully using Builder Pattern and saved to DB!"
            });
        }
        catch(Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
}
