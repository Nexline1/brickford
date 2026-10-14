// Brickford — lecture summaries, AI 310 (LLM Engineering)
//
// T-033. Every entry here was written FROM its source after reading the whole of
// it: a CS336 lecture from its transcript, a Unit II reading from the page the
// lesson links (fetched from the official repository that the page is built
// from, where the page's own host is unreachable — see the T-033 notes). Nothing
// is written from memory or from what a lecture "probably" covers. A lecture
// whose source could not be fetched has no entry; T-033's unavailable.md says
// which and why.
//
// Same shape as the other summary files, plus two optional fields on each check:
//   at  — the second in the video where the point is taught (video sources);
//   src — the section of the reading where it is taught (papers and readings).
// tools/verify-content.js holds the quiz to its size (5 / 6 / 8 by length, 6 for
// a reading), recomputes every numeric answer independently, and bounds how
// often the answer is the unique longest option, so a check cannot be passed by
// picking the longest one.
//
// No concepts and no figures: DAR.CONCEPTS and DAR.FIG are linear algebra, so
// `concepts: []` is the correct value here.
window.DAR = window.DAR || {};

DAR.SUMMARIES = Object.assign(DAR.SUMMARIES || {}, {

  "ai310.1.0": {
    takeaway: "One call to pipeline() hides three steps — preprocess, run the model, post-process — and choosing a model is mostly choosing which half of the Transformer the task needs: an encoder to understand the whole input, a decoder to generate, or both to turn one sequence into another.",
    beats: [
      { t: "NLP is the field, LLMs are the current tool", d: "NLP covers classifying sentences, labelling each word, extracting answers and generating text. LLMs are a subset defined by scale, by doing many tasks without task-specific training, and by learning from examples in the prompt. Their limits come with them: hallucination, bias, finite context windows and heavy compute." },
      { t: "pipeline() is three steps in one call", d: "The text is preprocessed into something the model can read, the model runs, and its raw predictions are post-processed into a label and a score. The default model for a task is downloaded once and cached; running it again reuses the cached weights, not a cached answer." },
      { t: "The task decides what the output can be", d: "Zero-shot classification takes the candidate labels at call time, so no fine-tuning on your labels is needed. Question answering EXTRACTS a span from the context you pass; it does not generate an answer. Named-entity recognition regroups sub-word pieces such as S, ##yl, ##va, ##in back into one entity." },
      { t: "Pretrain once, fine-tune many times", d: "Language models are pretrained self-supervised — the objective is computed from the text itself, causal (next word) or masked (fill the blank). Fine-tuning then trains on labelled data for one task, needing far less data, time and money than training from scratch, which is why sharing weights matters." },
      { t: "Encoder, decoder, and the mask that keeps training honest", d: "The encoder's attention sees the whole sentence; the decoder generates and may only attend to words already produced. In training the decoder is fed the whole target, so an attention mask hides positions at and after the word being predicted. Architecture is the skeleton; a checkpoint is the weights loaded into it." },
      { t: "Every task is a body plus a head", d: "BERT for classification adds a linear head on the final [CLS] state; for token classification, a head per token; for question answering, start and end logits for a span. GPT-2 predicts the next token with labels shifted by one. ViT cuts an image into 16x16 patches and treats them as tokens, with a [CLS] token just like BERT." },
      { t: "Pick the architecture by asking three questions", d: "Bidirectional or one-way understanding? Generating new text or analysing existing text? Transforming one sequence into another? Classification, NER and extractive QA point to an encoder; open generation and chat to a decoder; translation and summarisation to an encoder-decoder. Full attention is quadratic in length, which is what Longformer's local windows and Reformer's LSH attention work around." },
      { t: "Inference has two phases with different costs", d: "Prefill tokenizes and processes the whole prompt at once, which is computationally intensive; it sets the time to first token. Decode then produces one token at a time, each step attending to everything before it, which is memory-intensive. Temperature, top-k, top-p, repetition penalties and stop sequences shape what decode picks; the KV cache trades memory for not recomputing the past." },
      { t: "Bias survives fine-tuning", d: "bert-base-uncased, trained on Wikipedia and BookCorpus rather than the open web, still fills 'This woman works as a [MASK]' with gendered jobs. Fine-tuning on your own data does not remove what pretraining put there." },
    ],
    worked: "Before reaching for a model, name the task's output. A label for the whole text is a classification head on an encoder; a label per token is token classification; a span copied out of a document is extractive QA; new text is a decoder, or an encoder-decoder when the new text is a transformation of an input. Then find a checkpoint already fine-tuned for that task on the Hub and run it through pipeline() before writing any training code.",
    watch: "Treating the question-answering pipeline as if it could answer from knowledge. It extracts a span from the context it is given, so a context that does not contain the answer still yields a confident-looking span — just a wrong one.",
    concepts: [],
    checks: [
      { q: "You call a sentiment-analysis pipeline on a raw sentence and get back a label and a score. What happened in between?", opts: ["The text was preprocessed into model inputs, the model ran, and its predictions were post-processed into a label and score", "The model read the raw string directly; pipeline() only chose which pretrained checkpoint to download for the task", "A pretrained model was briefly fine-tuned on your sentence, and the fine-tuned copy produced the label and score", "The sentence was looked up in a cache of earlier answers, and a stored prediction was returned when one matched"], a: 0, src: "1.3 Transformers, what can they do? — Working with pipelines",
        expl: "pipeline() connects a model with its preprocessing and postprocessing. The model never sees a raw string, and nothing is trained at call time. What gets cached is the downloaded model, so a second run skips the download — not the computation." },
      { q: "The question-answering pipeline is given a question and a context paragraph. What can its answer be?", opts: ["Any sentence the model composes from its training data, guided by the context", "A summary of the context rewritten so that it addresses the question", "Only a span copied out of the context, located by start and end positions", "A yes or no, with the context used only to compute the confidence score"], a: 2, src: "1.3 Question answering; 1.5 Question answering",
        expl: "The pipeline extracts information from the provided context; it does not generate. Under the hood a span-classification head predicts start and end logits over the context's tokens, so the answer is always a piece of the text you passed in." },
      { q: "During training a translation decoder is fed the entire target sentence at once. Why can it not simply copy the word it is asked to predict?", opts: ["Because the target sentence is shuffled before it reaches the decoder", "Because an attention mask hides that position and every later one", "Because the decoder reads only the encoder's output, never the target", "Because training uses a different language for the target each time"], a: 1, src: "1.4 The original architecture",
        expl: "Feeding the whole target speeds training, so the decoder is masked: predicting the fourth word, its attention can use positions 1 to 3 only. The second attention layer still sees the encoder's output for the WHOLE source sentence, because word order differs between languages." },
      { q: "ViT splits a 224 x 224 image into non-overlapping 16 x 16 patches. How many patch embeddings does the encoder receive, before the [CLS] token is added?", num: 196, src: "1.5 Image classification",
        expl: "Each side holds 224 / 16 = 14 patches, so there are 14 x 14 = 196. Each patch becomes one embedding — the image is 'tokenized' into patches — and a learnable [CLS] embedding is prepended, so the sequence is 197 long." },
      { q: "You need to tag every word of a sentence as person, organisation, location or none. Which architecture does the chapter point you to, and why?", opts: ["Decoder-only, because modern LLMs are decoders and handle every task best", "Encoder-decoder, because the output is itself a sequence of labels to generate", "Encoder-only, because each word's label depends on context on both sides of it", "Decoder-only, because labelling one word at a time is a left-to-right process"], a: 2, src: "1.6 Choosing the right architecture",
        expl: "Named-entity recognition is understanding, not generation: a word's label can depend on the words after it as well as before. Encoders attend in both directions, and a token-classification head on top gives one label per token." },
      { q: "Users say the first word of a chatbot's reply takes a long time to appear, but the rest then streams quickly. Which phase is the bottleneck?", opts: ["Decode, because each new token must attend to all previous ones", "Prefill, because the whole prompt is processed at once first", "Sampling, because top-p must sort the vocabulary every step", "Tokenization of the output, which runs after generation ends"], a: 1, src: "1.8 The two-phase inference process; Key performance metrics",
        expl: "Time to first token is primarily set by prefill, which tokenizes and runs the entire input through the model before anything is generated. Decode then governs time per output token; it is the memory-intensive phase, and the KV cache is what speeds it up." },
    ],
  },

});
