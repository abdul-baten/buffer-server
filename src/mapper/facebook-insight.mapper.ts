import jsonTransformer from 'jsonata';

export class FacebookInsightMapper {
  static overview<T> (overview_insight: Partial<T>): T {
    const response = `{
      "categories": $.categories,
      "page_actions_post_reactions_anger_total": $.page_actions_post_reactions_anger_total,
      "page_actions_post_reactions_haha_total": $.page_actions_post_reactions_haha_total,
      "page_actions_post_reactions_like_total": $.page_actions_post_reactions_like_total,
      "page_actions_post_reactions_love_total": $.page_actions_post_reactions_love_total,
      "page_actions_post_reactions_sorry_total": $.page_actions_post_reactions_sorry_total,
      "page_actions_post_reactions_total": $.page_actions_post_reactions_total,
      "page_actions_post_reactions_wow_total": $.page_actions_post_reactions_wow_total,
      "page_engaged_users": $.page_engaged_users,
      "page_fan_adds": $.page_fan_adds,
      "page_fan_removes": $.page_fan_removes,
      "page_impressions": $.page_impressions,
      "page_impressions_unique": $.page_impressions_unique,
      "page_views_total": $.page_views_total
    }`;

    return jsonTransformer(response).evaluate(overview_insight);
  }

  static posts<T> (posts_insight: Partial<T>): T {
    const response = `{
      "categories": $.categories,
      "engaged_fans": $.engaged_fans,
      "engaged_users": $.engaged_users,
      "hash_tags": $.hash_tags,
      "post_clicks": $.post_clicks,
      "post_impressions": $.post_impressions,
      "post_reach": $.post_reach,
      "posts": $.posts,
      "posts_table": $.posts_table,
      "total_comments": $.total_comments,
      "total_likes": $.total_likes,
      "total_reactions": $.total_reactions,
      "total_shares": $.total_shares
    }`;

    return jsonTransformer(response).evaluate(posts_insight);
  }

  static videos<T> (video_insight: Partial<T>): T {
    const response = `{
      "categories": $.categories,
      "page_video_complete_views_30s": $.page_video_complete_views_30s,
      "page_video_complete_views_30s_autoplayed": $.page_video_complete_views_30s_autoplayed,
      "page_video_complete_views_30s_click_to_play": $.page_video_complete_views_30s_click_to_play,
      "page_video_complete_views_30s_organic": $.page_video_complete_views_30s_organic,
      "page_video_complete_views_30s_paid": $.page_video_complete_views_30s_paid,
      "page_video_complete_views_30s_repeat_views": $.page_video_complete_views_30s_repeat_views,
      "page_video_complete_views_30s_unique": $.page_video_complete_views_30s_unique,
      "page_video_repeat_views": $.page_video_repeat_views,
      "page_video_views": $.page_video_views,
      "page_video_views_10s": $.page_video_views_10s,
      "page_video_views_10s_autoplayed": $.page_video_views_10s_autoplayed,
      "page_video_views_10s_click_to_play": $.page_video_views_10s_click_to_play,
      "page_video_views_10s_organic": $.page_video_views_10s_organic,
      "page_video_views_10s_paid": $.page_video_views_10s_paid,
      "page_video_views_10s_repeat": $.page_video_views_10s_repeat,
      "page_video_views_10s_unique": $.page_video_views_10s_unique,
      "page_video_views_autoplayed": $.page_video_views_autoplayed,
      "page_video_views_click_to_play": $.page_video_views_click_to_play,
      "page_video_views_organic": $.page_video_views_organic,
      "page_video_views_paid": $.page_video_views_paid,
      "page_video_views_unique": $.page_video_views_unique
    }`;

    return jsonTransformer(response).evaluate(video_insight);
  }

  static performance<T> (performance_insight: Partial<T>): T {
    const response = `{
      "categories": $.categories,
      "page_call_phone_clicks_logged_in_unique": $.page_call_phone_clicks_logged_in_unique,
      "page_get_directions_clicks_logged_in_unique": $.page_get_directions_clicks_logged_in_unique,
      "page_tab_views_login_top": $.page_tab_views_login_top,
      "page_total_actions": $.page_total_actions,
      "page_views_logged_in_total": $.page_views_logged_in_total,
      "page_views_logout": $.page_views_logout,
      "page_website_clicks_logged_in_unique": $.page_website_clicks_logged_in_unique
    }`;

    return jsonTransformer(response).evaluate(performance_insight);
  }
}
