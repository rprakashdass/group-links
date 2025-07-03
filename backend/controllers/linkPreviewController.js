const ogs = require('open-graph-scraper');

exports.getLinkPreview = async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).json({ error: 'Missing url parameter' });
  try {
    const { result } = await ogs({ url });
    if (!result.success) return res.status(404).json({ error: 'No preview found' });
    res.json({
      url,
      title: result.ogTitle || '',
      description: result.ogDescription || '',
      image: result.ogImage?.url || '',
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch link preview' });
  }
}; 