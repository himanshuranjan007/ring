const db = require('../config/database');

class Token {
  static tableName = 'tokens';
  
  /**
   * Get all supported tokens for a chain
   * @param {number} chainId Chain ID
   * @returns {Promise<Array>} Tokens
   */
  static async getByChainId(chainId) {
    const tokens = await db(this.tableName)
      .where('chain_id', chainId)
      .where('is_active', true)
      .orderBy('symbol', 'asc');
      
    return tokens.map(token => ({
      symbol: token.symbol,
      name: token.name,
      icon: token.icon,
      chainId: token.chain_id,
      contractAddress: token.contract_address
    }));
  }
  
  /**
   * Get a specific token
   * @param {string} symbol Token symbol
   * @param {number} chainId Chain ID
   * @returns {Promise<Object|null>} Token or null if not found
   */
  static async getToken(symbol, chainId) {
    const token = await db(this.tableName)
      .where('symbol', symbol)
      .where('chain_id', chainId)
      .where('is_active', true)
      .first();
      
    if (!token) return null;
    
    return {
      symbol: token.symbol,
      name: token.name,
      icon: token.icon,
      chainId: token.chain_id,
      contractAddress: token.contract_address
    };
  }
  
  /**
   * Add a new token
   * @param {Object} tokenData Token data
   * @returns {Promise<Object>} Created token
   */
  static async create(tokenData) {
    const [token] = await db(this.tableName).insert({
      symbol: tokenData.symbol,
      name: tokenData.name,
      icon: tokenData.icon,
      chain_id: tokenData.chainId,
      contract_address: tokenData.contractAddress,
      is_active: tokenData.isActive !== undefined ? tokenData.isActive : true
    }).returning('*');
    
    return {
      symbol: token.symbol,
      name: token.name,
      icon: token.icon,
      chainId: token.chain_id,
      contractAddress: token.contract_address,
      isActive: token.is_active
    };
  }
  
  /**
   * Update token status
   * @param {number} id Token ID
   * @param {boolean} isActive Active status
   * @returns {Promise<Object|null>} Updated token or null if not found
   */
  static async updateStatus(id, isActive) {
    const [token] = await db(this.tableName)
      .where('id', id)
      .update({ is_active: isActive })
      .returning('*');
      
    if (!token) return null;
    
    return {
      id: token.id,
      symbol: token.symbol,
      name: token.name,
      icon: token.icon,
      chainId: token.chain_id,
      contractAddress: token.contract_address,
      isActive: token.is_active
    };
  }
}

module.exports = Token; 