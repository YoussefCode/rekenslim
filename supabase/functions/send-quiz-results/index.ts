import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.0';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface UserInfoPayload {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  parentName?: string | null;
}

interface RequestPayload {
  userInfo: UserInfoPayload;
  answers: number[];
  questionIds: string[];
  level: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userInfo, answers, questionIds, level }: RequestPayload = await req.json();

    if (!userInfo || !Array.isArray(answers) || !Array.isArray(questionIds)) {
      throw new Error('Invalid payload');
    }
    if (answers.length !== questionIds.length) {
      throw new Error('Answers and questionIds length mismatch');
    }

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL') as string;
    const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;
    if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
      throw new Error('Missing Supabase environment variables');
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    // Fetch correct answers securely
    const { data: questionRows, error: qError } = await supabaseAdmin
      .from('questions')
      .select('id, correct_answer')
      .in('id', questionIds);

    if (qError) throw qError;

    const correctMap = new Map<string, number>();
    questionRows?.forEach((q) => correctMap.set(q.id as string, q.correct_answer as number));

    // Compute score
    let score = 0;
    for (let i = 0; i < questionIds.length; i++) {
      const qid = questionIds[i];
      const correct = correctMap.get(qid);
      if (typeof correct === 'number' && answers[i] === correct) score++;
    }
    const total = questionIds.length;
    const percentage = Math.round((score / total) * 100);

    // Store submission
    const insertPayload = {
      score,
      total_questions: total,
      percentage,
      answers,
      first_name: userInfo.firstName,
      last_name: userInfo.lastName,
      email: userInfo.email,
      phone_number: userInfo.phoneNumber,
      parent_name: userInfo.parentName ?? null,
      level: level || 'basis',
    };

    const { data: inserted, error: insertError } = await supabaseAdmin
      .from('quiz_submissions')
      .insert(insertPayload)
      .select()
      .single();

    if (insertError) throw insertError;

    // Send email
    const html = `
      <h2>Nieuwe Quiz Resultaten van Rekenslim.nl</h2>
      <h3>Deelnemer Informatie:</h3>
      <ul>
        <li><strong>Naam:</strong> ${userInfo.firstName} ${userInfo.lastName}</li>
        <li><strong>Email:</strong> ${userInfo.email}</li>
        <li><strong>Telefoon:</strong> ${userInfo.phoneNumber}</li>
        ${userInfo.parentName ? `<li><strong>Ouder/Begeleider:</strong> ${userInfo.parentName}</li>` : ''}
      </ul>
      <h3>Quiz Resultaten (${level === 'basis' ? 'Basis' : 'Niveau 2F'}):</h3>
      <ul>
        <li><strong>Score:</strong> ${score} van ${total} vragen correct</li>
        <li><strong>Percentage:</strong> ${percentage}%</li>
        <li><strong>Datum:</strong> ${new Date(inserted.submitted_at).toLocaleDateString('nl-NL')}</li>
      </ul>
      <h3>Antwoorden Details:</h3>
      <p>De gedetailleerde antwoorden zijn opgeslagen in de database met ID: ${inserted.id}</p>
      <hr />
      <p><em>Dit bericht is automatisch gegenereerd door Rekenslim.nl</em></p>
    `;

    const primaryRecipient = "Testuitslagen@rekenslim.nl";

    const { data: emailData, error: emailError }: any = await resend.emails.send({
      from: "Rekenslim <onboarding@resend.dev>",
      to: [primaryRecipient],
      subject: `Nieuwe Quiz Resultaten ${level === 'basis' ? 'Basis' : 'Niveau 2F'} - ${userInfo.firstName} ${userInfo.lastName}`,
      html,
    });

    if (emailError) {
      console.error("Resend primary send failed:", emailError);
      // If we're on a Resend testing plan, only the owner's email is allowed.
      // Fallback to the owner email so you still receive results while the domain is unverified.
      if (emailError.statusCode === 403 &&
          typeof emailError.error === 'string' &&
          emailError.error.includes('You can only send testing emails')) {
        const fallbackRecipient = "jouw-email@example.com"; // Vervang dit met jouw gewenste fallback email
        const fallbackHtml = `
          <p><strong>LET OP:</strong> Fallback geactiveerd wegens Resend testlimiet. Bedoelde ontvanger: ${primaryRecipient}.</p>
          <hr />
          ${html}
        `;
        const { error: fallbackError }: any = await resend.emails.send({
          from: "Rekenslim <onboarding@resend.dev>",
          to: [fallbackRecipient],
          subject: `[FALLBACK] Nieuwe Quiz Resultaten ${level === 'basis' ? 'Basis' : 'Niveau 2F'} - ${userInfo.firstName} ${userInfo.lastName}`,
          html: fallbackHtml,
        });
        if (fallbackError) {
          console.error("Resend fallback send failed:", fallbackError);
          throw new Error(fallbackError.error || fallbackError.message || 'Email fallback mislukt');
        }
        console.log(`Fallback email verzonden naar ${fallbackRecipient}`);
      } else {
        throw new Error(emailError.error || emailError.message || 'Email verzenden mislukt');
      }
    } else {
      console.log("Email verzonden naar primaire ontvanger:", primaryRecipient, emailData);
    }

    return new Response(
      JSON.stringify({ success: true, score, total_questions: total, percentage, submissionId: inserted.id }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-quiz-results function:", error);
    return new Response(
      JSON.stringify({ error: error.message ?? 'Unknown error' }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
