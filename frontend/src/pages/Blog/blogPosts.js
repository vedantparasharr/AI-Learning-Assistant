// Blog post content data. All posts are long-form, educational, and SEO-optimised.
// AdSense requires original, high-quality content â€” every post is 800+ words.

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

Without any review, people forget roughly 50% of new information within an hour. By the end of the first day, that figure rises to around 70%. After a week, nearly 90% is gone. Ebbinghaus called this the **forgetting curve** â€” and it is one of the most replicated findings in all of cognitive psychology.

This is why students who cram the night before an exam can answer questions the next morning, but fail to recall anything three weeks later. The information was never truly learned â€” it was just temporarily buffered in short-term memory.

## What Spaced Repetition Actually Does

Spaced repetition is a learning technique that fights the forgetting curve by showing you information at carefully timed intervals â€” specifically, right before you are about to forget it.

The logic is straightforward: every time you successfully recall a piece of information, your brain strengthens the neural pathway associated with it. Each successful recall also extends how long you will be able to remember it before needing to review it again. This is known as the **spacing effect**.

Here is what a spaced repetition review schedule might look like for a new concept:

- **Session 1:** Learn the concept
- **Review 1:** 1 day later
- **Review 2:** 3 days later
- **Review 3:** 7 days later
- **Review 4:** 16 days later
- **Review 5:** 35 days later
- And so on, with increasingly longer gaps

Each review that you pass successfully pushes the next review further into the future. Over time, material you have reviewed several times might only need to be revisited once every few months â€” yet you will still remember it clearly.

## Active Recall: The Missing Ingredient

Spaced repetition works best when combined with **active recall** â€” the practice of testing yourself on information rather than simply re-reading it.

Research published in the journal *Science* (Karpicke & Roediger, 2008) found that students who tested themselves on material retained 50% more information after a week than students who re-studied the same material. This is called the **testing effect** or retrieval practice effect.

When you re-read your notes, your brain passively receives information. When you try to recall a concept from memory â€” even if you fail and have to look it up â€” your brain actively reconstructs the memory, making it far more durable.

This is why flashcards are so effective when used correctly: each card forces active recall, and a good spaced repetition system (SRS) schedules those cards at optimal intervals.

## The FSRS Algorithm: Modern Spaced Repetition

The original spaced repetition algorithm, SM-2, was created by Piotr Wozniak in the 1980s. It powered the Anki flashcard app and introduced millions of students to the spacing effect.

In recent years, a newer algorithm called **FSRS (Free Spaced Repetition Scheduler)** has emerged as a significant improvement. FSRS uses machine learning principles to model memory more accurately than SM-2, accounting for individual differences in forgetting rates and adjusting intervals dynamically based on your actual performance.

The key metric FSRS optimises for is **retrievability** â€” the probability that you can successfully recall a piece of information right now. FSRS aims to schedule each review at the moment when your retrievability drops to a target threshold (usually around 90%), meaning you review things precisely when needed, without wasting time on material you know well.

DistillAI uses the FSRS algorithm in its flashcard review system, ensuring your review queue is always personalised to your actual memory state.

## Why Most Students Don't Use Spaced Repetition (And How to Start)

Despite decades of research confirming its effectiveness, most students still rely on passive re-reading, highlighting, and massed practice (cramming). There are a few reasons for this:

**It feels less productive.** Re-reading is comfortable. Testing yourself feels harder because it is harder â€” and that difficulty is exactly what makes it effective. Cognitive scientists call this **desirable difficulty**: the slight struggle of retrieval is what causes lasting learning.

**It requires planning.** You need to know what to review and when. Manual spaced repetition â€” keeping a paper schedule of review dates â€” is tedious. This is where software tools become essential.

**Results are slow at first.** On day one of using spaced repetition, you will not feel smarter. But at week four, when you can still recall everything you learned in week one without any extra effort, the compounding effect becomes undeniable.

## How to Apply Spaced Repetition to Your Studies

1. **Break your material into small, discrete facts.** One concept per flashcard. Avoid cramming paragraphs onto a single card.
2. **Study daily, not in long sessions.** Thirty minutes every day beats three hours twice a week for retention.
3. **Use an SRS tool.** Apps like DistillAI, Anki, or similar tools automate the scheduling so you never have to think about when to review.
4. **Always answer before flipping.** The moment of retrieval â€” even a failed one â€” is where the learning happens.
5. **Trust the algorithm.** If a card shows up in your queue, review it. The system knows more about your memory than your feelings in the moment do.

## The Long-Term Payoff

Students who use spaced repetition consistently report a qualitative shift in how learning feels. Instead of the familiar panic of forgetting everything before an exam, they experience a growing library of knowledge that feels solid and accessible.

This is not magic â€” it is neuroscience. Every successful retrieval physically strengthens the myelin sheath around the relevant neural pathways. Over time, the concepts you have studied become as automatic and effortless to recall as your own name.

Spaced repetition does not make studying easier in the moment. It makes learning permanent â€” which is the point.
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

This experience is called the **fluency illusion** â€” one of the most powerful and widespread traps in education. When information feels familiar, our brains mistakenly interpret that familiarity as mastery. But familiarity and recall are completely different cognitive processes.

Passive reading builds familiarity. Active recall builds memory.

## What the Research Actually Shows

The evidence against passive re-reading is overwhelming. A landmark 2010 study by Karpicke and Blunt, published in *Science*, tested four different study methods:

1. Reading a passage once
2. Reading it four times
3. Creating a concept map after reading
4. Practising retrieval (testing themselves) after reading

Students who practised retrieval remembered **50% more** after one week than students who re-read the passage four times. Even more surprisingly, they outperformed students who spent the same time creating detailed concept maps.

The researchers called this the **testing effect** â€” the paradoxical finding that the act of being tested on material improves learning more than studying the material itself.

## Why Retrieval Practice Is So Powerful

When you re-read a passage, your brain executes a relatively simple process: pattern recognition. You see familiar words and your visual cortex confirms: *yes, I have seen this before.* No new memory traces are created.

When you try to recall something from memory, your brain executes a completely different and far more demanding process. It must search through its stored information, reconstruct the relevant concept, and bring it to conscious awareness. This reconstruction is metabolically expensive â€” and that effort is exactly what strengthens the memory.

