import { supabase } from '../lib/supabase';

export async function translateText(text: string): Promise<string> {
  try {
    const { data, error } = await supabase.functions.invoke('translate', {
      body: { text },
    });

    if (error) throw error;
    return data.translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
}