/**
 * Module for the ProjectsController.
 *
 * @author Therese Weidenstedt
 * @version 1.0.0
 */

import { gql, GraphQLClient } from 'graphql-request'
import axios from 'axios'
import fetch from 'node-fetch'

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
  async getProjects(req, res, next) {
    try {
      const graphQlData = await this.#fetchGraphQLData(req)
      const projectsWithCommits = await this.#fetchCommitsForProjects(req, graphQlData)

      console.log('projects with comits' + projectsWithCommits)

      res.render('projects/index', { viewData: projectsWithCommits })
    } catch (error) {
      next(error)
    }
  }

  async #fetchCommitsForProjects(req, graphQlData) {
    const groups = graphQlData.currentUser.groups.nodes
    const projectsWithCommits = []

    for (const group of groups) {
      const groupData = {
        groupName: group.name,
        groupAvatar: group.avatarUrl,
        groupProjects: [],
      };

      for (const project of group.projects.nodes) {
        const commitInfo = await this.#findLatestCommitForProject(req, project.id);
        const commitPersonAvatar = await this.#findUserAvatar(req, commitInfo.comitPersonEmail);
        console.log('commitInfo' + commitInfo)

        const projectData = {
          projectName: project.name,
          projectAvatar: project.avatarUrl,
          projectPath: project.fullPath,
          projectId: project.id,
          latestCommit: commitInfo.comitDate,
          commitPerson: commitInfo.comitPerson,
          commitPersonEmail: commitInfo.comitPersonEmail,
          commitPersonAvatar
        }

        groupData.groupProjects.push(projectData)
      }

      projectsWithCommits.push(groupData)
    }

    return projectsWithCommits
  }

  /**
   *
   * @param req
   */
  async #fetchGraphQLData (req) {
    const parameters = `client_id=${process.env.GITLAB_CLIENT_ID}&client_secret=${process.env.GITLAB_SECRET}&refresh_token=${req.session.refreshToken}&grant_type=refresh_token&redirect_uri=${process.env.REDIRECT_URI}`
    const opts = { headers: { accept: 'application/json' } }

    const response = await axios.post('https://gitlab.lnu.se/oauth/token', parameters, opts)
    const newAccessToken = response.data.access_token
    req.session.userToken = newAccessToken // Update the userToken in the session
    console.log('New access token:', newAccessToken)
    req.session.refreshToken = response.data.refresh_token

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
    // console.log('Data att plocka ut ' + result.currentUser.groupCount)
    // console.log('Data att plocka ut ' + result.currentUser.groups.nodes[0].name)
    console.log('Data att plocka ut ' + result.currentUser.groups.nodes[0].projects.nodes[0].id)
    return result
  }

  /**
   *
   * @param req
   * @param projectId
   */
  async #findLatestCommitForProject (req, projectId) {
    console.log(projectId)

    const inputString = projectId
    const regex = /\d+$/ // Regular expression to match the sequence of digits at the end

    const match = inputString.match(regex)

    if (match) {
      projectId = match[0]
      console.log('Last number:', projectId)
    } else {
      console.log('No number found at the end of the string.')
    }

    const url = `https://gitlab.lnu.se/api/v4/projects/${projectId}/repository/commits`

    const userArray = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${req.session.userToken}`
      }
    })
    const r = await userArray.json()

    const comitDate = r[0].committed_date
    const comitPerson = r[0].committer_name
    const comitPersonEmail = r[0].committer_email
    
    const comitInfo = {
      comitDate,
      comitPerson,
      comitPersonEmail
    }
    console.log('comitDate' + comitDate)
    return comitInfo
    }

      
  async #findUserAvatar (req, userEmail) {
    const url = `https://gitlab.lnu.se/api/v4/avatar?email=${userEmail}`

    const userArray = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${req.session.userToken}`
      }
    })
    const avatarResult = await userArray.json()
    console.log(' avatar result ' + avatarResult.avatar_url)

    return avatarResult.avatar_url
  }
   
  }
