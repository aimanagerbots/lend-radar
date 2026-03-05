---
name: elite-frontend-ux
description: Create distinctive, production-grade interfaces that combine bold aesthetics with systematic UX excellence. Every output must be visually striking AND functionally flawless. Use when building dashboards, SaaS pages, landing pages, or any web UI requiring WCAG accessibility, design tokens, and Tailwind/React best practices.
---

Create distinctive, production-grade interfaces that combine bold aesthetics with systematic UX excellence. Every output must be visually striking AND functionally flawless.

## 1. Design Philosophy

Before writing code, commit to a clear direction:

**Context Analysis:**
- WHO uses this? (persona, expertise level, device context)
- WHAT action should they take? (single primary goal)
- WHY should they trust/engage? (value proposition)

**Aesthetic Commitment:**
Choose and COMMIT to a bold direction. Timid design fails.

**The Memorability Test:** What ONE thing will users remember? If you can't answer this, the design lacks focus.

## 2. Design Token System

Use systematic values. Never eyeball spacing or pick arbitrary colors.

### Typography Scale
- xs: 0.75rem (12px) | sm: 0.875rem (14px) | base: 1rem (16px) | lg: 1.125rem (18px)
- xl: 1.25rem (20px) | 2xl: 1.5rem (24px) | 3xl: 2rem (32px) | 4xl: 2.5rem (40px) | 5xl: 3.5rem (56px)

**Rules:** Line height 1.5-1.6 body, 1.1-1.2 headings. Max 45-75 chars line length. Max 2-3 typefaces.
NEVER use Inter, Roboto, Arial as primary fonts.

### Spacing Scale (8px base)
0 | 4px | 8px | 12px | 16px | 20px | 24px | 32px | 40px | 48px | 64px | 80px | 96px | 128px

Section gaps: 80-120px between major landing page sections.

### Color Rules
- 60-30-10 ratio: 60% dominant, 30% secondary, 10% accent
- ONE bold accent color maximum
- NEVER purple gradients on white (AI cliche)

### Animation Timing
- instant: 50ms | fast: 100ms | normal: 200ms | slow: 300ms | slower: 500ms
- Button feedback: 100-150ms (must feel instantaneous)
- ONLY animate transform and opacity (GPU accelerated)
- NEVER animate width, height, margin, padding (triggers reflow)
- Respect prefers-reduced-motion

## 3. Accessibility Requirements (Non-Negotiable)

### Color Contrast (WCAG 2.1 AA)
- Body text: 4.5:1 | Large text (18pt+): 3:1 | UI components/icons: 3:1 | Focus indicators: 3:1

### Touch Targets
- Minimum: 44x44px | Minimum spacing: 8px between adjacent targets

### Interactive Elements
- ALL interactive elements MUST have visible focus states
- NEVER use outline: none without a replacement
- Tab order must be logical

### Forms
- Every input MUST have an associated label (not just placeholder)
- Error messages must be programmatically associated (aria-describedby)
- Don't disable submit buttons before user attempts submission

### Semantic HTML
Use button for actions, a for navigation. Never div onclick. First rule of ARIA: Don't use ARIA if native HTML works.

## 4. SaaS Dashboard Patterns

### Layout Architecture
Top Bar (56-64px) + Sidebar (240-280px, collapsed 64-80px) + Main Content

### Navigation Guidelines
- 10+ sections: Collapsible sidebar | 3-6: Top nav | Secondary: Tabs (max 6) | Deep: Breadcrumbs

### Dashboard Content Hierarchy
1. Value-first metrics: "You saved 4 hours" > raw numbers
2. Actionable insights: What should user do next?
3. Progressive disclosure: Summary then detail on demand

### Empty States
Always: icon + title + description + action button. Never just "No data".

### Toast Timing
Default 4-5s. Min for accessibility: 6s. Formula: 500ms per word + 3s base.

## 5. Landing Page Patterns

### Above-the-Fold
Must contain: clear headline (5-10 words), value proposition subhead, single primary CTA, visual element.

### CTA Buttons
Min 44px height, padding 2x font size. Action verbs, first-person. 2-5 words max. One primary CTA per viewport.

### Pricing Tables
3-4 tiers max. Highlight recommended. Annual/monthly toggle. Checkmarks for scanning. CTA on every tier.

### Forms
Single column (120% fewer errors). Minimize fields. Labels above inputs. Validate on blur, not while typing.

## 6. Tailwind CSS Best Practices

### Required: cn() helper
Always use for conditional classes with clsx + tailwind-merge.

### NEVER Dynamic Class Names
No bg-${color}-500. Use object maps instead.

### CVA for Component Variants
Use class-variance-authority for systematic variant management.

### Mobile-First
Base styles are mobile, layer up with sm/md/lg/xl/2xl breakpoints.

## 7. React Component Patterns

### Compound Components over Prop Soup
Use composition (Tabs > TabsList > TabsTrigger) not config objects.

### Loading States
Skeleton screens > spinners. Use animate-pulse with bg-muted.

### Reduced Motion
Always check prefers-reduced-motion.

## 8. Anti-Patterns (NEVER DO)

### Visual
- Purple/blue gradients on white | Inter/Roboto/Arial as display | Inconsistent border-radius
- More than 3 font weights | Rainbow colors without purpose

### UX
- Confirmshaming | Pre-selected options benefiting company | Infinite scroll without pagination
- Disabled submit before attempt | Placeholder as labels

### Technical
- outline: none without focus replacement | div onclick | Dynamic Tailwind classes
- Animating layout properties | Missing alt text | Forms without labels

### Mobile
- Touch targets < 44x44px | Body text < 16px | Horizontal scroll | No tap feedback

## 9. Pre-Delivery Checklist

### Accessibility
- [ ] Contrast >= 4.5:1 text / 3:1 UI
- [ ] Touch targets >= 44x44px
- [ ] All images have alt | All fields have label
- [ ] Visible focus states | No color-only info

### Visual
- [ ] Clear typographic hierarchy (3-5 levels)
- [ ] Consistent spacing from token scale
- [ ] Max 2-3 typefaces | Cohesive palette (60-30-10)
- [ ] ONE memorable design element

### Technical
- [ ] Mobile-first responsive
- [ ] Animations use only transform/opacity
- [ ] No dynamic Tailwind classes | Uses cn()
- [ ] Dark mode via CSS variables | prefers-reduced-motion respected

### UX Integrity
- [ ] Single primary goal per page | No dark patterns
- [ ] Error states are helpful | Loading states exist