Think of it like a muscle. Passive reading is like looking at weights. Active recall is like lifting them.

Every time you successfully retrieve a memory, you strengthen the neural pathway associated with it. The memory becomes easier to access next time, and harder to lose. This is the fundamental mechanism behind why retrieval practice works.

## The Failure Modes of Common Study Habits

### Highlighting

Highlighting is the most popular study technique and one of the least effective. When students highlight, they typically mark text that catches their eye â€” without processing what it means or how it connects to other concepts. Research by Dunlosky et al. (2013) rated highlighting as having **low utility** for learning.

Highlighting also creates a false sense of preparation. Students who have highlighted their notes feel as though they have engaged with the material â€” but that engagement is mostly superficial.

### Re-Reading

As discussed above, re-reading exploits familiarity to create a sense of mastery. It is not useless â€” a second read of a genuinely difficult passage can deepen initial understanding â€” but as a review strategy, it is far inferior to testing.

### Summarising

Summarising is more useful than highlighting or re-reading, but it depends heavily on how it is done. Writing a summary from memory (without looking at the text) is essentially retrieval practice. Writing a summary while looking at the text is mostly passive re-reading in a different format.

## How to Do Active Recall Correctly

**Method 1: The Blank Page Technique**
After reading a chapter or finishing a study session, close your notes and write down everything you can remember. Do not look anything up. Just dump your memory onto a blank page. Then, and only then, check your notes to see what you missed.

**Method 2: Flashcards**
The classic. One question on the front, one answer on the back. The critical rule: always attempt to answer before flipping. Thinking *I know this one* and flipping immediately provides zero benefit. The retrieval attempt â€” however difficult â€” is the learning.

**Method 3: The Feynman Technique**
Imagine you are teaching the concept to a twelve-year-old who knows nothing about the subject. Explain it out loud (or in writing) using simple language. When you hit a point where your explanation breaks down, you have found a gap in your understanding. Go back to the source material and fill it.

**Method 4: Practice Questions**
Past exam papers, problem sets, and practice questions are the highest-fidelity form of active recall â€” they simulate the exact conditions under which you will need to retrieve the information. Use them early in your studying, not just as a final check.

## Building Active Recall Into Your Daily Study Routine

The shift from passive to active studying requires a change in mindset. Passive studying feels easier because it is easier. Active recall is uncomfortable â€” you regularly face the unsettling experience of not knowing something you thought you knew.

Embrace that discomfort. It is the signal that learning is happening.

A practical routine:
- **Read a section** (10â€“15 minutes max)
- **Close everything** and try to recall the main ideas (5 minutes)
- **Check gaps** â€” look up only what you missed, do not re-read everything
- **Create flashcards** for anything that needs regular review

If you are using DistillAI, the flashcard review queue handles the scheduling automatically. Your job is to always make a genuine retrieval attempt before revealing the answer.

## The Compounding Effect

Active recall does not just help you pass tomorrow's exam. It creates the kind of durable, accessible knowledge that you can draw on years later.

Students who use passive study techniques typically find that their knowledge evaporates within weeks of an exam. Students who use active recall find that concepts they studied months ago are still crisp and available â€” because they have been retrieved multiple times and the memory has been progressively strengthened.

This compounding effect is the real payoff. You are not just studying for the exam. You are building a knowledge base that stays with you.
    `
  },
  {
    slug: "how-to-study-for-exams",
    title: "How to Actually Study for Exams: A Science-Based Guide",
    description: "A practical, step-by-step framework for exam preparation based on cognitive science â€” not productivity influencer advice.",
    readTime: "9 min read",
    date: "June 28, 2026",
    category: "Exam Prep",
    content: `
## Why Most Exam Advice Is Wrong

Search "how to study for exams" and you will find a flood of advice: colour-code your notes, use the Pomodoro timer, make mind maps, study in a coffee shop to stay focused, listen to lo-fi music. Some of these tips are harmless. Many are distractions dressed up as productivity.

What the research in cognitive science actually recommends looks different â€” and less glamorous. Effective studying is uncomfortable. It involves regular failure. It requires planning that most students skip. But it works.

This guide is based on what the research actually shows, not what feels productive.

## Step 1: Get Clear on What You Need to Know

Before you study anything, you need a complete picture of what you are being tested on. This sounds obvious, but most students start studying without it.

**Do this first:**
- Read through the entire syllabus or learning objectives
- Identify the specific topics and subtopics that will be assessed
- Weight them by likely exam importance (past papers help enormously here)
- Break each topic into discrete, testable facts or concepts

This process â€” essentially building a map of the knowledge you need to acquire â€” is what DistillAI automates when you input your syllabus. But you can do it manually too: take your syllabus, and for each bullet point, ask *What specific questions could an examiner write about this?*

## Step 2: Build a Realistic Study Schedule

Most students make two errors with study schedules: they either do not make one, or they make one that is wildly optimistic and abandon it by day three.

A realistic schedule has these properties:

**It accounts for your actual life.** If you play football on Tuesdays, your Tuesday study session is shorter. Do not pretend otherwise.

**It distributes topics across time rather than blocking them.** Studying every topic in your history syllabus over three consecutive days and then moving on is massed practice â€” it feels thorough but produces poor retention. Better to study a mix of topics daily and return to each one repeatedly.

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

Notice that the two most commonly used study techniques â€” re-reading and highlighting â€” are ranked at the bottom. The most effective technique â€” retrieval practice â€” is what most students skip entirely.

## Step 4: Study in Sessions, Not Marathons

A typical effective study session looks like this:

1. **Brief review** (10 min): Go through flashcards or quick questions on material from previous sessions
2. **New material** (20â€“30 min): Read / watch / listen to new content â€” but actively, taking notes or pausing to predict what comes next
3. **Retrieval practice** (15â€“20 min): Close your notes and test yourself on the new material. Blank page, practice questions, or flashcards
4. **Fill gaps** (10 min): Check what you missed and address it. Do not re-read everything â€” just target the gaps
5. **Update your flashcards** (5 min): Create new cards for any concepts that need regular review

Total: about 60â€“70 minutes. This is more productive than a three-hour session where you re-read and highlight continuously.

