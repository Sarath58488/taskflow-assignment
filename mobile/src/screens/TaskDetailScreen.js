import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { taskAPI } from '../services/api';
import { Badge, Button, Card, LoadingScreen } from '../components/UI';
import { COLORS, SPACING, RADIUS, FONTS, STATUS_CONFIG, PRIORITY_CONFIG } from '../utils/theme';

const STATUS_OPTIONS = ['pending', 'in_progress', 'completed'];

const TaskDetailScreen = ({ route, navigation }) => {
  const { taskId } = route.params;
  const { isAdmin } = useAuth();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadTask();
  }, [taskId]);

  const loadTask = async () => {
    try {
      const res = await taskAPI.getOne(taskId);
      setTask(res.data.task);
    } catch (error) {
      Alert.alert('Error', error.message);
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      setUpdating(true);
      const res = await taskAPI.update(taskId, { status: newStatus });
      setTask(res.data.task);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete Task', 'Are you sure you want to delete this task? This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await taskAPI.delete(taskId);
            navigation.goBack();
          } catch (error) {
            Alert.alert('Error', error.message);
          }
        },
      },
    ]);
  };

  if (loading || !task) return <LoadingScreen message="Loading task..." />;

  const statusCfg = STATUS_CONFIG[task.status];
  const priorityCfg = PRIORITY_CONFIG[task.priority];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Status & Priority */}
      <View style={styles.badgeRow}>
        <Badge label={statusCfg.label} color={statusCfg.color} bg={statusCfg.bg} size="md" />
        <Badge label={priorityCfg.label} color={priorityCfg.color} bg={priorityCfg.bg} size="md" />
      </View>

      {/* Title */}
      <Text style={styles.title}>{task.title}</Text>

      {/* Description */}
      <Card style={styles.descCard}>
        <Text style={styles.sectionLabel}>Description</Text>
        <Text style={styles.description}>
          {task.description || 'No description provided.'}
        </Text>
      </Card>

      {/* Metadata */}
      <Card style={styles.metaCard}>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Assigned To</Text>
          <View style={styles.metaValueRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {(task.assignedTo?.name || '?')[0].toUpperCase()}
              </Text>
            </View>
            <Text style={styles.metaValue}>{task.assignedTo?.name || 'N/A'}</Text>
          </View>
        </View>

        <View style={[styles.metaRow, { borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: SPACING.md, marginTop: SPACING.sm }]}>
          <Text style={styles.metaLabel}>Created By</Text>
          <Text style={styles.metaValue}>{task.createdBy?.name || 'N/A'}</Text>
        </View>

        <View style={[styles.metaRow, { borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: SPACING.md, marginTop: SPACING.sm }]}>
          <Text style={styles.metaLabel}>Created At</Text>
          <Text style={styles.metaValue}>
            {new Date(task.createdAt).toLocaleDateString('en-US', {
              month: 'short', day: 'numeric', year: 'numeric',
            })}
          </Text>
        </View>
      </Card>

      {/* Status Update */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Update Status</Text>
        <View style={styles.statusRow}>
          {STATUS_OPTIONS.map((s) => {
            const cfg = STATUS_CONFIG[s];
            const isActive = task.status === s;
            return (
              <TouchableOpacity
                key={s}
                style={[
                  styles.statusBtn,
                  { borderColor: cfg.color },
                  isActive && { backgroundColor: cfg.bg },
                ]}
                onPress={() => !isActive && handleStatusUpdate(s)}
                disabled={isActive || updating}
              >
                <Text style={[styles.statusBtnText, { color: isActive ? cfg.color : COLORS.textMuted }]}>
                  {cfg.icon} {cfg.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Admin actions */}
      {isAdmin && (
        <View style={styles.adminActions}>
          <Button
            title="Edit Task"
            variant="outline"
            onPress={() => navigation.navigate('CreateTask', { task })}
            style={{ flex: 1 }}
          />
          <Button
            title="Delete"
            variant="danger"
            onPress={handleDelete}
            style={{ flex: 1 }}
          />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: SPACING.lg, paddingBottom: SPACING.xxxl },
  badgeRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md },
  title: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sizes.xxl,
    fontWeight: '800',
    lineHeight: 32,
    marginBottom: SPACING.lg,
  },
  descCard: { marginBottom: SPACING.md },
  metaCard: { marginBottom: SPACING.lg },
  sectionLabel: {
    color: COLORS.textMuted,
    fontSize: FONTS.sizes.xs,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: SPACING.sm,
  },
  description: { color: COLORS.textSecondary, fontSize: FONTS.sizes.md, lineHeight: 22 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  metaLabel: { color: COLORS.textMuted, fontSize: FONTS.sizes.sm },
  metaValue: { color: COLORS.textPrimary, fontSize: FONTS.sizes.sm, fontWeight: '600' },
  metaValueRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  avatar: {
    width: 24, height: 24, borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary + '33',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { color: COLORS.primary, fontSize: FONTS.sizes.xs, fontWeight: '700' },
  section: { marginBottom: SPACING.xl },
  statusRow: { flexDirection: 'row', gap: SPACING.sm, flexWrap: 'wrap' },
  statusBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    alignItems: 'center',
    minWidth: 90,
  },
  statusBtnText: { fontSize: FONTS.sizes.xs, fontWeight: '700' },
  adminActions: { flexDirection: 'row', gap: SPACING.md },
});

export default TaskDetailScreen;
