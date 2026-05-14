Platformă  Vânzări Online (E-commerce)

Laborator 1 - Recapitulare OOP și Principiile SOLID
Condiție:  
În cadrul acestui laborator, studenții trebuie să definească și să implementeze un set de clase utilizând conceptele fundamentale ale Programării Orientate pe Obiecte (OOP): încapsulare, moștenire și polimorfism. Fiecare clasă trebuie să respecte principiile SOLID pentru a asigura claritate, flexibilitate și întreținere ușoară a codului.
Pași de realizare:
1. Definirea structurii aplicației: Studenții vor realiza o diagramă UML de bază care descrie entitățile principale din domeniul ales și relațiile dintre acestea.
2. Implementarea claselor de bază: Se vor crea clase de bază pentru entitățile principale, utilizând moștenirea și încapsularea pentru a organiza corect datele și comportamentul obiectelor.
3. Aplicarea principiilor SOLID:
o SRP (Single Responsibility Principle): Fiecare clasă trebuie să aibă o singură responsabilitate clar definită.
o OCP (Open/Closed Principle): Clasele trebuie să fie extensibile fără a necesita modificări majore.
o LSP (Liskov Substitution Principle): Subclasele trebuie să poată înlocui clasele de bază fără a afecta funcționalitatea.
o ISP (Interface Segregation Principle): Se vor defini interfețe specifice pentru a evita impunerea unor metode inutile asupra claselor.
o DIP (Dependency Inversion Principle): Se va utiliza injecția de dependențe pentru a evita legături strânse între module.
4. Refactorizarea codului: Studenții vor analiza codul și vor aplica modificările necesare pentru a-l face mai modular și mai ușor de întreținut.
5. Prezentarea rezultatului: La final, fiecare student va explica structura codului său și modul în care a aplicat principiile OOP și SOLID.


Detalierea Principiilor SOLID 
SOLID (principii de design OOP):
1. S - Single Responsibility: O clasă = o responsabilitate și un singur motiv de schimbare.
2. O - Open/Closed: Deschis pentru extensie, închis pentru modificare
3. L - Liskov Substitution: Obiectele clasei derivate trebuie să poată înlocui cele din clasa de bază
4. I - Interface Segregation: Interfețe mici și specifice, nu mari și generale
5. D - Dependency Inversion: Depinde de abstracții, nu de implementări concrete




Laborator 2 - Paternurile de proiectare creționale: Factory Method și Abstract Factory
Condiție: 
În acest laborator, studenții vor explora și implementa două paternuri de proiectare creționale esențiale: Factory Method și Abstract Factory. Aceste paternuri sunt utilizate pentru a gestiona crearea obiectelor într-un mod flexibil, reducând dependențele dintre module și îmbunătățind scalabilitatea aplicației. Fiecare student va implementa o soluție aplicabilă domeniului ales, utilizând aceste paternuri pentru a îmbunătăți modularitatea și reutilizarea codului.
Pași de realizare:
1. Factory Method:
o Crearea unei structuri în care obiectele sunt instanțiate prin intermediul unei metode de fabrică, fără a specifica direct clasa concretă.
o Se vor defini interfețe pentru obiectele ce trebuie create și clase concrete care implementează aceste interfețe.
o Se va crea o clasă abstractă cu o metodă de fabrică ce returnează un obiect de tipul interfeței definite.
o Exemplu: Un sistem de rezervări care gestionează diferite tipuri de transport (avion, tren, autobuz) folosind o fabrică pentru a crea instanțe specifice fiecărui tip de transport.
2. Abstract Factory:
o Definirea unei interfețe pentru crearea unei familii de obiecte înrudite fără a specifica clasele concrete.
o Se va implementa o fabrică abstractă care conține metode pentru crearea mai multor tipuri de obiecte conexe.
o Se vor crea fabrici concrete care implementează interfața și returnează obiectele specifice domeniului ales.
o Exemplu: Un sistem de gestionare a interfeței utilizator (UI) care poate genera interfețe grafice pentru diferite platforme (Windows, Mac, Linux) utilizând un Abstract Factory.
3. Testare și Refactorizare:
o Implementarea testelor unitare pentru fiecare patern utilizat.
o Refactorizarea codului pentru a îmbunătăți claritatea și a reduce dependențele inutile.
4. Prezentarea rezultatului:
o Explicarea fiecărui patern implementat, beneficiile acestuia și modul în care a fost aplicat în proiect.




Factory Method- este un model de proiectare creativ care oferă o interfață pentru crearea de obiecte într-o superclasă, dar permite subclaselor să modifice tipul de obiecte care vor fi create.

-- Pentru ce este folosit Factory Method
Pe scurt:
- Este folosit pentru a separa logica de creare a obiectelor de logica de utilizare a lor.


