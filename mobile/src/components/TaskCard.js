import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS, FONTS, STATUS_CONFIG, PRIORITY_CONFIG } from '../utils/theme';
import { Badge } from './UI';

const TaskCard = ({ task, onPress, onStatusChange, isAdmin }) => {
  const statusCfg = STATUS_CONFIG[task.status] || STATUS_CONFIG.pending;
  const priorityCfg = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;

  const getNextStatus = () => {
    if (task.status === 'pending') return 'in_progress';
    if (task.status === 'in_progress') return 'completed';
    return null;
  };

  const nextStatus = getNextStatus();
  const nextStatusLabel = nextStatus
    ? nextStatus === 'in_progress'
      ? 'Start'
      : 'Complete'
    : null;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={styles.card}>
      {/* Priority indicator strip */}
      <View style={[styles.priorityStrip, { backgroundColor: priorityCfg.color }]} />

      <View style={styles.content}>
        {/* Header row */}
        <View style={styles.headerRow}>
          <View style={styles.badgeRow}>
            <Badge label={statusCfg.label} color={statusCfg.color} bg={statusCfg.bg} />
            <Badge
              label={priorityCfg.label}
              color={priorityCfg.color}
              bg={priorityCfg.bg}
            />
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>
          {task.title}
        </Text>

        {/* Description */}
        {task.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {task.description}
          </Text>
        ) : null}

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.assigneeRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {(task.assignedTo?.name || '?')[0].toUpperCase()}
              </Text>
            </View>
            <Text style={styles.assigneeName} numberOfLines={1}>
              {isAdmin ? task.assignedTo?.name || 'Unassigned' : 'You'}
            </Text>
          </View>

          {nextStatusLabel && onStatusChange && (
            <TouchableOpacity
              style={[styles.quickActionBtn, { borderColor: statusCfg.color }]}
              onPress={() => onStatusChange(task._id, nextStatus)}
            >
              <Text style={[styles.quickActionText, { color: statusCfg.color }]}>
                {statusCfg.icon} {nextStatusLabel}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  priorityStrip: {
    width: 4,
    borderRadius: RADIUS.sm,
  },
  content: {
    flex: 1,
    padding: SPACING.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: SPACING.xs,
    flexWrap: 'wrap',
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    marginBottom: SPACING.xs,
    lineHeight: 22,
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.sm,
    lineHeight: 19,
    marginBottom: SPACING.sm,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.xs,
  },
  assigneeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  avatar: {
    width: 22,
    height: 22,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary + '44',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: COLORS.primary,
    fontSize: FONTS.sizes.xs,
    fontWeight: '700',
  },
  assigneeName: {
    color: COLORS.textMuted,
    fontSize: FONTS.sizes.xs,
    maxWidth: 120,
  },
  quickActionBtn: {
    borderWidth: 1,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
  },
  quickActionText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '600',
  },
});

export default TaskCard;
