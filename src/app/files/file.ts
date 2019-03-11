import { Model } from '@clarity/models';
import { Subscription } from 'rxjs';
import { FileInfo, FileState } from '@progress/kendo-angular-upload';

export class File extends Model implements FileInfo {
  id?: string;
  contentDisposition?: string;
  contentType?: string;
  extension?: string;
  httpSubscription?: Subscription;
  name: string;
  rawFile?: any;
  size: number;
  state?: FileState;
  uid?: string;
  uri: string;
  validationErrors?: string[];
}