Abstract Factory - este un model de proiectare creativ care vă permite să produceți familii de obiecte conexe 
fără a specifica clasele lor concrete.

-- Pentru ce este folosit Abstract Factory
Pe scurt: 
- Este folosit pentru a crea seturi de obiecte corelate, fără să specifici clasele concrete.

--Diferență rapidă față de Factory Method:
Factory Method → creează un singur produs
Abstract Factory → creează o familie de produse legate între ele





Laborator 3 - Paternurile de proiectare creționale: Builder, Prototype și Singleton
Condiție:
În acest laborator, studenții vor explora și implementa trei paternuri de proiectare creționale esențiale: Builder, Prototype și Singleton. Aceste paternuri sunt utilizate pentru a gestiona crearea obiectelor complexe, pentru a permite clonarea obiectelor existente și pentru a asigura existența unei singure instanțe a unei clase. Prin aplicarea acestor paternuri, studenții vor învăța să creeze obiecte într-un mod modular și eficient.
Pași de realizare:
1. Builder:
• Se va utiliza un constructor pas cu pas pentru a crea obiecte complexe, separând logica de construire de reprezentarea finală.
• Se va defini o clasă director, care gestionează procesul de construire, și una sau mai multe clase builder, care implementează pașii necesari pentru a construi obiectele.
• Se va permite personalizarea obiectelor prin metode fluente sau configurabile.
Exemplu: Un sistem de comenzi online care permite utilizatorului să creeze un produs personalizat (burger, laptop, vacanță etc.), alegând diferite opțiuni (ingrediente, specificații, accesorii).

2. Prototype:
• Se va implementa clonarea obiectelor folosind Prototype Pattern, permițând crearea de noi instanțe pe baza unui prototip existent.
• Se va defini o interfață pentru clonare, iar clasele concrete vor implementa metoda pentru a returna copii ale obiectului curent.
• Se vor gestiona copii superficiale (shallow copy) și copii profunde (deep copy) în funcție de necesitățile aplicației.
Exemplu: Un sistem de gestionare a documentelor care permite duplicarea unui document cu toate setările și conținutul inițial, permițând astfel crearea rapidă a unor variante similare.

3. Singleton:
• Se va implementa un mecanism care asigură că o clasă are o singură instanță accesibilă global.
• Se va folosi o metodă statică pentru a returna instanța unică și se va preveni crearea de noi instanțe.
• Se va gestiona sincronizarea în cazul în care aplicația rulează în medii multi-threaded.
Exemplu: Un sistem de gestionare a conexiunilor la baza de date, unde trebuie să existe o singură conexiune activă care să fie reutilizată de toate modulele aplicației.

Testare și Refactorizare:
• Implementarea testelor unitare pentru fiecare patern utilizat.
• Refactorizarea codului pentru a îmbunătăți claritatea, reducerea dependențelor inutile și îmbunătățirea reutilizării.

Prezentarea rezultatului:
• Explicarea fiecărui patern implementat, beneficiile acestuia și modul în care a fost aplicat în proiect.



Builder - este un model de proiectare creational care vă permite să construiți obiecte complexe. Modelul vă permite să produceți diferite tipuri și reprezentări ale unui obiect folosind același cod.

Prototype - este un model de proiectare creational care vă permite să copiați obiecte existente fără a face codul dependent de clasele lor.

Singleton - este un model de proiectare creational care vă permite să vă asigurați că o clasă are o singură instanță, oferind în același timp un punct de acces global la această instanță.


***Utilizarea : 

--Builder Se folosește când:
Obiectul este complex
Are mulți parametri opționali
Ordinea pașilor contează
Exemple:
Creare obiect User / Account

--Prototype Se folosește când:
Ai multe obiecte similare
Vrei copiere rapidă
Exemple:
Clonare obiecte grafice 

--Singleton Se folosește când:
Ai nevoie de o singură instanță în toată aplicația
Exemple:
DatabaseConnection


***Asemanari dintre SOLID si Singleton,Prototype,Builder : 

--Singleton
Se aseamănă cu:
SRP (Single Responsibility Principle)
→ controlează strict crearea unei singure instanțe

--Prototype
Se aseamănă cu:
OCP (Open/Closed Principle)
→ adaugi prototipuri noi fără a modifica cod existent

--Builder
Se aseamănă cu:
SRP
→ separă construcția de reprezentare




Laborator 4 - Paternurile de proiectare structurale: Adapter, Composite și Façade
Condiție:
În acest laborator, studenții vor explora și implementa trei paternuri structurale esențiale: Adapter, Composite și Façade. Aceste paternuri sunt utilizate pentru a gestiona relațiile dintre clase și pentru a îmbunătăți organizarea codului, facilitând reutilizarea și scalabilitatea aplicațiilor.

