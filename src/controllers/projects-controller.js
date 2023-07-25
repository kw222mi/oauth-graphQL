/**
 * Module for the ProjectsController.
 *
 * @author Therese Weidenstedt
 * @version 1.0.0
 */
import { ActivitiesController } from './activities-controller.js'
/**
 * Encapsulates a controller.
 */
export class ProjectsController {
  /**
   * 
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  getProjects (req, res, next) {
    
    let viewData
       try{

        
    
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
