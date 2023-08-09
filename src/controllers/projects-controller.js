/**
 * Module for the ProjectsController.
 *
 * @author Therese Weidenstedt
 * @version 1.0.0
 */

import { request, gql, GraphQLClient } from 'graphql-request'

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
      },
    })
    const data = await graphQLClient.request(query)
console.log(data)
      
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('..')
    }

    try {
      res.render('projects/index', { viewData })
    } catch (error) {
      next(error)
    }
  }
}