Pași de realizare:
1. Adapter:
• Se va crea un Adaptor care permite compatibilitatea între clase cu interfețe diferite.
• Se va implementa o interfață comună pe care adaptorul o va folosi pentru a transforma apelurile către clasa inițial incompatibilă.
• Se va demonstra utilizarea adaptorului într-un scenariu concret.
Exemplu: Un sistem de plăți online care trebuie să integreze diverse gateway-uri de plată cu API-uri diferite (PayPal, Stripe, Google Pay). Un Adapter va standardiza aceste interfețe pentru a facilita utilizarea lor într-un mod unitar.

2. Composite:
• Se va implementa un model ierarhic unde atât obiectele individuale, cât și colecțiile de obiecte să poată fi tratate uniform.
• Se va crea o interfață comună pentru toate obiectele din ierarhie.
• Se va implementa o clasă compusă, care conține multiple obiecte și le gestionează ca un întreg.
Exemplu: Un sistem de gestionare a meniurilor unui restaurant, unde fiecare meniu poate conține atât produse individuale (mâncare/băutură), cât și submeniuri (meniul zilei, meniuri combo).

3. Façade:
• Se va crea un Fațadă pentru a oferi o interfață simplificată către un subsistem complex.
• Se vor identifica componentele interne ale subsistemului și se va defini o clasă Façade care să intermedieze accesul la acestea.
• Se va demonstra cum Fațada simplifică utilizarea subsistemului.
Exemplu: Un sistem de rezervare hotelieră care implică mai multe servicii interne (căutare camere, verificare disponibilitate, procesare plăți, trimitere confirmări). Fațada va expune o singură metodă simplă pentru rezervarea unei camere, mascând complexitatea internă.

Testare și Refactorizare:
• Implementarea testelor unitare pentru fiecare patern utilizat.
• Refactorizarea codului pentru îmbunătățirea clarității și modularității.

Prezentarea rezultatului:
• Explicarea fiecărui patern implementat, beneficiile acestuia și modul în care a fost aplicat în proiect.




***Adaptorul este un model de proiectare structurală - permite colaborarea între obiecte cu interfețe incompatibile.

**Problema in general: 
Face ca două lucruri incompatibile să poată lucra împreună

**Problema pe care o rezolvă: Aplicația ta se așteaptă să folosească o metodă standardizată prin interfața IPaymentMethod (de exemplu, .Pay()). Însă, sistemul extern de plăți Stripe (StripePaymentAPI) are o cu totul altă structură. Adaptorul (StripePaymentAdapter) "traduce" cererea sistemului tău în formatul pe care funcția Stripe îl înțelege, fără să trebuiască să rescrii nicio logică din cele două părți.
   

***Facade este un model de proiectare structurală - care oferă o interfață simplificată pentru o bibliotecă, un cadru de lucru sau orice alt set complex de clase. 

**Problemă:
Ai un sistem complex cu multe clase și metode și e greu de folosit.
Soluția:
Creezi o clasă simplă care ascunde complexitatea și oferă o interfață ușoară.

**Problema pe care o rezolvă: 
Procesul de "Plasare a unei comenzi" implică zeci de pași logici (inițializarea produselor prin Factory, legarea plăților, înregistrarea sistemului de Bridge SMS/Email). Fațada (ECommerceFacade) ascunde tot acest "haos" de sub-sisteme în spate și îi oferă programului tău o singură metodă curată și simplă: .PlaceOrder(...). Tu apelezi doar o linie, ea se ocupă de restul.


***Compozitul este un model de proiectare structurală  care vă permite să combinați obiecte în structuri arborescente și apoi să lucrați cu aceste structuri ca și cum ar fi obiecte individuale.

Problema:
Permite să tratezi obiectele individuale și grupurile de obiecte în același mod

**Problema pe care o rezolvă: 
Permite aplicației să trateze la fel un produs izolat (un laptop) și un pachet de produse (un "Tech Bundle"). 
Datorită clasei (ProductBundle) extinzând baza, prețul sau structura se calculează și afișează automat dinamic, tratând structurile complexe exact cum tratezi un produs simplu (printr-o singură comandă).




***Bridge este un model de proiectare structurală - care permite împărțirea unei clase mari sau a unui set de clase strâns legate între ele în două ierarhii distincte — de abstractizare și de implementare — care pot fi dezvoltate independent una de cealaltă.

**Problema in general: 
Separă logica de implementare ca să le poți modifica independent

**Problema pe care o rezolvă: 
Șablonul Bridge rezolvă problema decuplând o Abstracție (ce trimitem - ex: o notificare de comandă) de Implementarea sa (cum o trimitem - ex: prin SMS sau Email), permițând ambelor ierarhii să evolueze independent.




