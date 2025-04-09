const db = require('../config/database');

class BridgeStep {
  static tableName = 'bridge_steps';
  
  /**
   * Create bridge transaction steps
   * @param {string} txId Transaction ID
   * @param {Array} steps Steps to create
   * @returns {Promise<Array>} Created steps
   */
  static async createSteps(txId, steps) {
    const stepsToInsert = steps.map((step, index) => ({
      tx_id: txId,
      name: step.name,
      status: step.status || 'pending',
      timestamp: step.status === 'completed' ? db.fn.now() : null,
      order: index
    }));
    
    return db(this.tableName).insert(stepsToInsert).returning('*');
  }
  
  /**
   * Get steps for a transaction
   * @param {string} txId Transaction ID
   * @returns {Promise<Array>} Steps
   */
  static async getByTransactionId(txId) {
    const steps = await db(this.tableName)
      .where('tx_id', txId)
      .orderBy('order', 'asc');
      
    return steps.map(step => ({
      id: step.id,
      txId: step.tx_id,
      name: step.name,
      status: step.status,
      timestamp: step.timestamp,
      order: step.order
    }));
  }
  
  /**
   * Update a step status
   * @param {number} stepId Step ID
   * @param {string} status New status
   * @returns {Promise<Object|null>} Updated step or null if not found
   */
  static async updateStatus(stepId, status) {
    const [step] = await db(this.tableName)
      .where('id', stepId)
      .update({ 
        status,
        timestamp: ['completed', 'failed'].includes(status) ? db.fn.now() : null
      })
      .returning('*');
      
    if (!step) return null;
    
    return {
      id: step.id,
      txId: step.tx_id,
      name: step.name,
      status: step.status,
      timestamp: step.timestamp,
      order: step.order
    };
  }
  
  /**
   * Update the current active step of a transaction
   * @param {string} txId Transaction ID
   * @returns {Promise<Object|null>} Updated step or null if all steps are completed or failed
   */
  static async updateCurrentStep(txId) {
    // Get all steps for the transaction
    const steps = await db(this.tableName)
      .where('tx_id', txId)
      .orderBy('order', 'asc');
      
    // Find the current in_progress step or the first pending step
    const currentInProgressStep = steps.find(step => step.status === 'in_progress');
    if (currentInProgressStep) return currentInProgressStep;
    
    const firstPendingStep = steps.find(step => step.status === 'pending');
    if (!firstPendingStep) return null; // All steps are completed or failed
    
    // Update the first pending step to in_progress
    const [updatedStep] = await db(this.tableName)
      .where('id', firstPendingStep.id)
      .update({ status: 'in_progress' })
      .returning('*');
      
    return {
      id: updatedStep.id,
      txId: updatedStep.tx_id,
      name: updatedStep.name,
      status: updatedStep.status,
      timestamp: updatedStep.timestamp,
      order: updatedStep.order
    };
  }
}

module.exports = BridgeStep; 