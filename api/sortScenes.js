// /api/sortScenes.js

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const scenes = req.body.scenes || [];

  const parsed = scenes.map(item => {
    return {
      episode: parseInt(item.episode, 10),
      rawEpisode: item.episode,
      sceneNum: parseInt(item.scene, 10),
      sceneStr: item.scene + (item.note || '')
    };
  });

  parsed.sort((a, b) => {
    if (a.episode !== b.episode) return a.episode - b.episode;
    if (a.sceneNum !== b.sceneNum) return a.sceneNum - b.sceneNum;
    return a.sceneStr.localeCompare(b.sceneStr, 'ja');
  });

  // 整形処理：同じ話は横並び、話が変わったら段落を変える
  let output = '';
  let currentEpisode = null;
  let sceneList = [];

  for (const item of parsed) {
    if (currentEpisode !== item.episode) {
      if (sceneList.length > 0) {
        output += `#${currentEpisode} ${sceneList.join(' ')}\n\n`;
      }
      currentEpisode = item.episode;
      sceneList = [item.sceneStr];
    } else {
      sceneList.push(item.sceneStr);
    }
  }

  // 最後の話を出力
  if (sceneList.length > 0) {
    output += `#${currentEpisode} ${sceneList.join(' ')}`;
  }

  return res.status(200).json({ sortedText: output });
}