Laborator 5 - Paternurile de proiectare structurale: Flyweight, Decorator, Bridge și Proxy
Condiție:
În acest laborator, studenții vor explora și implementa patru paternuri structurale esențiale: Flyweight, Decorator, Bridge și Proxy. Aceste paternuri sunt utilizate pentru optimizarea resurselor, extinderea funcționalităților obiectelor și controlul accesului la resurse externe.

Pași de realizare:
1. Flyweight:
• Se va implementa un mecanism de partajare a obiectelor pentru a reduce consumul de memorie.
• Se va crea o clasă centralizată care va gestiona reutilizarea instanțelor deja existente.
• Se va demonstra impactul utilizării Flyweight asupra optimizării resurselor.
Exemplu: Un editor de text care trebuie să gestioneze milioane de caractere, reducând consumul de memorie prin partajarea caracterelor comune (de exemplu, toate literele „A” dintr-un document vor referi aceeași instanță).

2. Decorator:
• Se va implementa un mecanism de extindere a funcționalităților unui obiect fără a modifica clasa acestuia.
• Se vor crea clase decorator care vor înveli obiectele de bază și vor adăuga comportamente noi dinamic.
• Se va demonstra flexibilitatea utilizării acestui patern.
Exemplu: Un sistem de notificări care permite adăugarea de noi metode de notificare (email, SMS, push notifications) fără a modifica clasa inițială a notificării.

3. Bridge:
• Se va separa abstractizarea de implementare pentru a permite schimbarea independentă a ambelor.
• Se vor defini interfețe separate pentru abstractizare și implementare, iar acestea vor fi conectate printr-un Bridge.
• Se va demonstra cum acest patern facilitează extensibilitatea.
Exemplu: Un sistem de redare media care permite separarea între tipurile de fișiere media (audio, video) și dispozitivele pe care sunt redate (telefon, tabletă, TV), fără a crea multiple clase pentru fiecare combinație posibilă.

4. Proxy:
• Se va crea un Proxy pentru a controla accesul la un obiect real, fie pentru optimizare, fie pentru securitate.
• Se vor implementa diferite tipuri de proxy: Virtual Proxy (pentru încărcare întârziată), Remote Proxy (pentru acces la resurse externe) sau Protection Proxy (pentru controlul accesului).
• Se va demonstra utilizarea unui Proxy într-un scenariu concret.
Exemplu: Un sistem de autentificare care utilizează un Proxy pentru a restricționa accesul la anumite resurse, permițând doar utilizatorilor autorizați să interacționeze cu obiectele reale.

Testare și Refactorizare:
• Implementarea testelor unitare pentru fiecare patern utilizat.
• Refactorizarea codului pentru îmbunătățirea clarității și modularității.

Prezentarea rezultatului:
• Explicarea fiecărui patern implementat, beneficiile acestuia și modul în care a fost aplicat în proiect.




1. Flyweight este un model de proiectare structurală care permite stocarea unui număr mai mare de obiecte în memoria RAM disponibilă, prin partajarea unor părți comune ale stării între mai multe obiecte, în loc să se păstreze toate datele în fiecare obiect.

Problema globală: consum mare de memorie atunci când există foarte multe obiecte similare

Ce rezolva in general:
Reduce utilizarea memoriei prin partajarea datelor comune între obiecte.

Ce rezolva in proiect:
1. Flyweight (Categoriile de produse)
Soluția în aplicație: Prin CategoryFactory, starea comună (categoria obiectelor) este instanțiată în memorie o singură dată. Orice laptop sau echipament nou generat primește o referință către acest obiect comun. Rezultatul e reutilizarea la infinit a resurselor cu efort tehnic și memorie aproape zero.




2. Decorator este un model de proiectare structurală care permite atașarea de noi comportamente la obiecte prin plasarea acestora în interiorul unor obiecte-înveliș speciale care conțin respectivele comportamente.

Problema globală: extinderea funcționalității fără a modifica codul existent
Ce rezolvă:
Permite adăugarea de comportamente noi dinamic, fără moștenire excesivă.

Ce rezolva in proiect:
2. Decorator (Opțiuni la produse - Împachetare Cadou)
În loc să lăsăm clasa de bază rigidă, i-am aplicat ProductDecorator. Putem lua din zbor produsul deja existent ("Laptop Zenbook") și să-l trecem printr-un GiftWrapDecorator(laptop). Acesta îi modifică prețul (+$15.50) și pre-actează denumirea ("Cadou") direct pe loc (la runtime), fără a fi necesar vreodată să alterăm clasa fundamentală Product.




3. Proxy este un model de proiectare structurală. Un proxy controlează accesul la obiectul original, permițându-vă să efectuați o acțiune fie înainte, fie după ce solicitarea ajunge la obiectul original.

