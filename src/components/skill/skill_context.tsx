import { createContext } from "react";
import { SkillCategorySummary, SkillService, StringSkillMap } from "../../services/skill_service";
import { useQuery } from "@tanstack/react-query";
import { Stack, Loader, Text, Alert } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";

export type SkillContextState = {
  categories: SkillCategorySummary[],
  strings: StringSkillMap,
};

export const SkillContext = createContext<SkillContextState>({
  categories: [],
  strings: {},
});

export const SkillContextProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    isLoading,
    error,
    data,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: SkillService.getSkillBootstrap,
  });

  if (isLoading) {
    return (
      <Stack px="xs" align="center">
        <Loader />
        <Text>Loading skills</Text>
      </Stack>
    );
  }

  if (error != null) {
    return (
      <Alert icon={<IconAlertCircle />} color="red">
        {`An error occurred while loading skills. Error: ${error.message}`}
      </Alert>
    );
  }

  if (data == null) {
    return (
      <Alert icon={<IconAlertCircle />} color="red">
        No skills found.
      </Alert>
    );
  }

  return (
    <SkillContext.Provider value={data}>
      {children}
    </SkillContext.Provider>
  );
};