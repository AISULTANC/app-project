export interface ParsedDocument {
  content: string;
  fileName: string;
  fileType: string;
  fileSize: number;
}

export type SupportedFileType = 'pdf' | 'docx' | 'txt' | 'md' | 'csv';

export const ALLOWED_FILE_TYPES: SupportedFileType[] = ['pdf', 'docx', 'txt', 'md', 'csv'];

export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'text/markdown',
  'text/csv',
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function getFileExtension(fileName: string): string {
  return fileName.split('.').pop()?.toLowerCase() || '';
}

export function getFileType(fileName: string): SupportedFileType | null {
  const ext = getFileExtension(fileName);
  const typeMap: Record<string, SupportedFileType> = {
    pdf: 'pdf',
    docx: 'docx',
    txt: 'txt',
    md: 'md',
    markdown: 'md',
    csv: 'csv',
  };
  return typeMap[ext] || null;
}

export function isAllowedFileType(fileName: string): boolean {
  return getFileType(fileName) !== null;
}

export function validateFile(file: File): { valid: boolean; error?: string } {
  if (!isAllowedFileType(file.name)) {
    return {
      valid: false,
      error: `File type not supported. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}`,
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File too large. Maximum size is ${Math.round(MAX_FILE_SIZE / 1024 / 1024)}MB`,
    };
  }

  return { valid: true };
}

export async function parseFile(file: File): Promise<ParsedDocument> {
  const fileType = getFileType(file.name);
  
  if (!fileType) {
    throw new Error('Unsupported file type');
  }

  let content: string;

  switch (fileType) {
    case 'pdf':
      content = await parsePDF(file);
      break;
    case 'docx':
      content = await parseDOCX(file);
      break;
    case 'txt':
    case 'md':
    case 'csv':
      content = await parseTextFile(file);
      break;
    default:
      throw new Error(`Cannot parse file type: ${fileType}`);
  }

  return {
    content: content.trim(),
    fileName: file.name,
    fileType: fileType,
    fileSize: file.size,
  };
}

async function parseTextFile(file: File): Promise<string> {
  return await file.text();
}

async function parsePDF(file: File): Promise<string> {
  try {
    const pdfjsLib = await import('pdfjs-dist');
    
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    const textParts: string[] = [];
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      textParts.push(pageText);
    }
    
    return textParts.join('\n\n');
  } catch (error) {
    console.error('PDF parsing error:', error);
    throw new Error('Failed to parse PDF file. The file may be corrupted or password-protected.');
  }
}

async function parseDOCX(file: File): Promise<string> {
  try {
    const mammoth = await import('mammoth');
    
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    
    return result.value;
  } catch (error) {
    console.error('DOCX parsing error:', error);
    throw new Error('Failed to parse DOCX file. The file may be corrupted.');
  }
}

export function truncateContent(content: string, maxLength: number = 50000): string {
  if (content.length <= maxLength) {
    return content;
  }
  
  return content.slice(0, maxLength) + '\n\n[Content truncated - document too long to process entirely]';
}

export function splitIntoChunks(content: string, chunkSize: number = 40000): string[] {
  const chunks: string[] = [];
  const paragraphs = content.split(/\n\n+/);
  let currentChunk = '';

  for (const paragraph of paragraphs) {
    if ((currentChunk + paragraph).length > chunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = paragraph;
    } else {
      currentChunk += '\n\n' + paragraph;
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}
