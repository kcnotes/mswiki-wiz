import { ActionIcon, Breadcrumbs, Flex, Text } from "@mantine/core";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { useRouter } from "@tanstack/react-router";
import { CustomAnchor } from "../base/link";

export type Crumb = {
  path: string,
  label: string,
};

export const Topbar = ({ crumbs }: { crumbs: Crumb[] }) => {
  const router = useRouter();
  const back = () => router.history.back();
  const forward = () => router.history.forward();
  
  return (
    <Flex gap="xs" align="center">
      <Flex gap="0">
        <ActionIcon variant="subtle" onClick={back}>
          <IconArrowLeft />
        </ActionIcon>
        <ActionIcon variant="subtle" onClick={forward}>
          <IconArrowRight />
        </ActionIcon>
      </Flex>
      <Breadcrumbs>
        {crumbs.map(({ path, label }) => (
          <CustomAnchor href={path} key={path}>
            <Text size="sm">{label}</Text>
          </CustomAnchor>
        ))}
      </Breadcrumbs>
    </Flex>
  );
};
