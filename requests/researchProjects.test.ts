import { apiRequestWithAuth } from '@/helpers/api-request-with-auth'
import { getCompanies, getMyCompany } from '@/requests/companies'
import { performAuthRequest } from '@/requests/genericFetch'
import {
  addResearchProjectMember,
  createResearchProject,
  createResearchProjectGrant,
  getResearchProjectAudit,
  getResearchProjectById,
  getResearchProjectCohort,
  getResearchProjectGrants,
  getResearchProjectHistoryDataset,
  getResearchProjectMembers,
  getResearchProjectMLInspection,
  getResearchProjects,
  getResearchWorkspaceAccess,
  hasResearchCapability,
  removeResearchProjectMember,
  requestResearchProjectExport,
  updateResearchProject,
  updateResearchProjectCohort,
} from '@/requests/researchProjects'
import { CustomSession } from '@/types/auth'

jest.mock('@/helpers/api-request-with-auth')
jest.mock('@/requests/genericFetch', () => {
  const actual = jest.requireActual('@/requests/genericFetch')
  return { ...actual, performAuthRequest: jest.fn(actual.performAuthRequest) }
})

jest.mock('@/requests/companies', () => ({
  getCompanies: jest.fn(),
  getMyCompany: jest.fn(),
}))

jest.mock('@/requests/config', () => ({
  APIUrl: 'http://localhost:3200/api',
}))

const mockSession: CustomSession = {
  user: {
    id: 'user-1',
    name: 'Research User',
    email: 'research.user@example.com',
    role: 'user',
  },
  OAuthToken: 'mock-token',
  expires: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
}

function createProjectPayload() {
  return {
    id: 'project-1',
    name: 'Sleep Resilience',
    description: 'Observational resilience study',
    objective: 'Observational resilience study',
    status: 'active',
    approvalStatus: 'approved',
    exportPolicy: 'review_required',
    pseudonymizationMode: 'required',
    principalInvestigatorId: 'pi-1',
    retentionUntil: null,
    consentMode: 'company_boundary_only',
    company: {
      id: 'company-1',
      name: 'Acme Research',
    },
    role: 'scientist',
    permissions: {
      canUpdateProject: true,
      canManageMembers: true,
      canManageCohort: true,
      canManageGrants: true,
      canViewMlInspection: true,
      canViewHistoryDataset: true,
      canRequestExports: true,
      canViewAudit: true,
    },
    cohort: {
      groupIds: ['group-1'],
      userSelectionMode: 'groups_only',
      from: '2026-01-01',
      to: '2026-03-31',
      resolvedGroupIds: ['group-1', 'group-2'],
    },
    groups: [
      {
        id: 'group-1',
        name: 'Pilot Group',
        type: 'unit',
      },
    ],
    members: [
      {
        id: 'member-1',
        userId: 'scientist-1',
        fullName: 'Nadia Koval',
        email: 'nadia.koval@example.com',
        role: 'scientist',
        grants: ['diagnostics.read'],
      },
    ],
    grants: [
      {
        id: 'grant-1',
        title: 'Core dataset',
        allowedContracts: ['standard-dpa'],
        allowedFields: ['moodScore', 'sleepHours'],
        allowedTargets: ['subject'],
        groupIds: ['group-1'],
        userSelectionMode: 'groups_only',
        pseudonymizationMode: 'required',
        from: '2026-01-01',
        to: '2026-03-31',
        exportAllowed: true,
      },
    ],
    datasets: [
      {
        id: 'dataset-1',
        label: 'History Dataset',
        description: 'Historical measurements',
        status: 'available',
        defaultAccess: 'pseudonymous',
      },
    ],
    modelRuns: [
      {
        id: 'run-1',
        label: 'Nightly refresh',
        status: 'completed',
        modelVersion: 'v3.2.1',
      },
    ],
    exportJob: {
      id: 'export-1',
      status: 'running',
      format: 'csv',
      requestedAt: '2026-03-31T08:15:00.000Z',
      completedAt: null,
    },
    audit: {
      events: [
        {
          id: 'audit-1',
          eventType: 'grant.created',
          actorUserId: 'admin-1',
          route: '/research/v1/projects/project-1/grants',
          createdAt: '2026-03-31T08:00:00.000Z',
          details: {
            fieldCount: 2,
          },
        },
      ],
    },
    latestInspection: {
      modelVersion: 'v3.2.1',
      riskScore: '0.82',
      anomalyScore: '0.11',
      adaptiveRisk: 'medium',
      modelHealth: 'healthy',
      rawFeatureVector: ['sleepHours'],
    },
  }
}