## Step 5: Use Past Papers Strategically

Past examination papers are the single most valuable resource for exam preparation, and most students underuse them.

The common mistake is saving past papers for the end of studying, using them purely as a final test. This is backwards. Past papers should be used throughout your preparation, for several reasons:

**They tell you what actually gets tested.** Reading through past papers early reveals patterns â€” certain topics appear consistently, certain types of questions repeat, certain concepts are always tested at a particular depth. This information shapes how you allocate your study time.

**They function as retrieval practice.** Attempting a past paper under timed conditions is the most realistic form of active recall available. It not only reinforces what you know but exposes exactly what you do not.

**They reduce exam anxiety.** Students who have seen dozens of past papers walk into the exam knowing what format to expect. The exam becomes familiar rather than threatening.

**How to use them effectively:**
- Attempt a past paper early (even in week one) to calibrate your starting level
- After attempting, mark carefully and identify every point you lost
- Those gaps go directly into your study focus
- Repeat with another past paper 2â€“3 weeks later to measure progress

## Step 6: Sleep and Your Memory

No study guide is complete without addressing sleep, because the evidence is unambiguous: sleep is when memory consolidation happens.

During slow-wave sleep, your brain replays experiences from the day and transfers information from the hippocampus (short-term store) to the neocortex (long-term store). Without adequate sleep, this transfer is impaired â€” and the memories you formed during the day are far more vulnerable to decay.

Practical implications:
- Do not sacrifice sleep to study. A well-rested brain studying for one hour outperforms an exhausted brain studying for three.
- Study important material before sleep, not first thing in the morning â€” the upcoming sleep period will consolidate it.
- Aim for 7â€“9 hours for adolescents and young adults. This is not laziness; it is neurological necessity.

## Putting It Together: The Week-by-Week Framework

**Week 1 (foundation):**
- Build your knowledge map from the syllabus
- Attempt a past paper to identify your weakest areas
- Create an initial flashcard set for core concepts
- Begin daily reviews

**Weeks 2â€“4 (building):**
- Cover all major topics using the session structure above
- Daily flashcard reviews with FSRS-scheduled repetitions
- Attempt a second past paper at the end of week 4

**Final week:**
- Focus on past papers and weak-area drilling
- No new topics â€” only consolidation
- Maintain sleep schedule; do not all-nighters

The students who perform best under exam conditions are not the ones who studied the longest. They are the ones who studied most effectively â€” and now have clear, retrievable knowledge rather than vague familiarity.
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

SM-2 worked by assigning each flashcard an **ease factor** â€” a multiplier that determined how quickly the review intervals grew. Cards you found easy got longer and longer intervals. Cards you found difficult received shorter intervals, giving you more opportunities to practice them.

SM-2 powered the early versions of SuperMemo and, crucially, the Anki flashcard application â€” still the most widely used SRS tool in the world. For nearly 40 years, SM-2 was the gold standard for spaced repetition.

Then came FSRS.

## What Is FSRS?

FSRS â€” Free Spaced Repetition Scheduler â€” was developed by Jarrett Ye and a team of researchers as a fundamentally new approach to modelling memory. Rather than using the relatively simple ease-factor mechanism of SM-2, FSRS builds a more complete mathematical model of human memory based on two variables:

**Stability (S):** How long a memory can last without review. A stable memory is one that you will still be able to recall weeks or months from now.

**Difficulty (D):** How hard this particular piece of information is for you to retain. Some concepts are inherently more difficult than others, and difficulty also varies between individuals.

These two variables, combined with the time elapsed since your last review, allow FSRS to predict the **retrievability** of each memory â€” the probability that you can successfully recall it right now.

## How FSRS Schedules Reviews

The key insight of FSRS is that the goal of spaced repetition is not to show you cards at fixed intervals â€” it is to show each card at the optimal moment, defined as when your probability of successfully recalling it drops to a target threshold.

This threshold is typically set at around **90% retrievability**. FSRS schedules each review at the predicted moment when your chance of recalling the information drops to 90%, meaning:

- Cards you know very well get long intervals (because their stability is high)
- Cards you find difficult get short intervals (because their stability is low and decays faster)
- Every review is scheduled precisely when it is most needed â€” not too early (which would be wasteful), not too late (which would mean you have already forgotten)

After each review, FSRS updates its model based on how you performed â€” whether you remembered easily, struggled, or forgot entirely â€” and recalculates the stability and difficulty parameters accordingly.

## Why FSRS Outperforms SM-2

Several independent studies have compared FSRS and SM-2 on real Anki user data. The results consistently show that FSRS achieves the target retention rate more accurately, with fewer total reviews required.

The core advantages:

**Individual calibration.** SM-2 uses a single ease factor that adjusts somewhat based on performance. FSRS maintains separate stability and difficulty estimates that are updated independently, giving it a richer model of each card's memory properties.

**Forgetting modelling.** FSRS explicitly models the forgetting curve for each card. SM-2 does not â€” it uses fixed interval multipliers that do not account for the continuous nature of memory decay.

**Reduced over-reviewing.** One criticism of SM-2 is that it tends to schedule easy cards too frequently, wasting review time. FSRS's retrievability model avoids this by only scheduling a review when it is genuinely needed.

**Better handling of lapses.** When you forget a card and have to re-learn it, SM-2 dramatically reduces the interval and resets the ease factor, sometimes making it very difficult for the interval to recover. FSRS handles lapses more gracefully, preserving some of the stability built up before the lapse.

## How DistillAI Uses FSRS

Every flashcard generated by DistillAI is managed by the FSRS algorithm. After each study session, when you rate how well you recalled each flashcard (from "forgot" to "easy"), FSRS updates its memory model for that card and calculates the optimal next review date.

Your review queue shows cards in the order that maximises your retention with the minimum time investment. Cards that are about to be forgotten appear at the top. Cards you know solidly are pushed weeks or months into the future.

The result is a review session that feels shorter than traditional study â€” because you are only reviewing cards that genuinely need attention, rather than grinding through everything repeatedly.

## Practical Implications for Students

Understanding FSRS changes how you should interact with your flashcard reviews:

