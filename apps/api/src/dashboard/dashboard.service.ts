import { Injectable } from '@nestjs/common';
import { prisma } from '@saas/db';

function getRoleBuckets(candidates: Array<{ role: string }>) {
  const map = new Map<string, number>();
  for (const candidate of candidates) {
    const key = candidate.role.trim() || 'Unknown';
    map.set(key, (map.get(key) ?? 0) + 1);
  }

  return [...map.entries()]
    .map(([role, count]) => ({ role, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
}

@Injectable()
export class DashboardService {
  async summary() {
    const now = Date.now();
    const sevenDays = 1000 * 60 * 60 * 24 * 7;
    const startCurrentWeek = new Date(now - sevenDays);
    const startPreviousWeek = new Date(now - sevenDays * 2);

    const [allCandidates, currentWeekCount, previousWeekCount] = await Promise.all([
      prisma.candidate.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          role: true,
          status: true,
          email: true,
          phone: true,
          technologies: true,
          createdAt: true
        }
      }),
      prisma.candidate.count({
        where: {
          createdAt: { gte: startCurrentWeek }
        }
      }),
      prisma.candidate.count({
        where: {
          createdAt: { gte: startPreviousWeek, lt: startCurrentWeek }
        }
      })
    ]);

    const totals = {
      total: allCandidates.length,
      active: allCandidates.filter((candidate) => candidate.status === 'Active').length,
      pending: allCandidates.filter((candidate) => candidate.status === 'Pending').length,
      inactive: allCandidates.filter((candidate) => candidate.status === 'Inactive').length
    };

    const completeProfiles = allCandidates.filter(
      (candidate) =>
        Boolean(candidate.email) &&
        Boolean(candidate.phone) &&
        Boolean(candidate.technologies.trim())
    ).length;
    const partialProfiles = allCandidates.length - completeProfiles;
    const completenessRate = allCandidates.length
      ? Math.round((completeProfiles / allCandidates.length) * 100)
      : 0;

    return {
      kpis: totals,
      weekOverWeek: {
        current: currentWeekCount,
        previous: previousWeekCount,
        delta: currentWeekCount - previousWeekCount
      },
      funnel: {
        sourced: totals.total,
        active: totals.active,
        pending: totals.pending
      },
      profileCompleteness: {
        complete: completeProfiles,
        partial: partialProfiles,
        rate: completenessRate
      },
      roleDemandVsAvailability: getRoleBuckets(allCandidates)
    };
  }
}
