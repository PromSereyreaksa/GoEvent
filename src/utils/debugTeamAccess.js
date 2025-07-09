// Debug utilities for team member event access in GoEvent

/**
 * Analyzes which events a user can access as a team member.
 * @param {Array} events - List of event objects from backend.
 * @param {Object} user - Current user object (should have id/email).
 * @returns {Array} - List of accessible events for the user.
 */
export function debugTeamMemberAccess(events, user) {
  if (!Array.isArray(events) || !user) {
    console.warn('Invalid input to debugTeamMemberAccess:', { events, user });
    return [];
  }
  const userId = user.id || user._id || user.email || user.username;
  const accessible = events.filter(event => {
    if (!event.team_members) return false;
    return event.team_members.some(
      member => member.id === userId || member.email === userId || member.username === userId
    );
  });
  console.log('[debugTeamMemberAccess] User:', userId, 'Accessible events:', accessible);
  return accessible;
}

/**
 * Fetches and logs the raw backend /events/ response for the current user.
 * Requires api.js to export getEvents().
 */
export async function debugBackendResponse() {
  try {
    const { getEvents } = await import('./api');
    const events = await getEvents();
    console.log('[debugBackendResponse] Raw /events/ response:', events);
    return events;
  } catch (e) {
    console.error('[debugBackendResponse] Error fetching events:', e);
    return null;
  }
}

/**
 * Checks user context and token storage (localStorage/sessionStorage).
 * Optionally pass a userContext object.
 */
export function testUserContext(userContext) {
  let user = userContext;
  if (!user) {
    try {
      user = JSON.parse(localStorage.getItem('user')) || JSON.parse(sessionStorage.getItem('user'));
    } catch (e) {
      user = null;
    }
  }
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  console.log('[testUserContext] User:', user);
  console.log('[testUserContext] Token:', token);
  return { user, token };
}

// Expose debug functions to window for manual use in browser console
if (typeof window !== 'undefined') {
  window.debugTeamMemberAccess = debugTeamMemberAccess;
  window.debugBackendResponse = debugBackendResponse;
  window.testUserContext = testUserContext;
}