**Rate honestly.** FSRS is only as good as the data it receives. If you flip a card and barely recall it but rate yourself "easy," the algorithm will give you a long interval â€” and you will likely forget the card. Rate your actual recall honestly. It is better to review something extra once than to forget it before an exam.

**Review every day.** FSRS is designed around daily review sessions. If you skip a day, the algorithm will try to compensate â€” but a backlog of overdue cards is much harder to clear than a consistent daily queue.

**Trust long intervals.** When FSRS tells you that a card does not need review for 45 days, it is not being careless. Its model predicts that your recall probability will still be above 90% at that point. Trust it.

**Do not add too many new cards at once.** Each new card starts with a very short review interval. If you add 100 cards today, you will have 100 cards due for review in the next few days. Build your deck gradually â€” 10 to 20 new cards per day is a manageable pace for most students.

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

The failure rate of self-made study plans is not a moral failing â€” it is a design problem. Traditional study plans fail because they:

**Ignore the forgetting curve.** A plan that says "study Chapter 3 on Monday" does not account for the fact that by Friday, most of what you learned on Monday has already been forgotten. Without built-in review cycles, a study plan teaches you material you will not retain.

**Are built on optimism, not reality.** Students typically estimate how long studying will take based on how long they *want* it to take, not how long it actually takes. A plan that assumes three hours of productive study per day will collapse the first time life intervenes.

**Do not prioritise.** A flat list of topics treats every subject and every concept as equally important. In reality, some topics carry more exam weight than others, and some concepts are foundational to understanding others. A good plan reflects these priorities.

**Have no feedback mechanism.** A static plan cannot adjust when you spend twice as long on a topic as expected, or when you discover three weeks in that you have a gap in your understanding of something you thought you knew.

## What a Good Study Plan Actually Looks Like

An effective study plan has these properties:

**It covers every topic before the exam.** Sounds obvious, but students frequently run out of time because their plan was not comprehensive enough.

**It distributes topics across time.** Rather than studying each topic once in a block, an effective plan returns to topics multiple times over the weeks, exploiting the spacing effect for maximum retention.

**It includes review sessions.** Not just "study new material" sessions â€” dedicated time to review previously covered content.

**It adapts.** When you fall behind or progress faster than expected, the plan adjusts rather than becoming irrelevant.

**It is specific about daily tasks.** "Study biology" is not a plan. "Complete retrieval practice on cell division concepts and review 20 flashcards" is a plan.

## The Manual Approach: Step-by-Step

If you are building a study plan without software, here is the framework:

**Step 1: Inventory your material**
List every topic and subtopic that could appear on the exam. Use your syllabus, past papers, and course notes. Be thorough â€” gaps in your inventory become gaps in your knowledge.

**Step 2: Weight by importance**
Not all topics are equal. Review past papers to identify which topics appear most frequently and carry the most marks. Allocate proportionally more time to high-weight topics.

**Step 3: Estimate time**
For each topic, estimate how many hours you need to genuinely understand it â€” not just skim it. Add 30% to your initial estimate. Optimism about study time is universal and persistent.

**Step 4: Calculate available time**
Count the days until your exam. Subtract unavoidable commitments (school hours, sports, family events, sleep). What is left is your actual study time.

**Step 5: Build in review cycles**
Reserve roughly 30% of your total study time for review rather than new material. Distribute this throughout the plan rather than saving it all for the final week.

**Step 6: Create a daily schedule**
Assign specific topics to specific days. Balance topics from different subjects in each session to prevent mental fatigue. Aim for sessions of 60â€“90 minutes with short breaks.

**Step 7: Track and adjust weekly**
Every week, assess what you actually completed versus what you planned. Adjust the following week's plan accordingly. A plan you never revise is a plan you will abandon.

## Where AI Changes the Equation

The manual process above is effective but time-consuming. It also requires that you make a series of judgment calls â€” about topic weightings, time estimates, and review frequencies â€” that most students are not equipped to make accurately.

This is where AI-powered study planning makes a meaningful difference.

**Automatic breakdown.** When you provide a syllabus or list of topics, an AI system can instantly identify the scope of what needs to be covered and structure it into a logical learning sequence â€” placing foundational concepts before advanced ones, grouping related topics, and flagging potential dependencies.

**Intelligent scheduling.** Rather than asking you to manually calculate when to review each topic, an AI system can apply spaced repetition principles automatically â€” building review cycles into your schedule from the start.

**Adaptive adjustment.** As you progress through the plan, marking topics as complete, an AI system can recalculate the remaining schedule. If you spend more time on one topic than expected, the plan adjusts so you still cover everything before the exam.

**Exam-date awareness.** The plan is built backwards from your exam date, ensuring that the pace is calibrated to your available time. There is no danger of reaching the final week and discovering you have only covered half the syllabus.

## Using DistillAI to Build Your Study Plan

DistillAI is built around this problem. The workflow is designed to remove the planning friction entirely:

1. **Input your syllabus** â€” paste the list of topics you need to cover, or upload a PDF of your course outline
2. **Set your exam date** â€” the system calculates how many study days you have available
3. **Confirm your daily study budget** â€” how many minutes per day can you realistically commit?
4. **Generate your plan** â€” the system breaks your syllabus into a daily schedule that covers all topics with built-in review time

Once your plan is active, each day shows you exactly what to study. After a study session, you can explore any topic in depth using the AI-powered explanations, generate practice questions, and create flashcards that automatically enter your FSRS-powered review queue.

The result is a study system where you never have to think about *what* to study today â€” only about actually doing it.

## Common Mistakes to Avoid

**Starting too late.** The spacing effect requires time to work. A study plan that begins two weeks before an exam is fundamentally limited in how much retention it can build. Eight to twelve weeks of distributed practice produces dramatically better results than two weeks of intensive cramming.

**Treating the plan as fixed.** A study plan is a living document. It should change every week based on your actual progress. Do not feel bound to a schedule that is no longer accurate.

**Over-planning and under-doing.** Some students spend so much time perfecting their study schedule that they have no time left to actually study. The plan is a tool, not the work. Build it quickly, start immediately, and refine as you go.

**Skipping review to cover new material.** When time gets short, the first thing students cut is review. This is exactly backwards. New material without review is wasted effort. Prioritise review over coverage when you are behind.

