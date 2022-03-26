/**
 * Class representing a TypeOrm Exception format
 * @author Sam Rutakayile
 * @version 1.0
 */
export class TypeOrmException extends Error {
  code: string;
  name: string;
  message: string;
  detail: string;
}
