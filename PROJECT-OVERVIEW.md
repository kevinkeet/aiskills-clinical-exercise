Skill AI RCT is a single-site randomized controlled trial testing whether internal medicine residents who work a clinical case with an AI assistant acquire knowledge they can apply without it. Residents at the Stanford internal medicine residency (PGY-1 through PGY-3, categorical and preliminary) are randomized one to one to work an identical clinical case with either an embedded AI chat assistant or UpToDate, and then complete the same knowledge assessment with no resource available. Target enrollment is 100 residents, 50 per arm. The study is approved as exempt under Stanford IRB-86737 and preregistered on the Open Science Framework; ClinicalTrials.gov registration is in process and must be completed before the first participant enrolls.

The primary outcome is a 12-item multiple-choice assessment administered immediately after the case with no resource available, so that it measures what the resident retained rather than how they performed with help. The case is a fictional 32-year-old man with progressive chronic kidney disease consistent with Fabry disease, chosen because the diagnosis lies outside most residents' existing knowledge. Residents work through five sequential free-response tasks covering history, physical examination, diagnostic workup, management, and after-visit instructions, with additional workup findings released at the management task. The AI arm uses Anthropic Claude Opus 4.7 with no system prompt, so the intervention is a generic assistant rather than a tutor built for the study; the control arm uses UpToDate through the Stanford Lane Library proxy. The platform records each resident's free-text responses, per-task timing, assessment answers, and the full text of every AI conversation, so the trial measures both what residents learned and the process by which they and the AI arrived at it. Secondary outcomes are the change in self-rated comfort with Fabry disease, asked identically before and after, and time on task. A pre-specified exploratory analysis codes the AI conversations as cognitively engaged or offloading and relates the pattern to the assessment score.

Enrollment is asynchronous rather than scheduled into protected time. Each resident receives an individual access code that maps server-side to a pre-assigned arm and completes the session on a laptop or desktop at a time of their choosing. The session takes approximately 30 to 45 minutes and resumes where the participant left off if the same code is re-entered in the same browser. One hundred twenty codes are pre-generated, which allows for non-response and replacement. Recruitment runs by program-wide email, followed by an individual email carrying the participant's code and arm-appropriate instructions. Participants receive $100 each, prorated if they stop early, disbursed through the Stanford Department of Medicine, for approximately $10,000 in total. Study data are exported from the platform's admin console as CSV and analyzed against the preregistered plan. The manuscript is drafted and targeted at NEJM AI, with the results section templated pending data.

## Participant enrollment and payments

- Issue individual access codes and record which resident received which code. The code-to-arm mapping is held server-side and should not be circulated.
- Send the program-wide invitation, then the individual instruction email matched to the participant's arm.
- Verify completion in the admin dashboard before releasing payment.
- Process payments through the Department of Medicine; log issuance date, amount, and method; handle prorated payments for partial completion.
- Track non-responders and reissue or reassign codes as needed.

## Data coordination

- Maintain the master roster: code issued, arm, intake completed, tasks completed, assessment completed, payment issued.
- Export participants, task responses, assessment responses, chat logs, and intake data from the admin console after each batch.
- Run quality checks per batch: partial sessions, unused or duplicated codes, missing AI logs in the AI arm, assessment attempts with no preceding case data.
- Document protocol deviations and non-completions.
- Keep participant-identifying material separate from the analysis dataset, and deliver a de-identified analysis-ready file with a data dictionary.
- Preserve each delivered dataset so that analyses are reproducible.

## Platform administration

- Tasks and assessment items are edited in the admin console, not in the source code. Changes take effect immediately for any participant who loads the page afterward.
- Do not modify the assessment items, the case, or the AI configuration during enrollment. Each is fixed in the preregistration.
- Monitor completion by arm and per-question performance in the dashboard during data collection.
- Watch for control-arm failures at the UpToDate proxy login, which is the most likely participant-facing failure point.

## Locations

The study runs at aiskills.kevinkeet.com, with the administrative dashboard at /admin. Code is at github.com/kevinkeet/aiskills-clinical-exercise and the preregistration at osf.io/h5mvt. The docs folder holds the manuscript, the preregistration, the annotated literature review, the twelve assessment items with answer key and selection rationale, the CONSORT figure, and the pilot data snapshot. HANDOFF.md covers deployment, database, and operational detail.