A well-designed study plan does not guarantee exam success â€” knowledge and understanding do. But it creates the conditions under which genuine learning can happen: sufficient time, the right sequence, and regular reinforcement. Everything else follows from there.
    `
  }

  ,{
    slug: "why-you-forget-everything-you-study",
    title: "Why You Forget Everything You Study (And What the Science Says to Do About It)",
    description: "The frustrating experience of forgetting everything after an exam has a scientific explanation and a scientific solution. Here is why memory fails and how to fix it.",
    readTime: "7 min read",
    date: "July 3, 2026",
    category: "Memory Science",
    author: "DistillAI Team",
    content: `## The Post-Exam Memory Wipe

Most students recognise this experience: you study hard for an exam, perform reasonably well, and then within two weeks cannot recall any of it. This is not memory failure — it is memory working exactly as designed.

Your brain does not store memories like computer files. Memory is reconstructive and dynamic. It operates on two dimensions: storage strength (how deeply encoded something is) and retrieval strength (how easily accessible it is right now). Retrieval strength decays fast without use — this is Ebbinghaus's forgetting curve.

Only retrieval practice — actively testing yourself — increases storage strength in a way that slows future forgetting. Passive re-reading barely touches storage strength.

## Why Cramming Fails

Cramming exploits massed practice, which temporarily raises retrieval strength enough to pass tomorrow's exam. But it does almost nothing for storage strength, because the brain treats rapid repetitions as confirmations of recent memory rather than as opportunities to encode long-term traces. Research by Cepeda et al. (2006), analysing 254 separate studies, found that distributed practice produced 10–30% better retention than massed practice, with dramatically larger advantages for longer retention intervals.

## Why Re-Reading Fails

Passive re-reading builds familiarity — the sense that information is recognisable. But familiarity is not recall. When you try to retrieve a memory from scratch, your brain must activate a broad network of associations and actively rebuild the memory. This reconstruction is metabolically expensive, and that effort is the mechanism of learning. This is why testing yourself feels harder than re-reading: it is harder. And that difficulty is the signal that real learning is happening.

## The Interference Effect

Similar memories compete with each other. Studying biology then chemistry means chemistry content may displace biology content. The fix is interleaving — mixing topics within sessions — which forces the brain to distinguish between similar concepts and strengthens each independently.

## The Sleep Connection

Sleep is when memory consolidation happens. During slow-wave sleep, the hippocampus replays the day's learning and transfers it to long-term neocortical storage. Skipping sleep does not just leave you tired — it prevents the biological process that makes studying permanent.

## What to Do Instead

Space your studying over days and weeks. Test yourself instead of re-reading. Interleave subjects. Protect your sleep. Use spaced repetition software to schedule reviews at optimal intervals. These techniques are not secrets — they just require accepting short-term discomfort in exchange for lasting knowledge.`
  },{
    slug: "sleep-and-memory-learning",
    title: "How Sleep Affects Memory and Learning: What Every Student Should Know",
    description: "Sleep is not just rest — it is when your brain consolidates everything you studied. Here is the science behind sleep and memory, and how to use it to your advantage.",
    readTime: "6 min read",
    date: "July 4, 2026",
    category: "Memory Science",
    author: "DistillAI Team",
    content: `## Sleep Is Not Downtime

The image of the dedicated student pulling an all-nighter is one of the most counterproductive myths in academic culture. Sleep is when the brain does its most important memory work — consolidating, organising, and strengthening everything you studied during the day.

When you study something new, the information is first encoded in the hippocampus — a temporary buffer for new memories. During slow-wave sleep, the hippocampus replays neural patterns from the day and transfers them to the neocortex for permanent long-term storage. Without this transfer, memories remain fragile and easily lost.

## The Sleep Stages That Matter

Slow-wave sleep (SWS), dominant in the first half of the night, is most critical for declarative memory — facts, concepts, the material in your textbooks. This is when hippocampal replay is most active and memory transfer most efficient.

REM sleep, dominant in the second half of the night, is important for pattern recognition, connecting concepts, and procedural memory. Cutting sleep short disproportionately cuts REM sleep — the final hours that help knowledge cohere into an integrated whole.

## What the Research Shows

Walker and Stickgold found that students who slept after learning retained 20–40% more after 24 hours than those who stayed awake. Stickgold et al. demonstrated that performance on a learning task improved significantly after a night of sleep, with no improvement visible immediately after training. The learning happened during sleep.

## Practical Implications

Study your most important material closest to sleep — it receives the strongest consolidation. Do not sacrifice sleep for additional study time: an hour of sleep has a higher learning return than an additional hour of late-night reviewing. Naps of 20–30 minutes before 3pm partially replicate overnight consolidation benefits. Maintain consistent sleep and wake times even on weekends during exam season. Avoid alcohol before bed — it suppresses REM sleep at any dose, even when it makes falling asleep feel easier.

The most effective study schedule treats adequate sleep as a non-negotiable component — not because it feels good, but because the biology of memory requires it.`
  },{
    slug: "exam-anxiety-how-to-overcome",
    title: "Exam Anxiety: What Causes It and How to Overcome It",
    description: "Exam anxiety affects millions of students and can undermine even the best preparation. Here is what the science says about why it happens and what actually helps.",
    readTime: "7 min read",
    date: "July 5, 2026",
    category: "Exam Prep",
    author: "DistillAI Team",
    content: `## More Than Nerves

A small amount of pre-exam arousal is beneficial — the Yerkes-Dodson curve shows performance peaks at moderate arousal. The problem is anxiety that crosses into a state that actively impairs thinking and memory retrieval. Students with high exam anxiety consistently underperform relative to their actual knowledge.

## The Neurological Basis

Exam anxiety is a situational anxiety triggered by evaluation threats. The amygdala activates the stress response, releasing cortisol and adrenaline. Elevated cortisol specifically impairs the prefrontal cortex, which is responsible for working memory, complex reasoning, and inhibitory control — exactly the cognitive functions that exam performance requires. Exam anxiety does not just feel bad: it chemically reduces the cognitive capacity needed to do well.

## What Causes High Exam Anxiety

