import axios from 'axios';

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    const response = await axios({
      method: 'get',
      url: url,
      responseType: 'stream'
    });

    // Set appropriate headers
    res.setHeader('Content-Type', 'image/tiff');
    res.setHeader('Content-Disposition', `attachment; filename="image.tiff"`);

    // Pipe the stream directly to the response
    response.data.pipe(res);
  } catch (error) {
    console.error('Error proxying TIFF:', error);
    res.status(500).json({ error: 'Failed to proxy TIFF file' });
  }
}