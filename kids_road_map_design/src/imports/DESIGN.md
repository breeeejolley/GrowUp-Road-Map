---
version: alpha
name: "Up — UI System"
description: "The Up UI system: a dark-first mobile banking interface built around calm, confident money management."
colors:
  # Primitive Palette
  brand-midnight: "#242430"
  brand-sunset: "#FF7A64"
  brand-sunrise: "#FFF06B"
  brand-pink: "#FF8BB5"
  brand-blue: "#4E6280"
  brand-green: "#305555"
  brand-sometimes-blue: "#3FA8F4"
  # Core Semantics
  primary: "{colors.brand-sunset}"
  accent: "{colors.brand-pink}"
  background: "{colors.brand-midnight}"
  background-darker: "#1A1A22"
  surface: "#FFFFFF"
  # Soft Card Surfaces
  surface-card-dark: "rgba(255,255,255,0.05)"
  surface-card-light: "#FBFBFA"
  surface-card-grey: "#F2F2F3"
  # Semantic States (Soft Grounds)
  surface-success: "#E4F8F2"
  surface-error: "#FDF2F2"
  surface-caution: "#FFFDF0"
  # Typography Color Scales
  text-primary-on-dark: "rgba(255,255,255,0.98)"
  text-secondary-on-dark: "rgba(255,255,255,0.6)"
  text-tertiary-on-dark: "rgba(255,255,255,0.47)"
  text-placeholder-on-dark: "rgba(255,255,255,0.2)"
  text-primary-on-light: "{colors.brand-midnight}"
  text-secondary-on-light: "rgba(36,36,48,0.6)"
  text-action: "{colors.brand-sunset}"
  text-credits: "#00BC83"
  # Action & Signaling
  success: "#00BC83"
  error: "#EF3B3D"
  caution: "{colors.brand-sunrise}"
  neutral: "#7A7A81"
  inactive: "#D2D2D2"
  # Borders
  border-on-dark: "rgba(255,255,255,0.2)"
  border-on-dark-secondary: "rgba(255,255,255,0.1)"
  border-on-light: "rgba(36,36,48,0.2)"
typography:
  fontFamily: "'Circular Std', -apple-system, BlinkMacSystemFont, sans-serif"
  fontFamilyMono: "Menlo, Monaco, 'Courier New', monospace"
  weights:
    book: 400
    medium: 500
    bold: 700
    black: 900
  styles:
    titles-huge:
      fontFamily: "{typography.fontFamily}"
      fontSize: 30
      fontWeight: "{typography.weights.book}"
      lineHeight: 36
      letterSpacing: -0.5
    titles-huge-numbers:
      fontFamily: "{typography.fontFamily}"
      fontSize: 30
      fontWeight: "{typography.weights.medium}"
      lineHeight: 36
      letterSpacing: 1
    titles-large:
      fontFamily: "{typography.fontFamily}"
      fontSize: 26
      fontWeight: "{typography.weights.book}"
      lineHeight: 31
      letterSpacing: -0.5
    titles-medium:
      fontFamily: "{typography.fontFamily}"
      fontSize: 22
      fontWeight: "{typography.weights.book}"
      lineHeight: 28
      letterSpacing: -0.5
    titles-small:
      fontFamily: "{typography.fontFamily}"
      fontSize: 18
      fontWeight: "{typography.weights.book}"
      lineHeight: 24
      letterSpacing: -0.25
    body:
      fontFamily: "{typography.fontFamily}"
      fontSize: 16
      fontWeight: "{typography.weights.book}"
      lineHeight: 24
      letterSpacing: 0
    body-small:
      fontFamily: "{typography.fontFamily}"
      fontSize: 14
      fontWeight: "{typography.weights.book}"
      lineHeight: 18
      letterSpacing: 0
    overline:
      fontFamily: "{typography.fontFamily}"
      fontSize: 10
      fontWeight: "{typography.weights.medium}"
      lineHeight: 12
      letterSpacing: 1
      textTransform: "uppercase"
spacing:
  base: 4
  xsmall: 8
  small: 12
  medium: 16
  large: 24
  xlarge: 32
  xxlarge: 64
rounded:
  small: 4
  control: 8
  card: 16
  pill: 9999
components:
  card:
    background: "{colors.surface-card-dark}"
    borderRadius: "{rounded.card}"
  button:
    background: "{colors.brand-sunset}"
    color: "{colors.brand-midnight}"
    borderRadius: "{rounded.control}"
  list-row:
    borderBottomColor: "{colors.border-on-dark-secondary}"
  toggle:
    trackColor: "{colors.success}"
    radius: "{rounded.pill}"
---

# Overview

Up makes money feel less stressful and more human. The interface has one job above all others: **reduce the cognitive load of dealing with money.** Every stylistic and engineering decision ladders up to three core principles:

1. **The canvas recedes so content can lead.** Money is the content — balances, merchants, people. The UI is the frame, not the picture.
2. **One thing matters most on every screen.** Banking apps drown people in options; Up surfaces a single focal point and focuses on a tight hierarchy of information.
3. **Warmth is functional, not decorative.** Friendliness lowers anxiety, which makes people more confident and in control of their money.

