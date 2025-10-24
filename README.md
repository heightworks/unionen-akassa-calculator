# Unionen Akassa Calculator

En personlig kalkylator för att beräkna arbetslöshetsersättning från Unionen Akassa baserat på de nya reglerna som träder i kraft efter 1 oktober 2025.

## Funktioner

- **Grundberäkning**: Beräkna din månatliga akassa baserat på tidigare lön och medlemskap
- **Inkomstreduktion**: Se hur deltidsarbete påverkar din ersättning
- **Tillgänglighetsreduktion**: Beräkna reduktion för sjukdagar, resor, studier etc.
- **Scenarioplanering**: Snabbberäkning för vanliga situationer
- **Responsiv design**: Fungerar på både desktop och mobil

## Viktiga Regler (Efter Okt 2025)

### Maxbelopp
- **34,000 SEK per månad** (före skatt)

### Ersättningsgrad
- **12+ månader medlemskap**: 80% av tidigare lön
- **6-11 månader medlemskap**: 60% av tidigare lön  
- **<6 månader medlemskap**: 50% av tidigare lön

### Inkomstreduktion
- Om månadsinkomst ≥ 34,000 SEK blir akassa = 0 för den månaden
- Annars reduceras akassa proportionellt med inkomsten

### Tillgänglighet
- Varje otillgänglig dag reducerar akassa med ~1/22 av månadsbeloppet

## Användning

1. **Öppna `index.html`** i din webbläsare
2. **Fyll i grundinställningar**:
   - Tidigare månadslön
   - Medlemskap längd
   - Arbetsstatus
3. **Ange månadsdata**:
   - Månadsinkomst (om någon)
   - Dagar otillgänglig
4. **Klicka "Beräkna Akassa"** eller använd scenario-knapparna

## Vanliga Scenarier

- **Helt arbetslös**: 0 SEK inkomst, 0 otillgängliga dagar
- **Deltidsarbete**: Olika inkomstnivåer (15k, 25k SEK)
- **Sjukdagar**: 5-10 dagar otillgänglig
- **Full arbetslön**: 35k+ SEK (akassa = 0)

## Teknisk Information

- **Språk**: HTML5, CSS3, Vanilla JavaScript
- **Inga externa beroenden**: Fungerar offline
- **Kompatibilitet**: Alla moderna webbläsare
- **Responsiv**: Optimerad för mobil och desktop

## Viktiga Påminnelser

### Månadsrutiner
- **AF Aktivitetsrapport**: 1-14 varje månad
- **Akassa Månadsansökan**: Första veckan av nästa månad (senast 3 månader)

### Dokumentation
- Spara Frilans Finans fakturor per månad
- Håll Arbetsförmedlingen och Unionen konton uppdaterade
- Registrera dig på AF samma dag du blir arbetslös

## Länkar

- [Unionen Akassa - Nya regler](https://www.unionensakassa.se/nyheter/2025/03/nya-regler-for-a-kassa-fran-den-1-oktober/)
- [Unionen - Månadsansökan](https://www.unionensakassa.se/nar-du-har-ersattning/sa-fyller-du-i-din-manadsansokan-eller-tidrapport/)
- [Arbetsförmedlingen - Aktivitetsrapport](https://arbetsformedlingen.se/for-arbetssokande/arbetslos---vad-hander-nu/aktivitetsrapportera)

## Disclaimer

Denna kalkylator är för personlig användning och baserad på allmänt tillgänglig information om Unionen Akassa regler. Kontakta alltid Unionen Akassa för officiell rådgivning och bekräftelse av din specifika situation.

---

*Skapad för att hjälpa med beräkningar av arbetslöshetsersättning för säsongsarbetare inom repaccess.*
