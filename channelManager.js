// channelManager.js - Manages channel modules and their lifecycle

import { errorTracker } from './utils.js';

/**
 * Manages TV channel modules, their initialization, and cleanup
 */
class ChannelManager {
  constructor() {
    // Map of registered channels: id -> module object
    this._channels = new Map();
    
    // Track the currently active channel
    this._activeChannel = null;
    
    // Map of channel cleanup functions
    this._cleanupFunctions = new Map();
  }
  
  /**
   * Register a channel module
   * @param {string} id - Channel ID (e.g., 'home', 'ch2')
   * @param {Object} moduleInfo - Object with path and options
   */
  register(id, moduleInfo) {
    if (this._channels.has(id)) {
      console.warn(`Channel ${id} already registered. Overwriting.`);
    }
    
    this._channels.set(id, moduleInfo);
  }
  
  /**
   * Register multiple channels at once
   * @param {Object.<string, Object>} channelsMap - Map of channel IDs to module info
   */
  registerAll(channelsMap) {
    Object.entries(channelsMap).forEach(([id, moduleInfo]) => {
      this.register(id, moduleInfo);
    });
  }
  
  /**
   * Load a channel module dynamically
   * @param {string} id - Channel ID to load
   * @returns {Promise<Object>} - Promise resolving to the loaded module
   */
  async loadModule(id) {
    if (!this._channels.has(id)) {
      throw new Error(`Channel ${id} is not registered`);
    }
    
    const { path } = this._channels.get(id);
    
    try {
      return await import(path);
    } catch (error) {
      errorTracker.track(`ChannelManager.loadModule(${id})`, error);
      throw error;
    }
  }
  
  /**
   * Initialize a channel module
   * @param {string} id - Channel ID to initialize
   * @returns {Promise<void>}
   */
  async initChannel(id) {
    try {
      const module = await this.loadModule(id);
      
      // If there's an active channel, clean it up first
      if (this._activeChannel && this._activeChannel !== id) {
        await this.cleanupChannel(this._activeChannel);
      }
      
      // Call the module's init function
      if (typeof module.init === 'function') {
        const cleanup = await module.init();
        
        // Store the cleanup function if returned
        if (typeof cleanup === 'function') {
          this._cleanupFunctions.set(id, cleanup);
        }
      }
      
      // Update active channel
      this._activeChannel = id;
      
      console.log(`Channel ${id} initialized successfully`);
    } catch (error) {
      errorTracker.track(`ChannelManager.initChannel(${id})`, error);
      console.error(`Failed to initialize channel ${id}:`, error);
    }
  }
  
  /**
   * Clean up a channel module
   * @param {string} id - Channel ID to clean up
   * @returns {Promise<void>}
   */
  async cleanupChannel(id) {
    if (!this._channels.has(id)) {
      return;
    }
    
    try {
      // Call the stored cleanup function if exists
      if (this._cleanupFunctions.has(id)) {
        const cleanup = this._cleanupFunctions.get(id);
        await cleanup();
        this._cleanupFunctions.delete(id);
      } else {
        // Try to load the module and call its cleanup function directly
        try {
          const module = await this.loadModule(id);
          if (typeof module.cleanup === 'function') {
            await module.cleanup();
          }
        } catch (e) {
          // Silently fail if module can't be loaded
        }
      }
      
      console.log(`Channel ${id} cleaned up successfully`);
      
      // Clear active channel if it's the one being cleaned up
      if (this._activeChannel === id) {
        this._activeChannel = null;
      }
    } catch (error) {
      errorTracker.track(`ChannelManager.cleanupChannel(${id})`, error);
      console.error(`Failed to clean up channel ${id}:`, error);
    }
  }
  
  /**
   * Check if a channel is registered
   * @param {string} id - Channel ID to check
   * @returns {boolean}
   */
  isRegistered(id) {
    return this._channels.has(id);
  }
  
  /**
   * Get the active channel ID
   * @returns {string|null}
   */
  getActiveChannel() {
    return this._activeChannel;
  }
  
  /**
   * Get a list of all registered channel IDs
   * @returns {string[]}
   */
  getChannelIds() {
    return Array.from(this._channels.keys());
  }
}

// Create and export a singleton instance
const channelManager = new ChannelManager();
export default channelManager;