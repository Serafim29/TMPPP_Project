namespace ECommerceApp.TemplateMethod
{
    public class SalesReportGenerator : ReportGenerator
    {
        protected override void CollectData()
        {
            System.Console.WriteLine("[Sales Report] Colectare date despre vanzarile din ultima luna...");
        }

        protected override void ProcessData()
        {
            System.Console.WriteLine("[Sales Report] Calculare venituri totale si taxe...");
        }

        protected override void FormatReport()
        {
            System.Console.WriteLine("[Sales Report] Aplicare format specific pentru raportul financiar.");
        }
    }
}
