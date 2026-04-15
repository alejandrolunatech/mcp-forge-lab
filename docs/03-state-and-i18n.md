# State + i18n + OS Mode

## Global State

Create context:

```
AppContext:
  language: "en" | "es" | "nl"
  os: "mac" | "windows"
  setLanguage()
  setOS()
```

## Language System

Create:

```
i18n/
  en.json
  es.json
  nl.json
```

Each key example:

```
{
  "welcome": {
    "en": "Welcome Toolsmith",
    "es": "Bienvenido Forjador",
    "nl": "Welkom Bouwer"
  }
}
```

## OS Mode

* Switch UI styles:

  * Mac: rounded, soft shadows
  * Windows: sharp edges

## Hook

Create:

```
useAppSettings()
```

## UI Requirement

* Toggle language
* Toggle OS

## Output

Working language + OS switching system
