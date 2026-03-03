import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userInfo, score, totalQuestions, fouten, conclusie, omdraaiFouten, totaalFout, categoryBreakdown } = await req.json();

    const percentage = Math.round((score / totalQuestions) * 100);

    const foutenHtml = fouten.length > 0
      ? fouten.map((f: any) => `<li>${f.v} | Ingevuld: <b>${f.u}</b> (Correct: ${f.c}) [${f.cat}]</li>`).join("")
      : "<li>Geen fouten</li>";

    const categoryHtml = categoryBreakdown && Object.keys(categoryBreakdown).length > 0
      ? Object.entries(categoryBreakdown).map(([cat, count]) => `<li><b>${cat}:</b> ${count} fout(en)</li>`).join("")
      : "";

    const riskColor = conclusie.includes("VERDENKING") ? "#d63031" : "#27ae60";

    const html = `
      <h2>Dyscalculie Screening Resultaten - Rekenslim.nl</h2>
      <h3>Deelnemer Informatie:</h3>
      <ul>
        <li><b>Naam:</b> ${userInfo.firstName} ${userInfo.lastName}</li>
        <li><b>Email:</b> ${userInfo.email}</li>
        <li><b>Telefoon:</b> ${userInfo.phoneNumber}</li>
        ${userInfo.parentName ? `<li><b>Ouder/Begeleider:</b> ${userInfo.parentName}</li>` : ""}
      </ul>
      <h3>Resultaten:</h3>
      <ul>
        <li><b>Score:</b> ${score} van ${totalQuestions} (${percentage}%)</li>
        <li><b>Conclusie:</b> <span style="color:${riskColor};font-weight:bold;">${conclusie}</span></li>
        <li><b>Omdraai-fouten:</b> ${omdraaiFouten}</li>
        <li><b>Totaal fout/te laat:</b> ${totaalFout}</li>
      </ul>
      ${categoryHtml ? `<h3>Fouten per categorie:</h3><ul>${categoryHtml}</ul>` : ""}
      <h3>Detail fouten:</h3>
      <ul>${foutenHtml}</ul>
      <hr/>
      <p><em>Automatisch gegenereerd door Rekenslim.nl - Dyscalculie Screening</em></p>
    `;

    const primaryRecipient = "testuitslagen@rekenslim.nl";

    const { error: emailError }: any = await resend.emails.send({
      from: "Rekenslim <onboarding@resend.dev>",
      to: [primaryRecipient],
      subject: `Dyscalculie Screening - ${userInfo.firstName} ${userInfo.lastName} - ${conclusie}`,
      html,
    });

    if (emailError) {
      console.error("Resend primary send failed:", emailError);
      if (emailError.statusCode === 403 && typeof emailError.error === "string" && emailError.error.includes("You can only send testing emails")) {
        const fallbackRecipient = "yelmourabit@outlook.com";
        const { error: fallbackError }: any = await resend.emails.send({
          from: "Rekenslim <onboarding@resend.dev>",
          to: [fallbackRecipient],
          subject: `[FALLBACK] Dyscalculie Screening - ${userInfo.firstName} ${userInfo.lastName}`,
          html: `<p><b>FALLBACK:</b> Bedoelde ontvanger: ${primaryRecipient}</p><hr/>${html}`,
        });
        if (fallbackError) {
          console.error("Fallback failed:", fallbackError);
          throw new Error(fallbackError.error || "Email fallback mislukt");
        }
      } else {
        throw new Error(emailError.error || "Email verzenden mislukt");
      }
    }

    return new Response(JSON.stringify({ success: true, score, totalQuestions, percentage }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message ?? "Unknown error" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
