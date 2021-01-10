const fetch = require("node-fetch");

const accessToken = process.env.BASIC_DISPLAY_ACCESS_TOKEN_KAYASTHA;

async function selectFeedsRoot(profileName) {
  const baseUrl = "https://www.instagram.com";
  const profileUrl = `${baseUrl}/${profileName}`;
  const jsonDataUrl = `${profileUrl}/?__a=1`;

  const response = await fetch(jsonDataUrl);
  const jsonData = await response.json();
  const media = jsonData.graphql.user.edge_owner_to_timeline_media.edges;

  if (response.ok) {
    return media;
  } else {
    throw new Error(media);
  }
}

/**
 * 
 * @param {array of media edges i.e root of post content} media 
 * @returns [{post_url:string,
        display_url:string,
        likes:number,
        caption:string,
        alt:string,
        thumbnails:array of multiple thumbnail sizes including src ,width,and height attributes}]
 */
function filterMediaFields(media) {
  let filteredMedia = [];
  media.map((mediaItem) => {
    if (mediaItem) {
      let {
        shortcode,
        display_url,
        edge_liked_by: { count: likes },
        edge_media_to_caption: { edges },
        accessibility_caption: alt,
        thumbnail_resources: thumbnails,
      } = mediaItem.node;

      let caption = edges[0] ? edges[0].node.text : "";
      let post_url = `https:www.instagram.com/p/${shortcode}`;

      filteredMedia.push({
        post_url,
        display_url,
        likes,
        caption,
        alt,
        thumbnails,
      });
    }
  });
  return filteredMedia;
}

getFeeds = async (req, res, next) => {
  const feeds = await selectFeedsRoot("mlkayastha");
  const filteredFeeds = filterMediaFields(feeds);
  return res.status(200).json({ data: filteredFeeds });
};

getFeedsUsingSDK = (request, response, next) => {
  let user = {};
  fetch(
    `https://graph.instagram.com/me?fields=id,username&access_token=${accessToken}`
  )
    .then((res) => res.json())
    .then((res) => {
      user = res;
    })
    .catch((err) => {});

  fetch(
    `https://graph.instagram.com/me/media?fields=caption,id,media_type,media_url,timestamp,thumbnail_url&access_token=${accessToken}`
  )
    .then((res) => res.json())
    .then((res) => {
      return response.status(200).json({ accessToken, response: res });
    })
    .catch((err) => {});
};

const FeedController = {
  getFeeds,
  getFeedsUsingSDK,
};
module.exports = FeedController;
