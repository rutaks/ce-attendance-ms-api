import slugify from 'slugify';
import { customAlphabet } from 'nanoid';

const alphabet = 'abcdefghijklmnopqrstuvwxyz1234567890';

/**
 * Generates a slug based on text received
 * Appends uid at the end of the slug
 * @param text text to slugify
 * @returns slugified text
 */
export const generateSlug = (text: string): string => {
  const nanoid = customAlphabet(alphabet, 10);
  return slugify(`${text} ${nanoid(18).toLowerCase()}`, {
    replacement: '-',
    remove: undefined,
    lower: true,
    strict: true,
    locale: 'vi',
    trim: true,
  });
};
