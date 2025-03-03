# TaskFlow

Ett projektarbete utvecklat i React Native för att skapa en mobil uppgiftshanteringsapplikation.

## Om projektet

TaskFlow är en mobilapplikation för uppgiftshantering som hjälper användare att organisera och följa upp sina dagliga aktiviteter. Projektet kombinerar React Native för frontend med en enkel och intuitiv användarupplevelse.

## Funktioner

- **Uppgiftshantering**: Skapa, visa och hantera uppgifter
- **Kategorisering**: Organisera uppgifter i olika kategorier
- **Användarvänligt gränssnitt**: Intuitiv design för mobila enheter
- **Statushantering**: Markera uppgifter som pågående eller slutförda

## Teknisk stack

- **Frontend**: React Native
- **Navigation**: React Navigation
- **Styling**: Native styling med StyleSheet
- **Tillståndshantering**: React Hooks (useState, useEffect)

## Installation och körning

### Förutsättningar

- Node.js (v14 eller senare)
- npm eller yarn
- Expo CLI
- iOS Simulator (för macOS) eller Android Emulator

### Steg för att komma igång

1. Klona repot
   ```bash
   git clone https://github.com/timchristoffer/TaskFlow.git
   cd TaskFlow
   ```

2. Installera beroenden
   ```bash
   npm install
   # eller
   yarn install
   ```

3. Starta utvecklingsservern
   ```bash
   expo start
   # eller
   npm start
   ```

4. Kör applikationen:
   - Tryck `i` för att öppna i iOS Simulator
   - Tryck `a` för att öppna i Android Emulator
   - Skanna QR-koden med Expo Go-appen på din mobila enhet

## Projektstruktur

```
TaskFlow/
├── assets/                # Bilder och andra statiska tillgångar
├── components/            # Återanvändbara UI-komponenter
│   ├── AddTask.js         # Komponent för att lägga till uppgifter
│   ├── Header.js          # Header-komponent för applikationen
│   ├── Task.js            # Task-komponentrepresentation
│   └── TaskList.js        # Lista av uppgifter
├── screens/               # Applikationens huvudskärmar
│   ├── HomeScreen.js      # Huvudskärm med uppgiftslista
│   └── TaskScreen.js      # Skärm för uppgiftsdetaljer
├── App.js                 # Applikationens huvudkomponent
├── app.json               # Expo-konfiguration
├── babel.config.js        # Babel-konfiguration
└── package.json           # Projektberoenden
```

## Funktionalitet under utveckling

TaskFlow är ett pågående projekt och följande funktioner är under utveckling:

- **Datalagring**: Lokal persistens med AsyncStorage
- **Notifikationer**: Påminnelser för viktiga uppgifter
- **Synkronisering**: Molnlagring för att synkronisera uppgifter mellan enheter
- **Prioritering**: Möjlighet att prioritera uppgifter

## Utvecklingsfokus

Detta projekt fokuserar på att demonstrera:
- Utveckling av mobilapplikationer med React Native
- Användarvänlig design för uppgiftshantering
- Komponentbaserad arkitektur för återanvändbar kod
- Effektiv tillståndshantering i mobila applikationer

## Användning

1. På hemskärmen visas en lista med dina uppgifter
2. Använd formuläret överst för att lägga till nya uppgifter
3. Tryck på en uppgift för att se detaljer eller redigera den
4. Svep för att markera uppgifter som slutförda eller ta bort dem

## Bidragande

Om du vill bidra till projektet, vänligen följ dessa steg:

1. Forka repositoriet
2. Skapa en feature branch (`git checkout -b feature/ny-funktion`)
3. Commit dina ändringar (`git commit -m 'Lägg till ny funktion'`)
4. Push till branchen (`git push origin feature/ny-funktion`)
5. Öppna en Pull Request

## Licens

Detta projekt är licensierat under MIT-licensen.

## Erkännanden

- React Native-communityt för dokumentation och resurser
- Expo-teamet för deras utvecklingsverktyg

---

Utvecklat av Tim, Linus och Kalle
Systemutvecklare .NET, TUC Yrkeshögskola Linköping
