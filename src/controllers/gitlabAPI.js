import axios from 'axios'
import { GraphQLClient } from 'graphql-request'

/**
 * Fetch 101 activities from API.
 *
 * @param {string} url - The url to fetch from.
 * @param {string} userToken - The access token of the user.
 * @param {object} req - Express request object.
 * @returns {object} - The result from the fetch.
 */
async function fetchActivitiesWithRetries (url, userToken, req) {
  const maxRetries = 3
  const pageSize = 100 // Number of items per page
  const desiredItemCount = 101 // Total number of items to retrieve
  // const itemsCollected = 0 // Counter for the collected items
  let currentPage = 1 // Start with the first page
  let retries = 0 // Initialize the retries counter
  const collectedItems = [] // To store collected items

  while (collectedItems.length < desiredItemCount) {
    try {
      const paginatedUrl = `${url}?page=${currentPage}&per_page=${pageSize}`

      const userArrayResponse = await fetch(paginatedUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      })

      if (userArrayResponse.status === 401) {
        // Token expired, attempt to renew it
        console.log('Token expired, attempt to renew it')
        await renewAccessToken(req)
        continue
      }

      if (!userArrayResponse.ok) {
        throw new Error('API request failed')
      }

      const pageItems = await userArrayResponse.json()

      // Add the items from this page to the collected items array
      collectedItems.push(...pageItems)
      console.log('Size of the array ' + collectedItems.length)

      currentPage++

      // Break the loop if the API doesn't return more items or if we've collected enough
      if (pageItems.length < pageSize) {
        break
      }
    } catch (error) {
      console.error('API request failed:', error.message)
      if (retries >= maxRetries) {
        throw error
      }
      retries++
    }
  }

  if (collectedItems.length !== desiredItemCount) {
    console.warn(`Warning: Collected ${collectedItems.length} items, but desired count was ${desiredItemCount}`)
  }
  const r = collectedItems.slice(0, desiredItemCount) // Return only the desired number of items
  console.log('Size of the array ' + r.length)
  return r
}

/**
 * Fetch data from API.
 *
 * @param {string} url - The url to fetch from.
 * @param {string} userToken - The access token of the user.
 * @param {object} req - Express request object.
 * @returns {object} - The result from the fetch.
 */
async function fetchUserDataWithRetries (url, userToken, req) {
  const maxRetries = 3
  let retries = 0

  while (retries < maxRetries) {
    try {
      const userArrayResponse = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      })

      if (userArrayResponse.status === 401) {
        // Token expired, attempt to renew it
        console.log('Token expired, attempt to renew it')
        await renewAccessToken(req)
        retries++
        continue
      }

      const result = await userArrayResponse.json()

      /*
      for (const pair of userArrayResponse.headers.entries()) {
        console.log(pair[0] + ': ' + pair[1])
      }
      */

      return result
    } catch (error) {
      console.error('API request failed:', error.message)
      retries++
    }
  }

  throw new Error('Failed to fetch data after multiple retries')
}

/**
 * Fetch data from graphQl.
 *
 * @param {string} endpoint - The url to fetch from.
 * @param {string} userToken - The access token of the user.
 * @param {object} query - GraphQl query.
 * @param {object} req - Express request object.
 * @returns {object} - The result from the fetch.
 */
async function fetchUserDataFromGraphQlWithRetries (endpoint, userToken, query, req) {
  const maxRetries = 3
  let retries = 0

  while (retries < maxRetries) {
    try {
      const graphQLClient = new GraphQLClient(endpoint, {
        headers: {
          authorization: `Bearer ${userToken}`
        }
      })

      if (graphQLClient.status === 401) {
        // Token expired, attempt to renew it
        console.log('Token expired, attempt to renew it')
        await renewAccessToken(req)
        retries++
        continue
      }

      const result = await graphQLClient.request(query)
      return result
    } catch (error) {
      console.error('graphQl request failed:', error.message)
      retries++
    }
  }

  throw new Error('Failed to fetch data after multiple retries')
}

/**
 * Get a new accesstoken if it has expired.
 *
 * @param {object} req - Express request object.
 * @returns {string} - the new token.
 */
async function renewAccessToken (req) {
  console.log('in renewAccessToken')
  // Get a new userToken from refreshToken
  console.log('refreshtoken' + req.session.refreshToken)
  const parameters = `client_id=${process.env.GITLAB_CLIENT_ID}&client_secret=${process.env.GITLAB_SECRET}&refresh_token=${req.session.refreshToken}&grant_type=refresh_token&redirect_uri=${process.env.REDIRECT_URI}`
  const opts = { headers: { accept: 'application/json' } }
  try {
    const response = await axios.post('https://gitlab.lnu.se/oauth/token', parameters, opts)
    const newAccessToken = response.data.access_token
    req.session.userToken = newAccessToken // Update the userToken in the session
    console.log('New access token:', newAccessToken)
    req.session.refreshToken = response.data.refresh_token // Update the refreshToken in the session
    return newAccessToken
  } catch (error) {
    throw new Error('Failed to renew access token')
  }
}

export { fetchUserDataFromGraphQlWithRetries, fetchUserDataWithRetries, fetchActivitiesWithRetries, renewAccessToken }
