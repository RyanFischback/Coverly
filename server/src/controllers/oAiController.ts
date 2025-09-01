import OpenAI from "openai";
import dotenv from "dotenv";
import { Request, Response } from "express";

dotenv.config();

const openai = new OpenAI({
  organization: "org-qOo3S3vv5AmPTFQe1qs4OaJz",
  project: process.env.PROJECT_ID,
  apiKey: process.env.OPENAI_API_KEY,
});

type OptionalPayload = {
  companyName?: string;
  roleTitle?: string;
  location?: string;
  jobUrl?: string;
  hiringManager?: string;
  tone?: "professional" | "friendly" | "enthusiastic" | "formal" | "gen-z";
  custom?: string; // JSON string of { [k: string]: string }
};

const isNonEmpty = (v?: string) => typeof v === "string" && v.trim().length > 0;

// Compact whitespace to save tokens
const compact = (txt?: string) =>
  String(txt || "")
    .replace(/\r/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

// Strip accidental <html>/<body> wrappers
const stripOuterHtmlWrappers = (html: string) =>
  html
    .replace(/<\/?html[^>]*>/gi, "")
    .replace(/<\/?body[^>]*>/gi, "")
    .trim();

export const getOAIResult = async (req: Request, res: Response) => {
  try {
    const {
      jobPosting,
      userInfo,
      companyDetails = "",
      extraInfo = "",
      optional = {},
    }: {
      jobPosting?: string;
      userInfo?: string;
      companyDetails?: string;
      extraInfo?: string;
      optional?: OptionalPayload | undefined;
    } = req.body || {};

    // ---- Validation ----------------------------------------------------------
    if (!isNonEmpty(jobPosting) || !isNonEmpty(userInfo)) {
      return res
        .status(400)
        .json({ error: "Both job posting and resume are required." });
    }

    const postingWordCount = String(jobPosting).trim().split(/\s+/).length;
    if (postingWordCount < 30) {
      return res
        .status(400)
        .json({
          error: "Please paste the full job posting (at least ~30 words).",
        });
    }

    // ---- Parse optional.custom safely ----------------------------------------
    let customFields: Record<string, string> = {};
    if (optional && isNonEmpty(optional.custom)) {
      try {
        const parsed = JSON.parse(String(optional.custom));
        if (parsed && typeof parsed === "object") {
          for (const [k, v] of Object.entries(parsed)) {
            if (isNonEmpty(k) && isNonEmpty(String(v))) {
              customFields[k] = String(v);
            }
          }
        }
      } catch {
        // Ignore malformed JSON; don't fail the request
      }
    }

    const {
      companyName = "",
      roleTitle = "",
      location = "",
      jobUrl = "",
      hiringManager = "",
      tone = "",
    } = (optional || {}) as OptionalPayload;

    // ---- Date formatting used in the letter header ---------------------------
    const formattedDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // ---- Compact large blocks ------------------------------------------------
    const posting = compact(jobPosting);
    const resume = compact(userInfo);
    const companyNotes = compact(companyDetails);
    const otherNotes = compact(extraInfo);

    // ---- Tone instruction ----------------------------------------------------
    const toneInstruction = isNonEmpty(tone)
      ? `Override base tone → Write the entire letter in a ${tone} style.`
      : "Base tone → professional and engaging.";

    // ---- System rules --------------------------------------------------------
    const systemRules = `
You are an expert career advisor and precise professional writer.
Never fabricate facts beyond provided inputs. Be concrete, crisp, and aligned to the job.

${toneInstruction}

OUTPUT FORMAT:
- Business letter, 250–300 words.
- Include today's date: ${formattedDate}.
- If company and/or location appear (in the posting or optional details), add a simple header block:
  Company on one line; Location on the next.
- Salutation: if a hiringManager is provided, use "Dear ${
      isNonEmpty(hiringManager) ? hiringManager : "<HiringManager>"
    },"; otherwise "Dear Hiring Manager,".
- End with a confident call-to-action and a professional sign-off.
- Return ONLY simple HTML using <p> paragraphs (no <html>, <body>, or inline styles).

CONTENT RULES:
- Match the role title exactly if provided: ${
      isNonEmpty(roleTitle) ? roleTitle : "(none)"
    }.
- Align ONLY to requirements from the job posting; do not invent tools, employers, or metrics not in the resume/notes.
- If companyName is provided, refer to it by name.
- If jobUrl is provided, you may say it was listed on the company's careers page (no raw URL).
- Use location only if it feels natural (relocation/remote context is fine, but do not force it).
`.trim();

    // ---- Build messages ------------------------------------------------------
    const optionalDetails = {
      companyName: isNonEmpty(companyName) ? companyName : null,
      location: isNonEmpty(location) ? location : null,
      jobUrl: isNonEmpty(jobUrl) ? jobUrl : null,
      hiringManager: isNonEmpty(hiringManager) ? hiringManager : null,
      tone: isNonEmpty(tone) ? tone : "professional",
      customFields: Object.keys(customFields).length ? customFields : null,
    };

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: systemRules },
      { role: "user", content: `JOB POSTING:\n${posting}` },
      { role: "user", content: `RESUME:\n${resume}` },
      {
        role: "user",
        content: `OPTIONAL DETAILS:\n${JSON.stringify(optionalDetails)}`,
      },
    ];

    if (companyNotes) {
      messages.push({
        role: "user",
        content: `COMPANY NOTES:\n${companyNotes}`,
      });
    }
    if (otherNotes) {
      messages.push({ role: "user", content: `OTHER NOTES:\n${otherNotes}` });
    }

    if (isNonEmpty(tone)) {
      messages.push({
        role: "user",
        content: `Final Reminder: Ensure the letter is written in a ${tone} style.`,
      });
    }

    if (process.env.NODE_ENV !== "production") {
      console.log("---- Cover Letter Request ----");
      console.log("System rules:\n", systemRules);
      console.log("Messages:\n", JSON.stringify(messages, null, 2));
      console.log("---- End Request ----");
    }

    const request = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.6,
      max_tokens: 700,
      messages,
    });

    let content = request.choices?.[0]?.message?.content?.trim() || "";
    if (!content) {
      return res
        .status(502)
        .json({ error: "No content returned from the model." });
    }

    // ---- Post-process --------------------------------------------------------
    content = stripOuterHtmlWrappers(content);
    if (!/<p[\s>]/i.test(content)) {
      const paras = content
        .split(/\n{2,}/)
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => `<p>${s.replace(/\n+/g, " ")}</p>`)
        .join("\n");
      if (paras) content = paras;
    }

    return res.status(200).json(content);
  } catch (error: any) {
    if (error?.status === 429) {
      return res.status(429).json({ message: error.message || "Rate limited" });
    }
    console.error("OpenAI error:", error);
    return res.status(500).json({ message: "An unexpected error occurred" });
  }
};
