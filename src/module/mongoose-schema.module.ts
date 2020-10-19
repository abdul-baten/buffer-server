import {
  ConnectionSchema,
  FacebookOverviewSchema,
  FacebookPerformanceSchema,
  FacebookPostsSchema,
  FacebookVideoSchema,
  MediaSchema,
  PostSchema,
  UserSchema
} from '@schemas';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  exports: [
    MongooseModule.forFeature([
      { name: 'Connection',
        schema: ConnectionSchema
      },
      { name: 'Media',
        schema: MediaSchema
      },
      { name: 'Post',
        schema: PostSchema
      },
      { name: 'User',
        schema: UserSchema
      },
      { name: 'Facebook_Overview_Insight',
        schema: FacebookOverviewSchema
      },
      { name: 'Facebook_Performance_Insight',
        schema: FacebookPerformanceSchema
      },
      { name: 'Facebook_Post_Insight',
        schema: FacebookPostsSchema
      },
      { name: 'Facebook_Video_Insight',
        schema: FacebookVideoSchema }
    ])
  ],
  imports: [
    MongooseModule.forFeature([
      { name: 'Connection',
        schema: ConnectionSchema
      },
      { name: 'Media',
        schema: MediaSchema
      },
      { name: 'Post',
        schema: PostSchema
      },
      { name: 'User',
        schema: UserSchema
      },
      { name: 'Facebook_Overview_Insight',
        schema: FacebookOverviewSchema
      },
      { name: 'Facebook_Performance_Insight',
        schema: FacebookPerformanceSchema
      },
      { name: 'Facebook_Post_Insight',
        schema: FacebookPostsSchema
      },
      { name: 'Facebook_Video_Insight',
        schema: FacebookVideoSchema }
    ])
  ]
})
export class MongooseSchemaModule {}
