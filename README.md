# Vaibhav Potdar — Personal Executive Launchpad

> **Vibe Coder · Professional Systems Engineer**  
> Modern, light-themed executive application launchpad engineered with seamless portrait integration, zero-DB embedded configuration, and high mobile responsiveness.

---

## 🎨 Design & Visual Engineering

1. **Seamless `#FEFEFE` Portrait Integration**:
   - The studio background of your photo (`professional-image.jpg`) was sampled at pixel level to exact studio off-white (`#FEFEFE`).
   - The entire canvas background is calibrated to `#FEFEFE`, and the image uses `mix-blend-mode: multiply` with a gentle bottom gradient fade.
   - Result: **Zero container box, zero border** — your portrait looks like a completely transparent cutout standing naturally on the page.

2. **Industry-Ready Typography**:
   - **Plus Jakarta Sans** (weights 400 to 800) — modern, architectural, and razor-sharp across retina and mobile screens.
   - **JetBrains Mono** — for metrics, system badges, and operational status indicators.

3. **Mobile-First Responsiveness**:
   - Clean, vertical stack on mobile with large, touch-accessible tap targets.
   - Fluid Bento grid (`1 column` on mobile, `2 columns` on tablet, `3 columns` on desktop).
   - Zero horizontal overflow.

4. **Untraceable & Hidden Configuration Portal**:
   - The Configuration Portal has been **completely removed from the public display, navbar, and sitemap**.
   - **Access Point 1**: A tiny, discreet lock icon next to the copyright text in the footer.
   - **Access Point 2 (Secret Shortcut)**: Press <kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> or <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> anywhere on the page to open the admin unlock modal.
   - **Credential**: Single admin password (default: `vaibhav2026`).

---

## ⚡ Quick Shortcuts

| Shortcut | Action |
| :--- | :--- |
| <kbd>⌘K</kbd> or <kbd>Ctrl+K</kbd> / <kbd>/</kbd> | Open Instant App Search / Command Palette |
| <kbd>⌘ + Shift + P</kbd> or <kbd>Ctrl + Shift + P</kbd> | Open Hidden Config Portal |
| <kbd>Enter</kbd> (in Search) | Launch selected app in a new tab |
| <kbd>Esc</kbd> | Close modal |

---

## 🚀 Running Locally

```bash
npm run dev
# Live at http://localhost:5173
```
