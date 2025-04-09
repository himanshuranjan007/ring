const db = require('../config/database');

class BridgeTransaction {
  static tableName = 'bridge_transactions';
  
  /**
   * Create a new bridge transaction
   * @param {Object} transaction Transaction details
   * @returns {Promise<Object>} Created transaction
   */
  static async create(transaction) {
    const [result] = await db(this.tableName).insert({
      tx_id: transaction.txId,
      source_chain_id: transaction.sourceChainId,
      destination_chain_id: transaction.destinationChainId,
      token_symbol: transaction.tokenSymbol,
      amount: transaction.amount,
      wallet_address: transaction.walletAddress,
      destination_address: transaction.destinationAddress,
      status: transaction.status || 'pending',
      timestamp: transaction.timestamp || db.fn.now(),
      estimated_completion_time: transaction.estimatedCompletionTime
    }).returning('*');
    
    return this.mapToApiModel(result);
  }
  
  /**
   * Get all transactions for a wallet address
   * @param {string} walletAddress Wallet address
   * @returns {Promise<Array>} Transactions
   */
  static async getByWalletAddress(walletAddress) {
    const transactions = await db(this.tableName)
      .where('wallet_address', walletAddress)
      .orderBy('timestamp', 'desc');
      
    return transactions.map(this.mapToApiModel);
  }
  
  /**
   * Get transaction by ID
   * @param {string} txId Transaction ID
   * @returns {Promise<Object|null>} Transaction or null if not found
   */
  static async getById(txId) {
    const transaction = await db(this.tableName)
      .where('tx_id', txId)
      .first();
      
    if (!transaction) return null;
    
    return this.mapToApiModel(transaction);
  }
  
  /**
   * Get transaction with associated steps
   * @param {string} txId Transaction ID
   * @returns {Promise<Object|null>} Transaction with steps or null if not found
   */
  static async getWithSteps(txId) {
    const transaction = await db(this.tableName)
      .where('tx_id', txId)
      .first();
      
    if (!transaction) return null;
    
    const steps = await db('bridge_steps')
      .where('tx_id', txId)
      .orderBy('order', 'asc');
      
    return {
      ...this.mapToApiModel(transaction),
      steps: steps.map(step => ({
        name: step.name,
        status: step.status,
        timestamp: step.timestamp
      }))
    };
  }
  
  /**
   * Update transaction status
   * @param {string} txId Transaction ID
   * @param {string} status New status
   * @returns {Promise<Object|null>} Updated transaction or null if not found
   */
  static async updateStatus(txId, status) {
    const [transaction] = await db(this.tableName)
      .where('tx_id', txId)
      .update({ 
        status,
        completion_time: status === 'completed' ? db.fn.now() : null
      })
      .returning('*');
      
    if (!transaction) return null;
    
    return this.mapToApiModel(transaction);
  }
  
  /**
   * Map database model to API model
   * @param {Object} dbModel Database model
   * @returns {Object} API model
   */
  static mapToApiModel(dbModel) {
    return {
      txId: dbModel.tx_id,
      sourceChainId: dbModel.source_chain_id,
      destinationChainId: dbModel.destination_chain_id,
      tokenSymbol: dbModel.token_symbol,
      amount: dbModel.amount,
      walletAddress: dbModel.wallet_address,
      destinationAddress: dbModel.destination_address,
      status: dbModel.status,
      timestamp: dbModel.timestamp,
      estimatedCompletionTime: dbModel.estimated_completion_time,
      completionTime: dbModel.completion_time
    };
  }
}

module.exports = BridgeTransaction; 