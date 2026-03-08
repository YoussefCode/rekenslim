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
    const { studentEmail, domainName, score, totalQuestions, questions } = await req.json();

    const percentage = Math.round((score / totalQuestions) * 100);

    const questionsHtml = questions && questions.length > 0
      ? questions.map((q: any) => {
          const isCorrect = q.selectedAnswer === q.correctAnswer;
          const color = isCorrect ? "#27ae60" : "#d63031";
          const icon = isCorrect ? "✅" : "❌";
          return `<li style="margin-bottom:8px;">
            ${icon} <b>${q.questionText}</b><br/>
            Antwoord: <span style="color:${color};font-weight:bold;">${q.selectedOption}</span>
            ${!isCorrect ? ` (Correct: ${q.correctOption})` : ""}
          </li>`;
        }).join("")
      : "<li>Geen vragen</li>";

    const html = `
      <h2>Leerling Oefenresultaten - Rekenslim.nl</h2>
      <h3>Informatie:</h3>
      <ul>
        <li><b>Leerling:</b> ${studentEmail}</li>
        <li><b>Domein:</b> ${domainName}</li>
      </ul>
      <h3>Resultaten:</h3>
      <ul>
        <li><b>Score:</b> ${score} van ${totalQuestions} (${percentage}%)</li>
      </ul>
      <h3>Detail per vraag:</h3>
      <ul>${questionsHtml}</ul>
      <hr/>
      <p><em>Automatisch gegenereerd door Rekenslim.nl - Leerling Leeromgeving</em></p>
    `;

    const primaryRecipient = "testuitslagen@rekenslim.nl";

    const { error: emailError }: any = await resend.emails.send({
      from: "Rekenslim <onboarding@resend.dev>",
      to: [primaryRecipient],
      subject: `Oefenresultaten - ${studentEmail} - ${domainName} - ${percentage}%`,
      html,
    });

    if (emailError) {
      console.error("Resend send failed:", emailError);
      if (emailError.statusCode === 403 && typeof emailError.error === "string" && emailError.error.includes("You can only send testing emails")) {
        const fallbackRecipient = "yelmourabit@outlook.com";
        const { error: fallbackError }: any = await resend.emails.send({
          from: "Rekenslim <onboarding@resend.dev>",
          to: [fallbackRecipient],
          subject: `[FALLBACK] Oefenresultaten - ${studentEmail} - ${domainName}`,
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

    return new Response(JSON.stringify({ success: true }), {
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
