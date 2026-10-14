# T-047: a story coach built on Claude, inside the app

## Source
The owner, 2026-10-14: "I want an AI brain to read the transcript and compare what the lectures are saying with the story format and story structure versus what I have recorded as a story. I want it to find filler words that should be removed."

The owner chose **Claude inside the app, with their own Anthropic API key saved on the device** (`loop/inbox.md`, 2026-10-14). That approves the dependency below.

The mockup is `loop/design/specimen-practice-coach.png`, the right-hand card: "Story coach · checked against SPCH 100", with ✓ / ! / ✗ rows, each citing the SPCH 100 unit and lecture it comes from.

## Depends on
- T-046: the transcript on the clip record.
- T-037: SPCH 100's summaries.

## The dependency (approved, pinned)
- **The official SDK.** Use `@anthropic-ai/sdk@0.128.0` (published 2026-09-22). Load it on demand, only when the coach runs:
  ```js
  import("https://cdn.jsdelivr.net/npm/@anthropic-ai/sdk@0.128.0/+esm")
  ```
- **The client.** Create it with `new Anthropic({ apiKey, dangerouslyAllowBrowser: true })`. The SDK's README says browser use is disabled by default and is enabled by explicitly setting `dangerouslyAllowBrowser: true`.
- **Use the SDK's typed errors.** Never build raw fetch calls, and never match error messages as strings.
- **The model is `claude-opus-5-5`**, the current default. Leave `thinking` unset (adaptive) and set `output_config.effort: "medium"` explicitly.
- **Refusal fallback.** Use `client.beta.messages.create` with `betas: ["server-side-fallback-2026-07-01"]` and `fallbacks: "default"`. Before relying on it, verify on the SDK's docs that it combines with `output_config.format`. If it doesn't, drop the fallback and record that in `verification/notes.md`.
- **Structured output** uses this request field:
  ```js
  output_config: {
    effort: "medium",
    format: { type: "json_schema", schema: COACH_SCHEMA }
  }
  ```
  The schema is:
  ```js
  {
    rows: [{ verdict: "ok" | "half" | "no", title, detail, unit, lecture }],
    fillers: [{ text, count }],
    tighter_ending?: string,
    summary: string
  }
  ```
  Validate the parsed JSON against the schema in code, and reject anything that doesn't match.

## The API key
- **Where it lives:** `localStorage["brickford_anthropic_key"]`, on this device only.
  - It is never in `S`, the sync payload, the chain, a log, an error message or a toast.
  - It is never shown back after saving; the settings show "Key saved · ends in …4 characters".
- **Settings:** a "Story coach" section under Sync devices (or a sheet from the coach card) with three actions:
  - **Paste key:** saves it.
  - **Test:** sends one tiny request, a `max_tokens: 1`-class call.
  - **Forget key:** removes it.
- **No key yet:** the coach card says "Add your Anthropic API key to get coaching. It stays on this device; each story uses a little of your API credit."
- **No gate may read this key.** Extend the rule that already protects `brickford_gh_token`: the harness never calls `getItem` on either key.

## The prompt
- **System prompt.** A frozen system prompt carries the coach's rubric, built from SPCH 100's own content.
  - **Which lectures:** the takeaways and beats of the structure lectures:
    - Unit II, the story spine;
    - Unit III, the moment, the stakes and the ending;
    - Unit XI, choosing stories;
    - Unit XII, hooks and payoff.
  - **How it's built:** generate it from `DAR.SUMMARIES` at runtime, in a fixed order, so it changes only when the content does.
  - **Each principle** carries its unit and lecture title, so every row can cite where it comes from.
  - **Caching:** put `cache_control: { type: "ephemeral" }` on the system block. Nothing volatile (dates, ids) goes in the system prompt.
- **User message.** It contains the kind (story or humour), the recorded seconds, and the transcript text only.
  - Never send the audio.
  - Never send the title if the owner renamed it with personal names. Simplest: send no title at all.
- **The model is instructed to:**
  - judge only against the provided principles;
  - cite the unit and lecture for every row;
  - list fillers verbatim;
  - write a tighter ending only when the ending is the weakest point;
  - keep to at most 5 rows;
  - be direct and kind.

## Behaviour
- **Running it.** "Coach this story" sits on a clip that has a transcript. The coach never runs by itself: it costs money, so the reader always presses.
- **Storing the result.** The result goes on the clip's IndexedDB record as `coach: { at, model, rows, fillers, tighter_ending, summary, usage }`. It never goes to localStorage or the sync payload.
- **The card** renders the stored result, as in the mockup.
  - It shows a muted line: "The coach sends the transcript text, never the audio, to Claude with your own key."
  - It offers Re-run.
- **Errors.** Each one shows one plain line and keeps the transcript. Re-run stays available.

  | Error | Line |
  |---|---|
  | AuthenticationError | "Key not accepted. Check it in Story coach settings." |
  | RateLimitError | "Too many requests. Try again in a minute." |
  | Overloaded / 5xx | "Claude is busy. Try again shortly." |
  | Network failure | "Offline." |
  | `stop_reason: "refusal"` after the fallback | "The coach couldn't review this one." |
  | Schema mismatch | "The coach's answer couldn't be read. Try again." |

- **A render is a read.** Nothing is sent and nothing is written because a page rendered.

## Tests (no network: stub the SDK)
- **The stub.** In verify-flows and verify-sync-loop, route the pinned jsdelivr URL to a fake ES module. Its `default` class `Anthropic`:
  - records the request it was given;
  - returns canned JSON;
  - can be switched to throw `AuthenticationError`, `RateLimitError` or `APIError` (classes exported by the stub, matching the SDK's names).
- **verify-flows checks:**
  - With no key, the card prompts for one.
  - Saving a key never echoes it back.
  - "Coach this story" sends exactly one request with:
    - model `claude-opus-5-5`;
    - effort `medium`;
    - the JSON schema;
    - a cached system block;
    - the transcript;
    - no audio and no title.
  - The rows render with their citations.
  - The result is stored on the clip record only.
  - Each error path shows its line.
  - Forget key works.
  - There are no page errors.
- **verify-sync-loop:** no key, coach result or transcript appears in any push or in localStorage state.
- **verify-design** at 1440 and 390, both themes: the coach card, the rows, the citations' contrast (4.5:1 or better), and 44px controls.
- **Plants, each exiting 1:**
  - (a) the key is written into `S` or the push;
  - (b) the coach runs on render;
  - (c) audio is sent;
  - (d) a row without a citation is accepted;
  - (e) a gate reads `brickford_anthropic_key`.
- **All gates green,** plus clip under the LA timezone.

## Out of scope
- Coaching that runs automatically.
- Using any other model, unless the owner says so.
- Syncing coach results.
- A server-side proxy.