Inadequate preparation is the most reliable predictor — anxiety increases when the gap between what is expected and what you know is large. Perfectionism makes any deviation from perfect feel catastrophic. A history of poor exam performance creates conditioned associations. Unhelpful self-talk like "I am going to fail" activates and amplifies the stress response, creating a feedback loop where anxiety generates more anxious thoughts.

## Evidence-Based Strategies

Thorough preparation is the most important strategy — no psychological technique compensates for a genuine knowledge gap. Start early, use retrieval practice, sit past papers under timed conditions so the format becomes familiar.

Research by Alison Wood Brooks found that telling yourself "I am excited" rather than "I am calm" improved performance before high-stakes tasks. Both excitement and anxiety are high-arousal states — reframing converts the arousal from threat to approach.

Ramirez and Beilock found in a Science study that students who spent 10 minutes writing about their worries immediately before an exam outperformed those who did not, especially high-anxiety students. Writing externalises anxious thoughts and frees working memory for the exam itself.

Slow, controlled breathing (four counts in, hold two, six counts out) activates the parasympathetic nervous system and measurably reduces cortisol levels within minutes — one of the few interventions with immediate physiological effect.

## The Long Game

Exam anxiety decreases with experience and genuine competence. Students who have taken many exams, sat many past papers, and genuinely know their material are less anxious because they have accurate evidence they can succeed. The most reliable long-term strategy is consistent, high-quality preparation over weeks and months — not crisis management in the days before the exam.`
  },{
    slug: "note-taking-methods-compared",
    title: "Note-Taking Methods Compared: Cornell, Outline, Mind Map, and More",
    description: "Not all note-taking methods are equal. Here is a practical comparison of the most popular techniques and which one the research recommends.",
    readTime: "8 min read",
    date: "July 6, 2026",
    category: "Study Techniques",
    author: "DistillAI Team",
    content: `## Why Method Matters

Most students develop their note-taking style by accident. Research consistently shows that the method you use determines whether your notes support or hinder long-term learning. The critical variable is not how much you write — it is how much you process.

Notes serve two functions: the encoding function (taking notes forces you to process information) and the storage function (a resource to review later). Many students optimise for storage — neat, detailed notes — at the expense of encoding, which requires effortful paraphrasing rather than transcription. The most effective methods force both.

## Cornell Method

The page is divided: a right column (about 70%) for main notes taken during class or reading, a left column (about 30%) for key words and questions added after, and a bottom section for a 2-3 sentence summary of the page. The cue column naturally generates retrieval practice questions. The summary requires synthesising content rather than copying it. Best for review-focused learning and textbook reading. Weakness: the cue column and summary are frequently skipped, which defeats the purpose.

## Outline Notes

Main topics as headings, subtopics as bullet points, details as sub-bullets. Easy to create quickly and a natural fit for well-structured lectures. The risk is degeneration into transcription — writing everything down without processing it. Mueller and Oppenheimer (2014) found that students who took verbatim notes retained less than those who paraphrased, regardless of the method used.

## Mind Maps

A central concept with branches radiating outward for related ideas, which in turn have their own branches. Forces thinking about relationships between concepts rather than just listing them. Good for conceptual overviews and understanding how ideas connect. The experimental evidence for mind maps' superiority over other methods is weaker than their popularity suggests — the benefit may come from the processing required to build the map rather than the format itself.

## Feynman Technique

Write a concept name, explain it in plain language as if teaching a twelve-year-old, identify where your explanation breaks down, return to the source to fill gaps, simplify further using analogies. Maximises encoding function. Best for deep processing of already-captured material and checking genuine comprehension. Too slow for use during a lecture.

## The Research Recommendation

Process more, transcribe less. Any method that forces paraphrasing, questioning, and synthesis outperforms methods that optimise for comprehensive capture. The optimal approach combines methods: outline during class for speed, Cornell processing immediately after for depth, retrieval practice during review sessions.`
  },{
    slug: "pomodoro-technique-does-it-work",
    title: "The Pomodoro Technique: Does It Actually Work? A Science-Based Look",
    description: "The Pomodoro Technique is one of the most popular study methods in the world. But what does the evidence actually say? Here is an honest assessment.",
    readTime: "6 min read",
    date: "July 7, 2026",
    category: "Study Techniques",
    author: "DistillAI Team",
    content: `## What It Is

Developed by Francesco Cirillo in the 1980s and named after a tomato-shaped kitchen timer: work with complete focus for 25 minutes, take a 5-minute break, repeat. After four cycles, take a 15-30 minute break.

## What the Evidence Shows

The technique has not been extensively studied in controlled academic settings. But several well-established principles from cognitive psychology support its core ideas. Attention restoration theory (Kaplan, 1995) suggests that directed attention is a finite resource that depletes with use and is restored through rest — consistent with the Pomodoro breaks. Implementation intentions — specific plans about when and where you will act — are among the most effective tools for overcoming procrastination. The Pomodoro's structure of "work on this specific task for the next 25 minutes" functions as an implementation intention.

## Where It Works

Starting is the hardest part. Committing to 25 minutes feels far less aversive than committing to "study until I understand this chapter." Many students report that simply starting a Pomodoro — because 25 minutes feels manageable — gets them past the inertia of beginning. The technique also helps reduce phone distraction by providing defined break times, which reduces the compulsion to check during the work period.

## Where It Fails

Some cognitive tasks require 40-60 minutes of uninterrupted focus to reach a productive state. Research on flow (Csikszentmihalyi) suggests it takes 15-20 minutes to enter a deeply absorbed state. Interrupting every 25 minutes means minimal total flow time per Pomodoro.

Research by Ericsson on deliberate practice suggests that 90-minute focus blocks with genuine recovery periods are closer to optimal for deep, complex work. For demanding conceptual tasks — mathematical proofs, programming problems, essay writing — the 25-minute limit may be counterproductive.

## The Verdict

