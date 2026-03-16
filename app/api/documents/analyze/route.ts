import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateText } from '@/lib/ai/gemini';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const DOCUMENT_SYSTEM_PROMPT = `You are an AI assistant helping a student analyze their uploaded documents. 
Your role is to:
- Summarize the main ideas and key points
- Answer questions about the document content
- Extract important information
- Help explain complex concepts

Be clear, concise, and helpful. Use bullet points when appropriate.`;

export async function POST(request: NextRequest) {
  try {
    const { documentId, question, action } = await request.json();

    if (!documentId) {
      return NextResponse.json(
        { error: 'Document ID required' },
        { status: 400 }
      );
    }

    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization required' },
        { status: 401 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get document content
    const { data: document, error: fetchError } = await supabase
      .from('documents')
      .select('file_name, content_text')
      .eq('id', documentId)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    if (!document.content_text) {
      return NextResponse.json(
        { error: 'Document has no text content' },
        { status: 400 }
      );
    }

    // Generate prompt based on action
    let userPrompt: string;

    switch (action) {
      case 'summarize':
        userPrompt = `Please provide a comprehensive summary of the following document "${document.file_name}". Include the main ideas, key points, and important details.`;
        break;
      case 'key_points':
        userPrompt = `Extract the key points from the following document "${document.file_name}". List them as bullet points.`;
        break;
      case 'explain':
        userPrompt = question 
          ? `Based on the following document "${document.file_name}", ${question}`
          : `Explain the main concepts from the following document "${document.file_name}" in simple terms.`;
        break;
      case 'quiz':
        userPrompt = `Generate quiz questions based on the following document "${document.file_name}". Include multiple choice questions with answers.`;
        break;
      case 'custom':
      default:
        if (!question) {
          return NextResponse.json(
            { error: 'Question required for custom analysis' },
            { status: 400 }
          );
        }
        userPrompt = `Using the following document "${document.file_name}", ${question}`;
    }

    // Append document content
    const fullPrompt = `${userPrompt}\n\n--- Document Content ---\n${document.content_text}`;

    // Generate AI response
    const response = await generateText(DOCUMENT_SYSTEM_PROMPT, fullPrompt);

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Document AI error:', error);
    
    if (error instanceof Error && error.message.includes('GEMINI_API_KEY')) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to analyze document' },
      { status: 500 }
    );
  }
}
