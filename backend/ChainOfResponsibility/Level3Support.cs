namespace ECommerceApp.ChainOfResponsibility
{
    public class Level3Support : SupportHandler
    {
        public override void HandleRequest(string issueType, string description)
        {
            if (issueType == "Critical" || issueType == "Refund")
            {
                System.Console.WriteLine($"[Level 3 Support (Manager)] a aprobat / rezolvat problema: {description}");
            }
            else
            {
                System.Console.WriteLine($"[Level 3 Support] Aceasta problema ('{description}') nu a putut fi rezolvata si necesita atentie speciala.");
            }
        }
    }
}
