import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  KeyboardAvoidingView, Platform, Modal,
} from 'react-native';
import { useStore } from '../store';
import { useTheme } from '../theme/ThemeContext';
import { CATEGORIES } from '../data/seed';
import { radius, spacing } from '../theme';
import { Avatar, CatMark, StatusTag, ConfirmTrack, Card, Btn } from '../components/primitives';
import Icon from '../components/Icon';

function SuggestPatrolForm({ onSubmit, onCancel }) {
  const { colors } = useTheme();
  const [time, setTime] = useState('');
  const [gather, setGather] = useState('');
  const [comment, setComment] = useState('');
  const canSubmit = time.trim().length > 2 && gather.trim().length > 4;
  const inputStyle = {
    borderWidth: 1.5, borderColor: colors.line, borderRadius: radius.control,
    padding: 12, fontSize: 14, color: colors.ink, backgroundColor: colors.surfaceAlt, marginBottom: 10,
  };
  return (
    <View style={{ padding: spacing.pad, backgroundColor: colors.accentSoft, borderRadius: radius.card, gap: 10 }}>
      <Text style={{ fontSize: 15, fontWeight: '800', color: colors.ink }}>Suggest a patrol</Text>
      <Text style={{ fontSize: 13, color: colors.inkSoft, lineHeight: 18 }}>
        No GPS — use landmarks or street descriptions.
      </Text>
      <TextInput value={time} onChangeText={setTime} placeholder="When? (e.g. Tonight at 8pm)" placeholderTextColor={colors.inkFaint} style={inputStyle} />
      <TextInput value={gather} onChangeText={setGather} placeholder="Where to meet? (e.g. Corner of Elm & 4th)" placeholderTextColor={colors.inkFaint} style={[inputStyle, { minHeight: 60, textAlignVertical: 'top' }]} multiline />
      <TextInput value={comment} onChangeText={setComment} placeholder="Comment (optional) — what's the plan?" placeholderTextColor={colors.inkFaint} style={[inputStyle, { minHeight: 60, textAlignVertical: 'top' }]} multiline />
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Btn label="Cancel" variant="ghost" onPress={onCancel} style={{ flex: 1 }} />
        <Btn label="Post Patrol" icon="navigation" onPress={() => onSubmit({ time, gather, comment })} disabled={!canSubmit} style={{ flex: 2 }} />
      </View>
    </View>
  );
}

