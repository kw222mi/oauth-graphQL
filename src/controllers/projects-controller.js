/**
 * Module for the ProjectsController.
 *
 * @author Therese Weidenstedt
 * @version 1.0.0
 */

import { gql, GraphQLClient } from 'graphql-request'
import axios from 'axios'

/**
 * Encapsulates a controller.
 */
export class ProjectsController {
  /**
   * Get projects from GitLab.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getProjects (req, res, next) {
    console.log(req.session.userToken)
    let viewData

    const parameters = `client_id=${process.env.GITLAB_CLIENT_ID}&client_secret=${process.env.GITLAB_SECRET}&refresh_token=${req.session.refreshToken}&grant_type=refresh_token&redirect_uri=${process.env.REDIRECT_URI}`
    const opts = { headers: { accept: 'application/json' } }

    const response = await axios.post('https://gitlab.lnu.se/oauth/token', parameters, opts)
    const newAccessToken = response.data.access_token
    req.session.userToken = newAccessToken // Update the userToken in the session
    console.log('New access token:', newAccessToken)
    req.session.refreshToken = response.data.refresh_token
    try {
      const query = gql`
      {
        currentUser {
          
          groupCount
          
          groups(first:3){
            nodes{
              fullName
              name
              fullPath
              avatarUrl
              id
              
              projects(first:5 includeSubgroups: true){
                nodes{
                  avatarUrl
                  fullPath
                  name
                  id
                }
         pageInfo {
            endCursor
            hasNextPage
          }
              }
            }
          }
        }
      }
    `
      const endpoint = 'https://gitlab.lnu.se/api/graphql'
      const graphQLClient = new GraphQLClient(endpoint, {
        headers: {
          authorization: `Bearer ${req.session.userToken}`
        }
      })
      const result = await graphQLClient.request(query)
      console.log(result)
      console.log('Data att plocka ut ' + result.currentUser.groupCount)
      console.log('Data att plocka ut ' + result.currentUser.groups.nodes[0].name)
      console.log('Data att plocka ut ' + result.currentUser.groups.nodes[0].projects.nodes[0].name)

      const groups = result.currentUser.groups.nodes.map((group) => ({
        groupName: group.name,
        groupAvatar: group.avatarUrl,
        groupProjects: group.projects.nodes.map((project) => ({
          projectName: project.name,
          projectAvatar: project.avatarUrl
        }))
      }))

      viewData = groups

      res.render('projects/index', { viewData })
    } catch (error) {
      next(error)
    }
  }
}
