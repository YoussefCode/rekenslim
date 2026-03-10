# Rekenslim

## Project info

Interactieve rekenomgeving gebouwd met React + TypeScript + Vite.

## How can I edit this code?

There are several ways of editing your application.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Nieuw domein toevoegen (stap voor stap)

Wil je een nieuw domein toevoegen op basis van een eigen HTML-bestand (uitleg + oefenvragen)?
Gebruik dan deze workflow.

### 1) Kies een domein-id (slug)

Kies een korte, unieke id in kleine letters, bijvoorbeeld:

- `procenten`
- `meten`
- `kansen`

Deze id komt terug in routes zoals `/#/oefenen/<domein-id>`.

### 2) Voeg het domein toe aan de domeinkeuze

Bestand: `src/pages/Practice.tsx`

Voeg in de `domains` array een nieuw object toe met:

- `id`
- `title`
- `description`
- `icon`
- `color`

Voorbeeld:

```ts
{
	id: "meten",
	title: "Meten",
	description: "Lengte, inhoud, oppervlakte en tijd",
	icon: Ruler,
	color: "from-cyan-500 to-blue-500",
}
```

### 3) Zet je HTML-uitleg om naar sections

Bestand: `src/pages/PracticeDomain.tsx`

1. Maak een nieuwe array, bijvoorbeeld `const metenSections: Section[] = [...]`.
2. Elke HTML-sectie wordt één object:
	 - `id`: korte anchor (bijv. `basis`, `formules`, `oefenen`)
	 - `title`: titel van die sectie
	 - `content`: JSX-inhoud
3. Gebruik bestaande UI-blokken voor consistente stijl:
	 - `ExampleBox`
	 - `TipBox`
	 - `WarnBox`
	 - `NoteBox`
	 - `SimpleTable`

### 4) Koppel je sections aan `domainData`

In hetzelfde bestand (`src/pages/PracticeDomain.tsx`) voeg je in `domainData` je nieuwe key toe:

```ts
meten: {
	title: "Rekenslim: Meten",
	subtitle: "Lengte • Oppervlakte • Inhoud • Tijd",
	gradient: "from-cyan-600 to-blue-600",
	sections: metenSections,
},
```

### 5) Voeg de oefenvragen toe

Bestand: `src/pages/PracticeQuestions.tsx`

Voeg in `questionsByDomain` een nieuwe key toe met jouw domein-id, bijvoorbeeld:

```ts
meten: [
	{
		title: "Meten",
		description: "Eenheden omrekenen en toepassen",
		items: [
			{ q: "1. 2,5 m = ... cm", a: 250, exp: "1 m = 100 cm, dus 2,5 m = 250 cm." },
		],
	},
],
```

Per vraag gebruik je:

- `q`: de vraag
- `a`: het juiste antwoord (nummer of ratio-string zoals `"3:2"`)
- `exp`: korte uitleg

### 6) Routing (belangrijk)

De app gebruikt `HashRouter`.
Dat betekent dat directe links en refresh werken via URLs met `#`, zoals:

- `/#/oefenen/meten`
- `/#/oefenen/meten/vragen`
