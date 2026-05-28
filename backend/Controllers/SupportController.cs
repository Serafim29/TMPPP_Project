using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System;
using ECommerceApp.ChainOfResponsibility;
using Npgsql;

[ApiController]
[Route("api/[controller]")]
public class SupportController : ControllerBase
{
    private readonly string _connString = "Host=localhost;Port=5433;Database=ecommerce;Username=admin;Password=password";

    [HttpPost]
    public ActionResult<object> CreateTicket([FromBody] JsonElement payload)
    {
        try
        {
            string issueType = payload.GetProperty("issueType").GetString();
            string description = payload.GetProperty("description").GetString();

            // Setup Chain of Responsibility
            SupportHandler level1 = new Level1Support();
            SupportHandler level2 = new Level2Support();
            SupportHandler level3 = new Level3Support();

            level1.SetNext(level2).SetNext(level3);

            // Execute pattern
            string resolvedBy = level1.HandleRequest(issueType, description);

            // Save to PostgreSQL
            using var conn = new NpgsqlConnection(_connString);
            conn.Open();
            using var cmd = new NpgsqlCommand("INSERT INTO support_tickets (issue_type, description, resolved_by) VALUES (@i, @d, @r) RETURNING id", conn);
            cmd.Parameters.AddWithValue("i", issueType);
            cmd.Parameters.AddWithValue("d", description);
            cmd.Parameters.AddWithValue("r", resolvedBy);
            
            int ticketId = (int)cmd.ExecuteScalar();

            return Created("", new {
                id = ticketId,
                issueType = issueType,
                description = description,
                resolvedBy = resolvedBy,
                message = "Ticket created and processed via Chain of Responsibility."
            });
        }
        catch(Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
}
