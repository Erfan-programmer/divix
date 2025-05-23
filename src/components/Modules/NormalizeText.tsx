export const NormalizeText = (text: string | undefined | null): string => {
  if (!text) return '';
  
  return text
    .replace(/ي/g, 'ی')                 
    .replace(/ك/g, 'ک')                 
    .replace(/\u200C/g, ' ')            
    .replace(/[^\w\sآ-ی]/g, '')        
    .replace(/\s+/g, ' ')              
    .replace(/-/g, ' ')             
    .trim()
    .toLowerCase()
    .split(' ')
    .sort()
    .join(' ');
};
