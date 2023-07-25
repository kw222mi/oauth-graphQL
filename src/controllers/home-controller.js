/**
 * Home controller.
 *
 * @author Therese Weidenstedt
 * @version 1.0.0
 */

import 'dotenv/config'

/**
 * Encapsulates a controller.
 */
export class HomeController {
  /**
   * Renders a view and sends the rendered HTML string as an HTTP response.
   * index GET.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  index (req, res, next) {
    res.render('home/index')
  }

// https://gitlab.lnu.se/oauth/authorize?client_id=${process.env.GITLAB_CLIENT_ID}`&redirect_uri=${process.env.REDIRECT_URI}&response_type=code&state=STATE&scope=REQUESTED_SCOPES&code_challenge=CODE_CHALLENGE&code_challenge_method=S256
// `https://github.com/login/oauth/authorize?client_id=${process.env.GITLAB_CLIENT_ID}`

auth (req, res, next) {
  console.log('auth')
  res.redirect(
    //`https://gitlab.lnu.se/oauth/authorize?client_id=${process.env.GITLAB_CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code&state=${process.env.STATE}&code_challenge=${process.env.CODE_CHALLENGE}&code_challenge_method=S256`
   
    `https://gitlab.lnu.se/oauth/authorize?client_id=${process.env.GITLAB_CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code`

  )
}


oauth ( req, res, next) {
  console.log('oauth')
  console.log(req.query.code)
  req.query.code
  { query: { code } }
  
  // uri=`https://localhost:8080/oauth/redirect?code=${code}&state=STATE`
  // parameters = `client_id=${process.env.GITLAB_CLIENT_ID}&code=${code}&grant_type=authorization_code&redirect_uri=${uri}&code_verifier=${process.env.CODE_VERIFIER}`

  parameters = `client_id=${process.env.GITLAB_CLIENT_ID}&client_secret=${process.env.GITLAB_SECRET}&code=${code}&grant_type=authorization_code&redirect_uri=${process.env.REDIRECT_URI}`

  const opts = { headers: { accept: 'application/json' } }
  axios
    .post('https://gitlab.lnu.se/oauth/token', parameters, opts)
    .then((_res) => _res.data.access_token)
    .then((token) => {
      // eslint-disable-next-line no-console
      console.log('My token:', token)

      res.redirect(`/?token=${token}`)
    })
    .catch((err) => res.status(500).json({ err: err.message }))
}


/*
app.get('/oauth-callback', ({ query: { code } }, res) => {
  const body = {
    client_id: process.env.GITLAB_CLIENT_ID,
    client_secret: process.env.GITLAB_SECRET,
    code,
  };
  const opts = { headers: { accept: 'application/json' } };
  axios
    .post('https://github.com/login/oauth/access_token', body, opts)
    .then((_res) => _res.data.access_token)
    .then((token) => {
      // eslint-disable-next-line no-console
      console.log('My token:', token);

      res.redirect(`/?token=${token}`);
    })
    .catch((err) => res.status(500).json({ err: err.message }));
});
*/

/*
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/static/index.html'));
});

app.get('/auth', (req, res) => {
  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`,
  );
});

app.get('/oauth-callback', ({ query: { code } }, res) => {
  const body = {
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_SECRET,
    code,
  };
  const opts = { headers: { accept: 'application/json' } };
  axios
    .post('https://github.com/login/oauth/access_token', body, opts)
    .then((_res) => _res.data.access_token)
    .then((token) => {
      // eslint-disable-next-line no-console
      console.log('My token:', token);

      res.redirect(`/?token=${token}`);
    })
    .catch((err) => res.status(500).json({ err: err.message }));
});
*/

  
}
