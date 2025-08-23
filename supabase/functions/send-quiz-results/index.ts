import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.0';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface QuizSubmission {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  parent_name?: string;
  score: number;
  total_questions: number;
  percentage: number;
  answers: any[];
  submitted_at: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const submission: QuizSubmission = await req.json();

    console.log("Sending quiz results email for:", submission.first_name, submission.last_name);

    const emailResponse = await resend.emails.send({
      from: "Rekenslim <onboarding@resend.dev>",
      to: ["yelmourabit@outlook.com"],
      subject: `Nieuwe Quiz Resultaten - ${submission.first_name} ${submission.last_name}`,
      html: `
        <h2>Nieuwe Quiz Resultaten van Rekenslim.nl</h2>
        
        <h3>Deelnemer Informatie:</h3>
        <ul>
          <li><strong>Naam:</strong> ${submission.first_name} ${submission.last_name}</li>
          <li><strong>Email:</strong> ${submission.email}</li>
          <li><strong>Telefoon:</strong> ${submission.phone_number}</li>
          ${submission.parent_name ? `<li><strong>Ouder/Begeleider:</strong> ${submission.parent_name}</li>` : ''}
        </ul>
        
        <h3>Quiz Resultaten:</h3>
        <ul>
          <li><strong>Score:</strong> ${submission.score} van ${submission.total_questions} vragen correct</li>
          <li><strong>Percentage:</strong> ${submission.percentage}%</li>
          <li><strong>Datum:</strong> ${new Date(submission.submitted_at).toLocaleDateString('nl-NL')}</li>
        </ul>
        
        <h3>Antwoorden Details:</h3>
        <p>De gedetailleerde antwoorden zijn opgeslagen in de database met ID: ${submission.id}</p>
        
        <hr>
        <p><em>Dit bericht is automatisch gegenereerd door Rekenslim.nl</em></p>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-quiz-results function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);