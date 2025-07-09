// Utility functions for team member access without backend modifications

import { eventAPI } from './api'

// Cache for team member checks
const teamMemberCache = new Map()
const CACHE_DURATION = 10 * 60 * 1000 // 10 minutes

/**
 * Check if current user is a team member of a specific event
 * @param {string} eventId - The event ID to check
 * @param {object} currentUser - The current user object
 * @returns {Promise<boolean>} - True if user is team member
 */
export const isTeamMember = async (eventId, currentUser) => {
  if (!eventId || !currentUser?.id) return false

  const cacheKey = `team_member_${eventId}_${currentUser.id}`
  const cached = teamMemberCache.get(cacheKey)
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.isTeamMember
  }

  try {
    // Fetch full event details to check team membership
    const event = await eventAPI.getEvent(eventId)
    const teamMembers = event.team_members || event.teamMembers || []
    
    const isTeamMemberResult = teamMembers.some(member => 
      member.id === currentUser.id || 
      member.user_id === currentUser.id ||
      member.email === currentUser.email
    )

    // Cache the result
    teamMemberCache.set(cacheKey, {
      isTeamMember: isTeamMemberResult,
      timestamp: Date.now()
    })

    return isTeamMemberResult
  } catch (error) {
    console.error(`Error checking team membership for event ${eventId}:`, error)
    return false
  }
}

/**
 * Filter events based on user access (vendor or team member)
 * @param {array} events - Array of events
 * @param {object} currentUser - The current user object
 * @param {boolean} isVendor - Whether user is a vendor
 * @returns {Promise<array>} - Filtered events array
 */
export const filterEventsForUser = async (events, currentUser, isVendor) => {
  if (!events || !currentUser) return []

  // Vendors see all their events (already filtered by backend)
  if (isVendor) {
    return events
  }

  // For non-vendors, check team membership for each event
  const accessibleEvents = await Promise.all(
    events.map(async (event) => {
      try {
        // Check if user is admin of the event
        if (event.admin?.id === currentUser.id || 
            event.created_by === currentUser.id ||
            event.createdBy === currentUser.id) {
          return event
        }

        // Check if user is a team member
        const isTeamMemberResult = await isTeamMember(event.id, currentUser)
        return isTeamMemberResult ? event : null
      } catch (error) {
        console.error(`Error checking access for event ${event.id}:`, error)
        return null
      }
    })
  )

  return accessibleEvents.filter(event => event !== null)
}

/**
 * Clear team member cache (useful for development)
 */
export const clearTeamMemberCache = () => {
  teamMemberCache.clear()
  console.log('🧹 Team member cache cleared')
}
