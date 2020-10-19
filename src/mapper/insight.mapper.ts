import jsonTransformer from 'jsonata';
import type { IFbPost } from '@interfaces';

export class InsightMapper {
  static fbPostResponseMapper (page_info: any): IFbPost {
    const response = `{
        "totalLikes": $.likes.summary.total_count,
        "totalComments": $.comments.summary.total_count,
        "totalShares": $.shares.count,
        "createdTime": $.created_time,
        "totalReactions": $.reactions.summary.total_count,
        "url": $.permalink_url,
        "hashTags": [$.message_tags.name],
        "status": $.message,
        "id": $.id,
        "attachment": $.picture,
        "insights": [
            {
                "engagedUsers": $.insights.data[0].values.value,
                "engagedFan": $.insights.data[1].values.value,
                "postImpressions": $.insights.data[2].values.value,
                "postReach": $.insights.data[3].values.value,
                "postImpressionsOrganic": $.insights.data[4].values.value,
                "postImpressionsPaid": $.insights.data[5].values.value,
                "postClicks": $.insights.data[6].values.value,
                "negativeFeedback": $.insights.data[7].values.value
            }
        ]
    }`;

    return jsonTransformer(response).evaluate(page_info);
  }

  static fbPostDataResponseMapper (page_info: any): Record<string, string | number> {
    const response = `{
        "totalLikes": [$.likes.summary.total_count],
        "totalComments": [$.comments.summary.total_count],
        "totalShares": [$.shares.count],
        "totalReactions": [$.reactions.summary.total_count],
        "hashTags": $count([$.message_tags]),
        "engagedUsers": [$.insights.data[0].values.value],
        "engagedFan": [$.insights.data[1].values.value],
        "postImpressions": [$.insights.data[2].values.value],
        "postReach": [$.insights.data[3].values.value],
        "postClicks": [$.insights.data[6].values.value]
    }`;

    return jsonTransformer(response).evaluate(page_info);
  }
}
