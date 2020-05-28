import { catchError, map } from 'rxjs/operators';
import { FileDTO } from '../dto/file.dto';
import { from, Observable } from 'rxjs';
import { I_POST_FILE } from '@app/interface';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostDTO } from '../dto/post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectModel('File') private readonly fileModel: Model<I_POST_FILE>,
  ) {}

  addFile(fileInfo: FileDTO): Observable<I_POST_FILE> {
    const file = new this.fileModel(fileInfo);
    const savedFile$ = file.save();

    return from(savedFile$).pipe(
      map((fileInfo: I_POST_FILE) => fileInfo),
      catchError(error => {
        throw new InternalServerErrorException(error);
      }),
    );
  }

  addPost(postBody: PostDTO) {
    console.warn(postBody);
  }
}
