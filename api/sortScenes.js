// /api/sortScenes.js

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const scenes = req.body.scenes || [];

  // 数値＋文字列として比較できるように整形
  const parsed = scenes.map(item => {
    return {
      episode: parseInt(item.episode, 10),
      rawEpisode: item.episode,
      sceneNum: parseInt(item.scene, 10),
      sceneStr: item.scene + (item.note || ''),
    };
  });

  // 話 → シーンNo（備考付き）で昇順ソート
  parsed.sort((a, b) => {
    if (a.episode !== b.episode) return a.episode - b.episode;
    if (a.sceneNum !== b.sceneNum) return a.sceneNum - b.sceneNum;
    return a.sceneStr.localeCompare(b.sceneStr, 'ja');
  });

  // 表示用に整形
  let output = '';
  let currentEpisode = null;
  for (const item of parsed) {
    if (currentEpisode !== item.episode) {
      if (currentEpisode !== null) output += '\n\n';
      currentEpisode = item.episode;
    } else {
      output += '\n';
    }
    output += `#${item.episode} ${item.sceneStr}`;
  }

  return res.status(200).json({ sortedText: output });
}
