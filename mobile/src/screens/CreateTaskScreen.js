import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { taskAPI } from '../services/api';
import { Button } from '../components/UI';
import { COLORS, SPACING, RADIUS, FONTS } from '../utils/theme';

const PRIORITIES = ['low', 'medium', 'high'];
const STATUSES = ['pending', 'in_progress', 'completed'];

const CreateTaskScreen = ({ route, navigation }) => {
  const editTask = route.params?.task;
  const isEditing = !!editTask;

  const [title, setTitle] = useState(editTask?.title || '');
  const [description, setDescription] = useState(editTask?.description || '');
  const [priority, setPriority] = useState(editTask?.priority || 'medium');
  const [status, setStatus] = useState(editTask?.status || 'pending');
  const [assignedTo, setAssignedTo] = useState(editTask?.assignedTo?._id || '');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUsers();
    navigation.setOptions({ title: isEditing ? 'Edit Task' : 'New Task' });
  }, []);

  const loadUsers = async () => {
    try {
      const res = await taskAPI.getUsers();
      setUsers(res.data.users);
      if (!assignedTo && res.data.users.length > 0) {
        setAssignedTo(res.data.users[0]._id);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load users: ' + error.message);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Missing Title', 'Please enter a task title.');
      return;
    }
    if (!assignedTo) {
      Alert.alert('Missing Assignment', 'Please assign this task to a user.');
      return;
    }

    try {
      setLoading(true);
      if (isEditing) {
        await taskAPI.update(editTask._id, { title, description, priority, status, assignedTo });
      } else {
        await taskAPI.create({ title, description, priority, status, assignedTo });
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const OptionPicker = ({ label, options, value, onSelect, getLabel, getColor }) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.optionRow}>
        {options.map((opt) => {
          const isActive = value === opt;
          const color = getColor ? getColor(opt) : COLORS.primary;
          return (
            <TouchableOpacity
              key={opt}
              style={[styles.optionBtn, isActive && { borderColor: color, backgroundColor: color + '22' }]}
              onPress={() => onSelect(opt)}
            >
              <Text style={[styles.optionBtnText, isActive && { color }]}>
                {getLabel ? getLabel(opt) : opt}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const getPriorityColor = (p) => ({
    high: COLORS.danger, medium: COLORS.warning, low: COLORS.info
  }[p] || COLORS.primary);

  const getStatusColor = (s) => ({
    pending: COLORS.warning, in_progress: COLORS.info, completed: COLORS.success
  }[s] || COLORS.primary);

  const getStatusLabel = (s) => ({
    pending: '⏳ Pending', in_progress: '🔄 In Progress', completed: '✅ Completed'
  }[s] || s);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      {/* Title */}
      <View style={styles.field}>
        <Text style={styles.label}>Task Title *</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. Fix login bug"
          placeholderTextColor={COLORS.textMuted}
        />
      </View>

      {/* Description */}
      <View style={styles.field}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Add more context or details..."
          placeholderTextColor={COLORS.textMuted}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      {/* Priority */}
      <OptionPicker
        label="Priority"
        options={PRIORITIES}
        value={priority}
        onSelect={setPriority}
        getLabel={(p) => p.charAt(0).toUpperCase() + p.slice(1)}
        getColor={getPriorityColor}
      />

      {/* Status */}
      <OptionPicker
        label="Status"
        options={STATUSES}
        value={status}
        onSelect={setStatus}
        getLabel={getStatusLabel}
        getColor={getStatusColor}
      />

      {/* Assign To */}
      <View style={styles.field}>
        <Text style={styles.label}>Assign To *</Text>
        {users.length === 0 ? (
          <Text style={styles.noUsersText}>Loading users...</Text>
        ) : (
          <View style={styles.userGrid}>
            {users.map((u) => {
              const isActive = assignedTo === u._id;
              return (
                <TouchableOpacity
                  key={u._id}
                  style={[styles.userBtn, isActive && styles.userBtnActive]}
                  onPress={() => setAssignedTo(u._id)}
                >
                  <View style={[styles.userAvatar, isActive && styles.userAvatarActive]}>
                    <Text style={[styles.userAvatarText, isActive && { color: '#fff' }]}>
                      {u.name[0].toUpperCase()}
                    </Text>
                  </View>
                  <Text style={[styles.userName, isActive && { color: COLORS.primary }]} numberOfLines={1}>
                    {u.name}
                  </Text>
                  <Text style={styles.userRole}>{u.role}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>

      <Button
        title={isEditing ? 'Save Changes' : 'Create Task'}
        onPress={handleSubmit}
        loading={loading}
        size="lg"
        style={{ marginTop: SPACING.md }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: SPACING.lg, paddingBottom: SPACING.xxxl },
  field: { marginBottom: SPACING.lg },
  label: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    marginBottom: SPACING.xs,
    letterSpacing: 0.3,
  },
  input: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    color: COLORS.textPrimary,
    fontSize: FONTS.sizes.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  textArea: { minHeight: 100 },
  optionRow: { flexDirection: 'row', gap: SPACING.sm },
  optionBtn: {
    flex: 1,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  optionBtnText: { color: COLORS.textSecondary, fontSize: FONTS.sizes.xs, fontWeight: '600' },
  userGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  userBtn: {
    width: '47%',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  userBtnActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '15' },
  userAvatar: {
    width: 36, height: 36,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.bgElevated,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: SPACING.xs,
  },
  userAvatarActive: { backgroundColor: COLORS.primary },
  userAvatarText: { color: COLORS.textSecondary, fontWeight: '700', fontSize: FONTS.sizes.md },
  userName: { color: COLORS.textPrimary, fontSize: FONTS.sizes.sm, fontWeight: '600' },
  userRole: { color: COLORS.textMuted, fontSize: FONTS.sizes.xs, marginTop: 2 },
  noUsersText: { color: COLORS.textMuted, fontSize: FONTS.sizes.sm },
});

export default CreateTaskScreen;
