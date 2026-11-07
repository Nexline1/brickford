# T-035: Sunday revision PDF

## The owner's words (8 Oct; marked a priority on 23 Oct)
"Same day [Sunday], create a well-visualized PDF with summaries of all that week's videos, so I can revise easily. Add an export button I can only use on Sunday. My top priority is that everything gets summarized. If a video is too long and you didn't summarize it, use ... the Yt T MCP to extract that video's transcript. Give me a sample of what the PDF would look like here, so I can improve it."

## Phase 1: the sample (this item, now)
- Cover the plan week that ends on Sunday 25 Oct 2026, every lecture `scheduledFor` puts on its study days, in plan order.
- Build it from the app's own data (`DAR.SUMMARIES[cid.unit.lesson]`: takeaway, beats, worked, watch, concepts, checks) rendered by a print layout. Generate the PDF with Chromium print-to-PDF (Playwright), A4.
- **Design:**
  - **Cover:** week number, dates, courses and hours.
  - **Contents:** one line per lecture.
  - **One section per lecture:**
    - course and lecture title;
    - the takeaway as a callout;
    - the beats as a numbered list, since they really are a sequence;
    - the worked example;
    - "watch for";
    - the key concepts;
    - 3 self-check questions with answers at the back.
  - **The week's end:** a one-page "what this week established".
  - **Look:** the approved Apple system (inset groups, iOS type scale, system colours), designed for paper: white page, readable print sizes, KaTeX math rendered.
- **No-summary lectures** are listed on a "Not yet summarised" page, each with its video link. They are never padded or invented.
- **Output:** `loop/design/sample-revision-week.pdf`, plus PNGs of 3 pages, for the owner to improve.
- **Not in phase 1:** no app code change. The generator is a script under `tools/`, which phase 2 reuses.

## Phase 2: the feature (after the owner approves the sample)
- An in-app `#/revision/<week>` print layout, the same design as the sample.
- An Export button, enabled only on Sundays (`dow === 0` in the app's local date). On other days it reads "Opens on Sunday".
- Export uses the browser's print to save as PDF. Brickford is an ordinary web page, so `window.print()` works there.
- A verify-design check and plants.