// ── Resolve modal ──────────────────────────────────────────────────────────
function ResolveModal({ visible, onConfirm, onCancel }) {
  const { colors } = useTheme();
  const [note, setNote] = useState('');
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' }}>
        <View style={{ backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: spacing.pad, paddingBottom: 36, gap: 14 }}>
          <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: colors.line, alignSelf: 'center', marginBottom: 4 }} />
          <Text style={{ fontSize: 17, fontWeight: '800', color: colors.ink }}>Mark as resolved</Text>
          <Text style={{ fontSize: 13.5, color: colors.inkSoft, lineHeight: 19 }}>
            Let the community know this situation has been dealt with. Add a brief close-out note.
          </Text>
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="What happened? (e.g. Police arrived, situation diffused)"
            placeholderTextColor={colors.inkFaint}
            multiline
            style={{
              borderWidth: 1.5, borderColor: colors.line, borderRadius: radius.control,
              padding: 14, fontSize: 14, color: colors.ink, backgroundColor: colors.surfaceAlt,
              minHeight: 90, textAlignVertical: 'top',
            }}
          />
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Btn label="Cancel" variant="outline" onPress={onCancel} style={{ flex: 1 }} />
            <Btn label="Mark Resolved" icon="check" onPress={() => { onConfirm(note); setNote(''); }} style={{ flex: 2 }} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function IncidentDetailScreen({ route, navigation }) {
  const { incidentId } = route.params;
  const { colors } = useTheme();
  const incident = useStore(s => s.incidents.find(i => i.id === incidentId));
  const zone = useStore(s => s.zones.find(z => z.id === incident?.zone));
  const relatedPatrols = useStore(s => s.patrols.filter(p => p.incident === incidentId));
  const confirmIncident = useStore(s => s.confirmIncident);
  const resolveIncident = useStore(s => s.resolveIncident);
  const flagIncident = useStore(s => s.flagIncident);
  const toggleRSVP = useStore(s => s.toggleRSVP);
  const suggestPatrol = useStore(s => s.suggestPatrol);

  const [showPatrolForm, setShowPatrolForm] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [toast, setToast] = useState('');

  if (!incident) return null;

  const zoneName = zone ? (zone.name.split(' — ')[1] || zone.name) : '';
  const isResolved = incident.status === 'resolved';
  const canSuggestPatrol = incident.confirms >= 3 && !isResolved;
  const canResolve = !isResolved && (incident.reporter === 'You' || incident.status === 'verified');
  const canFlag = !isResolved && incident.reporter !== 'You' && !incident.flaggedByMe;

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3200); };

  const handleConfirm = () => {
    const msg = confirmIncident(incidentId);
    if (msg) showToast(msg);
  };

  const handleResolve = (note) => {
    setShowResolveModal(false);
    const msg = resolveIncident(incidentId, note);
    if (msg) showToast(msg);
  };

  const handleFlag = () => {
    const msg = flagIncident(incidentId);
    if (msg) showToast(msg);
  };

  const handleSuggestPatrol = ({ time, gather, comment }) => {
    const msg = suggestPatrol({ incident: incidentId, comment, time, gather });
    setShowPatrolForm(false);
    showToast(msg);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Header */}
      <View style={{
        paddingTop: 54, paddingHorizontal: spacing.pad, paddingBottom: 14,
        backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.line,
        flexDirection: 'row', alignItems: 'center', gap: 12,
      }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="chevron-left" size={24} color={colors.ink} />
        </TouchableOpacity>
        <CatMark cat={incident.cat} size={34} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: '800', color: colors.ink, lineHeight: 20 }} numberOfLines={2}>
            {incident.title}
          </Text>
          <Text style={{ fontSize: 12, color: colors.inkFaint, marginTop: 2 }}>
            {zoneName} · {incident.ago}
          </Text>
        </View>
        {/* Flag button */}
        {canFlag && (
          <TouchableOpacity onPress={handleFlag} style={{ padding: 6 }}>
            <Icon name="flag" size={18} color={colors.inkFaint} />
          </TouchableOpacity>
        )}
        {incident.flaggedByMe && (
          <View style={{ padding: 6 }}>
            <Icon name="flag" size={18} color={colors.catLost} />
          </View>
        )}
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: spacing.pad, gap: 16 }}>
        {/* Flags warning */}
        {incident.flags >= 2 && (
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8, padding: 12, backgroundColor: colors.catLost + '18', borderRadius: radius.control }}>
            <Icon name="flag" size={14} color={colors.catLost} style={{ marginTop: 1 }} />
            <Text style={{ fontSize: 12.5, color: colors.catLost, flex: 1, lineHeight: 18 }}>
              This report has been flagged by {incident.flags} members as potentially inaccurate. Use your judgement.
            </Text>
          </View>
        )}

        {/* Status + confirms */}
        <Card style={{ padding: spacing.pad, gap: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <StatusTag status={incident.status} />
            <View style={{ flex: 1 }} />
            <ConfirmTrack confirms={incident.confirms} />
            <Text style={{ fontSize: 12, color: colors.inkFaint }}>{incident.confirms}/3</Text>
          </View>
          <Text style={{ fontSize: 14.5, color: colors.inkSoft, lineHeight: 21 }}>{incident.note}</Text>

          {/* Resolved note */}
          {isResolved && incident.resolvedNote && (
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8, padding: 10, backgroundColor: colors.accentSoft, borderRadius: radius.chip }}>
              <Icon name="check" size={13} color={colors.accent} style={{ marginTop: 1 }} />
              <Text style={{ fontSize: 13, color: colors.accent, flex: 1, lineHeight: 18 }}>{incident.resolvedNote}</Text>
            </View>
          )}

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingTop: 4, borderTopWidth: 1, borderTopColor: colors.lineSoft }}>
            <Avatar initials={incident.reporter.slice(0, 2)} size={26} />
            <Text style={{ fontSize: 12, color: colors.inkFaint, flex: 1 }}>
              {incident.reporter} · Trust {incident.reporterTrust}
            </Text>
          </View>
        </Card>

        {/* Confirm action */}
        {!incident.confirmedByMe && !isResolved && (
          <Card style={{ padding: spacing.pad }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: colors.ink, marginBottom: 6 }}>Can you confirm this?</Text>
            <Text style={{ fontSize: 13, color: colors.inkSoft, lineHeight: 18, marginBottom: 12 }}>
              Three community confirmations mark it as Verified.
            </Text>
            <Btn label="Confirm this incident" icon="check" onPress={handleConfirm} />
          </Card>
        )}

        {/* Resolve action */}
        {canResolve && (
          <Card style={{ padding: spacing.pad }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: colors.ink, marginBottom: 6 }}>
              {incident.reporter === 'You' ? 'Is this resolved?' : 'Mark as resolved'}
            </Text>
            <Text style={{ fontSize: 13, color: colors.inkSoft, lineHeight: 18, marginBottom: 12 }}>
              {incident.reporter === 'You'
                ? 'You reported this. Let the community know if the situation has been dealt with.'
                : 'This incident is verified. If the situation is resolved, update the community.'}
            </Text>
            <Btn label="Mark as resolved" icon="check" variant="outline" onPress={() => setShowResolveModal(true)} />
          </Card>
        )}

        {/* Community Response / Patrols */}
        <View>
          <Text style={{ fontSize: 17, fontWeight: '800', color: colors.ink, marginBottom: 10 }}>Community Response</Text>

          {!canSuggestPatrol && !isResolved && (
            <Card style={{ padding: spacing.pad, marginBottom: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
                <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: colors.lineSoft, alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="info" size={16} color={colors.inkFaint} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 13.5, fontWeight: '700', color: colors.ink, marginBottom: 3 }}>Patrols unlock at 3 confirmations</Text>
                  <Text style={{ fontSize: 12.5, color: colors.inkSoft, lineHeight: 17 }}>
                    Once confirmed by 3 community members, anyone can suggest a coordinated patrol.
                  </Text>
                </View>
              </View>
            </Card>
          )}

          {canSuggestPatrol && !showPatrolForm && (
            <Btn label="Suggest a patrol" icon="navigation" variant="outline" onPress={() => setShowPatrolForm(true)} style={{ marginBottom: 12 }} />
          )}

          {showPatrolForm && (
            <View style={{ marginBottom: 12 }}>
              <SuggestPatrolForm onSubmit={handleSuggestPatrol} onCancel={() => setShowPatrolForm(false)} />
            </View>
          )}

          {relatedPatrols.map(p => (
            <Card key={p.id} style={{ padding: spacing.pad, marginBottom: 10, gap: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Avatar initials={p.host.slice(0, 2)} size={30} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 13.5, fontWeight: '700', color: colors.ink }}>{p.host}</Text>
                  <Text style={{ fontSize: 11.5, color: colors.inkFaint }}>{p.ago}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => toggleRSVP(p.id)}
                  activeOpacity={0.75}
                  style={{ borderRadius: radius.control, paddingHorizontal: 12, paddingVertical: 7, backgroundColor: p.goingByMe ? colors.accentSoft : colors.accent, borderWidth: 1.5, borderColor: p.goingByMe ? colors.accent : 'transparent' }}>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: p.goingByMe ? colors.accent : colors.onAccent }}>
                    {p.goingByMe ? 'Going ✓' : "I'm in"}
                  </Text>
                </TouchableOpacity>
              </View>
              <Text style={{ fontSize: 13.5, color: colors.inkSoft, lineHeight: 19 }}>{p.comment}</Text>
              <View style={{ gap: 5 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
                  <Icon name="clock" size={13} color={colors.inkFaint} />
                  <Text style={{ fontSize: 12.5, color: colors.inkSoft }}>{p.time}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
                  <Icon name="map-pin" size={13} color={colors.inkFaint} />
                  <Text style={{ fontSize: 12.5, color: colors.inkSoft }}>{p.gather}</Text>
                </View>
              </View>
              <Text style={{ fontSize: 11.5, color: colors.inkFaint }}>{p.going}/{p.slots} going</Text>
            </Card>
          ))}

          {relatedPatrols.length === 0 && canSuggestPatrol && (
            <View style={{ alignItems: 'center', paddingVertical: 24 }}>
              <Text style={{ fontSize: 13.5, color: colors.inkFaint, textAlign: 'center', lineHeight: 19 }}>
                No patrols organized yet. Be the first to suggest one.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <ResolveModal visible={showResolveModal} onConfirm={handleResolve} onCancel={() => setShowResolveModal(false)} />

      {toast ? (
        <View style={{ position: 'absolute', left: 14, right: 14, bottom: 20, alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.ink, borderRadius: radius.control + 2, paddingVertical: 12, paddingHorizontal: 16, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 12, elevation: 8 }}>
            <Icon name="check" size={15} color={colors.bg} />
            <Text style={{ fontSize: 13.5, fontWeight: '600', color: colors.bg }}>{toast}</Text>
          </View>
        </View>
      ) : null}
    </KeyboardAvoidingView>
  );
}
