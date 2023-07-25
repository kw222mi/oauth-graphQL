/**
 * Module for the ActivitiesController.
 *
 * @author Therese Weidenstedt
 * @version 1.0.0
 */

import fetch from 'node-fetch'

/**
 * Encapsulates a controller.
 */
export class ActivitiesController {
  

  /**
   *
   * @param req
   * @param res
   * @param next
   */
  async getAll (req, res, next) {
    let viewData
       try{

        
    
      } catch (error) {
        req.session.flash = { type: 'danger', text: error.message }
        res.redirect('..')
      }
    
    try {
      res.render('activities/index', { viewData })
    } catch (error) {
      next(error)
    }
  }

   
}
