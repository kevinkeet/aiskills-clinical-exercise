# Coordinator workflow, Skill AI RCT

Skill AI RCT is a single-site randomized trial (Stanford IRB-86737) testing whether internal medicine residents who work a clinical case with an AI assistant acquire knowledge they can apply without it. One hundred residents are randomized one to one to an AI chat assistant or UpToDate for a 30-to-45-minute online case session, followed by a twelve-item assessment taken with no resource available. Participation is asynchronous: each resident receives an individual access code and completes the session on their own time. The platform handles randomization, the case, and scoring on its own. The coordinator runs everything around it: getting codes to residents, confirming sessions completed, paying participants, and delivering clean data for analysis.

## Access needed on day one

- The study site at learnairct.com and the admin dashboard at learnairct.com/admin. The dashboard password comes from Kevin directly; do not put it in email or shared documents.
- The recruitment materials (the program-wide invitation and the two arm-specific instruction emails) in the study folder.
- A location for the master roster, shared with Kevin only. The roster contains identities and stays separate from study data at all times.

## Enrollment

- Do not send the invitation until Kevin confirms ClinicalTrials.gov registration is complete. Enrollment before registration cannot be undone and would compromise publication.
- Export the mail-merge file from the admin dashboard. It lists the 120 pre-generated codes (P-001 through P-120) and each code's assigned arm. The code-to-arm mapping was fixed in advance by the randomization list; it is never changed and never circulated beyond the roster.
- Send the program-wide invitation. As residents opt in, assign each the next unused code and record name, email, code, arm, and date in the roster.
- Send each resident the instruction email matching their arm. The AI-arm email notes that no separate login is needed. The UpToDate-arm email tells them to sign in with their SUNet ID at the Lane Library proxy when prompted.
- A session resumes if the resident re-enters the same code in the same browser. If someone reports being locked out or losing work, escalate before resetting anything.

## Monitoring during collection

- Check the dashboard every day or two: completions by arm, and codes that started but stalled. Send one reminder to stalled participants after about a week.
- The most likely participant-facing failure is the UpToDate proxy login in the control arm. If a control-arm resident reports login trouble or a connection refusal, ask for a screenshot and escalate.
- Do not edit the case, the tasks, or the assessment items during enrollment, and do not use the content editor. The instrument is fixed by the preregistration. The editing features exist for setup and are off-limits while the study runs.
- Document the control-arm resource at study launch, midpoint, and close: sign out of any personal UpToDate account, open UpToDate through the Lane proxy, and screenshot the landing page and one search-results page. File the screenshots with the study records so the comparator interface during the study window is documented, including the presence and gating of any AI features.

## Payments

- Payment is $100 per participant, prorated for partial completion, disbursed through the Department of Medicine.
- Before releasing a payment, verify completion in the dashboard. For a partial session, note how far the participant got and calculate the prorated amount with Kevin.
- Log issuance date, amount, and method in the roster. Follow up on failed or unclaimed payments and answer participant questions about them.

## Data

- After each batch of completions, export participants, intake, task responses, assessment responses, and chat logs from the dashboard as CSV.
- Run checks on each batch: sessions started but never finished, codes used twice or never used, AI-arm participants with no chat log, assessment records with no preceding task responses. Record anything unusual, and any protocol deviations, in a running log.
- Keep the roster separate from the exports. The analysis dataset is keyed by code only and must contain nothing that identifies a resident.
- At the close of collection, assemble the final export set with the export date, any exclusions, and the deviation log, and hand it to Kevin. Keep a copy of every delivered version so the analysis can be reproduced.

## Escalate rather than fix

- Anything that would change what participants see: study content, consent text, or the AI configuration.
- Session resets or code reassignments. Both are possible from the dashboard, but each touches trial data, so Kevin decides.
- Site outages or persistent errors. An error page usually means a database problem, not something fixable from the dashboard.
- A participant asking to withdraw. They are paid prorated for what they completed, and the request is documented in the deviation log.
