/**
 * Draft Storage Manager (Max 3 Slots in LocalStorage)
 * Zero backend required, 100% private, isolated per machine/browser.
 */

const STORAGE_KEY = 's_ppt_drafts_v1';
const MAX_SLOTS = 3;

/**
 * Get all 3 draft slots. Always returns an array of length 3.
 * Empty slots have { id: null, isEmpty: true, slotIndex: i }
 */
export function getDrafts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    
    const slots = [];
    for (let i = 0; i < MAX_SLOTS; i++) {
      if (parsed[i] && parsed[i].id) {
        slots.push({
          ...parsed[i],
          slotIndex: i,
          isEmpty: false
        });
      } else {
        slots.push({
          id: null,
          slotIndex: i,
          isEmpty: true,
          name: `Draft Slot ${i + 1}`,
          updatedAt: null,
          slideCount: 0,
          slides: []
        });
      }
    }
    return slots;
  } catch (err) {
    console.error('Failed to load drafts from localStorage:', err);
    return [
      { id: null, slotIndex: 0, isEmpty: true, name: 'Draft Slot 1', slides: [] },
      { id: null, slotIndex: 1, isEmpty: true, name: 'Draft Slot 2', slides: [] },
      { id: null, slotIndex: 2, isEmpty: true, name: 'Draft Slot 3', slides: [] },
    ];
  }
}

/**
 * Get count of currently occupied draft slots (0 to 3).
 */
export function getOccupiedDraftCount() {
  const drafts = getDrafts();
  return drafts.filter(d => !d.isEmpty).length;
}

/**
 * Save presentation data to a specific slot (0, 1, or 2).
 */
export function saveDraftToSlot(slotIndex, { name, slides }) {
  if (slotIndex < 0 || slotIndex >= MAX_SLOTS) {
    return { success: false, error: 'Invalid slot index' };
  }

  try {
    const drafts = getDrafts();
    const dominantBg = slides[0]?.background?.color || 
      (typeof slides[0]?.background === 'string' ? slides[0].background : '#ffffff');

    const draftItem = {
      id: `draft_${slotIndex + 1}_${Date.now()}`,
      slotIndex,
      name: name || `Untitled Presentation ${slotIndex + 1}`,
      updatedAt: new Date().toISOString(),
      slideCount: slides.length,
      dominantBg,
      slides,
      isEmpty: false
    };

    drafts[slotIndex] = draftItem;

    const toStore = drafts.map(d => d.isEmpty ? null : d);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));

    return { success: true, slotIndex, draft: draftItem, drafts };
  } catch (err) {
    console.error('Failed to save draft:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Automatically save to the first available slot.
 * If all 3 slots are full, returns { requiresSlotChoice: true, drafts }
 */
export function autoSaveDraft({ name, slides }) {
  const drafts = getDrafts();
  const emptyIndex = drafts.findIndex(d => d.isEmpty);

  if (emptyIndex !== -1) {
    return saveDraftToSlot(emptyIndex, { name, slides });
  }

  // All 3 slots full -> prompt user to pick which slot to overwrite
  return {
    success: false,
    requiresSlotChoice: true,
    drafts
  };
}

/**
 * Delete / clear a draft slot.
 */
export function deleteDraft(slotIndex) {
  if (slotIndex < 0 || slotIndex >= MAX_SLOTS) return false;
  try {
    const drafts = getDrafts();
    drafts[slotIndex] = null;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
    return true;
  } catch (err) {
    console.error('Failed to delete draft:', err);
    return false;
  }
}

/**
 * Get a draft by its slot index.
 */
export function getDraftByIndex(slotIndex) {
  const drafts = getDrafts();
  return drafts[slotIndex] || null;
}
