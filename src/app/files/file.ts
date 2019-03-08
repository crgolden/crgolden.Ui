import { Model } from '@clarity/models';

export class File extends Model {
  id?: string;
  uri: string;
  name: string;
  contentType: string;
}