describe('researchProjects requests', () => {
  const mockedPerformAuthRequest = performAuthRequest as jest.Mock
  const mockedApiRequestWithAuth = apiRequestWithAuth as jest.Mock
  const mockedGetCompanies = getCompanies as jest.Mock
  const mockedGetMyCompany = getMyCompany as jest.Mock

  beforeEach(() => {
    mockedPerformAuthRequest.mockClear()
    mockedApiRequestWithAuth.mockReset()
    mockedGetCompanies.mockReset()
    mockedGetMyCompany.mockReset()
    mockedGetCompanies.mockResolvedValue({ data: [] })
    mockedGetMyCompany.mockResolvedValue({ error: 'Company unavailable' })
  })

  it('gets projects from research/v1 and normalizes project data', async () => {
    mockedApiRequestWithAuth.mockResolvedValue({ data: { items: [createProjectPayload()] } })

    const result = await getResearchProjects(mockSession)

    expect(mockedPerformAuthRequest).toHaveBeenCalledWith(
      mockSession,
      'http://localhost:3200/api/research/v1/projects',
      expect.objectContaining({ decodeResponse: expect.any(Function) })
    )
    expect(result).toEqual(
      expect.objectContaining({
        data: [
          expect.objectContaining({
            id: 'project-1',
            name: 'Sleep Resilience',
            companyId: 'company-1',
            companyName: 'Acme Research',
            currentUserRole: 'scientist',
            permissions: expect.objectContaining({
              canManageMembers: true,
              canRequestExports: true,
            }),
            cohort: expect.objectContaining({
              groupIds: ['group-1'],
              resolvedGroupIds: ['group-1', 'group-2'],
            }),
            availableGroups: [expect.objectContaining({ id: 'group-1' })],
            grantsList: [expect.objectContaining({ id: 'grant-1' })],
            latestModelRuns: [expect.objectContaining({ id: 'run-1' })],
          }),
        ],
      })
    )
  })

  it('distinguishes empty project lists from malformed success payloads', async () => {
    mockedApiRequestWithAuth.mockResolvedValueOnce({ data: { items: [] } })

    await expect(getResearchProjects(mockSession)).resolves.toEqual({ data: [] })

    mockedApiRequestWithAuth.mockResolvedValueOnce({ data: {} })
    await expect(getResearchProjects(mockSession)).resolves.toEqual({
      error: 'Invalid research projects response from backend',
      status: 502,
    })

    mockedApiRequestWithAuth.mockResolvedValueOnce({ data: { items: [{ id: 'project-1' }, {}] } })
    await expect(getResearchProjects(mockSession)).resolves.toEqual({
      error: 'Invalid research projects response from backend',
      status: 502,
    })
  })

  it('rejects malformed project success payloads on single-project reads and writes', async () => {
    mockedApiRequestWithAuth.mockResolvedValue({ data: { id: null, _id: 'fallback-id' } })

    const invalid = { error: 'Invalid research project response from backend', status: 502 }
    await expect(getResearchProjectById(mockSession, 'project-1')).resolves.toEqual(invalid)

    await expect(
      createResearchProject(mockSession, {
        companyId: 'company-1',
        name: 'Study',
        description: '',
        objective: '',
        status: 'draft',
        approvalStatus: 'draft',
        exportPolicy: 'review_required',
        pseudonymizationMode: 'required',
        principalInvestigatorId: 'pi-1',
        retentionUntil: null,
        consentMode: 'company_boundary_only',
      })
    ).resolves.toEqual(invalid)

    await expect(updateResearchProject(mockSession, 'project-1', { name: 'Updated study' })).resolves.toEqual(invalid)

    mockedApiRequestWithAuth.mockResolvedValueOnce({ data: null })
    await expect(getResearchProjectById(mockSession, 'project-1')).resolves.toEqual(invalid)
  })

  it('rejects successful grant creation without a stable backend ID', async () => {
    mockedApiRequestWithAuth.mockResolvedValue({ data: { title: 'Unnamed grant' } })

    const result = await createResearchProjectGrant(mockSession, 'project-1', {
      allowedContracts: ['standard-dpa'],
      allowedFields: ['sleepScore'],
      allowedTargets: ['subject'],
      groupIds: [],
      userSelectionMode: 'all',
      pseudonymizationMode: 'required',
      from: null,
      to: null,
      exportAllowed: false,
    })

    expect(result).toEqual({ error: 'Invalid research grant response from backend', status: 502 })
  })

  it('gets a single project by id and preserves metadata defaults', async () => {
    mockedApiRequestWithAuth.mockResolvedValue({
      data: {
        ...createProjectPayload(),
        metadata: {
          governance: {
            contract: 'standard-dpa',
          },
        },
      },
    })

    const result = await getResearchProjectById(mockSession, 'project-1')

    expect(mockedPerformAuthRequest).toHaveBeenCalledWith(
      mockSession,
      'http://localhost:3200/api/research/v1/projects/project-1',
      expect.objectContaining({ decodeResponse: expect.any(Function) })
    )
    expect(result).toEqual(
      expect.objectContaining({
        data: expect.objectContaining({
          id: 'project-1',
          metadata: {
            'governance.contract': 'standard-dpa',
          },
          diagnostics: expect.objectContaining({
            modelVersion: 'v3.2.1',
            rawFeatureVector: ['sleepHours'],
          }),
        }),
      })
    )
  })

  it('passes a typed project decoder to the authenticated transport', async () => {
    mockedApiRequestWithAuth.mockResolvedValue({ data: createProjectPayload() })

    await getResearchProjectById(mockSession, 'project-1')

    const options = mockedPerformAuthRequest.mock.calls[0][2]
    expect(options.decodeResponse(createProjectPayload())).toEqual({
      success: true,
      data: createProjectPayload(),
    })
    expect(options.decodeResponse({ id: null, _id: 'fallback-id' })).toEqual({
      success: false,
      error: 'Invalid research project response from backend',
    })
  })

  it('grants full project management permissions to system admins', async () => {
    const adminSession: CustomSession = {
      ...mockSession,
      user: {
        ...mockSession.user!,
        role: 'admin',
      },
    }

    mockedApiRequestWithAuth.mockResolvedValue({
      data: {
        ...createProjectPayload(),
        role: 'scientist',
        permissions: {
          canUpdateProject: false,
          canManageMembers: false,
          canManageCohort: false,
          canManageGrants: false,
          canViewMlInspection: false,
          canViewHistoryDataset: false,
          canRequestExports: false,
          canViewAudit: false,
        },
      },
    })

    const result = await getResearchProjectById(adminSession, 'project-1')

    expect(result).toEqual(
      expect.objectContaining({
        data: expect.objectContaining({
          permissions: expect.objectContaining({
            canCreateProject: true,
            canUpdateProject: true,
            canManageMembers: true,
            canManageCohort: true,
            canManageGrants: true,
            canViewMlInspection: true,
            canViewHistoryDataset: true,
            canRequestExports: true,
            canViewAudit: true,
          }),
        }),
      })
    )
  })

  it('creates and updates projects through research/v1 endpoints', async () => {
    mockedApiRequestWithAuth.mockResolvedValueOnce({ data: createProjectPayload() }).mockResolvedValueOnce({
      data: {
        ...createProjectPayload(),
        name: 'Sleep Resilience Updated',
      },
    })

    const createResult = await createResearchProject(mockSession, {
      companyId: 'company-1',
      name: 'Sleep Resilience',
      description: 'Observational resilience study',
      objective: 'Observational resilience study',
      status: 'draft',
      approvalStatus: 'pending_review',
      exportPolicy: 'review_required',
      pseudonymizationMode: 'required',
      principalInvestigatorId: 'pi-1',
      retentionUntil: null,
      consentMode: 'company_boundary_only',
    })

    const updateResult = await updateResearchProject(mockSession, 'project-1', {
      name: 'Sleep Resilience Updated',
      exportPolicy: 'allowed',
    })

    expect(mockedPerformAuthRequest).toHaveBeenNthCalledWith(
      1,
      mockSession,
      'http://localhost:3200/api/research/v1/projects',
      {
        method: 'POST',
        body: {
          companyId: 'company-1',
          name: 'Sleep Resilience',
          description: 'Observational resilience study',
          objective: 'Observational resilience study',
          status: 'draft',
          approvalStatus: 'pending_review',
          exportPolicy: 'review_required',
          pseudonymizationMode: 'required',
          principalInvestigatorId: 'pi-1',
          retentionUntil: null,
          consentMode: 'company_boundary_only',
        },
      }
    )
    expect(mockedPerformAuthRequest).toHaveBeenNthCalledWith(
      2,
      mockSession,
      'http://localhost:3200/api/research/v1/projects/project-1',
      {
        method: 'PATCH',
        body: {
          name: 'Sleep Resilience Updated',
          exportPolicy: 'allowed',
        },
      }
    )
    expect(createResult).toEqual(expect.objectContaining({ data: expect.objectContaining({ id: 'project-1' }) }))
    expect(updateResult).toEqual(
      expect.objectContaining({ data: expect.objectContaining({ name: 'Sleep Resilience Updated' }) })
    )
  })

  it('gets members, adds a member, and removes a member through dedicated member endpoints', async () => {
    mockedApiRequestWithAuth
      .mockResolvedValueOnce({
        data: {
          members: [
            {
              id: 'member-1',
              userId: 'scientist-1',
              name: 'Nadia Koval',
              email: 'nadia.koval@example.com',
              role: 'scientist',
              grants: ['diagnostics.read'],
            },
          ],
        },
      })
      .mockResolvedValueOnce({
        data: {
          id: 'member-2',
          userId: 'reviewer-1',
          name: 'Iryna Reviewer',
          email: 'iryna.reviewer@example.com',
          role: 'reviewer',
          grants: [],
        },
      })
      .mockResolvedValueOnce({ data: {} })

    const listResult = await getResearchProjectMembers(mockSession, 'project-1')
    const addResult = await addResearchProjectMember(mockSession, 'project-1', {
      userId: 'reviewer-1',
      role: 'reviewer',
    })
    const removeResult = await removeResearchProjectMember(mockSession, 'project-1', 'reviewer-1')

    expect(mockedPerformAuthRequest).toHaveBeenNthCalledWith(
      1,
      mockSession,
      'http://localhost:3200/api/research/v1/projects/project-1/members',
      expect.objectContaining({ decodeResponse: expect.any(Function) })
    )
    expect(mockedPerformAuthRequest).toHaveBeenNthCalledWith(
      2,
      mockSession,
      'http://localhost:3200/api/research/v1/projects/project-1/members',
      {
        method: 'POST',
        body: { userId: 'reviewer-1', role: 'reviewer' },
      }
    )
    expect(mockedPerformAuthRequest).toHaveBeenNthCalledWith(
      3,
      mockSession,
      'http://localhost:3200/api/research/v1/projects/project-1/members/reviewer-1',
      {
        method: 'DELETE',
      }
    )
    expect(listResult).toEqual(
      expect.objectContaining({ data: [expect.objectContaining({ userId: 'scientist-1', canRemove: false })] })
    )
    expect(addResult).toEqual(expect.objectContaining({ data: expect.objectContaining({ id: 'member-2' }) }))
    expect(removeResult).toEqual({ data: { ok: true } })
  })

  it('normalizes member identity from nested user payloads', async () => {
    mockedApiRequestWithAuth.mockResolvedValue({
      data: {
        members: [
          {
            id: 'member-1',
            userId: 'scientist-1',
            roleInProject: 'scientist',
            user: {
              id: 'scientist-1',
              name: 'Nadia Koval',
              email: 'nadia.koval@example.com',
            },
          },
        ],
      },
    })

    const result = await getResearchProjectMembers(mockSession, 'project-1')

    expect(result).toEqual(
      expect.objectContaining({
        data: [
          expect.objectContaining({
            id: 'member-1',
            userId: 'scientist-1',
            name: 'Nadia Koval',
            email: 'nadia.koval@example.com',
          }),
        ],
      })
    )
  })

  it('gets and updates cohort through the cohorts endpoint', async () => {
    mockedApiRequestWithAuth
      .mockResolvedValueOnce({
        data: {
          groupIds: ['group-1'],
          userSelectionMode: 'groups_only',
          from: '2026-01-01',
          to: '2026-03-31',
          resolvedGroupIds: ['group-1'],
        },
      })
      .mockResolvedValueOnce({
        data: {
          groupIds: ['group-1', 'group-2'],
          userSelectionMode: 'groups_only',
          from: '2026-01-01',
          to: '2026-04-30',
          resolvedGroupIds: ['group-1', 'group-2'],
        },
      })

    const cohortResult = await getResearchProjectCohort(mockSession, 'project-1')
    const updateResult = await updateResearchProjectCohort(mockSession, 'project-1', {
      groupIds: ['group-1', 'group-2'],
      userSelectionMode: 'groups_only',
      from: '2026-01-01',
      to: '2026-04-30',
    })

    expect(mockedPerformAuthRequest).toHaveBeenNthCalledWith(
      1,
      mockSession,
      'http://localhost:3200/api/research/v1/projects/project-1/cohorts',
      undefined
    )
    expect(mockedPerformAuthRequest).toHaveBeenNthCalledWith(
      2,
      mockSession,
      'http://localhost:3200/api/research/v1/projects/project-1/cohorts',
      {
        method: 'PATCH',
        body: {
          groupIds: ['group-1', 'group-2'],
          userSelectionMode: 'groups_only',
          from: '2026-01-01',
          to: '2026-04-30',
        },
      }
    )
    expect(cohortResult).toEqual(
      expect.objectContaining({
        data: expect.objectContaining({ resolvedGroupIds: ['group-1'] }),
      })
    )
    expect(updateResult).toEqual(
      expect.objectContaining({
        data: expect.objectContaining({ groupIds: ['group-1', 'group-2'] }),
      })
    )
  })

  it('gets grants and creates a grant through the grants endpoint', async () => {
    mockedApiRequestWithAuth
      .mockResolvedValueOnce({
        data: {
          items: [
            {
              id: 'grant-1',
              title: 'Core dataset',
              allowedContracts: ['standard-dpa'],
              allowedFields: ['moodScore'],
              allowedTargets: ['subject'],
              groupIds: ['group-1'],
              userSelectionMode: 'all',
              pseudonymizationMode: 'required',
              exportAllowed: true,
            },
          ],
        },
      })
      .mockResolvedValueOnce({
        data: {
          id: 'grant-2',
          title: 'Extended dataset',
          allowedContracts: ['standard-dpa'],
          allowedFields: ['stressScore'],
          allowedTargets: ['subject'],
          groupIds: ['group-2'],
          userSelectionMode: 'groups_only',
          pseudonymizationMode: 'required',
          exportAllowed: false,
        },
      })

    const grantsResult = await getResearchProjectGrants(mockSession, 'project-1')
    const createResult = await createResearchProjectGrant(mockSession, 'project-1', {
      allowedContracts: ['standard-dpa'],
      allowedFields: ['stressScore'],
      allowedTargets: ['subject'],
      groupIds: ['group-2'],
      userSelectionMode: 'groups_only',
      pseudonymizationMode: 'required',
      from: null,
      to: null,
      exportAllowed: false,
    })

    expect(grantsResult).toEqual(
      expect.objectContaining({ data: [expect.objectContaining({ id: 'grant-1', exportAllowed: true })] })
    )
    expect(createResult).toEqual(
      expect.objectContaining({ data: expect.objectContaining({ id: 'grant-2', title: 'Extended dataset' }) })
    )
  })

  it('builds ML inspection query params and normalizes payload metadata', async () => {
    mockedApiRequestWithAuth.mockResolvedValue({
      data: {
        target: 'cohort',
        targetId: 'group-1',
        modelVersion: 'v3.2.1',
        contract: 'standard-dpa',
        governance: {
          review: {
            status: 'approved',
          },
        },
      },
    })

    const result = await getResearchProjectMLInspection(mockSession, 'project-1', {
      target: 'cohort',
      targetId: 'group-1',
      modelVersion: 'v3.2.1',
    })

    expect(mockedPerformAuthRequest).toHaveBeenCalledWith(
      mockSession,
      'http://localhost:3200/api/research/v1/projects/project-1/ml/inspection?target=cohort&targetId=group-1&modelVersion=v3.2.1',
      undefined
    )
    expect(result).toEqual(
      expect.objectContaining({
        data: expect.objectContaining({
          target: 'cohort',
          governanceMetadata: {
            'review.status': 'approved',
          },
        }),
      })
    )
  })

  it('gets the history dataset and normalizes dynamic columns', async () => {
    mockedApiRequestWithAuth.mockResolvedValue({
      data: {
        total: 2,
        items: [
          {
            id: 'row-1',
            subjectId: 'subject-1',
            cohort: 'pilot',
            from: '2026-01-01',
            to: '2026-01-31',
            diagnostics: { mood: 'stable' },
            sleepScore: 8,
            stressScore: 3,
          },
          {
            id: 'row-2',
            subjectId: 'subject-2',
            cohort: 'pilot',
            dateRange: '2026-02-01 - 2026-02-28',
            diagnostics: 'watch',
            sleepScore: 6,
          },
        ],
      },
    })

    const result = await getResearchProjectHistoryDataset(mockSession, 'project-1', {
      from: '2026-01-01',
      to: '2026-02-28',
      limit: 20,
    })

    expect(mockedPerformAuthRequest).toHaveBeenCalledWith(
      mockSession,
      'http://localhost:3200/api/research/v1/projects/project-1/datasets/history?from=2026-01-01&to=2026-02-28&limit=20',
      undefined
    )
    expect(result).toEqual(
      expect.objectContaining({
        data: expect.objectContaining({
          total: 2,
          columns: expect.arrayContaining(['sleepScore', 'stressScore']),
          items: expect.arrayContaining([expect.objectContaining({ id: 'row-1', subjectId: 'subject-1' })]),
        }),
      })
    )
  })

  it('requests exports and normalizes ready responses', async () => {
    mockedApiRequestWithAuth.mockResolvedValue({
      data: {
        status: 'ready',
        format: 'csv',
        fileName: 'history-export.csv',
        content: 'subjectId,sleepScore',
        metadata: {
          reviewer: 'admin-1',
        },
      },
    })

    const result = await requestResearchProjectExport(mockSession, 'project-1', {
      format: 'csv',
      requestedFields: ['sleepScore'],
      reason: 'Data review',
    })

    expect(mockedPerformAuthRequest).toHaveBeenCalledWith(
      mockSession,
      'http://localhost:3200/api/research/v1/projects/project-1/exports',
      {
        method: 'POST',
        body: {
          format: 'csv',
          requestedFields: ['sleepScore'],
          reason: 'Data review',
        },
      }
    )
    expect(result).toEqual(
      expect.objectContaining({
        data: expect.objectContaining({
          status: 'ready',
          fileName: 'history-export.csv',
          content: 'subjectId,sleepScore',
        }),
      })
    )
  })

  it('gets audit events and flattens metadata payloads', async () => {
    mockedApiRequestWithAuth.mockResolvedValue({
      data: {
        events: [
          {
            id: 'audit-1',
            eventType: 'export.requested',
            actorUserId: 'scientist-1',
            route: '/research/v1/projects/project-1/exports',
            createdAt: '2026-03-31T12:00:00.000Z',
            details: {
              requestedFields: ['sleepScore'],
            },
          },
        ],
      },
    })

    const result = await getResearchProjectAudit(mockSession, 'project-1')

    expect(result).toEqual(
      expect.objectContaining({
        data: [
          expect.objectContaining({
            id: 'audit-1',
            eventType: 'export.requested',
            metadata: {
              requestedFields: '["sleepScore"]',
            },
          }),
        ],
      })
    )
  })

  it('maps 403 workspace access to a denied state and derives capabilities from successful responses', async () => {
    mockedApiRequestWithAuth.mockResolvedValueOnce({
      error: { name: 'Forbidden', message: 'Forbidden', status: 403 },
    }).mockResolvedValueOnce({
      data: {
        capabilities: ['scientist', 'research_admin', 'ignored-role'],
        canCreateProject: false,
        items: [createProjectPayload()],
      },
    })

    const deniedResult = await getResearchWorkspaceAccess(mockSession)
    const accessResult = await getResearchWorkspaceAccess(mockSession)

    expect(deniedResult).toEqual({
      data: {
        hasAccess: false,
        canCreateProjects: false,
        capabilities: [],
        companies: [],
        scientists: [],
      },
    })
    expect(accessResult).toEqual(
      expect.objectContaining({
        data: {
          hasAccess: true,
          canCreateProjects: true,
          capabilities: ['scientist', 'research_admin'],
          companies: [{ id: 'company-1', name: 'Acme Research' }],
          scientists: [],
        },
      })
    )
    expect(hasResearchCapability('data' in accessResult ? accessResult.data : null)).toBe(true)
    expect(hasResearchCapability('data' in deniedResult ? deniedResult.data : null)).toBe(false)
  })

  it('resolves workspace company names when the research payload only exposes company ids', async () => {
    mockedApiRequestWithAuth.mockResolvedValue({
      data: {
        capabilities: ['scientist'],
        canCreateProject: false,
        items: [
          {
            ...createProjectPayload(),
            company: {
              id: 'company-1',
            },
          },
        ],
      },
    })
    mockedGetMyCompany.mockResolvedValue({
      data: {
        id: 'company-1',
        name: 'Acme Research',
      },
    })

    const result = await getResearchWorkspaceAccess(mockSession)

    expect(result).toEqual(
      expect.objectContaining({
        data: expect.objectContaining({
          companies: [{ id: 'company-1', name: 'Acme Research' }],
        }),
      })
    )
    expect(mockedGetMyCompany).toHaveBeenCalledWith(mockSession)
  })

  it('keeps denied 403 handling for system admins but still grants create access when backend allows the workspace', async () => {
    const adminSession: CustomSession = {
      ...mockSession,
      user: {
        ...mockSession.user!,
        role: 'admin',
      },
    }

    mockedApiRequestWithAuth.mockResolvedValueOnce({
      error: { name: 'Forbidden', message: 'Forbidden', status: 403 },
    }).mockResolvedValueOnce({
      data: {
        capabilities: [],
        canCreateProject: false,
        items: [createProjectPayload()],
      },
    })

    const deniedAdminResult = await getResearchWorkspaceAccess(adminSession)
    const grantedAdminResult = await getResearchWorkspaceAccess(adminSession)

    expect(deniedAdminResult).toEqual({
      data: {
        hasAccess: false,
        canCreateProjects: false,
        capabilities: [],
        companies: [],
        scientists: [],
      },
    })
    expect(grantedAdminResult).toEqual(
      expect.objectContaining({
        data: {
          hasAccess: true,
          canCreateProjects: true,
          capabilities: [],
          companies: [{ id: 'company-1', name: 'Acme Research' }],
          scientists: [],
        },
      })
    )
  })

  it('grants readonly workspace access when backend exposes a public demo project without research capabilities', async () => {
    mockedApiRequestWithAuth.mockResolvedValue({
      data: {
        capabilities: [],
        canCreateProject: false,
        items: [
          {
            ...createProjectPayload(),
            isPublicDemo: true,
            name: 'Demo Project — Mental Health Risk Prediction',
          },
        ],
      },
    })

    const result = await getResearchWorkspaceAccess(mockSession)

    expect(result).toEqual(
      expect.objectContaining({
        data: {
          hasAccess: true,
          canCreateProjects: false,
          capabilities: [],
          companies: [{ id: 'company-1', name: 'Acme Research' }],
          scientists: [],
        },
      })
    )
  })

  it('rejects malformed members and grants instead of silently dropping entries', async () => {
    mockedApiRequestWithAuth.mockResolvedValueOnce({ data: { members: [{ userId: 'user-1' }, {}] } })

    await expect(getResearchProjectMembers(mockSession, 'project-1')).resolves.toEqual({
      error: 'Invalid research members response from backend',
      status: 502,
    })

    mockedApiRequestWithAuth.mockResolvedValueOnce({ data: { items: [{ id: 'grant-1' }, {}] } })
    await expect(getResearchProjectGrants(mockSession, 'project-1')).resolves.toEqual({
      error: 'Invalid research grants response from backend',
      status: 502,
    })
  })

  it('rejects malformed audit history instead of reporting an empty audit', async () => {
    mockedApiRequestWithAuth.mockResolvedValueOnce({ data: { events: 'invalid' } })

    await expect(getResearchProjectAudit(mockSession, 'project-1')).resolves.toEqual({
      error: 'Invalid research audit response from backend',
      status: 502,
    })
  })

  it('does not grant research workspace access for a malformed successful response', async () => {
    mockedApiRequestWithAuth.mockResolvedValueOnce({ data: {} })

    await expect(getResearchWorkspaceAccess(mockSession)).resolves.toEqual({
      error: 'Invalid research workspace response from backend',
      status: 502,
    })

    mockedApiRequestWithAuth.mockResolvedValueOnce({ data: { capabilities: ['scientist'], canCreateProject: false } })
    const access = await getResearchWorkspaceAccess(mockSession)
    expect(access).toHaveProperty('data.hasAccess', true)
  })

  it('rejects invalid workspace company metadata before returning access', async () => {
    mockedApiRequestWithAuth.mockResolvedValueOnce({ data: { companies: [null, {}] } })

    await expect(getResearchWorkspaceAccess(mockSession)).resolves.toEqual({
      error: 'Invalid research workspace response from backend',
      status: 502,
    })
  })

  it('preserves upstream 503 for research requests', async () => {
    mockedApiRequestWithAuth.mockResolvedValue({
      error: { name: 'ServiceUnavailable', message: 'Service unavailable', status: 503 },
    })

    await expect(getResearchProjects(mockSession)).resolves.toEqual({
      error: 'Service unavailable',
      status: 503,
    })
  })

  it('preserves company boundary 403 as an error instead of masking it as denied access', async () => {
    mockedApiRequestWithAuth.mockResolvedValue({
      error: {
        name: 'Forbidden',
        message: 'Company boundary для research layer не визначено',
        status: 403,
      },
    })

    await expect(getResearchWorkspaceAccess(mockSession)).resolves.toEqual({
      error: 'Company boundary для research layer не визначено',
      status: 403,
    })
  })
})
