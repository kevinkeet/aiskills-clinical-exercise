# Skill AI RCT

Stanford IRB-86737. PI: Kevin Keet, MD. As of July 2026 the study is built and ready to enroll.

## What we're asking

Residents now work up patients with a chatbot open beside them. The randomized trials published so far ask whether AI makes clinicians perform better while they are using it. For someone in training that is the wrong question. What matters is whether a resident who works a case with AI ends up knowing more once the AI is gone.

Medical educators have named the risk, calling it de-skilling, never-skilling, and mis-skilling. But for thinking tasks the argument rests on theory and on analogy to perceptual work such as AI-assisted colonoscopy. It has not been tested in a randomized trial. That is what this study does.

The distinction we care about is between using AI to study deliberately, which can work well, and the incidental learning that happens while taking care of patients. The second is what fills a residency, and it is what we test.

## The design

One hundred Stanford internal medicine residents, PGY-1 through PGY-3, randomized one to one. Everyone works the same unfamiliar case, a fictional patient with Fabry disease, through five free-response tasks: history, physical exam, workup, management, and after-visit instructions.

Half get an AI chat assistant built into the page. It runs Claude Opus 4.7 with no system prompt, so it behaves like an ordinary chatbot rather than a tutor. The other half get UpToDate through the Stanford Lane proxy. Immediately afterward, with no resource available, everyone takes a 12-item knowledge test.

That unassisted score is the primary outcome. The session is deliberately split in two: a phase where the resource is at hand and performance is assisted, and a phase where it is not, so only what the resident actually absorbed can show up.

Secondary outcomes are self-rated comfort with Fabry disease, asked identically before and after, and time on task. Every AI conversation is logged, and a pre-specified exploratory analysis will code those conversations as engaged or offloading, following Shen and Tamkin's work on skill formation, to test whether the way a resident uses the tool predicts what they learned.

Fabry disease was chosen because it is rare and multisystem, outside what residents already know, so the test measures what was learned during the session rather than prior knowledge.

Safeguards: PGY-stratified permuted blocks, allocation concealed server-side until the case opens, automated and blinded scoring, and an answer key that is never sent to the browser. The trial is preregistered on OSF with the analysis plan fixed in advance. Fifty per arm gives 80% power to detect a difference of about 0.57 standard deviations.

## Where it stands

The platform is built, piloted, and finalized. The quiz is down to 12 items, the AI runs out of the box, the consent carries the IRB's proration and tax language, and an answer-key leak has been closed. The database is wiped to 120 clean enrollment slots with the pilot data preserved, Supabase is on a paid plan, the OSF preregistration is filed under embargo, a two-arm smoke test passed on the live site, and the manuscript is drafted for NEJM AI with the results section templated.

Next comes recruiting, handing out enrollment codes, running the study, filling in the results and figures, checking the references, and submitting.

Three things are still open. ClinicalTrials.gov registration, which ICMJE accepts and OSF does not, has to happen before the first resident enrolls. Two references are still placeholders. And the live consent needs to be checked against the final IRB-approved version.

## Where things live

The study runs at aiskills.kevinkeet.com, with an admin dashboard at /admin for statistics, content editing, and CSV export. Code is at github.com/kevinkeet/aiskills-clinical-exercise, and the preregistration is at osf.io/h5mvt.

The docs folder holds the manuscript draft, the preregistration, an annotated review of 31 sources, the 12 quiz items with answer key and the reasoning behind each, the CONSORT figure, and a snapshot of the pilot data. HANDOFF.md covers the engineering side: stack, deployment, database, and operational playbooks. The application is Next.js and React on Vercel, deploying automatically from main, with Supabase for data and the Anthropic SDK for the AI arm.

One thing to know before editing anything. Tasks and quiz questions live in the database and are edited through /admin. The files in src/data only seed an empty database, so changing them and deploying will not change what participants see.

## Why it matters

If an ordinary assistant lets residents finish clinical work without building the knowledge underneath it, that is a problem for how AI is being folded into training, and it suggests trainee-facing tools should be judged on what people learn rather than on what they produce. Two follow-up studies come out of this one: whether residents can be taught habits that preserve their own learning, and whether purpose-built tools do better than an ordinary chatbot.
