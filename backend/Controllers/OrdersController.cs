using Microsoft.AspNetCore.Mvc;
using System;
using System.Text.Json;
using System.Collections.Generic;
using ECommerceApp.States;
using ECommerceApp.Visitors;
using ECommerceApp.TemplateMethod;
using Npgsql;
using NpgsqlTypes;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly string _connString = "Host=localhost;Port=5433;Database=ecommerce;Username=admin;Password=password";

    [HttpGet]
    public ActionResult<IEnumerable<object>> GetOrders()
    {
        try {
            using var conn = new NpgsqlConnection(_connString);
            conn.Open();
            using var cmd = new NpgsqlCommand(@"
                SELECT o.id, o.user_id, u.name as customer_name, o.total, o.status, o.created_at 
                FROM orders o 
                LEFT JOIN users u ON o.user_id = u.id
                ORDER BY o.created_at DESC", conn);
            using var reader = cmd.ExecuteReader();
            var results = new List<object>();
            while (reader.Read()) {
                results.Add(new {
                    id = reader.GetInt32(0),
                    userId = reader.GetInt32(1),
                    customerName = reader.IsDBNull(2) ? "Unknown" : reader.GetString(2),
                    total = Convert.ToDouble(reader.GetDecimal(3)),
                    status = reader.IsDBNull(4) ? "Pending" : reader.GetString(4),
                    createdAt = reader.IsDBNull(5) ? DateTime.UtcNow : reader.GetDateTime(5)
                });
            }
            return Ok(results);
        } catch (Exception ex) {
            return StatusCode(500, new { error = ex.Message });
        }
    }

    [HttpGet("report")]
    public ActionResult<object> GetReport([FromQuery] string type)
    {
        try {
            ReportGenerator generator;
            if (type == "Sales") {
                generator = new SalesReportGenerator();
                generator.GenerateReport();
                return Ok(new {
                    reportType = "Sales",
                    steps = new[] {
                        "Step 1: [Sales Report] Colectare date despre vanzarile din ultima luna...",
                        "Step 2: [Sales Report] Calculare venituri totale si taxe...",
                        "Step 3: [Sales Report] Aplicare format specific pentru raportul financiar.",
                        "Step 4: [Report] Exportare raport in format PDF (implicit)."
                    },
                    status = "Generated successfully using C# Backend Template Method Pattern!"
                });
            } else {
                generator = new InventoryReportGenerator();
                generator.GenerateReport();
                return Ok(new {
                    reportType = "Inventory",
                    steps = new[] {
                        "Step 1: [Inventory Report] Preluare cantitati de stoc din baza de date...",
                        "Step 2: [Inventory Report] Identificare produse cu stoc scazut...",
                        "Step 3: [Report] Formatare date in layout standard.",
                        "Step 4: [Inventory Report] Exportare raport in format Excel (CSV)."
                    },
                    status = "Generated successfully using C# Backend Template Method Pattern!"
                });
            }
        } catch (Exception ex) {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPost]
    public ActionResult<object> CreateOrder([FromBody] JsonElement payload)
    {
        Logger.Instance.Log("POST /api/orders request received.");

        try 
        {
            int userId = payload.GetProperty("userId").GetInt32();
            double total = payload.GetProperty("total").GetDouble();

            List<Product> orderProducts = new List<Product>();
            var items = payload.GetProperty("items").EnumerateArray();
            foreach(var item in items)
            {
                int id = item.GetProperty("id").GetInt32();
                string name = item.GetProperty("name").GetString();
                double price = item.GetProperty("price").GetDouble();
                orderProducts.Add(new Product(id, name, price));
            }

            IDiscountService discountProxy = new DiscountProxy("UserNormal"); 
            double discountedTotal = discountProxy.ApplyDiscount(total, "VIP20");

            IShoppingFactory onlineFactory = new OnlineShoppingFactory(discountedTotal > 200 ? 50 : 20);

            INotificationSender emailSender = new EmailSender();

            ECommerceFacade facade = new ECommerceFacade();
            facade.PlaceOrder(onlineFactory, orderProducts, emailSender);

            if (orderProducts.Count > 0)
            {
                IProductVisitor taxVisitor = new TaxVisitor();
                orderProducts[0].Accept(taxVisitor);
            }

            ReportGenerator salesReport = new SalesReportGenerator();
            salesReport.GenerateReport();

            string patternStatus = "Paid (Facade + Patterns Executed)";

            using var conn = new NpgsqlConnection(_connString);
            conn.Open();
            using var cmd = new NpgsqlCommand("INSERT INTO orders (user_id, items, total, status) VALUES (@u, @i, @t, @s) RETURNING id", conn);
            cmd.Parameters.AddWithValue("u", userId);
            cmd.Parameters.Add(new NpgsqlParameter("i", NpgsqlDbType.Jsonb) { Value = payload.GetProperty("items").GetRawText() });
            cmd.Parameters.AddWithValue("t", discountedTotal);
            cmd.Parameters.AddWithValue("s", patternStatus);
            int newOrderId = (int)cmd.ExecuteScalar();

            return Created("", new
            {
                id = newOrderId,
                userId = userId,
                total = discountedTotal,
                status = patternStatus,
                itemsCount = payload.GetProperty("items").GetArrayLength()
            });
        }
        catch (System.Exception ex)
        {
            Logger.Instance.Log("Error in OrdersController: " + ex.Message);
            return BadRequest(new { error = ex.Message });
        }
    }
}