Problema globală: controlul accesului la un obiect poate fi ineficient, nesigur.
Ce rezolvă:
Introduce un „intermediar” care controlează accesul la obiectul real.

Ce rezolva in proiect:
3. Proxy (Validarea cuponului de Reducere) - Am așezat un DiscountProxy ca și gardian virtual în fața serviciului real (RealDiscountService).
Față de utilizatorii limitați care folosesc coduri „VIP”, acesta execută Protection Proxy: le taie de la rădăcină accesul înainte să piardă resursa aplicației.
Abia când o persoană cu rol de Admin face pașii corecți, el rulează funcția de Lazy Loading, adică inițiază operațiunile grele reale doar atunci când totul este propice.




4. Bridge este un model de proiectare structurală - care permite împărțirea unei clase mari sau a unui set de clase strâns legate între ele în două ierarhii distincte — de abstractizare și de implementare — care pot fi dezvoltate independent una de cealaltă.

Problema globală:
Abstracția și implementarea sunt legate puternic → greu de modificat

Soluția:
Separă abstracția de implementare

Ce rezolva in proiect:
4. Bridge (Sistemul Media ptr. prezentări de produse) - Am "construit un pod" tehnic care separă cele două fațete total independente ca să nu se complice între ele: Abstracția (fișierul AudioMedia, VideoMedia) și Implementarea aparatului (TVDevice, PhoneDevice). Când vrei un video pe TV pur și simplu le instanțiezi dinamic: new VideoMedia(tv). Mai târziu, dacă dezvoltăm redare prin Tableta, codul pentru Audio/Video nu are nici habar că tableta s-a dezvoltat și nu va trebui rescris!





Laborator 6 - Paternurile de proiectare comportamentale: Strategy, Observer, Command, Memento și Iterator
Condiție: În acest laborator, studenții vor explora și implementa cinci paternuri comportamentale esențiale: Strategy, Observer, Command, Memento și Iterator. Aceste paternuri sunt utilizate pentru a separa logica aplicației de comportamentele specifice, oferind mai multă flexibilitate și modularitate.

Pași de realizare:
1. Strategy: 
• Se va implementa un mecanism pentru a permite alegerea și schimbarea dinamică a unui algoritm. 
• Se va defini o interfață comună pentru toate strategiile, iar clasele concrete vor implementa diferite variante ale algoritmului. 
• Se va demonstra cum utilizarea paternului Strategy permite modificarea comportamentului aplicației fără a afecta codul existent.
Exemplu: Un sistem de criptare care permite selectarea diferitelor metode de criptare (AES, RSA, SHA) fără a modifica logica existentă.

2. Observer: 
• Se va implementa un sistem în care un obiect (subiect) notifică automat mai multe obiecte dependente (observatori) despre schimbările de stare. 
• Se va crea o interfață pentru observatori și un mecanism de notificare atunci când starea subiectului se schimbă. 
• Se va demonstra utilizarea paternului Observer în aplicații ce necesită notificări asincrone sau actualizări în timp real.
Exemplu: Un sistem meteo care trimite notificări pentru schimbările de vreme către aplicațiile asociate (telefon, panouri publice, alerte).

3. Command: 
• Se va separa emiterea unei cereri de execuția efectivă a acesteia. 
• Se vor implementa comenzi care pot fi stocate și executate ulterior, inclusiv pentru funcționalități Undo/Redo.
 • Se va demonstra cum paternul Command permite gestionarea comenzilor într-un mod flexibil și extensibil.
Exemplu: Un sistem smart home care permite stocarea comenzilor de aprindere/stingere a luminilor și le execută ulterior, conform unui program.

4. Memento: 
• Se va implementa un mecanism de salvare și restaurare a stării unui obiect fără a expune detaliile interne ale acestuia. 
• Se vor crea obiecte Memento care vor salva starea unui alt obiect și o vor restaura la nevoie. 
• Se va demonstra utilizarea paternului Memento pentru funcționalități Save/Load.
Exemplu: Un editor de text care permite salvarea versiunilor anterioare ale unui document și revenirea la o versiune mai veche.

5. Iterator: 
• Se va implementa un mecanism pentru parcurgerea secvențială a unei colecții de obiecte fără a expune detaliile interne ale structurii acesteia. 
• Se va crea un iterator care va oferi metode standardizate pentru accesarea elementelor colecției. 
• Se va demonstra utilizarea paternului Iterator pentru a naviga prin colecții de date complexe fără a expune structura internă.
Exemplu: Un playlist muzical care permite navigarea prin melodii, fără a expune structura internă a listei de redare.

Testare și Refactorizare: 
• Implementarea testelor unitare pentru fiecare patern utilizat. 
• Refactorizarea codului pentru îmbunătățirea clarității și modularității.

