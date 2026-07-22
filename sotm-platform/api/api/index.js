// Vercel serverless entry. All routes are rewritten here (see vercel.json)
// and handed to the compiled NestJS app.
const { getServer } = require('../dist/serverless');

module.exports = async (req, res) => {
  const server = await getServer();
  return server(req, res);
};
