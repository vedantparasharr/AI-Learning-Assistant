// Blog post content data. All posts are long-form, educational, and SEO-optimised.
// AdSense requires original, high-quality content — every post is 800+ words.

export const blogPosts = [
  {
    slug: "what-is-spaced-repetition",
    title: "What Is Spaced Repetition? The Science Behind Actually Remembering What You Study",
    description: "Most students re-read their notes and hope for the best. Spaced repetition is the method backed by over a century of memory research that makes information stick permanently.",
    readTime: "8 min read",
    date: "June 15, 2026",
    category: "Memory Science",
    content: `
## The Forgetting Curve: Why You Forget Everything You Study

In 1885, German psychologist Hermann Ebbinghaus did something no scientist had done before: he rigorously tested his own memory. He memorised lists of nonsense syllables, then measured how much he retained at different time intervals. What he discovered shocked the academic world.

Without any review, people forget roughly 50% of new information within an hour. By the end of the first day, that figure rises to around 70%. After a week, nearly 90% is gone. Ebbinghaus called this the **forgetting curve** — and it is one of the most replicated findings in all of cognitive psychology.

This is why students who cram the night before an exam can answer questions the next morning, but fail to recall anything three weeks later. The information was never truly learned — it was just temporarily buffered in short-term memory.

## What Spaced Repetition Actually Does

Spaced repetition is a learning technique that fights the forgetting curve by showing you information at carefully timed intervals — specifically, right before you are about to forget it.

The logic is straightforward: every time you successfully recall a piece of information, your brain strengthens the neural pathway associated with it. Each successful recall also extends how long you will be able to remember it before needing to review it again. This is known as the **spacing effect**.

Here is what a spaced repetition review schedule might look like for a new concept:

- **Session 1:** Learn the concept
- **Review 1:** 1 day later
- **Review 2:** 3 days later
- **Review 3:** 7 days later
- **Review 4:** 16 days later
- **Review 5:** 35 days later
- And so on, with increasingly longer gaps

Each review that you pass successfully pushes the next review further into the future. Over time, material you have reviewed several times might only need to be revisited once every few months — yet you will still remember it clearly.

## Active Recall: The Missing Ingredient

Spaced repetition works best when combined with **active recall** — the practice of testing yourself on information rather than simply re-reading it.

Research published in the journal *Science* (Karpicke & Roediger, 2008) found that students who tested themselves on material retained 50% more information after a week than students who re-studied the same material. This is called the **testing effect** or retrieval practice effect.

When you re-read your notes, your brain passively receives information. When you try to recall a concept from memory — even if you fail and have to look it up — your brain actively reconstructs the memory, making it far more durable.

This is why flashcards are so effective when used correctly: each card forces active recall, and a good spaced repetition system (SRS) schedules those cards at optimal intervals.

## The FSRS Algorithm: Modern Spaced Repetition

The original spaced repetition algorithm, SM-2, was created by Piotr Wozniak in the 1980s. It powered the Anki flashcard app and introduced millions of students to the spacing effect.

In recent years, a newer algorithm called **FSRS (Free Spaced Repetition Scheduler)** has emerged as a significant improvement. FSRS uses machine learning principles to model memory more accurately than SM-2, accounting for individual differences in forgetting rates and adjusting intervals dynamically based on your actual performance.

The key metric FSRS optimises for is **retrievability** — the probability that you can successfully recall a piece of information right now. FSRS aims to schedule each review at the moment when your retrievability drops to a target threshold (usually around 90%), meaning you review things precisely when needed, without wasting time on material you know well.

DistillAI uses the FSRS algorithm in its flashcard review system, ensuring your review queue is always personalised to your actual memory state.

## Why Most Students Don't Use Spaced Repetition (And How to Start)

Despite decades of research confirming its effectiveness, most students still rely on passive re-reading, highlighting, and massed practice (cramming). There are a few reasons for this:

**It feels less productive.** Re-reading is comfortable. Testing yourself feels harder because it is harder — and that difficulty is exactly what makes it effective. Cognitive scientists call this **desirable difficulty**: the slight struggle of retrieval is what causes lasting learning.

**It requires planning.** You need to know what to review and when. Manual spaced repetition — keeping a paper schedule of review dates — is tedious. This is where software tools become essential.

**Results are slow at first.** On day one of using spaced repetition, you will not feel smarter. But at week four, when you can still recall everything you learned in week one without any extra effort, the compounding effect becomes undeniable.

## How to Apply Spaced Repetition to Your Studies

1. **Break your material into small, discrete facts.** One concept per flashcard. Avoid cramming paragraphs onto a single card.
2. **Study daily, not in long sessions.** Thirty minutes every day beats three hours twice a week for retention.
3. **Use an SRS tool.** Apps like DistillAI, Anki, or similar tools automate the scheduling so you never have to think about when to review.
4. **Always answer before flipping.** The moment of retrieval — even a failed one — is where the learning happens.
5. **Trust the algorithm.** If a card shows up in your queue, review it. The system knows more about your memory than your feelings in the moment do.

## The Long-Term Payoff

Students who use spaced repetition consistently report a qualitative shift in how learning feels. Instead of the familiar panic of forgetting everything before an exam, they experience a growing library of knowledge that feels solid and accessible.

This is not magic — it is neuroscience. Every successful retrieval physically strengthens the myelin sheath around the relevant neural pathways. Over time, the concepts you have studied become as automatic and effortless to recall as your own name.

Spaced repetition does not make studying easier in the moment. It makes learning permanent — which is the point.
    `
  },
  {
    slug: "active-recall-vs-passive-reading",
    title: "Active Recall vs. Passive Reading: Why Re-Reading Your Notes Is Wasting Your Time",
    description: "Highlighting, re-reading, and summarising feel productive but produce weak memories. Here is what the research says you should do instead.",
    readTime: "7 min read",
    date: "June 22, 2026",
    category: "Study Techniques",
    content: `
## The Illusion of Knowing

You open your textbook chapter for the third time. The words feel familiar. You nod along as you read. You think: *I know this.* Then you close the book, sit down for an exam, and the page is blank in your mind.

This experience is called the **fluency illusion** — one of the most powerful and widespread traps in education. When information feels familiar, our brains mistakenly interpret that familiarity as mastery. But familiarity and recall are completely different cognitive processes.

Passive reading builds familiarity. Active recall builds memory.

## What the Research Actually Shows

The evidence against passive re-reading is overwhelming. A landmark 2010 study by Karpicke and Blunt, published in *Science*, tested four different study methods:

1. Reading a passage once
2. Reading it four times
3. Creating a concept map after reading
4. Practising retrieval (testing themselves) after reading

Students who practised retrieval remembered **50% more** after one week than students who re-read the passage four times. Even more surprisingly, they outperformed students who spent the same time creating detailed concept maps.

The researchers called this the **testing effect** — the paradoxical finding that the act of being tested on material improves learning more than studying the material itself.

## Why Retrieval Practice Is So Powerful

When you re-read a passage, your brain executes a relatively simple process: pattern recognition. You see familiar words and your visual cortex confirms: *yes, I have seen this before.* No new memory traces are created.

When you try to recall something from memory, your brain executes a completely different and far more demanding process. It must search through its stored information, reconstruct the relevant concept, and bring it to conscious awareness. This reconstruction is metabolically expensive — and that effort is exactly what strengthens the memory.

Think of it like a muscle. Passive reading is like looking at weights. Active recall is like lifting them.

Every time you successfully retrieve a memory, you strengthen the neural pathway associated with it. The memory becomes easier to access next time, and harder to lose. This is the fundamental mechanism behind why retrieval practice works.

## The Failure Modes of Common Study Habits

### Highlighting

Highlighting is the most popular study technique and one of the least effective. When students highlight, they typically mark text that catches their eye — without processing what it means or how it connects to other concepts. Research by Dunlosky et al. (2013) rated highlighting as having **low utility** for learning.

Highlighting also creates a false sense of preparation. Students who have highlighted their notes feel as though they have engaged with the material — but that engagement is mostly superficial.

### Re-Reading

As discussed above, re-reading exploits familiarity to create a sense of mastery. It is not useless — a second read of a genuinely difficult passage can deepen initial understanding — but as a review strategy, it is far inferior to testing.

### Summarising

Summarising is more useful than highlighting or re-reading, but it depends heavily on how it is done. Writing a summary from memory (without looking at the text) is essentially retrieval practice. Writing a summary while looking at the text is mostly passive re-reading in a different format.

## How to Do Active Recall Correctly

**Method 1: The Blank Page Technique**
After reading a chapter or finishing a study session, close your notes and write down everything you can remember. Do not look anything up. Just dump your memory onto a blank page. Then, and only then, check your notes to see what you missed.

**Method 2: Flashcards**
The classic. One question on the front, one answer on the back. The critical rule: always attempt to answer before flipping. Thinking *I know this one* and flipping immediately provides zero benefit. The retrieval attempt — however difficult — is the learning.

**Method 3: The Feynman Technique**
Imagine you are teaching the concept to a twelve-year-old who knows nothing about the subject. Explain it out loud (or in writing) using simple language. When you hit a point where your explanation breaks down, you have found a gap in your understanding. Go back to the source material and fill it.

**Method 4: Practice Questions**
Past exam papers, problem sets, and practice questions are the highest-fidelity form of active recall — they simulate the exact conditions under which you will need to retrieve the information. Use them early in your studying, not just as a final check.

## Building Active Recall Into Your Daily Study Routine

The shift from passive to active studying requires a change in mindset. Passive studying feels easier because it is easier. Active recall is uncomfortable — you regularly face the unsettling experience of not knowing something you thought you knew.

Embrace that discomfort. It is the signal that learning is happening.

A practical routine:
- **Read a section** (10–15 minutes max)
- **Close everything** and try to recall the main ideas (5 minutes)
- **Check gaps** — look up only what you missed, do not re-read everything
- **Create flashcards** for anything that needs regular review

If you are using DistillAI, the flashcard review queue handles the scheduling automatically. Your job is to always make a genuine retrieval attempt before revealing the answer.

## The Compounding Effect

Active recall does not just help you pass tomorrow's exam. It creates the kind of durable, accessible knowledge that you can draw on years later.

Students who use passive study techniques typically find that their knowledge evaporates within weeks of an exam. Students who use active recall find that concepts they studied months ago are still crisp and available — because they have been retrieved multiple times and the memory has been progressively strengthened.

This compounding effect is the real payoff. You are not just studying for the exam. You are building a knowledge base that stays with you.
    `
  },
  {
    slug: "how-to-study-for-exams",
    title: "How to Actually Study for Exams: A Science-Based Guide",
    description: "A practical, step-by-step framework for exam preparation based on cognitive science — not productivity influencer advice.",
    readTime: "9 min read",
    date: "June 28, 2026",
    category: "Exam Prep",
    content: `
## Why Most Exam Advice Is Wrong

Search "how to study for exams" and you will find a flood of advice: colour-code your notes, use the Pomodoro timer, make mind maps, study in a coffee shop to stay focused, listen to lo-fi music. Some of these tips are harmless. Many are distractions dressed up as productivity.

What the research in cognitive science actually recommends looks different — and less glamorous. Effective studying is uncomfortable. It involves regular failure. It requires planning that most students skip. But it works.

This guide is based on what the research actually shows, not what feels productive.

## Step 1: Get Clear on What You Need to Know

Before you study anything, you need a complete picture of what you are being tested on. This sounds obvious, but most students start studying without it.

**Do this first:**
- Read through the entire syllabus or learning objectives
- Identify the specific topics and subtopics that will be assessed
- Weight them by likely exam importance (past papers help enormously here)
- Break each topic into discrete, testable facts or concepts

This process — essentially building a map of the knowledge you need to acquire — is what DistillAI automates when you input your syllabus. But you can do it manually too: take your syllabus, and for each bullet point, ask *What specific questions could an examiner write about this?*

## Step 2: Build a Realistic Study Schedule

Most students make two errors with study schedules: they either do not make one, or they make one that is wildly optimistic and abandon it by day three.

A realistic schedule has these properties:

**It accounts for your actual life.** If you play football on Tuesdays, your Tuesday study session is shorter. Do not pretend otherwise.

**It distributes topics across time rather than blocking them.** Studying every topic in your history syllabus over three consecutive days and then moving on is massed practice — it feels thorough but produces poor retention. Better to study a mix of topics daily and return to each one repeatedly.

**It includes review time, not just new learning time.** Many students use all their study time to cover new material, leaving no time to review what they have already covered. This is a critical mistake. Without review, previously studied material decays rapidly.

**It has a daily commitment, not a weekly one.** "I'll study 10 hours this weekend" is far less effective than "I'll study 1.5 hours every day." The spacing effect applies to study sessions themselves, not just individual flashcards.

## Step 3: Use the Right Study Techniques

Based on the research (particularly Dunlosky et al.'s 2013 meta-analysis of study techniques), here is a ranked summary:

**High utility (use these):**
- Practice testing / retrieval practice
- Distributed practice (studying over time, not all at once)

**Moderate utility (use if appropriate):**
- Elaborative interrogation (asking *why* and *how* about each concept)
- Self-explanation (explaining concepts to yourself as you learn)
- Interleaved practice (mixing topics rather than blocking them)

**Low utility (mostly avoid as primary methods):**
- Summarisation
- Highlighting / underlining
- Re-reading
- Keyword mnemonics
- Imagery for text

Notice that the two most commonly used study techniques — re-reading and highlighting — are ranked at the bottom. The most effective technique — retrieval practice — is what most students skip entirely.

## Step 4: Study in Sessions, Not Marathons

A typical effective study session looks like this:

1. **Brief review** (10 min): Go through flashcards or quick questions on material from previous sessions
2. **New material** (20–30 min): Read / watch / listen to new content — but actively, taking notes or pausing to predict what comes next
3. **Retrieval practice** (15–20 min): Close your notes and test yourself on the new material. Blank page, practice questions, or flashcards
4. **Fill gaps** (10 min): Check what you missed and address it. Do not re-read everything — just target the gaps
5. **Update your flashcards** (5 min): Create new cards for any concepts that need regular review

Total: about 60–70 minutes. This is more productive than a three-hour session where you re-read and highlight continuously.

## Step 5: Use Past Papers Strategically

Past examination papers are the single most valuable resource for exam preparation, and most students underuse them.

The common mistake is saving past papers for the end of studying, using them purely as a final test. This is backwards. Past papers should be used throughout your preparation, for several reasons:

**They tell you what actually gets tested.** Reading through past papers early reveals patterns — certain topics appear consistently, certain types of questions repeat, certain concepts are always tested at a particular depth. This information shapes how you allocate your study time.

**They function as retrieval practice.** Attempting a past paper under timed conditions is the most realistic form of active recall available. It not only reinforces what you know but exposes exactly what you do not.

**They reduce exam anxiety.** Students who have seen dozens of past papers walk into the exam knowing what format to expect. The exam becomes familiar rather than threatening.

**How to use them effectively:**
- Attempt a past paper early (even in week one) to calibrate your starting level
- After attempting, mark carefully and identify every point you lost
- Those gaps go directly into your study focus
- Repeat with another past paper 2–3 weeks later to measure progress

## Step 6: Sleep and Your Memory

No study guide is complete without addressing sleep, because the evidence is unambiguous: sleep is when memory consolidation happens.

During slow-wave sleep, your brain replays experiences from the day and transfers information from the hippocampus (short-term store) to the neocortex (long-term store). Without adequate sleep, this transfer is impaired — and the memories you formed during the day are far more vulnerable to decay.

Practical implications:
- Do not sacrifice sleep to study. A well-rested brain studying for one hour outperforms an exhausted brain studying for three.
- Study important material before sleep, not first thing in the morning — the upcoming sleep period will consolidate it.
- Aim for 7–9 hours for adolescents and young adults. This is not laziness; it is neurological necessity.

## Putting It Together: The Week-by-Week Framework

**Week 1 (foundation):**
- Build your knowledge map from the syllabus
- Attempt a past paper to identify your weakest areas
- Create an initial flashcard set for core concepts
- Begin daily reviews

**Weeks 2–4 (building):**
- Cover all major topics using the session structure above
- Daily flashcard reviews with FSRS-scheduled repetitions
- Attempt a second past paper at the end of week 4

**Final week:**
- Focus on past papers and weak-area drilling
- No new topics — only consolidation
- Maintain sleep schedule; do not all-nighters

The students who perform best under exam conditions are not the ones who studied the longest. They are the ones who studied most effectively — and now have clear, retrievable knowledge rather than vague familiarity.
    `
  },
  {
    slug: "fsrs-algorithm-explained",
    title: "How the FSRS Algorithm Makes Studying More Efficient (And Why It Beats SM-2)",
    description: "The FSRS algorithm is the most advanced spaced repetition scheduler available. Here is how it works, and why it schedules your flashcards better than anything that came before it.",
    readTime: "7 min read",
    date: "July 1, 2026",
    category: "Technology",
    content: `
## A Brief History of Spaced Repetition Algorithms

Spaced repetition as a concept has existed since Ebbinghaus described the forgetting curve in 1885. But it was not until 1987 that Polish scientist Piotr Wozniak created the first practical algorithm for scheduling review sessions: SM-2 (SuperMemo 2).

SM-2 worked by assigning each flashcard an **ease factor** — a multiplier that determined how quickly the review intervals grew. Cards you found easy got longer and longer intervals. Cards you found difficult received shorter intervals, giving you more opportunities to practice them.

SM-2 powered the early versions of SuperMemo and, crucially, the Anki flashcard application — still the most widely used SRS tool in the world. For nearly 40 years, SM-2 was the gold standard for spaced repetition.

Then came FSRS.

## What Is FSRS?

FSRS — Free Spaced Repetition Scheduler — was developed by Jarrett Ye and a team of researchers as a fundamentally new approach to modelling memory. Rather than using the relatively simple ease-factor mechanism of SM-2, FSRS builds a more complete mathematical model of human memory based on two variables:

**Stability (S):** How long a memory can last without review. A stable memory is one that you will still be able to recall weeks or months from now.

**Difficulty (D):** How hard this particular piece of information is for you to retain. Some concepts are inherently more difficult than others, and difficulty also varies between individuals.

These two variables, combined with the time elapsed since your last review, allow FSRS to predict the **retrievability** of each memory — the probability that you can successfully recall it right now.

## How FSRS Schedules Reviews

The key insight of FSRS is that the goal of spaced repetition is not to show you cards at fixed intervals — it is to show each card at the optimal moment, defined as when your probability of successfully recalling it drops to a target threshold.

This threshold is typically set at around **90% retrievability**. FSRS schedules each review at the predicted moment when your chance of recalling the information drops to 90%, meaning:

- Cards you know very well get long intervals (because their stability is high)
- Cards you find difficult get short intervals (because their stability is low and decays faster)
- Every review is scheduled precisely when it is most needed — not too early (which would be wasteful), not too late (which would mean you have already forgotten)

After each review, FSRS updates its model based on how you performed — whether you remembered easily, struggled, or forgot entirely — and recalculates the stability and difficulty parameters accordingly.

## Why FSRS Outperforms SM-2

Several independent studies have compared FSRS and SM-2 on real Anki user data. The results consistently show that FSRS achieves the target retention rate more accurately, with fewer total reviews required.

The core advantages:

**Individual calibration.** SM-2 uses a single ease factor that adjusts somewhat based on performance. FSRS maintains separate stability and difficulty estimates that are updated independently, giving it a richer model of each card's memory properties.

**Forgetting modelling.** FSRS explicitly models the forgetting curve for each card. SM-2 does not — it uses fixed interval multipliers that do not account for the continuous nature of memory decay.

**Reduced over-reviewing.** One criticism of SM-2 is that it tends to schedule easy cards too frequently, wasting review time. FSRS's retrievability model avoids this by only scheduling a review when it is genuinely needed.

**Better handling of lapses.** When you forget a card and have to re-learn it, SM-2 dramatically reduces the interval and resets the ease factor, sometimes making it very difficult for the interval to recover. FSRS handles lapses more gracefully, preserving some of the stability built up before the lapse.

## How DistillAI Uses FSRS

Every flashcard generated by DistillAI is managed by the FSRS algorithm. After each study session, when you rate how well you recalled each flashcard (from "forgot" to "easy"), FSRS updates its memory model for that card and calculates the optimal next review date.

Your review queue shows cards in the order that maximises your retention with the minimum time investment. Cards that are about to be forgotten appear at the top. Cards you know solidly are pushed weeks or months into the future.

The result is a review session that feels shorter than traditional study — because you are only reviewing cards that genuinely need attention, rather than grinding through everything repeatedly.

## Practical Implications for Students

Understanding FSRS changes how you should interact with your flashcard reviews:

**Rate honestly.** FSRS is only as good as the data it receives. If you flip a card and barely recall it but rate yourself "easy," the algorithm will give you a long interval — and you will likely forget the card. Rate your actual recall honestly. It is better to review something extra once than to forget it before an exam.

**Review every day.** FSRS is designed around daily review sessions. If you skip a day, the algorithm will try to compensate — but a backlog of overdue cards is much harder to clear than a consistent daily queue.

**Trust long intervals.** When FSRS tells you that a card does not need review for 45 days, it is not being careless. Its model predicts that your recall probability will still be above 90% at that point. Trust it.

**Do not add too many new cards at once.** Each new card starts with a very short review interval. If you add 100 cards today, you will have 100 cards due for review in the next few days. Build your deck gradually — 10 to 20 new cards per day is a manageable pace for most students.

FSRS is not magic. But it is the most sophisticated and accurate tool currently available for turning your study sessions into permanent knowledge. Paired with genuine retrieval practice, it is the closest thing to an optimal learning system that exists.
    `
  },
  {
    slug: "ai-study-plan-guide",
    title: "How to Build a Study Plan That Actually Works (The AI-Powered Approach)",
    description: "Most study plans fail within three days. Here is how to build one that adapts to your life, uses your time efficiently, and survives contact with reality.",
    readTime: "8 min read",
    date: "July 2, 2026",
    category: "Study Planning",
    content: `
## Why Study Plans Fail

Every student who has ever sat down before an exam has made a study plan. Most of those plans have been abandoned.

The failure rate of self-made study plans is not a moral failing — it is a design problem. Traditional study plans fail because they:

**Ignore the forgetting curve.** A plan that says "study Chapter 3 on Monday" does not account for the fact that by Friday, most of what you learned on Monday has already been forgotten. Without built-in review cycles, a study plan teaches you material you will not retain.

**Are built on optimism, not reality.** Students typically estimate how long studying will take based on how long they *want* it to take, not how long it actually takes. A plan that assumes three hours of productive study per day will collapse the first time life intervenes.

**Do not prioritise.** A flat list of topics treats every subject and every concept as equally important. In reality, some topics carry more exam weight than others, and some concepts are foundational to understanding others. A good plan reflects these priorities.

**Have no feedback mechanism.** A static plan cannot adjust when you spend twice as long on a topic as expected, or when you discover three weeks in that you have a gap in your understanding of something you thought you knew.

## What a Good Study Plan Actually Looks Like

An effective study plan has these properties:

**It covers every topic before the exam.** Sounds obvious, but students frequently run out of time because their plan was not comprehensive enough.

**It distributes topics across time.** Rather than studying each topic once in a block, an effective plan returns to topics multiple times over the weeks, exploiting the spacing effect for maximum retention.

**It includes review sessions.** Not just "study new material" sessions — dedicated time to review previously covered content.

**It adapts.** When you fall behind or progress faster than expected, the plan adjusts rather than becoming irrelevant.

**It is specific about daily tasks.** "Study biology" is not a plan. "Complete retrieval practice on cell division concepts and review 20 flashcards" is a plan.

## The Manual Approach: Step-by-Step

If you are building a study plan without software, here is the framework:

**Step 1: Inventory your material**
List every topic and subtopic that could appear on the exam. Use your syllabus, past papers, and course notes. Be thorough — gaps in your inventory become gaps in your knowledge.

**Step 2: Weight by importance**
Not all topics are equal. Review past papers to identify which topics appear most frequently and carry the most marks. Allocate proportionally more time to high-weight topics.

**Step 3: Estimate time**
For each topic, estimate how many hours you need to genuinely understand it — not just skim it. Add 30% to your initial estimate. Optimism about study time is universal and persistent.

**Step 4: Calculate available time**
Count the days until your exam. Subtract unavoidable commitments (school hours, sports, family events, sleep). What is left is your actual study time.

**Step 5: Build in review cycles**
Reserve roughly 30% of your total study time for review rather than new material. Distribute this throughout the plan rather than saving it all for the final week.

**Step 6: Create a daily schedule**
Assign specific topics to specific days. Balance topics from different subjects in each session to prevent mental fatigue. Aim for sessions of 60–90 minutes with short breaks.

**Step 7: Track and adjust weekly**
Every week, assess what you actually completed versus what you planned. Adjust the following week's plan accordingly. A plan you never revise is a plan you will abandon.

## Where AI Changes the Equation

The manual process above is effective but time-consuming. It also requires that you make a series of judgment calls — about topic weightings, time estimates, and review frequencies — that most students are not equipped to make accurately.

This is where AI-powered study planning makes a meaningful difference.

**Automatic breakdown.** When you provide a syllabus or list of topics, an AI system can instantly identify the scope of what needs to be covered and structure it into a logical learning sequence — placing foundational concepts before advanced ones, grouping related topics, and flagging potential dependencies.

**Intelligent scheduling.** Rather than asking you to manually calculate when to review each topic, an AI system can apply spaced repetition principles automatically — building review cycles into your schedule from the start.

**Adaptive adjustment.** As you progress through the plan, marking topics as complete, an AI system can recalculate the remaining schedule. If you spend more time on one topic than expected, the plan adjusts so you still cover everything before the exam.

**Exam-date awareness.** The plan is built backwards from your exam date, ensuring that the pace is calibrated to your available time. There is no danger of reaching the final week and discovering you have only covered half the syllabus.

## Using DistillAI to Build Your Study Plan

DistillAI is built around this problem. The workflow is designed to remove the planning friction entirely:

1. **Input your syllabus** — paste the list of topics you need to cover, or upload a PDF of your course outline
2. **Set your exam date** — the system calculates how many study days you have available
3. **Confirm your daily study budget** — how many minutes per day can you realistically commit?
4. **Generate your plan** — the system breaks your syllabus into a daily schedule that covers all topics with built-in review time

Once your plan is active, each day shows you exactly what to study. After a study session, you can explore any topic in depth using the AI-powered explanations, generate practice questions, and create flashcards that automatically enter your FSRS-powered review queue.

The result is a study system where you never have to think about *what* to study today — only about actually doing it.

## Common Mistakes to Avoid

**Starting too late.** The spacing effect requires time to work. A study plan that begins two weeks before an exam is fundamentally limited in how much retention it can build. Eight to twelve weeks of distributed practice produces dramatically better results than two weeks of intensive cramming.

**Treating the plan as fixed.** A study plan is a living document. It should change every week based on your actual progress. Do not feel bound to a schedule that is no longer accurate.

**Over-planning and under-doing.** Some students spend so much time perfecting their study schedule that they have no time left to actually study. The plan is a tool, not the work. Build it quickly, start immediately, and refine as you go.

**Skipping review to cover new material.** When time gets short, the first thing students cut is review. This is exactly backwards. New material without review is wasted effort. Prioritise review over coverage when you are behind.

A well-designed study plan does not guarantee exam success — knowledge and understanding do. But it creates the conditions under which genuine learning can happen: sufficient time, the right sequence, and regular reinforcement. Everything else follows from there.
    `
  }
];

export const getPostBySlug = (slug) => blogPosts.find(p => p.slug === slug);
