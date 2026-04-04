# Domain Registry

Tracks known life domains, their synonyms/aliases, and routing rules. Customize these domains to match your life.

---

## Active Domains

### health
- **Folder:** `life/health/`
- **Synonyms:** medical, doctor, exercise, fitness, sleep, diet, nutrition, wellness, mental health, therapy, medication, pain, symptoms, body, weight, running, gym, dentist, physical
- **Covers:** Physical health, mental health, medical appointments, exercise, sleep, diet, chronic conditions, prescriptions

### family
- **Folder:** `life/family/`
- **Synonyms:** wife, kids, parents, siblings, relatives, spouse, partner, children, son, daughter, mom, dad, in-laws, extended family, home life
- **Covers:** Family relationships, family events, parenting, family decisions, family obligations, holidays with family

### finances
- **Folder:** `life/finances/`
- **Synonyms:** money, budget, savings, investments, bills, taxes, mortgage, debt, insurance, retirement, spending, income, salary, expenses, financial
- **Covers:** Budgeting, investments, bills, taxes, major purchases, financial planning, insurance, retirement planning

### home
- **Folder:** `life/home/`
- **Synonyms:** house, apartment, property, maintenance, repair, renovation, yard, garden, cleaning, furniture, appliances, neighborhood, landlord, HOA
- **Covers:** Home maintenance, repairs, renovations, household management, property, moving, furniture, yard work

### career
- **Folder:** `life/career/`
- **Synonyms:** work, job, professional, office, colleagues, manager, boss, promotion, salary, project, meeting, deadline, work-life balance, side project, freelance, indie, business
- **Covers:** Day job, side projects, professional development, work relationships, career decisions, business ideas

### learning
- **Folder:** `life/learning/`
- **Synonyms:** course, class, book, reading, study, tutorial, skill, training, education, certification, conference, workshop, research
- **Covers:** Courses, books, skills being developed, certifications, conferences, self-education, research topics

---

## Domain Creation Rules

**Threshold for new domain:** 3+ mentions in separate dumps OR explicit user confirmation

Before creating a new domain:
1. Check if it overlaps with an existing domain
2. If overlap exists, route to existing domain + add synonym to this registry
3. If truly new, create folder under `life/`, add entry here, confirm with user

**Examples of overlap to catch:**
- "social" overlaps with family (family social events) and career (work social events) -- don't create
- "travel" could be its own domain if it becomes frequent, but start by routing to the relevant domain (family vacation -> family, business trip -> career)
- "pets" would go under family unless it becomes very active

---

## Domain Activity Tracking

Updated during monthly/quarterly reviews:

| Domain | Last Capture | File Count | Notes |
|--------|-------------|-----------|-------|
| health | -- | 0 | -- |
| family | -- | 0 | -- |
| finances | -- | 0 | -- |
| home | -- | 0 | -- |
| career | -- | 0 | -- |
| learning | -- | 0 | -- |
