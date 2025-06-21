import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

export interface AuditEvent {
  action: string;
  entity: string;
  recordId?: string;
  changes: Record<string, any>;
  timestamp: Date;
}

class RealAuditService {
  private JWT_SECRET = process.env.JWT_SECRET || 'default-secret-for-dev';

  async logEvent(empresaId: string, usuarioId: string | null, event: AuditEvent): Promise<void> {
    try {
      await prisma.auditLog.create({
        data: {
          empresaId,
          usuarioId,
          action: event.action,
          entity: event.entity,
          recordId: event.recordId,
          changes: event.changes,
          timestamp: event.timestamp
        }
      });
    } catch (error) {
      console.error('Error logging audit event:', error);
    }
  }

  async getAuditLogs(empresaId: string, filters?: {
    entity?: string;
    usuarioId?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }) {
    try {
      let where: any = { empresaId };

      if (filters?.entity) where.entity = filters.entity;
      if (filters?.usuarioId) where.usuarioId = filters.usuarioId;
      if (filters?.startDate || filters?.endDate) {
        where.timestamp = {};
        if (filters.startDate) where.timestamp.gte = filters.startDate;
        if (filters.endDate) where.timestamp.lte = filters.endDate;
      }

      return await prisma.auditLog.findMany({
        where,
        orderBy: { timestamp: 'desc' },
        take: filters?.limit || 100
      });
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      return [];
    }
  }

  // Hash de eventos para integridad
  signEvent(event: AuditEvent): string {
    const eventString = JSON.stringify(event);
    return jwt.sign({ eventData: eventString }, this.JWT_SECRET);
  }

  verifyEventSignature(event: AuditEvent, signature: string): boolean {
    try {
      const decoded = jwt.verify(signature, this.JWT_SECRET) as any;
      const eventString = JSON.stringify(event);
      return decoded.eventData === eventString;
    } catch {
      return false;
    }
  }
}

export const realAuditService = new RealAuditService();
export default realAuditService;
