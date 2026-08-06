# Skill AI RCT

A resident picks up a patient with a disease she has never worked up before. She has twenty minutes before rounds. She opens a chatbot, pastes in the labs, and gets back a clean differential and a plan. She presents it. The plan is right.

What does she know tomorrow?

That is what this trial asks, and it is not what the published trials ask. Those measure whether AI makes clinicians perform better while they are holding it. Useful, but it is not what residency is for. Residency exists to produce a physician who can reason without the tool and who can eventually supervise it. Whether AI use during training builds that physician or quietly skips the step is untested.

Medical educators now have a vocabulary for the worry: de-skilling, never-skilling, mis-skilling. The evidence underneath it is thin. Most of what exists is perceptual, like the endoscopists whose adenoma detection dropped once they got used to AI, or it comes from outside medicine entirely. For clinical thinking, nobody has run the experiment.

## How it works

A hundred Stanford medicine residents, randomized one to one. Everyone works the same case, a 32-year-old man whose kidney disease turns out to be Fabry, through five free-response tasks from history to the after-visit summary. Half have a chatbot in the panel next to the case. Half have UpToDate.

Then we take the resource away and give them a twelve-question test.

That score is the whole point. During the case both groups have help and both will look competent. Afterward is the only place a difference can show up.

We chose Fabry because almost no resident knows it cold, so the test measures what they picked up in the session rather than what they walked in with.

We also log every word of every AI conversation. A resident who asks why the PR interval is short is doing something different from a resident who asks for the workup and pastes the answer. Shen and Tamkin found those two habits separated learning outcomes by a factor of two or three in software engineers. We will code our transcripts the same way and see whether it holds at the bedside. Nobody was randomized to a habit, so that piece is exploratory.

The rest is ordinary trial hygiene. Blocks stratified by PGY, allocation hidden server-side until the case opens, scoring automated and blinded, the answer key never sent to the browser, and the whole plan preregistered on OSF before anyone enrolled.

## Where we are

Built, piloted, cleaned up, ready to run. Twelve questions survived the cut. The AI runs with no system prompt on purpose, because the point is to test the chatbot residents actually use, not a tutor we tuned ourselves. The consent carries the IRB's proration and tax language. The database is empty except for 120 enrollment codes waiting to go out. Both arms have been smoke-tested on the live site.

The manuscript is drafted with the results section blank.

What is left: register at ClinicalTrials.gov, which has to happen before the first resident enrolls and which OSF does not substitute for. Then recruit, run it, and fill in the numbers.

## Where things are

The study runs at aiskills.kevinkeet.com, with the dashboard at /admin. Code is at github.com/kevinkeet/aiskills-clinical-exercise and the preregistration is at osf.io/h5mvt. The docs folder has the manuscript, the preregistration, the literature review, the twelve questions with the answer key and the reasoning behind each one, the CONSORT figure, and the pilot data. HANDOFF.md covers the engineering side.

One warning for anyone editing content. The tasks and questions live in the database and are changed at /admin. The files in src/data only seed an empty database. Editing them and deploying changes nothing a participant sees.

## Why bother

If a plain chatbot lets residents finish the work without building what sits underneath it, that matters for how every program is currently letting AI in the door. It also sets up the two studies after this one: whether the better habit can be taught, and whether a tool built for learning beats the one everybody already has open.
