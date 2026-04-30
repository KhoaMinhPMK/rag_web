import type { Role } from '@/types'

export const PERMISSIONS = {
  VIEW_QUERY: 'view_query',
  VIEW_EPISODE: 'view_episode',
  CREATE_DRAFT: 'create_draft',
  EDIT_DRAFT: 'edit_draft',
  APPROVE_DRAFT: 'approve_draft',
  VIEW_COMPARE: 'view_compare',
  MANAGE_KNOWLEDGE: 'manage_knowledge',
  VIEW_AUDIT: 'view_audit',
  MANAGE_SYSTEM: 'manage_system',
} as const

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]

/**
 * Role-based permission matrix per PRD requirements
 */
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  clinician: [
    PERMISSIONS.VIEW_QUERY,
    PERMISSIONS.VIEW_EPISODE,
    PERMISSIONS.CREATE_DRAFT,
    PERMISSIONS.EDIT_DRAFT,
  ],
  radiologist: [
    PERMISSIONS.VIEW_QUERY,
    PERMISSIONS.VIEW_EPISODE,
    PERMISSIONS.CREATE_DRAFT,
    PERMISSIONS.EDIT_DRAFT,
    PERMISSIONS.APPROVE_DRAFT,
  ],
  researcher: [
    PERMISSIONS.VIEW_QUERY,
    PERMISSIONS.VIEW_EPISODE,
    PERMISSIONS.VIEW_COMPARE,
    PERMISSIONS.VIEW_AUDIT,
  ],
  admin: [
    PERMISSIONS.VIEW_QUERY,
    PERMISSIONS.VIEW_EPISODE,
    PERMISSIONS.CREATE_DRAFT,
    PERMISSIONS.EDIT_DRAFT,
    PERMISSIONS.APPROVE_DRAFT,
    PERMISSIONS.VIEW_COMPARE,
    PERMISSIONS.MANAGE_KNOWLEDGE,
    PERMISSIONS.VIEW_AUDIT,
    PERMISSIONS.MANAGE_SYSTEM,
  ],
}

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: Role, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role]
  return permissions ? permissions.includes(permission) : false
}

/**
 * Get all permissions for a role
 */
export function getPermissions(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role] || []
}