Prezentarea rezultatului: 
• Explicarea fiecărui patern implementat, beneficiile acestuia și modul în care a fost aplicat în proiect.





1. Strategia este un model de proiectare comportamentală care vă permite să definiți o familie de algoritmi, să plasați fiecare dintre aceștia într-o clasă separată și să faceți obiectele lor interschimbabile.

Problema globală: ai mai mulți algoritmi pentru aceeași sarcină și vrei să-i schimbi dinamic fără if/else uriașe.
Ce rezolvă:
Separă algoritmii în clase diferite și îi face interschimbabili.

    Strategy Pattern (Strategia de Livrare)
Problema înainte: Dacă voiai să adaugi o metodă nouă de livrare (ex: Livrare cu Drona, Livrare la EasyBox, Ridicare din magazin) trebuia să adaugi o groază de if... else... direct în clasa Order. Acest lucru făcea clasa Order uriașă, complicată și greu de menținut.

Cum s-a rezolvat: Prin IShippingStrategy. Acum, clasa Order nici măcar nu știe cum se calculează prețul. Dacă mâine apare o metodă nouă de livrare internațională, tu doar creezi un fișier nou InternationalShippingStrategy pe care îl dai comenzii, iar clasa Order rămâne neatinsă! Păstrezi codul curat



2. Observer este un model de proiectare comportamentală care permite definirea unui mecanism de abonare pentru a notifica mai multe obiecte cu privire la orice evenimente care au loc la obiectul pe care îl observă.

Problema globală: un obiect trebuie să notifice automat alte obiecte când se schimbă.
Ce rezolvă:
Definește o relație one-to-many unde mai mulți “observatori” sunt anunțați la schimbare.

    Observer Pattern (Notificările pentru Comenzi)
Problema înainte: Când o comandă era procesată sau expediată, clasa Order trebuia să apeleze direct sistemul de Mail (SendEmail), apoi poate o notificare push pe telefon (SendPushNotification) și poate un raport pentru administrator (UpdateAdminDashboard). Clasa Order știa prea multe și făcea treabă care nu îi aparținea.

Cum s-a rezolvat: Order a devenit un (Observable). Când se schimbă starea comenzii (Status = "Expediat"), ea doar strigă în gol: „M-am schimbat!”. Toate sistemele care au nevoie de această informație (ex: CustomerNotifier, StoreAdminNotifier) se înregistrează (Abonați/Observeri) pe comandă și reacționează singure când aud strigătul.



3. Command este un model de proiectare comportamentală care transformă o solicitare într-un obiect independent care conține toate informațiile referitoare la acea solicitare. 

Problema globală: vrei să tratezi acțiunile ca obiecte (ex: undo/redo, cozi de comenzi).
Ce rezolvă:
Încapsulează o cerere într-un obiect.
    
    Command Pattern (Butoanele din Coșul de Cumpărături)
Problema înainte: Dacă un client punea un laptop în coș din greșeală sau îl ștergea și apoi se răzgândea, tu trebuia să recuperezi cumva starea prin calcule matematice sau căutări urâte în baza de date. Acțiunile erau "permanente".

Cum s-a rezolvat: Am transformat acțiunea de tipul "Adaugă/Șterge din coș" într-un pachet independent (Command). Pachetul ăsta se stochează într-un istoric. Din cauză că fiecare comandă știe să se „dez-execute” (Undo), clientul poate da acum "Undo" și aplicația dă automat la o parte ultimul produs adăugat sau repune produsul șters din greșeală, fără chin.



4. Memento este un model de proiectare comportamental care permite salvarea și restabilirea stării anterioare a unui obiect fără a dezvălui detaliile implementării sale.

Problema globală: vrei să salvezi și să restaurezi starea unui obiect fără să-i expui detaliile interne.
Ce rezolvă:
Permite “salvarea” ale stării curente obiectului.

    Memento Pattern (Păstrarea Coșului / Salvează pentru mai târziu)
Problema înainte: Ca un utilizator să poată salva coșul ca să continue cumpărăturile a doua zi, ar fi trebuit ca alte sisteme să intre abuziv în ShoppingCart, să îi fure lista internă de produse (List<Product>), lăsând structura ta de date internă expusă și vulnerabilă (se încălca încapsularea).

Cum s-a rezolvat: Doar Coșul de Cumpărături are voie să își împacheteze singur lista într-o capsulă imutabilă (CartMemento). Capsula este trimisă afară și pusă într-un dulap de amintiri (CartCaretaker). Când clientul revine a doua zi pe site, sistemul scoate capsula din dulap, o dă înapoi coșului, iar coșul știe să extragă și să restaureze starea perfect, ca și cum clientul nici nu a plecat.



5. Iteratorul este un model de proiectare comportamental care permite parcurgerea elementelor unei colecții fără a dezvălui reprezentarea sa de bază (listă, stivă, arbore etc.).

