import { catchError, map } from 'rxjs/operators';
import { FileDTO, PostDTO } from '@dtos';
import { from, Observable } from 'rxjs';
import { I_CONNECTION, I_POST, I_POST_FILE } from '@interfaces';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostMapper } from '@mappers';
import { SanitizerUtil } from '@utils';

@Injectable()
export class PostService {
  constructor(
    @InjectModel('File') private readonly fileModel: Model<I_POST_FILE>,
    @InjectModel('Post') private readonly postModel: Model<I_POST>,
    @InjectModel('Connection')
    private readonly connectionModel: Model<I_CONNECTION>,
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

  addPost(postBody: PostDTO): Observable<I_POST> {
    const post = new this.postModel(postBody);

    return from(post.save()).pipe(
      map((postInfo: I_POST) => SanitizerUtil.sanitizedResponse(postInfo)),
      map((post: I_POST) => PostMapper.addPostResponseMapper(post)),
      catchError(error => {
        throw new InternalServerErrorException(error);
      }),
    );
  }

  async getConnection(connectionID: string): Promise<I_CONNECTION> {
    return this.connectionModel
      .findById(connectionID)
      .lean()
      .exec();
  }
}
