# Spectra Health — Design Direction

## Three exploratory directions

### Theme Name: Care as a Living Signal
**Very Brief Intro:** An editorial, light-filled healthcare experience where a patient’s health history becomes a warm, kinetic signal rather than a cold clinical database. It feels optimistic, articulate, and unmistakably human.

**Probability:** 0.07

### Theme Name: The Community Ledger
**Very Brief Intro:** A dignified civic-service aesthetic inspired by contemporary Indian print design, archival ledgers, and crafted stamps. It uses bold typographic composition and precise data marks to make trust visible.

**Probability:** 0.03

### Theme Name: Future Folk Medicine
**Very Brief Intro:** A playful collage system that pairs bright folk-art geometry with soft wearable-tech forms. It makes national-scale health interoperability feel approachable, celebratory, and local.

**Probability:** 0.09

---

## Chosen Direction: Care as a Living Signal

### Design Movement
**Post-digital editorial healthcare.** The experience rejects cold “command centre” dashboards and generic glassmorphism. It borrows the confidence of contemporary editorial layouts, the tactility of risograph print, and the fluid geometry of biosignals.

### Core Principles
1. **Clinical complexity, visibly tamed.** Dense data is organized as clear visual rhythm rather than endless tables and panels.
2. **Warm technology.** Identity, security, and interoperability are expressed through welcoming, high-contrast materials instead of surveillance aesthetics.
3. **Movement with meaning.** Animation indicates verification, data lineage, and transitions; it is never ambient decoration alone.
4. **Accessible visual drama.** Every non-textual cue has a text equivalent, color never carries status alone, and motion obeys reduced-motion preferences.

### Color Philosophy
The palette is a deliberate refusal of hospital blue, dark surfaces, green “success” signaling, and black. A creamy paper ground lowers cognitive load. **Signal Coral** communicates active care and critical attention; **Marigold** represents verified connection; **Rose Ink** provides deep, warm contrast for text; **Papaya** provides celebratory warmth. The result is vivid but not juvenile, and all essential text and controls maintain accessible contrast.

| Role | Token | Intent |
| --- | --- | --- |
| Signature brand color | `#E4473B` — Signal Coral | Active care, identity verified, direct action |
| Foundation | `#FFF7EF` — Clinic Paper | A calm, bright surface that avoids a clinical white void |
| Ink | `#4A1F2A` — Rose Ink | High-legibility substitute for black |
| Verification | `#D28B00` — Marigold | Confirmed, connected, trusted |
| Accent | `#F28A70` — Papaya | Hover feedback, secondary emphasis |
| Soft field | `#F6D6C8` — Blush Field | Gentle grouping and data regions |

### Layout Paradigm
The application is built as a **health ribbon**, not a centered dashboard. On desktop, a slim vertical “signal rail” anchors the left edge; the primary content unfolds across asymmetrical editorial columns. The login gateway appears as a layered ticket-stack rather than a traditional form card. The dashboard’s health record is a scrollable stream where clinical events attach to a visual timeline line, allowing the eye to read chronology before detail.

### Signature Elements
1. **The Signal Ribbon:** A coral-and-marigold animated strand which links identity, consent, providers, and records throughout the product.
2. **Artifact Cards:** Textured, slightly offset paper-like blocks with tabbed labels and deliberate clipped corners; they convey “health documents made usable.”
3. **Care Glyphs:** Small hand-drawn-style geometric marks, paired with precise mono labels, distinguish FHIR resources and participant roles.

### Interaction Philosophy
Primary actions feel like pulling a thread through a care journey: each click provides immediate visual acknowledgment, concise spoken/screen-reader status, and a visible change in the Signal Ribbon. The experience provides simple demo flows for the judges, but labels every interaction as **Prototype simulation** so no one mistakes it for real e-KYC or medical processing.

### Animation
The Signal Ribbon uses a gentle horizontal drift, then snaps into a clean confirmation knot during simulated identity verification. Panels enter with a 160–240ms opacity and 0.95-scale transition using a sharp custom ease-out. Cards lift by 2px on hover, buttons compress to 0.97 on press, and the ABHA artifact rotates only after a deliberate click. No vital sign or status animation will rely on color alone. All non-essential movement is disabled for `prefers-reduced-motion`.

### Typography System
**Bricolage Grotesque** is used for expressive headlines and section names; its human irregularity softens the technical system. **Manrope** provides high-legibility body and controls. **IBM Plex Mono** identifies ABHA values, FHIR resources, timestamps, and security metadata. Headline scale is generous and left-aligned, with short descriptions and decisive labels rather than lengthy interface copy.

### Brand Essence
**Spectra Health turns fragmented care history into an understandable, patient-controlled living record for India’s connected health ecosystem.**

Personality: **assured, human, lucid.**

### Brand Voice
Headlines are short and affirmative, while microcopy explains exactly what will happen next. The voice does not over-promise, medicalize the patient, or use generic onboarding language.

> “Your health story, finally in one signal.”

> “Share the record, not your control.”

### Wordmark & Logo
The mark is a **three-part Signal Bloom**: three rounded coral, marigold, and blush lobes intersect around a small negative-space pulse. It suggests a patient, clinician, and laboratory connected through one consented pathway. It works as an icon without requiring text. The wordmark is custom-set in Bricolage Grotesque with a split “Spectra / Health” rhythm rather than a default font treatment.

### Signature Brand Color
**Signal Coral — `#E4473B`.**
