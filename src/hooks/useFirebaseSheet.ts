import { useEffect, useState, useMemo, useCallback } from "react";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FIREBASE_COLLECTIONS } from "@/constants";
import { useAuth } from "@/hooks";
import { useLoadingState } from "@/hooks";
import { logger } from "@/utils";
import {
  processCharacterData,
  isLegacyCharacter,
} from "@/services/characterMigration";

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
  const { loading, setLoading } = useLoadingState({ initialState: true });
  const { loading: isUpdating, withLoading: withUpdating } = useLoadingState();
  const [error, setError] = useState<string | null>(null);
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
  const updateEntity = useCallback(
    async (updatedData: T, optimistic: boolean = true) => {
      if (!userId || !entityId || !isOwner) {
        logger.error("useFirebaseSheet: Unauthorized access attempt", {
          userId,
          entityId,
          isOwner,
        });
        return;
      }

      const previousData = data;

      try {
        await withUpdating(async () => {
          // Optimistic update
          if (optimistic) {
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

          // Create a clean object without the id field for Firebase
          const cleanData = { ...updatedData };
          if ("id" in cleanData) {
            delete cleanData["id"];
          }

          await updateDoc(entityRef, cleanData);
        });
      } catch (err) {
        logger.error(`useFirebaseSheet: Error updating ${collection}:`, err);

        // Revert to previous state on error
        if (optimistic && previousData) {
          setData(previousData);
        }

        // Show user feedback
        setError(`Failed to update ${collection}. Please try again.`);

        // Clear error after delay
        setTimeout(() => {
          setError(null);
        }, 5000);
      }
    },
    [userId, entityId, isOwner, data, error, collection, withUpdating]
  );

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
          let entityData = {
            id: entitySnap.id,
            ...entitySnap.data(),
          } as T & { id: string };

          // Apply character migration if this is a character
          if (collection === "CHARACTERS") {
            const rawData = entitySnap.data();
            const wasLegacy = isLegacyCharacter(rawData);

            if (wasLegacy) {
              logger.debug(
                `Migrating legacy character in useFirebaseSheet: ${
                  rawData["name"] || "Unknown"
                }`
              );
              const migratedData = processCharacterData(rawData);

              entityData = {
                id: entitySnap.id,
                ...migratedData,
              } as T & { id: string };

              // Persist the migrated data back to Firebase
              try {
                await setDoc(entityRef, migratedData);
                logger.info(
                  `Successfully persisted migration for character ${entitySnap.id}`
                );
              } catch (migrationError) {
                logger.error(
                  `Failed to persist migration for character ${entitySnap.id}:`,
                  migrationError
                );
                // Continue with migrated data even if persistence fails
              }
            }
          }

          setData(entityData);
        } else {
          setError(
            `${
              collection.slice(0, -1).charAt(0).toUpperCase() +
              collection.slice(1, -1)
            } not found`
          );
        }
      } catch (err) {
        logger.error(`Error loading ${collection}:`, err);
        setError(`Failed to load ${collection.slice(0, -1)}`);
      } finally {
        setLoading(false);
      }
    };

    loadEntity();
  }, [userId, entityId, collection, setLoading]);

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
