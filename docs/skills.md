To manage skills, the aim is to have a simple way to add them into any page

##  Overview

```
<!-- Shows a skill summary with certain increments, for skill list pages -->
{{SkillSummary
|key=shared
|id=0000109
|header=[[File:Skill Master of Swimming.png]] [[Master of Swimming]]
}}
<!-- Shows all levels for a skill, for individual skill pages -->
{{SkillDetail
|key=shared
|id=0000109
|heading=[[File:Skill Master of Swimming.png]] '''Master of Swimming'''
|class=[[Buccaneer/Skills#Beginner's Basics|Beginner [Buccaneer]]], [[Corsair/Skills#Beginner's Basics|Beginner [Corsair]]], [[Cannoneer/Skills#Beginner's Basics|Beginner [Cannoneer]]]
}}
```

Both templates have the following template parameters:
- `key`: to reduce the lookup cost of skills
- `id`: the in-game skill ID
- `heading`: the page name and skill image, used for linking

The `SkillSummary` and `SkillDetail` templates pull from game data only, and should ideally only be edited by tooling. The format of this data is:

```json
{
  "2101001": {
    "name": "Meditation",
    "type": "Active",
    "reqLevel": 0,
    "masterLevel": 20,
    "description": "Temporarily enhance the Magic Attack of all party members nearby through meditation.<br />Required Skill: <span class=\"darkorange-text\">MP Eater Lv. 3</span>",
    "formula": "MP Cost: {#expr:10+floor(x/3)}, Party Member Magic ATT: +{#expr:10+x}, Duration: {#expr:40+10*x} sec"
    // more parameters
  }
  // ...
}
```

This enables:
- Quick lookup based on ID
- Single load of JSON data per-page rather than per-invoke, via Scribunto's `mw.loadJsonData`
- Description and formula are pre-parsed into wikitext to do less processing
- All data can be pulled from game files. Links and images more frequently change as pages and images are moved or renamed.
- JSON can be transformed to a Lua table relatively easily

The skill image and name are kept separate, and in the template params, because they don't come from game files.

## Class

The `class` parameter is annoying to deal with - it makes creating new pages painful since you need to do copy pasting of page names. Potentially this can be centralised, e.g.

```json
{
  "buccaneer-1": {
    "name": "Beginner (Buccaneer)",
    "link": "Buccaneer/Skills#Beginner's Basics"
  },
  "buccaneer-2": {
    "name": "Pirate (Buccaneer)",
    "link": "Buccaneer/Skills#Pirate Beginner Guide"
  }
  // ...
}
```
