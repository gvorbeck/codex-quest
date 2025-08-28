import { useEffect, useState, useMemo, useCallback } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FIREBASE_COLLECTIONS } from "@/constants/firebase";
import { useAuth } from "@/hooks/useAuth";

interface UseFirebaseSheetParams {
  userId: string | undefined;
  entityId: string | undefined;
  collection: keyof typeof FIREBASE_COLLECTIONS;
}

interface UseFirebaseSheetReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  isOwner: boolean;
  isUpdating: boolean;
  updateEntity: (updatedData: T, optimistic?: boolean) => Promise<void>;
  clearError: () => void;
  setError: (error: string) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useFirebaseSheet<T extends Record<string, any>>({
  userId,
  entityId,
  collection,
}: UseFirebaseSheetParams): UseFirebaseSheetReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const { user } = useAuth();

  // Check if the current user owns this entity
  const isOwner = useMemo(() => {
    return Boolean(user && userId === user.uid);
  }, [user, userId]);

  // Clear error handler
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Set error handler
  const setErrorHandler = useCallback((errorMessage: string) => {
    setError(errorMessage);
  }, []);

  // Update entity with optimistic updates and error handling
  const updateEntity = useCallback(async (updatedData: T, optimistic: boolean = true) => {
    console.log('🔥 useFirebaseSheet: updateEntity called', {
      userId,
      entityId,
      isOwner,
      collection,
      hasUpdatedData: !!updatedData,
      updatedDataKeys: updatedData ? Object.keys(updatedData) : []
    });

    if (!userId || !entityId || !isOwner) {
      console.error('🔥 useFirebaseSheet: Unauthorized access attempt', {
        userId,
        entityId,
        isOwner
      });
      return;
    }

    const previousData = data;
    setIsUpdating(true);
    console.log('🔥 useFirebaseSheet: Starting update process');

    try {
      // Optimistic update
      if (optimistic) {
        console.log('🔥 useFirebaseSheet: Applying optimistic update');
        setData(updatedData);
      }
      
      // Clear any existing errors
      if (error) {
        setError(null);
      }

      // Update Firebase
      const entityRef = doc(
        db,
        FIREBASE_COLLECTIONS.USERS,
        userId,
        FIREBASE_COLLECTIONS[collection],
        entityId
      );

      console.log('🔥 useFirebaseSheet: Firebase document path:', {
        users: FIREBASE_COLLECTIONS.USERS,
        userId,
        collection: FIREBASE_COLLECTIONS[collection],
        entityId,
        fullPath: `${FIREBASE_COLLECTIONS.USERS}/${userId}/${FIREBASE_COLLECTIONS[collection]}/${entityId}`
      });

      // Create a clean object without the id field for Firebase
      const cleanData = { ...updatedData };
      if ("id" in cleanData) {
        delete cleanData["id"];
      }

      console.log('🔥 useFirebaseSheet: About to save to Firebase:', {
        cleanDataKeys: Object.keys(cleanData),
        level: cleanData['level'],
        hpMax: cleanData['hp']?.['max'],
        hpCurrent: cleanData['hp']?.['current']
      });

      await updateDoc(entityRef, cleanData);
      console.log('🔥 useFirebaseSheet: Firebase save successful!');
    } catch (err) {
      console.error(`🔥 useFirebaseSheet: Error updating ${collection}:`, err);
      console.error('🔥 useFirebaseSheet: Full error details:', {
        errorMessage: err instanceof Error ? err.message : 'Unknown error',
        errorCode: (err as { code?: string })?.code,
        errorDetails: (err as { details?: unknown })?.details
      });
      
      // Revert to previous state on error
      if (optimistic && previousData) {
        console.log('🔥 useFirebaseSheet: Reverting to previous state');
        setData(previousData);
      }
      
      // Show user feedback
      setError(`Failed to update ${collection}. Please try again.`);
      
      // Clear error after delay
      setTimeout(() => {
        setError(null);
      }, 5000);
    } finally {
      setIsUpdating(false);
      console.log('🔥 useFirebaseSheet: Update process completed');
    }
  }, [userId, entityId, isOwner, data, error, collection]);

  // Load entity data
  useEffect(() => {
    const loadEntity = async () => {
      if (!userId || !entityId) {
        setError("Invalid URL parameters");
        setLoading(false);
        return;
      }

      try {
        const entityRef = doc(
          db,
          FIREBASE_COLLECTIONS.USERS,
          userId,
          FIREBASE_COLLECTIONS[collection],
          entityId
        );
        const entitySnap = await getDoc(entityRef);

        if (entitySnap.exists()) {
          const entityData = {
            id: entitySnap.id,
            ...entitySnap.data(),
          } as T & { id: string };
          setData(entityData);
        } else {
          setError(`${collection.slice(0, -1).charAt(0).toUpperCase() + collection.slice(1, -1)} not found`);
        }
      } catch (err) {
        console.error(`Error loading ${collection}:`, err);
        setError(`Failed to load ${collection.slice(0, -1)}`);
      } finally {
        setLoading(false);
      }
    };

    loadEntity();
  }, [userId, entityId, collection]);

  return {
    data,
    loading,
    error,
    isOwner,
    isUpdating,
    updateEntity,
    clearError,
    setError: setErrorHandler,
  };
}