Screens share a predictable rhythm: header (back · centred title · optional action) → a hero zone for the one thing that matters → grouped content beneath uppercase overline labels → a full-width primary action pinned to the bottom of committing flows. We prioritize one focal idea per viewport and protect empty space rather than filling it.

# Colors

Color is information, not decoration. If the chrome is colorful, users cannot tell what is meaningful. The system stays near-monochrome and spends color only where it intentionally changes behavior.

*   **A Single Action Color:** Sunset (`brand-sunset`) means *"you can act here"* — buttons, links, edits. It is used sparingly so it always reads as an invitation to do something. If everything is sunset, nothing is.
*   **Money Semantics:** Green (`#00BC83`) signifies credit and positive states; red (`#EF3B3D`) signals owed amounts and errors; sunrise yellow (`#FFF06B`) acts as a caution indicator. These are learned, reassuring signals. Even warning patterns stay calm rather than alarmist.
*   **Light Surfaces for Data & Brands:** Solid white and soft light greys (`surface-card-light`) give merchant logos, bank details, and sensitive transaction info a clean ground that reads as official and trustworthy.
*   **Text Hierarchy is Opacity:** By mapping typography colors to opacity scales (`0.98 / 0.6 / 0.47`) instead of unique colors, body copy stays quiet and headings remain confident.

# Typography

The most important content in banking is almost always a number, so the typography scale is tuned to make figures glanceable and prevent screens from feeling dense or bureaucratic. A single warm geometric sans (`Circular Std`) carries the whole system.

*   **Numbers are the Hero:** Large numeric values render in `titles-huge-numbers` with an open `+1px` tracking so digits stay legible and deliberate.
*   **Tight Headings:** Alpha titles run tight tracking (`-0.25` to `-0.5px`) for a confident, human tone.
*   **Quiet Body Copy:** Body copy sits quietly at `16px` on a `24px` line height to ensure reading comfort. Group categories scan effortlessly using small, uppercase overline labels without needing heavy dividers.

# Layout

Consistent rhythm is what makes an interface feel calm. Irregular spacing reads as visual noise even when users cannot name it.

*   **The 4pt Scale:** A strict `4pt`-based scale (`4 / 8 / 12 / 16 / 24 / 32 / 64`) governs all padding, margins, and layout offsets.
*   **Grid Frameworks:** Single-column lists act as the system default. 2-up grids are reserved exclusively for browse-style content (such as merchant directories or perk cards). Generous breathing room is treated as a feature — it signals *"you have time, this is under control."*

# Elevation & Depth

Up uses physical layers instead of drop shadows to communicate surface hierarchy in its dark-first universe.

*   **Recessive Base:** Deep, dark base tones ground the system.
*   **Translucent White Layers:** Elevation is defined by translucent white fills over the dark base background (`surface-card-dark`), rather than using borders or surface shadows. This keeps visual hierarchy soft and structural.

# Shapes

Radius carries specific interface meaning scaled by structural hierarchy:

*   **Controls & Input Fields:** Standardized at `8px` (`rounded.control`) to feel structural but soft.
*   **Cards & Sheet Containers:** Standardized at `16px` (`rounded.card`) to create clear, nested containment.
*   **Interactive Controls & Indicators:** Rounded with a full `pill` radius (`rounded.pill`) for floating action elements, toggles, and user avatars.

# Components

A highly repeated component kit ensures users learn interactions once and apply them naturally across different features.

*   **Cards:** Translucent dark containers sits over the canvas for standard contextual info.
  * Pure white or light cards (`surface-card-light`) house official third-party data and brand marks.
*   **List Rows:** Built using a simple progression: leading avatar/logo → title and supporting subtitle → trailing status or numeric balance value. Separated by faint hairline dividers (`border-on-dark-secondary`) rather than individual bounding boxes.
*   **Primary Buttons:** Full-width sunset button with a dark label, pinned directly to the bottom of committing views so the committing step is always directly under the thumb. Disabled buttons fade softly instead of disappearing.
*   **Toggles & Controls:** Compact pill tracks utilizing a green active state for instant physical confirmation.
*   **Draggable Sheets:** Rounded-top cards that slide from the bottom of the viewport, letting users edit secondary attributes without breaking context or navigating away.

# Do's and Don'ts

*   **Do** use `brand-sunset` strictly for key actions, actionable links, and primary transaction values.
*   **Do** rely on translucent white fills instead of shadows and borders to communicate elevation over dark surfaces.
*   **Do** prioritize human elements (emoji, real photos, and full-color merchant logos) over generic, sterile monochrome line icons.
*   **Do** keep warnings and error screens soft and plain-spoken to lower anxiety during hard moments.

*   **Don't** push brand personality or custom animations into core navigation flows where they create latency.
*   **Don't** map `surface` to pure white in dark-themed viewports. Under dark-first screens, always opt for translucent white layers unless you are working with data heavy lists like the activity feed where more hierarchy is required.