The Pomodoro technique's greatest benefit is solving procrastination by making starting easier. Its limitations are real for complex, deep work. Used as one tool among many — alongside active recall and spaced repetition — it is a legitimate part of an effective study system. Used as a complete strategy for all types of studying, it is insufficient.`
  },{
    slug: "how-to-create-effective-flashcards",
    title: "How to Create Effective Flashcards: 10 Rules That Actually Work",
    description: "Most flashcards are created badly, which is why most flashcard decks get abandoned. These 10 rules will help you build cards that produce real, lasting recall.",
    readTime: "7 min read",
    date: "July 8, 2026",
    category: "Study Techniques",
    author: "DistillAI Team",
    content: `## Why Most Flashcard Decks Die

Flashcard decks are abandoned at high rates. The failure is usually not motivation — it is card design. Poorly designed cards produce difficult, unrewarding review sessions. The result is avoidance and eventual abandonment. Good card design is the difference between a deck that grows with you and one you delete in week three.

## Rule 1: One Fact Per Card

Cramming multiple facts onto a single card makes it hard to grade, hard to schedule, and produces poor retrieval practice. Break compound cards into individual facts. This allows the SRS to schedule each independently based on how well you actually know it.

## Rule 2: Test Understanding, Not Recognition

Compare "What did Ebbinghaus discover?" with "What does the forgetting curve predict about retention after 24 hours without review?" The second question requires specific knowledge and cannot be answered with vague impressions.

## Rule 3: Use Your Own Words

Cards written in your own language are significantly easier to recall than textbook language, because they were encoded with personal associations. Never copy and paste from sources.

## Rule 4: Add Context

Instead of "What is the hippocampus?" try "Which brain structure acts as a temporary buffer for new memories before sleep-based consolidation?" Context creates retrieval hooks by activating related knowledge networks.

## Rule 5: Use Images When Relevant

The picture superiority effect is well-documented — images are remembered more reliably than words for the same concepts. Include images for anatomy, chemistry diagrams, geography, and any visual content.

## Rule 6: Make Answers Unambiguous

One question, one correct answer. Ambiguous cards produce inconsistent performance that gives the scheduling algorithm incorrect data about your actual knowledge level.

## Rule 7: Bidirectional Cards for Language Learning

Passive recognition and active production are different skills requiring separate training. Create both directions: native to target language and target to native.

## Rule 8: Avoid Yes/No Cards

These are almost always too easy and generate useless SRS data. A card asking "Is the hippocampus involved in memory?" will be answered correctly every time. Replace with how, why, or what questions.

## Rule 9: Pace Card Creation

Add 10-20 new cards per day maximum. Adding 200 cards in one day creates an unmanageable review backlog that kills decks within a week.

## Rule 10: Review Every Day

Spaced repetition requires daily review. Five minutes every day is vastly superior to one hour once a week. Missed days create backlogs that become demoralising quickly. Treat it as non-negotiable.`
  },{
    slug: "study-environment-does-location-matter",
    title: "Study Environment: Does Where You Study Actually Matter?",
    description: "Library vs. bedroom vs. coffee shop — does your study location affect how much you learn? The research has a nuanced but practical answer.",
    readTime: "6 min read",
    date: "July 9, 2026",
    category: "Study Techniques",
    author: "DistillAI Team",
    content: `## Context-Dependent Memory

Recall is improved when the retrieval context matches the encoding context. In a classic 1975 study, Godden and Baddeley had scuba divers learn word lists either underwater or on land, then tested recall in both environments. Words learned underwater were recalled better underwater. This suggests that always studying in the same location creates context-dependent memories that may be harder to access in a different exam hall.

The practical implication: vary your study locations, and occasionally study in conditions that resemble your exam setting — quiet, seated at a desk, without music.

## Noise

Mehta et al. (2012) found that moderate ambient noise (approximately 70 decibels, similar to a coffee shop) slightly improved creative performance compared to silence. However, for analytical reasoning and factual recall — what most exams test — silence consistently outperforms ambient noise. Music with lyrics impairs reading comprehension and memory recall reliably in research settings, because the linguistic content competes with linguistic processing during studying. Slow, calm instrumental music is less disruptive than lyrical or fast-tempo music.

## Lighting and Temperature

Natural light is associated with better mood and reduced fatigue compared to artificial lighting. Studies in educational settings show better performance in rooms with more natural light. Cognitive performance peaks at slightly cool temperatures — around 21-22 degrees Celsius. Warmer environments increase fatigue and reduce alertness faster.

## The Phone Problem

Ward et al. (2017) found that having a smartphone on a desk — even face down, even turned off — reduced available cognitive capacity compared to having it in another room. The phone draws constant low-level attention simply by being present.

This is the single most impactful environmental factor for most students. Put the phone in another room, or use an app blocker during study sessions.

## What Actually Matters Most

A student using active recall in a slightly noisy coffee shop will outperform a student passively re-reading in a silent library. Environment creates the conditions for focus — it does not guarantee learning. Fix the phone, ensure reasonable quiet, and then focus on what you do within that environment. That is what determines how much you learn.`
  },{
    slug: "study-habits-of-top-students",
    title: "What Do Top Students Actually Do Differently? A Research-Based Look",
    description: "The gap between top students and struggling students is rarely intelligence. It is strategy. Here is what the research reveals about how high performers actually study.",
    readTime: "7 min read",
    date: "July 10, 2026",
    category: "Exam Prep",
    author: "DistillAI Team",
    content: `## The Intelligence Myth

Cognitive ability predicts academic performance, but study strategies predict performance independently of ability. Two students of equal intelligence using different methods produce dramatically different results. Understanding what top students do differently is actionable. Intelligence largely is not.

## They Test Themselves Constantly

The most consistent finding in research on high-performing students is that they use self-testing far more than average or below-average students. Roediger and Karpicke (2006) found that students who spent 75% of study time testing themselves and 25% reading significantly outperformed students who spent all their time reading — even though the reading group spent more time with the material.

Where an average student reads a chapter and moves on, a high performer reads a section, closes the book, and tries to recall the main ideas. This is not just a pre-exam behaviour — it is a habit of mind throughout all their studying.

## They Distribute Their Studying

Top students are rarely cramming the night before. What looks like "barely studying" is usually consistent distributed effort that started weeks or months earlier. Research shows distributed practice produces 30-50% better retention than massed practice of the same total duration.

## They Prioritise Understanding Over Coverage

Deep learners prioritise understanding the most important concepts thoroughly. Surface learners try to cover everything, producing shallow familiarity that collapses under exam pressure. High performers identify the highest-yield concepts early and spend disproportionate time on those.

## They Use Past Papers From Week One

Average students save past papers for final revision. High performers use them from the first week to understand the exam standard, identify knowledge gaps while there is still time to fill them, and get the highest-quality retrieval practice available. Students who have attempted ten past papers before the actual exam walk in having seen almost every type of question likely to appear.

## They Have Consistent Routines

Regular study at the same time each day removes the cognitive overhead of deciding when to start. When studying at a fixed time is simply what you always do, you do not need to motivate yourself — you just start.

## What They Do Not Do

They do not spend primary study time re-reading and highlighting. They do not study with social media or notifications available. They do not equate time spent at a desk with productive studying. They do not save difficult topics for later — hard material gets scheduled first, while energy and focus are highest.

The gap between top students and struggling students is a cluster of learnable behaviours: self-testing, distributed practice, strategic use of past papers, consistent routine, and a bias toward understanding over coverage. These are habits, and habits are acquirable.`
  },{
    slug: "how-to-prepare-for-university-exams",
    title: "How to Prepare for University Exams: A Complete Guide",
    description: "University exams are different from school exams. More material, less structure, higher stakes. Here is a complete, phase-by-phase guide to preparing effectively.",
    readTime: "9 min read",
    date: "July 11, 2026",
    category: "Exam Prep",
    author: "DistillAI Team",
    content: `## Why University Exams Feel Different

Students who excelled at school often struggle with university exams not because the material is impossibly harder, but because the scaffolding disappears. Teachers no longer structure the curriculum around exam readiness, send reminders, or map lecture content closely to questions. The responsibility for organising, scheduling, and executing preparation falls entirely on you.

## Phase 1: Orientation — Weeks 1 to 3 of Semester

Effective preparation begins at the semester's start. Find out exactly what the exam covers, what format it takes (essay, multiple choice, short answer), and how much time is available. Download every past paper available for the course. Do not attempt them yet — scan them to understand what types of questions appear and which topics recur most frequently.

Build a complete knowledge map: a list of every topic that may be examined. This is your territory. Having it from week one means your studying is always oriented toward the exam, not just toward the most recent lecture.

## Phase 2: Active Learning Throughout the Semester

For each week of the semester: take notes by paraphrasing rather than transcribing. After each lecture, spend ten minutes writing everything you can recall from memory — this is retrieval practice from the very beginning. Do a weekly thirty-minute review of everything covered that week.

Create five to ten flashcards per lecture on the most important concepts. At semester end you will have 150-200 cards that have been reviewed multiple times. This is dramatically more effective than creating 300 cards the week before the exam and attempting to learn them all at once.

## Phase 3: Structured Exam Preparation — 4 to 6 Weeks Before

Six weeks before the exam, shift primary focus. Audit your knowledge map: honestly rate each topic as confident or weak. Allocate more preparation time to weak topics.

Start past papers immediately in timed conditions. Attempt a full paper in exactly the time available for the real exam, without notes. Mark yourself rigorously against the provided marking scheme. Note every mark you lose and why. This single activity — repeated across multiple past papers — is the highest-return preparation available.

## Phase 4: Consolidation — Final 2 Weeks

Stop learning new material unless there is a critical gap. Sit one complete past paper per week under timed conditions. Focus your flashcard review on high-priority overdue cards. For essay or long-answer exams, practise writing full answers against the clock — writing speed matters more than most students anticipate.

## Exam Day Strategy

Read the entire paper before answering any question — this allows passive processing of all questions while you work on earlier ones. Allocate time explicitly per question based on marks. Start with a question you know well to establish momentum. If you are stuck on a question, mark it and move on — the retrieval process continues in the background.`
  },{
    slug: "interleaving-blocked-practice-difference",
    title: "Interleaving vs. Blocked Practice: Why Mixing Topics Makes You Learn Better",
    description: "Studying one topic at a time feels logical and productive. Research shows it is one of the least effective ways to study. Here is why interleaving produces better results.",
    readTime: "6 min read",
    date: "July 12, 2026",
    category: "Study Techniques",
    author: "DistillAI Team",
    content: `## The Intuitive Approach (And Why It Fails)

Most students study one topic at a time in sequence — all algebra, then all geometry, then all statistics. This is blocked practice. It feels logical, progressive, and productive. Research consistently shows it produces worse long-term learning than the alternative, especially for retention measured days or weeks after studying.

## What Interleaving Is

Interleaving mixes different topics, problem types, or subjects within a single study session. Instead of twenty algebra problems in a row, you alternate: three algebra, two geometry, three statistics, two algebra, and so on. Same material, same total time, dramatically different retention.

## The Research Evidence

Rohrer and Taylor (2007) had students practise either blocked or interleaved mathematics problems over several sessions. On an immediate test, blocked-practice students scored slightly higher. One week later, interleaved-practice students scored approximately 40% higher. This pattern — blocked practice appearing better immediately, interleaved winning at delayed testing — replicates across dozens of studies in mathematics, science, language learning, sports, and medical education.

## Why Interleaving Works

With blocked practice, each problem of the same type can be solved by confirming the method you just applied. Minimal strategic thinking required — the approach is still activated from the previous problem.

With interleaved practice, you cannot rely on carry-over from the previous problem. Before each problem, you must identify what type of problem it is and select the appropriate approach. This identification and selection process is difficult — and that difficulty is exactly what strengthens both the methods themselves and the ability to recognise when each applies.

## Why It Matters for Exams

Exams do not sort questions by type. They mix topics and require identifying what kind of problem you face before solving it. Students trained on blocked practice encounter this identification step for the first time under exam pressure. Students trained on interleaved practice have done it hundreds of times. The advantage is substantial.

## Why Students Avoid It

Interleaving feels harder. You make more errors. Progress seems slower. Research confirms that students prefer blocked practice even immediately after demonstrating better performance following interleaved practice. The feeling of productive studying and the reality of productive studying are reliably at odds.

## How to Implement It

Mix problem types within practice sets rather than completing all of one type before moving on. Study different topics within the same subject in a single session. Use a spaced repetition system — the algorithm naturally interleaves cards from across your entire deck, producing the benefits of interleaving automatically during every review session.`
  }
];

export const getPostBySlug = (slug) => blogPosts.find(p => p.slug === slug);
