import React from "react";
import { QuestCategory, QuestService } from "../../services/quest_service";
import { useQuery } from "@tanstack/react-query";
import { guessCategoryNames, QuestWithCategory } from "./quest_util";
import { Stack, Loader, Text, Alert } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";

export type QuestContextState = {
  quests: QuestWithCategory[],
  questCategories: QuestCategory[],
}

// Global state, loaded once on quest page visit
export const QuestContext = React.createContext<QuestContextState>({
  quests: [],
  questCategories: [],
});

export const QuestContextProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    isLoading,
    error,
    data: quests,
  } = useQuery({
    queryKey: ["quests"],
    queryFn: QuestService.getQuestSummaries,
  });
  const {
    isLoading: isLoadingCategories,
    error: errorCategories,
    data: questCategories,
  } = useQuery({
    queryKey: ['questCategories'],
    queryFn: QuestService.getQuestCategories,
  });
  const questsWithCategories = guessCategoryNames(quests || [], questCategories || []);



  if (isLoading || isLoadingCategories) {
    return (
      <Stack px="xs" align="center">
        <Loader />
        <Text>Loading all quests and categories (~30 seconds)</Text>
      </Stack>
    );
  }

  if (error != null || errorCategories != null) {
    return (
      <Alert icon={<IconAlertCircle />} color="red">
        {`An error occurred while loading quests. Error: ${error?.message ?? errorCategories?.message}`}
      </Alert>
    );
  }
  

  if (quests == null || quests.length === 0 || questCategories == null || questCategories.length === 0) {
    return (
      <Alert icon={<IconAlertCircle />} color="red">
        No quests and/or quest categories found.
      </Alert>
    );
  }
  
  return (
    <QuestContext.Provider
      value={{
        quests: questsWithCategories,
        questCategories,
      }}
    >
      {children}
    </QuestContext.Provider>
  );
};