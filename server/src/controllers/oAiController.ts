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
  location?: string;        // e.g., Halifax, NS
  jobUrl?: string;
  hiringManager?: string;   // e.g., Jane Doe
  tone?: "professional" | "friendly" | "enthusiastic" | "formal" | "gen-z";
  custom?: string;          // JSON string of { [k: string]: string }
};

const isNonEmpty = (v?: string) => typeof v === "string" && v.trim().length > 0;

export const getOAIResult = async (req: Request, res: Response) => {
  try {
    // ---- Pull & normalize body ------------------------------------------------
    const {
      jobPosting,
      userInfo,          // "Your Resume" in the new UI
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

    // ---- Validation -----------------------------------------------------------
    if (!isNonEmpty(jobPosting) || !isNonEmpty(userInfo)) {
      return res
        .status(400)
        .json({ error: "Both job posting and resume are required." });
    }

    // Require the posting to be reasonably complete (heuristic)
    const postingWordCount = String(jobPosting).trim().split(/\s+/).length;
    if (postingWordCount < 30) {
      return res.status(400).json({
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

    // ---- Build a structured, explicit prompt --------------------------------
    // We use fenced sections so the model clearly sees each input block.
    const prompt = `
Write a tailored cover letter using the inputs below. Follow the rules strictly.

# FORMAT
- Standard business letter.
- Length: 250–300 words.
- Include today's date: ${formattedDate}.
- If company/location are provided, place a simple header block with company and location on separate lines (no street address unless provided).
- Salutation:
  - If hiringManager is provided, use "Dear ${hiringManager},".
  - Else use "Dear Hiring Manager,".
- Close with a confident call-to-action and a professional sign-off.

# TONE
- Base tone: professional and engaging.
- If a tone override is provided, adapt accordingly: ${tone || "(auto)"}.

# CONTENT RULES
- Match the role title exactly if provided: ${roleTitle || "(none)"}.
- Align the candidate’s experiences ONLY with requirements from the job posting. Do not invent tools, companies, or metrics not present in the resume or extra details.
- If companyName is provided, refer to it by name. If jobUrl is provided, you may reference that the role was listed on the company’s careers page (no raw URL in the letter).
- Optionally weave in location if it adds relevance (e.g., relocation, remote eligibility), but do not force it.

# OPTIONAL/CUSTOM DETAILS
The following optional context may be used if it improves the letter. Keep mentions concise and natural.

CompanyName: ${companyName || "(none)"}
Location: ${location || "(none)"}
JobURL: ${jobUrl || "(none)"}
HiringManager: ${hiringManager || "(none)"}
CustomFields JSON: ${Object.keys(customFields).length ? JSON.stringify(customFields) : "(none)"}

# INPUTS
## JOB POSTING
\`\`\`
${jobPosting}
\`\`\`

## CANDIDATE RESUME (PASTE)
\`\`\`
${userInfo}
\`\`\`

## COMPANY NOTES (OPTIONAL)
\`\`\`
${companyDetails}
\`\`\`

## OTHER NOTES (OPTIONAL)
\`\`\`
${extraInfo}
\`\`\`

# OUTPUT
Return only the final letter in simple HTML using <p> paragraphs (no <html>, <body>, or inline styles).
`.trim();

    // ---- Call OpenAI (Chat Completions) --------------------------------------
    const request = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.6,
      max_tokens: 700,
      messages: [
        {
          role: "system",
          content:
            "You are an expert career advisor and precise professional writer. You never fabricate facts beyond provided inputs. You write crisply, with concrete achievements tied to the job.",
        },
        { role: "user", content: prompt },
      ],
    });

    const content = request.choices?.[0]?.message?.content?.trim();
    if (!content) {
      return res
        .status(502)
        .json({ error: "No content returned from the model." });
    }

    // Respond with HTML (frontend renders via v-html, and also copies plain text)
    return res.status(200).json(content);
  } catch (error: any) {
    if (error?.status === 429) {
      return res.status(429).json({ message: error.message || "Rate limited" });
    }
    console.error("OpenAI error:", error);
    return res.status(500).json({ message: "An unexpected error occurred" });
  }
};
