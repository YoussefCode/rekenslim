import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Content {
  id: string;
  key: string;
  value: string;
  description?: string;
}

export const useContent = () => {
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('content')
        .select('*');

      if (error) throw error;

      const contentMap = (data || []).reduce((acc, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {} as Record<string, string>);

      setContent(contentMap);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const getContent = (key: string, defaultValue = '') => {
    return content[key] || defaultValue;
  };

  return { content, loading, getContent, refetch: fetchContent };
};