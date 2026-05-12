namespace ECommerceApp.TemplateMethod
{
    public abstract class ReportGenerator
    {
        public void GenerateReport()
        {
            CollectData();
            ProcessData();
            FormatReport();
            ExportReport();
        }

        protected abstract void CollectData();
        protected abstract void ProcessData();

        protected virtual void FormatReport()
        {
            System.Console.WriteLine("[Report] Formatare date in layout standard.");
        }

        protected virtual void ExportReport()
        {
            System.Console.WriteLine("[Report] Exportare raport in format PDF (implicit).");
        }
    }
}
