/**
 * Module for the ProjectsController.
 *
 * @author Therese Weidenstedt
 * @version 1.0.0
 */

import { gql } from 'graphql-request'
import { fetchUserDataWithRetries, fetchUserDataFromGraphQlWithRetries } from './gitlabAPI.js'

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
    try {
      const endpoint = 'https://gitlab.lnu.se/api/graphql'
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

      const graphQlData = await fetchUserDataFromGraphQlWithRetries(endpoint, req.session.userToken, query, req)
      // const graphQ = JSON.stringify(graphQlData, null, 2)
      // console.log(graphQ)
      const projectsWithCommits = await this.#fetchCommitsForProjects(req, graphQlData)
      // console.log('projects with comits' + projectsWithCommits)

      res.render('projects/index', { viewData: projectsWithCommits })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get the commits for the projects.
   *
   * @param {object} req - Express request object.
   * @param {object} graphQlData - data from the graphQl fetch.
   * @returns {object} - projectsWithCommits
   */
  async #fetchCommitsForProjects (req, graphQlData) {
    const groups = graphQlData.currentUser.groups.nodes
    const projectsWithCommits = []
    const groupCount = graphQlData.currentUser.groupCount

    for (const group of groups) {
      const groupData = {
        groupCount,
        groupName: group.name,
        groupAvatar: group.avatarUrl,
        groupUrl: group.fullPath,
        groupProjects: []
      }

      for (const project of group.projects.nodes) {
      // Fetch commit info for the project
        const commitInfo = await this.#findLatestCommitForProject(req, project.id)
        const commitPersonAvatar = await this.#findUserAvatar(req, commitInfo.comitPersonEmail)

        const projectData = {
          projectName: project.name,
          projectAvatar: project.avatarUrl,
          projectPath: project.fullPath,
          projectId: project.id,
          projectUrl: project.fullPath,
          latestCommit: commitInfo.comitDate,
          commitPerson: commitInfo.comitPerson,
          commitPersonEmail: commitInfo.comitPersonEmail,
          commitPersonAvatar
        }

        groupData.groupProjects.push(projectData)
      }

      // Access the pageInfo after the inner loop to determine if more projects are available
      const moreProjectsAvailable = group.projects.pageInfo.hasNextPage
      console.log('has more projects  ' + moreProjectsAvailable)

      // Add the 'moreProjectsAvailable' flag to the group data
      groupData.moreProjectsAvailable = moreProjectsAvailable

      projectsWithCommits.push(groupData)
      console.log(groupData.moreProjectsAvailable)
    }

    return projectsWithCommits
  }

  /**
   * Fetch commits for the project.
   *
   * @param {object} req - Express request object.
   * @param {string} projectId - The id of the project.
   * @returns {object} - CommitInfo.
   */
  async #findLatestCommitForProject (req, projectId) {
    const inputString = projectId
    const regex = /\d+$/ // Regular expression to match the sequence of digits at the end
    const match = inputString.match(regex)

    if (match) {
      projectId = match[0]
      // console.log('Last number:', projectId)
    } else {
      console.log('No number found at the end of the string.')
    }

    const url = `https://gitlab.lnu.se/api/v4/projects/${projectId}/repository/commits`

    const commitData = await fetchUserDataWithRetries(url, req.session.userToken, req)
    // const c = JSON.stringify(commitData, null, 2)
    // console.log('Commit data ' + c)

    const comitDate = commitData[0].committed_date
    const comitPerson = commitData[0].committer_name
    const comitPersonEmail = commitData[0].committer_email

    const comitInfo = {
      comitDate,
      comitPerson,
      comitPersonEmail
    }
    return comitInfo
  }

  /**
   * Get the avatar of the commiting user.
   *
   * @param {object} req - Express request object.
   * @param {string} userEmail - The commiting users mail.
   * @returns {string} avatarResult.avatar_url
   */
  async #findUserAvatar (req, userEmail) {
    // const url = 'https://gitlab.lnu.se/api/v4/users?email=mats.loock@lnu.se'
    const url = `https://gitlab.lnu.se/api/v4/avatar?email=${userEmail}`
    const avatarResult = await fetchUserDataWithRetries(url, req.session.userToken, req)
    // const graphQ = JSON.stringify(avatarResult, null, 2)
    // console.log(graphQ)

    // console.log(' avatar result ' + avatarResult.avatar_url)
    // console.log(' avatar result ' + avatarResult)

    return avatarResult.avatar_url
  }
}
