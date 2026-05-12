namespace ECommerceApp.ChainOfResponsibility
{
    public class Level1Support : SupportHandler
    {
        public override void HandleRequest(string issueType, string description)
        {
            if (issueType == "Basic" || issueType == "Password Reset")
            {
                System.Console.WriteLine($"[Level 1 Support] a rezolvat problema: {description}");
            }
            else if (_nextHandler != null)
            {
                System.Console.WriteLine($"[Level 1 Support] paseaza problema '{description}' la nivelul urmator.");
                _nextHandler.HandleRequest(issueType, description);
            }
        }
    }
}
