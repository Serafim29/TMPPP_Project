/**
 * TEMPLATE METHOD PATTERN (Frontend implementation)
 * Definește scheletul stabil al unui algoritm de generare a rapoartelor pe client.
 * Subclasele suprascriu pașii specifici (colectare, procesare, formatare/export),
 * dar ordinea generală rămâne neschimbată.
 */
export class FrontendReportGenerator {
  async generate(type, apiCall) {
    const steps = [];
    
    steps.push(this.collectData());
    
    steps.push(this.processData());
    
    steps.push(this.formatReport());
    
    const backendResult = await this.exportReport(type, apiCall);
    
    return {
      frontendSteps: steps,
      backendSteps: backendResult.steps,
      reportType: backendResult.reportType,
      status: backendResult.status
    };
  }

  collectData() {
    throw new Error("Metoda abstractă 'collectData' trebuie implementată de subclasă!");
  }

  processData() {
    throw new Error("Metoda abstractă 'processData' trebuie implementată de subclasă!");
  }

  formatReport() {
    return "[Frontend Template Method] Formatare date în layout implicit de sistem.";
  }

  async exportReport(type, apiCall) {
    return await apiCall(type);
  }
}

export class FrontendSalesReportGenerator extends FrontendReportGenerator {
  collectData() {
    return "[Frontend Sales Report] 1. Colectare intervale temporale pentru vânzările din ultima lună.";
  }

  processData() {
    return "[Frontend Sales Report] 2. Calculare TVA și venituri brute obținute din comenzi.";
  }

  formatReport() {
    return "[Frontend Sales Report] 3. Aplicare layout tabelar financiar cu font gras și fundal de printare.";
  }
}

export class FrontendInventoryReportGenerator extends FrontendReportGenerator {
  collectData() {
    return "[Frontend Inventory Report] 1. Interogare stocuri agregate pentru toate produsele din baza de date.";
  }

  processData() {
    return "[Frontend Inventory Report] 2. Analiză produse cu prag critic de stoc (sub 5 unități).";
  }

  async exportReport(type, apiCall) {
    console.log("[Frontend Inventory Report] Suprascriere pas de export în format CSV.");
    return await apiCall(type);
  }
}