Problema globală: vrei să parcurgi o colecție fără să expui structura ei internă.
Ce rezolvă:
Oferă o metodă standard de traversare.

    Iterator Pattern (Listarea Produselor pe Pagină)
Problema înainte: Când voiai să afișezi pe ecran produsele dintr-o colecție de oferte promoționale, trebuia să expui direct lista de tip List din interiorul magazinului și să rulezi un for(int i=0). Dacă mâine decideai ca în spate, din motive de optimizare a memoriei, produsele să nu mai fie ținute într-o listă, ci într-un Arbore Binar (Tree) sau o Matrice (Array), se strica tot front-endul aplicației!

Cum s-a rezolvat: Front-endul nu mai are idee sub ce formă sunt stocate obiectele în baza ta de date. El folosește un ProductIterator și apasă efectiv un singur buton: Next(), Next(), Next()... Dacă tu schimbi în spate modul extrem de complex în care stochezi produsele, interfața web sau aplicația de mobil nici nu va simți diferența.







Laborator 7 - Paternurile de proiectare comportamentale: Chain of Responsibility, State, Mediator, Template Method și Visitor
Condiție: În acest laborator, studenții vor explora și implementa cinci paternuri comportamentale esențiale: Chain of Responsibility, State, Mediator, Template Method și Visitor. Aceste paternuri sunt utilizate pentru a îmbunătăți gestionarea fluxului de control al aplicației și pentru a simplifica interacțiunile dintre obiecte.

Pași de realizare:
1. Chain of Responsibility: 
• Se va implementa un sistem în care cererile sunt procesate într-un lanț de obiecte, fiecare având posibilitatea de a le gestiona sau de a le transmite mai departe. 
• Se vor crea clase care vor reprezenta handleri într-un lanț ierarhic, fiecare având responsabilitatea de a procesa cererea. 
• Se va demonstra cum Chain of Responsibility permite gestionarea cererilor într-un mod flexibil și scalabil.
Exemplu: Un sistem de suport tehnic unde cererile sunt analizate de diferiți specialiști (IT, asistență, etc.) în funcție de complexitatea lor.

2. State: 
• Se va implementa un mecanism în care un obiect își schimbă comportamentul în funcție de starea sa internă. 
• Se vor crea clase pentru fiecare stare, iar obiectul va trece dintr-o stare în alta pe măsură ce acțiunile se schimbă. 
• Se va demonstra cum paternul State facilitează gestionarea tranzițiilor între stări și îmbunătățește modularitatea.
Exemplu: Un automat de bilete care trece prin stările Așteaptă monede → Validează plata → Emite bilet.

3. Mediator: 
• Se va implementa un sistem în care obiectele nu vor comunica direct între ele, ci printr-un mediator centralizat. 
• Se va crea o clasă mediator care va gestiona interacțiunile dintre obiectele participante. 
• Se va demonstra cum Mediatorul reduce dependențele între obiecte și îmbunătățește organizarea aplicației.
Exemplu: Un turn de control aerian care coordonează avioanele, fără ca acestea să interacționeze direct între ele.

4. Template Method: 
• Se va implementa un algoritm general definit într-o metodă șablon, lăsând clasele derivate să implementeze pașii specifici. 
• Se vor crea clase de bază și derivate pentru a personaliza pașii algoritmului. 
• Se va demonstra cum paternul Template Method permite reutilizarea codului comun și personalizarea unor pași specifici.
Exemplu: Un sistem de generare a rapoartelor care folosește un format general stabilit, dar permite personalizarea secțiunilor raportului.

5. Visitor: 
• Se va implementa un mecanism prin care se pot adăuga noi operații asupra unui obiect fără a modifica clasa acestuia. 
• Se va crea o clasă visitor care va aplica diferite operații asupra unui set de obiecte dintr-o structură de date. 
• Se va demonstra cum paternul Visitor separă algoritmii de structura de date și îmbunătățește flexibilitatea aplicației.
Exemplu: Un sistem de export de date care permite exportarea unui document în formate diferite (PDF, CSV, XML), fără a modifica structura internă a clasei documentului.

Testare și Refactorizare: 
• Implementarea testelor unitare pentru fiecare patern utilizat. 
• Refactorizarea codului pentru îmbunătățirea clarității și modularității.

Prezentarea rezultatului: 
• Explicarea fiecărui patern implementat, beneficiile acestuia și modul în care a fost aplicat în proiect.




1. Chain of Responsibility (Lanțul de Responsabilitate)
Este un model de proiectare comportamental care permite transmiterea cererilor de-a lungul unui lanț de handleri (procesatori). Fiecare handler decide fie să proceseze cererea, fie să o paseze mai departe în lanț.

