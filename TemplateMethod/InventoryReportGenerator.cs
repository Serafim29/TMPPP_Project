namespace ECommerceApp.TemplateMethod
{
    public class InventoryReportGenerator : ReportGenerator
    {
        protected override void CollectData()
        {
            System.Console.WriteLine("[Inventory Report] Preluare cantitati de stoc din baza de date...");
        }

        protected override void ProcessData()
        {
            System.Console.WriteLine("[Inventory Report] Identificare produse cu stoc scazut...");
        }

        protected override void ExportReport()
        {
            System.Console.WriteLine("[Inventory Report] Exportare raport in format Excel (CSV).");
        }
    }
}