Problema globală: Evitarea cuplării directe între expeditorul unei cereri și destinatarul ei, atunci când există mai multe obiecte care ar putea procesa acea cerere. 

Ce rezolvă în proiect (Sistemul de Suport Tehnic): 
În aplicația noastră de E-commerce, clienții trimit o varietate de tichete de suport. În loc să avem o clasă masivă cu zeci de instrucțiuni if-else pentru a decide cine se ocupă de problemă, am creat un lanț decizional (Level1Support -> Level2Support -> Level3Support). 

    Când un client raportează o problemă (ex. "Eroare la plată"), cererea intră în lanț. Nivelul 1 vede că e o problemă tehnică și o pasează mai departe. Nivelul 2 o prinde și o rezolvă. Astfel, adăugarea de noi departamente de suport se face fără a modifica codul existent.

2. State (Stare)
Este un model comportamental care permite unui obiect să își modifice comportamentul atunci când starea sa internă se schimbă. Se creează impresia că obiectul și-a schimbat clasa.

Problema globală: Evitarea blocurilor mari de instrucțiuni condiționale (switch/if) care controlează comportamentul obiectului în funcție de stadiul în care se află. 

Ce rezolvă în proiect (Stările Comenzii): 
O comandă online (OrderContext) trece prin mai multe faze stricte: Nouă -> Plătită -> Expediată. Logica de business dictează că nu poți expedia o comandă neplătită și nu poți anula o comandă deja expediată. 
    
    Prin paternul State, în loc ca clasa principală să verifice manual statusul înainte de fiecare acțiune, am delegat aceste responsabilități către stări independente (NewState, PaidState, ShippedState). Dacă încerci să dai Ship() pe o comandă aflată în starea NewState, starea în sine va bloca inteligent acțiunea, protejând integritatea bazei de date.

3. Mediator (Mediator)
Este un model comportamental care reduce dependențele haotice dintre obiecte, forțându-le să colaboreze doar prin intermediul unui obiect mediator central.

Problema globală: Obiectele comunică prea mult direct între ele, și greu de reutilizat în alte contexte. 

Ce rezolvă în proiect (Sistemul de Chat Asistență): Pentru modulul de live chat al magazinului, clienții (CustomerChatUser) și agenții de suport (SupportAgentChatUser) trebuie să comunice. Dacă clientul ar apela direct clasa agentului, aplicația ar fi extrem de rigidă. 

    Am rezolvat acest lucru introducând SupportChatMediator. Nici clientul și nici agentul nu știu unul de existența tehnică a celuilalt. Ei doar trimit mesaje "în eter" prin Mediator, iar acesta se ocupă de rutarea mesajelor către participanții corecți, comportându-se ca un server central de chat.

4. Template Method (Metoda Șablon)
Este un model comportamental care definește scheletul unui algoritm în clasa de bază, dar permite subclaselor să suprascrie anumiți pași ai algoritmului, fără a schimba structura sa generală.

Problema globală: Ai mai mulți algoritmi care au o logică și un flow aproape identic, dar diferă doar la câțiva pași de implementare. 

Ce rezolvă în proiect (Generarea de Rapoarte): Managerii e-commerce-ului au nevoie de rapoarte de Vânzări (SalesReport) și de Inventar (InventoryReport). Pașii pentru orice raport sunt aceiași: Colectează datele -> Procesează datele -> Formatează raportul -> Exportă.
    
    Am definit acest schelet strict în clasa abstractă ReportGenerator. Subclasele sunt obligate să respecte ordinea de execuție stabilită (nu pot exporta înainte să proceseze), însă ele aduc propria logică doar acolo unde e necesar (ex: raportul de inventar se exportă CSV, cel de vânzări PDF). Am evitat astfel masiv duplicarea codului.

5. Visitor (Vizitator)
Este un model comportamental care îți permite să separi anumiți algoritmi de obiectele pe care aceștia operează.

Problema globală: Necesitatea de a executa o operație nouă pe o ierarhie complexă de obiecte, fără a polua clasele acelor obiecte și fără a risca să le strici funcționalitatea internă. 

Ce rezolvă în proiect (Taxe și Export Date Produse): Avem o ierarhie clară de produse: ElectronicsProduct, ClothingProduct, etc. Când contabilitatea a cerut reguli complexe de taxare (ex: 25% taxa verde la electronice, 5% la haine) și marketing-ul a cerut exportul lor în JSON/XML, nu am adăugat acele metode direct în clasele produselor (ar fi stricat principiul Single Responsibility). În schimb, produsele au implementat doar metoda Accept(Visitor). 

    Astfel, am creat sisteme externe (TaxVisitor și ExportVisitor) care se pot "plimba" prin listele noastre de produse și pot extrage ce date au nevoie, fără a modifica structura de bază a E-commerce-ului.